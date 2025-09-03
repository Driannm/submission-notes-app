import NotesApi from "./data/notes-api.js";
import "./components/app-bar.js";
import "./components/note-item.js";
import "./components/note-form.js";
import "./components/footer-bar.js";
import "./components/loading-indicator.js";

let keyword = "";

const activeList = document.querySelector("#active-notes");
const archivedList = document.querySelector("#archived-notes");
const loader = document.querySelector("#loader");

function showLoading() {
  if (loader) {
    loader.style.display = "flex"; // biar tetap center
    loader.classList.remove("hidden");
    clearTimeout(loader._timeout); // reset timeout sebelumnya
  }
}

function hideLoading() {
  if (loader) {
    // kasih waktu minimal + animasi fade out
    loader._timeout = setTimeout(() => {
      loader.classList.add("hidden");
      setTimeout(() => {
        loader.style.display = "none";
      }, 500); // sinkron sama durasi transition CSS
    }, 600); // loader minimal tampil 600ms
  }
}

async function renderNotes() {
  activeList.innerHTML = "";
  archivedList.innerHTML = "";

  showLoading();
  try {
    const [activeNotes, archivedNotes] = await Promise.all([
      NotesApi.getAllNotes(),
      NotesApi.getArchivedNotes(),
    ]);

    const filteredActive = keyword
      ? activeNotes.filter(
          (note) =>
            note.title.toLowerCase().includes(keyword.toLowerCase()) ||
            note.body.toLowerCase().includes(keyword.toLowerCase()),
        )
      : activeNotes;

    const filteredArchived = keyword
      ? archivedNotes.filter(
          (note) =>
            note.title.toLowerCase().includes(keyword.toLowerCase()) ||
            note.body.toLowerCase().includes(keyword.toLowerCase()),
        )
      : archivedNotes;

    // render aktif
    filteredActive.forEach((note, index) => {
      const noteItem = document.createElement("note-item");
      noteItem.note = note;
      if (index === 0) noteItem.setAttribute("highlight", "");
      activeList.appendChild(noteItem);

      anime({
        targets: noteItem,
        opacity: [0, 1],
        translateY: [20, 0],
        easing: "easeOutExpo",
        duration: 600,
        delay: index * 100,
      });
    });

    // render arsip
    filteredArchived.forEach((note, index) => {
      const noteItem = document.createElement("note-item");
      noteItem.note = note;
      archivedList.appendChild(noteItem);

      anime({
        targets: noteItem,
        opacity: [0, 1],
        translateY: [20, 0],
        easing: "easeOutExpo",
        duration: 600,
        delay: index * 100,
      });
    });
    
  } catch (err) {
    console.error("Gagal render catatan:", err);
    alert("Gagal mengambil catatan dari server!");
  } finally {
    hideLoading();
  }
}

document.addEventListener("submit", async (e) => {
  if (e.target.id === "add-note-form") {
    e.preventDefault();
    const title = document.querySelector("#note-title").value.trim();
    const body = document.querySelector("#note-body").value.trim();

    if (title && body) {
      showLoading();
      try {
        await NotesApi.addNote({
          title,
          body,
        });
        e.target.reset();
        renderNotes();
      } catch (err) {
        console.error("Gagal menambah catatan:", err);
        alert("Gagal menambah catatan!");
      } finally {
        hideLoading();
      }
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
