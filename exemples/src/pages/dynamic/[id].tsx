"use dynamic";
import { useLoader } from "frame-master-plugin-cloudflare-pages-dynamic-ssr/client/hooks";
import {
	createLoader,
	createPageConfig,
	type PluginEventContext,
} from "frame-master-plugin-cloudflare-pages-dynamic-ssr/server";
import { useState } from "react";
import { jsxDEV } from "react/jsx-dev-runtime";

jsxDEV;

export const ssr_configs = createPageConfig({
	callback(ctx) {
		return {
			ttl: 1000,
		};
	},
});

export const loader_idData = createLoader({
	name: "idData",
	async callback(ctx: PluginEventContext<unknown, "id", unknown>) {
		return {
			id: ctx.params.id,
			time: Date.now(),
		};
	},
});

export default function Dynamic() {
	const data = useLoader(loader_idData);
	const [testData, setTestData] = useState(null);
	return (
		<div>
			<h1>Dynamic page</h1>
			<p>
				This page is rendered dynamically using the cloudflare-pages-dynamic-ssr
				plugin. {JSON.stringify(data, null, 2)}
			</p>
			<div style={{ marginTop: "20px", fontSize: "18px", lineHeight: "1.5" }}>
				<a href="/">Go back to home page 12</a>
			</div>
			<div style={{ marginTop: "20px", fontSize: "18px", lineHeight: "1.5" }}>
				<TestComponent />
			</div>
		</div>
	);
}

export const loader_test = createLoader({
	name: "test",
	async callback() {
		return {
			message: "This is a test loader 12",
		};
	},
});

function TestComponent() {
	const data = useLoader(loader_test);
	console.log({ data });
	return <div>{JSON.stringify(data, null, 2)}</div>;
}
