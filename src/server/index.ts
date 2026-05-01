import { createContext } from "react";
import type { RequestContextData } from "../provider/shared";

export type LoaderProps<T> = {
	/**
	 * Optional name for the loader. If not provided, the name of the variable will be used as the loader name.
	 */
	name?: string;
	/**
	 * *Internal*
	 */
	pathname?: string;
	/**
	 * Callback function that will be called on the server to fetch data for the loader. It receives the event context as a parameter and should return a promise that resolves to the data to be passed to the component. The data returned by this function will be stored in the context and can be accessed by the component using the useLoader hook.
	 */
	callback: (ctx: PluginEventContext) => Promise<T>; // Fonction qui retourne une promesse d'un composant JSX
};

export class LoaderManager<T> {
	public props: LoaderProps<T>;
	public name?: string;
	public pathname?: string;
	constructor(props: LoaderProps<T>) {
		this.props = props;
		this.name = props.name;
		this.pathname = props.pathname;
	}
}

export function createLoader<T>(
	props: Omit<LoaderProps<T>, "pathname">,
): LoaderManager<T> {
	return new LoaderManager(props);
}

export type PluginEventContext<
	Env = unknown,
	Params extends string = string,
	Data = unknown,
> = EventContext<{ NODE_ENV: string } & Env, Params, RequestContextData & Data>;

//export const ServerLoaderContext = createContext();
export const CtxContext = createContext<PluginEventContext | null>(null);
