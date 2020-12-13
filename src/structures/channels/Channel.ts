import Client from '../../Client.ts';
import Base from '../Base.ts';

/**
 * @class Channel
 * Base, extensible, channel object
 */

export default class Channel extends Base {
	/** Numeric type of the channel */
	public type: number;
	/** Name of the channel */
	public name: string;
	constructor(data: any, client: Client) {
		super(data.id, client);
		this.name = data.name;
		this.type = data.type;
	}
}
