import type { ReactToHtmlPluginOptions } from "frame-master-plugin-react-to-html";

const AsyncFallback: ReactToHtmlPluginOptions["asyncFallback"] = (props) => {
	return <div>Loading...</div>;
};

export default AsyncFallback;
