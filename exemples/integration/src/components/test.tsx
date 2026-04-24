import { useState } from "react";

export function TestComponent() {
	const [data, setData] = useState<number>(0);
	return (
		<button onClick={() => setData((c) => c + 1)} type="button">
			Test button {data}
		</button>
	);
}
