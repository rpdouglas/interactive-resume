# ADR 001: Resume Tailor Data Strategy (Delta Patching)

**Date:** 2026-01-28
**Status:** Accepted
**Context:** Sprint 19.3

## Context
We needed a way to tailor the candidate's resume for specific Job Descriptions (JDs) to increase ATS matching scores.
The "Master Resume" is stored in Firestore (`experience` collection). We faced a choice on how to persist these customizations.

## The Options Considered
1.  **Shadow Resume:** Deep clone the entire resume tree for every application.
    * *Pros:* Complete isolation.
    * *Cons:* Massive data duplication, high storage costs, complex sync if Master changes.
2.  **Ephemeral:** Generate on-the-fly in memory.
    * *Pros:* Zero storage cost.
    * *Cons:* Expensive API costs (re-generating on every page load), poor UX (waiting).
3.  **Delta Patching (Selected):** Store only the specific bullet points that changed.

## Decision
We chose **Option 3: Delta Patching**.
We store an array of `tailored_bullets` inside the `application` document. The UI renders the Master Resume, but "swaps" specific bullets with their tailored versions at runtime (or displays them side-by-side in Diff View).

## Consequences
* **Positive:** Minimal storage footprint. Preserves the "Single Source of Truth" (Master Resume).
* **Negative:** Requires client-side logic to merge/display the diffs.
* **Guardrails:** We explicitly prompt the AI to *not* invent facts, only rephrase existing ones ("The Ethical Editor" protocol).