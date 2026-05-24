const CONTACT_EMAIL = "hello@vibesec.review";
const MAX_BODY_BYTES = 24 * 1024;
const ALLOWED_PLANS = new Set(["Basic Review", "Standard Review", "Fix PR Add-on"]);
const ALLOWED_STATUSES = new Set(["개발중", "스테이징", "운영중"]);
const ALLOWED_REPO_ACCESS = new Set(["공개 repo", "비공개 repo 초대 가능", "repo 제공 불가"]);

function sendJson(response, statusCode, body) {
  response.statusCode = statusCode;
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.setHeader("Cache-Control", "no-store");
  response.end(JSON.stringify(body));
}

function trimText(value, maxLength) {
  return String(value || "").trim().slice(0, maxLength);
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(value);
}

function parseHttpUrl(value, required = false) {
  const text = trimText(value, 240);
  if (!text) return required ? null : "";

  try {
    const parsed = new URL(text);
    if (!["http:", "https:"].includes(parsed.protocol)) return null;
    return parsed.href;
  } catch {
    return null;
  }
}

function normalizePayload(body) {
  if (trimText(body.company, 80)) {
    return { bot: true };
  }

  const payload = {
    name: trimText(body.name, 80),
    email: trimText(body.email, 160),
    url: parseHttpUrl(body.url, true),
    repo: parseHttpUrl(body.repo),
    repoAccess: trimText(body.repoAccess, 80),
    stack: trimText(body.stack, 160),
    plan: trimText(body.plan, 80),
    status: trimText(body.status, 40),
    memo: trimText(body.memo, 1000),
    source: parseHttpUrl(body.source),
    consent: {
      owner: body.consent?.owner === true,
      scope: body.consent?.scope === true,
      terms: body.consent?.terms === true
    }
  };

  const invalid = !payload.name
    || !isEmail(payload.email)
    || !payload.url
    || trimText(body.repo, 240) && !payload.repo
    || !ALLOWED_REPO_ACCESS.has(payload.repoAccess)
    || !ALLOWED_PLANS.has(payload.plan)
    || !ALLOWED_STATUSES.has(payload.status)
    || !payload.consent.owner
    || !payload.consent.scope
    || !payload.consent.terms;

  if (invalid) return null;
  return payload;
}

async function readJsonBody(request) {
  if (request.body && typeof request.body === "object") return request.body;
  if (typeof request.body === "string") return JSON.parse(request.body);

  let size = 0;
  let raw = "";

  for await (const chunk of request) {
    size += chunk.length;
    if (size > MAX_BODY_BYTES) {
      const error = new Error("payload too large");
      error.code = "PAYLOAD_TOO_LARGE";
      throw error;
    }
    raw += chunk;
  }

  return JSON.parse(raw || "{}");
}

function buildEmailText(payload) {
  return [
    "VibeSec Review 의뢰 접수",
    "",
    `이름/닉네임: ${payload.name}`,
    `회신 이메일: ${payload.email}`,
    `서비스 URL: ${payload.url}`,
    `GitHub repo: ${payload.repo || "미제공"}`,
    `Repo 접근 방식: ${payload.repoAccess}`,
    `사용 기술: ${payload.stack || "미입력"}`,
    `희망 상품: ${payload.plan}`,
    `운영 상태: ${payload.status}`,
    `요청 메모: ${payload.memo || "없음"}`,
    `접수 페이지: ${payload.source || "미확인"}`,
    "",
    "동의:",
    "- 점검 대상 소유자 또는 관리 권한자 확인",
    "- 합의된 범위 밖 테스트 요청 없음",
    "- 이용약관과 개인정보 처리 안내 동의"
  ].join("\n");
}

async function sendWithResend(payload) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.INTAKE_FROM_EMAIL;
  const to = process.env.INTAKE_TO_EMAIL || CONTACT_EMAIL;

  if (!apiKey || !from) {
    return { ok: false, code: "INTAKE_NOT_CONFIGURED" };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from,
      to,
      reply_to: payload.email,
      subject: `[VibeSec Review 의뢰] ${payload.name} / ${payload.plan}`,
      text: buildEmailText(payload)
    })
  });

  if (!response.ok) {
    return { ok: false, code: "EMAIL_PROVIDER_ERROR" };
  }

  return { ok: true };
}

module.exports = async function handler(request, response) {
  if (request.method === "OPTIONS") {
    response.statusCode = 204;
    response.end();
    return;
  }

  if (request.method !== "POST") {
    sendJson(response, 405, { ok: false, code: "METHOD_NOT_ALLOWED" });
    return;
  }

  try {
    const rawBody = await readJsonBody(request);
    const payload = normalizePayload(rawBody);

    if (payload?.bot) {
      sendJson(response, 202, { ok: true });
      return;
    }

    if (!payload) {
      sendJson(response, 400, { ok: false, code: "INVALID_INPUT" });
      return;
    }

    const result = await sendWithResend(payload);
    if (!result.ok) {
      sendJson(response, result.code === "INTAKE_NOT_CONFIGURED" ? 503 : 502, result);
      return;
    }

    sendJson(response, 200, { ok: true });
  } catch (error) {
    const status = error.code === "PAYLOAD_TOO_LARGE" ? 413 : 400;
    sendJson(response, status, { ok: false, code: "REQUEST_REJECTED" });
  }
};
