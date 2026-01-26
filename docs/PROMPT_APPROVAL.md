# ✅ AI Approval & Execution Prompt (Builder Mode v2.1)

**Instructions:**
Use this prompt **after** the AI has presented the 3 Architectural Options.

---

### **Prompt Template**

**Decision:** I approve **Option [INSERT OPTION NUMBER]: [INSERT OPTION NAME]**. Proceed with implementation.

**Strict Technical Constraints (The "Builder" Standard):**
1.  **Execution First:** Output a single **Bash Script** (`install_feature.sh`) that:
    * Creates/Updates all necessary files.
    * Installs dependencies.
    * Uses `cat << 'EOF'` patterns.
2.  **Data Strategy (The "Backbone" Check):**
    * **Deep Fetching:** Remember that Firestore queries are *shallow*. If fetching a document with sub-collections, you MUST explicitly fetch the sub-collection and merge it.
    * **Failover Logic:** Wrap all critical fetches in `try/catch`. If the DB fails, return Local JSON.
3.  **Environment Awareness:**
    * **Secrets:** Never hardcode keys. Use `import.meta.env.VITE_VAR`.
    * **Codespaces:** Assume the dev server headers are relaxed (`unsafe-none`).

**Persona Validation:**
* **The Skimmer:** Is data visible immediately? (Use Skeletons).
* **The Mobile User:** Will this overflow on 320px?

**Output Requirements:**
1.  **The "One-Shot" Installer:** A single bash script block.
2.  **Manual Verification Steps:** Specific steps to verify the feature (e.g., "Disconnect Internet to test fallback").

*Please generate the installation script now.*
