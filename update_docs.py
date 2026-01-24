import os
import re
from datetime import date

# ==========================================
# 📝 Configuration
# ==========================================
NEW_VERSION = "v2.1.0-beta"
CURRENT_DATE = date.today().strftime("%Y-%m-%d")
DOCS_DIR = "docs"

def update_project_status():
    """Updates status, version, and checks off completed items."""
    path = os.path.join(DOCS_DIR, "PROJECT_STATUS.md")
    
    try:
        with open(path, "r", encoding="utf-8") as f:
            content = f.read()

        # 1. Update Header Info
        content = re.sub(
            r"Current Phase: .*", 
            "Current Phase: Phase 15: AI Cover Letter Generator", 
            content
        )
        content = re.sub(
            r"Version: .*", 
            f"Version: {NEW_VERSION}", 
            content
        )

        # 2. Mark Objectives as Complete
        content = content.replace(
            "[ ] Sprint 14.2: Build the Gemini-integrated Project Architect Form.",
            "[x] Sprint 14.2: Build the Gemini-integrated Project Architect Form."
        )
        content = content.replace(
            "[ ] Integrate Google AI SDK for PAR formatting.",
            "[x] Integrate Google AI SDK for PAR formatting."
        )

        with open(path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"✅ Updated {path}")

    except FileNotFoundError:
        print(f"❌ Error: Could not find {path}")

def update_changelog():
    """Prepends the new version entry to the Changelog."""
    path = os.path.join(DOCS_DIR, "CHANGELOG.md")
    
    new_entry = f"""
## [{NEW_VERSION}] - {CURRENT_DATE}
### Added
- **Backend:** Added Firebase Cloud Functions (`functions/`) for secure AI processing.
- **AI:** Integrated `gemini-3-flash-preview` for Resume Architecture.
- **Security:** Implemented Google Secret Manager for API Keys.
- **UI:** Added `/admin/architect` with live JSON preview and Mermaid rendering.
"""

    try:
        with open(path, "r", encoding="utf-8") as f:
            content = f.read()

        # Insert after the main title but before the first existing version header
        # We look for the first occurrence of "## [" to split the file
        if "## [" in content:
            parts = content.split("## [", 1)
            # Reconstruct: Header + New Entry + Rest of file
            new_content = parts[0] + new_entry.strip() + "\n\n" + "## [" + parts[1]
        else:
            # Fallback for empty changelogs
            new_content = content + "\n" + new_entry

        with open(path, "w", encoding="utf-8") as f:
            f.write(new_content)
        print(f"✅ Updated {path}")

    except FileNotFoundError:
        print(f"❌ Error: Could not find {path}")

def update_context_dump():
    """Updates the architectural definition of the platform."""
    path = os.path.join(DOCS_DIR, "CONTEXT_DUMP.md")
    
    try:
        with open(path, "r", encoding="utf-8") as f:
            content = f.read()

        # 1. Update Version
        content = re.sub(
            r"Version: .*", 
            f"Version: {NEW_VERSION} (Full-Stack AI)", 
            content
        )

        # 2. Update Stack Definition
        # We replace the specific Stack line
        new_stack_line = "**Stack:** React 19 + Vite + Tailwind v4 + Firebase (Auth/Analytics/Functions) + Google Secret Manager + Gemini 3.0"
        content = re.sub(r"\*\*Stack:\*\*.*", new_stack_line, content)

        # 3. Add Architecture Rule
        # We append the new rule if it doesn't exist
        new_rule = "5. **AI Isolation:** AI Logic must reside in `functions/` to protect API Keys."
        
        if "AI Logic must reside" not in content:
            # Look for the last known rule (Rule 4) and append after it
            if "4. **A11y:**" in content:
                content = re.sub(
                    r"(4\. \*\*A11y:\*\*.*)", 
                    r"\1\n" + new_rule, 
                    content
                )
            else:
                # Fallback: Just append to the section
                content = content.replace("## Architecture Rules (STRICT)", "## Architecture Rules (STRICT)\n" + new_rule)

        with open(path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"✅ Updated {path}")

    except FileNotFoundError:
        print(f"❌ Error: Could not find {path}")

if __name__ == "__main__":
    print("🚀 Starting Documentation Audit for Phase 14...")
    update_project_status()
    update_changelog()
    update_context_dump()
    print(f"\n✨ Phase 14 Closed. Repository upgraded to {NEW_VERSION}.")