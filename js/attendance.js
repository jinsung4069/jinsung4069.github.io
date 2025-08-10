class AttendanceSystem {
    constructor() {
        this.students = this.loadStudents();
        this.attendanceRecords = this.loadAttendanceRecords();
        this.initializeElements();
        this.addEventListeners();
        this.updateAttendanceTable();
        this.displayAttendanceRecords();
    }

    initializeElements() {
        this.studentForm = document.getElementById('studentForm');
        this.studentNameInput = document.getElementById('studentName');
        this.studentFormEn = document.getElementById('studentFormEn');
        this.studentNameInputEn = document.getElementById('studentNameEn');
        this.attendanceDateInput = document.getElementById('attendanceDate');
        this.attendanceDateInputEn = document.getElementById('attendanceDateEn');
        this.attendanceTableBody = document.getElementById('attendanceTableBody');
        this.attendanceRecordsDiv = document.getElementById('attendanceRecords');
        
        const today = new Date().toISOString().split('T')[0];
        this.attendanceDateInput.value = today;
        this.attendanceDateInputEn.value = today;
    }

    addEventListeners() {
        this.studentForm.addEventListener('submit', (e) => this.handleAddStudent(e, 'ko'));
        this.studentFormEn.addEventListener('submit', (e) => this.handleAddStudent(e, 'en'));
        this.attendanceDateInput.addEventListener('change', () => this.updateAttendanceTable());
        this.attendanceDateInputEn.addEventListener('change', () => this.updateAttendanceTable());
    }

    handleAddStudent(e, lang) {
        e.preventDefault();
        const name = lang === 'ko' ? this.studentNameInput.value.trim() : this.studentNameInputEn.value.trim();
        
        if (name && !this.students.includes(name)) {
            this.students.push(name);
            this.saveStudents();
            this.updateAttendanceTable();
            if (lang === 'ko') {
                this.studentNameInput.value = '';
            } else {
                this.studentNameInputEn.value = '';
            }
        }
    }

    updateAttendanceTable() {
        this.attendanceTableBody.innerHTML = '';
        const currentDate = this.attendanceDateInput.value || this.attendanceDateInputEn.value;
        const currentLang = document.documentElement.lang;
        
        this.students.forEach(student => {
            const row = document.createElement('tr');
            const status = this.getAttendanceStatus(student, currentDate);
            
            row.innerHTML = `
                <td>${student}</td>
                <td>${status || (currentLang === 'ko' ? '미표시' : 'Not marked')}</td>
                <td>
                    <div class="status-buttons">
                        <button onclick="attendanceSystem.markAttendance('${student}', 'Present')" 
                                class="present-btn ${status === 'Present' ? 'selected' : ''}">${currentLang === 'ko' ? '출석' : 'Present'}</button>
                        <button onclick="attendanceSystem.markAttendance('${student}', 'Absent')" 
                                class="absent-btn ${status === 'Absent' ? 'selected' : ''}">${currentLang === 'ko' ? '결석' : 'Absent'}</button>
                    </div>
                </td>
            `;
            
            this.attendanceTableBody.appendChild(row);
        });
    }

    markAttendance(student, status) {
        const date = this.attendanceDateInput.value || this.attendanceDateInputEn.value;
        const key = `${date}_${student}`;
        
        this.attendanceRecords[key] = status;
        this.saveAttendanceRecords();
        this.updateAttendanceTable();
        this.displayAttendanceRecords();
    }

    getAttendanceStatus(student, date) {
        return this.attendanceRecords[`${date}_${student}`];
    }

    displayAttendanceRecords() {
        this.attendanceRecordsDiv.innerHTML = '';
        const records = {};
        const currentLang = document.documentElement.lang;

        Object.entries(this.attendanceRecords).forEach(([key, status]) => {
            const [date, student] = key.split('_');
            if (!records[date]) records[date] = [];
            records[date].push({ student, status });
        });

        Object.entries(records)
            .sort((a, b) => b[0].localeCompare(a[0]))
            .forEach(([date, entries]) => {
                const recordCard = document.createElement('div');
                recordCard.className = 'record-card';
                recordCard.innerHTML = `
                    <h3>${currentLang === 'ko' ? '날짜' : 'Date'}: ${date}</h3>
                    ${entries.map(entry => 
                        `<p>${entry.student}: ${entry.status}</p>`
                    ).join('')}
                `;
                this.attendanceRecordsDiv.appendChild(recordCard);
            });
    }

    loadStudents() {
        return JSON.parse(localStorage.getItem('students')) || [];
    }

    saveStudents() {
        localStorage.setItem('students', JSON.stringify(this.students));
    }

    loadAttendanceRecords() {
        return JSON.parse(localStorage.getItem('attendanceRecords')) || {};
    }

    saveAttendanceRecords() {
        localStorage.setItem('attendanceRecords', JSON.stringify(this.attendanceRecords));
    }
}

let attendanceSystem;
document.addEventListener('DOMContentLoaded', () => {
    attendanceSystem = new AttendanceSystem();
});