export const CDN_URL = 'https://cdn.discordapp.com';
export const GATEWAY_URL = `wss://gateway.discord.gg/?v=8&encoding=json`;
export const REST_URL = 'https://discord.com/api/v8';

export const Endpoints = {
	CHANNEL: (chanID: string) => `/channels/${chanID}`,
	CHANNEL_BULK_DELETE: (chanID: string) =>
		`/channels/${chanID}/messages/bulk-delete`,
	CHANNEL_CALL_RING: (chanID: string) => `/channels/${chanID}/call/ring`,
	CHANNEL_CROSSPOST: (chanID: string, msgID: string) =>
		`/channels/${chanID}/messages/${msgID}/crosspost`,
	CHANNEL_FOLLOW: (chanID: string) => `/channels/${chanID}/followers`,
	CHANNEL_INVITES: (chanID: string) => `/channels/${chanID}/invites`,
	CHANNEL_MESSAGE_REACTION: (
		chanID: string,
		msgID: string,
		reaction: string
	) => `/channels/${chanID}/messages/${msgID}/reactions/${reaction}`,
	CHANNEL_MESSAGE_REACTION_USER: (
		chanID: string,
		msgID: string,
		reaction: string,
		userID: string
	) =>
		`/channels/${chanID}/messages/${msgID}/reactions/${reaction}/${userID}`,
	CHANNEL_MESSAGE_REACTIONS: (chanID: string, msgID: string) =>
		`/channels/${chanID}/messages/${msgID}/reactions`,
	CHANNEL_MESSAGE: (chanID: string, msgID: string) =>
		`/channels/${chanID}/messages/${msgID}`,
	CHANNEL_MESSAGES: (chanID: string) => `/channels/${chanID}/messages`,
	CHANNEL_MESSAGES_SEARCH: (chanID: string) =>
		`/channels/${chanID}/messages/search`,
	CHANNEL_PERMISSION: (chanID: string, overID: string) =>
		`/channels/${chanID}/permissions/${overID}`,
	CHANNEL_PERMISSIONS: (chanID: string) => `/channels/${chanID}/permissions`,
	CHANNEL_PIN: (chanID: string, msgID: string) =>
		`/channels/${chanID}/pins/${msgID}`,
	CHANNEL_PINS: (chanID: string) => `/channels/${chanID}/pins`,
	CHANNEL_RECIPIENT: (groupID: string, userID: string) =>
		`/channels/${groupID}/recipients/${userID}`,
	CHANNEL_TYPING: (chanID: string) => `/channels/${chanID}/typing`,
	CHANNEL_WEBHOOKS: (chanID: string) => `/channels/${chanID}/webhooks`,
	CHANNELS: '/channels',
	GATEWAY: '/gateway',
	GATEWAY_BOT: '/gateway/bot',
	GUILD: (guildID: string) => `/guilds/${guildID}`,
	GUILD_AUDIT_LOGS: (guildID: string) => `/guilds/${guildID}/audit-logs`,
	GUILD_BAN: (guildID: string, memberID: string) =>
		`/guilds/${guildID}/bans/${memberID}`,
	GUILD_BANS: (guildID: string) => `/guilds/${guildID}/bans`,
	GUILD_CHANNELS: (guildID: string) => `/guilds/${guildID}/channels`,
	GUILD_EMBED: (guildID: string) => `/guilds/${guildID}/embed`,
	GUILD_EMOJI: (guildID: string, emojiID: string) =>
		`/guilds/${guildID}/emojis/${emojiID}`,
	GUILD_EMOJIS: (guildID: string) => `/guilds/${guildID}/emojis`,
	GUILD_INTEGRATION: (guildID: string, inteID: string) =>
		`/guilds/${guildID}/integrations/${inteID}`,
	GUILD_INTEGRATION_SYNC: (guildID: string, inteID: string) =>
		`/guilds/${guildID}/integrations/${inteID}/sync`,
	GUILD_INTEGRATIONS: (guildID: string) => `/guilds/${guildID}/integrations`,
	GUILD_INVITES: (guildID: string) => `/guilds/${guildID}/invites`,
	GUILD_VANITY_URL: (guildID: string) => `/guilds/${guildID}/vanity-url`,
	GUILD_MEMBER: (guildID: string, memberID: string) =>
		`/guilds/${guildID}/members/${memberID}`,
	GUILD_MEMBER_NICK: (guildID: string, memberID: string) =>
		`/guilds/${guildID}/members/${memberID}/nick`,
	GUILD_MEMBER_ROLE: (guildID: string, memberID: string, roleID: string) =>
		`/guilds/${guildID}/members/${memberID}/roles/${roleID}`,
	GUILD_MEMBERS: (guildID: string) => `/guilds/${guildID}/members`,
	GUILD_MEMBERS_SEARCH: (guildID: string) =>
		`/guilds/${guildID}/members/search`,
	GUILD_MESSAGES_SEARCH: (guildID: string) =>
		`/guilds/${guildID}/messages/search`,
	GUILD_PREVIEW: (guildID: string) => `/guilds/${guildID}/preview`,
	GUILD_PRUNE: (guildID: string) => `/guilds/${guildID}/prune`,
	GUILD_ROLE: (guildID: string, roleID: string) =>
		`/guilds/${guildID}/roles/${roleID}`,
	GUILD_ROLES: (guildID: string) => `/guilds/${guildID}/roles`,
	GUILD_VOICE_REGIONS: (guildID: string) => `/guilds/${guildID}/regions`,
	GUILD_WEBHOOKS: (guildID: string) => `/guilds/${guildID}/webhooks`,
	GUILD_WIDGET: (guildID: string) => `/guilds/${guildID}/widget`,
	GUILDS: '/guilds',
	INVITE: (inviteID: string) => `/invite/${inviteID}`,
	OAUTH2_APPLICATION: (appID: string) => `/oauth2/applications/${appID}`,
	USER: (userID: string) => `/users/${userID}`,
	USER_BILLING: (userID: string) => `/users/${userID}/billing`,
	USER_BILLING_PAYMENTS: (userID: string) =>
		`/users/${userID}/billing/payments`,
	USER_BILLING_PREMIUM_SUBSCRIPTION: (userID: string) =>
		`/users/${userID}/billing/premium-subscription`,
	USER_CHANNELS: (userID: string) => `/users/${userID}/channels`,
	USER_CONNECTIONS: (userID: string) => `/users/${userID}/connections`,
	USER_CONNECTION_PLATFORM: (userID: string, platform: string, id: string) =>
		`/users/${userID}/connections/${platform}/${id}`,
	USER_GUILD: (userID: string, guildID: string) =>
		`/users/${userID}/guilds/${guildID}`,
	USER_GUILDS: (userID: string) => `/users/${userID}/guilds`,
	USER_MFA_CODES: (userID: string) => `/users/${userID}/mfa/codes`,
	USER_MFA_TOTP_DISABLE: (userID: string) =>
		`/users/${userID}/mfa/totp/disable`,
	USER_MFA_TOTP_ENABLE: (userID: string) =>
		`/users/${userID}/mfa/totp/enable`,
	USER_NOTE: (userID: string, targetID: string) =>
		`/users/${userID}/note/${targetID}`,
	USER_PROFILE: (userID: string) => `/users/${userID}/profile`,
	USER_RELATIONSHIP: (userID: string, relID: string) =>
		`/users/${userID}/relationships/${relID}`,
	USER_SETTINGS: (userID: string) => `/users/${userID}/settings`,
	USERS: '/users',
	VOICE_REGIONS: '/voice/regions',
	WEBHOOK: (hookID: string) => `/webhooks/${hookID}`,
	WEBHOOK_SLACK: (hookID: string) => `/webhooks/${hookID}/slack`,
	WEBHOOK_TOKEN: (hookID: string, token: string) =>
		`/webhooks/${hookID}/${token}`,
	WEBHOOK_TOKEN_SLACK: (hookID: string, token: string) =>
		`/webhooks/${hookID}/${token}/slack`,

	// CDN Endpoints
	CHANNEL_ICON: (chanID: string, chanIcon: string) =>
		`/channel-icons/${chanID}/${chanIcon}`,
	CUSTOM_EMOJI: (emojiID: string) => `/emojis/${emojiID}`,
	DEFAULT_USER_AVATAR: (userDiscriminator: string) =>
		`/embed/avatars/${userDiscriminator}`,
	GUILD_BANNER: (guildID: string, guildBanner: string) =>
		`/banners/${guildID}/${guildBanner}`,
	GUILD_ICON: (guildID: string, guildIcon: string) =>
		`/icons/${guildID}/${guildIcon}`,
	GUILD_SPLASH: (guildID: string, guildSplash: string) =>
		`/splashes/${guildID}/${guildSplash}`,
	USER_AVATAR: (userID: string, userAvatar: string) =>
		`/avatars/${userID}/${userAvatar}`,
};
