"""Publish an AI알고리즘 lecture deck (PPTX) as an image-based web deck on Linux (LibreOffice + PyMuPDF).

Weeks 2 to 4 of this course are hand-written HTML decks. A lecture that exists as a PowerPoint deck is
published with the shared slide player instead (js/computer-education2.js), like the 특강 및 연수 decks:
each slide becomes a 2000 x 1125 WebP, with selectable text lines, enlargeable pictures and, on a slide
that carries one YouTube address and its thumbnail, an embedded player. Speaker notes and hidden slides
are not published. The source PPTX is never modified.

Requirements: LibreOffice (soffice) with its Python UNO bridge, python-pptx, PyMuPDF, Pillow, and the
Freesentation fonts installed, so that LibreOffice lays out text as PowerPoint does.

    python scripts/sync_ai_algorithm_linux.py --source <pptx> --deck week11 --work-dir <tmp dir>
    python scripts/sync_ai_algorithm_linux.py --pages-only

The course page (lectures/ai-algorithm/index.html) is edited by hand: add the card of a new deck there,
and its address to sitemap.xml.
"""
from pathlib import Path
from html import escape
import argparse, hashlib, io, json, re, shutil, subprocess, sys

sys.path.insert(0, str(Path(__file__).resolve().parent))
import sync_microdegree1 as md
import sync_microdegree1_linux as linux

ROOT = md.ROOT
COURSE = 'ai-algorithm'
COURSE_TITLE = 'AI알고리즘'
DATA = ROOT / 'data/lectures' / COURSE
IMAGES = ROOT / 'images/lectures' / COURSE
PAGES = ROOT / 'lectures' / COURSE
VERSION = '20261116a'
PICTURE_MAX = 2400

# id, week, title, card summary.
DECKS = [
    ('week11', 11, '지도학습의 이해 및 실습, 의사결정트리',
     '지도학습의 개념, 의사결정트리의 원리, Orange3와 파이썬으로 하는 펭귄 분류, 자장면 가격 예측, 언플러그드 활동과 연결'),
]
# A personal mobile number is never published. Office numbers and e-mail addresses stay.
MOBILE = re.compile(r'01[016789]-?\d{3,4}-?\d{4}')
P = '{http://schemas.openxmlformats.org/presentationml/2006/main}'


def shapes_in(shapes):
    """Every shape of a slide, with grouped shapes taken out of their groups."""
    for shape in shapes:
        if shape.shape_type == 6:
            yield from shapes_in(shape.shapes)
        else:
            yield shape


def paragraphs(slide):
    for shape in shapes_in(slide.shapes):
        if getattr(shape, 'has_table', False) and shape.has_table:
            for row in shape.table.rows:
                for cell in row.cells:
                    yield from cell.text_frame._txBody.iter(linux.A + 'p')
        elif shape.has_text_frame:
            yield from shape.text_frame._txBody.iter(linux.A + 'p')


def slide_text(slide):
    return [line.strip() for p in paragraphs(slide) for line in md.clean(linux.para_text(p)).split('\n') if line.strip()]


def slide_title(slide, texts, fallback):
    title = slide.shapes.title
    if title is not None and title.has_text_frame and title.text_frame.text.strip():
        return md.clean(title.text_frame.text).replace('\n', ' ')
    # A divider slide has no title placeholder: its number and its heading become the title.
    return ' '.join(texts[:2]) if texts else fallback


def page_lines(page, published):
    """Text lines of a PDF page as [x, y, width, height, text] fractions. Only published text is kept.
    The box starts at the first visible character, so an indented line of code is not stretched."""
    width, height = page.rect.width, page.rect.height
    joined = ' '.join(published)
    lines = []
    for block in page.get_text('rawdict')['blocks']:
        for line in block.get('lines', []):
            chars = [char for span in line['spans'] for char in span['chars']]
            visible = [char for char in chars if char['c'].strip()]
            text = ''.join(char['c'] for char in chars).strip()
            if not visible or text not in joined: continue
            x0, x1 = visible[0]['bbox'][0], visible[-1]['bbox'][2]
            y0, y1 = line['bbox'][1], line['bbox'][3]
            if x1 <= x0: continue
            lines.append([round(x0 / width, 4), round(y0 / height, 4), round((x1 - x0) / width, 4), round((y1 - y0) / height, 4), text])
    return lines


def overlap(a, b):
    """The share of box a that box b covers. A box is (x, y, width, height)."""
    w = min(a[0] + a[2], b[0] + b[2]) - max(a[0], b[0])
    h = min(a[1] + a[3], b[1] + b[3]) - max(a[1], b[1])
    return max(0, w) * max(0, h) / (a[2] * a[3]) if a[2] * a[3] else 0


def picture_file(raw, crop, folder):
    """Save the visible part of a picture as WebP, named by its content. Returns None for vector formats."""
    from PIL import Image
    try:
        image = Image.open(io.BytesIO(raw))
        image.seek(0)
        image = image.convert('RGBA' if image.mode in ('RGBA', 'LA', 'P', 'PA') else 'RGB')
    except Exception:
        return None
    w, h = image.size
    l, t, r, b = (min(max(v, 0), .95) for v in crop)
    image = image.crop((round(w * l), round(h * t), round(w * (1 - r)), round(h * (1 - b))))
    if min(image.size) < 1: return None
    image.thumbnail((PICTURE_MAX, PICTURE_MAX), Image.LANCZOS)
    buffer = io.BytesIO()
    image.save(buffer, format='WEBP', quality=90, method=6)
    path = folder / (hashlib.sha256(buffer.getvalue()).hexdigest()[:16] + '.webp')
    folder.mkdir(parents=True, exist_ok=True)
    if not path.exists(): path.write_bytes(buffer.getvalue())
    return path


def picture_shapes(slide):
    return [shape for shape in shapes_in(slide.shapes) if shape._element.tag == P + 'pic' and not shape.rotation]


def box_of(shape, size):
    return (shape.left / size[0], shape.top / size[1], shape.width / size[0], shape.height / size[1])


def slide_pictures(slide, size, taken, folder):
    """Pictures large enough to be worth enlarging, apart from those a video already uses."""
    result = []
    for shape in picture_shapes(slide):
        box = box_of(shape, size)
        x, y = max(0, box[0]), max(0, box[1])
        width, height = min(1, box[0] + box[2]) - x, min(1, box[1] + box[3]) - y
        if min(width, height) < .08 or width * height < .02 or width * height > .9: continue
        if any(overlap((x, y, width, height), other) > .3 for other in taken): continue
        crop = (shape.crop_left, shape.crop_top, shape.crop_right, shape.crop_bottom)
        path = picture_file(shape.image.blob, crop, folder)
        if path is None: continue
        result.append(dict(src='/' + path.relative_to(ROOT).as_posix(), x=round(x, 4), y=round(y, 4),
                           width=round(width, 4), height=round(height, 4)))
    # Larger pictures first, so a picture lying on another one stays reachable.
    return sorted(result, key=lambda p: -p['width'] * p['height'])


def sync(source, key, work, uno_python):
    from pptx import Presentation
    from PIL import Image
    import pymupdf

    _, week, title, _ = next(d for d in DECKS if d[0] == key)
    work.mkdir(parents=True, exist_ok=True)
    sha = hashlib.sha256(source.read_bytes()).hexdigest()
    copy = work / f'{COURSE}-{key}.pptx'
    shutil.copy2(source, copy)
    deck = Presentation(str(copy))
    size = (deck.slide_width, deck.slide_height)
    assert abs(size[0] / size[1] - 16 / 9) < .002, f'{key}: source is not 16:9'
    # Hidden slides leave the working copy, so the PDF pages and the published slides stay in step.
    hidden = 0
    for entry in list(deck.slides._sldIdLst):
        if deck.part.related_part(entry.rId).slide._element.get('show') == '0':
            deck.part.drop_rel(entry.rId); deck.slides._sldIdLst.remove(entry); hidden += 1
    if hidden: deck.save(str(copy))

    folder = IMAGES / key
    staged = work / 'images'
    if staged.exists(): shutil.rmtree(staged)
    (staged / 'pictures').mkdir(parents=True)
    slides, taken = [], {}
    for number, slide in enumerate(deck.slides, 1):
        texts = slide_text(slide)
        raw = ' '.join(texts)
        assert not MOBILE.search(raw), f'{key}: a mobile number is on slide {number}. Remove it in a copy of the deck first.'
        links = list(dict.fromkeys(re.findall(r'https?://[A-Za-z0-9._~:/?#\[\]@!$&()*+,;=%-]+', raw)))
        record = dict(title=title if number == 1 else slide_title(slide, texts, f'{number}쪽'), text=texts, links=links, sourcePage=number)
        videos = md.YOUTUBE.findall(raw)
        taken[number] = []
        if videos:
            pictures = picture_shapes(slide)
            assert len(videos) == 1 and len(pictures) == 1, f'{key}: slide {number} needs exactly one video and its thumbnail'
            frame = tuple(round(v, 4) for v in box_of(pictures[0], size))
            label = next((t.split(', ', 1)[1] for t in texts if t.startswith('영상:') and ', ' in t), record['title'])
            record['embeds'] = [dict(src=f'https://www.youtube-nocookie.com/embed/{videos[0]}', title=label,
                                     x=frame[0], y=frame[1], width=frame[2], height=frame[3])]
            record['video'] = next(link for link in links if md.YOUTUBE.search(link))
            taken[number].append(frame)
        slides.append(record)

    pdf = work / f'{key}.pdf'
    subprocess.run([uno_python, '-c', linux.UNO, str(copy), str(pdf)], check=True, timeout=900)
    document = pymupdf.open(pdf)
    assert len(document) == len(slides), f'{key}: the PDF has {len(document)} pages for {len(slides)} slides'

    for record, slide in zip(slides, deck.slides):
        number = record['sourcePage']
        page = document[number - 1]
        pixmap = page.get_pixmap(matrix=pymupdf.Matrix(2000 / page.rect.width, 1125 / page.rect.height), alpha=False)
        Image.frombytes('RGB', (pixmap.width, pixmap.height), pixmap.samples).resize((2000, 1125)).save(
            staged / f'{number:03}.webp', format='WEBP', quality=88, method=6)
        record['image'] = f'/images/lectures/{COURSE}/{key}/{number:03}.webp'
        lines = page_lines(page, record['text'])
        if lines: record['lines'] = lines
        href = record.pop('video', None)
        area = next((line[:4] for line in lines if line[4] == href), None) if href else None
        if area:
            x, y, w, h = area
            record['linkAreas'] = [dict(href=href, label=href, x=round(x - .004, 4), y=round(y - .004, 4), width=round(w + .008, 4), height=round(h + .008, 4))]
        pictures = slide_pictures(slide, size, taken[number], folder / 'pictures')
        if pictures: record['pictures'] = pictures

    # Pictures were written under the published folder name; move the whole set into place in one step.
    kept = {Path(p['src']).name for record in slides for p in record.get('pictures', [])}
    for name in kept: shutil.move(folder / 'pictures' / name, staged / 'pictures' / name)
    if folder.exists(): shutil.rmtree(folder)
    shutil.copytree(staged, folder)
    if not kept: (folder / 'pictures').rmdir()

    assert hashlib.sha256(source.read_bytes()).hexdigest() == sha
    order = ('title', 'text', 'links', 'sourcePage', 'embeds', 'linkAreas', 'image', 'lines', 'pictures')
    data = dict(id=key, week=week, title=title, course=COURSE_TITLE, sourceSha256=sha,
                slides=[{k: record[k] for k in order if k in record} for record in slides])
    DATA.mkdir(parents=True, exist_ok=True)
    md.save(DATA / f'{key}.json', json.dumps(data, ensure_ascii=False, separators=(',', ':')) + '\n')
    print(json.dumps(dict(deck=key, source=source.name, slides=len(slides), hiddenSlides=hidden,
                          lines=sum(len(s.get('lines', [])) for s in slides), pictures=sum(len(s.get('pictures', [])) for s in slides),
                          embeds=sum(len(s.get('embeds', [])) for s in slides)), ensure_ascii=False))


HEAD = md.HEAD.replace('<link rel="stylesheet" href="/css/microdegree1.css?v={version}">', '')


def write_pages(only=None):
    catalog = []
    for key, week, title, summary in DECKS:
        path = DATA / f'{key}.json'
        if path.exists():
            catalog.append(dict(id=key, week=week, title=title, summary=summary,
                                count=len(json.loads(path.read_text(encoding='utf-8'))['slides'])))
    symbols = ''.join(f'<symbol id="ce-icon-{name}" viewBox="0 0 24 24">{body}</symbol>' for name, body in md.ICONS.items())
    button = md.button
    for i, c in enumerate(catalog):
        if only and c['id'] not in only: continue
        label = f'{c["week"]}주차 {c["title"]}'
        near = lambda j: f'{catalog[j]["week"]}주차 {catalog[j]["title"]}'
        previous = f'<a href="/lectures/{COURSE}/{catalog[i-1]["id"]}/">← {escape(near(i-1))}</a>' if i else f'<a href="/lectures/{COURSE}/">전체 강의</a>'
        following = f'<a href="/lectures/{COURSE}/{catalog[i+1]["id"]}/">{escape(near(i+1))} →</a>' if i + 1 < len(catalog) else '<span></span>'
        toolbar = (button('ce-prev', 'chevron-left', '이전 슬라이드', cls='ce-prev') + button('ce-next', 'chevron-right', '다음 슬라이드', cls='ce-next')
                   + button('ce-open-toc', 'list-filter', '목차 검색') + button('ce-open-page', 'hash', '페이지 이동')
                   + button('ce-open-links', 'link', '관련 링크', 'hidden') + button('ce-zoom', 'zoom-in', '확대', 'aria-pressed="false"')
                   + button('ce-fullscreen', 'maximize', '전체 화면', 'aria-keyshortcuts="f"') + button('ce-print', 'printer', '인쇄'))
        close = lambda ident: button(ident, 'x', '닫기', 'data-close')
        head = HEAD.format(print_js=f'<script src="/js/lecture-print.js?v={md.UI_VERSION}"></script>',
                           print_css='<link rel="stylesheet" href="/css/lecture-print.css?v=20260915print1">', catalog_js='',
                           path=f'/lectures/{COURSE}/{c["id"]}/', description=escape(c['summary']),
                           title=f'{escape(label)} | {COURSE_TITLE} | 전인성')
        body = (f'\n<main class="ce-viewer" data-chapter="{c["id"]}" data-course="{COURSE}" data-course-title="{COURSE_TITLE}" data-version="{VERSION}" id="main-content" tabindex="-1">'
                f'<div class="ce-heading"><div><a href="/lectures/">강의자료</a> <span aria-hidden="true">›</span> <a href="/lectures/{COURSE}/">{COURSE_TITLE}</a><h1>{escape(label)}</h1></div><a href="/lectures/{COURSE}/">전체 강의 보기</a></div>\n'
                f'<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>{symbols}</defs></svg>'
                f'<div class="ce-stage" id="ce-stage"><div class="ce-viewport"><div class="ce-canvas"><img class="ce-slide-image" id="ce-image" width="2000" height="1125" alt="강의 슬라이드" aria-describedby="ce-slide-text" src="/images/lectures/{COURSE}/{c["id"]}/001.webp"><div id="ce-media"></div><section class="ce-lab" id="ce-lab" hidden aria-label="체험 슬라이드"></section></div></div>'
                f'<div class="ce-toolbar" role="toolbar" aria-label="슬라이드 도구">{toolbar}</div><span class="ce-loading" id="ce-loading">불러오는 중</span></div>'
                f'<p id="ce-status" class="sr-only" aria-live="polite"></p><p id="ce-slide-text" class="sr-only"></p><span id="ce-page-label" class="sr-only"></span>'
                f'<nav class="ce-after" aria-label="이전과 다음 강의">{previous}{following}</nav>\n'
                f'<dialog class="ce-dialog" id="ce-dialog"><header><h2>목차 검색</h2>{close("ce-close-toc")}</header><label for="ce-search">제목 또는 본문으로 찾기</label><input id="ce-search" type="search" placeholder="검색어를 입력하세요"><div class="ce-toc" id="ce-toc"></div></dialog>\n'
                f'<dialog class="ce-dialog ce-small-dialog" id="ce-page-dialog"><header><h2>페이지 이동</h2>{close("ce-close-page")}</header><form id="ce-go-page"><label for="ce-page">전체 <span id="ce-total">{c["count"]}</span>쪽</label><input id="ce-page" type="number" min="1" max="{c["count"]}" value="1" required><button class="ce-submit" type="submit">이동</button></form></dialog>\n'
                f'<dialog class="ce-dialog ce-small-dialog" id="ce-links-dialog"><header><h2>관련 링크</h2>{close("ce-close-links")}</header><div class="ce-links" id="ce-links"></div></dialog></main>'
                f'<noscript><p>슬라이드 이동에는 자바스크립트가 필요합니다.</p></noscript>'
                f'<script src="/js/lecture-image-zoom.js?v={md.VIEWER_VERSION}"></script>\n<script src="/js/local-progress.js" defer></script>\n<script src="/js/site-learning.js" defer></script>\n'
                f'<script src="/js/lecture-tools.js?v=20261107ui" defer></script>\n<script defer src="/js/computer-education2.js?v={md.PLAYER_VERSION}"></script></body></html>\n')
        folder = PAGES / c['id']
        folder.mkdir(parents=True, exist_ok=True)
        md.save(folder / 'index.html', head + body)
    print(f'pages: {len(catalog)} decks')


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument('--source', type=Path)
    parser.add_argument('--deck', help='deck id, such as week11')
    parser.add_argument('--work-dir', type=Path)
    parser.add_argument('--pages-only', action='store_true')
    parser.add_argument('--uno-python', default='/usr/bin/python3', help='a Python that can import uno')
    args = parser.parse_args()
    if not args.pages_only:
        assert args.source and args.deck and args.work_dir, '--source, --deck and --work-dir are required'
        sync(args.source.resolve(), args.deck, args.work_dir.resolve(), args.uno_python)
    write_pages({args.deck} if args.deck else None)


if __name__ == '__main__':
    main()
