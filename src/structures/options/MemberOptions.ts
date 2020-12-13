/**
 * @interface MemberOptions
 * Options for guild member editting
 */
export default interface MemberOptions {
	/** Nick of the member */
	nick?: string;
	/** Array of roleIDs of the member */
	roles?: string[];
	/** Whether the member is muted */
	mute?: boolean;
	/** Wether the member is deafened */
	deaf?: boolean;
	/** Channel ID  */
	channel_id?: boolean;
}
