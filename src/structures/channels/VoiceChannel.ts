import Client from '../../Client.ts';
import Guild from '../guild/Guild.ts';
import GuildChannel from './GuildChannel.ts';

/**
 * @class CategoryChannel
 * @extends GuildChannel
 * A type of guild-based channel that allows voice calls
 */

export default class VoiceChannel extends GuildChannel {
	/** Bitrate of the voice channel */
	public bitrate: number;
	/** User limit of the voice channel */
	public userLimit: number;

	constructor(data: any, guild: Guild, client: Client) {
		super(data, guild, client);
		this.bitrate = data.bitrate;
		this.userLimit = data.user_limit;
	}
}
