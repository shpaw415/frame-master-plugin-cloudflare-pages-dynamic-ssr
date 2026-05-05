import { useContext } from "react";
import type { LoaderValue } from "../provider/shared";
import {
	CtxContext,
	type LoaderManager,
	type PluginEventContext,
} from "../server";
import { PropsContext } from "./context";

export function useLoader<Loader extends LoaderManager<T>, T>(
	loader: Loader,
): LoaderValue<ReturnType<Loader["props"]["callback"]>> | null {
	const ctx = useContext(CtxContext);
	const props = useContext(PropsContext);

	if (typeof window === "undefined") {
		return (ctx as PluginEventContext)?.data?.loader?.get(loader) as never;
	}

	// the bundler LoaderManager with the data fetcher.
	return props?.find((prop) => prop.name === loader.name)?.data as never;
}

export function useRequestContext<Env, P extends string, Data>() {
	const ctx = useContext(CtxContext);
	return ctx as PluginEventContext<Env, P, Data>;
}
