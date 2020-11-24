import Client from '../../Client.ts';
import Base from '../Base.ts';
import Permission from '../permissions/Permission.ts';
import Guild from './Guild.ts';

export default class Role extends Base {
	public guild: Guild;
	public name: string;
	public permissions: Permission;
	public position: number;
	public color: string;
	public hoist: boolean;
	public mentionable: boolean;

	public constructor(data: any, guild: Guild, client: Client) {
		super(data.id, client);
		this.guild = guild;
		this.name = data.name;
		this.permissions = new Permission(data.permissions);
		this.position = data.position;
		this.color = data.color;
		this.hoist = data.hoist;
		this.mentionable = data.mentionable;
	}
}
