import Client from '../../Client.ts';
import Base from '../Base.ts';
import RoleOptions from '../options/RoleOptions.ts';
import Permission from '../permissions/Permission.ts';
import Guild from './Guild.ts';

/**
 * @class Role
 * @extends Base
 * A guild role object
 */

export default class Role extends Base {
	/** Guild of the role */
	public guild: Guild;
	/** Name of the role */
	public name: string;
	/** Permission of the role */
	public permissions: Permission;
	/** Numeric position of the role */
	public position: number;
	/** Hex of the role color */
	public color: number;
	/** Whether the role is hoisted */
	public hoist: boolean;
	/** Whether the role is mentionable */
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

	/**
	 * Method to delete the role
	 * @returns Promise<void>
	 */
	public async delete(): Promise<void> {
		return await this.guild.deleteRole(this.id);
	}

	/**
	 * Method to edit a role
	 * @param o Role editting options
	 * @returns Promise<Role>
	 */
	public async edit(o: RoleOptions): Promise<Role> {
		return await this.guild.editRole(this.id, o);
	}
}
