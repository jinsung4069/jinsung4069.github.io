window.WEEK4 = {
  "chapters": [
    "오늘의 수업",
    "머신러닝 알고리즘",
    "Orange3 시작하기",
    "붓꽃 분류 실습",
    "결과 비교와 정리"
  ],
  "slides": [
    {
      "ch": 0,
      "title": "머신러닝 알고리즘과\nOrange3 첫 실습",
      "type": "cover",
      "sub": "4주차 AI알고리즘"
    },
    {
      "ch": 0,
      "title": "오늘의 학습 목표",
      "lead": "꽃의 길이와 너비만으로 품종을 구분할 수 있을까요?",
      "steps": [
        "분류, 회귀, 군집화 구분",
        "대표 알고리즘의 원리 이해",
        "Orange3 설치와 위젯 연결",
        "붓꽃 분류와 결과 해석"
      ]
    },
    {
      "ch": 0,
      "title": "데이터에서 예측까지",
      "table": {
        "heads": [
          "요소",
          "붓꽃 실습에서의 의미"
        ],
        "rows": [
          [
            "입력 특징 X",
            "꽃받침과 꽃잎의 길이, 너비"
          ],
          [
            "정답 y",
            "Setosa, Versicolor, Virginica 중 하나"
          ],
          [
            "학습 알고리즘",
            "특징과 정답의 관계를 찾는 방법"
          ],
          [
            "학습된 모델",
            "새 꽃의 특징을 받아 품종을 예측하는 결과물"
          ]
        ]
      }
    },
    {
      "ch": 1,
      "title": "머신러닝 알고리즘",
      "type": "section"
    },
    {
      "ch": 1,
      "title": "분류, 회귀, 군집화",
      "table": {
        "heads": [
          "작업",
          "답의 형태",
          "예시"
        ],
        "rows": [
          [
            "분류, 지도학습",
            "범주",
            "꽃의 품종, 스팸 여부"
          ],
          [
            "회귀, 지도학습",
            "연속적인 수치",
            "자전거 대여량, 주택 가격"
          ],
          [
            "군집화, 비지도학습",
            "유사한 사례의 묶음",
            "구매 행동이 비슷한 고객 그룹"
          ]
        ]
      }
    },
    {
      "ch": 1,
      "title": "문제에 맞는 학습 작업",
      "lead": "예측하려는 답과 정답 자료의 유무를 먼저 확인하세요.",
      "lab": "tasks"
    },
    {
      "ch": 1,
      "title": "대표 알고리즘 한눈에 보기",
      "table": {
        "heads": [
          "알고리즘",
          "핵심 아이디어",
          "대표 작업"
        ],
        "rows": [
          [
            "의사결정나무",
            "질문을 순서대로 나누어 판단",
            "분류, 회귀"
          ],
          [
            "kNN",
            "가까운 이웃의 답을 참고",
            "분류, 회귀"
          ],
          [
            "선형 회귀",
            "수치 사이의 선형 관계를 학습",
            "회귀"
          ],
          [
            "로지스틱 회귀, SVM",
            "확률 또는 결정 경계로 구분",
            "주로 분류"
          ],
          [
            "랜덤 포레스트",
            "여러 나무의 예측을 결합",
            "분류, 회귀"
          ],
          [
            "k 평균 군집화",
            "가까운 중심점을 기준으로 묶음",
            "군집화"
          ]
        ]
      }
    },
    {
      "ch": 1,
      "title": "의사결정나무, 질문을 나누는 방법",
      "paragraphs": [
        "특징과 기준값으로 질문을 만들고, 정답이 비슷한 사례끼리 나누는 과정을 반복합니다. 마지막 잎에 모인 정답으로 예측합니다."
      ],
      "html": "<figure class=\"example-tree\"><figcaption>붓꽃 분류 질문 예시</figcaption><div class=\"tree-root\">꽃잎 길이가 2.5 cm 이하인가?</div><div class=\"tree-branches\"><div><span>예</span><strong>Setosa</strong></div><div><span>아니요</span><strong>다음 특징으로 다시 질문</strong></div></div></figure>"
    },
    {
      "ch": 1,
      "title": "분류 기준을 직접 바꾸기",
      "lead": "꽃잎 길이를 기준으로 Setosa와 나머지 품종을 나눠 봅니다.",
      "lab": "threshold"
    },
    {
      "ch": 1,
      "title": "kNN, 가까운 이웃의 답",
      "visuals": [
        {
          "src": "/images/lectures/week4/knn-question.png",
          "alt": "kNN의 새 사례와 주변 이웃",
          "caption": "kNN의 새 사례와 주변 이웃",
          "credit": ""
        }
      ],
      "visualLayout": "split",
      "paragraphs": [
        "새 사례와 기존 사례 사이의 거리를 계산합니다.",
        "가장 가까운 k개의 사례를 고른 뒤, 분류에서는 가장 많은 정답을 선택합니다.",
        "거리의 크기는 특징의 단위와 스케일에 영향을 받습니다."
      ]
    },
    {
      "ch": 1,
      "title": "k에 따라 달라지는 판단",
      "visuals": [
        {
          "src": "/images/lectures/week4/knn-neighbors.png",
          "alt": "이웃 수 k에 따른 판단 범위",
          "caption": "이웃 수 k에 따른 판단 범위",
          "credit": ""
        }
      ],
      "visualLayout": "split",
      "paragraphs": [
        "k=1이면 가장 가까운 한 사례가 답을 결정합니다.",
        "k를 늘리면 더 넓은 주변을 참고합니다. 너무 크면 서로 다른 집단이 섞일 수 있습니다.",
        "좋은 k는 검증 결과를 비교하여 선택합니다. 항상 작은 값이 좋은 것은 아닙니다."
      ]
    },
    {
      "ch": 1,
      "title": "가까운 이웃으로 예측하기",
      "lead": "점의 위치와 k를 바꾸면 예측이 어떻게 달라질까요?",
      "lab": "neighbors"
    },
    {
      "ch": 1,
      "title": "선형 회귀와 로지스틱 회귀",
      "visualLayout": "wide",
      "visuals": [
        {
          "src": "/images/lectures/week4/regression-comparison.jpg",
          "alt": "수치의 선형 관계와 범주에 속할 확률",
          "caption": "수치의 선형 관계와 범주에 속할 확률"
        }
      ],
      "paragraphs": [
        "선형 회귀는 수치 사이의 선형 관계를 학습해 연속적인 값을 예측합니다.",
        "로지스틱 회귀는 범주에 속할 확률을 추정해 분류합니다. 이진 분류의 확률은 0과 1 사이입니다."
      ]
    },
    {
      "ch": 1,
      "title": "SVM과 랜덤 포레스트",
      "visualLayout": "gallery",
      "visuals": [
        {
          "src": "/images/lectures/week4/svm-margin.png",
          "alt": "SVM, 범주 사이의 여유를 확보하는 경계",
          "caption": "SVM, 범주 사이의 여유를 확보하는 경계"
        },
        {
          "src": "/images/lectures/week4/ensemble-vote.png",
          "alt": "여러 분류기의 예측을 결합하는 앙상블",
          "caption": "여러 분류기의 예측을 결합하는 앙상블"
        }
      ],
      "paragraphs": [
        "SVM은 범주를 나누는 경계를 학습하며, 커널을 사용하면 비선형 관계도 다룹니다.",
        "랜덤 포레스트는 복원 추출한 자료와 분기마다 선택한 특징 후보로 여러 나무를 학습하고, 분류 결과를 투표로 결합합니다."
      ]
    },
    {
      "ch": 1,
      "title": "k 평균 군집화",
      "visuals": [
        {
          "src": "/images/lectures/week4/cluster-start.png",
          "alt": "처음 정한 중심점",
          "caption": "처음 정한 중심점",
          "credit": ""
        },
        {
          "src": "/images/lectures/week4/cluster-centers.png",
          "alt": "묶인 점들의 좌표 평균으로 중심 이동",
          "caption": "묶인 점들의 좌표 평균으로 중심 이동",
          "credit": ""
        }
      ],
      "visualLayout": "gallery",
      "paragraphs": [
        "k는 만들 군집의 수입니다. 각 점을 가까운 중심점에 배정하고, 묶인 점들의 좌표 평균으로 중심을 옮기는 과정을 반복합니다.",
        "품종 정답을 사용하지 않고 거리로 묶으므로, 군집과 실제 품종은 서로 다를 수 있습니다."
      ]
    },
    {
      "ch": 1,
      "title": "알고리즘 선택의 기준",
      "table": {
        "heads": [
          "먼저 볼 것",
          "판단 질문"
        ],
        "rows": [
          [
            "문제",
            "범주, 수치, 묶음 중 무엇이 필요한가?"
          ],
          [
            "자료",
            "정답이 있는가? 데이터와 특징은 얼마나 많은가?"
          ],
          [
            "해석",
            "왜 이렇게 판단했는지 설명해야 하는가?"
          ],
          [
            "검증",
            "같은 평가 조건에서 얼마나 잘 작동하는가?"
          ]
        ]
      }
    },
    {
      "ch": 2,
      "title": "Orange3 시작하기",
      "type": "section"
    },
    {
      "ch": 2,
      "title": "Orange3는 어떤 도구인가",
      "visuals": [
        {
          "src": "/images/lectures/week4/orange-canvas.png",
          "alt": "Orange3의 위젯 목록과 작업 공간",
          "caption": "Orange3의 위젯 목록과 작업 공간",
          "credit": "김현철 외, 『오렌지3 with 파이썬』, 생능북스"
        }
      ],
      "visualLayout": "split",
      "paragraphs": [
        "데이터 불러오기, 시각화, 학습, 평가 기능을 위젯으로 제공합니다.",
        "위젯을 선으로 연결하면 앞 단계의 결과가 다음 단계로 전달됩니다.",
        "작업 흐름은 .ows 파일로 저장합니다."
      ],
      "source": {
        "url": "https://orangedatamining.com/",
        "label": "Orange Data Mining"
      }
    },
    {
      "ch": 2,
      "title": "운영체제에 맞는 설치 파일",
      "table": {
        "heads": [
          "환경",
          "공식 다운로드에서 선택"
        ],
        "rows": [
          [
            "Windows",
            "Standalone installer, 기본 설치 프로그램"
          ],
          [
            "Windows, 설치가 어려운 경우",
            "Portable Orange, 압축을 풀어 실행"
          ],
          [
            "Mac, Apple 칩",
            "Orange for Apple silicon"
          ],
          [
            "Mac, Intel 프로세서",
            "Orange for Intel"
          ]
        ]
      },
      "html": "<div class=\"resource-links\"><a href=\"https://orangedatamining.com/download/\" target=\"_blank\" rel=\"noopener\">Orange3 공식 다운로드</a></div>",
      "source": {
        "url": "https://orangedatamining.com/download/",
        "label": "Orange 공식 설치 안내"
      },
      "paragraphs": [
        "Mac은 “이 Mac에 관하여”에서 칩을 확인한 뒤 설치 파일을 선택합니다."
      ]
    },
    {
      "ch": 2,
      "title": "설치와 첫 실행",
      "visuals": [
        {
          "src": "/images/lectures/week4/orange-welcome.png",
          "alt": "Orange3 시작 화면",
          "caption": "Orange3 시작 화면",
          "credit": ""
        }
      ],
      "visualLayout": "split",
      "paragraphs": [
        "Windows는 내려받은 설치 프로그램을 실행하고 안내에 따라 설치합니다. Portable은 압축을 푼 폴더에서 실행합니다.",
        "Mac은 칩에 맞는 dmg를 열어 앱을 설치하고 실행합니다.",
        "Orange를 연 뒤 New를 선택합니다."
      ],
      "source": {
        "url": "https://orangedatamining.com/download/",
        "label": "Orange 공식 설치 안내"
      }
    },
    {
      "ch": 2,
      "title": "실습 준비 확인",
      "lead": "설치가 끝나면 실제 Orange 화면에서 하나씩 확인하세요.",
      "lab": "setup"
    },
    {
      "ch": 2,
      "title": "위젯을 놓고 연결하기",
      "steps": [
        "검색하거나 목록에서 File 찾기",
        "File을 작업 공간에 놓기",
        "Data Table을 추가하기",
        "File의 오른쪽 연결점을 Data Table의 왼쪽으로 잇기"
      ],
      "paragraphs": [
        "위젯을 두 번 클릭하면 설정 창이 열립니다."
      ]
    },
    {
      "ch": 2,
      "title": "이번 실습에서 사용할 위젯",
      "table": {
        "heads": [
          "위젯",
          "역할"
        ],
        "rows": [
          [
            "File / Data Table",
            "데이터 불러오기 / 표로 확인"
          ],
          [
            "Scatter Plot",
            "특징 두 개를 축으로 시각화"
          ],
          [
            "Tree / Tree Viewer",
            "나무 학습 / 판단 구조 확인"
          ],
          [
            "kNN",
            "가까운 이웃으로 학습과 예측"
          ],
          [
            "Test & Score",
            "같은 조건으로 알고리즘 평가"
          ],
          [
            "Confusion Matrix",
            "어떤 품종끼리 혼동했는지 확인"
          ]
        ]
      }
    },
    {
      "ch": 2,
      "title": "위젯 연결 연습",
      "lead": "각 연결의 도착 위젯을 골라 분석 흐름을 완성하세요.",
      "lab": "wiring"
    },
    {
      "ch": 3,
      "title": "붓꽃 분류 실습",
      "type": "section"
    },
    {
      "ch": 3,
      "title": "꽃의 측정값으로 품종 구분하기",
      "visuals": [
        {
          "src": "/images/lectures/week4/iris-flowers.png",
          "alt": "Versicolor, Setosa, Virginica",
          "caption": "Versicolor, Setosa, Virginica",
          "credit": "김현철 외, 『오렌지3 with 파이썬』, 생능북스"
        }
      ],
      "visualLayout": "wide",
      "paragraphs": [
        "붓꽃 150개, 품종 3개, 수치 특징 4개를 사용합니다. 각 품종은 50개씩 있습니다.",
        "이 실습의 입력은 사진이 아니라 꽃받침과 꽃잎을 측정한 값입니다."
      ],
      "source": {
        "url": "https://archive.ics.uci.edu/dataset/53/iris",
        "label": "UCI Iris 데이터"
      }
    },
    {
      "ch": 3,
      "title": "1. File에서 Iris 불러오기",
      "paragraphs": [
        "File을 두 번 클릭하고 기본 예제 목록에서 iris를 선택합니다. 목록에 없으면 아래 파일을 내려받아 엽니다.",
        "150개 행, 수치 특징 4개, Target iris 하나인지 확인합니다."
      ],
      "html": "<div class=\"resource-links\"><a href=\"/data/lectures/week4-iris.tab\" download=\"iris.tab\">iris.tab 다운로드</a></div><p class=\"data-preview-label\">불러올 데이터의 첫 3행</p>",
      "source": {
        "url": "https://orangedatamining.com/widget-catalog/data/file/",
        "label": "Orange File 안내"
      },
      "table": {
        "heads": [
          "sepal length",
          "sepal width",
          "petal length",
          "petal width",
          "iris"
        ],
        "rows": [
          [
            "5.1",
            "3.5",
            "1.4",
            "0.2",
            "Iris-setosa"
          ],
          [
            "4.9",
            "3.0",
            "1.4",
            "0.2",
            "Iris-setosa"
          ],
          [
            "4.7",
            "3.2",
            "1.3",
            "0.2",
            "Iris-setosa"
          ]
        ]
      }
    },
    {
      "ch": 3,
      "title": "2. Data Table에서 행과 열 확인",
      "table": {
        "heads": [
          "열 이름",
          "뜻",
          "역할"
        ],
        "rows": [
          [
            "sepal length / sepal width",
            "꽃받침 길이 / 너비, cm",
            "Features"
          ],
          [
            "petal length / petal width",
            "꽃잎 길이 / 너비, cm",
            "Features"
          ],
          [
            "iris",
            "꽃의 품종",
            "Target"
          ]
        ]
      },
      "paragraphs": [
        "File의 Data를 Data Table의 Data에 연결합니다. 한 행은 꽃 한 개이며, iris 열은 맞혀야 할 정답인 Target으로 지정합니다."
      ]
    },
    {
      "ch": 3,
      "title": "3. Scatter Plot으로 관찰",
      "visuals": [
        {
          "src": "/images/lectures/week4/orange-scatter.png",
          "alt": "붓꽃의 꽃잎 길이와 너비",
          "caption": "붓꽃의 꽃잎 길이와 너비",
          "credit": "Orange Data Mining"
        }
      ],
      "visualLayout": "split",
      "paragraphs": [
        "File의 Data를 Scatter Plot의 Data에 연결합니다.",
        "처음에는 X를 petal length, Y를 petal width로 선택합니다. Color는 iris로 설정합니다.",
        "꽃받침 길이와 너비로 축을 바꾸고, 품종이 겹치는 정도를 비교합니다."
      ],
      "source": {
        "url": "https://orangedatamining.com/widget-catalog/visualize/scatterplot/",
        "label": "Orange Scatter Plot 안내"
      }
    },
    {
      "ch": 3,
      "title": "붓꽃 데이터 직접 탐색",
      "lead": "같은 150개 데이터도 어떤 특징을 보느냐에 따라 다르게 보입니다.",
      "lab": "iris",
      "source": {
        "url": "https://github.com/biolab/orange3/blob/master/Orange/datasets/iris.tab",
        "label": "Orange 내장 Iris 데이터"
      }
    },
    {
      "ch": 3,
      "title": "4. Tree로 나무 학습",
      "visuals": [
        {
          "src": "/images/lectures/week4/orange-tree.png",
          "alt": "Tree의 설정 화면",
          "caption": "Tree의 설정 화면",
          "credit": "Orange Data Mining"
        }
      ],
      "visualLayout": "split",
      "paragraphs": [
        "File의 Data를 Tree의 Data에 연결합니다.",
        "기본 설정으로 실행하고 Apply가 보이면 누릅니다.",
        "학습된 Model은 Tree Viewer에, 학습 방법인 Learner는 Test & Score에 연결합니다."
      ],
      "source": {
        "url": "https://orangedatamining.com/widget-catalog/model/tree/",
        "label": "Orange Tree 안내"
      }
    },
    {
      "ch": 3,
      "title": "5. Tree Viewer에서 판단 읽기",
      "visuals": [
        {
          "src": "/images/lectures/week4/orange-treeviewer.png",
          "alt": "Tree Viewer의 질문과 분기",
          "caption": "Tree Viewer의 질문과 분기",
          "credit": "Orange Data Mining"
        }
      ],
      "visualLayout": "split",
      "paragraphs": [
        "Tree의 Model을 Tree Viewer의 Tree 입력에 연결합니다.",
        "맨 위 질문부터 분기를 따라가며, 잎에 모인 품종을 확인합니다.",
        "전체 데이터로 만든 이 나무의 구조를 살펴본 뒤, 다음 단계에서 교차 검증으로 성능을 평가합니다."
      ],
      "source": {
        "url": "https://orangedatamining.com/widget-catalog/visualize/treeviewer/",
        "label": "Orange Tree Viewer 안내"
      }
    },
    {
      "ch": 3,
      "title": "6. Test & Score 연결",
      "table": {
        "heads": [
          "보내는 위젯",
          "출력",
          "받는 위젯과 입력"
        ],
        "rows": [
          [
            "File",
            "Data",
            "Test & Score의 Data"
          ],
          [
            "Tree",
            "Learner",
            "Test & Score의 Learner"
          ],
          [
            "kNN, 비교할 때 추가",
            "Learner",
            "Test & Score의 Learner"
          ],
          [
            "Test & Score",
            "Evaluation Results",
            "Confusion Matrix의 Evaluation Results"
          ]
        ]
      },
      "source": {
        "url": "https://orangedatamining.com/widget-catalog/evaluate/testandscore/",
        "label": "Orange Test & Score 안내"
      },
      "paragraphs": [
        "Test & Score는 연결된 Learner를 사용해 각 훈련 구간에서 모델을 새로 학습합니다."
      ]
    },
    {
      "ch": 3,
      "title": "7. 5겹 교차 검증 설정",
      "visuals": [
        {
          "src": "/images/lectures/week4/orange-score.png",
          "alt": "Test & Score 설정 화면",
          "caption": "Test & Score 설정 화면",
          "credit": "Orange Data Mining"
        }
      ],
      "visualLayout": "split",
      "paragraphs": [
        "Cross validation을 선택하고 Number of folds를 5로 설정합니다.",
        "Stratified를 선택하여 품종 비율을 비슷하게 나눕니다.",
        "CA는 맞힌 비율입니다. 예를 들어 0.90은 90%입니다."
      ],
      "source": {
        "url": "https://orangedatamining.com/widget-catalog/evaluate/testandscore/",
        "label": "Orange 평가 설정 안내"
      }
    },
    {
      "ch": 3,
      "title": "5겹 교차 검증 체험",
      "lead": "한 묶음은 평가하고, 나머지 네 묶음으로 학습합니다.",
      "lab": "folds"
    },
    {
      "ch": 4,
      "title": "평가 결과 읽기",
      "type": "section"
    },
    {
      "ch": 4,
      "title": "8. Confusion Matrix 확인",
      "visuals": [
        {
          "src": "/images/lectures/week4/orange-confusion.png",
          "alt": "혼동행렬, 행은 실제 품종, 열은 예측 품종",
          "caption": "혼동행렬, 행은 실제 품종, 열은 예측 품종",
          "credit": "Orange Data Mining"
        }
      ],
      "visualLayout": "split",
      "paragraphs": [
        "Test & Score를 Confusion Matrix에 연결합니다.",
        "Learners에서 Tree를 선택하고 개수 표시로 확인합니다.",
        "대각선은 정답, 나머지 칸은 혼동입니다. 어느 품종끼리 혼동했는지 찾습니다."
      ],
      "source": {
        "url": "https://orangedatamining.com/widget-catalog/evaluate/confusionmatrix/",
        "label": "Orange Confusion Matrix 안내"
      }
    },
    {
      "ch": 4,
      "title": "혼동행렬 읽기 연습",
      "lead": "전체 점수가 같아도 어떤 종류의 오류인지는 다를 수 있습니다.",
      "lab": "matrix"
    },
    {
      "ch": 4,
      "title": "9. kNN을 추가하여 비교",
      "steps": [
        "kNN을 작업 공간에 추가",
        "이웃 수를 5로 설정",
        "Learner를 같은 Test & Score에 연결",
        "Tree와 kNN의 CA와 오류 비교"
      ],
      "paragraphs": [
        "두 알고리즘을 같은 Test & Score에 연결하여 동일한 분할 조건으로 비교합니다. kNN은 기본 설정에서 수치 특징을 정규화합니다."
      ],
      "source": {
        "url": "https://orangedatamining.com/widget-catalog/model/knn/",
        "label": "Orange kNN 안내"
      }
    },
    {
      "ch": 4,
      "title": "설정 하나를 바꾸어 관찰",
      "compare": [
        [
          "선택 활동 A, kNN",
          "k를 1, 5, 15로 바꿔 점수와 혼동 품종을 비교합니다. 다른 설정은 유지합니다."
        ],
        [
          "선택 활동 B, Tree",
          "최대 깊이를 제한하고 나무 크기와 평가 점수가 어떻게 달라지는지 비교합니다."
        ]
      ],
      "paragraphs": [
        "교차 검증으로 설정을 비교하고, 선택한 모델의 최종 성능은 별도로 남겨 둔 테스트 자료에서 확인합니다."
      ]
    },
    {
      "ch": 4,
      "title": "실습 중 막히는 지점",
      "table": {
        "heads": [
          "증상",
          "확인할 것"
        ],
        "rows": [
          [
            "표나 그림이 비어 있음",
            "File에 데이터를 열었는지, 연결선이 있는지 확인"
          ],
          [
            "품종별 색이 없음",
            "Target과 Color가 iris인지 확인"
          ],
          [
            "Tree Viewer가 비어 있음",
            "File → Tree, Tree의 Model → Tree Viewer 연결 확인"
          ],
          [
            "평가 결과가 없음",
            "File의 Data와 알고리즘의 Learner를 모두 연결"
          ],
          [
            "친구와 점수가 다름",
            "데이터, 특징, 전처리, 분할, 알고리즘 설정 비교"
          ]
        ]
      }
    },
    {
      "ch": 4,
      "title": "실습 결과 기록",
      "lead": "가장 높은 점수뿐 아니라 관찰한 차이와 이유를 남깁니다.",
      "lab": "reflection"
    },
    {
      "ch": 4,
      "title": "워크플로 저장과 제출",
      "steps": [
        "Orange의 File 메뉴에서 Save As 선택",
        "week4_iris.ows로 저장",
        "CA와 혼동행렬을 화면으로 기록",
        "워크플로와 관찰 기록 제출"
      ],
      "paragraphs": [
        "관찰 기록에는 알고리즘과 설정, 평가 방법, CA와 혼동한 품종을 적습니다.",
        "직접 내려받은 iris.tab은 워크플로와 함께 보관하고, .ows 파일을 다시 열어 연결을 확인합니다."
      ]
    },
    {
      "ch": 4,
      "title": "오늘 배운 내용 확인",
      "lead": "다음 상황에서 무엇을 확인해야 할까요?",
      "lab": "review"
    },
    {
      "ch": 4,
      "title": "다음 실습을 위한 자료",
      "html": "<div class=\"resource-links\"><a href=\"https://orangedatamining.com/download/\" target=\"_blank\" rel=\"noopener\">Orange3 다운로드</a><a href=\"https://orangedatamining.com/widget-catalog/\" target=\"_blank\" rel=\"noopener\">공식 위젯 설명</a><a href=\"/data/lectures/week4-iris.tab\" target=\"_blank\" rel=\"noopener\">붓꽃 데이터</a><a href=\"/lectures/ai-algorithm/week3/\" target=\"_blank\" rel=\"noopener\">3주차 개념 다시 보기</a></div>",
      "paragraphs": [
        "분류는 범주, 회귀는 수치, 군집화는 유사한 사례의 묶음을 다룹니다.",
        "Tree와 kNN을 같은 데이터와 평가 조건에서 비교하고, 점수와 오류 사례를 함께 해석합니다."
      ]
    }
  ]
};
