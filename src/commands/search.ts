import type { Command } from "commander";
import { searchNotes } from "../lib/jxa/notes.js";
import { runJxa } from "../lib/osascript.js";

function parseIntOption(value: string): number {
	const n = parseInt(value, 10);
	if (Number.isNaN(n)) throw new Error(`"${value}" is not a number`);
	return n;
}

function output(data: unknown): void {
	process.stdout.write(`${JSON.stringify(data, null, 2)}\n`);
}

function errorMessage(e: unknown): string {
	return e instanceof Error ? e.message : String(e);
}

function fail(message: string): never {
	process.stdout.write(`${JSON.stringify({ error: message })}\n`);
	process.exit(1);
}

export function registerSearchCommand(program: Command): void {
	program
		.command("search <query>")
		.description("Search notes by title/content")
		.option("--folder <name>", "Filter by folder")
		.option("--limit <n>", "Limit number of results", parseIntOption)
		.action(async (query: string, opts) => {
			try {
				const result = await runJxa(
					searchNotes({ query, folder: opts.folder, limit: opts.limit }),
				);
				output(result);
			} catch (e: unknown) {
				fail(errorMessage(e));
			}
		});
}
