import PluginBase from './PluginBase.ts';
import Structure from './Structure.ts';

export default class PluginRegistry {
	public plugins: PluginBase[];

	public constructor() {
		this.plugins = [];
	}

	public registerPlugins(...plugins: PluginBase[]) {
		this.plugins.push(...plugins);
	}

	get(name: string): PluginBase | undefined {
		return this.plugins.find((p) => p.name === name);
	}
}
