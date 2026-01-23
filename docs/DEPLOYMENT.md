# ☁️ Deployment & Infrastructure Manual

## 1. The Pipeline
We use a **GitHub Actions** workflow to automate deployments to Firebase Hosting.

| Environment | Trigger | URL | Status |
| :--- | :--- | :--- | :--- |
| **Production** | Push to `main` | `ryandouglas-resume.web.app` | Live |
| **Preview** | Open Pull Request | (Generated in PR Comment) | Ephemeral |

## 2. Secrets Management
The pipeline relies on the following **GitHub Repository Secrets**:

* `FIREBASE_SERVICE_ACCOUNT`: The JSON Private Key for the Firebase Service Account.
* `FIREBASE_PROJECT_ID`: `ryandouglas-resume`
* `VITE_*`: All environment variables defined in `.env`.

## 3. Manual Deployment (Fallback)
If GitHub Actions is down, you can deploy manually from your local machine:

```bash
# 1. Build the project
npm run build

# 2. Login to Firebase (One time)
npx firebase login

# 3. Deploy
npx firebase deploy
```

## 4. Local Development
* **Start Server:** `npm run dev`
* **Run Tests:** `npm run test`