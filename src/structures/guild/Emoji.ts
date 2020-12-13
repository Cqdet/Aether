/**
 * @class Emoji
 * A guild emoji
 */

export default class Emoji {
	/** ID of the emoji */
	public id: string;
	/** Roles that can access the emoji */
	public roles: string[];
	/** Whether the emoji requires colons */
	public requireColons: boolean;
	/** Name of the emoji */
	public name: string;
	/** Whether the emoji is managed */
	public managed: boolean;
	/** Whether the emoji is available */
	public available: boolean;
	/** Whether the emoji is animated */
	public animated: boolean;

	public constructor(data: any) {
		this.id = data.id;
		this.roles = data.roles;
		this.requireColons = data.require_colons;
		this.name = data.name;
		this.managed = data.managed;
		this.available = data.available;
		this.animated = data.animated;
	}
}
