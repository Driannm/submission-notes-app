const BASE_URL = "https://notes-api.dicoding.dev/v2";

class NotesApi {
  static async getNotes() {
    const response = await fetch(`${BASE_URL}/notes`);
    const responseJson = await response.json();
    return responseJson.data;
  }

  static async addNote(note) {
    const response = await fetch(`${BASE_URL}/notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(note),
    });
    const responseJson = await response.json();
    return responseJson;
  }

  static async deleteNote(id) {
    const response = await fetch(`${BASE_URL}/notes/${id}`, {
      method: "DELETE",
    });
    const responseJson = await response.json();
    return responseJson;
  }
}

export default NotesApi;
