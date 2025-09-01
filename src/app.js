import NotesApi from "./data/notes-api.js";
import "./components/app-bar.js";
import "./components/note-item.js";
import "./components/note-form.js";
import "./components/footer-bar.js";

const activeList = document.querySelector("#active-notes");
const archivedList = document.querySelector("#archived-notes");

async function renderNotes() {
  activeList.innerHTML = "";
  archivedList.innerHTML = "";

  try {
    const notes = await NotesApi.getAllNotes();

    notes.forEach((note, index) => {
      const noteItem = document.createElement("note-item");
      noteItem.note = note;

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

document.addEventListener("note-deleted", renderNotes);
document.addEventListener("note-updated", renderNotes);

renderNotes();