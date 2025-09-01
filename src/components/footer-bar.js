class FooterBar extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <footer class="footer-bar">
        <p>✨ Dibuat dengan ❤️ oleh Yuda Andrian ✨</p>
        <small class="tagline">Memento — Catat momen, simpan kenangan.</small>
      </footer>
    `;
  }
}

customElements.define("footer-bar", FooterBar);
