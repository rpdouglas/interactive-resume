# 🛡️ Security Model & Access Control

**Auth Provider:** Firebase Authentication (Google OAuth)
**Strategy:** Zero Trust Client / Strict Server-Side Rules

## 1. Authentication Layer
### The Whitelist Gate
* **Location:** Client-Side (`src/context/AuthContext.jsx`) & Server-Side (`firestore.rules`).
* **Mechanism:**
  1. User signs in via Google.
  2. App checks `user.email` against `import.meta.env.VITE_ADMIN_EMAIL`.
  3. If no match, the user is signed out immediately or redirected to Public View.

## 2. Authorization (Firestore Rules)
We utilize a **"Public Read / Admin Write"** policy.

| Collection | Read Permission | Write Permission |
| :--- | :--- | :--- |
| `profile` | 🌍 Public | 🔐 Auth Only |
| `skills` | 🌍 Public | 🔐 Auth Only |
| `experience` | 🌍 Public | 🔐 Auth Only |
| `projects` | 🌍 Public | 🔐 Auth Only |

**Current Rule Implementation:**
```javascript
allow read: if true;
allow write: if request.auth != null; // Relies on UI Whitelisting for now
```
> ⚠️ **Note:** In Phase 17, we will upgrade the Write rule to strictly check `request.auth.token.email == 'YOUR_EMAIL'` for backend-level enforcement.

## 3. API Key Exposure Strategy
It is standard practice to expose the `VITE_API_KEY` in the frontend bundle. This key **does not** grant administrative access. It simply identifies the Firebase project.

**Defense in Depth:**
1. **Security Rules:** Prevent unauthorized writes even if someone steals the API Key.
2. **App Check:** (Planned Phase 18) Verify traffic comes from your specific domain.
3. **Cloud Functions:** Sensitive AI logic (Gemini) runs on the server, keeping the LLM API Key strictly hidden from the browser.

## 4. Header Security (COOP/COEP)
To support high-performance `SharedArrayBuffer` (potential future use) and Google Identity Services, we enforce:
* `Cross-Origin-Opener-Policy: same-origin-allow-popups`
* `Cross-Origin-Embedder-Policy: unsafe-none`
