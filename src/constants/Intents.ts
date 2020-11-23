export const DefaultIntents = 32509;
export const AllIntents = 32767;

export const Intents = {
	guilds: 1 << 0,
	members: 1 << 1,
	bans: 1 << 2,
	emojis: 1 << 3,
	integrations: 1 << 4,
	webhooks: 1 << 5,
	invites: 1 << 6,
	voiceStates: 1 << 7,
	presences: 1 << 8,
	messages: 1 << 9,
	messageReactions: 1 << 10,
	messageTyping: 1 << 11,
	directMessages: 1 << 12,
	directMessageReactions: 1 << 13,
	directMessageTyping: 1 << 14,
	privileged: (1 << 8) + (1 << 1),
};
