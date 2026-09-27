# AI알고리즘 4주차 제작 기록

공개 경로: `/ai-algorithm-week4/`

## 범위와 구성

사용자가 선택한 범위는 머신러닝 알고리즘의 종류, Orange3 소개와 설치, 간단한 첫 실습이다. 기존 2주차와 3주차는 유지하고 45장, 10개 브라우저 활동으로 새 강의를 추가했다. 기존 표지, 구분 슬라이드, Freesentation 제목 800과 본문 600, 키보드와 터치 이동, 이미지 확대, 인쇄 기능을 따른다. 학년, 학기, 발표자 참고와 과거 강의 재사용 표시는 본문에 추가하지 않았다. 교재와 공식 이미지의 출처는 남겼다.

## 원본 자료 활용

앞선 자료 검토에서 표지, 목차와 관련 본문을 확인했다. 이번 제작에서는 다음 슬라이드의 텍스트와 원본 미디어를 다시 추출하고 그림을 시각적으로 확인했다. 원본 PPTX는 수정하지 않았다.

| 자료 | 확인한 관련 슬라이드 | 반영 |
| --- | --- | --- |
| 『오렌지3 with 파이썬』 2장 | 13, 23, 48 | 화면 구성, 위젯 설명, 붓꽃 사진과 문제 설정. 파이썬 실습을 그대로 복사하지 않고 Orange 연결로 재구성 |
| KERIS 초등 지식역량 기초 B 기계학습 모델 | 22, 32, 37, 38, 39 | 시작 화면, 데이터 관찰, 학습과 평가의 순서. 작은 화면을 한꺼번에 붙이지 않고 공식 위젯 화면과 별도 단계로 재구성 |
| 대학원 머신러닝의 이해 7강 지도학습 알고리즘 | 28, 29, 76, 81 | kNN 도식, 알고리즘 비교. k를 무조건 작게 선택한다는 설명은 사용하지 않음 |
| 대학원 머신러닝의 이해 8강 비지도학습 알고리즘 | 20, 21, 22 | 중심점에 배정하고 좌표 평균으로 중심을 이동하는 설명 |

| 저장한 이미지 | 원본 슬라이드 | 원본 미디어 |
| --- | --- | --- |
| orange-canvas.png | 교재 2장 13 | ppt/media/image13.png |
| iris-flowers.png | 교재 2장 48 | ppt/media/image50.png |
| orange-welcome.png | KERIS B 32 | ppt/media/image41.png |
| knn-question.png | 대학원 7강 28 | ppt/media/image29.png |
| knn-neighbors.png | 대학원 7강 29 | ppt/media/image30.png |
| cluster-start.png | 대학원 8강 21 | ppt/media/image28.png |
| cluster-centers.png | 대학원 8강 22 | ppt/media/image31.png |

## 공식 자료 대조, 2026-09-27

Windows 기본 설치는 Standalone installer, 설치가 어려운 경우 Portable을 안내했다. macOS는 Apple silicon과 Intel을 구분한다. 오래된 관리자 권한 및 별도 Miniconda 설치 단계를 필수 조건으로 사용하지 않았다.

- https://orangedatamining.com/download/
- https://orangedatamining.com/widget-catalog/data/file/
- https://orangedatamining.com/widget-catalog/visualize/scatterplot/
- https://orangedatamining.com/widget-catalog/model/tree/
- https://orangedatamining.com/widget-catalog/visualize/treeviewer/
- https://orangedatamining.com/widget-catalog/evaluate/testandscore/
- https://orangedatamining.com/widget-catalog/evaluate/confusionmatrix/
- https://orangedatamining.com/widget-catalog/model/knn/

공식 위젯 페이지의 이미지 6개를 `images/lectures/week4/orange-{file,scatter,tree,treeviewer,score,confusion}.png`로 저장했다. 해당 화면은 공식 문서의 예시이며 학생의 실제 결과가 아님을 표시했다. File의 예시 데이터는 수업의 Iris와 다를 수 있다.

## 데이터와 활동

`data/lectures/week4-iris.tab`은 Orange 저장소의 `Orange/datasets/iris.tab`을 내려받은 자료다. 150개 행, 수치 특징 4개, 품종 Target 하나를 확인했다. JS 자료는 이 파일에서 변환했다. 탭 구분과 Target 역할을 나타내는 원래 3줄 헤더를 유지한다.

- https://github.com/biolab/orange3/blob/master/Orange/datasets/iris.tab
- Fisher, R. (1936). Iris [Dataset]. UCI Machine Learning Repository. https://doi.org/10.24432/C56C76
- 데이터 출처와 라이선스: https://archive.ics.uci.edu/dataset/53/iris, CC BY 4.0

임계값 활동의 일치율은 전체 자료를 관찰하는 값이며 독립 테스트 성능이 아니다. kNN 좌표와 혼동행렬은 수업용 예시라고 표시했다. 혼동행렬의 정답은 (48+44+46)/150=92%이다. 실제 Orange 점수는 학생이 실행한 결과를 기록한다. kNN의 기본 정규화는 공식 문서로 대조했다. 전체 데이터로 만든 Tree Viewer와 교차 검증 중 학습되는 모델의 차이도 설명했다.

활동: 학습 작업 구분, 분류 기준 변경, kNN 이웃 비교, 설치 확인, 위젯 연결, Iris 산점도, 5겹 교차 검증, 혼동행렬, 결과 기록, 복습 퀴즈. 체크리스트와 기록은 브라우저 로컬 저장만 사용하고 서버로 전송하지 않는다.

## 확인

`tests/ai-week4.browser.cjs`에서 45장과 10개 활동, 150개 데이터, 계산 결과, 입력 중 단축키 충돌 방지, A/D와 방향키, F 전체화면, 검색, 페이지 이동, 이미지 확대, 기록 보존과 다운로드, 390px 및 320px 화면, 터치 이동, 45쪽 인쇄 준비를 검사한다. 생성한 모든 슬라이드의 화면을 검토했다. Orange 설치 파일이나 프로그램을 실제 설치하여 실행한 검증은 포함하지 않는다.
