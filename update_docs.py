import os

# We use a variable for backticks to prevent syntax errors
fence = "```"

content = f"""# 📝 AI Documentation Audit Prompt (The Maintainer v2.3)

**Instructions:**
Use this prompt **IMMEDIATELY AFTER** a feature is successfully deployed and verified.

---

### **Prompt Template**

**Role:** You are the Lead Technical Writer and Open Source Maintainer.
**Task:** Perform a comprehensive documentation audit, synchronization, and process retrospective.

**Trigger:** We have just completed: **[INSERT FEATURE NAME]**.

**The "Preservation Protocol" (CRITICAL RULES):**
1.  **Never Truncate History:** When updating logs or status files, preserve all previous entries. Use `read()` + `append/insert` logic.
2.  **No Placeholders:** Output full, compilable files only.
3.  **Holistic Scan:** You must evaluate **ALL** files in `/docs`, not just the status trackers.

**Your Goal:** Generate a **Python Script** (`update_docs_audit.py`) that performs the following updates:

### Phase 1: Status & Logs
1.  **`docs/PROJECT_STATUS.md`**: Mark feature as `[x] Completed`. Update Phase/Version. **Keep** the "Completed Roadmap".
2.  **`docs/CHANGELOG.md`**: Insert a new Version Header and Entry at the top. **Keep** all older versions.

### Phase 2: Technical Context
3.  **`docs/CONTEXT_DUMP.md`**: Update stack details, new libraries, or architectural decisions.
4.  **`docs/DEPLOYMENT.md`**: Did we add new Secrets or Config? Update the instructions.
5.  **`docs/SECURITY_MODEL.md`**: Did we change headers or rules? Update the policy.

### Phase 3: The "Continuous Improvement" Loop (CRITICAL)
*Did we encounter recurring errors or discover new best practices during this sprint?*
6.  **`docs/PROMPT_FEATURE_REQUEST.md`**: If a new requirement type emerged (e.g., "Mobile-First"), add it to the "Persona Check".
7.  **`docs/PROMPT_APPROVAL.md`**: If we fixed a deployment bug (e.g., "Missing Headers"), add a **Strict Technical Constraint** to the Builder's list to prevent recurrence.
8.  **`docs/PROMPT_TESTING.md`**: If a test crashed (e.g., "Env vars missing"), add a constraint to the QA Engineer's list.

**Output Requirement:**
* Provide a single, robust **Python Script**.
* The script must handle UTF-8 encoding.
* The script must explicitly reconstruct file content to ensure no data loss.

**Wait:** Ask me for the feature name and **"Were there any specific errors we fixed that should be added to the process constraints?"**
"""

# Ensure directory exists
os.makedirs('docs', exist_ok=True)

# Write the file
with open('docs/PROMPT_POST_FEATURE.md', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Successfully upgraded docs/PROMPT_POST_FEATURE.md to v2.3 (Full Audit Mode).")