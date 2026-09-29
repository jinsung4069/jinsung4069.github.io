"""Convert the reviewed Chapter 5 PPTX without changing the source or older decks."""
from pathlib import Path
from zipfile import ZipFile
import argparse, hashlib, json, shutil
from lxml import etree as ET
import win32com.client
from sync_ai_education import ROOT, NS, relationships, ordered_parts, extract_slide

def grouped_picture_hotspots(z, part, folder):
    """Keep grouped content in its rendered background; expose untouched media for zoom."""
    rels = relationships(z, part)
    result = []
    def walk(node, scale=(1, 1), offset=(0, 0), grouped=False):
        for child in node:
            if child.tag == '{'+NS['p']+'}grpSp':
                xf = child.find('p:grpSpPr/a:xfrm', NS)
                if xf is None or xf.get('rot', '0') != '0': continue
                off, ext, co, ce = [xf.find('a:'+key, NS) for key in ('off','ext','chOff','chExt')]
                sx, sy = int(ext.get('cx'))/int(ce.get('cx')), int(ext.get('cy'))/int(ce.get('cy'))
                new_scale = (scale[0]*sx, scale[1]*sy)
                new_offset = (offset[0]+scale[0]*(int(off.get('x'))-sx*int(co.get('x'))), offset[1]+scale[1]*(int(off.get('y'))-sy*int(co.get('y'))))
                walk(child, new_scale, new_offset, True)
            elif grouped and child.tag == '{'+NS['p']+'}pic':
                xf = child.find('p:spPr/a:xfrm', NS)
                blip = child.find('.//a:blip', NS)
                if xf is None or blip is None or xf.get('rot', '0') != '0': continue
                target = rels.get(blip.get('{'+NS['r']+'}embed'))
                if not target or Path(target).suffix.lower() not in ('.png','.jpg','.jpeg','.gif','.bmp'): continue
                raw = z.read(target);asset=folder/(hashlib.sha256(raw).hexdigest()[:16]+Path(target).suffix.lower());asset.write_bytes(raw)
                off,ext=xf.find('a:off', NS),xf.find('a:ext', NS)
                result.append(dict(src='/'+asset.relative_to(ROOT).as_posix(), source=target, zoomOnly=True,
                    x=(offset[0]+scale[0]*int(off.get('x')))/12700, y=(offset[1]+scale[1]*int(off.get('y')))/12700,
                    w=scale[0]*int(ext.get('cx'))/12700, h=scale[1]*int(ext.get('cy'))/12700,
                    crop=dict(l=0,t=0,r=0,b=0)))
    walk(ET.fromstring(z.read(part)).find('p:cSld/p:spTree', NS))
    return result

LABS = [
    (8, 'ethics', '이해관계자별 판단 기록', '기대하는 이익과 부담, 필요한 대안을 비교합니다.'),
    (11, 'accuracy', '전체 정확도에 가려진 차이', '계산 예시의 조건별 표본 수와 정답 수를 바꾸어 봅니다.'),
    (34, 'design', '조명 조건 비교 실험 설계', '예상과 이유를 먼저 기록하고 통제 조건을 확인합니다.'),
    (36, 'log', '사진별 실측 기록', '개발 20장과 최종 40장의 예측과 점수를 구분해 기록합니다.'),
    (40, 'comparison', '두 모델의 조건별 결과', '직접 입력한 평가 기록으로 혼동행렬과 오류를 비교합니다.'),
    (42, 'abstention', '보류 기준과 검토 부담', '개발용 계산 예시에서 처리 범위와 남은 오류를 함께 확인합니다.'),
    (47, 'model-card', '데이터와 모델의 활용 검토', '확인한 근거와 미확인 사항을 구분해 활용안을 작성합니다.'),
    (51, 'quiz', '윤리 판단 확인', '판단을 선택한 뒤 필요한 근거를 확인합니다.'),
]

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--source', required=True, type=Path)
    parser.add_argument('--work-dir', required=True, type=Path)
    args = parser.parse_args()
    source, work = args.source.resolve(), args.work_dir.resolve()
    assert not any(x.lower() in ('onedrive', 'dropbox', 'google drive') for x in work.parts)
    work.mkdir(parents=True, exist_ok=True)
    copy = work/source.name
    assert copy != source
    sha = hashlib.sha256(source.read_bytes()).hexdigest()
    shutil.copy2(source, copy)
    folder = ROOT/'images/lectures/ai-education/5'
    folder.mkdir(parents=True, exist_ok=True)
    app = win32com.client.DispatchEx('PowerPoint.Application')
    try:
        with ZipFile(source) as z:
            parts = ordered_parts(z)
            assert len(parts) == 52
            pres = app.Presentations.Open(str(copy), ReadOnly=False, Untitled=False, WithWindow=False)
            try:
                data = dict(number=5, title='인공지능 윤리', course='AI교육의 이해 / 언플러그드AI교육',
                    width=pres.PageSetup.SlideWidth, height=pres.PageSetup.SlideHeight,
                    sourceVersion='v1', sourceSha256=sha, slides=[])
                for number, part in enumerate(parts, 1):
                    slide = extract_slide(pres.Slides(number), z, part, number, 5, folder, work, lambda text: text)
                    slide['pictures'].extend(grouped_picture_hotspots(z, part, folder))
                    if number == 1: slide['title'] = '인공지능 윤리'
                    if number == 28: slide['title'] = '윤리 감사 실습'
                    if number == 30: slide['links'] = ['https://teachablemachine.withgoogle.com/train/image']
                    data['slides'].append(slide)
                    for after, lab_id, title, intro in LABS:
                        if after == number:
                            data['slides'].append(dict(kind='lab', lab=lab_id, sourceAfter=after,
                                title=title, text=[title, intro], pictures=[], links=[]))
                    if number % 10 == 0 or number == 52: print(f'Converted {number}/52', flush=True)
            finally:
                pres.Saved = True
                pres.Close()
    finally:
        app.Quit()
    assert hashlib.sha256(source.read_bytes()).hexdigest() == sha
    (ROOT/'data/lectures/ai-education/5.json').write_text(json.dumps(data, ensure_ascii=False, separators=(',', ':'))+'\n', encoding='utf-8')
    print(json.dumps(dict(count=len(data['slides']), originals=52, activities=len(LABS),
        pictures=sum(len(s['pictures']) for s in data['slides']), sourceSha256=sha)))

if __name__ == '__main__': main()
