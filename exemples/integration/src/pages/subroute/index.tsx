"use-dynamic";
import { TestComponent } from "../../components/test";
import { createLoader } from "frame-master-plugin-cloudflare-pages-dynamic-ssr/server";
import { useLoader } from "frame-master-plugin-cloudflare-pages-dynamic-ssr/client/hooks";

export const loader_SubRouteServerData = createLoader({
	callback: async () => {
		return await fetch("https://jsonplaceholder.typicode.com/todos/1").then(
			(res) =>
				res.json() as Promise<{
					userId: number;
					id: number;
					title: string;
					completed: boolean;
				}>,
		);
	},
});

export default function Subroute() {
	const data = useLoader(loader_SubRouteServerData);
	return (
		<div>
			<h1>Subroute</h1>
			<p>
				This page is rendered dynamically using the cloudflare-pages-dynamic-ssr
				plugin.
			</p>
			<p>Data fetched from an API test</p>
			<pre>{JSON.stringify(data, null, 2)}</pre>
		</div>
	);
}
