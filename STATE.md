# Current Task

- task: 신청 모달의 개인정보 처리 안내를 실제 사용 가능한 개인정보 처리방침 문구로 구체화한다.
- phase: verification
- status: complete

# Orchestration Profile

- score_total: 7
- score_breakdown: privacy_notice=3, legal_basis_and_retention=2, public_form_data_flow=1, local_browser_verification=1
- hard_triggers: legal/privacy wording, public intake form, official privacy criteria dependency
- selected_rules: spec-first, security wording, legal-risk minimization, local verification
- selected_skills: browser
- selection_reason: 개인정보 처리 안내를 실제 처리방침처럼 쓰려면 수집 항목, 목적, 보유기간, 파기, 권리행사, 고충처리 연락처, 위탁/제3자 제공 여부를 구체화해야 한다.
- execution_topology: single-session
- agent_budget: 0
- efficiency_basis: 단일 신청 모달 문구 수정이고 처리방침 항목은 하나의 응집된 카피 블록이라 분리 비용이 더 크다.
- spawn_decision: no-spawn
- reason: score_total 7이지만 쓰기 범위가 `index.html`, `STATE.md`로 좁고 공식 개인정보 처리방침 기준 확인 후 단일 세션에서 수정과 검증을 끝낸다.

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
  - Replace privacy draft wording with directly usable privacy policy wording.
  - Include concrete collection items, processing purpose, legal basis, retention/destruction, third-party provision, processing tools, data-subject rights, security measures, and contact point.
  - Keep the text aligned with the actual intake form and server-side email dispatch behavior.
  - Preserve required owner, scope, and terms consent before submission.
- risks:
  - Do not claim processing practices that the current form/API does not support.
  - Do not collect or encourage sensitive secrets in the form.
  - Do not leave vague "later decide" wording in the user-visible privacy policy.
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
- 2026-05-24 KST: Reclassified for usable privacy policy wording based on current intake form behavior and official privacy-policy criteria.
- 2026-05-24 KST: Updated privacy disclosure to usable policy wording; JS syntax checks and in-app browser modal verification passed.
