import os
import json

# ==========================================
# 0. DYNAMIC DATA FETCHER (SSOT)
# ==========================================
def get_current_version():
    """Reads the version directly from package.json"""
    try:
        with open('package.json', 'r') as f:
            data = json.load(f)
            return f"v{data.get('version', '0.0.0')}"
    except FileNotFoundError:
        return "v0.0.0 (Error: package.json not found)"

def write_lines(filepath, lines):
    """Writes a list of strings to a file."""
    os.makedirs(os.path.dirname(os.path.abspath(filepath)), exist_ok=True)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write("\n".join(lines))
    print(f"✅ Updated: {filepath}")

# Load the Truth
current_version = get_current_version()
print(f"🔹 Detected System Version: {current_version}")

# ==========================================
# 1. PROJECT STATUS
# ==========================================
status_lines = [
    "# 📌 Project Status: Interactive Resume",
    "",
    "**Current Phase:** Phase 9 - Project Portfolio",
    f"**Version:** {current_version}", 
    "",
    "## 🎯 Current Sprint: Polish & Analytics",
    "* [x] **Core Refactor:** Moved to Nested Project Architecture.",
    "* [ ] **Analytics:** Integrate Google Analytics 4.",
    "* [ ] **UX Polish:** Sticky Navigation & Dynamic Hero.",
    "",
    "## ✅ Completed Features",
    f"* **Phase 9: Project Portfolio** (Nested Architecture v{current_version})",
    "    * [x] Refactored `experience.json` to support 1-to-Many relationships.",
    "    * [x] Implemented Accordion UI for Timeline Cards.",
    "    * [x] Updated 'Smart Expansion' logic for Cross-Filtering.",
    "* **Phase 8: Content Injection** (Real Data)",
    "* **Phase 7: Universal Access** (A11y & Print)",
    "* **Phase 4: The Matrix** (Cross-Filtering)",
    "",
    "## 📋 Product Backlog",
    "* v1.0.0 Release (Gold Master)"
]

# ==========================================
# 2. CONTEXT DUMP
# ==========================================
context_lines = [
    "# Interactive Resume: Context Dump",
    "**Stack:** React + Vite + Tailwind CSS (v4) + Framer Motion + Recharts",
    "**Test Stack:** Vitest + React Testing Library",
    f"**Version:** {current_version}",
    "",
    "## Architecture Rules (STRICT)",
    "1. **SSOT:** Version is controlled by `package.json`.",
    "2. **Data Structure:** `Experience -> Jobs -> [Projects]`. Do not revert to flat list.",
    "3. **Interaction:** Filtering a skill MUST auto-expand the relevant job card."
]

# ==========================================
# 3. CHANGELOG
# ==========================================
changelog_lines = [
    "# 📜 Changelog",
    "",
    f"## [{current_version}] - 2026-01-23",
    "### Changed",
    "* **Architecture Refactor:** Moved from Flat Role list to Nested Project Portfolio.",
    "    * `experience.json` now supports `projects` array per job.",
    "    * `TimelineCard.jsx` now uses an Accordion pattern.",
    "    * `ExperienceSection.jsx` filtering logic now traverses nested projects.",
    "",
    "## [v0.9.0] - 2026-01-22",
    "### Added",
    "* **Content Injection:** Real career data from PDFs.",
    "",
    "## [v0.8.0] - 2026-01-22",
    "### Added",
    "* **Universal Access:** Print Styles & Accessibility features."
]

# ==========================================
# 4. README & DEPLOYMENT
# ==========================================
readme_lines = [
    "# Ryan Douglas: Interactive Resume",
    "",
    "![Build Status](https://github.com/rpdouglas/interactive-resume/actions/workflows/deploy-prod.yml/badge.svg)",
    "![React](https://img.shields.io/badge/React-v19-blue)",
    "![Vitest](https://img.shields.io/badge/Tested_with-Vitest-green)",
    f"![Version](https://img.shields.io/badge/Version-{current_version}-purple)",
    "",
    "> **Live Demo:** [ryandouglas-resume.web.app](https://ryandouglas-resume.web.app)",
    "",
    "An interactive, data-driven visualization of my 15-year career in **Management Consulting** and **Data Analytics**.",
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
    "## 👤 Author",
    "**Ryan Douglas**"
]

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
    "* `FIREBASE_SERVICE_ACCOUNT`",
    "* `FIREBASE_PROJECT_ID`",
    "* `VITE_*` (Env Vars)",
    "",
    "## 3. Manual Deployment",
    "```bash",
    "npm run build",
    "npx firebase deploy",
    "```"
]

# ==========================================
# EXECUTION
# ==========================================
if __name__ == "__main__":
    print(f"🚀 Starting Documentation Audit ({current_version})...")
    write_lines("docs/PROJECT_STATUS.md", status_lines)
    write_lines("docs/CONTEXT_DUMP.md", context_lines)
    write_lines("docs/CHANGELOG.md", changelog_lines)
    write_lines("README.md", readme_lines)
    write_lines("docs/DEPLOYMENT.md", deployment_lines)
    print(f"✅ All Documentation Synced to {current_version}!")