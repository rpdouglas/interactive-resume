import os

# We use a variable for backticks to prevent syntax errors
fence = "```"

content = f"""# Interactive Resume: Platform Context
**Stack:** React 19 + Vite + Tailwind v4 + Firebase + Gemini 3.0
**Environment:** GitHub Codespaces
**Version:** v2.2.0-beta

## 🧠 Coding Standards (The Brain)

### 1. Data & State (SSOT)
* **Public View:** `ResumeContext` is the Single Source of Truth.
* **Hybrid Strategy:** Firestore (Primary) -> JSON (Fallback).
* **Deep Fetch:** We strictly use Recursive Fetching for nested sub-collections (`projects`).

### 2. React 19 Patterns
* **Hooks:** Hooks must strictly follow the rules.
* **Bundling:** We manually chunk `react`, `recharts`, and `react-dom` together in `vite.config.js` to prevent `forwardRef` errors.

### 3. Security & Headers
* **Auth:** Google Identity Services requires relaxed headers (`unsafe-none`) to allow popup communication.
* **Policy:** `Cross-Origin-Opener-Policy: unsafe-none`. This applies to both `firebase.json` (Prod) and `vite.config.js` (Dev).

### 4. AI Isolation
* **Server-Side AI:** Gemini logic resides in `functions/`. Keys are never exposed to the client.

## Directory Structure
* `src/components/admin` -> CMS specific UI.
* `src/context` -> Data Providers (`ResumeContext`).
* `src/hooks` -> Logic Consumers (`useResumeData`).
* `src/data` -> **Indestructible Fallback** (Do not delete).
* `src/lib` -> Firebase services.
"""

# Ensure directory exists
os.makedirs('docs', exist_ok=True)

# Write the file
with open('docs/CONTEXT_DUMP.md', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Successfully updated docs/CONTEXT_DUMP.md")