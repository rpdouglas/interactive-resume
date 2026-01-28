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