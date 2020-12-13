import Client from '../../Client.ts';
import { CDN_URL, Endpoints } from '../../network/Endpoints.ts';
import Collection from '../../util/Collection.ts';
import Base from '../Base.ts';
import CategoryChannel from '../channels/CategoryChannel.ts';
import GuildChannel from '../channels/GuildChannel.ts';
import TextChannel from '../channels/TextChannel.ts';
import VoiceChannel from '../channels/VoiceChannel.ts';
import ChannelOptions from '../options/ChannelOptions.ts';
import MemberOptions from '../options/MemberOptions.ts';
import RoleOptions from '../options/RoleOptions.ts';
import Emoji from './Emoji.ts';
import Member from './Member.ts';
import Role from './Role.ts';

/**
 * @class Guild
 * @extends Base
 * A guild object (aka a Discord Server)
 */

export default class Guild extends Base {
	/** Name of the guild */
	public name: string;
	/** Icon hash of the guild */
	public icon: string;
	/** Owner ID of the guild */
	public ownerID: string;
	/** Member count of the guild */
	public memberCount: number;
	/** Subscription count of the guild */
	public subscriptionCount: number;
	/** Collection of the channels of the guild */
	public channels: Collection<GuildChannel>;
	/** Collection of the roles of the guild */
	public roles: Collection<Role>;
	/** Collection of the members of the guild */
	public members: Collection<Member>;
	/** Collection of the emojis in the guild */
	public emojis: Collection<Emoji>;

	public constructor(data: any, client: Client) {
		super(data.id, client);
		this.name = data.name;
		this.icon = data.icon;
		this.ownerID = data.owner_id;
		this.memberCount = data.member_count;
		this.subscriptionCount = data.subscription_count;

		this.channels = new Collection(GuildChannel);
		this.roles = new Collection(Role);
		this.members = new Collection(Member);
		this.emojis = new Collection(Emoji);
		if (data.channels) {
			for (let channelData of data.channels) {
				let channel: GuildChannel;
				switch (channelData.type) {
					case 0:
						channel = new TextChannel(
							channelData,
							this,
							this.client
						);
						break;
					case 2:
						channel = new VoiceChannel(
							channelData,
							this,
							this.client
						);
						break;
					case 4:
						channel = new CategoryChannel(
							channelData,
							this,
							this.client
						);
						break;
					default:
						channel = new GuildChannel(
							channelData,
							this,
							this.client
						);
				}
				this.channels.add(channel);
			}
		}
		if (data.roles) {
			for (let roleData of data.roles) {
				const role = new Role(roleData, this, client);
				this.roles.add(role);
			}
		}
		if (data.members) {
			for (let memberData of data.members) {
				const member = new Member(memberData, this, client);
				this.members.add(member);
			}
		}
		if (data.emojis) {
			for (let emojiData of data.emojis) {
				const emoji = new Emoji(emojiData);
				this.emojis.add(emoji);
			}
		}
	}

	/**
	 * Getter to get the icon URL of the guild
	 * @returns string
	 */
	public get iconURL(): string {
		return (
			CDN_URL +
			Endpoints.GUILD_ICON(this.id, this.icon) +
			'.png' +
			'?size=' +
			512
		);
	}

	/**
	 * Method to create a channel in the guild
	 * @param o Channel creation options
	 * @returns Promise<GuildChannel>
	 */
	public async createChannel(o: ChannelOptions): Promise<GuildChannel> {
		return new GuildChannel(
			await this.client.rest.request(
				'POST',
				Endpoints.GUILD_CHANNELS(this.id),
				{
					name: o.name,
					type: o.type,
					topic: o.topic,
					bitrate: o.bitrate,
					user_limit: o.userLimit,
					rate_limit_per_user: o.rateLimitPerUser,
					position: o.position,
					permission_overwrites: o.permissionOverwrites,
					parent_id: o.parentID,
					nsfw: o.nsfw,
				}
			),
			this,
			this.client
		);
	}

	/**
	 * Method to edit a channel in the guild
	 * @param o Channel editting options
	 * @returns Promise<GuildChannel>
	 */
	public async editChannel(
		id: string,
		o: ChannelOptions
	): Promise<GuildChannel> {
		return new GuildChannel(
			await this.client.rest.request('PATCH', Endpoints.CHANNEL(id), {
				name: o.name,
				type: o.type,
				topic: o.topic,
				bitrate: o.bitrate,
				user_limit: o.userLimit,
				rate_limit_per_user: o.rateLimitPerUser,
				position: o.position,
				permission_overwrites: o.permissionOverwrites,
				parent_id: o.parentID,
				nsfw: o.nsfw,
			}),
			this,
			this.client
		);
	}

	/**
	 * Method to delete a channel in the guild
	 * @param id ID of the channel
	 * @returns Promise<GuildChannel>
	 */
	public async deleteChannel(id: string): Promise<GuildChannel> {
		return new GuildChannel(
			await this.client.rest.request('DELETE', Endpoints.CHANNEL(id)),
			this,
			this.client
		);
	}

	/**
	 * Method to create a role in the guild
	 * @param o Role creation options
	 * @returns Promise<Role>
	 */
	public async createRole(o: RoleOptions): Promise<Role> {
		return new Role(
			await this.client.rest.request(
				'POST',
				Endpoints.GUILD_ROLES(this.id),
				o
			),
			this,
			this.client
		);
	}

	/**
	 * Method to edit a role in the guild
	 * @param o Role editting options
	 * @returns Promise<Role>
	 */

	public async editRole(id: string, o: RoleOptions): Promise<Role> {
		return new Role(
			await this.client.rest.request(
				'PATCH',
				Endpoints.GUILD_ROLE(this.id, id),
				o
			),
			this,
			this.client
		);
	}

	/**
	 * Method to delete a role in the guild
	 * @param id ID of the channel
	 * @returns Promise<void>
	 */
	public async deleteRole(id: string): Promise<void> {
		return await this.client.rest.request(
			'DELETE',
			Endpoints.GUILD_ROLE(this.id, id)
		);
	}

	/**
	 * Method to edit a member in the guild
	 * @param id ID of the member
	 * @param o Member editting options
	 * @returns Promise<void>
	 */
	public async editMember(id: string, o: MemberOptions): Promise<void> {
		return await this.client.rest.request(
			'PATCH',
			Endpoints.GUILD_MEMBER(this.id, id)
		);
	}

	/**
	 * Method to add a specific role to a specific member in the guild
	 * @param memberID ID of the member
	 * @param roleID ID of the role
	 * @returns Promise<void>
	 */
	public async addMemberRole(
		memberID: string,
		roleID: string
	): Promise<void> {
		return await this.client.rest.request(
			'PUT',
			Endpoints.GUILD_MEMBER_ROLE(this.id, memberID, roleID)
		);
	}

	/**
	 * Method to remove a specific role from a specific member in the guild
	 * @param memberID ID of the member
	 * @param roleID ID of the role
	 * @returns Promise<void>
	 */
	public async removeMemberRole(
		memberID: string,
		roleID: string
	): Promise<void> {
		return await this.client.rest.request(
			'DELETE',
			Endpoints.GUILD_MEMBER_ROLE(this.id, memberID, roleID)
		);
	}

	/**
	 * Method to kick a member from the guild
	 * @param id ID of the member
	 * @returns Promise<void>
	 */
	public async kickMember(id: string): Promise<void> {
		return await this.client.rest.request(
			'DELETE',
			Endpoints.GUILD_MEMBER(this.id, id)
		);
	}

	/**
	 * Method to ban a member from the guild
	 * @param id ID of the member
	 * @param o Ban options
	 * @returns Promise<void>
	 */
	public async banMember(
		id: string,
		o?: {
			reason?: string;
			deleteMessageDays?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
		}
	): Promise<void> {
		return await this.client.rest.request(
			'PUT',
			Endpoints.GUILD_BAN(this.id, id),
			{
				delete_message_days: o?.deleteMessageDays || 0,
				reason: o?.reason,
			}
		);
	}

	/**
	 * Method to unban a member from the guild
	 * @param id ID of the member
	 * @returns Promise<void>
	 */
	public async unbanMember(id: string): Promise<void> {
		return await this.client.rest.request(
			'DELETE',
			Endpoints.GUILD_BAN(this.id, id)
		);
	}
}
