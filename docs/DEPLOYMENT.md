# ☁️ Production Deployment & Infrastructure

**Environment:** Firebase Hosting & Cloud Functions (Gen 2)
**CI/CD:** GitHub Actions

## 1. Automated Deployment (CI/CD)
We utilize two primary workflows:

### A. Preview Channels (Pull Requests)
* **Trigger:** Open/Update PR.
* **Action:** Builds the app and deploys to a temporary URL (e.g., `pr-123--ryandouglas-resume.web.app`).
* **Secrets:** Uses `GITHUB_TOKEN` and `FIREBASE_SERVICE_ACCOUNT`.

### B. Production Channel (Merge to Main)
* **Trigger:** Push to `main`.
* **Action:** Deploys to the live URL.
* **Purge:** Clears CDN cache.

## 2. Manual Deployment (CLI)
If CI/CD fails, you can manually deploy from a local terminal.

**Full Deploy:**
```bash
npm run build
firebase deploy
```

**Partial Deploy (Functions Only):**
*Use this when updating AI prompts to avoid rebuilding the frontend.*
```bash
firebase deploy --only functions
```

**Partial Deploy (Rules Only):**
```bash
firebase deploy --only firestore:rules
```

## 3. Infrastructure & Secrets

### Cloud Functions Secrets (Gen 2)
We use Google Cloud Secret Manager. DO NOT put API keys in `.env` files for Functions.

**Setting a Secret:**
```bash
firebase functions:secrets:set GOOGLE_API_KEY
```

**Accessing in Code:**
```javascript
const { onCall } = require("firebase-functions/v2/https");
exports.myFunc = onCall({ secrets: ["GOOGLE_API_KEY"] }, (req) => { ... });
```

### Security Headers
To support Google Identity Services and potential SharedArrayBuffer usage, `firebase.json` enforces:
* `Cross-Origin-Opener-Policy: unsafe-none`
* `Cross-Origin-Embedder-Policy: unsafe-none`

## 4. Database Security
* **Rules:** Defined in `firestore.rules`.
* **Policy:** Public Read (Resume Data) / Admin Write Only.
* **Lockdown:** `applications` collection is strictly Admin Read/Write.