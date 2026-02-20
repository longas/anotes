import { execFile } from "node:child_process";

const DEFAULT_TIMEOUT = 10_000;

export interface OsascriptOptions {
	timeout?: number;
}

/**
 * Execute a JXA script via osascript and return parsed JSON result.
 */
export async function runJxa<T = unknown>(
	script: string,
	options: OsascriptOptions = {},
): Promise<T> {
	const timeout = options.timeout ?? DEFAULT_TIMEOUT;

	return new Promise<T>((resolve, reject) => {
		execFile(
			"osascript",
			["-l", "JavaScript", "-e", script],
			{ timeout },
			(error, stdout, stderr) => {
				if (error) {
					const msg = stderr.trim() || error.message;
					reject(new Error(msg));
					return;
				}

				const raw = stdout.trim();
				if (!raw) {
					resolve(undefined as T);
					return;
				}

				try {
					resolve(JSON.parse(raw) as T);
				} catch {
					reject(new Error(`Failed to parse osascript output: ${raw}`));
				}
			},
		);
	});
}

/**
 * Escape a string for safe interpolation inside a JXA script (JS string literal).
 */
export function escapeJxa(value: string): string {
	return value
		.replace(/\\/g, "\\\\")
		.replace(/'/g, "\\'")
		.replace(/"/g, '\\"')
		.replace(/\n/g, "\\n")
		.replace(/\r/g, "\\r")
		.replace(/\t/g, "\\t");
}
