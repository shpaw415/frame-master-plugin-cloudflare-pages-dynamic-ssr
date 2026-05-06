import { useContext } from "react";
import type { LoaderValue } from "../provider/shared";
import { CtxContext, LoaderManager, type PluginEventContext } from "../server";
import { PropsContext } from "./context";

export function useLoader<Loader extends LoaderManager<T>, T>(
	loader: Loader,
): LoaderValue<ReturnType<Loader["props"]["callback"]>> | null {
	const ctx = useContext(CtxContext);
	const props = useContext(PropsContext);

	if (typeof window === "undefined") {
		return (ctx as PluginEventContext)?.data?.loader?.get(loader) as never;
	}

	if (loader instanceof LoaderManager) {
		throw new Error(
			[
				"Oups! This error may occur for these cases:",
				"1. The loader is not exported.",
				"2. The loader variable name does not starts with loader_.",
				"3. The loader is not in the same file as the component that uses it.",
				'4. The current file does not use the "use dynamic" directive, which is required to use the loader.',
			].join("\n"),
		);
	}

	// the bundler LoaderManager with the data fetcher.
	return props?.find((prop) => prop.name === loader.name)?.data as never;
}

export function useRequestContext<Env, P extends string, Data>() {
	const ctx = useContext(CtxContext);
	return ctx as PluginEventContext<Env, P, Data>;
}
