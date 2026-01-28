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
