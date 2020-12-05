import * as Aether from '../mod.ts';

const client = new Aether.Client('', {
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
	debug: true,
});

client.connect();

client.on('ready', (id: string) => {
	console.log(`Bot is ready on ${client.user.tag}`);
	console.log(`Session ID ${id}`);
});

client.on('messageCreate', async (msg: Aether.Message) => {
	if (msg.guildID === '723356120047157249') {
		console.log(msg.member?.permissions.json);
	}
});
