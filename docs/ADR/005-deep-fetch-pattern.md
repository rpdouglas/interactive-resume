# ADR 005: Deep Fetch (Recursive Hydration)

**Date:** 2026-01-28 (Backfilled)
**Status:** Accepted
**Context:** Sprint 16 (The Backbone)

## Context
Firestore queries are **shallow**. Fetching a `Job` document does *not* fetch its `Projects` sub-collection.

## Decision
We chose **Recursive Client-Side Joining**.
Our data fetcher retrieves the parent collection (`experience`), maps over the results, and triggers a `Promise.all` to fetch the `projects` sub-collection for each job.