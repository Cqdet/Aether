import * as Aether from '../mod.ts';

const client = new Aether.Client('', {
	intents: Aether.AllIntents,
	allowedEvents: ['messageCreate', 'ready'],
	debug: true,
});

const orm = client.useORM('postgres', {});

client.connect();

client.on('ready', (id: string) => {
	console.log(`Bot is ready on ${client.user.tag}`);
});

client.on('messageCreate', async (msg: Aether.Message) => {});

client.on('presenceUpdate', (rawData: any) => {
	console.log(rawData);
});
