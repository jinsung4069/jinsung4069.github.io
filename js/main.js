document.addEventListener('DOMContentLoaded', function() {
    const toggleBtn = document.getElementById('languageToggle');
    const mobileMenuBtn = document.getElementById('mobileMenuToggle');
    const navMenuEn = document.getElementById('navMenuEn');
    const navMenuKo = document.getElementById('navMenuKo');
    const enContent = document.querySelectorAll('.lang-en');
    const koContent = document.querySelectorAll('.lang-ko');

    let isMobileMenuOpen = false;

    function setLanguage(lang) {
        if (lang === 'ko') {
            enContent.forEach(el => el.classList.remove('active'));
            koContent.forEach(el => el.classList.add('active'));
            toggleBtn.textContent = 'ENG';
            document.documentElement.lang = 'ko';
            document.title = '인성의 웹사이트 - 포트폴리오 & 프로젝트';
            localStorage.setItem('language', 'ko');
            if (isMobileMenuOpen) {
                navMenuEn.classList.remove('mobile-open');
                navMenuKo.classList.add('mobile-open');
            }
        } else { // 'en'
            koContent.forEach(el => el.classList.remove('active'));
            enContent.forEach(el => el.classList.add('active'));
            toggleBtn.textContent = 'KOR';
            document.documentElement.lang = 'en';
            document.title = "Inseong's Website - Portfolio & Projects";
            localStorage.setItem('language', 'en');
            if (isMobileMenuOpen) {
                navMenuKo.classList.remove('mobile-open');
                navMenuEn.classList.add('mobile-open');
            }
        }
    }

    function openMobileMenu() {
        const isKorean = document.documentElement.lang === 'ko';
        if (isKorean) {
            navMenuKo.classList.add('mobile-open');
        } else {
            navMenuEn.classList.add('mobile-open');
        }
        mobileMenuBtn.innerHTML = '✕';
        isMobileMenuOpen = true;
    }

    function closeMobileMenu() {
        navMenuEn.classList.remove('mobile-open');
        navMenuKo.classList.remove('mobile-open');
        mobileMenuBtn.innerHTML = '☰';
        isMobileMenuOpen = false;
    }

    // --- Event Listeners ---

    toggleBtn.addEventListener('click', function() {
        const currentLang = document.documentElement.lang;
        if (currentLang === 'ko') {
            setLanguage('en');
        } else {
            setLanguage('ko');
        }
    });

    mobileMenuBtn.addEventListener('click', function() {
        if (isMobileMenuOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });

    document.addEventListener('click', function(e) {
        if (!e.target.closest('header') && isMobileMenuOpen) {
            closeMobileMenu();
        }
    });

    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && isMobileMenuOpen) {
            closeMobileMenu();
        }
    });

    // --- Initial Load ---
    function initialize() {
        const savedLang = localStorage.getItem('language');
        setLanguage(savedLang || 'ko');
    }

    initialize();
});