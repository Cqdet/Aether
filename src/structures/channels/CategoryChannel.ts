import Client from '../../Client.ts';
import Guild from '../guild/Guild.ts';
import GuildChannel from './GuildChannel.ts';

/**
 * @class CategoryChannel
 * @extends GuildChannel
 * A type of guild-based channel that holds other guild-based channels
 */

export default class CategoryChannel extends GuildChannel {
	constructor(data: any, guild: Guild, client: Client) {
		super(data, guild, client);
	}

	/**
	 * Children of a CategoryChannel
	 * @returns GuildChannel[]
	 */
	get children(): GuildChannel[] {
		let channels: GuildChannel[] = [];
		if (this.guild && this.guild.channels) {
			for (const channel of this.guild.channels.toArray()) {
				if (channel.parentID === this.id) {
					channels.push(channel);
				}
			}
		}
		return channels;
	}
}
