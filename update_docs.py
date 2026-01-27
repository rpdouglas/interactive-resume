import os
import datetime
import re

# ==========================================
# 📝 SPRINT 17.2: DOCUMENTATION AUDIT
# ==========================================

def read_file(path):
    if os.path.exists(path):
        with open(path, 'r', encoding='utf-8') as f:
            return f.read()
    return ""

def write_file(path, content):
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"✅ Updated: {path}")

# 1. Update PROJECT_STATUS.md
# ------------------------------------------
status_path = 'docs/PROJECT_STATUS.md'
status_content = read_file(status_path)

if "[ ] Sprint 17.2: Vector Matching Logic" in status_content:
    status_content = status_content.replace(
        "[ ] Sprint 17.2: Vector Matching Logic (Gemini).",
        "[x] Sprint 17.2: Vector Matching Engine (Gemini 2.5 Flash)."
    )
    status_content = status_content.replace(
        "Phase 17 - Application Manager",
        "Phase 17 - Application Manager (Backend Complete)"
    )

write_file(status_path, status_content)

# 2. Update CHANGELOG.md
# ------------------------------------------
changelog_path = 'docs/CHANGELOG.md'
changelog_content = read_file(changelog_path)
today = datetime.date.today().strftime("%Y-%m-%d")

new_entry = f"""## [v2.4.0-beta] - {today}
### Added
- **Backend:** `analyzeApplication` Firestore Trigger (Gemini 2.5 Flash) for resume-to-JD analysis.
- **Backend:** Restored and hardened `architectProject` (Gemini 3.0 Preview) for Resume Building.
- **Security:** Migrated API Keys to Google Secret Manager.
- **UI:** Hardened `TimelineCard` to handle undefined data structures gracefully.

### Fixed
- **Functions:** Fixed "Service Identity" error for Eventarc triggers.
- **UI:** Resolved "Double Wrapper" issue where Cloud Function responses were nested `data.data`.

"""

if "## [v" in changelog_content:
    parts = changelog_content.split("## [v", 1)
    new_changelog = parts[0] + new_entry + "## [v" + parts[1]
else:
    new_changelog = "# 📜 Changelog\n\n" + new_entry + changelog_content

write_file(changelog_path, new_changelog)

# 3. Update CONTEXT_DUMP.md (Architecture Update)
# ------------------------------------------
context_path = 'docs/CONTEXT_DUMP.md'
context_content = read_file(context_path)

if "analyzeApplication" not in context_content:
    # Update AI Isolation section
    ai_section = "### 4. AI Isolation"
    new_ai_note = """### 4. AI Isolation
* **Server-Side AI:** Gemini logic resides in `functions/index.js`.
    * `architectProject`: Callable (Gemini 3.0) for UI generation.
    * `analyzeApplication`: Trigger (Gemini 2.5) for background processing.
* **Secrets:** Keys are accessed via `process.env.GOOGLE_API_KEY` injected by Secret Manager."""
    
    if ai_section in context_content:
        # Regex to replace the old section until the next header
        context_content = re.sub(r'### 4\. AI Isolation.*?(?=## Directory)', new_ai_note + "\n\n", context_content, flags=re.DOTALL)
        write_file(context_path, context_content)

# 4. Update DEPLOYMENT.md (Critical Gcloud Step)
# ------------------------------------------
deploy_path = 'docs/DEPLOYMENT.md'
deploy_content = read_file(deploy_path)

if "Eventarc" not in deploy_content:
    new_deploy_step = """
## 5. Cloud Functions (Gen 2) Setup
When deploying Gen 2 functions (`onDocumentWritten`) for the first time, you must initialize the Eventarc identity manually:
```bash
gcloud beta services identity create --service=eventarc.googleapis.com --project=YOUR_PROJECT_ID
```
*Note: If this fails in Codespaces, run it in the Google Cloud Console Shell.*
"""
    deploy_content = deploy_content + new_deploy_step
    write_file(deploy_path, deploy_content)

# 5. Update PROMPT_TESTING.md (Process Constraints)
# ------------------------------------------
testing_path = 'docs/PROMPT_TESTING.md'
testing_content = read_file(testing_path)

if "Double Wrapping" not in testing_content:
    new_constraints = """
    * **Defensive Rendering:** UI components consuming Cloud Function data MUST use optional chaining (`?.`) or default values. The data structure returned by the SDK often wraps the result in `data`, leading to `response.data.data`.
    * **Secret Binding:** When testing Cloud Functions, ensure `secrets` are whitelisted in the function definition object (`{ secrets: ["KEY_NAME"] }`).
"""
    # Append to Rule 1
    marker = "* **Stubbing:** Use `vi.stubEnv` for ALL environment variables"
    if marker in testing_content:
        testing_content = testing_content.replace(marker, marker + new_constraints)
        write_file(testing_path, testing_content)

print("\n🎉 Documentation Audit Complete. Ready for Commit.")