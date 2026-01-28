# ☁️ Deployment & Infrastructure Manual

**Environment:** GitHub Codespaces (Cloud) & Firebase Hosting
**Stack:** Vite + React 19 + Tailwind v4

## 1. Secrets Management (The 2-File System)
Since Codespaces is ephemeral and we cannot commit real API keys, we use a split strategy:

### A. Development (`.env.local`)
* **Purpose:** Runs `npm run dev`. Connects to the **Live Firebase Project**.
* **Status:** Ignored by Git.
* **Action:** You must manually create this file in the root of your Codespace using your real keys from the Firebase Console.

### B. Testing (`.env.test`)
* **Purpose:** Runs `npm run test`. Used by Vitest.
* **Status:** Committed to Git.
* **Values:** Contains "Dummy" strings (e.g., `VITE_API_KEY=TEST_KEY`) to prevent the Firebase SDK from crashing during initialization. **Never put real keys here.**

## 2. CLI Authentication (Headless Mode)
In Codespaces, you cannot open a browser window for `firebase login`. You must use the `--no-localhost` flag.

```bash
# 1. Request login link
firebase login --no-localhost

# 2. Open the URL provided in a separate tab.
# 3. Authenticate with Google.
# 4. Copy the Authorization Code.
# 5. Paste code back into the terminal.
```

## 3. Database Security
Rules: Defined in firestore.rules.

Deploy: firebase deploy --only firestore:rules

## 4. Header Policy (Critical)
To support Google Auth Popups in this environment, we MUST serve specific headers in firebase.json (Production) and vite.config.js (Development):

Cross-Origin-Opener-Policy: unsafe-none

Cross-Origin-Embedder-Policy: unsafe-none

Why? Strict isolation blocks the popup from communicating "Login Success" back to the main window. 

## 5. Cloud Functions (Gen 2) Setup
When deploying Gen 2 functions (`onDocumentWritten`) for the first time, you must initialize the Eventarc identity manually:
```bash
gcloud beta services identity create --service=eventarc.googleapis.com --project=YOUR_PROJECT_ID
```
*Note: If this fails in Codespaces, run it in the Google Cloud Console Shell.*


## 6. Gen 2 Cloud Functions Quirk
When deploying Gen 2 functions for the first time, you may see an `Error generating service identity`. This is a known timeout issue. **Wait 2 minutes and retry the deploy.** It usually succeeds on the second attempt.