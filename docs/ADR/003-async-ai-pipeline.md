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