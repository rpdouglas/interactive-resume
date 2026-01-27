import os
import datetime
import re

# ==========================================
# 📝 SPRINT 17.3: DOCUMENTATION AUDIT
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

# Mark Phase 17 as Complete (Update Header)
if "Phase 17 - Application Manager" in status_content:
    status_content = re.sub(
        r"Phase 17 - Application Manager.*", 
        "Phase 17 - Application Manager (Complete)", 
        status_content
    )

# Add Phase 18 if missing
if "Phase 18: Security Hardening" not in status_content:
    if "## 🎯 Current Objectives" in status_content:
        status_content = status_content.replace(
            "## 🎯 Current Objectives",
            "## 🎯 Current Objectives\n* [ ] Phase 18: Security Hardening & Deployment."
        )

# Update Roadmap
if "## ✅ Completed Roadmap" in status_content:
    if "Sprint 17.3" not in status_content:
        new_roadmap_item = """* **Phase 17:** [x] Application Manager Complete.
    * Sprint 17.1: Input Interface.
    * Sprint 17.2: Vector Engine.
    * Sprint 17.3: Analysis Dashboard (Real-time UI)."""
        status_content = status_content.replace(
            "## ✅ Completed Roadmap",
            "## ✅ Completed Roadmap\n" + new_roadmap_item
        )

write_file(status_path, status_content)

# 2. Update CHANGELOG.md
# ------------------------------------------
changelog_path = 'docs/CHANGELOG.md'
changelog_content = read_file(changelog_path)
today = datetime.date.today().strftime("%Y-%m-%d")

new_entry = f"""## [v2.5.0-beta] - {today}
### Added
- **UI:** Added `AnalysisDashboard` with real-time Firestore listeners (`onSnapshot`) for instant feedback.
- **UX:** Implemented "Inline Transformation" animation using `framer-motion` to smoothly reveal results.
- **Visualization:** Added `ScoreGauge` with color-coded match thresholds (Red/Yellow/Green).

"""

if "## [v" in changelog_content:
    parts = changelog_content.split("## [v", 1)
    new_changelog = parts[0] + new_entry + "## [v" + parts[1]
else:
    new_changelog = "# 📜 Changelog\n\n" + new_entry + changelog_content

write_file(changelog_path, new_changelog)

# 3. Update CONTEXT_DUMP.md (Async Pattern)
# ------------------------------------------
context_path = 'docs/CONTEXT_DUMP.md'
context_content = read_file(context_path)

if "5. Async UI Patterns" not in context_content:
    new_section = """
### 5. Async UI Patterns
* **Optimistic vs Real-Time:** For AI operations (which take >3s), we do not await the API response directly in the client. 
* **The Pattern:** 1. UI writes document with `ai_status: 'pending'`.
    2. Cloud Function triggers, processes, and updates to `ai_status: 'complete'`.
    3. UI component uses `onSnapshot` to listen for this status change and reveals the result.
"""
    # Append to the end of "Coding Standards" section (before Directory Structure)
    if "## Directory Structure" in context_content:
        context_content = context_content.replace(
            "## Directory Structure", 
            new_section + "\n## Directory Structure"
        )
    else:
        context_content += new_section

write_file(context_path, context_content)

# 4. Update PROMPT_TESTING.md (Accessibility Constraint)
# ------------------------------------------
testing_path = 'docs/PROMPT_TESTING.md'
testing_content = read_file(testing_path)

if "Accessibility & Selectors" not in testing_content:
    new_constraint = """
    * **Accessibility & Selectors:** Interactive elements without visible text (e.g., Icon Buttons) MUST have an `aria-label`. Complex visualizations (e.g., SVG Charts) MUST have a `data-testid` to be testable via `getByTestId`.
"""
    # Look for "Constraints & Best Practices" list items
    # We append it before the "Output Requirements" section to keep it in the list
    if "3.  **Imports:**" in testing_content:
         testing_content = testing_content.replace(
            "3.  **Imports:**", 
            new_constraint + "3.  **Imports:**"
        )

write_file(testing_path, testing_content)

print("\n🎉 Sprint 17.3 Documentation Audit Complete.")