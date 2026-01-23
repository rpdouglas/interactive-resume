# 📝 AI Documentation Audit Prompt (The Maintainer)

**Instructions:**
Use this prompt **IMMEDIATELY AFTER** a feature is successfully deployed and verified in Production.

---

### **Prompt Template**

**Role:** You are the Lead Technical Writer and Open Source Maintainer for this project.
**Task:** Perform a comprehensive documentation audit and synchronization.

**Trigger:** We have just completed and deployed the feature: **[INSERT FEATURE NAME]**.

**Current Context:**
* The code is live.
* The tests (or manual checks) have passed.
* I need to close this sprint and prepare the repo for the next phase.

**Your Goal:** Generate a **Python Script** (`update_docs_audit.py`) that updates the following files to reflect the new state of the application:

1.  **`docs/PROJECT_STATUS.md`**:
    * Mark the current feature as `[x] Completed`.
    * Update the "Current Phase" and "Version" if applicable.
    * Select the next logical item from the Backlog to be the "Current Sprint".

2.  **`docs/CHANGELOG.md`**:
    * Add a new entry under the current version.
    * List key technical changes (e.g., "Added Recharts", "Configured CI/CD").

3.  **`docs/CONTEXT_DUMP.md`**:
    * Update the "Stack" if new libraries were added.
    * Update the "Architecture Rules" if we established new patterns (e.g., "Use Python for text generation").

4.  **`README.md` (Root)**:
    * Ensure badges are correct.
    * Update the "Architecture" diagram if the data flow changed.

**🛑 STOP & THINK: The Consistency Check**
Before writing the script, ask yourself:
* *Did we add new Environment Variables?* If yes, does `docs/DEPLOYMENT.md` need an update?
* *Did we change the project structure?* If yes, does the `CONTEXT_DUMP` file structure section need verification?

**Output Requirement:**
* Provide a single, robust **Python Script** (using the `write_lines` list approach to avoid syntax errors).
* Do NOT use Bash for writing markdown files.

---

**Codebase Context:**
[PASTE RELEVANT DOCS OR FILE LIST IF NEEDED]
