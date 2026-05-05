import { createStoreProvider } from "../shared";

/**
 * Cloudflare Pages provides a global `caches` object that allows you to store and retrieve responses. This provider uses the Cache API to implement a simple key-value store.
 *
 * **TTL (Time To Live) is not natively supported in the Cache API, so the page will cache only the time the cache stays alive and is determined by the cache eviction policies of Cloudflare, which are not guaranteed and can vary based on factors like cache size and traffic patterns.**
 *
 * @note The Cache API is designed for caching HTTP responses, so this implementation is a bit of a workaround to use it as a general key-value store. It may not be suitable for all use cases, especially if you need to store large amounts of data or require more complex querying capabilities.
 * @see https://developers.cloudflare.com/workers/runtime-apis/cache for more information on the Cache API in Cloudflare Pages.
 *
 */
export default createStoreProvider<{ cache: Cache }>({
	ctx: { cache: caches as unknown as Cache },
	get: async (id, ctx) => {
		const response = await ctx.cache.match(new Request(id));
		if (!response) return null;
		return response.text();
	},
	set: async (id, value, ctx) => {
		const response = new Response(value);
		await ctx.cache.put(id, response);
	},
	delete: async (id, ctx) => {
		await ctx.cache.delete(id);
	},
});
