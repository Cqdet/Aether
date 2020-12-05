import Permissions from './Permissions.ts';

export default class Permission {
	public allow: number;
	public deny: number;

	constructor(allow: number, deny: number = 0) {
		this.allow = allow;
		this.deny = deny;
	}

	/**
	 * JSON value of the permission
	 */
	get json(): object {
		let obj: any = {};
		for (const perm of Object.keys(Permissions)) {
			if (!perm.startsWith('all')) {
				if (
					this.allow & Permissions[perm as keyof typeof Permissions]
				) {
					obj[perm] = true;
				} else if (
					this.deny & Permissions[perm as keyof typeof Permissions]
				) {
					obj[perm] = false;
				}
			}
		}
		return obj;
	}

	has(permission: keyof typeof Permissions) {
		return Object.keys(this.json).includes(permission);
	}
}
