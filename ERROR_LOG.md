# ERROR_LOG

## 2026-05-24 KST

- time: 2026-05-24 KST
- location: `D:\git\protect-site(semi)`
- summary: `git push -u origin main` failed under escalated execution because Git detected dubious ownership.
- details: Repository `.git` is owned by `PC/CodexSandboxOffline`, while escalated push runs as `PC/Administrator`; Git requested adding this workspace to `safe.directory`.
- status: resolved for `safe.directory` registration after quoting the path; push retry pending.

## 2026-05-24 KST

- time: 2026-05-24 KST
- location: `D:\git\protect-site(semi)`
- summary: First `git config --global --add safe.directory` retry failed because PowerShell parsed the unquoted parenthesized path.
- details: `D:/git/protect-site(semi)` must be quoted in PowerShell so `(semi)` is not interpreted as an expression.
- status: resolved by rerunning with `'D:/git/protect-site(semi)'`.

## 2026-05-24 KST

- time: 2026-05-24 KST
- location: `D:\git\protect-site(semi)`
- summary: `git push -u origin main` was rejected by GitHub GH007 email privacy protection.
- details: The commit used the local public email address, so GitHub refused to publish it.
- status: open, pending local repo email change to GitHub noreply and commit amend.
