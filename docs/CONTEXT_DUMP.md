# The Job Whisperer: Platform Context
**Stack:** React 19 + Vite + Tailwind v4 + Firebase + Gemini 2.5
**Version:** 3.2.0-beta
**Branding:** "The Job Whisperer"

## 🧠 Coding Standards (The Brain)

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