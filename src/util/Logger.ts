import * as color from 'https://deno.land/std/fmt/colors.ts';

/**
 * @class Logger
 * A simple logger
 */

export default class Logger {
	public static DEBUG: boolean = false;
	public name: string;

	public constructor(name: string) {
		this.name = name;
	}

	public debug(...msgs: any[]) {
		if (Logger.DEBUG)
			console.log(
				color.gray(
					`[${this.time}] [${this.name.toUpperCase()}\\DEBUG]`
				),
				...msgs
			);
	}

	public success(...msgs: any[]) {
		if (Logger.DEBUG)
			console.log(
				color.green(
					`[${this.time}] [${this.name.toUpperCase()}\\SUCCESS]`
				),
				...msgs
			);
	}

	public warning(...msgs: any[]) {
		if (Logger.DEBUG)
			console.log(
				color.yellow(
					`[${this.time}] [${this.name.toUpperCase()}\\WARNING]`
				),
				...msgs
			);
	}

	public error(...msgs: any[]) {
		if (Logger.DEBUG)
			console.log(
				color.red(`[${this.time}] [${this.name.toUpperCase()}\\ERROR]`),
				...msgs
			);
	}

	public fatal(...msgs: any[]) {
		if (Logger.DEBUG)
			console.log(
				color.red(`[${this.time}] [${this.name.toUpperCase()}\\FATAL]`),
				...msgs
			);
	}

	public get time() {
		let date: Date = new Date();
		return [
			date.getHours() >= 10 ? date.getHours() : '0' + date.getHours(),
			date.getMinutes() >= 10
				? date.getMinutes()
				: '0' + date.getMinutes(),
			date.getSeconds() >= 10
				? date.getSeconds()
				: '0' + date.getSeconds(),
		].join(':');
	}
}
