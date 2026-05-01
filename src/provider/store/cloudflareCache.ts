import "../types/cloudflare";
import { createStoreProvider } from "../shared";

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
