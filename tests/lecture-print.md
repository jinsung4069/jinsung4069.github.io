# Lecture print verification

`js/lecture-print.js` prepares all slides in a separate same-origin iframe before calling that iframe's `print()`. The original viewer, slide index and exercise state remain intact. `css/lecture-print.css` declares A4 landscape with 8 mm margins and one slide per sheet. The iframe uses a desktop layout even when the originating page is mobile. Fonts and every required image must finish loading; a missing asset reports an error instead of opening an incomplete preview.

Each viewer registers its slide list and renderer. Interactive pages are rendered in the isolated viewer's initial state. Their full scrollable content is fitted to a sheet. The algorithm quiz includes all five questions. The blocks example uses equivalent compact JSON to preserve readability. Original slide data and source images are unchanged.

## Browser regression

Serve the repository on port 8765, then run:

```text
node tests/lecture-print.browser.cjs http://127.0.0.1:8765
```

The test uses Playwright with the installed Edge channel. If Playwright is outside the usual module path, set `PLAYWRIGHT_MODULE` to that installation's absolute module path. It visits all 13 lecture viewers at mobile size, clicks each print button, verifies that the native print call receives the complete prepared document and A4 rule, checks the original slide and learner state, and exercises `afterprint` cleanup. The native print call is intercepted to avoid sending pages to a physical printer.

## PDF output audit

Open each viewer with `?lecture-print=1`, await `LecturePrint.prepare()`, then use the browser PDF renderer with `preferCSSPageSize: true` and backgrounds enabled. Compare PDF page count with the source slide list, page dimensions with 297 by 210 mm, and page numbers in sequence. Render representative original, quiz, code and interactive pages to check readability and clipping.

Verified on 2026-09-15: 59 AI algorithm pages, 465 computer education pages across chapters 2 through 11, and 90 AI education pages across chapters 1 and 3, for 614 A4 landscape pages. All 13 print buttons, page/state preservation and cleanup passed. PDF page counts, dimensions and sequence were checked for every page, with visual checks for long exercises and native source slides.
