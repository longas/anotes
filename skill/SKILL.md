---
name: anotes
description: Manage Apple Notes from the terminal using the `anotes` CLI. Use when the user asks to create, read, edit, search, organize, or delete notes.
---

# `anotes` — Apple Notes CLI

All commands output JSON to stdout. Note body content is **Markdown** — both for input (`--body` flag) and output (`body` field in `note read`). Apple Notes stores HTML internally; the CLI handles conversion in both directions. Errors exit with code 1 and output `{ "error": "<message>" }`.

## Commands

```
anotes note list [--folder <name>] [--limit <n>]
anotes note read <name> [--folder <name>]
anotes note create <name> [--folder <name>] [--body <markdown>]
anotes note edit <name> [--folder <name>] --body <markdown>
anotes note append <name> [--folder <name>] --body <markdown>
anotes note prepend <name> [--folder <name>] --body <markdown>
anotes note delete <name> [--folder <name>]
anotes note move <name> --to <folder> [--folder <name>]
anotes note rename <name> --name <new-name> [--folder <name>]
anotes note info <name> [--folder <name>]
anotes note count [--folder <name>]
anotes folder list
anotes folder create <name>
anotes folder delete <name>
anotes folder info <name>
anotes search <query> [--folder <name>] [--limit <n>]
```

## Output formats

**note list / search / note info / note count:**

```json
[
  {
    "id": "...",
    "name": "...",
    "folder": "...",
    "creationDate": "...",
    "modificationDate": "..."
  }
]
```

**note read** — same as above plus `"body"` field containing the note body as Markdown.

**note create / edit / append / prepend / move / rename:**

```json
{ "id": "...", "name": "...", "folder": "...", "modificationDate": "..." }
```

**note delete / folder delete:**

```json
{ "deleted": { "id": "...", "name": "..." } }
```

**folder list / folder info:**

```json
[{ "id": "...", "name": "...", "noteCount": 5 }]
```

**note count:**

```json
{ "count": 12 }
```

## Key behaviors

- `--body` accepts **Markdown** (converted to HTML for Apple Notes internally).
- `note read` returns the body as **Markdown** (converted from Apple Notes HTML internally).
- `<name>` is **case-sensitive** and must match exactly.
- `--folder` disambiguates when multiple folders have notes with the same name.
- Quote arguments that contain spaces.
- JXA calls have a **10-second timeout**. Use `--limit` on `list` and `search` for large collections.
- `note delete` moves the note to Recently Deleted in Notes.app.

## Typical workflows

**Find and read a note:**

```bash
anotes search "project plan" --limit 1
anotes note read "Q1 Project Plan"
```

**Create a note with Markdown content:**

```bash
anotes note create "Meeting Notes" --folder "Work" --body $'# Standup\n\n- Item one\n- Item two'
```

**Append to an existing note:**

```bash
anotes note append "Meeting Notes" --body $'## Follow-up\n\nAction items here'
```

**List folders, then create a note in one:**

```bash
anotes folder list
anotes note create "Status Update" --folder "Work" --body "All systems go"
```
