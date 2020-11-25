import {
	MessageEmbed,
	MessageAttachment,
	MessageContent,
} from '../constants/Constants.ts';
import Client from '../Client.ts';
import Base from './Base.ts';
import TextChannel from './channels/TextChannel.ts';
import Guild from './guild/Guild.ts';
import Member from './guild/Member.ts';
import User from './User.ts';
import { Endpoints } from '../network/Endpoints.ts';

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

	public async edit(
		content: MessageContent | string | MessageEmbed
	): Promise<Message> {
		if (typeof content === 'string') {
			content = { content: content };
		}

		const res = await this.client.rest.request(
			'PATCH',
			Endpoints.CHANNEL_MESSAGE(this.channel.id, this.id),
			content
		);

		return new Message(res || { id: this.id }, this.channel, this.client);
	}

	public async reply(
		content: MessageContent | string,
		id: string = this.id
	): Promise<Message> {
		if (typeof content === 'string') {
			content = {
				content: content,
				message_reference: {
					guild_id:
						this.guildID || this.guild.id || this.channel.guild.id,
					channel_id: this.channel.id,
					message_id: id,
				},
			};
		} else {
			content.message_reference = {
				guild_id:
					this.guildID || this.guild.id || this.channel.guild.id,
				channel_id: this.channel.id,
				message_id: id,
			};
		}

		return await this.channel.send(content);
	}

	public async pin(): Promise<void> {
		return await this.client.rest.request(
			'PUT',
			Endpoints.CHANNEL_PIN(this.channel.id, this.id)
		);
	}
}
