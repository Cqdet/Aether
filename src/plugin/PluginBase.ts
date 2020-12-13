import Client from '../Client.ts';
import Logger from '../util/Logger.ts';
import EventHook from './hooks/EventHook.ts';
import Structure from './Structure.ts';

export default abstract class PluginBase {
	public name: string;
	public hooks: EventHook[];
	public structures: Structure[];

	protected client: Client;
	protected logger: Logger;

	public constructor(
		name: string,
		client: Client,
		hooks: EventHook[],
		structures: Structure[]
	) {
		this.name = name;
		this.hooks = hooks;
		this.structures = structures;
		this.client = client;
		this.logger = new Logger(`PLUGIN | ${this.name.toUpperCase()}`);

		if (this.client.options.usePlugins === false) {
			throw "PluginBase constructed when Client doesn't allow plugins";
		}
	}

	public abstract onEnable(): any;
	public abstract onDisable(): any;
	public abstract onError(): any;
}
