import { RouterHost } from "frame-master-plugin-apply-react/router";
import { type JSX, StrictMode, useRef, useState } from "react";
import { SSRPropsProvider } from "../../src/client/context";
import type { PropsData } from "../../src/provider/shared";

export default function ClientShell({ children }: { children: JSX.Element }) {
	const routeChangePromiseRef = useRef<Promise<Array<PropsData> | null> | null>(
		null,
	);
	const [pathname, setPathname] = useState(window.location.pathname);

	const [devKey, setDevKey] = useState(0);

	return (
		<StrictMode>
			<SSRPropsProvider
				pathname={pathname}
				promiseRef={routeChangePromiseRef}
				devKey={devKey}
			>
				<RouterHost
					onRouteChange={async (match) => {
						setPathname(match.pathname);
						if (process.env.NODE_ENV === "development") {
							setDevKey((prev) => prev + 1);
						}
						await routeChangePromiseRef.current;
					}}
				>
					{children}
				</RouterHost>
			</SSRPropsProvider>
		</StrictMode>
	);
}
