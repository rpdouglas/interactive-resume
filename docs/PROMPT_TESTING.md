# 🧪 AI Testing Prompt (The QA Engineer)

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
1.  **Environment Mocking (CRITICAL):**
    * The Firebase SDK will crash instantly if `VITE_API_KEY` is undefined.
    * **Rule:** If the component touches Firebase (Auth/Firestore), you MUST verify that `vi.stubEnv` or a mock `.env.test` is loaded in the test setup.
    * *Tip:* Mock the `firebase/auth` and `firebase/firestore` modules entirely to avoid network calls.
    * **Path Verification:** When mocking modules with `vi.mock`, strictly verify the directory depth of relative imports (e.g., `../../../lib/db` vs `../../lib/db`). Mismatched paths cause silent failures.
    * **Stubbing:** Use `vi.stubEnv` for ALL environment variables
    * **Defensive Rendering:** UI components consuming Cloud Function data MUST use optional chaining (`?.`) or default values. The data structure returned by the SDK often wraps the result in `data`, leading to `response.data.data`.
    * **Secret Binding:** When testing Cloud Functions, ensure `secrets` are whitelisted in the function definition object (`{ secrets: ["KEY_NAME"] }`).
 in Firebase tests to prevent SDK crashes.

2.  **Testing Strategy:**
    * **Happy Path:** Does it render data correctly?
    * **Loading State:** Is the Skeleton visible? (Never use raw text "Loading...").
    * **Error State:** Does it degrade gracefully to the Fallback JSON?
3.  **Imports:** Use `@testing-library/react` for `render`, `screen`, and `fireEvent`.

**Output Requirements:**
* A complete `.test.jsx` file.
* **Do not** reference real database paths. Use mocks.

**Wait:** Ask me to paste the Component Code to begin.
