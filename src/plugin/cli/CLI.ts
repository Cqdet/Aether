type CLIArguments = 'get' | 'remove' | 'update' | 'upgrade';

(async function main() {
	const args = Deno.args as CLIArguments[];

	switch (args[0]) {
		case 'get': {
			const url = args[1];
			if (!url) {
				console.log('Invalid URL');
				Deno.exit(1);
			}

			if (url.endsWith('mod.ts')) {
				console.log(
					'APL URL fetches should not include the mod.ts and should end with the plugin.yml'
				);
				Deno.exit(1);
			}
		}
	}
})();
