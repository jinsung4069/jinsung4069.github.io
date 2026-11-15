# AI알고리즘 HTML 강의자료

2주차부터 4주차까지는 손으로 작성한 HTML 슬라이드다(`lectures/ai-algorithm/week2` 등). PowerPoint로 만든 강의는 이 폴더의 JSON과 `images/lectures/ai-algorithm/`의 슬라이드 그림으로 게시한다. 원본 파일은 수정하지 않았다.

| 강의 | 주차 | 슬라이드 | 원본 SHA256 |
| --- | --- | --- | --- |
| 지도학습의 이해 및 실습, 의사결정트리 | 11 | 61 | `week11.json`의 `sourceSha256` |

## 변환 방식

`scripts/sync_ai_algorithm_linux.py`가 원본의 작업용 사본을 LibreOffice로 PDF로 바꾸고 각 쪽을 2000 × 1125 WebP로 저장한다. 제목과 본문, 글자 줄의 위치, 크게 볼 그림을 JSON에 담는다. 화면은 컴퓨터과교육2, 특강 및 연수와 같은 뷰어(`js/computer-education2.js`)를 쓴다.

발표자 노트와 숨긴 슬라이드는 게시하지 않는다. 개인 휴대전화 번호가 있으면 변환을 멈춘다. 유튜브 주소와 썸네일이 함께 있는 슬라이드는 썸네일 자리에 재생기를 넣는다.

    python scripts/sync_ai_algorithm_linux.py --source <PPTX> --deck week11 --work-dir <임시 폴더>

새 강의를 추가할 때는 스크립트의 `DECKS`에 한 줄을 넣고 명령을 실행한다. 이어서 `lectures/ai-algorithm/index.html`에 카드를, `sitemap.xml`에 주소를 추가한다.
