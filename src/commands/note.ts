import type { Command } from "commander";
import { htmlToMarkdown, markdownToHtml } from "../lib/html.js";
import {
	appendNote,
	countNotes,
	createNote,
	deleteNote,
	editNote,
	listNotes,
	moveNote,
	noteInfo,
	prependNote,
	readNote,
	renameNote,
} from "../lib/jxa/notes.js";
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

interface ReadNoteResult {
	id: string;
	name: string;
	folder: string;
	body: string;
	creationDate: string;
	modificationDate: string;
}

export function registerNoteCommand(program: Command): void {
	const note = program.command("note").description("Note operations");

	note
		.command("list")
		.description("List notes")
		.option("--folder <name>", "Filter by folder")
		.option("--limit <n>", "Limit number of results", parseIntOption)
		.action(async (opts) => {
			try {
				const result = await runJxa(
					listNotes({ folder: opts.folder, limit: opts.limit }),
				);
				output(result);
			} catch (e: unknown) {
				fail(errorMessage(e));
			}
		});

	note
		.command("read <name>")
		.description("Read a note (body returned as Markdown)")
		.option("--folder <name>", "Specify folder")
		.action(async (name: string, opts) => {
			try {
				const result = await runJxa<ReadNoteResult>(
					readNote({ name, folder: opts.folder }),
				);
				result.body = htmlToMarkdown(result.body);
				output(result);
			} catch (e: unknown) {
				fail(errorMessage(e));
			}
		});

	note
		.command("create <name>")
		.description("Create a new note")
		.option("--folder <name>", "Target folder")
		.option("--body <markdown>", "Note body (Markdown)")
		.action(async (name: string, opts) => {
			try {
				const body = opts.body ? markdownToHtml(opts.body) : undefined;
				const result = await runJxa(
					createNote({ name, folder: opts.folder, body }),
				);
				output(result);
			} catch (e: unknown) {
				fail(errorMessage(e));
			}
		});

	note
		.command("edit <name>")
		.description("Replace note body")
		.option("--folder <name>", "Specify folder")
		.requiredOption("--body <markdown>", "New body (Markdown)")
		.action(async (name: string, opts) => {
			try {
				const body = markdownToHtml(opts.body);
				const result = await runJxa(
					editNote({ name, folder: opts.folder, body }),
				);
				output(result);
			} catch (e: unknown) {
				fail(errorMessage(e));
			}
		});

	note
		.command("append <name>")
		.description("Append to note body")
		.option("--folder <name>", "Specify folder")
		.requiredOption("--body <markdown>", "Content to append (Markdown)")
		.action(async (name: string, opts) => {
			try {
				const body = markdownToHtml(opts.body);
				const result = await runJxa(
					appendNote({ name, folder: opts.folder, body }),
				);
				output(result);
			} catch (e: unknown) {
				fail(errorMessage(e));
			}
		});

	note
		.command("prepend <name>")
		.description("Prepend to note body")
		.option("--folder <name>", "Specify folder")
		.requiredOption("--body <markdown>", "Content to prepend (Markdown)")
		.action(async (name: string, opts) => {
			try {
				const body = markdownToHtml(opts.body);
				const result = await runJxa(
					prependNote({ name, folder: opts.folder, body }),
				);
				output(result);
			} catch (e: unknown) {
				fail(errorMessage(e));
			}
		});

	note
		.command("delete <name>")
		.description("Delete a note")
		.option("--folder <name>", "Specify folder")
		.action(async (name: string, opts) => {
			try {
				const result = await runJxa(deleteNote({ name, folder: opts.folder }));
				output(result);
			} catch (e: unknown) {
				fail(errorMessage(e));
			}
		});

	note
		.command("move <name>")
		.description("Move note to a different folder")
		.option("--folder <name>", "Current folder")
		.requiredOption("--to <folder>", "Destination folder")
		.action(async (name: string, opts) => {
			try {
				const result = await runJxa(
					moveNote({ name, folder: opts.folder, to: opts.to }),
				);
				output(result);
			} catch (e: unknown) {
				fail(errorMessage(e));
			}
		});

	note
		.command("rename <name>")
		.description("Rename a note")
		.option("--folder <name>", "Specify folder")
		.requiredOption("--name <new-name>", "New name for the note")
		.action(async (name: string, opts) => {
			try {
				const result = await runJxa(
					renameNote({ name, folder: opts.folder, newName: opts.name }),
				);
				output(result);
			} catch (e: unknown) {
				fail(errorMessage(e));
			}
		});

	note
		.command("info <name>")
		.description("Show note metadata")
		.option("--folder <name>", "Specify folder")
		.action(async (name: string, opts) => {
			try {
				const result = await runJxa(noteInfo({ name, folder: opts.folder }));
				output(result);
			} catch (e: unknown) {
				fail(errorMessage(e));
			}
		});

	note
		.command("count")
		.description("Count notes")
		.option("--folder <name>", "Filter by folder")
		.action(async (opts) => {
			try {
				const result = await runJxa(countNotes({ folder: opts.folder }));
				output(result);
			} catch (e: unknown) {
				fail(errorMessage(e));
			}
		});
}
