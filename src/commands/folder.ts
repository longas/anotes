import type { Command } from "commander";
import {
	createFolder,
	deleteFolder,
	folderInfo,
	listFolders,
} from "../lib/jxa/folders.js";
import { runJxa } from "../lib/osascript.js";

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

export function registerFolderCommand(program: Command): void {
	const folder = program.command("folder").description("Folder operations");

	folder
		.command("list")
		.description("List all folders")
		.action(async () => {
			try {
				const result = await runJxa(listFolders());
				output(result);
			} catch (e: unknown) {
				fail(errorMessage(e));
			}
		});

	folder
		.command("create <name>")
		.description("Create a folder")
		.action(async (name: string) => {
			try {
				const result = await runJxa(createFolder(name));
				output(result);
			} catch (e: unknown) {
				fail(errorMessage(e));
			}
		});

	folder
		.command("delete <name>")
		.description("Delete a folder")
		.action(async (name: string) => {
			try {
				const result = await runJxa(deleteFolder(name));
				output(result);
			} catch (e: unknown) {
				fail(errorMessage(e));
			}
		});

	folder
		.command("info <name>")
		.description("Show folder metadata")
		.action(async (name: string) => {
			try {
				const result = await runJxa(folderInfo(name));
				output(result);
			} catch (e: unknown) {
				fail(errorMessage(e));
			}
		});
}
