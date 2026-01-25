# ☁️ Deployment & Infrastructure Manual

## 1. Environment Variables (Required)
The following secrets must be present in GitHub Actions and `.env`:
| Key | Description |
| :--- | :--- |
| `VITE_API_KEY` | Firebase Web API Key |
| `VITE_AUTH_DOMAIN` | Firebase Project Auth Domain |
| `VITE_PROJECT_ID` | Firebase Project ID |
| `VITE_ADMIN_EMAIL` | Whitelisted email authorized for /admin access |

## 2. Database Management
### Deploying Rules
Security rules are defined in `firestore.rules`.
```bash
firebase deploy --only firestore:rules
```

### Deploying Indexes
Indexes are defined in `firestore.indexes.json`.
```bash
firebase deploy --only firestore:indexes
```

## 3. CI/CD Pipeline
Standard Firebase Hosting workflow via GitHub Actions.
