/* Local-only records. Never overwrite an unreadable or malformed original. */
(function () {
    'use strict';
    const isObject = value => value !== null && typeof value === 'object' && !Array.isArray(value);
    function validProgress(value, moduleIds, withCode = false) {
        const mapOf = (map, test) => isObject(map) && Object.entries(map).every(([key, item]) => moduleIds.includes(key) && test(item));
        return isObject(value) && moduleIds.includes(value.currentModule) &&
            Array.isArray(value.completedModules) && value.completedModules.every(id => moduleIds.includes(id)) &&
            mapOf(value.scores, n => Number.isFinite(n) && n >= 0 && n <= 100) &&
            mapOf(value.attempts, n => Number.isSafeInteger(n) && n >= 0) &&
            (!withCode || mapOf(value.code, code => typeof code === 'string'));
    }
    function create(key, defaults, validate) {
        const originals = Object.create(null);
        let blocked = false, issue = '', panel, current, existed = false, controls, savedStatus;
        const messages = {
            corrupt: ['저장된 기록을 읽을 수 없어 원본을 보존했습니다. 이번 변경은 현재 탭에만 유지됩니다. 원본과 현재 기록을 내보내 복구하세요.', 'Stored records could not be read and have been preserved. Changes remain in this tab only. Export the original and current records for recovery.'],
            unavailable: ['브라우저 저장소를 사용할 수 없습니다. 변경은 현재 탭에만 유지되며, 새로고침하면 사라질 수 있습니다. 필요한 기록을 내보내세요.', 'Browser storage is unavailable. Changes remain in this tab only and may be lost on reload. Export records you need.']
        };
        function showIssue() {
            if (!issue || !document.querySelector('main')) return;
            if (!panel) {
                panel = document.createElement('aside');
                panel.className = 'local-storage-notice';
                panel.setAttribute('role', 'status');
                panel.style.cssText = 'margin:1rem auto;padding:1rem;border:2px solid #b87500;border-radius:8px;max-width:70rem;overflow-wrap:anywhere';
                const message = document.createElement('p');
                const button = document.createElement('button');
                button.type = 'button';
                button.addEventListener('click', exportData);
                panel.append(message, button);
                document.querySelector('main').prepend(panel);
            }
            const en = document.documentElement.lang === 'en';
            panel.firstChild.textContent = messages[issue][en ? 1 : 0];
            panel.lastChild.textContent = en ? 'Export records (JSON)' : '기록 내보내기 (JSON)';
        }
        function warn(kind) { if (issue !== 'corrupt') issue = kind; showIssue(); }
        function read(storageKey, fallback, isValid) {
            try {
                const raw = localStorage.getItem(storageKey);
                originals[storageKey] = raw;
                if (storageKey === key) existed = raw !== null;
                if (raw === null) return fallback();
                const data = JSON.parse(raw);
                if (!isValid(data)) throw new Error('Invalid stored record');
                return data;
            } catch (error) {
                blocked = true;
                warn(Object.hasOwn(originals, storageKey) ? 'corrupt' : 'unavailable');
                return fallback();
            }
        }
        function exportData() {
            const blob = new Blob([JSON.stringify({ key, current, originals }, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${key}-backup.json`;
            document.body.append(link);
            link.click();
            link.remove();
            setTimeout(() => URL.revokeObjectURL(url), 1000);
        }
        function mountControls() {
            if (controls || !document.querySelector('main')) return;
            controls = document.createElement('details');
            controls.className = 'record-tools';
            const summary = document.createElement('summary');
            const exportButton = document.createElement('button');
            const label = document.createElement('label');
            const input = document.createElement('input');
            savedStatus = document.createElement('p'); savedStatus.setAttribute('role', 'status');
            exportButton.type = 'button'; exportButton.addEventListener('click', exportData);
            input.type = 'file'; input.accept = '.json,application/json';
            const labelText = document.createElement('span'); label.append(labelText, input);
            const translate = () => {
                const en = document.documentElement.lang === 'en';
                summary.textContent = en ? 'Records on this browser' : '이 브라우저의 기록 관리';
                exportButton.textContent = en ? 'Export records (JSON)' : '기록 내보내기 (JSON)';
                labelText.textContent = en ? 'Import backup JSON ' : '백업 JSON 가져오기 ';
                if (!savedStatus.textContent) savedStatus.textContent = en ? 'Stored only on this device. Back up records before changing browsers.' : '이 기기에만 저장됩니다. 브라우저를 바꾸기 전에 기록을 내보내세요.';
            };
            input.addEventListener('change', async () => {
                const file = input.files[0]; if (!file) return;
                const en = document.documentElement.lang === 'en';
                try {
                    if (blocked) throw Error(en ? 'Preserved records must be exported before recovery in another browser.' : '손상된 원본을 보호하고 있습니다. 먼저 내보낸 뒤 다른 브라우저에서 복구하세요.');
                    if (file.size > 2 * 1024 * 1024) throw Error(en ? 'The file must be smaller than 2 MB.' : '2 MB 이하의 JSON 파일을 선택하세요.');
                    const backup = JSON.parse(await file.text(), (name, value) => {
                        if (['__proto__', 'prototype', 'constructor'].includes(name)) throw Error('Invalid field');
                        return value;
                    });
                    if (backup.key !== key || !validate(backup.current)) throw Error(en ? 'This backup does not match this activity.' : '이 활동에 맞는 백업 파일이 아니거나 내용이 올바르지 않습니다.');
                    if (!confirm(en ? 'Replace this activity’s current records with the selected backup? Export first if you need the current records.' : '선택한 백업으로 이 활동의 현재 기록을 바꿀까요? 현재 기록이 필요하면 취소하고 먼저 내보내세요.')) return;
                    // Commit to storage before publishing the new state to the activity.
                    localStorage.setItem(key, JSON.stringify(backup.current));
                    current = backup.current; existed = true;
                    window.dispatchEvent(new CustomEvent('local-progress-import', {detail: {key}}));
                    savedStatus.textContent = en ? 'Backup restored.' : '백업을 복원했습니다.';
                } catch (error) { savedStatus.textContent = error.message || String(error); }
                finally { input.value = ''; }
            });
            controls.append(summary, exportButton, label, savedStatus);
            document.querySelector('main').append(controls); translate();
            new MutationObserver(translate).observe(document.documentElement, {attributes:true, attributeFilter:['lang']});
        }
        current = read(key, defaults, validate);
        document.addEventListener('DOMContentLoaded', showIssue);
        if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mountControls);
        else queueMicrotask(mountControls);
        new MutationObserver(showIssue).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
        return {
            get value() { return current; },
            get existed() { return existed; },
            readLegacy: read,
            exportData,
            save(value) {
                current = value;
                if (blocked) return false;
                try {
                    localStorage.setItem(key, JSON.stringify(value));
                    issue = '';
                    if (panel) { panel.remove(); panel = null; }
                    if (savedStatus) savedStatus.textContent = document.documentElement.lang === 'en' ? 'Saved on this device.' : '이 기기에 저장했습니다.';
                    return true;
                } catch (error) { warn('unavailable'); return false; }
            },
            reset() {
                current = defaults();
                if (blocked) return current;
                try { localStorage.removeItem(key); }
                catch (error) { blocked = true; warn('unavailable'); }
                return current;
            }
        };
    }
    window.localProgress = { create, validProgress };
})();
