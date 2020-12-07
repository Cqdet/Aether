# Plugin API

## What is Plugin API

Plugin API and Protocol that will be used by Aether to easily distribute Aether-based plugins

## What is a plugin

Plugins are essentially easily-distributable addons to an Aether code-base that can hook into network requests, events, and more

## Pseudo code

bot.ts

```ts
import { MyPlugin } from './plugins/MyPlugin.ts';
const client = new Client('Nz.9320dmsk0aw02', { usePlugins: true });

client.plugins.register(MyPlugin);
```

plugins/MyPlugin.ts

```ts
import { PluginBase } from 'https://deno.land/x/aether/mod.ts';
import { MessageHook } from './hooks/events/MessageHook.ts';

export class MyPlugin extends PluginBase {
	public constructor() {
		super('MyPlugin', [MessageHook]);
	}

	public onEnable() {
		this.logger.success('MyPlugin has now been enabled');
	}
}
```

hooks/events/MessageHook.ts

```ts
import { EventHook as Hook } from 'https://deno.land/x/aether/mod.ts';

export class MessageHook extends Hook {
	public constructor() {
		super('MessageHook', 'messageCreate');
	}

	// inherits: public abstract call (...data: any[]);
	public async call(data: Message) {
		this.client.orm
			.asSQL()
			.query(
				`insert into messages (id, content) values (${data.id} ${data.id})`
			);
	}
}
```
