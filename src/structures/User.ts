import Client from '../Client.ts';
import { MessageContent, MessageEmbed } from '../constants/Constants.ts';
import { CDN_URL, Endpoints, REST_URL } from '../network/Endpoints.ts';
import Base from './Base.ts';
import TextChannel from './channels/TextChannel.ts';

export default class User extends Base {
	public username: string;
	public discriminator: string;
	public avatar: string;
	public bot: boolean;
	public system: boolean;
	public mfaEnabled: boolean;
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

	public get tag(): string {
		return this.username + '#' + this.discriminator;
	}

	public get avatarURL(): string {
		return (
			CDN_URL +
			Endpoints.USER_AVATAR(this.id, this.avatar) +
			'.png' +
			'?size=' +
			512
		);
	}

	public async send(content: MessageContent | string | MessageEmbed) {
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
