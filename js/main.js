document.addEventListener('DOMContentLoaded', function() {
    const languageToggle = document.getElementById('languageToggle');
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const mainNav = document.getElementById('mainNav');

    // Language toggle functionality
    languageToggle.addEventListener('click', () => {
        const currentLang = document.documentElement.lang;
        const newLang = currentLang === 'ko' ? 'en' : 'ko';
        setLanguage(newLang);
    });

    // Mobile menu toggle
    mobileMenuToggle.addEventListener('click', () => {
        mainNav.classList.toggle('mobile-open');
        mobileMenuToggle.textContent = mainNav.classList.contains('mobile-open') ? '✕' : '☰';
    });

    // Dark mode toggle functionality
    darkModeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    });

    function setLanguage(lang) {
        document.documentElement.lang = lang;
        localStorage.setItem('language', lang);

        document.querySelectorAll('.lang-content').forEach(el => {
            if (el.classList.contains(`lang-${lang}`)) {
                el.classList.add('active');
            } else {
                el.classList.remove('active');
            }
        });

        if (lang === 'ko') {
            languageToggle.textContent = 'ENG';
            document.title = '인성의 웹사이트 - 포트폴리오 & 프로젝트';
        } else {
            languageToggle.textContent = 'KOR';
            document.title = "Inseong's Website - Portfolio & Projects";
        }
    }

    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);

        // Update meta theme-color for mobile browsers
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (!metaThemeColor) {
            const meta = document.createElement('meta');
            meta.name = 'theme-color';
            document.head.appendChild(meta);
        }

        const themeColorMeta = document.querySelector('meta[name="theme-color"]');
        if (theme === 'dark') {
            themeColorMeta.content = '#0f0f0f';
        } else {
            themeColorMeta.content = '#ffffff';
        }

        // Add smooth transition class
        document.body.classList.add('theme-transition');
        setTimeout(() => {
            document.body.classList.remove('theme-transition');
        }, 300);
    }

    function getPreferredTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            return savedTheme;
        }

        // Check system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }

        return 'light';
    }

    // Set initial language
    const savedLang = localStorage.getItem('language') || 'ko';
    setLanguage(savedLang);

    // Set initial theme
    const preferredTheme = getPreferredTheme();
    setTheme(preferredTheme);

    // Listen for system theme changes
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addListener((e) => {
            // Only auto-switch if user hasn't manually set a preference
            if (!localStorage.getItem('theme')) {
                setTheme(e.matches ? 'dark' : 'light');
            }
        });
    }
});
