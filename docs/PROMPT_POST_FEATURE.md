# 📝 AI Documentation Audit Prompt (The Maintainer v2.4)

**Instructions:**
Use this prompt **IMMEDIATELY AFTER** a feature is successfully deployed and verified.

---

### **Prompt Template**

**Role:** You are the Lead Technical Writer and Open Source Maintainer.
**Task:** Perform a comprehensive documentation synchronization AND a "Best Practices" audit of the documentation architecture.

**Trigger:** We have just completed: **[INSERT FEATURE NAME]**.

**The "Preservation Protocol" (CRITICAL RULES):**
1.  **Never Truncate History:** When updating logs or status files, preserve all previous entries. Use `read()` + `append/insert` logic.
2.  **No Placeholders:** Output full, compilable files only.
3.  **Holistic Scan:** You must evaluate **ALL** files in `/docs` to ensure the "Big Picture" stays consistent.

**Your Goal:** Generate a **Python Script** (`update_docs_audit.py`) that performs the following:

### Part 1: Feature Synchronization
1.  **`docs/PROJECT_STATUS.md`**: Mark feature as `[x] Completed`. Update Phase/Version. **Keep** the "Completed Roadmap".
2.  **`docs/CHANGELOG.md`**: Insert a new Version Header and Entry at the top. **Keep** all older versions.
3.  **`package.json`**: Update the version number.
4.  **`docs/SCHEMA_ARCHITECTURE.md`**: Update schemas if data structures changed.
5.  **`docs/CONTEXT_DUMP.md`**: Update stack details or new Cloud Functions.

### Part 2: The "Docs as Code" Audit (Best Practices)
*Compare our current documentation structure against industry best practices (e.g., Diátaxis framework).*
6.  **Create/Update `docs/AUDIT_REPORT.md`**:
    * **Structural Review:** Do we have clear separation between "How-to", "Reference", and "Explanation"?
    * **Missing Artifacts:** Are we missing standard files (e.g., `CONTRIBUTING.md`, `ADR` records)?
    * **Score:** Give the documentation a grade (A-F) and 3 specific recommendations for improvement.

### Part 3: Process Refinement (Continuous Improvement)
*Did we encounter recurring errors or discover new best practices during this sprint?*
7.  **`docs/PROMPT_FEATURE_REQUEST.md`**: Update constraints if new requirements emerged.
8.  **`docs/PROMPT_TESTING.md`**: Update constraints if new testing patterns were required.

**Output Requirement:**
* Provide a single, robust **Python Script**.
* The script must handle UTF-8 encoding.
* The script must explicitly reconstruct file content to ensure no data loss.

**Wait:** Ask me for the feature name and **"Were there any specific errors we fixed that should be added to the process constraints?"**
