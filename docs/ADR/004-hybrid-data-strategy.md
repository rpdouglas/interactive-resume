# ADR 004: Hybrid Data Strategy (Indestructible Fallback)

**Date:** 2026-01-28 (Backfilled)
**Status:** Accepted
**Context:** Sprint 16 (The Backbone)

## Context
Relying solely on Firestore introduced risks: Quota limits, Offline scenarios, or Misconfigured Security Rules could cause a "White Screen of Death".

## Decision
We implemented the **"Indestructible Fallback"** pattern.
Our data hooks (`useResumeData`) wrap Firestore calls in a `try/catch` block. If *any* error occurs, we immediately return the static data located in `src/data/*.json`.