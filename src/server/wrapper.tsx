import type { JSX } from "react";
import { CtxContext, type PluginEventContext } from "./";
import type { PropsData } from "../provider/shared";

export default function Wrapper({
	children,
	ctx,
	propsData,
}: {
	children: JSX.Element;
	ctx: PluginEventContext;
	propsData: Array<PropsData>;
}) {
	ctx.data.loader = {
		get(manager) {
			const prop = propsData.find(
				(prop) =>
					prop.name === manager.name && prop.pathname === manager.pathname,
			);
			if (!prop) {
				throw new Error(
					`Loader with name ${manager.name} not found for pathname ${manager.pathname}`,
				);
			}
			return prop.data as unknown as Awaited<
				ReturnType<typeof manager.props.callback>
			>;
		},
	};

	return <CtxContext.Provider value={ctx}>{children}</CtxContext.Provider>;
}
