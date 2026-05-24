const soundToggle = document.querySelector(".sound-toggle");
const modal = document.querySelector("#applyModal");
const toast = document.querySelector("#toast");
const form = document.querySelector("#applyForm");
const issueButtons = [...document.querySelectorAll(".issue-list button")];
const railItems = [...document.querySelectorAll(".rail-item")];
const riskCards = [...document.querySelectorAll(".risk-card")];
const codePanel = document.querySelector(".code-panel");
const reportButton = document.querySelector("#downloadReport");

let soundEnabled = false;
let audioContext;
let toastTimer;

const scopeCopy = {
  basic: "Basic Review 항목 전체를 기준으로 요약했습니다.",
  auth: "인증 흐름과 세션 처리 항목을 강조했습니다.",
  api: "API 노출과 응답 범위 항목을 강조했습니다.",
  db: "DB 권한과 RLS/Rules 항목을 강조했습니다.",
  secret: "Secret 노출 가능성과 환경변수 관리 항목을 강조했습니다."
};

function ensureAudio() {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  if (audioContext.state === "suspended") {
    audioContext.resume();
  }
}

function beep(type = "tap") {
  if (!soundEnabled) return;
  ensureAudio();

  const now = audioContext.currentTime;
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  const frequency = type === "success" ? 720 : type === "warn" ? 260 : 520;

  oscillator.type = type === "warn" ? "sawtooth" : "sine";
  oscillator.frequency.setValueAtTime(frequency, now);
  oscillator.frequency.exponentialRampToValueAtTime(frequency * 1.22, now + 0.08);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(type === "warn" ? 0.055 : 0.035, now + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start(now);
  oscillator.stop(now + 0.13);
}

function showToast(message, type = "tap") {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("show");
  beep(type);
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
  beep("tap");
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
  showToast(message, severity === "high" ? "warn" : "tap");
}

function downloadReport() {
  const reportText = [
    "VibeSec Review Sample Report",
    "",
    "요약",
    "- 심각: Secret 노출 가능성 1건",
    "- 주의: DB 권한/하드코딩 가능성 2건",
    "- 개선: PUBLIC 변수 사용 검토 1건",
    "",
    "주의: 이 파일은 데모용 샘플입니다."
  ].join("\n");
  const blob = new Blob([reportText], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "report_2024-05-20-demo.txt";
  anchor.click();
  URL.revokeObjectURL(url);
  showToast("샘플 리포트 다운로드를 생성했습니다.", "success");
}

function submitApplication(event) {
  event.preventDefault();

  const data = new FormData(form);
  const name = String(data.get("name") || "").trim();
  const email = String(data.get("email") || "").trim();
  const url = String(data.get("url") || "").trim();

  if (!form.checkValidity() || !name || !email || !url) {
    form.reportValidity();
    beep("warn");
    return;
  }

  const summary = {
    name,
    email,
    url,
    plan: data.get("plan")
  };

  console.info("VibeSec Review demo application", summary);
  closeModal();
  form.reset();
  showToast("상담 요청 데모가 생성됐습니다. 실제 전송은 다음 단계에서 이메일 연동으로 붙입니다.", "success");
}

soundToggle.addEventListener("click", () => {
  soundEnabled = !soundEnabled;
  soundToggle.setAttribute("aria-pressed", String(soundEnabled));
  soundToggle.setAttribute("aria-label", soundEnabled ? "사운드 끄기" : "사운드 켜기");
  if (soundEnabled) {
    ensureAudio();
    beep("success");
    showToast("사운드 효과가 켜졌습니다.", "success");
  } else {
    showToast("사운드 효과가 꺼졌습니다.");
  }
});

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

reportButton.addEventListener("click", downloadReport);
form.addEventListener("submit", submitApplication);

document.querySelectorAll("a[href^='#']").forEach((link) => {
  link.addEventListener("click", () => beep("tap"));
});

document.addEventListener("pointermove", (event) => {
  const x = (event.clientX / window.innerWidth - 0.5) * 10;
  const y = (event.clientY / window.innerHeight - 0.5) * 10;
  document.documentElement.style.setProperty("--mx", `${x}px`);
  document.documentElement.style.setProperty("--my", `${y}px`);
});
