# 🗺️ Product Strategy & Roadmap

**Vision:** Transform the platform from a static portfolio into an AI-powered Career Management System (CMS).
**Status:** Living Document
**Last Updated:** 2026-01-27

---

## 🛡️ Phase 18: Fortress & Foundation (Security & Ops)
*Goal: Lock down the application, secure the data, and optimize for production scale.*

* **Sprint 18.1: The Identity Shield (Auth Blocking)**
    * **Objective:** Move from "Client-Side Whitelisting" to "Server-Side Rejection".
    * **Tech:** Firebase Blocking Functions (`beforeUserSignedIn`).
    * **Why:** Prevent unauthorized users from even generating a token.
* **Sprint 18.2: The Data Lockdown (Rules & Indexes)**
    * **Objective:** Finalize strict `firestore.rules`.
    * **Tech:** `request.auth.token.email` enforcement on all Admin collections.
* **Sprint 18.3: The Cost Governor**
    * **Objective:** Prevent API cost runaways.
    * **Tech:** Rate limiting or Daily Budget alerts for Gemini usage.
* **Sprint 18.4: The Performance Polish**
    * **Objective:** Lighthouse Score 90+ on Mobile.
    * **Tech:** Code Splitting (`React.lazy`), Image Optimization, PWA capabilities.

---

## 🏭 Phase 19: The Content Factory (Generative Action)
*Goal: Stop writing boilerplate. Let the AI generate high-quality tailored documents.*

* **Sprint 19.1: The Cover Letter Engine**
    * **Feature:** One-click PDF generation based on Resume + JD.
    * **Tech:** Gemini Prompting + `react-to-print`.
* **Sprint 19.2: The Outreach Bot**
    * **Feature:** Generate cold-outreach messages (LinkedIn/Email) tailored to the Hiring Manager.
    * **Tech:** Clipboard API + Tone analysis.
* **Sprint 19.3: The Resume Tailor**
    * **Feature:** AI suggestions for rewriting specific bullet points to match JD keywords.

---

## ♟️ Phase 20: The Strategist (Workflow & Prep)
*Goal: Manage the campaign lifecycle and win the interview.*

* **Sprint 20.1: The Application Kanban**
    * **Feature:** Drag-and-drop board to track status (Applied, Interview, Offer).
    * **Tech:** `dnd-kit` or `react-beautiful-dnd`.
* **Sprint 20.2: The Interview Simulator**
    * **Feature:** AI acts as the interviewer, asking technical questions based on the JD.
    * **Tech:** Text-to-Speech API + Speech-to-Text.

