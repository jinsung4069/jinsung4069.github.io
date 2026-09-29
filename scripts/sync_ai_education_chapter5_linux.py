"""Convert the Chapter 5 PPTX to the web viewer data on Linux (LibreOffice + PyMuPDF).

The Windows converter (sync_ai_education_chapter5.py) needs PowerPoint. This version renders
with LibreOffice instead: text positions come from the full PDF, and the background comes from
a copy whose text is fully transparent and whose top-level pictures are removed. Pictures are
copied byte for byte from the PPTX. The source PPTX is never modified.

Requirements: LibreOffice (soffice), PyMuPDF, python-pptx, lxml, Pillow, and the Freesentation
fonts installed so that LibreOffice lays out text as PowerPoint does.

Usage: python scripts/sync_ai_education_chapter5_linux.py --source <pptx> --work-dir <tmp dir>
"""
from pathlib import Path
from zipfile import ZipFile
import argparse, hashlib, io, json, posixpath, re, shutil, subprocess
from lxml import etree as ET
from PIL import Image
import pymupdf as fitz

ROOT = Path(__file__).resolve().parents[1]
NS = {'a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
      'p': 'http://schemas.openxmlformats.org/presentationml/2006/main',
      'r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'}
A, P, R = ('{%s}' % NS[k] for k in 'apr')
EMU = 12700

# (insert after original slide number, lab id, title, intro)
LABS = [
    (10, 'ethics', '이해관계자별 판단 기록', '기대하는 이익과 부담, 필요한 대안을 비교합니다.'),
    (14, 'accuracy', '전체 정확도에 가려진 차이', '계산 예시의 조건별 표본 수와 정답 수를 바꾸어 봅니다.'),
    (36, 'colab', 'Colab 실습 기록', '예상을 먼저 기록한 뒤 노트북을 실행하고 결과를 옮겨 적습니다.'),
    (43, 'abstention', '보류 기준과 검토 부담', '설명용 예시 40장에서 처리 범위와 남은 오류를 함께 확인합니다.'),
    (47, 'model-card', '데이터와 모델의 활용 검토', '확인한 근거와 미확인 사항을 구분해 활용안을 작성합니다.'),
    (50, 'quiz', '윤리 판단 확인', '판단을 선택한 뒤 필요한 근거를 확인합니다.'),
]
TITLE_OVERRIDE = {1: '인공지능 윤리', 34: '윤리 감사 실습'}


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


def font_name(raw):
    name = raw.split('+')[-1]
    m = re.match(r'Freesentation-?(\d)\s?([A-Za-z]+)', name)
    return f'Freesentation {m.group(1)} {m.group(2)}' if m else name


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


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--source', required=True, type=Path)
    ap.add_argument('--work-dir', required=True, type=Path)
    args = ap.parse_args()
    source, work = args.source.resolve(), args.work_dir.resolve()
    work.mkdir(parents=True, exist_ok=True)
    sha = hashlib.sha256(source.read_bytes()).hexdigest()
    folder = ROOT / 'images/lectures/ai-education/5'
    folder.mkdir(parents=True, exist_ok=True)

    full_src = work / 'full.pptx'; shutil.copy2(source, full_src)
    with ZipFile(source) as z:
        parts = ordered_parts(z)
    bg_src = work / 'background.pptx'
    transparent_copy(source, bg_src, set(parts))
    full_pdf, bg_pdf = fitz.open(soffice_pdf(full_src, work)), fitz.open(soffice_pdf(bg_src, work))
    assert len(full_pdf) == len(bg_pdf) == len(parts)
    width, height = full_pdf[0].rect.width, full_pdf[0].rect.height

    data = dict(number=5, title='인공지능 윤리', course='AI교육의 이해 / 언플러그드AI교육',
                width=round(width, 3), height=round(height, 3), sourceVersion='v2', sourceSha256=sha, slides=[])
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
            title = TITLE_OVERRIDE.get(number) or title or texts[0]
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
                                       runs=page_runs(full_pdf[number - 1]), pictures=pictures,
                                       links=list(dict.fromkeys(links)), background='/' + bg.relative_to(ROOT).as_posix()))
            for after, lab, lab_title, intro in LABS:
                if after == number:
                    data['slides'].append(dict(kind='lab', lab=lab, sourceAfter=after, title=lab_title,
                                               text=[lab_title, intro], pictures=[], links=[]))
    assert hashlib.sha256(source.read_bytes()).hexdigest() == sha
    (ROOT / 'data/lectures/ai-education/5.json').write_text(
        json.dumps(data, ensure_ascii=False, separators=(',', ':')) + '\n', encoding='utf-8')
    print(json.dumps(dict(count=len(data['slides']), originals=len(parts), activities=len(LABS),
                          pictures=sum(len(s['pictures']) for s in data['slides']), sourceSha256=sha)))


if __name__ == '__main__':
    main()
