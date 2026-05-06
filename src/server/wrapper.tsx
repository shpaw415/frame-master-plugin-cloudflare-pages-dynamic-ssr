import type { JSX } from "react";
import type { PropsData } from "../provider/shared";
import { CtxContext, type PluginEventContext } from "./";

export default function Wrapper({
	Children,
	ctx,
	propsData,
	pathname,
}: {
	Children: () => JSX.Element;
	ctx: PluginEventContext;
	propsData: Array<PropsData>;
	pathname: string;
}) {
	ctx.data.loader = {
		get(manager) {
			const prop = propsData.find(
				(prop) => prop.name === manager.name && prop.pathname === pathname,
			);
			if (!prop) {
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
			return prop.data as unknown as Awaited<
				ReturnType<typeof manager.props.callback>
			>;
		},
	};

	return (
		<CtxContext.Provider value={ctx}>
			<Children />
		</CtxContext.Provider>
	);
}
