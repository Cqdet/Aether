export type Payload = {
	/** OP Code */
	op: number;
	/** Event Data */
	d: any;
	/** Sequence Number */
	s?: number;
	/** Event Name */
	t?: string;
};

export type MessageContent = {
	content?: string;
	embed?: MessageEmbed;
	flags?: number;
	tts?: boolean;
	message_reference?: {
		message_id: string;
		channel_id: string;
		guild_id: string;
	};
};

export interface MessageAttachment {
	id: string;
	height: number;
	width: number;
	size: number;
	url: string;
	fileName: string;
}

export interface MessageEmbed {
	title?: string;
	type?: 'rich' | 'image' | 'video' | 'gifv' | 'article' | 'link';
	description?: string;
	url?: string;
	timestamp?: number;
	color?: number;
	footer?: {
		text: string;
		icon_url: string;
	};
	image?: { url?: string; height: number; width: number };
	thumbnail?: { url?: string; height: number; width: number };
	video?: { url?: string; height?: number; width?: number };
	provider?: { name?: string; url?: string };
	author?: { name?: string; url?: string };
	fields?: { name: string; value: string; inline: boolean }[];
}
