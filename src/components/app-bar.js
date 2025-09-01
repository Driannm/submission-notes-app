class AppBar extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
      <header class="app-bar">
        <div class="app-bar__left">
          <img src="memento_logo.png" alt="Memento Logo" class="logo" />
        </div>
        <div class="app-bar__right">
          <input 
            type="search" 
            id="search-input" 
            placeholder="Cari catatan..." 
            aria-label="Cari catatan"
          />
        </div>
      </header>
    `;

    const searchInput = this.querySelector("#search-input");
    searchInput.addEventListener("input", (e) => {
      this.dispatchEvent(
        new CustomEvent("search-notes", {
          detail: { keyword: e.target.value.toLowerCase() },
          bubbles: true,
        })
      );
    });
  }
}

customElements.define("app-bar", AppBar);