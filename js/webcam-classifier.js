(function () {
    'use strict';

    const KOREAN_LABELS = Object.freeze({
        person: '사람',
        bicycle: '자전거',
        car: '자동차',
        motorcycle: '오토바이',
        airplane: '비행기',
        bus: '버스',
        train: '기차',
        truck: '트럭',
        boat: '보트',
        'traffic light': '신호등',
        'fire hydrant': '소화전',
        'stop sign': '정지 표지판',
        'parking meter': '주차 요금기',
        bench: '벤치',
        bird: '새',
        cat: '고양이',
        dog: '개',
        horse: '말',
        sheep: '양',
        cow: '소',
        elephant: '코끼리',
        bear: '곰',
        zebra: '얼룩말',
        giraffe: '기린',
        backpack: '배낭',
        umbrella: '우산',
        handbag: '핸드백',
        tie: '넥타이',
        suitcase: '여행가방',
        frisbee: '프리스비',
        skis: '스키',
        snowboard: '스노보드',
        'sports ball': '공',
        kite: '연',
        'baseball bat': '야구 방망이',
        'baseball glove': '야구 글러브',
        skateboard: '스케이트보드',
        surfboard: '서핑보드',
        'tennis racket': '테니스 라켓',
        bottle: '병',
        'wine glass': '와인잔',
        cup: '컵',
        fork: '포크',
        knife: '칼',
        spoon: '숟가락',
        bowl: '그릇',
        banana: '바나나',
        apple: '사과',
        sandwich: '샌드위치',
        orange: '오렌지',
        broccoli: '브로콜리',
        carrot: '당근',
        'hot dog': '핫도그',
        pizza: '피자',
        donut: '도넛',
        cake: '케이크',
        chair: '의자',
        couch: '소파',
        'potted plant': '화분',
        bed: '침대',
        'dining table': '식탁',
        toilet: '변기',
        tv: 'TV',
        laptop: '노트북',
        mouse: '마우스',
        remote: '리모컨',
        keyboard: '키보드',
        'cell phone': '휴대전화',
        microwave: '전자레인지',
        oven: '오븐',
        toaster: '토스터',
        sink: '싱크대',
        refrigerator: '냉장고',
        book: '책',
        clock: '시계',
        vase: '꽃병',
        scissors: '가위',
        'teddy bear': '곰 인형',
        'hair drier': '헤어드라이어',
        toothbrush: '칫솔'
    });

    const STRINGS = Object.freeze({
        ko: {
            loadingModel: '머신러닝 모델을 불러오는 중...',
            modelReady: '모델 준비 완료 · 입력을 선택하세요',
            modelError: '모델을 불러오지 못했습니다. 네트워크 연결 후 새로고침해 주세요.',
            cameraStarting: '카메라 권한을 확인하는 중...',
            cameraActive: '카메라 분석 중 · 사물을 화면에 보여주세요',
            cameraStopped: '카메라가 중지되었습니다',
            cameraDenied: '카메라 권한이 거부되었습니다. 브라우저 설정에서 권한을 허용해 주세요.',
            cameraMissing: '사용 가능한 카메라를 찾지 못했습니다.',
            cameraBusy: '다른 앱이 카메라를 사용 중이거나 카메라를 열 수 없습니다.',
            cameraUnsupported: '이 브라우저는 웹캠 입력을 지원하지 않습니다.',
            insecureContext: '카메라는 HTTPS 또는 localhost에서만 사용할 수 있습니다.',
            switchingCamera: '다른 카메라로 전환하는 중...',
            imageAnalyzing: '선택한 이미지를 분석하는 중...',
            imageReady: '이미지 분석 완료',
            imageError: '이미지를 읽거나 분석하지 못했습니다. 다른 파일을 선택해 주세요.',
            invalidImage: '이미지 파일만 선택할 수 있습니다.',
            detectionError: '분석 중 오류가 발생했습니다. 다시 시도해 주세요.',
            modeStandby: '대기 중',
            modeCamera: '실시간 카메라',
            modeImage: '업로드 이미지',
            noResults: '인식 기준을 넘은 사물이 없습니다',
            oneResult: '사물 1개를 찾았습니다',
            manyResults: count => `사물 ${count}개를 찾았습니다`,
            inferenceEmpty: '추론 시간: -',
            inferenceTime: ms => `추론 시간: ${ms}ms`,
            backend: value => `실행 엔진: ${value}`,
            confidence: value => `신뢰도 ${value}%`
        },
        en: {
            loadingModel: 'Loading the machine-learning model...',
            modelReady: 'Model ready · choose an input',
            modelError: 'The model could not be loaded. Check your connection and refresh.',
            cameraStarting: 'Checking camera permission...',
            cameraActive: 'Analyzing camera · hold an object in view',
            cameraStopped: 'Camera stopped',
            cameraDenied: 'Camera permission was denied. Allow it in your browser settings.',
            cameraMissing: 'No available camera was found.',
            cameraBusy: 'The camera is busy in another app or could not be opened.',
            cameraUnsupported: 'This browser does not support webcam input.',
            insecureContext: 'Camera access requires HTTPS or localhost.',
            switchingCamera: 'Switching camera...',
            imageAnalyzing: 'Analyzing the selected image...',
            imageReady: 'Image analysis complete',
            imageError: 'The image could not be read or analyzed. Choose another file.',
            invalidImage: 'Please choose an image file.',
            detectionError: 'An error occurred during inference. Please try again.',
            modeStandby: 'Standby',
            modeCamera: 'Live camera',
            modeImage: 'Uploaded image',
            noResults: 'No objects passed the confidence threshold',
            oneResult: '1 object detected',
            manyResults: count => `${count} objects detected`,
            inferenceEmpty: 'Inference time: -',
            inferenceTime: ms => `Inference time: ${ms}ms`,
            backend: value => `Backend: ${value}`,
            confidence: value => `${value}% confidence`
        }
    });

    const BOX_COLORS = ['#61a5fa', '#52d3aa', '#f6bd60', '#f28482', '#b69cff', '#69d2e7'];
    const DETECTION_INTERVAL_MS = 260;
    const MAX_RESULTS = 10;

    const state = {
        model: null,
        modelReady: false,
        stream: null,
        sourceMode: 'none',
        facingMode: 'environment',
        cameraCount: 0,
        cameraRunning: false,
        detecting: false,
        animationFrame: 0,
        loopGeneration: 0,
        lastDetectionAt: 0,
        predictions: [],
        latestSource: null,
        inferenceMs: null,
        imageUrl: null,
        thresholdTimer: 0,
        statusKind: 'loading',
        statusKey: 'loadingModel',
        modeKey: 'modeStandby'
    };

    let elements = {};

    document.addEventListener('DOMContentLoaded', initialize);

    async function initialize() {
        elements = {
            mediaViewer: document.getElementById('mediaViewer'),
            video: document.getElementById('cameraVideo'),
            image: document.getElementById('uploadedImage'),
            overlay: document.getElementById('detectionOverlay'),
            placeholder: document.getElementById('viewerPlaceholder'),
            pulse: document.getElementById('inferencePulse'),
            viewerMode: document.getElementById('viewerMode'),
            startButton: document.getElementById('startCameraButton'),
            stopButton: document.getElementById('stopCameraButton'),
            switchButton: document.getElementById('switchCameraButton'),
            uploadLabel: document.getElementById('imageUploadLabel'),
            imageInput: document.getElementById('imageInput'),
            statusIndicator: document.getElementById('statusIndicator'),
            modelStatus: document.getElementById('modelStatus'),
            backendLabel: document.getElementById('backendLabel'),
            resultHeadline: document.getElementById('resultHeadline'),
            objectCount: document.getElementById('objectCount'),
            threshold: document.getElementById('confidenceThreshold'),
            thresholdValue: document.getElementById('thresholdValue'),
            predictionList: document.getElementById('predictionList'),
            emptyResults: document.getElementById('emptyResults'),
            inferenceMeta: document.getElementById('inferenceMeta')
        };

        bindEvents();
        renderThreshold();
        renderDynamicText();
        updateControls();

        const languageObserver = new MutationObserver(() => {
            renderDynamicText();
            renderPredictions();
            redrawOverlay();
        });
        languageObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });

        if ('ResizeObserver' in window) {
            new ResizeObserver(redrawOverlay).observe(elements.mediaViewer);
        } else {
            window.addEventListener('resize', redrawOverlay);
        }

        window.addEventListener('pagehide', cleanup);
        await loadModel();
    }

    function bindEvents() {
        elements.startButton.addEventListener('click', () => startCamera(false));
        elements.stopButton.addEventListener('click', () => stopCamera({ silent: false }));
        elements.switchButton.addEventListener('click', switchCamera);
        elements.imageInput.addEventListener('change', handleImageSelection);
        elements.uploadLabel.addEventListener('click', event => {
            if (!state.modelReady) event.preventDefault();
        });
        elements.threshold.addEventListener('input', () => {
            renderThreshold();
            window.clearTimeout(state.thresholdTimer);
            if (state.sourceMode === 'image' && state.latestSource) {
                state.thresholdTimer = window.setTimeout(() => detectSource(state.latestSource, 'image'), 180);
            }
        });
    }

    async function loadModel() {
        setStatus('loading', 'loadingModel');

        try {
            if (!window.tf || !window.cocoSsd) {
                throw new Error('TensorFlow.js libraries are unavailable');
            }

            await window.tf.ready();
            state.model = await window.cocoSsd.load({ base: 'lite_mobilenet_v2' });
            state.modelReady = true;
            setStatus('ready', 'modelReady');
            updateBackendLabel(window.tf.getBackend() || 'CPU');
            document.documentElement.dataset.classifierReady = 'true';
        } catch (error) {
            console.error('Unable to load COCO-SSD:', error);
            setStatus('error', 'modelError');
            document.documentElement.dataset.classifierReady = 'error';
        }

        updateControls();
    }

    async function startCamera(isSwitch) {
        if (!state.modelReady) return;

        if (!window.isSecureContext && !isLocalhost()) {
            setStatus('error', 'insecureContext');
            return;
        }

        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            setStatus('error', 'cameraUnsupported');
            return;
        }

        stopCamera({ silent: true });
        clearUploadedImage();
        setStatus('loading', isSwitch ? 'switchingCamera' : 'cameraStarting');
        elements.startButton.disabled = true;
        elements.switchButton.disabled = true;

        try {
            const constraints = {
                audio: false,
                video: {
                    facingMode: { ideal: state.facingMode },
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }
            };

            state.stream = await navigator.mediaDevices.getUserMedia(constraints);
            elements.video.srcObject = state.stream;
            await waitForVideo(elements.video);
            await elements.video.play();

            state.sourceMode = 'camera';
            state.cameraRunning = true;
            state.predictions = [];
            state.latestSource = elements.video;
            state.inferenceMs = null;
            state.modeKey = 'modeCamera';
            elements.video.classList.add('active');
            elements.image.classList.remove('active');
            elements.mediaViewer.classList.add('has-source');

            await countCameras();
            setStatus('ready', 'cameraActive');
            renderDynamicText();
            renderPredictions();
            updateControls();
            startDetectionLoop();
        } catch (error) {
            console.error('Unable to start camera:', error);
            state.cameraRunning = false;
            state.sourceMode = 'none';
            state.modeKey = 'modeStandby';
            elements.video.classList.remove('active');
            elements.mediaViewer.classList.remove('has-source');
            setStatus('error', cameraErrorKey(error));
            updateControls();
            renderDynamicText();
        }
    }

    function stopCamera(options) {
        const settings = Object.assign({ silent: true }, options);
        state.loopGeneration += 1;
        state.cameraRunning = false;
        state.detecting = false;
        elements.pulse.classList.remove('active');

        if (state.animationFrame) {
            window.cancelAnimationFrame(state.animationFrame);
            state.animationFrame = 0;
        }

        if (state.stream) {
            state.stream.getTracks().forEach(track => track.stop());
            state.stream = null;
        }

        elements.video.pause();
        elements.video.srcObject = null;
        elements.video.classList.remove('active');

        if (state.sourceMode === 'camera') {
            state.sourceMode = 'none';
            state.latestSource = null;
            state.predictions = [];
            state.inferenceMs = null;
            state.modeKey = 'modeStandby';
            elements.mediaViewer.classList.remove('has-source');
            clearOverlay();
            renderPredictions();
            if (!settings.silent && state.modelReady) setStatus('ready', 'cameraStopped');
        }

        updateControls();
        renderDynamicText();
    }

    async function switchCamera() {
        if (!state.cameraRunning) return;
        state.facingMode = state.facingMode === 'environment' ? 'user' : 'environment';
        await startCamera(true);
    }

    function startDetectionLoop() {
        const generation = ++state.loopGeneration;
        state.lastDetectionAt = 0;

        const frame = timestamp => {
            if (!state.cameraRunning || generation !== state.loopGeneration) return;
            state.animationFrame = window.requestAnimationFrame(frame);

            if (state.detecting || elements.video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) return;
            if (timestamp - state.lastDetectionAt < DETECTION_INTERVAL_MS) return;

            state.lastDetectionAt = timestamp;
            detectSource(elements.video, 'camera');
        };

        state.animationFrame = window.requestAnimationFrame(frame);
    }

    async function handleImageSelection(event) {
        const file = event.target.files && event.target.files[0];
        if (!file || !state.modelReady) return;

        if (!file.type.startsWith('image/')) {
            setStatus('error', 'invalidImage');
            event.target.value = '';
            return;
        }

        stopCamera({ silent: true });
        clearUploadedImage();
        setStatus('loading', 'imageAnalyzing');
        state.sourceMode = 'image';
        state.modeKey = 'modeImage';

        try {
            state.imageUrl = URL.createObjectURL(file);
            await loadImage(elements.image, state.imageUrl);
            elements.image.classList.add('active');
            elements.video.classList.remove('active');
            elements.mediaViewer.classList.add('has-source');
            state.latestSource = elements.image;
            state.predictions = [];
            state.inferenceMs = null;
            renderDynamicText();
            renderPredictions();
            await detectSource(elements.image, 'image');
        } catch (error) {
            console.error('Unable to analyze image:', error);
            clearUploadedImage();
            state.sourceMode = 'none';
            state.modeKey = 'modeStandby';
            setStatus('error', 'imageError');
            renderDynamicText();
        } finally {
            event.target.value = '';
        }
    }

    async function detectSource(source, expectedMode) {
        if (!state.modelReady || state.detecting || state.sourceMode !== expectedMode) return;

        state.detecting = true;
        elements.pulse.classList.add('active');
        const startedAt = performance.now();

        try {
            const predictions = await state.model.detect(source, MAX_RESULTS, confidenceThreshold());
            if (state.sourceMode !== expectedMode || state.latestSource !== source) return;

            state.predictions = predictions.slice().sort((a, b) => b.score - a.score);
            state.inferenceMs = Math.round(performance.now() - startedAt);
            renderPredictions();
            drawPredictions(source, state.predictions);
            setStatus('ready', expectedMode === 'image' ? 'imageReady' : 'cameraActive');
        } catch (error) {
            console.error('Object detection failed:', error);
            if (state.sourceMode === expectedMode) setStatus('error', 'detectionError');
        } finally {
            state.detecting = false;
            elements.pulse.classList.remove('active');
        }
    }

    function renderPredictions() {
        const predictions = state.predictions;
        const language = currentLanguage();
        elements.objectCount.textContent = String(predictions.length);
        elements.predictionList.replaceChildren();
        elements.emptyResults.hidden = predictions.length > 0;

        if (predictions.length === 0) {
            elements.resultHeadline.textContent = state.latestSource ? text('noResults') : initialResultsText(language);
        } else if (predictions.length === 1) {
            elements.resultHeadline.textContent = text('oneResult');
        } else {
            elements.resultHeadline.textContent = text('manyResults', predictions.length);
        }

        predictions.forEach((prediction, index) => {
            const percentage = Math.round(prediction.score * 100);
            const color = BOX_COLORS[index % BOX_COLORS.length];
            const item = document.createElement('li');
            item.className = 'prediction-item';
            item.style.setProperty('--prediction-color', color);
            item.style.setProperty('--prediction-score', `${percentage}%`);
            item.setAttribute('aria-label', `${localizedClassName(prediction.class)} ${text('confidence', percentage)}`);

            const top = document.createElement('div');
            top.className = 'prediction-item-top';

            const rank = document.createElement('span');
            rank.className = 'prediction-rank';
            rank.textContent = String(index + 1).padStart(2, '0');

            const name = document.createElement('span');
            name.className = 'prediction-name';
            name.textContent = localizedClassName(prediction.class);

            const score = document.createElement('span');
            score.className = 'prediction-score';
            score.textContent = `${percentage}%`;

            const track = document.createElement('div');
            track.className = 'confidence-track';
            track.setAttribute('aria-hidden', 'true');
            const fill = document.createElement('div');
            fill.className = 'confidence-fill';
            track.appendChild(fill);

            top.append(rank, name, score);
            item.append(top, track);
            elements.predictionList.appendChild(item);
        });

        elements.inferenceMeta.textContent = state.inferenceMs === null
            ? text('inferenceEmpty')
            : text('inferenceTime', state.inferenceMs);
    }

    function drawPredictions(source, predictions) {
        const sourceSize = getSourceSize(source);
        const viewerWidth = elements.mediaViewer.clientWidth;
        const viewerHeight = elements.mediaViewer.clientHeight;
        if (!sourceSize.width || !sourceSize.height || !viewerWidth || !viewerHeight) return;

        const deviceScale = Math.min(window.devicePixelRatio || 1, 2);
        elements.overlay.width = Math.round(viewerWidth * deviceScale);
        elements.overlay.height = Math.round(viewerHeight * deviceScale);

        const context = elements.overlay.getContext('2d');
        context.setTransform(deviceScale, 0, 0, deviceScale, 0, 0);
        context.clearRect(0, 0, viewerWidth, viewerHeight);

        const scale = Math.min(viewerWidth / sourceSize.width, viewerHeight / sourceSize.height);
        const offsetX = (viewerWidth - sourceSize.width * scale) / 2;
        const offsetY = (viewerHeight - sourceSize.height * scale) / 2;

        predictions.forEach((prediction, index) => {
            const color = BOX_COLORS[index % BOX_COLORS.length];
            const [rawX, rawY, rawWidth, rawHeight] = prediction.bbox;
            const x = offsetX + rawX * scale;
            const y = offsetY + rawY * scale;
            const width = rawWidth * scale;
            const height = rawHeight * scale;
            const percentage = Math.round(prediction.score * 100);
            const label = `${localizedClassName(prediction.class)} · ${percentage}%`;

            context.strokeStyle = color;
            context.lineWidth = Math.max(2, viewerWidth / 340);
            context.strokeRect(x, y, width, height);

            const fontSize = Math.max(11, Math.min(15, viewerWidth / 45));
            context.font = `700 ${fontSize}px "Noto Sans KR", sans-serif`;
            context.textBaseline = 'middle';
            const labelWidth = Math.min(context.measureText(label).width + 16, viewerWidth - 8);
            const labelHeight = fontSize + 12;
            const labelX = Math.max(4, Math.min(x, viewerWidth - labelWidth - 4));
            const labelY = y - labelHeight > 4 ? y - labelHeight : Math.min(y + 3, viewerHeight - labelHeight - 4);

            context.fillStyle = color;
            context.fillRect(labelX, labelY, labelWidth, labelHeight);
            context.fillStyle = '#08111f';
            context.fillText(label, labelX + 8, labelY + labelHeight / 2 + 0.5, labelWidth - 12);
        });
    }

    function redrawOverlay() {
        if (state.latestSource && state.predictions.length) {
            drawPredictions(state.latestSource, state.predictions);
        } else {
            clearOverlay();
        }
    }

    function clearOverlay() {
        const context = elements.overlay && elements.overlay.getContext('2d');
        if (context) context.clearRect(0, 0, elements.overlay.width, elements.overlay.height);
    }

    function renderDynamicText() {
        elements.viewerMode.textContent = text(state.modeKey);
        elements.modelStatus.textContent = text(state.statusKey);
        setStatusIndicator(state.statusKind);
        if (window.tf && state.modelReady) updateBackendLabel(window.tf.getBackend() || 'CPU');
        renderPredictions();
    }

    function renderThreshold() {
        elements.thresholdValue.textContent = `${elements.threshold.value}%`;
    }

    function setStatus(kind, key) {
        state.statusKind = kind;
        state.statusKey = key;
        if (elements.modelStatus) elements.modelStatus.textContent = text(key);
        if (elements.statusIndicator) setStatusIndicator(kind);
    }

    function setStatusIndicator(kind) {
        elements.statusIndicator.className = `status-indicator status-${kind}`;
    }

    function updateBackendLabel(backend) {
        const icon = document.createElement('i');
        icon.className = 'fas fa-gauge-high';
        icon.setAttribute('aria-hidden', 'true');
        elements.backendLabel.replaceChildren(icon, document.createTextNode(text('backend', backend.toUpperCase())));
    }

    function updateControls() {
        const cameraUsable = Boolean(
            state.modelReady &&
            navigator.mediaDevices &&
            navigator.mediaDevices.getUserMedia &&
            (window.isSecureContext || isLocalhost())
        );

        elements.startButton.disabled = !cameraUsable || state.cameraRunning;
        elements.stopButton.disabled = !state.cameraRunning;
        elements.switchButton.disabled = !state.cameraRunning || state.cameraCount < 2;
        elements.imageInput.disabled = !state.modelReady;
        elements.uploadLabel.setAttribute('aria-disabled', state.modelReady ? 'false' : 'true');
        elements.threshold.disabled = !state.modelReady;
    }

    function clearUploadedImage() {
        elements.image.classList.remove('active');
        elements.image.removeAttribute('src');
        if (state.imageUrl) {
            URL.revokeObjectURL(state.imageUrl);
            state.imageUrl = null;
        }
        if (state.sourceMode === 'image') {
            state.sourceMode = 'none';
            state.latestSource = null;
            state.predictions = [];
            state.inferenceMs = null;
            state.modeKey = 'modeStandby';
            elements.mediaViewer.classList.remove('has-source');
            clearOverlay();
        }
    }

    async function countCameras() {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            state.cameraCount = devices.filter(device => device.kind === 'videoinput').length;
            const videoTrack = state.stream && state.stream.getVideoTracks()[0];
            const actualFacingMode = videoTrack && videoTrack.getSettings && videoTrack.getSettings().facingMode;
            if (actualFacingMode) state.facingMode = actualFacingMode;
        } catch (error) {
            state.cameraCount = 1;
        }
    }

    function cleanup() {
        stopCamera({ silent: true });
        clearUploadedImage();
    }

    function currentLanguage() {
        return document.documentElement.lang === 'en' ? 'en' : 'ko';
    }

    function text(key, value) {
        const result = STRINGS[currentLanguage()][key];
        return typeof result === 'function' ? result(value) : result;
    }

    function localizedClassName(className) {
        if (currentLanguage() === 'en') return className;
        const korean = KOREAN_LABELS[className];
        return korean ? `${korean} · ${className}` : className;
    }

    function initialResultsText(language) {
        return language === 'en' ? 'No objects recognized yet' : '아직 인식된 사물이 없습니다';
    }

    function confidenceThreshold() {
        return Number(elements.threshold.value) / 100;
    }

    function getSourceSize(source) {
        if (source instanceof HTMLVideoElement) {
            return { width: source.videoWidth, height: source.videoHeight };
        }
        return { width: source.naturalWidth, height: source.naturalHeight };
    }

    function cameraErrorKey(error) {
        if (!error) return 'cameraBusy';
        if (error.name === 'NotAllowedError' || error.name === 'SecurityError') return 'cameraDenied';
        if (error.name === 'NotFoundError' || error.name === 'OverconstrainedError') return 'cameraMissing';
        if (error.name === 'NotReadableError' || error.name === 'AbortError') return 'cameraBusy';
        return 'cameraBusy';
    }

    function isLocalhost() {
        return ['localhost', '127.0.0.1', '::1'].includes(window.location.hostname);
    }

    function waitForVideo(video) {
        if (video.readyState >= HTMLMediaElement.HAVE_METADATA && video.videoWidth) return Promise.resolve();
        return new Promise((resolve, reject) => {
            const timeout = window.setTimeout(() => {
                cleanupListeners();
                reject(new Error('Camera metadata timed out'));
            }, 10000);
            const onLoaded = () => {
                cleanupListeners();
                resolve();
            };
            const onError = () => {
                cleanupListeners();
                reject(video.error || new Error('Camera preview failed'));
            };
            const cleanupListeners = () => {
                window.clearTimeout(timeout);
                video.removeEventListener('loadedmetadata', onLoaded);
                video.removeEventListener('error', onError);
            };
            video.addEventListener('loadedmetadata', onLoaded, { once: true });
            video.addEventListener('error', onError, { once: true });
        });
    }

    function loadImage(image, source) {
        return new Promise((resolve, reject) => {
            const onLoad = () => {
                cleanupListeners();
                resolve();
            };
            const onError = () => {
                cleanupListeners();
                reject(new Error('Image decoding failed'));
            };
            const cleanupListeners = () => {
                image.removeEventListener('load', onLoad);
                image.removeEventListener('error', onError);
            };
            image.addEventListener('load', onLoad, { once: true });
            image.addEventListener('error', onError, { once: true });
            image.src = source;
        });
    }
})();
