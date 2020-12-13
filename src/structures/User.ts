import Client from '../Client.ts';
import { MessageContent, MessageEmbed } from '../constants/Constants.ts';
import { CDN_URL, Endpoints, REST_URL } from '../network/Endpoints.ts';
import Base from './Base.ts';
import TextChannel from './channels/TextChannel.ts';
import Message from './Message.ts';

/**
 * @class User
 * @extends Base
 * A user object (non-bot)
 */

export default class User extends Base {
	/** Username of the user */
	public username: string;
	/** Discriminator of the user */
	public discriminator: string;
	/** Avatar hash of the user */
	public avatar: string;
	/** Whether the user is a bot */
	public bot: boolean;
	/** Whether the user is a system (Discord) */
	public system: boolean;
	/** Whether the user has MFA enabled */
	public mfaEnabled: boolean;
	/** Locale of the user */
	public locale: string;

	public constructor(data: any, client: Client) {
		super(data.id, client);
		this.username = data.username;
		this.discriminator = data.discriminator;
		this.avatar = data.avatar;
		this.bot = !!data.bot;
		this.system = !!data.system;
		this.mfaEnabled = !!data.mfa_enabled;
		this.locale = data.locale;
	}

	/**
	 * Getter to get the complete tag of the user
	 * @returns string
	 */
	public get tag(): string {
		return this.username + '#' + this.discriminator;
	}

	/**
	 * Getter to get the avatar URL of the user
	 * @returns string
	 */
	public get avatarURL(): string {
		return (
			CDN_URL +
			Endpoints.USER_AVATAR(this.id, this.avatar) +
			'.png' +
			'?size=' +
			512
		);
	}

	/**
	 * Method to DM the user
	 * @param content Content of the message
	 * @returns Promise<Message>
	 */
	public async send(
		content: MessageContent | string | MessageEmbed
	): Promise<Message> {
		const ch: TextChannel = new TextChannel( // I will make a PrivateChannel later
			await this.client.rest.request('POST', '/users/@me/channels', {
				recipient_id: this.id,
			}),
			this.client.shard.emptyGuild,
			this.client
		);
		return await ch.send(content);
	}
}
