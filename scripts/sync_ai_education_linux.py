"""Convert an AI교육의 이해 chapter PPTX to the web viewer data (LibreOffice or PowerPoint + PyMuPDF).

Same method as sync_ai_education_chapter5_linux.py, with the chapter settings in CHAPTERS.
Text positions come from the full PDF and the background from a copy with transparent text and
without top-level pictures. Pictures are copied byte for byte. The source PPTX is never modified.

Usage: python scripts/sync_ai_education_linux.py --chapter 6 --source <pptx> --work-dir <tmp dir>
       add --engine powerpoint on Windows to export the PDFs with PowerPoint instead of LibreOffice.
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

# Slides of lecture 10 without a title placeholder, or with part of the title drawn as a picture.
LECTURE10_TITLES = {
    1: '전문가 시스템의 이해와 언플러그드 활동', 3: '콤비의 부품', 4: '콤비의 두 가지 게임 방법',
    6: '스피드게임 1. 준비', 7: '스피드게임 2. 미션 카드 펼치기', 8: '스피드게임 3. 조작 카드 맞추기',
    9: '스피드게임 3. 조작 카드 맞추기', 10: '외계인 미션 카드', 11: '스피드게임 4. 검증과 점수',
    12: '스피드게임 4. 검증과 점수', 15: '알고리즘게임 1. 준비', 16: '알고리즘게임 1. 준비',
    18: '알고리즘게임 2. 카드 조작', 19: '조작 방법 1, 밀기', 20: '조작 방법 2, 돌리기',
    21: '조작 방법 3, 뒤집기', 22: '조작 방법 3, 뒤집기', 23: '알고리즘게임 3. 횟수 말하기',
    24: '알고리즘게임 4. 검증', 29: '검증 방법', 30: '검증 방법', 32: '절차적 사고력으로 게임 즐기기',
}

# lab: (insert after original slide number, lab id, title, intro)
CHAPTERS = {
    '6': dict(number=6, title='인공지능과 데이터과학', version='v2', titles={1: '인공지능과 데이터과학'}, labs=[
        (39, 'clean', '정제 결정 연습', '실제 자료의 문제 행을 보고 처리 방법과 근거를 고릅니다.'),
        (40, 'chart', '질문에 맞는 그래프 고르기', '질문을 읽고 알맞은 그래프와 이유를 확인합니다.'),
        (56, 'colab', 'Colab 실습 기록', '예상을 먼저 기록한 뒤 노트북을 실행하고 결과를 옮겨 적습니다.'),
        (62, 'quality', '데이터 품질과 편향 점검', '상황을 읽고 품질 문제와 편향의 경로를 판단합니다.'),
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
    'lecture9': dict(number=9, title='언플러그드 활동의 이해 및 실제', version='v1', titles={1: '언플러그드 활동의 이해 및 실제'}, labs=[
        (15, 'grid', '모눈종이 프로그래밍', '명령 카드로 점선 칸만 칠하며 순차, 반복, 함수를 찾습니다.'),
        (27, 'alligator', '규칙표 악어 체스', '규칙표 악어, 빈칸이 있는 규칙표, 스스로 배우는 악어와 차례로 대결합니다.'),
        (36, 'monkey', '무는 원숭이를 찾아라', '훈련 카드로 의사결정트리를 만들고 테스트 카드로 확인합니다.'),
        (44, 'neuron', '뉴런 퍼즐', '가중치와 임계값을 맞추어 AND, OR, XOR을 계산합니다.'),
    ]),
    'lecture10': dict(number=10, title='전문가 시스템의 이해와 언플러그드 활동', version='v1', titles=LECTURE10_TITLES, labs=[
        (38, 'alligator', '규칙표 악어 체스', '규칙표 악어, 빈칸이 있는 규칙표, 스스로 배우는 악어와 차례로 대결합니다.'),
    ]),
    'lecture11': dict(number=11, title='피지컬 AI 교육 사례와 인공지능 융합 교육', version='v1',
                      titles={1: '피지컬 AI 교육 사례와 인공지능 융합 교육', 4: '01 피지컬 컴퓨팅과 피지컬 AI',
                              12: '02 센서와 장치, AI의 연계', 17: '03 피지컬 AI와 VLA 모델', 24: '04 초등 피지컬 AI 교육 사례',
                              30: '05 언플러그드와 연결 설계', 34: '06 인공지능 융합 교육', 39: '07 교육과정과 생활문제 연계'}, labs=[
        (7, 'rule', '규칙으로 움직이는 장치', '밝기와 기준값을 바꾸며 사람이 쓴 규칙이 장치를 움직이는 모습을 봅니다.'),
        (13, 'loop', '감지, 판단, 행동 따라가기', '로봇이 장애물을 피하는 동안 감지, 판단, 행동이 되풀이되는 모습을 봅니다.'),
        (23, 'vla', '말을 행동으로 잇는 로봇', '지시를 고르고 영상, 언어, 행동이 이어지는 단계를 따라갑니다.'),
        (28, 'wheelchair', '스마트 휠체어 따라가기', '경사가 바뀔 때 기울기 감지, 경사 판단, 의자 각도 조절이 이어지는 모습을 봅니다.'),
        (32, 'cards', '규칙 카드와 예시 카드', '같은 물건을 규칙 카드와 예시 카드로 두 번 분류하고 결과를 비교합니다.'),
        (33, 'design', '센서와 AI, 장치 연결 설계', '생활문제를 정하고 감지, 판단, 행동과 오판 대비를 설계합니다.'),
        (47, 'topic', '융합 주제 선정과 수업 개요', '점검 질문으로 주제를 확인하고 수업 개요를 작성합니다.'),
    ]),
}
# Pictures a browser cannot show (EMF, WMF, TIFF) stay in the rendered background.
WEB_IMAGES = {'.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'}


def web_picture(pic, rel):
    blip = pic.find('.//a:blip', NS)
    target = rel.get(blip.get(R + 'embed')) if blip is not None else None
    return target if target and Path(target).suffix.lower() in WEB_IMAGES else None

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


def powerpoint_pdf(src, outdir):
    import win32com.client
    app = win32com.client.DispatchEx('PowerPoint.Application')
    try:
        pres = app.Presentations.Open(str(src), True, False, False)
        try:
            out = outdir / (src.stem + '.pdf')
            pres.SaveAs(str(out), 32)  # ppSaveAsPDF
        finally:
            pres.Close()
    finally:
        app.Quit()
    return out


def soffice_pdf(src, outdir):
    subprocess.run(['soffice', '--headless', '--convert-to', 'pdf', '--outdir', str(outdir), str(src)],
                   check=True, capture_output=True, timeout=600)
    return outdir / (src.stem + '.pdf')


def chart_boxes(xml):
    """Charts stay in the rendered background; their labels are not in the slide XML."""
    boxes = []
    for frame in xml.find('p:cSld/p:spTree', NS).findall('p:graphicFrame', NS):
        data = frame.find('a:graphic/a:graphicData', NS)
        off, ext = frame.find('p:xfrm/a:off', NS), frame.find('p:xfrm/a:ext', NS)
        if data is not None and data.get('uri', '').endswith('/chart') and off is not None:
            x, y = int(off.get('x')) / EMU, int(off.get('y')) / EMU
            boxes.append((x, y, x + int(ext.get('cx')) / EMU, y + int(ext.get('cy')) / EMU))
    return boxes


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
                rel = rels(zin, item.filename)
                for pic in tree.findall('p:pic', NS):
                    if web_picture(pic, rel):
                        tree.remove(pic)
                timing = xml.find('p:timing', NS)  # media animations point at the removed pictures
                if timing is not None:
                    xml.remove(timing)
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


FONT_DIRS = [d for d in (Path.home() / '.fonts', Path('/usr/share/fonts'), Path.home() / '.local/share/fonts',
                          Path.home() / 'AppData/Local/Microsoft/Windows/Fonts', Path('C:/Windows/Fonts')) if d.exists()]
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
    PowerPoint PDFs drop the space characters and keep only the gap.
    Keep exactly the spaces that exist in the PPTX text."""
    source = '\n'.join(texts)
    for run in runs:
        if run['text'] in source:
            continue
        # An automatic list number ("1. ") is drawn by PowerPoint and is not in the PPTX text.
        prefix, body = re.match(r'(\d+\.\s*)?(.*)', run['text'], re.S).groups()
        for lead, text in (('', run['text']), (prefix or '', body)):
            chars = [ch for ch in text if not ch.isspace()]
            pattern = r'\s{0,3}'.join(re.escape(ch) for ch in chars)  # a line can span several PPTX runs
            m = re.search(pattern, source) if chars else None
            if m:
                run['text'] = lead + re.sub(r'\s', ' ', m.group(0).replace('\n', ''))
                break
    for run in runs:
        if not run['font'].startswith('Freesentation'):
            # The viewer only has Freesentation; another font's width would stretch its glyphs.
            run['font'] = 'Freesentation 7 Bold' if run['bold'] else 'Freesentation 4 Regular'
        width = natural_width(run['text'], run['font'], run['size'])
        if width:
            run['w'] = round(width, 4)
    return runs


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--chapter', required=True, choices=sorted(CHAPTERS))
    ap.add_argument('--source', required=True, type=Path)
    ap.add_argument('--work-dir', required=True, type=Path)
    ap.add_argument('--engine', choices=('soffice', 'powerpoint'), default='soffice')
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
    to_pdf = powerpoint_pdf if args.engine == 'powerpoint' else soffice_pdf
    full_pdf, bg_pdf = fitz.open(to_pdf(full_src, work)), fitz.open(to_pdf(bg_src, work))
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
            title = cfg['titles'].get(number) or title or (texts[0] if texts else data['slides'][-1]['title'])
            links = [v for v in rel.values() if v.startswith(('http://', 'https://'))]
            links += re.findall(r'https?://[A-Za-z0-9._~:/?#\[\]@!$&()*+,;=%-]+', ' '.join(texts))
            pictures = []
            for pic in xml.find('p:cSld/p:spTree', NS).findall('p:pic', NS):
                target = web_picture(pic, rel)
                if not target:
                    continue
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
            boxes = chart_boxes(xml)
            runs = [r for r in page_runs(full_pdf[number - 1])
                    if not any(x0 <= r['x'] + r['w'] / 2 <= x1 and y0 <= r['y'] + r['h'] / 2 <= y1 for x0, y0, x1, y1 in boxes)]
            data['slides'].append(dict(title=title, sourceSlide=number, sourcePart=part, text=texts,
                                       runs=restore_spacing(runs, texts), pictures=pictures,
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
