# The Job Whisperer: CODEBASE DUMP
**Date:** Wed Jan 28 23:29:04 UTC 2026
**Description:** Complete codebase context.

## FILE: .firebaserc
```firebaserc
{
  "projects": {
    "default": "ryandouglas-resume"
  }
}

```
---

## FILE: .github/workflows/deploy-preview.yml
```yml
name: Deploy to Preview Channel

on:
  pull_request:
    types: [opened, synchronize, reopened]

# âœ… FIX: Grant permissions to write checks and PR comments
permissions:
  checks: write
  contents: read
  pull-requests: write

jobs:
  build_and_preview:
    if: '${{ github.event.pull_request.head.repo.full_name == github.repository }}'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js (Enable Caching)
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
      
      - name: Install Dependencies
        run: npm ci

      # âœ… FIX: Inject VITE_ vars during build
      - name: Build
        run: npm run build
        env:
          VITE_API_KEY: ${{ secrets.VITE_API_KEY }}
          VITE_AUTH_DOMAIN: ${{ secrets.VITE_AUTH_DOMAIN }}
          VITE_PROJECT_ID: ${{ secrets.VITE_PROJECT_ID }}
          VITE_STORAGE_BUCKET: ${{ secrets.VITE_STORAGE_BUCKET }}
          VITE_MESSAGING_SENDER_ID: ${{ secrets.VITE_MESSAGING_SENDER_ID }}
          VITE_APP_ID: ${{ secrets.VITE_APP_ID }}
          VITE_MEASUREMENT_ID: ${{ secrets.VITE_MEASUREMENT_ID }}
          # We don't need the Admin Email for public preview builds usually, 
          # but if you have logic relying on it, you can add it here.

      - name: Deploy to Firebase Preview
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          projectId: '${{ secrets.FIREBASE_PROJECT_ID }}'

```
---

## FILE: .github/workflows/deploy-prod.yml
```yml
name: Deploy to Live Production

on:
  push:
    branches:
      - main

jobs:
  build_and_deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js (Enable Caching)
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install Dependencies
        run: npm ci

      # âœ… FIX: Inject VITE_ vars during build
      - name: Build
        run: npm run build
        env:
          VITE_API_KEY: ${{ secrets.VITE_API_KEY }}
          VITE_AUTH_DOMAIN: ${{ secrets.VITE_AUTH_DOMAIN }}
          VITE_PROJECT_ID: ${{ secrets.VITE_PROJECT_ID }}
          VITE_STORAGE_BUCKET: ${{ secrets.VITE_STORAGE_BUCKET }}
          VITE_MESSAGING_SENDER_ID: ${{ secrets.VITE_MESSAGING_SENDER_ID }}
          VITE_APP_ID: ${{ secrets.VITE_APP_ID }}
          VITE_MEASUREMENT_ID: ${{ secrets.VITE_MEASUREMENT_ID }}

      - name: Deploy to Live
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          projectId: '${{ secrets.FIREBASE_PROJECT_ID }}'
          channelId: live

```
---

## FILE: .gitignore
```gitignore
# Dependencies
node_modules
.pnp
.pnp.js

# Testing
coverage

# Production
dist
build

# Environment
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDEs
.vscode/*
!.vscode/extensions.json
.idea
*.swp
.DS_Store

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
firebase-debug.log*

# Firebase
.firebase
update_docs.py

.env*
update_docs.py

```
---

## FILE: CONTRIBUTING.md
```md
# ğŸ‘· Contributing to the Interactive Resume

Welcome to the development guide. This project uses a **Hybrid Cloud** architecture:
* **Frontend:** React 19 + Vite (Local)
* **Backend:** Firebase Cloud Functions (Remote/Serverless)
* **Database:** Cloud Firestore (Remote)

## 1. Getting Started

### Prerequisites
* Node.js v20+
* Firebase CLI (`npm install -g firebase-tools`)
* Java (Required only if running local Emulators)

### Setup
1.  **Clone the repo:**
    ```bash
    git clone [https://github.com/rpdouglas/interactive-resume.git](https://github.com/rpdouglas/interactive-resume.git)
    ```
2.  **Install Dependencies:**
    ```bash
    npm ci
    cd functions && npm ci && cd ..
    ```
3.  **Environment Variables:**
    Create a `.env.local` file in the root. **Do not commit this.**
    ```ini
    VITE_API_KEY=your_firebase_api_key
    VITE_AUTH_DOMAIN=your_project.firebaseapp.com
    VITE_PROJECT_ID=your_project_id
    # ... other firebase config
    ```

## 2. The Development Loop

### A. Frontend Development (UI/UX)
We use Vite for HMR (Hot Module Replacement).
```bash
npm run dev
```
* **Access:** `http://localhost:5173`
* **Auth:** Uses your real Firebase Auth users (Production Data).
* **Data:** Reads from the live Firestore (be careful with writes!).

### B. Backend Development (Cloud Functions)
Functions (Gemini AI triggers) must be deployed to Google Cloud to work reliably with the live database, or run via emulators.

**Option 1: Deploy to Cloud (Easiest)**
```bash
firebase deploy --only functions
```

**Option 2: Local Emulators (Advanced)**
```bash
firebase emulators:start
```

## 3. Branching Strategy
* **`main`**: Production-ready code. Deployed automatically via GitHub Actions.
* **`feature/SprintX.Y`**: Active development.
* **Process:**
    1.  Create Feature Branch.
    2.  Develop & Test (`npm test`).
    3.  Merge to Main -> Triggers Deploy.

## 4. Testing
We use Vitest. Tests **MUST** mock Firebase network calls.
```bash
npm test
```
```
---

## FILE: README.md
```md
# ğŸ¦… The Job Whisperer

> **The AI Agent that tailored this resume gets the interview.**

![Version](https://img.shields.io/badge/version-3.2.0--beta-blue.svg)
![Stack](https://img.shields.io/badge/stack-React_19_|_Firebase_|_Gemini-orange.svg)
![Status](https://img.shields.io/badge/status-Production-green.svg)

**The Job Whisperer** is not just a portfolioâ€”it is a self-curating **Career Management System (CMS)**. It uses Google's Gemini 2.5 Flash to analyze Job Descriptions (JDs), identify gaps, rewrite bullet points, and draft cover letters in real-time.

## ğŸ—ï¸ System Architecture

```mermaid
graph TD
    User[Recruiter / Public] -->|Reads| CDN[Firebase Hosting]
    Admin[You / Candidate] -->|Auth| CMS[Admin Dashboard]
    
    subgraph "The Content Factory (Server-Side)"
        CMS -->|Writes JD| DB[(Cloud Firestore)]
        DB -->|Triggers| CF[Cloud Functions]
        CF -->|Prompt| AI[Gemini 2.5 Flash]
        AI -->|Analysis/Tailoring| DB
    end
    
    subgraph "Client-Side (React 19)"
        DB -->|Real-time Sync| Dashboard[Analysis UI]
        Dashboard -->|Diff View| ResumeTailor[Resume Tailor]
    end
```

## ğŸš€ Key Features

### 1. ğŸ§  The Analysis Engine
* **Vector Matching:** Instantly scores your profile against a JD (0-100%).
* **Gap Detection:** Identifies missing keywords (e.g., "Docker", "Kubernetes") and suggests specific projects to highlight.

### 2. ğŸ§µ The Resume Tailor (Diff Engine)
* **Problem:** Generic resumes fail ATS (Applicant Tracking Systems).
* **Solution:** An "Ethical Editor" agent that rewrites your existing bullet points to match the JD's language *without* inventing facts.
* **UI:** Side-by-Side "Diff View" (Red/Green) to review changes before accepting.

### 3. âœï¸ The Cover Letter Engine
* **Zero-Shot Generation:** Creates a persuasive, context-aware cover letter in < 5 seconds.
* **PDF Export:** Built-in "White Paper" styling for instant PDF generation.

## ğŸ› ï¸ Tech Stack & Decisions

| Layer | Technology | Rationale |
| :--- | :--- | :--- |
| **Frontend** | React 19 + Vite | Concurrent rendering for complex dashboards. |
| **Styling** | Tailwind CSS v4 | "Mobile-First" utility classes for speed. |
| **Backend** | Firebase Functions (Gen 2) | Serverless scalability for AI triggers. |
| **Database** | Cloud Firestore | Real-time listeners (`onSnapshot`) for instant UI feedback. |
| **AI Model** | Gemini 2.5 Flash | Low latency (necessary for interactive editing). |

## ğŸ‘· Local Development

See [CONTRIBUTING.md](./CONTRIBUTING.md) for setup instructions.

```bash
# Quick Start
npm install
npm run dev
```

## ğŸ“œ License
Proprietary. Built by Ryan Douglas.
```
---

## FILE: docs/ADR/001-resume-tailor-strategy.md
```md
# ADR 001: Resume Tailor Data Strategy (Delta Patching)

**Date:** 2026-01-28
**Status:** Accepted
**Context:** Sprint 19.3

## Context
We needed a way to tailor the candidate's resume for specific Job Descriptions (JDs) to increase ATS matching scores.
The "Master Resume" is stored in Firestore (`experience` collection). We faced a choice on how to persist these customizations.

## The Options Considered
1.  **Shadow Resume:** Deep clone the entire resume tree for every application.
    * *Pros:* Complete isolation.
    * *Cons:* Massive data duplication, high storage costs, complex sync if Master changes.
2.  **Ephemeral:** Generate on-the-fly in memory.
    * *Pros:* Zero storage cost.
    * *Cons:* Expensive API costs (re-generating on every page load), poor UX (waiting).
3.  **Delta Patching (Selected):** Store only the specific bullet points that changed.

## Decision
We chose **Option 3: Delta Patching**.
We store an array of `tailored_bullets` inside the `application` document. The UI renders the Master Resume, but "swaps" specific bullets with their tailored versions at runtime (or displays them side-by-side in Diff View).

## Consequences
* **Positive:** Minimal storage footprint. Preserves the "Single Source of Truth" (Master Resume).
* **Negative:** Requires client-side logic to merge/display the diffs.
* **Guardrails:** We explicitly prompt the AI to *not* invent facts, only rephrase existing ones ("The Ethical Editor" protocol).
```
---

## FILE: docs/ADR/002-resume-snapshot-strategy.md
```md
# ADR 002: Resume Versioning Strategy (Snapshots)

**Date:** 2026-01-28
**Status:** Accepted
**Context:** Sprint 19.4

## Context
Candidates need to save the specific version of a resume sent to a company.
The "Master Resume" evolves over time. If we only link to the Master, old applications will display incorrect/new data, breaking the historical record.

## Options Considered
1.  **Runtime Overlay:** Store only Diff IDs. (Rejected: Vulnerable to Master Resume deletion).
2.  **Binary Storage:** Save PDF to Blob Storage. (Rejected: Hard to search/index, heavy infrastructure).
3.  **JSON Snapshot:** Deep copy the rendered JSON to the `application` document. (Selected).

## Decision
We will implement **Option 3: JSON Snapshot**.
When a user clicks "Finalize", we:
1.  Merge the Master Resume + Selected AI Tailored Bullets.
2.  Write the resulting JSON object to a new field `resume_snapshot` in the `applications` collection.
3.  Lock the application (`is_frozen: true`).

## Consequences
* **Immutable History:** We can strictly render *exactly* what the recruiter saw.
* **Printability:** We can generate PDFs on-the-fly from the JSON without storing binary files.
* **Storage:** Slightly increased Firestore document size, but well within the 1MB limit.

```
---

## FILE: docs/ADR/003-async-ai-pipeline.md
```md
# ADR 003: Async AI Pipeline (Trigger Pattern)

**Date:** 2026-01-28 (Backfilled)
**Status:** Accepted
**Context:** Sprint 17 (Application Manager)

## Context
We introduced Generative AI (Gemini) to analyze Job Descriptions.
LLM API calls are slow (5-15 seconds) and non-deterministic. Keeping the client waiting on a synchronous HTTP connection (`await fetch`) resulted in timeouts.

## Decision
We adopted the **Firestore Trigger Pattern**.
1.  **Write:** UI creates a document in `applications` with `ai_status: 'pending'`.
2.  **Trigger:** Cloud Function `onDocumentWritten` detects the change.
3.  **Process:** Server calls Gemini API.
4.  **Update:** Server updates document with `ai_status: 'complete'`.
5.  **Listen:** UI uses `onSnapshot` to reactively display the result.
```
---

## FILE: docs/ADR/004-hybrid-data-strategy.md
```md
# ADR 004: Hybrid Data Strategy (Indestructible Fallback)

**Date:** 2026-01-28 (Backfilled)
**Status:** Accepted
**Context:** Sprint 16 (The Backbone)

## Context
Relying solely on Firestore introduced risks: Quota limits, Offline scenarios, or Misconfigured Security Rules could cause a "White Screen of Death".

## Decision
We implemented the **"Indestructible Fallback"** pattern.
Our data hooks (`useResumeData`) wrap Firestore calls in a `try/catch` block. If *any* error occurs, we immediately return the static data located in `src/data/*.json`.
```
---

## FILE: docs/ADR/005-deep-fetch-pattern.md
```md
# ADR 005: Deep Fetch (Recursive Hydration)

**Date:** 2026-01-28 (Backfilled)
**Status:** Accepted
**Context:** Sprint 16 (The Backbone)

## Context
Firestore queries are **shallow**. Fetching a `Job` document does *not* fetch its `Projects` sub-collection.

## Decision
We chose **Recursive Client-Side Joining**.
Our data fetcher retrieves the parent collection (`experience`), maps over the results, and triggers a `Promise.all` to fetch the `projects` sub-collection for each job.
```
---

## FILE: docs/ADR/006-security-perimeter.md
```md
# ADR 006: Security Perimeter (Email Whitelist)

**Date:** 2026-01-28 (Backfilled)
**Status:** Accepted
**Context:** Sprint 2 (Project Setup)

## Context
We needed to secure the Admin CMS without building a complex multi-tenant User Management system.

## Decision
We implemented a **Hard Perimeter** using Email Whitelisting.
1.  **Frontend:** `AuthContext` checks `user.email` against `VITE_ADMIN_EMAIL`.
2.  **Backend:** `firestore.rules` enforces write access only if `request.auth.token.email` matches the admin email.
```
---

## FILE: docs/AI_WORKFLOW.md
```md
# ğŸ¤– AI Development Framework

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

## ğŸ”„ The Feedback Loop
1.  **Product** defines.
2.  **Architect** plans.
3.  **Builder** codes.
4.  **QA** breaks it.
5.  **Security** locks it.
6.  **Maintainer** records it.

```
---

## FILE: docs/AUDIT_REPORT.md
```md
# ğŸ§ Documentation Audit Report
**Date:** 2026-01-28
**Version:** 3.2.0-beta
**Auditor:** Automated Maintainer Script (Sprint 19.3)

## ğŸ“Š Scorecard: B

### âœ… Strengths
1.  **Docs-as-Code:** Documentation is treated with the same rigor as source code (versioned, automated updates).
2.  **Schema Clarity:** `SCHEMA_ARCHITECTURE.md` accurately reflects the NoSQL data graph.
3.  **Process Definition:** `PROMPT_*.md` files provide excellent reproducibility for AI agents.

### âš ï¸ Gaps (Opportunities)
1.  **Architecture Decisions:** We lack a dedicated `ADR` (Architecture Decision Record) log. The decision to use "Delta Patching" vs "Shadow Resumes" is buried in chat history, not docs.
2.  **Onboarding:** No `CONTRIBUTING.md` exists for new developers setting up the local Firebase emulators.
3.  **Visuals:** `README.md` lacks screenshots of the new "Resume Tailor" UI.

## ğŸ› ï¸ Recommendations
1.  **Create `docs/ADR` directory:** Formalize architectural choices (e.g., `001-resume-tailor-strategy.md`).
2.  **Create `CONTRIBUTING.md`:** document the `npm run dev` vs `firebase deploy` workflow.
3.  **Refactor `DEPLOYMENT.md`:** Split into "Local Development" vs "Production Deployment".


```
---

## FILE: docs/CHANGELOG.md
```md
# ğŸ“œ Changelog

All notable changes to the **Fresh Nest / Interactive Resume** platform will be documented in this file.

## [3.2.0-beta] - 2026-01-28
### Added
- **Resume Tailor:** New 'Diff View' UI in Job Tracker for side-by-side text comparison.
- **AI:** `tailorResume` Cloud Function (Gemini 2.5) with "Ethical Editor" guardrails.
- **Data:** `tailored_bullets` schema in Firestore applications collection.

## [v3.1.0-beta] - 2026-01-28
### Added
- **AI:** "Cover Letter Engine" (Cloud Function) using Gemini 2.5 Flash.
- **UI:** Structured "Gap Analysis" rendering (Yellow Warning Cards).
- **Export:** PDF generation via `react-to-print`.
### Changed
- **UX:** Restored "Thinking Brain" animation during analysis.
- **Architecture:** Moved all AI logic to Server-Side Cloud Functions for security.

## [v2.5.0-beta] - 2026-01-27
### Added
- **UI:** Added `AnalysisDashboard` with real-time Firestore listeners (`onSnapshot`) for instant feedback.
- **UX:** Implemented "Inline Transformation" animation using `framer-motion` to smoothly reveal results.
- **Visualization:** Added `ScoreGauge` with color-coded match thresholds (Red/Yellow/Green).

## [v2.3.0-beta] - 2026-01-26
### Added
- **Admin:** New `JobTracker` module for inputting raw job descriptions.
- **Data:** Created `applications` collection in Firestore with "Async Trigger" schema (`ai_status: pending`).
- **Security:** Restricted `applications` to Admin-Write/Read only.
- **Testing:** Added environment-mocked unit tests for Admin components.

## [v2.3.0-beta] - 2026-01-26
### Added
- **Admin:** New `JobTracker` module for inputting raw job descriptions.
- **Data:** Created `applications` collection in Firestore with "Async Trigger" schema (`ai_status: pending`).
- **Security:** Locked down `applications` collection (Strict Admin Write / No Public Read).
- **Testing:** Added environment-mocked unit tests for Admin components.

## [v2.2.0-beta] - 2026-01-25
### Added
- **Data Layer:** Implemented `ResumeContext` and `useResumeData` hook for global state management.
- **Offline-First:** Added robust `try/catch` failover. If Firestore is unreachable (or quotas exceeded), the app seamlessly loads local JSON.
- **UX:** Added `LoadingSkeleton` to prevent layout shifts during asynchronous data fetching.
- **Testing:** Added "Indestructible" integration tests verifying the database fallback logic.

## [v2.1.0-beta] - 2026-01-25
### Added
- **Database:** Initialized Cloud Firestore architecture with `profile`, `experience`, `skills`, and `sectors` collections.
- **Security:** Deployed strict `firestore.rules` (Public Read / Admin Write).
- **CMS:** Added `DataSeeder` utility to migrate local JSON data to the cloud.
- **Backend:** configured `firebase.json` for Cloud Functions and Hosting headers.
### Fixed
- **Build:** Fixed critical "Split-React" bundling issue in `vite.config.js` by forcing a singleton React chunk.
- **Auth:** Relaxed COOP/COEP headers to allow Google OAuth popups to function in production.

## [v2.0.0-alpha] - 2026-01-23
### Added
- **Routing:** Implemented `react-router-dom` to bifurcate the app into Public (`/`) and Admin (`/admin`) zones.
- **Security Perimeter:** Integrated Firebase Authentication with strict Email Whitelisting.
- **Admin UI:** Created the `AdminDashboard` shell and `ProtectedRoute` components.
- **Analytics:** Integrated Firebase Analytics for tracking interactions.

## [v1.5.0] - 2026-01-20
### Changed
- **Visualization:** Stabilized `Recharts` implementation for the Skill Radar.
- **Performance:** Optimized `framer-motion` animations for mobile devices.
- **Print Styles:** Added "White Paper" CSS overrides for clean PDF export (`print:hidden`, high-contrast text).

## [v1.0.0] - 2026-01-15 (Gold Master)
### Released
- **Core Platform:** Initial release of the Static Interactive Resume.
- **Tech Stack:** React 19, Vite, Tailwind CSS v4.
- **Features:**
    - Interactive "PAR" Timeline.
    - Skill Radar Chart.
    - Sector Impact Grid.
    - Responsive "Mobile-First" Design.

```
---

## FILE: docs/CONTEXT_DUMP.md
```md
# The Job Whisperer: Platform Context
**Stack:** React 19 + Vite + Tailwind v4 + Firebase + Gemini 2.5
**Version:** 3.2.0-beta
**Branding:** "The Job Whisperer"

## ğŸ§  Coding Standards (The Brain)

### 1. Data & State (SSOT)
* **Public View:** `ResumeContext` is the Single Source of Truth.
* **Admin View:** `JobTracker` manages the "Application State" (JD + Analysis).
* **Deep Fetch:** Recursive fetching is mandatory for nested sub-collections (`projects`).

### 2. AI Architecture (Server-Side)
* **Logic:** All AI operations reside in `functions/index.js` to protect API keys.
    * `analyzeApplication`: Vector Analysis & Gap Detection.
    * `generateCoverLetter`: Content Generation (No Header/Footer).
    * `tailorResume`: Ethical Bullet Point Optimization (Diff Engine).

### 3. UI Patterns
* **Optimistic UI:** Always show a Skeleton or Spinner while waiting for Firestore `onSnapshot`.
* **Mobile First:** All CSS must use Tailwind utility classes targeting mobile first (`w-full md:w-1/2`).

## Directory Structure
* `src/components/admin` -> Job Whisperer UI (JobTracker, ResumeTailor).
* `docs/` -> Documentation as Code (ADRs, Changelogs).
```
---

## FILE: docs/DEPLOYMENT.md
```md
# â˜ï¸ Production Deployment & Infrastructure

**Environment:** Firebase Hosting & Cloud Functions (Gen 2)
**CI/CD:** GitHub Actions

## 1. Automated Deployment (CI/CD)
We utilize two primary workflows:

### A. Preview Channels (Pull Requests)
* **Trigger:** Open/Update PR.
* **Action:** Builds the app and deploys to a temporary URL (e.g., `pr-123--ryandouglas-resume.web.app`).
* **Secrets:** Uses `GITHUB_TOKEN` and `FIREBASE_SERVICE_ACCOUNT`.

### B. Production Channel (Merge to Main)
* **Trigger:** Push to `main`.
* **Action:** Deploys to the live URL.
* **Purge:** Clears CDN cache.

## 2. Manual Deployment (CLI)
If CI/CD fails, you can manually deploy from a local terminal.

**Full Deploy:**
```bash
npm run build
firebase deploy
```

**Partial Deploy (Functions Only):**
*Use this when updating AI prompts to avoid rebuilding the frontend.*
```bash
firebase deploy --only functions
```

**Partial Deploy (Rules Only):**
```bash
firebase deploy --only firestore:rules
```

## 3. Infrastructure & Secrets

### Cloud Functions Secrets (Gen 2)
We use Google Cloud Secret Manager. DO NOT put API keys in `.env` files for Functions.

**Setting a Secret:**
```bash
firebase functions:secrets:set GOOGLE_API_KEY
```

**Accessing in Code:**
```javascript
const { onCall } = require("firebase-functions/v2/https");
exports.myFunc = onCall({ secrets: ["GOOGLE_API_KEY"] }, (req) => { ... });
```

### Security Headers
To support Google Identity Services and potential SharedArrayBuffer usage, `firebase.json` enforces:
* `Cross-Origin-Opener-Policy: unsafe-none`
* `Cross-Origin-Embedder-Policy: unsafe-none`

## 4. Database Security
* **Rules:** Defined in `firestore.rules`.
* **Policy:** Public Read (Resume Data) / Admin Write Only.
* **Lockdown:** `applications` collection is strictly Admin Read/Write.
```
---

## FILE: docs/PERSONAS.md
```md
# ğŸ‘¥ Persona-Based Development Model

Our development strategy is guided by specific user archetypes. Features must pass the "Persona Check" before implementation.

---

## ğŸŒ External Audiences (The Public View)
*Goal: Conversion (Booking an Interview)*

### 1. "The Skimmer" (Technical Recruiter)
* **Goal:** Match keywords to a Job Description in < 10 seconds.
* **Behavior:** Opens link, scans for "Power BI", "React", "15 Years", then leaves.
* **UX Constraint:** **The "Above the Fold" Dashboard.**
    * *Rule:* Key metrics must be visible immediately without scrolling.
    * *Rule:* Zero layout shift. No spinners for critical text.

### 2. "The Narrator" (Hiring Manager / Director)
* **Goal:** Understand the *context* of your career. "Why did he move from Dev to Consulting?"
* **Behavior:** Scrolls down. Reads the bullet points. Looks for business impact.
* **UX Constraint:** **The PAR Timeline.**
    * *Rule:* Experience must be framed as Problem/Action/Result.
    * *Rule:* "Click to expand" interaction to keep the initial view clean.

### 3. "The Skeptic" (Lead Developer / CTO)
* **Goal:** Verify technical competence. "Is this a template or did he build it?"
* **Behavior:** Inspects Element. Looks at the source code. Tests the interactivity.
* **UX Constraint:** **The "Live" Matrix.**
    * *Rule:* Clicking "React" should filter the entire timeline. This proves state management expertise.
    * *Rule:* Code must be clean, typed, and commented (in case they check the repo).

---

## ğŸ” Internal Actors (The Admin View)
*Goal: Productivity & Strategy*

### 4. "The Candidate" (The Super Admin - You)
* **Goal:** Manage the job hunt campaign with high velocity and high quality.
* **Pain Point:** Repetitive data entry. rewriting cover letters. losing track of applications.
* **Behavior:** Pastes a JD into the system, expects an instant analysis and tailored assets.
* **UX Constraint:** **Zero Friction Input.**
    * *Rule:* If it takes more than 2 clicks to generate a Cover Letter, the feature has failed.
    * *Rule:* Data Seeding must be idempotent (running it twice shouldn't break things).

### 5. "The Staff Engineer" (The AI Agent)
* **Role:** Gemini 3.0 Integration.
* **Goal:** Act as a strategic career coach and copywriter.
* **Behavior:** Analyzes the gap between *Stored Experience* (Firestore) and *Target Job* (Input).
* **Constraint:** **Hallucination Control.**
    * *Rule:* The AI must strictly cite actual projects from the database. It cannot invent experience.

---

## ğŸ“± Hardware Contexts

### 6. "The Mobile User" (LinkedIn Traffic)
* **Context:** 60% of traffic will come from the LinkedIn mobile app browser.
* **Constraint:** **Thumb-Friendly UI.**
    * *Rule:* Charts must be readable vertically (Adaptive Density).
    * *Rule:* No hover-only tooltips (must be click/tap accessible).

```
---

## FILE: docs/PROJECT_STATUS.md
```md
# ğŸŸ¢ Project Status: The Job Whisperer

> ğŸ—ºï¸ **Strategy:** See [docs/ROADMAP.md](./ROADMAP.md) for the long-term vision.

**Current Phase:** Phase 20 - The Strategist
**Version:** v3.2.0-beta
**Status:** ğŸŸ¢ Stable / Feature Complete (Sprint 19)

## ğŸ¯ Current Objectives
* [x] **Sprint 19.1:** The Cover Letter Engine.
* [x] **Sprint 19.2:** The Outreach Bot (Merged into Tailor).
* [x] **Sprint 19.3:** The Resume Tailor (Diff Engine).
* [ ] **Sprint 19.4:** The Version Controller (Snapshot & Print).
* [ ] **Sprint 20.1:** Application Kanban Board (Upcoming).

## ğŸ›‘ Known Issues
* Mobile layout for "Diff View" needs optimization on screens < 375px.
* Rate limiting for Gemini API is currently manual.

## âœ… Completed Roadmap
* **Phase 19 (The Content Factory):** [x] Complete suite of Generative AI tools.
* **Phase 17 (Application Manager):** [x] Job Input & Vector Analysis.
* **Phase 16 (Backbone):** [x] Firestore Migration.
* **v1.0.0:** [x] Static Resume Platform.
```
---

## FILE: docs/PROMPT_APPROVAL.md
```md
# âœ… AI Approval & Execution Prompt (Builder Mode v2.1)

**Instructions:**
Use this prompt **after** the AI has presented the 3 Architectural Options.

---

### **Prompt Template**

**Decision:** I approve **Option [INSERT OPTION NUMBER]: [INSERT OPTION NAME]**. Proceed with implementation.

**Strict Technical Constraints (The "Builder" Standard):**
1.  **Execution First:** Output a single **Bash Script** (`install_feature.sh`) that:
    * Creates/Updates all necessary files.
    * Installs dependencies.
    * Uses `cat << 'EOF'` patterns.
2.  **Data Strategy (The "Backbone" Check):**
    * **Deep Fetching:** Remember that Firestore queries are *shallow*. If fetching a document with sub-collections, you MUST explicitly fetch the sub-collection and merge it.
    * **Failover Logic:** Wrap all critical fetches in `try/catch`. If the DB fails, return Local JSON.
3.  **Environment Awareness:**
    * **Secrets:** Never hardcode keys. Use `import.meta.env.VITE_VAR`.
    * **Codespaces:** Assume the dev server headers are relaxed (`unsafe-none`).
4.  **UI Resilience:**
    * **Textareas:** Always enforce `overflow-y-auto` and `resize-none` to prevent Mobile Safari scroll trapping on large inputs.


**Persona Validation:**
* **The Skimmer:** Is data visible immediately? (Use Skeletons).
* **The Mobile User:** Will this overflow on 320px?

**Output Requirements:**
1.  **The "One-Shot" Installer:** A single bash script block.
2.  **Manual Verification Steps:** Specific steps to verify the feature (e.g., "Disconnect Internet to test fallback").

*Please generate the installation script now.*

```
---

## FILE: docs/PROMPT_FEATURE_REQUEST.md
```md
# ğŸ“ AI Feature Request Prompt (Architect Mode v2.0)

**Instructions:**
1.  Copy your current codebase context.
2.  Fill in the feature details in the bracketed sections `[ ... ]`.
3.  Send the *entire* text below to the AI.

---

### **Prompt Template**

**Role:** You are the Senior Lead Developer & UI Architect for my Interactive Resume (React 19 + Firebase).
**Task:** Analyze the requirements for a new feature and propose architectural solutions.

**Feature Request:** [INSERT FEATURE NAME]

**Context:**
I need to add a module that [DESCRIBE FUNCTION].
*Current State:* [Briefly describe relevant existing code.]

**Core Requirements:**

1.  **ğŸ‘¥ The Persona Check (Select Relevant):**
    * **The Candidate (Admin):** Maximize velocity. Is input zero-friction? Is the UI dense and data-rich?
    * **The Staff Engineer (AI):** Is the prompt engineering robust? Are we hallucinating data?
    * **The Mobile User (Public):** Touch targets 44px+? No horizontal scrolling on 320px?
    * **The Skimmer (Public):** Value delivered in < 5 seconds?

2.  **Constraints & Tech Strategy:**
    * * **Data Strategy Checklist:**
            * Does this feature require a new Cloud Function trigger?
    * **Data Source:** **Firestore is the SSOT.**
        * *Read:* Use `useResumeData` (Client) or `admin.firestore()` (Server).
        * *Write:* **Strictly prohibited** in public components. Admin components must use `DataSeeder` patterns or specific Admin Hooks.
    * **Security:** Does this require a change to `firestore.rules`?
    * **State:** Prefer React 19 `Suspense` and URL-based state over complex `useEffect` chains.
    * **Styling:** Tailwind v4 (Mobile-First).

**ğŸ›‘ STOP & THINK: Architectural Options**
Do **NOT** write code yet. Analyze the request and propose **3 Distinct Approaches**:

1.  **The "Client-Heavy" Approach:** fast UI, relies on client-side SDK. Good for real-time interactivity.
2.  **The "Server-Secure" Approach:** Offloads logic to Cloud Functions. Mandatory for AI/LLM operations and sensitive data writes.
3.  **The "Balanced/Hybrid" Approach:** Optimistic UI updates with background server validation.

**Your Output Deliverable:**
1.  **Analysis:** A brief breakdown of the UX and Security challenges.
2.  **The Options Table:** Compare approaches based on:
    * *Security Risk*
    * *Latency/Performance*
    * *Maintenance Cost*
3.  **Recommendation:** Select one approach and explain *why* it fits our "Secure Productivity" philosophy.
4.  **Wait:** End your response by asking for approval to proceed.

---

**Codebase Context:**
[PASTE_CODEBASE_HERE]

```
---

## FILE: docs/PROMPT_INITIALIZATION.md
```md
# ğŸ¤– AI Session Initialization Prompt (v3.0)

**Role:** You are the **Senior Lead Developer & System Architect** for "The Job Whisperer" (v3.2.0).
**System:** React 19 + Vite + Tailwind v4 + Firebase (Firestore/Auth/Functions) + Gemini 2.5 Flash.

**Your Operational Framework (`docs/AI_WORKFLOW.md`):**
You must fluidly switch between these modes as needed:
1.  **The Architect:** Design secure, scalable patterns (ADRs).
2.  **The Builder:** Write complete, production-ready code (No placeholders).
3.  **The Maintainer:** Update documentation (`CHANGELOG`, `PROJECT_STATUS`) after every feature.
V
**Critical Directives (The "Anti-Drift" Protocols):**
1.  **Ground Truth:** Do NOT assume file paths. If unsure, ask me to run `ls -R src`.
2.  **Complete Deliverables:** Always provide full file contents or complete bash scripts. Never output partial code blocks ("... rest of code").
3.  **Security First:** `firestore.rules` are "Admin Write / Public Read". `applications` collection is "Admin Only".
4.  **Data Integrity:** Use `structuredClone` for snapshots. Firestore is the Single Source of Truth (SSOT).

**Initialization Sequence:**
To begin our session and prevent context drift, please perform the following **Deep Dive Review**:
1.  **Request:** Ask me to paste the current full codebase dump.
2.  **Analyze:** Perform a detailed review of `docs/` (Roadmap, Status, ADRs) and `src/` structure.
3.  **Report:** Output a **"System Health Check"** summarizing:
    * *Current Phase & Sprint* (from PROJECT_STATUS).
    * *Key Architectural Patterns* (from ADRs).
    * *Discrepancies:* Any mismatch between the Docs and the Code.

**Reply ONLY with:** "ğŸš€ System Architect Ready. Please paste the full codebase context to begin the Deep Dive Analysis."
```
---

## FILE: docs/PROMPT_POST_FEATURE.md
```md
# ğŸ“ AI Documentation Audit Prompt (The Maintainer v2.4)

**Instructions:**
Use this prompt **IMMEDIATELY AFTER** a feature is successfully deployed and verified.

---

### **Prompt Template**

**Role:** You are the Lead Technical Writer and Open Source Maintainer.
**Task:** Perform a comprehensive documentation synchronization AND a "Best Practices" audit of the documentation architecture.

**Trigger:** We have just completed: **[INSERT FEATURE NAME]**.

**The "Preservation Protocol" (CRITICAL RULES):**
1.  **Never Truncate History:** When updating logs or status files, preserve all previous entries. Use `read()` + `append/insert` logic.
2.  **No Placeholders:** Output full, compilable files only.
3.  **Holistic Scan:** You must evaluate **ALL** files in `/docs` to ensure the "Big Picture" stays consistent.

**Your Goal:** Generate a **Python Script** (`update_docs_audit.py`) that performs the following:

### Part 1: Feature Synchronization
1.  **`docs/PROJECT_STATUS.md`**: Mark feature as `[x] Completed`. Update Phase/Version. **Keep** the "Completed Roadmap".
2.  **`docs/CHANGELOG.md`**: Insert a new Version Header and Entry at the top. **Keep** all older versions.
3.  **`package.json`**: Update the version number.
4.  **`docs/SCHEMA_ARCHITECTURE.md`**: Update schemas if data structures changed.
5.  **`docs/CONTEXT_DUMP.md`**: Update stack details or new Cloud Functions.

### Part 2: The "Docs as Code" Audit (Best Practices)
*Compare our current documentation structure against industry best practices (e.g., DiÃ¡taxis framework).*
6.  **Create/Update `docs/AUDIT_REPORT.md`**:
    * **Structural Review:** Do we have clear separation between "How-to", "Reference", and "Explanation"?
    * **Missing Artifacts:** Are we missing standard files (e.g., `CONTRIBUTING.md`, `ADR` records)?
    * **Score:** Give the documentation a grade (A-F) and 3 specific recommendations for improvement.

### Part 3: Process Refinement (Continuous Improvement)
*Did we encounter recurring errors or discover new best practices during this sprint?*
7.  **`docs/PROMPT_FEATURE_REQUEST.md`**: Update constraints if new requirements emerged.
8.  **`docs/PROMPT_TESTING.md`**: Update constraints if new testing patterns were required.

**Output Requirement:**
* Provide a single, robust **Python Script**.
* The script must handle UTF-8 encoding.
* The script must explicitly reconstruct file content to ensure no data loss.

**Wait:** Ask me for the feature name and **"Were there any specific errors we fixed that should be added to the process constraints?"**

```
---

## FILE: docs/PROMPT_TESTING.md
```md
# ğŸ§ª AI Testing Prompt (The QA Engineer v2.1)

**Instructions:**
Use this prompt **AFTER** a feature is built but **BEFORE** it is marked as "Done".

---

### **Prompt Template**

**Role:** You are the Senior SDET (Software Development Engineer in Test).
**Task:** Write a robust Unit Test for the provided component using Vitest.

**Input:**
* Component Code: [PASTE CODE]
* Data Context: [PASTE JSON SNIPPET]

**Constraints & Best Practices:**
1.  **Execution First:** Output a single **Bash Script** (`install_tests.sh`) that:
    * Creates the directory `src/__tests__` (or component specific folder).
    * Uses `cat << 'JSX' > path/to/test.test.jsx` to write the file.
2.  **Environment Mocking (CRITICAL):**
    * The Firebase SDK will crash instantly if `VITE_API_KEY` is undefined.
    * **Rule:** Use `vi.stubEnv` or mock `firebase/auth` and `firebase/firestore` modules entirely.
    * **Mocking Libraries:**
        * `react-to-print`: Mock `useReactToPrint` to return a void function.
        * `framer-motion`: Replace with standard HTML tags to avoid animation delays in JSDOM.
3.  **Testing Strategy:**
    * **Happy Path:** Does it render data correctly?
    * **Integration:** When testing Tabbed Interfaces (like JobTracker), verify tab switching logic explicitly.
    * **Interactive:** Click buttons and verify handlers are called.
    * **Defensive:** Ensure it handles `null` or `undefined` props without crashing.

**Output Requirements:**
* A single `install_tests.sh` script block.
* Do not output raw JSX outside the script.

**Wait:** Ask me to paste the Component Code to begin.

```
---

## FILE: docs/ROADMAP.md
```md
# ğŸ—ºï¸ Product Strategy & Roadmap

**Vision:** Transform the platform from a static portfolio into an AI-powered Career Management System (CMS).
**Status:** Active Development
**Last Updated:** 2026-01-28

---

## ğŸ­ Phase 19: The Content Factory (Current Focus)
*Goal: Stop writing boilerplate. Let the AI generate high-quality tailored documents.*

* **Sprint 19.1: The Cover Letter Engine**
    * **Feature:** One-click PDF generation based on Resume + JD.
    * **Tech:** Gemini Prompting + `react-to-print` / `jspdf`.
* **Sprint 19.2: The Outreach Bot**
    * **Feature:** Generate cold-outreach messages (LinkedIn/Email) tailored to the Hiring Manager.
    * **Tech:** Clipboard API + Tone analysis.
* **Sprint 19.3: The Resume Tailor**
    * **Feature:** AI suggestions for rewriting specific bullet points to match JD keywords.
* **Sprint 19.4: The Version Controller (Snapshot Engine)**
    * **Feature:** "Freeze" a specific tailored resume version into an immutable record.
    * **Feature:** Dedicated Print Preview route for generating clean PDFs from Snapshots.
    * **Tech:** Firestore (JSON Storage) + Print CSS.

---

## â™Ÿï¸ Phase 20: The Strategist (Workflow)
*Goal: Manage the campaign lifecycle and win the interview.*

* **Sprint 20.1: The Application Kanban**
    * **Feature:** Drag-and-drop board to track status (Applied, Interview, Offer).
    * **Tech:** `dnd-kit`.
* **Sprint 20.2: The Interview Simulator**
    * **Feature:** AI acts as the interviewer, asking technical questions based on the JD.
    * **Tech:** Browser Speech API.

---

## ğŸ›¡ï¸ Phase 21: Fortress & Foundation (Security)
*Goal: Lock down the application before public release.*

* **Sprint 21.1: The Identity Shield**
    * **Objective:** Server-Side Auth Blocking (Fix IAM Permissions).
* **Sprint 21.2: The Data Lockdown**
    * **Objective:** Strict `firestore.rules`.
* **Sprint 21.3: Cost Governor**
    * **Objective:** API Rate Limiting.


```
---

## FILE: docs/SCHEMA_ARCHITECTURE.md
```md
# ğŸ—„ï¸ Schema Architecture & Data Graph

**Storage Engine:** Cloud Firestore (NoSQL)
**Pattern:** Collection-Centric with Sub-Collections.

## 1. High-Level Topology
```mermaid
graph TD
    root[ğŸ”¥ Firestore Root]
    
    %% Top Level Collections
    root --> profile[ğŸ“‚ profile]
    root --> skills[ğŸ“‚ skills]
    root --> sectors[ğŸ“‚ sectors]
    root --> experience[ğŸ“‚ experience]
    
    %% Relationships
    experience --> job[ğŸ“„ Job Document]
    job --> projects[ğŸ“‚ projects (Sub-Collection)]
    projects --> project[ğŸ“„ Project Document]
```

## 2. The "Deep Fetch" Strategy (CRITICAL)
**Firestore queries are shallow.** Fetching a Job document **DOES NOT** automatically fetch its `projects` sub-collection.

### The Client-Side Join Pattern
Any component displaying Experience (e.g., `ResumeContext`) **MUST** implement this recursive logic:
1.  Fetch all `experience` documents.
2.  Map over the results.
3.  For *each* job, perform a second `getDocs` call to its `projects` sub-collection.
4.  Merge the `projects` array into the parent job object.
5.  Return the hydrated tree.

**âŒ BAD (Will Result in Empty Projects):**
```javascript
const jobs = await getDocs(collection(db, 'experience'));
return jobs.docs.map(d => d.data());
```

**âœ… GOOD (Hydrated):**
```javascript
const jobs = await Promise.all(snapshot.docs.map(async (doc) => {
  const projects = await getDocs(collection(doc.ref, 'projects'));
  return { ...doc.data(), projects: projects.docs.map(p => p.data()) };
}));
```

## 3. The "Indestructible" Fallback
We implement a **Hybrid Data Strategy**:
1.  **Attempt:** Fetch from Firestore.
2.  **Catch:** If *any* error occurs (Quota, Offline, Rules), swallow the error and return `src/data/*.json`.
3.  **Result:** The app never crashes, even if the database is down.

## 4. Application Schema (Phase 19)
The `applications` collection is the core of the Content Factory.
* **Document ID:** Auto-generated.
* **Fields:**
    * `company` (string)
    * `role` (string)
    * `raw_text` (string) - Original JD.
    * `ai_status` (string) - 'pending' | 'processing' | 'complete' | 'error'
    * `match_score` (number)
    * `gap_analysis` (array<string>) - Structured list of missing skills.
    * `cover_letter_status` (string) - 'idle' | 'pending' | 'writing' | 'complete'
    * `cover_letter_text` (string) - Markdown/Text content.


### Application Schema (`applications/{id}`)
* `tailor_status`: 'idle' | 'pending' | 'processing' | 'complete' | 'error'
* `tailored_bullets`: Array of Objects
    * `original`: String
    * `optimized`: String
    * `reasoning`: String
    * `confidence`: Number (0-100)

```
---

## FILE: docs/SECURITY_MODEL.md
```md

# âš ï¸ DEV MODE ACTIVE (SKELETON KEY)
**Current Status:** Authentication is bypassed. Database Rules are `allow read, write: if true`.
**Do NOT deploy to Production without reverting `AuthContext` and `firestore.rules`.**

# ğŸ›¡ï¸ Security Model & Access Control

**Auth Provider:** Firebase Authentication (Google OAuth)
**Strategy:** Zero Trust Client / Strict Server-Side Rules

## 1. Authentication Layer
### The Whitelist Gate
* **Location:** Client-Side (`src/context/AuthContext.jsx`) & Server-Side (`firestore.rules`).
* **Mechanism:**
  1. User signs in via Google.
  2. App checks `user.email` against `import.meta.env.VITE_ADMIN_EMAIL`.
  3. If no match, the user is signed out immediately or redirected to Public View.

## 2. Authorization (Firestore Rules)
We utilize a **"Public Read / Admin Write"** policy.

| Collection | Read Permission | Write Permission |
| :--- | :--- | :--- |
| `profile` | ğŸŒ Public | ğŸ” Auth Only |
| `skills` | ğŸŒ Public | ğŸ” Auth Only |
| `experience` | ğŸŒ Public | ğŸ” Auth Only |
| `projects` | ğŸŒ Public | ğŸ” Auth Only |
| `applications` | â›” None | ğŸ” Admin Only |

**Current Rule Implementation:**
```javascript
allow read: if true;
allow write: if request.auth != null; // Relies on UI Whitelisting for now
```
> âš ï¸ **Note:** In Phase 17, we will upgrade the Write rule to strictly check `request.auth.token.email == 'YOUR_EMAIL'` for backend-level enforcement.

## 3. API Key Exposure Strategy
It is standard practice to expose the `VITE_API_KEY` in the frontend bundle. This key **does not** grant administrative access. It simply identifies the Firebase project.

**Defense in Depth:**
1. **Security Rules:** Prevent unauthorized writes even if someone steals the API Key.
2. **App Check:** (Planned Phase 18) Verify traffic comes from your specific domain.
3. **Cloud Functions:** Sensitive AI logic (Gemini) runs on the server, keeping the LLM API Key strictly hidden from the browser.

## 4. Header Security (COOP/COEP)
To support high-performance `SharedArrayBuffer` (potential future use) and Google Identity Services, we enforce:
* `Cross-Origin-Opener-Policy: same-origin-allow-popups`
* `Cross-Origin-Embedder-Policy: unsafe-none`

```
---

## FILE: eslint.config.js
```js
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
])

```
---

## FILE: firebase.json
```json
{
  "functions": [
    {
      "source": "functions",
      "codebase": "default",
      "ignore": [
        "node_modules",
        ".git",
        "firebase-debug.log",
        "firebase-debug.*.log",
        "*.local"
      ]
    }
  ],
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "headers": [
      {
        "source": "**",
        "headers": [
          {
            "key": "Cross-Origin-Opener-Policy",
            "value": "unsafe-none"
          },
          {
            "key": "Cross-Origin-Embedder-Policy",
            "value": "unsafe-none"
          }
        ]
      }
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  },
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  }
}

```
---

## FILE: firestore.indexes.json
```json
{}

```
---

## FILE: firestore.rules
```rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}

```
---

## FILE: fix_tailwind_v4.sh
```sh
#!/bin/bash

# ==========================================
# ğŸ”§ Fix: Migrate to Tailwind CSS v4
# ==========================================

echo "Step 1: Installing Tailwind v4 Vite Plugin..."
npm install @tailwindcss/vite

echo "Step 2: updating vite.config.js..."
cat << 'EOF' > vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})
EOF

echo "Step 3: Migrating CSS to v4 Syntax (CSS-First Config)..."
# In v4, we use @import "tailwindcss" and define theme variables directly in CSS
cat << 'EOF' > src/index.css
@import "tailwindcss";

@theme {
  /* Migrate custom colors from tailwind.config.js */
  --color-brand-dark: #0f172a;  /* Slate 900 */
  --color-brand-accent: #3b82f6; /* Blue 500 */
  --color-brand-light: #f8fafc; /* Slate 50 */
  
  /* Migrate font family */
  --font-sans: "Inter", system-ui, sans-serif;
}

/* Apply base styles using the new variables.
   Note: In v4, we use the variables we just defined in the theme.
*/
body {
  background-color: var(--color-brand-light);
  color: var(--color-brand-dark);
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
EOF

echo "Step 4: Cleaning up legacy config..."
rm tailwind.config.js
# If a postcss config was auto-generated, remove it too
if [ -f postcss.config.js ]; then
    rm postcss.config.js
fi

echo "=========================================="
echo "âœ… Tailwind v4 Configuration Fixed!"
echo "ğŸ‘‰ Restart your server: 'npm run dev'"
echo "=========================================="
```
---

## FILE: fix_workflows.sh
```sh
#!/bin/bash

# ==========================================
# ğŸš‘ Fix: GitHub Action Repository Name
# ==========================================
# Description: Corrects the capitalization of 'FirebaseExtended' in workflow files.

echo "Patching .github/workflows/deploy-preview.yml..."
# Use sed to replace lowercase 'firebase-extended' with 'FirebaseExtended'
# We use a backup extension (.bak) just in case, then remove it for cleanliness
sed -i.bak 's/firebase-extended\/action-hosting-deploy/FirebaseExtended\/action-hosting-deploy/g' .github/workflows/deploy-preview.yml
rm .github/workflows/deploy-preview.yml.bak

echo "Patching .github/workflows/deploy-prod.yml..."
sed -i.bak 's/firebase-extended\/action-hosting-deploy/FirebaseExtended\/action-hosting-deploy/g' .github/workflows/deploy-prod.yml
rm .github/workflows/deploy-prod.yml.bak

echo "=========================================="
echo "âœ… Workflows Patched!"
echo "=========================================="
echo "ğŸ‘‰ Now run these commands to retry the build:"
echo ""
echo "   git add .github/workflows"
echo "   git commit -m 'fix: Correct casing for Firebase GitHub Action'"
echo "   git push"
```
---

## FILE: functions/.eslintrc.json
```json
{
  "root": true,
  "env": {
    "es2022": true,
    "node": true,
    "commonjs": true
  },
  "extends": [
    "eslint:recommended"
  ],
  "parserOptions": {
    "ecmaVersion": 2022
  },
  "rules": {
    "no-console": "off",
    "no-unused-vars": ["warn"]
  }
}

```
---

## FILE: functions/check_models.js
```js
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function listModels() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    console.error("âŒ Error: GEMINI_API_KEY environment variable is missing.");
    process.exit(1);
  }

  try {
    const genAI = new GoogleGenerativeAI(key);
    // Note: The SDK doesn't always expose listModels directly on the client 
    // depending on version, so we fallback to the raw REST endpoint if needed,
    // but let's try a direct fetch which is 100% reliable for debugging.
    
    console.log("ğŸ“¡ Querying Google AI API for available models...");
    
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    console.log("\nâœ… AVAILABLE MODELS FOR YOUR KEY:");
    console.log("===================================");
    
    const models = data.models || [];
    const generateModels = models.filter(m => m.supportedGenerationMethods.includes("generateContent"));
    
    generateModels.forEach(m => {
      console.log(`ğŸ”¹ ${m.name.replace('models/', '')}`);
      // console.log(`   Description: ${m.description.substring(0, 60)}...`);
    });
    
    console.log("===================================");

  } catch (error) {
    console.error("ğŸ”¥ Failed to list models:", error.message);
  }
}

listModels();

```
---

## FILE: functions/index.js
```js
/**
 * ğŸ§  The Fresh Nest Backend Brain
 * Includes:
 * 1. architectProject: Callable (Gemini 3.0)
 * 2. analyzeApplication: Trigger (Gemini 2.5)
 * 3. generateCoverLetter: Trigger (Gemini 2.5) - No Header Mode
 * 4. tailorResume: Trigger (Gemini 2.5) - NEW!
 */

const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { onDocumentWritten } = require("firebase-functions/v2/firestore");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { GoogleGenerativeAI } = require("@google/generative-ai");

initializeApp();
const db = getFirestore();

// --- HELPERS ---
async function getResumeContext() {
  const profileSnap = await db.doc('profile/primary').get();
  const profile = profileSnap.data();
  const skillsSnap = await db.collection('skills').get();
  const skills = skillsSnap.docs.map(d => d.data());
  const expSnap = await db.collection('experience').get();
  const experience = await Promise.all(expSnap.docs.map(async (doc) => {
    const jobData = doc.data();
    const projectsSnap = await doc.ref.collection('projects').get();
    const projects = projectsSnap.docs.map(p => ({ id: p.id, ...p.data() }));
    return { ...jobData, projects };
  }));
  return { profile, skills, experience };
}

// --- 1. ARCHITECT ---
const ARCHITECT_SYSTEM_PROMPT = "You are a Resume Architect. Convert raw notes to JSON. NO Markdown.";
exports.architectProject = onCall({ 
  cors: true, 
  secrets: ["GOOGLE_API_KEY"],
  timeoutSeconds: 60,
  maxInstances: 10
}, async (request) => {
  if (!request.auth) throw new HttpsError("unauthenticated", "Login required.");
  const apiKey = process.env.GOOGLE_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash", generationConfig: { responseMimeType: "application/json" }});
  const result = await model.generateContent([ARCHITECT_SYSTEM_PROMPT, request.data.rawText]);
  return { data: JSON.parse(result.response.text()) }; 
});

// --- 2. ANALYZE ---
exports.analyzeApplication = onDocumentWritten(
  { document: "applications/{docId}", secrets: ["GOOGLE_API_KEY"] }, 
  async (event) => {
    const snapshot = event.data;
    if (!snapshot) return;
    const newData = snapshot.after.data();
    if (newData.ai_status !== 'pending') return;

    await snapshot.after.ref.update({ ai_status: 'processing' });
    const apiKey = process.env.GOOGLE_API_KEY;
    const genAI = new GoogleGenerativeAI(apiKey);
    const resumeContext = await getResumeContext();
    
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash", generationConfig: { responseMimeType: "application/json" }});

    const prompt = `Analyze this JD against Resume.
    RESUME: ${JSON.stringify(resumeContext)}
    JD: ${newData.company} - ${newData.role} \n ${newData.raw_text}
    
    RETURN JSON: 
    { 
      "match_score": number (0-100), 
      "keywords_missing": string[], 
      "suggested_projects": string[] (List of 3 relevant project IDs from Resume context),
      "tailored_summary": string, 
      "gap_analysis": string[] (A list of specific, distinct gaps. Do not number them.)
    }`;

    try {
      const result = await model.generateContent(prompt);
      const analysis = JSON.parse(result.response.text());
      await snapshot.after.ref.update({ ...analysis, ai_status: 'complete' });
    } catch (e) {
      await snapshot.after.ref.update({ ai_status: 'error', error_log: e.message });
    }
  }
);

// --- 3. COVER LETTER ---
exports.generateCoverLetter = onDocumentWritten(
  { document: "applications/{docId}", secrets: ["GOOGLE_API_KEY"] },
  async (event) => {
    const snapshot = event.data;
    if (!snapshot) return;
    const newData = snapshot.after.data();
    const oldData = snapshot.before.data();
    
    if (newData.cover_letter_status !== 'pending') return;
    if (oldData && oldData.cover_letter_status === 'pending') return;

    await snapshot.after.ref.update({ cover_letter_status: 'writing' });
    try {
      const apiKey = process.env.GOOGLE_API_KEY;
      const genAI = new GoogleGenerativeAI(apiKey);
      const resumeContext = await getResumeContext();
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      
      const systemPrompt = `
        You are Ryan Douglas. Write a persuasive cover letter for the role of ${newData.role} at ${newData.company}.
        STRICT FORMATTING RULES:
        1. DO NOT include a header block (Name, Address, Phone).
        2. DO NOT include the date or recipient address.
        3. START DIRECTLY with the Salutation.
        CONTEXT: ${JSON.stringify(resumeContext)}
        JOB DESCRIPTION: ${newData.raw_text}
      `;
      
      const result = await model.generateContent(systemPrompt);
      await snapshot.after.ref.update({ cover_letter_text: result.response.text(), cover_letter_status: 'complete' });
    } catch (error) {
      await snapshot.after.ref.update({ cover_letter_status: 'error', error_log: error.message });
    }
  }
);

// --- 4. RESUME TAILOR (NEW) ---
exports.tailorResume = onDocumentWritten(
  { document: "applications/{docId}", secrets: ["GOOGLE_API_KEY"] },
  async (event) => {
    const snapshot = event.data;
    if (!snapshot) return;
    const newData = snapshot.after.data();
    const oldData = snapshot.before.data();

    // Trigger only when tailor_status flips to 'pending'
    if (newData.tailor_status !== 'pending') return;
    if (oldData && oldData.tailor_status === 'pending') return;

    console.log(`ğŸ§µ Tailoring Resume for: ${newData.company}`);
    await snapshot.after.ref.update({ tailor_status: 'processing' });

    try {
      const apiKey = process.env.GOOGLE_API_KEY;
      const genAI = new GoogleGenerativeAI(apiKey);
      const resumeContext = await getResumeContext();

      // Use JSON Mode for strict schema
      const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash",
        generationConfig: { responseMimeType: "application/json" }
      });

      const systemPrompt = `
        You are an Ethical Resume Editor and ATS Specialist.
        YOUR TASK: Optimize the Candidate's existing bullet points to match the Job Description (JD).
        
        STRICT GUARDRAILS:
        1. You MUST NOT invent new experiences, companies, or metrics.
        2. You MAY optimize phrasing (Passive -> Active), inject JD keywords, or emphasize specific technologies ALREADY present in the data.
        3. Identify the top 5-7 most relevant bullet points from the "Experience" or "Projects" that can be improved.
        
        RESUME CONTEXT:
        ${JSON.stringify(resumeContext)}

        JOB DESCRIPTION:
        ${newData.raw_text}

        OUTPUT FORMAT:
        Return a JSON Array of objects with this schema:
        [
          {
            "original": "The exact original text from the resume",
            "optimized": "The rewritten version with keywords",
            "reasoning": "Brief explanation of what changed (e.g. 'Added [React] keyword')",
            "confidence": number (0-100)
          }
        ]
      `;

      const result = await model.generateContent(systemPrompt);
      const suggestions = JSON.parse(result.response.text());

      await snapshot.after.ref.update({ 
        tailored_bullets: suggestions,
        tailor_status: 'complete',
        updated_at: new Date()
      });
      console.log("âœ… Resume Tailoring Complete.");

    } catch (error) {
      console.error("ğŸ”¥ Tailoring Failed:", error);
      await snapshot.after.ref.update({ 
        tailor_status: 'error', 
        error_log: error.message 
      });
    }
  }
);

```
---

## FILE: functions/package.json
```json
{
  "name": "functions",
  "description": "Cloud Functions for Firebase",
  "scripts": {
    "serve": "firebase serve --only functions",
    "shell": "firebase functions:shell",
    "start": "npm run shell",
    "deploy": "firebase deploy --only functions",
    "logs": "firebase functions:log"
  },
  "engines": {
    "node": "20"
  },
  "dependencies": {
    "@google/generative-ai": "^0.21.0",
    "firebase-admin": "^12.7.0",
    "firebase-functions": "^7.0.4"
  },
  "private": true
}

```
---

## FILE: index.html
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    
    <title>The Job Whisperer | Ryan Douglas</title>
    <meta name="description" content="The Job Whisperer: AI-Powered Career Management System. Bridging the gap between Strategy and Execution." />
    <meta name="author" content="Ryan Douglas" />
    <meta name="theme-color" content="#0f172a" />

    <meta property="og:type" content="website" />
    <meta property="og:title" content="The Job Whisperer | AI Resume Platform" />
    <meta property="og:description" content="AI-driven resume tailoring and job analysis engine." />
    
    <link rel="preconnect" href="[https://fonts.googleapis.com](https://fonts.googleapis.com)" />
    <link rel="preconnect" href="[https://fonts.gstatic.com](https://fonts.gstatic.com)" crossorigin />
  </head>
  <body class="bg-slate-50 text-slate-900 antialiased">
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```
---

## FILE: install_sprint_17_3.sh
```sh
#!/bin/bash

# ==========================================
# ğŸš€ SPRINT 17.3: ANALYSIS DASHBOARD (UI)
# ==========================================

echo "ğŸ¨ Installing Analysis Dashboard & Real-time Logic..."

# 1. Create the Visual Dashboard Component
# ----------------------------------------
echo "ğŸ“ Creating src/components/admin/AnalysisDashboard.jsx..."
cat << 'JSX' > src/components/admin/AnalysisDashboard.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, ChevronDown, ChevronUp, AlertCircle, RefreshCw } from 'lucide-react';
import clsx from 'clsx';

/**
 * ğŸ“Š Circular Gauge Component
 * Visualizes the 0-100 match score with color coding.
 */
const ScoreGauge = ({ score }) => {
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  
  // Color Logic: <60 Red, 60-79 Yellow, 80+ Green
  const color = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444';

  return (
    <div className="relative flex items-center justify-center">
      <svg width="80" height="80" className="transform -rotate-90">
        <circle cx="40" cy="40" r={radius} stroke="#e2e8f0" strokeWidth="8" fill="transparent" />
        <motion.circle 
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          cx="40" cy="40" r={radius} 
          stroke={color} 
          strokeWidth="8" 
          fill="transparent" 
          strokeDasharray={circumference} 
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-xl font-bold text-slate-800">{score}%</span>
        <span className="text-[8px] uppercase font-bold text-slate-400">Match</span>
      </div>
    </div>
  );
};

const AnalysisDashboard = ({ data, onReset }) => {
  const [copied, setCopied] = useState(false);
  const [showGapAnalysis, setShowGapAnalysis] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(data.tailored_summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Safe Defaults (Defensive Rendering)
  const missingKeywords = data.keywords_missing || [];
  const suggestedProjects = data.suggested_projects || [];

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden flex flex-col h-full"
    >
      {/* ğŸ† Header: Score & Quick Stats */}
      <div className="bg-white p-6 border-b border-slate-100 flex items-center gap-6">
        <ScoreGauge score={data.match_score || 0} />
        <div className="flex-1">
          <h3 className="text-lg font-bold text-slate-800">Strategy Report</h3>
          <p className="text-sm text-slate-500">
            {data.match_score >= 80 ? "ğŸš€ High Fit. Apply immediately." : "âš ï¸ Gaps detected. Tailoring required."}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        
        {/* ğŸ§© Missing Keywords */}
        {missingKeywords.length > 0 && (
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <AlertCircle size={12} className="text-red-500" /> Critical Gaps
            </label>
            <div className="flex flex-wrap gap-2">
              {missingKeywords.map((kw, i) => (
                <span key={i} className="px-3 py-1 bg-red-50 text-red-600 border border-red-100 rounded-full text-xs font-medium">
                  {kw}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ğŸ“ Tailored Summary */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tailored Executive Summary</label>
            <button 
              onClick={handleCopy} 
              className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 font-medium transition-colors"
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}
              {copied ? "Copied!" : "Copy Text"}
            </button>
          </div>
          <div className="p-4 bg-white rounded-xl border border-slate-200 text-sm text-slate-700 leading-relaxed shadow-sm">
            {data.tailored_summary || "Summary generation failed."}
          </div>
        </div>

        {/* ğŸ“‚ Relevant Projects */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Suggested Evidence</label>
          <div className="grid grid-cols-1 gap-2">
            {suggestedProjects.map((projId, i) => (
              <div key={i} className="px-3 py-2 bg-blue-50/50 border border-blue-100 rounded-lg text-xs text-blue-800 font-mono">
                {projId}
              </div>
            ))}
          </div>
        </div>

        {/* ğŸ§  Gap Analysis (Expandable) */}
        <div className="pt-2">
          <button 
            onClick={() => setShowGapAnalysis(!showGapAnalysis)}
            className="w-full flex items-center justify-between p-3 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors text-xs font-bold text-slate-600"
          >
            <span>VIEW STRATEGIC GAP ANALYSIS</span>
            {showGapAnalysis ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          <AnimatePresence>
            {showGapAnalysis && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="p-4 mt-2 bg-slate-100 rounded-lg text-xs text-slate-600 leading-relaxed">
                  {data.gap_analysis || "No detailed analysis provided."}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ğŸ”„ Footer Action */}
      <div className="p-4 bg-white border-t border-slate-100">
        <button 
          onClick={onReset}
          className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors"
        >
          <RefreshCw size={16} /> Start New Application
        </button>
      </div>
    </motion.div>
  );
};

export default AnalysisDashboard;
JSX

# 2. Refactor JobTracker to include the Listener Logic
# ----------------------------------------------------
echo "â™»ï¸ Refactoring src/components/admin/JobTracker.jsx..."
cat << 'JSX' > src/components/admin/JobTracker.jsx
import React, { useState, useEffect } from 'react';
import { db } from '../../lib/db';
import { collection, addDoc, serverTimestamp, onSnapshot, doc } from 'firebase/firestore';
import { Briefcase, FileText, Save, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AnalysisDashboard from './AnalysisDashboard';

const JobTracker = () => {
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    raw_text: '',
    source_url: ''
  });
  
  // State Machine: 'idle' | 'saving' | 'analyzing' | 'complete'
  const [viewState, setViewState] = useState('idle');
  const [activeDocId, setActiveDocId] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // ğŸ‘‚ Real-time Listener for the Active Document
  useEffect(() => {
    if (!activeDocId) return;

    console.log(`ğŸ‘‚ Listening for updates on: ${activeDocId}`);
    
    const unsubscribe = onSnapshot(doc(db, "applications", activeDocId), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log("ğŸ”¥ Firestore Update:", data.ai_status);

        if (data.ai_status === 'processing') {
          setViewState('analyzing');
        } 
        else if (data.ai_status === 'complete') {
          setAnalysisResult(data);
          setViewState('complete');
        }
        else if (data.ai_status === 'error') {
          setErrorMsg(data.error_log || "Unknown AI Error");
          setViewState('idle'); // Allow retry
        }
      }
    });

    return () => unsubscribe();
  }, [activeDocId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setViewState('saving');
    setErrorMsg('');

    try {
      // 1. Write Initial Document
      const payload = {
        ...formData,
        status: 'draft',
        ai_status: 'pending', // âš¡ Trigger the Cloud Function
        created_at: serverTimestamp(),
        updated_at: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, "applications"), payload);
      
      // 2. Set Active ID to trigger Listener
      setActiveDocId(docRef.id);
      
      // 3. UI waits for Listener to flip state to 'analyzing' -> 'complete'

    } catch (err) {
      console.error("Submission Error:", err);
      setErrorMsg(err.message);
      setViewState('idle');
    }
  };

  const handleReset = () => {
    setFormData({ company: '', role: '', raw_text: '', source_url: '' });
    setViewState('idle');
    setActiveDocId(null);
    setAnalysisResult(null);
  };

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col relative">
      <AnimatePresence mode="wait">
        
        {/* 1ï¸âƒ£ STATE: FORM INPUT (Idle / Saving) */}
        {(viewState === 'idle' || viewState === 'saving') && (
          <motion.div 
            key="form"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm flex-1 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Briefcase className="text-blue-600" size={24} />
                New Application
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Paste a Job Description to initialize the AI analysis pipeline.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Company Name</label>
                  <input type="text" name="company" required value={formData.company} onChange={handleChange} placeholder="e.g. Acme Corp" className="w-full p-3 rounded-lg bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Role Title</label>
                  <input type="text" name="role" required value={formData.role} onChange={handleChange} placeholder="e.g. Senior React Developer" className="w-full p-3 rounded-lg bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                </div>
              </div>
              <div className="space-y-2 flex-1 flex flex-col">
                <label className="text-xs font-bold uppercase text-slate-500 tracking-wider flex justify-between">
                  <span>Job Description (Raw Text)</span>
                </label>
                <div className="relative flex-1">
                  <textarea name="raw_text" required value={formData.raw_text} onChange={handleChange} placeholder="Paste the full job description here..." className="w-full h-64 md:h-96 p-4 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none resize-none font-mono text-sm leading-relaxed" />
                  <div className="absolute right-4 top-4 text-slate-300 pointer-events-none"><FileText size={20} /></div>
                </div>
              </div>
            </form>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 bg-white sticky bottom-0 z-10 flex items-center justify-between">
              <div className="text-sm font-medium text-red-500">{errorMsg}</div>
              <button onClick={handleSubmit} disabled={viewState === 'saving' || !formData.company || !formData.raw_text} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 flex items-center gap-2 transition-all active:scale-95">
                {viewState === 'saving' ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                {viewState === 'saving' ? 'Initializing...' : 'Analyze Job'}
              </button>
            </div>
          </motion.div>
        )}

        {/* 2ï¸âƒ£ STATE: ANALYZING (Pulsing Brain) */}
        {viewState === 'analyzing' && (
          <motion.div 
            key="loading"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex-1 flex flex-col items-center justify-center bg-white rounded-2xl border border-slate-100 p-8 text-center"
          >
            <div className="relative w-24 h-24 mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-blue-100 animate-ping"></div>
              <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center text-4xl">ğŸ§ </div>
            </div>
            <h3 className="text-xl font-bold text-slate-800">Analyzing Vectors...</h3>
            <p className="text-slate-500 mt-2 max-w-xs mx-auto">
              Comparing your experience against {formData.company}'s requirements.
            </p>
          </motion.div>
        )}

        {/* 3ï¸âƒ£ STATE: COMPLETE (Dashboard) */}
        {viewState === 'complete' && analysisResult && (
          <motion.div 
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 h-full"
          >
            <AnalysisDashboard data={analysisResult} onReset={handleReset} />
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};

export default JobTracker;
JSX

echo "ğŸ‰ Sprint 17.3 UI Installed Successfully."

```
---

## FILE: install_sprint_17_3_tests.sh
```sh
#!/bin/bash

# ==========================================
# ğŸ§ª SPRINT 17.3: TEST SUITE INSTALLER
# ==========================================

echo "ğŸ§ª Installing Analysis Dashboard Tests..."

# Ensure directory exists
mkdir -p src/components/admin/__tests__

# Write the Test File
cat << 'JSX' > src/components/admin/__tests__/AnalysisDashboard.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import AnalysisDashboard from '../AnalysisDashboard';

// ==========================================
// 1. ENVIRONMENT MOCKING
// ==========================================

// ğŸ¥ Mock Framer Motion
// We replace animated components with standard HTML elements to avoid 
// animation delays and JS-based styling issues in JSDOM.
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, layout, initial, animate, exit, ...props }) => (
      <div {...props}>{children}</div>
    ),
    circle: ({ children, initial, animate, transition, ...props }) => (
      <circle {...props}>{children}</circle>
    ),
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

// ğŸ“‹ Mock Navigator Clipboard
const mockWriteText = vi.fn();
Object.assign(navigator, {
  clipboard: {
    writeText: mockWriteText,
  },
});

describe('AnalysisDashboard Component', () => {
  const mockOnReset = vi.fn();
  
  const fullMockData = {
    match_score: 85,
    keywords_missing: ['TypeScript', 'Docker', 'AWS'],
    suggested_projects: ['pwc_proj_1'],
    tailored_summary: 'This is a tailored summary for the candidate.',
    gap_analysis: 'You need more cloud experience.'
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // --- TEST CASE 1: HAPPY PATH ---
  it('renders the dashboard with correct data', () => {
    render(<AnalysisDashboard data={fullMockData} onReset={mockOnReset} />);

    // Check Score
    expect(screen.getByText('85%')).toBeDefined();
    
    // Check Summary
    expect(screen.getByText(fullMockData.tailored_summary)).toBeDefined();
    
    // Check Missing Keywords
    expect(screen.getByText('TypeScript')).toBeDefined();
    expect(screen.getByText('Docker')).toBeDefined();
    expect(screen.getByText('AWS')).toBeDefined();
  });

  // --- TEST CASE 2: VISUAL LOGIC (GAUGE COLOR) ---
  it('renders correct gauge color based on score thresholds', () => {
    const { rerender } = render(<AnalysisDashboard data={{ match_score: 85 }} />); // Green (>80)
    let gauge = screen.getByTestId('gauge-circle');
    expect(gauge).toHaveAttribute('stroke', '#10b981');

    rerender(<AnalysisDashboard data={{ match_score: 70 }} />); // Yellow (60-79)
    gauge = screen.getByTestId('gauge-circle');
    expect(gauge).toHaveAttribute('stroke', '#f59e0b');

    rerender(<AnalysisDashboard data={{ match_score: 40 }} />); // Red (<60)
    gauge = screen.getByTestId('gauge-circle');
    expect(gauge).toHaveAttribute('stroke', '#ef4444');
  });

  // --- TEST CASE 3: INTERACTION (COPY) ---
  it('copies summary to clipboard and updates button text temporarily', async () => {
    render(<AnalysisDashboard data={fullMockData} onReset={mockOnReset} />);

    const copyBtn = screen.getByRole('button', { name: /Copy Summary/i });
    
    // Initial state
    expect(screen.getByText(/Copy Text/i)).toBeDefined();

    // Click
    fireEvent.click(copyBtn);

    // Verify Mock Call
    expect(mockWriteText).toHaveBeenCalledWith(fullMockData.tailored_summary);

    // Verify UI Feedback
    expect(await screen.findByText(/Copied!/i)).toBeDefined();
  });

  // --- TEST CASE 4: INTERACTION (EXPAND GAP ANALYSIS) ---
  it('toggles the Gap Analysis section visibility', () => {
    render(<AnalysisDashboard data={fullMockData} onReset={mockOnReset} />);

    // 1. Initially hidden
    expect(screen.queryByText(fullMockData.gap_analysis)).toBeNull();

    // 2. Click Toggle
    const toggleBtn = screen.getByText(/VIEW STRATEGIC GAP ANALYSIS/i);
    fireEvent.click(toggleBtn);

    // 3. Now Visible
    expect(screen.getByText(fullMockData.gap_analysis)).toBeDefined();

    // 4. Click Toggle again
    fireEvent.click(toggleBtn);

    // 5. Hidden again
    expect(screen.queryByText(fullMockData.gap_analysis)).toBeNull();
  });

  // --- TEST CASE 5: DEFENSIVE RENDERING ---
  it('renders gracefully with empty or missing data', () => {
    // Pass empty object to simulate fresh/broken DB record
    render(<AnalysisDashboard data={{}} onReset={mockOnReset} />);

    // Should default to 0%
    expect(screen.getByText('0%')).toBeDefined();
    
    // Should not crash on missing array maps
    const keywords = screen.queryByText('TypeScript');
    expect(keywords).toBeNull();

    // Summary might be empty but shouldn't throw error
    const copyBtn = screen.getByRole('button', { name: /Copy Summary/i });
    expect(copyBtn).toBeDefined();
  });

  // --- TEST CASE 6: RESET ACTION ---
  it('calls onReset when the start over button is clicked', () => {
    render(<AnalysisDashboard data={fullMockData} onReset={mockOnReset} />);
    
    const resetBtn = screen.getByText(/Start New Application/i);
    fireEvent.click(resetBtn);

    expect(mockOnReset).toHaveBeenCalledTimes(1);
  });
});
JSX

echo "âœ… Test file created at: src/components/admin/__tests__/AnalysisDashboard.test.jsx"
echo "ğŸ‘‰ Run 'npm test' to verify."

```
---

## FILE: package.json
```json
{
  "name": "interactive-resume",
  "private": true,
  "version": "3.2.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui"
  },
  "dependencies": {
    "@tailwindcss/vite": "^4.1.18",
    "clsx": "^2.1.1",
    "firebase": "^12.8.0",
    "framer-motion": "^12.29.0",
    "lucide-react": "^0.562.0",
    "mermaid": "^11.12.2",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "react-router-dom": "^7.13.0",
    "react-to-print": "^3.2.0",
    "recharts": "^3.7.0",
    "tailwind-merge": "^3.4.0"
  },
  "devDependencies": {
    "@eslint/js": "^9.39.1",
    "@testing-library/dom": "^10.4.1",
    "@testing-library/jest-dom": "^6.9.1",
    "@testing-library/react": "^16.3.2",
    "@types/react": "^19.2.5",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^5.1.1",
    "autoprefixer": "^10.4.23",
    "eslint": "^9.39.1",
    "eslint-plugin-react-hooks": "^7.0.1",
    "eslint-plugin-react-refresh": "^0.4.24",
    "globals": "^16.5.0",
    "jsdom": "^27.4.0",
    "postcss": "^8.5.6",
    "tailwindcss": "^4.1.18",
    "vite": "^7.2.4",
    "vitest": "^4.0.18"
  }
}
```
---

## FILE: prod_merge.sh
```sh
#!/bin/bash
set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}ğŸš€ Starting Production Merge...${NC}"

# 1. Identify Branch
CURRENT_BRANCH=$(git branch --show-current)

# 2. Guardrail
if [ "$CURRENT_BRANCH" == "main" ]; then
  echo -e "${RED}âŒ ERROR: You are on 'main'. Please run this from the feature branch you wish to merge.${NC}"
  exit 1
fi

# 3. User Verification (The "Human in the Loop")
echo -e "Target Branch: ${GREEN}$CURRENT_BRANCH${NC}"
echo -e "${YELLOW}âš ï¸  CRITICAL CHECK:${NC} Did you visit the Firebase Preview URL and verify the features?"
read -p "Type 'yes' to confirm merge to Production: " CONFIRM
if [ "$CONFIRM" != "yes" ]; then
    echo -e "${RED}ğŸ›‘ Merge Aborted. Please verify UAT first.${NC}"
    exit 1
fi

# 4. Merge via GitHub CLI
echo -e "\n${YELLOW}ğŸ”€ Merging PR into Main (Squash Strategy)...${NC}"
gh pr merge --squash --delete-branch --admin

# 5. Local Cleanup
echo -e "\n${YELLOW}ğŸ§¹ Syncing local environment...${NC}"
git checkout main
git pull origin main
git fetch --prune

# 6. Final Status
echo -e "\n${GREEN}âœ… Production Deployment Triggered!${NC}"
echo "The 'Deploy to Live' GitHub Action is now running."
echo -e "Monitor it here: https://github.com/rpdouglas/interactive-resume/actions"
```
---

## FILE: public/og-image.png
```png
‰PNG

   IHDR  ä  v   Ö„Hí   sRGBÙÉ,   gAMA  ±üa    cHRM  z&  €„  ú   €è  u0  ê`  :˜  pœºQ<   bKGD ÿ ÿ ÿ ½§“   	pHYs  Ã  ÃÇo¨d   tIMEêÁÇ‚    IDATxÚìİw|×}ïıÏ™™í‹Eï :‰F€ ;)VQ½:¶+,Åqâ<)ß$7¹¹¯[ronâ¼n?¾Qb;»dI¶z¡
EŠ½“ 	’ *Ièm±‹í3Ï‚ ;²ü{K|½$`fvÎ™³ËısæŒ
GãB!„B!„ø¹Ò¤
„B!„B	äB!„B!„r!„B!„BH B!„B!$!„B!„B¹B!„B!\!„B!„È…B!„B	äB!„B!„@.„B!„BH B!„B!~Yjo¥P×ı¥…e½¿}¬ywø„ûPõ¡Pê}Ô½B!„Bˆ_ü@ˆ³ÿ©áöÉyr¢AÖÂM<öØz²fFk‚ıÏş·NõµfåGPÙÜşåÇY_äÃ¦~9*ßŒ…é~÷ßøö®´YeÖğä/á³O<ÈB>ÿÎ±ıGã_nG×Õ¬ºÏ¬ÚÂo~~©JIB!„BˆOZ ×5'‹¦ñ—ó`¨Ù¼i³Å’-k¹½@'™½æÀIŞÛöß}£ñ<î°ôOÿ‘?ğ9fçŸÈMB§øûÙƒÇ5»à‚“„Ròù“Ï¯Ä§ÏS)–Il¬ƒø»ŸâÉq>î~|KÛB!„Bˆµ~¹n'¥î>¾x:‘èœùÑVœÖ®6é&>5J«”IïÙÓœ½Ğƒßš½m$o_º1>¯ƒ_Ê1İy
ìíà¥çŸâÅı—‰[êÖwB!„Bñ	ä(îÖÜÿnsE˜›É=—i=İLW
ääéNºº&™¹ix@cËã°fAn].È4Ëäüşƒ¼üÂ+ì	ğ-„B!„È§#¹ÍEöâ;ø_)!˜ÈUt§OĞÚM1Ùs–³§ióÏ–fŒÄ²<ºi1¹é.¹sèFWü<Ï½²ƒãQä–p!„B!„@>½»'½€e<ÈF#HdF&WJqüD­­­øU„îövZŸ#0cõ²ğ°Á½÷o`ie^ãzË‚+”ÒĞ´ùÿ¨¤Ôï7sÃëo7}ºJİôX³^ï#	Ï
ÙÃ“?~‘7ö´1²>Ô8¹ºAnT—·V
uÍïçY~ŞsP·T®ëŸ¿’ùB!„Bˆ_8Æ‡>‚=…‹VóÙÏóŞ‡qx®F#£«•ÃgÛ¸§#•ÎÓoQèWÂ-“Äªõ<¸z	¥ÙN°ÌyD'úèl=KûÅ!Æ'BÄ-”†nsâÍÎ¥²ºEùéØuf=êK© ÇpøØyÂ3Ó±e¡g-bíªe”gÛ°,‹øù=üdw'Ñ¸yM ^°æÓ¬/·ê=ÂëÛÎ™“ü4»›ªõ¿Âòœ0=çräôÆ'ãä¯z˜S±ØiøºGËv¾ş"
‹~—»ërqêïï™fJ)Ñ »éîíc°o„`$B4n
ÍaÃ•’Cù¢ZªËsqk\½­@).7ocÏ©&ãÌªGÓYÄÆ;WR’é…±9zœŞq¢qÍæ %¯’eM‹)Lµ£(+ ›'Ïp©ÏO8a¢Ù]d—ÔĞ°¤×y\›‚D„sœ:ÛÉÀĞ‘„	JÃîñ•_EmmEiLyŞ›B!„â—&[:)…4İõ)î~ñÿ°İtM?¶Ìî
ğö™Ú£i;Áit<S»Åâ.Ú¸’Æú
¼ºyM‹G9½÷5^{ïmmí´´÷ÑÚå'1Á¦£gøXXQ@Cu‹*kY{ÿƒl(OÅĞÉQõ(ƒ]GùŞ—ÿm6÷ÕÇTşÁ_ñÅM”g˜Ã-üë?<É¾ÓÙ'aÓùŸ¯<ÀºRÈèY¾óÛÿƒ¶ÙUV¶º‰?.Y¹ë{|ÿõ}ì9ÔÆÙAşâµ»XW‘
Á}ñ†ÛCÏ¶øFÅ"*ÿãCTgxnñ°
•¦y÷6ŞÚq’ŞËœ¿ÜËÅÎ~zÇ‚˜É@^à¦$¯ˆ%µÕÔ7-åûïgUqÊ•#à?„§¾ñ¯¼Ş<cBE,[¾Â®µU˜­oòÊÖİìŞŒ½§ú± ÇCuu-×¬çW¿ôVd›tì~†gß8Èág8Ù2DßxrÓX±¤wİÏgåA–æë³Û‚'Ğ×Ì+?}ƒCg:9ÕÒÎÙsÃøã`è¤—dP]QCıâjÖßû[–-"Ã!¡\!„BñËÈ±PF•Ywo>ï¼4Šm*‘+]gâØiŞr_"4zÃ~uxÙY×È¦5kYœ›¥¾*Ap´7Ÿ|’{ûÇÚÆ¡Ğè;éDââÙ.œiÇğîaç¡£œûâñ›`7’qU)7Îçt€MLš8æÎ'W
›İ'Ã9ëÇš¦Í˜Ó¯0lNlöÛèÚw?Å[Ï?ÃÖ1lš†æp¸)Ô
<>–?ÄäTÕ8Ü&ÿÿTRÈ_?±†¬[¼r* ¿ó?üë—éÎ¶¡©©µÙ•OæÔF‘çÏóÖùóìÚs„saÔoı:+‹lÓõcØœx2fò¸"èsü¥ïĞ¼o¯ïíc,J³ãÉJé‹§›ùQG7=ãq>·|ˆŸ|÷-vŸõF¡tO†±0-‡ÒŞ9„rùÈztÅN+9BoÆiy‰ÿçëÏ²uw+í~Ğ5PÆÔ¾@tt‚æC8vô(» íş#_ŞRC–[“w·B!„â“ÈÁ²é•Õ¬\'¶?ÃĞÔ=½JÃ3ŞÂÛÛ4LKá¸’Š—.cÕŠ…8”5kD4:ÑËÖ¯ÿ%ùÔYz&Íä}ÃÓ¯caZW2b2¤+¥HÇ9ºsCã!”ö|iSÉ¬Ğü³Ôß7Âsß}š€?†í#Ê€v—ƒı*™Û_â{§Ç’	Jañæ·Ÿdqm¿½"õ–;L,Ó"a)2s³©,)¤ Ã‹Ó®A"ÎxÿENíáR0yzØ?ÄóÏ¼LEU>»BÛõZ÷‰×ùÇ¶#BqP×ÜË­°"~v½ü}Îmsy(JÜbêºÍê <ĞÆOwfóÊFÔe‚e2y~;_ÿßßå©ñ'ÀĞ aÙ¨nª¡® #<È±Cçè˜0ÑÍ8İ-Gø§ÿşm*ËÿŒ‡kòpH&B!„B|Ò9XXF>MK—±jí{œØ6@xúw	&#‰Y!-­¨ŒÕ›7Ó˜¥f…qËŠpéİïğOÏŸãÒ¤9;Üé>n`3M¬È]§öòÒ®!,‡šÚ×äüÉc¼ñÒ,©ş}n+úùT iZŒùÃÄãq"8$€øjÒ´ÍEvå}üv½IÇùïh$'(gùÁß}ƒŠ¯ı>u·ø*š#ƒÛÿàQ*ëiZºœúò\Rİ6T,DÏ™|ï›ÿÊw_jgxªÆµvkãŞµ«),u\÷¸*`¢p)Ÿÿtéö(]{Şâ'§&¯iT‰hˆ yÜ÷ÈgÅ¹Ôv’íÛ[¹djÓ×XÓ]{Û9ÿXÅY¤DúyûÙ—xã`2ŒX‰ZõF~ïÏ¿Â§W”aoá©¿ı¯üé³]˜(¥íyƒ¯?s'ÿìr<vYìM!„BñIä€e‘ZÙÄšå¼{ä-ZÆ®³ncQımlY³ğšû ­Éó¼õö1.Çg‡Şx„å|‰¯şßŸfmY*VxŒ–?Eı;~pÖ†gz>z˜÷ä®£,_ıs«Ä„ÍÅŠM¹wİbrİ–e’_äBÿÀ#´
›ÃKé†Gø½/œáÔŞÇx¦mj¦€Iç™]|ÿ_
øÂ“|»bŒë/—oé^Ê–=ÄßSNq¶“Dt’‰	?½#"Ñ81WJJÉ5Î1OV¤aÓÙÛŞÃèè0fYÁu;a‚ù<ñ×¿ÍvyöIN>åÈ¾ÆyCÍ>‡‡%w>ÂŸü‡'Xš§sï+ƒ_ãŸ%®^;¥ c‰ !S¡·`÷ñVºƒWŠrÏƒ°¹®ŸÓ†eÔrßü§çºˆNõMhv/¼ÃÑßÛÀ]n;º$r!„B!Ä'>ca9
X¹aõoæÜ±bólåNÉaõ½÷P“vmMôœæp÷8‰ÙÇ–sßgïaY±……r¥Qİ´‘ûo™ìï€Ì«ñ/rúíİôFs~>ÏíÖ]¬Øü0_ùêçÙ¸¨”t×Ô¨¿eNO¯ÿ ¡Üé*`İÃ_äÏ»úø£o_Às¥œ‘	ìøÃÃ‹Èğ%ùõ¯I6‹ª½ô_ìäÀ>†úéî¾Ì¥îsœ¿|‰“Íİtúè†íjcĞú™‡ˆ^oŒÙŒAı*î[_M¶Û@³Ü”®^ÇêØ«´
÷Ì<AíšMÔØHà ¨´‚ú%Åp \3?ÎèD”h$Fg{.öŸÙmãt£œçĞ}t¹LHÄ	´Ï©gsò$ç/™X9 CäB!„Bˆ_‚@¡éUë¹sÍìn¡gòÚM
×<Ä§×cŸ'-‡‡˜•ÇI€¹Ê64}:gâ°¤gçA¼™ãÃ!&&C„Â?Ÿ,æÎÎaõİ²¥¡i‘H|t+|[šÔâeÜûk_¢µó¿ñäağLİÓíäÀ¶£vı“WâôÑ¼ôüË<ıâÎ\ˆ¶äìCÃnh×Ö•i&;?®wèD
RI³M½¾åñ‘iY×L¤·Ûl¤øRÑ,@YØl·›d’õ@øä?jœ1Fzg¿º+Uñú?ı-¯üm`újC:\cN7Ä(“ayšB!„â—'8rÙ¸a)Ù/Ÿ¦g2<'*6=p/•©ú¼A/‹ašsŸnvl†šgëº9ôç52š–BåÂJ<¦ÅGŸÿ,,ÃEQãZ>õØ£œ9ûö…S‹ÙÙoòseMĞÙò.ßúÛÿ—oíByÜxrg^dZÖGtîÖu¯È5?¿qX‰D‰M snaw¦z Õs“Q20.„B!„ø%ä(<†¡Í›“3ÓRĞ¯3—Üíõa·ÙĞŒŸj@/Ã£qÌ\¦Ã	“hhIñJaÓúÔ£ÍÔ<¿·10sÂá‹¤º®a·ÛøYÆê®\Öny€Ç:ÎsñÉıôİbÜrrÛ3|ãÍaÜÙWj$¥°„û~˜6­¤¢ÄM÷›OóÏ_Š]CÆÇ¦a*”ãÚoOI¥8ËƒÓP7ØWÇ®+™®.„B!„øeä7	Z×I¼¤ºq¨q"Ó	WÇæ9Æî£ƒÜWš‰Ã­ƒcph€“ÇöAêìœ™Y9äæä’æ6˜tºH©21G™^ÜK7tN_ 0áÇ´Ü(+ÎÈğ(Ñhâc|™öìî~ğ!ZÛºùşö~æÍö0	Æè8~ |éW³©7›»?ó;üç?¼“\İ@×Grj˜ÑKY-,RÉÍN'#_AïÕßDFÇXñå¿äkm¢2×®_jo™&ñxŒ„¥c·6ÇGö:!„B!„øYøXE-¯ÍKÉ°ÏNív¯Îëßø{Ù×Jo_Îçı=ıºÛ9»8ë+©«^HvÜjöèµÍï½ÇËûÓr¾½<õüz†¢ëe¡ÈnØÌg?}k‹è·°GÂŒ‹3kc»#5…İ†¡[„{;9{ög?FMÁòPRYFqi3ƒîÈHãà·¾ÆûÖOÙ{æƒcãøı~ÆGÇ¸ÜÕÆŞ­?àÉ­gÄì†!„B!>ŞŒÓÉ(-“Õ÷İÇíÛ›ùæÉØÕGb¡\:ÄøÕOóG“*Å†Û9{12Í›É¦·³zq¦¥ÈÍÉ¥dQœQR…ÇÖÏÿ÷_şŒ'¿MÇğÙpüBŒ¦zh¸ûS<ÑÙIÇÿÙEGøFÃä
]³ãM·%Ÿ~¥ü£C´ì~“­Ù4¦ŒsôŸòİïï¥ÏîÄşqÉã–EFõJn_]Ï®æ]tNZÓÓíav~ïyóÉ¿cÆ4
°idãÿ~‘/ÊbnB!„Bˆ_ ¯ª¾º;ùÒş_X"è7gŒn+\n,'4;î˜¶ÌÁÁ¿ş[<şÀZ8-,Ó"½¸‚†úeÔ¹ã×ÜãmØ<NÜ>E|,ş!Qös¬"G)›ùu~ãl‚7Èã:^_‹VmB‹1½©åğ[Ïó…¨oºƒ'¿Lñ’§~Ì*ÀUÂ†O}ßz Œˆ?NlÆéiº'eª-\ù“jÇ¦ìòB!„BH ÿÀ'¤ûX|Ç#|õ}ÿñX1“ı£ÇãDâ³W·L‹H8F°„ÉÜZşüş†¿øY^ê^¤Íô±öşOñ™-Ø1Â‰«Ç0	‚ıãL¬â¯ş|i¿8aÎ^°”‡ÿ¯ßáw+ã­ëGrGj›åÉ$Ô%:•ÊuÃ@sù`ÑƒüåWçS÷­¤Ğó1»‡Ş²H-_Å#¿û_ùñÿº›:sœ`”`ìÚç»›	“p(JÌ`2a"äB!„Bˆ_?£)ëñXŒàXdNÚV·4­ÛÓ¨^}/yåKØòh+Gvïàí#§9qà<çÇbàuRXZÊ²e¬ß¸™õåíµÏc–Nfù
øÏÅÂÏóÜOŞâ=#3¼”/]Îg?õİÖ@ÑÈV^ziççœ¯M¿:²ŒE"!6–`æÚî‘xâÃ=ïÚ2a<B0|uÄ?è¸ñˆ½R6òk6ó¥?yŒ#~›ƒÊvuEñ”	+ùü1Ks‘Wµ¯ü÷4ª›^äéßáÖŞÒ">ıøƒ|î¾{X·4‹¶­­˜¡Á±©N‰DŠÌ«å²’eÍè¿‰„ nÎ*»……9¨Npfóæ©#+Á˜6½7Ä0gm¨‘YÙÈ]åQ½ésœ=¼·waï¡NŸL®˜á¦º©‚úª6­^ÃŠ¥õdxtyg!„B!>öT8ÿÈ­°Ÿá@k¤jódêÒo°Úúl‰X„p(D$ÀœıT(¥Ğt»Ó…ÛiG»áñ„ƒ&Ã1¦•Ü_Ó°9İxİ´ÈÄMÎW#`Ì¹fôU)GJ)°ˆ˜e	ŒáÏV®TÒ¼¶ë?¹Ë²ˆG&Ÿˆ`ÎÙW³¹HKóL¯å¦ÌÁ`P$¼J¡ÛœxÜœvMø	†¢³£t\/·X`Œ‰PìÚNe#%5‡MGa‘H„ğ‰_Ûƒ€ÍFš{ªÿ'f"$3¯-·Óƒ×ëÂ¦æ7N44I(#nZ3®•Bi
M·áp:q9nÖ„B!„âÈ…B!„Bqcò¤f!„B!„B¹B!„B!\!„B!„È…B!„B	äB!„B!„@.„B!„BH B!„B!„r!„B!„B¹B!„B!$!„B!„È…B!„B	äB!„B!„@.„B!„BH B!„B!„r!„B!„â—3«ŸÑ¶âçCÍùóñ'˜`4Å´~±ê÷£ºFÒæn|¬G%úıŒ"ò#„B!®ËøP{[	"ÁQz‡#4²Ó½8ôùS’2CŒ*Rr²ÉtÈàüG›p
ëCªâÑIFÇü#	Lsê‡š;%ÜTçÇ2ÆiÚß}—]Ú
şô®2\vmªø
ŞGù?X+°,nå%”eô34$’ ¥xRÓÉI±¿¯Pça4˜ì|°¦ÎA·;IK÷‘â0~áº59JÏHˆ¸™¼VJÒm¤¦§“ê¶MõZÄ£“L`KM%#Å5oÏ¡2#ŒŒŒ1>Çš®Pšİå&=Õ‹Û¦ıLÛÄõMpàÕ×Øçiâ?=Tƒ¦¤+R!„B|ÔÜŒ2Ò½¿ù·VœKoã«,§4İ6Ï7gĞ`¯>¿“İ—<ò{¿ÎİùšŒ–dI1ÆøÀ ıQey>lººiGJpô2'NcÿéN.…läe8Nâ·êVmâ7×•bYÏ!h¥ÚŒ"Zñ(Ãı©ägù°ÿ,N;2Á…¾Q´Ì
¼7Â&“^í<ÄË1r2‡Ç±
êxh}e©Æ-–3Dëşüèğ0e™¸,“ñ‘QF•¥ËØ²´‚\ãê}d]>Æ“Ïœ&––OYŠIÀ?Î… Î’ÆeÜ³®†B“ ÿ/ş`7ù÷ŞÁ=M%8¯i‹
áä¾wøÁq“š^ìzœñá	Æ¢&´<V5,¢©¦”|Ÿ]ı{µSù”B!„?«@¥áqÛ½ĞEÛp%ùi98Ôì/ÏÊš ³ı—Æ-ìvcV˜úk?Jéh9Ì›ÕüÁ^lº~ƒDdnãÍ·p2šÉºu[¸Ïç$Åk›Œ›èt°¬_˜H„œÛ¿‡Î’<•ŠøÜ•B_ä½mÍ¤Şñ)ò<Æ^<ÂpÇ	¶]vrÇ–õÔçØwñÊÇy;»/¯ÊºnpãQ}…Ò4ÜEÜ{Ï
òtğdá‹]¼»/ÛÜé|jI>ã©¹j8\nª×lä¾RE,f¸§wöb[N.Öçà4Tr&€¡ß4Ğ*¥H+¯åáÍeøœ™
Gèaï¡]œ¹4Áçî^Â¯]ÌB!„Ÿ´@>uL%v“'{XšŸ†Ãc›fâÃtvâËu3:¨®ûÅz*1ÎP’’gn{ı s³cM÷%0û83_ãÚãYWş›Õ®î?ÏyİÊTêîkÁµÓ¦	Â±(13y¬™çtMVŒqxÇaNÅóøÔk©Éô`¿&©\{¾·T§s·½ÎôîérÜB™o¥CÂ²,b¡ñ+áynıÌx½[m[³ÏK¡QÂ‘8>nÜV’=	â££è¹5”d“î²°<zOĞ61	(Â£ı?v{íbç¥q£‰ìJw–A¶Ã@‘Í‚<'Aÿe^9×Ï½ÕÙxã–®Ó¼íBš¯]3_[¿Áû`VŞ¸?Gi:._Ù™: (ğÅ8ßÑÁşËuÙï»èN™éé¤»ÈLşÌ,-dAªçŞnfëéXZ€ÓP·Të^Ûy~q³¶uÓ÷ÈõÚä5Ÿ+Üğv‰[mã3%„B!>Üw.õœ\jo¥Å_Á·ÛÔ?e¹ØÓÍ©p.›
ıøGƒ³ö†9uòG;ÇÇ-tg*u+—³®45.µî>FK¢‚ûF9pè,]#1,{
KV,aYE®©‘ÆXhãûÓ|)@8º'ƒµ·-¥6Ï7}>$Â^hc×Ñ.zq4‡—Š%¤_8H›¾€Ûïl$ê‹ox¨“‡ÏĞ9%¡id—s[c|Éj9½—×Î˜,½³‚ñ}Ç9Ş7‰åÎbİú&j²í‡°·c”°¥“¿°†MÉv\­·Xh˜ãûr¬'@ÔÒpe²qM-et,ÂÁ^¶¿ušôª…©Av6÷01qd²yÓr*Rƒ—Ù·k;;ÛÇ6ğ­áSx}™¬¾k>5û¼e¿ØÂ{—tšîZI]Vòunôå<1ÙÏÑ#§8qÁO8Ê°QTYÍª%•äNİfnšÙúbfe+}—Ù~ ›Á…-5ŸÍ›©Hs¡ÄCôu·°ãHÃaK³‘]ÛÄg!àÌŞİœÏ®eÃ’R|–Eò^âav½q˜xY#w/ÉŸÓô{ñã×ÚéîÜÇğ©fœ9UüÆíU8“¾ìh¾ÄèdKÙÈ¯käúB<vˆ1ÔßÂÖı1V4ºÔÊ‘qÂ–NVÉ"îX[E–m’öÓ'xoûYZC´¿öç=òËª¸gCŞù*Ïf`/Ì&ñV/ı£Ù¹|â§ƒN–Tå'ÓQ,Do['ª¤’š›%XËÂÂš¾…@³Ûpz\D.…°,39ë!ØÏ±}Íœì›$š ÍádAm#wÔæá2Œõ6óü+Ö.¥¡Èƒe;Ïë/b2o®_ˆ…bC;ÑÂ"]³ ‡‘À?ØÅ®}çè‹‚æ ga5w,-!Ín ©½OñöqÅÒr—»ºéöÛi¼k3Ë3o0µßºZKˆ+ò²|hš˜ïóh*TÏ¨Ce¸È­ª`I×^9ÙÅxCÃ†"ÎøÀEh¡c$JB³‘Y\Ék‘¥Gé=wˆÏ:¸k]•9®©Ëb
\ä­×Ï¶¸‘Ûêò1AÚO4³ÿL?ãQİí£nÉbV,ÌÅyƒAıÈØeo¡¥'@,Êî¤¬ªšÕe¤SL—òôşÊ×­&§÷(;NŒY8ÓrY³¶‘ª,Ó}f˜¾óçØ}¤›ş`ÍæaA]·×âÖJMp¶ù8sØP0Áá–^&ŒVm¹º\.„Bñïë#™Å™°lTTPSgÏ©A"±«_¨şq.»ˆ·¦‚ŒŒTfN¦V±q:Ï`k³ŸôÒ46â	^à7w²ûR4¹@q&Æ‡im=ÌS¯Ÿa2sKj
H‹^äÇ[Ñ~y0M“Ó;v°­3Dzy)ËªrpwóÃĞá%¿â›Qú/ç/¡ÓôPUWN}‘FÇîwyşèEºD“ß‰	÷¶ğâë{8Ôo£lq)õ•iŒŸ<È3ïæüDr¤)£µí;w¤Ë–MÃÂl£í<ıæaŞ}uï^²XTSLUúÌX5    IDATÉÑíûÙyæ<S%îãİŞdkG¬ÊR–Ueb:Ãw^8ÀÅñ0&f"Ê`Ooî=Â;gÇÉ®(¥¡ØIë)~úÆúM‡ÇMy]	•9.¼™y4Ö—ÓXSH®óÚ/Û–=—ˆz²)¯ğaÜäëxt¸‹·^ßÆË'†pÓT_BEfœ»wñüîzCW¦ÿBàåıƒ¤VTÒP–Bàâ)¾óz3şpÌƒİøÎË­ÓrXÒXÊ¢Lèò'ƒ”™ 04@_0LbæıáVŒáŞA±kOP)l)¹4ÔQ–j'{A>K+Yº(CƒHÿQ}§ +‹ú¦RJÒb4¿û?9=B4a&ñX€óçZxaÛaNM¸YX[NEjˆÃ²õ@q¤gÒT•C¦ÛFAe	KÊ¨.Î˜ç¾æ+ï*Ùù‹¹³x”ç~ò_ûçgùæŞ1V>p
œSå²Àî$E7ĞßG,²,“ø¨Ÿ±Ş1Ró2Ñuğx+Ï=ıov…H/)aEÃò“İö&ßİ{pB¡;ÒQ—»è!t¥^ºÀÑZÚ{¸›šY12Bwçe´hş~ôì>Z#.ª/¤®Ğàâ‘]üÛ¶"q3Ù± ûÔ1^>1DAÓZ>ÿ+iL¿~·,‹x,J$%8~™}‡OqÊªà¾E)8>²é÷Ê–Ã‚œR‡z¹hšXV‚ñşv^ùé{Ÿ´SQWNc±¾SùŞkÍŒaÃáË€Î6Î3i©+=N„.ãğˆ‰35›éçäŞ]ütWÑœ<Sbá­­»Ù{¶—ØuJìí`ë«ï°õÌÙ¥Å4Ö—RìppÇ.^Şw†¡øÔv4@×ùK´4ïdkk¼…,©Ì Ñ¾°—.xêó,Ì¥#üğåf†œ,®¯daF˜ãïíàÙ½I P*Ád`Œö“yñl‚[nçÑ{V°È+a\!„âãà£ùúkY¨”"jË{9²ç4ç–Ò˜áD·b^âĞP·¯É c¤kÎ—@On=’OQ†°XVîä›ß<FWç%Ö-('9©}6?q/ë\šIMaÑg¶qd ’¼tR”"¥¸†Ç7Õ’çÔPJQ“é"ôêaö¯¢<Å‰99Ê¡m'ÑªWò¹Í8“gÅÂ|óû™H¦<Tl€£'ÎpÆ¨â÷n$ÛY«-Ìà™Ns¾6ŸB_
0µ0ÎÜ-üÚŠ”f²(ÃÅ³¯îck´¯şÚjŠ<v¬`¡y©{œ••àó&¸täûÆ}Üÿ¹ûX®ŠååYüä•}¼ÓÑÄãK¦&1‡"˜ù…¬Û¼ŒŠTË¬§H{‘=ŞMKïJ¶¦RY]Eßù^º'‹Y¶¸‚§~unêã1œ2o²Ø·JŒÓÚzŠ÷zÓyìsë¨Êò&ï›6k©¯<Æw_<Å¹’²æ$;YL+æbÍÃ[¨õ)PÕ8vğÔ6úÙè3>×M°`!ëÖ¬fQŠÂªodSÂÂfhÄ?ĞÓ¡4ìŞBjLv¶£•”°tI%i–…Â"âÈ`İ=µ,-MIÎ¶¨ÍÅÙÁ»';‰Õ¦cŸê
‡)¿­û–•‘n·ˆ×•â
<Çî‹t.¯`QN15Ã97BÖ¢ZV.pc¨ë=^ËÂŒOÒ{é§ûL2Ó]ØãÂQ“X,F,aâ4,&B.á£Îáäfë®[‰(~ÿc6h`c‡°ëR÷.—#LóÖ£´«|>ûÈ,NMÎŠXÑÔ@ã¾wùáşƒì­)`½'ƒš"“ıC~Æ£à²%èlï#’—AêÄ{ãT—êúéú¸­Ğ	?GßifrÁb½o)Àbê3·ó¯;Npheë³’ç89ngıÒ*ÊÒqİ¬/2Éş×~B»Ë"‹1éÈâşÍ¤»mñu©.–E<2IÛ¾C\Î_ÌçîZN±Ë«%…;ùÆë­ìëiàîŒlJ#lïcyq..·"‘ˆpöd”Ùïlá@ó Uw?À=åi8t0kË)Üó/Ÿ`á‚|xg½› 2Â¹3‡Ù.áË,§<Ó,k}K[÷ñä¶V:‹òÈ,Ï ,‰0ùüögHŸZ°`UY&?zù /«å×çsp{Y+ÖñĞªJÒ5Ë¬¥Úû
ß>sš–Æš|Év:1æâ¾_¯¥0İƒ!ï	!„B|l|DëYX—Qîbç‰b¦E" ÷l+””“—™†6'[¶Š“ãŠ32:B_ÿıc^#A $0ãë¹½´ŠUÙvlºB)ƒ4—²|ƒ‘@‚x”¦Q^WG†ddx„¾şA&#Qt#Áà¸…ešÄBİœğ§ÓPQÂw2´kš‘¹˜¦"#9"¯ >4FßÅRs}ø‡G¹Ô;@Oïş	E†6ÁùÀ$“SE±ÛSXT•¦%Ï+'=…ÜTƒÂªrvt¥°9m¤¤19$‰ƒœlÃt§’¤§w€Ş~â	4›Æ…ALÓœ®£†â<Š3lÉóÕ5
K2qY	‚ÁäšRÉ»á“çõÿçOÚ °n|	€ÁÎ~òšê(JóaÓ’+Fkº“œ¬2Vçû9ÚÀÚE·‘_VÉâTmêìçøHwÇ	$¯/'‹x/mè b‚İ¦È¶—<¯dù§ş;ùì+™‹hZ`Ã?>Fÿà —‡b`é¨q?#WÚ¢eAVM…™d:Ji†›ª’B‘(ÁÓuÌÜ×˜ï`&èï<Ìß<OŞšÍüîãğ•Çà³Miœ|ã5~ÚÜÇDh’±ÁNâY…x}ÔM†*ccyöÙ×ù—§_å»¯¥+’ËC¯§)/[ø<ÍcTÕQŸ¦MŸŸ¦œ”5, Ïätë6‡¼ŠlFzÆ˜A¬s—MªWRí	3p¹—8“ô1‘SJ™İ†
urô’…×í¡©v:@Ğ¦£t^%ëÏ² ;“2÷-$jİf§nÕm|îu|öÜ¹ĞÅÑ·ßåÙƒİŒÇÌğãÍ"‰±4teKôr¸-F–Ë@ïO–§o›g4BoïFŠüEeÄ:»±°HÚ8Öç¤¬¼”|-@ÏP?,?ƒÉ:éõr{˜è!Ïz) èÑ}ÎÏâ¥eäfxÑ¯\'››´üÅ,³rvdÿÔ¨¼n³S±¸šLC›ºÂBÊs}Œ\è!’ˆhçØˆ‹4M#4,Ï¥¾A"'Ñ ŸËƒq®Ü=®äQé°KB!„ø˜ùè¾ŸYVz1Ë+³ù~ËI.,Ë"gâ2ûÏÔßM–ÛÂ?'x˜Ñ0=œh½@Ç°Ÿ`Â†“(=“&Å³máMKíjÿ¡k¸œ04I$ÀJøéîèá\G;gûÂ [8âQ:GMŸ9á'êòàIIeî„Í™«fGâ	B1‹Á¶c¼ÚcL÷Z(¤dSaØ 1µŸî!İ7£‡CÍPhvcÖ(µRˆÅ±LÇñ{xùíşC­
]K¡Ğ{õG–İ×éÄi]½³V¹ìØÌ“¡ ş¾.“Ï­£oR‘ë¾~ŒÆMa9™Æœ!\»¡‘š¢Hˆzr¡.wŠoV­:†g,`á £fŸæğ±ì9âcMS5µ•å”¥ÙgD—®=.pº£‹Ó]ƒ'À®cıc„Y³6ux<èvÇŒ ¥p¹l„£1Bá©¶nñeã±qîî ½v5ë‹ñabéi,Y³4Ï~ß¹ƒWCµØÎGY¸,›ÆÍln¤ğÀäÚt4ÃIzj:)Ó²0Ca&Qä¥g^Fñzñêç'&°ŒlR²JÉ8Ípp‚ÂĞeº£iÜ^…cØà•Aı£ƒ£d–5bØmXşX˜¡ö“üôòŒEÛĞğåe‘®…ä|‡×ƒn»µg¬+İFzA)UeÉÎ˜%u5,L}l?ÂÙºBVfØ?’& 2< èM'W)0'	£t·µèkŸ®w…†­0‹LGKyÈË,¡ÆØEóH˜™.üg:òårWy–5F4!aÛîƒ8f
ò]Øõk;¦ÅdÜI¶×œ™1ã’ÛÔè
ÆˆÆ¦¥9É˜õI°ã²há–…}2L(2Nó‰£\h½Z¥ŠÒñî.õ¤¦ t]şÆB!„øÄrÀ²”Ö—Pxòïµô³&x‚¡ìRîZ‰ıšûmãøG:xíõ£ØÖ²vU5^‡6Ê»Ïí&Àµùbş%CÜÄ…“üäÕv2V¬dó:7)^¾‰ó¼ôÎ‘©©è€ÒˆÇâD£QÀ1³k€¸Éô|M)4tÊ›Vqwy*Nmæk*n«_wo1­]Íç:†®“Q¼ˆ_½½}nµ{°Ú•Ìÿ¾"È2­RW•½ù2mç¨iÊÁv“7t…ËçÒ„™İÆÕ×ˆ',&'!½@C¿å¤áôæ±ô¶tÊª¸ØÓÃ¾ı{h¾â‹-!¹¶v‚PÄ$¥%¯¯e…˜ˆÌ¾Z7«,H$†8¸í=vÇŠ¸gÅRÒRÜxİ	ÎìÚËÛ—nõz©k®nØi`aZtdÕ¦¡Y$¦{Q/^Ê½ãüÓÛû©\¾‚GK²qİ4ƒfs“Ÿ_@‘=y_¶eY˜W®›Ã†‹``…söÊğá0aËÂãõ :©Şª3'97:‚66L"¿”R§A¼²kû('4ä9pÚÀ4t‡›šÆ•Ü[åÅœ³t½Íå½ZWê}}XL/Âfá 3Õ‹ÏŞCÀÂJÿğŸEJA`°‡³íƒäÔİN–a`%tt§›ú%Üµ8Ëœ½ƒáLIvşe§Q^æåÍ³ÜYæğ¹ …•k(óXÉ°¬4Tz÷ßÑ@–×>«Ø–n'ÕëÄ":û*…]‹2N$?kfì7-&Ãæ2°M½ŸL+ÎdxNÛ³ÂLF¢’BŠRD#%‹Õ«W±¬È9ûúh:.·kêÓOSòĞ7!„BˆO| -­‚MU­|ëÀAü¶Õ«JXàgÙ*3F`ô"gÍ¯¯aI‘,“ÈÀ%†&­©q·[7ĞÕ‹ß–É+kit)P&CgÎœŒNáÖS²Éœ<BwïeK+ğ)3ŞFÛiéK`M-âíHu‘eãÜåIRKÉpêsò^2L|ğE‘²)Î±s|`¿c95)jÎ#£¬äêÙïSpr2y?¿Ró?"Ii¸ó¸½¤‹—ö  mËÊ²qÌS›×IF‘—îæNeáKw%û+¬£ã—9Úë¢®Ñ×·Ús Lté¹Ådääáó=çè×“§+¼N‹Ş¡ ¡ ‰òiX–E¤§›ÖI“%7=xœ@(A<®Pº…ì¡¹×¢x]-«êP¨É‹4‡£D?ğ¬èşÉ©p¤æïˆÑT&…)aº¹.!ß1µ€º²0#“øƒqñQ ¡´[z,Ş•ğjÍ³‘r±0ı({ÚÏĞÕC¹gª£JÅém½L_ØÆÒòŒd?OŠ‹œ’4··áP´%‡aGK¯ XÛÁ‘–º#Ÿe6 æÉ§Äq†Q=£ŒeÍ%¿²ªùœÕ0ó6 ‚ôŒ3õ²Ö§Pïójª#êjJ‚ÀĞEöl?Â	UÊã5¹8X,ŸòÌıt£’CÍ¼¦<–#âÂBÜÛÛ8Ûªs*àeÓâl,<¤{3ÉŒt0 R¨ÎL™^ñ|záó9×ÉÜ;El¼ÜÒÃºÒl¼©äöf”àpÍtÖ§ûHÑ“OHÄCtvô).M~j
ÿÅË´÷È[V‚C70S
(233qgfãeîõK–nB!„øe
ä€rS¼´ŒüC‡Ê-çÎÊ\ì–…5÷[¶Ò±¹3È
bOó	¢Y>Níe\{ÿ<'ÃƒêgÿÎ#Xå)ÄGi?wó=9ı]é¸RJ¸siÿ¶o?ZtŒÚ|æx/gÚ†™°'¦ñm¡yhª©äô»GøÑ«C,­.$Ín	ŒĞô²¤v%™QINêÖÖrø©#üäåwXQ|fr$8NOOˆÒK©ñŞúñ-œ¤8=Î°ó´b›…£´–E)×&İNãæMLlİÉ‹/½Í©Òæ‘ïƒñqFƒ!<EµÜµ8‡êÚÅ,9ˆç^°´¾‚Bbr¸‡C'.ãX\O}i2ÌßJ¾MDÃtßÍñp:…i8ã~Z:Fˆf—QaWh6;iK1^:Åën“åéXã½œ<3Œç&«„Ùô4ƒÓ§;höÆ±nšJRÈuÆ8{º™í?Ùj’]9ÕÄ|¿­ŞÜNÜ8uø0ÇÈÃÀNeM	^kv44ŒTV­)äĞë'øq<@Se6™íéãÜ…ú£î}h—ç¹W'h,öbd³º<‡ñşG1•Æò;ê9õôqy%Îòª
<==?y‰ÔU·³67ş,ÃGVV1ƒ{h‰—²1×®)t›—šì8Û^¤qS%nwrÊ¸áÌçöù<¹õ0?NŒÓX–Eªİ$02Â%
6Õ’ù>A¬DŒá‹í´(ONp©»—–¶>Ò–o¦Êc[(ˆõÓÚiàµ'ë¦odœK½#ŒºóùÌMTd8’#ÔNË6,äÄËGy::ÁÊŠ,|àØ }#–ÜÙD±RX¦NNI.eé¼µg¬¡Ş§Oõ”ÓTŞÍ»¯¿Ã@]9uyn¬DŒ¡Ş!Œ¢
šÎiº;ƒšú&Zß<ÌÓ¯øYµx™.ñŞ.¤`ÉR§cLİš¢Li;ÀOƒÔ•¥’æÔñ³œsTò;Õ>İÀ›ZÄí«Zùá{{ùûY\ŠSO0>8Ì¨•Ã†µ‹H•¿ã„B!>Ù\iv|.úŒoÑ6_·5tÑ–¶ˆÚTãê½šºÇåH>\ÙÉÎ¯âá;ÆyõÀY^m×ñdä³ö¶F\Û2>½Ø—†ÍîÀ“ĞfŒÅ%¾aw’bÓĞ oíİÅË'Nòò9)¥ÜSW†JD™˜ºA\·û¨Z{O¸ğVó	:N¸S3Y~Ûz
÷½À~®Œ€äÔ¬à1ÃÎ«ûÎñö»=èØÜnÖ7áõØÍ°áq1ëQn(»Ã…[Ÿ9¹Y¡év|cú6xOf-=bgÛ{'Ø»û2†®£ÛläW,f¹aK†¥át9°és;3<nıÊèª‡ÚúE¬í;Èá=G8›ZÀ]eµWfoÏ½`x²JÙò+©”;É¶ƒÙÛİƒM‡xÌD÷ùh*Ò±ĞñäVóĞƒví9Îá=9„B9\T5®dcCYÓ3t.ÖÜóÔtœ.'†®Ğ4pÙMÚâÌIMW¤Õğ›ëëÈ²ë œ–7ñèí1^;xš×:t<¹…l¹s©o†©°j¡aØíx”~uHÒå£¨aëú²cÇ ®EËi¬¬àş›½y’íÛp¸ShZSÅRñş©úE¡4ËD×Ô¬§t;>§mêe-,ßB6¯d`W'¯oï¥¬n)U5×Ö°ÒíäÖlä÷]gygw+ÛßëFW n*/ã‹õEd8a8×ÅÛÛ³}ŸEÎ²lV”ÎÿşÒmvR\ÉóàXÃ—[Ï¿æcçÎ#ìÙu	Mr¦ÒtûÜ¶0ŸM]‰…ä¤§RíaÈWA‘c*üÚÒKóÈ>1Ê¢üRÉr)ÍAnõz¾d4óÚ®vŞìhÇĞ6w
‹—–à›ZLOÓ¼NíV†¶5—MãBóo„ib^–n¹›u‹
ğÙ’Ï!WJÃév`×µ,P¨aØ8†ºÙúnº²ˆÇ-ì©é,Y±–‹ŠÉtÓ×Vi6òË—óÄı.ŞÚÛÎ›ç;Ğ5‡ÛÃ¢†ed\]¹=%—Š¢ÎZÔ.]ˆKÍø;M[ÖãİwŒ÷š›ikV(]'5·ˆÕ)S‰
Ãá˜zŞ=XJ'µ¸–‡°±sßqöìêÃD¡»|Ô­\Çúº¤Ùµ©™
İî¥~ã*|­‡y}ë$ñ„FJi-_¾­ÒÔäjôÊîcáòüšıo9Ík§š¡áJÍdÅŠj<É«ˆaØñÚõë.D(„B!şı¨p4ş¡æ4ZfòH]×™™iÌDSi3~h™	&(]ŸZDÍÂ4MLóê‚Dº®°&–ÒĞu…E"ab¡¦şÿÊÁ,L3‰®+fÂÄœšª}eµiË4±4}Æy\ûšXQv?ó4‡u|áWWS0uË4“af°Ö´äŠê3Ê£úÕQ=ËLï<¯™˜[OSÛÎ¾•U»ZNË"0Qš6;0Z&ñ„5ûç–EÂLLİGª®¹ó\¹©òÍÔš,ãìãš3¦áÎ®ƒ©«M<nÂ¬2_9O4C»R_3¦ÕÎ,+×kV"š>uNWÛƒ1£È²Ìäõ¿Ôt5õúÓ‹niSSù-Ğ}jZo‚äág××|ízæù«©×¸ní^i×k;3~m=Ì¨„‰9ã|oğ‚3®ÿ<×qNû4¯ÔÑœòÎ·ÏõŞW¶›~Ü´Íf‚øÍÚÜŒúQÓ×}ş6œH˜×LW(Ô5môÖË3ë3Ì²Pº®®wmf¶ç©k¬®ßN±Ì©÷Óõ^[auíäo_¹ÌÊG?ÃÆL¦·UJC×´9Súç¾g®–ÿÊûÅ4MLKÍ³¯B!„ø÷öŒëØæÉ%š®_3õTi:³gå&;¦ÍİpÖFÉpyí+4İ˜ñjŞ×¼öàúÔˆíTgr´ÖEzS&™ÌXMZÓ04í†e7®-$úµ?œ¿œSÛ^wíc¥0ŒùÊ®a×n«ë·¾òÿÏŞ{7Ùu\	¿¼öyÿ^Y Pğ ‚^j©%ªÕfz&¢#º£gc÷ÃÌLÌ§Ùˆ˜ÖN«$RIQ„!<PŞ×óŞ_“ûÇ+ åQ !‘”ò?ğnİ“îœ“y2ófŠÃóÏarõÈÕ0$öşşâôÒã…ú «KqD¾ö¼§¬Ë#ôúDõµ+?Ç¥-N·#uúÈv:Aû¡sGÙñW¶ƒ#Uåd{Òúy±n¾|yóa'o›£üÖhòE?}¬|GØÌşçª¯S(
…B¡øãÈ¿KHÏ¥Y)R÷-ÂC¸tÛ]–w—¥`–¸4…-Õ1H
…B¡P(
…B¡Pù«Èİ!…‡ŸñÎ9d¢a‚ôÉ—›åï~ú:oNO|…™B¡Pü~•ëyjbP¡P(
…âO€¯ıùw
ß£×(³Yíâx£o‰5Ó$’H1–]õ¤P(ßh<Ş.±T˜"P}+
…B¡P¨€ü«È6RÛÔ
Å·ÍG)¿¤P(
…BñGñ§Wd©¶¥+
å£
…B¡P(ß8êğ]…B¡P(
…B¡P(T@®P(
…B¡P(
…
È
…B¡P(
…B¡P¨€\¡P(
…B¡P(
+
…B¡P(
…B¡P¹B¡P(
…B¡P(* ÿÖ ¥Äÿ½^$ñıã¯(åAİa¤øÃèûwAÕ^h;Ï•Õœ¸Bñı_ô]n÷o¢Ş~Oz¶§¬òÅıÄWŸ+¿z#åwÆg*
…Bä'Â÷}ÇÅı–ôn¢_çÁÛ|¸Ğ¤çı~Òğ+«üË¯îp·zx™}Ïãá§_ğó[t„øÃŠ|¡ãâxşáƒM)q—¡ëÿ',şˆŞ¨Ÿÿó¾Ñºtú}n~|“›K5ÄP×^~ÜâÆÇ7øçÛù£	İ'øŸŸ/Q‚—+‰ãxx{ÚAâ¹î¶òşhô^RİÜâ—¿ü-ÿã£'l÷œoePî‡|ùë/øÕƒ<½oƒ~JŸîæ?ûx•öËêÙ‹ŒqHåÎ]~ş`‹š¦¡7øå/oğÙÖğHïés…`ûñşßO–8ş+“YYYåg¿§Ùs^ef•<ÿê¯÷q}
…B¡øÆ0^Iß†Oiy…ïæ™úÑ›¼›a~£c.1
:‡Cz®” ¥C¯ç¡YÆ+JÆ÷èõ‡8¾¥yX›&SGü¡†ÉÒg°=Çÿø¼Jjv†½yŠ¨Ø›ö ×æóo²•<ÃoÎ2T«‘£¨Á¡;ô1‚Ö1AÃ Ó¦²±ÂgıÑŒ–ği÷üè'—9²¾‘m'RJı!Â•Às†ô‰´0¾v 4
jûC‰m›ºøZ¶iX&C{6±Ñ8h–…eh#;q:“Ï£ù.İ¾C¸Å'¿ksî½ë¼	Ñãş¸SHpx™‘×/Ír:ùİ_Öë<~´Iòòe~<À¯8¸|…iØ†öíÈŸ”HÏ¡;xş«—í;CºÒùUMÇ¶MLı[Ú6¯Ïuétx…=Šçìû•ÛªĞ°,tÕõ)
…â  ÷;¶54İes±ÃÕxó˜ˆ|´‚÷4ˆ}>(Ş³²·o+á¡ÏÄÁ~_ˆC†<w‹ûe‘ñëïóg§Ÿoe?.Í£óşLìaãÎgO4]çò÷ŞæòNÅhà`~ås‰ÏÅïÿ.}~`@èúÔê
õ	b)ıùßJ^k•¶ÀïOãˆºD²k@y’öá°r½ø}¹+S{uåy¹O¬+‡Ôãr<}.¢°Î¿Ş®qîo®sÕ6‡Ôï ÙàÖéŒMñ“¿:EFJV@{Gæa™ö–ù¨ú|úš<RvĞİõU~ş¸Ë÷ÿòu¦Æ³—¯·ÃuLŸja•¸üàıóL%ƒiÌÈP    IDAT
8Lgèp„·ÿì­‘lN½Êï¾X&ùÖ^¡?K[ìËïú.|:ùşı^]ô);!f÷çq<ŸÌì[ü‡+ºÆ±ò^h£â„6À‹mëe|ÏáşOàx>Oã‚iĞ´#·ö–@ˆCò¹KßFZzt¼Èg<uÒ†iríïìÈ‡¼x>'LûÈú~¹I—¯êWö<ß/#;ÉsSûÚıxûßß<d>©^Ç'ñEÇû×ƒíòuwŸ®öÿãeâ×±Ûƒu ‘é1şìGã{ìéEıÜ‹ıúÁg/;ÆP(
…
È_!iwº”†Ş¸cnun‚KqóĞ•B)‡·ô½ßa`„É¥ãDE›ÍR›®ã#…N$c2º-6ªmº®¡ŠÄ˜êTkmüH„äÎª¤çµÙ.&2dw÷:Ë&mgH¹¸Å‚"›J÷[¬ï’ŒÒ<râÁR+W©% –îó-ˆ¾K»Ş á¶ª†‚äd
Q­Ò7C¤ƒ>ÅºO*%ljÆ÷Ûlmïä72¤VkRnñÃ
15ÇÆ§ÛiSiA@¸´)°!&Çc˜Gôîº)ÀíR(×˜Ig1wF7`ãq™Ù=4´X+vèû„N$%—¡K‡Z©AK†»jC‰:ñDŒL<€&~‹ÕR‡ÁÎ»±x”L"„¾“f¿Zb³åà#°,C3L6ÀÔFõ°¹Ñ¢/aÎ$H†Mğ‡óúúHWº>˜ÁiF©Asà!t“x2K6¼3}Š…‡DE˜ÈE1¥¤ÛlRêJRúbÏÅ“;&—‹A£I±Ô¢í(¬å	…ÂŒM&‰ì©Õ+÷³>Ãº:FèéàJÚœ¹4ól°%=f¹L±?Zzf™±¦®á{•RO3ÑİuG"„Iz*EB­úŠÅQ}¡IeÈ*ÅF,M&<B;Íù¶Oz<±cÈ„G»^c½Ü¢;tX_Ï3G™šˆ£õû”Ê5:Şh`Œf™JèéÑk5¨8]úôºC<!„“œJôZUÖ
mºµÍ<ƒA’SÙÆÎ„p†T+MÑ(™°!%½J™¢k’–‚^«I¥'È¦Lå&#rÙØ®P:ò%ì¡Ãôxl'Îvh×ËÌ×†øìH†©¤¹+ ~¶x4]›Ù‹¸`nñO÷ú{gâĞs%¦%Ğ´ ç°A±ï3¬Õ(H‹l6J`çõ*…Nn<í9ÔJ*ÃÑÃ@4ËTÒ@à9åb™¦;zïY~…Ï°İ ĞöĞtèu}bãIÒ¢ÏV©CßÙL4%›¢*|ºİ&ùb@hÄÒYÆÂgĞ`}«Bs0d3_DCr*ÆÔ÷Ny6…j‹'B'’Ì1vi5ê{&ãé(![ƒ~“µÊ +–&av)Õ="´û=zD7d§’Ä ¹#7_mÑİ-7ÒÒ¨µè p§“œLà—kx(ã‰ A»Z¥ØêãJĞM›t&MÂ–Ğë’¯ö0¢íú€¡/ÑÍ ©dŠdğ©wÙŞlÒv|$3"“5k½ 1ì°]nÑúÈ§ıL:„”áôÈ—›´†£ôì`˜‰±(æNğÚ©Õ(6{8R`HğŸuè´Ù¬%‰!©•ª8ÂÂô{Ô†#ûOM¥Hê£İÂwiÕëZÎ¨/†	ºü`œÉ¤uhö½z••Æ Ÿ§>4N"l£É›ëM:Ş(è¶BÆRQ‚ºõÅù=İÆèwèø`ãL¤ušå¾‡Ğb‰,¹à(W[!´N›ÖĞC
X,Æxòğ~ÓsJÅ2-@#’J3Ññ;uÖë±D‚LÔ„a—|¥ÅĞJ3•Ô÷Ìm>‹®›u–Ê®Ã’Í$ˆš’a³I¾™èh÷ïÒi4¨y2É0AÃ¥œ¯Që»;º$“NuÛlWû˜Ù	]Ğ(Uèa”]Ê‰†Ar2EÒÔÑ éºÔËÊÿ¹§LFIº”%;öo…ÓL¥,t1 ¿Y£åê?‰‘K„°Õª¼B¡P(vÇmÿå¿ş·ÿşµâqg@amƒ+ÅåËãˆrÅN¹ Ú![e¥lqó7¸U ë¶m3\
+ËÜ­@À€~¯Î“Å:áX˜„1dãÉ"·+4a0¬°ZÔ¹Ìİ]¦Š‘‹Ğ‘8Î&¿úx?1Å©píí
­`†3!J§ÁVq€‰’[DŸÒÒ^¹+EóSÑ#‚q‡ÂÂ2_n7ñƒ¯ÎÂV‹JG’;=Í´Õgsş	¿xTEZ&¦fŒX¿q—'ƒ§ƒnÜÚ@K%HEL„”Ô×çøèQ‡Üé$¢³ÉÍÇ-\t4<Vç6hè6é¤M#¿ÁG_¬QèØ&x^‰›÷«Ø‰¹ğş9‰Û*3_…‰É,ıf—h2NÌÔ@J¼ò&7
.§Ï„è´t&'RÄ,¨.­2ï€á{´[5­4‰'£$‚.¿|Ì'‹M†‰m9TªÛ<ŞöÉ¥c„Mòâ2ó®Àò=š*×Ú$RQbƒ^1Ï—wW(„C„äj=Ï»›”ô8§Ó!,­ÁÜ“mbAŸZ±Æj©M$%¨w¹ı›Ü(ôÑMZ5/•©´ëlµÀÄ§´°ÂÒ0ÄäD[ôÉo­rcÑÅ2®ã°<¿‰
‘Œ©-¯ğ«;k´:`İn{óU‚É81Fƒ­µ†C !ª›D!ì]Á¬mğÉB—é7.0:|ˆïûl/,sw¥L?Âöû,-©w%ñtm8äŞoos{{ˆ¥k}Àü£¶µ g“A|gÀÂ£V«.Á€Ism›¼b"ØáÆç+t£“L'FÔÎê¿xPel6CHúl­å‰¹0”U¶Û>ñdˆ€a‘ˆ´òE–}Kàæ·¹µåIÅI.••9~~·@ÛÔ15¿µÉo×d²I‚~‡­r“RË'„HE,´§¹×aea;Ó©–èñøwwùpµK|l‚\pÀÚÂŸ¯›ÌŒÁÃß=fÉMp.#¨ëäë=ôHˆ°e“ˆ•·ó=4$ºaĞÛŞæÎúätœØ-Ï:±D‚ñ„ß®ğ¸à’`,¸³ÊØo0¿T¡â¸ôZuŠõÂµ÷›G»¼Ä/÷HeIš€²rçŸ.L†¨/¯òp»	Ñ*s­é ¤[.òh½‹iëxå"w×»X‰8I[ÒÙ\àg7¶éi:–aŒôöö¶I<èÑl6¨t¹\s_zÕm¾x²E¹¥²Gív·4ÀÄ‰Y}Š……z`8H8&±Ñµç»¼n›¥GË¬÷=4]Ã­nqgË'è¹}/Ï '…­GOøt]2=Gv·ùèÓ%¶š–)ğ¥ÏÊ£
ºE*ÁèìÈxèš†óTn,NB´Y|ô„êhACÂK_ÜcKF97¥]©pûÁ&¾¡#}öÚ&s‹t"B¨Qà³›ó<©÷ĞlC6æÖÉëÆ³A¬~“¥Õe>Ÿé8½>…B+“Åj”;?°HÇÃõ=N³Ì\E0y*GFtØ\ZæË¢m€3lòh¾J0&±hnm3ßê!åèÙƒÇ%ôh”±ˆM»ZåÎjº‰O¿RäQµˆÄ93™$\Üà—76áL´ôyøÛ[ÜØbkÂ²ødƒMis6B“â_<®Ğô-†ÏÖê÷ŸlPÔÒ\ğ9íMî?\eÉ3†lçkx sÀÂÒ27–¿Óak½@Ş‰Øz›[ŸÜçF¾fØˆNÇ‹%Êí[M0…Oy~…Åa‰É0^ûwæøİV‹cĞ=Úw;$b!“F¡ÈjÇàõ™$Bú¬Î­°XèZx¥"
=ÌhŒ˜×fùş2né‰ ­õU~ó¨A,•&Ñy¾Ù`4Á²’¯1è:h¶3°¹°N™Xws™_Î·9?Ä44„; ¿8ÇgyÉ±$NiOï—…-Ü^Ÿ|¡…‘Î’iåùÍÍ5úÓY²:<ùí-~»ÑÇšé²²°ÉêĞäl:„&}ÊË«Üß¨#ƒ6¢UááZß“Jª+kÜ^­¡‡ˆJ‘…V„É”Mmc‘ßÍµˆÇ,zÕ[A2#d¨Á§B¡P(^á
ù 7dc»ÇøÅ 1+À¹TûËyòWSLñÅœĞ4BÁ×_;MÌÔ×–¸W4¹öÖiN%Lä M¤rŸ/·ê¤¦‹Û=’o_àZ.„ğ³4šĞEì¬xíŞDşllwzÉ4—mç†ŒMÎğÚPŞâön¹^–FK<ß¾¼+À•Ò§ß/pw¥KêÚk¼}:€!ŒióTë=“ø¾™âÜéN%|×e[ÓĞĞˆ„ƒLF7X¯õ9]–Û„²×:<|R%–9Ç›ç’XšÏ´¨óó'[drqÂBàK˜™ÉrõtM¦Ğò÷˜_­0››|¶š·Í$‹ãT—)Ö»äÂQ4	ùÕ
ÖØ9ÎÄ·ÿ¹äíx„¨.4«?yÂz¥ÃxrgbEÓ¸reš‰¸ S±ùäóm¶ê’á(Á±iŞIDˆj‚~½ÌgŸ.°Yí’‹˜_Xe;r¿¾&¦IÍ ^y‰ÒN7W7¸Ÿğ—ß?M&"Ö
|öÅ"ó9Ş?%šN"áÍ+SDdíË‡|¾ç?üpšÓ	f²Ã¿ÜÙb³åœ¬ñp¾Ë…—9?Bó‡l8>[(‘I%š@—‚øùi^ŸÃ E¨ú¥­ÓoLqq"Áƒ¼äÔ¹i®ØæŞ=hh!&GYƒÄ­mñåR•ÔÕ«¼;ÆÆãtp‰½½5åµ°@ ¤bœ¹2C& 9åöùÙ|ül’D¿ÉÊÖÓ×/ğÆé0ƒñ$mİBƒº-º¶³ª¶“>R'–Êpn¼Â|½Ë¹sÓLLğ\H§¸–éÈiW˜/bfæéöä(gÆNsyÌB›°È¼ÄÃüs)Ë¹é6u—s3§˜N{°³Ã$Ò)äjgà!½2ËM“P`@½ÜG{´ZCR§‚˜öÈş5!cÌÊ‘ÏwHšàõ±(ºçÑ|İ"•›áúT9eĞút™Ç[SLÌèÚşI>Éáû’%ROpı­×FgI¸Í•U>®J~ôú$ã‘]«¦šN 3Å™ÅUj¥³gÂĞ©±Öœ{+ƒæ”x¸Ş!óÆ®Ğ‡Yäçw¸³TâB6K çÚµq’•ç™+œb6ºãb0c3\?@´Öøç©×®qmFÇè$Ö¾2xËÒ£ÚÖ4¼5E4 !§’t{—/—£œ{/Ç¹ŸÍB‡3§&¹8Ù³e]ˆ!•ê&ıo¾u†Éˆß‰Óüø>·£üÇ+\¬·¹³^#×îskKpı½SL'•ÂÈf§²¼v.eÀT¼Ã¿ßØ`5‘d¼{¸ÜGQNŸm…÷­—Îœ"ÖqV4!bĞbuaƒÁäïÍÔ$¤äŸo®³‘“Öš&!<Éëç²D4—B¨ÅG+EÊSIbå7ç=Şyë³¹x.İî !Z¬,¬3˜œÜ'wƒTŒä„uÄ§Í‚V¥Ê½mËoœf6mÓ%^½Ç­õ
É±0f<Íkã6QË@:=ôüm7êœO	6—V(„²üäâ)Kà¶¢è7æx²¿_zö?A áô•3ä‚’ÓrÀÏæólŸM3î:ÌÏçñã³üğµ	B¦¤•Öù¸ÕÁ=´;­óèñ±Küôõ4	Û§;ÕÇÓLªksÜ\üè½YN¥Ïe{a‘_-®s>}`|ôYU<šæú•i¢¢~çŸmüõ§9“4h%»üËí-6ªYM"ı$¯]˜f*ªáõ£Ø¥yîæë$Ò¡][½}•-—‡\yïç£ôÂ4?yÂıµ4g^ÏpéJ›_<.±¼àP[k2qáçÇŒƒ«ã Ä83Í•é:.ÅĞæ¶(¦cä4.ö~B&ÄÓ:°µV¢œäõ“èøtÛ=Jd÷ùxA B`GCœºr†‰àŒæò¿æÙ<ŸbBVx°Ú$qí5Şœ¢;9´/îğåR‘s‰4›«Ûh¹¼si­›fjh0º<\¬ 2—¹v1×ĞJlSmZW(
Å+È]:N‰²™àDİ—fâ$–6XØLÎqÔ™ĞˆÅFÛÍ¤Rkw¨Ö|q³Ã—º ß§ßt0ã.ıXŠtÚâşİ|8q.%HÆ²Õ=y6wÆërgeDJ %²x°O®è¶Xš_ánÍAİNğıw¦Ğkº±(oL0|‰Ä"`k=ñT˜m´P”ñ‰kÛMúÓqìA‰M'Ä…ËI¼^ƒJ©I¡>G~Ó]ó2èÑ÷Bô†Fbãdc†ø~€¸-pœ!îaÒï”ÙŒ…HNÚÜÛê0“Šëmğ°arú0fKîùÛP<Ìê½û|Xsğ\—ZÇçœ”;k	Bñ4™°@J¡ˆè.ßÃB±Ë_ŞãWÏq¨u}® ñ[-
mƒ3ß ¥À6C$#å¤ËÛmêŸßüîæh¨ê9ÔšCÒCşhËv0&jŒ¶öÚ!ƒD2K*h"„³ÑİÃ´õZ“Êƒ<Ó@ú8İ.ƒp”¡QfO^3I4{	á‘;×áª»¾KO£g•*`’ïO†°|‰Ft<Ët´B±WBt“\<BÊÖğ%Ä&ºß¥L˜AÎÇ=>»óÇ˜åòXœgÈËéûN<+‹¦0amù1¿Úê!µ!¥®Ë„û4¨Da’aİ—ø¡ !j=°y~ƒÓÁog%1;H _¢æäˆÖÛ")~oñ U£ÖÒ¨u-ÎÅ,Úpw6Gòvåóé÷¬¡HìXÍ—2	Ø’R‹—?+Ê’ÉGm)%ıAãö
Ë¥ ©hòÙ§ °­0ÓÇMAêÔôïÆüRµz“üİ¬>e£ÓèÓ‹ö Ó2¨­Íó?W;øšC¥1$‘yî‚a›XÔFHÈq*¶Í—OîòQkš¿–%f2¹ãµ)t,Æg&ˆÚß—Œpu<ÂR¾NKfGŸŒÈ§õ¸¯r‡n½ÉVÉ¡ûyKı]³ç“öğõ8§OçØúrÖ¤^ƒÙ„”#«7‚QÆ’,cô^$•&.–iæÄd‹­Òğ \§‘R#™	4ôƒ[İ.­V‹µú€Ÿol !ñÜ!u×Äz¤ÅäL”€>šn²b6ô}œá€J³ƒ‘œf<^×	ÅÂhµ"ÍV›µúÊ>¹sô‡F§C¥VåÖí{Ü7F}Ğ°5DN|C,¢¾°Èo·ô<I§áJÜ^fËçô¥8sôÕ¼“‹<>*Aİ ’	Œì?j›˜~Ÿ&>i¯E©dâ|–9º#”ˆ35ª‡™z£A¾osî{	b–Ä—‚@0ˆVk]BÙ‹ŒÅí‘~èÙL‚Së›Ôİ!#õÔÃDÍÑgvhô	P*´ã_ã6ºÛ§ßl@j¤Ç¤ƒ#ªëarY“¹æ€Öî¯E|‰W®°^íÑùâ÷GQ5æ 3ä …F$=ÆÕä>»U%~f–?ajGœ=ˆr!fô5†A8‘%æ/1è÷u„ƒÙt„{O6ù—Ï»\ÿŞ9¦báCÏŸAÓIÄ¢ä‚:¾„ˆmbK—–/ÉÖk¬5ÚlİÈÆãÑ«İfŸn¸‡¦	&§ÂÜŸ[æCÍçÚùqÒÑ‘üK¹ Ö–ø¥ÑåÚÕiÒ–t*
…âäŞÀ¡ø8ÏfÚŸ7ùBŒ‚ôvoˆ±´JãÔY‡|H.Ähås4ö–øÒ'<v–?¿š$b‰]ı£©iD¯_å¬[à“Oø6“³—ùóñ5Áİ‡\½Ä`]êa.¿y•sÏäjLÎ^ä‡çÃL_¹Ä˜¿s´‹Øš åH„®¡é{ŸıC;MƒÃµ–B'—“X-Pæp6ëô#)Ît]‰$xëò9f³6»N¹Á´ Ò­*"^î¬v©ÙLeÒ¬kt{q¼­*Nz’ó¶ ÙzÍ->¾½IAKñß›Bö:<¼5Çç*š¦:”¥¾Å‡·7©šşöıI¼v“{·Gùtå(€7÷’vĞ=©ÉY~z-¹çÍ00´Öª~¶Â¤iÏşóôp*øR¢GÇxÿú)R»¶òMÃ²$E	hâ«)½¢6ê”+>çÆ8-Ú4]ŞŒR×Ñ5»–•5!Ğ 	´@„sï¿M6_àÎ£‡üß·‚\ÿñ.˜uîi {úí_~~—Büï¼}´]à×­îÑ§Cw—œ°nB± éà€åò~©Kbú
‰ìŞ½2÷Œ ;EÄ"8ÙÌ‚bdk¯h1éé¡Mz @Hx´=÷ hÓ$2Ç}Ò£QïÒ®öÉœ9GPÓ¸Édyû{gß3ˆ×î€[ŸİfÅÊòæ›×˜Uøü³E|ŞNFt‹Kï]çô ÎOø¿67¸ta–·Î&÷Mäùø4Mß“WS}~âó‚{+¥Dº:“'x÷lvÏyš®l3 †nŞ'g™»œ–£Ã¨v+„¯¡‰ÑµŠÒÓ˜¼xú¹ÒktYù÷ÃÃA®_åB*üÜ…À0MdetF‡nìoÁQåK‰¦µSÊ¹g¹
í•kÇî&ñ¥G({†ï_Íßµ+\è:v·ÊİûËÜi„øÛw/4$ë·î2·xJ)°t±ûü¹Ø¥Øcÿ»mMâá£¡iÚ®6—GËó$mŸİÑ	úŞJD£Õäãn0Øãëå~?0êãvŸ½(:²§éÜ8¼sjÍ?a™„Óş£&¾abí8‡°ï0ô‘ÿİ]/’Cúf©<s¿›t)Ü¿ÏGÿşÉÜ8ï½u†œ8º]ä~.„SiŞúşy&ÄŞÅÓÒÉ\xÿœk²ôd‰ŸıÛ*§._ágbÄ_»Êé±zÿ!ÿß?osæÊYŞ9“!¬vS(
Å^íkqa¥¦Í»o¿ÅÿşWïğ÷?}›¿ÿ‹÷ù?®gİ*+ÿz›¨Âm—G³û‹`ÀÄ644¡¡ù>>:v`ŠŸüøMŞ‹zäË:º@Ã¥:tp|F[äò:ò˜AĞîÜÛ/×%_®ÒÖtLË"°	,‚¶‰&ÂĞèÕ:”¾xõïä§¦jé0é¤ÏZ¾ÌƒÂìø† ÛĞˆŠugtıS0`°u4¡a~Í;´´T’É¤dn{…Ï¶t.¾Ä{J‹bÇà½wOYØ†8Q '´ËMJ]›÷Ş9E88z÷ùèÏÀ=V†<½–Öé¶vfIGLÍ:İÕwÀÀĞ5Líå®’Â¶=lS÷%–=ªGÛm>ÑM]Úè”]ß?\ßE*Ã©¤`m~ƒŞÀİ5˜–8CGJH„0ºMÖÊîHO¸•*…® •ÙhrÊC#>=Í?¾ÀÙH•%ßÓĞ}‡n·9:0Êó¨u†ü£Š2ª?og–`èØ&¸túÓ	S{™ë§ñlûº‰DH§‚ôj›Ì×-ÎÌÚXö89­Ífi@|"@0,¼ÅN`òû¸Ês8Ïö08”˜ec(‹N2’b&Ø£¹¾J¾g2›³Ğ–¡wú4k:àné]×pı<k›3§Ïr6eaéúñÕwñ¤N$œåƒ]çG1—•V›ÚÀ'JÂP«qŸFP®Ã|©‹{Q}™VÒ¤]ppsÇ·ZXš@Óu…å*Ûn–Ÿ\LP["?pŸ{ßcàø£kÁ¤Ï _¤*dO%°í‚{ˆ\íøY	M¶ËvÍG3Ìgbhí…† Ò«mÑíŸ¿;tqí§r½—’+1‰XaüNÏ—ú §Õ§XñxãÍi‰ÁİNY×1Ä€åBŸ3*·ë:[Ã¯¤ÎšĞN‡z½Š7êhp‡MêÃ#="fôX[0ôF¥ñ\Ç³I„mZ•Mz;m*|ŸJ«GŞ3HÆW¾íËuv|àôä‹édˆD=§ìk	¿Û£Ö7îØŒ©	tsÔ¿´kVàÚk3ÄJ¬×Û¸Gî>òèw®‘“íî#A8M$º	ø®C·>`¸3Å1ôÁ
ØÌ¼sÿô^œöv‹Jù%ÜõİF·O­ºÛş5tcT‹f*Íkß¿ÊÎ(mÖq\Ç„â1^û³7øà²I~µG§£
…B¡xE¹ô}Ú›šv„\6Œ®iºaè˜3Óœ·¶¶j[-ŞõÍ§²Éç-~ı¸N¾Ü¤\®²º¸ÂbÅA¯¸so›ÕB‹Z³C×7HÅmD$@êTˆú\‰ÍÍÅj[«­ÑIß;ƒ´İ1¥Fœñ GµR Ò0,¸s/?’ÛèĞÙ‘«6˜Ôt¹Y.‡,m,±\kQ®mğE±ÅÀ{¾DØvŞç':K¤ˆ1›ãln²é%¸63ºäÉ
˜š
²¾˜ge£F¹Ö¤PYá‹'µgƒØı²|Áõ)rçÚ‰Íx:Œ»Q¡›ãŒ®?Û­÷ô_8%©»l7[”Ê56×VyÒòw®€Ù-k_ú"±qmÈÖÎ»kkÌµüQûFÇ¹<“Å]{Ä½jƒr­Âby›'-ï™â%¦2Œi~w§@¹Ö¢R+ğåÂ&õ¶óôR¼=uº?ÏW$ÁD”™Ü½Ÿg»X§\«±^XåájûÙÕ3 ö     IDAT¶[ïjb’—üj‹J£ËàÀÀ,ÂïŸaš¿ø|õZ“r­I¥^âæÍ%Vû.ZöW’°øh¹Z‹J­Ä­…:"9Á›Ùº—‡O(€¤Ó.sëÎ2›Õf¡"Ô0õçÆ-
ùæjMÊ+k¬t½çqÎó­ê’H,DT²QoQiz”´5 ^­P©5yò L¾íîù\ªE£-é!;BTëP©Ö©´†{¿!$&QÈ¨†ÌhS×‰‡ÍR‡iavm¯Ú˜$C…F“B­ËĞm½–‡rÛşß²+(ùu>»Wb«Ô¤\ª²=·H#1F&;|ì	Ëš,¯•©E“¤,Óœd6æ±º¾ÈR­E¹ÖdåşUMÄy4jeªµ&ó+lT{V!åó{ç ±Å§_n’/7©6»t0ˆE,Œ}m`šÏ'ilmrs¾L¥Ş¢ôdEB\>?şÌ†òRØÄ£“äœÛlÕš”Êuï-³Ñôiomrg®JêL†é·¦9k·øìËâ³­Ç~¯ÊÍù"+Û-JÕŸ=j’˜È0L’æÈ]ï<]TßçåsÅ—Á0cSIú++,«kM¶óU<Ù¢ùÌNå‘>ml*ÍÅp‹»½M¾Ü ¿]æñÃu
Z”ñCånÓ<â~ö§º˜JD¹îòÉ“ÚHW*uÖ—–™+	†‚¤‚:åV›RµAau‰{Ugôn,ÊÄÙŞÚ*‹…
ÅjÂÚ2OZŞ›Ú­»‡é÷(+É;3A67
Ü_kR©5yt·FmèÚÊBdyãLŠÁê=~·Ö¤R¯ñha•R‡ñ™³f•¹½M±Ú¤´•gm£DtvŠX8p¤öÈ}·çˆáSZ\ä^©J±Rcse‘Ç^Œ™tŒÀ‘J)‘šÀÌ3eöXœ_asÇfŞYesèâ4<ùò	ÍdosvBpï^RÃ=Ü?öêüún|©Áv¾Îƒ{MÒ³qR	g“LºÜzÔ¤X©±VÙàNÍA„èñøŞs…*åF‡F×#4ê“Üã7é¾G;Œ	Î%a}m…Z‹J­ÅÊƒ%æ+Ã¡Ëã[yTkQitè8:Éˆ…F‹Û_<a©Ò ÒèĞêÄÂö×dW(
Å_ù”uéKÊ•‘l†3cÁ=³í“°æ2Ôu"™¡½/â8’h2Aöé‡“¡“1›a·Æv¥I±ŞÅÅ™9“ àz´;u6«Êõ^bŒ·¯Œ’&q+€M—ÍZ‹jÓ#waœœi“N'H|†cq²QS³HÛ¥V‹j_	†À­±QÉõŸÊ=ª¢L“T&¨×Ø.7)Õ4fÎ¥IØA2™IKâú>F0J.ÀÒ®&¸ãqÆËx>ÄrãÌ&íÑ6mİ"Óúl–k-ê-ƒé³“$mğ\aÈ¥#vzsßuÑ#Qr»·f>[Lpñô ÙtŒ¨	fÔ@`ÏÍñ}Dpt-L,JDw¨ê=\#Îù‰0ÑxœTØÄú#QÆwò+}A$#‘M×”u
>¾çìx˜X"N"lO§Iˆ¥BB­‡nˆ\zz’Ùlˆ@$Æ©„F£Şd»Ú¤XJåO…14Ç‘Dqr±Ñ7#±1Æ£ÏS=<Ï"‹È&‚N‡J“b­M×qjfŒˆ	ë¢™6ã™(ÆÎJçúh‘ÙXËÒ<ÚÕ®G$; šfj*ƒİ­²ZlRªµ(V{èÉ—Ó!,S'™Kcwkl›«]D|‚¼6†mjH	ïIÄIEG‡L	×ehÚdr1ÂÒ¥Qmì 2$:~·gX¦ #šmJ•&/È…\ŒD<L.# vÉØÈ%<¥&õ¾`b<M6è‘¯4(TšˆtšÉHt:I6¾ç£Âäá+y$ÎP‰'ÈÅLlS4<¶+-jÍx"°ë4ï‘Õ[ ŒML33Ğ50m;”àÌx’˜¥!‘¸$’É¶nkôËMJM—D&B@úø0céÁ `8„p,ÉXL?üĞ'1Ò{WIÇ‰Y£…çÒlWGºÕèÒdxóÊi&£GİCnâu,®59{í4“QĞƒT&‰Ö¬±]µ{;àútË°IE$åjƒíJ?c<%L‹iHÏ3D6%lJğ<:&›•&Åf™ÎñÆù1â.RÖDâŒ…œQ»U›”½ WŞ>ÏùÈhrÇ÷GÛÚ“©‘ÀÁ1ìPˆTÜ¦Wª’¯´(7:ø‰,W3:ÍJ•vb‚×Æ“DŒ cAAgĞÇ³ã„i²VL%Lú­Ûµ!ÁÌï]›$Øá0©˜M¯üTn?‘åõñàèsObGâäb†6
u\×#”ˆ“‰†ˆ%£ÄM—b±A±Ú¢ÚuHO21F»„A<'nêhH|ÏC$›Š„OÚø½›•&åö€P:Å©L„ä>¹µ®Cj|‚éÈÁ©Vé¹xFl*F$b,ÄïÕØª4)Ö;¬8³³Iv`@£Sª‘¯¶iÈ—¦B„"1²‰ÉD„„åQ.5(Ö:ô´8×NG±Ârñ–ç2ĞRÙ81]Ãs=Â‰8é˜R€ë0Ô-2¹8QÃ O¦ÃFµN±ÖÂÈ¨7p¢Y.8e]L¥ÉéƒÑd@µÃPs*—$‹1•4é·wüIkHèÔ4×Ï¦‰h£ig67bd›–e,icîøW×3Ig$ô.›[uôñV›bµE“0—ÏÏpaÌÆGà9z Äd&‚eÉeƒvì¢Tk!c\JÕ"kZœK§¦X$-áuhˆ$¹è.ßuáçÃ}ÖÊJÍ>Ñ©I®íØŒ´Ã¤,A¯W'_í0ôCœ=—$“Mƒ.ùbƒbµMkââÅYÎ$Ïe(Ù8qCÃs\Bñ8¹¸rtÉ@³Hçâ$,“T6‰ÙÙ±Ö¤eÅyc:Š¡A¿İ ¿ãï½`–w/e	ÛĞouvş¾‹kfyãÂé°Ú®®P(Š}½yè~åŞA³šñôÙawşíï¬`ˆ=*òÙßöûaÏvÏêHgçû°çëGË=®ÌÒÛ)ãaõqXY-ÿ>Ù{Vow~?(÷ˆ<?•³«î¦9Ú>}T[ûä½è]ñtI^¼V•Û7Ğš¾Èû³I‚ÚŞvaßªøş´*Çó²î?yÿøzÜÿÛ²³A²âæ¡—‡=Û¯—ÏÛkoşå!õ~¼şí­+±K·k§£uì ¼ıå9Ö¶ÅóOE$Çµ)ÏÒ—'ÒßCS?xÏø>¿òâvuÉ¯.óë9ÁïŸ!3mwÿy!vù–Ãëö(}‘ï9Ò/ì®›ãvÌá[ŸÊİ_‰K¥°Æ‡·º¼ıŞEÎfŸŸNîb;Gùìù½åzöì°ûâ·ó£ú‹Ãlèh?yP&û|Ç~û9Ş>}¾7ïÇÛÿN;ìò™²³Í¿~´Œ~á:?=|I9^×Nì_:e¾¸1Oiüu~z>öì9yˆ-Ë]‡%î÷Çş¨cØçÄá;+v×ÇØÌ¡öwĞï§g/l—cìÿ¤¿¿hg›B¡P(ş4ùZ‡º7ˆ|égOO[>âïå1²äIÓÙ9io×üòe–/Q®“şv¬lù¢m…_åï÷oÿêå:îİâÊíÄ8³	mØ§´²Á‚“à½T”€şld…Â´_TÙ^\½ìÿí¤¦~2ğ’z)O’ÿ—”+_¦l'Ğ™“ÔÍ‹mîè6•_UßÔ…ãıÊaš×ë’ßª‘:K$lxó8õO\·òDÛï_F×^ àĞ:8 ÷0ÿøt²<¹Ü“ú½£ËuXz'·ó=/Ó./Ğ£ãÓ<èkÌ‡ëĞÈ—i…3œN[@“¹'›´8;ø
:òbr2ÿºkÒtG'|y’v?"ıCuíÅítœÿò¿bİœÌ//ëeW(
…â•ä
Å‹Ù(óÅ|‘G¶†ğún€—f™‡À¬P|#øÂ*?¨C:Ë›ç’õ?eİ¿¯@ñAzô>¾¿E"b€ìSìEøëwgÈ¿ÙöØµp¬P(
…âUº¾Î–u…â…qÎpHÏ}~ ‘ĞtlËÄPÛ(¾]‘¾ãĞs|4ÓÀ6ş”UÔ÷\CÓ21tıáÔPâ¹}g×!nšNØ6¿ù@Xz.¾n055]£P(
…
È
…B¡P(
…B¡øî¢Ö)
…B¡P(
…B¡P¹B¡P(
…B¡P(* W(
…B¡P(
…B¡r…B¡P(
…B¡P(T@®P(
…B¡P(
…âk ÿ—ÿúßşûw6÷½:ïÏñéÃJ~š©„ömº‹Å÷é->á_çêiÖw N]‡ÚãG|¸> –H5¿%ù’_‚Üõ!^ÉÕ;¢UçáÇ<„ÈÅlLáÑİ^â_·ÄBÕ#2tY|<Ç’c,jò2·@	1`ùÑ<7·`:B?  é_)å³çšÓccş	Ÿ®	Ò‰Aó[¤;í7¾\à‹¹mêZ©¸öÂ«š¤/÷´é¨˜ß²•Ó=Ä®²I|ÿoÇ¿ÿ*õ÷hİó¨6øíƒ‘x„°ı§6ÿ*éw+|öÙ"m-ÈXÂ>¦®†¬Î-pcÍg2À+/ó‹/‹¸Á,ÙÈQï¸TòüúvX"J8`¼ÊÖCt«|ùåµãL'MtíeÚ¾ÏÂı9nç5Ng‚h'è…pÈ¯­òëûré(Kß÷\P^Yå7OjLd£˜/º»Òs¨­Íóáã.¡h‚xà÷İÜ>ıÂŞ¯¢'Ò$-
…B¡øNğ5Gßõğ„†¡ÿaï%ôXŞ\áq7ÇßÍ‘ŒèßøİÖÒ÷ñ<¡ëÏ/éià;s¹œİÇÜºx_'Ï¾ëù`è_3Àòİ>¥ê:Ÿßª1Ø#z®Åq•+ã¥õNz¦©#àû8ı!=wºÎß«‘¸ğ&ïÖ1ëeV{CúŞNÄør¹§ßíRé»ÈQ¶wĞİÊóñ­U6œ8ùÁEr¦vàıÅ›w¸Y+ï½Éõˆëé<üo‘N	Z<\\eCÌò“÷c„x.º¡º§×lróó»¬º&¶!øÈà8÷ş)‚û‚oÒœÂÿt³Dß0°4p†gŞ>Ç›ãI‚Â§ß_çWŸ´8}õWÇw&O+/Íõ9ş×İ:Ò20µòl^ûñe.ØÖïío‰;Piø¸ŞŸæí–RúôzC†®¿c{òH;ôº”Û‘‘z.ƒã½ æÜù;ÿ÷aŒÒc8ĞsäË»|zß}©w=×¡Ó“øòğ·ÜAŸrÃß™€:ÉøÀ¡=ØéK«ş¯¨ßçáËçãØ§Üô9í£P(
ÅŸH@î)ß¹Ï§VŞ<MÊ—üÁ†}—~mˆ1	†L,ıp
Á°Váó[«¤®_æÊX]Ó]¾Æÿv	„ö¬›¯ƒi‘zãMşâ+æY´jOnnş³×y3üÊŠæw;Ìİ¾Ï#;Ë»şS¡ÑÈnãÑ<õH^6Ş¯>¼Ï¿—üõ_\$%@Æ“¼ñçïqM4!qò]ÎdÂÄ6A¦³|ïƒ,Rˆ—Ü!öà‡ĞcĞ÷ªÌrÓö÷ıa¥j‡vÏÂñAZaf®¾Åéöù¶„ã¢;¤Ót±s&€‰‰KãÁ=şmàƒïŸ%wˆo¾OÏ3yãõË\=Ã÷KüöÃEşéÁ?üp†oÍæßÃA®½{«)Aum•o-±ñ£×9³Ò¥×sq¤ëB8Å÷Ş½ÄldTõù9>ùõ-–Ç.ğ7×3Xêã¡ß‹^ÃYşê¯³!v&ÄNòšF`â"?¾ãåQÁ¾Avr–˜ ñÊ·fId8Ã{?È|¿óU'/L&g/òg8ÑŠúÑ-Rç®ògwú¿Wì®„è²4ÿ„ûõşò­1ë÷+•(
…â8 —RÒ®7)u†tŠÅZ4DDsi´†h–Æ°ç¢Äc&ÃV—vÏE"ĞtƒX*B ÀuhµûHKcØwq=¡„ÂQb6 |º­.­¾ƒ/B×	…BhÍ&µ®KßmS*Ûh¹ÈÿÏŞ{7Ùql	~¿,_u}ßÛŞÃ AhŸy³;£ˆĞJ±±ú2’BŸG!)v¥ÙÑîÎÎèÍğ‘$ßhï»¯7å«RÜ†o‚|ó†oê÷Ğ÷ŞÊ“'OÊ“æ$yEúÔ½øè…¬Q,98º
R´#‰®JÜ
ÅJà1HT,0ˆ%BÕ)ä-”È§ëE¤t+O5?T•H#z}~ E3¨TlDĞlõè´:ì©P+;h¾K+V(”L†Û;m/L†ºĞ4ò…9M"“NÏGZ:É  J%¨y'GÁR[¤qL·ç¡k*IáÆ)(*N¡8œ$1nß#Ç	±Ô¨Œä0‘„ı>MÿhùGÑ(—sXª2%îè
bŞBDìÓèú„‰¡`;åœ”Ãm±½ö€A”ÿ¯XºNÚîÓ"¢f‡ı(¦2’ÇLBÚm—èh»®™+P²Ôg6eDóÎ¾MGùÍ•Œò(À»p†¹û_K½½hø©fÉ©(H¢AŸnª’âECHêı Ï‡ƒÃÒ¶(Û*nß'ul¬Ğ£Ñö	ãˆv«Mİ°(š
n?@
šŠ¯Û¥#0ÕÌQÉG;4$‰ïÒè‡¤R )~ôâQ¡aJ6–wğf±(—ê4Í•#›i‚çºx˜£2eL»Õ®àŠáPÎk„5
QÉå¬„şƒ¾BÑÈô£íâQ@«ïáÇ„@3ljE!$¾ëÑG«]
V®DÅ†$éµûtü¯ßc¿5¤Ñq#—Ãƒ6zÎ¡`ë¨ÇMŠ(Š@ˆ1Ş[<ä¿Ûa-‚3JL¿? w¤g¡T*9RB×¥—hòÖ0˜õ\ê^‚YÖ%Bzƒ3gcé*Q¿GÓOR"4“b>‡£KdäÓì‡(ú‘¿2MŠEã˜¹¡((Š`´b3jJZ2ååâŠ¢ MÌœ9Ë_Úwù¿®¯scºÂÛã*Ä‹¥t?Z2}Ÿ®+ÉçmL}hÿiêÓnGè¹E+aĞwé¹GşU3©8ÏœĞº]ZÁı¾¯S.:Øº‚”’A·G€NND4ƒÁQ?µï÷SIy´ÛÉ¾#MC:ŸTQ‘QHªç)í\IÌ ? W¬…n2Z4ICš®y>±Íd´l¡Í¸É8¢×àÙ¦a—É‰£à,Ås]ºıhØ&BÁ)Èi1İn€nçÈÛ*‰; å†Ä©EÅ¶s”õ©`8=š.85zÄîG¶ âäò˜xô<(äméÓìG(¶FÜˆ¡™”6¦ö°İšMŸXJPtlU¡R)ÚOgI"z=ŸÔÌQ²ÒÁ€V†.ñÜ)ºU ’{¶w#IA
Ç¦˜7Ñä#}Æ|‰i›˜JŠJM¤©G³åU\hMªu{t£a{–F¥è¹%C{.İH%_p0#æ Âp¼~D"%ŠfRÈç°õ#yÔ»q*ªŠ®¨H”a?×©d’àz4º!·ÇA]%*Ç‚ßp$B è6µ‚ñ`’!‰cº~
B(Xù%ëŸv‡_FFFFFÆ§)íÃÛƒOí³¹YG=1‰ïñÛßm!FËŒØ6•Úº««t]•îv™¼|–·&J˜½67¿Xb'oSqôTÒİk¡.^à—Jˆn›o®mj&º¦0h¨œ;ÏT·Íş Æõ;lìŒÑ©³rw“%µÄ¤†K~¼ÊÙ³SÔ„Ä½w›ÿ°–pz¶€¦åX4Mwîğ{*g*ºÒjzXã#XIJœJÔnu}Š¿|wª-Ú–6÷éJ]líÆ¼şÎ)˜½Ã0"¬·P#ÈåM´å»ü¿­¿ùõkÌD>õÖ¿¿Ş§P°ĞIÔî#gOóö\…rØä›/–9(©˜&NÓoôPgOñáÙö» ×å«O¾%¶KŒ•u<Ee°W'š9Åû§Ç¨FÖ®Şä»È`º–CÓ‹ØE›¨¾Çİ{»lêEÆlh¨ÌOpöÔ8#ILûÖmş^å/ŞYd4pÙY]áËC•Š##?.ğş³T’Ãƒ}¾øæ€|5’&ø°ÆféõèÄş~“^„R4‰ÖW¹¾îS©åğëmÒùsü|1ùŒİÉ©×àë½ñ3“GÁø1v˜¤´·¶¹¹Ñ *æ1½»ñ(o½6ËB)¡wçÿq[rjº€¦;”„z/$S¶vê$#UŠiÂíÏî1xó“›?8Ü¯³cUq,Ÿo>ÛÀøàu®”Âı}®ßÙfP*b‡}‡“§9;¡£x-îŞYãf7ÏT\/¦wà‘Œ<¿?ÎÎ’l7¸Ûx³¬+¯Ãj3df®D³ß~1öØ¹s‹o˜åÏ/NQ1lmîrõf›êDáhÉ1Ş¾Xaï»\íÛÌmòE›™IÜ>»ÕB(&–)H›S'¸2?JÍh­¯ñéN„•7PéÑğÇù·?›Ä4ùö»]±‚“3Hû-ô>xm„Q=¤ÑèĞğbüv‹%¦jzìõB‚dÀÖfmnÛÑyÑF¡+(iH0ˆh·6ùv³ƒgç(êPßë3saSÓ¼ı5~»nòáå“Ì–T:+Küßwúœ¼|…_-š||­ÅÅ·Ï0®v¹u}•z.‡“Æô1ùÉS¼µÇîíñÑÇ›$#eªE¹RÁ,9O,ç	†gh%¦İíÑ¥À)U{õA¼(SSÌÜºN«ŞCÔr´v6ørÓG3uTá³ßÖùàÍ9òq“ßÕäì•3œ³©¤¿¿Âß]Kxûıó¨ñ_İèIË€ÆÁ€ÅK'9;é<Ul{oŸ»·Ö8¨T¨’Ğè„ŒVG9fG…{_}ËwA‰·FU:ºAĞlÓ±k¼}~™‚Bš´¹{o›µCƒ‘ÒĞwŒ,NsñD5hñû¼C»Xc&¯’¯M‘w	ÈÓ÷p—oîÖéÚyJzÕV‰÷á,ÁÎ2}Ã¥:U£$S4mÀÊ¾Â;¯/rzªIÄáê·ûà8hn‹=¦yïüÓÅ··ÏÕ¥Cz¾A1¯2Øoc]|‹·
>şx›©7.peAesm‹7!Q¢^›5Ë//N3’{l¶™à`ÿz=áò‡¯3÷ØÜjã#€€µå:Qyš?¿|£»ÉooÁ/ß?ÉD´Ãß¼ƒ:W¥,4,ße·'_?Ã…)UôÙX_ãë%Éä˜Iè'„Íëb„ÿé×§)<–B ¼ß|¹ŒâMşlÖÄ_¾ÍØH81_ÀHu¢F}m–?ÿ`ŠQãø€2è7¹uK;ş  ‡Êù7O²·PvÖø›oÛLÍp‡ÚDÑ;àËu›¿ú`²ã±¾¾ÆÕ%Éä¸Ià&Äí¾R}0èîìpíŞ.ƒr™>}Ïgk'ääûïòóqI{c‰¿;(ò‹wN3ÛÚå£/w1gòØŠ…„Ô›3o¼Æ¥#è±qo™Ow-¦«‚(Ji¶hkUşê½Œ—´Ç&vúõ{?è°¹áã° !
lìnĞ’*F·ÅŠ_àçïf®¤‘&1Û+›,ïu±J²Õ¦YœâòÙI&rYP‘‘‘‘ñÈUeîô	¬AŸ>ÎåËóTSIR¡ Æ4ï¿]ÅÂ^Ÿ™¹E^/Ù˜"e÷Ë/øÛ›»,L”˜ (	İt„_›¥jBcı:ÿmi‹ù<ÖŞ!ë‡ÿîç'©Ø*ız7o16:G¯?à9Ã;çGÉ)m¾¾¾Âfñ4şÆ#–Àmoñ¿_åZ¾Æ/§„€H3¨NŸäÒ”E*a®
æÏŸf±±»|‡ÿøÍ.Ş|÷OVĞ»­ßoqcw‚_°Hu‡¹S'©sh©Çíß}Í×·œüå"ÎÄt:kTÏ,pa¼€ÇôÅpPÛjğÅ7MÆOóÖ‰2º"émmòŸ¯İcÕ~·Ë¡¤øn™7®Ì0®$4V—øÛ•ö'Ë,¨OmûSÒ„n®À»çg©::ƒ=ƒ¿ıb™ù¿ª­`#œ?;O-§…M¾ønƒÆøYşüB²İú*ÿûU¢|Ÿ×‚1ÜnİİßåËm•‹oŸa±¢»m¾ıø6Ww
¼3ñõ·»äOòáÉ*šLpÛ}v‰±Á$»mòçOğvÑ"qÛ|t·Mõµ×ùù™^³Eóùçşû}úÒäµIë;%QTçæ½:Ö¹sül.ôùúÓk|~Ïfö­2t›‰¹Sœ7I%4Ò.»û—ß<ÅˆˆÖ!BÆòÓ3\V¬wœ9wš7ªÀÁB®¥i‡Û·6ğæÎñë3eÌØãÎµ›|º´Ç\e’Şò*ß¶óüæ½³Lƒö_x-/èOª3ÊkÅ¾^npîÊ&ĞİkÒRÆ¸<òÕ'‚¹£¡£»¿Å§ßõ8õöŞ.‚ïÑì¥ì™(œ{ã4Óy…°Óä‹¯vÑFyÿµQl]ìñ_¾Xâ¦æğëI¥úéül®„–vÙ=€4ğY¿½Î>U~ueK#é7øâ÷·ùüä¯®LròÔ¶Ëáø<ï*bÉ˜épÀaPá­+§OÓgyB …Ômpw£‹(SUøâvëóS8    IDATÌ9~½XÀV%í›ü×¯V ™³åQFVöğİ QJYjøèzJó°ƒX(Ó{VÓX½¾ÂVqß\%OÂáú*wké‘Ó,(ÃDl©>ÅûoÕ°Çnm•{Ë;Û{]Jç˜sLT’Wv¾
65G°‡øİ˜ïVûŒ:ÃëÓ94é²òûk||§Î¿~£Ätn‡­ÏLÕÆÄgıN³v‚kÀëûhÅ¼¦Š¥¥ìß¸Êß^Û¤T>‹)™Rp›\»¶Bê4¿º8JI¤ô÷·ø‡/6¸Q)ñÖ¸=ô‘
˜'Nò‹šCØ=àÓÏïru­ÌÄ¹íMVšE~ùŞIª9èm,ñŸ¯®“)sÊH	¥R‰Ë—f)h·¹ˆC[{ì§øóKsTÕ>{šªH"A!?Æ•SerºËü×·øÛï¶©L:8ƒnlºL\:ÇùqÅmóÉï¾ãó‡sÎ`éú&sš_¼3MÑVğ›´-!‡ÛÉ‡›WRŒ±	.—˜ºÀk¬óŸ>Ùe¥>F5'ÙÑ  R©Mp¹6‚Ææ=û1§.-0?;İá÷Äı  ãÊ{£”ƒ·¿»ÍÕ­5¥¹Éç·b.½s5“xĞãÖ5—õÖ³Ã@å¾ìÃnO,5JÕŞšË“¶şş÷Ü:£:e›l2<Joœãì¤Côøî›ë\¿Û¢öú$E!ªD–øùÙ"ˆµÛG+É’şÎ_ÜŠyóı¼v$ïÍk.k-	H’¸Å›[øsçùõù29|vï-Ó:h=lŸØn/D‚Ë¿¼4†“ø¬ÜºÎÕí:ó£ó[[|²!y÷Óœ¨©Äş€[ßõøª):ù#‹±S3\z|ÓáÊÅQŠfÌ`CG
gš÷_+áôëğé¾İì3/à×÷¸¹;àìåóœ.[Ğİã¿}¼ÄÕõZ‘Eä?¥€|¸p?ù‹<Ê–|´eVÑ©N”1¥$ôBâá×¾^¦I’VH¢§„£3»X!o(@Š]sĞ®»¸=…éœE9=à“««¼şÎ"³£UrR"ƒûÙ™‡2¤İ›Íés£TIšJìò('Æö¹¶7@Nh€ PÌQµHS‰	¨v‘™¤ªŠVÌQ)ÀlÕÆÔ$I)OI•¸ƒ°°KyÂİ]¾¼µL?·‘æb|ÀzDi*ŸHdÑêõqÍqŞ*¢*"°k£\,î³ïö+ÃàèL!BA-ç0£6QÃ1~¥frr¼BÙÖIS‰Y›bÚŞa·ÕQ¤ÆÔLÃVIeJÒm°C‹g«µ”$…|u’“ÕîîUû‘ÁSÈak@«çq÷æ-VT NèöCD³W÷¨#\)£H…ŠU-a#‘ı‡í#%hŠÆ|Qğé½5g–ÓSÆeúç
Sâø™HÜn°ÒñÈ­¬Òİ/ï´Cºf)K Êå<Åª9ls8Úf<l#©<‘éúAíû²?ş¹ì5XéÈíMş¡±-—Nb¦6#ªÓsŒå%I*±ËyjE›ÿ¦Š`ääÚ·u6Z“œqz¬ôÉÏ `t]¹@c«•IÎM†‰¥‹JM $à”kŒÛ eBßëÑLË\š®bé‚T‚Z©ñfm‹oúm|»L¡l±¶rOıE>8YffBà¶ÛÔ›
'ÎS²4R)N™³óy¶öz´™Ä’¶·|ĞîR>Ì¤~lÀ»\¿³Ìşôº´­E~uº€Ù^¡WáÂ\Kvå‰yNä®ÑØóqf-ÆµıĞgÎõh†o,,Õ;4‚Aİ§26JAöù®íÓÖöøäÓ}„®GË‡4	AnÛ›,cğ9U•b±ÈhQ0¦l67¹S49_{õ“î†[§‰é¹!{­>­åe[b˜L®â;>®3ÃÄD…ÍƒşT	#<d#°X¼\%t9ÜëÓvÖù¸»ƒ”’ÄuñB‹®£‹lÔÙ—yŞ=Y¥ %©ä«#Ì°ROHj€P©TFX¬Ú$iŠVa²â°ÖìÄûëAÄÕkîğˆJĞ§ã‡4’“(ºÉH©øT0>ôUFµHzw›/nj¼r”éq‡4‰U(0=Q"§¥¤©ÍäDüv›­vÂ\¯ÁF×¥wû{ËÃ~ŞìÇxz‡ tØXÌŸœ h‰#?8Â„Lô•Àfr4âÖõ%vûQìÓMÒ¡ >÷='Pßå«ïö1Ïs²6Ìğ´èŒOW)¤’ÔĞ±Šr= ‰Sš=´Ú'FtÒ4EÍ¨U
ä:ÉK¾oò¥9ÔD¢–Lr–¤Ù”0É±é*œÊ8‹£RJ4Ó`l¼Äİ%—ÀO€ªÚLÏå‡}ú‰iÏÃÍ>zmÅGå-p:É0 ï6Øy.-”°Ó”“ñ‘<E³ól?'LæNU°]àTMâ›	QĞh0j'˜-Ïûk–Am¬„Ó:voÔÑ»øŞ%Óq«±Ò”Ô±ÉÛ›ı ™8Ä‡ûlv#’[K¬ÉaßÛs#”2G‘gddddüäòç„hGgÂ„ğÙŞÜäËïúÌ_œåbŞ ZöÙ{ô-tı¸…À›â?«qxçŸò-×­—Ş=ÉÌSK)RÑ°ùàœ1ÒÀT5H££¡†@UT'ö??ˆK@QTà(ò£‰µCÍÕU>YOyûµINãWã—ÑIJ*cTİ<ÚBp4€àè*‘”Ãµ6)Ğµûe¾8«·
š®¢¿ª¢+$÷y
š~´Ú“AªŠiÉGjo`i*2‰Ÿ†eB®6Ë…Ó,ıa»–Igc4óñ³ªäÓ(F…ËÉ4¹{û6ÿÏÍç¯œäìó¾•ML"ÚM	Eqü ,H±ÊeÎ_œcü¾ÎÎ!TíhÉHÕªÊ’àG)Š™çÔ³Ì>¼Í¢‘3=¢T`ÖÃÀNJ^*5Å1Ş(µX=h3?âÒˆN–Ìç&ü
S‰ªhÃıˆû¢©ªv$‹$•1¨Š¢=˜u@ÎPI’„Hw8qş5&‚¾øz™¿ÙV9Å¥š$*†2<—¿6†©³éÿ}ª&óÓœ™Ì#ÍÌQÔcš‰j(èÆ£ífakĞLb”œN~Bei7`·×'ÌUY˜S9ÜİåÆJ„ÖQ›Èã$RirâÂ4§-ıÁ$Ù»B%ï˜È.´xBE3¨27bÔ¤õÕmn¯¶9S©½zİÓ>ÍP£X!•›h…qÎœ öÈöiUÓqµR ¸U§’ì´p
g
QC"§f™1¨ê²¢b;Ğy4 ‡>Ò1fû—ªŠ¦«¤ñÃ‰(EQÑî·³TÑ™ÄH	““³\Zt”u	áè(ñğLîĞ«DFfùËj“[K»üİG›ä&ùõk¥£r‡~ê¾½¢)(¤D¾„ 
c#\x}Šù°Ÿ«šIƒTÑQUı¡uÊ'zx»|½´Æ¾qŠNš¤Q·uğğ}ñÜîÙáúÊƒÚY~½PÄxöÌšö0¥ø£+„)hæÑùmq?ü~nIyâıu”ã™¨ªöØûTAEÈäQ^¡ òØh~(¯ñĞ??êË$à÷.á“¬G}ú‰¶ÄDiŠáXÈ"N†|ŸÑ‡"êè‰Ä¤2Tª5Ş<;}ôÁ¥³ êÖ“È.#####ãøá¹}…x~ÜØh­¶0NOsbªJ­”£ø²)…%¤ŠŠs˜»t¿¼R!<l°±}Œ;uÙY¿¿2#i‹ı‹î~øİÆ"/`w³ÇÔÉ	fgªŒ£Uı_yNbW[Ï÷	‚àÁ_ƒ0bµQ4,ù*bWbïïNHâ=¶]…JuìH¡ı0Ñˆ¸ìoßOH%Iƒ~€•Ë?103)¡×#Ÿ³)å)å©lC§di(ƒõ0zÜJ¦éƒ;™y4C± aZŒÏNñáÏN²ëso%& Mâ$}JoB›d¾[ë´Ÿø<MR)UÍ‰ü•ò}ùŠ9ó™m.<~o}ØX2¤ßu¨”–WÊ™Ã¤]$4{Ø FÏÌÀıx}Ê'j¤U~·ÙAŸ®P.O­\=6g‘Ó	:ušIú`Ğœ¦ò˜íá*†–G[¸nÿÁã$f¥é“3-œT¢&¥â¿úğu.Ù!;xšBA	¨ú÷ÇãIB}¿†Eá9}†LGH¡’Ï9Œµ]Ñ 
ÔªIÜôhÖ¶{’ì±5äry¤âP.Œbû‡ÜŞêS˜¨`YUNv÷ğÌ<¥¢(˜ØfD»iQ*Ë)æ(ç-tíû]­&¶OHUESÒøUïV’$qÌÁÍUÎgg-5‡õ1uõA?):äm]‚Zs)E¬6¹µP›Â U!'"BU!ÿw%‡¢3œ¼x <	,¬¸ÏZıa2:ÙïÓîØÅû[´!M‡;g†öÛdàR¨M ª
[!ˆŒâı²ró69ıåü«ªhä
ã¼}éu>˜4iììÓJ‡m,SI*Sä‘İ4úøzùQeÄD$$ùÇúyŞ±Ğ”¶ìÓïµN¬¦)É#‘¡!õv“M¯ÆÏÎ”ÉSÎ¼¤ØìİÛçv?ÏÏ_+P4Å+½?ıVÖıÎ)}ú¡Güá^ğ2Møô]ô‘†¥½Ğÿ)BÒo×i'å>Áıä…ĞsÙß‘Ã6’´âÅé+øV¦šõ]¢#_&eLyø‰xæo„ø\”‚N$ÄJêQ)ç
FFFFFFÆO3 W´Š…ìz´Á£AÓıè*VN#êÆú!=w›7ûy|p4Lä²µ¾Éİ&½(!M%ªab³’.Ô	.Mšì.]çúA€çû¬ß­³7p¸tÒà¥ÇŞòÙ×5•’¥1ˆ#º~@w¯÷ıu1M’%¨{>]?zìo)¡Z+rªäòÛk{Ô;ƒ^ŸæÒ2ûÅQ&ÆÊ¯"ŠØåë¥=V÷ú<Ÿ;_nÓË•Y˜Wy"ª6Åc‚Õ»·¹]êiåÆ>Í´Ä›'´ƒò¡Ì‚É‘“é!¿½ãÒøz]¶VÖY9(ÎV˜‹øø‹:=—A§ËÎí5–Z r&9GÒÚóéú~“«ß¬qDDÉ0c¯©dšróã/øë/6<Ñ®BÑ8óÎ&ƒC>úr™?Àõ|^Àİ«·¹QOPµ)ælŸ•Í5¶½ ×Ø»µÂÍƒèA»<©ÕrÉA‹|ö½ ?Œla»ê$‹••»¬•W_Ùäæö€(-ğÖ|‰¸±Ãç«Cİn.·ØØw‰_f/,»ÄX:`½¡0U,qÿhëq«N¨œcRëğÑ—[¼ ÷à€;w©»O¯y
gÇ%_ÜÚa«>`àzôîŞeY/3?;ŠÒnpûÆ›Íˆ(I‘BÅ±TŒ¼ÉôÙw7ÙØnãz>½¾êÌÏÎ+¥â |Z‡~œ|ëÖÈYSœµ;\¿·Îf;ÚöW{DÅæR
Fò6µ´Ã’«0?ª£«*#•Ãİ=ÜœI>R©1W-Ò[¹Ím×cà´öêÜ¹w@+|$Ğ~‰À&ğ~À`»ÎA/ab¦„ú’wˆ§IŒïmwàµøê³ïø²eòæ{”(çlNä<>»×a¿0x47Vøfİ^½¥”8Q+ln³yãÄ0¡œéLiÜ]:`÷pÀÀóéô6ùüFı)kÕ9ÎÕ4V¯İâëãú}–·êlÅ%Ş0‡ÉeÂşŞ._,µğü€õÛlttNœÔÑt…ÑéAã›+\/ÀõöøìÆ.a”<åmÂ÷9¸µÊõí0NHQ°-õAPå¶Ü^ßd×q÷7øbË£46NMÕ±ÍI&d‹¥İmö½€ë³}ı·›)–ervÎâî½-îîôp½€ëKÜh<´9)ËAK}âĞc0ğØ¾¾Évôt?‘Oüo°»ÅÕ›‡TN¢(É‘
	ã—œÙ“Ã2NÖ(F¾¼ÙÄõ[u6¶Ú¸¯ò>âñwË3çÃWùİ]—¾ë²{xÀõÉÂ¤CşhRáy_<9J!|\Şõí6®€‚V[ä\!a}ı^ˆçru·A3H?æó2S]Òæµ©*µ`Xòè»õ½>÷î¶ñ•g]i×s¿Càâ…ò…ãc|ŒrĞfy}‡¦ß%ß¬°%Ùi4Ôÿùù_ÿ·WçUÃ!mî±¼İ&)ç©è)=J£5FmšIÎÔñw¹³]gk_²8_@Ñ¦&Ëäã®aÔ*ŒZ:*’$õéõUª£eì´ÇòÊ+Û6b&N¿ÎÛ3‘FÒ*1Y¶†+Eµ#A“Û[¬m²Ù|øÖ"“s¸’ìºô4‡©±"€øı>¡–ca<?¼ƒ:
qC•ñÑ"ySAÓë˜å
Sc[§»¹Ã½­:›}“Óã&ÂÊ33>\uZÂáúkÕñ"fàÑUm¦ÆK8ºÅDÅ"î5¸½yÈÚ^‹5Â»W˜4Ä!]7Á¬Œ0×PÄqÈÀƒêh™’ıø¬Blît©ä-ÂÎ·6ëôD·>8Íœ*I‚ëP.17Ñ^×“¯U)¹½uÈÚö!‡ùõåª¶>Ôëş>›J“%ì\¹œ`ÿ`—{ÛuÖö:øN‰……
ã“6i»ÍíCV÷Ûœ'æ‹X†ƒ!#{û¬z˜ŞÖK[uV·»ÈÒ	>8]ÄÑ%ƒN—Ä.05Vxêª&U³™®a·÷ønåµ:k;u:F…wJ˜¦Nu¬B¼¿Í:k;‡ì‰"WŠè*D®‹kä˜¬\'&Š²Ûa}³I/V-øn„^«0j(¡G;T©W1D]?Á¡fT'FÑ[»ÜY–·¼>W!oièå*óJŸ›Û»¬mÒ3JLòù<35ç‰«"	è¸)¹‘*ã9U¨(J©‰¶
Rt»’Òh•ª‘ây>±Yd²â`i9fft:[uno²Z÷0'+ÌÔL‚®V‰ÙÚÑÕQšÁH9´¹µqÈÚNƒ=™çò§Y°ÄÍú.·¶XßiĞÖ«üìÊE¡Q(æ)>wWXŞi°ÕS8õÆ.¥—KbúnˆVa¢¨£*
ŠY@´÷YŞn86•‚õØñ„$¸¥j…Jşñ–WtƒÊHÑÜçöÖ!ë;uúÎ8ÿêò,9u8k$lˆÒÍåìxCÈ¼$¨ÌN2[2‘Šc£ÃË«¬n×ÙèFLN2]6 öi{’R­Ê¨£wj¯bj7ê¬m×YmFL¾qš7'sbx•U·/­2â<-%G½ãÒ¨×ì·ƒ™ç7oÏRÕÊ4Æ‹qg[[‡¬ï68ŒlN]#$ˆ©§ô>FuŠ³cö°MUƒJ9‡ŞoÓ:Ûu˜>5GÍ†0ğñb‰Ñ©R™ÃêpwíµíMYâı‹óŒu¤L9ØØ¡gT™‘‡\]?ä` 8ıÎéáÑ¡`äKLYKû¬ìÔYÛñ(ÏÌ2YÔAFôú1ÅêµÂ1+iŠ×>äÆÖ>ë;uv#‡wŞYdLW‰:uÖû‚JAegy‡•†‡9¶ÈŸAWšiRÉ1ØŞæîfõ:M½Â;óM£P*P¦ÇíõVwê¤9ÎŸ(cÊ˜ş ¡T­0;c¢„=n¯²¶ßÂ+1o+ªjÛ÷‰Õ³5ûtcƒñ²…ß>d/„¨İcóÈÿlÖg„¢àÆ“cElĞò 2Z£f„O -¦ÇòØÅ
óÅ„Ííîm²ÚŒè
n¤pf~SWŸğ!]7Æ,0Óş€ê05^ÄA‚ˆèv"ŒB©²úDò´”AÏC-×(÷w¸±Yg§0vó³eŒ£kÏZ‰ÎØÔÈ0Á›øÇÈ»±5”w7´˜*(8&³ãESgdlw¸³^gu+`tÂÄëE8ãSÌ±ïáá0Q+â¤>­*“#TÔá!«0ğñ#›‰Ñ¹j™VÌúŞ.+Û‡ú)v¾@ÀÜt…¼ùÄúĞ(*‚xĞäÎN®ReÜ
èÅccJp¤i™­Ù˜¦ÃXM§¾¾7|ŸíÔñ‹¼>ê<}í\FFFFFÆ?Âã<1ü`kğÑ¹=!ÄSgøÛ>|›õ3¿t~Lˆ'gÓ}æ‰˜ÄI¸ıPÄ±ßüoBˆÇ~÷d9O×åÑ­ÙË—GçzÅr<ùû§>;FÇe~öº]>ùä£çÎñæbé‰sËÏ~ŞódaÈÎÕk\³¦øõ›ÓØG‡ ŸÕO?ëx]ğÈç—jÇÈËËêô¸6ìûòH´GõtTßçèñymø¸>qôYu{¬†ƒã§t|ÿ;Ï°ÙGƒ@ù½¾Ğş^ª^<£?C.yü:ô³ìó…¶õÂ2Ÿg£/×GÏüı‹ŸqÌïŸaÏÕÿ÷hÓ'ë÷2mœ&	×?úŒµü"ÿöİ©cıÉ‹ìà…º<Î?§	½õ›ü§÷Ş»ÀÉ‚|°Öşüz¾œïT¦c±Û_ñOÖ÷±ß¿÷ìwÙ£}ùq;P”˜Õë·ød/Ï¿ù`–¼¥>¿<³ß¿œ-=­³Çe?Ş÷W™|º!ˆw—ù›¯ëÌ¾û—ªâ	™¿~D°yï.ŸìæøõåyFsÊ|ÄQÎã|÷Ë¾³222222şü(§4<Êç¼ñÿıg¿,}æóƒÇ}vÌß^TŸçÕå©ç½ÄóˆîÕÑ÷ùíÓŒbÙe­#)T‹è¼¸+ß1ºø^¿ÿßyi^ªMŸ®ï²¾¯ì/(ÿ%mJ¾‚¾¿_½~¸íş!>ÿ1üÏËÏ/ÿŒ—ğ¿ª>¾Oı^¶¿=ókÏ±ùbE½Ğ†ä«>ÿ%úúËëI>{Bâ9mû¼¾œšlt5§Š‘ÒmíswwÀôü<º®¾X¦á]òb»|òoÏ¶ƒ4Ihì7Q«cÃƒ.÷ÖêrS,–v~<!ós}]§Áªo3?î *	n¿Îİu—©ù)ŠÖ³³r~_ßı²} #####ã'güñxîÀùû<§À7ËMZa¯<ÃÏf
èRfçê22ş…ù“ô¬%#üS&¥ÍÕ¯lîä"¡ÕòqjS\œs0ÔŸ ­¤){÷¸¾Ú`Âz]v©ñÎù	
ê÷MO#Àoñí·¬X("¡ç¹èåIŞ-b©Ù»(####ãO—eËzÆi€—$ôûšeá˜?pn%òiõCb¦åP²Õl ”‘ñ/+Çíõ	U“rÎø§,˜Ä÷è„'gc©ªêè´Â*¹¼c¨ˆŸ¨½øı>½èa2WÍÈQÎi¼Òqì8 İˆÒû[ôUr¶EŞÖ²-åY@‘‘‘‘‘‘‘‘‘‘‘‘‘‘ñã¢d*ÈÈÈÈÈÈÈÈÈÈÈÈÈÈÈòŒŒŒŒŒŒŒŒŒŒŒŒŒŒ, ÏÈÈÈÈÈÈÈÈÈÈÈÈÈÈÈòŒŒŒŒŒŒŒŒŒŒŒŒŒŒ, ÿ£ BˆŸfFÚ?Q„ñjíøÏF)zÿõÇîu?†œßóâŸH7Êú‰·qö>ÉÈÈÈÈÈÈÈòŸ ÉÖ}³Æ^ÖnÿF³¯Åk7ùl% N_~Üİßç÷W×èºÑ+O·ÅÍ«·øzÇ#Jÿ„5öY½u‡¯6úÉI™¬-ó»[4° FˆˆµU>¹QÇ•F>+·îòßí‘¼ê=×i‚»ºÌÇ·vh¿L 'ûË+|ôİ.qò‡½ÄÂëõ¸úå-–êbñcë^ĞŞŞæão6pÿh†ö‡³_¾Ze­õ/c/#######ÈèŠ´ßem¯‹+_5 ¤©üiŞi*%òşı¬?D‡?fıãÆa“İ^úÒÏ@èylîuã1j ¢€ÆA“ıABú'{™Ÿ€$¢İh²Û‹Hä­;’t;¬öñí?–­¥ô»mÖ=’W‰ÇIé6Û¬×İW—EJâv‹µÆ ÿ%mÜítX= _¢P)%é+
—„!»-:~ÄÂ‚ş€õ½qòÏo†k¨·—7Xù¨=JIâ÷ÙØïÒ²@FFFFFFÆí'¼âÀŞu×ùíï=N¼qsc?¡À\DcO¾İÃ¾r–‹Eû•.M÷ø‡ßî`x›~è’DæGyÿU¤PÑÕïÛ‚?ò’””¤•1Şÿ³RQÑÔ?Õ.+´'àŸíf[I¶øôwk˜‹¯ñŞ	çõ5Á«/ÁKisáİ·8'š*~XüCxª0àğÆ-¾2ÇøàÂ4ùı&İr•
ö—ï TíáÏşÙšYŸ«ŸÜá°x’ızù+ÜÑmòí7ëxçNñÖhSQqf^ãßMJTõ':I›‘‘‘‘‘‘‘ä 2M	ı€ •€@ÓÒX¢™–2I‚ğh)CÑLr–Š’8
	R$qLŠ@¨[î`?MCz^L
EÇ±4TE<Ç÷ı£-ËÍ0±u¢€^ß§ëôú.ı¼@JPt[WR’„^ª`™šiâ&‚œ¥#ÖÓOÖÃ1U†ÅJ’$Â;’	¡bÛº"2Áó"*¤±~î8Ú±£È”À	V¤„ª¡k*Òõèº>ñÀ£§*ä5
ñãáv$‘¶‰©¦¸ƒˆDµ‡¡cJ1ğ}º®5pé¹†abi)¾Æ)¢ª8¶ñ`ëDExaL"%BTMA¦Ã4ĞI‰ã4•aiOèfõ«„    IDATìx9
éRR)ŠŠi™
G¸aŠnux_¿~À°\"ßÇÓa¹ŠŠa˜˜"%Šb„© !Hƒ 7Mƒ(L€¢Y8¦2l7)I¢÷è3¼¥£()%ç?f·÷Û;ğ<‚#;ªmêhÊÓvG!^ğğÙ&	±¢“³º]ãÑQßQ”¡]ÜT†øQ<\İ°9¶kÉ¤÷e2°Mí)™ÙáH¿E@’Æ¤R ä¹?·‘D~x´*/á™k¦qDàÑuƒ¡­4LSGWIàFÉƒv3ãŠqİˆø¾>TÛ~$võ<ÒH hºej(HB? ”ºŒø!ıÈî’$‰ÑÑõalù¤„¢“·5¤Œpİ‡¶;ìOÊKÄ£’4‰pø$ä±­’$pıø(ØV0CëÔôbnßÃ4,M!|ÜhhßË404qLÓK¢(F
(‚Ğ÷	SdX?EÅ6udD	ªäLõÈF#‚X`ˆ” IHåĞX¶şŒ‰¯Ğ÷õƒÃş&Qˆâ„‚e›(Q€¥ÚÍ6µ:}ÊLCÒ×ºB$$ëb†’àú>=×§§zt¦i`ë!Á‘Ş„P±r&jš†şÓxô=‰	#¡rdã)Á_8ü½aš˜ÚÃÏ¢gÚÙ‘?“án¡`è:–¡f£ŒŒŒŒŒŒŒŒ?\@.Ó”şŞ×–69Ô"5Øß8óş;¼?!pÛunŞÜ¢©à÷iª“üÅÛsŒÚõ{7øû=•Ñ¢¾O*<½ÿúÆJÖ±e&±ÏöÎ
÷6BDìÓŒ\>?Ï‰qE@sÿë7×ñm\¸:ÍåÓŒ´v¹ºÚ¢$Ü[^Âïtö»(ÓgùÍÙF±óõ×üw„¿¸r–Å²äğîmş¿f‰ÿñƒ¢Vƒ›·×ØÓlÌĞ¥oLóî¹)¦Ê™öY_ßàÚr‚“ƒ^7áÄ…yÎM—AƒüûeÜÂ£ê W	Øo*¼ıŞ9Î×œ£€ş>‚`Ğä³Ï×ğt™Jb,¦ç&`sŸ]?@¿³ï¹ğÖÖú-şó]Ÿ‘Zé,^Z`FîòÑÕ>B“„~Œ(—¸|q‰në+uê~„ºyÏƒgNÌ1jîñå·º¡DQÀŞzç³%ìŞ¹ÇÕv€ª¨("$J$½¸È‡ïc1­óùg«Ä§ŞäWs"ì²¼½Áõ¥ˆ|Q'èpÎ¾Á/œa ıhMÓÃ{kì§?N	¼„©çycÒÁnìñÑ·-Îşì5ær
1­æwÕä½wN3g¸ùÕm6¤Š!%q¨2sáoë‡|ñù&úû¸R²‰—nò¬Ç,ÎÛøIÔï2È-ò›w&¨š‚Ôm³¼´Îõ–BŞLh4Ş}}Åñ<n³É—WïÑËå0½ná¿¾XÃ:|ıÅ--+
ğ´1._\`¶ôèÊ¦$ÚÜº³ÁÊnŠSñ¢_ç |‚ÿÁi1ØÜà³õª¡+à¹‚Kïœdºâ`%ÛË›Ü«÷ˆÙ §_çW¯É?Ñ'üN‡¯¾¼MÓq0×˜âı7f™,<*SzL_œà/Şg´ é6wøíçuì|Sõ	…Ç~Çæ¿8ÇbA'‰"Öï¬p»ŞCèjcZçé)¥~ë·v9ğÔ­>k¼~rŠQ#díú]n‡MJ¢ªsgy{ŞÁÂ§Ùİâw_v0ri”è.½5‡.7®uqÕ˜ öˆõ1~ye‘QÓgéúM®¶K,>5Æ|´â?»4KÅğ¸ùÕuîi'øŞ©¡È”ææ××÷éê6¦ô8küûŸÏĞo®òñ Ó‚~; tvwF)¼À¦é€Í5¾¾’/i‘FÁÅ£‰ı¾Z0Mè6}ÆŞ:Åå±"{+ë|×ôi+‡\CNŸŸãTEcëÚ–CAš&¸L/œäÍÅ†úøR®ÛnóÑç+œzóg¦
¬û5m^Ë¥ôeD×S˜?QCô4Ü9èÑ¯œà¯Ş¤`Äì®/ó»{)§Ğ	A"ñ8÷ŞYN—ì§‚q·^çÖ­UvîûA}Š+ç¦˜)‚{çÿçZÌÂ¤E…´$gÏÏ’;Üg;?òHÍq~qyª¡¹Ö®ßáv¤ Ë”(V;Ë›ó6Voüı:ÑÌF/FÄ=æ_;Ã[µ{÷¶ÙìExÁ6Ÿİè1??ÏÙªÇ»Ûl¶TºˆÓã”–²²²ÍÚ $]Ş$Ş-rşíyª{Küõ]Á•÷^çL)¢×kòõW›!$q”R˜:Ã•E‡œ°ôíu¾éW8¡{ôÕ7ğ1ËÓ|xq†²iÜ¹Ëß¤L‰Ÿ$LŒ-ğá¹Ú+GÈÈÈÈÈÈÈÈò…ãDA‹ë×7ñÎò—¯£Çòµ%¶9¦Ä†ÆÂ…|0šCvùÛ\âÓµ1şÍk*I¿27‚+‹%l¥Åõnóß¾İá¿ÿå	rÇ–2hğ³_LP	ú,]¿ÍÇ×w¨–ÈG®İØ¢|ñu~3]€î!¿ûìŸ¯åşöî;È®ó¼óü÷=éæ¾nçn4b# H‚I‘¦)ÉòH¶eiÊaªl¯wjwÖµ;µå×îl˜)k\»5³+{ìµ¼Î’-¯F²$R`rİèœsß|ÏyßıãÜF7@$àùT5Ñ`ßÛ}qÎ¹o?¿ó&İ±'4ÏÌ³íşİÜßZfàÄY^›šÇlNRÑ9z¦KøVÜR«.`d±H¢¶,qîô Å®m|¦»Ha‘#oŸâµó>¿·ìä '‡b8ĞM[æ.]àÇûˆ¦îg}´_B»;vï¦)•åÌ›g8|zŠõw’\Õ©”ÏĞù!†¬F¾t GûÌNÎ£êiN®c!;Bbï6ö¦ã8~™ù’Ëö<°.‰­K£1vîÛ@WÚ¢47Ë[¯Ÿ¥w¼ú®6i0ÌOë¾Ÿ§7YÅYÇªİÌ'»k‰XıGñÆÑ!mÄëçĞˆaÛc;ÙRãb*S~µ‡ùk…’ `òBG¦’|ì‘ítÖ{ä'§˜´®5RX³ôD¶ğì®V<¥»pšÏôRßÁ¶ğŞÄÕÏGÏ*Å\?§—¢|æÛ¨·¹©YfcS	Ÿ§V]/…²Æuòñê03C¼øæ gfëy4ã0Ù{‰óåf~|™X™ñÓçøşÑAâOmaáÌëºøÌ#ëˆ,Ì1¸äàÙ0qò<—œ&~ú‰Í$Š9&gËXŞ•ÃŒMPfìR?çgR<q`­)‡ìÈ0/©şS–fFyıÜu;¶ñ±ÎÒ?Ê+oõñğ»è¶K¸µlÚD2ª(œáëGzèiŞÇŞÔêŒd?{áh_xb#±\–ñ9Ÿˆ{õĞçw¾Ÿ¹‡÷7ó¹Pà²¨Î.öoo"áÎqèà™¡ã¡óÃƒ«pÿC»ØX……q½İ{ÍÄªmãÑ‡"”¿Hló6>Ö@SbğØENëz´“:[37ÔÏN]$“ÚNg0ÊKÇgéèŞÆ¾5P.13“Åq3@ii–ø¶}<ÖéRÊñÊK#\ÎP¿ÙC¥Ü,5;öñX»"77Ì‹¯O38Ñ@zby°¹2šüô8o™¤áí<Ú™&f¸8PÁÂBùuì¬…¶„bñR/?8:Äps-[cöîJ²06À[ç{÷ïbk&Bqz’7Î…£a (<§‰Ço¢1³gOóİ#ƒt>³“M;·‘¬œàµh+OîYG} Ñ, ›»øTW¶)3Ò{ú&iÏ$é¨µ®1¤]]ñ™e|wìæñtş³gùöÑKì|`7O=Æ™éå›‡†8=™áÑNP
*¹9r]Ûy¢»ŸŞÓG9|dˆÔ£[ñ®¸ºÈùSıd;·ò™mõDŠK?tŠ×ÏEøü¾zÀPtº6³»Õ¦÷Ä9~ôÖyêvmç§¶g(åÆxùåQzG3ÔmŒ0ÚÓÃiÓÈÓ:¨UšÙ¡KüàÌERÛèö ¦ã|ê©.Z‚CgÏòÊĞëy`Gaî$ãµ›xfo= åù-èŞ™$fi†ßz‹ÓñôVöìÜD9ßK~×iI	|²+/~~cG/±”îä»Z‰Ø†Üø />Ë™È6ömt@)ŠÙ9Òïå±6ÅâÌ/½1ÍPk5Î¯X`7XäósÌ-D0HB!Äí
äFSYšbÔ®aogq­Ñ$ÙĞVËÉÁåUr\êÒif§§8t|_•Y(kt© $À(R66§‰Ù£Ótw&9qn‰‘lqU9£ˆÄ’lÚÒDZk/Áº¦zNÎ0¡}¢“#‚™qŞœUaªä3?WÀèäå€ÂÅ€\š“q¼áE¦M@}nŠœSÃÖ:˜/(.U˜/:¬ßCçéYğIÍÎpìø4(Ål.`^Ïø5L\œ'ëk†z4`)”Œ-º2 œíMu4&4NĞ’Œ¡¦–Èa®èí4êã.ÎÔÇ.Œ±q[™FŒ1˜ÅğëÆT?ªÇ#‘NQ_“ÂÖá0ËT{+òö@S*2[6DŒÁÜjOÍòósó%&'8Œqâì4Æh*yŸ|¡Èüb3¿„×µö˜‡eXul]—äÒÀ;/‡@èèØØEGC 5‘Æë¸öüL©aßÆ\[µd.õ’[ÊCôÆ—^4é1ó\87Lû†ut¶6‘0Àô;ƒJ¢&EGg-n` >FMÆ&4•Ú}#9
ñ%úzz¸hÀš/PÎkÆ14¤=rã3œï‹±®-Ãº”!Ğ†x:‚™^àü…1::[ij‹‡‹—­ú©~)`b¨BÇ†FSZâ­í¬ïâ4 ü2‹ósTš[ØÚ– b…ÏoÙ°Ö>f'Ë°¡†ÎÌ"}Cœ)øøA 0”Kpu—m¼6Šß?Ï¹q:;Zhi7ïxMà„ïÅ™•÷âüå÷b¨XšMÍ	Æè:jz–²äËI²Ss$Ú×ÑREÉFv6raæÚ7ëŒ1`V-¼UZ`h>G^E8w¦KA¹P¤PÌS)/26·„_ÓÉ®Î$
Gc[J™6à¥›ÙÖd£P¸V-­±&ËE*ÕÈ­mak“c±kiñFÉVJø«/¦  49I%ÓÄÖæ¢Z£I±©+œ¾R×RÏÔPoä4Vv¼»I¤ÒÚ0Ù·D²eë<­ñ2MtÖĞ?W½A‰ĞÑŒ^ä¢AÍg)û[~/®\´QÕ²yİ<çÎö‘²‹%*ƒÖ·²§—¬csƒÁX.‘új"liu~¦{‚ìbˆ‚;ÙÈ®Îšê:-šˆÏ³8[!£VÎiäÂB…Dj–cÇg@)æ²şF×ŠT*E¦%A ¡! &pßÆ:P®UK[lér‘J©Èà\¢ãìéêõ_¾
àR-]md ãÚx™Îh‘JÉÇ$Âë¥À««¥i~†Şã,UA6À|
Õã|¹í»ÆbƒÙé<s¥{÷4âÚá´ˆX]3;§é+æ( V×Bw“Â‹¨“¦É¯³š8I×09<ÀùrÛZ3$bFzÇ…Bq;9˜|€KPPjV
L (ê½À±…(™š“yf‡gÈ®š;í¸
Ë®WˆØØºL© ÄŞùc•eã­ª±=ÛÂAS0SÒ8Ñ8õ5Ä«¯¡©>ƒIàÚ
ÿª×ï5ÇI÷Lq~$`ÇRhk[ë—86^àb®DÖ®eoÂÆšPÑ(­)/ßv8Q\Ç¢¨-jÒõ4ÕG«ÿöj·ˆ§,À²¶í\¼ÃUˆ®ê6]xª®ÀØ¹>^\˜§£¾­[[¨»æIçtÛ—‡±Îsêø#S%Úw´‘.Øä&¸Ş"Â¾6h7NCm-™dµ°¡.×£ÖÓ‰Œ…íšËwF®__–(c“ŒÆW"Ì¨²"¬,ğ¦ğp­ Üx{%c©–vŒÔ±t©ŸWŞ^¢³1Í¦M´]ëÇØ6n„ËÅ;T=%Ê¸ÔÖ5ÒT_½fëkøäf‡tÄ#Ş½•'ÓŒôñüàë×w²½5IÃúÍ|<™e¶FgØĞŞÌÖujÜUƒÃ¡¤lnÇôêàtb)Ç[>¦
E’¤§	‚
Ùé%ÎŸïc,ÚLwc–.rIŞy(EãÆÍ<Ê2Ó?ÀóÃÓlèle[G=ÉU¯)(êíáøB„öë¼mÛFYöê·Hø34hß"«.Şg®üú-)i‚ŠMã†M±åyé5tv¶S_k1<å‰%1«^ÏêÊ×ÅT¯sŸí8Şª¯_çº3S6x—¨F/ÿoMÅŸæè¡I²Æ¦cC#qU¢ß¾µmùŠ¢‘(îòÏ5«_¡¦ŸäÈ¡)üDŒö¶:"Awúzß[‘àØø$ótq»Æ3†Ş]ã¼z5qÛvPÊºüÚÌª–Ç`p—+{Ù]tà_ùmó*£¥#EÓªvp›Ås-
Wÿìåyß«vÅ0¦:^¡ø])š¢nx=Ô×ĞÙåRWÇ” Ï»²Í¾¥ÊLqâÄ©®Mõ‚ì,r7?Z
¨íE‰©•5,[‹»Ú\şİáºÆ¨•ß¨ğu%ëÙ÷ Ã\~ŒCGÎ2Ú’¦«£ƒM,'„BˆÛÈ”!¿T`n
Z3Õ%W¡¨Ã‚´XšçÌ@‰–­Ùµ>…c-2v~˜Ü•5ò×üTKÒš¾^ıUıÕU§–J,9q¶lì”‡‡ÆIfX—Z.˜.Ç¤«
;±&:jF9>1Á¥¼¦aWõ¶M­?Iÿ„O¢s=QÇFÕEˆè"a]Ó•ßWû>éˆÅ¨e‘im$¶ÜSıo©ğîÂ‹%h%hHEi\äõãS¤3­Ô«ë³œ2Çf8?¸D×ã;ØZÇÍº,3|Ÿq,¢¢µIÚ›’Ø«´*-‚ª09æSÎ@,hƒÎ–)¹FQ›$iWXZ˜Îú+^›ºŞy\‰‹T‚)æu‚æD°~™…å×hô|‰’
‡''F¦1FCMŒøüo –n¤=®®wtŞñj•J’rYÇ¢³µşò…xùÑ±më46¥ˆöôs¦o†õõ1¢ñ-mqëãDGG8Ò7Es}št³ò\¥0å"ù,EbxáƒÅ’Æ8€káÔZ,”)´C*şd_O2Yth‹*fæGè)d8°£ö´¢RÊrâ@yIZÛ46$ˆq¬oŠ¶ú©ôòkÒ”Jóœ(Ò´u=»Ö×Tß‹#änåpÊ”™˜/“/ç…ay!_†kÌ!¿"é,KºD¢†l©–öõq\ku˜2Ä½¹©)tãòù×¿xnñ<¿#µa%mòSæs¯À1ÚŒÓ³?ÑÍæ¸‡m8{){‹oÚ€Å¥r&U=²e?\ü.Ğ”.1hâ<¾s*sDŞqœÂ÷qá	†ıİ—¡6®‰‘åüÈíÜ›kÕ{QküÙy
‘‰šäW=¬.‚gòØV†uÍWµ¯ú]îSôˆD5óåZÚ»bxÖê3¨¸¥ıå–šòE¦/NPhï`ßÆVj-(Î¢r·våÄ<§°Àœ_!øå€¹¹‘fg¥Å»ŞefljêëHÕ%HG—¸x¼‡¾H’¶¦&<cŞÓ*ıB!„¸7¼÷}È-/³õj‰Şá!¦|Lsdx–Åru•d'âl*(0{q”ş…òJ4V0?2Ê¹É)‚€òÔ o”¨Í4Ro_»t*f8}tˆ…@ãOÓ34…•i'î¸ØMÔûKô\aÑ¨Cgè-”PØ*IÒ*S(dñƒ6›T¦†éWIÖglbK*XàâLdÆ{ İ6Ú½½ıŒW¿ï\o?§ÆKhMmI'&87¥Tü)¡T~wEªREzÎö3¼T@{É¸‹…ñ˜K4jXœö)—ƒk¯pí¹DmM©à`ü"KcŸ(_>ÉŠµä³‹Tü€H<BSºÂÑsÓÌ/•(û–rÃ=;ƒŠÖĞØÜ‚3z‰KK|Ÿ\i”7ús×¬ImÛ¥{CŠÉÁANæÍ\ß §Æ–W¼¿êò)Ìğâéi–ò
ù2bSd-Lc‚útÀ…3s”Je–rs¿0OY…=Âc8·˜£d{$â¥ÂaÔïæN”å°¹Ñcdd”³ãá9­ÌpèÜ,Å¢OÏ±´ÁŠx$b.¶1`ıÇz¸X® İ‰˜‡ƒyÇÏx6›ÖÅ˜`h"Ì\¤o©ö–«(©šsCîŸf¡P.U¸xt„ ®­åbÇT¨”}.`æÇÑCßñôV|p=’1®zM–¾ã¯z/–nisêÊà08»@Ñ(Mõóöxé:ùD¡HQÑY|?@«:Zk“,ô^ §X¢ìé½0ÊxÁ¦£½–¦`œNÍR,û³ôf¬ğÛ%ÖÒEfi‚“CcÌšŠ?Á›'Æl›šrÑBûœ›šd(Üôg[–bã†Z
ÓœíÏšùq.Me)Uo(¨ˆ‹«•¢"ğg8>6ËlQ/ì½T&·hÄA"–Oa!Çè…1¦õí‰sJ)*sÃ¼~1G¶è“/Îqäì<©LM5Ö!ÙvÛèŒ¹técËíàŞã7>põ´¥“Ì÷\àb©LÉÈÏ/Ğ{aŒ©â­ls— 6fSÌg©ø
×³Ğe‹ ¬)WÆøñàÒÊ>å/ÙŸbñªöÓ­)Ú+üøÈÙ|‰J¹ÄüX?gJ5´×en<‹F)ä­9
e›h,JÜU(ù‰1^~á(ÇøRo!„âZ¹äı<ÙK$Ù½ÿ>N?ËÁƒc(aËÆ$é¹\ØŠ²cW-oëáRŸÂ«m ½6E1ZˆFQŸ‰Rã…KhcH´oåã;j¯q§@¡¼(-uŞ<?88¥5‘Ì>¾­–˜ĞÀ£kŞ~³ŸïEapj:xZ9Ø(l·=í¼páSóëydkõëêY7”§ÜĞL¤¢¤;ji©8lŠ¸áÖ?^”]ÜGNóÒÁIl@GêyfŸ…ãØ¤:·ğIİË+gOÓ{AQ´tïÀrlŒ±I$cÄu¹¸µ¼µI¸Ö=+ÈqøÍSø€åFÙ´ë>¶6j4¬ïXàğ¥sü`¸†=6’v#¤ãnØÛhÔuòp×"¯œ>Î·°¨KDY·±åXX”ªaÏúZ¾ÓwçrõìÜº…;7Q>=ÄÁO‚'gëÎvŒLWTœ8ËsÚÂs£tlO³4²rS&ˆ8áYµë¶ğ	ÓË+gNsá¼B«û÷+ì«N¦å8¤šÚÈ˜i^úñ(%£ˆ¦Zxd_Ê U=ûÖ73{~˜ï½2„‹Ò°µƒIÇ¥*ô:Íi­P¶Kûæ-ìîŒ¢çlâÉ(e¡¨H”Úxš«Ë]ÅHEÂíõê·íà“\àÅã‡9mÚ£ûÑ­XÂ/ÌsìÅ#Â b½¿Ú¸Ã¼ÎsâÕã7€—d×ÎtÖ»WS'Bë¦n CGOrÌVDê:é®™ãRõ!Ñ†&öŞïsø|?¥,âµ|fw¶²H75³mf€×Ş>²5­Í¬+äÂ­•E$%±° íç8şò1DjØ³k=­µW¾¦h2Êûkyóh—.­¼1«zCÅ¡&Á]µµ–‰’\,\;Öq ÇO£G)·†İ›ê9•÷®Ùˆ8C÷æ:^8ÓÏ·²YŞ¾Î;xÄ?ÅÑŸà¬cEØ²a›b¢m<¹Gsğø ß}¹ƒCkGûâPŠDHÇœË;(¥ˆÄc$¼pN¹’¶W¶ÒR–E4Ãv-”QDbQÒ
béZö>ÔÍñ“½<?8„…¡¶ó~Ü–Fš9É‡p—u¶VHuj‰‰Öî;ÿ­Ê"Õ±…gL//?CÿEpkÚèÊ4€rQ¶C¢m»¦Ïòö›‡9‚Ç¦–8Í~oÇ#Ùºöñ³¼şZ–î7±íş6:^æ¹WfPn„šX›]û[ëeY$“áÔ0¸Ñµ¶{9ĞÚ®K:i.o‰
Û#]İöÀğêH-ôóÂ«e|ÉÆÜßFCÁu©M¨pÚaçşİpä$/œ®¶ƒu|r¯kAåòû­ú£šd€SıÙJ)"‰(q×£è¼oûƒS{ı8gh+Â¶M]áõPqH&£Õ-ÇÂ¡á¶ã’N‚c+›67Ò{|‚ï¾¶ÈæM›è^ßÉä™A~ôêeóºZ²‹á´¯¥­½…±‹y~,Éo¡ÕN¶Ÿª–û÷lÄ?4À¯@+ğâ5ì}¨›é°M÷¢QÒ}yÏse[ÄQŒc¡”biìßÔ€M]c;ooÂ™Ã²¬÷qç[!„w;U,ûà7…?ŞÃ·Ì³ñ‘½<Pƒ2Ä/1~á4¯Ì×óÄ´Äd¢İZgŸ™'98•â±‡·Ğ•5„oùØ™Ç_:BrŸ°IˆøèUa°§‡×"|bIGŠB!Ä‡ì}İ¸×AÀüì"9?ìA±Š9úæ(%›Ù~wC,e~İÚSÊå™Y*á›pø¥)}Y    IDAT^˜§g´L}c1	ã×OßÅ¥Eæ³•ğ}¡ægéË¹¬ïÌÈñk/œË!B!„øH¼¯.‘ \fğäYFkZh‹³Óœ+Ö²{G)ëæ%1áVRbèJQœ™æèà"‰ºqKS™˜`$¹':ëñŒòò…¹!÷):ZJ\ê] ¥»‹î&‰>bM]¬h¼—…B!>ªÜõ~†¬›  ;;ËtI‡‹T+ˆ$h­]™ïy£ĞR\Zd¶âQ_› jËÉXk‚Béù,¹êÊ_ÊrH¥hL"[ùÜ¦TÊ29U R=N–¡¥%MTI kç:Íg³Ìå-2õ	"\›B!„wT ¿üMV‡ŒwÙsªŞ™5}\ q9vâ®»Nå›B!ÄGåYÅÇ¼jNêÀµÍH¥.ÇNÜå×©!„BˆŠìÆ"„B!„BH B!„B!$!„B!„B¹B!„B!\!„B!„È…B!„B	äB!„B!„@.„B!„BH B!„B!„r!„B!„B¹B!„B!\!„B!„È…B!„B	äB!„B!„@.„B!„BH B!„B!„r!„B!„B¹B!„B!$!„B!„È…B!„B	äB!„B!„@.„B!„BH B!„B!„r!„B!„B¹B!„B!$!„B!„k•óACcÌ^ı¹B¬eJ©+ş¼úóÛÕf^¯ıBˆ5ß^†¹íí¥Ô™Bˆ»±Îüà¹ƒÁC 5Æ„-´1J¼âj(ƒR`)µªàTÕªóƒo3Ãv³Zd*R[
!îUm°,–eİöòzufõ!Ä\g~ |¥ Ô„5¥Âq,Ka[*l˜…bÍ—– !4•@ãkƒ¥–Ra¡i>˜ŞŸ°7Ç uÄa!ëÚVØf*i5…kŸ®¶c~ ñƒôå`®PXoùr©µ&X®3m…c[X–Â’Sq'Õ™ZSñÃ:SaPÅ²ÿ¾úb.7ZcPxçÚRP
!îè•  T	0ZcÛÖJ0ÿ 
Km°l›ˆkãX·£SI!n{›iÂ¶­äTü …Á¶¬0˜¿ÏP~ué:a›)u¦âî¨3õûäW7’QÏÅuä>¥âîhC¡\!4ò÷ÊW‡q_Ç&æ9XJZM!ÄİÌË~@©â ¡üu¦ƒkÛH“)„¸[hmŞÇ*ë†°‘VÂ¸'a\q—±-EÌs±m+œ–£Í{_@h¹İÔ×±‰KBÜE”‚ˆkñTçz›÷¶.†£«óÅ¨çà9Æ…w—pÚÍ{ÎãÕëà:²ƒšâîåQ×e¡«æ»åa{ŞÄ´,‡¨ëÜöÕˆ…â£à96®ã uxÒ¼‡DnÛL­Ás\\Ç–+„¸;Cù{
ã«†Ù¶-=ãBˆ»?”Ûc£«íß{m7RD\Ë’VSqwR@Ä±±¬÷vsuiÙ+u¦BùU-eu.¤68%C.…÷DéØá\Hın‡aš•Ó²¶-m¦â./0­pÇ@¿÷›˜F›p%u©3…È¯j 	We…[›	!Ä½R`Ú¶…6+má­åñê~ã(Û–­ …÷„ğ&¦õînb®º‰eáØ2%R!üÚ¡Ü”eÉ°K!Ä=C]Şöìİ¿\~|¸Ï¸K!ÄİÏ¶ÊR—Û¿[¹‰¹ü˜°ÎTØRg
!$_¿À%Ãˆ„÷N ¯†ò÷²ÈzØC´™Bˆ{§ÍT
Pïi¹1%u¦BùJ!„¸½×UÖ…â
äï£ı“6S!üæM¥=!Ä½É¥İBˆÛÚöI{)„@.„B!„B	äB!„B!„r!„B!„BH B!„B!$!„B!„B¹B!„B!\!„B!„È…B!„B	äB!„B!Ä=ÃYë/p¦ oÀ¥1(gÁèµóÚ”'mMğğzh¯‘JñÑ
ŒáLn‚#³,äçĞAyM½>ËvIÆÒ<P×Åı©\eËIB|d*K0æû ¸ÆêLxQ¨iƒú]m–ó%„òYÏ|åxcN çfm5”¶»¢ğp3üò8°Q.*!ÄGTXê€¯½É÷'Nr¸¼È€.¯±êÀ¢ÍöØ;~ŒŸhÜÁÕu€˜íÉÉB|èr#Ğ÷·0wüiĞ…5VgÊƒ‰:ˆwÃúÏCãCrŞ„@ş!0ú&á·¿/ŒBÁ\‚×’ €c98}	Î,Àï}
İö!Ä‡¥¬}şcßKüñÄQ.øÅU5åZkŒ£A‰Ñ Ä‰‘·˜)eù×İŸ’P.„ø0›!rãpæ`ñ8Us¹ÆšLãCe
fàÂ¿	Íû¥Îân²ææ`r	~÷øÎÈUa|«xuş§áìxxSA!>1üíÈşdâç¯ãkÛ .ó—ÓgøÃ×©˜@N¤âCQZ€ÿ‡W…ñµNCáôæÏRg
!üvñx±şæâx4<??º Ù²\\BˆGO~šƒSg9ççï¸×>¨Ëœ:Ë‰¥q9‘BˆÛÎ0{f^¾3ëÌ¥0ùT²r.…@~›¾yîÎ>¢sòE¹¸„ŞÅq/Î°ö†§ßšÃ•,'çåD
!n ×0ùê\^ãV3¹s¯†!$ß†Ò@ÿÄ|D¼>ZF_
!>$ÅR–áJş}ı£A™laAN¤âö×™ÀÒ wîoò!ğå\
!ü6¶”•Ò~TËÈÜ!Ä‡GwnwOøÀh©.…àÅäd­"!î&‚;Gvğ$ßûŞAÎLä‰e¶òé_ø»Ò×(mËEúşúã	¬ë`5øu;ùòçæş)9¸Bˆ»!;9ÈÁ¿ûŞœ²°8ğë¿öÍQwÕ ÿ2=¯=Ïs/eÆ¿ş°Ë‰ğĞÏüs>½5rƒ¶Uq4òú1hßga¤—·âÜ…IæËEcM6Ğµõ=ğ ê,YÑ]	ä÷ò/ƒ‚ü,g^ûùµç8xzœ±œb×cqûòõ§ÉàßıÕİë´¢A…‰‡Ò|öÒ+%„¸KUrLyÿüŸ¾Ëë¸¸dßÈ/ë««YMnz„û;\p¯[|¦jëiö¿–ã*„¸ó›Ç¹ó|ëO¿Îyë—Æg˜˜-4ñ"4Ô¿À¶æŸşü/òìƒM¸Ê…@~ïeqŸìäçŞü!ÿä¥ssŒfKT€{ÃçZ3>ÒCÔR(ÇÆ³¯š ºS×€Bˆ›4¢šÜÜ/üÕ×xA»¤mÀ\¯ÁË±”]`qÒBEÁ¶]Î;óœ58ÏK!Şu‘ÉÌÛ?ä¿õ2Ç'K`ÙÔ¦´Xš\6Ïb¹ÄØø(ãßf¤äOş2OoOIÉ(„ò÷! ´¹öØjÍÍ¦÷KÓ|ëßüÿÃK‹`4¾…ºÅa’†  C±TÇ§¿ğ»»‰\1áÈÔt‘©‘{2BˆĞ&ÜşÀ¶¸SÆjk‰şW¾ÆW^.Pcßì5k´Öp<6ìı¿øhÓ;ŠOe»l©µ¤(B\§İ1árÕrKY`­ÑÎT(h½à±]­4e2$-ÍÒì oÿèeïY  }Ş~î%^zj;6?J«+çX	äïEÉ@Ö„^kåsˆ*H)ÖÖxƒ1š\©Ä¢ªãã›Sä²3\š©Ü´]7¦HvÁ`+Í¼×Í§¿øe>·{Ñ÷óKf~˜3ÃóxÔ5u°®).ï!îö ^®@¾…êJ›1/üğœ0œ¯Y†ÙKoğgøƒXÆ n4	²R¢PÌ±¤À‰¥xèÙ/ñ›_Ş ×€âæEƒ_ÒTæ4Á’AW@Ù`Çn½…U8ñµÕf*¯g~å·øØ#óğ&¼ËMdÇ;m†ÿÃw96S!npºoŠù9Ck“ÜBù»˜×37^ £h PĞ`¯©rc§ùä³OğÌO<Â6g”ç¾ù·œŸš'bİ,È—É.†E(í5ÔØöû=”/òÏã+¼äíã~÷_òëŸ”@.Ä]ÄeÈ—Âr°²œo®qâ‘0œ¯Á`næúøşŸÿ_hJÕLBÿØâõ›÷J…R©H^)\Ç¦.Äd!#!ÄMÚK(ç5Å±€òXÀ;–§˜ƒâH€Sgë°‰ÔØ¨µPy+EÍ§ù•GÖÑ–¸ú‹qºÜÅ¦ºƒœ˜YÀ²`b¾@¹T<9çBH —ÊÕ€´‚Ø5Ê±’Ey	ñµQÙnOÿ‹Ã/Mcs#îàú…o‘›£f‘ù1ƒ…tŒ¸ë½ÿ­l’©$1×Ã–å……¸K¹Rº‹e¨a"MDÂ¥ W„|
ác£$<HD×N0×³şşßóçÏSN´óô“O°Ù{ñ7´\¯–,)ä²L+ˆÙ©dTÂ¸â&Å”òı>ş‚AYŠh‹…[gaEÀà/hÊN“Ë‚õ†x“ƒ²?ú—o]ÇõºVü¥‹• Kgc’h\Æ«!ü½LØ³£€´uí!é1Y(¯@nÙQÚ7o¹ü÷¼1·¸Ë…ÁP ?m°,‡ôØşúOK¼Ö,bÉº¶=ÀCî¢]v;B²Åğ£ìƒ¯ÃyâÉÔÄ!â€m‡íhÜ{Ìa8ÏÃŞôÅ$£ŒóQsÍÈ[/óWßx•sK>µŸòsOSşÑëa=¾O¹\d\)Zçxéë_¡øc¥,¼hŠMğÈûh¯bË#„ ü‚!?à/œ‹øF7n¡l…²ÂÀ®S‘&Ca8 4P°]E4³†[=Çá—Ñ;Ç`Èz[Ø³±•†Z¹K)„ò›çĞ°·{uÑUbåï%¨.QşÎç™UÏÏ¯zŒ"koÁ·›Šr%Â9“±…aşáÛCáˆS¥ˆÇâ´6ÿ]?Å/~ùó<¶½N
L!îÉj2€¥UAÜ˜p¢TjbqÁ²®\ŒÈ±Ã¨å8,æ![‚¢¥ìJ0OEÁığ½ûŞæ[ßø&ÿxn‘dÇVùü8Ğ/ëßÎ4_ò± ¿\âç¿ÍëÕ63êEhizMßy€Ÿù_ås;3Dl)L…¸—ißPœòñç4NR‘ÜêàÆ®j/U¸ ›å(ì
£å	Mq2À‰[8ñµ×˜`ßù:ÿÏ7ßf0¯1Æâ¡§äÁíİd¤XBù«0s:Ô×
Û SÁõW¹\íy…«V~sZwHffq‘/Îúf»:ÛGSÈæ™É—)óô\b`hˆ‘J„ó_`_WlÕ¡1è B!_B_ş¿†J®ˆ¯VP¡XÈ‘ËeÑzå—I“M*…¸3”*0µiwšHD!l»ÙxmË‚¨‘¨­ö˜g‹á0÷Ù\øy&Î3ÿp>ôB?/şğ;üõ?ö²d×ò™O}‰ŸşX;nväæ¿BŠ%
…
;[ê‰9
0øÅ“KE
•C#C10™#şïÿ%ÏnH 3w„¸·yy<,‚"NÔºáJê–£ˆ·;TfÊø³†J“Æ‰¯¡„«5•Ü8o~ï|åÿ¯L”©`Ó´i?ÿÙ§Ø×”“.„òÃxÁ„+¦¯®’ôª•ÕuÃ‹ae´Õÿ¿Ìa‘zGLŸQØñ6ş¥_à“Íib TX˜chä?~ñ0‡¦Jh]áûù=~ê6´ßGÃå+Ágvìu~ÿÿ3ß¨ñV–ïğ+ÌRê¿ÿ¯‹ÿÛ³.ßëˆ&kø­ßÿ~moLŠT!Ö|%iÂ ]¨„íe*
µ‰°Gûİ¾•
ÛÆL*óùğ{—üğOÏ	{ÔosŠ3>ø=şä+ÏsÎ³ÿéŸä×~á	Ú"~öÊÇ®´”«Šåx-›|ßy4NÔU`4¥…)zû/qúäqš¥bùô_|‹¿şÆ1ûí¤¥—\ˆ{“	WUŠ'iá%«CÔoVpÇ-¼z›Òd€_Ğ˜À^sÉMPfağ,ÏÿıWù½?;Ì°Qh£Ø´çq~åŸ~‘ŸûÌNÒ–œv!$ßHÑ„CÑPg…CÌ—å,è°ËX×z>„Á=aAÍªçWÌèğkyÍÑ")‹hÓn¾üë»¯q¬Æy¹í?ñßÿá«•45œäĞùY~ö!h¨[}" x~ŠŞÆU¥Å¢4Åm,£™[\d »2’ Ú¬ğµ¼™„¸cªÉå›¶f½¼ŞÆ{™Æ„‹Â9VøáÜâ¢ïÿşB¥@ßÛÏóÕ?ø3+xÔtÜÏ~úÓlòŠ,Ì©,dÉ—GH)t¥ÈâÂ"ó~”h<IÔHk7ÏşL÷;ÿY¥N<ÿu‚ßÿ3¾7aã•KL;ÁÅÒ£ì‹K âlAèB¸®T¨[½9§ÀI*J“`J`|sëÏ½]í§ŸcäÄÛüüøíœ#5Ìú)¾ø¥ÏósŸıIÙßATÂ¸Èo*XÕ»\º+Aİpã¹àjÕÑˆª•B2¢`¾øƒ»àlGšÙÿ²åÏß`°TÆ¶mÆòøÕ¥`¯ÙÄÏ=÷<£ÔåCã_z…ÿíÿ}‹v¿ú¹Ïòì¦º’²lZÛ¤<â ¬pw¡ödO/Wû÷ Z;~KÕœ	‡¿çKáªë¥
˜j¯yòÃYy½¼´Èéï}…?ÒÑ˜D”Ù£?àk§m ss\85G«@A~ø(ßüºOsCò§Øİ|ƒCI³iÛ^Ùù|m4KÆ1”üy²€ìü(Ä=šÈÁ,wBØïò>fµGÜèíån,øŒûòïş/ş—ã9šİ
S{øßÿÙOñÌ'ŸdwGBê:!$ßjqyıó†çŸw×ı"YY­]ë€º¸‡}EÑl“H¯ç±O¯¿ò¾Ç©YşèŞâ¤ÛÂı?Å³O·Ê»Gˆ;µÍŒyĞT†è«ç~Ç¼•}Æ¯¨µBu‹´B9\ÂŞöd4Ü&-ê}(y \Îƒe¡.¼ÌÿxüGèå½Ó-‹š¨G¼ÚU9Äÿúo°çÀ“´ï¿q ›Lsùæ#(+I<*—‘÷rjya{¢‹f%œß]¬~ÔG<Ç¯<r„¿û£¯òœÎÓbW°»?ÁŸüæùÌ“÷Ñ”t%Œ!\¼çâTkfN½AÍNötÕ\9%¾0ÄKÏ½ÆùœÂ°˜ßÈÍµ$R7ïÅÒ«V)6FÆ§qg”*Ş7œC¯n]Vö¡R{¼#Å0X¯îé^Ş«<[‚b%šàZŠ…wOrcÀ×T¬°Z®‹ºWü[¯ª,ÒQ×^^„Ég¼·É M÷Æf¢«~+êÜç½ÊÁ£YÒ¶Czs7d¸º÷nóiWX
‚yCàì[‰¯ÆP™ë';¦°>Âu‰ŒYàğw¿Éß%®4ãu{ùƒö³|îã÷“‘1êBH ï;‘“ë{™ß{î[léZÇ¦êb6Åì½OóÊÁ“Œ—5F¶şÔOğÔ–.<9lBÜS´ {´#n¢“Ñpoñå`«†îÅB¸'¹² [÷!×Õñ–®n‘–Œ†ßËªNù©áçB0¦3|öwÀôï\«r†ÊÌ/ÿå¿åK1LKÄP÷Ğ¯ò×ÿö³t&bÄ’ †ìd_ÿêsZ6³yã:cA%ÇÈù¼yøoÌ*\j6ğÙò² ›÷4ËU¸‹ò”¦4àt)¬ì4c&üœÆN(Ü:ôÎ÷òê¡~&J”¢¾<É[?üÙ³±¯*ª5ÑõóùO`c£+'_	äâÖ2y‰So½Áo¢6!bCP)3Ÿ/SÊrhíŞÏóóŸb÷Özä^¨÷XŸY
{¹aÏ¶¥À²Ã•ÒS±•`^òÃyá%¿º‡YYY}9ˆÛÖÊĞtcÂŞõÉÅpÈ{C*\äí6R¶C¢¶Äu¾^19jbNøÚ +’ ®¾ú¸·Ò§e|æÎ½Éß½~–L2JÌQ˜  —+°ä´eSßÔÎÏşÖË—w¥n¸i‡âîg»ŠH›MeÖPG
%º,G½c*¥ÑP÷É„s›,Üš¶ò2S£ô.æÈ …Wœâµ—_âÍk¼,])Ñõù.>ş1#'^	ä÷|Ì£Yªh,­Ã!ä×j¸5Íìïnçtÿ,VÂUï’‰ºÚ¹ï¾|âÙŸäÓOv“ºÅß	*ÖÀ£{‚ª‘¦¹C*ÄŞœà0“{¼SÕnÛ
·~¬‰C2ö’/ÂocÂÇ¤¢ï\°Mkğu8}±~nkeQc4”
6øæ¦KÒºu[NÏ29¿È¸oĞ(b‘(mlëŞÄşg¾È/}¼›dDna
qÏSàÅ-"¥Á€âh€Ÿ3Ä»œÄÊ‚¸AÙP(OnÆ"ÖàÜÒ6i·Sn~‰|¾H¾²²bqÿšõKEšµAâ¸Èïyv2Ã}O~ÿ¸³‚RÑôµ‡š+Ë¦å±/ò;©]œìíc6W¢äkn´†–®nöìİIgí»;õÎ–Oñ¯~÷Sr"„¸ãIA/”¡âÃ\neXz2º²wøòåÉ(øşÊõÕµ:Ş-ÂR1ü;|¨«¬ßôŸëÅh}àÓüŸÿ*mUÛEüŠ×åĞ±m?¿øßÕ°ûÔ%¦ÉUS»íÅijïfÏŞûX×Ç–«GQeyŠX£C5T¦5ş¼fq¾Œ³°<0y}yÑ7QÄ[ÂÀş‘Kuğ©/ü”n¾&1¯µ‹Ú˜ÜŒBù=.Ò¶•g¾´•gn^~bÇèŞÿİû“'„¸º‰€Xš­0HçKa¨/„¡:D4ÜşÌµÃÇ»Wıªğƒp~y¾ºÀ›¯ÃÇEœp±¸dõùê£/<T†İŸùEvß¨°%Y¿ã!ÖïxH®!Ä­7§—·2³S
* š Pm[\…•PèœF)Pk¤êNm‚_Úş„œ@!$!„øèB¹èd4ì-ÏÃ½É‹áPõåíÏ–WN_â¹R¸*{¡¼ÄcîJ_ŞÇÜÈ G!ÄİMW¦¾ãVD¡µ¹¼Ü†²€@‘½TÁ~ŞàÖÈqBH Bˆ{—!\¨­\	{Ê£nÌ‘°×{©î\)İÙRøXYàmyhzÜ‹ºá0u¥Â¯-åÃŞõ5ÒK.„·%û]0([á¦-lïíÑ`EAÎ”äF¥B¹BÜã\Ãb¾ºÊ:ánË+§»NØ+^òÃÇ,÷„+ÕçV»}â^¸"{Ô½j•uÂÇO/…qSá|t!„¸ÛTï?êŠÁN¨ë.Ô¦,°=E e-ÇM!\!îù*r¹’œÉ†:÷#·Tuµu;²^¬„Á¼PÃv´Äc^õÛTƒ¸6áqÕ èê×¤w\qw2èê¢hNB­Ü—\•¹—›Áås]1˜ŠA¹Ò6
!î¦@¾Ü¦ d`õp¡Õ7"µ¹~qhV=&Xõÿ}S}ÈfİBˆ»#«pñŠö„gKáğôå^ïå`nU{Âcî;Ÿ¿Ün.¯²¾¿ÇrzÌWh·¥áBÜ¥Ü7è|ø¹°À@P2F|*+ªˆµÙ¸);¦ÀS
ãH BÜUÜSà*(˜ÂÏ—ƒºoÂPn€©
ªÉ™pOŞåì^1àWRTO!ÄİÈ	‡š·Ô†!:[¼2˜Ç¼p{ÔÇzçpÁÊ|ó\¹ºG¹·²}š„q!Ä]Lû;m,OQ^Ôäú‚¥j½¹ş¬&¶ÙÁv(0åj OÊñBÜm<m…c„Ê
×Y0£piTª!|uáê*H+	äBˆ»‹m…=åÉh¸}Y¾ºˆ[¾ú»Æ‚me?âÙä+awíğ±ñH¸0œ%A\qr:ÖŒåù€ÊŒÁø+¡p3AÎàOkrç*xÍ6`CP6a})ë»	!îš@PaïLÉ|°Ür IBÜ¥,†òD$ä…åÖ+áGÔ‡®Cø÷bu>¹g‡û•ÇªÃÚ%ˆ!î!Æ€.‡Ÿ—'Â^q7cëpğAÙPˆù”FÊ+ó!µ/I\q7r€ˆ
?îhš‰³ÌÑùğ^¶§šùÉ!aÓÛh†yáÄ¹²Æ0Æ¡}Çfvmh&şŠ \àÕ—‡ğ3m<°kÍÕZÚè%N¿q’‹•ê”zE¬¡}÷­£1á¡0T–Æ9v¢‘EŸÀ@²}3¶µ’Š\Yl—ç&8qúƒ‹Õ¡YÊ"ÕØÁ£»2Ì?ÅÛóµ<¹{#™šZ›3Å4;÷l!6u‰£gFXÒáùrµlŞÖÍö¦ä¦8}¦‡óS•ËwEâµMì=°w|£'˜°¼(m¶°wS=>“ƒ}»˜cûCÛiOz”‡NògĞáÂ˜(İv²­6ÁÂù#¼6X¦¹k#nm¾üF={ŒSó1ŞßM­¾¾Êâg{úèŸ.âkp}˜”È    IDAT)ºïßË&gs§Ns~6W'PI·òø£[HËVOâN£TØËóÂ ],ÃR1ì/”Wã9áüğ¸^u¾ùGªÂìÔ%Şzk”¼¶Nª†-Û·³=ÅÏ-Òsúg¦«ïSË"ÑĞÌ¾¶Y^sÄ_âROg‡('§cãfvuÕ±z½^ºÄ‹‡'ˆuíäÑ.#½>6I±ús•ãÒ¹ëlÛË 0Ï…^zÇ³”°"q6lÜDK¾‡W.°,µ²ŠQÄëšØûè6r3œ?×CÏT‰@C$ÕÌÃm¥ñêcm¦xë•FsÕ6İRx©Z¶uob}&£ÀøÆÎæáRõ†µÁxu<z`Ş4?~y˜Hç&öoÉ¬ú¾9Î¼uŠ•á‘ZX¼p‚£ÅVöïè¢1Q]œÊ¯ĞìmzU»÷´‘ïíádÏ<åjÏŸM°ùÙêNsêÔYzçuõøÛ¤›ÛØ»k#u”fÇ8~æ"Ã«~—¤›;yto'Å±¼Üæ+×¥®¹•İëi’Qkâ£n2!\_¨zéÆ68Dmœj'ã(vÜ¢0à£‹¦º7ù¹vMÀÜÀ9Şî›%WÔKÑ°iûÖgğOğZï<¥ ¬Ÿ´gÇı[énõè;rŠó“y*:üà¥3üÿìİwœ]WyèıßÚí´éE£ézïÕ’,ÛrÅ¸€!ˆ!òŞ	IîŞ”û†äRn
ğòB !±M3Æp‘,Ù²dI£ŞGmTGÒ4¦Ïœ¶Ëzÿ8£Q±¶$Û’x¾Ÿ>²Gçì³Ïsõ<k­½Ö”ñ#©ÊO°{sÇ;’êüªMAU=‰ùc¶¡+VÉSËğã=4Ôïå@ÇùÊÉ)eÑì*üã{©ë)`ÆÄZÊbƒ§ëõqd_‡ÛúIz¬ã¦etqN&Nû=ÇvñÊ1‘cG1iD6ì¨kàdwzèœ4 ƒ€ìš©,âäÎÁX7§–ìÁ6åìéÔn¥+€iQXZÁ”ñÕä&‹§ØØĞF:«œ¥³kˆæ|İÍì<ÒÅè™ã)‹…Ğn'dK××¨¬bæÏEIVH–<‘!ëì×‘›•äĞİ,ßvŠ Ğê£åÀvÖ´ƒ¶Â¨ŞfÖmŞÃn…1°#aËdhc¡  yd¿Ú|€Õ[p¼5~>ö’âÄzVïoÃ‹*¼äY6®YÃÓÛšèKxéfV=¿†_o;I—ia«>N´u“|“m:¼xwîbKG2q"&NØÆ±C(¬[Ïš“=Ä}ğ:÷ñÂÚœJE)ôv4óz]m‡á¤8²}3O¿º}]@ºŸûw³údœÀ<®c"` çur:‘ÆŒø´ŞËÓ«6°±1øôu´°¶îI­5^Ç1^ØrˆÆ„I(jbGl"†BiMÓ!}u3Ïn¨çĞYoè}u<Êš=ÍÄµúÚyeùJ~ôÚ~õy(;MÛé“4õBŠs¢~ë›{p'bá„ù ‹½0Û™Ş†çÁğÜÌÔöœ”ä@iäÅ2+®_‰¥Ï@_«6¦-áâØqlßÎÓ/Õ±@¤œÚ·›µ§ºH9&j ‰•«ëøUİQ ©.öo]Ïã¿ŞÆ¶ö~´•âô¡}<ùÂ:^ß×Š{aşš<Ã¦-ûØ{&xôtdÅÆãt»~&VEÌ¡-ÛÓİmlzõ_±‹İq°]ºÏ6qâl#dãD-‚ŞÖoÜÍŞ~3lrl¬.ê7¼ÊÖ£Ã°".­ÇšéÔoUÓôq`G=¯éÄ(ğ{8¸c+O<µŠÕÇzHú™Ä³ëø~Vì=E§9S£6‚Àïb{İ>ê›û/9nŠSû÷³v+)S“òÛY¾¦Ö®ş¡G¸nëÖíçD·O‘æLÓQ^ÜvŠ4'bŠ˜„,ğıİ½‹Mmıø!“ ·‘çWÕ±r{#iÀèáÀö]lëJÂ¹¶$dcĞßİÆúiJ¹˜ƒÎ¬\±–Ÿ®ÜÂÁNO¾«â=eE‘‘&N‘Iöd›héùb|(«s‘b“ì	6áR“P©I¸Ğ|ï§«ë‡7¯áñç7òÊÁVLHÇÛ8Ú2@ÊƒDÛ1Vm:@£oÆ6›e`àÒÒpˆ—w&Vè —=uëùùÆ£´õC8d
+‚ø)^ª;È¡nŸPÔ$RªC»ëY{´+³I*ÎÉ}»Xwº›´câ„3y¤xô7àÅı­t§În3¯-•Ÿ¾¼í­N@OK§ûãC1ÚóìÚ¶·Ö³æ`í) ‹°cá„Áëkä…ëEM¢!…¡RœÜ·Ÿ×´‘y©$§ïâ™çÖğÒ3$MM_Ç	–¯xç7äÜXQª³™õ¶óÌ«›X<9tYã]ílŞ~”Î”Kà{©{Ÿ¬®çh@(äÑÖr†Î´‹l~'ŞOä\_Â%SX6¹‘×ïçÀ¼Jªû;ØvÔeÑü
ÊrT»ÂtBÔLšÍc3¿>Ó<_A[÷tR>a:S’9Úz†IU#8·~ˆ2LŠ†W²xá,
‚N*Ö­å§N“š^J8yŠ]Í“î¸Ÿ&ÄPøÚ d›—é¶9q
·/&fR¶aRQSÃ’ÉÇxnsóË-NoÜK[VSAXy€B…ò˜5k:£$&Äøîc9ÕÉÄ*…BS4j·ÎNN(ÓQáĞ`ç0múTfVäáOËåß¿·‡#§Î²¨º†ºh1ıpN!“gÌcI¹&Ğ`Ù†Ö "ƒÛy’ûRrËXŠÌL1b¨Ì¨UïáèÖõ¬ì-áÑÍdtIKi_cØ {@i‹ª±¸uV5ù6 l7Kan›`Ngå:ı|ëXs¦NcJU‹k6ñç±ûÄ £ÊL*GcÉ¼Qiò~ù¯4œ¤õÖ*"ÍGxqMãî¾;Æ–’m;{€ı«ÅS[R2¬˜IÅæ—E]Ô“­s†±pÆtjJ2QÖ0H÷Ñ¸oÏqøàÃ÷3¹"ÇPA€2lswWCoÃvN5ö3|êî¨ÎÂ1’]mhècÒ-K¹gJY€?Oc]f‘<eZ•æÎ…c MĞ×ÄÚW×ñâªLøø|JãRÁğ
æÍÇØ˜&@a[&^Z¡ŒLÌ{ã¯ğçVŒ‚â‰Lãöw÷2²<›ïÔaè–ÖŒ D¨ür–ÌEav(Ó6Yà&lªÇObéÔ2¢ş²~ñs¶kâÌÜj
 p¨8•ÛÆ5A)›Á‚ÛÎeÆô©L/ËÃğ¦ÓİVÏş¤M…”.M®|SÅ{Ä°ÑR]¢Q¦ºlhT&8Yv­dû^‹İÁ¯6'4u)9·œˆm@(‹°m(BÑ<¦ÎšÃ-……ešô‚Rdå—rË‚¹7âŒ¾ï¯=EïŒ*FMšJïÑ*Åæ#Lœ<»Æeƒ²°Œ~”2.îÇÕ•£Ç³dÎH
LnæIàÂ¸”bß¦m¼z0Î¼<ÂÒ²(¶©ü eÛ„ t@ºç Û»ó¸eQ]-œí¨¥¬,‡1S§1*pé>‘`cc?S&Ogéè(Óè>ë€ÄÙ³ìX·ƒæêy|ö–Ñ”dYà%ioXÏ·Wî¦¼¸€¥ã†R˜¦C¾ÓÇúºíÔ”/dT(“;åA‡%wÔ,>¹la~ ±S¾>âÒx"—àzûØŒ5–ju–º-œ9±Ö‚QŒªv~ê¤Öx‡ëº¸®‡œïju»±»Ãaêô1Œ©qğøYÚ{/-¤Je
_­!¡”r"d“âäñ£t¸™Ä1²1Ã(˜ïy¸®G:íáú™óPÑáL›2…	ñ^z}-¿<ÓÎftÔ¼è£g[6!ÛÆql,4ú\—±‚Àó‡ëùÁEÉj°æVA€6MBáËIkàynæZy~fÖÁ œâBæ-Iû®4œèº¤ÇÒ§·¿•»Ó,š5†1UùÄB!'D$&d]xÎŸ«ëi™†$n¾ÂÜ02‹À]ÏMÊÀ¶mlÛÆ	[XJqé ²R ”G Á‰„	%ãtmàTùfW—SrBdåæ0jÁ$
Z›i=Óş›³‚ ×ópÓi×' úØ¹½™ñsÇ3nä0²Ã!BC$&ì˜¦…cY8¶™Ùúİ²qlÛ2±LƒX8Éştõ¸hÃ$	aÿ¦fÃ4qìÁøT8’iãFQÚu’ıqoh'OíƒqÊÅõÎm?ò::Päåf1©ÖbÇáâZ{4ìoÆ)(fTeè‚_ğnpQLUCm"
]0›HgÚ’ô¹¶äâœ-;s}Â‘,†•LàşÉĞĞÔÅÙ~ùzŠ÷<ì`Xê·‡F•)Ì¯‡bzÙ]’3öî_XM~,LØq‡ÃDCÖù‚Yk<×ÃM»¸®O ßğ–2ùÖ8‘¦iaZcãØJX–mÙØ¿¡ÃÂ÷3ùl&‡
Şø"}ÇÙyè¡‰óXVGVd0FÂ„-33]ûth$•_Í¢	ÔMêèd€sñÃÁ±ÏÉ¶ÏÉ¸(_S$éè9Á–Öî™RAEA4s]¢9×Ìeqn{[ÏröÜ{7#ÌºcÅg±aÛ©‹fSeh“Õ´´4s°ÛC+ƒP(„-ë­ˆ7!#ä×!3g<Ëfæ{k6ÒQfÎ¼Œˆ^ÿ¹)¶®x–Æ×Á·r¹íö¹Ü2®;OĞ+eBM”SKl[#íµTçäŸ{6gN³¾Îƒ.NµÚÜ~[-±˜ƒ¥'òàmgyvÓşåGX|Ë,L¬¢ bóÆ6D¡—í«VÑTgaÚ5Sğ‰[ªÈQÆ˜‘Ùü|]#Öøù,“uqïO¦³³‹V·ƒ†õè^IMy!è^P&›_á;m,Ó¢lÔ~ÿq™^L¿İ»öÒİhÒ~¬…ÈØ1ÌšXƒ“.•8ÛÊògÁ¦P€.å#/`láàIV#*&S;ò%^ÜÕHù°\´:_»~'§¼,¦ÇbD/ûËò¨_ÿ:ßİÂ6
ÇÍåswŒzÓ'!Ä;˜{)ººº9ãt²kı1R¹eLw ¥š5°Nuîma_ª€¹'Qêy´õ$6<‡hÌ¾(Ë¶ì\òIÒ“L‘Â—é¬°;NğøÓg‰Ú&N¤€;>xc¼.ÚúÃŒÈŠ{›¹W$/™·Î¡}õ^¾ó_˜¶`wNª¦$/ò–{Ğ£a‡ˆåÒÓ§Ñ9™‚·åèA~úãÓD€ tqßdbo%Ğ@VÅ#G`¬9Ao¢š£‰m'|J¦ÖPcŸoŒæƒ|ï'§pLƒ¬Ârî~ğvÆ Êğ9Ù°Ÿ5‰&Ì®Ó0+X8},Ã€8 —­+_æäÓ
1jú>¾ ô²¹Ù=]©´|î…xûú8Ó—BQş¶§Lö·óâSO³ÁÒx¹|ô9L¨IîicÃ¦­„“ıœ:™bÁÂDŞnÔF™>û7¬çßê·aŠ¼±sùÓ%e—ôĞ›t)*u™¢ }š5û6m£sBÄG†yöp7‹jÊ‰e½Å|LûxÉ^’yEäGcb[–EaÉît:S<)byY¸ ìªgkMÕC¹ŸÂ4³™wû,N­ÜËÓÿõ$[gÌàÎ™c¨É\ö})ÈÅõ”XŠòic±ú5:££][xqBbÙLš»„»jP6ùùƒ%N³ãXI{‰ã-ttB$ÑÌ¶nFWæ“;¸š…—NÑÓŞMû©NJf/bAe#óq¨œ~+XÙÈ¶İlß¸†£gçóñ%c)šoÈÒ´67ww* l*BÙçJ÷ôÓÙ¦¨,Lgo½.yùçGRŒT/¿¼–-YÙTäş™“˜Tt: |Ò\>4­˜£pÂ¹d= O| ÅÙ®3Ô”ğ±û¦1æ7´á¼.]Ä¬M`D(Íœ²¬ì<FÏšAısÛÙtlUC÷Ë+ÀÂ& Ğ¿ánŸÀ¤vÚTî›TJV¬%Å¸ïvÔÄêkã¥ÕkÙ’ŸMIA÷Ì›Æä,…Û•y„›tèlcÏ‘^Fßq'·ÎAÇ;	M:pñ×\.&i\”˜)8ÿ×àç•òş;¦PYA6E9A§…©\­ßş½‚F˜²Q3ø½‚Æï;Âî]ëøöñşø¡ùŒÈzk%¹ëk<_rÎ'‡…•Ü}ÛtF„t8—XØ‚·|v„á…åŒe;º’ä´œà¤ÎâÖñÕOß/®â÷L /æ`ZaŠ£ Û„xš³Íì?šdÆ}K˜_sÁFÌÚbÂ¼9Ü92iÎ)är#øZC:²L™÷)Ä03¡çã+.;ûÆ‰ä2çÎ%ÌÈUv„’ü™–¢İ4}}œinA×Îæ–1eä¾íï£F5S§ğ¾)åäZ`fb¨K¾û¦‰¡iÏ»ìÄÆ£êq©pÓiî¥=°i?x˜3ó«–•óÖ:35 ¾ç¢ƒ‹#w Áõ4¶¥.ÚPDY6ÅSæ±´ñe¶ìÚYìŸŸ	 L¢eSøÈ#¥ìß{ˆ-{÷ğ§;øäóS•)ÊB
ò"½4ó(Ê¶	²²È¿ô·dXä¯bTÕÅ_çã'hèÈªhçåº³(åÓ³8²¿ş1åäæfÄğê1<øÀdºwÖñ³-»Ø1¼5¹8Fæß³‹G²ô
*êøÏ—öpbfùÑœ7~X´IAI9µUEƒı¹l°£{ö±µ«ˆïÇ®Wv°bãq*ïGÁàã‚P!Ë–ÍgìğbJs³°Œ‹3®pa)µU%dµ™=§€ÅK0%ÜCş¯W³|ı†ß3²ËåF(JIY%#/èp½(Ğjƒœ’jÍ<ÍO7×ÓO/®.LÂv1£³öĞĞÖÍ”‘ÅäØo–*òŠK¨­®¼‚ÆHqmh¼œaÜ{ë,&Õ#?';Ï†¾§&#§Nç9Å´o_Ããë7³}Ø,,sÈ)/f`ãišfÔP	z›i
å2+çüJë:"…"‰YZYã‡²Q^ÁˆâóóhRN6#K<v4u±`L9‘ğÛM½L¢UÌ_TÎøaßüåAÖŸÎˆÉÑËvH%Á §ÛÎĞ­àş\khvS4;ŸªÊ
j#ç¯YÚ»ÜÑŞ(«8#Â¼~°™œŞ3E£™:ì’ä:œGmeùç7I@&cçÌá¡‰a¦mxŸ­İÊ¨¢Û˜QÍäÀÚ  ¤œQÕl–’¾è½û±›ì`O£ÏèÚ\†eÉ'_\qŞïğùçRYElâ`çD¦‡ß<
ÙQJË«©-xã¿Å†àş÷Ï‡Ã;øÙ+{ÙX6Œe“Jˆ¾İ<H+r‡QSUIÁ¹$3=pq‘œ—OQVˆİÇÒ>e:ÃC—¤ú½-t›!JOmcùI…™N‘•îeSË µÅ9om¦’"–]NUr[»Q%lfNÂíoaÿ“Ê11r­çd*BáfÌ›Ìáå‡¨k6èŒ‹~QNlÓæ3º,—'Ÿ^ÇÚÓS©Ê‹¾ık%¤ ·ƒŒár3oákìõ`¢ò&£Oo{'²3+u:ÑŠráà±vúsGğ™»go™(Ğzô Ï¼|ˆ#=c(Î9—œj°ÂTOœÌ‚æU¼¼~?5ÃfP?É–6EqQ”—æTk/‰pŒ°a\æítŸm¥±)MÄÓ
SX”Cªõ8ë·5S»èNÆ*¡¼¯™o­ÙÍ¦ÑÃ¹wô`Bi8SŸõÆ^B¥Huád“OÌÃ´É+ÈË$œZ£ƒ § š%·cÿÏ÷ğZe	Ì.zÓsR	Î¶µp’Ì¢n‘œB
£—TÖFŒ'1óØk¬8Ğ¥ ±œaÌ˜UÌ›·òëT“G“òéí \>‘€RšŞÎv›r-2
Š‹È’@+ŞÕ<ôº¿­20Lûê"¦fXa%yÙoOƒ€ÀÌfìŒÙ,:²œ¯×Sş9”VeÆ¶5¼°Æf`j•9ŠÎ“ÍlßÑDÙøùŒ)who9MÏÀ §wŸ¢ÇÈetU˜ÁÉÖé~N·¶ Ü °³ò)ËÊaÜô‘¬_¹›‚8SG—Q…Dw:¿†Iå—+¬zÛ9|¢“P^Q+ £µ‡d`‘U—m+ıœhj"HÇik<Êk{z™»äVª#†Î¶‰şšš[E4“œÂ‚Ì­8GwO'[´Ö˜á\†å¼Y»VHeY)AİfÖôzÔÜ3šBuñ˜¤zili¦7fƒ2‰äsAG¨¶ò™4gs¾ÌŠºC¿:ù™Aè>ÛÊ‰ÓIÂ¦Â´Bg®’âL['tœtg+GØmTğĞ”jò%ÎŠ+dGyã=¿73çj–ôˆ0jÚjmà™éXFÙ°,ˆ÷Ğkg\e¦÷½m­M4&Uf[Æœ<
²Õ`	(›aµYÚÖÄOëöR[šÍ„aoäwpgÚßS—²`j{–ïàÙÕ.3ª‹(É±èïÀ)+§Æ<I}K’3—ñ¡¹™Û½N6¯«cå®“ô-"ùíKc‘_TÆ¬ñ{ùÅë[0’cW–×ÓÊ½û8]PÍ’Q¥D;‡gXä–bá¤&xéÍY5€&ğÏ°gW;Na>Y¶OóY:Ó!*CFÇÅõ_+cKac÷zE5,+É¬.{-uÁ_C|7Eı†×hß¥@L˜Ïƒ5>§;)·€ê‚œÁa‘¼ÊáL.ŞÅÚ#]L/É>¿p`F˜9yßÎò=åü~qkÖ#Âğ|’VwŞ=—Ú¼è›®©›¶ĞSoc*Evq%‹Mf`ËæåG–³BD&ÌaÑî_Q·©ÑÃç`©Á³ĞúÍ'%*EÓŞ­<yÊÆ2 ”WÌ’e·SuÉµÈ-ŸÄƒSñƒ­»_¹€ü7i’İ¬_ı
ûCè€ªù÷ñÈä‚¡ëzîxfV	‹ç¡¡©‡cƒ-ƒáD3ó~ßØÉòº-ìŞ&+„ó¸í¾‰Ô8€ò9²s¿8v [)Â±"nèNfæI¸ïh8›ÑvŒÃés•«fˆœhşU‡Kı[b)ˆcşmcØù£ƒ¼¶«”Ï­å¾‡ ºn'/-o$R$“£f/àÃ³FQÒ<u„åu‡8är÷}‹™”£†jP³«™çWõs0m*&ÍãUS>~×»Y±a?Ûœ°B[1fßQÉ¤ßğ.üd/‡¶ldOÂ"¬ú}›i·/æÖÊğejxŸö#ûx¢ëAàcVrë]·1ud1¥Ğn¦Ğ?{º‘å/t‘ej´3÷»¹¥pSÜ³“ÇOîCÑÑsùä¢Â7i|lªªJ¨Üzˆ:«”GÆæ¼¡ãYiäé—:2ícÊìùÜS~ñƒTÖpn¹}$;ŸÜÇÆQÃ¹µH¡”Ç¾›éÜca*EnIwİ7Ÿ,Fº‹Õ¯nd{ÈÄ`ø¸I<ºxå…Qùâ‹+Î3sj!~˜÷~û±+‰udMë*ú0£%cxøƒ6ë^İÄsË“Fù.•³—Q[‘É‘ÒñnÖ¿¼š}öà,—[qÏ”Üóœh'Æ˜q“™uh/í¬ bñhòÂçqù`üv8”MœÇ§ÃQ~µr?İcQ5I»ÙÜşp´5qz Ê­SË(Î?·Td6c«N³ißAê{&R_>©¾àV,Ÿ™KnÃogå†õlµCø©$9UøÈ}ÓUzŠ¾àéÊ‰1fâD–œháÇGCsçØ¶mìNØ* áŒœ¿ˆ%#rIg¢¸4.%ÓŞÛúvh­ñ}×McÚa²#ö5=!/€åàCÏBòFì	à‡wÂ‡gAì*6¤ÖÚ#ŞŸ 0CÄ¢ÎùŞ47AOÂ»hµpe‡ˆYL§Ñv”ì°y>Oò]â‰$i";bHâ±X8Sd{iú)|3D¶ĞŸpñ3]Ÿ(Ã$	gV¦¼ômziâ‰ÔĞÊê¥…Cèä i#DV$”™Š®’$µI8Áô’ÄSáX„Ğ¥Šoê‚¥2LBÑ(v"ôq¢aB–‰Bã'ãô¦!	cé‹¤èIú_#%;lá'ˆ{Šp,JèÜ)øiúâ)|,²²"X™åCñÜ4‰Do°PW†E8%„G"‘xã¹ÆbD$ØŞ´’®O"‘À¶,,ËzKkA€ëföÍŠ„/»…Õ•:–èäŸ-ç{=Ço¼Fø`tÿÏø˜”UrE¥¸ç&éOèÌöÅ×VûÉD×g¨ÔAŠ¾¾4ØYÑ†öI&’$]ŸÌ®ˆ&v(D4d¡Ğ¤“I)­LÂ±(aSét’xÜ;b”Â´CäDLqíeb‡d²7e˜8‘ÑÁsÜ	#%jgâlà»$âIÒ—yÎÅ\úû’CÇG)Ë&	aŸ[4HkÒ‰Üà‚X¨°£1¢¶Ç@o
ï‚ìRY!²£©x‹¬¬ğùY?M<…§M¢Ùœ¡ÏşàõKù]Û	s O8bNfçÀOÒßïb8a"¶&ñ&mI$ÁôRÄiÎı“2¬PˆXÈ–İ,n ½ñ4—ÂqB†ñ[c¦Öš H§S˜vˆìˆsMÏGĞ¾ö~ô8S§¡æOaÄı`Å®æ@>Éx’¤çx+¬P„XÈ"HÅéOyŒ\+ÌP˜XØ$“LbÙ‘Ì¨?˜)‡ìˆƒiÈgñi    IDAT(7A_"ÀGˆİ?äÒß—Â7rczğyŞ±ùÜ/ÈKÆé÷-¢‘0yîtÓÄSÅÓP$Œá¥HºšPV”ğ‹¥y©$ñ¤‹µÚMĞ›Ğ„"‘Ì6oƒ±+Şi¬Ó¸©$‰”7”[vˆhÄ:G?•` åcEcD-u.1&™L’p±¬¶èO’‚Ìu4œp„ˆcÊ¹¸şr€ÎøÛ—á;ûn¼ŞË×ÀWï†Úbùp	!ù»Skà¹–İüŸkØî{û‰½‡Åø8+Âÿ¨\È'+çÊîBHAşä n?4ü Z_íßX×3w&Œı,äŒ”Ï–7‹ë²“¦ ¹>3
²Í£(·x¤şj‰ãBˆw¿°}¨t
ÿ½l3œä¬5ã­(Ÿ>ƒG+fK1.„x÷r¶,¨}
o#×}/¦Îìy=j•b\ˆ›Íu»ÊzY>ü¯»aôVxí¼ÔMf¡·ë)h*ÀÅ¹p[%<4¦”Ë‡Jñ^„#Å£ÕóÈq¢¼ÚVÏªD;‡İ|®Ÿ^MÊ Ò²,\ÄmÃÆó¡²X†Üã!„xw…aÜgàd9tl…Ô1ğz®³sfB=*ï„ü	ò»â¦Ëá®Ç)ëêKÃVh;^òú+ÈÍäçÃøR(’5f„¸é]SÖ/ŠÑÀñD'‡{[I$ûĞw]Õã&áP#³K-Â”‘q!nj×ã”õù	è;}-N\›UØÄ
3£âN¾|„‚ü=(È…B
r!„‚\!nF’
!„B!„R!„B!„R!„B!„B
r!„B!„B
r!„B!„BHA.„B!„BHA.„B!„B)È…B!„B)È…B!„B!¹B!„B!¹BÜ ”\!„ø-´ÄL!„xg
r¥ ĞZËUBüÎ$—Wó´Fb¦âwF 5š+yŠ@k‰™B)ÈSQx~ Rñ;Rkïù€ì˜|{1SkçH~)„ø]àûšÀ÷QJ]QÌ|_òL!„ä—’(…ç»x~ WQñ»‘\×óx»>ç’Qø¸#FBqãpı ßó®¨WJá{®ä™B)È/	’ƒ÷JÖ¸O ½—Bˆ›œÖày>:0Œ+í1”Â÷}<OL!ÄÍÍ4ç¡Ğ†qQùVòÌLŒÕ¸®'£äB)È/‰”™ÄÒ00ƒt*EÊ“)˜Bˆ››$Ó.è Ó4ŞÖLÅ`Ì4M|Ï%)	¦â&¦5¤\Ÿt*…i†18»ò­ç™¦i`™étŠ´çK)„‚üO4,ËBë€x"‘	–r=…7i1>HáºiLÓÄ0Ì·7B>”`š˜¦A2™$JËbEBˆ›¯’®G<‘@)0MëmÏ(PÊÈ<WÃ@"IÊó$ÏBHA~>Hª¡QrÛÊŒøôÇ¤]éÁBÜ\‰¥çôÇS¤RI,CaYÖ/Pd–ia I$$Ó2R.„¸iZ“L{ÄhßÃ2MLÓ|Û1óÜãMÓÄ²LÏ¥?$•ö$ÏBÜTy¦h¬+=À¹)˜–e£µ&NÓ„Caç|Â*;O
!n´àˆÎ,»–v}i—t"iØ¶s~êå•ÄM•)èA“J¥‰Ä	MÄ±±,…BIĞBÜ`1SkMdŠñd*…ïº„B6¶mæ‚W0BN&´më|©5~8DÈ±0$ÏBÜ¨qSƒF“v}’i•L{úÊ¦3Û ù>®ë’N§A˜¶c[8–•¹×RÂ¥â†H,5Aàz>iÏÃs]ßÇ¶,Çœ®~å9C‰k€ëº¸nÏ0-k0fÚ–™Y4Sâ¦âº™v=\ÏÃw]à8öE˜W3ßgºiÀÀ´-lËÆ±M,Ó”<Sqƒæ™ç^]A~a°‚ Ïóp]ÏóĞ¨¡iJ2»Hq#Èl¡	ü ­¬ÁQqë\ç¢ººbüÒ¢<³âº‡ëf¦®†22¯£e^¦âz—dVA×:À÷”ÒØ–…m_Üyyµ1ó­å™™sBˆë;ÏThå™¦adf]mA>-Ñ@CI¦ïûAfK´Lb©%V
!®×Ìr(P*e­ˆnYçp3”âšÎ'×š`0É<—hfbf€tf¯r‰™Bˆë6f[OHaæE—†a>äÅLÉ3…7M™‰™¦yşÏµ)È‡â¥¾èO¦çéBÜñR©‹æ…Ş)—ÆÍóñS!®ÿ˜™é«Ì¬<´ßø;3ÏÅÆ ÿ?<Sqãç™×² ³ yé!Äõ(/÷ÿï¤Kã¤ÄM!Ä3Õ»¼"¥ä™Bˆ›%Ï´ŞT²l°B\·B!BñŞ0ä!„B!„R!„B!„R!„B!„B
r!„B!„B
r!„B!„BHA.„B!„BHA.„B!„B)È…B!„B)È…B!„B!¹B!„B!¹B!„B!¹B!„B!¤ B!„B!¤ B!„B!„äB!„B!„äB!„B!„‚\!„B!„‚\!„B!„R!„B!„R!„B!„R!„B!„B
r!„B!„â&c½SÖZËÕB!®’Rêº9iÛ…BˆkÛ¾_Ó‚ü\C@“ùiÀ…Bˆ·ÑL£2¡ ÃP™Ÿ½Åù¹¶]k=øgğçÒ¶!„o¿ulÛ•Ê´ë×¦ ×™†9Ö(¥0…¡“
!„B¼Õf´Æ2E°¡ÁPÃ0õw§e=W„&¬ÄÃÈ´ñÒ¸!„o³]…@øF)q-
òóu€¯3uÈ21ó¹B!Ş`°öçxA€©ı¡¢ü-‚ ­5~€2°,Ë40L¾´îB!ÄÛ¯m¶í> ’iO_ÍÏ5Ö~ ±-‹)Æ…Bqmø&íù¤]S)LÓšêöN$z¨3 À0B¶…eR„!„×H 5®¯¯b„\3TŒÆ±3Å¸Œˆ!„×–i(B¶‰RJ{àû˜¦9t/Úµ­È3£ã™bÜ$âØÒÑ.„B\c†R8–ºòmÏ2÷Œk|?À´¤B!Şù†ÛÄ¶-ü@. zmVËL¥ğı eH1.„B¼“W¸ùĞt6Ş3nH1.„B¼EyÈ21L“ ĞCíñ5-Èƒ ­”Ü‚&„B¼mû•>1‚ À43‹¼!„âg
Ë4t¦¾–Åø¹‚Ü0lË”‹-„B\w¹fh±PRŒ!„ï2Ë4@C+¡_«™ë™Ùo`ËnB!ÄõYŸ»_Më e˜¦4ÙB!Ä»)³µ¨14ª}-î%?7:iÛ¥³]!„¸.òs¶Ö¥dŸq!„â]o¼·<»–÷ŸkßAÉ½ãB!Äõ\_ØhK“-„B¼7Ş‰Eİ„Bqä™[m!„â=.ÉßãIû.„B\×¹B!„B!¤ B!„B!¤ B!„B!„äB!„B!„äB!„B!„‚\!„B!„‚\!„B!„‚\!„B!„R!„B!„R!„B!„B
r!„B!„B
r!„B!„BHA.„B!„BHA.„B!„B)È…B!„Bˆ÷’%—@ˆwAf &@a‡c„å›'„BÜ¤m¾O:•$é(;L,lc¨«I!ô§|Ó&	a©«=ADWƒi9D#êº¹xßK“ˆ§	”I8Æ±düPHA.ÄMIû‰NºSÁ%ÿ¢0,Š
c˜×èµÜÓùúÿ~’­F9Ÿù“/ğI¡ëôªxôuõĞŸtÑC?3p¢YäåF%`!„¸Ñ[ünÚzS—ˆ2	Çr)Èv®ì%úÚØüìğñÿÚËmşßüÈ$r£W–QhßãìºÇxàŸ¶2õŞ‡ùüÜÇø¼«+Ÿµ>Å“÷ÿñÃCiîxøQ¾ğ‰™ÄŞ¼+€ô@/=Iô/iX1ŠŠ²¯AÇÀ›fLœmÚÀ×?ö=­XÊÏ¿úaæŒ,¼fù˜Rq	}ìûù×˜ó_§(U>-)´ANv6wŞò óÙÛ[YDø¼V²³ƒ¶î^É¥³«¸òtœö3ûyö±çøçö°ÍË$.¤*øú×>Í=<‹BÀëláDGŠœÊ*†…¯M¯µßÛÎÉ3ı„K+³®£z!„7Wãï3°ëY¦}şW´»l‹á!‹€Î¸K< ÊÆñÿşÙŸğ¹»ª®¢êèJ{xZ_eÿ¦£µ™Öî^
Ïö10àBsõ—!H»>ÁeÎOñ¦ƒlØ°œ/}-U Zápï½Ÿáñ¿_F‘i “´µ´’ÊNYAû4àRg=¾Úë'„äB\ÏÊ0)´s—¾ŸÍEa¸‡M¿xg6ıšÉ6ùÒç?À„¬«¥¬1óøÌçKøˆ
Q=¾è:¼.İ§vó“oı'¿½“û?úÇ|yR6Ğsæ,¦FıMÇØöÒÏøÖkšÏüó—¸§Ì¸êâ9ŞŞÌ•Oñíg[yàÿiaJE.„âiúBÕóøé?åÒr¸[ÏŞÔhşÇoc|ve†^w}œ®iR{ëGøAi±â
FsŞ…WÕ¸İÇyù‡ßác/uóşîå³ó'PÒøA+u›3åƒïãèú—øÑkÈÿÌù£5äJe!„äB¼]iÏ£tÌ4–Ü:ƒ²¬4•gêYİ¸‡Î¾Îv×  WÑ2fßRvı^?Î©“yuc…#òÉ‡neqMà&úèìqÉÚlã«vrÖ˜‰i×d${ ©+W³³o0”ãB!ŞÉ‚¼b"wT x4æzì~q»ReÌY²ˆùyÑk?Këj6eà”O`Yù»xt€{zÿ¹±›aÕc¸÷¶»øà­5ƒsû˜P'Û4ğzØùò|mÿjWuŸ¼Rñ»Nk´œåÈñ^’FóGg\)¸-‡yíõ:öwøŒ^ú{Ü=6
É^‘—÷3|ÚÜ;{ùNÀÙ­/ñä6|ZDªæğàâIëÙÅã¯ÖÓ§³˜²ğn–TÄÙU·–Õ‡º(œ°Œeáıüzo+I/ «bK/ 6ğÜ‚€³[_äÉgğµÆ·J¸uÙ¦Ödî©
<—ƒ+Æªî`;ê3|æ½Ü;£‚˜y’O¼Æ‘¤h|?9ï[Ì¬šaOÅ÷}‚T’¤mb4q²ÓÅ«Ç;’M‰ÕÍ/ñÜ¯·ĞĞo1 OğËÇ£iìXn[8úµ¬Ø×AÁ„¹Œì8Èş¾€Ú¹÷²¸4Îæ•¿fG§9ØP+B±QÜû±[¨Ò	NîßÄSO­aGG3hã¥?Á™5,yÿ2&ä(z°vÍ:˜(e’7v)_Z…q.¹é8Æª5›Ø×šÀpB;ƒüãuìéÍaÆ²EL	µòÚºİ4'Ljæ¼û§ç.-»YóÚÚüJîúƒ¥ŒÍ
Ë–Bñ;'@k=¸fŠ&Ğİ¯Üßt”u«_å`¯‰aÄj—ğÉ;j0‡*Ï^ö®¯£n÷i’J¢|Ì\îŸuñÙ]ÛVòÔf\EaÍ$n½m6•aˆŞÊ¯7ÔsÖ3fş½5<ÍÚf p{Û2–ŒN3[^äç;Û‰–OdéâùCùAÏîWøùæ“$<Ö¹µ³Y¶p…m[ùÕúzÚâÁ`ŠcR2a&KLfø[¹cN‰$]†ÂêëæLO}.„l€•5aNoå'?]ÏÆÆ,Fçô³ş×O“ÜUÅ-ßÇ´œfV<ñ:'µÎtnè Êæñ©»Ç“9Wzxœ9VÏk¯l¥Å3P(ÂY£¸÷cs°/î‘@ÓÇö_¿ÄÆ¦~\§™ó³xb||…äBÜ,"Nˆİ/?ÉWö¯$fõÑĞĞË½Ÿú3şdY5y6¤º9ºu-ßÙ‘â¿M}„;Ãsé:²™ÿùøq>W8Ÿ;fÀ‘—ŸàûÏ¼Î+§}ò³”›¤`ÑHîš ÚX»z-ûu9Ÿ›pOĞ~t_ùÙ!FWckŞ íıtv5b£xÑ(r‚êü9¿Xµ…-İŠ¨©‰§¶œâ³ÿëC,¨4Ùøøx|Åfö„(Œšø‰~f•İÊííûxö©gùùË‡èEÈu4}]•T,™Í¥ËØáäSV=ƒ»¦®á‡‡šyü»ßbïˆ"–<òîmcùiº[³iogE@?;7m#—93GÒu|7_şÙ~ÆWí§ŠÉX!½xn»ÖÔñË³væ¾²tŠ.w§S>ÿ×'fï<Å¦­Ç9¥Ğ	ê·n'Ùk0íŞMG6óØ?ü’İ$•…á»$6œ ¿ó!ıàTœæVşâG|ë•t+‡¼E¬n7nËIvvŒà«³f0sœMç‘½üxS³R£X<m>¹n/M‡¶òøc+)úø_ò1Ã’b\!ÄÒ´5nå±¯?Ëºö”é»DÑÛş Ÿşı™äô6Q·ê9¾ñôNš4QÇ+‡Å¡qÜ;;S[–Í¡WäŸ¶%8z¶³]	tÖ1ÒÑl>xë8ÌV¶­]ÃŠÓ#¶¡$ÙHCgŠ®—â!jşò>Æä;$šêùá/v1vY3çô³óÅçùÅ¯^cÕi—Ü¨…vSÔŞYÃÂ¹`4Ÿ`ë†:vwZã¦R¤W C’Ü2Bû·¼}ÃÀ7ŸO}oï>ÃóO=Á¡õkXöÑG¸{|)Yv€—hgGİ^êlÓçØ¾z:O0ú»qS¬m»¤“Iºí}4÷ÿ!÷{“«'÷¾Ê·¿»Š­M½v°ƒ¢â0‹?:‡üËq¥éŞş?yv¯öğá~ŠY£rå#*¤ â¦¢ÀM&èêî!ii,¿—Ÿ~‚˜û0ŸşĞLÂJR˜†ºd›"b(”R@;·5°é´É‚;>Â?=—¢ ‹ú£	u®QQ(ÎD¡p…òGğÑ¯|ˆqFÏåë|yËAêö7±dÊ(‚†5<½j{ƒ1|ñşˆEÅ	ïXÍ¿|áW<±j.S–¹lŞz€şp>ü‰Gùï÷Ôâtekg6ı‡êØ¸ã(ñ’J>û¹/ğĞ„0}GéÈ6Şô"›Ìû~ÿ£ô=û
uG±òä¶ìkdí‚E|üc÷2çıÌ7³
ø—ş’İÁD¾øÆåaBñ6Ö¡Šx6şÇ¿æšlÛÆ6
ùoßş7>•N“v}¼ƒ«øü·—³u×VZÂİ‹?Æ7#åüÇ÷şgZFóùÿóE¨É"èogå~Èww–ñ÷ßúîœPÓ¶‰¯ÿıÓ¬¨[ÇÄYµ”·íæ™gp&wõµÏq_u„şÏğ‘¯Â6@iÊŸÈÒYµ¼Z¿‘ÓGvSß1—Ù~§öìa{¨–š_E,$aP!ÄyÉŞn¶üø?øîöB¾ôõ?å¾™#‰¶oã_ŠUu«™0½–‘gVòÍï¯ç 3’/}ås<0¶ÓMsêĞ	ÎoS¢ñR•|äËaR¸‡şşówÛQ·ï4‹§£Tere†5åvşæÓè¬_Ë·¾øc–oÛÄæ¦¥ŒÈq …a(”e@ËÖu<ıÌ,oÉfÉÇşœ¯=<ÓíætÛ †Òòµ9÷ã¦¤R	ZêWğ¥¿|[NpÏ¤Z
‹{bÊ©æ¡/}ŠÎ/?E]w›·µràäa+˜ÅŸõfŒ¼“¯}{/şëøÓu%üõ_ÿ90§†ü¨Å¾şÄ<7MÊÓ4o^Î÷{+¶sè£©êİÍ¿å~ÕåóĞ§ÿœÏİ5™aQŸ®mûH\h™†fÏ¼ZÇ–6›%ï{ˆÏ¼Q[ºÑ…äBÜ\o*ÅÌ÷?Ê_=8‹òlŸC¿üÿó‡»ùÁó/SYUÆû‡ÿ¶›¢4Mum1OğÚòÇ8ÓİÈıŞCÌ;Œì,ÚŞü™¾ï3áLÊÊ!Ûsû]Óù¿7¯æT[éD'GOÒx&Nkj÷gAÈĞ¸®Ç@L“8ÒFê¡QŒ­ÈÇ>|œÿÛ´}€?xßB¦É&«­‚êâwçŸ¾öœığƒ<rçxj³bDŞ´ı2vÑıüí-³YıÓ—Yô›6ã…gW‘[RBÉ#ó96¦eØ¡!ÇB%sÀ'gáíÜ^•KVÄ4n:A_7ë^á¿_ÅŞÍ€ ólª6—PÈÆ249f8¤èê<ÆÆWdåä;_ùGşİ2P¾GOÒ#êáìÁFbü2ésÏï½Ÿe#
ÈÎ20¦,äÃ•Ëù›îóIEíäÉŒ*ÙÍêöì¯obÄğ&¶n>MÅÒÏq{eÙKE!Äù–™Tú_‰ÎIòƒş&OX*ğèMx„Ëz8±ÿ$±–İ¼Ú—âGàÎÚaäF- Ä¸Ù“Q½Í x—iãsrÉ±"Ìš^¿u?®\0U-;7‹‹fS²É)ÇÒÅù<ûòIÏøc..”=œhjdÿ—ìÊy|êáqD"*2œ‘Ù¥’}qú)êŸú_]ÕJoÊ#1hjí&•J½µË l
Kçò…o£aûZY¾]§Øø5şé›…üó_¾¢PÛO+l'D8ì`š §·»“cÛWğÕİ@‹òLby§9ÕæRr|/?oÀŸú>™3ŠªÂÌBu¥·ÌåÒ:ø^H²aÅzv<‰]2—>2—B)Æ…äBÜ|4 ”a*Ó¤vŞFÿt?‡zúèíë'YzQ[@ 5ét
kh¡–,f¿ï>>­†sììq–ÿløêóÜòğgùÛ?\ÊèßPÓ«FŞÕàñ2»|ht ÑZ‘›SÍ½÷O¢xèq ÃyàTñ¾=@OÅAÎ4îãÉ=Æ/{–O|ñOøü}³øø#íŸØNã¶µ|ã;ÿÌß=1‰ïÿÍ£¼n±7Ù@T)…R¥Üñ±Oğÿ³wßqr÷}ï?§Í™>³3³³½ ‹^X@‚¤HJ$EªR²¤kÅ²-[Îu»Íq^qÜr£¼ÿá8NœØ÷Æ¾qdËE±¤XÕ(±ˆ$H‘"A@”¶÷2;½~ÿØ%° Á"’bı½ÿÀk1³;óÌ3sæ÷|Ïóœsnµ§ùÚ¿úü›'–¸ÿè8wÜp€eÓ à’?w}Ÿíù4šº^,¯ÅÌÓßâwåpfß>}ëû8¨,ğ½{O±<Ûó—<ÿùŸ|<ìx½{[ò1Ô_WÌİ1`Õ§E€¢ª<{z¹õŸ/~duø*>|Å}úNÙ£O3uå"§ùÄ¯K„eBqÑ¨ x¶Å²|è]ûØÑ›¸PƒBqzş¼OÃ÷éÎw`ú¦:úB5şÆçï\_ypù+~­_
Ì÷AïÎÑ©©!ìşÏ¿á¾ô8Å¡ƒüâG÷Ğ¨Îrß×2şc÷…‚b¦Ùyãüî5ïà_úşã—ŸdşÜÿŸÈ_Go×búŞ/ğ¡?~œí;¸í“¤£8Æ‡G™öù>­ `w&I8æ²§¨èõif}ÖZ*zWÅCÁ¨@.Ä[’ª°#Êó7d`!"†N(lâm–UT%NÛ-3zz•ÄùÙÕÓ+iŞÿOş	ŠµÀ[øîwş‘/üı}|ø}üØ§‚ÙTœXD'šìãºÛïä½ƒë§|·‹%š‘0q¥Æ„²›_ø…ƒ4—O³¥ï¾ñµğ—õØĞ³ûC|îk×1pÿCüÕWŸæOî¿‘›wöËm:³‹×¦°\ÀgéÎ¬ÏŸkjŒ®|˜ ˆEBèçß Ù¾ÌYÖ7Ue·ÑbæÁûøŸF¿ÿñ;ù•_EböFŸ8÷œA mEÑ	i¶8¬Uìºîv>ıÎ‘™l‹•ù:ÙŒÏS‹&[Q)Í.Q
öÑNs~’Éú%WyWâì½í WÜóM&Oà·LùÀÜ¼=GÂ”¾Bˆ‹èj†-.å•;®¹•Ÿ½}qÀfy®JG<]È1âÏ²4~Ùê™ˆ	~‹¥ù?ÑCœ#¤¢q:’>+åYNNTèŞ•·E¹ÒÂ]šâÔÙ1¦µn>û™Ïğ«·v²üÌ·yâà¾ä!H€³6ÃX3ÃîÁÄúmFŒT"J<U%F4º^òƒ t¥I£@ ~°Âıß}† ÙÃú¿úñ+°ü.³gÎ2WT5ßÉÕ¬.O1¾Tf{OaÊÓ³(ƒÏ¦|µÄ.~êÓ[=tÿã‰ûøÂ]ÛùíŸ».©İB¹o-¦n0wò0ß®‘ûLüà!NÔ]¶_=À–‘.ÌN•|?]v‘‡ïıw)´*gùö)¨ê²>¯»Æ#_ı>ìé'2°QP|—b6NJÓÎïYÿ±"yføú+¹êîÃü÷Ñ'ùo‘¤}S7(
…“«}âİÜŸâ«s–}Ww¡é`)
¸«ı)‚“ñ×ÉĞ¡     IDAT‡¹¶ßÄP,œ–CO:ª_²NÛk0sìî9§³s{=pì¾qÏ<å Ëõ;†èË©h³¡Acu‡¾{/‰«ûÙ¿5ó'EóñUƒÖâIî¿…öÑ9Rháoº{ØĞ‰DÂØî*|ÿ~rK½ìÚ·…›>z€‘?<ÂŸå;(+ÛÉÆ5§Ær©Ÿûìº†÷óÁGøÊƒ÷ñå}»¢:Ë|ƒ/­(çÛßHäÄ¶İÀûöŞÅï<zŒë|ä—?Ì–|Fö³!„xN D{¹éÎkÙöoÄ_şãwĞKt%u\·ÆìbÏş¯×3rõ­üÂQşõW¿LG¬ÅmC	pëƒüÌGR×(|“‘k®â¦kpì¡‡ø·aPÏ j³HAëçÚÈú•c<úÜÓÜu—ÃÊÑC<jj—?\í²Oãc=ÂÜíóÓ×w
J{‘CœàDÑgàÀ\ß­ ·T‰M½Á‘C‡øv}=×wâº>¾ê²29ÊÃß›æìáÃY°Q’€¦“¾–_ÿÄã|àKò©åé­dÂ>KO—yçoôüIİlÏ#:|Õ
<|òÿş]|s[–Ÿ¾u„¤|P…r!Ş
Ö/R	à™GîáGxXB4’à¶w~Šßùµw±¥;Zïzß­œ]äoŸ¸—>ç3ú?ÿşQ>ı9ü Xå³üá|—vŞğ~îúõqëÖ,æ„ïyØøëKĞ6.‹V°=üàâ6•m7 =·—Ÿı¿ÅÈßş{~ÿoğ™{}ÇæÊ÷|¿'	öÄCüê·Š4 <;>õ9üØmì˜û&_øó¿åÏf,|Zn¿ÿÏƒOŞq‰K6}#J*›dòş¿WÓ‰+
**;wîàóŸûu>vU–l‚½ïâã·äôWæë÷W,®ÜÉï}îVÀ§âxx›^‹K²ûÊıCşİ¿Êî»…¯ÿÊ.v_äˆœŸLo½’÷¾ç/ÜË½_ı"gnáóû¯äà‡>ÇŸ„ù«ÿúuş¯#@ ½½Cüæo}ˆ¢wÿ;ùì/¬Rÿë¯óŸÿÓ$‰lŸüÌgøåùÿ?=wÉğJMsı·°ÿñïğÃa®é!—¦
!ÄÛ~$øGË	Î¯òÒÌ»ß÷Yş$<ÄÿôËüæz%€\¶‹ßøí? ¦†ĞFòK¿¥“ü‡oğ_¿ø÷ü=à§zùÍ_ş?‰nÔøêF¿p·€†ãmŒÖù¾‡ãù/ûö}Š·±zl# ;¿¾Œ=œÛÉOıÚ¿`0ûgüÁ·îæçèQµLş÷ßøßx÷­{øà»oä©Éïñ×ÿÏyúÀM|úÓ×qû·Çùâ¦Æ¾íú·ï|ÑTP·‘ìOùé»- PTZ¿ñùßãÎ}#ôGU³“+ïøy~gìÏø‹ûîâñFø£/üKŞ÷Ï>ÉÉÿã‹üİ—ÿ–oüÿr×0ûû&y° bÆú¹å—~…»GîåÿıwßåŸ=¨àcpó»>Ë‡Q€ Ïöhy>oĞ}ÍûùÅŸâ_}s‚¿ûâ7èJ}š\İ';ÕÅ[†Ò¶İàÇıâò<Ç±ÑŒ0‰ˆlâMZ„}v­BÍö/^z­(¨z”täÂÌ¯oQ­4°\•P8NÈ«S³}ôp‚dL¥U©Ñv7¥E7IÄã„¬kõ6>*f4I2äÓ¨×iØš™ #a¢âã6k›ª&aë-kWŠÔÿ|ÕTŒ(©D#hSª4q7¥zÕŒ‘ŒGP­å†}¾ğ¯Á‰¨y™í §İ¢Vo^ªU'’H]¸Í®W¨¶‚@AÕCÄâüVºå¡™qÒqóü5Z}×¡^­Ğö@QM’q•f½‹J8š$±qF5§Y£Ö´ğEÓ‰¦RDµ §İ¤Vo]h“ªgÎ/5wšujÍöúıŠOÛšæ¿ÿÓÿÀŸêWò…ıs|àÚB ¾Cåğ?ğáßı6ïú8¿óKŸâ`¿œÍM¼¹ÕÛ®İÆ0Bhš¶éÔ—Ç÷}lÛU_ÿPd§•xË°ÛMêõ^ Ë$‰œ?&;À±ZÔj›ê¢¢b&2$Ÿ]28Ô«uZ¶wş~#'UhÖë×E%ÀªU¨XZ(B<Ãpê”ëµÏLt4Ç¦^¯ÑrŒhšTDÃk”)·=Ã$OŞØ§nÕÊÔ,wãXs-% Yëƒª‡ˆÄ5Úå&®f’JÄ0—j±åè¡©dø9ã‚ÀoS.66&Î0'SÄMíü¸É³-êõ–Š¢N¦ˆé6•b7 Åˆ×¡m·q|•H*MÜP »Õ V·6.Åª èa::¢N‹j¹‰«$’qÂ!»Z¢j{ëc™pŒdÜD¾¡„r	äBˆ×‘=wŠG'<†÷î ;àØËÜı'Â?´B÷ÍwòùÏ}„«‡LlËÁ±WøŞı{şÍc*?óË?Ç/}êZ:¥…r	äB!ÄëL–¬!Ş”ßgöş?ç·ÿØ"®+‡åêŒÜò~~ñ£·qõPª§ùû?û_}rbÛçº÷~˜Ûo”0.„B!$!ÄË¦†î¿Ow9ËÖT¢ÙAŞõ¡ÛÙßø%-Æà®}|0=ŒÏpÍíç`ŸôB!„xc%ëB!Ä›,YB!ŞüTé!„B!„B¹B!„B!\!„B!„È…B!„B	äB!„B!„@.„B!„BH B!„B!„r!„B!„B¹B!„B!$!„B!„È…B!„B	äB!„B!„@.„B!„BH B!„B!„r!„B!„B¹B!„B!$!„B!„È…B!„B€.] ŞìÏÃñƒÿ€jhhŠ‚ïºª†ëhº†ª<ç¯ñ<Ÿ@QÑŸ{çËkO°ş˜Šª¡©Çu=ECWÁó|TMC	<\_A×U”€çû ¨hÏÓ¦À÷q}Ğ5åEšø—y—óº|×ó	PP	CSğ<Ôçoëês€®k²'R!Şè|Û»PÛME×TÏÃC]¯¥®ª†®)?±Ú·™çºŠ®]<†ğ]Sñ½õq‡®¸u~si|Ñ6mŒ^RM|œgÇ6¯lĞ‚çy¸Áú,]€‚¡këı¼QçßèŸÇÛûÉV#Ş¤´ßÿWÿ÷ç_Nàğ}UÓ1ùø‹×ñ{¸UgîÜî>2Ç¹™ENœZ ™ë o*œ~ôi&ÕnRŞ_%œHŒ\òyµL<si'D>yU‚šİ¬sä‰1ê±<±g·™'e¼¥SoqøÈ,~*‡¾0Æã.ùè…¢gÕ=>Æ"arÉğeÛÔ˜™âĞh“|.i(/X°Û³£Ü;Ú¢ MhÓ]NÛÂòµ—Xljs³zr”§f›8«sœ.)&àä‘s:#>-;@{	;	^ûŠO{âÎ4I÷¦‰É¦#Şl×Ç÷\4MCUU”W¸ásÓĞ_ñã	ñ²96•ù1¾ûø4g¦9yvEO#—O°rìO–’ô%›}rœ	zÒÆsBZsf”œkÓßŸÂxš§=Ê¿‡ág·›™sã<9çÓ›18óØ1¦´>º‚"O>=‡K‘nŒ;|—êä(O;ôõ&/Û&»^ãÄSÔÌ4¹ø‹Œ¯×¦¹û‰²ıD/ìıÇsÚ./±Ø
Ç=Ê¦ê´V–9½Ô¢/cõøqW’Œä4,Ë%PŞ ;ŞgyàÄj_†´úêí|âµ$3äâM+h×™;všÇ‚Nn½m˜¾(´æ­)øÉ2k-lJ%•êãöŸç1v3 Òi¼JƒëW¨úİñ·*Jœ«®¿ğ(¯ÍÒPuÂQ(ÏÚ(á(Šz¡˜–K«	M6TÛ6¾™BÕÔA`—-üPö’êqöÉc,tà=Ûô/`^Ùµ
¹}{xwOê|°oVJ”ŞHˆÚôY­$¸í@71óVU•Èö]Ü!›B¼±y6¥³£Ü³¤²÷úkÙ—QqjU¦Û¸Í:¥–G$¯b˜in¸)ı|9»Ô&åˆ¾j«Ph)$:6ßf2¼sÃ€ç­Rhkt¦Zm›F` ›b·¿^#LäyÁv*®N:zÑÖ¸Õ6MÍ$yQêX˜àX£“wîË±‡	<µE
É>~í Ég›êÛœ­»„ó1ìj‰§/‘ß½ƒ‘Î7`lèâ=½²Ù	äB¼i< 17Á¡r”ÛŞµÆ"½ı\xeZ”+Írº&›ŠàWËÌ—[Ø¾‚KĞeøT]ƒ®pˆjqÕšOG–íÙ½¬.µJ…•’…‡‚f„éíMÙT [Õ*Ëå:v ‘Êeˆ´ë¸¦IÚ°Y[,R"Æ`"`µî“ÍGq­¡X’Pƒ1' —ß¼´ÚN@[3É…Ã€Ka©H©í `ÆbteUªü
Óó¦a’ïÏÄ£Ù¨²¸ÒÂSÂ‰=IBÃ#ÕÜÔymV–—™,Ù8±æ‹:£mæ—š8¨Ä:2t'Cè/ÑwlÊSËL.´H©uÚY•µ5‡hw‚*®i úUÆ+”Û*“Ë5v÷Åi®­²ØôAÑÉäRd‹ùZ@ÄkRÁ$ßÛA|S›–—*TÛ>h:éTQ¯JEÓ™Šb‹¬´5ú#mˆ× äär):b!T«ÆôrËİŒĞÙÅm4q]‡ºíc¦s„›%Üh|Â¥V­°²fá©
‘dŞ¤Be­HKã5ª´µ0)"¦Fk­À\ÍÁW42)²ºËâZ•†š¡¯7EXf…âUá84c±ïÚ+Ù“Y/F"É¶DÜN{!úÓ
´*Ì×:»’èí6+k%ªN€bÄîŒRh¸Dó	ìV…åfg1scàà8UæçØ( ä»Ò¤Ì;¨]Ûfu¹@ÕUˆvdé
Õ©ù&Ã	Ÿva™–FWÊÄiÛ„Ò	¢N¦£7éb5šhQ“Ø¦äíPl$:€O½Ra¥ÜÂ4İ$×›Àk–¨96¥âçÊ*½2!}}§ølĞÃ	º³qê—xG×¦•,.õúKe*ªÊL!Ì.Åù:-Œhœ®L‚¨~aU_ZaüT‰Š¡cÕª¢qR¡
%×$Ÿh2=W`®ÖÆ.TéI¥Ğf«^ ‰'èMéTÊ-×¡é@ªï’1Ôæz›è¤;Tg©®íN¡7›,—ZdÃ*k®FÔkRt ‹Ó‹£»mVÊmTt.CÒ«±Vó!°q#iâ^“¶¢;­â»Ufç8(Ñ4=™NyªE©—©:™t’\ÒÄ­U™/5°|EeÃ”V¬ZŠjĞİ&ÒeÆ]H âyó8°²Ò"Ù½û|ß¬¹PÇKt’±,ÆÎNSÌn!I›ÓÇ§¨v$I…B(!‡–R§…js‘ÉY‡T:F"8?, Vçğ©z8NÚ_åèjŒŸêJq>­¶êŒÎÑ4B„£"N€¿ØFUbTÎL0ß†X>B}n†G—“Ü‘ÓX¶‰ÆDZM*m-‰õãÊ7J6§‹K¬ÌÍğ£Ñ6½,»ÈÒB†[#Iê¥Ë.dÃ0==Í’¶kRuÎÌTpõ±µ%œñùÈµaZ:=‘‹zÏ-W()öElje&Ëİú(rf¾ÅÈG6
QPiZ”ıqtÜµ~xÂã–lµTG‹¦É†jŒµ=ò™ Ïs©ÎÍqvÉ&–Ñ(¬”™kÂj‘Ï”éÌvÑß§ám
ã‹óóLÔUâ¨¸‹3œKoã`²Ä±¢Éş~‹¹‰Ì\–øÜ8÷®DØÙÀµ™*pã“åéJ¡(!×ee|™z7şÒ$§Z1v¤ÉÄŠŒ>=CÇi¢µeÎÌ7Pôá•E£ò±«Ãœxâ4óÉ.†#.K«Mìƒ»ôª?¹ }YZˆV¹Êd¥JÃ´8ûÌVâjö$¥d!Ä«¡Tjá%{ÙšÒ†œB‹¦£SQ©OOòD%Ïé£L´!•a.^Pa±­IV9úL‰–g$\¨îÏœœc¾™a(QctŞáÚx””¹1,v]ÊÓsœ^i‘Ë%Ğ]Ÿæj+’@Ÿáé¥:Jo©B“³Mv\…¥:^¼“œã2[iK¤Iê®TY²Côu4*«9±Š‹Ö8ynîÜIxµÈ|’Õ&•B‘s–Êm[5¦'–XSã¤›uÆ&Ê(WôPoxd·EQ7-#÷[MÊ-èéTÀ/2zf•ÑB†móSj»GØÛEÛG9¶ÃlİÇèáT‹ŒMUéÚµT½LÅˆsmÌaÜ*£D"ÄLæò2³KM´¤ãÔ9=UYfNŒ2§v²­7A,.Œ¡jËŒÎ7àÙz(Ü¹NŸX¢[İEli… FDYãÑY‹T–t¢Î‰ñl%\šgª	!Ã 6=ÅXu½1¾3»†²ôéŒšÁŞ¶›l¼Å¹±eªzœT­Ì©‰ákzX=9Æq/Nw"ŒÑ(0™ä[bLŸ ˜ˆ“2CxØ¦L”<âi˜™*±¦ìâš¾8!9éŒ@.Äók¹‘Xü²÷­Z‰4¶ëPjj$‡"¬-Œ1ÉsóÎ^Ò†¾Íòä$Ó‹-ìT˜í{†Nçg«½v›Ùs%Ì-Ü‘Â›j0n%/šÇiQ­W±º÷qõ¶8šçpb¹Â‚­‘‹w²go–ˆÁÌa›pº“°Vñ0:ã¸å
MÇ ¬ntxíZBybõ5k°gÏVFòajÓj~˜ˆåRsöoàÊá4õUÎÔ©ÅçxâœC¯GÔ‰ríp„P³@Á7ÙqÑú¸¡‰L–ı#y3§yĞêàöƒƒÄ‰PşáËN7¹ˆ¨!ƒD.Å®±wÆè*A<CÚXXj£f¤5›d4ÉàÖzSGî}†cv‚mø‘¹ù%´hš={èØTájÎ\dÚLĞÖ	›®‘Ñ5º—'yä©2Wïb¤'Îø£çèÈurÅş^Ü•)~4ã²6UæğXHw	U#–ë¦7pÊRÙ6ÒÏU[;PªcS£ìØŸ™ãè‚BŞ%ì'xÇˆ‰ª–)ûa††z9q8iMáĞdb|jÏ6nß•ÆÄ§´0ÍıçÑ²)RÈl$oHBˆW‹åú„"qP›„ÊÕ6®‘EceÍ"Ş™Á«/Áà•ÛÙŞ±€âÙõP¼\ddx€ıé8Ñpø¥‰yf[yn¹¦—x}‰RµFTÛ4¸Ø5
AW’‰ÀÌd“R¥ÅÙp'»vo£+¥25‰e¤ˆé!
këãÏv©\ŒMç€	À¯(a²/h±8±‚ÑÑÅµ;ó„ŠcŒ' ç,Ô<zûû¹nÏ ö”Í–[8F…GIùXôtgèÒjLµ ?Â¦ãÄu¢ZŒt²ƒm#CtÛS|eÁä–†èŠµ˜=Ëx¥F»+JŒõ¿‹u§éÊÔéºª—®ò<§½0†Akºî!¡„éŠD°â½\»5ÅÄÑã™sì¢é*=Ã½è^ƒZ`²cG?û¢&l›ÒØOÍo®·"é(ûº¸ÿğ;3\»»—Ê™5”p’=û†èÕi&Xš­ã,Î3©%èŠ›(‰öçtjc.¹Ş>®Ş7@<XfÚÓL+xs<úL•Î¡€¶£1ÒŸ #Zç¬™<¶¤pg<m[,.×˜Õ3\·³Ÿœ©âX%~xÏSFCŠ‘ë¢7F“ò.$ñü V9]\! ›‹ j°f…¸BÇuËÔ0ÈÇlJ}I"ÏÎn»>^ÅÃsTÔv˜LÜ¸hé¸m¹k!òƒ)Bj‹“Ë5Ôè %%ŞÁÕ×mãØñI8ÑÃÍ;TJ–B4ââ›a:"Ğb­ÈëxA†a¨G¥:ãêHb˜›1s|‚†J2› (-ÒĞtw„ñ=é™:z÷ –UÃæéÏ§ÑÕ€–`ÄbTË°md„|E'7ar5İI6Øè´…r-ÚçAeÕ&Ñ‘&n Mˆ¢\øu×¢^ª ‡»ˆ¨°Ô°‰ÄÓxBÙÓéÈ&pª4]CÕü5Vİ×Ü8Â¢ &‰xÀ¹)—ìà0İ©‹YVÕ¢ÊqÓönRÍ0éˆ‡ ÖBoW)™[Ée¨j¢e×µyR¦Ë¢ëbDÂ”›‘Ş\¿-BHW0#QüÒ2V¸“m]èš‚S°°Ã	R¶ÇJÃ`ï¶Avu›ªA&f`MÍâfó\3'\]Áòúµã-•Ş«âÇÌÛÔíñ-}ìŞ’#(„b1!©ØBñj‰›:­ÕU|/8Ø¦jäLôPƒB[%™Ri»5ÜDœgOì…6ÍP„5ŸÈ¶a|ıî€•Å6‰¾.R¦ËÒB…’GÕ7p­›äwíäÊéE}j†w\ÙÁZ+ sYòunËD‡šm¡ÆhzscÜaàø.Í¤#½hd¬Ùèé^â–ÃT²Û“„t˜©àšı¨~@É5éßÒK4Ç#‰S]]!Ş·•[w$AÑˆF#DKsxfšNM¿èÄ¯õ–M3£è•¹&j¢›ÎX ~€ï)˜†záLäA€W\¦¤„ÙkBµíâ14M§ĞÈ÷¦ñ\JÉEï‹ u
MØqp;catU#7©.®¤óôç7…qÀs|ªõKêmÜDõ]"KÙU‰æºˆ“-…¡ı½t§œ¦…«ê¸ªCËìæÀHù8¨F„¸ærÜ	Ñ7ØGÜT`É¢‰I…ÚŠEnp+ïÚ‘ @%‹.NQÔRÜ²5CFwXlúDc~Û"ŞÓI,¤>®W¡ÎpğàºĞÃâa]¹xÍÈBñ¦Mäû:	ç8<íáyµùENLUh85*¾AFwqi F"dc>àR+»Ø¶‡ëùxG¹¥qÅ>òí"Åî%Oâº¶İ¢:µÀ™%ŸŞuÓ.oŸõË\1¡U(PtKÔÍ,ûö÷c¯˜.Ô©øa†²>>U,L’šMÍ¶	¥4ÔM×ó©Y*¡P°­mÓ?ËÑzˆ\Ş Ò® çLB‘€ÕÓg8ÑNpÅˆë¹8¾K(#3ÑT…rÍÂŒ¥Ö×¦×¢Ôö‰Äü ÜÀÇ±šø~›‰éUª‘ò!óÂ—ƒíb×="†‰I‹R[§gPÁSjTƒdZ¡j¹ØZ„@Ñ|›j9J:%1ĞiP±²]ús&=|Ài6qÃ‰D”DD'hÔ™[$Èvqe¸J¡İÆõ*T“¬•B…“ã»âdbP«WHÄL’ñQÃ£e7	¢&!S*u›d¦‹ PpGñ‰$¢¤c!E¡´fN¤«Ğn;‘‘P—jÉÅq<<?@QªC‰‘JDˆÊì¸B¼ªR[3tk«<2fÑ¶=Úµ:§fYhY4„¦ R¥FŒŸ@ñ±š­ÆÆ¥9ƒ€RÕ&ßÕÇÕ½07¹Dó’çğŸv«N«Tab´@¨Ï$½(>ƒcKWš,U
Í
ÎÀ5{Ùî.qxÆlZ¾O>­Ò«ãÛ¯ÓÒ¢	eÓN ¨ÔÂÑ$øà¸6máÍOst¡M¦7‰¬PP"d»êósœ˜·ÙFİj¢Ä£¤ãaÂ†J£i˜qÔ‹†ñ.-§…RQ4p»İÀqJågWMºÒ9Âò&®%…KÃqˆåŒHƒµ¶JGNÁö}Ê¶‚
ªbQ,„ID£¤baBªƒå´0Ó!Â—œ©.€çÔ[|ÆØ9lwğáR¹ˆE“ª™ŠcÙœyj¯#ÇÎ4šÂ†B*%Vñü*eß ™Zß­ĞhÚ„’9TEÇ%À¶Zh‰õ~
*ÕrÂ)b!Ï÷©Ù:‰T]q©W\,k}<®åa5c¤“Qbæå.“+ÄO\öL¼i¹n$éëq8ùä9œçÌŠEÏ`®¤Ëât‰U›l^aòt'œbO6Âòä4GÆ˜®ÂPÖgj- gÇCg¦*ä³‰óŸiCĞœ"OeÚS&][säôg—˜[ÌÏñÀc“œZ¶èÚ¹-•zïØ–Bõ×/(d;TJ‹Î-¶Éu«ÌŒi¨*QÓeâä
t§É™*à».ÅùNU5z†’¨õU]dÌ	3ÖI÷æ‰û&Fç85¹ÈT#ÌÍ7o§'¦c&4æÎLóôÄ'Ûæøµ"g8ánz’Šv±Pbzv‘ªÙÃ¶ág&yb|‰E·ƒ›öv‘]Ø®íV“ùU‡DO/™¨Ca¥ÀØd³/Jm|™G%×)ÍL1Ö0ÙÒÙÉ°Zãğ¹iNO,2ßÒÈx>+…]½D/ùÎ0’&ŠUáÄé9NN.1]p1‹L‡s\±¿Efª	ºÖ–xl¾ÄÜÜg—šlÙ¶…}ƒ)’*õ…%œ[äôÌ–kuJ3 Ğ,¬2º´†Ÿìe¨;`âÔ4Ç'9½ì°¥+ÎÚÊJvˆş´G±\f-ÓÛ™gDopttŠS+Ô¼û:Sx…9~tn3S«Xñ=19§›x=ÈeÏÄ[²º«QúûÎŒsäÜ<§g‹øÉ¶õšÔ×Ö8~®N¦Wgm¶ÄBUa[_Ñâ<ŸåÌ²Å`ŒâÀ¬    IDAT§ÂÌb“ÔÈ0Ã™õùEšj”\b}\Q a´8uv–³Å:¶§;Ÿ¢+Ù¸™O«9ËıŒrt¶]ıìR,“Cr.cg‹è¹$Zsã£5Òİ:åÅ2Ó«¹|ˆ…3‹”u“lGs#ü6V—9½\FËäéJÕyúø'êÓ4½]t…}–&æ95±ÀèŠÍ«FØŞ'–‹Ğ˜ç©±NÎ”	Ebt¨6S³3,ĞÉPFß>­Féñ9İ#ÛÒx‹süèìc«[¶maOÏ…U ï±4µŒßÆPÚ§Q¯pîÔ*~W·Xfj¶I´/…5;Ë™’MGª“]q˜šæØÄã‹uŒp¥X%Ü‘£/i^ô>ª!•P4`rS½M—çy¢æàõÃDu‡¹%—XÃefa‰33«œ›]ÅIõñŞ«zˆ%U´ ÂSÏÌsrj‘¹f„µÂ‚g×–&àÔëLÏÍ²¤t²c[ŒÊä,O-ğÌlt2ß¬Rw1”3pİ*Ë¹şFÂ
«Ó3›g¢¤°»·›¼SàÑ³³œ™X¤@Œ|*"Ç‹×î{¯m»ÁË)Øc£aCzQ¼®‚MŸàóãÇ e}•v\rûzÎÉb.YÕ}ñã¯O´^6x=ûüÏŞ·ùq.úyãï7·'x¾Ç¼äï.mïe_óóÜ¼P»7õ—í—õË´ıèŒÇşkFè?÷µ\ôÊ%í~¾~Á÷Q9ßİõãÒ‘#<®ŒğÑ«S((ÏyM—¾—{üÍ}r¹ş{¡v]®Ÿ%¯ˆ×S½íàÚm#„¦i¯8@û¾m[ ê$¢&ª|ÀÅëZÜ7-îR._K/Ws^êÇöÅjÔ‹Õ¤jÏåêöóÕ!…ö¼µiS_\ô÷Ïó/¥_<w•ïŸ%wÃ®L]¾}Šrá¹_Nı¼Üï_:ÖªNóğ‚ÉÍzH†µçï\æ}xÎë½L?½hÛ^Á¸EˆW‹C.Şü{•.÷­¹éËô¢û_àKVy±ÇW^Úó+Ï÷³òÜß¾‚¡¼ÈëS”—Ş/åw_¨pé!“>ƒTøÇ{-?îXş…ûÑaµ‰£l>¾ıÇx¾—úz_IŸ
!„xµŠ;/ø]ÿj×œ×¤¶+/³¶\¦/^ê8àùO%ßŸ§;õ"íS^|Lòrû|*-³#ƒnh/©O^°~Ì ıJ?CBH B¼4â‰ö&^ïvød‡éíQe¯µBñ
©Z–ı{_ÿÚËåØbJ"È…âÌ¤o0/İ „B¼…bH&Ÿ•no{rº!„B!„B¹B!„B!\!„B!„È…B!„B	äB!„B!„@.„B!„BH B!„B!„r!„B!„B¹B!„B!$!„B!„È…B!„B	äB!„B!„@.„B!„BH B!„B!„r!„B!„B¹B!„B!$!„B!„È…B!„B!\!„B!„@.„B!„B¼èÒB¼>|»ÆÜÌ<%_ÑHtõ³£Ódnb
²½u¥^ŸÔ*pfl™ª¢o÷6úLeıv·ÊôÔ<K0;÷’24y…Bˆ—/X8ÃdÉÆóA5"ôõÑ›‰¡½&p©–9w®ˆE@ è$»ØÛ—Ä·-fÆ'ğ2½léNKhâ'DfÈ…x8õ'{/?pœÙºEeå÷=1A±Õàè‡8:WÂ}½×^äáûñ—ß|Î4.äôÕy~xß½üÙw¡à¼ÂÖù•¹3<zr†5G>B!Ş®y<`öèùÊÃcÔ”6Ë“OóŸb¥j¿V#Ê…3|åîÌW]š³Ïğõ{ŸàlÃÃ±ZèON‘R-ÄOììâµO¼,ÏãŞQ•wİv+û;ĞÜì/ãª¦Âë:÷¬ i
™˜Êø‰1ÊÛ¯"ÅÂò
…¦J,¢¿òÖ¹ÕÉcü`u½[Éò©Bñ6¤€¢êdò½8p€P>Î]÷œb¦<B>™yfÉÌ\ûöîe„€Ñ¯Œ2ÓŒ€¢©¨2}'„r!ŞRšMÖÎ.ß{ÛFòÄTÀL30’ Q+£¨³gNğã³Pqğ=ïå¦Ş…³ğ­Ã+4lˆîäc7í!_:Ê\"3eal?ÓÏûo>ÀÎ¼ÆÂÓ‡ùî±Z$³&ªÑÃ-·\MOk’G;ÎÉE5ã†wßÌÎĞ%µ9 s÷ şä4£¥«¸>Tda¾Nwošbe#S·‹œ:ô÷O·Id#MŸşëßÉ-éY¾öıs„¶ãœ=G)»…›ûBÌNs®¤³ÿ]·r}˜¿yd‰»Ä—0?ûÎİô¥%•!„x›ærEAÓL3LL÷p|Ÿµ©#ÜûÃ	V[Fª“›n>HŸ5Ã÷.ñ[×'øÊ7ÇH^s;ïïmqøGOÚy€İñ"‡y†³³£‡›o;H¾6Æ÷9‹ª(4SÛøÌí»‰šúæıø”WªÔCY
Š+ï‹¯Ùç%ÄkÌq=Ê€®x„è¦-PÑ´õÒnP‹uqã­Ù—¨rÏãc¸~@2·•÷~ä~æÖİÄÆNr¬\Ã²Ì,.QÔ¶ò‰\ÃÀÊ9Ì¯R\8Ã=?š$yÍÍ|æ#×³­½ÌD¹ÛZæñG3™ŞËÇ>ún®,ñƒ‡QxÎÈ@%’½‚™ããËK5¦íC¹N’
¾GùÔ#|kZç¦½—;¯ìEY]bÕòğİóókZ	n»ıj23ó•3möİt=W'ë<zx¶äÓ3ôì¹’Ÿºu½)	ãB!Ş¾<×¡Y/21s–1½—ÎâYî¾÷Ü7ğÙOŞÎÍÙ¾÷È	–lHy‘ñ–Emj–±R‘‰™yªÍ*c%Ó]åá°ÒŸúÈ-\LóĞN°ä¶Y<·Fdßuü/·ï!Ò7ïÀ™>Å—şáküå}Ó$wm%¯ÉYb„x­È¹¯1MU‰†<Î5,¬ "—Ô¼@³k “ü0n÷I?»FÕoãgxğèÓ¸v‰e›tàãz(ÁÖÃôÄËlëSy°a3>]bAïâ·æè0¶ïéâÑĞX­0?³ÂØÌ“4Ï(~˜®.ë9­TQöíHqìÜUB(Ùa²©/ãûã«¤ú®çÊŞÂ­<Ãıq–ƒ×h˜ôo§/S`gošz7™®AbÃi~xÒ¢­é„4UÓ	*ŠÔ}!„oWÇÊÔişşËÄ"¼û{ÑÖ3¯ôğ‹{»HGU”ı»Iüãmµ›<L,×ñ&l»v˜ò¹qNÔ8ÑzÛbnnéµÇ¨>£ƒ£3«bàwt±7› e^²>Ğú¶ññdkx¯ı¾íä3;¥8!\ˆ· 5¦s8Ïê±IÎteØ7$ä[ÔZº²hEAac	™mQ±§øÁİSô¾ÿ#|0_à[_” ØŸ•õ­(–í£E5Tß¥ÑrñuŸj©‰Cº¡¢‡\sÓ-|xg!¯E¹—i§¢iD‡vÓığw9TÛÊ·eÉ¸+çï¶mc9>ZË¢Öp.äy”õPXDcıĞøõEq(
è\ô:„Bˆ·E#?¼“Ÿıéƒô&š
…º†4¨ÖºÂíZÇ0%ódsiÎçØj‚wß>ÂÄ3÷qüôÓ“)£…’ÜğŞ÷ğ¾á,ŠÛ¢n»4Ï(Êzm¾\ôáp”x¦“\Dád¡;³òŞ!\ˆ·âV£{Ûn]>Ä}÷ÜÇä~Ò~•Õ Ÿ÷ìÁ÷¼õ 
¾ëª(J‚¾ŸÙÉq/-ºì Àu}ü`ıçÀ÷p¼€®¡~vŸ{˜»~ŠƒİóSuĞÌLûövòõGŸâ‘R?&uÊ‘a>|Uß¦ø‡¨˜f»Gb«¦Éww Íø¸ª*ïÙ~ÏIî:ä1¨™XsèR |\×ÇÛÚ¾çãùÏşÇÇõM#ÔÙMèØÇFÉìÊ“Ë4B!Şfğ}@Q‰˜æù“¸åG¸nüw:Â}aVgçéÚ{ÁLŒp3=ÂBß{Ù¢ç²ß™ó¸úê©\Œ«vóŸ$¶§¼nºŸ=¡ ×õ.Ûky§>Ê‚ZàœÒÍ-ûz {}<àËÛ$ÄO’Ò¶İk~*<ÏÃql4#L""Ç~
ñr*°U/1¿X ÒöAQ‰uäÈ­]Òyúr	ËsÌÕT†òx+3L"‘
*±î<İ~™sKé!z›ÒÒ<+Z†Á®Öê"s…:^ ^ñß_ìâSwŞÄ¿ÄÌÂ*å–‡¢‡Éôô2˜6/4Í.11S$È³5Ğ*.1oEèëË¢—W˜,8ôwSl–§çYnøDÕ
O>…síùÄ0Ì-Ôˆtoa0Ò¦°¸L-¥?“À]cª¦3´%Ö®0;µD=”ak_§r!~Lõ¶ƒk·1Œš¦¡¼Âc?|ßÇ¶-PuQU%â5f')øq†‡ó„7İÕ*-1½T¡éÑ$½½İd#*´KLÎ°â}lï4±3ŒÕLzúzÉEÀ©˜^(R³|”P„|oé ÎÌr›¾<©èæ¹ºÔ««LOW° •x¶‹-=IÇfqv?™§¯3!³xBH B¼dÍ%NÎ{ôä‰´xğÛ÷3‘¿–O¿ï
2¯Æ;ğ±KSœ®¤Ø9£|ö)şá)|òƒ¼£?|+!\!„/Nvv	ñV¤ÚÌ|’{rQ|5»“;®ßEÇ«8¾vİOÜó#î×lGeûÍ7rE>)a\!„Bˆ—HfÈ…x+
|ÇÁõ@AQ5B†ª¼šOábÛ>ëÏ¡†¦"sjB¼6d†\!„xó“r!ŞŠ#dşDg«UÇËWˆB!„/—œEI!„B!„@.„x­x~párdB!„xÓóƒ Ï“Ú.Ä›‰¬7âmÈv<j-€x$„ihÒ)B!Ä›˜çûÔ[¶ë3¢a9Ï“È…o(A -Ë¡e»øÁúôzËÆuu¢aıŸJ!„¯=Ëñh¶\ß‡ š–ƒãùÄ#!4Uj»od²d]ˆ·	Ï÷)7Ú´l—xÄÀÔ5BºF<¢í¸”êm\Ï—B!Ş$‚  Ş²©4,ÌFÔ40t•DÔÖª-,Ç•B¹âõäz>•º…¤b&¦¡£(  !C#3ÑT•JİÂv=é0!„âÎªËöHÅL¢¦qşr…º¶ÊcaƒZÃ¦Ùv#Ë…xc’%ëB¼Å‹uËriYÑK'smğ}Pbë…;3iYÕ†E8d5uTYæ&„B¼¡Ø®G­iaè™¤yş3ÛhØ€¦*ÄÂ!]£Ö´°]ŸxÄ@×d>Nˆ7Ù"…x‹r=ŸZs}¯x"º(Œ·£‡NİP/]Øg1’1“–íPmZ²„]!„xñı€†µ¾D=j$£ÂxË‡ÆşããŸSÅ`è*©¸I@@¥aa9Şùû„¯?™!â-&ÚGËrĞT•L2rÑ	]š•€:Lñ	 «bså²]*ª!]#“ˆĞhÛT›ë³åáv~œB!^{¶ëÑ´\‚  7	éÚFİ‡ÕzÀÎ¸ü—“>Šóu—ß}ÿ?{ïd×™ŞwşŞ“nîÜh4r @‚ÌqG4ÍX¶«V¶J’W»N+YÖnyËU[öZåİ­Z—?X–½¥İ•´¶âH3#i†8C9Ì$AäœĞ@ç¾ùœó†ıpn7@ç¾ÍÉ÷÷Û§Ï½÷<ïÿyŸ÷ÿg×ZG€ë8´åÒTÃ˜r-"å»dR®c÷æ,–•FÔ#¹ ™1¥qáúi
©`±Ü-hm¨Ô#"©É™´ÏT]5z)æÆMºEã¸PwÀû?ï±i·K¾ù?jaL5”x®C>ãÛÂm±ÜE”ë12ªãû®ë.9%AkM…àx²)Û„³XîL£×B‰ï9äÒ7ÓµcıšgJ¾?`ØŞb\ÃXİ!”ğ¿<êñÈ—Ü”åz+Êõ!—	&…½Åb±‚Üb±,H&‘'‚dô<¸-[¼<ªùàG1£—¹&1oó\—Ê˜!ª¶<ærÿ§}Ò¹›ñXjªaŒÖ†lÚ·™å‹ä‹åCBiC¥¡´&ø¤‚›ßu¼|Zñ—%çë°±]à
Rßs¯†Ëšÿş>—/ïöèÊŠ[^·ÆD±"xdR>ö+o±¬vdİbùˆcy£•z”·¥ü[ÍØGï=S0ä;Z&ÿ&äÛQ]pi¿¦8ñÈW|òB$gÏ
n@-”+u2)Ÿ\Ú·™å‹Åb±,#a,)VBß¥MİbÆVÏ”|ûŒÆ÷as‡Às@M	Jik»ı×ŠeøÅÇ<Ö¶$µ;1|ğ=I¹JEK6°“pË
`wÈ-–0ÚJÕˆX)òé€”ë.™Ñ0zCóö_EÄhéˆF­¥ş”o­ 4lpÃ£_è½ÇÅqo
ÿH*Êµ×´äìšÅ²’Ør‹åã‰ªõ˜j#!%ÜL=1Àå1Ã·Şyáºa]› å3y<M)ÒÉùT³·ëãšG»ş‡§<6´ß*º¥Ò”kJZr)|ëÂn±XAn±Xæ.Öq¬(V#<OĞ2ÍâY+ìS¼õÍa ¥[Ü26 ŸŞåCy\óÈWîyÌÃn}«Q£›xs³X¬ ·X,Màvqì¹Î¤ØÖök~ÿ­˜ØØ!n›uNÄ
®—«Ò‚ÿísë:\qkí¯…1•0&—òI§<û°X>$lÌbùˆ¡¡V¯„dÖiÎJÂÕÓŠ×ÿ,ÂZoã³!:«¿sğÅ˜zÅLF¤‘4 r)ŸñJH5ŒĞÚæ§X,‹Å²XŒ0VŒWB Úòiü)b¼Ãûÿúµ˜K6wİ)ÆgÃwa}›`42üúó1Ç®(êòÖÚŸM'1j•zL©ÙèS‹Å
r‹År;±L²Åë±¤5—"—¹ó,·ŒàâÉ;‘J	Zº,´É- •´¯v¸¸Oòö_G]ÑhukánÏ§‰b=¹cn±X,‹ea(­©Ô“8²LàÑšKßWz£døÁaÉ¯¿&É°¶59/¾z[!ÿÏ^Œyå¤d¼~kC=å»t´d (VBêQ³f±X–;²n±|D¨…’jã9ùìôdqçÄzQ’Nrí3ïŒÏ4²~;ZÁØuMª Øõ3>vº¸SºòZÊµˆXi2©†S«}»,–eÇ¬[,}"©¨ÔbŒ1ä3Á	)§5ß9(ù«‹šûº-iÁlúx¦‘õÛ®G¿¶Ëåçw{¬Êßù³•zµ–ò²S¢Ö,Ks±.ëË]N’-+E&å‘¦?×‡†ÓïIN¾.ÉäÙÑ”³İí½N’aş|LyT³ãiò\¹ã
Ù€z¤¨E1Riri›Yn±X,ËLc¨E’z$	\—LÚ¿Cğ¾wQñÇgK†İ=šµYİ™|ã”b¸nø¥‡}Ö¶Şúûsißu¨†1¥jH6íÛÌr‹e°;äË]L+ŠÕÏu“Â8ÃŒZÂñ7bÎî•d
"ÉŸCŒÏw‡üæw?ù=•QCÏ}{ñ“qø)H•ŒİERÒ’M‘òmÏÏbY.ì¹ÅòÑDiM±bt"zÿVsÔñĞğúIÅŸWàCKZ0_ãóùîOP—0T6ìiüÆSë;œi†j˜ì–gÓI¼ª}<X,V[,k‰Ûiµ“’1ğ™FÅdd8øÉÅ’B‡ƒŸßïX¨ Ÿ,öŠ¯ ı|Àš{Ü[Ä¿ÖI×"®Ån‹Å
r‹Å2Q{1î:‚\&¸#b¬¿høÖ>És5]mPH‹[¨ Op£lèõà·ö¹oµsÇõÄtNR®Gø®K!Øg„Åb¹Åòñdb—Y*M!à»îÌçÀCÃû?ˆ¹vBÓºJÜr¶{¹9$çÊ+c¥á/{l~À›Ì+Ÿ(ÜRkŠ•0iÏx6×Ôb±‚Übù„¢™ô‚É¥}2Á­ÍjmàÊ¨æwŞ’Ñô¶9d±Ä^Œ Ÿ¨Ûı%ƒ©Á¿øŒÇÓ›\ÒŞtÏ	C±"¥¡MÎ¼Û'…Å²4ì
Ùb¹K0&1w)VB´6´æRŞÌb<¬ö~7¢ÿ„¦}õÂÄø’.ä;™¬`ÿ$G^‹©•§F£ï:´åÓ`¼\'ŒÖ¨Õb±X,Ÿ4”NRªõ˜–lêÉ±Z‡¯(~óù˜³%Ã¦ÎÅ‰ñ¥ ¬iøyø·/Æ<{TRï,Ú#hÍ¦Hãå:µzŒ¶ÅİbYö€§ÅrWkC½aî’ÜF±A‰(öÿ(bè¼¡mµ@¬@kMHåÀñÇ*»¡Ùõ9Ÿ^gr¡á:‚Ö\šZ”Ä¹¤ƒÄ”Î:µZ,‹åã1†0VTë1®ëĞÑ’¹£şW/ŸRüÎ>IO‹`MA°’òvU.1{ûöIFªğ÷péÈ‰Ûê¿ Ÿñ	<‡r=IYÉ6à,‹äËGXj*õ¥ùŒ?«š10Ú¯9ğ“˜±>Mk³"b|*~
ºÖ;\?¡©Fìú‚Ïºí7Ï•Ù”ç:”yå9ëÔj±X,–1Jªõ˜0–dR>¹ô[ŞWFß<$yöŒb}‡ =³²b|‚¶Œ ğß=§(Õÿí#«[ïl¤¾K«›¦\‹(VöL`¥…Å²Pìr‹e…0ÆPµ0ÆsIÑ:ãÏk¼¬ÙÿBDeÀĞÚãÜrn{á€ÅŸ!Ÿ­¡:n0î{ÆeónŸ 3Í%Œ‰¥JÌêoÉç^-–O*ö¹ÅrwÉdW˜6*,Öpª_ó§$GÇ]A¦I:v±gÈ§C*¸\4<Õ&ø•G=¶®rp§yImnNùùK.åãØI8‹Å
r‹ånFiC¹"•!›òI³/¦†kçû~£ª†–î¥‰ñåä„UCyÄ°f·ËîÏŞf€0’Tëñd†¹Í,·X¬ ·X>êÕ0¦Ædì4Â´Á«§%yX1æ@oAĞLíÚLA¬WQ¾Ù…ğ˜Çc]wæuÅ„)mK6EàÛI8‹e>ØU°Åò!#•f¼RÇhÉdRŞœb¼ï„â­oE˜ZV-]Œ/'©¬ ¥Û¡ÿ˜æïF^Ö·ü» ÒA²àOßB"©íÃb±X,Y´1«!õHRÈäÒwŠñbİğ§ûb~oŸ¤æ7_Œ/®[×üÎk1?>¡ˆäô?ë{.…†á[±RcûÁ°Xæİ!·X>$ŒIò¹+õ˜lÊ›İ¸m¢À+¸xXòŞ÷b²9A®]4-Ó;Œ`f=³¾”„ZÑ€€‡¾æ³v›{G#áö{’IùvWÎb™'v‡Üb¹;cE©â{…Lê!®ŒVÿşµ˜ƒ#†‚ °,qa±Ô(­	|·©ßac`´f(ÿÍn—_}Ğ'åÏü³±Jî‰ë:Ò®5|³X¬ ·XV­¥ZDKZİãùÚsû%“md
ÍãÆ$»ô±ÔçàÍ’u¾Tj¥d„}ç=¶>ì‘É‰;V!a¬(VÃ¤»	¬»Åb¹År×cŒ¡J*õˆ\: ;ÍÄ[(áğ5Å|S2l`c›X¶z«”&’mëà{NsE9IDÛµQÃÏmvøõ'=²)1ccAª$îM›$³Ü÷lf¹Åb¹Å²Å:1w‘Á¼ÏKÇ‘áì>Å±—%Ù¤§±‹*ÖÚ U2.n+²ë,›+†Á>Í=OxìzÆ£¥Ë™öÚÊµ¥¹ŒßÈ`·¥Ûb±‚Üb¹ûˆ•¦V‘Z“ÏÓ&‡”CÃ‹§¿¿WâåkZÅ²RmRŒ6·ˆ}mµİmîïUÎ>·JğôXİ:½ÙÛÍ¦EL=RdRiß³†o‹äË‡ƒÖE(‰<É¦ıyÄ¨n8ıäôŠLKr&»H¥‘Êà:Ïu*1uó|)Ï¸®³,Áø€¦­×á¯xt¯s§l«ÖCœTÃÇî–[,V[,wÆ¤•zŒç
ò™ÔuÊ C%ÃwJ¾yZÑ•´e–GŒOm´ûƒÑfÒÔMé¤ö;ÀwES›ÜJÃÙÃCøµÇ<vôÎlöÉ$\¹–Œ°çR¾gGØ-+È-–e$–šj£µ!›öIÍÓi4ÇŞœß«ÈµütÎùÄÛÄÂáv—u¥JiÏË²7Ê£c`ç<6îp	¦i8D§VÁô‘1‹Å
r‹åÃFiC-Œ‰âFtç4#êRÃ©šï”üdĞ°¥M^«c@é¤™î:×qâN—õ‰İsŒÁmò$œÒpqÌ°Ş…ğ¨Ç§¶Ì.Ê•Ò‰»Öd‚¹f,+È­ ·XE5Œ©ÔcÒ¾G6íÍ;Ò+ªÃÁ—"úh
]/EÒf_ââ!–Iwüv‘=]ìÙ„xWÚà7ÆÜ–åÕ¢aÓ£.;?å“k3.|j‘$›ò&xöóe±XAn±|øD¯ÏuÈ¥}üiÅ±†WN+¾}@r^^rªó    IDATÂ¦6Ár$i“Ôv¸ó¸ÙL±g·LÉyÍ›„SŠO~e·Ç×wz³şÍÆê‘¢Î<a`±|Òğì-°Xšƒ1‰q[+òiŸtàÍ{\+ŞÿQÄÀ)Më*×_º'ÇĞ“b=ŸKBày¡±ÒógÍ7|Ë®}ÕaÃÃ_õï8Wî:‚\ÚÇs*a’kZÈV$X,‹åC¥ÆTöLzú£TRÁŸóìiãÃ–vÁr‹«F}vöù®3<×Aˆd¼=Ub°Ö„rê
èi”CøÃÃŠáŠá¿{Üg¦Á6!™”‡ë
ªõ˜b¥N>“²#ì–O4v‡Übi‘lÄ{8.…¬ãÌ³ûl 4¢yçÙ˜âUM[ƒ³Ä6Yb$wó<ÙLvºòÛ_'n¸µ»,&,ZAuÜ <xøk>«7»¸Óüı‰á[D,…ljŞG ,–3v‡ÜbY^”Ò”jZòÙ šµ1p­døãwb^0¬i.ModOD‰imğ=wÆ]å™vÈ§¾T©5¾ëà5©k`M‰Ë£†/õ:üÃ§=:s³Ÿ›×ÆP%µ0&›öÉ,`#Ãb±‚Ü
r‹e²°Õ¢˜r-"“òÉ¥çŸ£mŒ^×ì}6¢6dhíqîÈé^ğâA¤T8Óè†Ïü³s	ò©…[5
÷²äˆ6Î•—Æ’ò­¸i1í³§JÊõˆüñ2‹äV[,Í—±T”ª²Á´ÂUj8tMó‡oÆœ›;–c£w¢Ñn3kƒ|.A>yíÊ+…ç8Ma—ÎkmqøÇŸöØÚ5³ûõHR¬†¤|B&°.ì+È­ ·XæYtTbÜKM>ãøŞ¼šÖ0Ô§xïû1õQCÛê¥‰ñÅçùò[…~rİ]&Ã·zÙ06`’h´Ï{dbúER¬(Õ#<'9Çç¹vÌÍb¹äKsĞÚP$ÕH’	Ü†Éß…0†7.(~ï=IèÀš–æ¨’u99¢îÌ¹ó>_AI,Z, ¾ë4MKG[ø§Ÿòy`3çYz¥'2Ë!ß8£oA+È­ ·Xfd"òD8‚B&X(Ô
®ŸW|ğ£˜p|éb\ëä<&c›oA]ˆ O
÷Ì&2MkrDP2´¯<øeŸöUÓğ+m(WCÔ„‹}àaë¶Å
r+È-–¥KMµ+=ãñ(—¯Rü‡cŠuYA[¦ù#êzÒdUã».Ş<MV"È“u}’©®µÆkâ»ÒpmÜwà7óxzóìì÷¶R‹’¸ØÀ#“òín¹Å
r+È-–;Åo-Š	cEÊsÉ,`D}BŒ_=¥8øBLT5´®rp–Pûd£ğ:Àsœ-*È'
·Ô}[ÌJ31Š'»~ÆcÃı~júgQ-”ÔcIà¹dlf¹Å
r+È-–EÕC+ª¡ÄkŠN7if€“74ß;(ùÖUÃ®A.X²ë4b6Ù‹ˆ!]¨ ¿ıw:¢y“pÚÀHÅPŠáÜãòÅ©yøä„±¤Z—8 ›ò­á›åcuY·XæI4qÌäÓÁÅŒKG‡_Š1
ÚV9ˆEÖ˜	Ã5ÃòíVO‡ÉX›j8µj­ğf1[ìïhé”G~S1ìxÚ#ÈˆÛ~NMûxCµ3V®QÈ¤ü¾X,‹å“‹Ò†R-D)C6å“NÍ<qõæ9Å7JN–t9¤½æŠqÈÉ„ñ¡ÉJÒX¤ÒDq"è—º¶ptåéĞğŒU_ÙãÑ™ıuS¾‡çºTê1ã•zbø–òí$œåc‹İ!·XæA-”TÃßsÈ¦~nÙ8ıäø+?™‚XôÎr³ºØ‹Ù!¿ıY •Akƒç5¿)`Ä5C­][ü’O¡]0]EVÚPcÂH’M'™åËÇ»Cn±,X*ÊµäÒ>ÁY]Õ?*ùó“
ÇƒÖŒhºy›iœç^j£}±;äS¯cbá:¢)»Ó¨ÅpvTóõ‡_|ÂgKÇÜ×¦Mr¿ÆK>X3W‹äV[>i(m¨Ô’ódùL@°ˆg#æÔ›ŠlAà/ò¬ÙTã¶fœóZª ŸZüc•¾ùËY®er®ÜÏÃ£_õY½Õv²À˜ä,}¹1ÅPÈ¸s³XAn¹Årg½¨E’j=&“òÉ¤¼?ï}ã†¿ÙóÃ+šŞV‡L@Ówj¥ÒìÌË¸m9ùT1Ï#Bu!DúÆ»ÒğkŸñy°wîm ­4¥ZŒÒIôéL‹å£Š]­Z,3	V¥+×‘ZÓšKÌ]ZÜ´‚#¯Æœ|]‘ïÙÅŠqC$“üÑÀsï*gq×u<£“±~mš{šÎñ u•@ÕáµoDœy_¢ä?'„ ğ\ZrÉóÑrHÔØm°X,‹/˜b5¢\‹(d²3xÁh'nhşÃË1ßïÓ¬mwÈ.ƒeÒÔö\·!¢ïĞ¨©B¢X¡ôÒ«iàÁÆÁY	¿óZÌŞKš¹^V4Ö-¹€”ï1V®ScŒ-î–v‡Üb¹£›ÄE=ŒIùŞ‚²Å§ÕÇß–œyCÒºÊÁ!ÄIv­bipğ]·i«fíO½Ø¸Ñ™÷¼†á[ßc ¬*ã†{ô¸ÿ3AzúÑmµ0¦I²O:ğ¬S«åc‡İ!·XVCb©(×Ùâ™`ÆˆĞPÂÉ~Åo¿)QVµü&÷ÁoİviV‰jÖùí¯+ë:xXú³¦aöV‹á_=áñø<Ø'ŞÃHJÊµßsu„Ğb¹±Ÿb‹e
²1ò\®ÇäÓ…L°ğE©jÑpøÕ˜S¯JZº)Æ#ê‘Ôx®À÷\îjG‘Œµù®“tü¥Æ4±…-¤ó‚¶‡³oKö~'bäšF«ilBK2)ªaL±!•¶p‹Åbù¢>#ã•ÀsiÍ§gãƒÃJşÑ‹1ëÚš+ÆMc­Å*Ù…ö›'Æ—‹‰I8ÕX“è%î–O˜½µfà_¼)yé¸d¬>÷k
‘¾µæÒ(e¯„„±²pËG»Cn±p³ëšÄl@.,ºëZ6}=æÒŠö5Î´‘]óY<H}3ó{9vªš¾C~Ûs"ÉFO
y³ß”„Ñ~M®S°û>ëîugÌr—JS©Gh™”·¨£Ëİˆİ!·XæQë”¦VQZ“Mû¤ü™†Îkşúä[g5ÛºmiÑÔcOÚ”2hc–-!e9vÈ§®•¤Òhcp×KÚ'@±GG¿uŸÃÏíöXÛ*æ}/kõ˜P*Ò¾g'á,V[,e´6”ë±ÔdLÊ[t»¡9ğbÌÀ)Mû/Å‚3Q¤Ò(ep‘'ËU^–Sßñ·8Ïkîß¢5”GBÀöO¹l{ÌŸu¡ÆIÆ¬ëÏ6³Üb¹ä–1fò¹Ÿ8tçÒ3?÷p¨OñGÇG½­‚¬ßÜH3¥“uÇY¾Fûrò©ËÄÔÙRßPàì°æ«kşŞ£÷vÏC$Š•zŒÁ4Ìw­á›Å
r‹å#…TšR5Ùt@j	âtøŠæ½F”®ÚW;¸üj±RË¶«¼‚|¢p+uóœ\S×Â:TG5kv»ìúŒO¡sæ_É¤pc’ÂíÛÂm±‚Ü
rËÇmåZ£ÑjìÎğy.EğÖiÉŸU„´gÍ>–K2×xÎò·}‚|âKe0MÚí%ôkî-~íQŸ‡×ÍÿMJScâXMf–[,V[,w9Æ@=’TêéÀ#›ò—4êtã‚æİDÄECK·ƒë-T´&g®]§±+ş!,„?,A>q¿¥Ö(ÕœÈ¶;ŠqÅAMºCğØWz¶8³ˆ$î¦Ædq7v„İb¹ä–‘T«#’i¨Y&ÍË†¿ú@òısš–VA[š¦Šååˆ»[9$Jk¤lNd›Ô0V5dßxÔã©-ó_ŸL¤Ñ”k±„³XAn±ÜıbÜPªÅÔ£˜–LŠTà-º€×Ï)ŞÿAŒ!ß!f<Ë<³0Èw—|ënä7†X*\ÇÁ÷š+Êµ‚Ê¨Á8ğàÏúlÜ5}^ùÄûÅ’b5$ğ=
ÙÀŠ‹äV[>ÊµdD½\‹È¦üãÌ¡7Š†ÿğVÌ¡AMO« 4·şNÔ;ÇIÌN?¬¯Ó‡)È'§1Ä±F–ø{Rh(Và·vùìv…HXjÊµc Ká[v‹äËİ$ÄA*E©!´dg<™ßâúÏ(ö?c$äÚÅŒpúAJaéì£"È'Å°L\Q›½c`DUCeî}ÆeÛ£©¬˜q!¤”¦T‹PÚPhŒ°[b±‚Ü
rËG‹É‘e©ç|–×%œ¾¡ùß_©èmiîˆº1Ù8ªå{î‡¾K»‚|¢!K…Öà{g‰Ñ§ãuÃÅÃoîñøê.—öìü&®úõX’Kù¤f9²`±ÜxöX>	hc¨‡’J=&òÈ§ƒ%	/­àÊiÅÁÆ  ×!ôz“s!>a"P|)“ØÏsğ§i¯Ê	„c8ò¼¤8`ØùYÖUÓïN¸®Ck>M¥1V©“KdR¶p[,ËGCbêU®%Ùâmùî,õd¬fxùŒâwß“´æëZ›û¬ŸQ7Æxî'Êõ[ ç6"İ4Ç’ÎË·¦[:ÿq¿äFÕğKy¬™çûå4+x®C©IM.m3Ë-V[,+FÒ9—H¥(dƒdD})WÃ¥c’ƒ?’ø)È¶ÌÿÕ&:çZ|×YÒ}32+Y¸}ÏÁÑ©4Æh<G4­›d]}‡•Íî/ùôÎpM@ÃàÍ¡RQ*‰Æ±…Ûb±Xî^´6Ô#I-’¤|wÖuHFÔ¿yXò“Š6AG¶‰ÓY$&R!ğV°ÑnV¸¾O8ÈÇJ…ç8‹nL´¤àş^‡gÏ)k†ü¨ÇÖ8°§Ïu(×"JÕˆlÚÿÄm‚X>Ø‘uËÇšZ(©†‰ÁG3º£FÃ™ı’£ÏKÒÈfß ‰˜x’¹Ël™0NÆÆSşÊvñ§V14=—Uk¨Œ%oĞÎ/zlÜáâ§Å,ï‘¦R'y3o·å®Å¬[>©Ä2ÙæLH‰5œĞüÅÉ;#†ÕyÈøM¬3Æ+ËPÃ¼F1†H&ªï®hcÙĞˆ>Õæ¦aí"_+R0P4¬Í
şùc.»×¹¾/ÕPR$çK6³Üb¹Åòa¥r=&ŠéÀ%“ò—¼¸T1'æÔ«’\» •ónCO-J®ã¬¨È›¸Óè$1kË˜y>÷û•ˆa¥“Ìòf›°ÔË†Ê˜aÃÃ;?ï³~vja²ëâ{‰S«&+È-–»ƒ$[\â»ÎœÓLµŞ8«øæ!É5ëš|^|²Ñ.+V¼Ñ«d\“÷f8Ÿ7ïï.~wZ®²şéCmuI/Ğ'Œ%•ºÄËÖğÍb¹Å²\ÄRS¬†·œ!Zj-ŠªpèÕˆ‹ï+
]‚ =¿W¼%òÄuV´#;a¦fL2.®u²+íºRj^,Ë¼îW“¯%ªJ#†}Ù§cÍÌ…Øã”ëJ
Ù€Àf–[¬ ·XVTØ•kRiò™‰Ñã™?£ÕÈğ$ß?©pÒ‚î¼ Y%81‰MšÈ+V´¡«d\ŞwÅ¤8w]¥Ú$o+½s/•i˜Í‰YÏùÏußGk†°bøÕ]_ŞåÑšZøç¨ÆÔ#I6YBÒÅb¹Å2µHRª†dR>Ù”ß”T+ü4æÊ!Eë*ÿ©_+İ¡ºSÇå§º¬cˆU²k¾Ò¢üæB§ùµJBµhp<xäk>«·¸³ÆÔic¨ÖcªaL>MÙçÅ
r‹e%g±â8ÏÌe¥ŒVÿé˜wİAÖo^¾øÄX¸!i´¯¨Ğ¥álnn^ËT—uH­Q*i¬ô»R†X%çÊ}jCÃàˆáïŞëò÷ñè\ €1P%åjH*ğ)dü=éÆb±‚Üò±CiCµ8iÎ§s>ßvyÔpğ¥ˆkG4ík^ æõÿ”ÖH¥ï
ã6­4ñ4ÅxºØ3Ùè²{îÊÖO64\§©†o¨–’öİ_öÙúK*+f}?c™Äåù®C.ã/º»o±XAn±,à3iaÔHH	¼9Ûb‡û5¿÷fLŸ„MíÍÛ¿Y—4C­¶Âëé®eºØ³É¦üİ0Zß¤I¸Jd¸2bøÜ—ß|Â£«°ğy©4¥j„!‰>õVø=µXAn¹å#K4ÅÜ¥%›jJØ(j¼sí˜¦k½ƒÌ¯ĞH¥Ñzå#O&FÄdÃÜåö.şL9äZ'İÿÄ)våÏÄER!„húÎ}½C}Š{?å±óŸ|»˜cñ£)V"´1ä3o·Å
r‹eÙ§JL6ë±¢%fªEğÓ³’ß[¢²I¤™hæˆºÖH©ñ=gewšç¸–™rÈ'wöÇÖÜ>B—ìì›%MÂE
®¶´	~û3«Ûœ7`Œr-¢Iò¿1ÂnŸ}+È-–ù-!ŒÕ0&ğ\ri¿ix¤_sà…˜³šÎuŞsÓR5„ì
¨O½–$^lz•™ùd±TÉysÏqpİ•a×&Ù¹wœæÕ“!ŒjÚ×9<ôs>í=Î¼FØÃX‘Iy¤}Ï:µZ¬ ·X–A¬Uê1B0é3[Í­;¦ø£“ŠÎ,´gEÓêÄÔ$•ö‚™¨íãòÓ]ËL‚|â^)•¸°»÷•ŸRiä„û¦ò®ŒZ\ø×ŸòØÖë’Z å‹ÉIŒÀsÈ¤lô©Å
r‹eNb©©Ô“İÊlÊŸ³s¾/k<3Ş¯i[íàzóX<4²´'Î‹¯´x0š™íZfäS‹¥RÇ¡ÑdX¹Â8µªÆÈ]óvËÒ°A8°ëKî›= Œ•z„@Lf˜[,V[,Kœ•Æñ³tà‘MÍ=©œĞ|ÿäÙ~Ãö6AºIËÒ[b»„ÀóVÖ¸mâH™ã$b|¦ïûl‚|ê}'Ì\WºÉ`²q&)±qıEƒÃo<ìòÔ6—B°ğ×IÌ\c”ÒdÓÍ][Z,V[>VÔ£$[Üu¹tĞTÜVqğ…˜z
bÖİÒ‰¢&•!ğqW5Em®k™ ¿åoœçë.ûßØ0ŸkjŞ«IòÊëUÃÖ']v<å“)ˆ9GÕz„T&É,·†o+È-–E+M¥aŒ!›öIù³‹!eàõsŠoí—œ¨¶´;¤Üy§‘Î±Ö½9%6ác²RLskbQ9— Ÿîu=÷.pa7ÉnùbâÈ0T6„UÃ/İïòó»=Ú3ÿ›´1ÔG%R~2}iGØ-V[,S„a¹KM.íønSŒ}'‡~cdáÌşàŸØ=¾Ğ’Î¹^£û|ùDá0ªs]gE³;'FîäÄ®E³«†ZÉĞµÅááŸÈ·‰9Ÿ‡a¬¨„1“d–»v„İb¹Å² ÁYk4ÚÓ¾Kf	)ÚÀ·öK¾}JaèÌš5¨¤´&–ÇYy´	sS§±C?Ÿk™¯ ¿õwh1ó·óïØ XŒoŒŠ5ÃXÅğ•M.¿úˆGgná¤T”ë1Æ
™”„³XAn±ÈFä	ódÍÎ„¾t\qğG1¾©ÜìF0çÛŒI"ÄVZ€Åòfñ]Èµ,DßR¸çäıßÓk¼æÓk•Qƒ—…G¾ê³j“;ç¤D,“Ìr­5-Ù¾Í,·XAn±ÌkMYªF„±$ŸM‘ögÿ ¿døÖ{1?¾fèmMsROê©Æsİ9w¢?ŒuT×]Øùê…
ò¤Á‘ˆrÓ¨§+}:‘Y¾¸èS„1Ü(êüËÏú´ç÷^*m¨†µPRÈvÎb¹å“[¬ÃXQ©E¾×Tã¶d
}'$|O’ÎC:7—ÓöDÌÈİ#H… ß]xW{1‚|²!¡Z7
÷J7$“
Ít5Ê#†JIóÈÏl}Ø3ò.1|“Ô£˜\: ¸vÌÍb¹Å2ƒh’RSª†!(dç>~¦¾®ù¯oÆ­Â¦ß¤ŞçÔ(®f6x{-G³³K¼A~{Às®ëÜ±nnÃG,ø>&fokøWŸ÷ÙØá,jŠbÂ¾\|‡lÚNÂY¬ ·|‚H²ÅcjaLK6E:Õ\s8„Ë'$<“o¤ó³wå¥ÒH©ğ=weÛWJ·„ø•Å
ò[
wãV|d_kâXáyî’œZo§V2”†ÛtÙùŒ?gÃ§Öb5JÎÙÌr‹äËëÈZ$)W#²)Ÿ\&˜ó™Ixï’â?½+©èmmæˆzc,Ü‹jn/‡bñ¥ò‰kˆbÕ8&V¼9Å
Ñ8W¾˜öË£†Œ„ùY‡×»¤¹”œœÔòÙæOjZ¬ ·‚|I•E—†¹6ƒHFbŒ1à¦YÕÓFJU©P58.¹¶6Ú³)œpœş±ˆL[7íi ®12:N˜ê »%ÀES¢,²tvdå#ã5¤68~†®62w<˜"FÆ¨hÕdóğSu†‹8¹V:©yş§ˆb)$(H7¡@&F#gw °.ÖaÕpş âàs1-«™YÄøR»ÕÍ.NJ™$»s‰kKäÉşæ.½çÜN­šêÂ.c(º6	ø’Ok·3ç»TšR-¹Œ¿øEVTËcŒC”8™½¹¹†´¢^aD¥éhŸë{©(RÒ)z»òó¸o†°Zb¸(iïh%Ü¼FÆŒ¡ÒÚói÷­.RŠ<º{ZI/¢¡aLÄèà‘Ÿguû<Ÿ„qñº!—Ë¬¨“äw5¯©I1áxd
Ú¼fİ#©•Æ—¤ÛÛéÈ¥’×6š¸6ÆõQI¶%ùóù&]a` ŠßÚMGfºWŒyºÚÒD•ÚK“MyÊn¨TšZ5¼`RÁì¿× #Ã[gÿîb}Ú2ÍÉŸôF™H%qV2!Å ´¹G¶„İé¥
ò‰{Kµdçó¦Ü’£f®³ğñóş¢!*~ãIŸÙæ’O‰E>#•zL$UÃxpq^FÆTè/ê$NO¸Ù–VÚs)&¼õŒRG(‘££­…¬320JİÉĞÓUÀERc<NÑİ'pïÔÅÑ"u¯…Î|ĞxmƒŠëŒS‰5BWmia$å±QÆ*1—ÎÑÙ'í:(Ufp FĞÒNGÎºÏ7÷ı7¿ıoóàĞZá¸)ÿŞ!2ŠzÿI^=r‘ãGñ×Î0^­0^…nÍ…ƒïñİ×Oq}tŒ3Çql°NKç*ZÂãüÁŸ¾ÉøêÜßåQ¿qç¾ım«¯ã±õmøºÊ¾ü¯µ°m•bÿëoòÖéëpìĞ {6Òy{ñ¨\ào¾ù<ßÿà;w².½ğÇ^½z•ïüÉÜÈ®aÇÚ–ù= Jçxî¥£˜5›YYâ‚°‘ó\%çÒ’M5=»V2œxGräIÛj1«›ödÌHÃìdEÍ]”F6úgÍ×:y-w	»ıB\G u²˜ VL”!p\£“E€p–~Ğq_Ñ«š«§5é‚ ß>»(wAÚ÷&?ÏJ›Ycjfz¶TÇ.òú+oñöÙÆ‡.ófŸâ-”np½&hÏÏĞ4‹ª\}÷ûüá)Áö-ki›µvVØÿÂóüÉ	Ã3;{ç±ğ’\?ˆÿïÙ“lÚº)× Ë£¼ûãç9ív³eu+‹)Ù¦|™?ÿÉ5Ö?´´»à÷Ğè~úßãÕROoëœßsáÚ1~´·¶«iñ]>
R4’­$®ëâ8K³h¸#R¾÷‰?raÌ%şê~È÷ÎãÔF8uòûûÆğ[ºéÌ3ìĞFŒ\ïçjIĞšæ®ªÌÅC/ñüßopµ£—½d<QW<Ç¿ùãCø==l]ÛÎÜÛŸæÿå-Šë÷°½}šooXçí¿ù&o—ÛØ¹Éçä»ïqZv°¶=ËrzVMä<—jBZ²)‚y|ÏÎj¾¹Oñ»Ç5÷¶Ú²ÍùLNø¡“ÔÓ•œdšhlkÍäXâ÷Ø–”1.ÄÍµA²!+2= `².)­Ñ‹¸–|J \xã¢Æ7‚‚´/q_Ä¤¯Öcb©•>£ÔY¾ñıŸôU•!=Á‘ëÒmİtf}\a«×ùé7¾ÁÕÜ³n=cê\xãÇüÑ{ãÜsßZä{_y‘7FÜ».yvÜBµŸ×ú}©5lìÌâ	ĞqÄåcïòÜÇ¹<^äâ±3Œuo`cÁgôâ^|åmŞïeğÊYŞ:z•(ÕÊºÎ²~‚ÿòûïPíÙÂ½«RXš‹mq,Ç#»ñ!şÎ†ˆ«§P1_xæ16u¦<ö<Ï~óÅ¯}]«[1å~Ş|ù~ø^ÿğ³kÙŞ~„ëpï‹£\+ÁàÕkÔâµd¼\Ï°îáª×ğÎ•<_û[O²½Ë£tc|Z5váW÷ğtî"§Nòäãİ‹zô%‹»ù?\„×Æı»¶Rğ—ö¤–JS©Ç(tÎ—#ÿ±2f8üjÄGÖ¡ù    IDATÅ}šö5‚TVL›‘rkˆXñu)×r8ºOW ßt>7Fã­Ğ˜› qfUZ •Æ…×„DÇ¶‡Ò°aÿ#Ê£÷>áã§f_ĞäÒ>+¨ÔcŠUM.½€i3~á ï”ºù{_ŠíÙˆk£’´Weß+¯p¢÷Sü³–™o„pñæÙ“îübŞïy’É+îlĞ,i:A3Ü7Àpf+w_áĞùqö<Øµ(Ç&Çq´Ó-ò«Ù³-$kÇ-SëabóîÇùÛOuR+±ÿİ÷yşõÃ¬úùGYßLóı*rüı7xÃ}’ÿùgó¸óú>9´·{\:ÕÇĞµ´¥2(9Î‰#Cd;Zğñ8"Ù]ufùá8¸B iVoÜB>“a9Kœ1É®bØˆ‘Ê¦ıy=#Ş»¨ù³ƒ’Ã#šº²~R›—ZO'j•#ÄŠdOäœ;BàzwÛpNRçóXªy;½/×µ8B+MÔÂóİ¹@GVráÏN)Æk†_~Ø£#¿¸¿%xx®C¹Q¬†dS[³
n&Ç‡ào?ÒJyl€÷ŞØËŞÌĞûÕ=tg :Çw=t–¸24ÈöŞµ¤D{ŸxŒmßdï±>ü«íæÓO¬§%uû—X2ÔßO_¼†Ï÷HşÙÖFØ·÷<­}¯=²3>B)HCõ
¯¾´¡-Ÿá_G«Sçú±}|û}t÷|íÙ»ó3j¹eÊbÖÃÃà{cğ<ß-qâÈ­÷}–G7÷ d6ñÄÎ+õ,ıOÿ;7¦8}½ŸaİJqd˜î{ÖPäJÑRêçšÉóÌšVÒCZã3œ¹6Îæ®5t­[=ÍUŒsêÂ«w|'Ü
yò×ëfµáÄÑ“\‘YÔè¥z¶ÜÏÓ;Ú)İ¸Èû/1¼\'<µ‹‰¢^áÂÑË\ô·òøÖn2Îûß<IÜ»Íú<oŸ#TYv}ö¶GC\¾VeÓEu¼ŸïŸ¡¯“^w?_Ø½–BÊ™³@†‘¤R	<—|6µ¤]Û™(ö¿qı„¦£×ÁŸa‚`"vC4œÄ»àüT²pXyµÙp]á$cãa¼8wÔ¦]‹“,L¥JL›aø&(t	¢œ~SQ6ì~Æ'ß>ûë¦|Ïu©…ñ-…{Î•ãàÚñÆégÓÖ6¬®pôÍ·xûÂ(£ƒ‡x©SğÀöV®=ÆÉë!ÚI±æŞ|zCêæ]—8uğÌzÙÙCùÊaŞ:>L4›wìà-É!ÆØ÷ÊËôÕ\º7mááh¥Ì…“§8|~”ºqèX·‰Ç÷¬¿õ:ãQ8ÁÉ5a­@wcT½q†w_f¨.h]½Çw­¦|ñÇ®+â("Ïã|vó”9]äÒõa²›à©Ş:ß<qÑ:éŠ*\9y„£%dH±¨èÜ¶‹g¶µS»ÈÛû.2R×8¹.lk‹,S«pãÈ^:kydçzÚô ¼s–hİÃl¬æİóãÔÉ±ëÁûé–ã\¾Q§}s/qåïî=Íµ’$·v;OìÚLwÆÖºO*®çãiüÎu<¹gœ¾æRí~Zªgy÷ğ5Æêà·­â‘=½è'Ø{lˆ+Á|?SãóOmfìø>\©!ñXµ}'On]EvJÛ )¬ï¢ql°Î†–4æúNÔºyl½LFZÚàyŞ=|‘ŠÆËµqÿ]Ü×&ïçĞ‘S\‰ñ»Ùø&d ïû]c\ztß³ƒ'6æo*”°ÊHÿŠk»Yí/£Ğís£¯ˆÛÑËã»·±¶Õaøìqö¤j\
m¼ “={îaU0÷½‹¥¦Tq„ %àysïŠWcxõ¤ä)´÷¬JÌ¸–š/>Õ¸Í_é1ì[ÒZÄ]í5’ÔS©4Qœá•Ú¤pA Ü$šNi´™¿á› Ù)\øîeÍx%æ—÷ØØ±8‘é¹-¹a¤¨6ÆØóé`Şë4Àõ<?C[÷F>ıà ç;Ç¥è^Ú}Ÿ¾Óı´îz€G[¯òêÕQFîYKoÜ¶üÌÇù£W_a¸7Ãš±­+{gó/,qíb?Á¦İt´¤&ï‘ëútû¯0¸½‡=ä1ÔNàD¼Š¯?¹Ş¼äØòĞvœ|…÷.–ÙzŸ±Å`9?Ûö4÷{³dŒ2P2tööLùúu¶åh#dAÏ–U˜âûëŒ…lØ¹™­UN]•@µu³¡àÑ¹~;_xbßy™?øÖOx¯?Dİş½¾Æ¹á4;6å(lŞB{ùgúè7.ä¹®Ó±u3ÛÅ5^zçgª7È³å¾ûyæ‰µ„—ñò±ÑÆ³”G\å­ı)WcÔµ“¼~ô*E¯Şì'·a7_øô.62¸Å«¼}àWÆª\|ÿ]…9~ú1>µ½›Œ/æ¼gåjH©‘Iyä3ş²ˆññÃ¾EÖ´¯YŒÇ.°»H‘f’«$Ùâ¾çŞÕb|ò"ÄäÈ],õdèŠ4Ê»¸+ˆ¥š\ˆ-í5!•:×)^û‹ëçôœ»6®#È¥}²iŸr-¢T¯‰Yo¦Oç†ù»d9ğãñßy“3£Šµ;¶²¥-Cï¦Í<²µ—‚vhíİÈã?Äô¯¿~„ËÇ¨pæøQ^<4ÎÚUyLÿ~¾·÷:İ{öğĞ:Ÿƒ{?àò`è¡a*k¶rç(/¿}‚E.Ÿ8Ä÷Şè£mÛv»·•Ëìåõ#}è‰ï…\<ğ>?>4Ìº÷qÿºÃÃQr£ÆÎóòÇ×ßË“{ÖQ9ùï9Ëğsüpÿİ›·ñ@ïÍór jtŒşÃ}í9ÖÜ·†ÎbGGÈˆâ•cüàĞ…ulp†xã•ƒ\P
ÇO±á|î‘uøCGøé©5Ù¸<ß ½Ş?p™Áq¯\`ïÑÜø0?~ë<l|€/<y?›»Ô¯±÷à%ÆÃ˜Ó{ßáÀH†'Ÿ~”'·÷ĞØúöÉ.î7+{:Pğe£qœëwîâÓl%ßw„·Ï’Û¸­kst¬»‡'w­'ç8ä:zxä‰GØÕ%8ğö!ú«uôm…ĞißÊCÛ¸tö:a=æü©+ø·sOŒè±‹¼úò;Ö«xôÁí¬‰ÎòÜ›‡¹0:ÊÉƒ{y­ßg×îl«(Æ¯Ÿçµ}WhÛ²ƒOmw8öÖ;¼= ‹@D%úNãÄHxüoî;Â‰Ñ,;ïédüà~ö]¢<xšŸ¾v˜ö<zÿô¹#¼}aˆŠšû¶ÕÂ˜Ñrßu(4â çªb×J†?~+âw÷K¼t4)_\iC$Õd£İ]a¿“°q>Û_áqù…Ô>¿a"+Uâ:¾’×â¹¾ë$ãş±ZĞäDàÁæ6Á«ÃšÿbÌW4‹]ª8B$k×l€Tš±r}Aë©×Í¦È¹ŠŠÑÄò
Ç¯8¬Û²•5íkÈ\¡X,76|º·>ÈV=ÈéJ'[7®'çŞùĞ*qzĞåşŞNZÜ›:ÄÏ´ñğ3O³¥xŒ?ıËòİW(…š±¡2nKkòS>A+]-¥ñÚÜkË’°;äË†Oà†Ke47Í*µˆº“¦à8ø«×ÑäğÉ¤Ã{ºî£½{€ŸôİàìX‘ÖµÓ-ÀñóÜóĞgø'[¯³ï·xş»/‘úµ¯ğ@öæ7ğÊåA.\áô7¿Ë+"f¨™KW¡3y‹Wm¹Ÿmk×’ò{	Î38.Xë”9sô(ç†Ë\¾2JË†hrÑ¡6­ŞÈ¦C§¸PÛÆğ©«ˆM÷óx[šÂ;IWÇìhw$#_ëPÈ¹\<zC]í|fç¦Y­Tšb5m…ô’ÏMÍ´Ğ|ğ\ÌØ5Më*×Ÿî¡8%ƒÓwW8ƒ“Fç×Ü±b‹-–“ÜSmôŠ
nÒÄ²ÑİoÂÔƒëAë*‡ò¨áÍoF<ôÍyÌ¶®B<|×¡T‹-Õ)dSÑïé¯ŞM·sß_bİÖË¼ıú^şì9øÍ_ØD.pÉä£'S+1võ,ïeüú ÃÚ£Œ¡ àúñãü¸¯“¯~å³l[]àÂONrğL…kÅqYg8jå¡0$B¬ÚÈS[× Š5Öî?Jyà2Õ¾‹ˆ{?Ã›ÖÓ"ºùò•3|ëÒUºw¦HÖ8yæ:ş¶/òĞ¦^({<´æ5!¸Öwcg.Sº^á˜g(–5;W—ÈûĞ½e›Ö¬¥ó¿µ˜Ãœ9}‰÷¯ñ’34¸ÎçÍ€ñX»y[6m¡ÛëãÕÓıôW¡GÇ\8úç‡K\¹:DËjÖ7ÂËÑÚµ›Mú]F†¯_BmÙÉ¶Uš³Q…‡±6ÿ {:¡ çÛ2.ƒWÏñÎ™6>³û|Ûº¶4ˆ¢˜j­„SåÌ¾£ô”¸q©ÈúM?“¥õ	R-tµåLÚè~úÖaF†F8_í¢¦Ôm»½-²ìÜ”fè½3/Gœº°ã‹ëñ÷CÁ@ÿuNŒøú—6³©=Mgv'ÿê§eˆ/”¹ïÓO±iSÎªaÖì?†UFFÏ°÷À]"ï„ŒV¡mV››Ï!&üt[ï¿—ûò£T×âıb³¥ëœÓİüÊ®¬M+üİ«8vfÁ©åzD,5­¹Ô¼ÜÂóÃšÿ÷ÉşaÍšv§abµä%ÀäX¸ïº+nN¦î¢X±E‰×Áu’èÓz¬VprÏuãK½àI8ÏÍí}EÃ¿{!âŸ|Æç‹÷¸,öÄRà¹´æÒTÃ˜±r|& å/Ìh³^¨+‡ ÏŸàİ«ƒä¿û×¼kêÜ2ä­°~U¬‘ÔúNrZ¶ÓÁ CÄ=½·zL¨Ã7Î0Ü¾Oõ´Üò9G[ï½|ı{yğÄA¾ÿÚK<—ş>ã8¨Z²6ôLŞÇ*¥º$¿:‡#¶ XAşQ¤›{Ö¥8qê8W÷<AoÚ]âÔ¥ÊİkØèùÎFîízï:ÂÎõ;hië İY ~p?‡†›ŸèÅÁ eŒT‚LÛ|fgşä gûl¨~ƒ\¸v§–¯İßAFÄŒœ{Ÿï]ºÆå]CÏÇ+@+Êƒ£?û.WzŸà¿ÔÆ¡g_à 0·T`Í*¶¬9ÎÉ'Qg$÷üì6ÚÚ<~á—ÿ'½ÏO¾ı=Î~õë|uò‰”eİ£?Ë?ï9Åko¾Å>5ÄÿôwaÕ4níµP2V®“Ny´dƒÄh„íØ€fß³1Å!Cëªé¸¦F+yr{êGÙåØ‚ÀsB¸áP¿‚†o¾ç+E+‚&ŒÓ;.:aÅğÿ³÷.A’d×•Ø¹ï=÷ˆüÿÿY•YŸ®®®nt£¿ ñ!‡IÃ$8âŒh’™Zk¡ÖÒZZh1KI&ÉÆdcÃ1R?3 $4h4ºÑ@Wÿê_Yù‹pï]-ŞóÈÌªÈHŠ¬ª{hÄ¨ôŒğˆôûÎ½çóÚŸæØ½Ç¸üƒ$=Şl†¤ı“£5lï7qsk“c5ŒÕÛv‰àò4ÆÏã•oá­?{oÙ³`UtÖ÷ñö[?ÂŸ¿QÃ×¿òÌğMüÏÿ)oöµÑH¸›ûMd 
‹ŸÇûûŸÄœ	S$mâ{ßg6H4ÁkrÎZ(RH5&eIã3mÀ`€\1`f6ñÇ_ÿÎOÕÁ.‡ÏïáõWeôƒÍ‹æn¾÷.Æ?õ9|íÅL‘ÇŞÏ¾ÿíõ_àİŸ+şœÑÀâŞİ&~òßÄÕ©á_}e?ü«¿Â÷øèŸÀs5¼öö°{­‰g>»ˆññ	üÁ=‹×ğşòßÿ)~õ…/ãÂ3ˆ”ÁÊ'ÿİÊOñ×ßşşõÛ7ñ_ıÖ§pq^LlT0{°wpn?¿úŞ8ƒ/Ôïâò=\]ÿÍÇğæ7şËÄVØl±sãûøwßÙÅË¿óÛ¸´ÿü_}µ­ôš=nœÁS?¯ş?ÆÖÔ|u^ãu>xvÀ$…= H)8$ ŞÙÖõ™=æ®|øÏ^Âæ`›9r¾ûƒã“*HÊIAkÆ~Ó#S€×&ö™á,£Óp<ww· €©ñZ©„‰¦Ş¾îñ?|3GÃsª’|qÏÑ¸Íó)h´3r\ÔÓD?Ò9ÖMn­; ÂÃ’°S<+9½í)úT°6I¸e€ÿåïrl5ÿüŠA½ÏFP¡„SÜÙn`¤`j¬vìÙ–‹g{¸|?yûÜ^ÚÀ%üäõ›Ø|ù‹øãO.ƒ¨‰·^û.şîçw°¿>íŞÅ_|û.¿òY|jäø·ÿø6Î¯ÎãüLÒú]¶±ßÙÅùsËXNïÖX43Naóùçğñw¯áÛ¿ºƒ±gW0õê[øÑëw±~i†<ï¼ƒ_İMğÔf=üı0àÙÇó $‰Cù©-ÛàBÚF5<û©ğÓ?{ÿæO2|ö¹U4Şû^}‡ñéß¾„‘zã<:;ß¹…äÅqLÕÉõ9Ì}ëgx“ÎàŸ­€}|øÎñı7	g6§°ÿ‹ŸãÖØ
>¹xğG}pï\µ¸ôÒ,f§‘ÀAŸßÄÈ«?ÃÕ_MÁ‘šx•µ†jìáö{[øåÍm4çÂÂûâßÏãÒæ:¾÷€wkÏá+ë
Îîa{Ÿ°|v—?¸‡½]êïŞ9ìíîG×ğô¹;øğWMì2ÃãÁİˆÜ:x³²ı‰Q­îuU¤íößır4vÓ‹Rvçƒ¬z˜;Q¯…á¼º‰\ÕD8MBáÎ‡æá™Ò…\×°{f­W`GÔÇ	&%¼şŸ,¶®{<÷J‚éEõÀ÷­p¢/2Ó­™ukçŸl›¸ı“¿Ç_lMáùµŞı§«Ø]:ƒÍdzÑà'·®ãİ­)äŠ°ÃÖíxïW·±“Å¢Ë˜»t¯œMñßú{¼6ú
^8S¿ü%şê‡ëøüJ†«·,6Ï-ÆâÊ‡
¶‡¯Ïáìæ&¾û7ÿ€ïÍ:œ¡›øÖ;Ï¾|+şj0ğÃ:7‡ïÿğÛxuáyLï¼…xÏáù2–W—piô-ü¿ß_}f
Ùİ÷±›, ‰…üşgçîö=¼ñVç>»ˆµ™)$`Œ]>‹©¿ÿ)~üöElŞ÷sŞ{x ll£[¿úï½{Í§Èˆg’	,Ÿ=÷ï¿ŸÌ}_›©C»=ÜŞeÌ¯ÃK×oãİÌÁæá03ö¶wĞ¬/âòÓ›xÿ§¼wRŞĞšîÅkWñÆ›wqûƒwğÚ/xù•—0;•Ã(ÀçM|pm?¼ºšc˜Ÿƒ{ÿ¼{s3NA+‹ı›øå‡àımßş÷°Ô<.›Ã_ÿùÛ¸øÕWÜŠÃZXYÂ•ñ7ğï^}¿si×_vı®<³Œë»?ÁŸ}ïgXç=4®¾…«™Ã¦©czù¿óOøñ›ÓHÖê¸şú5Œ¾üLHÊag>ÔñCO8ÏX=³ˆõŸüşô¿Àç–<~üãëpãKÇ“à¸Û«ao?G’øÖäRÑƒÏÛÛ{Œo½éğ?ıƒÅÚ8a}š*øÔ¢s¹uPJ!M‡›špàKƒrş!BmZk}Á@ÕCk®á[TÂå¾¼˜#Ôá_ÿ£Ã~ƒñ/LÔË¿âo4Ôö`8Ç ²Ì£5´ûò1>ÏpóÃwğóŸßÀï¼½Oøâ¯_Æ¨ı9¾÷.aãŸ_ÂÌT8H\\[Ãwşú'xo{üÚ·ñS³?~ñVvFpéû…ï¼½†¥É³×[¿Ä?nMâ3+‹÷ızÆŞøÛ¿ùÒs˜i¼ºfñÔgæP_ZÁo<wÿáwï
Î'·ñwßú1Ş^ı,şË™´c¸æ>|ï¼QƒK&°±4‡Ñš¡V‰=«Ş:˜ÚÖ—g0š*¨Ñ\Ü˜†ÙÛÁ[;h&3øøg>‰W§‚Û!h,ÁÔÄ<½pk“u ®¡}«›çğÑ33HˆÀÖbëÆm|póö“Y¼ğÉ—ğâÂH|¨3¶w÷°ŸNâòÙeL¦Â(êÔÀØä&&&13³Œ³su¶€™Àæ…uœ]¬a÷ıøĞcsyk+«8;›€)ÁÂÊ2–¦ëMvğÆOßÅø'~Ÿ[EÖø¯}ç¼yséÒ%¼òÜ2&®Oamiîİã»?û[¾ç?şQ\˜C»5rRç£)À@3wÈ¬C¥eı=Ü¯ıÒáïÿm›“N,},IÓC$ÀE~¶‹Ùâ‹ŒW{V*Æ¯8}DÃs¶Uš>Ö…"JtòCDví-›ïzŒN‡h´b¢™;ìgÜÂZcFj	œgŒ¤íóo	p¾‰›ŞÆõ›»ğcøô§?‚³“£˜0hî4°ëÇpöìfİ-üòú.æÖ—±<¿€Í3óõŒtr}fk×îjl<ó.Lî\»†woì!]ÆÙåIhLÍÌãüÊL)W×p~s£×Ş»ïg®<O]Y‚¶I}gVWpöÌ,F}×oÜCÓÌâÊ¥,.,biyk³cà»7põÃÛØÑÓ8v	£Falbã¨™ƒCB³y[<…‹«˜MÂHêH¨aqz#ÓK8;?çpéÎn¬â©å:¶oÜÁ$˜_\ÁÆÒ2Ög°W˜]\ÆÆÂF¹‰ëï¼ƒ‘g?‰×§¡÷ßÅ«ß¿¸¾^¼€_{f©C:6õµyl½õ#|ÿÍë¸ÓHğÜ‹WpauÉ)<DKìÙ a‘ç	Æ¨ë·wÑLçğ©O¿„Ö¦‘Ò8&{wnàÖ°~ş–æ°6;‹¹ºÉ·qmWãÌÅóXÂ>¸¶ƒÚäÎYÂ™µELùÛÌp12>¥),N'HFæñìóë˜Q€e`|n+Ë«X›İ½w®mÁNnàÓ{3£˜šœÀèşŞ½±µ¾gff°²¾…)¬Î'¸õÁu\½¶Ì®ââòfL/.cmv	¦W°:ª F¦pæÌ
æÜ+ŒÍ,áÜ¹u¬N4nŞÂí£“×“¸ri3Iû&,ƒQO£BmÏƒ‡Gˆ¬:ˆÇ¼z—ño^³ø__sØœU˜«€ŒsWí‰,üÁ×òpxUÄõROµRpìc=ŞÔ”âkñño
(7à	Sv`"%üå{·ÍX›V¯¯vcæ8•÷¡¶gy4à­'ğ16’ =NÏÖÔ±ë·÷`Ç–ñÙ_{	W' îÜÁN}—Ÿ^ÁLŒ1«À€i…íí:.^y]AR×O°³WÇÚü$ê‰‚ÏxçÕïàêÔeüÚ•9Ü¯í"fä;[xïÃ;¸µ§°réy|öé9Œ×j˜]_ÃêˆÅ›÷pgP#×j˜ÃÄd
í4”ßÃõ›[¸¾§°¾8ÑšÌv+ùş62Ë½ş¡;ççtRÇÄH"wñ±XÜyó»ø?¾¹…_ÿı/áòt­RÀ›[{˜­µš:¹uÈ¬‡µ>šÄj£U:œx÷‹ïÿ‰…RÀX›nûáÈ3äÈ“¢s®•Äsõ‚Ü:€ä!6ÕNUœ3¬ãJ_‹wÀÎm4pù‹
‹Oy:0ÄIŒnå6ÀÌOñôsì?Âø»ñ‘ßø,_ÀãÒFŞiä°YI’Bk}âï‘÷YÖ”ÁÄhMäˆ yWï ó‹ÓH÷®ã;ñçxµşşåo~‹Çü!mï7&Œ†X¸"2+gpõÂÿşŒ×n1V¦Æ’“»¨·&Ñ@_ÙĞU¢h´3ĞS<W%çŠbgŞ¨‡V[Š]}_œ­Ìp÷ãÇÉ…è¶²MNàõ;Œ_Ÿ#ü3xfYµŒG‹ÚÌÚEóÚ•BšœS½gÜº·™èôĞÏ•¶«oı~vçOb·¯ãgoˆ3‡gŸ^xÁ@ mÁq…xûõâÏÿş=l|ü387TnÉ_K™E»ÆYa6°a]˜˜ï5,<çH´B-ÑH1Êpxû‡?úK‹$F'é–©@¶#¦¹s`hıøHÔ»¡ ¦…±gWjÇp0¯…jâ¼?™á›óAvZ›î¾üêûŒõËµzûŒïıfZª…Œô9ÖÀ7¾‹ÿû»7±òì‹¸8;Ñt	½üİÁ¾ıO¸Mu$Í»ø0_Å?}sş­±ŸY¸Cë`F+ŒÔ
Òæñ£ëß¼æq~0pÈ]ÿ+D‡ÛŒŞZÔa2h]LHÑ
OÂ#¾°{
{ûÍÌuo¿0–µ.8Ú—¹KğÌ,áoï0®#ÇÂàg kƒŠÜİR4Şßøid6œ%†evgêØ|úr5÷qbÏ>¿(ÏÁ‡ñ7$rA[ø;Û÷p¯©09=‰±ì`åÖãÎÎ>¦F%%ÅnóYtÉff$Fc$5H‹ézxó{9şé?ZŒŒFÆéÈŞ÷ŒÜ¹–üĞÍ]¢qÛ0»øÃ˜ùŠE"\D¿;ï=4|ON¼…4Îyµ<n¼Íøäï%8ÿ±öÎëÌÀ­]L×—´	*ø`š;wq³¡099ñºÁãt6–	¹`ğCMÜ½»ƒ½Ì!D&bjr)u~¶ßİi`l$A-i?÷yûãüÓ&²qB¢¹µªvÒA¥şV[Ím~£ˆk$‘Dõa`òû`”Æê    IDATÏ8ÅJ˜1
fÈÃëı‘æP©ó‘c|°å1ÅÀÿ9ÆS©Q0%¼îlï£–ŒÔÈTPºù!·@Ğ*ÁøÔÆùå‹$,Ëjiû¯"EY¹Ñ
©aøZ=ïí5ƒÜØ¼óàgã19G¨ñÂ¸Í9Ë!Ë¨<ÃZ­Ui'ĞÁ‘Pàä"Á|Å!QÎÅ82­†£â´ÜûhPãc$µ?lM¢bG­ªÍ=†I€å‹úØ´¼ÈÃÕ’§5ØV£69‡µI¹AC5LÏÖ0İã³]ë°‘nK
7¦	O¯(üõ5ÆÙ©¥Å`xœÚÙ2”"RĞÇÈdCBŠ	)fÈõÔ32vˆCÜÕ_B³8lQ?|ê3åÃ´Ü{Q	‡Öt<ø¸ccøZäİ3ÀŒzªp÷ãÒbã#‡#;œñ¢7Qb”qrÁ£BpİÏì±„üş‡¼&@« mI`Ç,Şø–…t]Á & ÜÚY«"æê$he‹ûÂqvˆ»Ó{PÎ1E¾§«ª¿…œ;ŞÉ_K0ÁQÈòçeTŠ“p…Z)W-î3}!`ÿpöy´ÃêÖ~fQÓ,@ğ˜¢–hì7sxNĞO+¾xÙàWs8¹Ğ‚ÒÁOÅÇfzî<2|>´:PRY¸CbôĞW¾¬
¼dˆMåÃMŠ°ßÌ±!¢†VgŠzš[¦uCr1¬Ñ§¾DEƒ=Îªè'£‰pïÇï>c0RSP¥wĞ]œ K³] „\ğHmƒİæ><sOj¢P¼S£1=©°¸AØºæÀ`4³/RÈßjF×Ü%v‰)¾ßÓ’s²œ	™uC•ûiEP‰AîÜĞ_‹ŠQmYîĞÌ\ë»¤uİCc4vg>¢‘¤Ç¯a4s‡éñº< Ác‰Ôhlïg1Ê³ıZÎ‹+
§oí2V&èÂ®tÈ#÷dØyÜá-âeÓDCÓpR\4=MÿÂTM+B±dØÌCª‡.¹0¨zŒıÂ^} êÿµÓòÜAÇÚ®((:RsğºšØß¾zIÃôğË¬‡ÑZÖ}½ÿ­È-&J·›Yÿ9¿µÂÜÁe¡+?R3±ÃÎ­Éôı‘+³@fÖIİelEDÅN1Q÷ŠGn}k§{(rÂƒ´,8ò>Ä+®âD¦pÇõÌ0J¡ı
º¸ö·Ó+
³æŞhæ.ººKÁéáR£¢ïËqdøİhÜÛæ¸Buü¿KL|·<7¶ÎµˆèÃ¬…\1|2î}hª;ÏH’ƒ¦qbÂÎôA=Nu/ßŒV-Çı‡{ğÜù¨TŒJ7"ÔSƒZªcâÎÁYäÚ¶Çç7–&Ë7Âº[±»/Ï A|Hn`˜ 
²õFf1Òg–¡IÉE‚m†Ø)Raúë|0†	1¡¹"WŠÿ~P“s3*™ƒ{üp;çñ^‰ypÂ[8Ÿ«ÂdıPãà
Ó½¢p›ÊÜ<™š÷ÜjD…lvÅG]vŒ!æ‹£Ç÷:›™;†²a&cÔƒİFÑ:·}ŞŸ:£1_·¸³Ï˜íşL,öÓ ZjyzÄÚN‡Ì5ROq(Ş+Ê›‡™sîâÎ³RÔò¥q‡ÚêF”ÒQV0¡‚.ÈÆsëª„c~/|ĞØoıë“YàFøÚ%zRşõåÖGSB©í‚Ş!rÁĞQÈ™¼ï¿c:2ÌÜò&yøò­Äh¤q×ŒbNdÍá
â\¬&eAR?\×WçÍ<tñ“.¯EGcF¹9?dÃ·¸£ÅÏ¨ÊBm£‘\‡ï]a˜ÆïÉáïNÙO/ÏDÀÜº‚Io äÎ·
@ğ8×vïÃ$ûxÒüŞ³×ïqégbx>ûÖ¾–„*¥‚ßGˆİŠ¹ç‡š­'…gF–Ûè¢#Í†to‹U3çFwW¦¥ª¥„+â_‡"â¶0YË¬«ìüj;#Ë]87ø˜I¿'iıâ:c»F?¸»ÏxqpnN•–«çŠÂë@ B.xäPÈw›yÿ²õ‘q…‰%‚Ë’ºèÁÕ*:>˜£ZûÀ>îôäü$<4·Îr+^c˜¦]EáÕZ!)¹ÓT8›è›[?4#v¢àÄŸhÕ’”„Ÿs1İh}¢Ñrç÷Œ¦,Y˜;§01süc5Ë”Â±®Á@ğØ0‰&
Üv¨ÿÀ75î5ÊŸ iâÓêDäC&ç™=Ym·‘YE*˜“¹ÑÇõ³¤dÓ¿0PMŒ
áÜ‡UÛãkIs0BëWÂÎñ³iæÜÁùp_L«¶ë x;tşñ<ˆÚ‰¬Şßaü«§4fÇ©‡ÏÄÃzDbLBÈ*„41hv(Úİ06E˜X!äÙÑë*BŒ§zx.àµ$ğ@Î-­Éy¹"Qü3#MÔĞ\Ë™Å)Í($º7•Br•&
ÌŒF$°Ã*Üº(Ü÷¸ìk)¤ú¡P‡Ÿ3Z!MTË™W©öÒ|ï=•ŒñÈv…ó
ãÓÔ‘§bø"ÔÓÌKşÀôáknîrégn1%oW¿‚¬BmÄ,<-qr^– „Ñ9¦âCt-gFÜw0ú`êİ‚.(´š¹…«P}Ö3‰¯E©¨„+[Ûq şkdá=(E¨%!ı¤hR¨¶ÑfERJûû¶›ëã
kóª'37ç×!ä‚G“ÇæŞ_qĞ	0>MpÃ»£…¹›ôšè`ï,1õÄÀÄ©lãĞäœ¹½ôÍú ‘R¤Z2ëaÁ¯…®ï‡QKZVHã†÷)^‹BÓ:Ø6HÅ¶È©/ºåZ)Ôƒ$š²)êŞ pÑğ¥ìgérFm˜_ÑÇ²xï9vĞ•Ä	‚'©Q sË!½FSàkOiÜj0öKöåµR=ÕöÔ(Ôƒ¤hîfî9ow%ÏŒf”T'C^?ãxæ§'Ë²q£5²hz;Ôó_ltä6(ÚõJŠğ,whd¹j³Z¢‘+%j»ımÉ:€{ûŒßY!¬M«>›Ğ(¹ºà$S7Á©€V
J)dÖa¤ÏLÑñ)S#8)+2]†QüC£ôiŠ¦pDÑ8%¾D×2K;‘'ñuY¨U6K”‹9áJ=³\!wÌÔ’~³GËE¿5UWıíistç§dåyŒ/æV;LÇ­‡C-[ < "Ô¢qkšècŸí“ã„/­)ül‹±2YÎÜ@kı¨l=ÓDĞJƒMl’:åßJtŒñ°ŞA5oXµ=¾Çb\«ª¿…á[n}Ìæ^N¸V
µ¤ å!ÓT×qK¡•Bí¯3xÆ í=læ€pyMa,íáš1N¶^J%èr2œ/bÜ]ÎNĞ©šW™¦#’æ´M}Owƒ|[¡–Ôâ„µ0mkd.º–ÒP%È-sÇ­ÎyåÅRSË '³Ã“°<­B|J#³-óE„Z¢QKÍ‰ša¿¥Ş; ßÏ*$õãH_Á“ˆzbĞÌ]Ç°™QÂW6n7e…r*Ö¾ê‚|»–hÔ£ë[#shæŠŒ¢!º¨sËø,ìWoªZ1¨„,{ĞÃ«íaZÎìgÍ<(ŠxÖzjNÔ4`”v5˜ìfŒÏÍ..÷V£½±º©ìN içNŠqn-¬q½b|†PŸ¶®µ‘ò¦¢q[DĞh‚Ñ…Ûjp/wáÙ·\;ËÈ¦ª‚u!;[E“AşŞ`Ğ£acV·f:b„6ØƒIŒ(‹ÓkæÀš«æ?X\ƒš¢lÑwĞ£ÀÚ¥ã§.Nbj‰¸«‚'ì kSfÃ3°í¿QÀÆ¢Â…	Âv“1=ÒıAi¡YÜºˆºÔúĞÎ¸u&³q}IÔ÷‡WœA–=ÈßKV¬+_ì^ôi¡ d­¦M8oS×*ÏÌíåêÎ÷2à…U……QêéšÍØ0¦JRğèCF5‚S%Jıv¼•&fl“q¸ÉKD-BW%95šZ®íŠBeq1;;+âV4Hf»TÎû–sêÃ8'Ór>w•Ş×ûuá®GSPLÑrE«Tá}åãw˜Æcj‰0µpü¯İhé ‚'B­„qëÚ´Âo®+ÜÚG)Gt":‘îØëibTk8à\H.Éz4|í§îµRâôúa5
£¸` :ØèÓ"z¶¸Ÿ‰ÅÜT¬öŞ0íÕox&>v^÷øy?‚Z"óMÁ	ÿşäNÍ—1vsëQKĞÁœYTxGØ£Õn*Ü²™*µgDAâV¼v ­	n±›VH­«“*ÓÖ¢)0¹|é‡z{˜
oœ]z(+TÇ½ıâ½2`_yôLñù©²ûãòÇ7®$XÎ·bÜà‰"ä2É·÷²~.u<µ¬0ş¶GÓ#I÷ëjy•ÓÉĞùaÍè ©Ïc}çV”jUJ±ÂŒ1<¹°>¨a)æ•ëêˆ±¦«ÎÇµ°xoÕâæÎC©Jk­»‰»gàÖ>ã³gV'zû­Î•d-•f»@¹à1B¢uŒ¶ò}íBÏ®(¨L¦)>ì}ÅE[QØ-c@üwˆEº`ù¿•åZS¸~ˆ$°Ö·¦âzˆF3Å}MµT^ŒîO’]8;z”"$D±›Mí‰30BN@é&G¶ÏĞu`íòñÅ˜c%1"hOäaS”²Üw$/WV4¾0íğŸ·õ¤ûş¶&Bæ<ªì··Zœ‡±…!"9/ö‘3òÜ†¹"¨>ë²s¾åI“èá®6J8MaŠí|ÿ†o„s+~V©àDª}8s ¹UÇ‡ŸY»3 30‘1>ÿtï¤º™ÛK/»h‚“r
¹‚SEÈMÈïW*5¹@HÇÛ¼ï‹~¨ˆVY´ˆßOoE©iI¢qŠuØoÚV”X™—Ä2¬½ÆmfÈdüÈ(¾?ïÃî]™{ÜŠ0±ûY¸B-Õ!G4ª%›¤„)*İqkí—õ@ò÷î1Î\6HjZ‡öÇà‰<lFãÖ¦í,[Kk
;9Ğ!)í¾:ŒÊF5Q+"ë8Ânbí;0|eì7ó•ÚÃÊZ0nó0ZÄ¸­ïÏ¬È,Å¹µaâœGÓÕffÁI4!vNCëã½vA^µ:ÀÅfG;¼¿ÍxjAáéùŞ(3ĞÈ,FR™m
Nù	N×²kåú.LÓ
Üğ¨<ğ,<<t…Ïù¢‹Ş-VbZ¢Ã¡¤ne¹‹²·zÿeœ÷È-C©à4zÇ¬*ºÕæÎ¡™{$† ÔÑ¦AÑ)"L<¹a¯†5ÌW?gc]rÏÛ{ kç^Ô'Ö¹Vd›@ <‰Š*½fÏÜñ™ÿÒ†Æ3¯;Üq@×>&H@¶‰¾óÓáºß›Š†¯ÌÎ{Xëó¤=l¬­ïE\ ÔR}*§¬aİ@Áº §÷::Ïz­G®p2§¾â`CIõµÒzFÚfêî<7€¯|Z£×¡¼u>I¤Ù.¨â-·@pÚ&!³ßiöâYçp¤µ]×ªXQ«#ÜëÏ%Fc¤fF˜€g1æÃÅ=µ`zOO+?|2Iât;ËÃş™÷Ü2f+Ş3`½÷^!!'œ+/Ú…`Ù—³—1³B˜^R_k3w¨I] <ákVÔ"¡Çam’ğÜªÂµîZ[	ašÍ\±‰jtTïuò^“ÕSÓRÅåÎ£™IºuÜò˜)òÓ¸­_j ç<2Î(®8£ÄìpçZS¨íIïd<ìyûÊ§ã¡¶·oØÜÜgœ^>Ó;©nd9j©y(nô!äÁCG-1Ñu³?·õÅOr‹k•E»
¢da
õšiíMYçÑŒVkUù4x ¼\…â[FáH‹`hV¯¤ÉÉÌj|\¬²†©{o-ÆÅOtê0‡‹ÈÕÁ“M¼òZô/<m0ã¬¤l=Ô†
WÒbmö' úA PO5ÒèÜî¼GÓ:4sDÃÒGÅ\¤h68Çhd¹ó`šãµÄ –è)ÁŠæGåruß~êÎÜÜbüşó½şJĞÌêÒlTõ|”[ 8m($^yvªz}4Íj£@Ş`è1:B|óòòŞ_¯Š2«““ÄÂĞsŠR°Üò‘œóÓFĞ½ç#9áá¾„IšTgfÆ<˜zñÊÉd)`å¢uø‘,÷‰o‚GDcTË¥S»4Oxfğê]ÆúTçç}±ì![D_Ÿ°¸+EP @‡†{Î!cÜ:8´êúq»ÕÃBkÍìPmWDàÖd¿JâÌƒ‘«Óßj0&Â§Ï(ôZ¢»áU@¾I‚S‰zªC¹_Ùú†Fs÷ÁÃ@'¶¾ÿˆZr¹ŠMe´juØ‹İúÂ,¥¥í~€9¡e
uëµ8ßÚ<ÈE®³UŸ-x EÛyu0‘»ÿ¶·l¼ ‘tn42+t@ ˆH´3`}wÜW3hls©•°"¦¬Ê2¬%´Tzfˆ÷°gc‰cf_‡WÛ‹×r E'&v
ŠÒb*.îÎùûúıÀ{nıî¯ã×î1¾~Ec¬ÖûïlfµD’SBÈ9j©9QQZ:¯‘7üYÍ_*^5ƒ"‚«šG¹¢1ŒÑ
I$»FŒÌz43È9¾€û‚„gÍ<ÈÕL<T$Z·²äpˆQºjâì#qFå×-;YqØßbœÿ¸†I©ã½Ê¬V@ (yôB±¶;!n‰°>M¸±Û½¶?€O*ßO/”nÌ8ÒÄÍ÷àjn£KùÃ"ç„Ï“f¡`ˆ™äi|m…ñl±+^m®>9İæÌ°İ öAøÂ¦B¯âÌ@#w¨'²?.B.xÜ¿˜LÌš¹ëëç—Î+4Œû×ĞV¡Û]q}Ó:î§W|ô}D¿ ÿZ\KL4…kæÌ†í
_HÑ-od¡PS6…Z¢b„‰z@fç¼‡Àt¼j'İâıyÏ¥sï;Œ™U…±)Õ±1ĞÌmÈnUR° @ªUPUu!šuCøÚs·wJœâs¶rœ*Œ[«½.(ë({Š©yjt+r,·>ÆƒúJÿŒà>ŞÌ¹m5¦ÓXÛMô¯9L:g(
âÕÖö°ç]5¿õ¾ıNú}ÆïS˜ï½ÁŸ[?+@¹à±G=5hd¶/’[«&ç»í§äeär=g¥à½ïİn½+Ñ×mWƒ‹n².LábÆ§÷ŒFnCªã»û­x²Ø-od¶µ_]OR£bá<¾yœá«'Î¾ò}ì^›û;Œ3/(ÔGº÷¦ÈÕàBèÕ¥0i|aScTÕ½ŸÌ„­í!99Ñ?°«HÎk©FjB-Ér‡Fv°²ÖSmGáÃÂhÚ0·ÖÇØÒS¶N{ìÎ{(­`ª:€ìñÖÔı¾ÚlÆWÏ+Lô!WÏŒQ !ä!ä‚'µT#·®òL
X¾p!×
ÎùÊ_¯V
v²u_N†òÌƒ‰Z=10JG×,ì™™G®Eh6<sko¬™¹(õ
ñ-E„I™"ÌÌ±¸Vûx±~0ù¤®‡æAŞÀ„…MÓaï,dÇ;ÔÅ]]  	İÁĞ¬ê)áŸÑ¸±SB¶^rf}¬òıt Ô~:ÅæDjB=NŒjEjö“iwN`Óı?êĞˆÿ^!$ÚÔÓUªJÕöHœ+c{æş“ÔvÕ†‘oï3^YR˜™êı<Lv]¼gBÈBÈO ˆõZ˜’÷ş³ÀòSÙ>ˆÑj0&lfPD_«wÈˆ‚Œ¾–hÔRÓ"ö™-²P=<9—u¾•wî\èR×Ò¢[Ş{‘´=È¿{*®ÎW~]÷@•$úÍ=Æâ…‰éÎÿ¾‘9É'‚cPKM\ê\Ûjøõó
ìå%H.W//×ŠÀ¾z¢¯T±÷ŞCmÇAã}¤v@Î3ëC}·¾åŠn#w€çÖƒ@¨Å¶ÄônÊ6hâ\e½äHïO•³¸Õ ¾¼®°8ÑûïË]ğ±1Zší!ä‚'…#ÊÖ›}rÌ®\xÛäZ7€â:€Ã@1éî¿±ši¢QKt0 óa:a½;aao¬–ÉÚIêbpJ­š8‡£D>©.'W÷Èö…ó
£“Ô…[ÔR-„\ Ú d¹íZ/	ÀÔá·7níp×Ú¤¢OLµÆ­!ÿ¬j·õ–î¯¶ ç…ÜœÁ°>qçı‘,ô“zš´Ö»*'Î@Õâ·ğY=øZãÜpnY¡ŸÄ²,wPqà!!<1H´Ç¨¯^‘Ö“tÌùÉHî±ÅQSåSò–YM‡‚œë¹Rü¿©H~U®ªŞ­²qr_u	´ÎCS¹Ç Í€ú0·B³Ç‹Õ€D:è@Ğ&Æzæ%ÜÖ'ê„ßØÔ¸‘İúóZ)87 ãV5¢_U¬Z±²f´j)¥*“V‘rUË´‹÷N4ˆ¸³£×õÜl Ÿ[RØœëşk}Fk‘«„°/(˜f²u¥¥‹ª­l½x˜bš]õä½8TeDç}0lK¢‹«uÕå™;7(wõê÷Ç‹Ï¾Ôe9ÈÕ§ÎæV;ífî&â®.Ğ2níR~4ës
Ÿš#l7¸ë™à¹zãVç+:GµQ¬Ìh™´ÕSöåöôËÕKß"şƒ ÎUÜË­=ıÖc<³®PïÃoÕÅ›Äu!<a 
{Ğ¬÷ø3mK4š»ü A¦Õï|Ô€¤m®¢Ï";”*:èa*³ÕD¥9Ï•ËÕ
vÅ$ßq Í%Î.æ×4L]	ybD®.]	yîPfœ½:Eøê†Âµ=F·¡ú ã…ë¹«¼¶Q¬'¿®uêcTk§üäu¸8ß†8W‰"YæpSœØj0^$|ü¬îóş†ÆI¢…:	„@;Í¹í”+L-Ø6kVµ[Aô«U#¢J6TÕ#®â˜ãÄô@œaøÂq‡¯zI›"UnÜ1j“Àò¹ÎÌ°ZÁH´‚Ğq@ è@FuTRŞ¥°º¨°>JhäİâÒÂ4›+—­WOÈ«"úŞ'õäŒV‘”Ÿ°¶st®¯º)Ş8WRÛõÛ}rõ½¸´¡êş®™;‡Ô(i¶„Ğ/)­ĞÌ{Ÿ’')aj‘ĞÜo_àËÆôôzU~Íƒ¢İauãnóÑ‚Rì•{>™¼­0‡qÖT-Áõ’Swf ±L­f–»rë I•vm‚'½·ŸWxe°Óì<P&4Qå>1#úZ¨ö23rJïÏò.™íÿúÅ ÿaç““üpİû¯Ù´À¦>s®¿é¸òÿÔˆ7Œ@¹àIı’ªàš[ßóURæÏ©M”"¸Š««ŠF"•KÛN`şRíB¦Ş®éa´‚¤½ß‚uÿÎVUÄ¹ò½µV|K÷36g¬?Õ½ç¶ı¡H ¢hdÖ•òsM€§×4rtëÏëXÏ*m P1%¯˜èEÓ´Ş_/ÇºCh/¥& ©Ö'j¸ó ‰sÕµ’ÁğŒ#×e l3>º©°8Ößïs1ç]öÇBÈO4L,4½ÊÖ“anC!Û{Ğuµ0©zš¸g5ˆ)y¿Dßº°Go:ì>iEP °'Õã¯hçª£Kz Î½7Êı¼ÁHÆ+;òÜyxfy@ (q÷FIãÖç×^œ ìæĞBé dëƒ#úı\×9†ct¬;D{õ½K˜£Jm@Ä¹ê©{ñy¾n#Fğ›—uŸ×d43‹Ô‘«„lh¥ JE¤ù‚k`lš@ Øü’‹jeë„Hô+>PŸDß:öåˆbbBi¯ ÇÅt|xÄ¹’_ÜÏ§4¶Õ§j]:ëÎy€;7=@p´nëe07JøÈšÂV£³l]Å†»­\¶ˆ¾€l½WãÖ £.öš»]?(·¬ëÍÀ•Áğ@åkXÅÇ¢*Î4w¡ï»æõÆÇÖ3ı½f ij©4ÛBÈOúUQìğúe]õÂÄÁ6ü9Šl¯êø3R˜3`?ËG¤{O¦DÁ.IÜg+;‰çø>«^/ƒÊ=-s]ï½=Æù—L—‚ÍÈ­‡¹º@ ”¯• R££)Y9òüÊSëh”È$ˆŸ|ÅD_µ¦ÆeIbf}È/Qs
…#6éËÖK.†Õ½WÆ`äêà‘z¨);`g›ñGÏ›¾Ç¹sa%@Ôo!äAxö³52F˜Z%Ø¬}‘RMK*.® ê÷Ó{šèÇˆ3­TO…/D¡©°Pæ×Ä›W9q.&ÙªÚ:3J»ÁïİcÌ¬¦:?*gXï¥`AõÒô`Üº<Axz]áÚN7ÙzŒÖÄ4{ ²uUº)‘[¦—ßatøeÎÀ{_¹¬¼Eœ«º3ƒ@­æ!LÇŸ]Q8;£ú0€FfQKŒ$§„@ìî2zŞ³ªO¦ÖÙ~{ÖMwÍ|\/T    IDATõænUŠø¯2ıÌ¹EÚ‡„ÚhE„¬ÄÎ~1±q®òÀXK¾ÖÆ6ã©¨.<»p°V@ è½®%F—&äDÀo>£aŒNü•
ãÖÊ§Ù¦d•}Eaõ©Š	·Ñ½“Lî¥Ô†¢ÔBœ‰*QÓñ£fn·wô¬Fjú>4 ‘;Ôû¾€@ „\ğ¸}YUˆ?ËK:²ÆèXÈÚv¶ıu²VmÑ.LeªŞOïNôÃŞxØ	ïwp qVj¸Ä¹‡Úzä3ïØĞØg8œùˆîxƒ\İ…&†ÈÕ GBjU±bUW.Î+|°Í¯«xr@ô«oâîŞ3¬çÕ£CŒhî:+œ÷¯ê²V$¾T]Û;h€›»Œ¥	ÂG–ú5GoæšB»@ „\ ˆHİ—Sèø”B}Šà,Cr	®jÙz$©ƒØ#ïDôî÷_ôˆ cTp?æ~·ˆ38÷ï¹ÜÔ€İ»Œç5Œ¡®¯5³µD¦ã@ĞÂj•*¤¢ğûÑ¸·\Æ;“Üj§Ùèc0	-Š5wciŠpbB›ç}Ç‰ü då…k»©¸¶;f¢CŸ7pcø——5ÆFúÿ]Ì¢Š\] „\ ¸¯ˆ(p”Qõ‚‰YÂèµ‡â^ı42n_±l½ÈúnwÀ’ş`jR™-ämù1Î¬Å§‡Eœ{=”4’ñhî›/jè.JµâP“
!‚şêš"M¥“TŸZWX%ÜÙçckEáâ}õ
¸Ê‰>ÂŞûq×,¤÷IIDÁLÏ:>ö,êeµŸ³‹;éUÇ‡9çüŒQ3À§ÖFúT›{fdÖ¡&ruràÁ"˜h…,w=‘çú8at†`›íÉñl½Ú×«[®èƒ úÆª/F©ÊÈ¬QaÒ~¿3+£ˆ%«~:>ˆzÑp)CÈ;Œ©EÂô¢ê˜­Î’¶Ô¨Êïƒ@ <)(\À]Æ­FşğYk[ÇWØ`»2€$•AıX¹ï¿®‹RõD«ÊÈ¬>Ô¹ÿ<å¼Íÿª‰³ç#.è•Õvpkøú†ÂÌDÿ¯¿™;¥*?‹BÈê©AÓÚÉóÔ¬‚w€wÇ“ıAuÑ+'úÅ~ú¡cˆóï8è*áàããõWÁ i qFõruçËí¤wõ—4Ò:u=	’6@ ôD+ ‹oÉQB¼¼® p¯Ñ¥ó dë½ÅöDô½V‰)FQåuQûä÷)œ÷hŠ‡ú®`æv¸yĞÌ]>ºª0Y?™\½–šjó\!ä‚Ç¦h—0k‡éB2ğ1?¦£IKÕäy ™¥E'86˜kƒÃè ŒÅ´Sòâ à ‚8€äGBnJìÃe`Ú³°¡`ÒÎÿ¶¸"W‚““Ã¢Î”©Ã`zŒğ4níò±¼IÑi• Hôy@D¿@nˆTå“åâ£àqp¦â¨¾DmØÔıĞkİË_š'œ]P'ºf±Š&t\ „\ 8¦`ÕFf{êLÏ,+è±ã%fJ@<˜(?ˆ)¹j5rë@
}Eœ•EpuÄŸ™á‡¦Š¥gÎ®ƒ˜ºå&äÍ=ÆâE…ñéîï­•O*t@ 81££‘h¹&öXğçnåŒ½ìxâ¬¨ú˜2E4¢ßšèGƒV50bV©ßéâ*Ú ˆ³ˆ¢îàº¹®7€O¬*,Oöÿ»²Ü†‘ÔvràxÔS2K{¨„é(alZ!ß;şÇÉÄ4{ D_Ã¸bJ›èÁOiÖğÌ°áJîcŠ8÷ë|©kzìßc¬\Q›êî®ŞÈ$ŸT ªBjt‹–˜ŸTø­5…­}îP‡C¬ZÕÓìAì‘S$úÖ1rçãŞø`ï»VÁ%wÖ1TåîêáŞbâÿ@fWF	—ÖN6ÙŞ0Zší‚‡9I
Ù¢¾µ¤ü×xv‰pëM˜Ğîim4¡™‡t•a­Ô²ª*Š6ÀÈ¬GjT ü<ØûNñ½	€8så1+hsë;Ó	yƒ1:E˜šíş¾rçâwQúš@PM­$hEÈCbt)"º0Aø­³ÿù}‹¹1 İQ1ÍöŒJw˜µRQbÏ•‘·‚èçÖÁhÕ2P4ˆ ]×Ó¤Úºæ|[}"‹VÅŞ=p«|yxzNğZ=œgŒ>„Fˆ@ „\ğÈ£4²ŞùÂ7”s{Â]T_1y6šĞÈ˜«{Às•Oö;!d¡‡×PÙûà}õñaÅ¤¥kó€ÃşøÂÂÌbI¹zªÅğE *D-1hd#i9’K –ç	OO»cªMî4Q„zfT¹<(¢×f.WY3 8_Tø~
o˜*ËeË 6^Ôy`ÂÏ;µÉ¬o5†!äAWB®qg§	Ïå£·fV	”0œÔ1ÕSkçªŸf+£–ªv’rë ˆ†f(–Y
Õüşb bøÒ`;øŒ1Ö í.WoæS£51|‚J	¹ÆN#ƒcFÙÍé33
¯,+üŸ¿ô˜¨#·vµİ:VÕõQƒ	[µD¿0µ«¥z(qšÖù ‚KªùıÅp¿úÚ~àJÏ î6W&	Y9Ùt?·Z«ÊeûA'È·MğÈ"˜Œ²Ü•ş™´N˜˜UÈöÿ7ZûÊÕß…{lUÓƒa†(—R:®ì=97€|R„©».1ºp–Q›&,®—pbÍAšè	Áy0UáÙšå®t®àé5qdöøëŞZImWª²„Ï!o\k
/DTÙdŞ{‰sÅruæVÎ<Øİ>sI£~‚Q£sA®ˆ\] „\ (B=º­÷‚åM…¬c÷­ƒ#kõ™äZÅÌÒ^Ö3Ç‚¡‡V°Â™U‡x
î•çêãÎ¼’Çn{kÌ@s˜Z!L•«73_ä¯P ªFXI³=·>¿¦ğ™iÂV³}¥HÊİ j;øä†q!Î•‡Şì%o”`,wrRîù`/¾:2$ëÅèNƒ±œŸ=wÂé¸ó Cší!äAé¢Aa×,·®'óÅs6?¾GN±À:ç+Á'%úÌÜr?ûMÅUajÓ/\IâÜÏuU‰½5öÁa}í‚A·$7ÏŒÜºO*Œ\ ª'ä‰nM+ËbÄ —Î(4sÀ—¤¢ÂJZÕ
¸*ˆ¾ó¡&§À(”ˆëøDg_¸«Ó Y|nï _º¤1‘öÿ{Š„V¢~!z.‚ZëV³k
¬ —w¾nÓì‰¾‚=ùšóö€9E»MÅ~¶u' äÎCU>qf_ng?ÏªÎX½Ôı¾†Ìw%†/@0HB˜hì÷¨€{ySãbÙºVWŞ’­Ÿ ¶ç6Fœ–ó´&dÖ÷}¿x`ûãÜÚßßÉµœñµ+'S­yïa?ràÑú!5º§=r¥€¹U…Æw Ïƒ‘­+UäqöS,Î…îùiÌ‰V=eÇŞ_°™1˜|Ò29f`‹±vQ#éş²<š„Áà0’&hf¶'’»0FxvCáÃíãël˜’W«€+ˆ¾ï³æ6AuÊêŠ‰ùäıJ×[ê·ŠİÕÁ!+øğğÅKõôd¿Äùğù%FËŸ@¹@Ğ+²*_º«O)dûÜñß(¢Ê£Ä
¢ßëu‹è­éÔìĞhtk}OëE£¡êı²ƒëv7’ñp°ùÑîN0ÁpÇÃ%ru@  ÒD…g®s=ıÜ—ŸÖ˜ğ@æ'Ïƒˆ	ÕJõLÈwPêtî-ÆPüz?·0såÍkæƒ˜¹¦ö3ÆWŸÖ8É`›š"$rur 2¨!³åŠ6°tQ£±Ç]¯[Lo«,nJõ>yÏ­èt˜èJj{tfuÌ•;°†‚Í(shl3Æç€¹5UîsÀéZ‚Ç3É{#äg[&\;F§cm÷ëÖê}’l]hb'úôNe^1ÜÓ=ó…ú­êf{tWWŠpm›ñkë
kSt¢ßÃ+q„8h¥BDJIB&æ	:!äÍÎä™(¸W]Üz!úEÁN½¦Ä¨è[îqá”Zñ[óÌ  T¢BïŞc\x©\NŠmÅÉt\ JÇéÛzo<ğƒıÆqıáCZõJZf—]İ
	%É#Ør¹2ÒËÖaE¨¼Ùî<Ã(Bæ€÷_úärõBPKŒüá	„ımÓã³"`q³ËyÜ{ªz¼¢ï}(!b‹Ï‚$a… ÌgÑ"ÎU;°z¨»‘LÖöõgºˆ¼ù°F‹\] L49+İp|—æÎÍ*ÜØm_‡ŒR’­—“Ã‰)æñ#! ‰Ö‘—y¡fV/WSz­¶ö/Î)lÎ©ËÕ³ÜÁœ’ôrà‘E¢{›Ì*MX¾¨‘íÇJsÜ¿SÔÊ»¬’´\—î<s8„­NåŞøñÍ°ƒ•å®ë}ó%‰soğ(³²·œyN£6Öıß:šâÀ*« i¢ÑìQ¶à_<§q{›¯Ã@õ™äZu­í@Ì»ÆAJÉ£ ¢ ‚ËmwÏÃÄ¹J8É)kÛŒ?º 0;vÂó3¹C-MäN „\ 8	Šıå¼d]i`ñ<aÇ£“…«ŠE»âšÜÖÑy‡-oå?z¦Z+hM­CÇqÄ™1˜|Ò2®íÌÀî–Çùi¨kc¹ó 3Rq`‚‡DC’J3ïÍmİ(àk
ãuÂí=~ ïNT˜°À¸Uu&úÎ3<ãÔ%¦”k£BZ	â\5¼ghMØi2æG	gNºöí˜‘åõTj»@¹@pb¤FÇ¬îe›¨FÆ¨‹Û:Tí„ü0Ñ?î²aO‹[†Gî…îª…²Ä¹BDÿczQaj¡û=öÌ°Ö#Ã@ x¨*1Uºá^`¬Nø£Ë7wÛ÷İƒ¼¼ÿìğãÎªƒ¾ØU6Š*oF?ÜÏƒ:~ŞùÊ§ãŞ{(¥°Ó~gMamæä÷°™9ÔóÈ~!äÁ©B’èV®ãmÂÜY…f7Ù:…Èªeë öòbŞhz¤EéºóíåmÅ{¯Z®î˜K©
öî1ÎB#©wÿıŞ32'¬@ğĞªŠ‚‰WŞ!I€/o*äÌØÉÚÔïh8VµOŒ:æšÌ!…„NybJ©ó–QÇF¡rõª›ía:®ĞÌ¦]U˜¨üwìg9ê©˜¹	„ÕˆB¶î|©w’/(äûùxˆHñ®Z¶NÅuùhÁv!L=ÑZZ©œY‹È™êTŞw?äMÀ[`ù)Sbm¬8t$"W‚‡{P%‚‰»Ë½Öáñ1ÂW74îì¶áã-ãÖª“TÂµïWëYïƒT]?úu¤0yËİƒªDëq®ºº[ç¡Ha'c|n–piEUrMç5‘«„Õ¡–˜Rfb  `zU!o0|‡Æ;E[ôª3KµR­œÎÎ{084“Ï¤˜ØC‡Ä¹jB^¸¶wœºĞØa,?­0RÂ†™ÑÌê‡"CAëHîz›’OÕ	Ÿ;£p'îOO+j…gT*[ÑSrçÎy¤æÑ\Ck†	 ÷7Ü÷•{ßx«ÂN<¿¢0?zòÙÈ,j‰Aäê!äA…„\³.·G>2F¨y“»_ñ”œ(tÒ¢ï<Ã:nMúÆçÙ¢“î=·Üæ«„sİ]]½š»Œµ+õñ„@3·"i‚a‘¿X­ímš­XŸ'|j.=ğ¿Ç¦p•²uBmÊQäÖÃhıH%¦”QG•‰>îä«Êk»‡V„ÌO)à¥sÕL´Y¨í²>.B.TYb¦gÙ]³ÚafM!Ïº”Š»â]3Me˜‘[öÆÃÌ…L`˜1¯>Ÿñºkyƒ1:E˜^T(ÓÄÏr×ŠrÁ°jˆBî|ÏjµÕ)…/­)\k ÷óùƒÕŠk{AôcmW
Ğúñ«íD”ûjãt¼j‚ë<C‘Â=ÆÓ«
ëS'ÿEAVÑBÈ‚ 4rWjš]fÖòF÷¢CŠªÏ,%öAMôhFœ•~¯ZAQh–xÏ•¿Wç}8\u©ÓÙ>0w^aj¾\AtÉ'‚a"5:˜ºŞê°&`sEa£ş l½ ÏU+àÑ?˜Çh­İı3ZÁ9kƒƒ|•(Ô`Ü2>IWr/›™Ej4”LÇ§ ¢Á<†„\cg?3w•D›ab`›ï¨cµQ&U6S‰Ğr[×D=Çº<j`tUŞA/òI;’ö°0F!)¿?>1’Ê–@ ‰QQaå‘ô8OzfIáó³„?¹Î¨'t„„)"80\é.q!['¦¥ö"Š¹Ê§ãÌPJáÃà…9…ç–ªiæ7s‡±ZRùêœ@ „\ ˆÄ91
Ìb´Ş}²92F¨\.„œÛĞE¯êù]tåÃŞø“Q
×õ2nè¥‰~”«w“Ùœ16OXX+WĞ™™«"W‚¡‚ˆDŸ˜4áö”œ?«ÁX8´Ö“"°¼ï|èµ&yfE¥T½R"äÎµb[«$úD
Yƒñ•—TQ3ëZş6r`@¨§ûÍr„||Š0>Ohî0’İq¢ Í
Sò“?ÄCÄ™GbÔ·ŸLDÈGJÕ4"\$÷.Å4÷€ÅË„é’ö"ŸTúç@0|Ôí½Ì¦çÎø‹ë
ÏşøUÎ˜Ô³p c’
s5ê-ë=@@j,Ã0R„Üz(ª¦áî|HN¹»Ï8;JøÌÙjÎJYî •ªÜ|N èÒ<¦EÛÀ9W"_tlZal‘º»aÌV°GÎ ¬s á±ŞïtU$åU¬í9ïaTwwufÆê92Û{†uµD_à4 ÑÌáÙÜ+fG/lhÜÙÃûâZÑ¦'¯HÎØã–˜RZŒ!dÎUb”çãêá{Àï=§+¹Ÿ­aˆV¥‰®@¹@pz¾ØDHF£ƒËı$Æf.CÇ<òâºà“›¿xÇğ^Ğz`4©¹;Ùns Úİ
«m2jÓ„•‹%åê¹E¢uånğ@ èDaJŞÌû#|_¾¤±ÄŒ½ŒÛÔöQv2"Î´¢'vújâä9³'k¸3Bm¿×ÆRÂËgu%ruë‚é¯ÈÕBÈ‚‡Q´SƒFVÎ$mjFÁ$a‡¬Ûu•RAÖwÁ>ˆy’åRclœçeÀwuÕqêÍ4v€¥Úh¹{ŞÌ\œ!‚Ó‚zš ™¹¾ÈŞÒ8á…³7wüßtI*¹sPJ=ñ1™F«`âz‚†;ÇÏâÆğõË“#ÕÔâÜùV\›@ „\ 0R£ù-Q¦éD˜\wƒVßg‘	R)†"Tjzò¨B«»n½ï[uà<CéÎŞ¸ìëgŸ-'?·ÎÃ±Gb4dÅL NÙ3AYVDŠõŠß½¢Á»ü@&¹Ö!I¥ßZ”;ß2i}âÉ’¸â×o“Ã3c§	ì1ğçj¸^…\øà$rurà!€T­7KLÉ'’)‚-±G®ˆÀ ¾ärÅn™Ñ²—Ü:\)}¨˜CÌJ·ºº¿ÍŸ#Ì­—{äe¹ƒQZ
¶@ œ¶Ú €kfıòÍ…Ë«
Ü»_¶Š]ò^k{hş§ÒÄ=hp(‚Vëzorp\¸½|íœÆÌx5tÎE^bä&B.<œ¢M„Ä(4­-ño©‚m†ij·Ó€Rëz«0Å´>1J
ö}÷>Ñ
.F¡õzRD³cØßa\xÑ ¬B-³‰!q`‚SˆzjĞÌm_ä9ÑÀ×ŸÓØÚçvÆµ¦ã˜Üº`&%ãL¼!½6ÜŒ¦eÜÍ_=¯0]‘\İy#‘ıqrà!=GVp’uÃÜª&"İ¯«z:0y2­Å$¬ÍƒH…}òÌºî«÷Aşß‰7ÛpX¿R^®î9|w„Ái$z
Z©¾dëŠ€—VÎŒnîñ‘v®Qöå[Œ+EĞ"Uğ¼¥ë¾Gé:3°µÇøü’Âìt5÷•£\=Ñw&B.<ThEĞšJí¹5JPªÙÙe'º™u H:Ç°t8`å%Y}K®Ş¹°îÜeœ¹¢Q+W€së (LJ@p‰PKË%©´CšşøYk÷NÉ‰¤¨Td*LËAå%ã¢¥ëyÉ†{hr0îä„/QXœ¨æÎ†ıq‡41ò¡„»$Z#·®+Ñ˜%$£@Şì^0Eå¦äÖE‰”ñ¤œÀ(gÄç}˜ltâãì½{ŒK/P‰ÛÏQM¡cs@ §õÔ’×‡iXª—Ö4ê	áŞ}5¿¬Ûº÷ëFS«I/8®¶«¸êW¢ÑÁŒİŒqa\áÂ²BRQ)¶áÁHE®.B.§wóÎ…€0·¬ĞÜ-![§ĞIïvpQ¦äÏR°»6:b~¼+!ocæ0Íèp_÷·“„©E*%?wŞÇÏK@pª°Q&ŞÌû›’OŒÿâ¢Âí]>R”¢–ahÎãKIš·%‘hrÚ»œÅ¬nì3¾¸¬pa¡:¹z3·ÑtOÎb!äÁC‡ÖÁDÍºî²õ¥Mÿÿ·wßÏq¥w¾ßßÏ‰ĞsÃpÈÉ9+®´Ò†ë»¶ËµU®ò?à²]şü›«l—o•ï½Ş•·Vº’v$fFšÈ0Ì9gL IäF‡ÿp$È!95Cß—ª…@‚˜>}Îs>Oø>3\’U[¿ó(¹nq›ª4*fşºÚ¦—ém¡¦Şµ
ºŠFÇç®1±¬™½şA‚F*°
!ÄN¡pm‹Ú=n–rë;FBEyÚ+S½wêÖ4:ø5²íë/mGá];Üë¾&g,è0pïSS¬‰vO‰92]]H â»	ä^ôhĞ»º{L¼@Ïx¹Rw^G>U…]zÏï-”«»T²Ÿ:>w[?îU!ô }¡‰iÏ ÁÖ/¯¯wBñ <?g¼æûæ@-yƒ7ÚU}Ó×MCE´·MU£ıĞå0|í¶}ª€ëíî³B#•µIƒU]÷¯cÜ÷£­×élÈ…øî8¦1£iĞ‰œ"–RÔ'g°¼±géí¦¶¡&ÔÑÔg™uo7ZÑR}Û›¢PEuuÕqMÛb“ø‹¹…eÒ`!Ä,¹‰Ú¡Ãïéï·¦¯t\©j¦´_Ÿ¶~Kjœê¸µMS*uß£©-Şmf-¡¦RW,ê5HØ÷ïß¬Ö}È…ø®Ù–M!ÿŠ^t¥ ¥Ç VY‘ÃP„š›ípÚTuCFZïıâÔèI÷C}Ó,­Ûİeæ¡ZÖt,1p3œ®ŞX?îØÈ…b6µu?¸çŸÑV2XQT¼é£äQû=½?Xu?ÄPQRqo¢-iÕmkûLÖ5½â©Şû×‡ZSó\GÚv!\ˆïö>5mİÿêië­óLêµ™ÿÜ©8Å÷C²¶ì~0…¡¢Ê¬S¯±Öôİ§«×'5ñŒ"ßb`Ì Ö<_Öû!Ä¬
w*êp:Tïm”¼§`°®h0RåúhJEmL8ígúûÛ”`÷Í[tOæ7:Üµ†qÍÊ“¶ôık‡=?%µa„r!®mâù!w›µ®{<wSL5ÚÑ
¶l«qßD[¡q}vC¨5Ê¸ûvgÕ2´,2Hfv4S=è2¥M!f“©[Ï¿·@î°°Ë ©`ú@»jnÕzjÇ”°Q¥[^óûÒ¶7:Àı0ºošô4É Ş^rÛáJcºº6!\ˆ![&aŞ±PË”XR9Emr†'‘¡®OS÷m²­Æ}¤”Â¶‚@7Š÷hÌ»l*xzšæN'>³#úÙ®LWBˆÙÈ§Ö$ƒiëµ›¬Ì*†«ú¦¢¡
ÕhÛÃë{i‹ûÊ§¶¥CÆCV´tgïßkjMİ“õãbœòˆG+Ø™Ôı û.½ÜÊP´Î3¸x$$>ƒiS¦¡ğ|Mİ£Ÿ‹šQ•vñ5
ËPÔı 1ÕíÎÇÅ¯kR%E¡uæıu/À±¤HBÌ¾ö!
v5Ï'Ã{ÚÙ$aÃc=›v„	0EC•‚º4Â¸A(mû_àŞÌ`¢06ªøÙËÖ}P÷LÃ¥hB¹’˜c2QñHÄ4ê˜”­#?³+h4õ33µ7éWÀ‹{£§şï.‡dª˜[ç|“|Ë§«k¨z>É˜-/²BÌB¶eP­GÛŞkù–æY¼¿7`¨™Ø´´OTô3¬ÏŞ4®ïÖ¦Îôïèi÷:!!ø=4„:*t;}9¿ÒÓ>†ÑG¥Á£‡´‚å-š¹…û»3M­Í|S2a]H âÁáÚ£5‚ Ä¸CÃ€¦n…W×„_YÌB”RÄ]S¦ªÿÅï*4u?ÄóÃÛ®Óƒh&D©Óœq_JFÓ][.‡B©ÿÑ†    IDAT1+of[ŒúA€c›÷¿Ò.,ŸkòËc>i7Úv351ÛÄø¶‹´êXë[òõïMõPë›şÜ—~†OG!Úo„h¿¢£]bY+LÀP:ú¨ÁĞ
Sk,ÀÁ³P¦Â²À²¶1b¶"á@Â¸­HØŠ„q¶"iCÒV$lHÙ`7šë±Jß¯¡µ{_î¥B­©û¹˜+ëş…r!¸PîXTêş]+nZ–"W2¨–5‰ŒºK˜Ó×÷®–éÎß‚Æzòº`„_®ˆî{šXJsf~óT©ûQº>!„˜µÛ¤î„¡¾ç)Ê¯-0xï0Ô:ÄhTŸA~¦±È´A¦}]ß.POûºÖ×ÃsØuöÃ(HnT€Gƒ	X
l¥ÁQ`=œéF€ÆÃQ˜f#D[à4BtÌ†˜¥pmˆ7Çmˆ[Qx[Q v-¾^‡‡ºë§×,‡¡±
åªG*î|ã÷Cİ°LÙ~VH âw-FË5´¾s¥nÓ‚RŸÁ…Ã‰¬ºí´.­!BL)ôò­º¾?yb¨AZ‡P€îùÆŒÖşO©Õ}Ò	W^X!„˜Å\Û¤Ró	ÃÓ¸·=9ƒ•&_hNhË@yQXMzLÿ|jÔÙ'
Ïº‘<Õõà1\C3ô´çà7®‚˜Š>7À e*+š­g5F¤KáØàX‡©ˆYàZàZÑóè¡pgI­RC)2	—ÑrÛ2¿q‘ÕšÕ’Á!\ˆm™}§£©m·=1lE±ÏàÔ`Ú„°›ùa´øÉ2d³‚o›i„ºQùÖ2¢cB 5=_cË”©mğd›:!„˜ıí‚jlf™÷6ëÉPğ½ÅğÅåègÄMEÜ„„	q“èsãÆçSMÕĞ†Š¦sQ€6F[`™`›ªñ1zî˜4
Ç×ûnÛ$·)Wë˜†‹uKÂP!®ãÈRB!\ˆ‘"*îV©ûwä†	™&4ø^4b>]´'i£÷\®õßş1TÑÍLİŠè™F´¼ Õ¤(tÌ¼¯Ö}bRğE!
1Ç¤Vˆ¹Ö=]×ƒ0¤+åñ¿½lãØ&fc´Ú4¦iËˆ¶©°ÏÅıw,<?d¢R'“tïi„»î(#ÚE	äB<Àü¡ñ*™¤{Ç&Ûq![RÔ'5ñiëÈµ/°C¦B}§¡<jl½0ZçW€eë-¾ÎLÅjİ'“t¤SE!†@n[ŒOÖ	Ca~Í»ÖŒMÖˆ9&ËóHGíwÖ¶'b6cåÕšOâv@©û¦R÷´ßy§ŠG’iXFTìNœ˜¢ĞmàÕon—½ ¼¾Yü…é}›‡aT&C¼PÓûøÌÓxİ09BñĞÜÔ
Û2ïÚ¶ßÉDÕh“0ş]²MƒdÌ¦êùxş×;–AUÇ·e£˜Ed„\<’”ŠÖ*U¶oÈŠ|—âÜ¾h;©0®µşÆÅF† ¬oÎ·>½Ûş¦·ù^‚¢µàa¨Ñ!×a£¢Îjµ
5íw¨V¡})Ø_£0kÍ°MCÖ—	!ÄCdjIZÜµgÈªuŸjİ'—Šİs…vq¿£…„”«éÄÌG»ı ªc™¦¼ˆB¹v W¸¶Éèä«­$³QÁ°Àei|?˜=ûUOÛƒTOÈZß&TëÛ„å©mX¦¾6}tzZXş½[ƒºRD*z®¥4ºñ‚G•h5ZEÅtSaZÑš}ÓT˜vTÇ´–¶}´l…ÙøhÙÑ±1›ªÔƒ€˜ùÕÇGëhK”¤kË²!„x˜‚œm16Y‹¶?›Á´u?ˆÖ+ÇK¦8?`®ÍĞx…ÉšO*6³åe~Fufdq¿@.ÄƒÏ4£}¬ëëÜşTˆ'É‚¢^Ó„Ñß¤÷\İ˜ov¯‡[@k}sĞ½åùôïéğÆÇëßAsc„ÿÖ |½¬Êœú\]ß³tês}ıû†ÑØ†eZÙ©mYQ ¶ìF˜¶ÛBuô½ÆsûÆsËæÏ¬ÔbLTêØ¦ñ•ûÆz~€¡À”[!*†¡pm‹jİ#ùûYk­™¬yØ–ùµFÔÅ·w,3I—±r×2ïXˆwJ6N,È…˜z¥°M“šÜ1'2ŠL«Áå“IG¡´"ğn)n„æë£Å·†å›şì´éØ¯«iá\©F V7B²aNíAª®ïE:ı£ºş\İxnrıg·„hÓTÑGëæ0mLJO=·¦ßµVp~¦·ŒMÖÉ¦î^™5Z?nÈÔD!„xÅ‹‰Jı®\•º„dî7ël1eFEŞ&ëäRwß
-Ô/Ô$m	äB¹³‚R
Û2˜¬y„Zß6ÀÅ’Štİ¤©˜†Æ0ô=F!Ùœ6êkÚÛø|êûÆ´QbÃ¾p•¡0ÔToLİ>
m6Bu#Hßôü¦Ç¯=šÇ1‡Ñr•rµN:îŞ±ÁöƒÆlBˆ‡m™×¯õw
p¾0YóHÆ)îù€‹»626Y#ŸŠİ¶ö‹¦1ûäx
	äBÌª QÔËóÃÛjóÃ€Ò‚×ş·ñg¹åMï¾>¢İÒ7mÚ´p#
ÍSß÷—i(’1‡r¥NÍ
nLƒ­e}™B<¬¥p-‹jİoTM¿Y¨5åª‡c™Äl¹~Ğ)¢ê÷Q‡»wÛcªµ¦æİyÆ£È…x€œ¡ÿåğ„QƒÎ¤Úly±f	×6	‹Éª‡y›mÍü %=èBñĞ8®c2Q­)¼iåª‡ÖšTÜ•ÎñYt¿–»Œ•«X¦Aì–à­u´-wäÅ³Ü‘ŠG¼Ñ¦­ûA´oå»f²ê†š„+a|¶‰¹QC]®FË¦„Zãû!¶iÈtu!„xˆY¦"š7]Íó™¬z¤®´³ğ˜Æ]›‰J=ê\¿é¸X¦!íB¹³‘mèÆZ³)Rõ|R	G
½ÌÆ›R¤â^P÷‚<Ôøaˆ#X…âán3¤jıkA¨¯ÔI'\	n³RQWÛ2™¬yÓv¤jİûÒ¨¹È…˜%,3
g~r?¯ÔIÆl	n³˜mÑzòª‡Ü8¶²~\!\¥p,ƒºuÊ†Z3>YÃµMâÜfïq5‰˜„Tëºql£Z@r\…r!f%¥À±<?ŒÂødË4dªúC îXØ–Áx¹†„Ôı Ç2n[¡U!ÄÃej¼î”+Ñ¦TÜ‘uã³œİ¸G›¬yx^@µîc[²•©@.Ä¬æØ~2Q©†–¢ TÌA•:u/t!„xD˜†iŒOF×ÿTÌ‘uã‰˜ca›&“UÉšGÌ‘A1{É©DS˜µÖ”«>qÇ¢\­Ë‹òĞˆöy/W=lËÀ–eBñH0…e(Æ&=b¶EÕó©yÑ®Õb¶·íZk*uŸPk
iiÛ…r!f½tÂÁ®Ò{ş0^èL“TÜÀµM™ª(„×±È&İF„S×Ãœ˜ıÃ ³±L%x…r!ŠFÛ¶¤ˆÛÃNÒ¸B<Z7º¦!ËĞşÆ]ºX„r!¼&—t!„BÚv!„øvHQ7!„B!„B¹B!„Bñh)ëß@Pàø™«ŒTptvvÒYˆ}‡¿Ñ('_¦–édIGò¬§	)^åÔ…2İíRî|Bj•1†'ùæ,®ÌJ_÷œ9t‘¡ŠO ÁJfèéj§”z0¶O	ü2çÎsa¸†I²Pb^w3	ók¼ÑukWGQ©<¹¸ıÕ½°ÇÄØ0+Cs:vo×]gèÚ($²äôü
ñhû*Cœ<~ñ :K•a`…îEÌ+Üæ¬Óïê\3èœÛCñ—U{å1Î=Ëxª‡…íâ÷p'9z¹Ÿ3C!st’Aí–°^ah¬Œ›Ê“I­ñUª\¸Hÿå2Ö(Ã"Sle^Wo£š@8|ƒšd¦››¸ÂÑsCØs™“6©ŸçXÿ(_c¦šX<§…tL¢Ù£Hî“îU}€›6òûİTı*×ÏsêòØÌOÖ‘~¶ì8À©òıÜzã[?úœÃ=Æ¯åİöpy¤ú-¾¨Ã—O²uß9F+ÁÿXy=»örhÄC£ı{yoÛ	+ò¶_×[?úŒ_ïÄ«sl×ŞÛukµ Œ{uNnßÈ¯?İÍ‰Ñ	Æ‡Oó§>çıç¨†w>Áu0ÜˆmÏ2P»ÊŞ-›ù¢?üê×¯MrlÛF¶ºÂŒÏ~R½rŠÍ{s©Ô‡8°}ÏNPä]&Äı§¢ÿé€Ph=ÊŸñ??M ôÏÓzÿ.~ññ~ÎßsÓî3|å$şÛø¿7clÒ»·»•S‡øÕ‡û¹æw¸]çä¾½l?=h&GÙôùvN^-ÊÁ_i’3GwğÏŸd¬Zcbà ¿ıÓv|ó-mıñËìİ±ŸS•ÚŞ‹uÎìÛÎ¾åİ=ÖÏ§ÚÀ®k5ªc'ùèÏ›ØrzŒĞãĞéŒ•eËİG•tÃÜsöígû‘2‹ô*OµÅ	½:ù¨Zxå8n¾Æ‹½K™›¼´aX÷¥›ÅÀ2o¹ne+—òÁ¾f:»ÛÈÆïĞ>z-›÷Ó^\È¢ŒC®c9o,rRDUÜÓ¶i™³ˆõkóÌiòù×-ı.ê¦©ô’ëÚÈ!ş¼k˜îç^æå…Ylí±²øÿaÃNZz;xªhİöìÔaÀ•Ã»ùtl.íK{ÈÙM<¾şi‚Xk§³é&é[ı,İnjæ#	:¤~á ïïó×óæÓÏ±|íÓønGº}…ø‹òX²ÀâÇshçv±ÏHòÒëë˜›»Ë²šjÛïQ}’‘K—É.^Ä’òyNLÌ§Éòu¯–ê«~=Ä-»¸´¸•5s2Ä2%z&…›‰K5m1Ã÷˜"ÕŞËšÇ\ú§Íœ¬²²å›İ,V¯]bë†C,èë¥;î~yds¢Ÿ§=V¼ÖCÊ0¾tŞš¦AˆwáÛ‡Òüğoàñ´fyÅ'æºrà$‹¯%_¤#«Ù·y½¯®gQ>Ilü[ßÛÉĞâ'y~N»r˜w×OiõZÒç>ãóÓU‚Dß_¦Ù´õ8çj|øû?a<û4OFØ²e{/T!ÙÂË¯®¥£¼‡_}1L¶”gôÔYÂ¾Çy!9ÈÆ£ƒL9Ö¿ô<kZoa©NŒ²õ£O¸êæ0ë×8=’áÅ—Ú¹¸õ('Æ gÙ*^}<Í‰­[Ø[Î+08Z%Ó½˜w^Zx£ÁS@0Æ/¶²áÄ•dÉª5<ßá±mãN.åÔÎ_a¨ê²xírb'¶³õR@ïê'yiy7Y5ÊşM[ØxjßIóØš5<S*³qÃ^®$Œ^¥ì;,Y¿šéó¼ÿÁIÎMöóŸß­ò7?zãÄf>Ü?ÄDÒ=y}^œã;÷³ïÒ0§~ÿáëX¯öñÇ‘^f9¥ñS|¶iGëh;É¢•«yaaŒ“»·°uĞÁªM2<\&»`5õL	Ù·R 0Ë²‰%’8áŒŸæÓ‡8ã%ğ*}ë^a¥s‚??Lÿ„‘)ñâO²¸˜ ˜`Û'[Ù5PE{ùÁÓËi	ÏòÑÆÃœH;xæ¹µÌSƒlÛ¶ƒg+(§Ä+?YKşÔv~»í2“A‚Ç_Íúùí$ Âê™ÓeÛxcq‘¤àP\2—9_|Æásc¬°Çùó{¨§2˜c×8[µYõÂ‹ô^ù‚_í¼Ê¹ú8¿ÎeøQ_’£{÷á¯xg/îåŸ¶Ò>/ËÅ}I,\Ââx•cGO1¨3<ıÆ+,M²kÃfô¢>2ÕkìÜ9@ExÚ¢}ÑJŞYÕÄñ-Ÿ±å\/4™³ö^qñŸ>=ÇÅ!ÅoßÏà,Éréä1ÊKã¥“ı;yoã®ÖâÅN^|jóbx÷ı}T‹íTÏö3j¦ybıZìkB&¤
1£Ä¡L¨_bÏ¾£u¯ágİ9lBÊCılúl¯ùà¤Xóü3¬íHL\cï–Øpv»g	?~jÅ„ÉÀ‘MünÛeÊAd^Y·œ9ù›Bu²ÊÉ‹>½+gşÙ=ì>=ÁãÅ4:äãw¿àR¼@vü2§jizõiV·¥¹²ïŞŸjÇ»çóÚS5¶×xŞE>xï á‚õ¼µ¼‰±ş£|´û4å¡!öõPı„_†ËX»ĞfóçxâÙ'È4°mãN¶ŸG%<ñÔzÃ³|¼á(«šüÒgøùš6\KÚ÷G»e‡ ^abbœÚ•“\4Ò<]LN^aß®l96FİN±ò…çY×j1px#ØuŠ©Ş¥ühı
qÅ¥ÃyoÇ ã:Å‚öõáSì¹2ÆÙ_¾ÇÄK?ä­>‡é·’OöÓŸèæ¿ÎÇ¸ã-¦R¥Š•ìÜ}ŒÖ'Ó–td7€G˜Œ]Ü«Xo½ó$½~~õ‹_òÏŸf$æà$«<4L¥â3rğ'ª&é`'M°îõ·ùÇ­eÎâuüÕ“]”šJ¼ôú<YœäÀ–/8•\À~ğ+İ‹¼ûé&«#>9Œ›ëà…5]Œmÿˆß4ñæk+i;Ë}'ï8¥T£Ns*È°ò‰eÌQıüâ×ÇÉ®{†·ìÜ‚SW*ãWÙyªÊâ§æo_™ËÄáİ|¼wğúvÍJiÎîØÂûıq^ó¾·Òeï¶ı9?Iyø<»’¼øÂãôxı|ğçÔ¬ãÍÇ“ìÚqœ‘Ñ2§·lâÃËiŞzûyŞZf°cÛ!_¬0ví<û‡ó¼úÚÓ¬O³}Çij­xñ…nZº—ó³7ÖĞ•tÉ´ôòÚÛ¯ñ“—–cÜÏ±ZŠuO,das†u¯¿ÂK2ø×87\Á¿È¦Ï6³K÷ğã¾ÎWÆÙ³q[OW¨—¯±ıT……kŸäËß½‡İ£ZŞÇ´Æ÷jLŒÑğõÖ"ÙŒÅÈµAeyû­X•½À{ïîd²ó1şî§/±.;Ìo>ÜÍp¹ÌşÌæ±o¼ó,ÏôÆÑÃ‡øÓG{»–Ÿ¾ı4*'Ù¸k'»ÏfÓÅ&^}ãş›Ÿ®§GçÃOûÉ-‘ÿîo_åÙ¹­Ä§~%4Ã£U©4ùéİ¦v–æ¤I­R#ê\9y+vO¾õ"/÷„|şşªä­%Yº-ã—Ğ•¨04x…¡Z@XãØù+ÔœŞx¶›ÁŸòÉµ$Ï½¼‚Rå"Ÿïî'|F*'XôØÓüÃß¿ÃÏÈR÷-zõ°º–¬æ'?~ƒWûbØºŸÑ¶ül]‰æ®>Şzù	†¹Z¨ìæ8Š¹h=ÿğã§YfŸåß¶œáêh™+—¯pôšÃKo=ËSÉ69MyBÌP•Ó°åBšwšCÆ5¨W‡ÙöÇO9îöòWı*o.0Ùô‡œ,W	Ñ”=È”–ğÎ3}ø{÷²ot‚ÑS›ù§û)>ñÿğı'™[9Ä»»Ï28ı|Ôå‰SôW“$³m´å²Œ>AÙóC¡ş‹\ñb¬zåIV®òÑÎKTë!©éíø©ƒœ¸t•zã&ÃPMtÆG9râ,W)sáÒIÎ[sxù‡«YÖ’fşêgøÁSóˆ×+\¼4JÍåÀæ/øğŒÉ³¯½ÈÖ¤93ÀÑíû¨÷.çç?ÿ>?[İ‚#a\(ƒÊñ½ü¿ÿú.ÿ×§c¬}óÖ7MpâàV6yù×x­Óãó·q)„li>¯ïu~şLÚÇşñ2å3›ù§O.Ò´êşúùEÛÛXºr‹óy^øÁ+¼ÜkßºıK9}…¥óI8Ö»
”2ˆåó·?\
G¶ğş§wùìøÀ]—£‰‡›Œƒ¾·i!?üù:±“ÿòçí|–}u]óI|~’‘rœS'&hü)z›®Ğæïdó[Q«–±¸»×6Q†íØT+5ŸèçXXcü¤¡MS>dHä
”Ú{è3&éÌ¦p—w’Ë'y¬7Á{Õ5àNeä´•dNKÖö"İÍö'úX]Êá%{hÚ?D­Eï’Et
¤Ë‹û866ù©şÅK==ÀÅsŠß¿wC‡8Ù¿†Ö.}½ídòÍ<Ö›eßù´?3F»}’ èçÈ©A.\æw¸:ÄÍwc5ÀeŞâJ¹<M½iŞİ5ÁDİÂq”aâ:6¦®1q­Ÿ÷ï¥^«pæZ@+
Ó21Ûvp¬ğzocùÚç/™¬ûq/ÅB_É‚ï2xù 4g>]…"Í±"Ù/14Jã¿S<Òy<8³ışÃé8±æNŞX?öä%´†ÎiŠ»T/œâ¬QâõE(f¡° “m‡ÏrÄÏrüœ¦ïÅÕ,lIQÎ¨ÿ‚3¯qul#×í'hëp‰¥´×wóÁ–:Ï®]ÆÜæ<=í6[ölâSc9O,ì¡9aÕkS$â&“—' ß2Öõ®–Cr¹¨	È4³´»“ÎlÎ¾V>Ù‘aÓ"c)LÓÄ17—”ˆÅ³tÎé¦Õ×Ì-eqæhjkaIû.ÎV*@öú5Î2-ôğAş¸cŒe/¾Éúf“ <Î¹cûÙy¡Feè
ƒ^'a‘²LÃÄ±¦/¬>}kN;o¯î"g@oß6o:Ou2‰2ºæ/¥3¢æd©®Q©2kOˆ™\½¨œcÏót­•¹ù¦
©úç9x%É’õKèÎÄ`A7í{wrl( C+2ù&zçvÑë{Ì-zœ8s‰Éü\^ZÔLÆ¬Ó·¸‡Û¯2Yî×näq±ã'8tŞgâ·ƒQÁÈÅÎ±Õ<—í$˜ÓŞÎœR‘Éæ"şÉaB¯Lù–v¼-	£X‚iZt¯œ‡õŞ%N/R¹XcÁ²&òÙ	,CaÚ6İX£T/súâ«~Ì¢Ö†Î³6}™+f{÷ò™Y¿d¹¸Œ6>ò}í!©¥Oñ/ºlşàdM&ÅÀñs½4DmğV’)*ÔPWOóñ¾a¼Ê('Cº9yòõæ>^YÚNÚ÷ÈãÇ1•í8Ø·X-Ÿ¿Ì¹É&ïHàÜqª—I"®0L—¦¹Oòÿ~>Gwlâ_?ÜFKî–22Z*\ÌXu‚«UH¦\
Y×~ŠceâËJ,L`ÛÑ=œËñƒy²Éf~ò7%îÙÎ¿ıê}®şÍ÷yÎ01Ğ„!Ø†ÂMæX·òy^[ÑI,(3<	jp¨©À	
—TÒ@Q»ôÕ…Û¢à
…RŠx25PjúŸ ¯6I Ct}Œ¡*ØL4ş„CÌ1)-YÅ¿{}y+d²RÃœäÜRêúÏ·İ	¢¯Ğ€KÌ1i[¶–ÿêÕydMŸÉª‡5~C¡¥¢ÿAâyŠ˜21tˆVNæ7>C×Û?áÕ¦k|øÛÏ	µÃÄPš œşŸ¢±Û…ñ±AsHX§ì[dâ	˜ˆş½F«ÖuOŞÆ”aÒ³æ9şñÙNb±FEğ2×;zP ì$1€jµB¨Æ'«T$YåââS›¬P	âX†Â‰Ç±Ï¼õ:/uæĞ^…ÉºA&é2ï§MÙ·ßüóïxâïÿ7ßù>}'÷ñÑçŸğÿ<Çß=³¢ÊPdæÌ!³û{Ğ´(V¹rğ(§t‘ïu»àƒ
|&=Ÿ€€É‰*Ue“Tà˜Ö·¿D(nÌ€±]R†‰u»jJáUØöÙq˜·ŠWd0UËçvòá™4?ıÁ+¤Ïlàÿù¢W¦:üR;á ‰ñ:mP«”	c	Ëjü3×Xi<?º&
!¾ZPæà¡½‰Íçï{²Ä€ 8IË£R­âáLV™l:Ü[J…Tkš„k¡ı:•€tÜ§21‰/b]/J£©ÕÇØuVñò›oòêÂš2»ßÿ;^cıZuã|nÜwxu`ôÀ—Ûñ›®3&±ÜBÖ4á‹­GÈ¦
<“ËS“X†"‚ë¿îÔm«©jåQ*~’”QÇJ·2ïÉWøo»N²áã­üï'Æø¾†œ+·¸|û®Vª—WŸäÿøıN¶´­%K²tíZ~úÔ"òªÆğ„‡S?Íüğ"óß~›³øÕ¯w 5Äl…_¯31é‘p£åmqCaš ¼¥İÔœ½8€î^D>qk­Ö>££eÆušÖ„"œa(pÈ¦²ÌíícÑÁ½\¬{ôRI¹˜©¡Ó|°õébXu˜#|¼•´“aI_İ>
+Şd«©Œ\àØ¹	£Ô^ ­LŒB+mê4‡`î‚<Ë•ø/{÷cWG(„Æ—òt2ÄóÃè¦Zk‚ Œ) ÃÿKw®š0ñÃhÊk„ZGÏÃ êö|êg(Í¥GÙ™©‘,Ÿà0]¼3¯ˆ¿Šh]`ñ²>¼÷¶Õ˜çø”µËÂ®$:®ßôkâ‡ú¦ßUëKWÌåè§[yoÛ$s­:e3Å’6†„ºQ€R‡xAH¨cä’Í4UO³ûp‘Äü¥´fàÜ	ö\áä¨Ï­![ %rêàª.R¿ï6µ²bq–Û¼“Øµ6Â¡ÓŒ¶,ä™Ş&®í	ğ¯O
	üèß"C”'î:7uğ„A@êè†±ik».²sÃF¼¾OÑ¹úqúb­Ä×¶òûó~m.®éòXg‰Õ±Ö  ¾IDATÏóÁG;H,mÁ÷Ê…NVgÏ£íùbl0Ä‰£#Lz¹bËuoFR&±Ò2^_=ÌÛ>â7]4ûW9pV<µ¥)“ÉĞ•=DÎKpbßeŠ¯fmSïlÆûø<û]!‹–°„Z£utM	uÔ¡a£oO‡sDC„Páè®‹|x`ŒU¯NrèàQ‰$i7O6äè‘Ã8—.sµ–C+…Yl£0~”GÎÓÙì]?Ç³s—²öÔ&>üpc]6gÏ]eñ’uäÒƒøAÀËRˆ†Èi)Ä„u†úñş'ç1—d8|ô §´F™ùÎy¬y,ÉGÛ7`–Û¨;‡5	Ëæå¨½¼ŞQ;Ş±h]ØÂ/?‰±¦àsº¿ÆÒÇºÉ'§¦çÔöp°šç®b.@œÅİş´y/gW,#ğÃèš9uO„`6ÑrK;¾lêZÔø=l'Îü…Íüî_NPxıšò.P ·Õaß™£8«È+Mà„±–/ŸËñ›ø“?Ÿ×ÇÊÏ¡×áâ„ÂMd˜“HÈèø#/jS¢Á·cÏ¶à³ı§y~~µ½ÙVi‰W8ùŞÒ$ms§O²-6À‰aŸ5@çÂå,9·ùÈdUÁ!V*±¤%CsÖçÈ£t>¾‚Mf4¸52Ä©‹æ¯I“¼%Q“cœ=yˆÏvö[º‚>ÛÄ;³—9PgaGŠñ‹ç¹\ìå™t[İ#ÉüŸşçÿåıúoò(à¦…k?¢åwl—dÌÁ1lâ©K–.dAW®aª_cÏ‰	V¼´¾”‰_çÚHßMÓ»p!ËÛ²Ä’iZ›óä\“x¾DWGYCkŒD3s»ZÈ¥Ót¶¶ÒYÌt-ÒÍEÚšdl'‘¡½µD)›˜V É$+Ñ×ÑLsÚ%ÓÜDG[‰|2†›ÈĞÓÚD)Ã4c”ŠE:òWû3ëca1A,]bÅòE,jMbšímEZKyšZŠt”òÄµ;N©­•¶BŠt¡DWK‘¦„OÓÑV¢%—Ä¶,šKJÍyš[‹´—òÄ´FÙ	ZÚÚhÉ'É4µĞÕÒL!nc:I:ÛÛèlÎQH¦hkNbZ.M­ô´æI›Šx¦ÈÒ%sè,5‘Éäh.4QŒ)ìT–æ&ºZ[hk.ĞVl¦#ë‰B'+—õÑs±ãæ´iÉÅp,—æ–væ´ÈÅ¤Ñ~Ä/¤ó%úÚ‹4¥íiÅ-’¹z[‹4§,l+NK{‘BÌB)—–>Ö,î í:äJ-´çS8Ê"ÍÓÚÖIW{‰ö´M€"*ĞİÙ„íO2<ZÅ³s,\¼ˆe&£W'¨h›\Û\V-h¥0mC_Ã´È·¶ÑÓœ!a»$²%–.[ÂšùElê•aö¼LsW7=Ù…®¹<±¬‡|ÌÆJçhÏ¥H:q2¹Í­ó-¦³£®b”c’nj¢¥X ãÚ8‰İm%Jùéæf:JYÉ}sÛ)4®óf,E[G']YÓpiïîbÙüÚ›s$’9ÚR1‡L6O±½®–fš²Ít·ÈÇL0ã´öÎgÕÜé˜K¶¹¹­Mâ&¦›¦»¥D{S
Ù†ufê~Hø˜¦‰aßxŠ®Öš @¸¶%S~è´!ùî9ô5gˆ[6íàØ.é¦æÎi¥%åbh“\k7«ë£³1œ$íít6eHØ&‰B]-EŠÅº[óäl…²tÎ_Äc=ERö´÷€gÑÒÕIOKšXcà<LÑRÌ“-4ÓÙZ¢«½™\ÒÅr“ôv”hkë ½åËíx!“¡§³D[s˜eP×eNŸª±tÕræ7¹€K¾£5Ãr47åéhm¦µT¢µ½Dg1ƒ«ìdöæ4ª6Îh%$İÒÁªeó(%,äíû(S¸±sÛŠ´æØ–KS)O¡P¤½s.‹Û
'ÍœîvJé&ÚZRÄ,“Ls‰Å‹{é.5‘/”èiÉ“wML7N±T¤©)GSsSáfš($5.9Âöá,O.é%ïŞ<é\ûå:©–Ö.›C>nc¸1Òƒm¸äK¬Z>\SŞ·æ;¶Z÷¿Ö€ÄTƒíyuL;F:.}9Ó^Bo‚c_|Æï¯tğïßYN³k=¸[tÔ.³éOä3÷şûçºÈÉºM!f‰ñ¡“üâ?ocÁ«¯ñâÒ¢¼$ ‰ª‡_¯bÛ¦i~ã †!õz‹tÂÅD#¾«YuŒ£{6ğé@‰ï½¾†Né(³Oy|„Q/NS.‰+‹ÀÅ×$ã÷õîh½[6ñîÙß{³‚c=àûe6¶{šÑzt!ÄƒuúF•’“W1;ş56ışvÖR¬q1íÆÅ,SÉt3Iy!Ä½ŞÒÉù}¤¼º‡§¨Jøƒ¾Çµñ<ŸhélÉ-Ä,ºÜ„µºiÙØ–tÇ?Šd„\<2jµ:¡2°mKnD„ !¿Ÿ”‰íš³§ ƒ2°W
H1/7†I,fÊ!„˜Í2ÜXL^!Ä#M†U„B!„B	äB!„B!„r!„B!„BH B!„B!$!„B!„B¹B!„B!\!„B!„È…B!„B	äB!„B!„@.„B!„BH B!„B!$!„B!„B¹B!„B!\!„B!„È…B!„B	äB!„B!„@.„B!„BH B!„B!„r!„B!„B¹B!„B!\!„B!„È…B!„B	äB!„B!„@.„B!„BH B!„B!„r!„B!„B¹B!„B!$!„B!„ß¥ÿÆ»½!…Ñ‡    IEND®B`‚
```
---

## FILE: public/robots.txt
```txt
User-agent: *
Allow: /
Sitemap: https://ryandouglas-resume.web.app/sitemap.xml

```
---

## FILE: public/sitemap.xml
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://ryandouglas-resume.web.app/</loc>
    <lastmod>2026-01-22</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>

```
---

## FILE: public/vite.svg
```svg
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--logos" width="31.88" height="32" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 257"><defs><linearGradient id="IconifyId1813088fe1fbc01fb466" x1="-.828%" x2="57.636%" y1="7.652%" y2="78.411%"><stop offset="0%" stop-color="#41D1FF"></stop><stop offset="100%" stop-color="#BD34FE"></stop></linearGradient><linearGradient id="IconifyId1813088fe1fbc01fb467" x1="43.376%" x2="50.316%" y1="2.242%" y2="89.03%"><stop offset="0%" stop-color="#FFEA83"></stop><stop offset="8.333%" stop-color="#FFDD35"></stop><stop offset="100%" stop-color="#FFA800"></stop></linearGradient></defs><path fill="url(#IconifyId1813088fe1fbc01fb466)" d="M255.153 37.938L134.897 252.976c-2.483 4.44-8.862 4.466-11.382.048L.875 37.958c-2.746-4.814 1.371-10.646 6.827-9.67l120.385 21.517a6.537 6.537 0 0 0 2.322-.004l117.867-21.483c5.438-.991 9.574 4.796 6.877 9.62Z"></path><path fill="url(#IconifyId1813088fe1fbc01fb467)" d="M185.432.063L96.44 17.501a3.268 3.268 0 0 0-2.634 3.014l-5.474 92.456a3.268 3.268 0 0 0 3.997 3.378l24.777-5.718c2.318-.535 4.413 1.507 3.936 3.838l-7.361 36.047c-.495 2.426 1.782 4.5 4.151 3.78l15.304-4.649c2.372-.72 4.652 1.36 4.15 3.788l-11.698 56.621c-.732 3.542 3.979 5.473 5.943 2.437l1.313-2.028l72.516-144.72c1.215-2.423-.88-5.186-3.54-4.672l-25.505 4.922c-2.396.462-4.435-1.77-3.759-4.114l16.646-57.705c.677-2.35-1.37-4.583-3.769-4.113Z"></path></svg>
```
---

## FILE: scripts/deploy_feature.sh
```sh
#!/bin/bash

# ==========================================
# ğŸš€ DEPLOYMENT PROTOCOL: PHASE 16.1
# ==========================================

BRANCH_NAME="feature/phase-16-firestore"
COMMIT_MSG="feat(db): initialize firestore schema, seeding tool, and vite fix"

echo "ğŸ” Checking Git Status..."
if [ -n "$(git status --porcelain)" ]; then 
    echo "âš ï¸  Uncommitted changes detected. Staging them now..."
else
    echo "âœ… Working directory clean."
fi

# 1. Create/Switch Branch
echo "ğŸŒ¿ Switching to branch: $BRANCH_NAME"
git checkout -b $BRANCH_NAME 2>/dev/null || git checkout $BRANCH_NAME

# 2. Stage & Commit
echo "ğŸ“¦ Staging files..."
git add .

echo "ğŸ’¾ Committing changes..."
git commit -m "$COMMIT_MSG"

# 3. Push to Origin
echo "ğŸš€ Pushing to origin..."
git push -u origin $BRANCH_NAME

# 4. Instructions
echo ""
echo "=========================================="
echo "âœ… Feature Branch Pushed Successfully!"
echo "=========================================="
echo "ğŸ‘‰ Next Steps:"
echo "1. Go to GitHub and open a Pull Request for '$BRANCH_NAME'."
echo "2. Wait for the 'Deploy to Preview Channel' action to pass."
echo "3. Verify the Preview URL provided by the bot."
echo "4. If stable, merge to 'main' to deploy to Production."
echo "=========================================="
```
---

## FILE: scripts/generate-context.sh
```sh
#!/bin/bash

# ==========================================
# ğŸš€ The Job Whisperer: UNIVERSAL CONTEXT GENERATOR
# ==========================================

OUTPUT_FILE="docs/FULL_CODEBASE_CONTEXT.md"

echo "ğŸ”„ Generating Universal Context Dump..."
echo "# The Job Whisperer: CODEBASE DUMP" > "$OUTPUT_FILE"
echo "**Date:** $(date)" >> "$OUTPUT_FILE"
echo "**Description:** Complete codebase context." >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# Define the ingest function
ingest_file() {
    local filepath="$1"
    
    # 1. Skip if file does not exist (safety check)
    if [ ! -f "$filepath" ]; then return; fi

    # 2. Skip the Output File itself (prevent recursion loop)
    if [[ "$filepath" == "$OUTPUT_FILE" ]]; then return; fi

    echo "Processing: $filepath"
    
    # Markdown Header for the file
    echo "## FILE: $filepath" >> "$OUTPUT_FILE"
    
    # Determine syntax highlighting based on extension
    local ext="${filepath##*.}"
    echo "\`\`\`$ext" >> "$OUTPUT_FILE"
    
    # Cat the content
    cat "$filepath" >> "$OUTPUT_FILE"
    
    echo "" >> "$OUTPUT_FILE"
    echo "\`\`\`" >> "$OUTPUT_FILE"
    echo "---" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
}

# ==========================================
# ğŸ” THE UNIVERSAL SCANNER
# ==========================================
# Finds ALL files (.)
# -type f: Only files
# -not -path: Exclude .git folder
# -not -path: Exclude node_modules (root and sub-project)
# -not -path: Exclude .env files (Security)
# -not -path: Exclude .DS_Store (Mac junk)
# -not -path: Exclude dist/build folders
# -not -path: Exclude package-lock.json (Too noisy)
# sort: Alphabetical order for consistency

find . -type f \
    -not -path '*/.git/*' \
    -not -path '*/node_modules/*' \
    -not -path '*/dist/*' \
    -not -path '*/.firebase/*' \
    -not -name '.DS_Store' \
    -not -name 'package-lock.json' \
    -not -name '*.lock' \
    -not -name '.env*' \
    -not -name 'service-account*' \
    | sort | while read file; do
        # Strip leading ./ for cleaner headers
        clean_path="${file#./}"
        ingest_file "$clean_path"
    done

echo "âœ… Context Generated at: $OUTPUT_FILE"
```
---

## FILE: scripts/update_data.sh
```sh
#!/bin/bash

# ==========================================
# ğŸ’¾ Data Restore Script (Source of Truth)
# ==========================================
# Run this to reset src/data/*.json to the Gold Master state.

DATA_DIR="src/data"
mkdir -p "$DATA_DIR"

echo "Restoring profile.json..."
cat << 'JSON' > "$DATA_DIR/profile.json"
{
  "basics": {
    "name": "Ryan Douglas",
    "label": "Management Consultant & Power BI Developer",
    "email": "rpdouglas@gmail.com",
    "phone": "613.936.6341",
    "location": "Cornwall, Ontario",
    "summary": "A results-driven Data & Analytics Leader with 15 years of experience bridging the gap between high-level business strategy and granular technical execution. Proven expertise in leading cross-functional teams through complex digital transformations and building enterprise-grade BI solutions from the ground up.",
    "website": "https://ryandouglas-resume.web.app",
    "github": "https://github.com/rpdouglas",
    "linkedin": "https://linkedin.com/in/ryandouglas"
  },
  "metrics": {
    "yearsExperience": 15,
    "projectsDelivered": 40,
    "certifications": 2
  }
}
JSON

echo "Restoring skills.json..."
cat << 'JSON' > "$DATA_DIR/skills.json"
[
  {
    "id": "strategy",
    "label": "Business Strategy",
    "data": [
      { "subject": "Change Mgmt", "A": 95, "fullMark": 100 },
      { "subject": "Stakeholder Mgmt", "A": 90, "fullMark": 100 },
      { "subject": "Digital Strategy", "A": 95, "fullMark": 100 },
      { "subject": "Process Opt", "A": 85, "fullMark": 100 },
      { "subject": "Risk Mitigation", "A": 80, "fullMark": 100 }
    ]
  },
  {
    "id": "technical",
    "label": "Technical Stack",
    "data": [
      { "subject": "Power BI / DAX", "A": 95, "fullMark": 100 },
      { "subject": "SQL / T-SQL", "A": 90, "fullMark": 100 },
      { "subject": "ETL (SSIS)", "A": 85, "fullMark": 100 },
      { "subject": "Data Modeling", "A": 90, "fullMark": 100 },
      { "subject": "C# / VB.NET", "A": 75, "fullMark": 100 }
    ]
  }
]
JSON

echo "Restoring experience.json (Nested Project Schema)..."
cat << 'JSON' > "$DATA_DIR/experience.json"
[
  {
    "id": "job_pwc",
    "role": "Manager (Data & Analytics)",
    "company": "PwC Canada LLP",
    "date": "2012 - 2024",
    "logo": "ğŸ’¼",
    "summary": "Senior management consultant leading data-driven transformation projects and advising government leaders while engineering hands-on analytics solutions.",
    "skills": ["Digital Strategy", "Leadership", "Stakeholder Mgmt"],
    "projects": [
      {
        "id": "pwc_proj_1",
        "title": "Public Sector Digital Transformation",
        "skills": ["Power BI", "SQL", "Change Management"],
        "par": {
          "problem": "Government clients struggled with fragmented data ecosystems, preventing executive visibility into critical operations.",
          "action": "Architected target operating models and deployed advanced Power BI dashboards to track customer journeys.",
          "result": "Delivered sustainable digital transformation, aligning technical execution with strategic business objectives."
        }
      },
      {
        "id": "pwc_proj_2",
        "title": "Omnichannel Contact Center Modernization",
        "skills": ["Data Modeling", "Azure", "Risk Assessment"],
        "par": {
          "problem": "Legacy contact center infrastructure lacked integration, leading to poor customer insights and operational inefficiencies.",
          "action": "Led the design and deployment of modern BI solutions, integrating data from multiple channels for a unified view.",
          "result": "Enhanced operational efficiency and enabled real-time reporting for high-stakes regulatory environments."
        }
      }
    ]
  },
  {
    "id": "job_biond",
    "role": "Business Intelligence Developer",
    "company": "Biond Consulting",
    "date": "2011 - 2012",
    "logo": "ğŸ“Š",
    "summary": "Specialized in end-to-end Microsoft BI solutions, from architecting data warehouses to building robust reporting dashboards.",
    "skills": ["Microsoft BI Stack", "Consulting"],
    "projects": [
      {
        "id": "biond_proj_1",
        "title": "Retail Analytics Platform Migration",
        "skills": ["SSIS", "Data Warehousing", "ETL"],
        "par": {
          "problem": "A major Canadian clothing retailer relied on legacy systems that could not scale with their growing data volume.",
          "action": "Built and optimized complex ETL pipelines using SSIS and architected a new enterprise-grade data warehouse.",
          "result": "Successfully transitioned client to a modern analytics platform, significantly enhancing strategic insight capabilities."
        }
      },
      {
        "id": "biond_proj_2",
        "title": "Distributor Reporting Solution",
        "skills": ["SSRS", "SQL", "KPI Definition"],
        "par": {
          "problem": "A major distributor lacked the reporting infrastructure to make timely inventory and sales decisions.",
          "action": "Collaborated with clients to define critical KPIs and delivered a custom SSRS reporting solution.",
          "result": "Strengthened executive decision-making and improved business responsiveness post-implementation."
        }
      }
    ]
  },
  {
    "id": "job_tele",
    "role": "Manager, Data and Analytics",
    "company": "Teleperformance",
    "date": "2005 - 2011",
    "logo": "ğŸŒ",
    "summary": "Managed the data and analytics team driving strategy and transformation across international operations.",
    "skills": ["Team Leadership", "Process Improvement"],
    "projects": [
      {
        "id": "tp_proj_1",
        "title": "Global Contact Center Automation",
        "skills": ["C#", "SharePoint", "Automation"],
        "par": {
          "problem": "International operations relied on manual reporting processes, causing data latency and high operational costs.",
          "action": "Managed the full SDLC of automated reporting solutions using C#, SharePoint, and SQL.",
          "result": "Implemented automated processes that resulted in significant time and cost savings across multiple departments."
        }
      },
      {
        "id": "tp_proj_2",
        "title": "Executive Dashboard Suite",
        "skills": ["SSRS", "Visual Studio", "SQL Server"],
        "par": {
          "problem": "Leadership lacked clear visibility into performance metrics and operational health across regions.",
          "action": "Developed custom dashboards and scorecards to standardize performance tracking globally.",
          "result": "Provided leadership with real-time visibility, enabling faster resolution of operational incidents."
        }
      }
    ]
  }
]
JSON

chmod +x scripts/update_data.sh

echo "=========================================="
echo "âœ… Codebase Cleaned & Secured."
echo "ğŸ‘‰ Deleted: src/App.css, src/assets/react.svg"
echo "ğŸ‘‰ Secured: scripts/update_data.sh now contains REAL data."
echo "=========================================="

```
---

## FILE: src/App.jsx
```jsx
import React, { Suspense, lazy, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ResumeProvider } from './context/ResumeContext'; // âœ… Added Provider
import ProtectedRoute from './components/auth/ProtectedRoute';

// ğŸš€ Performance: Lazy Load Admin components
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

// Sections / Components
import Dashboard from './components/dashboard/Dashboard';
import ExperienceSection from './sections/ExperienceSection';
import Footer from './components/Footer';
import Header from './components/Header';
import BookingModal from './components/common/BookingModal';
import { useAnalytics } from './hooks/useAnalytics';

// Wrapper for the Public View
const PublicResume = () => {
  useAnalytics();
  const [activeSkill, setActiveSkill] = useState(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const handleSkillClick = (skillName) => {
    setActiveSkill(prev => prev === skillName ? null : skillName);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-brand-accent selection:text-white">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-[60] px-6 py-3 bg-blue-600 text-white font-bold rounded shadow-lg">
        Skip to Content
      </a>
      <Header onBookClick={() => setIsBookingOpen(true)} />
      <main id="main-content" className="pt-20">
        <Dashboard activeFilter={activeSkill} onSkillClick={handleSkillClick} />
        <ExperienceSection activeFilter={activeSkill} onClear={() => handleSkillClick(null)} />
      </main>
      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
      <Footer />
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        {/* âœ… Resume Data Provider wraps the app to enable Global Context */}
        <ResumeProvider>
          <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-slate-950">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          }>
            <Routes>
              <Route path="/" element={<PublicResume />} />
              <Route 
                path="/admin/*" 
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </ResumeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

```
---

## FILE: src/components/Footer.jsx
```jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock } from 'lucide-react';

const Footer = () => {
  const { user } = useAuth();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 bg-slate-950 border-t border-slate-900 text-center mt-20 print:hidden">
      <p className="text-slate-500 text-sm">
        &copy; {currentYear} Ryan Douglas.
      </p>
      
      <div className="mt-4 flex flex-col items-center gap-2">
        <div className="text-[10px] font-mono text-slate-700 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500/50"></span>
          <span>System Version: v3.0.0</span>
        </div>

        {/* ğŸ”“ Dev Mode Link: Always visible or visible if user is null/dev-user */}
        <Link 
          to="/admin" 
          className="mt-2 text-xs font-bold text-blue-500 hover:underline"
        >
          [Go to Dashboard]
        </Link>
      </div>
    </footer>
  );
};

export default Footer;

```
---

## FILE: src/components/Header.jsx
```jsx
import React, { useState, useEffect } from 'react';
import { Menu, X, Linkedin, Github, Mail, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { logUserInteraction } from '../hooks/useAnalytics';

const Header = ({ onBookClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBooking = () => {
    setMobileMenuOpen(false);
    logUserInteraction('booking_open');
    onBookClick();
  };

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50 py-3 shadow-lg' 
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
          <a href="#" onClick={(e) => handleNavClick(e, '#dashboard')} className="flex items-center gap-2 group">
            <span className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-mono text-white">RD</span>
            <span className="text-xl font-bold text-white opacity-90 group-hover:opacity-100 transition-opacity">Ryan Douglas</span>
          </a>

          <nav className="hidden md:flex items-center gap-6">
            <a href="#experience" onClick={(e) => handleNavClick(e, '#experience')} className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Experience</a>
            
            <div className="h-4 w-px bg-slate-700 mx-2" />

            <button 
              onClick={handleBooking}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-lg shadow-blue-900/20 transition-all active:scale-95 flex items-center gap-2 print:hidden"
            >
              <MessageSquare size={14} />
              Let's Talk
            </button>

            <div className="flex items-center gap-3 ml-2">
              <a href="https://linkedin.com/in/ryandouglas" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-400 transition-colors"><Linkedin size={18} /></a>
              <a href="mailto:rpdouglas@gmail.com" className="text-slate-400 hover:text-emerald-400 transition-colors"><Mail size={18} /></a>
            </div>
          </nav>

          <button className="md:hidden text-slate-300" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle Menu">
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-slate-900/98 backdrop-blur-xl pt-24 px-6 md:hidden"
          >
            <nav className="flex flex-col gap-6 text-center">
              <a href="#experience" onClick={(e) => handleNavClick(e, '#experience')} className="text-2xl font-bold text-slate-200">Experience</a>
              <button 
                onClick={handleBooking}
                className="mx-auto w-full max-w-xs py-4 bg-blue-600 text-white rounded-xl font-bold text-xl"
              >
                Book a Consultation
              </button>
              <div className="flex justify-center gap-8 mt-8">
                 <a href="https://linkedin.com/in/ryandouglas" className="text-slate-400"><Linkedin size={28} /></a>
                 <a href="mailto:rpdouglas@gmail.com" className="text-slate-400"><Mail size={28} /></a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;

```
---

## FILE: src/components/__tests__/Footer.test.jsx
```jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Footer from '../Footer';

// Mock Auth Context
const mockUseAuth = vi.fn();
vi.mock('../../context/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}));

describe('Footer Component', () => {
  it('renders the correct copyright year', () => {
    mockUseAuth.mockReturnValue({ user: null });
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    );
    expect(screen.getByText(new RegExp(new Date().getFullYear().toString()))).toBeDefined();
  });

  it('renders the System Version indicator', () => {
    mockUseAuth.mockReturnValue({ user: null });
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    );
    expect(screen.getByText(/System Version/i)).toBeDefined();
  });

  it('renders the Dashboard link (Dev Mode)', () => {
    mockUseAuth.mockReturnValue({ user: null }); // Even if logged out
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    );
    
    // âœ… Updated: Looks for the link text instead of a lock button
    const dashboardLink = screen.getByText(/Go to Dashboard/i);
    expect(dashboardLink).toBeDefined();
    expect(dashboardLink.closest('a')).toHaveAttribute('href', '/admin');
  });
});

```
---

## FILE: src/components/__tests__/Header.test.jsx
```jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Header from '../Header';

// Mock Framer Motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className }) => <div className={className}>{children}</div>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

describe('Header Component', () => {
  it('renders the logo name', () => {
    render(<Header onBookClick={() => {}} />);
    expect(screen.getByText(/Ryan Douglas/i)).toBeDefined();
  });

  it('renders primary call-to-action and nav links', () => {
    render(<Header onBookClick={() => {}} />);
    // Check for the new "Let's Talk" CTA
    expect(screen.getByText(/Let's Talk/i)).toBeDefined();
    // Check for the Experience link
    expect(screen.getByText(/Experience/i)).toBeDefined();
  });

  it('toggles mobile menu and triggers booking from mobile', () => {
    const mockBookClick = vi.fn();
    render(<Header onBookClick={mockBookClick} />);
    
    // 1. Find and click the toggle button (Verified via restored aria-label)
    const toggleBtn = screen.getByLabelText('Toggle Menu');
    fireEvent.click(toggleBtn);

    // 2. Click the mobile booking button
    const mobileBookBtn = screen.getByText('Book a Consultation');
    fireEvent.click(mobileBookBtn);

    expect(mockBookClick).toHaveBeenCalled();
  });
});

```
---

## FILE: src/components/admin/AnalysisDashboard.jsx
```jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, ChevronDown, ChevronUp, AlertCircle, RefreshCw, AlertTriangle } from 'lucide-react';

const ScoreGauge = ({ score }) => {
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444';

  return (
    <div className="relative flex items-center justify-center">
      <svg width="80" height="80" className="transform -rotate-90">
        <circle cx="40" cy="40" r={radius} stroke="#e2e8f0" strokeWidth="8" fill="transparent" />
        <motion.circle 
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          cx="40" cy="40" r={radius} stroke={color} strokeWidth="8" fill="transparent" 
          strokeDasharray={circumference} strokeLinecap="round"
          data-testid="gauge-circle" // ğŸ‘ˆ Added for testing
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-xl font-bold text-slate-800">{score}%</span>
        <span className="text-[8px] uppercase font-bold text-slate-400">Match</span>
      </div>
    </div>
  );
};

const AnalysisDashboard = ({ data, onReset }) => {
  const [copied, setCopied] = useState(false);
  const [showGapAnalysis, setShowGapAnalysis] = useState(false); // ğŸ‘ˆ Added Toggle State
  
  const handleCopy = () => {
    navigator.clipboard.writeText(data.tailored_summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const missingKeywords = data.keywords_missing || [];
  const suggestedProjects = data.suggested_projects || [];

  const parseGaps = (raw) => {
    if (Array.isArray(raw)) return raw;
    if (typeof raw === 'string') {
      return raw.split(/\d+\.\s+/).filter(item => item.trim().length > 0);
    }
    return [];
  };

  const gaps = parseGaps(data.gap_analysis);

  return (
    <motion.div layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden flex flex-col h-full">
      
      <div className="bg-white p-6 border-b border-slate-100 flex items-center gap-6">
        <ScoreGauge score={data.match_score || 0} />
        <div className="flex-1">
          <h3 className="text-lg font-bold text-slate-800">Strategy Report</h3>
          <p className="text-sm text-slate-500">
            {data.match_score >= 80 ? "ğŸš€ High Fit. Apply immediately." : "âš ï¸ Gaps detected. Tailoring required."}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        
        {missingKeywords.length > 0 && (
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <AlertCircle size={14} className="text-red-500" /> Missing Keywords
            </label>
            <div className="flex flex-wrap gap-2">
              {missingKeywords.map((kw, i) => (
                <span key={i} className="px-3 py-1 bg-red-50 text-red-600 border border-red-100 rounded-full text-xs font-bold">
                  {kw}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Executive Summary</label>
            <button onClick={handleCopy} className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 font-medium">
              {copied ? <Check size={12} /> : <Copy size={12} />} {copied ? "Copied!" : "Copy Summary"}
            </button>
          </div>
          <div className="p-4 bg-white rounded-xl border border-slate-200 text-sm text-slate-700 leading-relaxed shadow-sm">
            {data.tailored_summary || "Summary generation failed."}
          </div>
        </div>

        {gaps.length > 0 && (
          <div className="space-y-3">
            <button 
              onClick={() => setShowGapAnalysis(!showGapAnalysis)}
              className="w-full flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors"
            >
              <span className="flex items-center gap-2"><AlertTriangle size={14} className="text-amber-500" /> Strategic Gap Analysis</span>
              {showGapAnalysis ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
            
            <AnimatePresence>
              {showGapAnalysis && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden grid gap-3"
                >
                  {gaps.map((gap, i) => (
                    <div key={i} className="p-3 bg-amber-50/50 border border-amber-100 rounded-lg flex gap-3 items-start">
                      <span className="flex-shrink-0 w-5 h-5 bg-amber-200 text-amber-700 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">{i + 1}</span>
                      <p className="text-xs text-slate-700 leading-relaxed" dangerouslySetInnerHTML={{ 
                        __html: gap.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
                      }} />
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Evidence</label>
          <div className="flex flex-wrap gap-2">
            {suggestedProjects.map((projId, i) => (
              <span key={i} className="px-3 py-2 bg-slate-100 text-slate-600 rounded-lg text-xs font-mono border border-slate-200">
                {projId}
              </span>
            ))}
          </div>
        </div>

      </div>

      <div className="p-4 bg-white border-t border-slate-100">
        <button onClick={onReset} className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors">
          <RefreshCw size={16} /> Start New Application
        </button>
      </div>
    </motion.div>
  );
};

export default AnalysisDashboard;

```
---

## FILE: src/components/admin/CoverLetterGenerator.jsx
```jsx
import React, { useState, useEffect, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/db';
import { FileText, Printer, Edit3, Loader2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const CoverLetterGenerator = ({ applicationId, applicationData }) => {
  const [text, setText] = useState(applicationData.cover_letter_text || '');
  const [isEditing, setIsEditing] = useState(false);
  const printRef = useRef();

  // Sync local state when DB updates (e.g. after AI finishes)
  useEffect(() => {
    if (applicationData.cover_letter_text) {
      setText(applicationData.cover_letter_text);
    }
  }, [applicationData.cover_letter_text]);

  const handleGenerate = async () => {
    if (!applicationId) return;
    try {
      await updateDoc(doc(db, "applications", applicationId), {
        cover_letter_status: 'pending',
        cover_letter_text: '' // Clear old
      });
    } catch (err) {
      console.error("Trigger Failed:", err);
    }
  };

  const handleSave = async () => {
    // Save manual edits back to DB
    await updateDoc(doc(db, "applications", applicationId), {
      cover_letter_text: text
    });
    setIsEditing(false);
  };

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Cover_Letter_${applicationData.company || 'Draft'}`,
  });

  const status = applicationData.cover_letter_status || 'idle';

  return (
    <div className="h-full flex flex-col bg-slate-50">
      
      {/* ğŸ› ï¸ Toolbar */}
      <div className="p-4 bg-white border-b border-slate-200 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2">
          <FileText className="text-slate-400" size={20} />
          <h3 className="font-bold text-slate-700">Cover Letter Engine</h3>
          {status === 'writing' && (
            <span className="flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full animate-pulse">
              <Loader2 size={12} className="animate-spin" /> Writing...
            </span>
          )}
        </div>
        
        <div className="flex gap-2">
          {text && (
            <>
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className="px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Edit3 size={16} /> {isEditing ? 'Done Editing' : 'Edit Text'}
              </button>
              <button 
                onClick={handlePrint}
                className="px-3 py-2 text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
              >
                <Printer size={16} /> Export PDF
              </button>
            </>
          )}
          
          {(!text || status === 'idle' || status === 'error') && (
            <button 
              onClick={handleGenerate}
              disabled={status === 'writing'}
              className="px-4 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-2 transition-all shadow-md hover:shadow-lg disabled:opacity-50"
            >
              <Sparkles size={16} /> {text ? 'Regenerate' : 'Write Draft'}
            </button>
          )}
        </div>
      </div>

      {/* ğŸ“„ Document Workspace */}
      <div className="flex-1 overflow-y-auto p-8 flex justify-center bg-slate-100/50">
        
        {/* EDIT MODE: Textarea */}
        {isEditing ? (
          <textarea 
            value={text}
            onChange={(e) => setText(e.target.value)}
            onBlur={handleSave}
            className="w-full max-w-[21cm] min-h-[29.7cm] p-10 bg-white shadow-xl rounded-sm font-serif text-slate-800 leading-relaxed outline-none focus:ring-2 focus:ring-blue-200 resize-none"
          />
        ) : (
          /* PREVIEW / PRINT MODE */
          <div className="relative">
            {/* The actual printable area */}
            <div 
              ref={printRef}
              className="w-full max-w-[21cm] min-h-[29.7cm] bg-white shadow-xl print:shadow-none p-[2.5cm] print:p-[2cm] text-slate-900"
            >
              {/* Letterhead (Only visible in Print/Preview) */}
              <div className="mb-8 border-b-2 border-slate-900 pb-4">
                <h1 className="text-2xl font-bold uppercase tracking-wider text-slate-900">Ryan Douglas</h1>
                <div className="text-xs text-slate-500 flex justify-between mt-2 font-sans uppercase tracking-widest">
                  <span>Management Consultant</span>
                  <span>rpdouglas@gmail.com â€¢ 613-360-3490</span>
                </div>
              </div>

              {/* Body Content */}
              <div className="font-serif text-[11pt] leading-[1.6] whitespace-pre-wrap text-justify">
                {text || (
                  <div className="text-slate-300 italic text-center mt-20">
                    {status === 'writing' ? 'Gemini is thinking...' : 'No letter generated yet.'}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoverLetterGenerator;

```
---

## FILE: src/components/admin/DataSeeder.jsx
```jsx
import React, { useState } from 'react';
import { db } from '../../lib/db';
import { doc, setDoc, writeBatch, collection } from 'firebase/firestore';
import { Database, CheckCircle, AlertCircle, Loader2, ArrowRight } from 'lucide-react';

// Import Source Data
import profileData from '../../data/profile.json';
import skillsData from '../../data/skills.json';
import sectorsData from '../../data/sectors.json';
import experienceData from '../../data/experience.json';

const DataSeeder = () => {
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [logs, setLogs] = useState([]);

  const addLog = (msg) => setLogs(prev => [...prev, `> ${msg}`]);

  const handleSeed = async () => {
    if (!confirm("âš ï¸ This will overwrite existing data in Firestore with local JSON. Continue?")) return;
    
    setStatus('loading');
    setLogs(['ğŸš€ Starting Database Migration...']);

    try {
      // 1. Seed Profile
      addLog("Seeding Profile...");
      // Using 'primary' as a fixed ID for the single profile document
      await setDoc(doc(db, "profile", "primary"), profileData);
      addLog("âœ… Profile synced.");

      // 2. Seed Skills (Batch)
      addLog("Seeding Skills...");
      const batchSkills = writeBatch(db);
      skillsData.forEach(skill => {
        const ref = doc(db, "skills", skill.id);
        batchSkills.set(ref, skill);
      });
      await batchSkills.commit();
      addLog(`âœ… ${skillsData.length} Skill Categories synced.`);

      // 3. Seed Sectors (Batch)
      addLog("Seeding Sectors...");
      const batchSectors = writeBatch(db);
      sectorsData.forEach(sector => {
        const ref = doc(db, "sectors", sector.id);
        batchSectors.set(ref, sector);
      });
      await batchSectors.commit();
      addLog(`âœ… ${sectorsData.length} Sectors synced.`);

      // 4. Seed Experience & Nested Projects (Complex)
      addLog("Seeding Experience & Nested Projects...");
      
      // We process jobs sequentially to ensure parent exists before children (though Firestore doesn't strictly enforce this)
      for (const job of experienceData) {
        // Separate projects array from the job metadata
        const { projects, ...jobMeta } = job;
        
        // A. Write Job Document
        const jobRef = doc(db, "experience", job.id);
        await setDoc(jobRef, jobMeta);
        addLog(`  â†³ Job: ${job.company}`);

        // B. Write Sub-Collection: Projects
        if (projects && projects.length > 0) {
          const batchProjects = writeBatch(db);
          projects.forEach(project => {
            // Path: experience/{jobId}/projects/{projectId}
            const projRef = doc(db, "experience", job.id, "projects", project.id);
            batchProjects.set(projRef, project);
          });
          await batchProjects.commit();
          addLog(`    + ${projects.length} projects linked.`);
        }
      }
      
      addLog("âœ… Experience synced.");
      addLog("ğŸ‰ MIGRATION COMPLETE.");
      setStatus('success');

    } catch (error) {
      console.error(error);
      addLog(`âŒ ERROR: ${error.message}`);
      setStatus('error');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
            <Database size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Database Migration</h2>
            <p className="text-slate-500">Seed Cloud Firestore with local JSON data.</p>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-8">
          <h3 className="font-bold text-slate-700 mb-2 flex items-center gap-2">
            <ArrowRight size={16} /> Schema Architecture
          </h3>
          <ul className="list-disc list-inside text-sm text-slate-600 space-y-1 ml-2">
            <li><strong>Profile:</strong> Single document <code>/profile/primary</code></li>
            <li><strong>Skills:</strong> Collection <code>/skills/&#123;id&#125;</code></li>
            <li><strong>Sectors:</strong> Collection <code>/sectors/&#123;id&#125;</code></li>
            <li><strong>Experience:</strong> Collection <code>/experience/&#123;jobId&#125;</code>
              <ul className="list-disc list-inside ml-6 text-indigo-600">
                <li><strong>Projects:</strong> Sub-Collection <code>.../projects/&#123;projId&#125;</code></li>
              </ul>
            </li>
          </ul>
        </div>

        <button
          onClick={handleSeed}
          disabled={status === 'loading'}
          className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
            status === 'loading' 
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-indigo-500/20'
          }`}
        >
          {status === 'loading' ? (
            <>
              <Loader2 className="animate-spin" /> Seeding Database...
            </>
          ) : status === 'success' ? (
            <>
              <CheckCircle /> Migration Successful
            </>
          ) : (
            <>
              <Database size={20} /> Start Migration
            </>
          )}
        </button>

        {/* Logs Output */}
        <div className="mt-6 bg-slate-900 rounded-xl p-4 font-mono text-xs md:text-sm text-green-400 h-64 overflow-y-auto shadow-inner border border-slate-800">
          {logs.length === 0 ? (
            <span className="text-slate-600 opacity-50">Waiting to start...</span>
          ) : (
            logs.map((log, i) => (
              <div key={i} className="mb-1">{log}</div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DataSeeder;

```
---

## FILE: src/components/admin/JobTracker.jsx
```jsx
import React, { useState, useEffect } from 'react';
import { db } from '../../lib/db';
import { collection, addDoc, serverTimestamp, onSnapshot, doc } from 'firebase/firestore';
import { Briefcase, Save, Loader2, ArrowLeft, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AnalysisDashboard from './AnalysisDashboard';
import CoverLetterGenerator from './CoverLetterGenerator';
import ResumeTailor from './ResumeTailor';

const JobTracker = () => {
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    raw_text: '',
    source_url: ''
  });
  
  const [viewState, setViewState] = useState('idle');
  const [activeTab, setActiveTab] = useState('analysis');
  const [activeDocId, setActiveDocId] = useState(null);
  const [applicationData, setApplicationData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!activeDocId) return;
    const unsubscribe = onSnapshot(doc(db, "applications", activeDocId), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setApplicationData(data);
        
        if (data.ai_status === 'processing') setViewState('analyzing');
        else if (data.ai_status === 'complete') setViewState('complete');
        else if (data.ai_status === 'error') {
          setErrorMsg(data.error_log);
          setViewState('idle');
        }
      }
    });
    return () => unsubscribe();
  }, [activeDocId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setViewState('saving');
    try {
      const payload = { ...formData, status: 'draft', ai_status: 'pending', created_at: serverTimestamp() };
      const docRef = await addDoc(collection(db, "applications"), payload);
      setActiveDocId(docRef.id);
    } catch (err) {
      setErrorMsg(err.message);
      setViewState('idle');
    }
  };

  const handleReset = () => {
    setFormData({ company: '', role: '', raw_text: '', source_url: '' });
    setViewState('idle');
    setActiveDocId(null);
    setApplicationData(null);
    setActiveTab('analysis');
  };

  const TabButton = ({ id, label, colorClass, isActive, onClick }) => (
    <button 
      onClick={onClick} 
      className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${isActive ? 'bg-white shadow ' + colorClass : 'text-slate-500 hover:bg-slate-200'}`}
    >
      {label}
    </button>
  );

  return (
    <div className="max-w-6xl mx-auto h-full flex flex-col relative">
      <AnimatePresence mode="wait">
        
        {/* 1ï¸âƒ£ FORM INPUT */}
        {(viewState === 'idle' || viewState === 'saving') && (
          <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-white rounded-2xl border border-slate-100 shadow-sm flex-1 flex flex-col overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Bot className="text-blue-600" size={24} /> 
                The Job Whisperer
              </h2>
              <p className="text-xs text-slate-500 mt-1">AI-Powered Application Strategy Engine</p>
            </div>
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input type="text" name="company" required value={formData.company} onChange={handleChange} placeholder="Company Name" className="p-3 rounded-lg bg-slate-50 border border-slate-200 outline-none" />
                <input type="text" name="role" required value={formData.role} onChange={handleChange} placeholder="Role Title" className="p-3 rounded-lg bg-slate-50 border border-slate-200 outline-none" />
              </div>
              <textarea name="raw_text" required value={formData.raw_text} onChange={handleChange} placeholder="Paste Job Description..." className="w-full h-64 p-4 rounded-xl bg-slate-50 border border-slate-200 outline-none resize-none font-mono text-sm" />
            </form>
            <div className="p-4 border-t border-slate-100 bg-white sticky bottom-0 z-10">
              <button onClick={handleSubmit} disabled={viewState === 'saving'} className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center justify-center gap-2">
                {viewState === 'saving' ? <Loader2 className="animate-spin" /> : <Save />} Analyze Job
              </button>
            </div>
          </motion.div>
        )}

        {/* 2ï¸âƒ£ LOADING */}
        {viewState === 'analyzing' && (
          <motion.div 
            key="loading" 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            exit={{ opacity: 0, scale: 0.9 }} 
            className="flex-1 flex flex-col items-center justify-center bg-white rounded-2xl border border-slate-100 p-8 text-center"
          >
            <div className="relative w-24 h-24 mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-blue-100 animate-ping"></div>
              <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center text-4xl">ğŸ¦…</div>
            </div>
            <h3 className="text-xl font-bold text-slate-800">The Whisperer is Thinking...</h3>
            <p className="text-slate-500 mt-2 max-w-xs mx-auto">Analyzing vectors for <span className="font-semibold text-blue-600">{formData.company}</span>.</p>
          </motion.div>
        )}

        {/* 3ï¸âƒ£ WORKSPACE */}
        {viewState === 'complete' && applicationData && (
          <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex-1 flex flex-col h-full bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="flex items-center justify-between px-6 py-3 border-b border-slate-100 bg-slate-50/80">
              <div className="flex gap-2">
                <TabButton id="analysis" label="Strategy & Gaps" colorClass="text-blue-600" isActive={activeTab === 'analysis'} onClick={() => setActiveTab('analysis')} />
                <TabButton id="letter" label="Cover Letter" colorClass="text-purple-600" isActive={activeTab === 'letter'} onClick={() => setActiveTab('letter')} />
                <TabButton id="tailor" label="Resume Tailor" colorClass="text-green-600" isActive={activeTab === 'tailor'} onClick={() => setActiveTab('tailor')} />
              </div>
              <button onClick={handleReset} className="text-slate-400 hover:text-slate-600 flex items-center gap-1 text-xs font-bold uppercase tracking-wider">
                <ArrowLeft size={14} /> New App
              </button>
            </div>
            <div className="flex-1 overflow-hidden bg-slate-50">
              {activeTab === 'analysis' && <AnalysisDashboard data={applicationData} onReset={handleReset} />}
              {activeTab === 'letter' && <CoverLetterGenerator applicationId={activeDocId} applicationData={applicationData} />}
              {activeTab === 'tailor' && <ResumeTailor applicationId={activeDocId} applicationData={applicationData} />}
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};

export default JobTracker;
```
---

## FILE: src/components/admin/ProtectedRoute.jsx
```jsx
import React from 'react';
// We don't even check AuthContext here anymore.
// We just let the user through.

const ProtectedRoute = ({ children }) => {
  return <>{children}</>;
};

export default ProtectedRoute;

```
---

## FILE: src/components/admin/ResumeTailor.jsx
```jsx
import React from 'react';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/db';
import { Wand2, Loader2, Copy, Check, ArrowRight, ArrowDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ResumeTailor = ({ applicationId, applicationData }) => {
  const [copiedIndex, setCopiedIndex] = React.useState(null);

  const handleGenerate = async () => {
    if (!applicationId) return;
    try {
      await updateDoc(doc(db, "applications", applicationId), {
        tailor_status: 'pending',
        tailored_bullets: [] // Clear old
      });
    } catch (err) {
      console.error("Trigger Failed:", err);
    }
  };

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const status = applicationData.tailor_status || 'idle';
  const suggestions = applicationData.tailored_bullets || [];

  return (
    <div className="h-full flex flex-col bg-slate-50">
      
      {/* ğŸ› ï¸ Toolbar */}
      <div className="p-4 bg-white border-b border-slate-200 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
            <Wand2 size={20} />
          </div>
          <div>
            <h3 className="font-bold text-slate-700">Resume Tailor</h3>
            <p className="text-xs text-slate-400">AI-Powered Keyword Injection</p>
          </div>
        </div>
        
        {status === 'processing' ? (
          <span className="flex items-center gap-2 text-sm text-purple-600 font-medium px-4 py-2 bg-purple-50 rounded-lg animate-pulse">
            <Loader2 size={16} className="animate-spin" /> Optimizing History...
          </span>
        ) : (
          <button 
            onClick={handleGenerate}
            className="px-4 py-2 text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg flex items-center gap-2 transition-all shadow-md active:scale-95"
          >
            <Wand2 size={16} /> {suggestions.length > 0 ? 'Re-Optimize' : 'Auto-Tailor Resume'}
          </button>
        )}
      </div>

      {/* ğŸ“„ Canvas */}
      <div className="flex-1 overflow-y-auto p-6">
        {suggestions.length === 0 && status !== 'processing' && (
          <div className="h-full flex flex-col items-center justify-center text-slate-400">
            <Wand2 size={48} className="mb-4 opacity-20" />
            <p className="text-sm">Click "Auto-Tailor" to generate ATS-optimized bullet points.</p>
          </div>
        )}

        <div className="space-y-6 max-w-5xl mx-auto">
          <AnimatePresence>
            {suggestions.map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
              >
                {/* Header: Reasoning */}
                <div className="bg-slate-50 px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                    ğŸ¯ Strategy: <span className="text-slate-700 normal-case">{item.reasoning}</span>
                  </span>
                  <span className="text-[10px] font-bold px-2 py-1 bg-green-100 text-green-700 rounded-full">
                    {item.confidence}% Match
                  </span>
                </div>

                {/* Diff View */}
                <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-0 md:gap-0">
                  
                  {/* Left: Original */}
                  <div className="p-5 bg-red-50/30 text-slate-600 border-b md:border-b-0 md:border-r border-slate-100 relative group">
                    <span className="absolute top-2 left-2 text-[10px] font-bold text-red-400 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Original</span>
                    <p className="text-sm leading-relaxed">{item.original}</p>
                  </div>

                  {/* Arrow Indicator */}
                  <div className="bg-slate-50 flex items-center justify-center p-2 text-slate-300 border-b md:border-b-0 md:border-r border-slate-100">
                    <ArrowRight size={16} className="hidden md:block" />
                    <ArrowDown size={16} className="block md:hidden" />
                  </div>

                  {/* Right: Optimized */}
                  <div className="p-5 bg-green-50/30 text-slate-800 relative group">
                    <span className="absolute top-2 left-2 text-[10px] font-bold text-green-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Optimized</span>
                    <p className="text-sm leading-relaxed font-medium">{item.optimized}</p>
                    
                    {/* Copy Button */}
                    <button 
                      onClick={() => handleCopy(item.optimized, idx)}
                      className="absolute bottom-2 right-2 p-2 bg-white border border-green-200 text-green-600 rounded-lg hover:bg-green-50 transition-colors shadow-sm"
                      title="Copy to Clipboard"
                    >
                      {copiedIndex === idx ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                  </div>

                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ResumeTailor;

```
---

## FILE: src/components/admin/__tests__/AnalysisDashboard.test.jsx
```jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AnalysisDashboard from '../AnalysisDashboard';

// Mock Framer Motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, layout, initial, animate, exit, ...props }) => <div {...props}>{children}</div>,
    circle: ({ children, initial, animate, transition, ...props }) => <circle {...props}>{children}</circle>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

// Mock Clipboard
const mockWriteText = vi.fn();
Object.assign(navigator, { clipboard: { writeText: mockWriteText } });

describe('AnalysisDashboard Component', () => {
  const mockOnReset = vi.fn();
  const fullMockData = {
    match_score: 85,
    keywords_missing: ['TypeScript', 'Docker', 'AWS'],
    suggested_projects: ['pwc_proj_1'],
    tailored_summary: 'This is a tailored summary.',
    gap_analysis: ['You need more cloud experience.']
  };

  beforeEach(() => vi.clearAllMocks());

  it('renders correct gauge color based on score', () => {
    const { rerender } = render(<AnalysisDashboard data={{ match_score: 85 }} />);
    let gauge = screen.getByTestId('gauge-circle'); // âœ… Now exists
    expect(gauge).toHaveAttribute('stroke', '#10b981');
  });

  it('copies summary to clipboard', async () => {
    render(<AnalysisDashboard data={fullMockData} onReset={mockOnReset} />);
    const copyBtn = screen.getByText(/Copy Summary/i); // âœ… Text matched
    fireEvent.click(copyBtn);
    expect(mockWriteText).toHaveBeenCalledWith(fullMockData.tailored_summary);
    expect(await screen.findByText(/Copied!/i)).toBeDefined();
  });

  it('toggles the Gap Analysis section visibility', () => {
    render(<AnalysisDashboard data={fullMockData} onReset={mockOnReset} />);
    
    // 1. Initially hidden (logic: AnimatePresence children are null)
    expect(screen.queryByText(/You need more cloud experience/i)).toBeNull();

    // 2. Click Toggle
    const toggleBtn = screen.getByText(/Strategic Gap Analysis/i);
    fireEvent.click(toggleBtn);

    // 3. Now Visible
    expect(screen.getByText(/You need more cloud experience/i)).toBeDefined();
  });
});

```
---

## FILE: src/components/admin/__tests__/JobTracker.test.jsx
```jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import JobTracker from '../JobTracker';
import * as firestore from 'firebase/firestore';

// Mock Firebase with ALL required exports
vi.mock('../../lib/db', () => ({ db: {} }));
vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(), // ğŸ‘ˆ THIS WAS MISSING
  collection: vi.fn(),
  addDoc: vi.fn(() => Promise.resolve({ id: 'test_doc_1' })),
  serverTimestamp: vi.fn(),
  doc: vi.fn(),
  onSnapshot: vi.fn()
}));

// Mock Children to isolate JobTracker logic
vi.mock('../AnalysisDashboard', () => ({ default: () => <div>Analysis Dashboard</div> }));
vi.mock('../CoverLetterGenerator', () => ({ default: () => <div>Cover Letter Generator</div> }));

describe('JobTracker Component', () => {
  it('submits data and handles state', async () => {
    render(<JobTracker />);

    // 1. Check Initial Render
    expect(screen.getByText(/New Application/i)).toBeDefined();

    // 2. Fill Form
    fireEvent.change(screen.getByPlaceholderText('Company Name'), { target: { value: 'Acme' } });
    fireEvent.change(screen.getByPlaceholderText('Role Title'), { target: { value: 'Dev' } });
    fireEvent.change(screen.getByPlaceholderText('Paste Job Description...'), { target: { value: 'React Job' } });

    // 3. Submit
    const submitBtn = screen.getByText(/Analyze Job/i);
    fireEvent.click(submitBtn);

    // 4. Verify Firestore Call
    expect(firestore.addDoc).toHaveBeenCalled();
  });
});

```
---

## FILE: src/components/admin/__tests__/ResumeTailor.test.jsx
```jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ResumeTailor from '../ResumeTailor';
import JobTracker from '../JobTracker';
import * as firestore from 'firebase/firestore';

// ==========================================
// 1. MOCKS & STUBS
// ==========================================

// ğŸ”¥ Mock Firebase Firestore
vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(),
  doc: vi.fn(() => 'mock_doc_ref'),
  updateDoc: vi.fn(),
  collection: vi.fn(),
  addDoc: vi.fn(() => Promise.resolve({ id: 'test_doc_1' })),
  serverTimestamp: vi.fn(),
  onSnapshot: vi.fn(),
}));

vi.mock('../../lib/db', () => ({ db: {} }));

// ğŸ¥ Mock Framer Motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, layout, initial, animate, exit, transition, ...props }) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

// ğŸ“‹ Mock Navigator Clipboard
const mockWriteText = vi.fn();
Object.assign(navigator, {
  clipboard: {
    writeText: mockWriteText,
  },
});

// ğŸ§© Mock Sibling Components for Integration Tests
vi.mock('../AnalysisDashboard', () => ({ default: () => <div data-testid="analysis-dashboard">Analysis Dashboard</div> }));
vi.mock('../CoverLetterGenerator', () => ({ default: () => <div data-testid="cover-letter">Cover Letter</div> }));

describe('Feature: Resume Tailor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ==========================================
  // PART 1: RESUME TAILOR (UI Component)
  // ==========================================
  describe('ResumeTailor Component', () => {
    const appId = 'app_123';

    it('renders Idle State correctly', () => {
      const data = { tailor_status: 'idle', tailored_bullets: [] };
      render(<ResumeTailor applicationId={appId} applicationData={data} />);
      
      expect(screen.getByText(/Auto-Tailor Resume/i)).toBeDefined();
      expect(screen.getByText(/Click "Auto-Tailor"/i)).toBeDefined();
    });

    it('renders Processing State correctly', () => {
      const data = { tailor_status: 'processing', tailored_bullets: [] };
      render(<ResumeTailor applicationId={appId} applicationData={data} />);
      
      expect(screen.getByText(/Optimizing History.../i)).toBeDefined();
    });

    it('renders Results State (Diff View)', () => {
      const data = {
        tailor_status: 'complete',
        tailored_bullets: [
          {
            original: 'Managed SQL DB.',
            optimized: 'Orchestrated Azure SQL migration.',
            reasoning: 'Added cloud keywords.',
            confidence: 95
          }
        ]
      };
      render(<ResumeTailor applicationId={appId} applicationData={data} />);

      // Verify Original (Red Context)
      expect(screen.getByText('Managed SQL DB.')).toBeDefined();
      expect(screen.getByText('Original')).toBeDefined();

      // Verify Optimized (Green Context)
      expect(screen.getByText('Orchestrated Azure SQL migration.')).toBeDefined();
      expect(screen.getByText('Optimized')).toBeDefined();

      // Verify Metadata
      expect(screen.getByText('Added cloud keywords.')).toBeDefined();
      expect(screen.getByText('95% Match')).toBeDefined();
    });

    it('copies text to clipboard when copy button is clicked', async () => {
      const data = {
        tailor_status: 'complete',
        tailored_bullets: [{ original: 'Old', optimized: 'New Bullet', reasoning: 'Test', confidence: 90 }]
      };
      render(<ResumeTailor applicationId={appId} applicationData={data} />);

      const copyBtn = screen.getByTitle('Copy to Clipboard');
      fireEvent.click(copyBtn);

      expect(mockWriteText).toHaveBeenCalledWith('New Bullet');
    });

    it('triggers Firestore update when Auto-Tailor is clicked', async () => {
      const data = { tailor_status: 'idle', tailored_bullets: [] };
      render(<ResumeTailor applicationId={appId} applicationData={data} />);

      const generateBtn = screen.getByText(/Auto-Tailor Resume/i);
      fireEvent.click(generateBtn);

      expect(firestore.updateDoc).toHaveBeenCalledWith(
        'mock_doc_ref',
        expect.objectContaining({ tailor_status: 'pending', tailored_bullets: [] })
      );
    });
  });

  // ==========================================
  // PART 2: JOB TRACKER (Integration)
  // ==========================================
  describe('JobTracker Integration', () => {
    it('switches tabs and renders the Resume Tailor component', async () => {
      // 1. Setup Mock Snapshot
      firestore.onSnapshot.mockImplementation((docRef, callback) => {
        callback({
          exists: () => true,
          data: () => ({
            company: 'Test Corp',
            role: 'Dev',
            ai_status: 'complete',
            tailor_status: 'idle',
            tailored_bullets: []
          })
        });
        return vi.fn();
      });

      render(<JobTracker />);

      // 2. Simulate User submitting the form
      fireEvent.change(screen.getByPlaceholderText('Company Name'), { target: { value: 'Test Corp' } });
      fireEvent.change(screen.getByPlaceholderText('Role Title'), { target: { value: 'Dev' } });
      fireEvent.change(screen.getByPlaceholderText('Paste Job Description...'), { target: { value: 'Job Desc' } });
      fireEvent.click(screen.getByText('Analyze Job'));

      // 3. Wait for Dashboard
      await waitFor(() => {
        expect(screen.getByTestId('analysis-dashboard')).toBeDefined();
      });

      // 4. Click the "Resume Tailor" Tab
      const tailorTab = screen.getByText('Resume Tailor');
      fireEvent.click(tailorTab);

      // 5. Verify Resume Tailor is visible
      expect(screen.getByText(/Auto-Tailor Resume/i)).toBeDefined();
    });
  });
});

```
---

## FILE: src/components/admin/__tests__/Sprint19.test.jsx
```jsx
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AnalysisDashboard from '../AnalysisDashboard';
import CoverLetterGenerator from '../CoverLetterGenerator';
import * as firestore from 'firebase/firestore';

// Mocks
const mockHandlePrint = vi.fn();
vi.mock('react-to-print', () => ({ useReactToPrint: () => mockHandlePrint }));

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(),
  doc: vi.fn(),
  updateDoc: vi.fn(),
  collection: vi.fn(),
  addDoc: vi.fn(),
  serverTimestamp: vi.fn(),
}));

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, layout, initial, animate, exit, ...props }) => <div {...props}>{children}</div>,
    circle: ({ children, ...props }) => <circle {...props}>{children}</circle>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

Object.assign(navigator, { clipboard: { writeText: vi.fn() } });

describe('Sprint 19 Features', () => {
  const mockOnReset = vi.fn();
  beforeEach(() => vi.clearAllMocks());

  describe('AnalysisDashboard', () => {
    it('renders structured Gap Analysis after toggling', () => {
      const data = {
        match_score: 75,
        gap_analysis: ["Missing Python", "Need AWS"],
        tailored_summary: "Good fit.",
      };

      render(<AnalysisDashboard data={data} onReset={mockOnReset} />);

      // 1. Find Toggle Button & Click it
      const toggleBtn = screen.getByText(/Strategic Gap Analysis/i);
      fireEvent.click(toggleBtn);

      // 2. NOW check for text
      expect(screen.getByText("Missing Python")).toBeDefined();
      expect(screen.getByText("Need AWS")).toBeDefined();
    });

    it('parses Legacy Gap Analysis string after toggling', () => {
      const data = {
        match_score: 75,
        gap_analysis: "1. Legacy Gap One 2. Legacy Gap Two",
        tailored_summary: "Good fit.",
      };

      render(<AnalysisDashboard data={data} onReset={mockOnReset} />);

      // 1. Find Toggle & Click
      const toggleBtn = screen.getByText(/Strategic Gap Analysis/i);
      fireEvent.click(toggleBtn);

      // 2. Check Text
      expect(screen.getByText(/Legacy Gap One/i)).toBeDefined();
      expect(screen.getByText(/Legacy Gap Two/i)).toBeDefined();
    });

    it('renders Evidence badges', () => {
      const data = {
        match_score: 90,
        suggested_projects: ["proj_a", "proj_b"],
        gap_analysis: [],
      };
      render(<AnalysisDashboard data={data} onReset={mockOnReset} />);
      expect(screen.getByText("proj_a")).toBeDefined();
    });
  });

  describe('CoverLetterGenerator', () => {
    const appId = 'test_123';

    it('displays "Writing..." state', () => {
      render(<CoverLetterGenerator applicationId={appId} applicationData={{ cover_letter_status: 'writing' }} />);
      expect(screen.getByText(/Writing.../i)).toBeDefined();
    });

    it('enters Edit Mode and saves', async () => {
      render(<CoverLetterGenerator applicationId={appId} applicationData={{ cover_letter_status: 'complete', cover_letter_text: 'Draft' }} />);
      
      fireEvent.click(screen.getByText(/Edit Text/i));
      const textarea = screen.getByRole('textbox');
      
      // Wrap updates in act()
      await act(async () => {
        fireEvent.change(textarea, { target: { value: 'New Draft' } });
        fireEvent.blur(textarea);
      });

      expect(firestore.updateDoc).toHaveBeenCalled();
    });
  });
});

```
---

## FILE: src/components/auth/ProtectedRoute.jsx
```jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;

```
---

## FILE: src/components/auth/__tests__/AdminSecurity.test.jsx.skip
```skip
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from '../../../context/AuthContext';
import ProtectedRoute from '../ProtectedRoute';
import * as FirebaseAuth from 'firebase/auth';

// 1. Mock Firebase Auth
vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(),
  GoogleAuthProvider: vi.fn(),
  onAuthStateChanged: vi.fn(),
  signInWithPopup: vi.fn(),
  signOut: vi.fn(),
}));

// 2. Mock Firebase Library
vi.mock('../../../lib/firebase', () => ({
  auth: {},
  googleProvider: {},
}));

// 3. Helper to mock the authorized email env var
vi.stubEnv('VITE_ADMIN_EMAIL', 'authorized@test.com');

describe('Admin Security Logic', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const MockAdminPage = () => <div>Sensitive Admin Data</div>;
  const MockPublicPage = () => <div>Public Resume</div>;

  it('ProtectedRoute: Shows loading spinner when auth state is pending', () => {
    // Force AuthContext to stay in loading state
    FirebaseAuth.onAuthStateChanged.mockImplementation(() => () => {});

    render(
      <AuthProvider>
        <ProtectedRoute>
          <MockAdminPage />
        </ProtectedRoute>
      </AuthProvider>
    );

    // Look for the loading spinner div
    expect(document.querySelector('.animate-spin')).toBeDefined();
  });

  it('Whitelisting: Grants access only to the whitelisted email', async () => {
    // Simulate authorized user login
    FirebaseAuth.onAuthStateChanged.mockImplementation((auth, callback) => {
      callback({ email: 'authorized@test.com' });
      return () => {};
    });

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<MockPublicPage />} />
            <Route 
              path="/admin" 
              element={<ProtectedRoute><MockAdminPage /></ProtectedRoute>} 
            />
          </Routes>
        </AuthProvider>
      </MemoryRouter>
    );

    expect(screen.getByText('Sensitive Admin Data')).toBeDefined();
  });

  it('Whitelisting: Bounces an authenticated but unauthorized user', async () => {
    // Simulate someone else logging in with their Google account
    FirebaseAuth.onAuthStateChanged.mockImplementation((auth, callback) => {
      callback({ email: 'intruder@hacker.com' });
      return () => {};
    });

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<MockPublicPage />} />
            <Route 
              path="/admin" 
              element={<ProtectedRoute><MockAdminPage /></ProtectedRoute>} 
            />
          </Routes>
        </AuthProvider>
      </MemoryRouter>
    );

    // Should be redirected to public page
    expect(screen.getByText('Public Resume')).toBeDefined();
    expect(screen.queryByText('Sensitive Admin Data')).toBeNull();
  });

  it('ProtectedRoute: Bounces unauthenticated users (null)', () => {
    // Simulate no user logged in
    FirebaseAuth.onAuthStateChanged.mockImplementation((auth, callback) => {
      callback(null);
      return () => {};
    });

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<MockPublicPage />} />
            <Route 
              path="/admin" 
              element={<ProtectedRoute><MockAdminPage /></ProtectedRoute>} 
            />
          </Routes>
        </AuthProvider>
      </MemoryRouter>
    );

    expect(screen.getByText('Public Resume')).toBeDefined();
  });
});

```
---

## FILE: src/components/common/BookingModal.jsx
```jsx
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar } from 'lucide-react';
import { logUserInteraction } from '../../hooks/useAnalytics';

/**
 * ğŸ“… BookingModal
 * Integrated scheduling interface with Focus Trapping & A11y.
 */
const BookingModal = ({ isOpen, onClose }) => {
  // Handle Escape Key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // Lock Scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  const handleClose = () => {
    logUserInteraction('booking_close');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            className="relative w-full max-w-4xl h-[90vh] md:h-[600px] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                  <Calendar size={20} />
                </div>
                <div>
                  <h2 id="modal-title" className="font-bold text-slate-900">Schedule a Consultation</h2>
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">15-Min Discovery Call</p>
                </div>
              </div>
              <button 
                onClick={handleClose}
                className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400 hover:text-slate-600"
                aria-label="Close Modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content / Iframe Container */}
            <div className="flex-1 bg-slate-50 relative">
              {/* ğŸ›‘ REPLACE src with your actual Calendly/Booking link */}
              <iframe
                src="https://calendly.com" 
                width="100%"
                height="100%"
                frameBorder="0"
                title="Scheduling Calendar"
                className="w-full h-full"
              ></iframe>
              
              {/* Optional: Simple Loader Overlay while iframe loads */}
              <div className="absolute inset-0 -z-10 flex items-center justify-center text-slate-400 text-sm italic">
                Loading Calendar...
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default BookingModal;

```
---

## FILE: src/components/common/LoadingSkeleton.jsx
```jsx
import React from 'react';

const LoadingSkeleton = () => {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 animate-pulse space-y-12">
      {/* Header Section */}
      <div className="space-y-4">
        <div className="h-10 bg-slate-200 rounded w-1/3 md:w-1/4"></div>
        <div className="h-4 bg-slate-200 rounded w-1/2 md:w-1/3"></div>
        <div className="h-20 bg-slate-100 rounded w-full md:w-2/3 mt-4"></div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-32 bg-slate-100 rounded-xl border border-slate-200"></div>
        ))}
      </div>

      {/* Sectors Grid */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="h-24 bg-slate-100 rounded-xl"></div>
        ))}
      </div>

      {/* Chart & Timeline Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="h-96 bg-slate-100 rounded-xl border border-slate-200"></div>
        <div className="space-y-6">
          {[1, 2].map(i => (
            <div key={i} className="h-48 bg-slate-100 rounded-xl border border-slate-200"></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;

```
---

## FILE: src/components/common/Mermaid.jsx
```jsx
import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

/**
 * ğŸ§œâ€â™‚ï¸ Mermaid.js Wrapper
 * Renders text-based diagrams as SVGs.
 * Handles the React lifecycle to prevent duplicate rendering.
 */
const Mermaid = ({ chart }) => {
  const ref = useRef(null);

  useEffect(() => {
    // Initialize with Slate/Blue theme
    mermaid.initialize({
      startOnLoad: true,
      theme: 'base',
      securityLevel: 'loose',
      themeVariables: {
        primaryColor: '#3b82f6',
        primaryTextColor: '#fff',
        primaryBorderColor: '#2563eb',
        lineColor: '#64748b',
        secondaryColor: '#1e293b',
        tertiaryColor: '#0f172a'
      }
    });

    if (ref.current) {
      // Clear previous content
      ref.current.innerHTML = '';
      
      // Unique ID for this render to avoid collision in long lists
      const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
      
      mermaid.render(id, chart).then(({ svg }) => {
        if (ref.current) {
          ref.current.innerHTML = svg;
        }
      });
    }
  }, [chart]);

  return (
    <div className="w-full bg-slate-900/50 p-4 rounded-lg border border-slate-700/50 overflow-x-auto">
      <div ref={ref} className="flex justify-center" />
    </div>
  );
};

export default Mermaid;

```
---

## FILE: src/components/common/__tests__/BookingModal.test.jsx
```jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import BookingModal from '../BookingModal';
import * as Analytics from '../../../hooks/useAnalytics';

// 1. Mock Framer Motion (Immediate Render)
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, onClick, role, ...props }) => (
      <div className={className} onClick={onClick} role={role} {...props}>
        {children}
      </div>
    ),
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

// 2. Mock Analytics Hook
vi.mock('../../../hooks/useAnalytics', () => ({
  logUserInteraction: vi.fn(),
}));

describe('BookingModal Component', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset body style before each test
    document.body.style.overflow = 'unset';
  });

  it('renders correctly when isOpen is true', () => {
    render(<BookingModal isOpen={true} onClose={mockOnClose} />);
    
    expect(screen.getByRole('dialog')).toBeDefined();
    expect(screen.getByText(/Schedule a Consultation/i)).toBeDefined();
    expect(screen.getByTitle(/Scheduling Calendar/i)).toBeDefined();
  });

  it('does not render when isOpen is false', () => {
    render(<BookingModal isOpen={false} onClose={mockOnClose} />);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('calls onClose and logs analytics when close button is clicked', () => {
    render(<BookingModal isOpen={true} onClose={mockOnClose} />);
    
    const closeBtn = screen.getByLabelText(/Close Modal/i);
    fireEvent.click(closeBtn);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
    expect(Analytics.logUserInteraction).toHaveBeenCalledWith('booking_close');
  });

  it('closes when the Escape key is pressed', () => {
    render(<BookingModal isOpen={true} onClose={mockOnClose} />);
    
    fireEvent.keyDown(window, { key: 'Escape', code: 'Escape' });
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('locks body scroll when open and restores it when closed', () => {
    const { rerender } = render(<BookingModal isOpen={true} onClose={mockOnClose} />);
    expect(document.body.style.overflow).toBe('hidden');

    rerender(<BookingModal isOpen={false} onClose={mockOnClose} />);
    expect(document.body.style.overflow).toBe('unset');
  });

  it('contains an accessible iframe for the booking tool', () => {
    render(<BookingModal isOpen={true} onClose={mockOnClose} />);
    const iframe = screen.getByTitle(/Scheduling Calendar/i);
    
    expect(iframe).toBeDefined();
    expect(iframe.tagName).toBe('IFRAME');
  });
});

```
---

## FILE: src/components/dashboard/Dashboard.jsx
```jsx
import React from 'react';
import KPIGrid from './KPIGrid';
import SkillRadar from './SkillRadar';
import SectorGrid from './SectorGrid';
import { useTypewriter } from '../../hooks/useTypewriter';
import { logUserInteraction } from '../../hooks/useAnalytics';
import { useResumeData } from '../../hooks/useResumeData'; // âœ… Import Hook
import LoadingSkeleton from '../common/LoadingSkeleton'; // âœ… Import Skeleton

const Dashboard = ({ activeFilter, onSkillClick }) => {
  // âœ… Fetch data from Context instead of importing JSON
  const { profile, skills, loading } = useResumeData();

  const typeWriterText = useTypewriter([
    "Management Consultant",
    "Power BI Developer",
    "Data & Analytics Leader",
    "Strategy Advisor"
  ]);

  // âœ… Show High-Fidelity Skeleton while loading
  if (loading) {
    return <LoadingSkeleton />;
  }

  // Safety check if profile is somehow null (e.g. initial render blink)
  if (!profile) return null;

  const handleInteraction = (label, type) => {
    logUserInteraction('filter_click', { filter_value: label, filter_type: type });
    onSkillClick(label);
  };

  return (
    <section id="dashboard" className="w-full max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8 text-center md:text-left">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
          {profile.basics.name}
        </h1>
        <p className="text-xl text-blue-600 mt-2 font-mono h-8">
          {typeWriterText}
          <span className="animate-pulse">|</span>
        </p>
        <p className="text-slate-400 mt-2 max-w-2xl text-sm md:text-base">
          {profile.basics.summary}
        </p>
      </div>

      <KPIGrid metrics={profile.metrics} />

      <SectorGrid 
        activeSector={activeFilter} 
        onSectorClick={(label) => handleInteraction(label, 'sector')} 
      />

      <SkillRadar 
        skills={skills} 
        onSkillClick={(label) => handleInteraction(label, 'skill')} 
      />
    </section>
  );
};

export default Dashboard;

```
---

## FILE: src/components/dashboard/KPIGrid.jsx
```jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Award, Briefcase, Layers } from 'lucide-react';
import clsx from 'clsx';

/**
 * Single Metric Card with Count-up Animation
 */
const KPICard = ({ label, value, icon: Icon, delay, color }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow"
    >
      <div className={clsx("p-3 rounded-lg bg-opacity-10", color)}>
        <Icon className={clsx("w-8 h-8", color.replace('bg-', 'text-'))} />
      </div>
      <div>
        <h3 className="text-3xl font-bold text-slate-800">
          {/* Simple count-up animation could go here, for now static for SEO/Speed */}
          {value}
        </h3>
        <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">{label}</p>
      </div>
    </motion.div>
  );
};

/**
 * Grid Container for all metrics
 */
const KPIGrid = ({ metrics }) => {
  const cards = [
    {
      label: "Years Experience",
      value: metrics.yearsExperience + "+",
      icon: Briefcase,
      color: "bg-blue-500 text-blue-600",
      delay: 0.1
    },
    {
      label: "Projects Delivered",
      value: metrics.projectsDelivered,
      icon: Layers,
      color: "bg-emerald-500 text-emerald-600",
      delay: 0.2
    },
    {
      label: "Certifications",
      value: metrics.certifications,
      icon: Award,
      color: "bg-purple-500 text-purple-600",
      delay: 0.3
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {cards.map((card, idx) => (
        <KPICard key={idx} {...card} />
      ))}
    </div>
  );
};

export default KPIGrid;

```
---

## FILE: src/components/dashboard/SectorGrid.jsx
```jsx
import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import sectors from '../../data/sectors.json';
import clsx from 'clsx';

const SectorGrid = ({ activeSector, onSectorClick }) => {
  return (
    <div className="mb-12">
      <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6 text-center md:text-left">
        Industry Impact
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {sectors.map((sector, idx) => {
          const IconComponent = Icons[sector.icon];
          const isActive = activeSector === sector.label;

          return (
            <motion.button
              key={sector.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => onSectorClick(sector.label)}
              className={clsx(
                "flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-300 group",
                isActive 
                  ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20" 
                  : "bg-white border-slate-100 text-slate-600 hover:border-blue-200 hover:bg-blue-50/30"
              )}
            >
              <div className={clsx(
                "p-2 rounded-lg mb-2 transition-colors",
                isActive ? "bg-white/20" : "bg-slate-50 group-hover:bg-blue-100"
              )}>
                {IconComponent && <IconComponent size={24} className={isActive ? "text-white" : "text-blue-500"} />}
              </div>
              <span className="text-xs font-bold text-center leading-tight uppercase tracking-tighter">
                {sector.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default SectorGrid;

```
---

## FILE: src/components/dashboard/SkillRadar.jsx
```jsx
import React from 'react';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip
} from 'recharts';
import { motion } from 'framer-motion';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 text-white text-xs p-2 rounded shadow-lg opacity-95">
        <p className="font-bold">{label}</p>
        <p>Proficiency: {payload[0].value}%</p>
      </div>
    );
  }
  return null;
};

const SkillRadar = ({ skills, onSkillClick }) => {
  if (!skills || skills.length === 0) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {skills.map((category, idx) => (
        <motion.div
          key={category.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 + (idx * 0.1) }}
          className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center min-w-0 overflow-hidden"
        >
          <h3 className="text-lg font-bold text-slate-700 mb-4">{category.label}</h3>
          <p className="text-xs text-slate-400 mb-2 italic">Click a skill label to filter experience</p>
          
          {/* âœ… FIXED: Inline style ensures Recharts can measure container immediately */}
          <div style={{ width: '100%', height: '300px', position: 'relative' }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={category.data}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis 
                  dataKey="subject" 
                  tick={{ 
                    fill: '#64748b', 
                    fontSize: 12, 
                    cursor: 'pointer', 
                    className: 'hover:fill-blue-600 transition-colors font-semibold'
                  }} 
                  onClick={({ value }) => onSkillClick(value)}
                />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  name={category.label}
                  dataKey="A"
                  stroke={category.id === 'strategy' ? '#8b5cf6' : '#3b82f6'}
                  fill={category.id === 'strategy' ? '#8b5cf6' : '#3b82f6'}
                  fillOpacity={0.6}
                />
                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default SkillRadar;

```
---

## FILE: src/components/dashboard/__tests__/SectorGrid.test.jsx
```jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SectorGrid from '../SectorGrid';
import sectors from '../../../data/sectors.json';

// Mock Framer Motion
vi.mock('framer-motion', () => ({
  motion: {
    button: ({ children, onClick, className, ...props }) => (
      <button onClick={onClick} className={className} {...props}>
        {children}
      </button>
    ),
  },
}));

describe('SectorGrid Component', () => {
  it('renders all sectors defined in sectors.json', () => {
    render(<SectorGrid activeSector={null} onSectorClick={() => {}} />);
    sectors.forEach(sector => {
      expect(screen.getByText(sector.label)).toBeDefined();
    });
  });

  it('calls onSectorClick when a sector is clicked', () => {
    const mockOnClick = vi.fn();
    render(<SectorGrid activeSector={null} onSectorClick={mockOnClick} />);
    fireEvent.click(screen.getByText('Public Sector'));
    expect(mockOnClick).toHaveBeenCalledWith('Public Sector');
  });

  it('applies active styling for selected sector', () => {
    render(<SectorGrid activeSector="Retail" onSectorClick={() => {}} />);
    const retailBtn = screen.getByText('Retail').closest('button');
    expect(retailBtn.className).toContain('bg-blue-600');
  });
});

```
---

## FILE: src/components/timeline/TimelineCard.jsx
```jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Network } from 'lucide-react';
import clsx from 'clsx';
import Mermaid from '../common/Mermaid';
import { logUserInteraction } from '../../hooks/useAnalytics';

const TimelineCard = ({ data, index, activeFilter }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDiagram, setActiveDiagram] = useState(null);

  useEffect(() => {
    if (!activeFilter) {
      setIsOpen(false);
      return;
    }
    // Defensive check for data.projects
    const projects = data.projects || [];
    const hasMatchingProject = projects.some(proj => 
      proj.skills?.some(skill => 
        skill.toLowerCase().includes(activeFilter.toLowerCase())
      )
    );
    if (hasMatchingProject) setIsOpen(true);
  }, [activeFilter, data.projects]);

  const toggleDiagram = (projectId, diagram) => {
    if (activeDiagram === projectId) {
      setActiveDiagram(null);
    } else {
      logUserInteraction('view_diagram', { project_id: projectId });
      setActiveDiagram(projectId);
    }
  };

  // Guard: If no projects, render minimal card
  const projects = data.projects || [];

  return (
    <div className="relative pl-6 md:pl-12 py-6 group">
      
      {/* ğŸ“ The Dot */}
      <motion.div 
        layout
        className="absolute left-[-5px] top-8 w-4 h-4 rounded-full bg-blue-500 border-4 border-slate-900 z-10 group-hover:scale-125 transition-transform"
        aria-hidden="true"
      />

      <motion.div 
        layout
        className="bg-slate-800/50 rounded-xl border border-slate-700 hover:border-blue-500/50 transition-colors shadow-lg overflow-hidden"
      >
        <div className="p-4 md:p-6 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2">
            <div className="max-w-full">
              <h3 className="text-lg md:text-xl font-bold text-white break-words">{data.role || "Role Title"}</h3>
              <span className="text-blue-400 font-medium text-sm block mt-1 sm:mt-0">{data.company || "Company Name"}</span>
            </div>
            
            <div className="flex items-center gap-4 mt-2 sm:mt-0">
              <span className="text-slate-400 text-xs md:text-sm font-mono whitespace-nowrap">{data.date || "Present"}</span>
              {isOpen ? <ChevronUp size={18} className="text-slate-500" /> : <ChevronDown size={18} className="text-slate-500" />}
            </div>
          </div>
          <p className="text-slate-300 text-sm mt-2 leading-relaxed">{data.summary || "No summary provided."}</p>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-slate-700 bg-slate-900/30 p-4 space-y-4 md:space-y-4"
            >
              {projects.length === 0 && <div className="text-slate-500 text-sm italic">No projects listed.</div>}
              
              {projects.map(project => {
                const isMatch = activeFilter && project.skills?.some(s => s.toLowerCase().includes(activeFilter.toLowerCase()));
                const hasDiagram = !!project.diagram;
                
                // âœ… DEFENSIVE: Fallback for PAR object
                const par = project.par || { problem: "N/A", action: "N/A", result: "N/A" };

                return (
                  <div 
                    key={project.id || Math.random()} 
                    className={clsx(
                      "transition-all",
                      "pb-6 border-b border-slate-800/50 last:border-0 last:pb-0",
                      "md:p-4 md:rounded-lg md:border md:pb-4 md:border-b md:mb-0",
                      isMatch 
                        ? "md:bg-blue-900/20 md:border-blue-500/50" 
                        : "md:bg-slate-900 md:border-slate-800"
                    )}
                  >
                    <div className="flex flex-col gap-2 mb-3">
                      <div className="flex justify-between items-start">
                        <h5 className={clsx("font-bold text-sm", isMatch ? "text-blue-300" : "text-slate-200")}>
                          {project.title || "Untitled Project"}
                        </h5>
                      </div>
                      
                      {hasDiagram && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); toggleDiagram(project.id, project.diagram); }}
                          className={clsx(
                            "self-start p-1.5 rounded-md transition-colors flex items-center gap-2 text-[10px] uppercase font-bold tracking-tighter border",
                            activeDiagram === project.id 
                              ? "bg-blue-600 text-white border-blue-500" 
                              : "bg-slate-800 text-slate-400 border-slate-700 hover:text-white"
                          )}
                          title="View Architecture Diagram"
                        >
                          <Network size={14} />
                          Visual Architecture
                        </button>
                      )}
                    </div>

                    <div className="space-y-2 text-sm text-slate-400 mb-4 leading-relaxed">
                      <p><strong className="text-blue-400 block text-xs uppercase tracking-wider mb-0.5">Problem:</strong> {par.problem}</p>
                      <p><strong className="text-emerald-400 block text-xs uppercase tracking-wider mb-0.5">Action:</strong> {par.action}</p>
                      <p><strong className="text-purple-400 block text-xs uppercase tracking-wider mb-0.5">Result:</strong> {par.result}</p>
                    </div>

                    <AnimatePresence>
                      {activeDiagram === project.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="mb-4 overflow-hidden w-full"
                        >
                          <Mermaid chart={project.diagram} />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="flex flex-wrap gap-2 mt-3">
                      {(project.skills || []).map(skill => (
                        <span key={skill} className="px-2 py-1 text-[10px] rounded-md border border-slate-700 bg-slate-800 text-slate-500 whitespace-nowrap">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default TimelineCard;

```
---

## FILE: src/components/timeline/TimelineContainer.jsx
```jsx
import React from 'react';
import { AnimatePresence } from 'framer-motion';
import TimelineCard from './TimelineCard';

const TimelineContainer = ({ experienceData, activeFilter }) => {
  return (
    <div className="relative max-w-3xl mx-auto">
      {/* ğŸ“ The Vertical Spine */}
      <div className="absolute left-[2px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-transparent opacity-50" />

      {/* List of Items */}
      <div className="flex flex-col space-y-4">
        <AnimatePresence mode='popLayout'>
          {experienceData.map((job, index) => (
            <TimelineCard 
              key={job.id} 
              data={job} 
              index={index} 
              activeFilter={activeFilter} // Pass filter down for Smart Expansion
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TimelineContainer;

```
---

## FILE: src/components/timeline/__tests__/TimelineCard.test.jsx
```jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TimelineCard from '../TimelineCard';

// 1. Mock Framer Motion
// We MUST include AnimatePresence now that we use it for the Accordion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, onClick }) => (
      <div className={className} onClick={onClick}>
        {children}
      </div>
    ),
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

describe('TimelineCard Component', () => {
  // 2. Define Mock Data (UPDATED NESTED STRUCTURE)
  const mockData = {
    id: "test_1",
    role: "Senior Developer",
    company: "Tech Corp",
    date: "2020 - Present",
    logo: "ğŸš€",
    skills: ["React", "Node.js"],
    summary: "A test summary.",
    projects: [
      {
        id: "p1",
        title: "Legacy Refactor",
        skills: ["React", "Vitest"],
        par: {
          problem: "Legacy code was slow.",
          action: "Refactored to React 19.",
          result: "Performance improved by 50%."
        }
      }
    ]
  };

  it('renders the job header (role, company) by default', () => {
    render(<TimelineCard data={mockData} index={0} />);
    
    expect(screen.getByText('Senior Developer')).toBeDefined();
    expect(screen.getByText('Tech Corp')).toBeDefined();
    expect(screen.getByText('2020 - Present')).toBeDefined();
  });

  it('expands to show Projects when clicked', () => {
    render(<TimelineCard data={mockData} index={0} />);
    
    // 1. Check that project title is NOT visible initially (Logic: AnimatePresence would hide it, 
    // but in our mock AnimatePresence renders children immediately if isOpen is true. 
    // Since isOpen is false by default, it shouldn't be there.)
    expect(screen.queryByText('Legacy Refactor')).toBeNull();

    // 2. Click the Card Header to expand
    // We target the role text to simulate clicking the header area
    fireEvent.click(screen.getByText('Senior Developer'));

    // 3. Now the Project Title should be visible
    expect(screen.getByText('Legacy Refactor')).toBeDefined();
  });

  it('renders the PAR narrative inside the expanded project', () => {
    render(<TimelineCard data={mockData} index={0} />);
    
    // Open the accordion
    fireEvent.click(screen.getByText('Senior Developer'));

    // Check PAR content
    expect(screen.getByText(/Legacy code was slow/i)).toBeDefined();
    expect(screen.getByText(/Refactored to React 19/i)).toBeDefined();
    expect(screen.getByText(/Performance improved by 50%/i)).toBeDefined();
  });

  it('auto-expands if activeFilter matches a project skill', () => {
    // We pass "Vitest" as the active filter. 
    // The Project "Legacy Refactor" uses "Vitest", so it should auto-open.
    render(<TimelineCard data={mockData} index={0} activeFilter="Vitest" />);
    
    // Should be visible WITHOUT clicking
    expect(screen.getByText('Legacy Refactor')).toBeDefined();
  });
});

```
---

## FILE: src/context/AuthContext.jsx
```jsx
import React, { createContext, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // ğŸ”“ MOCK USER: Always logged in
  const user = { 
    uid: 'dev-admin', 
    email: 'admin@ryandouglas.com', 
    displayName: 'Ryan Douglas (Dev)' 
  };

  return (
    <AuthContext.Provider value={{ user, login: () => {}, logout: () => {}, loading: false }}>
      {children}
    </AuthContext.Provider>
  );
};

```
---

## FILE: src/context/ResumeContext.jsx
```jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { db } from '../lib/db';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';

// ğŸ›¡ï¸ FALLBACK DATA (Local JSON)
import localProfile from '../data/profile.json';
import localSkills from '../data/skills.json';
import localSectors from '../data/sectors.json';
import localExperience from '../data/experience.json';

// âœ… FIX: Added 'export' so the hook can consume it
export const ResumeContext = createContext();

export const ResumeProvider = ({ children }) => {
  const [data, setData] = useState({
    profile: null,
    skills: [],
    sectors: [],
    experience: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("ğŸ”¥ Fetching Resume Data from Firestore...");

        // 1. Fetch Profile (Singleton)
        const profileSnap = await getDoc(doc(db, 'profile', 'primary'));
        const profile = profileSnap.exists() ? profileSnap.data() : localProfile;

        // 2. Fetch Skills
        const skillsSnap = await getDocs(collection(db, 'skills'));
        const skills = skillsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // 3. Fetch Sectors
        const sectorsSnap = await getDocs(collection(db, 'sectors'));
        const sectors = sectorsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // 4. Fetch Experience (DEEP FETCH PATTERN)
        const expSnap = await getDocs(collection(db, 'experience'));
        
        const experience = await Promise.all(expSnap.docs.map(async (jobDoc) => {
          const jobData = { id: jobDoc.id, ...jobDoc.data() };
          // Fetch Sub-collection: projects
          const projectsSnap = await getDocs(collection(jobDoc.ref, 'projects'));
          const projects = projectsSnap.docs.map(p => ({ id: p.id, ...p.data() }));
          return { ...jobData, projects };
        }));

        setData({
          profile: profile,
          skills: skills.length > 0 ? skills : localSkills,
          sectors: sectors.length > 0 ? sectors : localSectors,
          experience: experience.length > 0 ? experience : localExperience
        });
        
        setLoading(false);

      } catch (err) {
        console.error("âš ï¸ Firestore Fetch Failed. Activating Backup Protocols.", err);
        // ğŸ›¡ï¸ FAILOVER: Load Local JSON
        setData({
          profile: localProfile,
          skills: localSkills,
          sectors: localSectors,
          experience: localExperience
        });
        setError(err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <ResumeContext.Provider value={{ ...data, loading, error }}>
      {children}
    </ResumeContext.Provider>
  );
};

```
---

## FILE: src/context/__tests__/ResumeContext.test.jsx
```jsx
import React from 'react';
import { render, screen, renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ResumeProvider } from '../ResumeContext';
import { useResumeData } from '../../hooks/useResumeData';
import * as Firestore from 'firebase/firestore';

// =============================================================================
// 1. MOCK DATA & IMPORTS
// We inline the mock data inside the factory to avoid hoisting ReferenceErrors.
// =============================================================================

vi.mock('../../data/profile.json', () => ({ 
  default: { basics: { name: "Local Fallback Ryan" }, metrics: {} } 
}));
vi.mock('../../data/skills.json', () => ({ default: [] }));
vi.mock('../../data/sectors.json', () => ({ default: [] }));
vi.mock('../../data/experience.json', () => ({ 
  default: [{ id: "local_job", role: "Local Dev", projects: [] }] 
}));

// Mock Firebase Service
vi.mock('../../lib/db', () => ({ db: {} }));

// Mock Firestore SDK methods
vi.mock('firebase/firestore', () => ({
  getDoc: vi.fn(),
  getDocs: vi.fn(),
  collection: vi.fn(),
  doc: vi.fn(),
}));

// =============================================================================
// 2. HELPER COMPONENTS
// =============================================================================

const TestConsumer = () => {
  const { profile, experience, loading } = useResumeData();

  if (loading) return <div data-testid="loading">Loading...</div>;
  
  return (
    <div>
      <div data-testid="profile-name">{profile?.basics?.name}</div>
      <div data-testid="job-role">{experience?.[0]?.role}</div>
      <div data-testid="project-count">{experience?.[0]?.projects?.length || 0}</div>
    </div>
  );
};

// =============================================================================
// 3. TEST SUITE
// =============================================================================

describe('ResumeContext & Data Layer', () => {
  
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('fetches and merges deep data from Firestore on success', async () => {
    // 1. Mock Profile
    Firestore.getDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({ basics: { name: "Firestore Ryan" }, metrics: {} })
    });

    // 2. Mock Collections (Sequence: Skills, Sectors, Experience, Projects)
    const mockJobDoc = { 
      id: 'cloud_job', 
      data: () => ({ role: "Cloud Architect" }),
      ref: 'mock_ref' 
    };

    Firestore.getDocs
      .mockResolvedValueOnce({ docs: [] }) // Skills
      .mockResolvedValueOnce({ docs: [] }) // Sectors
      .mockResolvedValueOnce({ docs: [mockJobDoc] }) // Experience Parent
      .mockResolvedValueOnce({ docs: [{ id: 'p1', data: () => ({ title: 'Cloud Project' }) }] }); // Projects Sub

    render(
      <ResumeProvider>
        <TestConsumer />
      </ResumeProvider>
    );

    expect(screen.getByTestId('loading')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    });

    expect(screen.getByTestId('profile-name')).toHaveTextContent('Firestore Ryan');
    expect(screen.getByTestId('job-role')).toHaveTextContent('Cloud Architect');
    expect(screen.getByTestId('project-count')).toHaveTextContent('1');
  });

  it('falls back to Local JSON seamlessly if Firestore fails', async () => {
    // Force fail first call
    Firestore.getDoc.mockRejectedValue(new Error("Simulated Network Crash"));

    render(
      <ResumeProvider>
        <TestConsumer />
      </ResumeProvider>
    );

    await waitFor(() => {
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    });

    // Verify Error Log
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining("Firestore Fetch Failed"), 
      expect.any(Error)
    );

    // Verify Fallback Data
    expect(screen.getByTestId('profile-name')).toHaveTextContent('Local Fallback Ryan');
    expect(screen.getByTestId('job-role')).toHaveTextContent('Local Dev');
  });

  it('provides isLoading=true initially', () => {
    Firestore.getDoc.mockReturnValue(new Promise(() => {}));
    render(
      <ResumeProvider>
        <TestConsumer />
      </ResumeProvider>
    );
    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  it('throws an error if hook is used outside Provider', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => {
      renderHook(() => useResumeData());
    }).toThrow('useResumeData must be used within a ResumeProvider');
    consoleSpy.mockRestore();
  });
});

```
---

## FILE: src/data/__tests__/SchemaValidation.test.js
```js
import { describe, it, expect } from 'vitest';
import profile from '../profile.json';
import skills from '../skills.json';
import experience from '../experience.json';

describe('Data Integrity (Schema Validation)', () => {

  // 1. PROFILE TEST
  it('Profile Data has required structure', () => {
    expect(profile.basics).toBeDefined();
    expect(profile.basics.name).toBeTypeOf('string');
    expect(profile.basics.label).toBeTypeOf('string');
    expect(profile.metrics).toBeDefined();
  });

  // 2. SKILLS TEST
  it('Skills Data is structured correctly for Radar Chart', () => {
    expect(Array.isArray(skills)).toBe(true);
    expect(skills.length).toBeGreaterThan(0);

    skills.forEach(category => {
      expect(category.id).toBeDefined();
      expect(Array.isArray(category.data)).toBe(true);
      
      category.data.forEach(skill => {
        expect(skill.subject).toBeTypeOf('string');
        expect(skill.A).toBeTypeOf('number');
        expect(skill.fullMark).toBe(100);
      });
    });
  });

  // 3. EXPERIENCE TEST (UPDATED FOR NESTED PROJECTS)
  it('Experience Data follows the Project-Based Architecture', () => {
    expect(Array.isArray(experience)).toBe(true);
    expect(experience.length).toBeGreaterThan(0);

    experience.forEach(job => {
      // Check Job Wrapper
      expect(job.id).toBeDefined();
      expect(job.role).toBeTypeOf('string');
      expect(job.company).toBeTypeOf('string');
      expect(Array.isArray(job.projects)).toBe(true);
      
      // Check Nested Projects
      job.projects.forEach(project => {
        expect(project.id).toBeDefined();
        expect(project.title).toBeTypeOf('string');
        expect(Array.isArray(project.skills)).toBe(true);
        
        // Check PAR Structure (Now inside the project)
        expect(project.par).toBeDefined();
        if (project.diagram) expect(project.diagram).toBeTypeOf("string");
        expect(project.par.problem).toBeTypeOf('string');
        expect(project.par.action).toBeTypeOf('string');
        expect(project.par.result).toBeTypeOf('string');
        
        // Quality Check
        expect(project.par.problem.length).toBeGreaterThan(5);
      });
    });
  });
});

```
---

## FILE: src/data/experience.json
```json
[
  {
    "id": "job_pwc",
    "role": "Manager (Data & Analytics)",
    "company": "PwC Canada LLP",
    "date": "2012 - 2024",
    "logo": "ğŸ’¼",
    "summary": "Senior management consultant leading data-driven transformation projects and advising government leaders while engineering hands-on analytics solutions.",
    "skills": ["Digital Strategy", "Leadership", "Stakeholder Mgmt"],
    "projects": [
      {
        "id": "pwc_proj_1",
        "title": "Public Sector Digital Transformation",
        "sector": "Public Sector",
        "skills": ["Power BI", "SQL", "Change Management"],
        "diagram": "graph LR\n  DB[(Legacy Data)] --> ETL[SSIS/Azure]\n  ETL --> DW[(SQL Data Warehouse)]\n  DW --> PBI[Power BI Dashboards]\n  PBI --> EXEC{Executive Insights}",
        "par": {
          "problem": "Government clients struggled with fragmented data ecosystems, preventing executive visibility into critical operations.",
          "action": "Architected target operating models and deployed advanced Power BI dashboards to track customer journeys.",
          "result": "Delivered sustainable digital transformation, aligning technical execution with strategic business objectives."
        }
      },
      {
        "id": "pwc_proj_2",
        "title": "Omnichannel Contact Center Modernization",
        "sector": "Telecommunications",
        "skills": ["Data Modeling", "Azure", "Risk Assessment"],
        "par": {
          "problem": "Legacy contact center infrastructure lacked integration, leading to poor customer insights and operational inefficiencies.",
          "action": "Led the design and deployment of modern BI solutions, integrating data from multiple channels for a unified view.",
          "result": "Enhanced operational efficiency and enabled real-time reporting for high-stakes regulatory environments."
        }
      }
    ]
  },
  {
    "id": "job_biond",
    "role": "Business Intelligence Developer",
    "company": "Biond Consulting",
    "date": "2011 - 2012",
    "logo": "ğŸ“Š",
    "summary": "Specialized in end-to-end Microsoft BI solutions, from architecting data warehouses to building robust reporting dashboards.",
    "skills": ["Microsoft BI Stack", "Consulting"],
    "projects": [
      {
        "id": "biond_proj_1",
        "title": "Retail Analytics Platform Migration",
        "sector": "Retail",
        "skills": ["SSIS", "Data Warehousing", "ETL"],
        "diagram": "graph TD\n  POS[Point of Sale] --> SSIS[SSIS ETL]\n  WEB[E-Commerce] --> SSIS\n  SSIS --> STAGE[(Staging)]\n  STAGE --> DIM{Dimension Loading}\n  DIM --> CUBE[Analysis Services]",
        "par": {
          "problem": "A major Canadian clothing retailer relied on legacy systems that could not scale with their growing data volume.",
          "action": "Built and optimized complex ETL pipelines using SSIS and architected a new enterprise-grade data warehouse.",
          "result": "Successfully transitioned client to a modern analytics platform, significantly enhancing strategic insight capabilities."
        }
      },
      {
        "id": "biond_proj_2",
        "title": "Distributor Reporting Solution",
        "sector": "Distribution",
        "skills": ["SSRS", "SQL", "KPI Definition"],
        "par": {
          "problem": "A major distributor lacked the reporting infrastructure to make timely inventory and sales decisions.",
          "action": "Collaborated with clients to define critical KPIs and delivered a custom SSRS reporting solution.",
          "result": "Strengthened executive decision-making and improved business responsiveness post-implementation."
        }
      }
    ]
  },
  {
    "id": "job_tele",
    "role": "Manager, Data and Analytics",
    "company": "Teleperformance",
    "date": "2005 - 2011",
    "logo": "ğŸŒ",
    "summary": "Managed the data and analytics team driving strategy and transformation across international operations.",
    "skills": ["Team Leadership", "Process Improvement"],
    "projects": [
      {
        "id": "tp_proj_1",
        "title": "Global Contact Center Automation",
        "sector": "Outsourcing",
        "skills": ["C#", "SharePoint", "Automation"],
        "par": {
          "problem": "International operations relied on manual reporting processes, causing data latency and high operational costs.",
          "action": "Managed the full SDLC of automated reporting solutions using C#, SharePoint, and SQL.",
          "result": "Implemented automated processes that resulted in significant time and cost savings across multiple departments."
        }
      }
    ]
  }
]

```
---

## FILE: src/data/profile.json
```json
{
  "basics": {
    "name": "Ryan Douglas",
    "label": "Management Consultant & Power BI Developer",
    "email": "rpdouglas@gmail.com",
    "phone": "613.936.6341",
    "location": "Cornwall, Ontario",
    "summary": "A results-driven Data & Analytics Leader with 15 years of experience bridging the gap between high-level business strategy and granular technical execution. Proven expertise in leading cross-functional teams through complex digital transformations and building enterprise-grade BI solutions from the ground up.",
    "website": "https://ryandouglas-resume.web.app",
    "github": "https://github.com/rpdouglas",
    "linkedin": "https://linkedin.com/in/ryandouglas"
  },
  "metrics": {
    "yearsExperience": 15,
    "projectsDelivered": 40,
    "certifications": 2
  }
}

```
---

## FILE: src/data/sectors.json
```json
[
  { "id": "public", "label": "Public Sector", "icon": "Government" },
  { "id": "retail", "label": "Retail", "icon": "ShoppingBag" },
  { "id": "telecom", "label": "Telecommunications", "icon": "Radio" },
  { "id": "finance", "label": "Finance", "icon": "Banknote" },
  { "id": "logistics", "label": "Distribution", "icon": "Truck" },
  { "id": "outsourcing", "label": "Outsourcing", "icon": "Globe" }
]

```
---

## FILE: src/data/skills.json
```json
[
  {
    "id": "strategy",
    "label": "Business Strategy",
    "data": [
      { "subject": "Change Mgmt", "A": 95, "fullMark": 100 },
      { "subject": "Stakeholder Mgmt", "A": 90, "fullMark": 100 },
      { "subject": "Digital Strategy", "A": 95, "fullMark": 100 },
      { "subject": "Process Opt", "A": 85, "fullMark": 100 },
      { "subject": "Risk Mitigation", "A": 80, "fullMark": 100 }
    ]
  },
  {
    "id": "technical",
    "label": "Technical Stack",
    "data": [
      { "subject": "Power BI / DAX", "A": 95, "fullMark": 100 },
      { "subject": "SQL / T-SQL", "A": 90, "fullMark": 100 },
      { "subject": "ETL (SSIS)", "A": 85, "fullMark": 100 },
      { "subject": "Data Modeling", "A": 90, "fullMark": 100 },
      { "subject": "C# / VB.NET", "A": 75, "fullMark": 100 }
    ]
  }
]

```
---

## FILE: src/hooks/__tests__/useAnalytics.test.js
```js
import { describe, it, expect, vi } from 'vitest';
import { logUserInteraction } from '../useAnalytics';
import { logEvent } from 'firebase/analytics';

// Mock Firebase
vi.mock('firebase/analytics', () => ({
  logEvent: vi.fn(),
  getAnalytics: vi.fn(() => ({})), // Return dummy object
}));

vi.mock('../../lib/firebase', () => ({
  analytics: {}, // Truthy object to simulate initialized analytics
  app: {},
}));

describe('useAnalytics (logUserInteraction)', () => {
  it('calls firebase logEvent with correct parameters', () => {
    const eventName = 'test_event';
    const params = { foo: 'bar' };
    
    logUserInteraction(eventName, params);

    expect(logEvent).toHaveBeenCalledWith({}, eventName, params);
  });
});

```
---

## FILE: src/hooks/__tests__/useTypewriter.test.js
```js
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useTypewriter } from '../useTypewriter';

describe('useTypewriter Hook', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('initializes with an empty string', () => {
    const { result } = renderHook(() => useTypewriter(['Hello', 'World']));
    expect(result.current).toBe('');
  });

  it('types out the first word over time', () => {
    const { result } = renderHook(() => useTypewriter(['Hi'], 100)); // 100ms per char

    // Fast-forward time to type "H"
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current).toBe('H');

    // Fast-forward to type "i"
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current).toBe('Hi');
  });
});

```
---

## FILE: src/hooks/useAnalytics.js
```js
import { useEffect } from 'react';
import { logEvent } from "firebase/analytics";
import { analytics } from "../lib/firebase";

/**
 * ğŸ“Š useAnalytics Hook
 * Handles page view logging and provides event tracking helper.
 */
export const useAnalytics = () => {
  // Log Page View on Mount
  useEffect(() => {
    if (analytics) {
      logEvent(analytics, 'page_view');
    }
  }, []);

  return;
};

/**
 * ğŸ“¡ Log User Interaction
 * Safely logs custom events to Firebase Analytics.
 * @param {string} eventName - Snake_case event name (e.g., 'select_skill')
 * @param {object} params - Event parameters
 */
export const logUserInteraction = (eventName, params = {}) => {
  if (analytics) {
    try {
      logEvent(analytics, eventName, params);
      // Optional: Log to console in Dev mode for verification
      if (import.meta.env.DEV) {
        console.log(`ğŸ“Š [Analytics] ${eventName}:`, params);
      }
    } catch (error) {
      console.warn("Analytics Error:", error);
    }
  }
};

```
---

## FILE: src/hooks/useResumeData.js
```js
import { useContext } from 'react';
import { ResumeContext } from '../context/ResumeContext';

// Custom Hook to consume the Resume Context
// This abstracts the useContext logic from components
export const useResumeData = () => {
  const context = useContext(ResumeContext);
  if (context === undefined) {
    throw new Error('useResumeData must be used within a ResumeProvider');
  }
  return context;
};

```
---

## FILE: src/hooks/useTypewriter.js
```js
import { useState, useEffect } from 'react';

/**
 * âŒ¨ï¸ useTypewriter Hook
 * Cycles through an array of strings with a typing/deleting effect.
 * * @param {string[]} words - Array of strings to cycle through
 * @param {number} typingSpeed - ms per character (default 150)
 * @param {number} deletingSpeed - ms per character (default 100)
 * @param {number} pauseDuration - ms to wait before deleting (default 2000)
 * @returns {string} - The current text being typed
 */
export const useTypewriter = (words, typingSpeed = 100, deletingSpeed = 50, pauseDuration = 2000) => {
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeedState, setTypingSpeedState] = useState(typingSpeed);

  useEffect(() => {
    const i = loopNum % words.length;
    const fullText = words[i];

    const handleType = () => {
      setText(current => 
        isDeleting 
          ? fullText.substring(0, current.length - 1) 
          : fullText.substring(0, current.length + 1)
      );

      // Dynamic Speed Logic
      let typeSpeed = isDeleting ? deletingSpeed : typingSpeed;

      if (!isDeleting && text === fullText) {
        // Finished typing word, pause before deleting
        typeSpeed = pauseDuration;
        setIsDeleting(true);
      } else if (isDeleting && text === '') {
        // Finished deleting, switch to next word
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
        typeSpeed = 500; // Small pause before typing next word
      }

      setTypingSpeedState(typeSpeed);
    };

    const timer = setTimeout(handleType, typingSpeedState);

    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, words, typingSpeed, deletingSpeed, pauseDuration, typingSpeedState]);

  return text;
};

```
---

## FILE: src/index.css
```css
@import "tailwindcss";

@theme {
  /* Core Variables */
  --color-brand-dark: #0f172a;  /* Slate 900 */
  --color-brand-accent: #3b82f6; /* Blue 500 */
  --color-brand-light: #f8fafc; /* Slate 50 */
  
  --font-sans: "Inter", system-ui, sans-serif;
}

/* Base Styles */
body {
  background-color: var(--color-brand-light);
  color: var(--color-brand-dark);
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
}

/* ğŸŸ¢ A11Y: High-Visibility Focus Rings for Keyboard Users */
:focus-visible {
  outline: 2px solid var(--color-brand-accent);
  outline-offset: 2px;
  border-radius: 4px;
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* ğŸ–¨ï¸ PRINT STYLES: The "White Paper" Transformation */
@media print {
  .print\:hidden { display: none !important; }
  /* 1. Global Reset for Paper */
  body {
    background-color: white !important;
    color: black !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  /* 2. Invert specific dark sections to white */
  section, footer, main, div {
    background-color: white !important;
    color: black !important;
    box-shadow: none !important;
    border-color: #cbd5e1 !important; /* Slate 300 for borders */
  }

  /* 3. Text adjustments */
  h1, h2, h3, h4, p, span, strong {
    color: black !important;
    text-shadow: none !important;
  }

  /* 4. Formatting tweaks */
  a {
    text-decoration: underline;
    color: #2563eb !important; /* Blue 600 for links */
  }

  /* 5. Page Breaks */
  section {
    break-inside: avoid;
    page-break-inside: avoid;
    margin-bottom: 2rem;
    padding-top: 1rem !important;
    padding-bottom: 1rem !important;
  }
}

```
---

## FILE: src/lib/db.js
```js
import { getFirestore } from "firebase/firestore";
import { app } from "./firebase";

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

```
---

## FILE: src/lib/firebase.js
```js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFunctions, httpsCallable } from "firebase/functions";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const functions = getFunctions(app);

// Callable Functions
export const architectProject = httpsCallable(functions, 'architectProject');

const analytics = (typeof window !== 'undefined' && window.indexedDB) 
  ? getAnalytics(app) 
  : null;

export { app, auth, googleProvider, analytics };

```
---

## FILE: src/main.jsx
```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

```
---

## FILE: src/pages/AdminDashboard.jsx
```jsx
import React, { useState, Suspense, lazy } from 'react';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Settings, LogOut, Database, Sparkles, ExternalLink, Briefcase } from 'lucide-react';

// Lazy Load components for performance
const ProjectArchitect = lazy(() => import('./admin/ProjectArchitect'));
const DataSeeder = lazy(() => import('../components/admin/DataSeeder'));
const JobTracker = lazy(() => import('../components/admin/JobTracker'));

const AdminDashboard = () => {
  const { logout, user } = useAuth();
  const [activeTab, setActiveTab] = useState('tracker'); // Default to new feature for testing

  const navItems = [
    { id: 'tracker', icon: Briefcase, label: 'Job Tracker' },
    { id: 'architect', icon: Sparkles, label: 'Gemini Architect' },
    { id: 'database', icon: Database, label: 'Database' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col sticky top-0 h-screen">
        <div className="p-6 border-b border-slate-800">
          <h2 className="font-bold text-xl tracking-tight">CMS Admin</h2>
          <p className="text-xs text-slate-400 mt-1 truncate">{user?.email}</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                activeTab === item.id ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-2">
          <a 
            href="/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors"
          >
            <ExternalLink size={18} />
            View Live Site
          </a>

          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Content Area */}
      <main className="flex-1 p-8 overflow-y-auto">
        <Suspense fallback={
          <div className="h-full flex items-center justify-center text-slate-400">Loading...</div>
        }>
          {activeTab === 'tracker' && <JobTracker />}
          {activeTab === 'architect' && <ProjectArchitect />}
          {activeTab === 'database' && <DataSeeder />}
          {activeTab === 'settings' && (
            <div className="h-full flex items-center justify-center text-slate-400">
              <p>Module '{activeTab}' coming soon.</p>
            </div>
          )}
        </Suspense>
      </main>
    </div>
  );
};

export default AdminDashboard;

```
---

## FILE: src/pages/admin/ProjectArchitect.jsx
```jsx
import React, { useState } from 'react';
import { architectProject } from '../../lib/firebase';
import { Sparkles, Copy, RefreshCw, AlertCircle } from 'lucide-react';
import TimelineCard from '../../components/timeline/TimelineCard';

const ProjectArchitect = () => {
  const [rawText, setRawText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleArchitect = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await architectProject({ rawText });
      
      console.log("ğŸ¤– Raw Cloud Function Response:", response);

      // âœ… FIX: Intelligent Unwrapping (Handle double wrapping)
      // The function returns { data: ... }, and the SDK puts that in response.data
      const payload = response.data.data || response.data;
      
      console.log("ğŸ“¦ Unwrapped Payload:", payload);
      setResult(payload);

    } catch (err) {
      const msg = err.message || "AI generation failed. Check your API key or connection.";
      setError(msg);
      console.error("Architect Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-full gap-6">
      {/* Left: Input Pane */}
      <div className="flex-1 flex flex-col gap-4">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex-1 flex flex-col">
          <label className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">
            Raw Project Notes
          </label>
          <textarea
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            placeholder="e.g. I worked at PwC and we built a Power BI dashboard for a client in Toronto. It helped them track their logistics costs and saved them 20% on shipping..."
            className="flex-1 w-full p-4 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-slate-700 resize-none"
          />
          <button
            onClick={handleArchitect}
            disabled={loading || !rawText}
            className="mt-4 w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 transition-all"
          >
            {loading ? <RefreshCw className="animate-spin" /> : <Sparkles size={18} />}
            {loading ? "Architecting..." : "Architect with Gemini"}
          </button>
        </div>
      </div>

      {/* Right: Live Preview Pane */}
      <div className="flex-1 flex flex-col gap-4">
        <div className="bg-slate-900 p-6 rounded-2xl shadow-xl flex-1 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Live Preview
            </label>
            {result && (
              <button 
                onClick={() => navigator.clipboard.writeText(JSON.stringify(result, null, 2))}
                className="text-xs text-blue-400 hover:text-white flex items-center gap-1"
              >
                <Copy size={12} /> Copy JSON
              </button>
            )}
          </div>

          {result ? (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
               <TimelineCard 
                 data={{
                   role: "Preview Output",
                   company: "AI Generated",
                   date: "Today",
                   summary: "Formatting of your raw notes completed successfully.",
                   projects: [result] // Result is now the properly unwrapped project object
                 }}
                 index={0}
                 activeFilter={null}
               />
            </div>
          ) : error ? (
            <div className="h-full flex flex-col items-center justify-center text-red-400 gap-2">
              <AlertCircle size={40} className="opacity-20" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-600 italic">
              <Sparkles size={40} className="mb-4 opacity-10" />
              <p className="text-sm">Enter notes on the left to generate PAR card.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectArchitect;

```
---

## FILE: src/pages/admin/__tests__/ProjectArchitect.test.jsx
```jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import ProjectArchitect from '../ProjectArchitect';
import * as FirebaseLib from '../../../lib/firebase';

// 1. Mock the Firebase Library
vi.mock('../../../lib/firebase', () => ({
  architectProject: vi.fn(),
  auth: {},
  googleProvider: {},
  analytics: {},
  app: {}
}));

// 2. Mock the Complex TimelineCard Component
// âœ… FIX: Path corrected from ../../ to ../../../
vi.mock('../../../components/timeline/TimelineCard', () => ({
  default: ({ data }) => (
    <div data-testid="mock-timeline-card">
      <h2>{data.projects[0].title}</h2>
      <p>{data.projects[0].par.result}</p>
    </div>
  )
}));

// 3. Mock Clipboard API
const mockWriteText = vi.fn();
Object.assign(navigator, {
  clipboard: {
    writeText: mockWriteText,
  },
});

describe('ProjectArchitect (AI Sandbox)', () => {
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const mockSuccessResponse = {
    data: {
      id: "ai_generated_1",
      title: "AI Optimized Title",
      skills: ["Gemini", "React"],
      par: {
        problem: "Manual resumes are slow.",
        action: "Implemented AI agent.",
        result: "Efficiency increased by 100%."
      },
      diagram: "graph TD; A-->B;"
    }
  };

  // --- TEST CASE 1: EMPTY STATE ---
  it('initializes with disabled button and empty instructions', () => {
    render(<ProjectArchitect />);
    
    expect(screen.getByText(/Raw Project Notes/i)).toBeInTheDocument();
    expect(screen.getByText(/Enter notes on the left/i)).toBeInTheDocument();

    const architectBtn = screen.getByRole('button', { name: /Architect with Gemini/i });
    expect(architectBtn).toBeDisabled();
  });

  // --- TEST CASE 2: LOADING STATE ---
  it('shows loading state while AI is thinking', async () => {
    FirebaseLib.architectProject.mockReturnValue(new Promise(() => {}));

    render(<ProjectArchitect />);
    
    const input = screen.getByPlaceholderText(/e.g. I worked at PwC/i);
    fireEvent.change(input, { target: { value: 'I built a cool app.' } });

    const architectBtn = screen.getByRole('button', { name: /Architect with Gemini/i });
    expect(architectBtn).not.toBeDisabled();
    fireEvent.click(architectBtn);

    expect(await screen.findByText(/Architecting.../i)).toBeInTheDocument();
    expect(architectBtn).toBeDisabled();
  });

  // --- TEST CASE 3: SUCCESS STATE ---
  it('renders the mocked TimelineCard upon successful API response', async () => {
    FirebaseLib.architectProject.mockResolvedValue(mockSuccessResponse);

    render(<ProjectArchitect />);
    
    const input = screen.getByPlaceholderText(/e.g. I worked at PwC/i);
    fireEvent.change(input, { target: { value: 'Successfully built AI.' } });
    
    const architectBtn = screen.getByRole('button', { name: /Architect with Gemini/i });
    fireEvent.click(architectBtn);

    await waitFor(() => {
      expect(screen.getByTestId('mock-timeline-card')).toBeInTheDocument();
    });

    expect(screen.getByText('AI Optimized Title')).toBeInTheDocument();
    expect(screen.getByText('Efficiency increased by 100%.')).toBeInTheDocument();
  });

  // --- TEST CASE 4: ERROR STATE ---
  it('displays a user-friendly error if the Cloud Function fails', async () => {
    // Note: We use a string error here to match what the UI might expect if it renders error.message
    FirebaseLib.architectProject.mockRejectedValue(new Error('Quota exceeded'));

    render(<ProjectArchitect />);
    
    const input = screen.getByPlaceholderText(/e.g. I worked at PwC/i);
    fireEvent.change(input, { target: { value: 'This will fail.' } });
    fireEvent.click(screen.getByRole('button', { name: /Architect with Gemini/i }));

    // The UI renders the error message string
    await waitFor(() => {
      expect(screen.getByText(/Quota exceeded/i)).toBeInTheDocument();
    });
  });

  // --- TEST CASE 5: CLIPBOARD INTERACTION ---
  it('copies JSON to clipboard when "Copy JSON" is clicked', async () => {
    FirebaseLib.architectProject.mockResolvedValue(mockSuccessResponse);

    render(<ProjectArchitect />);
    
    const input = screen.getByPlaceholderText(/e.g. I worked at PwC/i);
    fireEvent.change(input, { target: { value: 'Copy this.' } });
    fireEvent.click(screen.getByRole('button', { name: /Architect with Gemini/i }));

    await waitFor(() => {
      expect(screen.getByText('AI Optimized Title')).toBeInTheDocument();
    });

    const copyBtn = screen.getByText(/Copy JSON/i);
    fireEvent.click(copyBtn);

    expect(mockWriteText).toHaveBeenCalledWith(
      JSON.stringify(mockSuccessResponse.data, null, 2)
    );
  });
});

```
---

## FILE: src/sections/ExperienceSection.jsx
```jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X } from 'lucide-react';
import TimelineContainer from '../components/timeline/TimelineContainer';
import { useResumeData } from '../hooks/useResumeData'; // âœ… Import Hook

const ExperienceSection = ({ activeFilter, onClear }) => {
  // âœ… Fetch Data from Context
  const { experience, loading } = useResumeData();

  // If loading, Dashboard skeleton handles the view height, 
  // so we can return null or a simple spinner here to avoid double-skeleton
  if (loading) return null; 

  const filteredData = activeFilter 
    ? experience.filter(job => {
        // Match Job Skills
        const jobMatch = job.skills?.some(skill => 
          skill.toLowerCase().includes(activeFilter.toLowerCase())
        );
        
        // Match Project Skills OR Project Sectors
        const projectMatch = job.projects?.some(proj => 
          proj.skills?.some(skill => 
            skill.toLowerCase().includes(activeFilter.toLowerCase())
          ) || 
          (proj.sector && proj.sector.toLowerCase() === activeFilter.toLowerCase())
        );

        return jobMatch || projectMatch;
      })
    : experience;

  return (
    <section id="experience" className="py-20 bg-slate-900 relative overflow-hidden min-h-[600px] print:bg-white print:text-black print:py-0">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 print:mb-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 print:text-black">
            Professional <span className="text-blue-500 print:text-black">Portfolio</span>
          </h2>
          
          <div className="print:hidden">
            <AnimatePresence mode='wait'>
              {activeFilter ? (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center justify-center gap-3"
                >
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-500/50 rounded-full text-blue-300">
                    <Filter size={16} />
                    <span>Filtering by: <strong>{activeFilter}</strong></span>
                    <button 
                      onClick={onClear}
                      className="ml-2 p-1 hover:bg-blue-500/30 rounded-full transition-colors"
                      aria-label="Clear Filter"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-slate-400 max-w-2xl mx-auto"
                >
                  Explore 15 years of consulting impact across diverse industries. <br/>
                  <span className="text-xs text-slate-500 italic">Filter by technical skill or industry sector above.</span>
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>

        <TimelineContainer experienceData={filteredData} activeFilter={activeFilter} />
        
        {filteredData.length === 0 && (
          <div className="text-center text-slate-500 mt-12 italic">
            No specific engagements found matching "{activeFilter}".
          </div>
        )}
      </div>
    </section>
  );
};

export default ExperienceSection;

```
---

## FILE: src/sections/__tests__/ExperienceSection.test.jsx
```jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ExperienceSection from '../ExperienceSection';

// 1. Mock Framer Motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className }) => <div className={className}>{children}</div>,
    p: ({ children, className }) => <p className={className}>{children}</p>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

// 2. Mock useResumeData Hook with COMPLETE Data Structure
const mockExperienceData = [
  {
    id: "job1",
    role: "Consultant",
    company: "PwC Canada LLP",
    date: "2020",
    summary: "Work stuff",
    skills: ["Power BI", "SQL"],
    projects: [
      { 
        id: "p1", 
        title: "Project A",
        sector: "Public Sector", 
        skills: ["Power BI"],
        // âœ… FIX: Added missing PAR object required by TimelineCard
        par: { 
          problem: "Test problem", 
          action: "Test action", 
          result: "Test result" 
        }
      }
    ]
  },
  {
    id: "job2",
    role: "Dev",
    company: "Biond Consulting",
    date: "2019",
    summary: "Old job",
    skills: ["SSIS"],
    projects: [
      { 
        id: "p2", 
        title: "Project B",
        sector: "Retail", 
        skills: ["SSIS"],
        // âœ… FIX: Added missing PAR object
        par: { 
          problem: "Retail problem", 
          action: "Retail action", 
          result: "Retail result" 
        }
      }
    ]
  }
];

vi.mock('../../hooks/useResumeData', () => ({
  useResumeData: vi.fn(() => ({
    experience: mockExperienceData,
    loading: false
  }))
}));

describe('ExperienceSection Filter Logic', () => {
  it('filters by technical skill (e.g., Power BI)', () => {
    render(<ExperienceSection activeFilter="Power BI" />);
    // PwC project uses Power BI
    expect(screen.getByText(/PwC Canada LLP/i)).toBeDefined();
    // Biond should be filtered out (it has SSIS)
    expect(screen.queryByText(/Biond Consulting/i)).toBeNull();
  });

  it('filters by industry sector (e.g., Public Sector)', () => {
    render(<ExperienceSection activeFilter="Public Sector" />);
    expect(screen.getByText(/PwC Canada LLP/i)).toBeDefined();
    expect(screen.queryByText(/Biond Consulting/i)).toBeNull();
  });

  it('shows empty state for non-matching filters', () => {
    render(<ExperienceSection activeFilter="Rocket Science" />);
    expect(screen.getByText(/No specific engagements found matching/i)).toBeDefined();
  });
});

```
---

## FILE: src/sections/__tests__/ExperienceSectionA11y.test.jsx
```jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ExperienceSection from '../ExperienceSection';

// Mock dependencies
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className }) => <div className={className}>{children}</div>,
    p: ({ children }) => <p>{children}</p>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));
vi.mock('../components/timeline/TimelineContainer', () => ({ default: () => <div>Timeline</div> }));

// Mock the hook to return empty data so the component renders
vi.mock('../../hooks/useResumeData', () => ({
  useResumeData: vi.fn(() => ({
    experience: [],
    loading: false
  }))
}));

describe('ExperienceSection Accessibility', () => {
  it('renders the Clear Filter button with an accessible label', () => {
    // Render with an active filter so the button appears
    render(<ExperienceSection activeFilter="React" />);
    
    // The button has no text, only an Icon. 
    // Screen readers MUST rely on aria-label="Clear Filter".
    // getByLabelText will fail if the aria-label is missing, ensuring we are compliant.
    const clearButton = screen.getByLabelText('Clear Filter');
    
    expect(clearButton).toBeDefined();
    expect(clearButton.tagName).toBe('BUTTON');
  });
});

```
---

## FILE: src/test/setup.js
```js
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest'; // âœ… Extends Vitest's expect

// Runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
});

```
---

## FILE: uat_push.sh
```sh
#!/bin/bash
set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}ğŸš€ Starting UAT Release Process...${NC}"

# 1. Identify Branch
CURRENT_BRANCH=$(git branch --show-current)

# 2. Guardrail: Main Branch Check
if [ "$CURRENT_BRANCH" == "main" ]; then
  echo -e "${RED}âŒ ERROR: You are on 'main'. Please checkout your feature branch first.${NC}"
  exit 1
fi

# 3. Guardrail: Uncommitted Changes Check
if [ -n "$(git status --porcelain)" ]; then
  echo -e "${RED}âš ï¸  You have uncommitted changes!${NC}"
  git status --short
  echo ""
  read -p "Do you want to commit these changes now? (y/n) " -n 1 -r
  echo ""
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    read -p "Enter commit message: " COMMIT_MSG
    git add .
    git commit -m "$COMMIT_MSG"
    echo -e "${GREEN}âœ… Changes committed.${NC}"
  else
    echo -e "${RED}ğŸ›‘ Cannot push without committing. Aborting.${NC}"
    exit 1
  fi
fi

# 4. User Verification
echo -e "\nYou are about to push feature branch: ${GREEN}$CURRENT_BRANCH${NC}"
read -p "Are you sure you want to proceed to UAT? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${RED}ğŸ›‘ Process Aborted.${NC}"
    exit 1
fi

# 5. Push Code
echo -e "\n${YELLOW}ğŸ“¦ Pushing code to origin...${NC}"
git push -u origin "$CURRENT_BRANCH"

# 6. Create Pull Request
echo -e "\n${YELLOW}ğŸ”€ Opening Pull Request...${NC}"
if gh pr view "$CURRENT_BRANCH" >/dev/null 2>&1; then
    echo -e "${GREEN}âœ… PR already exists. Updating...${NC}"
else
    # Create PR and capture the URL
    gh pr create --title "feat: $CURRENT_BRANCH" --fill
fi

# 7. Success
echo -e "\n${GREEN}âœ… UAT Phase Initiated!${NC}"
echo "---------------------------------------------------"
echo -e "ğŸ‘€ View PR Status:"
gh pr view --json url -q .url
echo "---------------------------------------------------"
```
---

## FILE: update_docs.py
```py
import os

# ==========================================
# ğŸ¤– UPGRADE INITIALIZATION PROMPT (v3.0)
# ==========================================

file_path = "docs/PROMPT_INITIALIZATION.md"

new_content = """# ğŸ¤– AI Session Initialization Prompt (v3.0)

**Role:** You are the **Senior Lead Developer & System Architect** for "The Job Whisperer" (v3.2.0).
**System:** React 19 + Vite + Tailwind v4 + Firebase (Firestore/Auth/Functions) + Gemini 2.5 Flash.

**Your Operational Framework (`docs/AI_WORKFLOW.md`):**
You must fluidly switch between these modes as needed:
1.  **The Architect:** Design secure, scalable patterns (ADRs).
2.  **The Builder:** Write complete, production-ready code (No placeholders).
3.  **The Maintainer:** Update documentation (`CHANGELOG`, `PROJECT_STATUS`) after every feature.

**Critical Directives (The "Anti-Drift" Protocols):**
1.  **Ground Truth:** Do NOT assume file paths. If unsure, ask me to run `ls -R src`.
2.  **Complete Deliverables:** Always provide full file contents or complete bash scripts. Never output partial code blocks ("... rest of code").
3.  **Security First:** `firestore.rules` are "Admin Write / Public Read". `applications` collection is "Admin Only".
4.  **Data Integrity:** Use `structuredClone` for snapshots. Firestore is the Single Source of Truth (SSOT).

**Initialization Sequence:**
To begin our session and prevent context drift, please perform the following **Deep Dive Review**:
1.  **Request:** Ask me to paste the current full codebase dump.
2.  **Analyze:** Perform a detailed review of `docs/` (Roadmap, Status, ADRs) and `src/` structure.
3.  **Report:** Output a **"System Health Check"** summarizing:
    * *Current Phase & Sprint* (from PROJECT_STATUS).
    * *Key Architectural Patterns* (from ADRs).
    * *Discrepancies:* Any mismatch between the Docs and the Code.

**Reply ONLY with:** "ğŸš€ System Architect Ready. Please paste the full codebase context to begin the Deep Dive Analysis."
"""

directory = os.path.dirname(file_path)
if not os.path.exists(directory):
    os.makedirs(directory, exist_ok=True)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(new_content.strip())

print(f"âœ… Upgraded {file_path} to v3.0.")
print("ğŸ‘‰ You can now copy the content of this file to start your new chat.")
```
---

## FILE: vite.config.js
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import packageJson from './package.json'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  define: {
    'import.meta.env.PACKAGE_VERSION': JSON.stringify(packageJson.version),
  },
  resolve: {
    alias: {
      react: 'react',
      'react-dom': 'react-dom',
    },
  },
  // âœ… Relaxed Headers for Dev Server
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'unsafe-none',
      'Cross-Origin-Embedder-Policy': 'unsafe-none',
    },
  },
  optimizeDeps: {
    include: ['mermaid', 'framer-motion', 'react', 'react-dom', 'react-router-dom'],
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 1500,
    commonjsOptions: {
      include: [/mermaid/, /node_modules/],
      transformMixedEsModules: true,
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          // 1. Core React + Recharts
          if (id.includes('node_modules/react') || 
              id.includes('node_modules/react-dom') || 
              id.includes('node_modules/react-router-dom') ||
              id.includes('node_modules/scheduler') ||
              id.includes('node_modules/recharts') || 
              id.includes('node_modules/d3')) {
            return 'vendor-react';
          }
          // 2. Firebase
          if (id.includes('node_modules/firebase')) {
            return 'vendor-firebase';
          }
          // 3. Mermaid
          if (id.includes('node_modules/mermaid') || 
              id.includes('node_modules/khroma') || 
              id.includes('node_modules/cytoscape')) {
            return 'vendor-mermaid';
          }
          // 4. Animation
          if (id.includes('node_modules/framer-motion')) {
            return 'vendor-animation';
          }
        },
      },
    },
  },
  pool: 'forks',
  poolOptions: {
    forks: {
      singleFork: true,
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    css: true,
    testTimeout: 10000,
  },
})

```
---

