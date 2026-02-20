import { escapeJxa } from "../osascript.js";

export interface ListNotesOptions {
	folder?: string;
	limit?: number;
}

export function listNotes({ folder, limit }: ListNotesOptions = {}): string {
	const folderFilter = folder
		? `var container = Notes.folders.byName("${escapeJxa(folder)}");`
		: `var container = Notes;`;
	const limitClause = limit ? `.slice(0, ${limit})` : "";

	return `
    var Notes = Application('Notes');
    ${folderFilter}
    var allNotes = container.notes();
    var result = allNotes${limitClause}.map(function(n) {
      return {
        id: n.id(),
        name: n.name(),
        folder: n.container().name(),
        creationDate: n.creationDate().toISOString(),
        modificationDate: n.modificationDate().toISOString()
      };
    });
    JSON.stringify(result);
  `;
}

export interface ReadNoteOptions {
	name: string;
	folder?: string;
}

export function readNote({ name, folder }: ReadNoteOptions): string {
	const noteAccess = folder
		? `Notes.folders.byName("${escapeJxa(folder)}").notes.byName("${escapeJxa(name)}")`
		: `Notes.notes.byName("${escapeJxa(name)}")`;

	return `
    var Notes = Application('Notes');
    var note = ${noteAccess};
    var result = {
      id: note.id(),
      name: note.name(),
      folder: note.container().name(),
      body: note.body(),
      creationDate: note.creationDate().toISOString(),
      modificationDate: note.modificationDate().toISOString()
    };
    JSON.stringify(result);
  `;
}

export interface CreateNoteOptions {
	name: string;
	folder?: string;
	body?: string;
}

export function createNote({ name, folder, body }: CreateNoteOptions): string {
	const htmlBody = body ?? "";
	const target = folder
		? `Notes.folders.byName("${escapeJxa(folder)}")`
		: `Notes.defaultAccount().defaultFolder()`;

	return `
    var Notes = Application('Notes');
    var target = ${target};
    var note = Notes.Note({name: "${escapeJxa(name)}", body: "${escapeJxa(htmlBody)}"});
    target.notes.push(note);
    var created = target.notes.byName("${escapeJxa(name)}");
    var result = {
      id: created.id(),
      name: created.name(),
      folder: created.container().name(),
      creationDate: created.creationDate().toISOString(),
      modificationDate: created.modificationDate().toISOString()
    };
    JSON.stringify(result);
  `;
}

export interface EditNoteOptions {
	name: string;
	folder?: string;
	body: string;
}

export function editNote({ name, folder, body }: EditNoteOptions): string {
	const noteAccess = folder
		? `Notes.folders.byName("${escapeJxa(folder)}").notes.byName("${escapeJxa(name)}")`
		: `Notes.notes.byName("${escapeJxa(name)}")`;

	return `
    var Notes = Application('Notes');
    var note = ${noteAccess};
    note.body = "${escapeJxa(body)}";
    var result = {
      id: note.id(),
      name: note.name(),
      folder: note.container().name(),
      modificationDate: note.modificationDate().toISOString()
    };
    JSON.stringify(result);
  `;
}

export interface AppendNoteOptions {
	name: string;
	folder?: string;
	body: string;
}

export function appendNote({ name, folder, body }: AppendNoteOptions): string {
	const noteAccess = folder
		? `Notes.folders.byName("${escapeJxa(folder)}").notes.byName("${escapeJxa(name)}")`
		: `Notes.notes.byName("${escapeJxa(name)}")`;

	return `
    var Notes = Application('Notes');
    var note = ${noteAccess};
    var existing = note.body();
    var closingIdx = existing.lastIndexOf('</body>');
    if (closingIdx !== -1) {
      note.body = existing.slice(0, closingIdx) + "${escapeJxa(body)}" + existing.slice(closingIdx);
    } else {
      note.body = existing + "${escapeJxa(body)}";
    }
    var result = {
      id: note.id(),
      name: note.name(),
      folder: note.container().name(),
      modificationDate: note.modificationDate().toISOString()
    };
    JSON.stringify(result);
  `;
}

export interface PrependNoteOptions {
	name: string;
	folder?: string;
	body: string;
}

export function prependNote({
	name,
	folder,
	body,
}: PrependNoteOptions): string {
	const noteAccess = folder
		? `Notes.folders.byName("${escapeJxa(folder)}").notes.byName("${escapeJxa(name)}")`
		: `Notes.notes.byName("${escapeJxa(name)}")`;

	return `
    var Notes = Application('Notes');
    var note = ${noteAccess};
    var existing = note.body();
    var openIdx = existing.indexOf('<body>');
    if (openIdx !== -1) {
      var insertAt = openIdx + '<body>'.length;
      note.body = existing.slice(0, insertAt) + "${escapeJxa(body)}" + existing.slice(insertAt);
    } else {
      note.body = "${escapeJxa(body)}" + existing;
    }
    var result = {
      id: note.id(),
      name: note.name(),
      folder: note.container().name(),
      modificationDate: note.modificationDate().toISOString()
    };
    JSON.stringify(result);
  `;
}

export interface DeleteNoteOptions {
	name: string;
	folder?: string;
}

export function deleteNote({ name, folder }: DeleteNoteOptions): string {
	const noteAccess = folder
		? `Notes.folders.byName("${escapeJxa(folder)}").notes.byName("${escapeJxa(name)}")`
		: `Notes.notes.byName("${escapeJxa(name)}")`;

	return `
    var Notes = Application('Notes');
    var note = ${noteAccess};
    var info = { id: note.id(), name: note.name() };
    Notes.delete(note);
    JSON.stringify({ deleted: info });
  `;
}

export interface MoveNoteOptions {
	name: string;
	folder?: string;
	to: string;
}

export function moveNote({ name, folder, to }: MoveNoteOptions): string {
	const noteAccess = folder
		? `Notes.folders.byName("${escapeJxa(folder)}").notes.byName("${escapeJxa(name)}")`
		: `Notes.notes.byName("${escapeJxa(name)}")`;

	return `
    var Notes = Application('Notes');
    var note = ${noteAccess};
    var dest = Notes.folders.byName("${escapeJxa(to)}");
    Notes.move(note, { to: dest });
    var result = {
      id: note.id(),
      name: note.name(),
      folder: note.container().name(),
      modificationDate: note.modificationDate().toISOString()
    };
    JSON.stringify(result);
  `;
}

export interface RenameNoteOptions {
	name: string;
	folder?: string;
	newName: string;
}

export function renameNote({
	name,
	folder,
	newName,
}: RenameNoteOptions): string {
	const noteAccess = folder
		? `Notes.folders.byName("${escapeJxa(folder)}").notes.byName("${escapeJxa(name)}")`
		: `Notes.notes.byName("${escapeJxa(name)}")`;

	return `
    var Notes = Application('Notes');
    var note = ${noteAccess};
    note.name = "${escapeJxa(newName)}";
    var result = {
      id: note.id(),
      name: note.name(),
      folder: note.container().name(),
      modificationDate: note.modificationDate().toISOString()
    };
    JSON.stringify(result);
  `;
}

export interface NoteInfoOptions {
	name: string;
	folder?: string;
}

export function noteInfo({ name, folder }: NoteInfoOptions): string {
	const noteAccess = folder
		? `Notes.folders.byName("${escapeJxa(folder)}").notes.byName("${escapeJxa(name)}")`
		: `Notes.notes.byName("${escapeJxa(name)}")`;

	return `
    var Notes = Application('Notes');
    var note = ${noteAccess};
    var result = {
      id: note.id(),
      name: note.name(),
      folder: note.container().name(),
      creationDate: note.creationDate().toISOString(),
      modificationDate: note.modificationDate().toISOString()
    };
    JSON.stringify(result);
  `;
}

export interface CountNotesOptions {
	folder?: string;
}

export function countNotes({ folder }: CountNotesOptions = {}): string {
	const folderFilter = folder
		? `var container = Notes.folders.byName("${escapeJxa(folder)}");`
		: `var container = Notes;`;

	return `
    var Notes = Application('Notes');
    ${folderFilter}
    var count = container.notes.length;
    JSON.stringify({ count: count });
  `;
}

export interface SearchNotesOptions {
	query: string;
	folder?: string;
	limit?: number;
}

export function searchNotes({
	query,
	folder,
	limit,
}: SearchNotesOptions): string {
	const escapedQuery = escapeJxa(query).toLowerCase();
	const folderFilter = folder
		? `var container = Notes.folders.byName("${escapeJxa(folder)}");`
		: `var container = Notes;`;
	const limitClause = limit ? `.slice(0, ${limit})` : "";

	return `
    var Notes = Application('Notes');
    ${folderFilter}
    var allNotes = container.notes();
    var query = "${escapedQuery}";
    var matched = allNotes.filter(function(n) {
      var nameMatch = n.name().toLowerCase().indexOf(query) !== -1;
      var bodyText = '';
      try { bodyText = n.plaintext(); } catch(e) {}
      var bodyMatch = bodyText.toLowerCase().indexOf(query) !== -1;
      return nameMatch || bodyMatch;
    });
    var result = matched${limitClause}.map(function(n) {
      return {
        id: n.id(),
        name: n.name(),
        folder: n.container().name(),
        creationDate: n.creationDate().toISOString(),
        modificationDate: n.modificationDate().toISOString()
      };
    });
    JSON.stringify(result);
  `;
}
