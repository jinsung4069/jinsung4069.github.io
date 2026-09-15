"""Refresh the two AI education web decks from local PowerPoint copies on Windows.

Requires Pillow, lxml and pywin32. Source files are never modified.
The work directory must be a task-specific, non-synchronized temporary directory.
"""
from pathlib import Path
from zipfile import ZipFile
import argparse, hashlib, json, posixpath, re, shutil
from lxml import etree as ET
from PIL import Image
import win32com.client

ROOT = Path(__file__).resolve().parents[1]
NS = {'a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
      'p': 'http://schemas.openxmlformats.org/presentationml/2006/main',
      'r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'}
NAMES = {1: 'Chapter1_인공지능사회_강의교안', 3: 'Chapter3_인공지능교육의이해_강의교안'}

def relationships(z, part):
    name = posixpath.join(posixpath.dirname(part), '_rels', posixpath.basename(part) + '.rels')
    if name not in z.namelist(): return {}
    return {e.get('Id'): e.get('Target') if e.get('TargetMode') == 'External' else
            posixpath.normpath(posixpath.join(posixpath.dirname(part), e.get('Target')))
            for e in ET.fromstring(z.read(name))}

def ordered_parts(z):
    rels = relationships(z, 'ppt/presentation.xml')
    return [rels[e.get('{'+NS['r']+'}id')] for e in
            ET.fromstring(z.read('ppt/presentation.xml')).find('p:sldIdLst', NS)]

def text_runs(shape, x_offset=0, y_offset=0):
    result = []
    tr = shape.TextFrame.TextRange
    for i in range(1, tr.Lines().Count + 1):
        line = tr.Lines(i)
        for j in range(1, line.Runs().Count + 1):
            run = line.Runs(j)
            text = run.Text.rstrip('\r\v\n')
            if not text: continue
            f = run.Font
            rgb = int(f.Color.RGB)
            result.append(dict(text=text, x=round(run.BoundLeft+x_offset, 4),
                y=round(run.BoundTop+y_offset, 4), w=round(run.BoundWidth, 4),
                h=round(run.BoundHeight, 4), size=round(f.Size, 3), font=str(f.Name),
                bold=f.Bold == -1, italic=f.Italic == -1,
                color='#%02x%02x%02x' % (rgb & 255, (rgb >> 8) & 255, (rgb >> 16) & 255)))
    return result

def extract_slide(slide, z, part, number, chapter, folder, work):
    xml = ET.fromstring(z.read(part))
    rels = relationships(z, part)
    texts = [e.text or '' for e in xml.findall('.//a:t', NS)]
    titles = [s for s in slide.Shapes if s.HasTextFrame and s.TextFrame.HasText
              and s.Top < 90 and s.Height < 130]
    title = titles[0].TextFrame.TextRange.Text.replace('\r', ' ') if titles else texts[0]
    if number == 1: title = ' '.join(texts[:2])
    elif re.fullmatch(r'\d{2}', title): title = ' '.join(texts[:2])
    notes = []
    for path in rels.values():
        if 'notesSlides/notesSlide' not in path or not path.endswith('.xml'): continue
        for shape in ET.fromstring(z.read(path)).findall('.//p:sp', NS):
            ph = shape.find('p:nvSpPr/p:nvPr/p:ph', NS)
            if ph is not None and ph.get('type') in ('sldImg', 'sldNum', 'dt', 'hdr', 'ftr'): continue
            notes.extend(''.join(p.itertext()) for p in shape.findall('.//a:p', NS) if p.findall('.//a:t', NS))
    assert not any(re.search(r'[A-Z]:[\\/]', s) for s in notes), 'Local path in public notes'
    record = dict(title=title, sourceSlide=number, sourcePart=part, text=texts, notes=notes,
                  runs=[], pictures=[], links=list(dict.fromkeys(
                    [s for s in rels.values() if s.startswith(('http://', 'https://'))] +
                    re.findall(r'https?://[A-Za-z0-9._~:/?#\[\]@!$&()*+,;=%-]+', ' '.join(texts)))))
    slide.Export(str(work/f'ref-{chapter}-{number:03}.png'), 'PNG', 2000, 1125)
    pictures = {int(e.find('p:nvPicPr/p:cNvPr', NS).get('id')): e for e in xml.findall('p:cSld/p:spTree/p:pic', NS)}
    for shape in slide.Shapes:
        if shape.Id in pictures and abs(shape.Rotation) < .01:
            element = pictures[shape.Id]
            blip = element.find('.//a:blip', NS)
            target = rels.get(blip.get('{'+NS['r']+'}embed'))
            if target and target in z.namelist() and Path(target).suffix.lower() in ('.png', '.jpg', '.jpeg', '.gif', '.bmp'):
                raw = z.read(target)
                asset = folder/(hashlib.sha256(raw).hexdigest()[:16]+Path(target).suffix.lower())
                if not asset.exists(): asset.write_bytes(raw)
                assert asset.read_bytes() == raw
                crop = element.find('p:blipFill/a:srcRect', NS)
                record['pictures'].append(dict(src='/'+asset.relative_to(ROOT).as_posix(),
                    x=shape.Left, y=shape.Top, w=shape.Width, h=shape.Height,
                    crop={k: int(crop.get(k, '0'))/100000 if crop is not None else 0 for k in ('l', 't', 'r', 'b')}, source=target))
                shape.Visible = 0
        if shape.HasTable:
            y = shape.Top
            for row in range(1, shape.Table.Rows.Count + 1):
                x = shape.Left
                height = shape.Table.Rows(row).Height
                for col in range(1, shape.Table.Columns.Count + 1):
                    cell = shape.Table.Cell(row, col).Shape
                    if cell.TextFrame.HasText:
                        anchor = cell.TextFrame.VerticalAnchor
                        offset = height/2 if anchor == 3 else height if anchor == 4 else 0
                        record['runs'].extend(text_runs(cell, x, y+offset))
                        cell.TextFrame2.TextRange.Font.Fill.Transparency = 1
                    x += shape.Table.Columns(col).Width
                y += height
        elif shape.HasTextFrame and shape.TextFrame.HasText and abs(shape.Rotation) < .01:
            record['runs'].extend(text_runs(shape))
            shape.TextFrame2.TextRange.Font.Fill.Transparency = 1
    background = work/f'background-{chapter}-{number}.png'
    slide.Export(str(background), 'PNG', 2000, 1125)
    asset = folder/f'{number:03}-background.webp'
    Image.open(background).save(asset, format='WEBP', lossless=True)
    record['background'] = '/'+asset.relative_to(ROOT).as_posix()
    return record

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--source-dir', required=True, type=Path)
    parser.add_argument('--work-dir', required=True, type=Path)
    parser.add_argument('--version', required=True)
    args = parser.parse_args()
    work = args.work_dir.resolve()
    work.mkdir(parents=True, exist_ok=True)
    assert not any(x.lower() in ('onedrive', 'dropbox', 'google drive') for x in work.parts)
    manifests = []
    app = win32com.client.DispatchEx('PowerPoint.Application')
    try:
        for chapter, stem in NAMES.items():
            source = args.source_dir/f'{stem}_{args.version}.pptx'
            sha = hashlib.sha256(source.read_bytes()).hexdigest()
            copy = work/source.name
            assert copy.resolve() != source.resolve()
            shutil.copy2(source, copy)
            data_path = ROOT/f'data/lectures/ai-education/{chapter}.json'
            previous = json.loads(data_path.read_text(encoding='utf-8'))
            folder = ROOT/f'images/lectures/ai-education/{chapter}'
            with ZipFile(source) as z:
                parts = ordered_parts(z)
                presentation = app.Presentations.Open(str(copy), ReadOnly=False, Untitled=False, WithWindow=False)
                try:
                    data = dict(number=chapter, title=previous['title'], course=previous['course'],
                        width=presentation.PageSetup.SlideWidth, height=presentation.PageSetup.SlideHeight,
                        sourceVersion=args.version, sourceSha256=sha, slides=[])
                    for number, part in enumerate(parts, 1):
                        data['slides'].append(extract_slide(presentation.Slides(number), z, part, number, chapter, folder, work))
                        if number % 10 == 0 or number == len(parts): print(f'Chapter {chapter}: {number}/{len(parts)}', flush=True)
                finally:
                    presentation.Saved = True
                    presentation.Close()
            assert hashlib.sha256(source.read_bytes()).hexdigest() == sha
            data_path.write_text(json.dumps(data, ensure_ascii=False, separators=(',', ':'))+'\n', encoding='utf-8')
            changed = [i+1 for i, (a, b) in enumerate(zip(previous['slides'], data['slides']))
                       if a['text'] != b['text'] or a['pictures'] != b['pictures'] or a['runs'] != b['runs']]
            manifests.append(dict(chapter=chapter, source=source.name, sha256=sha, changed=changed,
                count=len(data['slides']), pictures=sum(len(s['pictures']) for s in data['slides']),
                runs=sum(len(s['runs']) for s in data['slides']),
                notesIdentical=all(a['notes'] == b['notes'] for a,b in zip(previous['slides'],data['slides']))))
    finally:
        try: app.Quit()
        except Exception: pass
    (work/'manifest.json').write_text(json.dumps(manifests, ensure_ascii=False, indent=2), encoding='utf-8')
    print(json.dumps(manifests, ensure_ascii=False))

if __name__ == '__main__': main()
