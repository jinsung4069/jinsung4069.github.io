// Hide a lecture page until today's date in Seoul (YYYYMMDD) is entered.
// This keeps casual visitors out; the page source stays public, so it is not real access control.
(function () {
    const KEY = 'lecture-gate';
    // Korea has no daylight saving time, so UTC+9 is always the Seoul calendar date.
    const today = () => new Date(Date.now() + 9 * 36e5).toISOString().slice(0, 10).replace(/-/g, '');
    let saved = null;
    try { saved = localStorage.getItem(KEY); } catch { /* storage blocked: ask on every visit */ }
    if (saved === today()) return;

    const root = document.documentElement;
    const style = document.createElement('style');
    style.textContent = `
html.lecture-gate-locked body > :not(#lecture-gate) { display: none !important; }
#lecture-gate { position: fixed; inset: 0; z-index: 2147483647; display: grid; place-items: center; padding: 24px; box-sizing: border-box; overflow: auto;
  background: #f5f6f8; color: #1c2430; font: 16px/1.5 system-ui, -apple-system, "Segoe UI", "Malgun Gothic", sans-serif; }
#lecture-gate form { width: min(100%, 360px); display: grid; gap: 12px; margin: 0; }
#lecture-gate h1 { margin: 0 0 4px; font-size: 1.25rem; line-height: 1.35; font-weight: 700; color: inherit; overflow-wrap: anywhere; }
#lecture-gate label { font-size: .95rem; }
#lecture-gate input, #lecture-gate button { font: inherit; height: 48px; border-radius: 8px; box-sizing: border-box; }
#lecture-gate input { width: 100%; padding: 0 14px; border: 1px solid #8a94a3; background: #fff; color: inherit; font-size: 1.25rem; letter-spacing: .12em; font-variant-numeric: tabular-nums; }
#lecture-gate input[aria-invalid="true"] { border-color: #c62828; }
#lecture-gate button { border: 0; background: #1f4fa3; color: #fff; font-weight: 600; cursor: pointer; }
#lecture-gate :is(input, button):focus-visible { outline: 3px solid #f0a500; outline-offset: 2px; }
#lecture-gate p { margin: 0; min-height: 1.5em; font-size: .95rem; color: #c62828; }
html[data-theme="dark"] #lecture-gate { background: #14181f; color: #e8ecf2; }
html[data-theme="dark"] #lecture-gate input { background: #1f2630; border-color: #6b7686; }
html[data-theme="dark"] #lecture-gate input[aria-invalid="true"] { border-color: #ff8a80; }
html[data-theme="dark"] #lecture-gate button { background: #8fb4ff; color: #0e1420; }
html[data-theme="dark"] #lecture-gate p { color: #ff8a80; }
@media (prefers-color-scheme: dark) {
  html:not([data-theme]) #lecture-gate { background: #14181f; color: #e8ecf2; }
  html:not([data-theme]) #lecture-gate input { background: #1f2630; border-color: #6b7686; }
  html:not([data-theme]) #lecture-gate input[aria-invalid="true"] { border-color: #ff8a80; }
  html:not([data-theme]) #lecture-gate button { background: #8fb4ff; color: #0e1420; }
  html:not([data-theme]) #lecture-gate p { color: #ff8a80; }
}`;
    root.classList.add('lecture-gate-locked');
    document.head.append(style);

    function show() {
        const english = root.lang === 'en';
        const gate = document.createElement('div');
        gate.id = 'lecture-gate';
        gate.setAttribute('role', 'dialog');
        gate.setAttribute('aria-modal', 'true');
        gate.setAttribute('aria-labelledby', 'lecture-gate-title');
        gate.innerHTML = '<form novalidate><h1 id="lecture-gate-title"></h1>'
            + '<label for="lecture-gate-input"></label>'
            + '<input id="lecture-gate-input" type="password" inputmode="numeric" maxlength="8" autocomplete="off" aria-describedby="lecture-gate-error">'
            + '<button type="submit"></button><p id="lecture-gate-error" role="alert"></p></form>';
        const form = gate.querySelector('form'), input = gate.querySelector('input'), error = gate.querySelector('p');
        gate.querySelector('h1').textContent = document.title.split(' | ')[0] || (english ? 'Lecture' : '강의자료');
        gate.querySelector('label').textContent = english ? 'Password (8 digits)' : '비밀번호 (숫자 8자리)';
        gate.querySelector('button').textContent = english ? 'Open' : '확인';
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            if (input.value.trim() !== today()) {
                input.setAttribute('aria-invalid', 'true');
                error.textContent = english ? 'The password is incorrect.' : '비밀번호가 올바르지 않습니다.';
                input.select();
                return;
            }
            let stored = false;
            try { localStorage.setItem(KEY, today()); stored = true; } catch { /* reveal in place below */ }
            // Reloading lets the lecture scripts start on a visible page; the slide in the URL is kept.
            if (stored) { location.reload(); return; }
            gate.remove();
            style.remove();
            root.classList.remove('lecture-gate-locked');
            window.dispatchEvent(new Event('resize'));
        });
        document.body.append(gate);
        input.focus();
    }

    if (document.body) { show(); return; }
    // Show the form as soon as <body> exists instead of waiting for the whole page to load.
    const observer = new MutationObserver(() => {
        if (!document.body) return;
        observer.disconnect();
        show();
    });
    observer.observe(root, { childList: true });
})();
