"""Convert the reviewed Chapter 4 PPTX without changing the source or older decks."""
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
    (27, 'case-comparison', '사례 비교 기록', '학습 목표, 학생의 판단과 평가 증거를 비교합니다.'),
    (34, 'data-design', '배경 조건과 데이터 수량', '학습, 개발과 최종 평가 자료를 분리하고 비교 조건을 점검합니다.'),
    (39, 'evaluation-log', '사진별 평가 기록', '두 모델에 같은 사진을 사용해 실제 클래스와 예측을 기록합니다.'),
    (41, 'confusion-matrix', '혼동행렬과 재현율 계산', '설명용 수치를 바꾸어 정확도, 클래스별 재현율과 판단 보류를 비교합니다.'),
    (46, 'abstention', '판단 보류 기준 비교', '개발용 계산 예시에서 점수 기준에 따른 오류와 보류율을 비교합니다.'),
    (51, 'report-review', '실험 결과와 수업 설계 기록', '관찰, 대안 설명, 평가의 한계와 학생의 학습 증거를 연결합니다.'),
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
    folder = ROOT/'images/lectures/ai-education/4'
    folder.mkdir(parents=True, exist_ok=True)
    app = win32com.client.DispatchEx('PowerPoint.Application')
    try:
        with ZipFile(source) as z:
            parts = ordered_parts(z)
            assert len(parts) == 55
            pres = app.Presentations.Open(str(copy), ReadOnly=False, Untitled=False, WithWindow=False)
            try:
                data = dict(number=4, title='인공지능 교육 사례', course='AI교육의 이해 / 언플러그드AI교육',
                    width=pres.PageSetup.SlideWidth, height=pres.PageSetup.SlideHeight,
                    sourceVersion='v1', sourceSha256=sha, slides=[])
                for number, part in enumerate(parts, 1):
                    # Preserve source titles; remove only the old visible "explanation" label.
                    cleaner = lambda text: text.replace('형성평가 해설', '형성평가 함께 확인')
                    slide = extract_slide(pres.Slides(number), z, part, number, 4, folder, work, cleaner)
                    slide['pictures'].extend(grouped_picture_hotspots(z, part, folder))
                    slide['title'] = cleaner(slide['title'])
                    if number == 1: slide['title'] = '인공지능 교육 사례'
                    if number == 28: slide['title'] = 'Teachable Machine 분석과 실습'
                    if number in (29, 35): slide['links'] = ['https://teachablemachine.withgoogle.com/train/image']
                    if number in (19, 20): slide['context'] = '원문 사례의 성취기준은 2015 개정 교육과정입니다.'
                    if number in (23, 24): slide['context'] = '원문 자료의 행성 수치는 분류 사례 분석용이며 현재 통계가 아닙니다.'
                    data['slides'].append(slide)
                    for after, lab_id, title, intro in LABS:
                        if after == number:
                            data['slides'].append(dict(kind='lab', lab=lab_id, sourceAfter=after,
                                title=title, text=[title, intro], pictures=[], links=[]))
                    if number % 10 == 0 or number == 55: print(f'Converted {number}/55', flush=True)
            finally:
                pres.Saved = True
                pres.Close()
    finally:
        app.Quit()
    assert hashlib.sha256(source.read_bytes()).hexdigest() == sha
    (ROOT/'data/lectures/ai-education/4.json').write_text(json.dumps(data, ensure_ascii=False, separators=(',', ':'))+'\n', encoding='utf-8')
    print(json.dumps(dict(count=len(data['slides']), originals=55, activities=len(LABS),
        pictures=sum(len(s['pictures']) for s in data['slides']), sourceSha256=sha)))

if __name__ == '__main__': main()
