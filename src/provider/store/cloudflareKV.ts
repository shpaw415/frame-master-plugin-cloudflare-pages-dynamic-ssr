import { createStoreProvider } from "../shared";

export type KVStoreProviderProps = {
	binding: KVNamespace;
	default_ttl?: number;
};

export default ({ binding, default_ttl }: KVStoreProviderProps) =>
	createStoreProvider<{ binding: KVNamespace }>({
		get: async (id, ctx) => {
			const value = await ctx.binding.get(id);
			return value;
		},
		set: async (id, value, ctx) => {
			await ctx.binding.put(
				id,
				value,
				default_ttl ? { expirationTtl: default_ttl } : undefined,
			);
		},
		delete: async (id, ctx) => {
			await ctx.binding.delete(id);
		},
		ctx: { binding },
	});
