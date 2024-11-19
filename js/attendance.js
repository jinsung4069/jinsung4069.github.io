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
        this.attendanceDateInput = document.getElementById('attendanceDate');
        this.attendanceTableBody = document.getElementById('attendanceTableBody');
        this.attendanceRecordsDiv = document.getElementById('attendanceRecords');
        
        // Set default date to today
        const today = new Date().toISOString().split('T')[0];
        this.attendanceDateInput.value = today;
    }

    addEventListeners() {
        this.studentForm.addEventListener('submit', (e) => this.handleAddStudent(e));
        this.attendanceDateInput.addEventListener('change', () => this.updateAttendanceTable());
    }

    handleAddStudent(e) {
        e.preventDefault();
        const name = this.studentNameInput.value.trim();
        
        if (name && !this.students.includes(name)) {
            this.students.push(name);
            this.saveStudents();
            this.updateAttendanceTable();
            this.studentNameInput.value = '';
        }
    }

    updateAttendanceTable() {
        this.attendanceTableBody.innerHTML = '';
        const currentDate = this.attendanceDateInput.value;
        
        this.students.forEach(student => {
            const row = document.createElement('tr');
            const status = this.getAttendanceStatus(student, currentDate);
            
            row.innerHTML = `
                <td>${student}</td>
                <td>${status || 'Not marked'}</td>
                <td>
                    <div class="status-buttons">
                        <button onclick="attendanceSystem.markAttendance('${student}', 'Present')" 
                                class="present-btn ${status === 'Present' ? 'selected' : ''}">Present</button>
                        <button onclick="attendanceSystem.markAttendance('${student}', 'Absent')" 
                                class="absent-btn ${status === 'Absent' ? 'selected' : ''}">Absent</button>
                    </div>
                </td>
            `;
            
            this.attendanceTableBody.appendChild(row);
        });
    }

    markAttendance(student, status) {
        const date = this.attendanceDateInput.value;
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

        // Group records by date
        Object.entries(this.attendanceRecords).forEach(([key, status]) => {
            const [date, student] = key.split('_');
            if (!records[date]) records[date] = [];
            records[date].push({ student, status });
        });

        // Display records grouped by date
        Object.entries(records)
            .sort((a, b) => b[0].localeCompare(a[0])) // Sort by date descending
            .forEach(([date, entries]) => {
                const recordCard = document.createElement('div');
                recordCard.className = 'record-card';
                recordCard.innerHTML = `
                    <h3>Date: ${date}</h3>
                    ${entries.map(entry => 
                        `<p>${entry.student}: ${entry.status}</p>`
                    ).join('')}
                `;
                this.attendanceRecordsDiv.appendChild(recordCard);
            });
    }

    // Local Storage functions
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

// Initialize the attendance system
let attendanceSystem;
document.addEventListener('DOMContentLoaded', () => {
    attendanceSystem = new AttendanceSystem();
}); 