"use-dynamic";
import { TestComponent } from "../../components/test";

export default async function Subroute() {
	/*const data = await fetch("https://jsonplaceholder.typicode.com/todos/1").then(
		(res) => res.json(),
	);*/
	return (
		<div>
			<h1>Subroute</h1>
			<p>
				This page is rendered dynamically using the cloudflare-pages-dynamic-ssr
				plugin.
			</p>
			<p>Data fetched from an API test</p>
		</div>
	);
}
