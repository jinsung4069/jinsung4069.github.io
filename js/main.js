document.addEventListener('DOMContentLoaded', function () {
    const preferences = window.sitePreferences;
    const bilingual = document.documentElement.dataset.bilingual === 'true';
    const languageToggle = document.getElementById('languageToggle');
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const mobileNav = document.getElementById('mobileNav');
    const mainNav = document.getElementById('mainNav');
    const mobilePanel = mobileNav || mainNav;
    const mobileClass = mobileNav ? 'open' : 'mobile-open';
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
    let manualTheme = preferences.read('theme');
    if (!['light', 'dark'].includes(manualTheme)) manualTheme = null;

    function label(ko, en) { return document.documentElement.lang === 'en' ? en : ko; }
    function closeCourses() {
        document.querySelectorAll('.course-nav').forEach(item => {
            item.querySelector('.course-dropdown').hidden = true;
            item.querySelector('.course-trigger').setAttribute('aria-expanded', 'false');
        });
    }
    function courseMenu(mobile) {
        const item = document.createElement('li');
        item.className = 'nav-item course-nav' + (mobile ? ' course-nav-mobile' : '');
        const id = mobile ? 'mobile-course-links' : 'desktop-course-links';
        item.innerHTML = `<button type="button" class="nav-text-link course-trigger" aria-expanded="false" aria-controls="${id}"><span class="lang-content lang-ko active">강의자료</span><span class="lang-content lang-en">Lectures</span> <span aria-hidden="true">⌄</span></button><div class="course-dropdown" id="${id}" hidden><a class="course-heading" href="/lectures/"><span class="lang-content lang-ko active">강의자료 전체 보기</span><span class="lang-content lang-en">All courses</span></a><a href="/ai-algorithm-week2/"><span class="lang-content lang-ko active">AI알고리즘, 2주차</span><span class="lang-content lang-en">AI Algorithms, Week 2</span></a><a href="/computer-education2/"><span class="lang-content lang-ko active">컴퓨터과교육2</span><span class="lang-content lang-en">Computer Education 2</span></a></div>`;
        const button = item.querySelector('button');
        const panel = item.querySelector('.course-dropdown');
        let openedByHover = false;
        function setOpen(open) {
            panel.hidden = !open;
            button.setAttribute('aria-expanded', String(open));
            if (!open) openedByHover = false;
        }
        button.addEventListener('click', () => {
            setOpen(openedByHover || panel.hidden);
            openedByHover = false;
        });
        if (!mobile) {
            item.addEventListener('mouseenter', () => {
                if (matchMedia('(hover: hover) and (min-width: 769px)').matches && panel.hidden) {
                    setOpen(true);
                    openedByHover = true;
                }
            });
            item.addEventListener('mouseleave', () => {
                if (!item.contains(document.activeElement)) setOpen(false);
            });
        }
        item.addEventListener('focusout', () => setTimeout(() => {
            if (!item.contains(document.activeElement)) setOpen(false);
        }, 0));
        item.addEventListener('keydown', event => {
            if (event.key === 'Escape' && !panel.hidden) {
                setOpen(false); button.focus(); event.preventDefault(); event.stopPropagation();
            }
            if (event.target === button && ['ArrowDown', 'ArrowUp'].includes(event.key)) {
                setOpen(true); openedByHover = false;
                const links = panel.querySelectorAll('a');
                links[event.key === 'ArrowDown' ? 0 : links.length - 1].focus();
                event.preventDefault();
            }
        });
        document.addEventListener('click', event => { if (!item.contains(event.target)) setOpen(false); });
        return item;
    }
    if (document.documentElement.dataset.courseNav !== 'hidden') {
        document.querySelectorAll('#mainNav > ul, #mobileNav > ul').forEach(list => {
            if (!list.querySelector('.course-nav')) list.appendChild(courseMenu(!!list.closest('#mobileNav')));
        });
    }

    function setMobileOpen(open, restoreFocus = false) {
        if (!mobileMenuToggle || !mobilePanel) return;
        mobilePanel.classList.toggle(mobileClass, open);
        mobileMenuToggle.setAttribute('aria-expanded', String(open));
        mobileMenuToggle.setAttribute('aria-controls', mobilePanel.id);
        mobileMenuToggle.setAttribute('aria-label', open ? label('메뉴 닫기', 'Close menu') : label('메뉴 열기', 'Open menu'));
        const icon = mobileMenuToggle.querySelector('i');
        if (icon) icon.className = open ? 'fas fa-times' : 'fas fa-bars';
        else mobileMenuToggle.textContent = open ? '✕' : '☰';
        if (!open) closeCourses();
        if (restoreFocus) mobileMenuToggle.focus();
    }
    if (mobileMenuToggle && mobilePanel) {
        setMobileOpen(false);
        mobileMenuToggle.addEventListener('click', () => setMobileOpen(!mobilePanel.classList.contains(mobileClass)));
        mobilePanel.addEventListener('click', event => {
            if (event.target.closest('a')) setMobileOpen(false);
        });
        document.addEventListener('keydown', event => {
            if (event.key === 'Escape' && mobilePanel.classList.contains(mobileClass)) {
                setMobileOpen(false, true); event.preventDefault();
            }
        });
        document.addEventListener('click', event => {
            if (mobilePanel.classList.contains(mobileClass) && !mobilePanel.contains(event.target) && !mobileMenuToggle.contains(event.target)) setMobileOpen(false);
        });
        matchMedia('(min-width: 769px)').addEventListener('change', event => { if (event.matches) setMobileOpen(false); });
    }

    function setLanguage(requested, persist = false) {
        const lang = bilingual && requested === 'en' ? 'en' : 'ko';
        document.documentElement.lang = lang;
        if (persist && bilingual) preferences.write('language', lang);
        document.querySelectorAll('.lang-content').forEach(element => {
            element.classList.toggle('active', element.classList.contains('lang-' + lang));
        });
        if (languageToggle) {
            languageToggle.textContent = lang === 'ko' ? 'ENG' : 'KOR';
            languageToggle.setAttribute('aria-label', lang === 'ko' ? 'Switch to English' : '한국어로 전환');
        }
        const title = lang === 'ko' ? document.body.dataset.titleKo : document.body.dataset.titleEn;
        if (title) document.title = title;
        if (mobileMenuToggle && mobilePanel) {
            setMobileOpen(mobilePanel.classList.contains(mobileClass));
        }
    }
    if (languageToggle) languageToggle.addEventListener('click', () => {
        setLanguage(document.documentElement.lang === 'ko' ? 'en' : 'ko', true);
    });

    function setTheme(theme, animate = false) {
        document.documentElement.dataset.theme = theme;
        if (darkModeToggle) darkModeToggle.setAttribute('aria-pressed', String(theme === 'dark'));
        let meta = document.querySelector('meta[name="theme-color"]');
        if (!meta) { meta = document.createElement('meta'); meta.name = 'theme-color'; document.head.appendChild(meta); }
        meta.content = theme === 'dark' ? '#1a1d23' : '#ffffff';
        if (animate && !reducedMotion.matches) {
            document.body.classList.add('theme-transition');
            setTimeout(() => document.body.classList.remove('theme-transition'), 300);
        }
    }
    if (darkModeToggle) darkModeToggle.addEventListener('click', () => {
        manualTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
        preferences.write('theme', manualTheme);
        setTheme(manualTheme, true);
    });
    setLanguage(preferences.read('language'));
    setTheme(preferences.theme());
    systemTheme.addEventListener('change', event => { if (!manualTheme) setTheme(event.matches ? 'dark' : 'light'); });

    const skillsSection = document.querySelector('.skills-section');
    if (skillsSection && !reducedMotion.matches && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                entry.target.querySelectorAll('.progress-bar').forEach(bar => {
                    const width = bar.style.width; bar.style.width = '0%';
                    setTimeout(() => { bar.style.width = width; }, 100);
                });
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.3 });
        observer.observe(skillsSection);
    }
});
