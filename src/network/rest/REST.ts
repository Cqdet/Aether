import Client from '../../Client.ts';
import { REST_URL } from '../Endpoints.ts';

export default class REST {
	private client: Client;

	constructor(client: Client) {
		this.client = client;
	}

	public async request(method: string, endpoint: string, body: object = {}) {
		let headers: any =
			method === 'POST' || method === 'PATCH'
				? {
						Authorization: `Bot ${this.client.secureDataStore.get(
							'TOKEN'
						)}`,
						'User-Agent': 'Aether (Deno, API)',
						'Content-Type': 'application/json',
				  }
				: {
						Authorization: `Bot ${this.client.secureDataStore.get(
							'TOKEN'
						)}`,
						'User-Agent': 'Aether (Deno, API)',
				  };
		let res = await fetch(REST_URL + endpoint, {
			method,
			headers,
			body: JSON.stringify(body),
		});
		if (!res.ok) {
			throw `Failed to ${method}: ${await res.text()}`;
		} else {
			return res.json() || {};
		}
	}
}
