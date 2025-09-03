const BASE_URL = "https://notes-api.dicoding.dev/v2";

class NotesApi {
  static async getAllNotes() {
    const response = await fetch(`${BASE_URL}/notes`);
    if (!response.ok) throw new Error("Gagal mengambil catatan");
    const { data } = await response.json();
    return data;
  }

  static async getArchivedNotes() {
    const response = await fetch(`${BASE_URL}/notes/archived`);
    if (!response.ok) throw new Error("Gagal mengambil catatan arsip");
    const { data } = await response.json();
    return data;
  }

  static async addNote(note) {
    const response = await fetch(`${BASE_URL}/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: note.title,
        body: note.body,
      }),
    });
    if (!response.ok) throw new Error("Gagal menambah catatan");
    const { data } = await response.json();
    return data;
  }

  static async deleteNote(id) {
    const response = await fetch(`${BASE_URL}/notes/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Gagal menghapus catatan");
    return true;
  }

  static async archiveNote(id) {
    const response = await fetch(`${BASE_URL}/notes/${id}/archive`, {
      method: "POST",
    });
    if (!response.ok) throw new Error("Gagal mengarsipkan catatan");
    const { data } = await response.json();
    return data;
  }

  static async unarchiveNote(id) {
    const response = await fetch(`${BASE_URL}/notes/${id}/unarchive`, {
      method: "POST",
    });
    if (!response.ok) throw new Error("Gagal mengembalikan catatan");
    const { data } = await response.json();
    return data;
  }
}

export default NotesApi;