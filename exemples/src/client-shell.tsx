import { RouterHost } from "frame-master-plugin-apply-react/router";
import type { router } from "frame-master-plugin-apply-react/utils";
import { type JSX, StrictMode, useRef, useState } from "react";
import { SSRPropsProvider } from "../../src/client/context";
import type { PropsData } from "../../src/provider/shared";

export default function ClientShell({ children }: { children: JSX.Element }) {
	const routeChangePromiseRef = useRef<
		ReturnType<typeof Promise.withResolvers<Array<PropsData> | null>>
	>(Promise.withResolvers<Array<PropsData> | null>());
	const resetRouteChangePromise = () => {
		routeChangePromiseRef.current.resolve?.(null);
		routeChangePromiseRef.current =
			Promise.withResolvers<Array<PropsData> | null>();
	};
	const [pathname, setPathname] = useState(window.location.pathname);
	const matched = useRef<ReturnType<typeof router.match>>(null);

	const [devKey, setDevKey] = useState(0);

	return (
		<StrictMode>
			<SSRPropsProvider
				pathname={pathname}
				afterFetchCallback={resetRouteChangePromise}
				devKey={devKey}
				fetchCallback={(_pn, dynamicEndpoints) => {
					const res = Boolean(
						matched.current?.name &&
							dynamicEndpoints.includes(matched.current.name),
					);
					if (!res) resetRouteChangePromise();
					return res;
				}}
			>
				<RouterHost
					onRouteChange={async (match) => {
						matched.current = match;
						setPathname(match.pathname);
						if (process.env.NODE_ENV === "development") {
							setDevKey((prev) => prev + 1);
						}
						await routeChangePromiseRef.current.promise;
					}}
				>
					{children}
				</RouterHost>
			</SSRPropsProvider>
		</StrictMode>
	);
}
