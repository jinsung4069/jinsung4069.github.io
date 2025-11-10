/**
 * Main application script
 * Handles language switching, theme toggling, and mobile menu
 */

// Configuration
const CONFIG = {
    DEFAULT_LANG: 'ko',
    DEFAULT_THEME: 'light',
    THEME_TRANSITION_DURATION: 300,

    THEME_COLORS: {
        light: '#ffffff',
        dark: '#0f0f0f'
    },

    STORAGE_KEYS: {
        LANGUAGE: 'language',
        THEME: 'theme'
    },

    MOBILE_MENU: {
        OPEN_ICON: '✕',
        CLOSED_ICON: '☰'
    }
};

document.addEventListener('DOMContentLoaded', function() {
    const elements = {
        languageToggle: document.getElementById('languageToggle'),
        mobileMenuToggle: document.getElementById('mobileMenuToggle'),
        darkModeToggle: document.getElementById('darkModeToggle'),
        mainNav: document.getElementById('mainNav')
    };

    // Language toggle functionality
    if (elements.languageToggle) {
        elements.languageToggle.addEventListener('click', () => {
            const currentLang = document.documentElement.lang;
            const newLang = currentLang === 'ko' ? 'en' : 'ko';
            setLanguage(newLang);
        });
    }

    // Mobile menu toggle
    if (elements.mobileMenuToggle && elements.mainNav) {
        elements.mobileMenuToggle.addEventListener('click', () => {
            elements.mainNav.classList.toggle('mobile-open');
            const isOpen = elements.mainNav.classList.contains('mobile-open');
            elements.mobileMenuToggle.textContent = isOpen ?
                CONFIG.MOBILE_MENU.OPEN_ICON :
                CONFIG.MOBILE_MENU.CLOSED_ICON;
        });
    }

    // Dark mode toggle functionality
    if (elements.darkModeToggle) {
        elements.darkModeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            setTheme(newTheme);
        });
    }

    function setLanguage(lang) {
        document.documentElement.lang = lang;

        // Save to storage with error handling
        if (typeof safeStorage !== 'undefined') {
            safeStorage.setItem(CONFIG.STORAGE_KEYS.LANGUAGE, lang);
        } else {
            try {
                localStorage.setItem(CONFIG.STORAGE_KEYS.LANGUAGE, lang);
            } catch (e) {
                console.warn('Failed to save language preference:', e);
            }
        }

        // Update language content visibility
        document.querySelectorAll('.lang-content').forEach(el => {
            if (el.classList.contains(`lang-${lang}`)) {
                el.classList.add('active');
            } else {
                el.classList.remove('active');
            }
        });

        // Update language toggle button text
        if (elements.languageToggle) {
            elements.languageToggle.textContent = lang === 'ko' ? 'ENG' : 'KOR';
        }

        // Update page title using i18n if available
        if (typeof i18n !== 'undefined') {
            i18n.setLanguage(lang);
            i18n.updatePageContent();
        } else {
            // Fallback for pages without i18n
            updatePageTitle(lang);
        }
    }

    function updatePageTitle(lang) {
        // Get the title key from data attribute
        const titleKey = document.documentElement.getAttribute('data-i18n-title');

        if (titleKey && typeof i18n !== 'undefined') {
            document.title = i18n.t(titleKey);
        } else {
            // Fallback titles
            const titles = {
                ko: '인성의 웹사이트 - 포트폴리오 & 프로젝트',
                en: "Inseong's Website - Portfolio & Projects"
            };
            document.title = titles[lang] || titles.en;
        }
    }

    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);

        // Save to storage with error handling
        if (typeof safeStorage !== 'undefined') {
            safeStorage.setItem(CONFIG.STORAGE_KEYS.THEME, theme);
        } else {
            try {
                localStorage.setItem(CONFIG.STORAGE_KEYS.THEME, theme);
            } catch (e) {
                console.warn('Failed to save theme preference:', e);
            }
        }

        // Update or create meta theme-color for mobile browsers
        updateMetaThemeColor(theme);

        // Add smooth transition class
        document.body.classList.add('theme-transition');
        setTimeout(() => {
            document.body.classList.remove('theme-transition');
        }, CONFIG.THEME_TRANSITION_DURATION);
    }

    function updateMetaThemeColor(theme) {
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');

        if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.name = 'theme-color';
            document.head.appendChild(metaThemeColor);
        }

        metaThemeColor.content = CONFIG.THEME_COLORS[theme] || CONFIG.THEME_COLORS.light;
    }

    function getStoredLanguage() {
        if (typeof safeStorage !== 'undefined') {
            return safeStorage.getItem(CONFIG.STORAGE_KEYS.LANGUAGE, CONFIG.DEFAULT_LANG);
        }

        try {
            return localStorage.getItem(CONFIG.STORAGE_KEYS.LANGUAGE) || CONFIG.DEFAULT_LANG;
        } catch (e) {
            console.warn('Failed to read language from storage:', e);
            return CONFIG.DEFAULT_LANG;
        }
    }

    function getPreferredTheme() {
        // Check for saved preference
        let savedTheme;

        if (typeof safeStorage !== 'undefined') {
            savedTheme = safeStorage.getItem(CONFIG.STORAGE_KEYS.THEME);
        } else {
            try {
                savedTheme = localStorage.getItem(CONFIG.STORAGE_KEYS.THEME);
            } catch (e) {
                console.warn('Failed to read theme from storage:', e);
            }
        }

        if (savedTheme) {
            return savedTheme;
        }

        // Check system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }

        return CONFIG.DEFAULT_THEME;
    }

    // Initialize language
    const savedLang = getStoredLanguage();
    setLanguage(savedLang);

    // Initialize theme
    const preferredTheme = getPreferredTheme();
    setTheme(preferredTheme);

    // Listen for system theme changes
    if (window.matchMedia) {
        const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');

        // Use addEventListener if available (newer browsers), otherwise use addListener
        const changeHandler = (e) => {
            // Only auto-switch if user hasn't manually set a preference
            const hasManualPreference = safeStorage ?
                safeStorage.hasItem(CONFIG.STORAGE_KEYS.THEME) :
                localStorage.getItem(CONFIG.STORAGE_KEYS.THEME) !== null;

            if (!hasManualPreference) {
                setTheme(e.matches ? 'dark' : 'light');
            }
        };

        if (darkModeQuery.addEventListener) {
            darkModeQuery.addEventListener('change', changeHandler);
        } else if (darkModeQuery.addListener) {
            // Fallback for older browsers
            darkModeQuery.addListener(changeHandler);
        }
    }

    // Expose functions globally for backward compatibility
    window.setLanguage = setLanguage;
    window.setTheme = setTheme;
});
