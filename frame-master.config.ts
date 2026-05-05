import type { FrameMasterConfig } from "frame-master/server/types";
import ApplyReact from "frame-master-plugin-apply-react/plugin";
import buildUnifier from "frame-master-plugin-build-unifier";
import CFActionPlugin from "frame-master-plugin-cloudflare-pages-functions-action";
import EnvInHTML from "frame-master-plugin-env-in-html";
import ReactToHTML from "frame-master-plugin-react-to-html";
import SSRPlugin from "./";
import AsyncFallback from "./exemples/src/asyncFallback";

const WranglerServerPort = 8787;

export default {
	HTTPServer: {
		port: 3000,
	},
	plugins: [
		...buildUnifier({
			plugins: [
				CFActionPlugin({
					actionBasePath: "exemples/src/actions",
					outDir: ".frame-master/build",
					serverPort: WranglerServerPort,
				}),
				SSRPlugin({
					actionBasePath: "exemples/src/actions",
					basePath: "exemples/src/pages",
					wrangler: {
						port: WranglerServerPort,
					},
					entrypointMatcher: [/.*layout\.tsx$/],
				}),
			],
		}),
		ApplyReact({
			route: "exemples/src/pages",
			clientShellPath: "exemples/src/client-shell.tsx",
			entrypointExtensions: [".tsx"],
			style: "nextjs",
		}),
		ReactToHTML({
			verbose: false,
			srcDir: "exemples/src/pages",
			shellPath: "exemples/src/shell.tsx",
			asyncFallback: AsyncFallback,
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
			build: {
				buildConfig: {
					splitting: true,
				},
			},
			async serverReady({ builder }) {
				await builder.build();
			},
		},
		EnvInHTML({
			entries: ["NODE_ENV"],
		}),
	],
} satisfies FrameMasterConfig;
