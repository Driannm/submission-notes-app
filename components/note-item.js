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

  /**
   * Escape HTML to prevent XSS attacks
   */
  _escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Format date in Indonesian locale
   */
  _formatDate(dateString) {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Tanggal tidak valid";
      }

      return date.toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Tanggal tidak valid";
    }
  }

  /**
   * Truncate text if it's too long
   */
  _truncateText(text, maxLength = 200) {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + "...";
  }

  /**
   * Validate note object
   */
  _isValidNote(note) {
    return (
      note &&
      typeof note === "object" &&
      typeof note.title === "string" &&
      typeof note.body === "string" &&
      note.createdAt
    );
  }

  render() {
    // Clear content first
    this.innerHTML = "";

    if (!this._isValidNote(this._note)) {
      this.innerHTML = `
        <div class="note-item error-state">
          <p>❌ Data catatan tidak valid</p>
        </div>
      `;
      return;
    }

    const { title, body, createdAt } = this._note;
    const highlightClass = this.hasAttribute("highlight") ? "highlight" : "";
    const truncatedBody = this._truncateText(body);
    const formattedDate = this._formatDate(createdAt);

    // Create template with escaped content
    const template = `
      <article class="note-item ${highlightClass}" role="article" tabindex="0">
        <header class="note-header">
          <h3 class="note-title" title="${this._escapeHtml(title)}">
            ${this._escapeHtml(title)}
          </h3>
        </header>
        <section class="note-body">
          <p class="note-text" title="${this._escapeHtml(body)}">
            ${this._escapeHtml(truncatedBody)}
          </p>
        </section>
        <footer class="note-footer">
          <small class="note-date" title="${formattedDate}">
            <span class="date-icon">📅</span>
            <span class="date-text">${formattedDate}</span>
          </small>
        </footer>
      </article>
    `;

    this.innerHTML = template;

    // Add event listeners after render
    this._addEventListeners();
  }

  /**
   * Add event listeners for interactions
   */
  _addEventListeners() {
    const article = this.querySelector(".note-item");
    if (!article) return;

    // Keyboard accessibility
    article.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        this._handleClick(e);
      }
    });

    // Click handler
    article.addEventListener("click", (e) => {
      this._handleClick(e);
    });
  }

  /**
   * Handle click/enter events
   */
  _handleClick(event) {
    // Dispatch custom event for parent components to handle
    this.dispatchEvent(
      new CustomEvent("note-selected", {
        detail: {
          note: this._note,
          element: this,
        },
        bubbles: true,
      }),
    );
  }

  /**
   * Public method to update highlight state
   */
  setHighlight(shouldHighlight) {
    if (shouldHighlight) {
      this.setAttribute("highlight", "");
    } else {
      this.removeAttribute("highlight");
    }
  }

  /**
   * Public method to check if note is highlighted
   */
  isHighlighted() {
    return this.hasAttribute("highlight");
  }

  /**
   * Cleanup when element is removed
   */
  disconnectedCallback() {
    // Clean up any event listeners or resources if needed
  }
}

// Register the custom element
customElements.define("note-item", NoteItem);
