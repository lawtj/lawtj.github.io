const themeSwitcher = {
    isLight: true,
    applyScheme() {
        document.querySelector('html').setAttribute('data-theme', this.isLight ? 'dark' : 'light');
        this.isLight = !this.isLight;
    },
    init() {
        document.querySelector('html').setAttribute('data-theme', 'light')
    }
}