import { createContext } from "react";
import type { RequestContextData } from "../provider/shared";

export type LoaderProps<T> = {
	/**
	 * name for the loader. must be unique across the application. This name will be used to identify the loader in the context and to fetch the data for the component using the useLoader hook.
	 */
	name: string;
	/**
	 * Callback function that will be called on the server to fetch data for the loader. It receives the event context as a parameter and should return a promise that resolves to the data to be passed to the component. The data returned by this function will be stored in the context and can be accessed by the component using the useLoader hook.
	 */
	callback: (ctx: PluginEventContext) => Promise<T>; // Fonction qui retourne une promesse d'un composant JSX
};

export class LoaderManager<T> {
	public props: LoaderProps<T>;
	public name: string;
	constructor(props: LoaderProps<T>) {
		this.props = props;
		this.name = props.name;
	}
}

/**
 * Defines a server-side data loader for a dynamic page.
 *
 * The loader `callback` runs exclusively on the server. At build time the plugin
 * strips the callback from the client bundle and replaces the export with a
 * lightweight metadata object `{ name, pathname }` so no server code is ever
 * shipped to the browser.
 *
 * The variable **must** be exported and its name **must** start with `loader_`
 * so the plugin can discover it automatically.
 *
 * @param props - Loader configuration.
 * @param props.name - Unique identifier for this loader within the page file.
 *   Used by `useLoader()` to look up the result.
 * @param props.callback - Async function executed server-side that returns the
 *   data to be made available via `useLoader()`. Receives the full
 *   `PluginEventContext` (route params, env bindings, request, etc.).
 * @returns A `LoaderManager<T>` instance. Pass the exported variable directly
 *   to `useLoader()`.
 *
 * @example
 * ```typescript
 * export const loader_user = createLoader({
 *   name: "user",
 *   async callback(ctx: PluginEventContext<Env, "id", unknown>) {
 *     return fetchUser(ctx.params.id, ctx.env.DB);
 *   },
 * });
 * ```
 */
export function createLoader<T>(
	props: Omit<LoaderProps<T>, "pathname">,
): LoaderManager<T> {
	return new LoaderManager(props);
}

export type PluginEventContext<
	Env = unknown,
	Params extends string = string,
	Data = unknown,
> = EventContext<
	{ NODE_ENV: string } & Env & Cloudflare.Env,
	Params,
	RequestContextData & Data
>;

export const CtxContext = createContext<PluginEventContext | null>(null);

// Page config Section ----------------------------------------------------
export type SSRPageConfigProps = {
	callback: (ctx: PluginEventContext) => SSRPageConfig | Promise<SSRPageConfig>;
};

export type SSRPageConfig = {
	/** Time-to-live in seconds for both the rendered HTML and the loader props. Defaults to 86400 (24 hours) when omitted. */
	ttl?: number;
	/**
	 * Whether to skip caching for this page. Defaults to false.
	 * Useful for pages that should always fetch fresh data, such as admin pages or pages with frequently changing content.
	 **/
	skipCache?: boolean;
};

export class PageConfigManager {
	public configs: SSRPageConfigProps;
	constructor(config: SSRPageConfigProps) {
		this.configs = config;
	}
	async getConfigs(ctx: PluginEventContext) {
		return this.configs.callback(ctx);
	}
}

/**
 * Configures server-side caching behaviour for a dynamic page.
 *
 * The export **must** be named exactly `ssr_configs`. The plugin reads this
 * export at request time to determine the TTL before storing the rendered HTML
 * and loader props in the cache.
 *
 * @param config - Page configuration.
 * @param config.callback - Function called on every cache-miss request that
 *   returns the cache settings for the current page. Receives the full
 *   `PluginEventContext` so settings can vary per request (e.g. based on
 *   route params or env).
 * @param config.callback.return.ttl - Time-to-live in **seconds** for both the
 *   rendered HTML and the loader props. Defaults to `86400` (24 hours) when
 *   omitted.
 * @returns A `PageConfigManager` instance consumed internally by the generated
 *   request handler.
 *
 * @example
 * ```typescript
 * export const ssr_configs = createPageConfig({
 *   callback(ctx) {
 *     return { ttl: 60 }; // cache this page for 60 seconds
 *   },
 * });
 * ```
 */
export function createPageConfig(config: SSRPageConfigProps) {
	return new PageConfigManager(config);
}
