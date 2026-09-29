# 인공지능 윤리 HTML 교안, 2026-09-29 v4

## 원본과 구성

원본은 `Chapter5_인공지능윤리_강의교안_v4.pptx` 64장이다. SHA256은 `0cc1198da3ea56327cce32d415a20a2acec8e3fd5e717c354213840824fe78a2`이며 변환 전후 동일하다. v4는 v3의 33장 뒤에 소단원 생성형 AI와 연구윤리 13장(34~46)을 넣고 학습 목표에 한 줄을 더한 판이다. 내용은 한국연구재단(2026), 대학 연구자를 위한 생성형 AI 연구윤리 가이드를 요약, 재구성했으며 가이드의 그림은 쓰지 않았다. v3은 v2의 제목 개체 서식을 강의자료_서식.pptx의 상속값(가운데 세로 정렬, 기본 여백)으로 되돌린 판이다. v1 원본(`899200554bf8...`)과 v1 HTML 초안은 게시하지 않았다.

v1 대비 변경 사항은 다음과 같다.

- 실습 도구를 Teachable Machine에서 Colab 노트북으로 바꾸었다. 노트북은 `data/lectures/ai-education-ch5-bias-lab.ipynb`이며 빈칸 다섯 곳을 채워 실행한다.
- 인공지능 기본법(제2조, 제31조, 제33조부터 제35조), 사회적 편향 사례(채용 도구, Gender Shades), 생성형 AI와 허위정보, 딥페이크와 학교의 대응을 추가했다.
- 개인정보 유형 이미지를 편집 가능한 표 네 장으로 다시 구성했다.

원본 64장 사이에 체험 6장을 넣어 70장으로 구성했다. 아래 표의 원본 번호는 v3 기준이며 v4에서는 36, 43, 47, 50이 각각 49, 56, 60, 63이다.

| 원본 뒤 | 체험 |
| --- | --- |
| 10 | 이해관계자별 이익, 부담과 대안 기록 |
| 14 | 조건별 표본 수, 정답 수와 가중 전체 정확도 |
| 36 | Colab 실습 기록, 예상과 이유를 적은 뒤 노트북 링크와 결과 기록란 공개 |
| 43 | 보류 기준 자유 탐색, 설명용 예시 40장 |
| 47 | 데이터와 모델의 활용 검토 기록 |
| 50 | 판단 선택 후 근거를 확인하는 형성평가 5문항 |

## 변환 방식

Linux 환경에서 `scripts/sync_ai_education_chapter5_linux.py`로 변환했다. LibreOffice와 Freesentation 글꼴로 PDF를 만든 뒤 PyMuPDF로 글자 위치를 읽는다. 배경은 글자를 완전히 투명하게 만들고 최상위 그림을 뺀 사본을 렌더링한 무손실 WebP이다. 세로 글자는 배경에 남긴다. LibreOffice가 한글과 영문 사이에 넓힌 간격이 PDF에서 공백으로 추출되므로, PPTX 원문에 없는 공백은 제거한다. 같은 이유로 PDF의 글자 폭은 실제보다 넓으므로, 글자 구간의 폭은 Freesentation 글꼴의 실제 글자 너비로 다시 계산한다. 뷰어의 가로 맞춤 배율(scaleX)은 전체 구간에서 약 0.97부터 1.05 사이이다. 그림 5개(윤리기준, 미드저니 수상작, QR, 정확도 그래프, 혼동행렬)는 PPTX의 이미지 바이트를 그대로 사용한다. 기존 Windows 변환기(`sync_ai_education_chapter5.py`)는 v1 기준으로 보존한다.

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
