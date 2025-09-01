const BASE_URL = "https://notes-api.dicoding.dev/v2";
const STORAGE_KEY = "notes_data";

class NotesApi {
  static _loadNotes() {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  static _saveNotes(notes) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }

  static async getAllNotes() {
    return this._loadNotes();
  }

  static async addNote(note) {
    const notes = this._loadNotes();
    notes.push(note);
    this._saveNotes(notes);
    return note;
  }

  static async deleteNote(id) {
    let notes = this._loadNotes();
    notes = notes.filter((n) => n.id !== id);
    this._saveNotes(notes);
  }

  static async archiveNote(id) {
    const notes = this._loadNotes();
    const note = notes.find((n) => n.id === id);
    if (!note) throw new Error("Note tidak ditemukan");
    note.archived = true;
    this._saveNotes(notes);
    return note;
  }

  static async unarchiveNote(id) {
    const notes = this._loadNotes();
    const note = notes.find((n) => n.id === id);
    if (!note) throw new Error("Note tidak ditemukan");
    note.archived = false;
    this._saveNotes(notes);
    return note;
  }
}

export default NotesApi;
