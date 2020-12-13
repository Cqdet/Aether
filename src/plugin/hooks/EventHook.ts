import { ClientEvents } from '../../Client.ts';
import Override from '../util/Override.ts';

export default abstract class EventHook {
	public name: string;
	public event: ClientEvents;
	public override: boolean;

	public constructor(
		name: string,
		event: ClientEvents,
		override: boolean = false
	) {
		this.name = name;
		this.event = event;
		this.override = override;
	}

	public abstract call(...data: any[]): any;
}
