export type ServerHydrationAdapterArgs = {
	pageHtml: string;
	payloadJson: string;
	payloadElementId: string;
	mountSelector: string;
	clientScriptPath: string;
};

function mountIdFromSelector(selector: string): string {
	return selector.startsWith("#") ? selector.slice(1) : selector;
}

export default function customServerAdapter(
	args: ServerHydrationAdapterArgs,
): string {
	const mountId = mountIdFromSelector(args.mountSelector);

	return [
		`<div id="${mountId}" data-hydration="custom" data-client-script="${args.clientScriptPath}">${args.pageHtml}</div>`,
		`<script id="${args.payloadElementId}" type="application/json">${args.payloadJson}</script>`,
		`<script type="module" src="${args.clientScriptPath}" data-hydration="custom"></script>`,
	].join("");
}