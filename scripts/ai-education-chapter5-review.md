# 인공지능 윤리 HTML 교안, 2026-09-29 v3

## 원본과 구성

원본은 `Chapter5_인공지능윤리_강의교안_v3.pptx` 51장이다. SHA256은 `3888b0aee01db0529e748334ea95e5e19d5358cc9249751be26a3ef4f929c98c`이며 변환 전후 동일하다. v3은 v2의 제목 개체 서식을 강의자료_서식.pptx의 상속값(가운데 세로 정렬, 기본 여백)으로 되돌린 판이다. v1 원본(`899200554bf8...`)과 v1 HTML 초안은 게시하지 않았다.

v1 대비 변경 사항은 다음과 같다.

- 실습 도구를 Teachable Machine에서 Colab 노트북으로 바꾸었다. 노트북은 `data/lectures/ai-education-ch5-bias-lab.ipynb`이며 빈칸 다섯 곳을 채워 실행한다.
- 인공지능 기본법(제2조, 제31조, 제33조부터 제35조), 사회적 편향 사례(채용 도구, Gender Shades), 생성형 AI와 허위정보, 딥페이크와 학교의 대응을 추가했다.
- 개인정보 유형 이미지를 편집 가능한 표 네 장으로 다시 구성했다.

원본 51장 사이에 체험 6장을 넣어 57장으로 구성했다.

| 원본 뒤 | 체험 |
| --- | --- |
| 10 | 이해관계자별 이익, 부담과 대안 기록 |
| 14 | 조건별 표본 수, 정답 수와 가중 전체 정확도 |
| 36 | Colab 실습 기록, 예상과 이유를 적은 뒤 노트북 링크와 결과 기록란 공개 |
| 43 | 보류 기준 자유 탐색, 설명용 예시 40장 |
| 47 | 데이터와 모델의 활용 검토 기록 |
| 50 | 판단 선택 후 근거를 확인하는 형성평가 5문항 |

## 변환 방식

Linux 환경에서 `scripts/sync_ai_education_chapter5_linux.py`로 변환했다. LibreOffice와 Freesentation 글꼴로 PDF를 만든 뒤 PyMuPDF로 글자 위치를 읽는다. 배경은 글자를 완전히 투명하게 만들고 최상위 그림을 뺀 사본을 렌더링한 무손실 WebP이다. 세로 글자는 배경에 남긴다. LibreOffice가 한글과 영문 사이에 넓힌 간격이 PDF에서 공백으로 추출되므로, PPTX 원문에 없는 공백은 제거한다. 그림 5개(윤리기준, 미드저니 수상작, QR, 정확도 그래프, 혼동행렬)는 PPTX의 이미지 바이트를 그대로 사용한다. 기존 Windows 변환기(`sync_ai_education_chapter5.py`)는 v1 기준으로 보존한다.

## 실습 결과의 출처

슬라이드의 실행 결과는 노트북 정답본을 `SEED = 2026`, 빈칸 1은 0.5, 빈칸 5는 0.8로 실행한 값이다. 모델 A는 밝음 94.4%, 어두움 54.7%, 모델 B는 밝음 92.8%, 어두움 73.6%이다. 다섯 번 반복의 표준편차는 1.1%p 이하이다. 어두운 조건은 밝기를 25%로 낮추고 표준편차 0.10의 잡음을 더한 변환이며 실제 교실 사진의 측정값이 아니다.

자료는 scikit-learn `load_digits`(UCI Optical Recognition of Handwritten Digits, CC BY 4.0)이다.

## 확인한 공식 자료

- 인공지능 발전과 신뢰 기반 조성 등에 관한 기본법(법률 제20676호), 제2조 제4호 차목, 제31조, 제33조부터 제35조, 부칙 제1조
- 성폭력범죄의 처벌 등에 관한 특례법 제14조의2
- Google Colaboratory FAQ, https://research.google.com/colaboratory/faq.html
- UCI Machine Learning Repository, https://archive.ics.uci.edu/dataset/80/optical+recognition+of+handwritten+digits
- Buolamwini, J. and Gebru, T. (2018), Gender Shades, PMLR 81

## 검증

`tests/ai-education-chapter5.browser.cjs`로 57장 렌더링, 이미지 로딩, 글자 화면 경계, Colab 기록의 예상 잠금과 계산, 입력 범위 오류, 보류 계산, 기록 내보내기와 새로고침 보존, 단축키, 전체 화면, 390px와 320px 폭, 인쇄 57장, 이전 세 교안의 로드를 확인했다. Linux Chromium에서는 한글 내려받기 파일 이름이 `download`로 표시되는 환경 차이가 있어 해당 한 줄만 제외하고 실행했다. `scripts/check_site.py`의 링크 검사는 오류 없이 통과했다.
