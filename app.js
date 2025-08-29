import notes from "./data.js";
import "./components/app-bar.js";
import "./components/note-item.js";
import "./components/note-form.js";
import "./components/footer-bar.js";

const notesList = document.querySelector("#notes-list");
const formContainer = document.querySelector("note-form");

function renderNotes() {
  notesList.innerHTML = "";
  notes.forEach((note, index) => {
    const noteItem = document.createElement("note-item");
    noteItem.note = note;

    // kasih highlight ke note pertama
    if (index === 0) {
      noteItem.setAttribute("highlight", "");
    }

    notesList.appendChild(noteItem);
  });
}

document.addEventListener("submit", (e) => {
  if (e.target.id === "add-note-form") {
    e.preventDefault();
    const title = document.querySelector("#note-title").value.trim();
    const body = document.querySelector("#note-body").value.trim();

    if (title && body) {
      notes.push({
        id: +new Date(),
        title,
        body,
        createdAt: new Date().toISOString(),
      });
      renderNotes();
      e.target.reset();
    }
  }
});

renderNotes();
