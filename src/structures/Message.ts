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

/**
 * @class Message
 * @extends Base
 * A message object
 */

export default class Message extends Base {
	/** Numeric type of the message */
	public type: number;
	/** Whether the message is TTS (Text to Speech) */
	public tts: boolean;
	/** Numeric timestamp of the message */
	public timestamp: number;
	/** Whether the message is pinned */
	public pinned: boolean;
	/** Nonce of the message */
	public nonce: string | number;
	/** Member of the message */
	public member?: Member;
	/** Mentions of the message */
	public mentions: User[];
	/** Embeds of the message */
	public embeds: MessageEmbed[];
	/** Guild ID of the message */
	public guildID: string;
	/** Content of the message */
	public content: string;
	/** Channel of the message */
	public channel: TextChannel;
	/** Guild of the message (from channel) */
	public guild: Guild;
	/** User of the message */
	public author: User;
	/** Attachments of the message */
	public attachments: MessageAttachment[];
	/** Arguments of the message */
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

	/**
	 * Method to edit the message
	 * @param content Content of the message
	 * @returns Promise<Message>
	 */
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

	/**
	 * Method to delete the message
	 * @returns Promise<boolean>
	 */
	public async delete(): Promise<boolean> {
		return await this.client.rest.request(
			'DELETE',
			Endpoints.CHANNEL_MESSAGE(this.channel.id, this.id)
		);
	}

	/**
	 * Method to reply to a user
	 * @param content Content of the message
	 * @param id? ID of a specific message
	 * @returns Promise<Message>
	 */
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

	/**
	 * Method to pin the message
	 * @returns Promise<void>
	 */
	public async pin(): Promise<void> {
		return await this.client.rest.request(
			'PUT',
			Endpoints.CHANNEL_PIN(this.channel.id, this.id)
		);
	}
}
