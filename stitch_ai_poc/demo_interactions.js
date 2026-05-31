(function () {
  const PRINCIPLES = {
    proof: {
      title: "사고 과정 증명 데모",
      principle:
        "결과물이 아니라 질문, 수정, 반박, 재구성의 경로를 남겨 사고의 흐름을 증명합니다.",
      evidence: ["프롬프트와 AI 응답 흐름", "학생의 재작성·반박 흔적", "체류 시간은 보조 신호로만 사용"],
      result: "버튼을 누른 순간의 행동이 학습 로그에 기록되고, 교사는 근거 중심으로 확인합니다."
    },
    hcr: {
      title: "HCR 질적 기여도 데모",
      principle:
        "AI 활용 비율을 양이나 시간으로 재지 않고, 학생이 의미 있게 수정·반박·구조화한 정도를 봅니다.",
      evidence: ["AI 제안 수용 여부", "학생이 바꾼 근거와 논리", "단순 반복 클릭은 낮은 신호로 처리"],
      result: "질 기반 HCR 신호가 반영되어 학생 주도성과 의존 위험을 함께 보여줍니다."
    },
    rfmEna: {
      title: "RFM·ENA 분석 데모",
      principle:
        "주장의 타당성·관련성(RFM)과 개념 연결 변화(ENA)를 함께 보아 사고의 깊이를 추적합니다.",
      evidence: ["핵심 개념 노드", "근거와 주장 사이의 연결", "시간에 따른 네트워크 변화"],
      result: "화면에는 개념 연결, 사고 참여도, 개입 필요 신호가 시각적으로 갱신됩니다."
    },
    socratic: {
      title: "소크라테스식 확인 데모",
      principle:
        "최종 결과 전에 학생이 AI 답을 자기 말로 설명하고 근거를 확인하도록 적응형 질문을 제공합니다.",
      evidence: ["자기 설명", "근거 확인", "반대 관점 질문", "개념 오해 확인"],
      result: "확인 질문을 통과해야 지적 영수증에 신뢰 가능한 사고 증거로 남습니다."
    },
    glowGrow: {
      title: "Glow & Grow 개입 데모",
      principle:
        "교사 부담을 줄이기 위해 칭찬할 지점(Glow)과 성장시킬 지점(Grow)을 즉시 제안합니다.",
      evidence: ["정체 학생 우선순위", "개입 문장 추천", "학급 전체 위험 신호", "교사 최종 판단"],
      result: "교사는 실시간 숫자 판정이 아니라 해석 가능한 코칭 제안을 받습니다."
    },
    privacy: {
      title: "개인정보·무결성 데모",
      principle:
        "학습 로그는 최소 수집, 비식별, 암호화, 보존 기간 관리, 해시·타임스탬프 검증을 거칩니다.",
      evidence: ["학생·보호자 동의", "열람·삭제 요청", "서버 서명", "접근 감사 로그"],
      result: "데이터 활용 상태와 동의 이력을 확인하고, 민감 정보는 마스킹된 상태로 처리합니다."
    },
    teacherAgency: {
      title: "교사 주도 설정 데모",
      principle:
        "성취기준만 고르면 자동 추천되는 기본 모드와 세부 가중치를 조정하는 전문가 모드를 분리합니다.",
      evidence: ["성취기준 기반 추천", "루브릭·HCR 기준 조정", "개입 시나리오 라이브러리"],
      result: "AI는 초안을 제안하고, 수업 맥락에 맞는 최종 판단은 교사가 수행합니다."
    },
    report: {
      title: "지적 영수증 데모",
      principle:
        "리포트와 인증서는 산출물 점수가 아니라 사고 경로, 개념 변화, 확인 질문 결과를 요약합니다.",
      evidence: ["Revision Path", "RFM·ENA 요약", "HCR 해석", "교사 코멘트 초안"],
      result: "생활기록부나 평가 문구는 바로 사용하지 않고 교사용 초안 도움으로만 제시됩니다."
    }
  };

  const PAGE_CONTEXT = {
    ai_1: {
      name: "수업 설계",
      principleKey: "teacherAgency",
      summary: "성취기준 기반 추천과 전문가 설정을 분리해 교사 통제권을 보장합니다."
    },
    ai_2: {
      name: "서비스 소개",
      principleKey: "proof",
      summary: "AI 사용 자체보다 사고의 경로를 남기는 평가 철학을 소개합니다."
    },
    ai_3: {
      name: "고급 설정",
      principleKey: "teacherAgency",
      summary: "루브릭, HCR, 개입 조건을 수업 맥락에 맞게 조정합니다."
    },
    ai_4: {
      name: "교사 대시보드",
      principleKey: "glowGrow",
      summary: "학급 상태를 빠르게 보고 필요한 개입만 우선 확인합니다."
    },
    ai_5: {
      name: "학생 학습 공간",
      principleKey: "socratic",
      summary: "힌트, 근거 확인, 자기 설명으로 AI 답변 수용을 검증합니다."
    },
    ai_6: {
      name: "과정 증빙 리포트",
      principleKey: "report",
      summary: "사고 경로와 개념 연결 변화가 리포트 형태로 정리됩니다."
    },
    ai_7: {
      name: "보안·동의",
      principleKey: "privacy",
      summary: "수집·동의·보존·무결성 검증 상태를 투명하게 보여줍니다."
    },
    ai_8: {
      name: "학생 미리보기",
      principleKey: "socratic",
      summary: "학생 화면에서 근거 확인과 자기 설명 흐름을 미리 점검합니다."
    },
    ai_live: {
      name: "실시간 모니터링",
      principleKey: "glowGrow",
      summary: "RFM·ENA 신호와 정체 상태를 바탕으로 교사 개입을 제안합니다."
    },
    index: {
      name: "시나리오 허브",
      principleKey: "proof",
      summary: "교사와 학생 여정을 연결해 전체 PoC 흐름을 확인합니다."
    }
  };

  const DEFAULT_STATUS = {
    proof: ["상호작용 로그 기록", "사고 증거 항목 생성", "교사 검토 대기"],
    hcr: ["질적 수정 신호 확인", "단순 수용 여부 분리", "학생 주도성 해석"],
    rfmEna: ["개념 노드 추출", "근거-주장 연결 계산", "개념망 변화 표시"],
    socratic: ["확인 질문 생성", "근거 설명 요청", "자기 말 설명 대기"],
    glowGrow: ["Glow 지점 표시", "Grow 질문 추천", "교사 확인 후 전송"],
    privacy: ["비식별 처리 확인", "해시·타임스탬프 검증", "동의 이력 열람 가능"],
    teacherAgency: ["기본 모드 추천 준비", "전문가 설정 조정 가능", "교사 최종 검토 대기"],
    report: ["Revision Path 요약", "RFM·ENA 결과 연결", "교사용 초안으로 표시"]
  };

  const LABEL_ALIASES = {
    search: "검색",
    notifications: "알림",
    settings: "설정",
    cloud_upload: "클라우드 업로드",
    attach_file: "파일 첨부",
    send: "보내기",
    arrow_upward: "답변 보내기",
    description: "문서 보기",
    lightbulb: "힌트",
    chat_bubble: "질문",
    edit_note: "메모",
    arrow_back: "이전",
    "fa-magnifying-glass": "검색",
    "fa-bell": "알림",
    "fa-pencil": "편집",
    "fa-trash-can": "삭제"
  };

  const ACTION_RULES = [
    {
      key: "teacherAgency",
      pattern: /추천|성취기준|루브릭|Preset|세부|수정|편집|설정|토글|복구|AI 추천안/i,
      title: "교사 주도 설정 시연",
      status: ["기본 모드 추천 생성", "전문가 기준 조정 가능", "교사 최종 검토 대기"]
    },
    {
      key: "socratic",
      pattern: /힌트|근거|사례|수집|내 말|설명|보내기|첨부|도움|잠시|멈춤|질문/i,
      title: "학생 사고 확인 시연",
      status: ["소크라테스식 질문 생성", "근거 요구 신호 기록", "자기 설명 단계 대기"]
    },
    {
      key: "glowGrow",
      pattern: /알림|스캐폴딩|반대 관점|메모|정체|사고 참여도|개념 연결|일시정지|진행중|종료|전체|열기/i,
      title: "교사 개입 추천 시연",
      status: ["Glow 칭찬 지점 표시", "Grow 보완 질문 제안", "교사 확인 후 전송"]
    },
    {
      key: "report",
      pattern: /PDF|공유|인증서|IR|영수증|의견|저장|리포트|문서/i,
      title: "지적 영수증 시연",
      status: ["Revision Path 요약", "RFM·ENA 결과 연결", "교사용 초안으로 표시"]
    },
    {
      key: "privacy",
      pattern: /동의|보안|개인정보|업로드|cloud|설정|notifications|알림 3개|로그|삭제/i,
      title: "보안·동의 관리 시연",
      status: ["비식별 처리 확인", "해시·타임스탬프 검증", "동의 이력 열람 가능"]
    },
    {
      key: "proof",
      pattern: /로그인|도입|자료|검색|보기|무료|시작|대시보드/i,
      title: "사고 과정 증명 시연",
      status: ["상호작용 로그 시작", "사고 증거 항목 준비", "교사 대시보드와 연결"]
    }
  ];

  const state = {
    events: []
  };

  function getCurrentPage() {
    const parts = window.location.pathname.split("/").filter(Boolean);
    const lastDir = parts.length > 1 ? parts[parts.length - 2] : "index";
    if (lastDir in PAGE_CONTEXT) return lastDir;
    return window.location.pathname.endsWith("/index.html") || parts[parts.length - 1] === "stitch_ai_poc"
      ? "index"
      : "index";
  }

  function normalizeLabel(text) {
    const clean = (text || "").replace(/\s+/g, " ").trim();
    return LABEL_ALIASES[clean] || clean;
  }

  function getIconLabel(control) {
    const materialIcon = control.querySelector(".material-symbols-outlined");
    if (materialIcon) {
      return LABEL_ALIASES[materialIcon.textContent.trim()] || materialIcon.textContent.trim();
    }

    const icon = control.querySelector("i, svg");
    if (!icon) return "";
    const className = icon.getAttribute("class") || "";
    const matched = Object.keys(LABEL_ALIASES).find((key) => className.includes(key));
    return matched ? LABEL_ALIASES[matched] : "";
  }

  function getTextWithoutIcons(control) {
    const clone = control.cloneNode(true);
    clone.querySelectorAll(".material-symbols-outlined, i, svg").forEach((icon) => icon.remove());
    return normalizeLabel(clone.textContent);
  }

  function getControlLabel(control) {
    const explicit =
      control.getAttribute("aria-label") ||
      control.getAttribute("title") ||
      control.getAttribute("data-demo-label");
    if (explicit) return normalizeLabel(explicit);

    const text = getTextWithoutIcons(control);
    if (text && !/^(search|notifications|settings|cloud_upload|attach_file|send)$/.test(text)) {
      return text;
    }

    const iconLabel = getIconLabel(control);
    if (iconLabel) return iconLabel;

    if (control.className && String(control.className).includes("rounded-full")) return "설정 토글";
    return "버튼";
  }

  function isHashNavigation(onclick) {
    return /location\.href\s*=\s*['"]#/.test(onclick || "");
  }

  function hasRealInlineAction(control) {
    const onclick = control.getAttribute("onclick") || "";
    if (!onclick) return false;
    if (isHashNavigation(onclick)) return false;
    if (/location\.href\s*=/.test(onclick)) return true;
    if (/togglePocDrawer|showSubmitModal|switchJourney|classList\.add|classList\.remove|document\.referrer/.test(onclick)) {
      return true;
    }
    return true;
  }

  function shouldHandle(control) {
    if (!control || control.disabled) return false;
    if (control.closest("#poc-floating-controller, #demo-modal, #demo-toast, #demo-state-strip")) return false;
    if (control.getAttribute("data-demo-ignore") === "true") return false;

    const tag = control.tagName.toLowerCase();
    if (tag === "a") {
      const href = control.getAttribute("href") || "";
      return href === "" || href === "#" || href.startsWith("#") || href.startsWith("javascript:");
    }

    if (tag !== "button") return false;
    if (isHashNavigation(control.getAttribute("onclick"))) return true;
    return !hasRealInlineAction(control);
  }

  function resolveAction(label) {
    const pageKey = getCurrentPage();
    const page = PAGE_CONTEXT[pageKey] || PAGE_CONTEXT.index;
    const pageForcedKeys = {
      ai_1: "teacherAgency",
      ai_2: "proof",
      ai_3: "teacherAgency",
      ai_4: "glowGrow",
      ai_5: "socratic",
      ai_6: "report",
      ai_7: "privacy",
      ai_8: "socratic",
      ai_live: "glowGrow"
    };
    const labelWithPage = `${label} ${page.name}`;
    const matched = ACTION_RULES.find((rule) => rule.pattern.test(labelWithPage));
    const key = pageForcedKeys[pageKey] || (matched ? matched.key : page.principleKey);
    const principle = PRINCIPLES[key] || PRINCIPLES.proof;
    const title = matched && matched.key === key ? matched.title : principle.title;
    const status = matched && matched.key === key ? matched.status : DEFAULT_STATUS[key] || DEFAULT_STATUS.proof;

    return {
      key,
      label,
      page,
      title,
      principle: principle.principle,
      evidence: principle.evidence,
      result: principle.result,
      status
    };
  }

  function ensureStyles() {
    if (document.getElementById("demo-interactions-style")) return;

    const style = document.createElement("style");
    style.id = "demo-interactions-style";
    style.textContent = `
      [data-demo-active="true"] {
        outline: 3px solid rgba(255, 107, 0, 0.35) !important;
        outline-offset: 2px !important;
        box-shadow: 0 0 0 6px rgba(255, 107, 0, 0.10) !important;
      }
      #demo-toast {
        position: fixed;
        left: 50%;
        bottom: 24px;
        transform: translateX(-50%) translateY(20px);
        z-index: 10020;
        max-width: min(520px, calc(100vw - 32px));
        padding: 12px 16px;
        border-radius: 12px;
        background: rgba(17, 24, 39, 0.96);
        color: #fff;
        font: 700 13px/1.45 system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        opacity: 0;
        pointer-events: none;
        transition: opacity 180ms ease, transform 180ms ease;
      }
      #demo-toast.is-visible {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
      }
      #demo-modal {
        position: fixed;
        inset: 0;
        z-index: 10010;
        display: none;
        align-items: center;
        justify-content: center;
        padding: 24px;
        background: rgba(15, 23, 42, 0.42);
        backdrop-filter: blur(4px);
      }
      #demo-modal.is-open {
        display: flex;
      }
      .demo-modal-card {
        width: min(620px, 100%);
        max-height: min(82vh, 720px);
        overflow: auto;
        border-radius: 20px;
        background: #fff;
        color: #111827;
        box-shadow: 0 24px 80px rgba(15, 23, 42, 0.30);
        border: 1px solid rgba(229, 231, 235, 0.95);
      }
      .demo-modal-head {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 16px;
        padding: 24px 24px 16px;
        border-bottom: 1px solid #eef2f7;
      }
      .demo-modal-kicker {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        margin-bottom: 8px;
        padding: 4px 8px;
        border-radius: 999px;
        background: #fff7ed;
        color: #c2410c;
        font: 800 11px/1 system-ui, sans-serif;
        letter-spacing: 0;
      }
      .demo-modal-title {
        margin: 0;
        font: 800 22px/1.25 system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        letter-spacing: 0;
      }
      .demo-modal-context {
        margin: 8px 0 0;
        color: #64748b;
        font: 500 13px/1.55 system-ui, sans-serif;
      }
      .demo-modal-close {
        border: 0;
        background: #f1f5f9;
        color: #475569;
        width: 36px;
        height: 36px;
        border-radius: 999px;
        font: 800 20px/1 system-ui, sans-serif;
        cursor: pointer;
      }
      .demo-modal-body {
        padding: 20px 24px 24px;
      }
      .demo-section-label {
        margin: 0 0 8px;
        color: #0f172a;
        font: 800 13px/1.4 system-ui, sans-serif;
      }
      .demo-principle {
        margin: 0 0 18px;
        padding: 14px 16px;
        border-radius: 14px;
        background: #f8fafc;
        color: #334155;
        font: 600 14px/1.6 system-ui, sans-serif;
        border: 1px solid #e2e8f0;
      }
      .demo-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 14px;
      }
      .demo-list {
        margin: 0;
        padding: 14px 16px 14px 32px;
        border-radius: 14px;
        background: #fff;
        border: 1px solid #e5e7eb;
        color: #475569;
        font: 600 13px/1.7 system-ui, sans-serif;
      }
      .demo-result {
        margin: 16px 0 0;
        padding: 14px 16px;
        border-radius: 14px;
        background: #ecfdf5;
        color: #065f46;
        border: 1px solid #a7f3d0;
        font: 700 13px/1.6 system-ui, sans-serif;
      }
      #demo-state-strip {
        position: fixed;
        left: 20px;
        bottom: 20px;
        z-index: 10000;
        width: min(360px, calc(100vw - 40px));
        padding: 14px;
        border-radius: 16px;
        background: rgba(255, 255, 255, 0.96);
        border: 1px solid rgba(226, 232, 240, 0.95);
        box-shadow: 0 16px 48px rgba(15, 23, 42, 0.18);
        color: #111827;
      }
      .demo-state-title {
        margin: 0 0 8px;
        font: 800 13px/1.4 system-ui, sans-serif;
      }
      .demo-state-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
      }
      .demo-state-tags span {
        display: inline-flex;
        padding: 5px 8px;
        border-radius: 999px;
        background: #f1f5f9;
        color: #475569;
        font: 700 11px/1.2 system-ui, sans-serif;
      }
      @media (max-width: 640px) {
        #demo-modal {
          padding: 12px;
          align-items: flex-end;
        }
        .demo-modal-card {
          border-radius: 18px;
          max-height: 88vh;
        }
        .demo-modal-head {
          padding: 20px 18px 14px;
        }
        .demo-modal-body {
          padding: 16px 18px 20px;
        }
        .demo-grid {
          grid-template-columns: 1fr;
        }
        #demo-state-strip {
          left: 12px;
          bottom: 12px;
          width: calc(100vw - 24px);
        }
      }
    `;
    document.head.appendChild(style);
  }

  function ensureToast() {
    let toast = document.getElementById("demo-toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "demo-toast";
      toast.setAttribute("role", "status");
      toast.setAttribute("aria-live", "polite");
      document.body.appendChild(toast);
    }
    return toast;
  }

  function showToast(message) {
    const toast = ensureToast();
    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(toast._demoTimer);
    toast._demoTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2400);
  }

  function ensureModal() {
    let modal = document.getElementById("demo-modal");
    if (modal) return modal;

    modal = document.createElement("div");
    modal.id = "demo-modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.innerHTML = `
      <div class="demo-modal-card" role="document">
        <div class="demo-modal-head">
          <div>
            <div class="demo-modal-kicker">PoC DEMO</div>
            <h2 class="demo-modal-title" id="demo-modal-title"></h2>
            <p class="demo-modal-context" id="demo-modal-context"></p>
          </div>
          <button type="button" class="demo-modal-close" aria-label="닫기" data-demo-close>&times;</button>
        </div>
        <div class="demo-modal-body">
          <p class="demo-section-label">반영 원리</p>
          <p class="demo-principle" id="demo-modal-principle"></p>
          <div class="demo-grid">
            <div>
              <p class="demo-section-label">수집·확인 신호</p>
              <ul class="demo-list" id="demo-modal-evidence"></ul>
            </div>
            <div>
              <p class="demo-section-label">시연 상태</p>
              <ul class="demo-list" id="demo-modal-status"></ul>
            </div>
          </div>
          <div class="demo-result" id="demo-modal-result"></div>
        </div>
      </div>
    `;
    modal.addEventListener("click", (event) => {
      if (event.target === modal || event.target.closest("[data-demo-close]")) closeModal();
    });
    document.body.appendChild(modal);
    return modal;
  }

  function renderList(listEl, items) {
    listEl.innerHTML = "";
    items.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      listEl.appendChild(li);
    });
  }

  function openModal(action) {
    const modal = ensureModal();
    modal.querySelector("#demo-modal-title").textContent = `${action.label} - ${action.title}`;
    modal.querySelector("#demo-modal-context").textContent = `${action.page.name}: ${action.page.summary}`;
    modal.querySelector("#demo-modal-principle").textContent = action.principle;
    renderList(modal.querySelector("#demo-modal-evidence"), action.evidence);
    renderList(modal.querySelector("#demo-modal-status"), action.status);
    modal.querySelector("#demo-modal-result").textContent = action.result;
    modal.classList.add("is-open");
  }

  function closeModal() {
    const modal = document.getElementById("demo-modal");
    if (modal) modal.classList.remove("is-open");
  }

  function renderStateStrip(action) {
    let strip = document.getElementById("demo-state-strip");
    if (!strip) {
      strip = document.createElement("div");
      strip.id = "demo-state-strip";
      document.body.appendChild(strip);
    }
    strip.replaceChildren();

    const title = document.createElement("p");
    title.className = "demo-state-title";
    title.textContent = `${action.page.name} 데모 반영: ${action.label}`;

    const tags = document.createElement("div");
    tags.className = "demo-state-tags";
    action.status.forEach((item) => {
      const tag = document.createElement("span");
      tag.textContent = item;
      tags.appendChild(tag);
    });

    strip.append(title, tags);
  }

  function markActive(control) {
    document.querySelectorAll("[data-demo-active='true']").forEach((el) => {
      el.removeAttribute("data-demo-active");
    });
    control.setAttribute("data-demo-active", "true");
  }

  function runDemo(control) {
    const label = getControlLabel(control);
    const action = resolveAction(label);
    state.events.push({
      label,
      page: action.page.name,
      principle: action.key,
      at: new Date().toISOString()
    });
    markActive(control);
    renderStateStrip(action);
    openModal(action);
    showToast(`데모 반영: ${label} - ${action.title}`);
  }

  function installClickHandler() {
    document.addEventListener(
      "click",
      (event) => {
        const control = event.target.closest("button, a");
        if (!shouldHandle(control)) return;
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        runDemo(control);
      },
      true
    );
  }

  function installKeyboardHandler() {
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeModal();
    });
  }

  function init() {
    ensureStyles();
    installClickHandler();
    installKeyboardHandler();
    window.stitchDemo = {
      events: state.events,
      openDemo(label) {
        openModal(resolveAction(label || "데모"));
      },
      closeDemo: closeModal
    };
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
