import { createElement } from "react";
import { hydrateRoot } from "react-dom/client";

export type ClientHydrationAdapterArgs = {
  Component: unknown;
  payload: Record<string, unknown>;
  mountElement: Element;
};

export default function defaultClientAdapter(args: ClientHydrationAdapterArgs): void {
  const component = args.Component as (props: Record<string, unknown>) => unknown;
  const props = (args.payload.props ?? {}) as Record<string, unknown>;
  hydrateRoot(args.mountElement, createElement(component, props));
}
