"""Add selectable text lines and enlargeable pictures to the image-based web decks on Windows.

Requires Pillow, lxml and pywin32, plus PowerPoint and the fonts the decks were published with.
Source files are never modified. The work directory must be a task-specific, non-synchronized
temporary directory.

    python scripts/sync_slide_layers.py --course computer-education2 --source-dir <PPTX folder> --work-dir <temp> [--only 2,3]
    python scripts/sync_slide_layers.py --course microdegree1 --source-dir <PPTX folder> --work-dir <temp> [--only 1-1]

The published slide images and every other field of <deck>.json stay as they are. Each slide whose
source still renders like its published image gains `lines` ([x, y, width, height, text] as
fractions of the slide) and `pictures`. Slides that no longer match are left without them and listed.
A line is kept only when its text is part of the slide's published `text`, so nothing that was
removed before publishing comes back. Run this again after sync_microdegree1.py rebuilds a deck.
"""
from pathlib import Path
from zipfile import ZipFile
import argparse, hashlib, io, json, os, re, shutil
from lxml import etree as ET
from PIL import Image, ImageChops, ImageFilter, ImageStat
from sync_ai_education import NS, ordered_parts, relationships
import sync_microdegree1 as md

ROOT = Path(__file__).resolve().parents[1]
MSO_GROUP, MSO_PICTURE, MSO_LINKED_PICTURE, MSO_PLACEHOLDER = 6, 13, 11, 14
PP_TITLE, PP_CENTER_TITLE = 1, 3
CE2_BODY, CE2_TITLE = 'Freesentation 6 SemiBold', 'Freesentation 8 ExtraBold'
CE2_SOURCES = {
    '2': '컴퓨터과교육2_2 컴퓨팅 시스템', '3': '컴퓨터과교육2_3 데이터의 이해와 표현방법', '4': '컴퓨터과교육2_4 데이터 구조와 분석',
    '5': '컴퓨터과교육2_5 컴퓨팅 사고 기반의 문제 해결', '6': '컴퓨터과교육2_6 알고리즘의 구조와 종류',
    '7': '컴퓨터과교육2_7 프로그래밍 언어의 이해 및 프로그래밍 교육의 실제', '8': '컴퓨터과교육2_8 인공지능의 이해_역사',
    # The source deck numbered 10 is published as lecture 9.
    '9': '컴퓨터과교육2_10 인공지능의 이해', '10': '컴퓨터과교육2_10 디지털 윤리와 저작권', '11': '컴퓨터과교육2_11 피지컬 컴퓨팅',
}
# Mean grey-level difference, 0 to 255, between the published image and a fresh export at CHECK_WIDTH.
CHECK_WIDTH, SLIDE_LIMIT, LINE_LIMIT = 1000, 9.0, 60.0
PICTURE_MAX = 2400


def squeeze(text):
    return re.sub(r'\s+', '', text)


def shapes_in(shapes, turned=False):
    """Yield (shape, turned) for every shape, with grouped shapes taken out of their groups."""
    for shape in shapes:
        rotated = turned or abs(shape.Rotation) > .01
        if shape.Type == MSO_GROUP:
            yield from shapes_in(shape.GroupItems, rotated)
        else:
            yield shape, rotated


def is_title(shape):
    try:
        return shape.Type == MSO_PLACEHOLDER and shape.PlaceholderFormat.Type in (PP_TITLE, PP_CENTER_TITLE)
    except Exception:
        return False


def set_font(text_range, name):
    font = text_range.Font
    font.Name = font.NameFarEast = font.NameAscii = font.NameOther = font.NameComplexScript = name


def editable(presentation):
    try:
        slide = presentation.Slides(1)
        slide.Name = slide.Name
        return True
    except Exception:
        return False


def strip_embedded_fonts(copy):
    """Embedded fonts that forbid editing make PowerPoint open even a working copy read-only."""
    temp = copy.with_suffix('.tmp')
    with ZipFile(copy) as source, ZipFile(temp, 'w') as target:
        for item in source.infolist():
            raw = source.read(item.filename)
            if item.filename.startswith('ppt/fonts/'): continue
            if item.filename == 'ppt/presentation.xml':
                raw = re.sub(rb'<p:embeddedFontLst>.*?</p:embeddedFontLst>|\s(?:embedTrueTypeFonts|saveSubsetFonts)="[^"]*"', b'', raw, flags=re.S)
            elif item.filename == 'ppt/_rels/presentation.xml.rels':
                raw = re.sub(rb'<Relationship [^>]*relationships/font"[^>]*/>', b'', raw)
            target.writestr(item, raw, compress_type=item.compress_type)
    os.replace(temp, copy)


def prepare_computer_education2(presentation, key, pages):
    """The published images use Freesentation in place of the fonts of the source decks."""
    for page in pages:
        for shape, _ in shapes_in(presentation.Slides(page).Shapes):
            if shape.HasTable:
                table = shape.Table
                for row in range(1, table.Rows.Count + 1):
                    for col in range(1, table.Columns.Count + 1):
                        set_font(table.Cell(row, col).Shape.TextFrame.TextRange, CE2_BODY)
            elif shape.HasTextFrame:
                set_font(shape.TextFrame.TextRange, CE2_TITLE if is_title(shape) else CE2_BODY)


def prepare_microdegree1(presentation, key, pages):
    """The same working-copy edits as sync_microdegree1.py, so line breaks fall where they were published."""
    for number, find, replace in md.FIXES.get(key, []):
        for text_range, _, _ in list(md.text_ranges(presentation.Slides(number).Shapes)):
            text_range.Replace(find, replace)
    for page in pages:
        md.redact(presentation.Slides(page), md.SCHEDULE_LINES.get(key, {}).get(page))


def source_computer_education2(source_dir, key):
    return source_dir / (CE2_SOURCES[key] + '.pptx')


def source_microdegree1(source_dir, key):
    week, half = next((s[1], s[2]) for s in md.SESSIONS if s[0] == key)
    matches = [f for f in source_dir.glob('*.pptx') if re.match(rf'{week}주차.*?_{half}_', f.name)]
    assert len(matches) == 1, f'{key}: expected one source deck, found {len(matches)}'
    return matches[0]


COURSES = {
    'computer-education2': dict(keys=list(CE2_SOURCES), source=source_computer_education2, prepare=prepare_computer_education2),
    'microdegree1': dict(keys=[s[0] for s in md.SESSIONS], source=source_microdegree1, prepare=prepare_microdegree1),
}


def text_lines(shape, origin=(0, 0)):
    text_range = shape.TextFrame.TextRange
    for i in range(1, text_range.Lines().Count + 1):
        line = text_range.Lines(i)
        raw = line.Text.rstrip('\r\v\n ')
        text = raw.lstrip()
        if not text: continue
        # Spaces that indent a line are left out of its box.
        if len(text) < len(raw): line = line.Characters(len(raw) - len(text) + 1, len(text))
        if line.BoundWidth > 0 and line.BoundHeight > 0:
            yield text, line.BoundLeft + origin[0], line.BoundTop + origin[1], line.BoundWidth, line.BoundHeight


def slide_lines(slide):
    """Lines of each text box and table cell, the boxes ordered from the top left for reading and copying."""
    boxes = []
    for shape, turned in shapes_in(slide.Shapes):
        if turned or not shape.Visible: continue
        if shape.HasTable:
            table = shape.Table
            for row in range(1, table.Rows.Count + 1):
                for col in range(1, table.Columns.Count + 1):
                    cell = table.Cell(row, col).Shape
                    if cell.TextFrame.HasText:
                        # Inside a cell, positions are measured from its left edge and from the edge its text is anchored to.
                        anchor = {3: cell.Height / 2, 4: cell.Height}.get(cell.TextFrame.VerticalAnchor, 0)
                        boxes.append(list(text_lines(cell, (cell.Left, cell.Top + anchor))))
        elif shape.HasTextFrame and shape.TextFrame.HasText and shape.TextFrame.Orientation == 1:
            boxes.append(list(text_lines(shape)))
    # A merged cell is reached once for each cell it covers.
    boxes = [box for i, box in enumerate(boxes) if box and box not in boxes[:i]]
    boxes.sort(key=lambda box: (round(box[0][2] / 40), box[0][1]))
    return [line for box in boxes for line in box]


def overlap(a, b):
    """Share of rectangle a (x, y, width, height) that rectangle b covers."""
    w = min(a[0] + a[2], b[0] + b[2]) - max(a[0], b[0])
    h = min(a[1] + a[3], b[1] + b[3]) - max(a[1], b[1])
    return max(0, w) * max(0, h) / (a[2] * a[3]) if a[2] * a[3] else 0


def picture_file(raw, crop, folder):
    """Save the visible part of a picture as WebP, named by its content. Returns None for vector formats."""
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


def slide_pictures(slide, z, part, size, taken, folder):
    """Pictures large enough to be worth enlarging, apart from those a video or a link already uses."""
    xml, rels = ET.fromstring(z.read(part)), relationships(z, part)
    elements = {int(e.find('p:nvPicPr/p:cNvPr', NS).get('id')): e for e in xml.iter('{%s}pic' % NS['p'])}
    result = []
    for shape, turned in shapes_in(slide.Shapes):
        if turned or not shape.Visible or shape.Id not in elements: continue
        box = (shape.Left / size[0], shape.Top / size[1], shape.Width / size[0], shape.Height / size[1])
        x, y = max(0, box[0]), max(0, box[1])
        width, height = min(1, box[0] + box[2]) - x, min(1, box[1] + box[3]) - y
        if min(width, height) < .08 or width * height < .02 or width * height > .9: continue
        if any(overlap((x, y, width, height), other) > .3 for other in taken): continue
        element = elements[shape.Id]
        blip = element.find('.//a:blip', NS)
        target = rels.get(blip.get('{%s}embed' % NS['r'])) if blip is not None else None
        if not target or target not in z.namelist(): continue
        rect = element.find('p:blipFill/a:srcRect', NS)
        crop = [int(rect.get(k, '0')) / 100000 if rect is not None else 0 for k in 'ltrb']
        path = picture_file(z.read(target), crop, folder)
        if path is None: continue
        result.append(dict(src='/' + path.relative_to(ROOT).as_posix(), x=round(x, 4), y=round(y, 4),
                           width=round(width, 4), height=round(height, 4)))
    # Larger pictures first, so a picture lying on another one stays reachable.
    return sorted(result, key=lambda p: -p['width'] * p['height'])


def grey(image):
    return image.convert('L').resize((CHECK_WIDTH, round(CHECK_WIDTH * 9 / 16)), Image.LANCZOS).filter(ImageFilter.GaussianBlur(2))


def sync(course, source_dir, work, only, debug):
    import win32com.client
    config = COURSES[course]
    data_dir, image_dir = ROOT / 'data/lectures' / course, ROOT / 'images/lectures' / course
    work.mkdir(parents=True, exist_ok=True)
    assert not any(part.lower() in ('onedrive', 'dropbox', 'google drive') for part in work.parts)
    app = win32com.client.DispatchEx('PowerPoint.Application')
    report = []
    try:
        for key in config['keys']:
            if only and key not in only: continue
            source = config['source'](source_dir, key)
            sha = hashlib.sha256(source.read_bytes()).hexdigest()
            copy = work / f'{course}-{key}.pptx'
            shutil.copy2(source, copy)
            path = data_dir / f'{key}.json'
            raw = path.read_text(encoding='utf-8')
            data = json.loads(raw)
            # An activity that replaced a slide keeps the old image only for reference.
            published = [s for s in data['slides'] if 'image' in s and 'sourcePage' in s and 'kind' not in s]
            for slide in data['slides']:
                slide.pop('lines', None); slide.pop('pictures', None)
            folder = image_dir / key / 'pictures'
            if folder.exists(): shutil.rmtree(folder)
            presentation = app.Presentations.Open(str(copy), ReadOnly=False, Untitled=False, WithWindow=False)
            if not editable(presentation):
                presentation.Close()
                strip_embedded_fonts(copy)
                presentation = app.Presentations.Open(str(copy), ReadOnly=False, Untitled=False, WithWindow=False)
            skipped, dropped, lines_total, pictures_total = [], 0, 0, 0
            try:
                size = (presentation.PageSetup.SlideWidth, presentation.PageSetup.SlideHeight)
                count = presentation.Slides.Count
                config['prepare'](presentation, key, sorted({s['sourcePage'] for s in published if s['sourcePage'] <= count}))
                with ZipFile(source) as z:
                    parts = ordered_parts(z)
                    for position, record in enumerate(published, 1):
                        page = record['sourcePage']
                        if page > count:
                            skipped.append((page, 'missing')); continue
                        slide = presentation.Slides(page)
                        png = work / f'{course}-{key}-{page:03}.png'
                        slide.Export(str(png), 'PNG', 2000, 1125)
                        fresh, old = grey(Image.open(png)), grey(Image.open(ROOT / record['image'].lstrip('/')))
                        png.unlink()
                        difference = ImageChops.difference(fresh, old)
                        mean = ImageStat.Stat(difference).mean[0]
                        if mean > SLIDE_LIMIT:
                            skipped.append((page, round(mean, 1))); continue
                        known = squeeze(''.join(record['text']))
                        scale = CHECK_WIDTH / size[0]
                        lines = []
                        for text, left, top, width, height in slide_lines(slide):
                            box = tuple(round(v * scale) for v in (left, top, left + width, top + height))
                            inside = left >= -1 and top >= -1 and left + width <= size[0] + 1 and top + height <= size[1] + 1
                            reason = ('outside the slide' if not inside or box[2] <= box[0] or box[3] <= box[1] else
                                      'not in the published text' if squeeze(text) not in known else
                                      'moved' if ImageStat.Stat(difference.crop(box)).mean[0] > LINE_LIMIT else '')
                            if reason:
                                dropped += 1
                                if debug: print(f'{key} slide {page}: dropped, {reason}: {text!r}', flush=True)
                                continue
                            lines.append([round(left / size[0], 4), round(top / size[1], 4), round(width / size[0], 4),
                                          round(height / size[1], 4), text])
                        taken = [(a['x'], a['y'], a['width'], a['height']) for name in ('embeds', 'videoFrames', 'linkAreas')
                                 for a in record.get(name, [])]
                        pictures = slide_pictures(slide, z, parts[page - 1], size, taken, folder)
                        if lines: record['lines'] = lines
                        if pictures: record['pictures'] = pictures
                        lines_total += len(lines); pictures_total += len(pictures)
                        if debug:
                            from PIL import ImageDraw
                            sheet = Image.open(ROOT / record['image'].lstrip('/')).convert('RGB').resize((1000, 562))
                            draw = ImageDraw.Draw(sheet)
                            for x, y, w, h, _ in lines: draw.rectangle((x * 1000, y * 562, (x + w) * 1000, (y + h) * 562), outline='red')
                            for p in pictures: draw.rectangle((p['x'] * 1000, p['y'] * 562, (p['x'] + p['width']) * 1000, (p['y'] + p['height']) * 562), outline='blue', width=3)
                            sheet.save(work / f'debug-{course}-{key}-{position:03}.jpg', quality=80)
                        if position % 10 == 0 or position == len(published): print(f'{key}: {position}/{len(published)}', flush=True)
            finally:
                presentation.Saved = True
                presentation.Close()
            assert hashlib.sha256(source.read_bytes()).hexdigest() == sha
            text = json.dumps(data, ensure_ascii=False, separators=(',', ':')) + ('\n' if raw.endswith('\n') else '')
            md.save(path, text)
            report.append(dict(deck=key, source=source.name, sourceChanged=data.get('sourceSha256') not in (None, sha), slides=len(published),
                               lines=lines_total, pictures=pictures_total, droppedLines=dropped, skippedSlides=skipped))
    finally:
        try: app.Quit()
        except Exception: pass
    print(json.dumps(report, ensure_ascii=False, indent=1))


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument('--course', required=True, choices=sorted(COURSES))
    parser.add_argument('--source-dir', required=True, type=Path)
    parser.add_argument('--work-dir', required=True, type=Path)
    parser.add_argument('--only', help='comma-separated deck ids, such as 2,3 or 1-1,1-2')
    parser.add_argument('--debug', action='store_true', help='save each published image with the found boxes drawn on it')
    args = parser.parse_args()
    sync(args.course, args.source_dir, args.work_dir, set(args.only.split(',')) if args.only else None, args.debug)


if __name__ == '__main__':
    main()
