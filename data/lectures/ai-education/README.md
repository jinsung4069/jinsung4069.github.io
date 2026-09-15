# AI교육의 이해 / 언플러그드AI교육 HTML 강의자료

Chapter 1과 Chapter 3의 사용자 지정 v3 PPTX를 실제 PowerPoint 재생 순서대로 변환했다. 원본 PPTX 및 이전 버전은 수정하지 않았다. 강의 날짜는 추가하지 않았다.

| 강의 | 슬라이드 | HTML 텍스트 구간 | 원본 이미지 개체 | 원본 SHA256 |
| --- | --- | --- | --- | --- |
| Chapter 1 | 37 | 261 | 30 | 1505afce7384ee519a786659a2bac118aba6282cb8fccd326bb9970894925ccb |
| Chapter 3 | 46 | 318 | 30 | d7c0fd23b2acf43155c9eb1651c9635e0a60ec1198dc0e9362271c4ac481bea1 |

## 변환 방식

일반 텍스트, 표와 개별 텍스트 상자는 HTML 텍스트로 표시한다. PowerPoint의 줄바꿈, 좌표, 색상과 글자 크기를 유지한다. 표는 셀 좌표를 반영했다. 원문 사진과 도표 이미지는 PPTX에서 직접 추출하며 이미지 바이트의 동일성을 확인했다. 배경, 그림 글머리표, 복잡한 그룹 도식은 PowerPoint에서 렌더한 무손실 WebP로 보존한다. 그룹 도식 내부의 글자는 해당 이미지에 포함되며 개별 HTML 텍스트는 아니다. 전체 원문 텍스트는 검색과 접근성을 위해 데이터에도 보존한다.

발표자 노트는 웹 데이터와 화면에서 제외한다. 교재와 외부 자료의 출처를 유지하며, 기존 강의자료를 지칭하는 출처 표기는 제외한다. 과거 자료의 사례를 현재 사실로 갱신하지 않았다.

기존 사이트의 글래스모피즘 도구 버튼, 방향키와 A/D 이동, F 전체 화면, 목차 검색, 페이지 이동, 확대, 인쇄 및 모바일 밀기 탐색 방식을 적용했다. 추가 웹폰트는 기존 Freesentation OFL 라이선스를 따른다.

## 검증

83장 전체 브라우저 렌더링, 원문 텍스트 대응, 이미지 로딩, 글자 화면 경계, 슬라이드 순서, 목차 검색, 키보드 이동, 전체 화면, 모바일 탐색 및 확대를 확인했다. PowerPoint 출력과 HTML 화면을 비교했다. 원본 파일의 해시와 직접 추출 이미지의 바이트 동일성을 재확인했다.

## 2026-09-15 v3 갱신

마스터 v1.12와 사용자가 전달한 v3를 기준으로 본문 문체, 예시 표기와 하단 원본 이미지를 갱신했다. 새로 추가된 이미지 개체는 40개이며 기존 20개를 포함해 총 60개다. 본문은 v3의 원문을 사용하며, 출처에서는 기존 강의자료 인용을 제외했다. 원본 PPTX와 마스터는 수정하지 않았다.

v2 게시 기록은 커밋 4489a58에 보존되어 있다. v2 원본 SHA256은 Chapter 1 e43b9b88b685355c1396e443f30d2d0b11966a48efe8e73d1526baaf68589b22, Chapter 3 1db1512705b0d6f64e1f114229d6e6b1b0dd87d8433307d5e411e4223cb81f20이다.

## 슬라이드 대응

| 강의 | 페이지 | 제목 | PPTX 내부 원본 |
| --- | --- | --- | --- |
| 1 | 1 | Chapter 1 인공지능 사회 | ppt/slides/slide1.xml |
| 1 | 2 | 학습 목표 | ppt/slides/slide2.xml |
| 1 | 3 | AI에 대한 첫 생각 | ppt/slides/slide3.xml |
| 1 | 4 | 01 사회 변화와 AI | ppt/slides/slide4.xml |
| 1 | 5 | 제4차산업혁명과 인공지능 | ppt/slides/slide5.xml |
| 1 | 6 | 데이터가 서비스로 이어지는 과정 | ppt/slides/slide6.xml |
| 1 | 7 | 자동화와 AI의 관계 | ppt/slides/slide7.xml |
| 1 | 8 | 연결과 지능화가 만드는 변화 | ppt/slides/slide8.xml |
| 1 | 9 | 공유 서비스와 접근의 변화 | ppt/slides/slide9.xml |
| 1 | 10 | 생산성 향상과 사람의 업무 | ppt/slides/slide10.xml |
| 1 | 11 | 미래의 음식점 | ppt/slides/slide11.xml |
| 1 | 12 | 직업을 과업으로 나누어 보기 | ppt/slides/slide12.xml |
| 1 | 13 | 직무의 대체와 보완 | ppt/slides/slide13.xml |
| 1 | 14 | 인공지능에 대한 기대, 2018년 자료 | ppt/slides/slide14.xml |
| 1 | 15 | 인공지능에 대한 우려, 2018년 자료 | ppt/slides/slide15.xml |
| 1 | 16 | 혜택과 위험의 조건 | ppt/slides/slide16.xml |
| 1 | 17 | 02 생활 속 인공지능 | ppt/slides/slide17.xml |
| 1 | 18 | 스포츠 판정을 지원하는 AI | ppt/slides/slide18.xml |
| 1 | 19 | 추천이 관심을 추정하는 방법 | ppt/slides/slide19.xml |
| 1 | 20 | 생성형 AI의 결과와 사실 | ppt/slides/slide20.xml |
| 1 | 21 | 생성 응답 검토 예시 | ppt/slides/slide21.xml |
| 1 | 22 | 교육에서의 맞춤 지원 | ppt/slides/slide22.xml |
| 1 | 23 | 03 개념과 발전 과정 | ppt/slides/slide23.xml |
| 1 | 24 | 인공지능의 개념 | ppt/slides/slide24.xml |
| 1 | 25 | 학습과 인식의 의미 | ppt/slides/slide25.xml |
| 1 | 26 | 초기 연구와 규칙 기반 접근 | ppt/slides/slide26.xml |
| 1 | 27 | 데이터 학습으로 넓어진 접근 | ppt/slides/slide27.xml |
| 1 | 28 | 발전의 조건과 기대의 한계 | ppt/slides/slide28.xml |
| 1 | 29 | 04 학교와 사람의 판단 | ppt/slides/slide29.xml |
| 1 | 30 | 학교에서 필요한 학습 | ppt/slides/slide30.xml |
| 1 | 31 | 교사의 판단과 학습 증거 | ppt/slides/slide31.xml |
| 1 | 32 | 인공지능 시대 대응 방안, 개인 | ppt/slides/slide32.xml |
| 1 | 33 | 인공지능 시대 대응 방안, 단체 | ppt/slides/slide33.xml |
| 1 | 34 | 선택 활동, 추천 서비스의 영향 | ppt/slides/slide34.xml |
| 1 | 35 | 활동 해설, 판단의 근거 | ppt/slides/slide35.xml |
| 1 | 36 | 형성평가 | ppt/slides/slide36.xml |
| 1 | 37 | 처음의 생각을 다시 살펴보기 | ppt/slides/slide37.xml |
| 3 | 1 | Chapter 3 인공지능 교육의 이해 | ppt/slides/slide1.xml |
| 3 | 2 | 학습 목표 | ppt/slides/slide2.xml |
| 3 | 3 | 같은 번역 도구를 쓰는 두 활동 | ppt/slides/slide3.xml |
| 3 | 4 | 01 AI 교육의 필요성 | ppt/slides/slide4.xml |
| 3 | 5 | AI 교육이 필요한 이유 | ppt/slides/slide5.xml |
| 3 | 6 | 교육을 지원하는 AI의 역할 | ppt/slides/slide6.xml |
| 3 | 7 | AI 활용 교육의 개요 | ppt/slides/slide39.xml |
| 3 | 8 | AI 활용 교육의 유형 | ppt/slides/slide40.xml |
| 3 | 9 | 교육 주체별 AI 활용 교육의 유형 | ppt/slides/slide41.xml |
| 3 | 10 | 02 AI 교육의 관점 | ppt/slides/slide7.xml |
| 3 | 11 | AI 교육의 세 가지 유형 | ppt/slides/slide8.xml |
| 3 | 12 | 내용으로서의 AI와 도구로서의 AI | ppt/slides/slide9.xml |
| 3 | 13 | AI에 관한 교육과 AI를 활용한 교육 | ppt/slides/slide10.xml |
| 3 | 14 | 두 관점과 세 유형의 관계 | ppt/slides/slide11.xml |
| 3 | 15 | 인공지능 교육과 관련된 다양한 용어 | ppt/slides/slide42.xml |
| 3 | 16 | AI에 관한 교육의 학습 증거 | ppt/slides/slide12.xml |
| 3 | 17 | AI를 활용한 교육의 학습 증거 | ppt/slides/slide13.xml |
| 3 | 18 | AI 교과 활용 교육 | ppt/slides/slide43.xml |
| 3 | 19 | 학습 목표 지원 모형 | ppt/slides/slide44.xml |
| 3 | 20 | 도구 이름보다 학습 목표 | ppt/slides/slide14.xml |
| 3 | 21 | 학습자의 사고가 남는 활동 | ppt/slides/slide15.xml |
| 3 | 22 | 가치교육을 활동에 연결하기 | ppt/slides/slide16.xml |
| 3 | 23 | 03 동향과 교육과정 | ppt/slides/slide17.xml |
| 3 | 24 | 국내외 동향을 읽는 기준 | ppt/slides/slide18.xml |
| 3 | 25 | 국가별 AI 교육 접근 | ppt/slides/slide19.xml |
| 3 | 26 | AI4K12의 다섯 가지 핵심 영역 | ppt/slides/slide20.xml |
| 3 | 27 | 2022 개정 교육과정의 연결 | ppt/slides/slide21.xml |
| 3 | 28 | 실과에서 AI 교육으로 연결하기 | ppt/slides/slide22.xml |
| 3 | 29 | 정보 교과의 역량과 AI 소양 | ppt/slides/slide23.xml |
| 3 | 30 | 목표, 활동과 평가의 연결 | ppt/slides/slide24.xml |
| 3 | 31 | 과정과 성장을 확인하는 평가 | ppt/slides/slide25.xml |
| 3 | 32 | 04 사례 분석과 재설계 | ppt/slides/slide26.xml |
| 3 | 33 | 음악 교과 AI 융합 교육 예시 | ppt/slides/slide45.xml |
| 3 | 34 | 수학 교과 AI 융합 교육 예시 | ppt/slides/slide46.xml |
| 3 | 35 | 선택 활동, 사례 판단 기준 | ppt/slides/slide27.xml |
| 3 | 36 | 사례 A, 분류 오류의 원인 | ppt/slides/slide28.xml |
| 3 | 37 | 사례 B, 글의 주장과 근거 | ppt/slides/slide29.xml |
| 3 | 38 | 사례 C, 번역과 언어의 맥락 | ppt/slides/slide30.xml |
| 3 | 39 | 사례 D, 생성 결과 제출 | ppt/slides/slide31.xml |
| 3 | 40 | 사례 해설과 판단 근거 | ppt/slides/slide32.xml |
| 3 | 41 | 같은 사례를 다른 관점으로 바꾸기 | ppt/slides/slide33.xml |
| 3 | 42 | 05 AI 교육 역량과 성찰 | ppt/slides/slide34.xml |
| 3 | 43 | AI 교육에서 필요한 역량 | ppt/slides/slide35.xml |
| 3 | 44 | 역량을 보여주는 수행 | ppt/slides/slide36.xml |
| 3 | 45 | 형성평가 | ppt/slides/slide37.xml |
| 3 | 46 | 과제와 정리 | ppt/slides/slide38.xml |

## 학생 체험 페이지

기존 83장 본문, 그림과 순서를 유지하고 별도 HTML 활동 7장을 삽입했다. Chapter 1은 원본 7, 13, 19, 21쪽 뒤에 4장, Chapter 3은 원본 14, 30, 39쪽 뒤에 3장을 넣었다. 웹에서는 각각 41장과 49장이다. 활동은 학습용 예시이며 원본 PPTX의 일부가 아니다. 추천 점수는 명시된 단순 가중합을 사용하는 체험용 수치다. 선택형 활동은 응답 후 판단 근거를 표시한다. 웹의 발표자 노트 데이터와 참고 버튼은 삭제했으며 원본 PPTX는 수정하지 않았다.

2026-09-15 출처 정리: 기존 강의 제목과 연결된 2024년 사례 표기를 삭제했다. 교재와 함께 적힌 출처는 교재명만 남겼다. 조사 연도를 설명하는 본문, 그림에 포함된 외부 출처와 원본 PPTX는 수정하지 않았다.
