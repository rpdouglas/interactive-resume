import os

def write_file(filepath, content):
    try:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"✅ [UPDATED] {filepath}")
    except Exception as e:
        print(f"❌ [ERROR] Could not update {filepath}: {e}")

# ==========================================
# NEW PROMPT CONTENT (v2.0 - Backbone Ready)
# ==========================================
new_prompt_content = """# ✅ AI Approval & Execution Prompt (Builder Mode v2.0)

**Instructions:**
Use this prompt **after** the AI has presented the 3 Architectural Options. This signals approval for a specific approach and triggers code generation.

---

### **Prompt Template**

**Decision:** I approve **Option [INSERT OPTION NUMBER]: [INSERT OPTION NAME]**. Proceed with implementation.

**Strict Technical Constraints (The "Builder" Standard):**
1.  **Execution First:** Output a single **Bash Script** (`install_feature.sh`) that:
    * Creates/Updates all necessary files.
    * Installs any missing dependencies (`npm install ...`).
    * Uses `cat << 'EOF'` patterns to write file contents safely.
2.  **Data Strategy (The "Backbone" Check):**
    * **Deep Fetching:** Remember that Firestore queries are *shallow*. If fetching a document with sub-collections (like `experience/{id}/projects`), you MUST implement logic to fetch the sub-collection data explicitly.
    * **Failover Logic:** Wrap all critical data fetching in `try/catch`. If the Database fails (Offline/Quota/Rules), return a safe **Fallback** (e.g., Local JSON or Empty State) to prevent a crash.
    * **Idempotency:** Seeding or Mutation scripts must be safe to run multiple times without creating duplicate data.
3.  **Code Quality:**
    * **NO Placeholders:** Never use `// ... rest of code`.
    * **Type Safety:** Use PropType checks or clean Interface definitions.
    * **Performance:** Ensure `useEffect` dependencies are stable to prevent infinite fetch loops.

**Persona Validation (The "Self-Correction" Step):**
Before generating the script, verify the code against our Personas:
* **The Skimmer:** Is the data visible immediately? (Use Skeletons, not Spinners).
* **The Mobile User:** Will this fallback work on a spotty connection?
* **The Skeptic:** Are we using strict Security Rules?

**Output Requirements:**

1.  **The "One-Shot" Installer:**
    * A single bash script block.
    * *Note:* Escape special characters (`$`) correctly for bash.

2.  **Manual Verification Steps:**
    * A brief bulleted list of what I should see when I run `npm run dev` after installing.
    * Steps to simulate a failure (e.g., "Disconnect Internet") to test the Fallback.

*Please generate the installation script now.*
"""

print("🤖 Upgrading Approval Prompt to v2.0 (Data Strategy Enabled)...")
write_file('docs/PROMPT_APPROVAL.md', new_prompt_content)
print("✨ Template updated. You are ready to generate the specific prompt for Sprint 16.2.")