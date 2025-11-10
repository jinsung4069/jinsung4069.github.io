/**
 * Attendance Management System
 * Manages student attendance records with localStorage persistence
 */

// Storage keys
const STORAGE_KEYS = {
    STUDENTS: 'students',
    ATTENDANCE_RECORDS: 'attendanceRecords'
};

// Validators
const validators = {
    students: (data) => Array.isArray(data),
    attendanceRecords: (data) => typeof data === 'object' && data !== null
};

class AttendanceSystem {
    constructor() {
        // Check if safeStorage is available
        if (typeof safeStorage === 'undefined') {
            console.error('safeStorage is not loaded. Please include storage.js before attendance.js');
            this.storage = {
                getJSON: (key, def) => {
                    try {
                        return JSON.parse(localStorage.getItem(key)) || def;
                    } catch (e) {
                        console.error('Storage error:', e);
                        return def;
                    }
                },
                setJSON: (key, val) => {
                    try {
                        localStorage.setItem(key, JSON.stringify(val));
                        return true;
                    } catch (e) {
                        console.error('Storage error:', e);
                        return false;
                    }
                }
            };
        } else {
            this.storage = safeStorage;
        }

        this.students = this.loadStudents();
        this.attendanceRecords = this.loadAttendanceRecords();
        this.initializeElements();
        this.addEventListeners();
        this.updateAttendanceTable();
        this.displayAttendanceRecords();
    }

    initializeElements() {
        // Get all form elements
        this.elements = {
            studentForm: document.getElementById('studentForm'),
            studentNameInput: document.getElementById('studentName'),
            studentFormEn: document.getElementById('studentFormEn'),
            studentNameInputEn: document.getElementById('studentNameEn'),
            attendanceDateInput: document.getElementById('attendanceDate'),
            attendanceDateInputEn: document.getElementById('attendanceDateEn'),
            attendanceTableBody: document.getElementById('attendanceTableBody'),
            attendanceRecordsDiv: document.getElementById('attendanceRecords')
        };

        // Set today's date on both date inputs
        const today = new Date().toISOString().split('T')[0];
        if (this.elements.attendanceDateInput) {
            this.elements.attendanceDateInput.value = today;
        }
        if (this.elements.attendanceDateInputEn) {
            this.elements.attendanceDateInputEn.value = today;
        }
    }

    addEventListeners() {
        // Student form submissions
        if (this.elements.studentForm) {
            this.elements.studentForm.addEventListener('submit', (e) => this.handleAddStudent(e, 'ko'));
        }
        if (this.elements.studentFormEn) {
            this.elements.studentFormEn.addEventListener('submit', (e) => this.handleAddStudent(e, 'en'));
        }

        // Date change listeners
        if (this.elements.attendanceDateInput) {
            this.elements.attendanceDateInput.addEventListener('change', () => this.updateAttendanceTable());
        }
        if (this.elements.attendanceDateInputEn) {
            this.elements.attendanceDateInputEn.addEventListener('change', () => this.updateAttendanceTable());
        }
    }

    handleAddStudent(e, lang) {
        e.preventDefault();

        const input = lang === 'ko' ? this.elements.studentNameInput : this.elements.studentNameInputEn;
        if (!input) return;

        const name = input.value.trim();

        if (!name) {
            this.showMessage('msg_please_enter_name', 'warning');
            return;
        }

        if (this.students.includes(name)) {
            this.showMessage('msg_student_exists', 'warning');
            return;
        }

        this.students.push(name);
        const saved = this.saveStudents();

        if (saved) {
            this.updateAttendanceTable();
            input.value = '';
            this.showMessage('msg_student_added', 'success');
        } else {
            this.showMessage('msg_error_save_data', 'error');
        }
    }

    updateAttendanceTable() {
        if (!this.elements.attendanceTableBody) return;

        this.elements.attendanceTableBody.innerHTML = '';
        const currentDate = this.getCurrentDate();
        const t = (key) => window.i18n ? window.i18n.t(key) : key;

        this.students.forEach(student => {
            const row = document.createElement('tr');
            const status = this.getAttendanceStatus(student, currentDate);

            row.innerHTML = `
                <td>${this.escapeHtml(student)}</td>
                <td>${status || t('attendance_not_marked')}</td>
                <td>
                    <div class="status-buttons">
                        <button data-student="${this.escapeHtml(student)}"
                                data-status="Present"
                                class="present-btn ${status === 'Present' ? 'selected' : ''}"
                                title="${t('attendance_present')}">
                            ${t('attendance_present')}
                        </button>
                        <button data-student="${this.escapeHtml(student)}"
                                data-status="Absent"
                                class="absent-btn ${status === 'Absent' ? 'selected' : ''}"
                                title="${t('attendance_absent')}">
                            ${t('attendance_absent')}
                        </button>
                    </div>
                </td>
            `;

            // Add event listeners to buttons (safer than inline onclick)
            const buttons = row.querySelectorAll('button[data-student]');
            buttons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const studentName = e.currentTarget.getAttribute('data-student');
                    const statusValue = e.currentTarget.getAttribute('data-status');
                    this.markAttendance(studentName, statusValue);
                });
            });

            this.elements.attendanceTableBody.appendChild(row);
        });
    }

    markAttendance(student, status) {
        const date = this.getCurrentDate();
        const key = `${date}_${student}`;

        this.attendanceRecords[key] = status;
        const saved = this.saveAttendanceRecords();

        if (saved) {
            this.updateAttendanceTable();
            this.displayAttendanceRecords();
        } else {
            this.showMessage('msg_error_save_data', 'error');
        }
    }

    getAttendanceStatus(student, date) {
        return this.attendanceRecords[`${date}_${student}`];
    }

    displayAttendanceRecords() {
        if (!this.elements.attendanceRecordsDiv) return;

        this.elements.attendanceRecordsDiv.innerHTML = '';
        const records = {};
        const t = (key) => window.i18n ? window.i18n.t(key) : key;

        // Group records by date
        Object.entries(this.attendanceRecords).forEach(([key, status]) => {
            const [date, student] = key.split('_');
            if (!records[date]) records[date] = [];
            records[date].push({ student, status });
        });

        if (Object.keys(records).length === 0) {
            const noRecords = document.createElement('p');
            noRecords.className = 'no-records';
            noRecords.textContent = t('attendance_no_records');
            this.elements.attendanceRecordsDiv.appendChild(noRecords);
            return;
        }

        // Display records sorted by date (newest first)
        Object.entries(records)
            .sort((a, b) => b[0].localeCompare(a[0]))
            .forEach(([date, entries]) => {
                const recordCard = document.createElement('div');
                recordCard.className = 'record-card';
                recordCard.innerHTML = `
                    <h3>${t('attendance_date')}: ${date}</h3>
                    ${entries.map(entry =>
                    `<p>${this.escapeHtml(entry.student)}: ${entry.status}</p>`
                ).join('')}
                `;
                this.elements.attendanceRecordsDiv.appendChild(recordCard);
            });
    }

    getCurrentDate() {
        return this.elements.attendanceDateInput?.value ||
            this.elements.attendanceDateInputEn?.value ||
            new Date().toISOString().split('T')[0];
    }

    // Storage methods with error handling
    loadStudents() {
        return this.storage.getJSON(STORAGE_KEYS.STUDENTS, []);
    }

    saveStudents() {
        return this.storage.setJSON(STORAGE_KEYS.STUDENTS, this.students);
    }

    loadAttendanceRecords() {
        return this.storage.getJSON(STORAGE_KEYS.ATTENDANCE_RECORDS, {});
    }

    saveAttendanceRecords() {
        return this.storage.setJSON(STORAGE_KEYS.ATTENDANCE_RECORDS, this.attendanceRecords);
    }

    // Utility methods
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showMessage(messageKey, type = 'info') {
        // If i18n is available, get translated message
        const message = window.i18n ? window.i18n.t(messageKey) : messageKey;

        // Simple console logging for now
        // In production, you might want to show a toast notification
        const logMethod = type === 'error' ? 'error' : type === 'warning' ? 'warn' : 'log';
        console[logMethod](message);
    }
}

// Initialize when DOM is ready
let attendanceSystem;
document.addEventListener('DOMContentLoaded', () => {
    attendanceSystem = new AttendanceSystem();
});
