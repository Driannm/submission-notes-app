import NotesApi from "../data/notes-api.js";

class NoteItem extends HTMLElement {
  static get observedAttributes() {
    return ["highlight"];
  }

  constructor() {
    super();
    this._note = null;
  }

  set note(note) {
    this._note = note;
    this.render();
  }

  get note() {
    return this._note;
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (name === "highlight" && oldVal !== newVal) {
      this.render();
    }
  }

  _escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  _formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  _truncateText(text, maxLength = 200) {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + "...";
  }

  render() {
    if (!this._note) {
      this.innerHTML = `<div class="note-item error-state"><p>❌ Data catatan tidak valid</p></div>`;
      return;
    }

    const { id, title, body, createdAt, archived } = this._note;
    const highlightClass = this.hasAttribute("highlight") ? "highlight" : "";
    const truncatedBody = this._truncateText(body);
    const formattedDate = this._formatDate(createdAt);

    this.innerHTML = `
      <article class="note-item ${highlightClass}" role="article" tabindex="0">
        <header class="note-header">
          <h3 class="note-title">${this._escapeHtml(title)}</h3>
          <div class="note-actions">
            <button class="archive-btn" aria-label="${archived ? "Kembalikan" : "Arsipkan"}">
              ${archived ? "📤 Kembalikan" : "📥 Arsipkan"}
            </button>
            <button class="delete-btn" aria-label="Hapus catatan">🗑️ Hapus</button>
          </div>
        </header>
        <section class="note-body">
          <p>${this._escapeHtml(truncatedBody)}</p>
        </section>
        <footer class="note-footer">
          <small>📅 ${formattedDate}</small>
        </footer>
      </article>
    `;

    this._addEventListeners(id, archived);
  }

  _addEventListeners(noteId, archived) {
    const archiveBtn = this.querySelector(".archive-btn");
    const deleteBtn = this.querySelector(".delete-btn");

    if (archiveBtn) {
      archiveBtn.addEventListener("click", async (e) => {
        e.stopPropagation();
        try {
          if (archived) {
            await NotesApi.unarchiveNote(noteId);
          } else {
            await NotesApi.archiveNote(noteId);
          }
          this.dispatchEvent(
            new CustomEvent("note-updated", { bubbles: true }),
          );
        } catch (err) {
          alert("Gagal update arsip: " + err.message);
        }
      });
    }

    if (deleteBtn) {
      deleteBtn.addEventListener("click", async (e) => {
        e.stopPropagation();
        if (confirm("Yakin ingin menghapus catatan ini?")) {
          try {
            // 🔥 animasi keluar
            anime({
              targets: this,
              opacity: [1, 0],
              translateY: [0, 30],
              easing: "easeInExpo",
              duration: 500,
              complete: async () => {
                await NotesApi.deleteNote(noteId);
                this.dispatchEvent(
                  new CustomEvent("note-deleted", { bubbles: true }),
                );
              },
            });
          } catch (err) {
            alert("Gagal hapus catatan: " + err.message);
          }
        }
      });
    }
  }
}

customElements.define("note-item", NoteItem);