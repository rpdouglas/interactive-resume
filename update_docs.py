import os
import datetime
import re

# ==========================================
# 📝 DOCUMENTATION PRESERVATION PROTOCOL
# ==========================================

def read_file(path):
    """Safely reads a file, returns content or empty string if missing."""
    if os.path.exists(path):
        with open(path, 'r', encoding='utf-8') as f:
            return f.read()
    print(f"⚠️ Warning: File not found: {path}")
    return ""

def write_file(path, content):
    """Writes content to file with UTF-8 encoding."""
    # Ensure directory exists
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"✅ Updated: {path}")

# ==========================================
# PHASE 1: STATUS & LOGS
# ==========================================

# 1. Update PROJECT_STATUS.md
# ------------------------------------------
status_path = 'docs/PROJECT_STATUS.md'
status_content = read_file(status_path)

if status_content:
    # 1. Update Phase Name if needed
    status_content = status_content.replace(
        "Phase 17 - The Application Manager (Job Matcher)",
        "Phase 17 - Application Manager"
    )
    
    # 2. Mark Sprint 17.1 as Complete
    # Using simple replace for robustness
    if "[ ] Sprint 17.1: The Job Input Interface" in status_content:
        status_content = status_content.replace(
            "[ ] Sprint 17.1: The Job Input Interface (Admin UI).",
            "[x] Sprint 17.1: The Job Input Interface (Admin UI)."
        )
    
    # 3. Update Overall Status Line
    if "**Status:** 🛠️ Active Development" in status_content:
        status_content = status_content.replace(
            "**Status:** 🛠️ Active Development",
            "**Status:** 🟢 Phase 17.1 Complete (Ready for AI)"
        )

    write_file(status_path, status_content)

# 2. Update CHANGELOG.md
# ------------------------------------------
changelog_path = 'docs/CHANGELOG.md'
changelog_content = read_file(changelog_path)
today_str = datetime.date.today().strftime("%Y-%m-%d")

if changelog_content:
    new_entry = f"""## [v2.3.0-beta] - {today_str}
### Added
- **Admin:** New `JobTracker` module for inputting raw job descriptions.
- **Data:** Created `applications` collection in Firestore with "Async Trigger" schema (`ai_status: pending`).
- **Security:** Restricted `applications` to Admin-Write/Read only.
- **Testing:** Added environment-mocked unit tests for Admin components.

"""
    # Insert new entry after the main header or first known version
    # Strategy: Find the first "## [" line and insert before it
    match = re.search(r'## \[v', changelog_content)
    if match:
        insert_pos = match.start()
        new_changelog = changelog_content[:insert_pos] + new_entry + changelog_content[insert_pos:]
        write_file(changelog_path, new_changelog)
    else:
        # Fallback if file is empty or formatted differently
        new_changelog = "# 📜 Changelog\n\n" + new_entry + changelog_content
        write_file(changelog_path, new_changelog)


# ==========================================
# PHASE 2: TECHNICAL CONTEXT
# ==========================================

# 3. Update CONTEXT_DUMP.md
# ------------------------------------------
context_path = 'docs/CONTEXT_DUMP.md'
context_content = read_file(context_path)

if context_content and "JobTracker.jsx" not in context_content:
    # Locate the admin component line
    target_line = "* `src/components/admin` -> CMS specific UI."
    replacement = "* `src/components/admin` -> CMS specific UI.\n    * `JobTracker.jsx`: Input for AI Analysis (Async Trigger Pattern)."
    
    if target_line in context_content:
        context_content = context_content.replace(target_line, replacement)
        write_file(context_path, context_content)

# 4. Update SECURITY_MODEL.md
# ------------------------------------------
security_path = 'docs/SECURITY_MODEL.md'
security_content = read_file(security_path)

if security_content and "`applications`" not in security_content:
    # Find the table rows and append
    # Looking for the last row usually projects
    target_row = "| `projects` | 🌍 Public | 🔐 Auth Only |"
    new_row = "\n| `applications` | ⛔ None | 🔐 Admin Only |"
    
    if target_row in security_content:
        security_content = security_content.replace(target_row, target_row + new_row)
        write_file(security_path, security_content)


# ==========================================
# PHASE 3: CONTINUOUS IMPROVEMENT (PROCESS)
# ==========================================

# 5. Update PROMPT_TESTING.md
# ------------------------------------------
testing_prompt_path = 'docs/PROMPT_TESTING.md'
testing_content = read_file(testing_prompt_path)

if testing_content:
    # We want to add new constraints to item 1 (Environment Mocking) or create a new item.
    # Let's append to the Constraints section generally.
    
    new_constraints = """    * **Path Verification:** When mocking modules with `vi.mock`, strictly verify the directory depth of relative imports (e.g., `../../../lib/db` vs `../../lib/db`). Mismatched paths cause silent failures.
    * **Stubbing:** Use `vi.stubEnv` for ALL environment variables in Firebase tests to prevent SDK crashes.
"""
    
    # Hook into the existing list. Looking for "Constraints & Best Practices:"
    # We will append these as sub-bullets under rule #1 or just add them to the list logic.
    # A safe place is to replace the "Constraints & Best Practices:" block or append to the end of Rule 1.
    
    # Searching for Rule 1's end
    rule_1_marker = "* *Tip:* Mock the `firebase/auth` and `firebase/firestore` modules entirely to avoid network calls."
    
    if rule_1_marker in testing_content and "Path Verification" not in testing_content:
        testing_content = testing_content.replace(rule_1_marker, rule_1_marker + "\n" + new_constraints)
        write_file(testing_prompt_path, testing_content)


# 6. Update PROMPT_APPROVAL.md
# ------------------------------------------
approval_prompt_path = 'docs/PROMPT_APPROVAL.md'
approval_content = read_file(approval_prompt_path)

if approval_content:
    # Add constraint to "Strict Technical Constraints"
    # We'll look for the last item in that list (usually item 3 Environment Awareness)
    
    new_constraint = """4.  **UI Resilience:**
    * **Textareas:** Always enforce `overflow-y-auto` and `resize-none` to prevent Mobile Safari scroll trapping on large inputs.
"""
    
    # Find the end of item 3
    # Matches: * **Codespaces:** Assume the dev server headers are relaxed (`unsafe-none`).
    item_3_marker = "* **Codespaces:** Assume the dev server headers are relaxed (`unsafe-none`)."
    
    if item_3_marker in approval_content and "UI Resilience" not in approval_content:
        approval_content = approval_content.replace(item_3_marker, item_3_marker + "\n" + new_constraint)
        write_file(approval_prompt_path, approval_content)

print("\n🎉 Documentation Audit Complete. All files synchronized for Sprint 17.2.")