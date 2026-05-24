# Current Task

- task: 신청 모달의 이용약관/개인정보 더미 문구를 운영 초안으로 교체하고 법적 리스크를 줄인다.
- phase: verification
- status: complete

# Orchestration Profile

- score_total: 8
- score_breakdown: legal_terms=3, privacy_notice=2, security_service_scope=2, chrome_review_and_local_verification=1
- hard_triggers: legal/privacy wording, security service liability boundary, user-requested Chrome Pro review
- selected_rules: spec-first, security wording, legal-risk minimization, Chrome extension review, local verification
- selected_skills: chrome-chatgpt-deep-research memory workflow, browser
- selection_reason: 이용약관과 개인정보 처리 안내는 고객 권리, 책임 제한, 권한 보증, 개인정보 처리 항목을 명확히 해야 하는 법적 리스크 영역이다.
- execution_topology: single-session
- agent_budget: 0
- efficiency_basis: 단일 신청 모달 문구/CSS 수정이며 Chrome 검토와 공식 기준 확인은 주 작업을 막지 않는 보조 검증이다.
- spawn_decision: no-spawn
- reason: score_total 8이지만 쓰기 범위가 `index.html`, `styles.css`, `STATE.md`로 좁고 약관 초안 반영은 하나의 응집된 카피 변경이라 단일 세션에서 수정, 검증, 자체 리뷰를 끝낸다.

# Writer Slot

- main: owns static frontend clone, docs update, and `STATE.md`
- writer_slot: main
- write_sets:
  - `STATE.md`: task state and verification record
  - `index.html`: static landing page UI
  - `styles.css`: visual clone, responsive layout, animation styling
  - `script.js`: interactions and micro interactions
  - `api/inquiries.js`: same-origin intake API contract and email dispatch boundary
  - `PLAN.md`: implementation plan note if product scope changes
  - `README.md`: current intake API deployment note

# Contract Freeze

- contract_freeze: frozen
- source: latest user request, README positioning, current static page
- deliverables:
  - Replace dummy terms with an operational draft covering service purpose, owner authority, scope, prohibited actions, output limits, cancellation/refund, confidentiality, and liability limits.
  - Replace dummy privacy notice with an operational draft covering collected fields, purpose, retention, access data, third-party/tool use, data-subject rights, and safety measures.
  - Keep visible legal-review warning so the page does not pretend final legal compliance.
  - Preserve required owner, scope, and terms consent before submission.
- risks:
  - Do not over-disclaim provider liability or exclude intentional/gross negligence.
  - Do not weaken customer cancellation/refund rights.
  - Do not imply full legal compliance before professional review.
  - Do not alter form submission or validation behavior.

# Reviewer

- review_required: self-review only
- review_reason: static frontend and security-service content wording

# Last Update

- 2026-05-24 KST: Task classified, contract frozen, single-session selected.
- 2026-05-24 KST: Created `AGENTS.md` and `PLAN.md`; verified `AGENTS.md` is 69 lines and key MVP/security wording is present.
- 2026-05-24 KST: Reclassified task for Git remote save; selected single-session with remote-state check before push.
- 2026-05-24 KST: Local commit `09fd0cd` created; push blocked by Git dubious ownership under escalated user, safe.directory registration needed.
- 2026-05-24 KST: Amended local commit to `c6f05e3`; push blocked by GitHub GH007 email privacy protection, noreply author amend needed.
- 2026-05-24 KST: Amended commit to `d680ded` with GitHub noreply identity and pushed `main` to origin successfully.
- 2026-05-24 KST: Reclassified task for MVP product-flow planning and five homepage image mockups; selected single-session with imagegen skill.
- 2026-05-24 KST: Reclassified for image-based frontend clone; score_total 8, single-session selected due cohesive static write set and no subagent standing authorization.
- 2026-05-24 KST: Replaced hand-made CSS/text icons with Lucide-sourced inline SVG icons; Chrome preview verified SVG rendering and no text-symbol icon leakage.
- 2026-05-24 KST: Verification path settled on Chrome extension with localhost static server; JS syntax and Chrome render checks passed.
- 2026-05-24 KST: Commit `1d7e2a8` pushed to `origin/main`; implementation task complete.
- 2026-05-24 KST: Reclassified for production content pass; remove sound/download demo and expand service sections.
- 2026-05-24 KST: Removed sound and fake report download; expanded scope, deliverable, pricing, process, FAQ, and apply sections; Chrome verification passed.
- 2026-05-24 KST: Static checks passed; ready to commit and push production content pass.
- 2026-05-24 KST: Reclassified for browser comment UX fix; selected single-session targeted update.
- 2026-05-24 KST: Review rail changed to inline preview tabs; removed bottom toast and risk-card click behavior; in-app browser DOM verification passed.
- 2026-05-24 KST: Reclassified for production copy fix after browser comment on MVP wording; selected single-session targeted update.
- 2026-05-24 KST: Removed public MVP/demo-like wording from pricing, apply, FAQ, and modal copy; in-app browser DOM verification passed with zero visible MVP/demo terms.
- 2026-05-24 KST: Reclassified for modal close icon alignment; selected single-session targeted update.
- 2026-05-24 KST: Replaced text close glyph with Lucide SVG X and verified modal close button/icon centers match in the in-app browser.
- 2026-05-24 KST: Reclassified for application form validation, consent, and same-page submission flow; selected single-session due focused modal write set.
- 2026-05-24 KST: Expanded write set to include `api/inquiries.js` because direct email sending must happen server-side, not from frontend secrets.
- 2026-05-24 KST: Expanded docs write set to include README/PLAN intake notes for server-side email environment variables.
- 2026-05-24 KST: Added required consent, email/URL validation, same-page fetch submission, and server-side Resend dispatch endpoint; static and browser checks passed.
- 2026-05-24 KST: Reclassified for modal close button scroll persistence; selected single-session targeted update.
- 2026-05-24 KST: Split modal scroll into `.apply-modal-content`; close button stays on the modal frame while internal content scrolls.
- 2026-05-24 KST: Reclassified for hidden modal scrollbar; selected single-session targeted update.
- 2026-05-24 KST: Hid `.apply-modal-content` scrollbar while preserving internal scroll; in-app browser verified `canScroll=true` and hidden scrollbar styles.
- 2026-05-24 KST: Reclassified for expandable dummy terms and privacy content in application modal; selected single-session targeted update.
- 2026-05-24 KST: Added expandable dummy terms/privacy notices; in-app browser verified both disclosures open and required consent remains intact.
- 2026-05-24 KST: Reclassified for launch-discount pricing adjustment; selected single-session targeted update.
- 2026-05-24 KST: Lowered displayed prices to Basic 39k, Standard 99k, Fix PR 59k; added original-price strike-through and launch-discount badges; browser verification passed.
- 2026-05-24 KST: Reclassified for generalizing DB/permission wording away from vendor-specific public copy.
- 2026-05-24 KST: Replaced public DB Rules/Supabase/Firebase wording with generic data access permission review; in-app browser verified zero vendor-specific mentions in scope and preview.
- 2026-05-24 KST: Reclassified for limited manual verification positioning in Standard without broad penetration-test claims.
- 2026-05-24 KST: Added Standard limited manual verification copy, FAQ exclusions, and plan notes; in-app browser verified no broad penetration-test claims.
- 2026-05-24 KST: Reclassified for operational terms/privacy draft; Chrome Pro review and official privacy/terms criteria are being used to reduce legal-risky wording.
- 2026-05-24 KST: Replaced dummy terms/privacy text with operational drafts; JS syntax checks and in-app browser modal disclosure verification passed.
