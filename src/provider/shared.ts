import type { JSX } from "react";
import Wrapper from "../server/wrapper";
import type { PluginEventContext } from "../server";
import { LoaderManager } from "../server";

export type LoaderValue<T> = Awaited<
	ReturnType<LoaderManager<T>["props"]["callback"]>
>;

export type StoreType = {
	pathname: string;
	data: string | Array<PropsData>;
	expiresAt?: number;
};

export type Parsers = {
	/**
	 * A function that takes a React element and returns a modified React element. This can be used to wrap the page element with additional context providers, layout components, or to modify the props of the page element before it is rendered to a string and stored in the provider.
	 */
	jsx: (pathname: string, pageElement: JSX.Element) => JSX.Element;
};

export type StoreProvider = {
	get: {
		page: (pathname: string) => Promise<StoreType | null>;
		props: (pathname: string) => Promise<StoreType | null>;
	};
	set: (props: {
		pathname: string;
		module: { default: () => JSX.Element | Promise<JSX.Element> };
		parser?: Partial<Parsers>;
		/**
		 * Time to live in seconds
		 *
		 * @default 86400 (1 day)
		 */
		ttl?: number;
		ctx: PluginEventContext;
	}) => Promise<{ html: StoreType; props: StoreType }>;
	delete: (pathname: string) => Promise<void>;
};

export type loaderType = {
	get: <T = unknown>(props: LoaderManager<T>) => T;
};

export type RequestContextData = {
	storeProvider: StoreProvider;
	parser?: Partial<Parsers>;
	loader: loaderType;
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

export type PropsData = {
	name: string;
	data: unknown;
	pathname: string;
};

export function toStore(data: StoreType): string {
	return JSON.stringify(data);
}
export function fromStore<T extends StoreType>(storeString: string): T {
	return JSON.parse(storeString) as T;
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
	get: (key: string, ctx: Ctx) => Promise<string | null>;
	set: (key: string, value: string, ctx: Ctx) => Promise<void>;
	delete: (key: string, ctx: Ctx) => Promise<void>;
	ctx: Ctx;
}): StoreProvider {
	const _delete = async (pathname: string) => {
		await params.delete(pathname, params.ctx);
	};

	const _getStoreData = async (pathname: string): Promise<StoreType | null> => {
		const storeString = await params.get(pathname, params.ctx);
		if (storeString === null) {
			return null;
		}
		const values = fromStore<StoreType>(storeString);

		if (values.expiresAt && values.expiresAt < Date.now()) {
			await _delete(pathname);
			return null;
		}

		return values;
	};
	const _getStorePropsData = async (
		pathname: string,
	): Promise<StoreType | null> => {
		const storeString = await params.get(`props::${pathname}`, params.ctx);
		if (storeString === null) return null;
		const values = fromStore<StoreType>(storeString);
		return values;
	};
	const _setStorePropsData = async (pathname: string, value: StoreType) => {
		await params.set(`props::${pathname}`, toStore(value), params.ctx);
	};

	const _set: StoreProvider["set"] = async ({
		pathname,
		module,
		parser,
		ttl,
		ctx,
	}) => {
		const page = module.default;

		const LoadersReturnValues: Array<PropsData> = await Promise.all(
			(
				Object.entries(module).filter(
					([, exp]) => exp instanceof LoaderManager,
				) as unknown as Array<[string, LoaderManager<unknown>]>
			).map(([name, loader]) =>
				loader.props.callback(ctx).then((data) => ({ name, data, pathname })),
			),
		);

		const pageElement = Wrapper({
			children: await page(),
			ctx,
			propsData: LoadersReturnValues,
		});

		const { renderToString } = await import("react-dom/server");

		const expiresAt = Date.now() + (ttl ?? 60 * 60 * 24) * 1000; // default TTL of 1 day

		const dataToStore: StoreType = {
			pathname,
			data: renderToString(parser?.jsx?.(pathname, pageElement) ?? pageElement),
			expiresAt,
		};
		const propsDataToStore: StoreType = {
			pathname,
			data: LoadersReturnValues,
			expiresAt,
		};

		await Promise.all([
			params.set(pathname, toStore(dataToStore), params.ctx),
			_setStorePropsData(pathname, propsDataToStore),
		]);

		return { html: dataToStore, props: propsDataToStore };
	};

	return {
		get: {
			page: _getStoreData,
			props: _getStorePropsData,
		},
		set: _set,
		delete: _delete,
	};
}
