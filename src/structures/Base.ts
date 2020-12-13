import Client from '../Client.ts';

/**
 * @class Base
 * Base, extensible, core object for all Aether structures
 */

export default class Base {
	/** ID of the structure */
	public id: string;
	/** Client of the structure */
	protected client: Client;

	public constructor(id: string, client: Client) {
		this.client = client;
		this.id = id;
	}

	/**
	 * Getter to get when the structure was created
	 * @returns number
	 */
	public get createdAt(): number {
		return Math.floor(parseInt(this.id) / 4194304) + 1420070400000;
	}

	/**
	 * Method to convert the structure into a string
	 * @returns string
	 */
	public toString(): string {
		return '[' + this.constructor.name + ' ' + this.id + ']';
	}
}
