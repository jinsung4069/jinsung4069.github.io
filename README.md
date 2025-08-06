# Inseong's Personal Website

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Active-brightgreen)](https://jinsung4069.github.io)
[![Language](https://img.shields.io/badge/Language-KOR%2FENG-blue)](#language-toggle)

A personal portfolio website showcasing projects, interactive demos, and algorithms with bilingual support (Korean/English).

## 🌟 Features

### 🔄 Language Toggle
- **Bilingual Support**: Switch between Korean and English instantly
- **Persistent Preference**: Language choice is saved in localStorage
- **Complete Translation**: All content including navigation, descriptions, and UI elements

### 🎮 Interactive Projects
1. **A* Pathfinding Algorithm** - Visual demonstration of the A* pathfinding algorithm
2. **Alligator Chess** - Strategic chess variant with unique gameplay mechanics  
3. **Interactive Quiz** - Multi-category quiz application
4. **DQN Algorithm Demo** - Deep Q-Network reinforcement learning visualization
5. **Attendance System** - Digital attendance tracking tool

### 📱 Responsive Design
- Mobile-friendly layout
- Clean, modern interface
- Smooth animations and transitions

## 🚀 Live Demo

Visit the live website: **[https://jinsung4069.github.io](https://jinsung4069.github.io)**

## 📂 Project Structure

```
jinsung4069.github.io/
├── index.html              # Main homepage with language toggle
├── css/
│   └── style.css           # Main stylesheet
├── js/
│   └── main.js            # Core JavaScript functionality
├── pages/
│   ├── cv.html            # Resume/CV page
│   ├── attendance.html    # Attendance tracking system
│   └── dqn-demo.html      # DQN algorithm demonstration
├── AlligatorChess/        # Chess variant game
├── astar-pathfinding/     # A* algorithm visualization
├── simplequiz/            # Interactive quiz application
└── README.md              # This file
```

## 🛠️ Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Custom CSS with responsive design
- **Algorithms**: A* pathfinding, Deep Q-Network (DQN)
- **Games**: Canvas-based game development
- **Storage**: localStorage for user preferences
- **Deployment**: GitHub Pages

## 🎯 Key Projects

### A* Pathfinding Algorithm
Interactive visualization of the A* pathfinding algorithm featuring:
- Customizable grid size and obstacles
- Real-time pathfinding demonstration
- Visual representation of algorithm steps

### DQN Algorithm Demo
Deep Q-Network reinforcement learning demonstration with:
- Interactive grid environment
- Adjustable learning parameters (learning rate, epsilon, discount factor)
- Real-time training statistics
- Visual agent behavior observation

### Alligator Chess
Strategic chess variant featuring:
- Unique game mechanics
- Interactive gameplay
- Custom rules and piece movements

### Interactive Quiz System
Multi-category quiz application with:
- Various question types
- Score tracking
- User-friendly interface

## 🌍 Language Toggle Implementation

The website features a sophisticated bilingual system:

```javascript
// Language toggle functionality
function toggleToKorean() {
    enContent.forEach(el => el.classList.remove('active'));
    koContent.forEach(el => el.classList.add('active'));
    toggleBtn.textContent = 'ENG';
    document.documentElement.lang = 'ko';
    document.title = '인성의 웹사이트 - 포트폴리오 & 프로젝트';
    localStorage.setItem('language', 'ko');
}
```

### Features:
- **Instant Switch**: No page reload required
- **Content Separation**: Distinct Korean and English content blocks
- **State Persistence**: Remembers user's language preference
- **SEO Friendly**: Proper lang attributes and meta tags

## 📱 Responsive Design

The website is fully responsive with:
- Mobile-first approach
- Flexible grid layouts
- Touch-friendly navigation
- Optimized loading times

## 🎨 Styling Highlights

- **Modern Design**: Clean, minimalist interface
- **Smooth Animations**: CSS transitions for enhanced UX
- **Interactive Elements**: Hover effects and visual feedback
- **Accessibility**: Proper contrast ratios and semantic HTML

## 🚀 Getting Started

### Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/jinsung4069/jinsung4069.github.io.git
   cd jinsung4069.github.io
   ```

2. **Open in browser**:
   - Open `index.html` in your preferred browser
   - Or use a local server for development

3. **Development Server** (optional):
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx http-server
   ```

### GitHub Pages Deployment

The site is automatically deployed via GitHub Pages when changes are pushed to the main branch.

## 🔧 Customization

### Adding New Projects
1. Create project folder in root directory
2. Update navigation in `index.html` (both languages)
3. Add project card to featured projects section

### Modifying Language Content
1. Locate the relevant `.lang-en` or `.lang-ko` class elements
2. Update content in both language versions
3. Ensure consistency across translations

### Styling Changes
- Main styles: `css/style.css`
- Inline styles for specific components in individual HTML files

## 🤝 Contributing

While this is a personal portfolio, suggestions and improvements are welcome:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 📞 Contact

- **GitHub**: [@jinsung4069](https://github.com/jinsung4069)
- **Website**: [https://jinsung4069.github.io](https://jinsung4069.github.io)

---

**Note**: This website serves as a portfolio demonstration and learning platform. All projects are developed for educational and showcase purposes.

## 📊 Project Stats

- **Total Projects**: 5+ interactive demonstrations
- **Languages**: Korean, English
- **Framework**: Vanilla JavaScript (no dependencies)
- **Hosting**: GitHub Pages
- **Last Updated**: December 2024

---

*Built with ❤️ by Inseong*