class AttendanceSystem {
    constructor() {
        const empty = () => ({ version: 2, students: [], records: [] });
        const validDate = date => typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date) &&
            !Number.isNaN(Date.parse(`${date}T12:00:00`)) && new Date(`${date}T12:00:00Z`).toISOString().slice(0, 10) === date;
        const validStatus = status => ['Present', 'Absent'].includes(status);
        const validData = data => data && data.version === 2 && Array.isArray(data.students) &&
            data.students.every(s => s && typeof s.id === 'string' && s.id && typeof s.name === 'string' && s.name.trim()) &&
            new Set(data.students.map(s => s.id)).size === data.students.length && Array.isArray(data.records) &&
            data.records.every(r => r && validDate(r.date) && validStatus(r.status) && data.students.some(s => s.id === r.studentId));
        this.store = localProgress.create('attendanceDataV2', empty, validData);
        this.data = this.store.value;
        if (!this.store.existed) {
            const names = this.store.readLegacy('students', () => [], value => Array.isArray(value) && value.every(s => typeof s === 'string' && s.trim()));
            const records = this.store.readLegacy('attendanceRecords', () => ({}), value => value && typeof value === 'object' && !Array.isArray(value) &&
                Object.entries(value).every(([key, status]) => validDate(key.slice(0, 10)) && key[10] === '_' && key.slice(11).trim() && validStatus(status)));
            const studentFor = name => {
                let student = this.data.students.find(s => s.name === name);
                if (!student) {
                    student = { id: `legacy-${this.data.students.length + 1}`, name };
                    this.data.students.push(student);
                }
                return student;
            };
            names.forEach(studentFor);
            Object.entries(records).forEach(([key, status]) => this.data.records.push({
                date: key.slice(0, 10), studentId: studentFor(key.slice(11)).id, status
            }));
            if (names.length || Object.keys(records).length) this.store.save(this.data);
        }
        const now = new Date();
        this.date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
        this.dates = ['attendanceDate', 'attendanceDateEn'].map(id => document.getElementById(id));
        this.dates.forEach(input => {
            input.value = this.date;
            input.addEventListener('change', () => {
                if (!validDate(input.value)) { input.value = this.date; return; }
                this.date = input.value;
                this.dates.forEach(other => { other.value = this.date; });
                this.render();
            });
        });
        [['studentForm', 'studentName'], ['studentFormEn', 'studentNameEn']].forEach(([formId, inputId]) => {
            const input = document.getElementById(inputId);
            document.getElementById(formId).addEventListener('submit', event => {
                event.preventDefault();
                const name = input.value.trim();
                if (!name) return;
                if (this.data.students.some(student => student.name === name)) {
                    alert(this.text('이미 등록된 이름입니다.', 'This name is already registered.'));
                    return;
                }
                this.data.students.push({ id: crypto.randomUUID(), name });
                this.store.save(this.data);
                input.value = '';
                this.render();
            });
        });
        document.getElementById('exportAttendance').addEventListener('click', () => this.store.exportData());
        new MutationObserver(() => this.render()).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
        this.render();
    }
    text(ko, en) { return document.documentElement.lang === 'en' ? en : ko; }
    statusText(status) {
        return status === 'Present' ? this.text('출석', 'Present') : status === 'Absent' ? this.text('결석', 'Absent') : this.text('미확인', 'Not marked');
    }
    markAttendance(studentId, status) {
        const record = this.data.records.find(r => r.date === this.date && r.studentId === studentId);
        if (record) record.status = status;
        else this.data.records.push({ date: this.date, studentId, status });
        this.store.save(this.data);
        this.render();
    }
    render() {
        const body = document.getElementById('attendanceTableBody');
        body.replaceChildren();
        this.data.students.forEach(student => {
            const row = document.createElement('tr');
            const name = document.createElement('td');
            name.textContent = student.name;
            const status = document.createElement('td');
            const record = this.data.records.find(r => r.date === this.date && r.studentId === student.id);
            status.textContent = this.statusText(record?.status);
            const actions = document.createElement('td');
            const buttons = document.createElement('div');
            buttons.className = 'status-buttons';
            ['Present', 'Absent'].forEach(value => {
                const button = document.createElement('button');
                button.type = 'button';
                button.textContent = this.statusText(value);
                button.className = `${value.toLowerCase()}-btn${record?.status === value ? ' selected' : ''}`;
                button.setAttribute('aria-label', `${student.name}, ${this.statusText(value)}`);
                button.setAttribute('aria-pressed', String(record?.status === value));
                button.addEventListener('click', () => this.markAttendance(student.id, value));
                buttons.append(button);
            });
            actions.append(buttons);
            row.append(name, status, actions);
            body.append(row);
        });
        const records = document.getElementById('attendanceRecords');
        records.replaceChildren();
        [...new Set(this.data.records.map(r => r.date))].sort().reverse().forEach(date => {
            const card = document.createElement('div');
            card.className = 'record-card';
            const heading = document.createElement('h3');
            heading.textContent = date;
            card.append(heading);
            this.data.records.filter(r => r.date === date).forEach(record => {
                const line = document.createElement('p');
                line.textContent = `${this.data.students.find(s => s.id === record.studentId).name}: ${this.statusText(record.status)}`;
                card.append(line);
            });
            records.append(card);
        });
        document.getElementById('exportAttendance').textContent = this.text('출석 기록 내보내기 (JSON)', 'Export attendance (JSON)');
    }
}

document.addEventListener('DOMContentLoaded', () => new AttendanceSystem());
