import { CategoryChannel, TextChannel, VoiceChannel } from '../../../mod.ts';
import Client from '../../Client.ts';
import { CDN_URL, Endpoints } from '../../network/Endpoints.ts';
import Collection from '../../util/Collection.ts';
import Base from '../Base.ts';
import GuildChannel from '../channels/GuildChannel.ts';
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
}
