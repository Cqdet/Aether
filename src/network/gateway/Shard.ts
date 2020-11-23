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

export default class Shard extends EventEmitter {
	public ws!: WebSocket;
	public state: 'OPEN' | 'CONNECTED' | 'CLOSING' | 'CLOSED' = 'CLOSED';
	public sessionID: string;

	public ping: number = Infinity;
	private heartbeatInterval!: number;
	private lastHeartbeatSent!: number;
	private lastHeartbeatAck!: number;

	private client: Client;

	public constructor(client: Client) {
		super();
		this.client = client;
		this.sessionID = '';
	}

	public connect(token: string, intents: number = 513) {
		this.ws = new WebSocket('wss://gateway.discord.gg/?v=8&encoding=json');

		this.ws.onmessage = (ev: MessageEvent) => {
			const payload: Payload = JSON.parse(ev.data);

			switch (payload.op) {
				case OPCodes.HELLO: {
					this.heartbeat(payload.d.heartbeat_interval || 45000);
					this.identify(token, intents);
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
						(this as any)[ev](payload.d);
						return;
					} else {
						console.log(ev);
						this.client.emit('unknown', payload.d);
					}
				}

				case OPCodes.HEARTBEAT_ACK: {
					this.lastHeartbeatAck = Date.now();
					this.ping = this.lastHeartbeatAck - this.lastHeartbeatSent;
					this.client.emit('debug', 'Ping: ' + this.ping);
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
			this.send({ op: OPCodes.HEARTBEAT, d: null });
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

	private get emptyGuild() {
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

	private get emptyTextChannel() {
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
			new Guild(
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
			),
			this.client
		);
	}
}
