import { EventEmitter, GenericFunction, WrappedFunction } from '../deps.ts';
import { Intents } from './constants/Intents.ts';
import Shard from './network/gateway/Shard.ts';
import REST from './network/rest/REST.ts';
import Channel from './structures/channels/Channel.ts';
import Guild from './structures/guild/Guild.ts';
import User from './structures/User.ts';
import Collection from './util/Collection.ts';
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
	| 'debug'
	| 'invalidated'
	| 'raw';

export default class Client extends EventEmitter {
	public user!: User;
	public secureDataStore: SecureDataStore;
	public shard: Shard;
	public rest: REST;

	public guilds: Collection<Guild>;
	public channels: Collection<Channel>;
	public users: Collection<User>;

	private options: ClientOptions;

	public constructor(token: string, options: ClientOptions) {
		super();
		this.options = options;

		this.secureDataStore = new SecureDataStore();
		this.shard = new Shard(this);
		this.rest = new REST(this);

		this.guilds = new Collection(Guild);
		this.channels = new Collection(Channel);
		this.users = new Collection(User);

		this.secureDataStore.set('TOKEN', token);
	}

	public connect() {
		this.shard.connect(this.secureDataStore.get('TOKEN') || '');
	}

	public on(ev: ClientEvents, fn: GenericFunction | WrappedFunction) {
		return super.on(ev, fn);
	}
}
