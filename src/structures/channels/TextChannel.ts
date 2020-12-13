import { MessageContent, MessageEmbed } from '../../constants/Constants.ts';
import Client from '../../Client.ts';
import Guild from '../guild/Guild.ts';
import Message from '../Message.ts';
import GuildChannel from './GuildChannel.ts';
import { Endpoints } from '../../network/Endpoints.ts';

/**
 * @class TextChannel
 * @extends GuildChannel
 * A type of guild-based channel that is textable
 */

export default class TextChannel extends GuildChannel {
	/** Topic of the text channel */
	public topic: string;
	/** Rate limit per user of the text channel */
	public rateLimitPerUser: number;
	/** ID of the last message sent in the text channel */
	public lastMessageID: string;

	constructor(data: any, guild: Guild, client: Client) {
		super(data, guild, client);
		this.topic = data.topic;
		this.rateLimitPerUser = data.rate_limit_per_user;
		this.lastMessageID = data.last_message_id;
	}

	/**
	 * A method to send a message to the text channel
	 * @param content Content of the message
	 * @returns Promise<Message>
	 */
	public async send(
		content: MessageContent | string | MessageEmbed
	): Promise<Message> {
		if (typeof content === 'string') {
			content = { content: content };
		}

		const res = await this.client.rest.request(
			'POST',
			Endpoints.CHANNEL_MESSAGES(this.id),
			content
		);

		if (!res) {
			return this.client.shard.emptyMessage;
		}

		return new Message(res || { id: this.id }, this, this.client);
	}

	/**
	 * A method to get a specific message from the channel
	 * @param id ID of the message
	 * @returns Promise<Message>
	 */
	public async getMessage(id: string): Promise<Message> {
		return new Message(
			await this.client.rest.request(
				'GET',
				Endpoints.CHANNEL_MESSAGE(this.id, id)
			),
			this,
			this.client
		);
	}

	/**
	 * Method to delete a specific message in the channel
	 * @param id ID of the message
	 * @returns Promise<void>
	 */
	public async deleteMessage(id: string): Promise<void> {
		return await this.client.rest.request(
			'DELETE',
			Endpoints.CHANNEL_MESSAGE(this.id, id)
		);
	}

	/**
	 * Method to delete/purge multiple messages in the channel
	 * @param messages Array of message IDs
	 * @returns Promise<void>
	 *
	 * @note NOT IMPLEMENTED
	 */
	public async deleteMessages(messages: string[]): Promise<void> {
		throw 'Not implemented';
		// return await this.client.rest.request(
		// 	'DELETE',
		// 	Endpoints.CHANNEL_BULK_DELETE(this.id),
		// 	{ messages }
		// );
	}
}
