import NotesApi from "./data/notes-api.js";
import "./components/app-bar.js";
import "./components/note-item.js";
import "./components/note-form.js";
import "./components/footer-bar.js";

let keyword = "";

const activeList = document.querySelector("#active-notes");
const archivedList = document.querySelector("#archived-notes");

async function renderNotes() {
  activeList.innerHTML = "";
  archivedList.innerHTML = "";

  try {
    const allNotes = await NotesApi.getAllNotes();

    const filtered = keyword
      ? allNotes.filter(
          (note) =>
            note.title.toLowerCase().includes(keyword) ||
            note.body.toLowerCase().includes(keyword)
        )
      : allNotes;

    filtered.forEach((note, index) => {
      const noteItem = document.createElement("note-item");
      noteItem.note = note;

      // highlight note pertama yg aktif
      if (index === 0 && !note.archived) {
        noteItem.setAttribute("highlight", "");
      }

      if (note.archived) {
        archivedList.appendChild(noteItem);
      } else {
        activeList.appendChild(noteItem);
      }
    });
  } catch (err) {
    console.error("Gagal render catatan:", err);
  }
}

document.addEventListener("submit", async (e) => {
  if (e.target.id === "add-note-form") {
    e.preventDefault();
    const title = document.querySelector("#note-title").value.trim();
    const body = document.querySelector("#note-body").value.trim();

    if (title && body) {
      await NotesApi.addNote({
        id: +new Date(),
        title,
        body,
        createdAt: new Date().toISOString(),
        archived: false,
      });
      renderNotes();
      e.target.reset();
    }
  }
});

document.addEventListener("search-notes", (e) => {
  keyword = e.detail.keyword;
  renderNotes();
});

document.addEventListener("note-deleted", renderNotes);
document.addEventListener("note-updated", renderNotes);

renderNotes();