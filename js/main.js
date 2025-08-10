document.addEventListener('DOMContentLoaded', function() {
    const languageToggle = document.getElementById('languageToggle');
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
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

    // Set initial language
    const savedLang = localStorage.getItem('language') || 'ko';
    setLanguage(savedLang);
});
