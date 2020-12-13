import Permission from './Permission.ts';

/**
 * @class PermissionOverwrite
 * @extends Permission
 * A guild permission overwrite (member or role)
 */

export default class PermissionOverwite extends Permission {
	public id: string;
	public type: 'member' | 'role';
	constructor(data: any) {
		super(data.allow, data.deny);
		this.id = data.id;
		this.type = data.type;
	}
}
