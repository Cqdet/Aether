import { EventEmitter, Buffer } from '../../../deps.ts';
import { Payload } from '../../constants/Constants.ts';
import { OPCodes } from '../../constants/OPCodes.ts';
import Client from '../../Client.ts';
import Channel from '../../structures/channels/Channel.ts';
import GuildChannel from '../../structures/channels/GuildChannel.ts';
import CategoryChannel from '../../structures/channels/CategoryChannel.ts';
import TextChannel from '../../structures/channels/TextChannel.ts';
import VoiceChannel from '../../structures/channels/VoiceChannel.ts';
import Guild from '../../structures/guild/Guild.ts';
import User from '../../structures/User.ts';
import Message from '../../structures/Message.ts';
import Logger from '../../util/Logger.ts';

interface DiscordError {
	code: number;
	reason: string;
}

export default class Shard extends EventEmitter {
	public ws: WebSocket;
	public state: 'OPEN' | 'CONNECTED' | 'CLOSING' | 'CLOSED' = 'CLOSED';
	public sessionID: string;

	public ping: number = Infinity;
	private heartbeatInterval!: number;
	private lastHeartbeatSent!: number;
	private lastHeartbeatAck!: number;

	private seqID?: number;

	private client: Client;

	private logger: Logger;

	public constructor(client: Client) {
		super();
		this.client = client;
		this.sessionID = '';

		this.logger = new Logger('SHARD');
		this.ws = new WebSocket('wss://gateway.discord.gg/?v=8&encoding=json');

		this.ws.onopen = () => {
			this.state = 'OPEN';
		};

		this.ws.onclose = (ev: Event) => {
			const err: DiscordError = <any>ev;
			this.logger.warning(
				`Closing WebSocket: ${err.reason} [${err.code}]`
			);
			this.state = 'CLOSED';
		};

		this.ws.onerror = (ev: Event | ErrorEvent) => {
			this.state = 'CLOSED';
			this.logger.error(JSON.stringify(ev, null, 4));
			throw ev;
		};
	}

	public connect(token: string, intents: number = 513) {
		this.ws.onmessage = (ev: MessageEvent) => {
			const payload: Payload = JSON.parse(ev.data);
			this.seqID = payload.s;
			this.logger.debug(`Received OP: ${payload.op}`);
			this.logger.debug(`Sequence ID: ${this.seqID || 'N/A'}`);

			switch (payload.op) {
				case OPCodes.HELLO: {
					this.heartbeat(payload.d.heartbeat_interval || 45000);
					this.logger.debug('Identifying to gateway...');
					this.identify(token, intents);
					this.logger.success('Successfully identified to gateway');
					break;
				}

				case OPCodes.EVENT: {
					let ev =
						<string>'on' +
						payload.t
							?.toLowerCase()
							.split('_')
							.map((e) => e.charAt(0).toUpperCase() + e.substr(1))
							.join('');

					if ((this as any)[ev] !== undefined) {
						this.logger.debug(
							`Handing Event: ${
								ev.charAt(2).toLowerCase() + ev.substring(3)
							}`
						);
						(this as any)[ev](payload.d);
						return;
					} else {
						this.logger.debug(
							`Unknown Event: ${
								ev.charAt(2).toLowerCase() + ev.substring(3)
							}`
						);
						this.client.emit('unknown', payload.d);
					}
				}

				case OPCodes.HEARTBEAT_ACK: {
					this.lastHeartbeatAck = Date.now();
					this.ping = this.lastHeartbeatAck - this.lastHeartbeatSent;
					this.logger.debug(`Current Ping: ${this.ping}ms`);
				}
			}
		};
	}

	public send(data: object): void {
		this.ws.send(Buffer.from(JSON.stringify(data)));
	}

	private identify(token: string, intents: number) {
		return this.send({
			op: OPCodes.IDENTIFY,
			d: {
				token: 'Bot ' + token,
				intents: intents,
				properties: {
					$os: Deno.build.os,
					$browser: 'Zaos (Deno)',
					$device: 'Zaos (Deno)',
				},
			},
		});
	}

	private heartbeat(ms: number) {
		if (this.heartbeatInterval) {
			throw 'Websocket Error: Heartbeat already exists';
		}
		this.heartbeatInterval = setInterval(() => {
			this.lastHeartbeatSent = Date.now();
			this.send({ op: OPCodes.HEARTBEAT, d: this.seqID });
			this.logger.debug('Sending client heartbeat...');
		}, ms);
	}

	private onReady(data: any): void {
		this.sessionID = data.session_id;
		this.client.user = new User(data.user, this.client);
		this.client.emit('ready', this.sessionID);
	}

	private onGuildCreate(data: any) {
		const guild = new Guild(data, this.client);
		this.client.guilds.add(guild);

		for (let channel of data.channels) {
			channel.guild_id = guild.id;
			this.onChannelCreate(channel);
		}

		this.client.emit('guildCreate', guild);
	}

	private onChannelCreate(data: any) {
		let channel: Channel;
		let guild = this.client.guilds.get(data.guild_id) || this.emptyGuild;

		switch (data.type) {
			case 0:
				channel = new TextChannel(data, guild, this.client);
				break;
			case 2:
				channel = new VoiceChannel(data, guild, this.client);
				break;
			case 4:
				channel = new CategoryChannel(data, guild, this.client);
				break;
			default:
				if (data.guild_id) {
					channel = new GuildChannel(data, guild, this.client);
				} else {
					channel = new Channel(data, this.client);
				}
				break;
		}

		this.client.channels.add(channel);
		this.client.emit('channelCreate', channel);
	}

	private onMessageCreate(data: any) {
		let channel: TextChannel =
			<TextChannel>this.client.channels.get(data.channel_id) ||
			this.emptyTextChannel;

		const msg = new Message(data, channel, this.client);
		this.client.emit('messageCreate', msg);
	}

	public get emptyGuild() {
		return new Guild(
			{
				id: '0',
				name: '0',
				description: '0',
				splash: '0',
				owner: null,
				permissions: null,
				region: '0',
				afkChannel: null,
				afkTimeout: null,
			},
			this.client
		);
	}

	public get emptyTextChannel() {
		return new TextChannel(
			{
				id: '0',
				name: '0',
				guildID: '0',
				position: 0,
				permissionOverwrites: [],
				rateLimit: 0,
				nsfw: false,
				topic: '0',
				lastMessageId: '0',
				parentID: '0',
			},
			this.emptyGuild,
			this.client
		);
	}

	public get emptyMessage(): Message {
		return new Message(
			{
				id: '0',
				content: '0',
				author: {
					id: '0',
					username: 'Unknown',
					discriminator: '9999',
				},
			},
			this.emptyTextChannel,
			this.client
		);
	}
}
