"use dynamic";
import { useLoader } from "frame-master-plugin-cloudflare-pages-dynamic-ssr/client/hooks";
import {
	createLoader,
	createPageConfig,
} from "frame-master-plugin-cloudflare-pages-dynamic-ssr/server";

export const ssr_configs = createPageConfig({
	callback(ctx) {
		return {
			skipCache: true,
		};
	},
});

export const loader_test = createLoader({
	name: "test",
	async callback(ctx) {
		ctx.env;
		return {
			message: "This is a test loader",
		};
	},
});

export default function Invalid() {
	const data = useLoader(loader_test);
	return (
		<div>
			<h1>No cache Page</h1>
			<p>This page is used to test the cache behavior.</p>
			<p>Loader message: {data?.message}</p>
		</div>
	);
}
