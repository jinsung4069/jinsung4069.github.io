// Read preferences without preventing the page from loading when storage is unavailable.
(function () {
    const memory = Object.create(null);
    function read(key) {
        if (Object.prototype.hasOwnProperty.call(memory, key)) return memory[key];
        try { return localStorage.getItem(key); } catch { return null; }
    }
    function write(key, value) {
        try { localStorage.setItem(key, value); delete memory[key]; }
        catch { memory[key] = value; }
    }
    function theme() {
        const saved = read('theme');
        if (saved === 'light' || saved === 'dark') return saved;
        return window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    window.sitePreferences = { read, write, theme };
    document.documentElement.dataset.theme = theme();
    if (document.documentElement.dataset.bilingual === 'true') {
        document.documentElement.lang = read('language') === 'en' ? 'en' : 'ko';
    }
})();
