# ☁️ Deployment & Infrastructure Manual

## 1. The Pipeline
We use a **GitHub Actions** workflow to automate deployments to Firebase Hosting.

| Environment | Trigger | URL | Status |
| :--- | :--- | :--- | :--- |
| **Production** | Push to `main` | `ryandouglas-resume.web.app` | Live |
| **Preview** | Open Pull Request | (Generated in PR Comment) | Ephemeral |

## 2. Secrets Management
* `FIREBASE_SERVICE_ACCOUNT`
* `FIREBASE_PROJECT_ID`
* `VITE_*` (Env Vars)

## 3. Manual Deployment
```bash
npm run build
npx firebase deploy
```