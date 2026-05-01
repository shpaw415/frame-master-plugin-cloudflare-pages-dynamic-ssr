import type { EventContext } from "@cloudflare/workers-types";
import type { RequestContextData } from "../shared";

type RequestContextMiddleWare = Omit<RequestContextData, "loader">;

/**
 * Creates a middleware function that initializes the store provider in the request context. This middleware should be used at the same level as the provider to ensure that the store provider is available in the request context for the request handlers to interact with.
 *
 * @param providerInit - A function that takes the request context and returns a store provider instance. This function is called for each incoming request to initialize the store provider in the context.
 * @returns A middleware function that can be used in a Cloudflare Pages Function to set up the store provider in the request context.
 */
export function createMiddleware<MyEnv = unknown>(
	providerInit: (
		context: EventContext<MyEnv, never, RequestContextData>,
	) => RequestContextMiddleWare | Promise<RequestContextMiddleWare>,
) {
	return async (context: EventContext<MyEnv, never, RequestContextData>) => {
		context.data = (await providerInit(context)) as RequestContextData;
		return await context.next();
	};
}

export default createMiddleware;
