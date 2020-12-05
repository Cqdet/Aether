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

export default class Guild extends Base {
	public name: string;
	public icon: string;
	public ownerID: string;
	public memberCount: number;
	public subscriptionCount: number;
	public channels: Collection<GuildChannel>;
	public roles: Collection<Role>;
	public members: Collection<Member>;
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

	public get iconURL(): string {
		return (
			CDN_URL +
			Endpoints.GUILD_ICON(this.id, this.icon) +
			'.png' +
			'?size=' +
			512
		);
	}

	public async createChannel(
		id: string,
		o: ChannelOptions
	): Promise<GuildChannel> {
		return new GuildChannel(
			await this.client.rest.request('POST', Endpoints.CHANNEL(id), {
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

	public async deleteChannel(id: string): Promise<GuildChannel> {
		return new GuildChannel(
			await this.client.rest.request('DELETE', Endpoints.CHANNEL(id)),
			this,
			this.client
		);
	}

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

	public async deleteRole(id: string): Promise<void> {
		return await this.client.rest.request(
			'DELETE',
			Endpoints.GUILD_ROLE(this.id, id)
		);
	}

	public async editMember(id: string, o: MemberOptions): Promise<void> {
		return await this.client.rest.request(
			'PATCH',
			Endpoints.GUILD_MEMBER(this.id, id)
		);
	}

	public async addMemberRole(
		memberID: string,
		roleID: string
	): Promise<void> {
		return await this.client.rest.request(
			'PUT',
			Endpoints.GUILD_MEMBER_ROLE(this.id, memberID, roleID)
		);
	}

	public async removeMemberRole(
		memberID: string,
		roleID: string
	): Promise<void> {
		return await this.client.rest.request(
			'DELETE',
			Endpoints.GUILD_MEMBER_ROLE(this.id, memberID, roleID)
		);
	}

	public async kickMember(id: string): Promise<void> {
		return await this.client.rest.request(
			'DELETE',
			Endpoints.GUILD_MEMBER(this.id, id)
		);
	}

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

	public async unbanMember(id: string): Promise<void> {
		return await this.client.rest.request(
			'DELETE',
			Endpoints.GUILD_BAN(this.id, id)
		);
	}
}
