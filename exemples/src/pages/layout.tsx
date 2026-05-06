import { useState } from "react";

export default function MainLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const [count, setCount] = useState(0);

	return (
		<div>
			<h1>Main Layout {count}</h1>
			{children}
			<h1>Main Layout</h1>
			<button type="button" onClick={() => setCount((c) => c + 1)}>
				Increment
			</button>
		</div>
	);
}
