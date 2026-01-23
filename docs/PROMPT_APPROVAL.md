# ✅ AI Approval & Execution Prompt (Builder Mode)

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
2.  **Code Quality:**
    * **NO Placeholders:** Never use `// ... rest of code`.
    * **Type Safety:** Use PropType checks or clean Interface definitions.
    * **Comments:** Include JSDoc comments explaining *complex* logic (e.g., the Radar chart coordinate math).
3.  **Responsiveness:**
    * **Mobile Parity:** If a chart is too wide for mobile, provide a fallback or a responsive container logic.
    * **Tailwind:** Use `clsx` and `tailwind-merge` for dynamic classes.

**Persona Validation (The "Self-Correction" Step):**
Before generating the script, verify the code against our Personas:
* **The Skimmer:** Is the data visible immediately? (No artificial delays > 0.5s).
* **The Mobile User:** Will this overflow horizontally on a 375px screen?
* **The Skeptic:** Are we using crisp SVGs (Recharts)?

**Output Requirements:**

1.  **The "One-Shot" Installer:**
    * A single bash script block.
    * *Note:* Escape special characters (`$`) correctly for bash.

2.  **Manual Verification Steps:**
    * A brief bulleted list of what I should see when I run `npm run dev` after installing.

*Please generate the installation script now.*

