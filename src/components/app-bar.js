class AppBar extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <header class="app-bar">
        <img src="memento_logo.png" alt="Memento Logo" class="logo" />
      </header>
    `;
  }
}
customElements.define("app-bar", AppBar);
