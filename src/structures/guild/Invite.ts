import Client from '../../Client.ts';
import Base from '../Base.ts';
import GuildChannel from '../channels/GuildChannel.ts';
import User from '../User.ts';
import Guild from './Guild.ts';

/**
 * @class Invite
 * @extends Base
 * A guild invite object
 */

export default class Invite extends Base {
	/** Code of the invite */
	public code: string;
	/** Guild of the invite */
	public guild: Guild;
	/** Channel of the invite */
	public channel: GuildChannel;
	/** User who created the invited */
	public inviter: User;

	public constructor(data: any, client: Client) {
		super(data.code, client);
		this.code = data.code;
		this.guild = new Guild(data.guild, client);
		this.channel = data.channel;
		this.inviter = new User(data.inviter, client);
	}
}
