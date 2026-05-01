import type { JSX } from "react";
import CustomEntryPoints from "dynamic-ssr:entrypoints";

export const NextJsStyleLayoutSetup = {
	/**
	 * Set this matcher to identify layout files in the custom entry points.
	 */
	regex: /^(.*)\/layout\.(js|ts|jsx|tsx)$/,
	/**
	 * Given a pathname and a list of layout paths, return the layouts that match the pathname in a Next.js style.
	 */
	getLayouts(pathname: string, layoutsPaths: string[]) {
		const segments = ["", ...pathname.split("/").filter(Boolean)];
		const possibleLayoutPaths = segments.reduce<string[]>((acc, _, index) => {
			const layoutPath = `${segments.slice(0, index + 1).join("/")}/layout`;
			acc.push(
				`${layoutPath}.js`,
				`${layoutPath}.ts`,
				`${layoutPath}.jsx`,
				`${layoutPath}.tsx`,
			);
			return acc;
		}, []);
		return possibleLayoutPaths
			.map((lp) => lp.slice(1))
			.filter((layoutPath) => layoutsPaths.includes(layoutPath));
	},
	/**
	 * Given a list of layout paths, the custom entry points, and the page component, return the page wrapped in the layouts in a Next.js style.
	 */
	stackLayouts(
		layouts: string[],
		customEntryPoints: Record<string, any>,
		children: JSX.Element,
	) {
		return layouts.reduceRight((acc, layoutPath) => {
			const LayoutComponent = customEntryPoints[layoutPath]
				?.default as (props: { children: JSX.Element }) => JSX.Element;
			return LayoutComponent ? LayoutComponent({ children: acc }) : acc;
		}, children);
	},
	/**
	 * The main function to be used in the application. It takes the children and the pathname, gets the layouts that match the pathname, and returns the children wrapped in the layouts.
	 */
	PageWrapper({
		children,
		pathname,
	}: {
		children: JSX.Element;
		pathname: string;
	}) {
		const customEntryPointsPaths = Object.keys(CustomEntryPoints);
		const layouts = this.getLayouts(pathname, customEntryPointsPaths);
		return this.stackLayouts(layouts, CustomEntryPoints, children);
	},
} as const;
