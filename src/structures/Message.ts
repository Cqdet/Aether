import Client from '../Client.ts';
import Base from './Base.ts';
import TextChannel from './channels/TextChannel.ts';
import Guild from './guild/Guild.ts';
import Member from './guild/Member.ts';
import User from './User.ts';

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

export default class Message extends Base {
	public type: number;
	public tts: boolean;
	public timestamp: number;
	public pinned: boolean;
	public nonce: string | number;
	public member?: Member;
	public mentions: User[];
	public embeds: MessageEmbed[];
	public guildID: string;
	public content: string;
	public channel: TextChannel;
	public guild: Guild;
	public author: User;
	public attachments: MessageAttachment[];
	public args: string[];

	constructor(data: any, channel: TextChannel, client: Client) {
		super(data.id, client);

		this.type = data.type;
		this.tts = data.tts || false;
		this.timestamp = Date.parse(data.timestamp) || Date.now();
		this.pinned = data.pinned || false;
		this.nonce = data.nonce || null;
		this.mentions = data.mentions;
		this.embeds = data.embeds;
		this.guildID = data.guild_id;
		this.content = data.content;
		this.channel = channel;
		this.guild = this.channel.guild;
		this.author = new User(data.author, client);
		this.member = this.channel.guild.members.get(this.author.id);
		this.attachments = data.attachments;
		this.args = [];
	}
}
