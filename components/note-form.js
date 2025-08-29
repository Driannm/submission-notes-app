class NoteForm extends HTMLElement {
  connectedCallback() {
    this.render();

    // simpan reference biar nggak query global
    this.form = this.querySelector("#add-note-form");
    this.titleInput = this.querySelector("#note-title");
    this.bodyInput = this.querySelector("#note-body");
    this.titleError = this.querySelector("#title-error");
    this.bodyError = this.querySelector("#body-error");
    this.titleCount = this.querySelector("#title-count");
    this.bodyCount = this.querySelector("#body-count");

    // event listener
    this.titleInput.addEventListener("input", () => this.validateTitle());
    this.bodyInput.addEventListener("input", () => this.validateBody());
  }

  render() {
    this.innerHTML = `
      <form id="add-note-form">
        <label for="note-title">Judul Catatan</label>
        <input 
          type="text" 
          id="note-title" 
          placeholder="Masukkan judul..." 
          required 
          minlength="3"
          maxlength="50"
        />
        <div class="form-info">
          <small id="title-error" class="error"></small>
          <small id="title-count" class="char-count">0 / 50</small>
        </div>

        <label for="note-body">Isi Catatan</label>
        <textarea 
          id="note-body" 
          placeholder="Tulis catatan di sini..." 
          required 
          minlength="5"
          maxlength="300"
        ></textarea>
        <div class="form-info">
          <small id="body-error" class="error"></small>
          <small id="body-count" class="char-count">0 / 300</small>
        </div>

        <button type="submit">+ Tambah Catatan</button>
      </form>
    `;
  }

  validateTitle() {
    const value = this.titleInput.value.trim();
    this.titleCount.textContent = `${value.length} / 50`;

    if (value.length < 3) {
      this.titleError.textContent = "Judul minimal 3 karakter!";
    } else {
      this.titleError.textContent = "";
    }
  }

  validateBody() {
    const value = this.bodyInput.value.trim();
    this.bodyCount.textContent = `${value.length} / 300`;

    if (value.length < 5) {
      this.bodyError.textContent = "Isi catatan minimal 5 karakter!";
    } else {
      this.bodyError.textContent = "";
    }
  }
}

customElements.define("note-form", NoteForm);