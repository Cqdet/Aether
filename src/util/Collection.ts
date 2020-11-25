/**
 * A simple data class to hold class-based data
 * @from https://github.com/abalabahaha/eris/blob/master/lib/util/Collection.js
 */
export default class Collection<V> extends Map<string, V> {
	private base: Function;
	private limit: number;

	public constructor(base: Function, limit: number = Infinity) {
		super();
		this.base = base;
		this.limit = limit;
	}

	public add(obj: V, ...params: any[]): V {
		if (this.size === this.limit) return obj; // I will fix this
		const struct: V =
			// @ts-ignore
			obj instanceof this.base ? obj : new this.base(obj, ...params);
		// @ts-ignore
		if (!struct.id) {
			throw 'No Object ID';
		}

		// @ts-ignore
		this.set(struct.id, struct);
		return struct;
	}

	public remove(obj: V): V {
		// @ts-ignore
		const item = this.get(obj.id);
		if (!item) {
			return obj;
		}
		// @ts-ignore
		this.delete(obj.id);
		return item;
	}

	public find(fn: (arg: V) => boolean): V | undefined {
		for (const item of this.values()) {
			if (fn(item)) {
				return item;
			}
		}
		return undefined;
	}

	public filter(fn: (arg: V) => boolean): V[] {
		const arr: V[] = [];
		for (const item of this.values()) {
			if (fn(item)) {
				arr.push(item);
			}
		}
		return arr;
	}

	public map(func: (arg: V) => any): V[] {
		const arr: V[] = [];
		for (const item of this.values()) {
			arr.push(func(item));
		}
		return arr;
	}

	public some(fn: (arg: V) => boolean): boolean {
		for (const item of this.values()) {
			if (fn(item)) {
				return true;
			}
		}
		return false;
	}

	public every(fn: (arg: V) => boolean) {
		for (const item of this.values()) {
			if (fn(item)) {
				return false;
			}
		}
		return true;
	}

	public reduce(fn: (...args: any[]) => any, initialValue: number) {
		const iter = this.values();
		let val: number;
		let result =
			initialValue === undefined ? iter.next().value : initialValue;
		while ((val = iter.next().value) !== undefined) {
			result = fn(result, val);
		}
		return result;
	}

	public random() {
		const index = Math.floor(Math.random() * this.size);
		const iter = this.values();
		for (let i = 0; i < index; ++i) {
			iter.next();
		}
		return iter.next().value;
	}

	public toString() {
		return `[Collection<${this.base.name}>]`;
	}

	public toArray() {
		return [...this.values()];
	}

	public toJSON() {
		const json: any = {};
		for (const item of this.values()) {
			// @ts-ignore
			json[item.id] = item;
		}
		return json;
	}
}

class Base {
	public id = '123';
	public content: string;

	constructor(data: any) {
		this.content = data.content;
	}
}

const col = new Collection(Base);
