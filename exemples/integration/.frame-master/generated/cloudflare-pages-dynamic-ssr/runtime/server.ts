import { createElement } from "react";
import { renderToString } from "react-dom/server";

type ParseOutputContext = {
  routePath: string;
  pathname: string;
  params: Record<string, unknown>;
};

type RenderArgs = {
  context: {
    request: Request;
    params?: Record<string, unknown>;
  };
  routePath: string;
  clientScriptPath: string;
  mountSelector: string;
  payloadElementId: string;
  Page: unknown;
  parseOutput?: (html: string, ctx: ParseOutputContext) => string | Promise<string>;
  hydrationServerAdapter: (args: {
    pageHtml: string;
    payloadJson: string;
    payloadElementId: string;
    mountSelector: string;
    clientScriptPath: string;
  }) => string;
};

function escapeJsonForHtml(json: string): string {
  return json.replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/&/g, "\\u0026");
}

export async function renderDynamicPage(args: RenderArgs): Promise<Response> {
  const params = args.context.params ?? {};
  const pathname = new URL(args.context.request.url).pathname;
  const page = args.Page as (props: Record<string, unknown>) => unknown;

  const pageHtml = renderToString(createElement(page, { params, pathname }));
  const payloadJson = escapeJsonForHtml(JSON.stringify({ props: { params, pathname } }));

  const body = args.hydrationServerAdapter({
    pageHtml,
    payloadJson,
    payloadElementId: args.payloadElementId,
    mountSelector: args.mountSelector,
    clientScriptPath: args.clientScriptPath,
  });

	const htmlDoc = '<!doctype html><html><head><meta charset="utf-8" /></head><body>' + body + '</body></html>';
  const transformed = args.parseOutput
    ? await args.parseOutput(htmlDoc, {
        routePath: args.routePath,
        pathname,
        params,
      })
    : htmlDoc;

  return new Response(transformed, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  });
}
