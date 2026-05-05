import { createStoreProvider } from "../shared";

type MyCtx = { db: D1Database };

/**
 * Creates a store provider that uses a D1 database for storage.
 *
 * This provider implements the `get`, `set`, and `delete` methods to interact
 * with a D1 database. It assumes there is a table named `cache` with columns
 * `key` (TEXT PRIMARY KEY) and `value` (TEXT).
 *
 * @param db_binding - The D1 database binding to use for storage operations.
 * @returns A store provider object that can be used with the plugin's data management system.
 *
 * @note Make sure to initialize the D1 database with the appropriate schema before using this provider. You can use the `D1Init` function provided below to create the necessary table if it doesn't exist.
 */
export default function D1Adatpter(db_binding: D1Database) {
	return createStoreProvider<MyCtx>({
		ctx: { db: db_binding },

		async get(key, { db }) {
			const row = await db
				.prepare("SELECT value FROM cache WHERE key = ?")
				.bind(key)
				.first<{ value: string }>();
			return row?.value ?? null;
		},

		async set(key, value, { db }) {
			await db
				.prepare("INSERT OR REPLACE INTO cache (key, value) VALUES (?, ?)")
				.bind(key, value)
				.run();
		},

		async delete(key, { db }) {
			await db.prepare("DELETE FROM cache WHERE key = ?").bind(key).run();
		},
	});
}

/**
 * Initializes the D1 database by creating the necessary table if it doesn't exist.
 *
 * @param db_binding - The D1 database binding to initialize.
 * @returns A promise that resolves when the initialization is complete.
 */
export function D1Init(db_binding: D1Database) {
	return db_binding
		.prepare(
			"CREATE TABLE IF NOT EXISTS cache (key TEXT PRIMARY KEY, value TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)",
		)
		.run();
}
