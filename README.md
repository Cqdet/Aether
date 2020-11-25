# Aether

A Deno library to interface with the Discord API

# What is Aether?

Formerly known as Nitro, Aether is a Deno-based library to interface with the Discord API. It's optimized in speed, efficiency, and simplicity to make it so you only worry about writing the logic of your bot

# Test
```ts
import * as Aether from 'https://deno.land/x/aether/mod.ts';

const client = new Aether.Client('MY_TOKEN', {
	intents: Aether.DefaultIntents,
	allowedEvents: ['messageCreate', 'ready'],
	cache: {
		guilds: {
			$enabled: true,
			$max: Infinity,
		},
		channels: {
			$enabled: true,
			$max: Infinity,
		},
		users: {
			$enabled: true,
			$max: Infinity,
		},
	},
});

client.connect();

client.on('ready', (id: string) => {
	console.log(`Bot is ready on ${client.user.tag}`);
	console.log(`SessionID: ${id}`);
});

client.on('messageCreate', (msg: Aether.Message) => {
	console.log(msg.guild);
});
```
