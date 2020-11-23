import Client from '../Client.ts';
import { CDN_URL, Endpoints } from '../network/Endpoints.ts';
import Base from './Base.ts';

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
}
