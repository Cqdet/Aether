/**
 * A data structure that can safely house environment variables
 */
export default class SecureDataStore extends Map {
	private salt: number;

	private salt2: number;

	public constructor() {
		super();
		this.salt = Math.random() * 1000000000;
		this.salt2 =
			Math.floor((Math.random() * 1000000) / Math.random()) * 1048039;
	}

	public set(key: string, value: any) {
		let strBuffer = new TextEncoder().encode(value);
		let buffer = new Uint8Array(value.length);

		for (let i = 0; i < buffer.length; i++) {
			buffer[i] = strBuffer[i] + this.salt + (this.salt2 || 0);
		}

		return super.set(key, buffer);
	}

	public get(key: string) {
		let valBuffer: Uint8Array | undefined = super.get(key);
		if (!valBuffer) return;
		let val = new Uint8Array(valBuffer.length);

		for (let i = 0; i < valBuffer.length; i++) {
			val[i] = valBuffer[i] - this.salt - (this.salt2 || 0);
		}

		this.resetSalt();
		return new TextDecoder().decode(val);
	}

	private resetSalt() {
		this.salt = Math.random() * 1000000000;
		this.salt2 =
			Math.floor((Math.random() * 1000000) / Math.random()) * 1048039;
	}
}
