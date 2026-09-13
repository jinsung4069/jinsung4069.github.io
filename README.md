# Inseong's Personal Website

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Active-brightgreen)](https://jinsung4069.github.io)
[![Language](https://img.shields.io/badge/Language-KOR%2FENG-blue)](#-language-toggle)

A personal portfolio & CV website showcasing research, interactive educational demos, and algorithm visualizations with bilingual support (Korean/English).

## 🚀 Live Site

**[https://jinsung4069.github.io](https://jinsung4069.github.io)**

## 🌟 Features

- **🔄 Language Toggle** — Instant Korean/English switching, saved in `localStorage`
- **🌙 Dark Mode** — Follows system changes until the user chooses a theme; works when browser storage is unavailable
- **📄 CV / About** — Education, publications, books, and research projects ([About](https://jinsung4069.github.io/about/))
- **📱 Responsive** — Mobile-friendly layout with touch navigation
- **🔍 SEO** — Open Graph tags, sitemap.xml, robots.txt

## 🎮 Interactive Projects

| Project | Description |
|---|---|
| [우리반 AI (Stitch AI) PoC](https://jinsung4069.github.io/stitch_ai_poc/) | Competency-based AI platform proof-of-concept (10-screen scenario) |
| [A* Pathfinding](https://jinsung4069.github.io/astar-pathfinding/) | Interactive A* pathfinding visualization (separate repo) |
| [DQN Demo](https://jinsung4069.github.io/dqn-demo/) | Deep Q-Network reinforcement learning visualization |
| [Database Lab](https://jinsung4069.github.io/database-lab/) | Physical design, SQL, and data conversion practice with KCI article data (sql.js) |
| [Programming Language Lab](https://jinsung4069.github.io/programming-language/) | C / Python / Java side-by-side practice |
| [ML Simulations](https://jinsung4069.github.io/machinelearning/) | Interactive supervised and unsupervised learning simulations |
| [Orange3 Widget Parameter Lab](https://jinsung4069.github.io/orange3-widget-lab/) | Simulations for 9 Orange3 widgets with dataset/model-specific workflow recommendations and parameter-driven structure, boundary, clustering, and performance views |
| [Webcam Object Classifier](https://jinsung4069.github.io/webcam-classifier/) | Real-time, in-browser object detection with TensorFlow.js and COCO-SSD |
| [Alligator Chess](https://jinsung4069.github.io/alligator-chess/) | Strategic board game integrated in this repository |
| [Micro Robot](https://jinsung4069.github.io/microrobot/) | Strategic puzzle game (React) |
| [Contour Simulator](https://jinsung4069.github.io/contour-simulator/) | Draw contours for 3D terrain & volcano simulation |
| [Interactive Quiz](https://jinsung4069.github.io/simplequiz/) | Multi-topic quiz platform (separate repo) |
| [StackBurger](https://jinsung4069.github.io/stackburger/) | Interactive coding board game |
| [Attendance System](https://jinsung4069.github.io/attendance/) | Digital attendance tracking tool |

## 📂 Project Structure

```
jinsung4069.github.io/
├── index.html                  # Home at /
├── about/index.html            # About at /about/
├── lectures/index.html         # Courses at /lectures/
├── alligator-chess/            # Static Alligator Chess game
├── apps/alligator-chess/       # Game source and build instructions
├── database-lab/index.html     # Database lab at /database-lab/
├── <page-name>/index.html      # Other lectures and interactive projects
├── about.html                  # Legacy redirect to /about/
├── pages/*.html                # Legacy redirects to the new folder URLs
├── css/                        # Shared and page-specific styles
├── js/                         # Shared and page-specific scripts
├── data/                       # Course data and practice datasets
├── images/, fonts/, media/     # Static assets
├── sitemap.xml / robots.txt    # SEO
└── stitch_ai_poc/              # Portal and screen folders, with legacy redirects
```

External project repos served under the same domain: `astar-pathfinding`, `simplequiz`.

## 🛠️ Technologies

- **Frontend**: HTML5, CSS3, vanilla JavaScript (ES6+) — no build step
- **SQL Practice**: sql.js (browser SQLite) with KCI CSV data
- **Machine Learning**: TensorFlow.js + COCO-SSD for on-device webcam object detection
- **Games/Demos**: Canvas API; React (CDN) for Micro Robot
- **Storage**: `localStorage` for language & theme preferences
- **Deployment**: GitHub Pages (auto-deploy on push to `main`)

## 🖥️ Local Development

```bash
git clone https://github.com/jinsung4069/jinsung4069.github.io.git
cd jinsung4069.github.io

# Preview with the custom 404 page and fresh local assets:
python scripts/serve.py --port 8000
# then open http://localhost:8000
```

## Folder URLs

Each page lives in `<page-name>/index.html` and is linked as `/<page-name>/`.
Keep links and canonical URLs pointed at the folder, including the trailing slash.
Use site-root paths such as `/css/style.css` for shared assets and `/lectures/` for navigation.
Legacy `.html` pages redirect to the new URL and preserve query strings and anchors.
Explicit `index.html` visits are normalized by `js/clean-url.js`.
Preview through a local HTTP server so folder URLs and root-relative assets resolve correctly.
The main pages require no build step or server rewrite configuration.
Alligator Chess is prebuilt in `alligator-chess/`; after editing its source, follow
[the game build instructions](apps/alligator-chess/README.md).
Keep the root `.nojekyll` file so GitHub Pages includes the game's `_next` assets.

## Validation

Run these checks from the repository root with Python 3.12+ and Node.js 24:

```sh
python scripts/check_site.py
python -B -m unittest discover -s tests
node --test apps/alligator-chess/tests/game.test.mjs
```

The site check covers internal assets and links, course image/video paths, folder URLs,
redirects, sitemap entries, shared page landmarks, and matching game source/export hashes.
The game tests cover regressions in turn-based victory detection and all 135 reachable states.
The same checks run on pushes and pull requests through `.github/workflows/site-checks.yml`.
They validate the site without deploying it.

Shared pages use `js/preferences.js` in the head before `js/main.js`.
Set `data-bilingual="true"` on `<html>` only when the page supports both languages.
Keep a single `<main>` landmark and the visible-on-focus skip link when adding a page.
The root `404.html` provides recovery links for unknown GitHub Pages URLs.

## 🔧 Conventions

- **Bilingual content**: every visible string has paired `.lang-content.lang-ko` / `.lang-content.lang-en` spans; update both when editing
- **Page titles**: set `data-title-ko` / `data-title-en` on `<body>` so the tab title switches with the language
- **New project**: add a card to the `#projects` grid in `index.html` (both languages) and an entry in `sitemap.xml`
- **Contact email**: use `jinsung4069@gnue.ac.kr` everywhere

## 📞 Contact

- **Email**: jinsung4069@gnue.ac.kr
- **GitHub**: [@jinsung4069](https://github.com/jinsung4069)

---

*Last updated: September 2026*
