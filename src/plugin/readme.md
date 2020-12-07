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

## Protocol and Registry
*Note the following is still a prototype concept*

I want to make sure that plugins are easily distributable through the current ecosystem of Deno libraries. Therefore, I have a proposed idea that may work pretty well. Here are the steps on how a concept as such could work.

1. Use the Aether Plugin CLI to fetch a package (remote URL)
```cmd
apl get https://deno.land/x/aether-message-logger; # Note we don't specify `mod.ts`
```
2. Do a logic check to be sure that there is a plugin.yml file
Pseudo plugin.yml file
```yml
name: MessageLogger
author: Cqdet
description: A plugin that lets you log messages into a PSQL DB
events:
	- messageCreate
	- messageUpdate
```
3. Use data to "plug in" the plugins correctly in the Aether codebase

