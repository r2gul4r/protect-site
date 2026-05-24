const modal = document.querySelector("#applyModal");
const form = document.querySelector("#applyForm");
const formStatus = document.querySelector("#formStatus");
const issueButtons = [...document.querySelectorAll(".issue-list button")];
const railItems = [...document.querySelectorAll(".rail-item")];
const codePanel = document.querySelector(".code-panel");
const reviewContext = document.querySelector("#reviewContext");
const reviewContextKicker = document.querySelector("#reviewContextKicker");
const reviewContextTitle = document.querySelector("#reviewContextTitle");
const reviewContextBody = document.querySelector("#reviewContextBody");
const reviewContextList = document.querySelector("#reviewContextList");

const intakeEmail = "hello@vibesec.review";

const reviewDetails = {
  basic: {
    kicker: "Basic Review",
    title: "출시 전 1차 보안 설정 리뷰",
    body: "코드, 설정, 배포 상태를 중심으로 실제 운영 전에 먼저 막아야 할 위험을 분류합니다.",
    items: [
      "소유자 승인 범위 안의 repo와 공개 URL만 확인",
      "High / Medium / Low 기준으로 수정 우선순위 정리",
      "무단 침투, 대량 요청, 개인정보 다운로드는 제외"
    ]
  },
  auth: {
    kicker: "Authentication",
    title: "로그인과 세션 신뢰성 확인",
    body: "테스트 계정 기준으로 인증 흐름, 토큰 저장 위치, 로그아웃 처리, 보호 페이지 접근을 확인합니다.",
    items: [
      "JWT/session secret 기본값 또는 노출 가능성",
      "로그아웃 후 토큰 재사용 가능성",
      "관리자 화면과 일반 사용자 권한 분리"
    ]
  },
  api: {
    kicker: "API Security",
    title: "민감 API와 응답 범위 점검",
    body: "프론트에서 호출하는 API가 필요한 데이터만 반환하는지, CORS와 rate limit이 운영 기준에 맞는지 봅니다.",
    items: [
      "민감 API route 공개 여부",
      "과도한 사용자/주문/관리 데이터 반환",
      "CORS 허용 origin과 abuse protection 필요성"
    ]
  },
  db: {
    kicker: "Database Permissions",
    title: "DB 권한과 RLS/Rules 검토",
    body: "Supabase, Firebase, 공개 bucket처럼 AI 앱에서 자주 빠지는 데이터 접근 제어를 우선 확인합니다.",
    items: [
      "Supabase RLS 또는 Firebase Rules 적용 상태",
      "owner_id, team_id 등 리소스 소유권 검증",
      "읽기/쓰기 가능한 공개 storage 경로"
    ]
  },
  secret: {
    kicker: "Secrets Management",
    title: "Secret 노출과 환경변수 관리",
    body: "GitHub repo, 빌드 산출물, 클라이언트 환경변수에 민감 키가 섞이지 않았는지 확인합니다.",
    items: [
      "service role key, API key, JWT secret 노출 흔적",
      "NEXT_PUBLIC 등 클라이언트 공개 변수 오사용",
      "노출 의심 키의 재발급과 저장소 이력 점검"
    ]
  }
};

function openModal() {
  modal.hidden = false;
  document.body.style.overflow = "hidden";
  formStatus.textContent = "";
  modal.querySelector("input")?.focus();
}

function closeModal() {
  modal.hidden = true;
  document.body.style.overflow = "";
}

function activateRail(item) {
  railItems.forEach((rail) => rail.classList.toggle("active", rail === item));
  railItems.forEach((rail) => rail.setAttribute("aria-selected", String(rail === item)));
  reviewContext.setAttribute("aria-labelledby", item.id);
  item.classList.add("pulse");
  setTimeout(() => item.classList.remove("pulse"), 520);

  const detail = reviewDetails[item.dataset.scope] || reviewDetails.basic;
  reviewContextKicker.textContent = detail.kicker;
  reviewContextTitle.textContent = detail.title;
  reviewContextBody.textContent = detail.body;
  reviewContextList.replaceChildren(...detail.items.map((text) => {
    const li = document.createElement("li");
    li.textContent = text;
    return li;
  }));
}

function activateIssue(button) {
  issueButtons.forEach((issue) => issue.classList.toggle("active", issue === button));
  codePanel.classList.remove("highlight-code");
  void codePanel.offsetWidth;
  codePanel.classList.add("highlight-code");

  const severity = button.dataset.severity;
  const message = severity === "high"
    ? "심각 항목: Secret 노출 가능성을 우선 확인합니다."
    : severity === "warn"
      ? "개선 항목: PUBLIC 변수 사용을 검토합니다."
      : "주의 항목: 권한과 하드코딩 가능성을 확인합니다.";
  codePanel.setAttribute("aria-label", message);
}

function submitApplication(event) {
  event.preventDefault();

  const data = new FormData(form);
  const name = String(data.get("name") || "").trim();
  const email = String(data.get("email") || "").trim();
  const url = String(data.get("url") || "").trim();

  if (!form.checkValidity() || !name || !email || !url) {
    form.reportValidity();
    return;
  }

  const summary = {
    name,
    email,
    url,
    repo: String(data.get("repo") || "").trim() || "미제공",
    stack: String(data.get("stack") || "").trim() || "미입력",
    plan: data.get("plan"),
    status: data.get("status"),
    memo: String(data.get("memo") || "").trim() || "없음"
  };

  const subject = `[VibeSec Review 상담 요청] ${summary.name} / ${summary.plan}`;
  const body = [
    "VibeSec Review 상담 요청",
    "",
    `이름/닉네임: ${summary.name}`,
    `회신 이메일: ${summary.email}`,
    `서비스 URL: ${summary.url}`,
    `GitHub repo: ${summary.repo}`,
    `사용 기술: ${summary.stack}`,
    `희망 상품: ${summary.plan}`,
    `운영 상태: ${summary.status}`,
    `요청 메모: ${summary.memo}`,
    "",
    "확인:",
    "- 본인은 점검 대상의 소유자 또는 관리 권한자입니다.",
    "- 합의된 범위 밖 테스트를 요청하지 않습니다."
  ].join("\n");

  window.location.href = `mailto:${intakeEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  formStatus.textContent = "메일 앱에서 상담 요청 초안을 확인해 주세요. 열리지 않으면 hello@vibesec.review로 보내면 됩니다.";
}

document.querySelectorAll("[data-open-apply]").forEach((button) => {
  button.addEventListener("click", openModal);
});

document.querySelectorAll("[data-close-modal]").forEach((button) => {
  button.addEventListener("click", closeModal);
});

modal.addEventListener("click", (event) => {
  if (event.target === modal) closeModal();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !modal.hidden) closeModal();
});

railItems.forEach((item) => {
  item.addEventListener("click", () => activateRail(item));
});

issueButtons.forEach((button) => {
  button.addEventListener("click", () => activateIssue(button));
});

form.addEventListener("submit", submitApplication);

document.addEventListener("pointermove", (event) => {
  const x = (event.clientX / window.innerWidth - 0.5) * 10;
  const y = (event.clientY / window.innerHeight - 0.5) * 10;
  document.documentElement.style.setProperty("--mx", `${x}px`);
  document.documentElement.style.setProperty("--my", `${y}px`);
});
