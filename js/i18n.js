/**
 * Internationalization (i18n) System
 * Manages bilingual content for Korean and English
 */

const translations = {
    ko: {
        // Navigation
        nav_home: '홈',
        nav_cv: 'CV',
        nav_projects: '프로젝트',
        nav_publications: '논문',
        nav_attendance: '출석 관리',
        nav_dqn_demo: 'DQN 데모',
        nav_microrobot: '마이크로로봇',
        nav_stackburger: 'StackBurger',

        // Page titles
        page_title_home: '인성의 웹사이트 - 포트폴리오 & 프로젝트',
        page_title_cv: 'CV - 인성의 웹사이트',
        page_title_projects: '프로젝트 - 인성의 웹사이트',
        page_title_publications: '논문 - 인성의 웹사이트',
        page_title_attendance: '출석 관리 시스템',
        page_title_dqn: 'DQN 그리드월드 데모',

        // Common
        language: '언어',
        theme_toggle: '다크모드 토글',

        // Hero section
        hero_greeting: '안녕하세요, 저는',
        hero_intro: '로봇공학과 인공지능 연구를 하는 학생입니다.',
        hero_view_cv: 'CV 보기',
        hero_view_projects: '프로젝트 보기',

        // Footer
        footer_copyright: '© 2024 인성의 웹사이트. All rights reserved.',
        footer_privacy: '개인정보 처리방침',
        footer_terms: '이용약관',
        footer_contact: '연락하기',

        // Attendance System
        attendance_title: '출석 관리 시스템',
        attendance_student_management: '학생 관리',
        attendance_add_student: '학생 추가',
        attendance_student_name: '학생 이름',
        attendance_add: '추가',
        attendance_date: '날짜',
        attendance_student_list: '학생 목록',
        attendance_name: '이름',
        attendance_status: '상태',
        attendance_actions: '동작',
        attendance_present: '출석',
        attendance_absent: '결석',
        attendance_late: '지각',
        attendance_not_marked: '미표시',
        attendance_delete: '삭제',
        attendance_history: '출석 기록',
        attendance_export: '내보내기',
        attendance_no_records: '출석 기록이 없습니다.',

        // DQN Demo
        dqn_title: 'DQN 그리드월드 데모',
        dqn_description: 'Q-Learning 알고리즘을 사용한 강화학습 데모',
        dqn_controls: '제어',
        dqn_start: '시작',
        dqn_pause: '일시정지',
        dqn_reset: '리셋',
        dqn_statistics: '통계',
        dqn_episode: '에피소드',
        dqn_steps: '단계',
        dqn_reward: '보상',
        dqn_success_rate: '성공률',

        // Buttons
        btn_add: '추가',
        btn_delete: '삭제',
        btn_export: '내보내기',
        btn_start: '시작',
        btn_pause: '일시정지',
        btn_reset: '리셋',
        btn_save: '저장',
        btn_cancel: '취소',

        // Messages
        msg_please_enter_name: '이름을 입력해주세요',
        msg_student_exists: '이미 존재하는 학생입니다',
        msg_student_added: '학생이 추가되었습니다',
        msg_student_deleted: '학생이 삭제되었습니다',
        msg_confirm_delete: '정말 삭제하시겠습니까?',
        msg_error_load_data: '데이터를 불러오는데 실패했습니다',
        msg_error_save_data: '데이터를 저장하는데 실패했습니다',
    },
    en: {
        // Navigation
        nav_home: 'Home',
        nav_cv: 'CV',
        nav_projects: 'Projects',
        nav_publications: 'Publications',
        nav_attendance: 'Attendance',
        nav_dqn_demo: 'DQN Demo',
        nav_microrobot: 'Micro Robot',
        nav_stackburger: 'StackBurger',

        // Page titles
        page_title_home: "Inseong's Website - Portfolio & Projects",
        page_title_cv: "CV - Inseong's Website",
        page_title_projects: "Projects - Inseong's Website",
        page_title_publications: "Publications - Inseong's Website",
        page_title_attendance: 'Attendance Management System',
        page_title_dqn: 'DQN GridWorld Demo',

        // Common
        language: 'Language',
        theme_toggle: 'Toggle Dark Mode',

        // Hero section
        hero_greeting: 'Hello, I am',
        hero_intro: 'A student researching robotics and artificial intelligence.',
        hero_view_cv: 'View CV',
        hero_view_projects: 'View Projects',

        // Footer
        footer_copyright: "© 2024 Inseong's Website. All rights reserved.",
        footer_privacy: 'Privacy Policy',
        footer_terms: 'Terms of Service',
        footer_contact: 'Contact',

        // Attendance System
        attendance_title: 'Attendance Management System',
        attendance_student_management: 'Student Management',
        attendance_add_student: 'Add Student',
        attendance_student_name: 'Student Name',
        attendance_add: 'Add',
        attendance_date: 'Date',
        attendance_student_list: 'Student List',
        attendance_name: 'Name',
        attendance_status: 'Status',
        attendance_actions: 'Actions',
        attendance_present: 'Present',
        attendance_absent: 'Absent',
        attendance_late: 'Late',
        attendance_not_marked: 'Not marked',
        attendance_delete: 'Delete',
        attendance_history: 'Attendance History',
        attendance_export: 'Export',
        attendance_no_records: 'No attendance records.',

        // DQN Demo
        dqn_title: 'DQN GridWorld Demo',
        dqn_description: 'Reinforcement Learning Demo using Q-Learning Algorithm',
        dqn_controls: 'Controls',
        dqn_start: 'Start',
        dqn_pause: 'Pause',
        dqn_reset: 'Reset',
        dqn_statistics: 'Statistics',
        dqn_episode: 'Episode',
        dqn_steps: 'Steps',
        dqn_reward: 'Reward',
        dqn_success_rate: 'Success Rate',

        // Buttons
        btn_add: 'Add',
        btn_delete: 'Delete',
        btn_export: 'Export',
        btn_start: 'Start',
        btn_pause: 'Pause',
        btn_reset: 'Reset',
        btn_save: 'Save',
        btn_cancel: 'Cancel',

        // Messages
        msg_please_enter_name: 'Please enter a name',
        msg_student_exists: 'Student already exists',
        msg_student_added: 'Student added successfully',
        msg_student_deleted: 'Student deleted successfully',
        msg_confirm_delete: 'Are you sure you want to delete?',
        msg_error_load_data: 'Failed to load data',
        msg_error_save_data: 'Failed to save data',
    }
};

class I18n {
    constructor() {
        this.currentLang = this.getStoredLanguage() || 'ko';
    }

    getStoredLanguage() {
        try {
            return localStorage.getItem('language') || 'ko';
        } catch (e) {
            console.warn('Failed to read language from localStorage:', e);
            return 'ko';
        }
    }

    setLanguage(lang) {
        if (!translations[lang]) {
            console.warn(`Language ${lang} not supported, falling back to Korean`);
            lang = 'ko';
        }
        this.currentLang = lang;
        try {
            localStorage.setItem('language', lang);
        } catch (e) {
            console.warn('Failed to save language to localStorage:', e);
        }
    }

    getLanguage() {
        return this.currentLang;
    }

    t(key) {
        const translation = translations[this.currentLang]?.[key];
        if (!translation) {
            console.warn(`Translation key "${key}" not found for language "${this.currentLang}"`);
            return key;
        }
        return translation;
    }

    updatePageContent() {
        // Update all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.t(key);

            // Update text content or placeholder based on element type
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                if (element.hasAttribute('placeholder')) {
                    element.placeholder = translation;
                }
            } else {
                element.textContent = translation;
            }
        });

        // Update page title if it has data-i18n-title
        const titleKey = document.documentElement.getAttribute('data-i18n-title');
        if (titleKey) {
            document.title = this.t(titleKey);
        }
    }
}

// Create global instance
const i18n = new I18n();

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { I18n, i18n, translations };
}
