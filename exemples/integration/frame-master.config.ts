import {
	getGlobalPluginContext,
	type FrameMasterPlugin,
} from "frame-master/plugin";
import type { FrameMasterConfig } from "frame-master/server/types";
import SSRPlugin from "frame-master-plugin-cloudflare-pages-dynamic-ssr";
import CFActionPlugin from "frame-master-plugin-cloudflare-pages-functions-action";
import buildUnifier from "frame-master-plugin-build-unifier";
import ReactToHTML from "frame-master-plugin-react-to-html";
import AsyncFallback from "./src/asyncFallback";
import ApplyReact from "frame-master-plugin-apply-react/plugin";

const WranglerServerPort = 8787;

export default {
	HTTPServer: {
		port: 3000,
	},
	plugins: [
		ApplyReact({
			route: "src/pages",
			clientShellPath: "src/client-shell.tsx",
			entrypointExtensions: [".tsx"],
			style: "nextjs",
		}),
		ReactToHTML({
			verbose: false,
			srcDir: "src/pages",
			shellPath: "src/shell.tsx",
			asyncFallback: AsyncFallback,
		}),
		...buildUnifier({
			plugins: [
				CFActionPlugin({
					actionBasePath: "src/actions",
					outDir: ".frame-master/build",
					serverPort: WranglerServerPort,
				}),
				SSRPlugin({
					actionBasePath: "src/actions",
					basePath: "src/pages",
					wrangler: {
						port: WranglerServerPort,
					},
					entrypointMatcher: [/.*layout\.tsx$/],
				}) as FrameMasterPlugin,
			],
		}),
		{
			name: "proxy-to-wrangler",
			version: "0.1.0",
			serverConfig: {
				routes: {
					"/*": async (req) => {
						const url = new URL(req.url);
						url.port = String(WranglerServerPort);
						url.hostname = "127.0.0.1";
						const headers = new Headers(req.headers);
						headers.set("host", `127.0.0.1:${WranglerServerPort}`);
						headers.delete("accept-encoding");
						const hasBody =
							req.method !== "GET" &&
							req.method !== "HEAD" &&
							req.body !== null;
						try {
							const response = await fetch(url, {
								method: req.method,
								headers,
								body: hasBody ? req.body : undefined,
								redirect: "manual",
							});
							response.headers.delete("content-encoding");
							return response;
						} catch {
							return new Response("Bad Gateway: upstream unavailable", {
								status: 502,
							});
						}
					},
				},
			},
			async serverReady({ builder }) {
				await builder.build();
			},
		},
	],
} satisfies FrameMasterConfig;
