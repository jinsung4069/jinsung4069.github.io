# Inseong's Personal Website

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Active-brightgreen)](https://jinsung4069.github.io)
[![Language](https://img.shields.io/badge/Language-KOR%2FENG-blue)](#-language-toggle)

A personal portfolio & CV website showcasing research, interactive educational demos, and algorithm visualizations with bilingual support (Korean/English).

## 🚀 Live Site

**[https://jinsung4069.github.io](https://jinsung4069.github.io)**

## 🌟 Features

- **🔄 Language Toggle** — Instant Korean/English switching, saved in `localStorage`
- **🌙 Dark Mode** — Follows system preference, manual toggle, no flash on load
- **📄 CV / About** — Education, publications, books, and research projects ([about.html](https://jinsung4069.github.io/about.html))
- **📱 Responsive** — Mobile-friendly layout with touch navigation
- **🔍 SEO** — Open Graph tags, sitemap.xml, robots.txt

## 🎮 Interactive Projects

| Project | Description |
|---|---|
| [우리반 AI (Stitch AI) PoC](https://jinsung4069.github.io/stitch_ai_poc/index.html) | Competency-based AI platform proof-of-concept (10-screen scenario) |
| [A* Pathfinding](https://jinsung4069.github.io/astar-pathfinding/) | Interactive A* pathfinding visualization (separate repo) |
| [DQN Demo](https://jinsung4069.github.io/pages/dqn-demo.html) | Deep Q-Network reinforcement learning visualization |
| [Database Lab](https://jinsung4069.github.io/pages/database-lab.html) | Physical design, SQL, and data conversion practice with KCI article data (sql.js) |
| [Programming Language Lab](https://jinsung4069.github.io/pages/programming-language.html) | C / Python / Java side-by-side practice |
| [ML Simulations](https://jinsung4069.github.io/pages/machinelearning.html) | 5 interactive machine learning algorithm simulations |
| [Alligator Chess](https://jinsung4069.github.io/AlligatorChess/) | Strategic board game (separate repo) |
| [Micro Robot](https://jinsung4069.github.io/pages/microrobot.html) | Strategic puzzle game (React) |
| [Contour Simulator](https://jinsung4069.github.io/pages/contour-simulator.html) | Draw contours for 3D terrain & volcano simulation |
| [Interactive Quiz](https://jinsung4069.github.io/simplequiz/) | Multi-topic quiz platform (separate repo) |
| [StackBurger](https://jinsung4069.github.io/pages/stackburger.html) | Interactive coding board game |
| [Attendance System](https://jinsung4069.github.io/pages/attendance.html) | Digital attendance tracking tool |

## 📂 Project Structure

```
jinsung4069.github.io/
├── index.html                  # Landing page (hero, project cards, contact)
├── about.html                  # CV: education, publications, research projects
├── favicon.svg                 # Site favicon
├── sitemap.xml / robots.txt    # SEO
├── css/
│   ├── style.css               # Main stylesheet (light/dark themes)
│   ├── database-lab.css
│   ├── dqn-demo.css
│   └── programming-language.css
├── js/
│   ├── main.js                 # Language toggle, dark mode, mobile nav
│   ├── attendance.js
│   ├── database-lab.js
│   ├── dqn-demo.js
│   └── programming-language.js
├── data/
│   ├── kci_articles.csv        # Normalized KCI article data for SQL practice
│   └── kci_articles_raw.csv    # Deduplicated raw KCI export columns
├── images/
│   └── profile.webp
├── pages/
│   ├── cv.html                 # Redirects to about.html
│   ├── attendance.html
│   ├── contour-simulator.html
│   ├── database-lab.html
│   ├── dqn-demo.html
│   ├── machinelearning.html
│   ├── microrobot.html
│   ├── programming-language.html
│   └── stackburger.html
└── stitch_ai_poc/              # 우리반 AI platform PoC (portal + 9 screens)
```

External project repos served under the same domain: `astar-pathfinding`, `AlligatorChess`, `simplequiz`.

## 🛠️ Technologies

- **Frontend**: HTML5, CSS3, vanilla JavaScript (ES6+) — no build step
- **SQL Practice**: sql.js (browser SQLite) with KCI CSV data
- **Games/Demos**: Canvas API; React (CDN) for Micro Robot
- **Storage**: `localStorage` for language & theme preferences
- **Deployment**: GitHub Pages (auto-deploy on push to `main`)

## 🖥️ Local Development

```bash
git clone https://github.com/jinsung4069/jinsung4069.github.io.git
cd jinsung4069.github.io

# Any static server works, e.g.:
python -m http.server 8000
# then open http://localhost:8000
```

## 🔧 Conventions

- **Bilingual content**: every visible string has paired `.lang-content.lang-ko` / `.lang-content.lang-en` spans; update both when editing
- **Page titles**: set `data-title-ko` / `data-title-en` on `<body>` so the tab title switches with the language
- **New project**: add a card to the `#projects` grid in `index.html` (both languages) and an entry in `sitemap.xml`
- **Contact email**: use `jinsung4069@gnue.ac.kr` everywhere

## 📞 Contact

- **Email**: jinsung4069@gnue.ac.kr
- **GitHub**: [@jinsung4069](https://github.com/jinsung4069)

---

*Last updated: July 2026*
