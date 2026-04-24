import type { JSX } from "react";

export default function Shell({ children }: { children: JSX.Element }) {
	return (
		<html lang="en">
			<head>
				<meta charSet="UTF-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<title>Dynamic SSR Shell</title>
			</head>
			<body id="root">{children}</body>
		</html>
	);
}
