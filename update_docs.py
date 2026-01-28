import os

def read_file(path):
    if os.path.exists(path):
        with open(path, 'r', encoding='utf-8') as f:
            return f.read()
    return ""

def write_file(path, content):
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"✅ Updated: {path}")

# 1. Update PROJECT_STATUS.md
# ---------------------------
status_path = 'docs/PROJECT_STATUS.md'
status_content = """# 🟢 Project Status: Platform Expansion

> 🗺️ **Strategy:** See [docs/ROADMAP.md](./ROADMAP.md) for the long-term vision.

**Current Phase:** Phase 19 - The Content Factory
**Version:** v3.0.0-dev
**Status:** 🚀 Sprint 19.1 Starting

## 🎯 Current Objectives
* [ ] Sprint 19.1: The Cover Letter Engine (Generative AI).
* [ ] Sprint 19.2: The Outreach Bot.
* [ ] Sprint 19.3: The Resume Tailor.

## ⏳ Backlog (Deferred)
* Phase 20: The Strategist (Kanban & Prep).
* Phase 21: Security Hardening (The Identity Shield).

## ✅ Completed Roadmap
* **Phase 17:** [x] Application Manager Complete.
    * Sprint 17.1: Input Interface.
    * Sprint 17.2: Vector Engine.
    * Sprint 17.3: Analysis Dashboard (Real-time UI).
* **Phase 16:** [x] The Backbone Shift (Firestore Migration).
* **Phase 15:** [x] Chart Stabilization.
* **v1.0.0:** [x] Gold Master Release.
"""

write_file(status_path, status_content)

# 2. Update ROADMAP.md
# --------------------
roadmap_path = 'docs/ROADMAP.md'
roadmap_content = """# 🗺️ Product Strategy & Roadmap

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

"""

write_file(roadmap_path, roadmap_content)