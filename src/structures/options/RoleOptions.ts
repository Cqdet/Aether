/**
 * @interface Role
 * Options for role creation and editting
 */
export default interface RoleOptions {
	/** Name of the role */
	name: string;
	/** Numberic permission of the role */
	permissions?: number;
	/** Hex of the role color */
	color: number;
	/** Whether the role is hoisted */
	hoist: boolean;
	/** Whether the role is mentionable */
	mentionable: boolean;
}
