class AppBar extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
      <header class="app-bar">
          <img src="memento_logo.png" alt="Memento Logo" class="logo" />
        <input 
          type="search" 
          id="search-input" 
          placeholder="Cari catatan..." 
          aria-label="Cari catatan" 
        />
      </header>
    `;

    this.querySelector("#search-input").addEventListener("input", (e) => {
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
