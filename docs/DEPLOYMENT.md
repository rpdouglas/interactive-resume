# ☁️ Deployment & Infrastructure Manual

## 1. Environment Variables (Required)
The following secrets must be present in GitHub Actions and `.env`:
| Key | Description |
| :--- | :--- |
| `VITE_API_KEY` | Firebase Web API Key |
| `VITE_AUTH_DOMAIN` | Firebase Project Auth Domain |
| `VITE_PROJECT_ID` | Firebase Project ID |
| `VITE_ADMIN_EMAIL` | Whitelisted email authorized for /admin access |

## 2. CI/CD Pipeline
Standard Firebase Hosting workflow via GitHub Actions.
**Note:** Ensure `VITE_ADMIN_EMAIL` is added to the GitHub Repository Secrets.