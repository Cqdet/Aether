import PermissionOverwite from '../permissions/PermissionOverwrite.ts';

/**
 * @interface ChannelOptions
 * Options for guild-based channel creation and editting
 */
export default interface ChannelOptions {
	/** Name of the channel */
	name: string;
	/** Numeric type of the channel */
	type: 0 | 2 | 4 | 5 | 6;
	/** Topic of the channel (TextChannel) */
	topic?: string;
	/** Bitrate of the channel (VoiceChannel) */
	bitrate?: number;
	/** User limit of the channel (VoiceChannel) */
	userLimit?: number;
	/** Rate limit per user of the channel (TextChannel) */
	rateLimitPerUser?: number;
	/** Numeric position of the channel */
	position?: number;
	/** Permission overwrites of the channel */
	permissionOverwrites?: PermissionOverwite[];
	/** Parent ID of the channel (non-CategoryChannel) */
	parentID?: string;
	/** Whether the channel is NSFW */
	nsfw?: boolean;
}
