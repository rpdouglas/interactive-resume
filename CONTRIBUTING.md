# 👷 Contributing to the Interactive Resume

Welcome to the development guide. This project uses a **Hybrid Cloud** architecture:
* **Frontend:** React 19 + Vite (Local)
* **Backend:** Firebase Cloud Functions (Remote/Serverless)
* **Database:** Cloud Firestore (Remote)

## 1. Getting Started

### Prerequisites
* Node.js v20+
* Firebase CLI (`npm install -g firebase-tools`)
* Java (Required only if running local Emulators)

### Setup
1.  **Clone the repo:**
    ```bash
    git clone [https://github.com/rpdouglas/interactive-resume.git](https://github.com/rpdouglas/interactive-resume.git)
    ```
2.  **Install Dependencies:**
    ```bash
    npm ci
    cd functions && npm ci && cd ..
    ```
3.  **Environment Variables:**
    Create a `.env.local` file in the root. **Do not commit this.**
    ```ini
    VITE_API_KEY=your_firebase_api_key
    VITE_AUTH_DOMAIN=your_project.firebaseapp.com
    VITE_PROJECT_ID=your_project_id
    # ... other firebase config
    ```

## 2. The Development Loop

### A. Frontend Development (UI/UX)
We use Vite for HMR (Hot Module Replacement).
```bash
npm run dev
```
* **Access:** `http://localhost:5173`
* **Auth:** Uses your real Firebase Auth users (Production Data).
* **Data:** Reads from the live Firestore (be careful with writes!).

### B. Backend Development (Cloud Functions)
Functions (Gemini AI triggers) must be deployed to Google Cloud to work reliably with the live database, or run via emulators.

**Option 1: Deploy to Cloud (Easiest)**
```bash
firebase deploy --only functions
```

**Option 2: Local Emulators (Advanced)**
```bash
firebase emulators:start
```

## 3. Branching Strategy
* **`main`**: Production-ready code. Deployed automatically via GitHub Actions.
* **`feature/SprintX.Y`**: Active development.
* **Process:**
    1.  Create Feature Branch.
    2.  Develop & Test (`npm test`).
    3.  Merge to Main -> Triggers Deploy.

## 4. Testing
We use Vitest. Tests **MUST** mock Firebase network calls.
```bash
npm test
```