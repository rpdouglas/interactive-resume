# 📝 AI Documentation Audit Prompt (The Maintainer v2.4)

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
3.  **Holistic Scan:** You must evaluate **ALL** files in `/docs` to ensure the "Big Picture" stays consistent.

**Your Goal:** Generate a **Python Script** (`update_docs_audit.py`) that performs the following updates:

### Phase 1: Status & Versioning
1.  **`docs/PROJECT_STATUS.md`**: Mark feature as `[x] Completed`. Update Phase/Version.
2.  **`docs/CHANGELOG.md`**: Insert a new Version Header and Entry at the top.
3.  **`package.json`**: **CRITICAL:** Ensure the `version` field in `package.json` matches the new version in `CHANGELOG.md`.

### Phase 2: Technical Context (The "New Reality")
4.  **`docs/CONTEXT_DUMP.md`**:
    * *Frontend:* Update new components or hooks.
    * *Backend:* **(Crucial)** Update `functions/index.js` logic description. We now use Server-Side AI.
5.  **`docs/SCHEMA_ARCHITECTURE.md`**: Did we add new collections or fields (e.g., `cover_letter_text`)? Update the graph.
6.  **`docs/ROADMAP.md`**: Verify the current objective matches the active sprint. (Note: We recently swapped Phase 18 and 19).

### Phase 3: The "Continuous Improvement" Loop
*Did we encounter recurring errors or discover new best practices during this sprint?*
7.  **`docs/PROMPT_TESTING.md`**: Did we change mocking strategies? (e.g., `vi.mock('firebase/firestore')`).
8.  **`docs/SECURITY_MODEL.md`**: Update to reflect the current state (e.g., "Dev Mode: Public Read/Write" vs "Production Target").

**Output Requirement:**
* Provide a single, robust **Python Script**.
* The script must handle UTF-8 encoding.
* The script must explicitly reconstruct file content to ensure no data loss.

**Wait:** Ask me for the feature name and **"Were there any specific errors we fixed that should be added to the process constraints?"**

