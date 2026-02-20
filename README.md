# anotes — Apple Notes CLI

A command-line interface for managing Apple Notes on macOS. Designed for AI agents as the primary user — all output is structured JSON with Markdown for note body content in both directions.

## Prerequisites

- macOS (uses JXA/osascript to talk to Notes.app)
- Node.js 24+

## Setup

```bash
# Install dependencies
npm install

# Compile TypeScript
npm run build

# Make `anotes` available globally
mkdir -p ~/.local/bin
ln -sf "$(pwd)/bin/anotes.js" ~/.local/bin/anotes
```

Add `~/.local/bin` to your PATH if it isn't already. Append this to your shell profile (`~/.zshrc` or `~/.bashrc`):

```bash
export PATH="$HOME/.local/bin:$PATH"
```

Then reload your shell (`source ~/.zshrc`) or open a new terminal.

## Usage

This CLI is intended for AI agents. For the full command reference, run:

```bash
anotes --help
anotes note --help
anotes folder --help
```

## Agent Integration (Claude Code)

To let Claude Code use the `anotes` CLI as a skill, copy the `skill/` folder into your project's `.claude/skills/` directory (or wherever your agent loads skills from):

```bash
cp -r /path/to/anotes/skill .claude/skills/anotes
```

The skill file at `skill/SKILL.md` teaches the agent the full command reference, output formats, and typical workflows. Once loaded, the agent can create, read, edit, search, and organize Apple Notes via bash commands.

## Development

```bash
npm run build       # Compile TypeScript
npm run typecheck   # Type-check without emitting
npm run fix         # Lint and format with Biome
```
