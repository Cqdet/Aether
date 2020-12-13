import { Client } from 'https://deno.land/x/postgres/client.ts';

export default class Structure {
	public name: string;
	protected client?: Client;

	public constructor(name: string, client?: Client) {
		this.name = name;
		if (this.client) {
			this.client = client;
		}
	}
}
