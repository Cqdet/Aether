import { Buffer } from '../../../deps.ts';

// FROM: https://github.com/devsnek/earl
enum Headers {
	FORMAT_VERSION = 131,

	NEW_FLOAT_EXT = 70,
	BIT_BINARY_EXT = 77,
	SMALL_INTEGER_EXT = 97,
	INTEGER_EXT = 98,
	FLOAT_EXT = 99,
	ATOM_EXT = 100,
	REFERENCE_EXT = 101,
	PORT_EXT = 102,
	PID_EXT = 103,
	SMALL_TUPLE_EXT = 104,
	LARGE_TUPLE_EXT = 105,
	NIL_EXT = 106,
	STRING_EXT = 107,
	LIST_EXT = 108,
	BINARY_EXT = 109,
	SMALL_BIG_EXT = 110,
	LARGE_BIG_EXT = 111,
	NEW_FUN_EXT = 112,
	EXPORT_EXT = 113,
	NEW_REFERENCE_EXT = 114,
	SMALL_ATOM_EXT = 115,
	MAP_EXT = 116,
	FUN_EXT = 117,
	COMPRESSED = 80,
}

export class EtfEncoder {
	private buf: Buffer;
	private view: DataView;
	private encoder: TextEncoder;
	private offset: number;

	public constructor() {
		this.buf = new Buffer(2048);
		this.view = new DataView(this.buf.buffer);
		this.encoder = new TextEncoder();
		this.buf[0] = Headers.FORMAT_VERSION;
		this.offset = 1;
	}

	public pack(val: any) {
		if (val === null || val === undefined) {
			this.appendAtom('nil');
			return;
		}

		if (typeof val === 'boolean') {
			this.appendAtom(val ? 'true' : 'false');
			return;
		}

		if (typeof val === 'number') {
			if ((val | 0) === val) {
				if (val > -128 && val < 128) {
					this.writeUInt8(Headers.SMALL_INTEGER_EXT);
					this.writeUInt8(val);
				} else {
					this.writeUInt8(Headers.INTEGER_EXT);
					this.writeUInt32(val);
				}
			} else {
				this.writeUInt8(Headers.NEW_FLOAT_EXT);
				this.writeFloat64(val);
			}
			return;
		}

		if (typeof val === 'bigint') {
			this.writeUInt8(Headers.LARGE_BIG_EXT);

			const byteCountIndex = this.offset;
			this.offset += 4;

			this.writeUInt8(val < 0n ? 1 : 0);

			let ull = val < 0n ? -val : val;
			let byteCount = 0;
			while (ull > 0) {
				byteCount += 1;
				this.writeUInt8(Number(ull & 0xffn));
				ull >>= 8n;
			}

			this.view.setUint32(byteCountIndex, byteCount);
			return;
		}

		if (typeof val === 'string') {
			this.writeUInt8(Headers.BINARY_EXT);
			const a = this.encoder.encode(val);
			this.writeUInt32(a.length);
			this.write(a);
			return;
		}

		if (Array.isArray(val)) {
			const { length } = val;

			if (length === 0) {
				this.writeUInt8(Headers.NIL_EXT);
				return;
			}

			this.writeUInt8(Headers.LIST_EXT);
			this.writeUInt32(length);

			val.forEach((v) => {
				this.pack(v);
			});

			this.writeUInt8(Headers.NIL_EXT);
			return;
		}

		if (typeof val === 'object') {
			this.writeUInt8(Headers.MAP_EXT);

			const properties = Object.keys(val);

			this.writeUInt32(properties.length);

			properties.forEach((p) => {
				this.pack(p);
				this.pack(val[p]);
			});

			return;
		}

		throw new Error('could not pack val');
	}

	private grow(len: number) {
		if (this.offset + len < this.buf.length) {
			return;
		}
		const chunks = Math.ceil(len / 2048) * 2048;
		const old = this.buf;
		this.buf = new Buffer(old.length + chunks);
		this.buf.set(old);
		this.view = new DataView(this.buf.buffer);
	}

	private write(val: Uint8Array) {
		this.grow(val.length);
		this.buf.set(val, this.offset);
		this.offset += val.length;
	}

	private writeUInt8(val: number) {
		this.grow(1);
		this.view.setUint8(this.offset, val);
		this.offset += 1;
	}

	private writeUInt16(val: number) {
		this.grow(2);
		this.view.setUint16(this.offset, val);
		this.offset += 2;
	}

	private writeUInt32(val: number) {
		this.grow(4);
		this.view.setUint32(this.offset, val);
		this.offset += 4;
	}

	private writeFloat64(val: number) {
		this.grow(8);
		this.view.setFloat64(this.offset, val);
		this.offset += 8;
	}

	private appendAtom(atom: string) {
		const a = this.encoder.encode(atom);
		if (a.length < 255) {
			this.writeUInt8(Headers.SMALL_ATOM_EXT);
			this.writeUInt8(a.length);
		} else {
			this.writeUInt8(Headers.ATOM_EXT);
			this.writeUInt16(a.length);
		}
		this.write(a);
	}
}

export class EtfDecoder {
	private buf: Uint8Array;
	private view: DataView;
	private decoder: TextDecoder;
	private offset: number;

	public constructor(buf: Uint8Array) {
		this.buf = buf;
		this.view = new DataView(this.buf.buffer);
		this.decoder = new TextDecoder();
		this.offset = 0;

		const v = this;
	}

	public unpack(): any {
		const type = this.readInt8();
		switch (type) {
			case Headers.SMALL_INTEGER_EXT:
				return this.readInt8();
			case Headers.INTEGER_EXT:
				return this.readInt32();
			case Headers.FLOAT_EXT:
				return Number.parseFloat(this.readString(31));
			case Headers.NEW_FLOAT_EXT:
				return this.readFloat64();
			case Headers.ATOM_EXT:
				return this.parseAtom(this.readString(this.readUInt16()));
			case Headers.SMALL_ATOM_EXT:
				return this.parseAtom(this.readString(this.readInt8()));
			case Headers.SMALL_TUPLE_EXT:
				return this.decodeArray(this.readInt8());
			case Headers.LARGE_TUPLE_EXT:
				return this.decodeArray(this.readInt32());
			case Headers.NIL_EXT:
				return [];
			case Headers.STRING_EXT: {
				const length = this.readUInt16();
				const sub = this.buf.subarray(
					this.offset,
					this.offset + length
				);
				this.offset += length;
				return [...sub];
			}
			case Headers.LIST_EXT: {
				const length = this.readInt32();
				const array = this.decodeArray(length);
				if (this.readInt8() !== Headers.NIL_EXT) {
					throw new Error('expected tail marker after list');
				}
				return array;
			}
			case Headers.MAP_EXT: {
				const length = this.readInt32();
				const map: any = {};
				for (let i = 0; i < length; i += 1) {
					map[this.unpack()] = this.unpack();
				}
				return map;
			}
			case Headers.BINARY_EXT: {
				const length = this.readInt32();
				return this.readString(length);
			}
			case Headers.SMALL_BIG_EXT: {
				const digits = this.readInt8();
				return digits >= 7
					? this.decodeBigInt(digits)
					: this.decodeBigNumber(digits);
			}
			case Headers.LARGE_BIG_EXT: {
				const digits = this.readInt32();
				return this.decodeBigInt(digits);
			}
			default:
				throw new Error(`unsupported etf type ${type}`);
		}
	}

	private readUInt8() {
		const val = this.view.getUint8(this.offset);
		this.offset += 1;
		return val;
	}

	private readInt8() {
		const val = this.view.getInt8(this.offset);
		this.offset += 1;
		return val;
	}

	private readUInt16() {
		const val = this.view.getUint16(this.offset);
		this.offset += 2;
		return val;
	}

	private readUInt32() {
		const val = this.view.getUint32(this.offset);
		this.offset += 4;
		return val;
	}

	private readInt32() {
		const val = this.view.getInt32(this.offset);
		this.offset += 4;
		return val;
	}

	private readFloat64() {
		const val = this.view.getFloat64(this.offset);
		this.offset += 8;
		return val;
	}

	private readString(length: number) {
		const sub = this.buf.subarray(this.offset, this.offset + length);
		const str = this.decoder.decode(sub);
		this.offset += length;
		return str;
	}

	private decodeArray(length: number) {
		const array = [];
		for (let i = 0; i < length; i += 1) {
			array.push(this.unpack());
		}
		return array;
	}

	private decodeBigNumber(digits: number) {
		const sign = this.readInt8();

		let value = 0;
		let b = 1;

		for (let i = 0; i < digits; i += 1) {
			const digit = this.readInt8();
			value += digit * b;
			b <<= 8;
		}

		if (digits < 4) {
			if (sign === 0) {
				return value;
			}

			const isSignBitAvailable = (value & (1 << 31)) === 0;
			if (isSignBitAvailable) {
				return -value;
			}
		}

		return sign === 0 ? value : -value;
	}

	private decodeBigInt(digits: number) {
		const sign = this.readInt8();

		let value = 0n;
		let b = 1n;

		for (let i = 0; i < digits; i += 1) {
			const digit = BigInt(this.readInt8());
			value += digit * b;
			b <<= 8n;
		}

		const v = sign === 0 ? value : -value;

		return v;
	}

	private parseAtom(atom: string) {
		if (!atom) {
			return undefined;
		}

		if (atom === 'nil' || atom === 'null') {
			return null;
		}

		if (atom === 'true') {
			return true;
		}

		if (atom === 'false') {
			return false;
		}

		return atom;
	}
}
