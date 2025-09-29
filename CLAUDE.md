# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal portfolio website hosted on GitHub Pages at https://jinsung4069.github.io. It's a static site built with vanilla HTML, CSS, and JavaScript featuring bilingual support (Korean/English) and multiple interactive demos including games and algorithm visualizations.

## Development Commands

### Local Development
```bash
# Serve locally using Python
python -m http.server 8000

# Alternative: Using Node.js
npx http-server
```

### Testing Changes
- Open `index.html` directly in browser for quick testing
- Use local server for full functionality testing including relative paths
- Test on mobile viewports for responsive design validation

### Deployment
- Automatic deployment via GitHub Pages when pushing to main branch
- No build process required - direct static file serving

## Architecture & Structure

### Bilingual Content System
The website implements a sophisticated language toggle system:
- Content elements use `.lang-content` base class with `.lang-en` or `.lang-ko` modifiers
- Language state managed via `data-lang` attribute and localStorage persistence
- All pages must include both Korean and English versions of content blocks
- Navigation, titles, and meta descriptions are dynamically updated

### Core Files Structure
```
├── index.html              # Main homepage with project showcase
├── css/
│   ├── style.css          # Main stylesheet with CSS custom properties
│   └── dqn-demo.css      # Specific styling for DQN demo
├── js/
│   ├── main.js           # Core functionality (language toggle, dark mode, mobile menu)
│   ├── attendance.js     # Attendance system logic
│   └── dqn-demo.js      # DQN algorithm implementation
└── pages/
    ├── cv.html          # Resume/CV page
    ├── attendance.html  # Digital attendance system
    ├── dqn-demo.html   # Deep Q-Network algorithm demo
    └── microrobot.html # Micro robot puzzle game
```

### Shared Components
- **Header Navigation**: Consistent across all pages with bilingual menu items
- **Language Toggle**: Available on all pages, preserves user preference
- **Dark Mode Toggle**: System preference detection with manual override
- **Mobile Menu**: Responsive navigation for mobile devices

### Theme System
- CSS custom properties for consistent theming (`--color-picto-primary`, etc.)
- Dark/light mode support with `data-theme` attribute
- Smooth transitions between theme changes
- Mobile-specific theme-color meta tag updates

## Key Implementation Patterns

### Language Toggle Implementation
When adding new content:
1. Wrap text in `.lang-content .lang-en` and `.lang-content .lang-ko` divs
2. Korean content starts with `.active` class
3. Update both navigation menus when adding new pages
4. Ensure page titles are updated in `setLanguage()` function

### Adding New Pages
1. Create HTML file in appropriate directory (`pages/` for internal pages)
2. Include standard header structure with bilingual navigation
3. Link to `../css/style.css` and `../js/main.js` from subdirectories
4. Add navigation links to all existing pages
5. Update project showcase cards on `index.html` if featuring the page

### Interactive Demos
- Self-contained in individual HTML files with inline scripts
- Use canvas elements for algorithm visualizations
- Include real-time parameter controls and statistics
- Implement proper cleanup and event handling

### Styling Conventions
- Use CSS custom properties defined in `:root` for consistent theming
- Follow BEM-like naming for component-specific styles
- Responsive design with mobile-first approach
- Smooth transitions using `--transition-ease` custom property

## External Project References

Several projects are referenced but hosted separately:
- `AlligatorChess/` - Chess variant game
- `astar-pathfinding/` - A* algorithm visualization
- `simplequiz/` - Interactive quiz application

These are expected to be in the root directory as separate subdirectories or linked projects.