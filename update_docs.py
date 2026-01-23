import os

def write_lines(filepath, lines):
    """Writes a list of strings to a file."""
    os.makedirs(os.path.dirname(os.path.abspath(filepath)), exist_ok=True)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write("\n".join(lines))
    print(f"✅ Updated: {filepath}")

# ==========================================
# 1. CONTEXT DUMP
# ==========================================
context_lines = [
    "# Interactive Resume: Context Dump",
    "**Stack:** React + Vite + Tailwind CSS (v4) + Framer Motion + Recharts",
    "**Test Stack:** Vitest + React Testing Library + JSDOM",
    "**Infrastructure:** GitHub Actions + Firebase Hosting",
    "**Version:** v0.3.0 (Testing Infrastructure Live)",
    "",
    "## 🧠 The 'Prime Directive'",
    "**The Medium is the Message.**",
    "1. Clarity First.",
    "2. Performance (100/100 Lighthouse).",
    "3. Quality (Unit Tested Components).",
    "",
    "## Infrastructure Layer",
    "* **Source Control:** GitHub",
    "* **Hosting:** Firebase Hosting",
    "* **CI/CD:** GitHub Actions (Prod & Preview)",
    "",
    "## Data Schema",
    "* `profile.json`: Metrics & Bio.",
    "* `skills.json`: Radar Data.",
    "* `experience.json`: Roles (PAR).",
    "",
    "## Architecture Rules (STRICT)",
    "1. **Data-Driven:** All content separated into JSON files.",
    "2. **No Canvas:** DOM/SVG preferred.",
    "3. **Modularity:** Isolated features.",
    "4. **Testing:** All new components must have a corresponding `.test.jsx` file."
]

# ==========================================
# 2. PROJECT STATUS
# ==========================================
status_lines = [
    "# 📌 Project Status: Interactive Resume",
    "",
    "**Current Phase:** Phase 3 - The Experience Timeline",
    "**Version:** v0.3.0",
    "",
    "## 🎯 Current Sprint: The Narrative",
    "* [ ] **Timeline Component:** Build the vertical 'Scroll Spy' timeline.",
    "* [ ] **Mobile Layout:** Ensure the timeline stacks correctly on small screens.",
    "",
    "## ✅ Completed Features",
    "* **Phase 1: Foundation** (Vite/React/Tailwind v4)",
    "* **Phase 2: The Dashboard** (KPI Cards, Radar Chart)",
    "* **Phase 3: DevOps** (GitHub Actions, Firebase)",
    "* **Phase 4: Testing Infra** (Vitest, RTL, JSDOM)",
    "",
    "## 📋 Product Backlog",
    "* Phase 4: The Matrix (Cross-Filtering)",
    "* Phase 5: Polish (Lighthouse Tuning)"
]

# ==========================================
# 3. CHANGELOG
# ==========================================
changelog_lines = [
    "# 📜 Changelog",
    "",
    "## [v0.3.0] - 2026-01-22",
    "### Added",
    "* **Testing Infrastructure:**",
    "    * Configured Vitest & JSDOM for unit testing.",
    "    * Added `docs/PROMPT_TESTING.md` for AI-driven test generation.",
    "    * Updated `vite.config.js` to support test environments.",
    "",
    "## [v0.2.0] - 2026-01-22",
    "### Added",
    "* **Dashboard:** KPI Cards & Radar Chart.",
    "* **DevOps:** GitHub Actions & Firebase Hosting.",
    "* **Infrastructure:** Tailwind v4 migration.",
    "",
    "## [v0.1.0] - 2026-01-22",
    "* Initial Scaffolding & Data Layer."
]

# ==========================================
# 4. DEPLOYMENT MANUAL (Unchanged, but kept for consistency)
# ==========================================
deployment_lines = [
    "# ☁️ Deployment & Infrastructure Manual",
    "",
    "## 1. The Pipeline",
    "We use a **GitHub Actions** workflow to automate deployments to Firebase Hosting.",
    "",
    "| Environment | Trigger | URL | Status |",
    "| :--- | :--- | :--- | :--- |",
    "| **Production** | Push to `main` | `ryandouglas-resume.web.app` | Live |",
    "| **Preview** | Open Pull Request | (Generated in PR Comment) | Ephemeral |",
    "",
    "## 2. Secrets Management",
    "The pipeline relies on the following **GitHub Repository Secrets**:",
    "",
    "* `FIREBASE_SERVICE_ACCOUNT`: The JSON Private Key for the Firebase Service Account.",
    "* `FIREBASE_PROJECT_ID`: `ryandouglas-resume`",
    "* `VITE_*`: All environment variables defined in `.env`.",
    "",
    "## 3. Manual Deployment (Fallback)",
    "If GitHub Actions is down, you can deploy manually from your local machine:",
    "",
    "```bash",
    "# 1. Build the project",
    "npm run build",
    "",
    "# 2. Login to Firebase (One time)",
    "npx firebase login",
    "",
    "# 3. Deploy",
    "npx firebase deploy",
    "```",
    "",
    "## 4. Local Development",
    "* **Start Server:** `npm run dev`",
    "* **Run Tests:** `npm run test`"
]

# ==========================================
# 5. README
# ==========================================
readme_lines = [
    "# Interactive Resume: The 'Medium is the Message'",
    "",
    "![Build Status](https://github.com/rpdouglas/interactive-resume/actions/workflows/deploy-prod.yml/badge.svg)",
    "![React](https://img.shields.io/badge/React-v19-blue)",
    "![Tailwind](https://img.shields.io/badge/Tailwind-v4-cyan)",
    "![Vitest](https://img.shields.io/badge/Tested_with-Vitest-green)",
    "",
    "> **Live Demo:** [ryandouglas-resume.web.app](https://ryandouglas-resume.web.app)",
    "",
    "A 'Living Resume' demonstrating **React**, **Data Viz**, and **CI/CD**.",
    "",
    "## 🏗️ Architecture",
    "Strict Data-Driven Architecture. Content flows from `src/data/*.json`.",
    "",
    "## 🚀 Quick Start",
    "```bash",
    "git clone [https://github.com/rpdouglas/interactive-resume.git](https://github.com/rpdouglas/interactive-resume.git)",
    "npm install",
    "npm run dev",
    "```",
    "",
    "## 🧪 Running Tests",
    "```bash",
    "npm run test",
    "```",
    "",
    "## 🛠️ Tech Stack",
    "* React 19, Vite, Tailwind v4",
    "* Framer Motion, Recharts",
    "* Firebase Hosting, GitHub Actions",
    "* Vitest, React Testing Library",
    "",
    "## 👤 Author",
    "**Ryan Douglas**"
]

# ==========================================
# EXECUTION
# ==========================================
if __name__ == "__main__":
    print("🚀 Starting Documentation Audit...")
    write_lines("docs/CONTEXT_DUMP.md", context_lines)
    write_lines("docs/PROJECT_STATUS.md", status_lines)
    write_lines("docs/CHANGELOG.md", changelog_lines)
    write_lines("docs/DEPLOYMENT.md", deployment_lines)
    write_lines("README.md", readme_lines)
    print("✅ All Documentation Synced to v0.3.0!")