"use dynamic";
import {
	createLoader,
	type PluginEventContext,
} from "frame-master-plugin-cloudflare-pages-dynamic-ssr/server";
import { useLoader } from "frame-master-plugin-cloudflare-pages-dynamic-ssr/client/hooks";

export const loader_idData = createLoader({
	async callback(ctx: PluginEventContext<unknown, "id", unknown>) {
		return {
			id: ctx.params.id,
		};
	},
});

export default function Dynamic() {
	const data = useLoader(loader_idData);
	return (
		<div>
			<h1>Dynamic page</h1>
			<p>
				This page is rendered dynamically using the cloudflare-pages-dynamic-ssr
				plugin. {JSON.stringify(data, null, 2)}
			</p>
		</div>
	);
}
