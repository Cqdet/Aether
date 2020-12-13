import { EventEmitter, GenericFunction, WrappedFunction } from '../deps.ts';
import { DefaultIntents, Intents } from './constants/Intents.ts';
import Shard from './network/gateway/Shard.ts';
import REST from './network/rest/REST.ts';
import ORM, { DatabaseOptions, Flavor } from './orm/ORM.ts';
import PluginRegistry from './plugin/PluginRegistry.ts';
import Channel from './structures/channels/Channel.ts';
import Guild from './structures/guild/Guild.ts';
import User from './structures/User.ts';
import Collection from './util/Collection.ts';
import Logger from './util/Logger.ts';
import SecureDataStore from './util/SecureDataStore.ts';

export interface ClientOptions {
	intents?: (keyof typeof Intents)[] | number;
	allowedEvents?: ClientEvents[];
	cache?: {
		guilds?: CacheOptions;
		channels?: CacheOptions;
		users?: CacheOptions;
		messages?: CacheOptions;
	};

	db?: {
		use: boolean;
		type: Flavor;
		opt: DatabaseOptions;
	};
	gateway?: {
		compress?: boolean;
		etf?: boolean;
	};

	debug?: boolean;
	usePlugins?: boolean;
}

export interface CacheOptions {
	$enabled: true;
	$max: number;
}

export type ClientEvents =
	| 'rateLimit'
	| 'ready'
	| 'guildCreate'
	| 'guildDelete'
	| 'guildUpdate'
	| 'guildUnavailable'
	| 'guildAvailable'
	| 'guildMemberAdd'
	| 'guildMemberRemove'
	| 'guildMemberUpdate'
	| 'guildMemberAvailable'
	| 'guildMemberSpeaking'
	| 'guildMembersChunk'
	| 'guildIntegrationsUpdate'
	| 'roleCreate'
	| 'roleDelete'
	| 'inviteCreate'
	| 'inviteDelete'
	| 'roleUpdate'
	| 'emojiCreate'
	| 'emojiDelete'
	| 'emojiUpdate'
	| 'guildBanAdd'
	| 'guildBanRemove'
	| 'channelCreate'
	| 'channelDelete'
	| 'channelUpdate'
	| 'channelPinsUpdate'
	| 'messageCreate'
	| 'messageDelete'
	| 'messageUpdate'
	| 'messageDeleteBulk'
	| 'messageReactionAdd'
	| 'messageReactionRemove'
	| 'messageReactionRemoveAll'
	| 'messageReactionRemoveEmoji'
	| 'userUpdate'
	| 'presenceUpdate'
	| 'voiceServerUpdate'
	| 'voiceStateUpdate'
	| 'subscribe'
	| 'unsubscribe'
	| 'typingStart'
	| 'typingStop'
	| 'webhookUpdate'
	| 'error'
	| 'warn'
	| 'unknown'
	| 'debug'
	| 'invalidated'
	| 'raw';

export default class Client extends EventEmitter {
	public user!: User;
	public secureDataStore: SecureDataStore;
	public shard: Shard;
	public rest: REST;

	public orm?: ORM;
	public plugins?: PluginRegistry;

	public guilds: Collection<Guild>;
	public channels: Collection<Channel>;
	public users: Collection<User>;

	public options: ClientOptions;

	private logger: Logger;

	public constructor(token: string, options: ClientOptions) {
		super();
		this.options = options;
		if (this.options.debug) Logger.DEBUG = true;
		this.logger = new Logger('CLIENT');
		this.logger.debug('Intializing client...');

		this.secureDataStore = new SecureDataStore();
		this.shard = new Shard(this);
		this.rest = new REST(this);

		if (this.options.db?.use) {
			this.orm = new ORM(this.options.db.type, this.options.db.opt);
		}

		if (this.options.usePlugins) {
			this.plugins = new PluginRegistry();
		}

		this.guilds = new Collection(Guild);
		this.channels = new Collection(Channel);
		this.users = new Collection(User);

		this.logger.debug('Secured token in data store');
		this.secureDataStore.set('TOKEN', token);
	}

	public connect() {
		this.logger.debug('Authenticating to the gateway...');
		this.shard.connect(
			this.secureDataStore.get('TOKEN') || '',
			this.parseIntents(this.options.intents || DefaultIntents)
		);
		this.logger.success('Successfully authenticated to the gateway');
	}

	public on(ev: ClientEvents, fn: GenericFunction | WrappedFunction) {
		this.logger.debug(`Listened Event: ${ev}`);
		return super.on(ev, fn);
	}

	public emit(ev: ClientEvents, ...args: any[]): boolean {
		// this.logger.debug(`Emitted Event: [${ev.toUpperCase()}]`);
		if (!this.options.allowedEvents?.includes(ev)) return false;
		return super.emit(ev, ...args);
	}

	public useORM(type: Flavor, opt: DatabaseOptions): ORM {
		return (this.orm = new ORM(type, opt));
	}

	public usePlugins(): PluginRegistry {
		return (this.plugins = new PluginRegistry());
	}

	private parseIntents(intents: (keyof typeof Intents)[] | number): number {
		// FROM ERIS: https://github.com/abalabahaha/eris/blob/72859c9aaf8e7349e06879f2266c8b6885de4720/lib/Client.js#L164-L180
		if (Array.isArray(this.options.intents)) {
			let bitmask = 0;
			for (const intent of this.options.intents) {
				if (Intents[intent]) {
					bitmask |= Intents[intent];
				}
			}
			return bitmask;
		} else {
			return intents as number;
		}
	}
}
