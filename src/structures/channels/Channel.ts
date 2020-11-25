import Client from '../../Client.ts';
import Base from '../Base.ts';

export default class Channel extends Base {
	public type: number;
	constructor(data: any, client: Client) {
		super(data.id, client);
		this.type = data.type;
	}
}
