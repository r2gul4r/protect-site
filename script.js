const modal = document.querySelector("#applyModal");
const toast = document.querySelector("#toast");
const form = document.querySelector("#applyForm");
const issueButtons = [...document.querySelectorAll(".issue-list button")];
const railItems = [...document.querySelectorAll(".rail-item")];
const riskCards = [...document.querySelectorAll(".risk-card")];
const codePanel = document.querySelector(".code-panel");

let toastTimer;
const intakeEmail = "hello@vibesec.review";

const scopeCopy = {
  basic: "Basic Review 항목 전체를 기준으로 요약했습니다.",
  auth: "인증 흐름과 세션 처리 항목을 강조했습니다.",
  api: "API 노출과 응답 범위 항목을 강조했습니다.",
  db: "DB 권한과 RLS/Rules 항목을 강조했습니다.",
  secret: "Secret 노출 가능성과 환경변수 관리 항목을 강조했습니다."
};

function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("show");
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}

function openModal() {
  modal.hidden = false;
  document.body.style.overflow = "hidden";
  modal.querySelector("input")?.focus();
  showToast("의뢰 신청은 이메일 접수 방식으로 진행됩니다.");
}

function closeModal() {
  modal.hidden = true;
  document.body.style.overflow = "";
}

function activateRail(item) {
  railItems.forEach((rail) => rail.classList.toggle("active", rail === item));
  item.classList.add("pulse");
  setTimeout(() => item.classList.remove("pulse"), 520);
  showToast(scopeCopy[item.dataset.scope] || "리뷰 항목을 선택했습니다.");
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
  showToast(message);
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
  closeModal();
  form.reset();
  showToast("메일 앱에서 상담 요청 초안을 확인해 주세요.");
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

riskCards.forEach((card) => {
  card.addEventListener("click", () => {
    card.classList.add("pulse");
    setTimeout(() => card.classList.remove("pulse"), 520);
    showToast(`${card.querySelector(".risk-name").textContent} 항목만 리포트에서 확인합니다.`);
  });
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
