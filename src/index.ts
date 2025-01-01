/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.toml`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const url = new URL(request.url).searchParams.get('url') || undefined;

		const defaultHeaders: Record<string, string> = {
			'Access-Control-Allow-Methods': 'GET',
		};

		const origin = request.headers.get('Origin');
		if (origin !== null) {
			const originUrl = new URL(origin);
			if (originUrl.hostname === 'localhost' || originUrl.hostname.match('dochne.com$')) {
				// We allow dochne and localhost!
				defaultHeaders['Access-Control-Allow-Origin'] = `${originUrl.protocol}//${originUrl.host}`;
			}
		}

		if (!url) {
			return new Response('Invalid URL passed', { status: 400 });
		}

		const response = await fetch(url);
		return new Response(await response.bytes(), {
			status: response.status,
			statusText: response.statusText,
			headers: { ...response.headers, ...defaultHeaders },
		});
	},
} satisfies ExportedHandler<Env>;
