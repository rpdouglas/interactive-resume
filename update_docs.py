import os
import json
import re
from datetime import datetime

def read_file(path):
    if not os.path.exists(path):
        print(f"⚠️ File not found: {path}")
        return None
    with open(path, 'r', encoding='utf-8') as f:
        return f.read()

def write_file(path, content):
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"✅ Updated: {path}")

def update_project_status():
    path = 'docs/PROJECT_STATUS.md'
    content = read_file(path)
    if not content: return

    # Update Version and Phase
    content = re.sub(r'Version: .*', 'Version: v3.1.0-beta', content)
    content = re.sub(r'Current Phase: .*', 'Current Phase: Phase 19 - The Content Factory (Active)', content)
    content = re.sub(r'Status: .*', 'Status: 🟢 Sprint 19.2 Complete', content)

    # Mark Sprints as Complete
    content = content.replace('* [ ] Sprint 19.1:', '* [x] Sprint 19.1:')
    content = content.replace('* [ ] Sprint 19.2:', '* [x] Sprint 19.2:')

    write_file(path, content)

def update_changelog():
    path = 'docs/CHANGELOG.md'
    content = read_file(path)
    if not content: return

    today = datetime.now().strftime('%Y-%m-%d')
    new_entry = f"""## [v3.1.0-beta] - {today}
### Added
- **AI:** "Cover Letter Engine" (Cloud Function) using Gemini 2.5 Flash.
- **UI:** Structured "Gap Analysis" rendering (Yellow Warning Cards).
- **Export:** PDF generation via `react-to-print`.
### Changed
- **UX:** Restored "Thinking Brain" animation during analysis.
- **Architecture:** Moved all AI logic to Server-Side Cloud Functions for security.

"""
    # Insert after the header description
    if "## [v" in content:
        content = re.sub(r'(## \[v)', new_entry + r'\1', content, count=1)
    else:
        # Fallback if no previous versions
        content += "\n" + new_entry

    write_file(path, content)

def update_package_json():
    path = 'package.json'
    content = read_file(path)
    if not content: return

    try:
        data = json.loads(content)
        data['version'] = '3.1.0'
        write_file(path, json.dumps(data, indent=2))
    except json.JSONDecodeError:
        print("❌ Failed to parse package.json")

def update_context_dump():
    path = 'docs/CONTEXT_DUMP.md'
    content = read_file(path)
    if not content: return

    # Update Tech Stack Version
    content = re.sub(r'Version: .*', 'Version: v3.1.0-beta', content)

    # Update Backend Context
    if "AI Isolation" in content:
        new_backend_desc = """### 4. AI Isolation (Server-Side)
* **Logic:** All AI operations reside in `functions/index.js`.
    * `architectProject`: Callable (Gemini 3.0) for Resume Building.
    * `analyzeApplication`: Trigger (Gemini 2.5) for Job Analysis.
    * `generateCoverLetter`: Trigger (Gemini 2.5) for Content Generation.
* **Secrets:** Keys are accessed via `process.env.GOOGLE_API_KEY`."""
        
        # Regex to replace the old AI Isolation block
        content = re.sub(r'### 4\. AI Isolation.*?(\n\n|#)', new_backend_desc + r'\1', content, flags=re.DOTALL)

    write_file(path, content)

def update_schema_architecture():
    path = 'docs/SCHEMA_ARCHITECTURE.md'
    content = read_file(path)
    if not content: return

    new_schema_note = """
## 4. Application Schema (Phase 19)
The `applications` collection is the core of the Content Factory.
* **Document ID:** Auto-generated.
* **Fields:**
    * `company` (string)
    * `role` (string)
    * `raw_text` (string) - Original JD.
    * `ai_status` (string) - 'pending' | 'processing' | 'complete' | 'error'
    * `match_score` (number)
    * `gap_analysis` (array<string>) - Structured list of missing skills.
    * `cover_letter_status` (string) - 'idle' | 'pending' | 'writing' | 'complete'
    * `cover_letter_text` (string) - Markdown/Text content.
"""
    if "## 4. Application Schema" not in content:
        content += new_schema_note
    
    write_file(path, content)

def update_roadmap():
    path = 'docs/ROADMAP.md'
    content = read_file(path)
    if not content: return

    # Ensure Phase 18 is moved to 21 (if not already done by previous edits)
    if "Phase 18: Fortress" in content:
        content = content.replace("Phase 18: Fortress", "Phase 21: Fortress")
        content = content.replace("Sprint 18.1", "Sprint 21.1")
        content = content.replace("Sprint 18.2", "Sprint 21.2")
        content = content.replace("Sprint 18.3", "Sprint 21.3")

    write_file(path, content)

def update_prompt_testing():
    path = 'docs/PROMPT_TESTING.md'
    content = read_file(path)
    if not content: return

    constraint = "    * **Firestore Mocking:** When mocking `firebase/firestore`, you MUST mock `getFirestore` specifically, or the SDK will crash."
    
    if "getFirestore" not in content:
        content = content.replace("* **Stubbing:** Use `vi.stubEnv` for ALL environment variables", 
                                  "* **Stubbing:** Use `vi.stubEnv` for ALL environment variables\n" + constraint)
    
    write_file(path, content)

def update_deployment():
    path = 'docs/DEPLOYMENT.md'
    content = read_file(path)
    if not content: return

    note = "\n\n## 6. Gen 2 Cloud Functions Quirk\nWhen deploying Gen 2 functions for the first time, you may see an `Error generating service identity`. This is a known timeout issue. **Wait 2 minutes and retry the deploy.** It usually succeeds on the second attempt."
    
    if "Gen 2 Cloud Functions Quirk" not in content:
        content += note
    
    write_file(path, content)

def update_security_model():
    path = 'docs/SECURITY_MODEL.md'
    content = read_file(path)
    if not content: return

    warning = """
# ⚠️ DEV MODE ACTIVE (SKELETON KEY)
**Current Status:** Authentication is bypassed. Database Rules are `allow read, write: if true`.
**Do NOT deploy to Production without reverting `AuthContext` and `firestore.rules`.**

"""
    if "DEV MODE ACTIVE" not in content:
        content = warning + content
    
    write_file(path, content)

# Execution Order
if __name__ == "__main__":
    print("📋 Starting Documentation Audit...")
    update_project_status()
    update_changelog()
    update_package_json()
    update_context_dump()
    update_schema_architecture()
    update_roadmap()
    update_prompt_testing()
    update_deployment()
    update_security_model()
    print("🏁 Documentation Synchronized successfully.")