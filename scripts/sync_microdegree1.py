"""Build the 마이크로디그리 과정1 web decks from local PowerPoint copies on Windows.

Requires Pillow and pywin32, plus PowerPoint. Source files are never modified.
The work directory must be a task-specific, non-synchronized temporary directory.

    python scripts/sync_microdegree1.py --source-dir <PPTX folder> --work-dir <temp> [--only 1-1,1-2]
    python scripts/sync_microdegree1.py --pages-only

Each slide is exported as a 2000 x 1125 WebP after instructor names and departments are removed from
the working copy. Speaker notes are not published. Activities listed in labs/<session>.json are merged
after their anchor slides, and the course and session pages are rewritten from the catalog.
"""
from pathlib import Path
from html import escape
import argparse, hashlib, json, os, re, shutil, time, urllib.error, urllib.parse, urllib.request

ROOT = Path(__file__).resolve().parents[1]
COURSE = 'microdegree1'
COURSE_TITLE = '마이크로디그리 과정1 인공지능의 이해와 원리 기반 활용'
DATA = ROOT / 'data/lectures' / COURSE
IMAGES = ROOT / 'images/lectures' / COURSE
PAGES = ROOT / 'lectures' / COURSE
VERSION = '20261010a'

# id, week, half, title, card summary, source slides left out because they only introduce instructors.
SESSIONS = [
    ('1-1', 1, '오전', '개강식 및 오리엔테이션', '연수 안내, AI 기술 동향, AI 교육 정책과 쟁점', [5]),
    ('1-2', 1, '오후', '인공지능의 개념과 발전 Part 1', '인공지능의 정의와 특징, 지능 판단 기준, 발전의 주요 장면', [3, 4, 5, 6, 7, 8]),
    ('2-1', 2, '오전', '인공지능의 개념과 발전 Part 2', '발전 과정, 생활 속 인공지능, 사람과 AI의 역할', []),
    ('2-2', 2, '오후', '인공지능의 능력과 한계', 'AI의 능력과 한계, 분류와 추천과 생성, 학생 눈높이로 설명하기', []),
    ('3-1', 3, '오전', '기계학습과 인공신경망의 기본 원리', '기계학습의 과정, 학습 방식과 사례, 인공신경망과 딥러닝, 생성형 AI의 작동 원리', []),
    ('3-2', 3, '오후', '생활 속 인공지능 서비스 분석', '생활 서비스 시범 분석, 교육용 인공지능 서비스, 이용 조건과 적합성 판단', []),
    ('4-1', 4, '오전', '데이터와 인공지능 학습 Part 1', '데이터의 종류와 표현, 수집, 특성과 레이블과 데이터셋', []),
    ('4-2', 4, '오후', '데이터와 인공지능 학습 Part 2', '데이터 분류와 품질, 데이터 조건 비교 실습', []),
    ('5-1', 5, '오전', '지식 기반 인공지능 도구 활용 Part 1', '목적에 맞는 도구 선택, 원리 지식으로 한계 판단, 질문 설계와 반복 개선', []),
    ('5-2', 5, '오후', '지식 기반 인공지능 도구 활용 Part 2', '자료 기반 도구 활용, 협업, 기록', []),
    ('6-1', 6, '오전', '공정성과 편향성 및 책임 있는 활용 Part 1', '편향이 생기는 곳, 공정성 기준, 윤리 관점과 원칙, 편향 사례 분석', []),
    ('6-2', 6, '오후', '생성형 인공지능 결과 해석과 검증', '생성 원리 다시 보기, 오류의 유형, 근거 확인과 검증 절차', []),
    ('7-1', 7, '오전', '공정성과 편향성 및 책임 있는 활용 Part 2', '개인정보, 저작권, 투명성, 책임 있는 활용 기준, 학급 규칙 만들기', []),
    ('7-2', 7, '오후', '인공지능 활용 교육 프로젝트 설계', '문제 정의, 활용안 설계, TPACK 점검, 활용안 작성과 루브릭', []),
    ('8-1', 8, '오전', '프로젝트 발표 및 종합 평가, 수료식', '발표 운영, 동료 검토, 평가와 개선, 과정 성찰과 수료', []),
]
# Line breaks added in the working copy where a source title runs off its coloured band: (slide, find, replace).
FIXES = {'4-2': [(4, '품질, 학습', '품질,\v학습')], '8-1': [(4, '검토, 개선과', '검토,\v개선과')],
         # "오후" named the afternoon session, which the decks call Part 2.
         '5-1': [(39, '오후 준비', 'Part 2 준비')]}
# The pages are not tied to one run of the course: session dates, 오전/오후 and video running times are removed.
RUNNING_TIME = re.compile(r'재생 시간\s*\d+분(\s*\d+초)?')
SCHEDULE = [
    (re.compile(r'(\d주차)\s*\d{1,2}월\s*\d{1,2}일\([월화수목금토일]\)\s*(?:오전|오후)(,\s*)?'), lambda m: m[1] + (' ' if m[2] else '')),
    (re.compile(r'(\d주차)\s*(?:오전|오후)'), lambda m: m[1]),
    (re.compile(r'^(?:오전|오후)\s+(?=\d{1,2}:\d{2})'), lambda m: ''),
]
# Whole lines of the timetable slides that only give a date: {session: {slide: pattern}}.
SCHEDULE_LINES = {'1-1': {11: re.compile(r'\d{1,2}/\d{1,2}'), 12: re.compile(r'\d{1,2}/\d{1,2}|\d{1,2}월 \d{1,2}일에는 연수가 없고.*')}}
SCHEDULE_LEFT = re.compile(r'\d{1,2}월\s*\d{1,2}일\([월화수목금토일]\)|\d주차\s*(?:오전|오후)|재생 시간')
NAMES = ['전인성', '김희수', '심수정', '최은선', '허진웅', '마대성']
NAME = '(?:' + '|'.join(NAMES) + ')'
# A paragraph that is only a name, or only an affiliation ending in a department, is removed.
ONLY_PERSON = re.compile(rf'\(?\s*{NAME}\s*\)?(\s*(교수|강사|박사))?|\S*대학교\s+\S+(학과|교육과|전공)')
LEFTOVER = re.compile(rf'{NAME}|컴퓨터교육과')
YOUTUBE = re.compile(r'(?:youtu\.be/|youtube\.com/(?:watch\?v=|embed/|shorts/))([A-Za-z0-9_-]{11})')
MSO_GROUP, MSO_PICTURE, MSO_LINKED_PICTURE = 6, 13, 11


def save(path, text):
    """Replace a file in one step, so a page build running at the same time never reads half of it."""
    temp = path.with_name(f'{path.name}.{os.getpid()}.tmp')
    temp.write_text(text, encoding='utf-8', newline='\n')
    for attempt in range(20):
        try:
            os.replace(temp, path)
            return
        except PermissionError:
            time.sleep(.1)
    os.replace(temp, path)


def clean(text):
    return text.replace('\v', '\n').replace('\r', '\n').strip()


def text_ranges(shapes):
    """Yield every text range on a slide, including table cells and grouped shapes."""
    for shape in shapes:
        if shape.Type == MSO_GROUP:
            yield from text_ranges(shape.GroupItems)
        elif shape.HasTable:
            table = shape.Table
            for row in range(1, table.Rows.Count + 1):
                for col in range(1, table.Columns.Count + 1):
                    cell = table.Cell(row, col).Shape
                    if cell.TextFrame.HasText:
                        yield cell.TextFrame.TextRange, shape, (row, col)
        elif shape.HasTextFrame and shape.TextFrame.HasText:
            yield shape.TextFrame.TextRange, shape, None


def redact(slide, extra=None):
    """Delete instructor names, departments, session dates and running times from the working copy.

    Returns the number of edits. `extra` is one more pattern for whole lines to drop on this slide.
    """
    edits = 0
    drop = lambda line: bool(ONLY_PERSON.fullmatch(line.strip()) or RUNNING_TIME.fullmatch(line.strip())
                             or extra and extra.fullmatch(line.strip()))
    for tr, shape, _ in list(text_ranges(slide.Shapes)):
        for i in range(tr.Paragraphs().Count, 0, -1):
            paragraph = tr.Paragraphs(i)
            # A cell may hold "과목\v(이름)" in one paragraph, so soft line breaks are handled as lines.
            lines = paragraph.Text.rstrip('\r').split('\v')
            if any(drop(line) for line in lines):
                edits += 1
                if all(drop(line) for line in lines):
                    paragraph.Delete()
                    continue
                for line in lines:
                    if drop(line):
                        found = paragraph.Find(line)
                        if found is not None: found.Delete()
            for pattern, replacement in SCHEDULE:
                for match in list(pattern.finditer(paragraph.Text)):
                    found = paragraph.Find(match[0])
                    if found is None: continue
                    edits += 1
                    new = replacement(match)
                    if new: paragraph.Replace(match[0], new)
                    else: found.Delete()
        while tr.Length and tr.Text[-1] in '\r\v':
            tr.Characters(tr.Length, 1).Delete()
        while tr.Length and tr.Text[0] in '\r\v':
            tr.Characters(1, 1).Delete()
    return edits


def fraction(left, top, width, height, size, pad=0.0):
    w, h = size
    x, y = max(0, left / w - pad), max(0, top / h - pad)
    return dict(x=round(x, 4), y=round(y, 4), width=round(min(1 - x, width / w + pad * 2), 4),
                height=round(min(1 - y, height / h + pad * 2), 4))


def hyperlink(target):
    try:
        address = target.ActionSettings(1).Hyperlink.Address or ''
        sub = target.ActionSettings(1).Hyperlink.SubAddress or ''
    except Exception:
        return ''
    return address + ('#' + sub if address and sub else '') if address.startswith(('http://', 'https://')) else ''


def extract(slide, number, size, videos):
    texts, link_areas, links = [], [], []
    for tr, shape, _ in text_ranges(slide.Shapes):
        texts += [line.strip() for line in clean(tr.Text).split('\n') if line.strip()]
        for i in range(1, tr.Runs().Count + 1):
            run = tr.Runs(i)
            href = hyperlink(run)
            if href and run.Text.strip():
                link_areas.append(dict(href=href, label=run.Text.strip(),
                                       **fraction(run.BoundLeft, run.BoundTop, run.BoundWidth, run.BoundHeight, size, .004)))
    pictures = [s for s in slide.Shapes if s.Type in (MSO_PICTURE, MSO_LINKED_PICTURE)]
    shape_links = [(s, hyperlink(s)) for s in slide.Shapes if hyperlink(s)]
    links = list(dict.fromkeys([a['href'] for a in link_areas] + [href for _, href in shape_links] +
                               re.findall(r'https?://[A-Za-z0-9._~:/?#\[\]@!$&()*+,;=%-]+', ' '.join(texts))))
    if slide.Shapes.HasTitle and slide.Shapes.Title.TextFrame.HasText:
        title = clean(slide.Shapes.Title.TextFrame.TextRange.Text).replace('\n', ' ')
    else:
        first = next(text_ranges(slide.Shapes), None)
        lines = clean(first[0].Text).split('\n') if first else ['']
        title = lines[0] if number == 1 else ' '.join(lines)
    record = dict(title=title, text=texts, links=links, sourcePage=number)
    video_ids = list(dict.fromkeys(m for link in links for m in YOUTUBE.findall(link)))
    embeds = []
    if len(video_ids) == 1 and len(pictures) == 1 and videos.get(video_ids[0], {}).get('embeddable'):
        picture = pictures[0]
        embeds.append(dict(src=f'https://www.youtube-nocookie.com/embed/{video_ids[0]}',
                           title=videos[video_ids[0]]['title'],
                           **fraction(picture.Left, picture.Top, picture.Width, picture.Height, size)))
    elif video_ids and pictures:
        # A video that cannot be embedded opens from its thumbnail instead.
        picture = pictures[0]
        link_areas.append(dict(href=f'https://youtu.be/{video_ids[0]}', label='유튜브에서 영상 보기',
                               **fraction(picture.Left, picture.Top, picture.Width, picture.Height, size)))
    # A linked thumbnail would cover the player placed on it, so only other linked shapes become link areas.
    embedded = {p.Id for p in pictures} if embeds else set()
    for shape, href in shape_links:
        if shape.Id not in embedded and not any(a['href'] == href and a['label'] == '유튜브에서 영상 보기' for a in link_areas):
            link_areas.append(dict(href=href, label=href, **fraction(shape.Left, shape.Top, shape.Width, shape.Height, size)))
    if embeds: record['embeds'] = embeds
    if link_areas: record['linkAreas'] = link_areas
    return record


def check_videos(ids):
    """Record which YouTube videos allow embedding. Known answers are kept."""
    path = DATA / 'videos.json'
    videos = json.loads(path.read_text(encoding='utf-8')) if path.exists() else {}
    for video in ids:
        if video in videos: continue
        url = 'https://www.youtube.com/oembed?format=json&url=' + urllib.parse.quote(f'https://www.youtube.com/watch?v={video}', safe='')
        try:
            with urllib.request.urlopen(url, timeout=30) as response:
                info = json.load(response)
            videos[video] = dict(title=info['title'], channel=info['author_name'], embeddable=True)
        except urllib.error.HTTPError as exc:
            videos[video] = dict(title='', channel='', embeddable=False, status=exc.code)
    save(path, json.dumps(videos, ensure_ascii=False, indent=1) + '\n')
    return videos


def sync(source_dir, work, only):
    import win32com.client
    from PIL import Image
    work.mkdir(parents=True, exist_ok=True)
    assert not any(part.lower() in ('onedrive', 'dropbox', 'google drive') for part in work.parts)
    DATA.mkdir(parents=True, exist_ok=True)
    app =win32com.client.DispatchEx('PowerPoint.Application')
    report = []
    try:
        for key, week, half, title, _, drop in SESSIONS:
            if only and key not in only: continue
            matches = [f for f in source_dir.glob('*.pptx') if re.match(rf'{week}주차.*?_{half}_', f.name)]
            assert len(matches) == 1, f'{key}: expected one source deck, found {len(matches)}'
            source = matches[0]
            sha = hashlib.sha256(source.read_bytes()).hexdigest()
            copy = work / f'{key}.pptx'
            shutil.copy2(source, copy)
            folder = IMAGES / key
            if folder.exists(): shutil.rmtree(folder)
            folder.mkdir(parents=True)
            presentation = app.Presentations.Open(str(copy), ReadOnly=False, Untitled=False, WithWindow=False)
            try:
                size = (presentation.PageSetup.SlideWidth, presentation.PageSetup.SlideHeight)
                assert abs(size[0] / size[1] - 16 / 9) < .002, f'{key}: source is not 16:9'
                kept = [n for n in range(1, presentation.Slides.Count + 1) if n not in drop]
                for number, find, replace in FIXES.get(key, []):
                    found = [tr.Replace(find, replace) for tr, _, _ in list(text_ranges(presentation.Slides(number).Shapes))]
                    assert any(f is not None for f in found), f'{key}: slide {number} no longer contains {find!r}'
                edits = sum(redact(presentation.Slides(n), SCHEDULE_LINES.get(key, {}).get(n)) for n in kept)
                raw = {n: ' '.join(clean(tr.Text) for tr, _, _ in text_ranges(presentation.Slides(n).Shapes)) for n in kept}
                leftover = {n: LEFTOVER.findall(text) for n, text in raw.items() if LEFTOVER.search(text)}
                assert not leftover, f'{key}: instructor text remains on slides {leftover}'
                dated = {n: SCHEDULE_LEFT.findall(text) for n, text in raw.items() if SCHEDULE_LEFT.search(text)}
                assert not dated, f'{key}: session dates or running times remain on slides {dated}'
                videos = check_videos(sorted({m for text in raw.values() for m in YOUTUBE.findall(text)}))
                slides = []
                for position, number in enumerate(kept, 1):
                    slide = presentation.Slides(number)
                    record = extract(slide, number, size, videos)
                    png = work / f'{key}-{number:03}.png'
                    slide.Export(str(png), 'PNG', 2000, 1125)
                    Image.open(png).convert('RGB').save(folder / f'{position:03}.webp', format='WEBP', quality=88, method=6)
                    png.unlink()
                    record['image'] = f'/images/lectures/{COURSE}/{key}/{position:03}.webp'
                    slides.append(record)
                    if position % 10 == 0 or position == len(kept): print(f'{key}: {position}/{len(kept)}', flush=True)
            finally:
                presentation.Saved = True
                presentation.Close()
            assert hashlib.sha256(source.read_bytes()).hexdigest() == sha
            data = dict(id=key, week=week, half=half, title=title, course=COURSE_TITLE, sourceSha256=sha, slides=slides)
            save(DATA / f'{key}.json', json.dumps(data, ensure_ascii=False, separators=(',', ':')) + '\n')
            report.append(dict(session=key, source=source.name, slides=len(slides), redactions=edits,
                               embeds=sum(len(s.get('embeds', [])) for s in slides),
                               linkAreas=sum(len(s.get('linkAreas', [])) for s in slides)))
    finally:
        try: app.Quit()
        except Exception: pass
    print(json.dumps(report, ensure_ascii=False, indent=1))


def merge_labs(only=None):
    """Place the activities of labs/<session>.json after their anchor slides. Runs without PowerPoint."""
    for key, *_ in SESSIONS:
        path, lab_path = DATA / f'{key}.json', DATA / 'labs' / f'{key}.json'
        if not path.exists() or only and key not in only: continue
        labs = json.loads(lab_path.read_text(encoding='utf-8')) if lab_path.exists() else []
        data = json.loads(path.read_text(encoding='utf-8'))
        slides = [s for s in data['slides'] if s.get('kind') != 'lab']
        anchors = {s['sourcePage'] for s in slides}
        for lab in labs:
            assert lab['after'] in anchors, f"{key}: activity anchor {lab['after']} is not a published slide"
        assert len({lab['labId'] for lab in labs}) == len(labs), f'{key}: activity ids must be unique'
        data['slides'] = [item for slide in slides for item in [slide, *[
            dict(title=lab['title'], text=lab.get('text', []), links=[], kind='lab', labId=lab['labId'], sourceAfter=lab['after'])
            for lab in labs if lab['after'] == slide['sourcePage']]]]
        save(path, json.dumps(data, ensure_ascii=False, separators=(',', ':')) + '\n')


HEAD = '''<!doctype html><html lang="ko"><head>{print_js}<meta charset="utf-8">
    <script src="/js/preferences.js?v=20260913a"></script><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="{description}"><title>{title}</title><link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="/css/style.css?v=20261007wrap"><link rel="stylesheet" href="/css/computer-education2.css?v=20261007embed"><link rel="stylesheet" href="/css/microdegree1.css?v={version}"><script src="/js/main.js?v=20260914-menu" defer></script><link rel="canonical" href="https://jinsung4069.github.io{path}">
<script defer src="/js/clean-url.js"></script>
{print_css}</head><body>
    <a class="skip-link" href="#main-content"><span class="lang-content lang-ko active">본문으로 바로가기</span><span class="lang-content lang-en">Skip to content</span></a><header><div class="header-inner"><a class="site-title" href="/">전인성</a><div class="header-right"><nav class="site-nav" id="mainNav" aria-label="주 메뉴"><ul><li><a class="nav-text-link" href="/">홈</a></li><li><a class="nav-text-link" href="/about/">소개</a></li></ul></nav><button id="darkModeToggle" class="dark-mode-toggle" aria-label="화면 테마 전환">
                        <svg class="sun-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="2" />
                            <path d="m12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                        </svg>
                        <svg class="moon-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </button><button id="mobileMenuToggle" class="mobile-menu-toggle" aria-label="메뉴 열기" aria-expanded="false">☰</button></div></div></header>'''

ICONS = dict([
    ('chevron-left', '<path d="m15 18-6-6 6-6" />'), ('chevron-right', '<path d="m9 18 6-6-6-6" />'),
    ('list-filter', '<path d="M2 5h20" /><path d="M6 12h12" /><path d="M9 19h6" />'),
    ('printer', '<path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><path d="M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6" /><rect x="6" y="14" width="12" height="8" rx="1" />'),
    ('maximize', '<path d="M8 3H5a2 2 0 0 0-2 2v3" /><path d="M21 8V5a2 2 0 0 0-2-2h-3" /><path d="M3 16v3a2 2 0 0 0 2 2h3" /><path d="M16 21h3a2 2 0 0 0 2-2v-3" />'),
    ('minimize', '<path d="M8 3v3a2 2 0 0 1-2 2H3" /><path d="M21 8h-3a2 2 0 0 1-2-2V3" /><path d="M3 16h3a2 2 0 0 1 2 2v3" /><path d="M16 21v-3a2 2 0 0 1 2-2h3" />'),
    ('zoom-in', '<circle cx="11" cy="11" r="8" /><line x1="21" x2="16.65" y1="21" y2="16.65" /><line x1="11" x2="11" y1="8" y2="14" /><line x1="8" x2="14" y1="11" y2="11" />'),
    ('zoom-out', '<circle cx="11" cy="11" r="8" /><line x1="21" x2="16.65" y1="21" y2="16.65" /><line x1="8" x2="14" y1="11" y2="11" />'),
    ('x', '<path d="M18 6 6 18" /><path d="m6 6 12 12" />'),
    ('link', '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />'),
    ('hash', '<line x1="4" x2="20" y1="9" y2="9" /><line x1="4" x2="20" y1="15" y2="15" /><line x1="10" x2="8" y1="3" y2="21" /><line x1="16" x2="14" y1="3" y2="21" />'),
    ('play', '<path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z" />'),
])


def button(ident, icon, label, extra='', cls=''):
    return (f'<button id="{ident}" type="button" class="ce-glass {cls}" aria-label="{label}" data-tip="{label}" {extra}>'
            f'<svg class="ce-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><use href="#ce-icon-{icon}"></use></svg></button>')


def session_label(week, half):
    return f'{week}주차 {half}'


def write_pages(only=None):
    PAGES.mkdir(parents=True, exist_ok=True)
    catalog = []
    for key, week, half, title, summary, _ in SESSIONS:
        path = DATA / f'{key}.json'
        if path.exists():
            catalog.append(dict(id=key, week=week, half=half, title=title, summary=summary,
                                count=len(json.loads(path.read_text(encoding='utf-8'))['slides'])))
    save(DATA / 'catalog.json', json.dumps(catalog, ensure_ascii=False, indent=2) + '\n')
    cards = ''.join(f'<a class="ce-card" href="/lectures/{COURSE}/{c["id"]}/"><div class="ce-number md-number">{c["week"]}<small>{c["half"]}</small></div>'
                    f'<div><h2>{escape(c["title"])}</h2><p>{escape(c["summary"])}</p></div></a>' for c in catalog)
    head = HEAD.format(print_js='', print_css='', version=VERSION, path=f'/lectures/{COURSE}/',
                       description='인공지능의 개념과 원리부터 도구 활용, 결과 검증, 책임 있는 활용까지 8주 과정의 HTML 강의자료',
                       title=f'{COURSE_TITLE} | 강의자료 | 전인성')
    save(PAGES / 'index.html',
        head + f'<main class="ce-course" id="main-content" tabindex="-1"><p class="ce-eyebrow"><a href="/lectures/">강의자료</a> › 마이크로디그리 과정1</p>'
        f'<h1>마이크로디그리 과정1<br>인공지능의 이해와 원리 기반 활용</h1><p class="ce-intro">인공지능의 개념과 원리에서 도구 활용과 책임 있는 활용까지.<br>슬라이드로 개념을 살펴보고 브라우저에서 직접 체험합니다.</p>'
        f'<div class="ce-grid">{cards}</div></main></body></html>\n')
    symbols = ''.join(f'<symbol id="ce-icon-{name}" viewBox="0 0 24 24">{body}</symbol>' for name, body in ICONS.items())
    for i, c in enumerate(catalog):
        if only and c['id'] not in only: continue
        label = f'{session_label(c["week"], c["half"])} {c["title"]}'
        near = lambda j: f'{session_label(catalog[j]["week"], catalog[j]["half"])} {catalog[j]["title"]}'
        previous = f'<a href="/lectures/{COURSE}/{catalog[i-1]["id"]}/">← {escape(near(i-1))}</a>' if i else '<span></span>'
        following = f'<a href="/lectures/{COURSE}/{catalog[i+1]["id"]}/">{escape(near(i+1))} →</a>' if i + 1 < len(catalog) else '<span></span>'
        toolbar = (button('ce-prev', 'chevron-left', '이전 슬라이드', cls='ce-prev') + button('ce-next', 'chevron-right', '다음 슬라이드', cls='ce-next')
                   + button('ce-open-toc', 'list-filter', '목차 검색') + button('ce-open-page', 'hash', '페이지 이동')
                   + button('ce-open-links', 'link', '관련 링크', 'hidden') + button('ce-zoom', 'zoom-in', '확대', 'aria-pressed="false"')
                   + button('ce-fullscreen', 'maximize', '전체 화면', 'aria-keyshortcuts="f"') + button('ce-print', 'printer', '인쇄'))
        close = lambda ident: button(ident, 'x', '닫기', 'data-close')
        lab_script = f'<script src="/js/microdegree1-labs-{c["id"]}.js?v={VERSION}"></script>' if (ROOT / f'js/microdegree1-labs-{c["id"]}.js').exists() else ''
        head = HEAD.format(print_js='<script src="/js/lecture-print.js?v=20260915print1"></script>',
                           print_css='<link rel="stylesheet" href="/css/lecture-print.css?v=20260915print1">',
                           version=VERSION, path=f'/lectures/{COURSE}/{c["id"]}/', description=escape(c['summary']),
                           title=f'{escape(label)} | 마이크로디그리 과정1 | 전인성')
        body = (f'\n<main class="ce-viewer md-viewer" data-chapter="{c["id"]}" data-course="{COURSE}" data-course-title="마이크로디그리 과정1" data-version="{VERSION}" id="main-content" tabindex="-1">'
                f'<div class="ce-heading"><div><a href="/lectures/">강의자료</a> <span aria-hidden="true">›</span> <a href="/lectures/{COURSE}/">마이크로디그리 과정1</a><h1>{escape(label)}</h1></div><a href="/lectures/{COURSE}/">전체 강의 보기</a></div>\n'
                f'<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>{symbols}</defs></svg>'
                f'<div class="ce-stage" id="ce-stage"><div class="ce-viewport"><div class="ce-canvas"><img class="ce-slide-image" id="ce-image" width="2000" height="1125" alt="강의 슬라이드" aria-describedby="ce-slide-text" src="/images/lectures/{COURSE}/{c["id"]}/001.webp"><div id="ce-media"></div><section class="ce-lab md-lab" id="ce-lab" hidden aria-label="체험 슬라이드"></section></div></div>'
                f'<div class="ce-toolbar" role="toolbar" aria-label="슬라이드 도구">{toolbar}</div><span class="ce-loading" id="ce-loading">불러오는 중</span></div>'
                f'<p id="ce-status" class="sr-only" aria-live="polite"></p><p id="ce-slide-text" class="sr-only"></p><span id="ce-page-label" class="sr-only"></span>'
                f'<nav class="ce-after" aria-label="이전과 다음 강의">{previous}{following}</nav>\n'
                f'<dialog class="ce-dialog" id="ce-dialog"><header><h2>목차 검색</h2>{close("ce-close-toc")}</header><label for="ce-search">제목 또는 본문으로 찾기</label><input id="ce-search" type="search" placeholder="검색어를 입력하세요"><div class="ce-toc" id="ce-toc"></div></dialog>\n'
                f'<dialog class="ce-dialog ce-small-dialog" id="ce-page-dialog"><header><h2>페이지 이동</h2>{close("ce-close-page")}</header><form id="ce-go-page"><label for="ce-page">전체 <span id="ce-total">{c["count"]}</span>쪽</label><input id="ce-page" type="number" min="1" max="{c["count"]}" value="1" required><button class="ce-submit" type="submit">이동</button></form></dialog>\n'
                f'<dialog class="ce-dialog ce-small-dialog" id="ce-links-dialog"><header><h2>관련 링크</h2>{close("ce-close-links")}</header><div class="ce-links" id="ce-links"></div></dialog></main>'
                f'<noscript><p>슬라이드 이동과 체험에는 자바스크립트가 필요합니다.</p></noscript>'
                f'<script src="/js/microdegree1-labs.js?v={VERSION}"></script>{lab_script}<script src="/js/computer-education2.js?v={VERSION}"></script></body></html>\n')
        folder = PAGES / c['id']
        folder.mkdir(exist_ok=True)
        save(folder / 'index.html', head + body)
    print(f'pages: {len(catalog)} sessions')


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument('--source-dir', type=Path)
    parser.add_argument('--work-dir', type=Path)
    parser.add_argument('--only', help='comma-separated session ids, such as 1-1,1-2')
    parser.add_argument('--pages-only', action='store_true')
    args = parser.parse_args()
    only = set(args.only.split(',')) if args.only else None
    if not args.pages_only:
        assert args.source_dir and args.work_dir, '--source-dir and --work-dir are required'
        sync(args.source_dir, args.work_dir.resolve(), only)
    merge_labs(only)
    write_pages(only)


if __name__ == '__main__':
    main()
