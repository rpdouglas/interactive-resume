# Interactive Resume: Platform Context
**Stack:** React 19 + Vite + Tailwind v4 + Firebase + Gemini 3.0
**Version:** v2.1.0-beta

## 🧠 Coding Standards (The Brain)

### 1. React 19 Patterns
* **No Manual Memoization:** Do NOT use `useMemo` or `useCallback` unless specifically profiling a performance bottleneck. Rely on the React Compiler (future-proof).
* **Hooks:** Hooks must strictly follow the rules. `vite.config.js` is patched to bundle React as a singleton to prevent "Invalid Hook Call" errors.
* **Data Fetching:** Transitioning to `Suspense` and `lazy` loading. Avoid "Waterfall" fetching in `useEffect`.

### 2. Tailwind v4 Architecture
* **CSS-First:** Theme configuration lives in `src/index.css` via CSS variables (`--color-brand-accent`), NOT `tailwind.config.js`.
* **Responsive:** Mobile-First. Always write `p-4 md:p-6`, never `p-6 sm:p-4`.
* **Layout:** Use `min-w-0` on Flex/Grid children to prevent `Recharts` layout blowouts.

### 3. Data & State
* **SSOT:** Firestore is the Single Source of Truth for Admin.
* **Hook:** `useResumeData` (Phase 16.2) will govern all data access.
* **Mutations:** Never write to Firestore from UI components. Use the `DataSeeder` or designated Admin hooks.

### 4. AI Isolation
* **Server-Side AI:** All calls to Gemini 3.0 via the Google AI SDK must occur in **Cloud Functions** (`functions/`).
* **Client:** The client only sends `rawText` or `jobDescription` to the function and renders the result.

## Directory Structure
* `src/components/admin` -> CMS specific UI.
* `src/data` -> Legacy JSON (Deprecated).
* `src/lib` -> Firebase services (`db.js`, `firebase.js`).
