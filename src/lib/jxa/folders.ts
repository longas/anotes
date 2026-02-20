import { escapeJxa } from "../osascript.js";

export function listFolders(): string {
	return `
    var Notes = Application('Notes');
    var folders = Notes.folders();
    var result = folders.map(function(f) {
      return {
        id: f.id(),
        name: f.name(),
        noteCount: f.notes.length
      };
    });
    JSON.stringify(result);
  `;
}

export function createFolder(name: string): string {
	return `
    var Notes = Application('Notes');
    var folder = Notes.Folder({ name: "${escapeJxa(name)}" });
    Notes.folders.push(folder);
    var created = Notes.folders.byName("${escapeJxa(name)}");
    var result = {
      id: created.id(),
      name: created.name(),
      noteCount: created.notes.length
    };
    JSON.stringify(result);
  `;
}

export function deleteFolder(name: string): string {
	return `
    var Notes = Application('Notes');
    var folder = Notes.folders.byName("${escapeJxa(name)}");
    var info = { id: folder.id(), name: folder.name() };
    Notes.delete(folder);
    JSON.stringify({ deleted: info });
  `;
}

export function folderInfo(name: string): string {
	return `
    var Notes = Application('Notes');
    var folder = Notes.folders.byName("${escapeJxa(name)}");
    var result = {
      id: folder.id(),
      name: folder.name(),
      noteCount: folder.notes.length
    };
    JSON.stringify(result);
  `;
}
