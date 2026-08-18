(function () {
    'use strict';

    const SVG_NS = 'http://www.w3.org/2000/svg';
    const CATEGORY_DATASETS = {
        supervised: [
            { value: 'moons', ko: '두 개의 달', en: 'Two moons' },
            { value: 'circles', ko: '동심원', en: 'Concentric circles' },
            { value: 'linear', ko: '선형 분리', en: 'Linear separation' }
        ],
        unsupervised: [
            { value: 'blobs', ko: '세 개의 군집', en: 'Three blobs' },
            { value: 'density', ko: '밀도가 다른 군집', en: 'Mixed densities' },
            { value: 'rings', ko: '세 개의 고리', en: 'Three rings' }
        ]
    };

    const WIDGETS = {
        neuralNetwork: {
            category: 'supervised',
            icon: 'brain-circuit',
            name: { ko: '뉴럴 네트워크', en: 'Neural Network' },
            shortName: { ko: '뉴럴 네트워크', en: 'Neural Network' },
            description: {
                ko: '여러 층의 뉴런이 가중치를 조정하며 비선형 패턴을 학습합니다. 은닉층 구성은 Orange3의 쉼표로 구분한 층 크기를 교육용으로 단순화했습니다.',
                en: 'Layers of neurons adjust weights to learn nonlinear patterns. The hidden-layer controls are an educational simplification of Orange3\'s comma-separated layer sizes.'
            },
            params: [
                { key: 'layers', type: 'range', min: 1, max: 3, step: 1, value: 2, label: { ko: '은닉층 수', en: 'Hidden layers' }, unit: { ko: '층', en: '' } },
                { key: 'neurons', type: 'range', min: 2, max: 16, step: 1, value: 6, label: { ko: '층당 뉴런', en: 'Neurons per layer' }, unit: { ko: '개', en: '' } },
                { key: 'activation', type: 'select', value: 'relu', label: { ko: '활성화 함수', en: 'Activation' }, options: [
                    { value: 'identity', ko: 'Identity', en: 'Identity' }, { value: 'logistic', ko: 'Logistic', en: 'Logistic' },
                    { value: 'tanh', ko: 'tanh', en: 'tanh' }, { value: 'relu', ko: 'ReLU', en: 'ReLU' }
                ] },
                { key: 'solver', type: 'select', value: 'adam', label: { ko: '최적화 방법', en: 'Solver' }, options: [
                    { value: 'lbfgs', ko: 'L-BFGS-B', en: 'L-BFGS-B' }, { value: 'sgd', ko: 'SGD', en: 'SGD' }, { value: 'adam', ko: 'Adam', en: 'Adam' }
                ] },
                { key: 'l2Log', type: 'range', min: -5, max: 0, step: 0.25, value: -2, scale: 'power10', label: { ko: 'L2 규제 α', en: 'L2 regularization α' }, hint: { ko: '큰 값은 가중치를 더 강하게 제한합니다.', en: 'Larger values constrain weights more strongly.' } },
                { key: 'iterations', type: 'range', min: 50, max: 1000, step: 50, value: 300, label: { ko: '최대 반복', en: 'Maximum iterations' }, unit: { ko: '회', en: '' } },
                { key: 'replicable', type: 'checkbox', value: true, label: { ko: '재현 가능한 학습', en: 'Replicable training' }, hint: { ko: '같은 표본과 초기 가중치를 사용합니다.', en: 'Reuse the same sample and initial weights.' } }
            ]
        },
        logisticRegression: {
            category: 'supervised', icon: 'trending-up',
            name: { ko: '로지스틱 회귀', en: 'Logistic Regression' }, shortName: { ko: '로지스틱 회귀', en: 'Logistic Regression' },
            description: { ko: '특성의 가중합을 확률로 변환해 선형 결정 경계를 만듭니다. 규제 방식과 비용 강도 C가 계수의 크기를 조절합니다.', en: 'Transforms a weighted sum of features into class probability. Regularization and cost strength C control coefficient size.' },
            params: [
                { key: 'regularization', type: 'select', value: 'l2', label: { ko: '규제 방식', en: 'Regularization' }, options: [{ value: 'l1', ko: 'L1 (Lasso)', en: 'L1 (Lasso)' }, { value: 'l2', ko: 'L2 (Ridge)', en: 'L2 (Ridge)' }] },
                { key: 'cLog', type: 'range', min: -2, max: 2, step: 0.25, value: 0, scale: 'power10', label: { ko: '비용 강도 C', en: 'Cost strength C' }, hint: { ko: '작은 C는 더 강한 규제를 뜻합니다.', en: 'A smaller C means stronger regularization.' } }
            ]
        },
        randomForest: {
            category: 'supervised', icon: 'trees',
            name: { ko: '랜덤 포레스트', en: 'Random Forest' }, shortName: { ko: '랜덤 포레스트', en: 'Random Forest' },
            description: { ko: '서로 다른 표본과 특성을 본 여러 결정 트리의 투표를 결합합니다. 트리 수는 안정성과 시간, 깊이는 경계 복잡도에 영향을 줍니다.', en: 'Combines votes from decision trees trained on different samples and features. Tree count affects stability and time; depth affects boundary complexity.' },
            params: [
                { key: 'trees', type: 'range', min: 1, max: 100, step: 1, value: 30, label: { ko: '트리 수', en: 'Number of trees' }, unit: { ko: '개', en: '' } },
                { key: 'attributes', type: 'range', min: 1, max: 6, step: 1, value: 2, label: { ko: '분할마다 볼 특성', en: 'Attributes per split' }, unit: { ko: '개', en: '' } },
                { key: 'depth', type: 'range', min: 1, max: 12, step: 1, value: 5, label: { ko: '개별 트리 최대 깊이', en: 'Maximum tree depth' }, unit: { ko: '단계', en: '' } },
                { key: 'minSplit', type: 'range', min: 2, max: 30, step: 1, value: 5, label: { ko: '최소 분할 표본', en: 'Minimum split size' }, unit: { ko: '개', en: '' } },
                { key: 'balance', type: 'checkbox', value: false, label: { ko: '클래스 분포 균형화', en: 'Balance class distribution' }, hint: { ko: '소수 클래스의 영향력을 높입니다.', en: 'Increase the influence of minority classes.' } },
                { key: 'replicable', type: 'checkbox', value: true, label: { ko: '재현 가능한 학습', en: 'Replicable training' } }
            ]
        },
        svm: {
            category: 'supervised', icon: 'move-horizontal',
            name: { ko: '서포트 벡터 머신', en: 'Support Vector Machine' }, shortName: { ko: 'SVM', en: 'SVM' },
            description: { ko: '클래스 사이의 여백을 크게 만드는 경계를 찾습니다. 커널은 데이터를 비교하는 방식, C와 γ는 경계의 유연성을 바꿉니다.', en: 'Finds a boundary with a wide margin between classes. The kernel changes how points are compared; C and γ control boundary flexibility.' },
            params: [
                { key: 'svmType', type: 'select', value: 'cSvm', label: { ko: 'SVM 유형', en: 'SVM type' }, options: [{ value: 'cSvm', ko: 'SVM (C-SVM)', en: 'SVM (C-SVM)' }, { value: 'nuSvm', ko: 'ν-SVM', en: 'ν-SVM' }] },
                { key: 'kernel', type: 'select', value: 'rbf', label: { ko: '커널', en: 'Kernel' }, options: [{ value: 'linear', ko: '선형 (Linear)', en: 'Linear' }, { value: 'poly', ko: '다항식 (Polynomial)', en: 'Polynomial' }, { value: 'rbf', ko: 'RBF', en: 'RBF' }, { value: 'sigmoid', ko: '시그모이드 (Sigmoid)', en: 'Sigmoid' }] },
                { key: 'cLog', type: 'range', min: -2, max: 2, step: 0.25, value: 0, scale: 'power10', label: { ko: '비용 C', en: 'Cost C' } },
                { key: 'nu', type: 'range', min: 0.05, max: 0.95, step: 0.05, value: 0.5, label: { ko: 'ν', en: 'ν' }, showWhen: { key: 'svmType', value: 'nuSvm' }, hint: { ko: '학습 오류율의 상한이자 서포트 벡터 비율의 하한입니다.', en: 'Upper-bounds training errors and lower-bounds the support-vector fraction.' } },
                { key: 'gammaLog', type: 'range', min: -2, max: 1, step: 0.25, value: -0.3, scale: 'power10', label: { ko: '커널 γ', en: 'Kernel γ' }, hideWhen: { key: 'kernel', value: 'linear' } },
                { key: 'degree', type: 'range', min: 2, max: 5, step: 1, value: 3, label: { ko: '다항 차수 d', en: 'Polynomial degree d' }, showWhen: { key: 'kernel', value: 'poly' } },
                { key: 'toleranceLog', type: 'range', min: -5, max: -2, step: 0.5, value: -3, scale: 'power10', label: { ko: '수치 허용오차', en: 'Numerical tolerance' } },
                { key: 'iterations', type: 'range', min: 100, max: 5000, step: 100, value: 1000, label: { ko: '반복 제한', en: 'Iteration limit' }, unit: { ko: '회', en: '' } }
            ]
        },
        knn: {
            category: 'supervised', icon: 'map-pin',
            name: { ko: 'k-최근접 이웃', en: 'k-Nearest Neighbors' }, shortName: { ko: 'k-최근접 이웃', en: 'kNN' },
            description: { ko: '새 점과 가까운 k개의 학습 표본이 투표합니다. 거리 척도와 가중 방식에 따라 이웃의 범위와 영향력이 달라집니다.', en: 'The k closest training samples vote on a new point. The metric and weighting scheme change which neighbors matter.' },
            params: [
                { key: 'neighbors', type: 'range', min: 1, max: 25, step: 1, value: 7, label: { ko: '이웃 수 k', en: 'Number of neighbors k' }, unit: { ko: '개', en: '' } },
                { key: 'metric', type: 'select', value: 'euclidean', label: { ko: '거리 척도', en: 'Metric' }, options: [{ value: 'euclidean', ko: 'Euclidean', en: 'Euclidean' }, { value: 'manhattan', ko: 'Manhattan', en: 'Manhattan' }, { value: 'maximal', ko: 'Maximal', en: 'Maximal' }, { value: 'mahalanobis', ko: 'Mahalanobis', en: 'Mahalanobis' }] },
                { key: 'weights', type: 'select', value: 'distance', label: { ko: '이웃 가중치', en: 'Weights' }, options: [{ value: 'uniform', ko: '균일', en: 'Uniform' }, { value: 'distance', ko: '거리', en: 'Distance' }] }
            ]
        },
        kmeans: {
            category: 'unsupervised', icon: 'target',
            name: { ko: 'k-평균', en: 'k-Means' }, shortName: { ko: 'k-평균', en: 'k-Means' },
            description: { ko: '점을 가장 가까운 중심에 배정하고 중심을 다시 계산하는 과정을 반복합니다. 여러 재실행 중 군집 내 제곱합이 가장 작은 결과를 선택합니다.', en: 'Alternates between assigning points to the nearest centroid and updating centroids. The best within-cluster sum of squares is kept across reruns.' },
            params: [
                { key: 'clusters', type: 'range', min: 2, max: 8, step: 1, value: 3, label: { ko: '군집 수 k', en: 'Clusters k' }, unit: { ko: '개', en: '' } },
                { key: 'initialization', type: 'select', value: 'plus', label: { ko: '초기화', en: 'Initialization' }, options: [{ value: 'plus', ko: 'k-Means++', en: 'k-Means++' }, { value: 'random', ko: '무작위', en: 'Random' }] },
                { key: 'reruns', type: 'range', min: 1, max: 20, step: 1, value: 5, label: { ko: '재실행', en: 'Re-runs' }, unit: { ko: '회', en: '' } },
                { key: 'iterations', type: 'range', min: 10, max: 500, step: 10, value: 100, label: { ko: '최대 반복', en: 'Maximum iterations' }, unit: { ko: '회', en: '' } },
                { key: 'normalize', type: 'checkbox', value: true, label: { ko: '열 정규화', en: 'Normalize columns' } }
            ]
        },
        hierarchical: {
            category: 'unsupervised', icon: 'git-branch',
            name: { ko: '계층적 군집화', en: 'Hierarchical Clustering' }, shortName: { ko: '계층적 군집화', en: 'Hierarchical Clustering' },
            description: { ko: '가장 가까운 군집을 차례로 합쳐 덴드로그램을 만듭니다. 연결 방식은 합쳐지는 순서에, 가지치기는 화면에 보이는 깊이에만 영향을 줍니다.', en: 'Repeatedly merges the closest clusters into a dendrogram. Linkage changes merge order, while pruning changes display depth only.' },
            params: [
                { key: 'linkage', type: 'select', value: 'average', label: { ko: '연결 방식', en: 'Linkage' }, options: [{ value: 'single', ko: '단일 연결', en: 'Single' }, { value: 'average', ko: '평균 연결', en: 'Average' }, { value: 'weighted', ko: '가중 평균 (WPGMA)', en: 'Weighted (WPGMA)' }, { value: 'complete', ko: '완전 연결', en: 'Complete' }, { value: 'ward', ko: 'Ward', en: 'Ward' }] },
                { key: 'clusters', type: 'range', min: 2, max: 8, step: 1, value: 3, label: { ko: '선택할 상위 군집', en: 'Select top clusters' }, unit: { ko: '개', en: '' } },
                { key: 'pruning', type: 'range', min: 0, max: 10, step: 1, value: 0, label: { ko: '덴드로그램 가지치기', en: 'Dendrogram pruning depth' }, format: { zero: { ko: '끔', en: 'Off' } }, hint: { ko: '표시만 단순화하며 군집 계산은 바꾸지 않습니다.', en: 'Simplifies only the display, not the clustering result.' } }
            ]
        },
        dbscan: {
            category: 'unsupervised', icon: 'share-2',
            name: { ko: 'DBSCAN', en: 'DBSCAN' }, shortName: { ko: 'DBSCAN', en: 'DBSCAN' },
            description: { ko: '반경 ε 안에 충분한 이웃이 있는 핵심점을 연결해 군집을 찾고, 밀도가 낮은 점은 잡음으로 남깁니다.', en: 'Connects core points with enough neighbors inside radius ε and leaves low-density points as noise.' },
            params: [
                { key: 'minNeighbors', type: 'range', min: 2, max: 15, step: 1, value: 5, label: { ko: '핵심점 이웃 수', en: 'Core-point neighbors' }, unit: { ko: '개', en: '' } },
                { key: 'epsilon', type: 'range', min: 0.08, max: 1.2, step: 0.02, value: 0.32, label: { ko: '이웃 거리 ε', en: 'Neighborhood distance ε' }, digits: 2 },
                { key: 'metric', type: 'select', value: 'euclidean', label: { ko: '거리 척도', en: 'Metric' }, options: [{ value: 'euclidean', ko: 'Euclidean', en: 'Euclidean' }, { value: 'manhattan', ko: 'Manhattan', en: 'Manhattan' }, { value: 'cosine', ko: 'Cosine', en: 'Cosine' }] },
                { key: 'normalize', type: 'checkbox', value: true, label: { ko: '특성 정규화', en: 'Normalize features' } }
            ]
        },
        pca: {
            category: 'unsupervised', icon: 'minimize-2',
            name: { ko: '주성분 분석', en: 'Principal Component Analysis' }, shortName: { ko: '주성분 분석', en: 'PCA' },
            description: { ko: '분산이 큰 방향을 새 축으로 찾아 적은 차원에 정보를 보존합니다. 성분 수와 목표 설명분산이 압축 정도를 정합니다.', en: 'Finds new axes along directions of high variance to preserve information in fewer dimensions. Component count and target variance control compression.' },
            params: [
                { key: 'components', type: 'range', min: 1, max: 3, step: 1, value: 2, label: { ko: '주성분 수', en: 'Number of components' }, unit: { ko: '개', en: '' } },
                { key: 'varianceTarget', type: 'range', min: 50, max: 100, step: 5, value: 90, label: { ko: '목표 설명분산', en: 'Target explained variance' }, unit: { ko: '%', en: '%' } },
                { key: 'graphComponents', type: 'range', min: 2, max: 6, step: 1, value: 3, label: { ko: '그래프 표시 성분', en: 'Components shown in graph' }, unit: { ko: '개', en: '' } },
                { key: 'normalize', type: 'checkbox', value: true, label: { ko: '변수 정규화', en: 'Normalize variables' }, hint: { ko: '각 변수를 표준편차로 나눕니다.', en: 'Divide each variable by its standard deviation.' } }
            ]
        }
    };

    const WORKFLOW_WIDGETS = {
        file: { role: 'data', icon: 'file', name: { ko: '파일', en: 'File' }, detail: { ko: 'File', en: 'Data source' } },
        dataTable: { role: 'data', icon: 'table-2', name: { ko: '데이터 표', en: 'Data Table' }, detail: { ko: 'Data Table', en: 'Rows and columns' } },
        scatterPlot: { role: 'output', icon: 'scatter-chart', name: { ko: '산점도', en: 'Scatter Plot' }, detail: { ko: 'Scatter Plot', en: '2D patterns' } },
        preprocess: { role: 'data', icon: 'sliders-horizontal', name: { ko: '전처리', en: 'Preprocess' }, detail: { ko: 'Preprocess', en: 'Preprocessor' } },
        dataSampler: { role: 'data', icon: 'split', name: { ko: '데이터 샘플러', en: 'Data Sampler' }, detail: { ko: 'Data Sampler', en: 'Sample and remainder' } },
        testAndScore: { role: 'output', icon: 'flask-conical', name: { ko: '테스트 및 점수', en: 'Test and Score' }, detail: { ko: 'Test and Score', en: 'Model evaluation' } },
        predictions: { role: 'output', icon: 'list-checks', name: { ko: '예측', en: 'Predictions' }, detail: { ko: 'Predictions', en: 'Apply a trained model' } },
        confusionMatrix: { role: 'output', icon: 'grid-3x3', name: { ko: '혼동행렬', en: 'Confusion Matrix' }, detail: { ko: 'Confusion Matrix', en: 'Classification errors' } },
        silhouettePlot: { role: 'output', icon: 'bar-chart-2', name: { ko: '실루엣 그림', en: 'Silhouette Plot' }, detail: { ko: 'Silhouette Plot', en: 'Cluster quality' } },
        distances: { role: 'data', icon: 'ruler', name: { ko: '거리', en: 'Distances' }, detail: { ko: 'Distances', en: 'Distance matrix' } }
    };

    const state = {
        widget: 'neuralNetwork',
        dataset: 'moons',
        seed: 4069,
        values: {},
        points: [],
        result: null,
        hierarchyCache: new Map(),
        activeResultSlide: 0
    };

    let elements = {};

    function currentLanguage() {
        return document.documentElement.lang === 'en' ? 'en' : 'ko';
    }

    function localized(value) {
        if (value === undefined || value === null) return '';
        if (typeof value === 'string') return value;
        const language = currentLanguage();
        if (Object.prototype.hasOwnProperty.call(value, language)) return value[language];
        return value.ko || value.en || '';
    }

    function refreshLucideIcons() {
        if (!window.lucide || typeof window.lucide.createIcons !== 'function') return;
        window.lucide.createIcons({
            attrs: {
                'aria-hidden': 'true',
                'stroke-width': 1.8
            }
        });
    }

    function optionLabel(widgetKey, parameterKey, value) {
        const widget = WIDGETS[widgetKey];
        const parameter = widget && widget.params.find(item => item.key === parameterKey);
        const option = parameter && parameter.options && parameter.options.find(item => item.value === value);
        return option ? localized(option) : String(value);
    }

    function clamp(value, min, max) {
        return Math.min(max, Math.max(min, value));
    }

    function round(value, digits) {
        const power = Math.pow(10, digits || 0);
        return Math.round(value * power) / power;
    }

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function seededRandom(seed) {
        let value = seed >>> 0;
        return function () {
            value += 0x6D2B79F5;
            let t = value;
            t = Math.imul(t ^ (t >>> 15), t | 1);
            t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
            return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };
    }

    function randomNormal(random) {
        const u = Math.max(1e-9, random());
        const v = Math.max(1e-9, random());
        return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
    }

    function initializeValues() {
        Object.entries(WIDGETS).forEach(([widgetKey, widget]) => {
            state.values[widgetKey] = {};
            widget.params.forEach(param => {
                state.values[widgetKey][param.key] = param.value;
            });
        });
    }

    function datasetLabel(datasetKey) {
        const option = Object.values(CATEGORY_DATASETS).flat().find(item => item.value === datasetKey);
        return option ? localized(option) : datasetKey;
    }

    function generatePoints() {
        const random = seededRandom(state.seed);
        const points = [];
        const addPoint = (x, y, label, index, extra) => {
            const validation = ((index * 5 + label * 3) % 8) < 2;
            points.push(Object.assign({ x, y, label, validation }, extra || {}));
        };

        if (state.dataset === 'linear') {
            for (let i = 0; i < 128; i += 1) {
                const x = random() * 3.4 - 1.7;
                const y = random() * 2.8 - 1.4;
                const noisyScore = x + y * 0.72 + randomNormal(random) * 0.24;
                addPoint(x, y, noisyScore > 0 ? 1 : 0, i);
            }
        } else if (state.dataset === 'circles') {
            for (let i = 0; i < 128; i += 1) {
                const label = i % 2;
                const angle = random() * Math.PI * 2;
                const radius = (label === 0 ? 0.48 : 1.15) + randomNormal(random) * 0.105;
                addPoint(Math.cos(angle) * radius, Math.sin(angle) * radius, label, i);
            }
        } else if (state.dataset === 'moons') {
            for (let i = 0; i < 128; i += 1) {
                const label = i % 2;
                const angle = random() * Math.PI;
                const noiseX = randomNormal(random) * 0.10;
                const noiseY = randomNormal(random) * 0.10;
                if (label === 0) addPoint(Math.cos(angle) - 0.45 + noiseX, Math.sin(angle) - 0.22 + noiseY, label, i);
                else addPoint(0.55 - Math.cos(angle) + noiseX, 0.28 - Math.sin(angle) + noiseY, label, i);
            }
        } else if (state.dataset === 'blobs') {
            const centers = [[-1.02, -0.54], [0.95, -0.42], [0.05, 0.92]];
            for (let i = 0; i < 126; i += 1) {
                const label = i % 3;
                const center = centers[label];
                addPoint(center[0] + randomNormal(random) * 0.25, center[1] + randomNormal(random) * 0.22, label, i);
            }
        } else if (state.dataset === 'density') {
            const centers = [[-0.8, -0.25], [0.8, 0.25], [0.05, 0.9]];
            const spreads = [0.14, 0.34, 0.22];
            for (let i = 0; i < 126; i += 1) {
                const label = i < 42 ? 0 : (i < 92 ? 1 : 2);
                const center = centers[label];
                const spread = spreads[label];
                addPoint(center[0] + randomNormal(random) * spread, center[1] + randomNormal(random) * spread, label, i);
            }
            for (let i = 126; i < 136; i += 1) {
                addPoint(random() * 3.2 - 1.6, random() * 2.5 - 1.25, 3, i, { sourceNoise: true });
            }
        } else if (state.dataset === 'rings') {
            const radii = [0.38, 0.82, 1.28];
            for (let i = 0; i < 132; i += 1) {
                const label = i % 3;
                const angle = random() * Math.PI * 2;
                const radius = radii[label] + randomNormal(random) * 0.06;
                addPoint(Math.cos(angle) * radius, Math.sin(angle) * radius, label, i);
            }
        }

        state.points = points;
    }

    function pointDistance(a, b, metric) {
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        if (metric === 'manhattan') return Math.abs(dx) + Math.abs(dy);
        if (metric === 'maximal') return Math.max(Math.abs(dx), Math.abs(dy));
        if (metric === 'mahalanobis') return Math.sqrt(dx * dx * 0.72 + dy * dy * 1.35 - dx * dy * 0.24);
        if (metric === 'cosine') {
            const numerator = a.x * b.x + a.y * b.y;
            const denominator = Math.hypot(a.x, a.y) * Math.hypot(b.x, b.y) || 1;
            return 1 - clamp(numerator / denominator, -1, 1);
        }
        return Math.hypot(dx, dy);
    }

    function valueFor(widgetKey, parameterKey) {
        return state.values[widgetKey][parameterKey];
    }

    function power10(value) {
        return Math.pow(10, Number(value));
    }

    function formatParameterValue(param, value) {
        if (param.format && param.format.zero && Number(value) === 0) return localized(param.format.zero);
        let display = value;
        if (param.scale === 'power10') {
            const actual = power10(value);
            if (actual < 0.001) display = actual.toExponential(1);
            else if (actual < 1) display = actual.toFixed(actual < 0.01 ? 4 : 2);
            else display = actual.toFixed(actual >= 10 ? 0 : 2);
        } else if (typeof value === 'number' && typeof param.digits === 'number') {
            display = value.toFixed(param.digits);
        }
        const unit = localized(param.unit);
        return unit ? `${display}${unit}` : String(display);
    }

    function shouldShowParameter(param, values) {
        if (param.showWhen && values[param.showWhen.key] !== param.showWhen.value) return false;
        if (param.hideWhen && values[param.hideWhen.key] === param.hideWhen.value) return false;
        return true;
    }

    function moonOracleScore(point) {
        let distanceToFirst = Infinity;
        let distanceToSecond = Infinity;
        for (let i = 0; i <= 36; i += 1) {
            const angle = (i / 36) * Math.PI;
            const first = { x: Math.cos(angle) - 0.45, y: Math.sin(angle) - 0.22 };
            const second = { x: 0.55 - Math.cos(angle), y: 0.28 - Math.sin(angle) };
            distanceToFirst = Math.min(distanceToFirst, Math.pow(point.x - first.x, 2) + Math.pow(point.y - first.y, 2));
            distanceToSecond = Math.min(distanceToSecond, Math.pow(point.x - second.x, 2) + Math.pow(point.y - second.y, 2));
        }
        return distanceToFirst - distanceToSecond;
    }

    function oracleScore(point) {
        if (state.dataset === 'linear') return point.x + point.y * 0.72;
        if (state.dataset === 'circles') return Math.hypot(point.x, point.y) - 0.81;
        return moonOracleScore(point);
    }

    function linearScore(point, rotation, bias) {
        let weightX = 1;
        let weightY = 0.72;
        if (state.dataset === 'moons') {
            weightX = 0.55;
            weightY = -1;
        } else if (state.dataset === 'circles') {
            weightX = 1;
            weightY = 0.15;
        }
        return point.x * (weightX + rotation * 0.25) + point.y * (weightY - rotation * 0.38) + bias;
    }

    function nearestNeighbors(point, count, metric) {
        return state.points
            .filter(candidate => !candidate.validation)
            .map(candidate => ({ point: candidate, distance: pointDistance(point, candidate, metric) }))
            .sort((a, b) => a.distance - b.distance)
            .slice(0, count);
    }

    function predictorFor(widgetKey, values) {
        if (widgetKey === 'knn') {
            return function (point) {
                const neighbors = nearestNeighbors(point, values.neighbors, values.metric);
                let positive = 0;
                let negative = 0;
                neighbors.forEach(neighbor => {
                    const weight = values.weights === 'distance' ? 1 / Math.max(0.025, neighbor.distance) : 1;
                    if (neighbor.point.label === 1) positive += weight;
                    else negative += weight;
                });
                return (positive - negative) / Math.max(1e-6, positive + negative);
            };
        }

        if (widgetKey === 'logisticRegression') {
            const c = power10(values.cLog);
            const shrinkage = c / (c + (values.regularization === 'l1' ? 1.45 : 0.8));
            const rotation = values.regularization === 'l1' ? (1 - shrinkage) * 0.65 : (1 - shrinkage) * 0.18;
            const bias = values.regularization === 'l1' ? -0.06 * (1 - shrinkage) : 0;
            return point => linearScore(point, rotation, bias) * (0.4 + shrinkage);
        }

        if (widgetKey === 'neuralNetwork') {
            const capacity = values.layers * Math.log2(values.neurons + 1);
            const required = state.dataset === 'linear' ? 1.2 : (state.dataset === 'circles' ? 5.5 : 4.2);
            const activationFactor = { identity: 0.16, logistic: 0.73, tanh: 0.92, relu: 1 }[values.activation];
            const solverFactor = { lbfgs: 1.02, sgd: 0.84, adam: 0.96 }[values.solver];
            const iterationScale = values.solver === 'sgd' ? 260 : (values.solver === 'lbfgs' ? 95 : 130);
            const iterationFactor = 1 - Math.exp(-values.iterations / iterationScale);
            const regularization = power10(values.l2Log);
            const regularizationFactor = Math.exp(-Math.max(0, Math.log10(regularization + 1e-8) + 2.1) * 0.34);
            const quality = clamp((1 - Math.exp(-capacity / (required * 0.65))) * activationFactor * solverFactor * iterationFactor * regularizationFactor, 0.08, 1);
            const overfit = clamp((capacity - required * 1.75) / 15, 0, 0.34) * (1 / (1 + regularization * 90));
            return function (point) {
                const target = oracleScore(point);
                const simple = linearScore(point, 0.18, 0);
                const localRipple = Math.sin(point.x * values.neurons * 0.72 + point.y * values.layers * 1.6) * overfit;
                return target * quality + simple * (1 - quality) + localRipple;
            };
        }

        if (widgetKey === 'randomForest') {
            const depthQuality = 1 - Math.exp(-values.depth / (state.dataset === 'linear' ? 1.4 : 3.2));
            const treeStability = 1 - Math.exp(-values.trees / 18);
            const splitPenalty = clamp((values.minSplit - 2) / 40, 0, 0.5);
            const featureFactor = clamp(values.attributes / 2, 0.6, 1.04);
            const quality = clamp(0.32 + depthQuality * treeStability * (1 - splitPenalty) * featureFactor * 0.78, 0.18, 1);
            const cells = Math.max(2, values.depth + 1);
            return function (point) {
                const quantized = {
                    x: Math.round(point.x * cells) / cells,
                    y: Math.round(point.y * cells) / cells
                };
                const jitter = Math.sin(point.x * values.trees * 0.23 + point.y * values.attributes * 2.1) * (1 - treeStability) * 0.34;
                return oracleScore(quantized) * quality + linearScore(point, 0, 0) * (1 - quality) + jitter;
            };
        }

        const c = power10(values.cLog);
        const marginFit = c / (c + 0.55);
        const iterationFit = 1 - Math.exp(-values.iterations / 620);
        const nuPenalty = values.svmType === 'nuSvm' ? Math.abs(values.nu - 0.42) * 0.35 : 0;
        if (values.kernel === 'linear') {
            return point => linearScore(point, (1 - marginFit) * 0.25, 0) * iterationFit;
        }
        if (values.kernel === 'poly') {
            const polynomialQuality = clamp(0.42 + values.degree * 0.12, 0, 0.92) * iterationFit * (1 - nuPenalty);
            return function (point) {
                const polynomial = state.dataset === 'circles'
                    ? Math.pow(Math.hypot(point.x, point.y), Math.min(4, values.degree)) - Math.pow(0.81, Math.min(4, values.degree))
                    : linearScore(point, 0, 0) + Math.pow(point.x * point.y, Math.min(3, values.degree)) * 0.7;
                return polynomial * polynomialQuality + oracleScore(point) * Math.max(0, polynomialQuality - 0.62) * 0.5;
            };
        }
        if (values.kernel === 'sigmoid') {
            return point => Math.tanh(linearScore(point, 0.15, 0) * power10(values.gammaLog)) * iterationFit;
        }
        const gamma = power10(values.gammaLog);
        const gammaQuality = Math.exp(-Math.pow(Math.log10(gamma) + 0.32, 2) * 0.72);
        const quality = clamp(gammaQuality * marginFit * iterationFit * (1 - nuPenalty), 0.12, 1);
        return function (point) {
            const ripple = Math.sin(point.x * gamma * 5.2) * Math.cos(point.y * gamma * 4.7) * clamp((gamma - 1.4) * 0.18, 0, 0.45);
            return oracleScore(point) * quality + linearScore(point, 0, 0) * (1 - quality) + ripple;
        };
    }

    function classificationMetrics(points, predictor) {
        let correct = 0;
        let tp = 0;
        let fp = 0;
        let fn = 0;
        let logLoss = 0;
        points.forEach(point => {
            const raw = predictor(point);
            const prediction = raw >= 0 ? 1 : 0;
            const probability = clamp(1 / (1 + Math.exp(-raw * 3.2)), 0.001, 0.999);
            if (prediction === point.label) correct += 1;
            if (prediction === 1 && point.label === 1) tp += 1;
            if (prediction === 1 && point.label === 0) fp += 1;
            if (prediction === 0 && point.label === 1) fn += 1;
            logLoss += point.label === 1 ? -Math.log(probability) : -Math.log(1 - probability);
        });
        const precision = tp / Math.max(1, tp + fp);
        const recall = tp / Math.max(1, tp + fn);
        return {
            accuracy: correct / Math.max(1, points.length),
            f1: (2 * precision * recall) / Math.max(1e-6, precision + recall),
            logLoss: logLoss / Math.max(1, points.length)
        };
    }

    function supervisedComplexity(widgetKey, values) {
        if (widgetKey === 'neuralNetwork') {
            const hiddenParameters = (2 + 1) * values.neurons + Math.max(0, values.layers - 1) * (values.neurons + 1) * values.neurons;
            return hiddenParameters + values.neurons + 1;
        }
        if (widgetKey === 'logisticRegression') return values.regularization === 'l1' ? 2 : 3;
        if (widgetKey === 'randomForest') return Math.round(values.trees * (Math.pow(2, Math.min(values.depth, 8)) - 1));
        if (widgetKey === 'svm') {
            const kernelFactor = values.kernel === 'linear' ? 1 : (values.kernel === 'poly' ? values.degree : 4);
            return Math.round(state.points.length * kernelFactor * clamp(power10(values.cLog), 0.25, 4));
        }
        return values.neighbors;
    }

    function supervisedFitTime(widgetKey, values, complexity) {
        if (widgetKey === 'neuralNetwork') return 18 + complexity * values.iterations * 0.0022;
        if (widgetKey === 'logisticRegression') return 12 + power10(values.cLog) * 1.8;
        if (widgetKey === 'randomForest') return 14 + values.trees * values.depth * 0.72;
        if (widgetKey === 'svm') return 18 + state.points.length * (values.kernel === 'linear' ? 0.18 : 0.5) + values.iterations * 0.013;
        return 5 + state.points.length * values.neighbors * 0.025;
    }

    function createLossCurves(widgetKey, values, trainMetrics, validationMetrics) {
        const length = 34;
        const curves = { train: [], validation: [] };
        const iterations = values.iterations || (widgetKey === 'randomForest' ? values.trees : 100);
        const speed = widgetKey === 'neuralNetwork' && values.solver === 'sgd' ? 2.5 : 4.2;
        const finalTrain = clamp(trainMetrics.logLoss * 0.78, 0.045, 0.75);
        const finalValidation = clamp(validationMetrics.logLoss, 0.06, 1.1);
        const capacity = supervisedComplexity(widgetKey, values);
        const overfitStrength = clamp((capacity - 60) / 700, 0, 0.28);
        for (let i = 0; i < length; i += 1) {
            const progress = i / (length - 1);
            const decay = Math.exp(-progress * speed);
            const oscillation = widgetKey === 'neuralNetwork' && values.solver === 'sgd' ? Math.sin(i * 1.5) * 0.035 * (1 - progress) : 0;
            curves.train.push({ x: progress * iterations, y: finalTrain + (0.82 - finalTrain) * decay + oscillation });
            curves.validation.push({ x: progress * iterations, y: finalValidation + (0.9 - finalValidation) * decay + Math.pow(progress, 2.3) * overfitStrength });
        }
        return curves;
    }

    function simulateSupervised(widgetKey, values) {
        const predictor = predictorFor(widgetKey, values);
        const training = state.points.filter(point => !point.validation);
        const validation = state.points.filter(point => point.validation);
        const trainMetrics = classificationMetrics(training, predictor);
        const validationMetrics = classificationMetrics(validation, predictor);
        const complexity = supervisedComplexity(widgetKey, values);
        const fitTime = supervisedFitTime(widgetKey, values, complexity);
        const gap = Math.max(0, trainMetrics.accuracy - validationMetrics.accuracy);
        const curves = createLossCurves(widgetKey, values, trainMetrics, validationMetrics);
        let supportVectors = [];
        if (widgetKey === 'svm') {
            supportVectors = training.filter(point => Math.abs(predictor(point)) < (values.kernel === 'linear' ? 0.34 : 0.22));
        }
        return {
            type: 'supervised', predictor, trainMetrics, validationMetrics, complexity, fitTime, gap, curves, supportVectors
        };
    }

    function standardizedCoordinates(points, normalize) {
        if (!normalize) return points.map(point => ({ x: point.x, y: point.y }));
        const meanX = points.reduce((sum, point) => sum + point.x, 0) / points.length;
        const meanY = points.reduce((sum, point) => sum + point.y, 0) / points.length;
        const stdX = Math.sqrt(points.reduce((sum, point) => sum + Math.pow(point.x - meanX, 2), 0) / points.length) || 1;
        const stdY = Math.sqrt(points.reduce((sum, point) => sum + Math.pow(point.y - meanY, 2), 0) / points.length) || 1;
        return points.map(point => ({ x: (point.x - meanX) / stdX, y: (point.y - meanY) / stdY }));
    }

    function meanPoint(indices, coordinates) {
        const total = indices.reduce((sum, index) => ({ x: sum.x + coordinates[index].x, y: sum.y + coordinates[index].y }), { x: 0, y: 0 });
        return { x: total.x / Math.max(1, indices.length), y: total.y / Math.max(1, indices.length) };
    }

    function kmeansOnce(coordinates, count, initialization, iterations, seed) {
        const random = seededRandom(seed);
        const centroids = [];
        if (initialization === 'plus') {
            centroids.push(Object.assign({}, coordinates[Math.floor(random() * coordinates.length)]));
            while (centroids.length < count) {
                const distances = coordinates.map(point => Math.min(...centroids.map(center => Math.pow(pointDistance(point, center, 'euclidean'), 2))));
                const total = distances.reduce((sum, value) => sum + value, 0) || 1;
                let target = random() * total;
                let selected = 0;
                for (let i = 0; i < distances.length; i += 1) {
                    target -= distances[i];
                    if (target <= 0) { selected = i; break; }
                }
                centroids.push(Object.assign({}, coordinates[selected]));
            }
        } else {
            const chosen = new Set();
            while (centroids.length < count) {
                const index = Math.floor(random() * coordinates.length);
                if (!chosen.has(index)) {
                    chosen.add(index);
                    centroids.push(Object.assign({}, coordinates[index]));
                }
            }
        }

        let assignments = new Array(coordinates.length).fill(0);
        const history = [];
        const maxIterations = Math.min(iterations, 80);
        for (let step = 0; step < maxIterations; step += 1) {
            const nextAssignments = coordinates.map(point => {
                let best = 0;
                let bestDistance = Infinity;
                centroids.forEach((centroid, index) => {
                    const distance = pointDistance(point, centroid, 'euclidean');
                    if (distance < bestDistance) { bestDistance = distance; best = index; }
                });
                return best;
            });
            let changed = false;
            for (let i = 0; i < assignments.length; i += 1) if (assignments[i] !== nextAssignments[i]) changed = true;
            assignments = nextAssignments;
            for (let cluster = 0; cluster < count; cluster += 1) {
                const members = assignments.map((value, index) => value === cluster ? index : -1).filter(index => index >= 0);
                if (members.length) centroids[cluster] = meanPoint(members, coordinates);
            }
            const inertia = coordinates.reduce((sum, point, index) => sum + Math.pow(pointDistance(point, centroids[assignments[index]], 'euclidean'), 2), 0);
            history.push(inertia);
            if (!changed && step > 0) break;
        }
        const inertia = history[history.length - 1] || 0;
        return { assignments, centroids, history, inertia };
    }

    function runKmeans(values) {
        const coordinates = standardizedCoordinates(state.points, values.normalize);
        let best = null;
        for (let rerun = 0; rerun < values.reruns; rerun += 1) {
            const candidate = kmeansOnce(coordinates, values.clusters, values.initialization, values.iterations, state.seed + rerun * 97);
            if (!best || candidate.inertia < best.inertia) best = candidate;
        }
        const displayCentroids = [];
        for (let cluster = 0; cluster < values.clusters; cluster += 1) {
            const members = best.assignments.map((assignment, index) => assignment === cluster ? index : -1).filter(index => index >= 0);
            displayCentroids.push(meanPoint(members, state.points));
        }
        best.displayCentroids = displayCentroids;
        return best;
    }

    function runDbscan(values) {
        const coordinates = standardizedCoordinates(state.points, values.normalize);
        const assignments = new Array(coordinates.length).fill(undefined);
        const visited = new Array(coordinates.length).fill(false);
        const core = new Array(coordinates.length).fill(false);
        let cluster = 0;
        const neighborsFor = index => coordinates
            .map((point, candidate) => pointDistance(coordinates[index], point, values.metric) <= values.epsilon ? candidate : -1)
            .filter(candidate => candidate >= 0);

        for (let index = 0; index < coordinates.length; index += 1) {
            if (visited[index]) continue;
            visited[index] = true;
            const neighbors = neighborsFor(index);
            if (neighbors.length < values.minNeighbors) {
                assignments[index] = -1;
                continue;
            }
            core[index] = true;
            assignments[index] = cluster;
            const queue = neighbors.slice();
            const queued = new Set(queue);
            while (queue.length) {
                const candidate = queue.shift();
                if (!visited[candidate]) {
                    visited[candidate] = true;
                    const expanded = neighborsFor(candidate);
                    if (expanded.length >= values.minNeighbors) {
                        core[candidate] = true;
                        expanded.forEach(neighbor => {
                            if (!queued.has(neighbor)) { queued.add(neighbor); queue.push(neighbor); }
                        });
                    }
                }
                if (assignments[candidate] === undefined || assignments[candidate] === -1) assignments[candidate] = cluster;
            }
            cluster += 1;
        }
        return { assignments: assignments.map(value => value === undefined ? -1 : value), core, clusterCount: cluster, coordinates };
    }

    function hierarchicalDistance(first, second, coordinates, linkage) {
        if (linkage === 'ward') {
            const a = meanPoint(first.members, coordinates);
            const b = meanPoint(second.members, coordinates);
            return (first.members.length * second.members.length / (first.members.length + second.members.length)) * Math.pow(pointDistance(a, b, 'euclidean'), 2);
        }
        const distances = [];
        first.members.forEach(firstIndex => second.members.forEach(secondIndex => distances.push(pointDistance(coordinates[firstIndex], coordinates[secondIndex], 'euclidean'))));
        if (linkage === 'single') return Math.min(...distances);
        if (linkage === 'complete') return Math.max(...distances);
        if (linkage === 'weighted') {
            const firstCenter = meanPoint(first.members, coordinates);
            const secondCenter = meanPoint(second.members, coordinates);
            return pointDistance(firstCenter, secondCenter, 'euclidean');
        }
        return distances.reduce((sum, value) => sum + value, 0) / Math.max(1, distances.length);
    }

    function buildHierarchy(linkage) {
        const cacheKey = `${state.dataset}-${state.seed}-${linkage}`;
        if (state.hierarchyCache.has(cacheKey)) return state.hierarchyCache.get(cacheKey);
        const coordinates = standardizedCoordinates(state.points, true);
        let clusters = coordinates.map((point, index) => ({ id: index, members: [index], height: 0, left: null, right: null }));
        let nextId = coordinates.length;
        const partitions = new Map();
        const merges = [];
        const distances = new Map();
        const distanceKey = (firstId, secondId) => firstId < secondId ? `${firstId}:${secondId}` : `${secondId}:${firstId}`;
        const getDistance = (firstId, secondId) => distances.get(distanceKey(firstId, secondId));
        const setDistance = (firstId, secondId, value) => distances.set(distanceKey(firstId, secondId), value);

        for (let i = 0; i < clusters.length; i += 1) {
            for (let j = i + 1; j < clusters.length; j += 1) {
                const base = pointDistance(coordinates[i], coordinates[j], 'euclidean');
                setDistance(clusters[i].id, clusters[j].id, linkage === 'ward' ? base * base * 0.5 : base);
            }
        }

        while (clusters.length > 1) {
            if (clusters.length <= 8) {
                const assignments = new Array(coordinates.length).fill(0);
                clusters.forEach((group, groupIndex) => group.members.forEach(index => { assignments[index] = groupIndex; }));
                partitions.set(clusters.length, assignments);
            }
            let bestI = 0;
            let bestJ = 1;
            let bestDistance = Infinity;
            for (let i = 0; i < clusters.length; i += 1) {
                for (let j = i + 1; j < clusters.length; j += 1) {
                    const distance = getDistance(clusters[i].id, clusters[j].id);
                    if (distance < bestDistance) { bestDistance = distance; bestI = i; bestJ = j; }
                }
            }
            const left = clusters[bestI];
            const right = clusters[bestJ];
            const merged = { id: nextId++, members: left.members.concat(right.members), height: bestDistance, left, right };
            merges.push({ height: bestDistance, size: merged.members.length });
            const remaining = clusters.filter((item, index) => index !== bestI && index !== bestJ);
            remaining.forEach(other => {
                const leftDistance = getDistance(left.id, other.id);
                const rightDistance = getDistance(right.id, other.id);
                let nextDistance;
                if (linkage === 'single') nextDistance = Math.min(leftDistance, rightDistance);
                else if (linkage === 'complete') nextDistance = Math.max(leftDistance, rightDistance);
                else if (linkage === 'weighted') nextDistance = (leftDistance + rightDistance) / 2;
                else if (linkage === 'ward') {
                    const leftSize = left.members.length;
                    const rightSize = right.members.length;
                    const otherSize = other.members.length;
                    nextDistance = ((otherSize + leftSize) * leftDistance + (otherSize + rightSize) * rightDistance - otherSize * bestDistance) / (otherSize + leftSize + rightSize);
                } else {
                    nextDistance = (left.members.length * leftDistance + right.members.length * rightDistance) / (left.members.length + right.members.length);
                }
                setDistance(merged.id, other.id, nextDistance);
            });
            clusters = remaining.concat(merged);
        }
        partitions.set(1, new Array(coordinates.length).fill(0));
        const result = { root: clusters[0], partitions, merges, coordinates };
        state.hierarchyCache.set(cacheKey, result);
        return result;
    }

    function vectorNormalize(vector) {
        const norm = Math.hypot(...vector) || 1;
        return vector.map(value => value / norm);
    }

    function matrixVector(matrix, vector) {
        return matrix.map(row => row.reduce((sum, value, index) => sum + value * vector[index], 0));
    }

    function eigenPair(matrix, seedVector) {
        let vector = vectorNormalize(seedVector);
        for (let i = 0; i < 45; i += 1) vector = vectorNormalize(matrixVector(matrix, vector));
        const multiplied = matrixVector(matrix, vector);
        const value = vector.reduce((sum, component, index) => sum + component * multiplied[index], 0);
        return { value: Math.max(0, value), vector };
    }

    function runPca(values) {
        let features = state.points.map(point => [point.x, point.y, point.x * 0.62 - point.y * 0.27 + point.x * point.y * 0.22]);
        const means = [0, 1, 2].map(column => features.reduce((sum, row) => sum + row[column], 0) / features.length);
        const stds = [0, 1, 2].map(column => Math.sqrt(features.reduce((sum, row) => sum + Math.pow(row[column] - means[column], 2), 0) / features.length) || 1);
        features = features.map(row => row.map((value, column) => (value - means[column]) / (values.normalize ? stds[column] : 1)));
        let covariance = Array.from({ length: 3 }, () => new Array(3).fill(0));
        features.forEach(row => {
            for (let i = 0; i < 3; i += 1) for (let j = 0; j < 3; j += 1) covariance[i][j] += row[i] * row[j] / Math.max(1, features.length - 1);
        });
        const pairs = [];
        const seeds = [[1, 0.4, 0.2], [-0.2, 1, 0.4], [0.3, -0.4, 1]];
        for (let component = 0; component < 3; component += 1) {
            const pair = eigenPair(covariance, seeds[component]);
            pairs.push(pair);
            covariance = covariance.map((row, i) => row.map((value, j) => value - pair.value * pair.vector[i] * pair.vector[j]));
        }
        const total = pairs.reduce((sum, pair) => sum + pair.value, 0) || 1;
        const explained = pairs.map(pair => pair.value / total);
        const projected = features.map((row, index) => ({
            x: row.reduce((sum, value, feature) => sum + value * pairs[0].vector[feature], 0),
            y: row.reduce((sum, value, feature) => sum + value * pairs[1].vector[feature], 0),
            label: state.points[index].label,
            validation: state.points[index].validation
        }));
        return { pairs, explained, projected };
    }

    function silhouetteScore(points, assignments, metric) {
        const validIndices = assignments.map((cluster, index) => cluster >= 0 ? index : -1).filter(index => index >= 0);
        const clusters = [...new Set(validIndices.map(index => assignments[index]))];
        if (clusters.length < 2 || validIndices.length < 3) return 0;
        const values = validIndices.map(index => {
            const own = assignments[index];
            const ownMembers = validIndices.filter(candidate => candidate !== index && assignments[candidate] === own);
            const a = ownMembers.length ? ownMembers.reduce((sum, candidate) => sum + pointDistance(points[index], points[candidate], metric), 0) / ownMembers.length : 0;
            let b = Infinity;
            clusters.filter(cluster => cluster !== own).forEach(cluster => {
                const members = validIndices.filter(candidate => assignments[candidate] === cluster);
                const distance = members.reduce((sum, candidate) => sum + pointDistance(points[index], points[candidate], metric), 0) / Math.max(1, members.length);
                b = Math.min(b, distance);
            });
            return (b - a) / Math.max(a, b, 1e-6);
        });
        return values.reduce((sum, value) => sum + value, 0) / values.length;
    }

    function simulateUnsupervised(widgetKey, values) {
        if (widgetKey === 'kmeans') {
            const model = runKmeans(values);
            const silhouette = silhouetteScore(state.points, model.assignments, 'euclidean');
            return { type: 'unsupervised', assignments: model.assignments, centroids: model.displayCentroids, silhouette, noise: 0, clusterCount: values.clusters, history: model.history, inertia: model.inertia, complexity: values.clusters * 2, fitTime: 8 + values.reruns * Math.min(values.iterations, 80) * state.points.length * 0.003 };
        }
        if (widgetKey === 'dbscan') {
            const model = runDbscan(values);
            const silhouette = silhouetteScore(state.points, model.assignments, values.metric);
            const noise = model.assignments.filter(cluster => cluster < 0).length;
            const sortedDistances = model.coordinates.map((point, index) => {
                const distances = model.coordinates.map(candidate => pointDistance(point, candidate, values.metric)).sort((a, b) => a - b);
                return distances[Math.min(values.minNeighbors - 1, distances.length - 1)];
            }).sort((a, b) => a - b);
            return { type: 'unsupervised', assignments: model.assignments, core: model.core, silhouette, noise, clusterCount: model.clusterCount, kDistances: sortedDistances, complexity: model.core.filter(Boolean).length, fitTime: 7 + state.points.length * state.points.length * 0.0014 };
        }
        if (widgetKey === 'hierarchical') {
            const model = buildHierarchy(values.linkage);
            const assignments = model.partitions.get(values.clusters) || model.partitions.get(3);
            const silhouette = silhouetteScore(state.points, assignments, 'euclidean');
            return { type: 'unsupervised', assignments, silhouette, noise: 0, clusterCount: values.clusters, hierarchy: model, complexity: state.points.length - 1, fitTime: 12 + state.points.length * state.points.length * 0.0027 };
        }
        const model = runPca(values);
        const retained = model.explained.slice(0, values.components).reduce((sum, value) => sum + value, 0);
        return { type: 'unsupervised', assignments: state.points.map(point => point.label), pca: model, silhouette: retained, noise: 0, clusterCount: values.components, complexity: values.components * 3, fitTime: 6 + state.points.length * 0.04, retainedVariance: retained };
    }

    function simulateCurrentWidget() {
        const widget = WIDGETS[state.widget];
        const values = state.values[state.widget];
        state.result = widget.category === 'supervised'
            ? simulateSupervised(state.widget, values)
            : simulateUnsupervised(state.widget, values);
    }

    function renderWidgetButtons() {
        elements.supervisedWidgets.innerHTML = '';
        elements.unsupervisedWidgets.innerHTML = '';
        Object.entries(WIDGETS).forEach(([key, widget]) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'widget-button';
            button.dataset.widget = key;
            button.dataset.category = widget.category;
            button.setAttribute('aria-pressed', key === state.widget ? 'true' : 'false');
            button.innerHTML = `<span class="widget-button-icon"><i data-lucide="${widget.icon}" aria-hidden="true"></i></span><span>${escapeHtml(localized(widget.name))}</span><i data-lucide="chevron-right" class="widget-button-chevron" aria-hidden="true"></i>`;
            button.addEventListener('click', () => selectWidget(key));
            const target = widget.category === 'supervised' ? elements.supervisedWidgets : elements.unsupervisedWidgets;
            target.appendChild(button);
        });
        refreshLucideIcons();
    }

    function renderDatasetOptions() {
        const category = WIDGETS[state.widget].category;
        const options = CATEGORY_DATASETS[category];
        if (!options.some(option => option.value === state.dataset)) state.dataset = options[0].value;
        elements.datasetSelect.innerHTML = options.map(option => `<option value="${option.value}">${escapeHtml(localized(option))}</option>`).join('');
        elements.datasetSelect.value = state.dataset;
    }

    function recommendationNode(key, detail, optional, instance) {
        return { key, detail, optional: Boolean(optional), instance: instance || key };
    }

    function recommendationNodeMeta(node) {
        const widget = WIDGETS[state.widget];
        if (node.key === 'model') {
            let detail = { ko: '학습기', en: 'Learner' };
            if (state.widget === 'pca') detail = { ko: '변환', en: 'Transformation' };
            else if (state.widget === 'hierarchical') detail = { ko: '덴드로그램', en: 'Dendrogram' };
            else if (widget.category === 'unsupervised') detail = { ko: '군집화', en: 'Clustering' };
            return { role: 'model', icon: widget.icon, name: widget.shortName, detail };
        }
        return WORKFLOW_WIDGETS[node.key];
    }

    function buildRecommendationGraph(lane, compact) {
        const nodes = new Map();
        const edges = [];
        const edgeKeys = new Set();
        let firstSeen = 0;

        lane.paths.forEach((path) => {
            const pathNodes = path.nodes.filter(node => recommendationNodeMeta(node));
            pathNodes.forEach((node) => {
                const existing = nodes.get(node.instance);
                if (!existing) {
                    nodes.set(node.instance, {
                        ...node,
                        order: firstSeen,
                        details: node.detail ? [node.detail] : []
                    });
                    firstSeen += 1;
                } else {
                    existing.optional = existing.optional && node.optional;
                    if (node.detail && !existing.details.includes(node.detail)) existing.details.push(node.detail);
                }
            });

            const labelEdgeIndex = Math.max(0, Math.floor((pathNodes.length - 2) / 2));
            pathNodes.slice(0, -1).forEach((source, edgeIndex) => {
                const target = pathNodes[edgeIndex + 1];
                const explicitLabel = path.edgeLabels && path.edgeLabels[edgeIndex];
                const label = explicitLabel
                    ? localized(explicitLabel)
                    : (edgeIndex === labelEdgeIndex ? localized(path.label) : '');
                const edgeKey = `${source.instance}|${target.instance}|${label}`;
                if (edgeKeys.has(edgeKey)) return;
                edgeKeys.add(edgeKey);
                edges.push({ source: source.instance, target: target.instance, label });
            });
        });

        const nodeList = Array.from(nodes.values());
        const layoutEdges = [];
        const layoutEdgeKeys = new Set();
        edges.forEach((edge) => {
            const key = `${edge.source}|${edge.target}`;
            if (!layoutEdgeKeys.has(key)) {
                layoutEdgeKeys.add(key);
                layoutEdges.push(edge);
            }
        });

        const indegree = new Map(nodeList.map(node => [node.instance, 0]));
        const outgoing = new Map(nodeList.map(node => [node.instance, []]));
        const levels = new Map(nodeList.map(node => [node.instance, 0]));
        layoutEdges.forEach((edge) => {
            indegree.set(edge.target, (indegree.get(edge.target) || 0) + 1);
            outgoing.get(edge.source).push(edge.target);
        });

        const queue = nodeList.filter(node => indegree.get(node.instance) === 0).sort((a, b) => a.order - b.order);
        let queueIndex = 0;
        while (queueIndex < queue.length) {
            const source = queue[queueIndex];
            queueIndex += 1;
            outgoing.get(source.instance).forEach((targetId) => {
                levels.set(targetId, Math.max(levels.get(targetId), levels.get(source.instance) + 1));
                indegree.set(targetId, indegree.get(targetId) - 1);
                if (indegree.get(targetId) === 0) queue.push(nodes.get(targetId));
            });
        }

        const maxLevel = Math.max(0, ...Array.from(levels.values()));
        const columns = Array.from({ length: maxLevel + 1 }, () => []);
        nodeList.sort((a, b) => a.order - b.order).forEach((node) => columns[levels.get(node.instance)].push(node));

        const nodeWidth = compact ? 104 : 114;
        const nodeHeight = compact ? 96 : 104;
        const gapX = compact ? 72 : 118;
        const gapY = compact ? 14 : 20;
        const paddingX = compact ? 16 : 20;
        const paddingY = compact ? 40 : 44;
        const rowCount = Math.max(1, ...columns.map(column => column.length));
        const width = (paddingX * 2) + ((maxLevel + 1) * nodeWidth) + (maxLevel * gapX);
        const height = Math.max(compact ? 150 : 160, (paddingY * 2) + (rowCount * nodeHeight) + ((rowCount - 1) * gapY));
        const positions = new Map();

        columns.forEach((column, level) => {
            const columnHeight = (column.length * nodeHeight) + (Math.max(0, column.length - 1) * gapY);
            const startY = (height - columnHeight) / 2;
            column.forEach((node, row) => {
                positions.set(node.instance, {
                    x: paddingX + (level * (nodeWidth + gapX)),
                    y: startY + (row * (nodeHeight + gapY))
                });
            });
        });

        return { nodes: nodeList, edges, positions, levels, width, height, nodeWidth, nodeHeight, compact };
    }

    function renderRecommendationGraphNode(node, graph) {
        const widget = WIDGETS[state.widget];
        const meta = recommendationNodeMeta(node);
        const isModel = node.key === 'model';
        const position = graph.positions.get(node.instance);
        const name = localized(meta.name);
        const detailSource = node.details.length === 1 ? node.details[0] : meta.detail;
        const detail = localized(detailSource || meta.detail);
        const roleClass = meta.role === 'data' ? 'data-node' : (meta.role === 'model' ? 'model-node' : 'output-node');
        const categoryClass = isModel && widget.category === 'unsupervised' ? ' unsupervised-node' : '';
        const optionalClass = node.optional ? ' optional-node' : '';
        const optionalLabel = node.optional ? (currentLanguage() === 'ko' ? ', 선택 사항' : ', optional') : '';
        const accessibleLabel = `${name}${detail ? `, ${detail}` : ''}${optionalLabel}`;
        return `<div class="workflow-node recommendation-node ${roleClass}${categoryClass}${optionalClass}" style="left:${position.x}px;top:${position.y}px;width:${graph.nodeWidth}px" aria-label="${escapeHtml(accessibleLabel)}"><span class="workflow-node-icon"><i data-lucide="${escapeHtml(meta.icon)}" aria-hidden="true"></i></span><span class="recommendation-node-name">${escapeHtml(name)}</span><span class="recommendation-node-detail">${escapeHtml(detail)}</span></div>`;
    }

    function renderRecommendationGraphCanvas(lane, compact, accessibleName) {
        const graph = buildRecommendationGraph(lane, compact);
        const parallelGroups = new Map();
        let topTrack = 0;
        let bottomTrack = 0;
        graph.edges.forEach((edge) => {
            const key = `${edge.source}|${edge.target}`;
            if (!parallelGroups.has(key)) parallelGroups.set(key, []);
            parallelGroups.get(key).push(edge);
        });

        const edgeMarkup = graph.edges.map((edge) => {
            const source = graph.positions.get(edge.source);
            const target = graph.positions.get(edge.target);
            const parallels = parallelGroups.get(`${edge.source}|${edge.target}`);
            const parallelIndex = parallels.indexOf(edge);
            const offset = (parallelIndex - ((parallels.length - 1) / 2)) * 12;
            const portOffset = graph.compact ? 39 : 42;
            const sourceX = source.x + (graph.nodeWidth / 2) + portOffset;
            const targetX = target.x + (graph.nodeWidth / 2) - portOffset;
            const sourceY = source.y + 30 + offset;
            const targetY = target.y + 30 + offset;
            const curve = Math.max(24, (targetX - sourceX) * 0.46);
            const labelX = (sourceX + targetX) / 2;
            const levelSpan = graph.levels.get(edge.target) - graph.levels.get(edge.source);
            let pathData;
            let labelY;

            if (levelSpan > 1) {
                const useTopTrack = sourceY <= targetY;
                const trackIndex = useTopTrack ? topTrack : bottomTrack;
                if (useTopTrack) topTrack += 1;
                else bottomTrack += 1;
                const trackY = useTopTrack
                    ? 10 + (trackIndex * 8)
                    : graph.height - 10 - (trackIndex * 8);
                const bend = Math.min(68, Math.max(44, (targetX - sourceX) * 0.18));
                pathData = `M${sourceX} ${sourceY} C${sourceX + 20} ${sourceY} ${sourceX + bend - 20} ${trackY} ${sourceX + bend} ${trackY} L${targetX - bend} ${trackY} C${targetX - bend + 20} ${trackY} ${targetX - 20} ${targetY} ${targetX} ${targetY}`;
                labelY = trackY + (useTopTrack ? 12 : -6);
            } else {
                pathData = `M${sourceX} ${sourceY} C${sourceX + curve} ${sourceY} ${targetX - curve} ${targetY} ${targetX} ${targetY}`;
                labelY = ((sourceY + targetY) / 2) - 6;
            }
            const labelMarkup = edge.label
                ? `<text class="recommendation-edge-label" x="${labelX}" y="${labelY}" text-anchor="middle">${escapeHtml(edge.label)}</text>`
                : '';
            return `<path class="recommendation-edge" d="${pathData}"></path>${labelMarkup}`;
        }).join('');

        const nodeMarkup = graph.nodes.map(node => renderRecommendationGraphNode(node, graph)).join('');
        const connectionMarkup = graph.edges.map((edge) => {
            const sourceName = localized(recommendationNodeMeta(graph.nodes.find(node => node.instance === edge.source)).name);
            const targetName = localized(recommendationNodeMeta(graph.nodes.find(node => node.instance === edge.target)).name);
            const label = edge.label ? ` · ${edge.label}` : '';
            return `<li>${escapeHtml(sourceName)} → ${escapeHtml(targetName)}${escapeHtml(label)}</li>`;
        }).join('');
        const compactClass = compact ? ' compact' : '';

        const graphLabel = accessibleName || (currentLanguage() === 'ko' ? 'Orange3 위젯 연결 그래프' : 'Orange3 widget connection graph');
        return `<div class="recommendation-graph-shell${compactClass}" role="region" tabindex="0" aria-label="${escapeHtml(graphLabel)}"><div class="recommendation-graph-canvas" style="width:${graph.width}px;height:${graph.height}px"><svg class="recommendation-graph-edges" viewBox="0 0 ${graph.width} ${graph.height}" aria-hidden="true">${edgeMarkup}</svg>${nodeMarkup}<ol class="sr-only">${connectionMarkup}</ol></div></div>`;
    }

    function renderCurrentWorkflowGraph() {
        const widget = WIDGETS[state.widget];
        const isSupervised = widget.category === 'supervised';
        const paths = [
            { label: { ko: 'Data', en: 'Data' }, nodes: [recommendationNode('file'), recommendationNode('dataTable', null, false, 'sourceTable')] }
        ];

        if (isSupervised) {
            paths.push(
                { label: { ko: 'Data', en: 'Data' }, nodes: [recommendationNode('file'), recommendationNode('dataSampler')] },
                { label: { ko: 'Data Sample', en: 'Data Sample' }, nodes: [recommendationNode('dataSampler'), recommendationNode('model')] },
                { label: { ko: 'Preprocessor', en: 'Preprocessor' }, nodes: [recommendationNode('preprocess'), recommendationNode('model')] },
                { label: { ko: 'Data Sample', en: 'Data Sample' }, nodes: [recommendationNode('dataSampler'), recommendationNode('testAndScore')] },
                { label: { ko: 'Remaining Data', en: 'Remaining Data' }, nodes: [recommendationNode('dataSampler'), recommendationNode('predictions')] },
                { label: { ko: 'Learner', en: 'Learner' }, nodes: [recommendationNode('model'), recommendationNode('testAndScore')] },
                { label: { ko: 'Model', en: 'Model' }, nodes: [recommendationNode('model'), recommendationNode('predictions')] },
                { label: { ko: 'Evaluation Results', en: 'Evaluation Results' }, nodes: [recommendationNode('testAndScore'), recommendationNode('confusionMatrix')] },
                { label: { ko: 'Predictions', en: 'Predictions' }, nodes: [recommendationNode('predictions'), recommendationNode('dataTable', null, false, 'predictionTable')] }
            );
        } else if (state.widget === 'pca') {
            paths.push(
                {
                    label: { ko: '주성분 분석 입력', en: 'PCA input' },
                    nodes: [recommendationNode('file'), recommendationNode('preprocess'), recommendationNode('model')],
                    edgeLabels: [{ ko: 'Data', en: 'Data' }, { ko: 'Preprocessed Data', en: 'Preprocessed Data' }]
                },
                { label: { ko: 'Transformed Data', en: 'Transformed Data' }, nodes: [recommendationNode('model'), recommendationNode('scatterPlot')] },
                { label: { ko: 'Transformed Data', en: 'Transformed Data' }, nodes: [recommendationNode('model'), recommendationNode('dataTable')] }
            );
        } else {
            const preparation = [recommendationNode('file'), recommendationNode('preprocess')];
            if (state.widget === 'hierarchical') preparation.push(recommendationNode('distances'));
            preparation.push(recommendationNode('model'));
            const preparationEdges = [
                { ko: 'Data', en: 'Data' },
                { ko: 'Preprocessed Data', en: 'Preprocessed Data' }
            ];
            if (state.widget === 'hierarchical') preparationEdges.push({ ko: 'Distances', en: 'Distances' });
            paths.push(
                { label: { ko: '군집 입력', en: 'Clustering input' }, nodes: preparation, edgeLabels: preparationEdges },
                { label: { ko: 'Data', en: 'Data' }, nodes: [recommendationNode('model'), recommendationNode('scatterPlot')] },
                { label: { ko: 'Data', en: 'Data' }, nodes: [recommendationNode('model'), recommendationNode('silhouettePlot')] },
                { label: { ko: 'Selected Data', en: 'Selected Data' }, nodes: [recommendationNode('silhouettePlot'), recommendationNode('scatterPlot')] }
            );
        }

        elements.currentWorkflowGraph.setAttribute('aria-label', currentLanguage() === 'ko'
            ? `${localized(widget.name)}의 분기와 합류 연결 요약`
            : `Branching and merging workflow for ${localized(widget.name)}`);
        elements.currentWorkflowGraph.innerHTML = renderRecommendationGraphCanvas(
            { paths },
            true,
            currentLanguage() === 'ko' ? `${localized(widget.name)} 연결 요약` : `${localized(widget.name)} workflow summary`
        );
    }

    function updateRangeProgress(input, param) {
        const minimum = Number(param.min);
        const maximum = Number(param.max);
        const progress = ((Number(input.value) - minimum) / Math.max(1e-9, maximum - minimum)) * 100;
        input.style.setProperty('--range-progress', `${progress}%`);
    }

    function renderParameterControls() {
        const widget = WIDGETS[state.widget];
        const values = state.values[state.widget];
        elements.parameterControls.innerHTML = '';
        widget.params.filter(param => shouldShowParameter(param, values)).forEach(param => {
            if (param.type === 'checkbox') {
                const wrapper = document.createElement('div');
                wrapper.className = 'checkbox-field';
                const id = `param-${state.widget}-${param.key}`;
                wrapper.innerHTML = `<input id="${id}" name="${param.key}" type="checkbox" ${values[param.key] ? 'checked' : ''}><span class="checkbox-copy"><label for="${id}">${escapeHtml(localized(param.label))}</label>${param.hint ? `<span class="parameter-hint">${escapeHtml(localized(param.hint))}</span>` : ''}</span>`;
                const input = wrapper.querySelector('input');
                input.addEventListener('change', () => {
                    values[param.key] = input.checked;
                    updateSimulation();
                });
                elements.parameterControls.appendChild(wrapper);
                return;
            }

            const field = document.createElement('div');
            field.className = 'parameter-field';
            const id = `param-${state.widget}-${param.key}`;
            if (param.type === 'select') {
                field.innerHTML = `<label for="${id}">${escapeHtml(localized(param.label))}</label><select id="${id}" name="${param.key}">${param.options.map(option => `<option value="${option.value}" ${option.value === values[param.key] ? 'selected' : ''}>${escapeHtml(localized(option))}</option>`).join('')}</select>${param.hint ? `<span class="parameter-hint">${escapeHtml(localized(param.hint))}</span>` : ''}`;
                const select = field.querySelector('select');
                select.addEventListener('change', () => {
                    values[param.key] = select.value;
                    renderParameterControls();
                    updateSimulation();
                });
            } else {
                const display = formatParameterValue(param, values[param.key]);
                field.innerHTML = `<div class="parameter-label-row"><label for="${id}">${escapeHtml(localized(param.label))}</label><output class="parameter-output" for="${id}">${escapeHtml(display)}</output></div><input id="${id}" name="${param.key}" type="range" min="${param.min}" max="${param.max}" step="${param.step}" value="${values[param.key]}">${param.hint ? `<span class="parameter-hint">${escapeHtml(localized(param.hint))}</span>` : ''}`;
                const input = field.querySelector('input');
                const output = field.querySelector('output');
                updateRangeProgress(input, param);
                input.addEventListener('input', () => {
                    values[param.key] = Number(input.value);
                    output.textContent = formatParameterValue(param, values[param.key]);
                    updateRangeProgress(input, param);
                    updateSimulation();
                });
            }
            elements.parameterControls.appendChild(field);
        });
    }

    function updateWidgetChrome() {
        const widget = WIDGETS[state.widget];
        elements.parameterPanelTitle.textContent = localized(widget.name);
        elements.widgetDescription.textContent = localized(widget.description);
        elements.selectedWidgetIcon.className = `selected-widget-icon${widget.category === 'unsupervised' ? ' unsupervised' : ''}`;
        elements.selectedWidgetIcon.innerHTML = `<i data-lucide="${widget.icon}" aria-hidden="true"></i>`;
        elements.simulationModeBadge.textContent = widget.category === 'supervised'
            ? (currentLanguage() === 'ko' ? '지도학습' : 'Supervised')
            : (currentLanguage() === 'ko' ? '비지도학습' : 'Unsupervised');
        elements.simulationModeBadge.classList.toggle('unsupervised', widget.category === 'unsupervised');
        renderWidgetButtons();
        renderCurrentWorkflowGraph();
        refreshLucideIcons();
    }

    function selectWidget(widgetKey) {
        if (!WIDGETS[widgetKey]) return;
        const previousCategory = WIDGETS[state.widget].category;
        state.widget = widgetKey;
        const nextCategory = WIDGETS[state.widget].category;
        if (previousCategory !== nextCategory || !CATEGORY_DATASETS[nextCategory].some(option => option.value === state.dataset)) {
            state.dataset = nextCategory === 'supervised' ? 'moons' : 'blobs';
            generatePoints();
        }
        renderDatasetOptions();
        updateWidgetChrome();
        renderParameterControls();
        updateSimulation();
    }

    function resetCurrentParameters() {
        const widget = WIDGETS[state.widget];
        widget.params.forEach(param => { state.values[state.widget][param.key] = param.value; });
        renderParameterControls();
        updateSimulation();
    }

    function formatPercent(value, digits) {
        return `${(value * 100).toFixed(digits === undefined ? 1 : digits)}%`;
    }

    function complexityText(widgetKey, complexity) {
        const lang = currentLanguage();
        if (widgetKey === 'neuralNetwork') return lang === 'ko' ? `${complexity.toLocaleString()}개 가중치` : `${complexity.toLocaleString()} weights`;
        if (widgetKey === 'randomForest') return lang === 'ko' ? `약 ${complexity.toLocaleString()}개 노드` : `~${complexity.toLocaleString()} nodes`;
        if (widgetKey === 'logisticRegression') return lang === 'ko' ? `${complexity}개 계수` : `${complexity} coefficients`;
        if (widgetKey === 'svm') return lang === 'ko' ? `지수 ${complexity}` : `index ${complexity}`;
        if (widgetKey === 'knn') return lang === 'ko' ? `k = ${complexity}` : `k = ${complexity}`;
        return String(complexity);
    }

    function metricQualityLabel(score) {
        const lang = currentLanguage();
        if (score >= 0.82) return lang === 'ko' ? '뚜렷한 구조' : 'clear structure';
        if (score >= 0.55) return lang === 'ko' ? '보통 구조' : 'moderate structure';
        if (score > 0) return lang === 'ko' ? '약한 구조' : 'weak structure';
        return lang === 'ko' ? '군집 구분 어려움' : 'clusters overlap';
    }

    function updateMetrics() {
        const result = state.result;
        const lang = currentLanguage();
        if (result.type === 'supervised') {
            elements.metricOneLabel.textContent = lang === 'ko' ? '검증 정확도 (CA)' : 'Validation accuracy (CA)';
            elements.metricOneValue.textContent = formatPercent(result.validationMetrics.accuracy);
            elements.metricOneDelta.textContent = lang === 'ko' ? `로그 손실(LogLoss) ${result.validationMetrics.logLoss.toFixed(3)}` : `LogLoss ${result.validationMetrics.logLoss.toFixed(3)}`;
            elements.metricTwoLabel.textContent = lang === 'ko' ? 'F1 / 일반화 차이' : 'F1 / generalization gap';
            elements.metricTwoValue.textContent = result.validationMetrics.f1.toFixed(3);
            elements.metricTwoDelta.textContent = lang === 'ko' ? `학습-검증 ${formatPercent(result.gap)}` : `train-validation ${formatPercent(result.gap)}`;
            elements.metricThreeLabel.textContent = lang === 'ko' ? '모델 복잡도' : 'Model complexity';
            elements.metricThreeValue.textContent = result.complexity.toLocaleString();
            elements.metricThreeDelta.textContent = complexityText(state.widget, result.complexity);
            elements.metricFourLabel.textContent = lang === 'ko' ? '예상 학습 시간' : 'Estimated fit time';
            elements.metricFourValue.textContent = `${Math.max(1, Math.round(result.fitTime))} ms`;
            elements.metricFourDelta.textContent = lang === 'ko' ? '현재 브라우저 표본 기준' : 'for this browser sample';
        } else if (state.widget === 'pca') {
            const components = valueFor('pca', 'components');
            const retained = result.retainedVariance;
            elements.metricOneLabel.textContent = lang === 'ko' ? '누적 설명분산' : 'Cumulative variance';
            elements.metricOneValue.textContent = formatPercent(retained);
            elements.metricOneDelta.textContent = lang === 'ko' ? `PC ${components}개 유지` : `${components} PCs retained`;
            elements.metricTwoLabel.textContent = lang === 'ko' ? '추정 재구성 손실' : 'Estimated reconstruction loss';
            elements.metricTwoValue.textContent = formatPercent(1 - retained);
            elements.metricTwoDelta.textContent = lang === 'ko' ? '제거된 분산 비율' : 'variance discarded';
            elements.metricThreeLabel.textContent = lang === 'ko' ? '출력 차원' : 'Output dimensions';
            elements.metricThreeValue.textContent = `${components}D`;
            elements.metricThreeDelta.textContent = lang === 'ko' ? '입력 3D → 압축' : 'input 3D → compressed';
            elements.metricFourLabel.textContent = lang === 'ko' ? '예상 변환 시간' : 'Estimated transform time';
            elements.metricFourValue.textContent = `${Math.max(1, Math.round(result.fitTime))} ms`;
            elements.metricFourDelta.textContent = lang === 'ko' ? `${state.points.length}개 표본` : `${state.points.length} samples`;
        } else {
            elements.metricOneLabel.textContent = lang === 'ko' ? '실루엣 (Silhouette)' : 'Silhouette';
            elements.metricOneValue.textContent = result.clusterCount > 1 ? result.silhouette.toFixed(3) : '—';
            elements.metricOneDelta.textContent = metricQualityLabel(result.silhouette);
            elements.metricTwoLabel.textContent = lang === 'ko' ? '발견한 군집' : 'Clusters found';
            elements.metricTwoValue.textContent = String(result.clusterCount);
            elements.metricTwoDelta.textContent = lang === 'ko' ? `${result.noise || 0}개 잡음` : `${result.noise || 0} noise points`;
            elements.metricThreeLabel.textContent = state.widget === 'dbscan' ? (lang === 'ko' ? '핵심점' : 'Core points') : (lang === 'ko' ? '구조 복잡도' : 'Structure complexity');
            elements.metricThreeValue.textContent = result.complexity.toLocaleString();
            elements.metricThreeDelta.textContent = state.widget === 'dbscan' ? (lang === 'ko' ? '밀도 연결의 시작점' : 'density anchors') : (lang === 'ko' ? '현재 설정 기준' : 'current configuration');
            elements.metricFourLabel.textContent = lang === 'ko' ? '예상 계산 시간' : 'Estimated compute time';
            elements.metricFourValue.textContent = `${Math.max(1, Math.round(result.fitTime))} ms`;
            elements.metricFourDelta.textContent = lang === 'ko' ? `${state.points.length}개 표본` : `${state.points.length} samples`;
        }
    }

    function insightForCurrentWidget() {
        const values = state.values[state.widget];
        const lang = currentLanguage();
        if (state.widget === 'neuralNetwork') {
            const parameterCount = state.result.complexity;
            const structure = `2 → ${new Array(values.layers).fill(values.neurons).join(' → ')} → 1`;
            return lang === 'ko'
                ? { title: `${structure} 구조 · 약 ${parameterCount.toLocaleString()}개 가중치`, text: `${optionLabel('neuralNetwork', 'activation', values.activation)} 활성화와 ${optionLabel('neuralNetwork', 'solver', values.solver)} 최적화를 사용합니다. 층과 뉴런을 늘리면 더 굽은 경계를 표현하지만, 검증 곡선이 다시 상승하면 과적합 신호입니다.` }
                : { title: `${structure} · about ${parameterCount.toLocaleString()} weights`, text: `Uses ${values.activation} activation with ${values.solver}. More layers and neurons can represent a more curved boundary, but a rising validation curve signals overfitting.` };
        }
        if (state.widget === 'logisticRegression') {
            const c = formatParameterValue(WIDGETS.logisticRegression.params[1], values.cLog);
            return lang === 'ko'
                ? { title: `${values.regularization.toUpperCase()} 규제 · C = ${c}`, text: '로지스틱 회귀의 경계는 항상 직선입니다. C가 작을수록 계수가 더 강하게 줄어 안정적이지만, 달·원처럼 휜 패턴은 구조적으로 표현하기 어렵습니다.' }
                : { title: `${values.regularization.toUpperCase()} regularization · C = ${c}`, text: 'The logistic boundary remains linear. Smaller C shrinks coefficients more strongly, which can stabilize the model but cannot represent moons or rings.' };
        }
        if (state.widget === 'randomForest') {
            return lang === 'ko'
                ? { title: `${values.trees}개 트리의 다수결`, text: `깊이 ${values.depth}의 트리는 공간을 계단 모양으로 나눕니다. 트리를 늘리면 투표가 안정되지만 학습 시간도 늘고, 깊이가 지나치면 작은 잡음까지 외울 수 있습니다.` }
                : { title: `Majority vote from ${values.trees} trees`, text: `Depth-${values.depth} trees partition space into steps. More trees stabilize voting but take longer; excessive depth can memorize noise.` };
        }
        if (state.widget === 'svm') {
            const gammaText = values.kernel === 'linear' ? '—' : formatParameterValue(WIDGETS.svm.params.find(param => param.key === 'gammaLog'), values.gammaLog);
            return lang === 'ko'
                ? { title: `${optionLabel('svm', 'kernel', values.kernel)} 커널 · γ ${gammaText}`, text: `C가 크면 오분류를 더 강하게 벌하고, γ가 크면 각 표본의 영향 범위가 좁아져 경계가 복잡해집니다. 붉은 고리는 현재 여백에 가까운 서포트 벡터입니다.` }
                : { title: `${values.kernel.toUpperCase()} kernel · γ ${gammaText}`, text: `Larger C penalizes mistakes more. Larger γ narrows each sample's influence and creates a more flexible boundary. Red rings mark points near the current margin.` };
        }
        if (state.widget === 'knn') {
            return lang === 'ko'
                ? { title: `${values.neighbors}개 이웃 · ${optionLabel('knn', 'metric', values.metric)} 거리`, text: `k가 작으면 국소 패턴과 잡음에 민감하고, 크면 경계가 부드러워집니다. 중앙의 별표와 연결선은 한 질의점에 실제로 투표한 이웃입니다.` }
                : { title: `${values.neighbors} neighbors · ${values.metric} distance`, text: `Small k follows local detail and noise; large k smooths the boundary. Lines from the center star show the neighbors voting for one query point.` };
        }
        if (state.widget === 'kmeans') {
            return lang === 'ko'
                ? { title: `${values.clusters}개 중심 · ${values.reruns}회 재실행`, text: '중심의 위치와 초기화가 결과를 바꿉니다. 재실행을 늘리면 더 낮은 군집 내 제곱합을 찾을 가능성이 커지지만, 고리처럼 볼록하지 않은 군집에는 한계가 있습니다.' }
                : { title: `${values.clusters} centroids · ${values.reruns} reruns`, text: 'Initialization changes the result. More reruns improve the chance of lower within-cluster sum of squares, but ring-shaped clusters remain difficult.' };
        }
        if (state.widget === 'hierarchical') {
            return lang === 'ko'
                ? { title: `${optionLabel('hierarchical', 'linkage', values.linkage)} · 상위 ${values.clusters}개 군집`, text: values.pruning === 0 ? '연결 방식이 군집 사이의 거리를 정의해 합쳐지는 순서를 바꿉니다.' : `가지치기 깊이 ${values.pruning}은 덴드로그램 표시만 줄이며, 점의 군집 배정과 Silhouette 값은 바꾸지 않습니다.` }
                : { title: `${values.linkage} linkage · top ${values.clusters} clusters`, text: values.pruning === 0 ? 'Linkage defines distance between clusters and changes merge order.' : `Pruning depth ${values.pruning} simplifies only the dendrogram display; assignments and Silhouette stay unchanged.` };
        }
        if (state.widget === 'dbscan') {
            return lang === 'ko'
                ? { title: `ε ${values.epsilon.toFixed(2)} · 최소 이웃 ${values.minNeighbors}개`, text: `반경이 커지면 군집이 서로 합쳐지고 잡음은 줄어드는 경향이 있습니다. 사각형은 핵심점, 회색 ×는 어느 군집에도 포함되지 않은 잡음입니다.` }
                : { title: `ε ${values.epsilon.toFixed(2)} · ${values.minNeighbors} minimum neighbors`, text: `A larger radius tends to merge clusters and reduce noise. Squares are core points; gray × marks samples not assigned to a cluster.` };
        }
        const retained = state.result.retainedVariance;
        return lang === 'ko'
            ? { title: `${values.components}개 성분으로 ${formatPercent(retained)} 보존`, text: `목표 설명분산 ${values.varianceTarget}%와 실제 누적분산을 비교하세요. 정규화는 단위가 큰 변수가 주성분 방향을 지배하지 않도록 합니다.` }
            : { title: `${formatPercent(retained)} retained in ${values.components} components`, text: `Compare the ${values.varianceTarget}% target with actual cumulative variance. Normalization prevents large-scale variables from dominating the principal directions.` };
    }

    function updateInsight() {
        const insight = insightForCurrentWidget();
        elements.insightTitle.textContent = insight.title;
        elements.insightText.textContent = insight.text;
    }

    function classNameForCluster(cluster) {
        if (cluster < 0) return 'orange-point-noise';
        return ['orange-point-a', 'orange-point-b', 'orange-point-c'][cluster % 3];
    }

    function boundaryClassForPrediction(prediction) {
        return prediction === 0 ? 'orange-boundary-a' : (prediction === 1 ? 'orange-boundary-b' : 'orange-boundary-c');
    }

    function plotScale(points, width, height) {
        const margin = { left: 48, right: 18, top: 18, bottom: 38 };
        const xs = points.map(point => point.x);
        const ys = points.map(point => point.y);
        let minX = Math.min(...xs);
        let maxX = Math.max(...xs);
        let minY = Math.min(...ys);
        let maxY = Math.max(...ys);
        const padX = Math.max(0.15, (maxX - minX) * 0.1);
        const padY = Math.max(0.15, (maxY - minY) * 0.1);
        minX -= padX; maxX += padX; minY -= padY; maxY += padY;
        return {
            margin, minX, maxX, minY, maxY,
            x: value => margin.left + ((value - minX) / Math.max(1e-9, maxX - minX)) * (width - margin.left - margin.right),
            y: value => height - margin.bottom - ((value - minY) / Math.max(1e-9, maxY - minY)) * (height - margin.top - margin.bottom)
        };
    }

    function gridMarkup(scale, width, height) {
        const lang = currentLanguage();
        let markup = '';
        const plotWidth = width - scale.margin.left - scale.margin.right;
        const plotHeight = height - scale.margin.top - scale.margin.bottom;
        for (let i = 0; i <= 5; i += 1) {
            const x = scale.margin.left + (plotWidth * i) / 5;
            const y = scale.margin.top + (plotHeight * i) / 5;
            markup += `<line x1="${x}" y1="${scale.margin.top}" x2="${x}" y2="${height - scale.margin.bottom}" class="orange-plot-grid"></line>`;
            markup += `<line x1="${scale.margin.left}" y1="${y}" x2="${width - scale.margin.right}" y2="${y}" class="orange-plot-grid"></line>`;
        }
        markup += `<line x1="${scale.margin.left}" y1="${height - scale.margin.bottom}" x2="${width - scale.margin.right}" y2="${height - scale.margin.bottom}" class="orange-plot-axis"></line>`;
        markup += `<line x1="${scale.margin.left}" y1="${scale.margin.top}" x2="${scale.margin.left}" y2="${height - scale.margin.bottom}" class="orange-plot-axis"></line>`;
        markup += `<text x="${width / 2}" y="${height - 9}" class="orange-plot-label" text-anchor="middle">${lang === 'ko' ? '특성 1' : 'Feature 1'}</text>`;
        markup += `<text x="15" y="${height / 2}" class="orange-plot-label" text-anchor="middle" transform="rotate(-90 15 ${height / 2})">${lang === 'ko' ? '특성 2' : 'Feature 2'}</text>`;
        return markup;
    }

    function renderSupervisedPlot() {
        const width = 640;
        const height = 400;
        const scale = plotScale(state.points, width, height);
        const predictor = state.result.predictor;
        const columns = 26;
        const rows = 17;
        const cellWidth = (width - scale.margin.left - scale.margin.right) / columns;
        const cellHeight = (height - scale.margin.top - scale.margin.bottom) / rows;
        let markup = `<rect x="${scale.margin.left}" y="${scale.margin.top}" width="${width - scale.margin.left - scale.margin.right}" height="${height - scale.margin.top - scale.margin.bottom}" class="orange-boundary-a"></rect>`;
        for (let row = 0; row < rows; row += 1) {
            for (let column = 0; column < columns; column += 1) {
                const xValue = scale.minX + ((column + 0.5) / columns) * (scale.maxX - scale.minX);
                const yValue = scale.maxY - ((row + 0.5) / rows) * (scale.maxY - scale.minY);
                const prediction = predictor({ x: xValue, y: yValue }) >= 0 ? 1 : 0;
                markup += `<rect x="${scale.margin.left + column * cellWidth}" y="${scale.margin.top + row * cellHeight}" width="${cellWidth + 0.4}" height="${cellHeight + 0.4}" class="${boundaryClassForPrediction(prediction)}"></rect>`;
            }
        }
        markup += gridMarkup(scale, width, height);

        if (state.widget === 'knn') {
            const query = { x: 0.08, y: 0.06 };
            const neighbors = nearestNeighbors(query, valueFor('knn', 'neighbors'), valueFor('knn', 'metric'));
            neighbors.forEach(neighbor => {
                markup += `<line x1="${scale.x(query.x)}" y1="${scale.y(query.y)}" x2="${scale.x(neighbor.point.x)}" y2="${scale.y(neighbor.point.y)}" class="orange-dashed-line" opacity="0.72"></line>`;
            });
        }

        const supportSet = new Set(state.result.supportVectors || []);
        state.points.forEach((point, index) => {
            const x = scale.x(point.x);
            const y = scale.y(point.y);
            if (supportSet.has(point)) markup += `<circle cx="${x}" cy="${y}" r="8.2" class="orange-support-ring"></circle>`;
            markup += `<circle cx="${x}" cy="${y}" r="4.6" class="${classNameForCluster(point.label)}${point.validation ? ' orange-validation-ring' : ''}"><title>${currentLanguage() === 'ko' ? '검증' : 'validation'} · (${point.x.toFixed(2)}, ${point.y.toFixed(2)})</title></circle>`;
        });

        if (state.widget === 'knn') {
            const query = { x: 0.08, y: 0.06 };
            const qx = scale.x(query.x);
            const qy = scale.y(query.y);
            markup += `<path d="M ${qx} ${qy - 9} L ${qx + 2.7} ${qy - 3} L ${qx + 9} ${qy - 2.5} L ${qx + 4} ${qy + 2} L ${qx + 5.5} ${qy + 8} L ${qx} ${qy + 4.8} L ${qx - 5.5} ${qy + 8} L ${qx - 4} ${qy + 2} L ${qx - 9} ${qy - 2.5} L ${qx - 2.7} ${qy - 3} Z" class="orange-node-accent"></path>`;
        }

        elements.primaryVisual.innerHTML = markup;
        const lang = currentLanguage();
        elements.primaryVisualTitle.textContent = lang === 'ko' ? '결정 경계와 검증 표본' : 'Decision boundary and validation samples';
        elements.plotLegend.innerHTML = `<span class="legend-item"><span class="legend-swatch" style="--legend-color:var(--orange-lab-class-a)"></span>${lang === 'ko' ? '클래스 A' : 'Class A'}</span><span class="legend-item"><span class="legend-swatch" style="--legend-color:var(--orange-lab-class-b)"></span>${lang === 'ko' ? '클래스 B' : 'Class B'}</span><span class="legend-item"><span class="legend-swatch hollow" style="--legend-color:var(--orange-lab-ink)"></span>${lang === 'ko' ? '검증 표본' : 'Validation'}</span>${state.widget === 'svm' ? `<span class="legend-item"><span class="legend-swatch hollow" style="--legend-color:var(--orange-lab-red)"></span>${lang === 'ko' ? '서포트 벡터' : 'Support vector'}</span>` : ''}`;
    }

    function renderUnsupervisedPlot() {
        const width = 640;
        const height = 400;
        const lang = currentLanguage();
        const points = state.widget === 'pca' ? state.result.pca.projected : state.points;
        const scale = plotScale(points, width, height);
        let markup = gridMarkup(scale, width, height);

        if (state.widget === 'dbscan') {
            const coreIndex = state.result.core.findIndex(Boolean);
            if (coreIndex >= 0) {
                const point = state.points[coreIndex];
                const radius = valueFor('dbscan', 'epsilon') * ((width - scale.margin.left - scale.margin.right) / (scale.maxX - scale.minX));
                markup += `<circle cx="${scale.x(point.x)}" cy="${scale.y(point.y)}" r="${radius}" class="orange-radius"></circle>`;
            }
        }

        points.forEach((point, index) => {
            const assignment = state.widget === 'pca' ? point.label : state.result.assignments[index];
            const x = scale.x(point.x);
            const y = scale.y(point.y);
            if (assignment < 0) {
                markup += `<path d="M ${x - 4} ${y - 4} L ${x + 4} ${y + 4} M ${x + 4} ${y - 4} L ${x - 4} ${y + 4}" class="orange-dashed-line"></path>`;
            } else if (state.widget === 'dbscan' && state.result.core[index]) {
                markup += `<rect x="${x - 4.8}" y="${y - 4.8}" width="9.6" height="9.6" rx="1.5" class="${classNameForCluster(assignment)}"><title>${lang === 'ko' ? '핵심점' : 'core point'}</title></rect>`;
            } else {
                markup += `<circle cx="${x}" cy="${y}" r="4.7" class="${classNameForCluster(assignment)}"><title>${lang === 'ko' ? '군집' : 'cluster'} ${assignment + 1}</title></circle>`;
            }
        });

        if (state.result.centroids) {
            state.result.centroids.forEach((centroid, index) => {
                const x = scale.x(centroid.x);
                const y = scale.y(centroid.y);
                markup += `<path d="M ${x - 8} ${y} L ${x + 8} ${y} M ${x} ${y - 8} L ${x} ${y + 8}" class="orange-model-line"><title>${lang === 'ko' ? '중심' : 'centroid'} ${index + 1}</title></path>`;
            });
        }

        if (state.widget === 'pca') {
            const originX = scale.x(0);
            const originY = scale.y(0);
            const vector = state.result.pca.pairs[0].vector;
            const length = 80;
            markup += `<line x1="${originX - vector[0] * length}" y1="${originY + vector[1] * length}" x2="${originX + vector[0] * length}" y2="${originY - vector[1] * length}" class="orange-model-line"></line>`;
            markup += `<text x="${originX + vector[0] * length + 16}" y="${originY - vector[1] * length}" class="orange-plot-title">PC1</text>`;
        }

        elements.primaryVisual.innerHTML = markup;
        elements.primaryVisualTitle.textContent = state.widget === 'pca' ? (lang === 'ko' ? '주성분 좌표로 투영' : 'Projection into principal components') : (lang === 'ko' ? '군집 배정 결과' : 'Cluster assignments');
        elements.plotLegend.innerHTML = `<span class="legend-item"><span class="legend-swatch" style="--legend-color:var(--orange-lab-class-a)"></span>${lang === 'ko' ? '군집 1' : 'Cluster 1'}</span><span class="legend-item"><span class="legend-swatch" style="--legend-color:var(--orange-lab-class-b)"></span>${lang === 'ko' ? '군집 2' : 'Cluster 2'}</span><span class="legend-item"><span class="legend-swatch" style="--legend-color:var(--orange-lab-class-c)"></span>${lang === 'ko' ? '군집 3' : 'Cluster 3'}</span>${state.widget === 'dbscan' ? `<span class="legend-item"><span class="legend-swatch square" style="--legend-color:var(--orange-lab-muted)"></span>${lang === 'ko' ? '핵심점 / × 잡음' : 'Core / × noise'}</span>` : ''}`;
    }

    function renderPrimaryVisual() {
        const validationCount = state.points.filter(point => point.validation).length;
        const lang = currentLanguage();
        elements.primaryVisual.setAttribute('aria-label', lang === 'ko' ? '현재 위젯의 결정 경계 또는 군집 배정 결과' : 'Decision boundary or cluster assignments for the current widget');
        elements.datasetSummary.textContent = `${datasetLabel(state.dataset)} · ${state.points.length}${lang === 'ko' ? '개 점' : ' points'}${WIDGETS[state.widget].category === 'supervised' ? ` · ${validationCount}${lang === 'ko' ? '개 검증' : ' validation'}` : ''}`;
        if (WIDGETS[state.widget].category === 'supervised') renderSupervisedPlot();
        else renderUnsupervisedPlot();
    }

    function structureNode(x, y, width, height, label, cssClass) {
        return `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="7" class="${cssClass || 'orange-node'}"></rect><text x="${x + width / 2}" y="${y + height / 2 + 4}" class="orange-svg-label">${escapeHtml(label)}</text>`;
    }

    function arrowMarkup(x1, y1, x2, y2, active) {
        const cssClass = active ? 'orange-connector-active' : 'orange-connector';
        return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${cssClass}"></line><path d="M ${x2 - 7} ${y2 - 4} L ${x2} ${y2} L ${x2 - 7} ${y2 + 4}" fill="none" class="${cssClass}"></path>`;
    }

    function renderNeuralStructure(values) {
        const lang = currentLanguage();
        const layers = [{ count: 2, label: lang === 'ko' ? '입력' : 'Input' }];
        for (let i = 0; i < values.layers; i += 1) layers.push({ count: values.neurons, label: lang === 'ko' ? `은닉 ${i + 1}` : `Hidden ${i + 1}` });
        layers.push({ count: 1, label: lang === 'ko' ? '출력' : 'Output' });
        const width = 520;
        const xPositions = layers.map((layer, index) => 55 + index * (410 / Math.max(1, layers.length - 1)));
        let markup = '';
        const visibleNodes = layers.map(layer => Math.min(6, layer.count));
        for (let layer = 0; layer < layers.length - 1; layer += 1) {
            const sourceCount = visibleNodes[layer];
            const targetCount = visibleNodes[layer + 1];
            for (let source = 0; source < sourceCount; source += 1) {
                const sourceY = 62 + (source + 1) * (168 / (sourceCount + 1));
                for (let target = 0; target < targetCount; target += 1) {
                    const targetY = 62 + (target + 1) * (168 / (targetCount + 1));
                    markup += `<line x1="${xPositions[layer] + 10}" y1="${sourceY}" x2="${xPositions[layer + 1] - 10}" y2="${targetY}" class="${layer === layers.length - 2 ? 'orange-connector-active' : 'orange-connector'}" opacity="${0.35 + target / Math.max(8, targetCount * 2)}"></line>`;
                }
            }
        }
        layers.forEach((layer, layerIndex) => {
            const count = visibleNodes[layerIndex];
            for (let nodeIndex = 0; nodeIndex < count; nodeIndex += 1) {
                const y = 62 + (nodeIndex + 1) * (168 / (count + 1));
                const cssClass = layerIndex === 0 ? 'orange-node-blue' : (layerIndex === layers.length - 1 ? 'orange-node-accent' : 'orange-node');
                markup += `<circle cx="${xPositions[layerIndex]}" cy="${y}" r="10" class="${cssClass}"></circle>`;
            }
            if (layer.count > 6) markup += `<text x="${xPositions[layerIndex]}" y="244" class="orange-svg-small">+${layer.count - 6}</text>`;
            markup += `<text x="${xPositions[layerIndex]}" y="276" class="orange-svg-label">${layer.label}</text><text x="${xPositions[layerIndex]}" y="294" class="orange-svg-small">${layer.count}</text>`;
        });
        markup += `<text x="260" y="29" class="orange-plot-title" text-anchor="middle">${escapeHtml(optionLabel('neuralNetwork', 'activation', values.activation))} · ${escapeHtml(optionLabel('neuralNetwork', 'solver', values.solver))}</text>`;
        return markup;
    }

    function renderForestStructure(values) {
        const lang = currentLanguage();
        let markup = `<text x="260" y="26" class="orange-plot-title" text-anchor="middle">${lang === 'ko' ? '부트스트랩 표본 + 무작위 특성' : 'Bootstrap samples + random attributes'}</text>`;
        const shown = Math.min(5, values.trees);
        for (let tree = 0; tree < shown; tree += 1) {
            const offsetX = 35 + tree * 82;
            const levels = Math.min(3, values.depth);
            markup += `<circle cx="${offsetX + 28}" cy="64" r="6" class="orange-node-accent"></circle>`;
            for (let level = 1; level <= levels; level += 1) {
                const nodes = Math.pow(2, level);
                const spacing = 58 / nodes;
                for (let node = 0; node < nodes; node += 1) {
                    const x = offsetX + node * spacing + spacing / 2;
                    const y = 64 + level * 42;
                    const parentX = offsetX + Math.floor(node / 2) * (spacing * 2) + spacing;
                    const parentY = y - 42;
                    markup += `<line x1="${parentX}" y1="${parentY + 6}" x2="${x}" y2="${y - 5}" class="orange-connector"></line><circle cx="${x}" cy="${y}" r="5" class="orange-node"></circle>`;
                }
            }
            markup += arrowMarkup(offsetX + 28, 205, 260, 246, true);
        }
        markup += structureNode(210, 235, 100, 42, lang === 'ko' ? '다수결' : 'Majority vote', 'orange-node-accent');
        markup += `<text x="470" y="108" class="orange-svg-label">× ${values.trees}</text><text x="470" y="126" class="orange-svg-small">${lang === 'ko' ? '깊이' : 'depth'} ${values.depth}</text>`;
        return markup;
    }

    function renderLogisticStructure(values) {
        const lang = currentLanguage();
        let markup = '';
        markup += structureNode(24, 68, 82, 40, lang === 'ko' ? '특성 x₁' : 'Feature x₁', 'orange-node-blue');
        markup += structureNode(24, 150, 82, 40, lang === 'ko' ? '특성 x₂' : 'Feature x₂', 'orange-node-blue');
        markup += arrowMarkup(106, 88, 184, 118, false) + arrowMarkup(106, 170, 184, 142, false);
        markup += structureNode(184, 105, 105, 48, 'z = w·x + b', 'orange-node');
        markup += arrowMarkup(289, 129, 347, 129, true);
        markup += structureNode(347, 105, 76, 48, 'σ(z)', 'orange-node-accent');
        markup += arrowMarkup(423, 129, 478, 129, true);
        markup += `<circle cx="492" cy="129" r="17" class="orange-node-accent"></circle><text x="492" y="133" class="orange-svg-label">ŷ</text>`;
        markup += `<path d="M 330 246 C 350 246 354 218 372 218 C 391 218 392 173 413 173 C 434 173 437 145 460 145" class="orange-model-line"></path>`;
        markup += `<line x1="330" y1="260" x2="470" y2="260" class="orange-plot-axis"></line><line x1="330" y1="260" x2="330" y2="178" class="orange-plot-axis"></line>`;
        markup += `<text x="158" y="244" class="orange-svg-label">${lang === 'ko' ? '손실' : 'Loss'} + ${values.regularization.toUpperCase()} ${lang === 'ko' ? '규제' : 'penalty'}</text><text x="158" y="266" class="orange-svg-small">C = ${formatParameterValue(WIDGETS.logisticRegression.params[1], values.cLog)}</text>`;
        return markup;
    }

    function renderSvmStructure(values) {
        const lang = currentLanguage();
        const kernel = optionLabel('svm', 'kernel', values.kernel);
        let markup = `<text x="260" y="25" class="orange-plot-title" text-anchor="middle">${escapeHtml(kernel)} ${lang === 'ko' ? '커널 특성 공간' : 'kernel feature space'}</text>`;
        [[70, 75], [100, 125], [78, 180], [138, 88], [155, 164]].forEach((point, index) => { markup += `<circle cx="${point[0]}" cy="${point[1]}" r="7" class="${index < 3 ? 'orange-point-a' : 'orange-point-b'}"></circle>`; });
        markup += arrowMarkup(178, 130, 235, 130, true);
        markup += structureNode(235, 104, 88, 52, values.kernel, 'orange-node-accent');
        markup += arrowMarkup(323, 130, 380, 130, true);
        markup += `<line x1="388" y1="70" x2="462" y2="218" class="orange-dashed-line"></line><line x1="408" y1="60" x2="482" y2="208" class="orange-model-line"></line><line x1="428" y1="50" x2="502" y2="198" class="orange-dashed-line"></line>`;
        markup += `<circle cx="414" cy="116" r="8" class="orange-support-ring"></circle><circle cx="456" cy="159" r="8" class="orange-support-ring"></circle>`;
        markup += `<text x="260" y="242" class="orange-svg-label">${lang === 'ko' ? '여백 최적화' : 'margin optimization'}</text><text x="260" y="265" class="orange-svg-small">C ${formatParameterValue(WIDGETS.svm.params.find(param => param.key === 'cLog'), values.cLog)} · ${state.result.supportVectors.length}${lang === 'ko' ? '개 서포트 벡터' : ' support vectors'}</text>`;
        return markup;
    }

    function renderKnnStructure(values) {
        const lang = currentLanguage();
        const metric = optionLabel('knn', 'metric', values.metric);
        const weights = optionLabel('knn', 'weights', values.weights);
        let markup = `<text x="260" y="27" class="orange-plot-title" text-anchor="middle">${escapeHtml(metric)} ${lang === 'ko' ? '거리' : 'distance'} · ${escapeHtml(weights)} ${lang === 'ko' ? '투표' : 'vote'}</text>`;
        const center = { x: 255, y: 140 };
        const count = Math.min(13, values.neighbors);
        for (let i = 0; i < count; i += 1) {
            const angle = (i / count) * Math.PI * 2;
            const radius = 52 + (i % 3) * 19;
            const x = center.x + Math.cos(angle) * radius;
            const y = center.y + Math.sin(angle) * radius;
            markup += `<line x1="${center.x}" y1="${center.y}" x2="${x}" y2="${y}" class="orange-dashed-line"></line><circle cx="${x}" cy="${y}" r="7" class="${i % 3 === 0 ? 'orange-point-b' : 'orange-point-a'}"></circle>`;
        }
        markup += `<circle cx="${center.x}" cy="${center.y}" r="13" class="orange-node-accent"></circle><text x="${center.x}" y="${center.y + 4}" class="orange-svg-label">?</text>`;
        markup += structureNode(405, 117, 90, 46, lang === 'ko' ? `${values.neighbors}표` : `${values.neighbors} votes`, 'orange-node-accent');
        markup += arrowMarkup(329, 140, 405, 140, true);
        markup += `<text x="260" y="272" class="orange-svg-small">${lang === 'ko' ? '작은 k = 국소 세부 · 큰 k = 부드러운 경계' : 'small k = local detail · large k = smoother boundary'}</text>`;
        return markup;
    }

    function renderKmeansStructure(values) {
        const lang = currentLanguage();
        let markup = '';
        markup += structureNode(28, 72, 112, 48, lang === 'ko' ? '초기 중심' : 'Initialize', 'orange-node-purple');
        markup += arrowMarkup(140, 96, 206, 96, true);
        markup += structureNode(206, 72, 112, 48, lang === 'ko' ? '점 배정' : 'Assign points', 'orange-node');
        markup += arrowMarkup(318, 96, 384, 96, true);
        markup += structureNode(384, 72, 110, 48, lang === 'ko' ? '중심 이동' : 'Move centers', 'orange-node-accent');
        markup += `<path d="M 439 120 L 439 182 L 84 182 L 84 120" class="orange-dashed-line"></path><path d="M 84 120 l -4 8 l 8 0 Z" class="orange-bar-primary"></path>`;
        for (let i = 0; i < values.clusters; i += 1) {
            const x = 86 + i * (350 / Math.max(1, values.clusters - 1));
            markup += `<circle cx="${x}" cy="236" r="13" class="${['orange-node-blue', 'orange-node-accent', 'orange-node-purple'][i % 3]}"></circle><text x="${x}" y="270" class="orange-svg-small">μ${i + 1}</text>`;
        }
        markup += `<text x="260" y="28" class="orange-plot-title" text-anchor="middle">${escapeHtml(optionLabel('kmeans', 'initialization', values.initialization))} · ${lang === 'ko' ? `${values.reruns}회 중 최적 결과` : `best of ${values.reruns} runs`}</text>`;
        return markup;
    }

    function renderHierarchyStructure(values) {
        const lang = currentLanguage();
        const leafCount = 8;
        const baseline = 258;
        let markup = `<text x="260" y="25" class="orange-plot-title" text-anchor="middle">${escapeHtml(optionLabel('hierarchical', 'linkage', values.linkage))} · ${lang === 'ko' ? `${values.clusters}개 군집에서 절단` : `cut at ${values.clusters} clusters`}</text>`;
        const leafX = [];
        for (let i = 0; i < leafCount; i += 1) {
            const x = 45 + i * 61;
            leafX.push(x);
            markup += `<circle cx="${x}" cy="${baseline}" r="5" class="${['orange-point-a', 'orange-point-b', 'orange-point-c'][Math.floor(i / 3) % 3]}"></circle>`;
        }
        let groups = leafX.map(x => ({ x, y: baseline - 7 }));
        const maxLevels = values.pruning === 0 ? 3 : Math.max(1, Math.min(3, values.pruning));
        for (let level = 0; level < maxLevels; level += 1) {
            const next = [];
            for (let i = 0; i < groups.length; i += 2) {
                if (!groups[i + 1]) { next.push(groups[i]); continue; }
                const left = groups[i];
                const right = groups[i + 1];
                const y = baseline - 52 - level * 55;
                markup += `<path d="M ${left.x} ${left.y} V ${y} H ${right.x} V ${right.y}" class="orange-secondary-line"></path>`;
                next.push({ x: (left.x + right.x) / 2, y });
            }
            groups = next;
        }
        const cutY = 80 + (8 - values.clusters) * 14;
        markup += `<line x1="25" y1="${cutY}" x2="495" y2="${cutY}" class="orange-model-line" stroke-dasharray="7 5"></line><text x="470" y="${cutY - 8}" class="orange-svg-small">${lang === 'ko' ? '절단선' : 'cut'}</text>`;
        if (values.pruning > 0) markup += `<text x="260" y="294" class="orange-svg-small">${lang === 'ko' ? `표시만 깊이 ${values.pruning}까지 가지치기 · 군집 배정 유지` : `display pruned to depth ${values.pruning}; assignments unchanged`}</text>`;
        return markup;
    }

    function renderDbscanStructure(values) {
        const lang = currentLanguage();
        const points = [[145, 114], [178, 88], [194, 132], [224, 101], [254, 143], [286, 104], [315, 137], [347, 96]];
        let markup = `<text x="260" y="26" class="orange-plot-title" text-anchor="middle">${lang === 'ko' ? '밀도 도달성' : 'density reachability'}</text>`;
        markup += `<circle cx="224" cy="101" r="${48 + values.epsilon * 28}" class="orange-radius"></circle>`;
        points.forEach((point, index) => {
            if (index < points.length - 1) markup += `<line x1="${point[0]}" y1="${point[1]}" x2="${points[index + 1][0]}" y2="${points[index + 1][1]}" class="orange-connector-active"></line>`;
            markup += `<rect x="${point[0] - 7}" y="${point[1] - 7}" width="14" height="14" rx="2" class="orange-node-accent"></rect>`;
        });
        markup += `<path d="M 90 208 L 102 220 M 102 208 L 90 220" class="orange-dashed-line"></path><path d="M 405 194 L 417 206 M 417 194 L 405 206" class="orange-dashed-line"></path>`;
        markup += structureNode(175, 226, 170, 44, `ε ${values.epsilon.toFixed(2)} · min ${values.minNeighbors}`, 'orange-node-purple');
        markup += `<text x="260" y="294" class="orange-svg-small">${lang === 'ko' ? '핵심점 → 경계점 → 잡음' : 'core → border → noise'}</text>`;
        return markup;
    }

    function renderPcaStructure(values) {
        const lang = currentLanguage();
        let markup = `<text x="260" y="25" class="orange-plot-title" text-anchor="middle">${lang === 'ko' ? '분산을 보존하는 투영' : 'variance-preserving projection'}</text>`;
        ['x₁', 'x₂', 'x₃'].forEach((label, index) => { markup += structureNode(24, 55 + index * 64, 62, 36, label, 'orange-node-blue') + arrowMarkup(86, 73 + index * 64, 144, 137, false); });
        markup += structureNode(144, 107, 104, 60, lang === 'ko' ? '공분산' : 'Covariance', 'orange-node');
        markup += arrowMarkup(248, 137, 302, 137, true);
        markup += structureNode(302, 107, 92, 60, lang === 'ko' ? '고유벡터' : 'Eigenvectors', 'orange-node-purple');
        markup += arrowMarkup(394, 137, 445, 137, true);
        markup += `<rect x="445" y="88" width="54" height="98" rx="7" class="orange-node-accent"></rect><text x="472" y="124" class="orange-svg-label">PC1</text><text x="472" y="146" class="orange-svg-label">PC2</text>${values.components === 3 ? '<text x="472" y="168" class="orange-svg-label">PC3</text>' : ''}`;
        markup += `<text x="260" y="232" class="orange-svg-label">3D → ${values.components}D</text><text x="260" y="258" class="orange-svg-small">${values.normalize ? (lang === 'ko' ? '표준화한 변수' : 'standardized variables') : (lang === 'ko' ? '원래 변수 척도' : 'original variable scales')}</text>`;
        return markup;
    }

    function renderStructureVisual() {
        const values = state.values[state.widget];
        let markup = '';
        if (state.widget === 'neuralNetwork') markup = renderNeuralStructure(values);
        else if (state.widget === 'logisticRegression') markup = renderLogisticStructure(values);
        else if (state.widget === 'randomForest') markup = renderForestStructure(values);
        else if (state.widget === 'svm') markup = renderSvmStructure(values);
        else if (state.widget === 'knn') markup = renderKnnStructure(values);
        else if (state.widget === 'kmeans') markup = renderKmeansStructure(values);
        else if (state.widget === 'hierarchical') markup = renderHierarchyStructure(values);
        else if (state.widget === 'dbscan') markup = renderDbscanStructure(values);
        else markup = renderPcaStructure(values);
        elements.structureVisual.innerHTML = markup;
        const lang = currentLanguage();
        elements.structureVisual.setAttribute('aria-label', lang === 'ko' ? `${localized(WIDGETS[state.widget].name)} 모델 구조` : `${localized(WIDGETS[state.widget].name)} model structure`);
        if (state.widget === 'neuralNetwork') elements.structureCaption.textContent = lang === 'ko' ? '층·뉴런·연결 수가 함께 변화' : 'layers, neurons, and connections';
        else if (state.widget === 'hierarchical') elements.structureCaption.textContent = lang === 'ko' ? '가지치기는 표시 전용' : 'pruning affects display only';
        else elements.structureCaption.textContent = lang === 'ko' ? '현재 파라미터 구성' : 'current parameter configuration';
    }

    function linePath(series, xScale, yScale) {
        if (!series.length) return '';
        return series.map((point, index) => `${index === 0 ? 'M' : 'L'} ${xScale(point.x).toFixed(2)} ${yScale(point.y).toFixed(2)}`).join(' ');
    }

    function learningAxes(width, height, xLabel, yLabel) {
        const left = 52;
        const right = 18;
        const top = 28;
        const bottom = 40;
        let markup = '';
        for (let i = 0; i <= 4; i += 1) {
            const y = top + ((height - top - bottom) * i) / 4;
            markup += `<line x1="${left}" y1="${y}" x2="${width - right}" y2="${y}" class="orange-plot-grid"></line>`;
        }
        markup += `<line x1="${left}" y1="${height - bottom}" x2="${width - right}" y2="${height - bottom}" class="orange-plot-axis"></line><line x1="${left}" y1="${top}" x2="${left}" y2="${height - bottom}" class="orange-plot-axis"></line>`;
        markup += `<text x="${width / 2}" y="${height - 9}" class="orange-plot-label" text-anchor="middle">${escapeHtml(xLabel)}</text><text x="16" y="${height / 2}" class="orange-plot-label" text-anchor="middle" transform="rotate(-90 16 ${height / 2})">${escapeHtml(yLabel)}</text>`;
        return { markup, left, right, top, bottom };
    }

    function renderSupervisedLearning() {
        const width = 980;
        const height = 220;
        const lang = currentLanguage();
        const curves = state.result.curves;
        const maxX = Math.max(...curves.train.map(point => point.x), 1);
        const maxY = Math.max(...curves.train.concat(curves.validation).map(point => point.y), 1);
        const axes = learningAxes(width, height, lang === 'ko' ? '반복 / 앙상블 단계' : 'iterations / ensemble stages', lang === 'ko' ? '손실' : 'Loss');
        const xScale = value => axes.left + (value / maxX) * (width - axes.left - axes.right);
        const yScale = value => height - axes.bottom - (value / maxY) * (height - axes.top - axes.bottom);
        let markup = axes.markup;
        markup += `<path d="${linePath(curves.train, xScale, yScale)}" class="orange-secondary-line"></path><path d="${linePath(curves.validation, xScale, yScale)}" class="orange-model-line"></path>`;
        markup += `<line x1="680" y1="17" x2="704" y2="17" class="orange-secondary-line"></line><text x="710" y="21" class="orange-plot-label">${lang === 'ko' ? '학습' : 'train'}</text><line x1="790" y1="17" x2="814" y2="17" class="orange-model-line"></line><text x="820" y="21" class="orange-plot-label">${lang === 'ko' ? '검증' : 'validation'}</text>`;
        elements.learningVisual.innerHTML = markup;
        elements.learningTitle.textContent = lang === 'ko' ? '학습·검증 오차 흐름' : 'Training and validation loss';
        elements.learningCaption.textContent = lang === 'ko' ? '검증 곡선이 다시 오르면 과적합 신호' : 'a rising validation curve suggests overfitting';
    }

    function renderKmeansLearning() {
        const width = 980;
        const height = 220;
        const lang = currentLanguage();
        const history = state.result.history;
        const series = history.map((value, index) => ({ x: index + 1, y: value }));
        if (series.length === 1) series.push({ x: 2, y: series[0].y });
        const maxX = Math.max(...series.map(point => point.x), 2);
        const maxY = Math.max(...series.map(point => point.y), 1);
        const minY = Math.min(...series.map(point => point.y));
        const axes = learningAxes(width, height, lang === 'ko' ? '중심 갱신 횟수' : 'centroid updates', 'WCSS');
        const xScale = value => axes.left + ((value - 1) / Math.max(1, maxX - 1)) * (width - axes.left - axes.right);
        const yScale = value => height - axes.bottom - ((value - minY * 0.92) / Math.max(1e-6, maxY - minY * 0.92)) * (height - axes.top - axes.bottom);
        elements.learningVisual.innerHTML = `${axes.markup}<path d="${linePath(series, xScale, yScale)}" class="orange-model-line"></path>${series.map(point => `<circle cx="${xScale(point.x)}" cy="${yScale(point.y)}" r="4" class="orange-point-b"></circle>`).join('')}`;
        elements.learningTitle.textContent = lang === 'ko' ? '군집 내 제곱합 수렴' : 'Within-cluster sum of squares';
        elements.learningCaption.textContent = lang === 'ko' ? '중심 이동이 멈추면 수렴' : 'converges when centroids stop moving';
    }

    function renderHierarchyLearning() {
        const width = 980;
        const height = 220;
        const lang = currentLanguage();
        const merges = state.result.hierarchy.merges.slice(-36).map((merge, index) => ({ x: index + 1, y: merge.height }));
        const maxY = Math.max(...merges.map(point => point.y), 1);
        const axes = learningAxes(width, height, lang === 'ko' ? '병합 단계' : 'merge stage', lang === 'ko' ? '병합 거리' : 'merge distance');
        const xScale = value => axes.left + ((value - 1) / Math.max(1, merges.length - 1)) * (width - axes.left - axes.right);
        const yScale = value => height - axes.bottom - (value / maxY) * (height - axes.top - axes.bottom);
        elements.learningVisual.innerHTML = `${axes.markup}<path d="${linePath(merges, xScale, yScale)}" class="orange-tertiary-line"></path>`;
        elements.learningTitle.textContent = lang === 'ko' ? '덴드로그램 병합 거리' : 'Dendrogram merge distance';
        elements.learningCaption.textContent = lang === 'ko' ? '급격히 높아지는 지점이 자연스러운 절단 후보' : 'a steep jump suggests a natural cut';
    }

    function renderDbscanLearning() {
        const width = 980;
        const height = 220;
        const lang = currentLanguage();
        const distances = state.result.kDistances;
        const series = distances.map((value, index) => ({ x: index + 1, y: value }));
        const maxY = Math.max(...distances, valueFor('dbscan', 'epsilon'), 0.1) * 1.08;
        const axes = learningAxes(width, height, lang === 'ko' ? '정렬된 표본' : 'sorted samples', 'k-distance');
        const xScale = value => axes.left + ((value - 1) / Math.max(1, series.length - 1)) * (width - axes.left - axes.right);
        const yScale = value => height - axes.bottom - (value / maxY) * (height - axes.top - axes.bottom);
        const epsilonY = yScale(valueFor('dbscan', 'epsilon'));
        elements.learningVisual.innerHTML = `${axes.markup}<path d="${linePath(series, xScale, yScale)}" class="orange-tertiary-line"></path><line x1="${axes.left}" y1="${epsilonY}" x2="${width - axes.right}" y2="${epsilonY}" class="orange-model-line" stroke-dasharray="7 5"></line><text x="${width - axes.right - 8}" y="${epsilonY - 7}" class="orange-plot-label" text-anchor="end">ε ${valueFor('dbscan', 'epsilon').toFixed(2)}</text>`;
        elements.learningTitle.textContent = lang === 'ko' ? 'k번째 이웃 거리 그래프' : 'k-th-neighbor distance plot';
        elements.learningCaption.textContent = lang === 'ko' ? '곡선의 굽은 지점과 ε를 비교' : 'compare ε with the curve elbow';
    }

    function renderPcaLearning() {
        const width = 980;
        const height = 220;
        const lang = currentLanguage();
        const explained = state.result.pca.explained;
        const axes = learningAxes(width, height, lang === 'ko' ? '주성분' : 'principal component', lang === 'ko' ? '설명분산' : 'explained variance');
        const chartWidth = width - axes.left - axes.right;
        const chartHeight = height - axes.top - axes.bottom;
        let markup = axes.markup;
        let cumulative = 0;
        const cumulativePoints = [];
        explained.forEach((value, index) => {
            const slot = chartWidth / explained.length;
            const barWidth = Math.min(90, slot * 0.48);
            const x = axes.left + slot * index + slot / 2 - barWidth / 2;
            const barHeight = value * chartHeight;
            markup += `<rect x="${x}" y="${height - axes.bottom - barHeight}" width="${barWidth}" height="${barHeight}" rx="4" class="${index < valueFor('pca', 'components') ? 'orange-bar-primary' : 'orange-bar-track'}"></rect><text x="${x + barWidth / 2}" y="${height - axes.bottom + 18}" class="orange-plot-label" text-anchor="middle">PC${index + 1}</text><text x="${x + barWidth / 2}" y="${height - axes.bottom - barHeight - 7}" class="orange-plot-label" text-anchor="middle">${Math.round(value * 100)}%</text>`;
            cumulative += value;
            cumulativePoints.push({ x: index + 1, y: cumulative });
        });
        const xScale = value => axes.left + chartWidth * ((value - 0.5) / explained.length);
        const yScale = value => height - axes.bottom - value * chartHeight;
        markup += `<path d="${linePath(cumulativePoints, xScale, yScale)}" class="orange-secondary-line"></path>`;
        const targetY = yScale(valueFor('pca', 'varianceTarget') / 100);
        markup += `<line x1="${axes.left}" y1="${targetY}" x2="${width - axes.right}" y2="${targetY}" class="orange-dashed-line"></line><text x="${width - axes.right - 6}" y="${targetY - 6}" class="orange-plot-label" text-anchor="end">${lang === 'ko' ? '목표' : 'target'} ${valueFor('pca', 'varianceTarget')}%</text>`;
        elements.learningVisual.innerHTML = markup;
        elements.learningTitle.textContent = lang === 'ko' ? '스크리 도표 · 개별 및 누적분산' : 'Scree plot · individual and cumulative variance';
        elements.learningCaption.textContent = lang === 'ko' ? '주황 막대는 유지되는 성분' : 'orange bars are retained components';
    }

    function renderLearningVisual() {
        elements.learningVisual.setAttribute('aria-label', currentLanguage() === 'ko' ? '현재 파라미터에 따른 학습 또는 군집 품질 변화 그래프' : 'Learning or clustering quality chart for the current parameters');
        if (WIDGETS[state.widget].category === 'supervised') renderSupervisedLearning();
        else if (state.widget === 'kmeans') renderKmeansLearning();
        else if (state.widget === 'hierarchical') renderHierarchyLearning();
        else if (state.widget === 'dbscan') renderDbscanLearning();
        else renderPcaLearning();
    }

    function resultSlideTitle(slide, index) {
        if (index === 3 && elements.learningTitle && elements.learningTitle.textContent.trim()) {
            return elements.learningTitle.textContent.trim();
        }
        return currentLanguage() === 'ko' ? slide.dataset.titleKo : slide.dataset.titleEn;
    }

    function updateResultCarousel(announce) {
        if (!elements.resultCarousel || !elements.resultSlides.length) return;
        const count = elements.resultSlides.length;
        state.activeResultSlide = ((state.activeResultSlide % count) + count) % count;

        elements.resultSlides.forEach((slide, index) => {
            const isActive = index === state.activeResultSlide;
            const title = resultSlideTitle(slide, index);
            slide.hidden = !isActive;
            slide.setAttribute('aria-hidden', String(!isActive));
            slide.setAttribute('aria-label', `${index + 1} / ${count} · ${title}`);
            if ('inert' in slide) slide.inert = !isActive;
        });

        const activeSlide = elements.resultSlides[state.activeResultSlide];
        const activeTitle = resultSlideTitle(activeSlide, state.activeResultSlide);
        const position = `${state.activeResultSlide + 1} / ${count}`;
        const language = currentLanguage();
        elements.resultCarouselTitle.textContent = activeTitle;
        elements.resultCarouselPosition.textContent = position;
        elements.previousResultSlide.setAttribute('aria-label', language === 'ko' ? '이전 화면' : 'Previous view');
        elements.nextResultSlide.setAttribute('aria-label', language === 'ko' ? '다음 화면' : 'Next view');
        elements.resultCarousel.setAttribute('aria-label', language === 'ko' ? 'Orange3 결과 화면' : 'Orange3 result views');
        const statusText = `${position} · ${activeTitle}`;
        if (announce || elements.resultCarouselStatus.textContent !== statusText) {
            elements.resultCarouselStatus.textContent = statusText;
        }
    }

    function moveResultCarousel(step) {
        state.activeResultSlide += step;
        updateResultCarousel(true);
    }

    function handleResultCarouselKeydown(event) {
        if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
        if (event.target.closest('input, select, textarea, [contenteditable="true"], .recommendation-graph-shell')) return;
        if (event.key === 'ArrowLeft') {
            event.preventDefault();
            moveResultCarousel(-1);
        } else if (event.key === 'ArrowRight') {
            event.preventDefault();
            moveResultCarousel(1);
        }
    }

    function updateSimulation() {
        simulateCurrentWidget();
        updateMetrics();
        renderPrimaryVisual();
        renderStructureVisual();
        renderLearningVisual();
        updateInsight();
        updateResultCarousel(false);
    }

    function collectElements() {
        const ids = [
            'datasetSelect', 'regenerateData', 'supervisedWidgets', 'unsupervisedWidgets',
            'selectedWidgetIcon', 'parameterPanelTitle', 'widgetDescription', 'parameterControls',
            'resetParameters', 'currentWorkflowGraph', 'simulationModeBadge', 'resultCarousel',
            'resultCarouselTitle', 'resultCarouselViewport', 'previousResultSlide',
            'nextResultSlide', 'resultCarouselPosition', 'resultCarouselStatus',
            'metricOneLabel', 'metricOneValue', 'metricOneDelta', 'metricTwoLabel',
            'metricTwoValue', 'metricTwoDelta', 'metricThreeLabel', 'metricThreeValue',
            'metricThreeDelta', 'metricFourLabel', 'metricFourValue', 'metricFourDelta',
            'primaryVisualTitle', 'datasetSummary', 'primaryVisual', 'plotLegend',
            'structureCaption', 'structureVisual', 'learningTitle', 'learningCaption',
            'learningVisual', 'insightTitle', 'insightText'
        ];
        ids.forEach(id => { elements[id] = document.getElementById(id); });
        elements.resultSlides = Array.from(document.querySelectorAll('[data-result-slide]'));
    }

    function initializeLab() {
        collectElements();
        initializeValues();
        generatePoints();
        renderDatasetOptions();
        updateWidgetChrome();
        renderParameterControls();
        updateSimulation();

        elements.datasetSelect.addEventListener('change', () => {
            state.dataset = elements.datasetSelect.value;
            generatePoints();
            updateSimulation();
        });

        elements.regenerateData.addEventListener('click', () => {
            state.seed += 101;
            generatePoints();
            updateSimulation();
        });

        elements.resetParameters.addEventListener('click', resetCurrentParameters);
        elements.previousResultSlide.addEventListener('click', () => moveResultCarousel(-1));
        elements.nextResultSlide.addEventListener('click', () => moveResultCarousel(1));
        elements.resultCarousel.addEventListener('keydown', handleResultCarouselKeydown);
        elements.resultCarouselViewport.addEventListener('pointerdown', event => {
            if (event.target.closest('.recommendation-graph-shell')) return;
            elements.resultCarousel.focus({ preventScroll: true });
        });

        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const mobileNav = document.getElementById('mobileNav');
        if (mobileMenuToggle && mobileNav) {
            const syncMobileMenuIcon = () => {
                const isOpen = mobileNav.classList.contains('open');
                mobileMenuToggle.classList.toggle('menu-is-open', isOpen);
                mobileMenuToggle.setAttribute('aria-expanded', String(isOpen));
            };
            mobileMenuToggle.setAttribute('aria-controls', 'mobileNav');
            syncMobileMenuIcon();
            const mobileNavObserver = new MutationObserver(syncMobileMenuIcon);
            mobileNavObserver.observe(mobileNav, { attributes: true, attributeFilter: ['class'] });
        }

        const languageObserver = new MutationObserver(mutations => {
            if (!mutations.some(mutation => mutation.attributeName === 'lang')) return;
            renderDatasetOptions();
            updateWidgetChrome();
            renderParameterControls();
            updateSimulation();
        });
        languageObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initializeLab);
    else initializeLab();
}());
