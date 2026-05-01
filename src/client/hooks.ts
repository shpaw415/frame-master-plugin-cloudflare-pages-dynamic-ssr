import { useContext } from "react";
import {
	type LoaderManager,
	CtxContext,
	type PluginEventContext,
} from "../server";
import type { LoaderValue } from "../provider/shared";

export function useLoader<Loader extends LoaderManager<T>, T>(
	loader: Loader,
): LoaderValue<ReturnType<Loader["props"]["callback"]>> {
	const ctx = useContext(CtxContext);

	if (typeof window === "undefined") {
		return (ctx as PluginEventContext).data.loader.get<
			Loader["props"]["callback"]
		>(loader) as unknown as LoaderValue<Loader["props"]["callback"]>;
	}
	// the bundler LoaderManager with the data fetcher.
	return loader as unknown as LoaderValue<Loader["props"]["callback"]>;
}
