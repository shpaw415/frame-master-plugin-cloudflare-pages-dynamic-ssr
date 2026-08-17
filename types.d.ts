declare module "dynamic-ssr:entrypoints" {
	const entrypoints: Record<string, Record<string, unknown>>;
	export default entrypoints;
}

declare module "@dynamic-ssr-endpoints.js" {
	const endpoints: string[];
	export default endpoints;
}
