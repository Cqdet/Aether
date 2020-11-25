import Client from '../../Client.ts';
import Logger from '../../util/Logger.ts';
import { REST_URL } from '../Endpoints.ts';

export default class REST {
	private client: Client;
	private logger: Logger;

	public constructor(client: Client) {
		this.client = client;
		this.logger = new Logger('REST');
	}

	public async request(method: string, endpoint: string, body: object = {}) {
		try {
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
			this.logger.debug(`Sending Request: [${method}] ${endpoint}`);
			let res = await fetch(REST_URL + endpoint, {
				method,
				headers,
				body: JSON.stringify(body),
			});
			if (res.status === 200) {
				this.logger.success(
					`Successfully sent request: [${method}] ${endpoint}`
				);

				return (await res.json()) || {};
			} else {
				const json = await res.json();
				if (json.retry_after && !json.global) {
					this.logger.warning(
						`Ratelimited: ${json.retry_after * 1000}ms`
					);
					return new Promise((res) =>
						setTimeout(res, json.retry_after * 1000)
					).then(async () => {
						await this.request(method, endpoint, body);
					});
				}
			}
		} catch (err) {
			this.logger.error(err.message);
		}
	}
}
