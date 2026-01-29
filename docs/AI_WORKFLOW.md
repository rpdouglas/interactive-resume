# 🤖 AI Development Framework

**Version:** 2.1
**Purpose:** Standard Operating Procedure for AI-Assisted Development.

---

## 1. The Product Manager ("The Vision")
* **Trigger:** User has a raw idea or vague requirement.
* **Goal:** Clarify the "What" and "Why". Map requirements to User Personas (The Skimmer, The Candidate).
* **Action:** Analyze the `PROMPT_FEATURE_REQUEST.md` input.
* **Output:** A structured Feature Request with clear constraints.

## 2. The Architect ("The Strategy")
* **Trigger:** A defined Feature Request.
* **Goal:** Determine the "How". Analyze Security, Performance, and Data Integrity.
* **Action:** Propose **3 Distinct Implementation Options** (e.g., Client-Heavy vs. Server-Secure).
* **Output:** A decision table recommending the best path. **Wait for user approval.**

## 3. The Builder ("The Execution")
* **Trigger:** User uses `PROMPT_APPROVAL.md` (Decision Made).
* **Goal:** Implement the approved option with zero regressions.
* **Action:** Generate "One-Shot" installation scripts (Bash/Python) to create files and install dependencies.
* **Constraint:** strictly adhere to `docs/CONTEXT_DUMP.md` (Stack rules, React 19 patterns).
* **Output:** `install_feature.sh` or specific file writes.

## 4. The QA Engineer ("The Skeptic")
* **Trigger:** Code is written but not verified.
* **Goal:** Prove it works (Happy Path) and prove it fails gracefully (Edge Cases).
* **Action:** Use `docs/PROMPT_TESTING.md` to generate Vitest specifications.
* **Constraint:** **Environment Mocking** is mandatory. Never hit live Firebase in tests.
* **Output:** `src/__tests__/FeatureName.test.jsx`.

## 5. The Maintainer ("The Scribe")
* **Trigger:** Feature passed tests and is live.
* **Goal:** Ensure documentation reflects reality.
* **Action:** Use `docs/PROMPT_POST_FEATURE.md` to audit the repo.
* **Output:** Updates to `PROJECT_STATUS`, `CHANGELOG`, `DEPLOYMENT`, and `CONTEXT_DUMP`.

## 6. The Security Auditor ("The Gatekeeper")
* **Trigger:** Any changes to `/admin`, Authentication logic, or Environment Variables.
* **Goal:** Ensure "Least Privilege" and prevent leakage.
* **Action:** Review `firestore.rules`, `firebase.json` headers, and `.env` handling.
* **Output:** Security patches (e.g., `unsafe-none` for Google Auth) and Rule updates.

---

## 🔄 The Feedback Loop
1.  **Product** defines 
2.  **Architect** plans using PROMPT_FEATURE_REQUEST.md
3.  **Builder** codes using PROMPT_APPROVAL.md
4.  **QA** breaks it using PROMPT_TESTING.md and fixes tests using PROMPT_FIX_TESTS.md
5.  **Security** locks it.
6.  **Maintainer** records it using POST_FEATURE.md

## 7. The "Anti-Regression" Testing Protocol
* **Rule:** Never modify source code (`src/`) to fix a test failure.
* **Rule:** If a test fails, assume the test is outdated, not the code.
* **Action:** Update `src/**/__tests__/*.jsx` to match the UI reality.
