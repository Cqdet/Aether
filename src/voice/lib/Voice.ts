export default class Voice {
	private encoder: TextEncoder = new TextEncoder();
	private decoder: TextDecoder = new TextDecoder();

	public async callNative(op: string, ...args: any[]) {
		const id = Deno.openPlugin(this.binPath);

		// @ts-ignore
		const ops = Deno.core.ops();

		const opName = Object.keys(ops).find((_) => _ === op);
		const dispatchID = ops[opName];
	}

	private get binPath(): string {
		let path: string;
		const os = Deno.build.os;
		const base = 'aether_voice';

		// I should probably use path.join here lol
		switch (os) {
			case 'windows': {
				path = `${Deno.cwd()}\\src\\voice\\target\\release\\${base}.dll`;
				break;
			}

			case 'darwin': {
				path = `${Deno.cwd()}/src/voice/target/release/${base}.dylib`;
				break;
			}

			case 'linux': {
				path = `${Deno.cwd()}/src/voice/target/release/${base}.so`;
				break;
			}
			default: {
				throw 'Invalid OS';
			}
		}
		return path;
	}
}
