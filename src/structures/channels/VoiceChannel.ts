import Client from '../../Client.ts';
import Guild from '../guild/Guild.ts';
import GuildChannel from './GuildChannel.ts';

export default class VoiceChannel extends GuildChannel {
	public bitrate: number;
	public userLimit: number;

	constructor(data: any, guild: Guild, client: Client) {
		super(data, guild, client);
		this.bitrate = data.bitrate;
		this.userLimit = data.user_limit;
	}
}
