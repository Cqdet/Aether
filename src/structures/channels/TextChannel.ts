import Client from '../../Client.ts';
import Guild from '../guild/Guild.ts';
import GuildChannel from './GuildChannel.ts';

export default class TextChannel extends GuildChannel {
	public topic: string;
	public rateLimitPerUser: number;
	public lastMessageID: string;

	constructor(data: any, guild: Guild, client: Client) {
		super(data, guild, client);
		this.topic = data.topic;
		this.rateLimitPerUser = data.rate_limit_per_user;
		this.lastMessageID = data.last_message_id;
	}
}
