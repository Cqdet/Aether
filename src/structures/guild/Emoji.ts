export default class Emoji {
	public id: string;
	public roles: string[];
	public requireColons: boolean;
	public name: string;
	public managed: boolean;
	public available: boolean;
	public animated: boolean;

	constructor(data: any) {
		this.id = data.id;
		this.roles = data.roles;
		this.requireColons = data.require_colons;
		this.name = data.name;
		this.managed = data.managed;
		this.available = data.available;
		this.animated = data.animated;
	}
}
