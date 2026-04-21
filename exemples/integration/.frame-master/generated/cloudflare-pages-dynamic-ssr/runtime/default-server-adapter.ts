export type ServerHydrationAdapterArgs = {
  pageHtml: string;
  payloadJson: string;
  payloadElementId: string;
  mountSelector: string;
  clientScriptPath: string;
};

export default function defaultServerAdapter(args: ServerHydrationAdapterArgs): string {
  return [
		`<div id="${args.mountSelector.slice(1)}">${args.pageHtml}</div>`,
		`<script id="${args.payloadElementId}" type="application/json">${args.payloadJson}</script>`,
		`<script type="module" src="${args.clientScriptPath}"></script>`,
	].join("");
}
