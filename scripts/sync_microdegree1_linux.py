"""Rebuild one 마이크로디그리 과정1 session from a revised PPTX on Linux (LibreOffice + PyMuPDF).

The Windows converter (sync_microdegree1.py) needs PowerPoint. This version keeps every published
slide whose text is unchanged, with its image, text lines, pictures, videos and links, and renders
only the slides that are new or changed. Slides are renumbered to the new order. The source PPTX
is never modified.

Requirements: LibreOffice (soffice) with its Python UNO bridge, python-pptx, PyMuPDF, Pillow, and the
Freesentation fonts installed (fonts/freesentation/*.woff2 converted to TTF), so that LibreOffice
lays out text as PowerPoint does. Asian-Latin autospacing is switched off before export because
PowerPoint does not add that space.

    python scripts/sync_microdegree1_linux.py --source <pptx> --session 6-2 --work-dir <tmp dir>

--render 5,22 also redraws slides whose text is the same but whose layout changed (alignment, positions).
A changed slide may carry one YouTube video: a linked thumbnail picture and the video address in the text.
Any other picture on a changed slide is refused, because separate picture layers need the Windows converter.
"""
from pathlib import Path
import argparse, hashlib, json, re, shutil, subprocess, sys
from copy import deepcopy
from lxml import etree

sys.path.insert(0, str(Path(__file__).resolve().parent))
import sync_microdegree1 as md

UNO = r'''
import subprocess, sys, time
import uno
from com.sun.star.beans import PropertyValue
src, out = sys.argv[1:3]
proc = subprocess.Popen(['soffice', '--headless', '--invisible', '--norestore', '--accept=socket,host=127.0.0.1,port=2002;urp;'],
                        stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
def pv(name, value):
    p = PropertyValue(); p.Name = name; p.Value = value; return p
ctx = uno.getComponentContext()
resolver = ctx.ServiceManager.createInstanceWithContext('com.sun.star.bridge.UnoUrlResolver', ctx)
for _ in range(60):
    try:
        remote = resolver.resolve('uno:socket,host=127.0.0.1,port=2002;urp;StarOffice.ComponentContext'); break
    except Exception: time.sleep(1)
desktop = remote.ServiceManager.createInstanceWithContext('com.sun.star.frame.Desktop', remote)
doc = desktop.loadComponentFromURL('file://' + src, '_blank', 0, (pv('Hidden', True),))
def plain(text):
    cursor = text.createTextCursor(); cursor.gotoStart(False); cursor.gotoEnd(True)
    cursor.setPropertyValue('ParaIsCharacterDistance', False)
def walk(shapes):
    for i in range(shapes.Count):
        shape = shapes.getByIndex(i)
        if shape.supportsService('com.sun.star.drawing.GroupShape'): walk(shape)
        elif shape.ShapeType == 'com.sun.star.drawing.TableShape':
            model = shape.Model
            for row in range(model.RowCount):
                for col in range(model.ColumnCount): plain(model.getCellByPosition(col, row))
        elif hasattr(shape, 'createTextCursor'): plain(shape)
for i in range(doc.DrawPages.Count): walk(doc.DrawPages.getByIndex(i))
doc.storeToURL('file://' + out, (pv('FilterName', 'impress_pdf_Export'),))
doc.close(True)
try: desktop.terminate()
except Exception: pass
try: proc.wait(timeout=30)
except Exception: proc.kill()
'''
A = '{http://schemas.openxmlformats.org/drawingml/2006/main}'


def paragraphs(slide):
    """Every paragraph element of a slide in shape order, table cells row by row."""
    for shape in slide.shapes:
        if shape.has_table:
            for row in shape.table.rows:
                for cell in row.cells:
                    yield from cell.text_frame._txBody.iter(A + 'p')
        elif shape.has_text_frame:
            yield from shape.text_frame._txBody.iter(A + 'p')


def para_text(p):
    return ''.join('\v' if node.tag == A + 'br' else node.text or '' for node in p.iter(A + 't', A + 'br'))


def redact(slide):
    """The same removals as the Windows converter: instructor names, session dates, running times."""
    drop = lambda line: bool(md.ONLY_PERSON.fullmatch(line.strip()) or md.RUNNING_TIME.fullmatch(line.strip()))
    for p in list(paragraphs(slide)):
        text = para_text(p)
        lines = text.split('\v')
        new = '\v'.join(line for line in lines if not drop(line))
        for pattern, replacement in md.SCHEDULE:
            new = pattern.sub(replacement, new)
        if new == text: continue
        runs = p.findall(A + 'r')
        if not new.strip():
            parent = p.getparent()
            if len(parent.findall(A + 'p')) > 1: parent.remove(p)
            else:
                for run in runs: p.remove(run)
            continue
        first = runs[0]
        for extra in runs[1:] + p.findall(A + 'br'): p.remove(extra)
        parts = new.split('\v')
        first.find(A + 't').text = parts[0]
        at = first
        for part in parts[1:]:
            br = etree.Element(A + 'br'); at.addnext(br)
            run = deepcopy(first); run.find(A + 't').text = part
            br.addnext(run); at = run


def slide_text(slide):
    return [line.strip() for p in paragraphs(slide) for line in md.clean(para_text(p)).split('\n') if line.strip()]


def slide_title(slide, number, texts):
    title = slide.shapes.title
    if title is not None and title.has_text_frame and title.text_frame.text.strip():
        return md.clean(title.text_frame.text).replace('\n', ' ')
    return texts[0] if number == 1 else ' '.join(texts[:2])


def page_lines(page, published):
    """Text lines of a PDF page as [x, y, width, height, text] fractions. Only published text is kept."""
    width, height = page.rect.width, page.rect.height
    joined = ' '.join(published)
    lines = []
    for block in page.get_text('dict')['blocks']:
        for line in block.get('lines', []):
            text = ''.join(span['text'] for span in line['spans']).strip()
            if not text or text not in joined: continue
            x0, y0, x1, y1 = line['bbox']
            lines.append([round(x0 / width, 4), round(y0 / height, 4), round((x1 - x0) / width, 4), round((y1 - y0) / height, 4), text])
    return lines


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument('--source', type=Path, required=True)
    parser.add_argument('--session', required=True)
    parser.add_argument('--work-dir', type=Path, required=True)
    parser.add_argument('--render', default='', help='slide numbers to redraw although their text is unchanged, e.g. 5,22')
    parser.add_argument('--uno-python', default='/usr/bin/python3', help='a Python that can import uno')
    args = parser.parse_args()
    from pptx import Presentation
    from PIL import Image
    import pymupdf

    key = args.session
    session = next(s for s in md.SESSIONS if s[0] == key)
    assert not session[5], f'{key}: sessions that leave slides out need the Windows converter'
    work = args.work_dir.resolve(); work.mkdir(parents=True, exist_ok=True)
    data_path = md.DATA / f'{key}.json'
    data = json.loads(data_path.read_text(encoding='utf-8'))
    published = [s for s in data['slides'] if s.get('kind') != 'lab']
    by_text = {}
    for record in published: by_text.setdefault(tuple(record['text']), record)

    sha = hashlib.sha256(args.source.read_bytes()).hexdigest()
    copy = work / f'{key}.pptx'
    shutil.copy2(args.source, copy)
    deck = Presentation(str(copy))
    assert abs(deck.slide_width / deck.slide_height - 16 / 9) < .002, f'{key}: source is not 16:9'
    forced = {int(n) for n in args.render.split(',') if n.strip()}
    slides, changed = [], []
    for number, slide in enumerate(deck.slides, 1):
        redact(slide)
        texts = slide_text(slide)
        raw = ' '.join(texts)
        assert not md.LEFTOVER.search(raw), f'{key}: instructor text remains on slide {number}'
        assert not md.SCHEDULE_LEFT.search(raw), f'{key}: a session date or running time remains on slide {number}'
        old = by_text.get(tuple(texts))
        if old is not None and number not in forced:
            record = {k: v for k, v in old.items() if k not in ('sourcePage', 'image')}
            record['from'] = old['image']
        else:
            links = list(dict.fromkeys(re.findall(r'https?://[A-Za-z0-9._~:/?#\[\]@!$&()*+,;=%-]+', raw)))
            record = dict(title=slide_title(slide, number, texts), text=texts, links=links)
            pictures = [shape for shape in slide.shapes if shape.shape_type == 13]
            video = md.YOUTUBE.search(raw)
            if old is not None:
                assert not pictures and not video, f'{key}: slide {number} has a picture or a video, so it cannot be redrawn here'
            elif video:
                assert len(pictures) == 1 and len(md.YOUTUBE.findall(raw)) == 1, f'{key}: slide {number} needs exactly one video and its thumbnail'
                thumb = pictures[0]
                label = next((t.split(', ', 1)[1] for t in texts if t.startswith('영상:') and ', ' in t), record['title'])
                record['embeds'] = [dict(src=f'https://www.youtube-nocookie.com/embed/{video.group(1)}', title=label,
                                         x=round(thumb.left / deck.slide_width, 4), y=round(thumb.top / deck.slide_height, 4),
                                         width=round(thumb.width / deck.slide_width, 4), height=round(thumb.height / deck.slide_height, 4))]
                record['video'] = next(link for link in links if md.YOUTUBE.search(link))
            else:
                assert not pictures, f'{key}: changed slide {number} has a picture'
            changed.append(number)
        record['sourcePage'] = number
        slides.append(record)
    deck.save(str(copy))

    pdf = work / f'{key}.pdf'
    subprocess.run([args.uno_python, '-c', UNO, str(copy), str(pdf)], check=True, timeout=600)
    document = pymupdf.open(pdf)
    assert len(document) == len(slides), f'{key}: the PDF has {len(document)} pages for {len(slides)} slides'

    folder = md.IMAGES / key
    staged = work / 'images'
    if staged.exists(): shutil.rmtree(staged)
    staged.mkdir()
    for record in slides:
        number = record['sourcePage']
        target = staged / f'{number:03}.webp'
        source = record.pop('from', None)
        if source:
            shutil.copy2(md.ROOT / source.lstrip('/'), target)
        else:
            page = document[number - 1]
            pixmap = page.get_pixmap(matrix=pymupdf.Matrix(2000 / page.rect.width, 1125 / page.rect.height), alpha=False)
            Image.frombytes('RGB', (pixmap.width, pixmap.height), pixmap.samples).resize((2000, 1125)).save(target, format='WEBP', quality=88, method=6)
            lines = page_lines(page, record['text'])
            if lines: record['lines'] = lines
            href = record.pop('video', None)
            if href:
                x, y, w, h = next(line[:4] for line in lines if line[4] == href)
                record['linkAreas'] = [dict(href=href, label=href, x=round(x - .004, 4), y=round(y - .004, 4), width=round(w + .008, 4), height=round(h + .008, 4))]
        record['image'] = f'/images/lectures/{md.COURSE}/{key}/{number:03}.webp'
    for old in folder.glob('*.webp'): old.unlink()
    for new in sorted(staged.glob('*.webp')): shutil.copy2(new, folder / new.name)

    order = ('title', 'text', 'links', 'sourcePage', 'embeds', 'linkAreas', 'image', 'lines', 'pictures')
    data.update(sourceSha256=sha, slides=[{k: record[k] for k in order if k in record} for record in slides])
    md.save(data_path, json.dumps(data, ensure_ascii=False, separators=(',', ':')) + '\n')
    md.merge_labs({key})
    md.write_pages({key})
    print(json.dumps(dict(session=key, source=args.source.name, slides=len(slides), kept=len(slides) - len(changed), rendered=changed), ensure_ascii=False))


if __name__ == '__main__':
    main()
