# 특강 및 연수 HTML 강의자료

교원 연수와 특강에서 쓴 PPTX를 웹 슬라이드로 옮겼다. 원본 파일은 수정하지 않았다.

| 강의 | 행사 | 슬라이드 | 원본 SHA256 |
| --- | --- | --- | --- |
| AI부터 에이전트까지, 교육은 어떻게 나아가는가 | 2026 AI미래교육박람회 교원 연수 | 47 | 아래 JSON의 `sourceSha256` |

## 변환 방식

`scripts/sync_special.py`가 원본의 작업용 사본을 PowerPoint로 열어 각 슬라이드를 2000 × 1125 WebP로 내보내고, 본문과 제목을 JSON에 담는다. 화면은 컴퓨터과교육2, 마이크로디그리 과정1과 같은 뷰어(`js/computer-education2.js`)를 쓴다.

개인 휴대전화 번호는 작업용 사본에서 지운 뒤 내보낸다. 연구실 전화번호와 이메일은 남긴다. 숨긴 슬라이드와 발표자 노트는 게시하지 않는다. 표지의 행사명과 날짜는 그대로 둔다.

이어서 `scripts/sync_slide_layers.py --course special`이 슬라이드 위에 투명한 글자 줄과 그림 영역을 겹친다. 본문을 끌어서 복사할 수 있고 그림을 누르면 크게 볼 수 있다.

    python scripts/sync_special.py --source-dir <PPTX 폴더> --work-dir <임시 폴더>
    python scripts/sync_slide_layers.py --course special --source-dir <PPTX 폴더> --work-dir <임시 폴더>

새 강의를 추가할 때는 `sync_special.py`의 `DECKS`에 한 줄을 넣고 두 명령을 다시 실행한다.
