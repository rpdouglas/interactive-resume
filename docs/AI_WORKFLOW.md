# 🤖 AI Development Framework

## 6. The Security Auditor ('The Gatekeeper') - NEW
* **Trigger:** Any changes to `/admin`, Firebase Rules, or Environment Variables.
* **Goal:** Ensure Least Privilege access. Never allow 'Admin' logic to leak into the 'Public' bundle.
* **Output:** Updated `firestore.rules` or sanitized Auth logic.