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
					`Loader with name ${manager.name} not found for pathname ${pathname}`,
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
