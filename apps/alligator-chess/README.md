# Alligator Chess

Integrated from https://github.com/jinsung4069/AlligatorChess at commit `e829240453b77ca9a55e37f2236bb9bc5d9aab5b`.
The original repository remains unchanged.

Source is maintained in `apps/alligator-chess/`. Its static export is committed in
`alligator-chess/` at the portfolio repository root and served at `/alligator-chess/`.
The lowercase path avoids a collision with the original independent GitHub Pages project.

## Update the game

From this folder, with Node.js 24 and npm installed:

```sh
npm ci
npm test
npm run build:site
```

Review and commit both the source changes and the updated `alligator-chess/` export.
The existing portfolio deployment publishes the export with the rest of the static site.
The repository root `.nojekyll` keeps Next.js `_next` assets available on GitHub Pages.
No separate game repository deployment or Next.js server is required.

Local preview: run `python scripts/serve.py --port 8000` from the repository root and visit
`http://localhost:8000/alligator-chess/`.

Game rules live in `src/lib/game.ts`, with regression tests in `tests/game.test.mjs`.
A player loses for having no legal move only when it is that player's turn.
The computer prefers an immediate win, then a capture, then a legal forward move.
The UI announces whose turn it is, highlights legal destinations and cancels pending
computer moves when the game resets.

The export script records normalized source and output hashes in
`alligator-chess/export-manifest.json`. Text line endings are normalized to LF for
cross-platform checks. It removes stale files listed in the previous export manifest,
but stops if a generated file has been manually edited. Edit source files, then rebuild.
The repository validator detects missing assets and source/export mismatches.

To build in a separate, non-synced working copy, run `npm ci` and `npm run build`
in that copy, then run `node scripts/copy-export.mjs --site-root /path/to/portfolio`.
Keep the source under `apps/alligator-chess/` synchronized with the build copy.
