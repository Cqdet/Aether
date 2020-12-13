import Base from '../Base.ts';
import Guild from './Guild.ts';
import Role from './Role.ts';
import User from '../User.ts';
import Permission from '../permissions/Permission.ts';
import Permissions from '../permissions/Permissions.ts';
import Client from '../../Client.ts';

/**
 * @class Member
 * @extends Base
 * A guild member object
 */

export default class Member extends Base {
	/** User of the member */
	public user: User;
	/** If the 'me' is an owner */
	public owner: boolean;
	/** Array of role IDs the member has */
	public roles: string[];
	/** Timestamp of how long the member has had Nitro */
	public premiumSince: string;
	/** Guild of the member */
	public guild: Guild;
	/** Nick of the member */
	public nick: string;
	/** Whether the member is muted */
	public mute: boolean;
	/** Timestamp of when the member joined the guild */
	public joinedAt: number | Date;
	/** Hoisted role of the member */
	public hoistedRole: any;
	/** Whether the member is deafened */
	public deaf: boolean;

	public constructor(data: any, guild: Guild, client: Client) {
		super(data.user.id, client);
		this.guild = guild;
		this.user = data.user;
		this.owner = this.guild.ownerID === data.user.id;
		this.roles = data.roles;
		this.premiumSince = data.premium_since;
		this.nick = data.nick;
		this.mute = data.mute;
		this.joinedAt = data.joined_at;
		this.hoistedRole = data.hoisted_role;
		this.deaf = data.deaf;
	}

	/**
	 * Getter to get the permissions of the member
	 * @returns Permission
	 */
	get permissions(): Permission {
		if (this.id === this.guild.ownerID) {
			return new Permission(Permissions.all);
		} else {
			let permissions =
				this.guild.roles.find((r: Role) => r.id === this.guild.id)
					?.permissions.allow || 0;
			for (let role of this.roles) {
				let gRole = this.guild.roles.find((r: Role) => r.id === role);
				if (!gRole) {
					continue;
				}

				const { allow: perm } = gRole.permissions;
				if (perm & Permissions.administrator) {
					permissions = Permissions.all;
					break;
				} else {
					permissions |= perm;
				}
			}
			return new Permission(permissions);
		}
	}

	/**
	 * Method to kick the user from the guild
	 * @returns Promise<void>
	 */
	public async kick(): Promise<void> {
		return await this.guild.kickMember(this.id);
	}

	/**
	 * Method to ban the user from the guild
	 * @param o Ban options
	 * @returns Promise<void>
	 */
	public async ban(o?: {
		reason?: string;
		deleteMessageDays?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
	}): Promise<void> {
		return await this.guild.banMember(this.id, o);
	}

	/**
	 * Method to add a role to the user
	 * @param roleID ID of the role
	 * @returns Promise<void>
	 */
	public async addRole(roleID: string): Promise<void> {
		return await this.guild.addMemberRole(this.id, roleID);
	}

	/**
	 * Method to remove a role from the user
	 * @param roleID ID of the role
	 * @returns Promise<void>
	 */
	public async removeRole(roleID: string): Promise<void> {
		return await this.guild.removeMemberRole(this.id, roleID);
	}
}
