import type { JSX } from "react";

export type StoreType = {
	pathname: string;
	module: string;
	html: string;
	expiresAt?: number;
};

export type StoreProvider = {
	get: (pathname: string) => Promise<StoreType | null>;
	set: (
		pathname: string,
		value: { default: () => JSX.Element | Promise<JSX.Element> },
		ttl?: number,
	) => Promise<StoreType>;
	delete: (pathname: string) => Promise<void>;
};

export type RequestContextData = {
	storeProvider: StoreProvider;
	parser?: Partial<{
		html: (htmlString: string) => string;
		module: (moduleString: string, module: Record<string, unknown>) => string;
	}>;
};

type FuncType = () => Promise<Response> | Response;

export type RequestHandlerContructor<ReturnType extends FuncType> = (props: {
	storeProvider: StoreProvider;
}) => ReturnType;

export type ServerProviderProps<
	get extends FuncType,
	post extends FuncType,
	del extends FuncType,
> = {
	storeProvider: StoreProvider;
	routeModule: Record<string, () => Promise<JSX.Element> | JSX.Element>;
	requestHandler: {
		onGetRequest: RequestHandlerContructor<get>;
		onPostRequest: RequestHandlerContructor<post>;
		onDeleteRequest: RequestHandlerContructor<del>;
	};
};

export function toStore({ pathname, module, html }: StoreType) {
	const store: StoreType = {
		pathname,
		module: btoa(module),
		html: btoa(html),
	};
	return JSON.stringify(store);
}
export function fromStore(storeString: string): StoreType {
	const store: StoreType = JSON.parse(storeString);
	return {
		pathname: store.pathname,
		module: atob(store.module),
		html: atob(store.html),
	};
}

export async function transpileModuleToJavaScript(moduleSource: string) {
	const { transform } = await import("@babel/standalone");
	const result = transform(moduleSource, {
		presets: [["react", { runtime: "automatic" }]],
		sourceType: "module",
		comments: false,
		compact: true,
	});

	if (!result?.code) {
		throw new Error("Failed to transpile the dynamic page module");
	}

	return result.code;
}

export function createServerProvider<
	get extends FuncType,
	post extends FuncType,
	del extends FuncType,
>(params: ServerProviderProps<get, post, del>) {
	return {
		storeProvider: params.storeProvider,
		routeModule: params.routeModule,
		requestHandler: {
			onGetRequest: params.requestHandler.onGetRequest({
				storeProvider: params.storeProvider,
			}),
			onPostRequest: params.requestHandler.onPostRequest({
				storeProvider: params.storeProvider,
			}),
			onDeleteRequest: params.requestHandler.onDeleteRequest({
				storeProvider: params.storeProvider,
			}),
		},
	};
}

export function createStoreProvider<
	Ctx extends Record<string, unknown>,
>(params: {
	get: (pathname: string, ctx: Ctx) => Promise<string | null>;
	set: (pathname: string, value: string, ctx: Ctx) => Promise<void>;
	delete: (pathname: string, ctx: Ctx) => Promise<void>;
	ctx: Ctx;
}): StoreProvider {
	const _delete = async (pathname: string) => {
		await params.delete(pathname, params.ctx);
	};

	const _get = async (pathname: string) => {
		const storeString = await params.get(pathname, params.ctx);
		if (storeString === null) {
			return null;
		}
		const values = fromStore(storeString);

		if (values.expiresAt && values.expiresAt < Date.now()) {
			await _delete(pathname);
			return null;
		}

		return values;
	};
	const _set = async (
		pathname: string,
		module: { default: () => JSX.Element | Promise<JSX.Element> },
		ttl?: number,
	) => {
		const page = module.default;
		const pageElement = await page();
		const toJSXString = (
			(await import("react-element-to-jsx-string"))
				.default as unknown as typeof import("react-element-to-jsx-string")
		).default;
		const jsxString = toJSXString(pageElement, {
			showFunctions: true,
		});
		const moduleString = await transpileModuleToJavaScript(
			`export default function DynamicPage() { return (${jsxString}); }`,
		);
		const { renderToString } = await import("react-dom/server");
		const dataToStore = {
			pathname: pathname,
			module: moduleString,
			html: renderToString(pageElement),
			expiresAt: Date.now() + (ttl ?? 60 * 60 * 24) * 1000, // default TTL of 1 day
		};

		await params.set(pathname, toStore(dataToStore), params.ctx);
		return dataToStore;
	};

	return {
		get: _get,
		set: _set,
		delete: _delete,
	};
}
