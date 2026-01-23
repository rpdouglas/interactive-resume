#!/bin/bash

# ==========================================
# 🧪 Phase 4: Testing Infrastructure (The "Quality Gate")
# ==========================================

echo "Step 1: Installing Test Dependencies..."
npm install -D vitest jsdom @testing-library/react @testing-library/dom

echo "Step 2: Updating vite.config.js to support Vitest..."
# We overwrite with the complete config to ensure the 'test' object is placed correctly.
cat << 'EOF' > vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    css: true,
  },
})
EOF

echo "Step 3: Creating Test Setup File..."
mkdir -p src/test
cat << 'EOF' > src/test/setup.js
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
});
EOF

echo "Step 4: Adding 'test' script to package.json..."
# Uses npm pkg to safely add the script without messing up JSON syntax
npm pkg set scripts.test="vitest"
npm pkg set scripts.test:ui="vitest --ui"

echo "Step 5: Updating AI Workflow Definition..."
# We append the new Tester role to the existing workflow doc
cat << 'EOF' >> docs/AI_WORKFLOW.md

## 4. The Tester ("The Skeptic")
* **Trigger:** \`docs/PROMPT_TESTING.md\`
* **Goal:** Verify logic and prevent regressions.
* **Output:** \`src/__tests__/*.test.jsx\`
* **Behavior:** Paranoid, pedantic, focused on edge cases (e.g., "What if data is empty?").
* **Key Constraint:** Must use \`@testing-library/react\` principles (test behavior, not implementation).
EOF

echo "Step 6: Creating the Testing Prompt..."
cat << 'EOF' > docs/PROMPT_TESTING.md
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
EOF

echo "=========================================="
echo "✅ Testing Infrastructure Installed!"
echo "👉 Run 'npm run test' to verify the setup (It will say 'No test files found' - this is normal)."
echo "=========================================="