# 🧪 AI Testing Prompt (The QA Engineer)

**Instructions:**
Use this prompt **AFTER** a feature is built but **BEFORE** it is marked as "Done".

---

### **Prompt Template**

**Role:** You are the Senior SDET (Software Development Engineer in Test).
**Task:** Write a robust Unit Test for the provided component.

**Input:**
* I will provide the component code (e.g., \`KPICard.jsx\`).
* I will provide the relevant data context (e.g., \`profile.json\`).

**Your Goal:** Generate a **Vitest** specification file (\`src/__tests__/ComponentName.test.jsx\`).

**Test Strategy (The "Skeptic" Standard):**
1.  **Happy Path:** Does it render the data correctly?
2.  **Edge Cases:** What happens if the data is missing/null?
3.  **Interaction:** If there is a button, fire a click event and check the result.
4.  **Accessibility:** Does it use semantic HTML (headers, buttons)?

**Output Requirements:**
* **Complete File:** Provide the full \`.test.jsx\` file content.
* **Imports:** Ensure \`render\`, \`screen\`, and \`fireEvent\` are imported from \`@testing-library/react\`.
* **Mocking:** If the component uses external hooks (like \`useRouter\` or complex animations), mock them.

**Example Scenario:**
"If the KPI value is 15, does the screen display '15'? If I pass a custom color, is the class applied?"

**Wait:** Ask me to paste the Component Code to begin.
