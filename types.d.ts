declare module "dynamic-ssr:entrypoints" {
	const entrypoints: Record<string, Record<string, unknown>>;
	export default entrypoints;
}

declare module "@dynamic-ssr-endpoints" {
	const endpoints: string[];
	export default endpoints;
}
