import Permissions from './Permissions.ts';

/**
 * @class Permission
 * Base, extensible, permission object
 */

export default class Permission {
	/** Allowed numeric permissions */
	public allow: number;
	/** Denied numeric permissions */
	public deny: number;

	constructor(allow: number, deny: number = 0) {
		this.allow = allow;
		this.deny = deny;
	}

	/**
	 * JSON value of the permission
	 * @returns object
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

	/**
	 * Method to see whether the permission includes a specific permission
	 * @param permission Permission string
	 * @returns boolean
	 */
	has(permission: keyof typeof Permissions): boolean {
		return Object.keys(this.json).includes(permission);
	}
}
