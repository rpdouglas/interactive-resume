# 🗺️ Product Strategy & Roadmap

**Vision:** Transform the platform from a static portfolio into an AI-powered Career Management System (CMS).
**Status:** Active Development
**Last Updated:** 2026-01-28

---

## 🏭 Phase 19: The Content Factory (Current Focus)
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

## ♟️ Phase 20: The Strategist (Workflow)
*Goal: Manage the campaign lifecycle and win the interview.*

* **Sprint 20.1: The Application Kanban**
    * **Feature:** Drag-and-drop board to track status (Applied, Interview, Offer).
    * **Tech:** `dnd-kit`.
* **Sprint 20.2: The Interview Simulator**
    * **Feature:** AI acts as the interviewer, asking technical questions based on the JD.
    * **Tech:** Browser Speech API.

---

## 🛡️ Phase 21: Fortress & Foundation (Security)
*Goal: Lock down the application before public release.*

* **Sprint 21.1: The Identity Shield**
    * **Objective:** Server-Side Auth Blocking (Fix IAM Permissions).
* **Sprint 21.2: The Data Lockdown**
    * **Objective:** Strict `firestore.rules`.
* **Sprint 21.3: Cost Governor**
    * **Objective:** API Rate Limiting.

