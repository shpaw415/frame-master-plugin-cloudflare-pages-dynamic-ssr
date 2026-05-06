"use dynamic";
import { useLoader } from "frame-master-plugin-cloudflare-pages-dynamic-ssr/client/hooks";
import {
	createLoader,
	createPageConfig,
} from "frame-master-plugin-cloudflare-pages-dynamic-ssr/server";

export const ssr_configs = createPageConfig({
	callback(ctx) {
		return {
			ttl: 1000,
		};
	},
});

const loader_test = createLoader({
	name: "test",
	async callback() {
		return {
			message: "This is a test loader",
		};
	},
});

export default function Invalid() {
	const data = useLoader(loader_test);
	return (
		<div>
			<h1>Invalid page</h1>
			<p>This page is used to test the loader error handling.</p>
			<p>Loader message: {data?.message}</p>
		</div>
	);
}
