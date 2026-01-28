import os

# ==========================================
# 🏛️ FULL DOCUMENTATION RESTORATION
# ==========================================

def write_file(path, content):
    directory = os.path.dirname(path)
    if directory and not os.path.exists(directory):
        os.makedirs(directory, exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content.strip())
    print(f"✅ Restored: {path}")

def append_if_missing(path, search_text, append_text, insert_after=None):
    if not os.path.exists(path): return
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
    
    if search_text not in content:
        if insert_after and insert_after in content:
            content = content.replace(insert_after, insert_after + append_text)
            with open(path, "w", encoding="utf-8") as f:
                f.write(content)
            print(f"✅ Updated: {path}")
        else:
            print(f"⚠️ Could not find insertion point in {path}")
    else:
        print(f"✅ Verified: {path}")

# ------------------------------------------------------------------
# 1. Restore Missing ADRs (003 - 006)
# ------------------------------------------------------------------

adr_003 = """
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
"""

adr_004 = """
# ADR 004: Hybrid Data Strategy (Indestructible Fallback)

**Date:** 2026-01-28 (Backfilled)
**Status:** Accepted
**Context:** Sprint 16 (The Backbone)

## Context
Relying solely on Firestore introduced risks: Quota limits, Offline scenarios, or Misconfigured Security Rules could cause a "White Screen of Death".

## Decision
We implemented the **"Indestructible Fallback"** pattern.
Our data hooks (`useResumeData`) wrap Firestore calls in a `try/catch` block. If *any* error occurs, we immediately return the static data located in `src/data/*.json`.
"""

adr_005 = """
# ADR 005: Deep Fetch (Recursive Hydration)

**Date:** 2026-01-28 (Backfilled)
**Status:** Accepted
**Context:** Sprint 16 (The Backbone)

## Context
Firestore queries are **shallow**. Fetching a `Job` document does *not* fetch its `Projects` sub-collection.

## Decision
We chose **Recursive Client-Side Joining**.
Our data fetcher retrieves the parent collection (`experience`), maps over the results, and triggers a `Promise.all` to fetch the `projects` sub-collection for each job.
"""

adr_006 = """
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
"""

write_file("docs/ADR/003-async-ai-pipeline.md", adr_003)
write_file("docs/ADR/004-hybrid-data-strategy.md", adr_004)
write_file("docs/ADR/005-deep-fetch-pattern.md", adr_005)
write_file("docs/ADR/006-security-perimeter.md", adr_006)

# ------------------------------------------------------------------
# 2. Sync Sprint 19.4 Status & Roadmap
# ------------------------------------------------------------------

# Update PROJECT_STATUS.md
status_entry = "\n* [ ] **Sprint 19.4:** The Version Controller (Snapshot & Print)."
append_if_missing(
    "docs/PROJECT_STATUS.md", 
    "Sprint 19.4", 
    status_entry, 
    insert_after="* [x] **Sprint 19.3:** The Resume Tailor (Diff Engine)."
)

# Update ROADMAP.md
roadmap_entry = """
* **Sprint 19.4: The Version Controller (Snapshot Engine)**
    * **Feature:** "Freeze" a specific tailored resume version into an immutable record.
    * **Feature:** Dedicated Print Preview route.
    * **Tech:** Firestore (JSON Storage) + Print CSS."""
append_if_missing(
    "docs/ROADMAP.md", 
    "Sprint 19.4", 
    roadmap_entry, 
    insert_after="match JD keywords."
)

print("\n🎉 All Documentation (ADRs + Roadmap) Restored.")