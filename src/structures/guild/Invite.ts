import Client from '../../Client.ts';
import Base from '../Base.ts';
import GuildChannel from '../channels/GuildChannel.ts';
import User from '../User.ts';
import Guild from './Guild.ts';

export default class Invite extends Base {
	public code: string;
	public guild: Guild;
	public channel: GuildChannel;
	public inviter: User;

	public constructor(data: any, client: Client) {
		super(data.code, client);
		this.code = data.code;
		this.guild = new Guild(data.guild, client);
		this.channel = data.channel;
		this.inviter = new User(data.inviter, client);
	}
}
