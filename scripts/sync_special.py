"""Build the 특강 및 연수 web decks from local PowerPoint copies on Windows.

Requires Pillow and pywin32, plus PowerPoint. Source files are never modified.
The work directory must be a task-specific, non-synchronized temporary directory.

    python scripts/sync_special.py --source-dir <PPTX folder> --work-dir <temp> [--only ai-to-agents]
    python scripts/sync_special.py --pages-only

Each slide is exported as a 2000 x 1125 WebP. Personal mobile numbers are removed from the working
copy, hidden slides and speaker notes are not published. Run sync_slide_layers.py --course special
afterwards to add selectable text and enlargeable pictures.
"""
from pathlib import Path
from html import escape
import argparse, hashlib, json, re, shutil
import sync_microdegree1 as md

ROOT = Path(__file__).resolve().parents[1]
COURSE = 'special'
COURSE_TITLE = '특강 및 연수'
DATA = ROOT / 'data/lectures' / COURSE
IMAGES = ROOT / 'images/lectures' / COURSE
PAGES = ROOT / 'lectures' / COURSE
VERSION = '20261101a'
UI_VERSION = '20261024ui'
VIEWER_VERSION = '20261022a'

# id, title, event, card summary, source file name pattern.
DECKS = [
    ('ai-to-agents', 'AI부터 에이전트까지, 교육은 어떻게 나아가는가', '2026 AI미래교육박람회 교원 연수',
     'AI와 에이전트의 차이, 숫자로 보는 AI 교육 동향, AI 시대 교사의 일과 전문성', 'AI부터 에이전트까지*.pptx'),
]
# Table-of-contents titles for slides whose first text is not a title: {deck: {source slide: title}}.
TITLES = {'ai-to-agents': {47: '연락처'}}
# A personal mobile number is never published. Office numbers and e-mail addresses stay.
MOBILE = re.compile(r'01[016789]-?\d{3,4}-?\d{4}')
# Layout labels left without a value once the number is removed: {deck: {source slide: label}}.
COVER = {'ai-to-agents': {47: 'PHONE'}}


def source_path(source_dir, key):
    pattern = next(d[4] for d in DECKS if d[0] == key)
    matches = list(source_dir.glob(pattern))
    assert len(matches) == 1, f'{key}: expected one source deck, found {len(matches)}'
    return matches[0]


def redact(slide):
    """Delete paragraphs that hold a mobile number from the working copy. Returns the number of edits."""
    edits = 0
    for tr, _, _ in list(md.text_ranges(slide.Shapes)):
        for i in range(tr.Paragraphs().Count, 0, -1):
            paragraph = tr.Paragraphs(i)
            if MOBILE.search(paragraph.Text):
                edits += 1
                if MOBILE.sub('', paragraph.Text).strip(' \r\v\t'):
                    for match in MOBILE.findall(paragraph.Text):
                        found = paragraph.Find(match)
                        if found is not None: found.Delete()
                else:
                    paragraph.Delete()
        while tr.Length and tr.Text[-1] in '\r\v':
            tr.Characters(tr.Length, 1).Delete()
        while tr.Length and tr.Text[0] in '\r\v':
            tr.Characters(1, 1).Delete()
    return edits


def cover_layout_label(presentation, page, label):
    """Hide a label of the slide layout whose value was removed, with a box of the colour around it."""
    from PIL import Image
    slide = presentation.Slides(page)
    found = None
    for shape in slide.CustomLayout.Shapes:
        if shape.HasTextFrame and shape.TextFrame.HasText and label in shape.TextFrame.TextRange.Text:
            found = shape.TextFrame.TextRange.Find(label)
            break
    assert found is not None, f'slide {page}: layout label {label!r} not found'
    left, top, width, height = found.BoundLeft, found.BoundTop, found.BoundWidth, found.BoundHeight
    png = Path(presentation.FullName).with_suffix(f'.cover{page}.png')
    slide.Export(str(png), 'PNG', 2000, 1125)
    scale = 2000 / presentation.PageSetup.SlideWidth
    with Image.open(png) as image:
        r, g, b = image.convert('RGB').getpixel((round((left - 6) * scale), round((top + height / 2) * scale)))
    png.unlink()
    box = slide.Shapes.AddShape(1, left - 2, top - 1, width + 4, height + 2)
    box.Line.Visible = 0
    box.Fill.ForeColor.RGB = r + g * 256 + b * 65536


def published_slides(presentation):
    return [n for n in range(1, presentation.Slides.Count + 1) if not presentation.Slides(n).SlideShowTransition.Hidden]


def prepare(presentation, key, pages):
    """Working-copy edits shared with sync_slide_layers.py, so line breaks fall where they were published."""
    edits = sum(redact(presentation.Slides(n)) for n in pages)
    for page, label in COVER.get(key, {}).items():
        if page in pages: cover_layout_label(presentation, page, label)
    return edits


def sync(source_dir, work, only):
    import win32com.client
    from PIL import Image
    work.mkdir(parents=True, exist_ok=True)
    assert not any(part.lower() in ('onedrive', 'dropbox', 'google drive') for part in work.parts)
    DATA.mkdir(parents=True, exist_ok=True)
    app = win32com.client.DispatchEx('PowerPoint.Application')
    report = []
    try:
        for key, title, event, _, _ in DECKS:
            if only and key not in only: continue
            source = source_path(source_dir, key)
            sha = hashlib.sha256(source.read_bytes()).hexdigest()
            copy = work / f'{COURSE}-{key}.pptx'
            shutil.copy2(source, copy)
            folder = IMAGES / key
            if folder.exists(): shutil.rmtree(folder)
            folder.mkdir(parents=True)
            presentation = app.Presentations.Open(str(copy), ReadOnly=False, Untitled=False, WithWindow=False)
            try:
                size = (presentation.PageSetup.SlideWidth, presentation.PageSetup.SlideHeight)
                assert abs(size[0] / size[1] - 16 / 9) < .002, f'{key}: source is not 16:9'
                kept = published_slides(presentation)
                edits = prepare(presentation, key, kept)
                left = {n: MOBILE.findall(' '.join(md.clean(tr.Text) for tr, _, _ in md.text_ranges(presentation.Slides(n).Shapes)))
                        for n in kept}
                assert not any(left.values()), f'{key}: mobile numbers remain {left}'
                slides = []
                for position, number in enumerate(kept, 1):
                    slide = presentation.Slides(number)
                    record = md.extract(slide, number, size, {})
                    if position == 1: record['title'] = title
                    elif re.fullmatch(r'[ⅠⅡⅢⅣⅤⅥⅦⅧⅨⅩ]', record['title']): record['title'] = ' '.join(record['text'])
                    record['title'] = TITLES.get(key, {}).get(number, record['title'])
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
            data = dict(id=key, title=title, event=event, course=COURSE_TITLE, sourceSha256=sha, slides=slides)
            md.save(DATA / f'{key}.json', json.dumps(data, ensure_ascii=False, separators=(',', ':')) + '\n')
            report.append(dict(deck=key, source=source.name, slides=len(slides), redactions=edits,
                               linkAreas=sum(len(s.get('linkAreas', [])) for s in slides)))
    finally:
        try: app.Quit()
        except Exception: pass
    print(json.dumps(report, ensure_ascii=False, indent=1))


HEAD = md.HEAD.replace('<link rel="stylesheet" href="/css/microdegree1.css?v={version}">', '')


def write_pages(only=None):
    PAGES.mkdir(parents=True, exist_ok=True)
    catalog = []
    for key, title, event, summary, _ in DECKS:
        path = DATA / f'{key}.json'
        if path.exists():
            catalog.append(dict(id=key, title=title, event=event, summary=summary,
                                count=len(json.loads(path.read_text(encoding='utf-8'))['slides'])))
    md.save(DATA / 'catalog.json', json.dumps(catalog, ensure_ascii=False, indent=2) + '\n')
    cards = ''.join(f'<a class="ce-card" href="/lectures/{COURSE}/{c["id"]}/"><div class="ce-number">{i}</div>'
                    f'<div><h2>{escape(c["title"])}</h2><p>{escape(c["event"])}<br>{escape(c["summary"])}</p></div></a>'
                    for i, c in enumerate(catalog, 1))
    head = HEAD.format(print_js='', print_css='', path=f'/lectures/{COURSE}/',
                       description='교원 연수와 특강에서 사용한 HTML 강의자료',
                       title=f'{COURSE_TITLE} | 강의자료 | 전인성')
    md.save(PAGES / 'index.html',
            head + f'<main class="ce-course" id="main-content" tabindex="-1"><p class="ce-eyebrow"><a href="/lectures/">강의자료</a> › {COURSE_TITLE}</p>'
            f'<h1>{COURSE_TITLE}</h1><p class="ce-intro">교원 연수와 특강에서 사용한 강의자료입니다.</p>'
            f'<div class="ce-grid">{cards}</div></main></body></html>\n')
    symbols = ''.join(f'<symbol id="ce-icon-{name}" viewBox="0 0 24 24">{body}</symbol>' for name, body in md.ICONS.items())
    button = md.button
    for i, c in enumerate(catalog):
        if only and c['id'] not in only: continue
        previous = f'<a href="/lectures/{COURSE}/{catalog[i-1]["id"]}/">← {escape(catalog[i-1]["title"])}</a>' if i else f'<a href="/lectures/{COURSE}/">전체 강의</a>'
        following = f'<a href="/lectures/{COURSE}/{catalog[i+1]["id"]}/">{escape(catalog[i+1]["title"])} →</a>' if i + 1 < len(catalog) else '<span></span>'
        toolbar = (button('ce-prev', 'chevron-left', '이전 슬라이드', cls='ce-prev') + button('ce-next', 'chevron-right', '다음 슬라이드', cls='ce-next')
                   + button('ce-open-toc', 'list-filter', '목차 검색') + button('ce-open-page', 'hash', '페이지 이동')
                   + button('ce-open-links', 'link', '관련 링크', 'hidden') + button('ce-zoom', 'zoom-in', '확대', 'aria-pressed="false"')
                   + button('ce-fullscreen', 'maximize', '전체 화면', 'aria-keyshortcuts="f"') + button('ce-print', 'printer', '인쇄'))
        close = lambda ident: button(ident, 'x', '닫기', 'data-close')
        head = HEAD.format(print_js=f'<script src="/js/lecture-print.js?v={UI_VERSION}"></script>',
                           print_css='<link rel="stylesheet" href="/css/lecture-print.css?v=20260915print1">',
                           path=f'/lectures/{COURSE}/{c["id"]}/', description=escape(f'{c["event"]}, {c["summary"]}'),
                           title=f'{escape(c["title"])} | {COURSE_TITLE} | 전인성')
        body = (f'\n<main class="ce-viewer" data-chapter="{c["id"]}" data-course="{COURSE}" data-course-title="{COURSE_TITLE}" data-version="{VERSION}" id="main-content" tabindex="-1">'
                f'<div class="ce-heading"><div><a href="/lectures/">강의자료</a> <span aria-hidden="true">›</span> <a href="/lectures/{COURSE}/">{COURSE_TITLE}</a><h1>{escape(c["title"])}</h1></div><a href="/lectures/{COURSE}/">전체 강의 보기</a></div>\n'
                f'<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>{symbols}</defs></svg>'
                f'<div class="ce-stage" id="ce-stage"><div class="ce-viewport"><div class="ce-canvas"><img class="ce-slide-image" id="ce-image" width="2000" height="1125" alt="강의 슬라이드" aria-describedby="ce-slide-text" src="/images/lectures/{COURSE}/{c["id"]}/001.webp"><div id="ce-media"></div><section class="ce-lab" id="ce-lab" hidden aria-label="체험 슬라이드"></section></div></div>'
                f'<div class="ce-toolbar" role="toolbar" aria-label="슬라이드 도구">{toolbar}</div><span class="ce-loading" id="ce-loading">불러오는 중</span></div>'
                f'<p id="ce-status" class="sr-only" aria-live="polite"></p><p id="ce-slide-text" class="sr-only"></p><span id="ce-page-label" class="sr-only"></span>'
                f'<nav class="ce-after" aria-label="이전과 다음 강의">{previous}{following}</nav>\n'
                f'<dialog class="ce-dialog" id="ce-dialog"><header><h2>목차 검색</h2>{close("ce-close-toc")}</header><label for="ce-search">제목 또는 본문으로 찾기</label><input id="ce-search" type="search" placeholder="검색어를 입력하세요"><div class="ce-toc" id="ce-toc"></div></dialog>\n'
                f'<dialog class="ce-dialog ce-small-dialog" id="ce-page-dialog"><header><h2>페이지 이동</h2>{close("ce-close-page")}</header><form id="ce-go-page"><label for="ce-page">전체 <span id="ce-total">{c["count"]}</span>쪽</label><input id="ce-page" type="number" min="1" max="{c["count"]}" value="1" required><button class="ce-submit" type="submit">이동</button></form></dialog>\n'
                f'<dialog class="ce-dialog ce-small-dialog" id="ce-links-dialog"><header><h2>관련 링크</h2>{close("ce-close-links")}</header><div class="ce-links" id="ce-links"></div></dialog></main>'
                f'<noscript><p>슬라이드 이동에는 자바스크립트가 필요합니다.</p></noscript>'
                f'<script src="/js/lecture-image-zoom.js?v={VIEWER_VERSION}"></script><script src="/js/local-progress.js" defer></script><script src="/js/site-learning.js" defer></script><script src="/js/lecture-tools.js?v={UI_VERSION}" defer></script><script src="/js/computer-education2.js?v={UI_VERSION}" defer></script></body></html>\n')
        folder = PAGES / c['id']
        folder.mkdir(exist_ok=True)
        md.save(folder / 'index.html', head + body)
    print(f'pages: {len(catalog)} decks')


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument('--source-dir', type=Path)
    parser.add_argument('--work-dir', type=Path)
    parser.add_argument('--only', help='comma-separated deck ids, such as ai-to-agents')
    parser.add_argument('--pages-only', action='store_true')
    args = parser.parse_args()
    only = set(args.only.split(',')) if args.only else None
    if not args.pages_only:
        assert args.source_dir and args.work_dir, '--source-dir and --work-dir are required'
        sync(args.source_dir, args.work_dir.resolve(), only)
    write_pages(only)


if __name__ == '__main__':
    main()
