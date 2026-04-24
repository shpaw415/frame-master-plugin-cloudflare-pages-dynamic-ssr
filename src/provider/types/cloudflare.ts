declare namespace Cloudflare {
	interface Env {
		DYNAMIC_PAGE_KV: KVNamespace;
		__PLUGIN_NODE_ENV__: string;
	}
}
interface Env extends Cloudflare.Env {}
