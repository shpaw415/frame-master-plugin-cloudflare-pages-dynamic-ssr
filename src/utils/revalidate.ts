import type { EventContext } from "@cloudflare/workers-types";
import type { PluginEventContext } from "../server";

/**
 * Revalidates the cache for a specific pathname.
 * This function can be used in the server-side code to invalidate the cached props for a specific route, forcing the next request to fetch fresh data using the loader callback.
 * @note This is useful when you know that the data for a specific route has changed and you want to ensure that users see the most up-to-date information without waiting for the cache to expire naturally.
 */
export function revalidate<
	Env = unknown,
	P extends string = string,
	Data = unknown,
>(pathname: string, ctx: EventContext<Env, P, Data>): Promise<void> {
	return (ctx as unknown as PluginEventContext).data.storeProvider.delete(
		pathname,
	);
}
