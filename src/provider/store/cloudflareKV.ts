import "../types/cloudflare";
import { createStoreProvider } from "../shared";

export default (kv: KVNamespace) =>
	createStoreProvider<{ kv: KVNamespace }>({
		get: async (id, ctx) => {
			const value = await ctx.kv.get(id);
			return value;
		},
		set: async (id, value, ctx) => {
			await ctx.kv.put(id, value);
		},
		delete: async (id, ctx) => {
			await ctx.kv.delete(id);
		},
		ctx: { kv },
	});
