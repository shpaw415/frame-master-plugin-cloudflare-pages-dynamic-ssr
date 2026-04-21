import type { FrameMasterConfig } from "frame-master/server/types";
import SSRPlugin from "cloudflare-pages-dynamic-ssr";
export default {
	HTTPServer: {
		port: 3000,
	},
	plugins: [
		SSRPlugin({
			basePath: "src/pages",
		}),
	],
} satisfies FrameMasterConfig;
