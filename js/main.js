document.addEventListener('DOMContentLoaded', function() {
    // Course menu supports hover, keyboard and touch on all shared headers.
    const courseUrl = new URL('/pages/lectures.html', location.origin).href;
    const weekUrl = new URL('ai-algorithm-week2.html', courseUrl).href;
    function courseMenu(mobile) {
        const li = document.createElement('li');
        li.className = 'nav-item course-nav' + (mobile ? ' course-nav-mobile' : '');
        li.innerHTML = `<button class="nav-text-link course-trigger" aria-expanded="false"><span class="lang-content lang-ko active">강의자료</span><span class="lang-content lang-en">Lectures</span> <span aria-hidden="true">⌄</span></button><div class="course-dropdown" hidden><a class="course-heading" href="${courseUrl}">AI알고리즘</a><a href="${weekUrl}">2주차 데이터 과학의 이해와 분석</a></div>`;
        const button = li.querySelector('button'), panel = li.querySelector('.course-dropdown');
        const setOpen = open => { panel.hidden = !open; button.setAttribute('aria-expanded', String(open)); };
        button.addEventListener('click', () => setOpen(panel.hidden));
        if (!mobile) {
            li.addEventListener('mouseenter', () => { if (matchMedia('(hover: hover)').matches) setOpen(true); });
            li.addEventListener('mouseleave', () => { if (!li.contains(document.activeElement)) setOpen(false); });
        }
        li.addEventListener('focusout', () => setTimeout(() => { if (!li.contains(document.activeElement)) setOpen(false); }, 0));
        li.addEventListener('keydown', e => { if (e.key === 'Escape') { setOpen(false); button.focus(); e.stopPropagation(); } });
        document.addEventListener('click', e => { if (!li.contains(e.target)) setOpen(false); });
        return li;
    }
    document.querySelectorAll('#mainNav > ul, #mobileNav > ul').forEach(ul => {
        if (!ul.querySelector('.course-nav')) ul.appendChild(courseMenu(!!ul.closest('#mobileNav')));
    });

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
            mobileMenuToggle.setAttribute('aria-expanded', String(mobileNav.classList.contains('open')));
            const icon = mobileMenuToggle.querySelector('i');
            if (icon) {
                icon.className = mobileNav.classList.contains('open') ? 'fas fa-times' : 'fas fa-bars';
            }
        });

        // Close mobile nav on link click
        mobileNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileNav.classList.remove('open');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
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
            mobileMenuToggle.setAttribute('aria-expanded', String(mainNav.classList.contains('mobile-open')));
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
