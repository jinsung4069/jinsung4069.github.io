"""Convert an AI교육의 이해 chapter PPTX to the web viewer data on Linux (LibreOffice + PyMuPDF).

Same method as sync_ai_education_chapter5_linux.py, with the chapter settings in CHAPTERS.
Text positions come from the full PDF and the background from a copy with transparent text and
without top-level pictures. Pictures are copied byte for byte. The source PPTX is never modified.

Usage: python scripts/sync_ai_education_linux.py --chapter 6 --source <pptx> --work-dir <tmp dir>
"""
from pathlib import Path
from zipfile import ZipFile
import argparse, hashlib, io, json, posixpath, re, shutil, subprocess
from lxml import etree as ET
from PIL import Image, ImageFont
import pymupdf as fitz

ROOT = Path(__file__).resolve().parents[1]
NS = {'a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
      'p': 'http://schemas.openxmlformats.org/presentationml/2006/main',
      'r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'}
A, P, R = ('{%s}' % NS[k] for k in 'apr')
EMU = 12700

# lab: (insert after original slide number, lab id, title, intro)
CHAPTERS = {
    '6': dict(number=6, title='인공지능과 데이터과학', version='v1', titles={1: '인공지능과 데이터과학'}, labs=[
        (18, 'clean', '정제 결정 연습', '실제 자료의 문제 행을 보고 처리 방법과 근거를 고릅니다.'),
        (19, 'chart', '질문에 맞는 그래프 고르기', '질문을 읽고 알맞은 그래프와 이유를 확인합니다.'),
        (35, 'colab', 'Colab 실습 기록', '예상을 먼저 기록한 뒤 노트북을 실행하고 결과를 옮겨 적습니다.'),
        (41, 'quality', '데이터 품질과 편향 점검', '상황을 읽고 품질 문제와 편향의 경로를 판단합니다.'),
    ]),
    '7-1': dict(number='7-1', title='인공지능 프로그래밍 Ⅰ', version='v1', titles={1: '인공지능 프로그래밍 Ⅰ'}, labs=[
        (19, 'problem', '문제 정의서 작성', '해결할 문제와 입력, 출력, 데이터, 평가 기준을 적습니다.'),
        (23, 'knn', 'k 최근접 이웃 탐색', '학습 자료의 펭귄 위에 새 점을 놓고 k를 바꾸어 봅니다.'),
        (30, 'colab', 'Colab 실습 기록', '예상을 먼저 기록한 뒤 노트북을 실행하고 결과를 옮겨 적습니다.'),
        (38, 'interpret', '모델 결과 해석 확인', '결과 문장을 읽고 타당한 해석을 고릅니다.'),
    ]),
    '7-2': dict(number='7-2', title='인공지능 프로그래밍 Ⅱ', version='v1', titles={1: '인공지능 프로그래밍 Ⅱ'}, labs=[
        (9, 'plan', '미니 프로젝트 계획서', '과제 2의 문제, 데이터, 도구와 평가 계획을 작성합니다.'),
        (17, 'tests', '테스트 계획표', '확인할 입력과 기대 결과를 적고 실제 결과를 기록합니다.'),
        (19, 'errors', '오류 종류 판별', '증상을 읽고 오류의 종류와 먼저 확인할 곳을 고릅니다.'),
        (29, 'checklist', '제출 전 점검', '제출물과 평가 기준을 하나씩 확인합니다.'),
    ]),
}

def rels(z, part):
    name = posixpath.join(posixpath.dirname(part), '_rels', posixpath.basename(part) + '.rels')
    if name not in z.namelist():
        return {}
    return {e.get('Id'): (e.get('Target') if e.get('TargetMode') == 'External'
                          else posixpath.normpath(posixpath.join(posixpath.dirname(part), e.get('Target'))))
            for e in ET.fromstring(z.read(name))}


def ordered_parts(z):
    rel = rels(z, 'ppt/presentation.xml')
    return [rel[e.get(R + 'id')] for e in ET.fromstring(z.read('ppt/presentation.xml')).find('p:sldIdLst', NS)]


def soffice_pdf(src, outdir):
    subprocess.run(['soffice', '--headless', '--convert-to', 'pdf', '--outdir', str(outdir), str(src)],
                   check=True, capture_output=True, timeout=600)
    return outdir / (src.stem + '.pdf')


def rotated_text(node):
    """Vertical or rotated text stays in the rendered background instead of HTML runs."""
    while node is not None and node.tag != P + 'sp':
        node = node.getparent()
    if node is None:
        return False
    body = node.find('p:txBody/a:bodyPr', NS)
    xfrm = node.find('p:spPr/a:xfrm', NS)
    return (body is not None and body.get('vert', 'horz') != 'horz') or (xfrm is not None and xfrm.get('rot', '0') != '0')


def transparent_copy(source, target, parts):
    """Copy the PPTX with invisible text and without top-level pictures."""
    with ZipFile(source) as zin, ZipFile(target, 'w') as zout:
        for item in zin.infolist():
            data = zin.read(item.filename)
            if item.filename in parts:
                xml = ET.fromstring(data)
                for tag in ('rPr', 'endParaRPr', 'defRPr'):
                    for rpr in xml.iter(A + tag):
                        if rotated_text(rpr):
                            continue
                        for fill in rpr.findall(A + 'solidFill') + rpr.findall(A + 'gradFill') + rpr.findall(A + 'noFill'):
                            rpr.remove(fill)
                        fill = ET.Element(A + 'solidFill')
                        clr = ET.SubElement(fill, A + 'srgbClr', val='FFFFFF')
                        ET.SubElement(clr, A + 'alpha', val='0')
                        rpr.insert(1 if rpr.find(A + 'ln') is not None else 0, fill)
                for r in xml.iter(A + 'r'):
                    if r.find(A + 'rPr') is None and not rotated_text(r):
                        rpr = ET.Element(A + 'rPr')
                        fill = ET.SubElement(rpr, A + 'solidFill')
                        clr = ET.SubElement(fill, A + 'srgbClr', val='FFFFFF')
                        ET.SubElement(clr, A + 'alpha', val='0')
                        r.insert(0, rpr)
                tree = xml.find('p:cSld/p:spTree', NS)
                for pic in tree.findall('p:pic', NS):
                    tree.remove(pic)
                data = ET.tostring(xml, xml_declaration=True, encoding='UTF-8', standalone=True)
            zout.writestr(item, data)


WEIGHTS = {'1': 'Thin', '2': 'ExtraLight', '3': 'Light', '4': 'Regular', '5': 'Medium',
           '6': 'SemiBold', '7': 'Bold', '8': 'ExtraBold', '9': 'Black'}


def font_name(raw):
    name = raw.split('+')[-1]
    m = re.match(r'Freesentation-?(\d)', name)
    return f'Freesentation {m.group(1)} {WEIGHTS[m.group(1)]}' if m else name


def page_runs(page):
    runs = []
    for block in page.get_text('dict')['blocks']:
        for line in block.get('lines', []):
            if abs(line['dir'][0] - 1) > 1e-3:
                continue
            for span in line['spans']:
                text = span['text']
                if not text.strip():
                    continue
                x0, y0, x1, y1 = span['bbox']
                c = span['color']
                runs.append(dict(text=text, x=round(x0, 4), y=round(y0, 4), w=round(x1 - x0, 4), h=round(y1 - y0, 4),
                                 size=round(span['size'], 3), font=font_name(span['font']),
                                 bold=bool(span['flags'] & 16), italic=bool(span['flags'] & 2),
                                 color='#%06x' % c))
    return runs


FONT_DIRS = [Path.home() / '.fonts', Path('/usr/share/fonts'), Path.home() / '.local/share/fonts']
_fonts = {}


def natural_width(text, font, size):
    """Advance width of the text in the web font, so the viewer does not stretch it (scaleX near 1)."""
    m = re.match(r'Freesentation (\d) (\w+)', font)
    if not m:
        return None
    name = f'Freesentation-{m.group(1)}{m.group(2)}.ttf'
    key = (name, round(size * 10))
    if key not in _fonts:
        path = next((p for d in FONT_DIRS for p in d.rglob(name)), None)
        _fonts[key] = ImageFont.truetype(str(path), key[1]) if path else None
    f = _fonts[key]
    return f.getlength(text) / 10 if f else None


def restore_spacing(runs, texts):
    """LibreOffice widens the gap between Hangul and Latin text; PDF extraction turns it into spaces.
    Keep only the spaces that exist in the PPTX text."""
    source = '\n'.join(texts)
    for run in runs:
        if run['text'] in source:
            continue
        pattern = ''.join(' ?' if ch == ' ' else re.escape(ch) for ch in run['text'])
        m = re.search(pattern, source)
        if m:
            run['text'] = m.group(0)
    for run in runs:
        width = natural_width(run['text'], run['font'], run['size'])
        if width:
            run['w'] = round(width, 4)
    return runs


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--chapter', required=True, choices=sorted(CHAPTERS))
    ap.add_argument('--source', required=True, type=Path)
    ap.add_argument('--work-dir', required=True, type=Path)
    args = ap.parse_args()
    source, work = args.source.resolve(), args.work_dir.resolve()
    work.mkdir(parents=True, exist_ok=True)
    sha = hashlib.sha256(source.read_bytes()).hexdigest()
    cfg = CHAPTERS[args.chapter]
    folder = ROOT / f'images/lectures/ai-education/{args.chapter}'
    if folder.exists():
        shutil.rmtree(folder)
    folder.mkdir(parents=True, exist_ok=True)

    full_src = work / 'full.pptx'; shutil.copy2(source, full_src)
    with ZipFile(source) as z:
        parts = ordered_parts(z)
    bg_src = work / 'background.pptx'
    transparent_copy(source, bg_src, set(parts))
    full_pdf, bg_pdf = fitz.open(soffice_pdf(full_src, work)), fitz.open(soffice_pdf(bg_src, work))
    assert len(full_pdf) == len(bg_pdf) == len(parts)
    width, height = full_pdf[0].rect.width, full_pdf[0].rect.height

    data = dict(number=cfg['number'], title=cfg['title'], course='AI교육의 이해 / 언플러그드AI교육',
                width=round(width, 3), height=round(height, 3), sourceVersion=cfg['version'], sourceSha256=sha, slides=[])
    with ZipFile(source) as z:
        for number, part in enumerate(parts, 1):
            xml = ET.fromstring(z.read(part))
            rel = rels(z, part)
            texts = [t.text for t in xml.iter(A + 't') if t.text and t.text.strip()]
            title = None
            for sp in xml.find('p:cSld/p:spTree', NS).findall('p:sp', NS):
                ph = sp.find('p:nvSpPr/p:nvPr/p:ph', NS)
                if ph is not None and ph.get('type') in ('title', 'ctrTitle'):
                    title = ''.join(t.text or '' for t in sp.iter(A + 't')).strip()
            title = cfg['titles'].get(number) or title or texts[0]
            links = [v for v in rel.values() if v.startswith(('http://', 'https://'))]
            links += re.findall(r'https?://[A-Za-z0-9._~:/?#\[\]@!$&()*+,;=%-]+', ' '.join(texts))
            pictures = []
            for pic in xml.find('p:cSld/p:spTree', NS).findall('p:pic', NS):
                blip = pic.find('.//a:blip', NS)
                target = rel.get(blip.get(R + 'embed'))
                raw = z.read(target)
                asset = folder / (hashlib.sha256(raw).hexdigest()[:16] + Path(target).suffix.lower())
                if not asset.exists():
                    asset.write_bytes(raw)
                assert asset.read_bytes() == raw
                off, ext = pic.find('p:spPr/a:xfrm/a:off', NS), pic.find('p:spPr/a:xfrm/a:ext', NS)
                crop = pic.find('p:blipFill/a:srcRect', NS)
                pictures.append(dict(src='/' + asset.relative_to(ROOT).as_posix(),
                                     x=int(off.get('x')) / EMU, y=int(off.get('y')) / EMU,
                                     w=int(ext.get('cx')) / EMU, h=int(ext.get('cy')) / EMU,
                                     crop={k: int(crop.get(k, '0')) / 100000 if crop is not None else 0 for k in 'ltrb'},
                                     source=target))
            pix = bg_pdf[number - 1].get_pixmap(matrix=fitz.Matrix(2000 / width, 2000 / width), alpha=False)
            bg = folder / f'{number:03}-background.webp'
            Image.open(io.BytesIO(pix.tobytes('png'))).save(bg, format='WEBP', lossless=True)
            data['slides'].append(dict(title=title, sourceSlide=number, sourcePart=part, text=texts,
                                       runs=restore_spacing(page_runs(full_pdf[number - 1]), texts), pictures=pictures,
                                       links=list(dict.fromkeys(links)), background='/' + bg.relative_to(ROOT).as_posix()))
            for after, lab, lab_title, intro in cfg['labs']:
                if after == number:
                    data['slides'].append(dict(kind='lab', lab=lab, sourceAfter=after, title=lab_title,
                                               text=[lab_title, intro], pictures=[], links=[]))
    assert hashlib.sha256(source.read_bytes()).hexdigest() == sha
    (ROOT / f'data/lectures/ai-education/{args.chapter}.json').write_text(
        json.dumps(data, ensure_ascii=False, separators=(',', ':')) + '\n', encoding='utf-8')
    print(json.dumps(dict(count=len(data['slides']), originals=len(parts), activities=len(cfg['labs']),
                          pictures=sum(len(s['pictures']) for s in data['slides']), sourceSha256=sha)))


if __name__ == '__main__':
    main()
