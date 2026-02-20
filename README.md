# anotes — Apple Notes CLI

A command-line interface for managing Apple Notes on macOS. Designed for AI agents as the primary user — all output is structured JSON with Markdown for note body content in both directions.

## Prerequisites

- macOS (uses JXA/osascript to talk to Notes.app)
- Node.js 24+

## Install

```bash
npm install -g anotes
```

## Usage

This CLI is intended for AI agents. For the full command reference, run:

```bash
anotes --help
anotes note --help
anotes folder --help
```

## Agent Integration

anotes ships with a [skill file](skill/SKILL.md) that teaches an AI agent the full command reference, output formats, and typical workflows. Once loaded, the agent can create, read, edit, search, and organize Apple Notes via bash commands.

Copy the skill into your agent's skills directory so it's available across all your projects:

### Claude Code

```bash
mkdir -p ~/.claude/skills/anotes && cp "$(npm root -g)/anotes/skill/SKILL.md" ~/.claude/skills/anotes/SKILL.md
```

### Codex

```bash
mkdir -p ~/.codex/skills/anotes && cp "$(npm root -g)/anotes/skill/SKILL.md" ~/.codex/skills/anotes/SKILL.md
```
