import { MessageContent, MessageEmbed } from '../../constants/Constants.ts';
import Client from '../../Client.ts';
import Guild from '../guild/Guild.ts';
import Message from '../Message.ts';
import GuildChannel from './GuildChannel.ts';
import { Endpoints } from '../../network/Endpoints.ts';

export default class TextChannel extends GuildChannel {
	public topic: string;
	public rateLimitPerUser: number;
	public lastMessageID: string;

	constructor(data: any, guild: Guild, client: Client) {
		super(data, guild, client);
		this.topic = data.topic;
		this.rateLimitPerUser = data.rate_limit_per_user;
		this.lastMessageID = data.last_message_id;
	}

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

	public async deleteMessage(id: string): Promise<void> {
		return await this.client.rest.request(
			'DELETE',
			Endpoints.CHANNEL_MESSAGE(this.id, id)
		);
	}

	public async deleteMessages(messages: string[]): Promise<void> {
		throw 'Not implemented';
		// return await this.client.rest.request(
		// 	'DELETE',
		// 	Endpoints.CHANNEL_BULK_DELETE(this.id),
		// 	{ messages }
		// );
	}
}
