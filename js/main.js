document.addEventListener('DOMContentLoaded', function() {
    const languageToggle = document.getElementById('languageToggle');
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const mobileNav = document.getElementById('mobileNav');

    // Language toggle functionality
    if (languageToggle) {
        languageToggle.addEventListener('click', () => {
            const currentLang = document.documentElement.lang;
            const newLang = currentLang === 'ko' ? 'en' : 'ko';
            setLanguage(newLang);
        });
    }

    // Mobile menu toggle
    if (mobileMenuToggle && mobileNav) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileNav.classList.toggle('open');
            const icon = mobileMenuToggle.querySelector('i');
            if (icon) {
                icon.className = mobileNav.classList.contains('open') ? 'fas fa-times' : 'fas fa-bars';
            }
        });

        // Close mobile nav on link click
        mobileNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileNav.classList.remove('open');
                const icon = mobileMenuToggle.querySelector('i');
                if (icon) icon.className = 'fas fa-bars';
            });
        });
    }

    // Legacy mobile menu support (for sub-pages using mainNav)
    const mainNav = document.getElementById('mainNav');
    if (mobileMenuToggle && mainNav && !mobileNav) {
        mobileMenuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('mobile-open');
            const icon = mobileMenuToggle.querySelector('i');
            if (icon) {
                icon.className = mainNav.classList.contains('mobile-open') ? 'fas fa-times' : 'fas fa-bars';
            } else {
                mobileMenuToggle.textContent = mainNav.classList.contains('mobile-open') ? '\u2715' : '\u2630';
            }
        });
    }

    // Dark mode toggle functionality
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            setTheme(newTheme);
        });
    }

    function setLanguage(lang) {
        document.documentElement.lang = lang;
        localStorage.setItem('language', lang);

        document.querySelectorAll('.lang-content').forEach(el => {
            if (el.classList.contains('lang-' + lang)) {
                el.classList.add('active');
            } else {
                el.classList.remove('active');
            }
        });

        if (languageToggle) {
            languageToggle.textContent = lang === 'ko' ? 'ENG' : 'KOR';
        }

        // data-title-ko/en\uc774 \uc788\ub294 \ud398\uc774\uc9c0\ub9cc \uc81c\ubaa9\uc744 \uc5b8\uc5b4\uc5d0 \ub9de\ucdb0 \uad50\uccb4 (\uc5c6\uc73c\uba74 \uc815\uc801 <title> \uc720\uc9c0)
        const newTitle = lang === 'ko' ? document.body?.dataset.titleKo : document.body?.dataset.titleEn;
        if (newTitle) document.title = newTitle;
    }

    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);

        if (darkModeToggle) {
            darkModeToggle.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
        }

        // Update meta theme-color
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.name = 'theme-color';
            document.head.appendChild(metaThemeColor);
        }
        metaThemeColor.content = theme === 'dark' ? '#1a1d23' : '#ffffff';

        // Add smooth transition class
        document.body.classList.add('theme-transition');
        setTimeout(() => {
            document.body.classList.remove('theme-transition');
        }, 300);
    }

    function getPreferredTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) return savedTheme;
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
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                setTheme(e.matches ? 'dark' : 'light');
            }
        });
    }

    // Animate progress bars on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bars = entry.target.querySelectorAll('.progress-bar');
                bars.forEach(bar => {
                    const width = bar.style.width;
                    bar.style.width = '0%';
                    setTimeout(() => {
                        bar.style.width = width;
                    }, 100);
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    const skillsSection = document.querySelector('.skills-section');
    if (skillsSection) {
        observer.observe(skillsSection);
    }
});
