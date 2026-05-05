import { createContext, useCallback, useEffect, useRef, useState } from "react";
import type { PropsData } from "../provider/shared";

declare global {
	interface Window {
		__PROVIDER_PROPS__: Array<PropsData> | null;
		__PROVIDER_EXPIRES_AT__: number | null;
	}
	var __PROPS_CONTEXT__: React.Context<PropsData[] | null>;
}

globalThis.__PROPS_CONTEXT__ ??= createContext<Array<PropsData> | null>(null);

export const PropsContext = globalThis.__PROPS_CONTEXT__;

export type SSRPropsProviderProps = {
	pathname: string;
	children: React.ReactNode;
	/**
	 * A ref to store the promise of the current route change, so that it can be awaited.
	 *
	 * - resolve after the props for the new route are fetched and set in the context.
	 */
	promiseRef?: React.RefObject<Promise<Array<PropsData> | null> | null>;
	/**
	 * A to burst the cache of the loader, can be used in development to always fetch fresh data without caching.
	 */
	devKey?: number;
};

export function SSRPropsProvider({
	pathname,
	children,
	promiseRef,
	devKey,
}: SSRPropsProviderProps) {
	const firstLoadPathnameRef = useRef(pathname);
	const [props, setProps] = useState<Array<PropsData> | null>(() => {
		const propsScript = document.getElementById("__PROVIDER_PROPS__");
		if (propsScript) {
			propsScript.remove();
		}
		return window.__PROVIDER_PROPS__;
	});

	const fetchProps = useCallback(
		(pathname: string) => {
			const fetchPromise = fetch(pathname, {
				headers: {
					accept: "application/vnd.ssr.props+json",
				},
			})
				.then((res) => res.json() as Promise<{ data: Array<PropsData> }>)
				.then((res) => {
					setProps(res.data);
					return res.data;
				})
				.catch((err) => {
					console.error("Failed to fetch props for pathname:", pathname, err);
					setProps(null);
					return null;
				});
			if (promiseRef) {
				promiseRef.current = fetchPromise;
			}
		},
		[promiseRef],
	);

	useEffect(() => {
		devKey; // include devKey in the dependency array to refetch props when it changes
		if (pathname !== firstLoadPathnameRef.current) {
			fetchProps(pathname);
		}
	}, [pathname, fetchProps, devKey]);

	return (
		<PropsContext.Provider value={props}>{children}</PropsContext.Provider>
	);
}
