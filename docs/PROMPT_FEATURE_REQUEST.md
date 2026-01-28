# 📝 AI Feature Request Prompt (Architect Mode v2.0)

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

1.  **👥 The Persona Check (Select Relevant):**
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

**🛑 STOP & THINK: Architectural Options**
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
