# Interactive Resume: Platform Context
**Stack:** React 19 + Vite + Tailwind v4 + Firebase + Gemini 3.0
**Environment:** GitHub Codespaces
**Version:** v2.2.0-beta

## 🧠 Coding Standards (The Brain)

### 1. Data & State (SSOT)
* **Public View:** `ResumeContext` is the Single Source of Truth.
* **Hybrid Strategy:** Firestore (Primary) -> JSON (Fallback).
* **Deep Fetch:** We strictly use Recursive Fetching for nested sub-collections (`projects`).

### 2. React 19 Patterns
* **Hooks:** Hooks must strictly follow the rules.
* **Bundling:** We manually chunk `react`, `recharts`, and `react-dom` together in `vite.config.js` to prevent `forwardRef` errors.

### 3. Security & Headers
* **Auth:** Google Identity Services requires relaxed headers (`unsafe-none`) to allow popup communication.
* **Policy:** `Cross-Origin-Opener-Policy: unsafe-none`. This applies to both `firebase.json` (Prod) and `vite.config.js` (Dev).

### 4. AI Isolation
* **Server-Side AI:** Gemini logic resides in `functions/`. Keys are never exposed to the client.


### 5. Async UI Patterns
* **Optimistic vs Real-Time:** For AI operations (which take >3s), we do not await the API response directly in the client. 
* **The Pattern:** 1. UI writes document with `ai_status: 'pending'`.
    2. Cloud Function triggers, processes, and updates to `ai_status: 'complete'`.
    3. UI component uses `onSnapshot` to listen for this status change and reveals the result.

## Directory Structure
* `src/components/admin` -> CMS specific UI.
    * `JobTracker.jsx`: Input for AI Analysis.
* `src/context` -> Data Providers (`ResumeContext`).
* `src/hooks` -> Logic Consumers (`useResumeData`).
* `src/data` -> **Indestructible Fallback** (Do not delete).
* `src/lib` -> Firebase services.
