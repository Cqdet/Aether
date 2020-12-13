import Client from '../../Client.ts';
import Guild from '../guild/Guild.ts';
import ChannelOptions from '../options/ChannelOptions.ts';
import PermissionOverwite from '../permissions/PermissionOverwrite.ts';
import Channel from './Channel.ts';

/**
 * @class GuildChannel
 * Base, extensible, channel object for guild-based channels
 */

export default class GuildChannel extends Channel {
	/** Guild of the guild-based channel */
	public guild: Guild;
	/** Name of the guild-based channel */
	public name: string;
	/** Numeric type of the guild-based channel */
	public type: number;
	/** Whether the guild-based channel has NSFW toggled */
	public nsfw: boolean;
	/** Numeric position of the guild-based channel */
	public position: number;
	/** Parent ID of a non-category-based guild-based channel */
	public parentID?: string;
	/** Permission overwrites for a guild-based channel (member or role) */
	public permissionOverwrites: PermissionOverwite[];

	constructor(data: any, guild: Guild, client: Client) {
		super(data, client);
		this.guild = guild;
		this.name = data.name;
		this.type = data.type;
		this.nsfw = data.nsfw;
		this.position = data.position;
		this.parentID = data.parent_id;
		this.permissionOverwrites = data.permission_overwrites
			? data.permission_overwrites.map(
					(p: any) => new PermissionOverwite(p)
			  )
			: [];
	}

	/**
	 * Method to edit the channel
	 * @param o Channel editting options
	 * @returns Promise<GuildChannel>
	 */
	public async edit(o: ChannelOptions): Promise<GuildChannel> {
		return await this.guild.editChannel(this.id, o);
	}

	/**
	 * Method to delete the channel
	 * @returns Promise<GuildChannel>
	 */
	public async delete(): Promise<GuildChannel> {
		return await this.guild.deleteChannel(this.id);
	}
}
