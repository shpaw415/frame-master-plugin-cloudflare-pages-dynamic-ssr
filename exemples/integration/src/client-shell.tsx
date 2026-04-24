import { RouterHost } from "frame-master-plugin-apply-react/router";
import { type JSX, StrictMode } from "react";

export default function ClientShell({ children }: { children: JSX.Element }) {
	return (
		<StrictMode>
			<RouterHost>{children}</RouterHost>
		</StrictMode>
	);
}
