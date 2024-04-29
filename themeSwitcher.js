const themeSwitcher() {
    const scheme = "light",
    const rootAttribute = "data-theme",
    applyScheme() {document.querySelector("html")?.setAttribute(this.rootAttribute, this.scheme)};
    }
