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
