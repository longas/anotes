import { createRequire } from "node:module";
import { Command } from "commander";
import { registerFolderCommand } from "./commands/folder.js";
import { registerNoteCommand } from "./commands/note.js";
import { registerSearchCommand } from "./commands/search.js";

const require = createRequire(import.meta.url);
const { version } = require("../package.json");

const program = new Command();

program
	.name("anotes")
	.description("Apple Notes CLI for AI agents")
	.version(version);

registerNoteCommand(program);
registerFolderCommand(program);
registerSearchCommand(program);

program.parseAsync(process.argv);
