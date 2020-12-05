import {
	MongoClient,
	Client as PostgresClient,
	ConnectOptions,
} from '../../deps.ts';
import Logger from '../util/Logger.ts';

export type Flavor = 'mongo' | 'postgres';

export interface DatabaseOptions {
	hostname?: string;
	user?: string;
	password?: string;
	database?: string;
	uri?: string;
}

export default class ORM {
	public type: Flavor;

	private client: MongoClient | PostgresClient;

	private logger: Logger;

	public constructor(type: Flavor, opt: DatabaseOptions) {
		this.type = type;
		this.logger = new Logger('DATABASE');

		if (type === 'postgres') {
			const { hostname, user, password, database } = opt;
			if (!hostname && !user && !password && !database) {
				this.logger.error('Missing database option for postgres');
				Deno.exit(1);
			}
			this.client = new PostgresClient({
				hostname: opt.hostname,
				user: opt.user,
				password: opt.password,
				database: opt.database,
			});
		} else {
			const { uri, database } = opt;
			if (!uri && !database) {
				this.logger.error('Missing database option for mongo');
				Deno.exit(1);
			}
			this.client = new MongoClient();
		}
	}

	public async connect(opt?: ConnectOptions): Promise<void> {
		if (this.client instanceof PostgresClient) {
			return await this.client.connect();
		} else {
			if (!opt) {
				this.logger.error('Missing database connect options for mongo');
				Deno.exit(1);
			}
			return await this.client.connect(opt);
		}
	}

	public asSQL(): PostgresClient {
		return this.client as PostgresClient;
	}

	public asMongo(): MongoClient {
		return this.client as MongoClient;
	}
}
