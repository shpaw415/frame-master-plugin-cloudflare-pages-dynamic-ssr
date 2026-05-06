import type { JSX } from "react";
import { NextJsStyleLayoutSetup } from "../../../src/utils/index.tsx";
import Shell from "../shell";

export function PageWrapper({
	children,
	pathname,
}: {
	children: JSX.Element;
	pathname: string;
}) {
	return (
		<Shell>
			<script src="/@apply-react/client-hydrate.js" type="module" />
			{NextJsStyleLayoutSetup.PageWrapper({
				children,
				pathname,
			})}
		</Shell>
	);
}
