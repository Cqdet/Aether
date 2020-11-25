import Client from '../Client.ts';

export default class Base {
	public id: string;
	protected client: Client;

	public constructor(id: string, client: Client) {
		this.client = client;
		this.id = id;
	}

	public get createdAt() {
		return Math.floor(parseInt(this.id) / 4194304) + 1420070400000;
	}

	public toString(): string {
		return '[' + this.constructor.name + ' ' + this.id + ']';
	}
}
