import os

def write_lines(filepath, lines):
    """
    Writes a list of strings to a file, ensuring correct encoding and newlines.
    """
    try:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write('\n'.join(lines) + '\n')
        print(f"✅ [UPDATED] {filepath}")
    except Exception as e:
        print(f"❌ [ERROR] Could not update {filepath}: {e}")

# ==========================================
# 1. PROJECT_STATUS.md
# ==========================================
project_status = [
    "# 🟢 Project Status: Platform Expansion",
    "",
    "**Current Phase:** Phase 15 - Chart Stabilization & Visual Polish",
    "**Version:** v2.1.0-beta",
    "**Status:** 🛠️ Active Development",
    "",
    "## 🎯 Current Objectives",
    "* [x] Sprint 15.1: Fix Recharts ResponsiveContainer width error.",
    "* [ ] Sprint 15.2: Audit Mobile responsiveness for TimelineCard expansion.",
    "",
    "## ✅ Completed Roadmap",
    "* **v2.1.0-beta:** [x] Phase 14 - CMS Scaffolding, AI Architect & Production Auth.",
    "* **v2.0.0-alpha:** [x] Phase 14.1 - Admin Auth Guard & Routing established.",
    "* **v1.0.0:** [x] Gold Master Release - Static Interactive Resume.",
    "* **Phase 12:** [x] Integrated Conversion (Booking Agent).",
    "* **Phase 1-11:** [x] Foundation, Matrix UI, Visual Systems, Testing Suite."
]

# ==========================================
# 2. CHANGELOG.md
# ==========================================
changelog = [
    "# 📜 Changelog",
    "",
    "## [v2.1.0-beta] - 2026-01-24",
    "### Added",
    "- **CMS:** Added `ProjectArchitect` with Gemini 3.0 Integration.",
    "- **Backend:** Added Firebase Cloud Functions (`functions/`) for secure AI processing.",
    "- **Security:** Implemented `COOP/COEP` headers in `firebase.json` for safe browsing compliance.",
    "- **Auth:** Finalized `VITE_ADMIN_EMAIL` whitelist logic for the protected Admin route.",
    "- **UI:** Added `/admin/architect` with live JSON preview and Mermaid rendering.",
    "### Fixed",
    "- **Visuals:** Resolved `ResponsiveContainer` layout race condition in `SkillRadar` using CSS enforcement (`min-w-0`).",
    "",
    "## [v2.0.0-alpha] - 2026-01-23",
    "### Added",
    "- **Bifurcated Routing:** Implemented `react-router-dom` for `/` (Public) and `/admin` (CMS) separation.",
    "- **Security Perimeter:** Integrated Firebase Auth with strict Google Email Whitelisting.",
    "- **Auth Context:** Global `AuthProvider` managing user sessions across the platform.",
    "- **Lazy Loading:** Admin dashboard code-split to optimize public bundle size.",
    "### Fixed",
    "- **Test Sync:** Updated Unit Tests to handle Auth Context dependencies in Header and Footer.",
    "- **Pool Stability:** Optimized Vitest configuration for stable worker forks."
]

# ==========================================
# 3. CONTEXT_DUMP.md
# ==========================================
context_dump = [
    "# Interactive Resume: Platform Context",
    "**Stack:** React 19 + Vite + Tailwind v4 + Firebase (Auth/Analytics/Functions) + Google Secret Manager + Gemini 3.0 Flash",
    "**Version:** v2.1.0-beta",
    "",
    "## Architecture Rules (STRICT)",
    "1. **Security:** All `/admin/*` routes must be protected by `ProtectedRoute` and a whitelist check.",
    "2. **SSOT:** Versioning is controlled by `package.json`.",
    "3. **Code Splitting:** Admin components must be `lazy` loaded to keep public performance high.",
    "4. **A11y:** Mobile menu and Auth triggers must maintain `aria-label` compliance.",
    "5. **AI Isolation:** AI Logic must reside in `functions/` to protect API Keys."
]

# Execute Writes
print("🤖 Starting Documentation Audit...")
write_lines('docs/PROJECT_STATUS.md', project_status)
write_lines('docs/CHANGELOG.md', changelog)
write_lines('docs/CONTEXT_DUMP.md', context_dump)
print("✨ Audit Complete. Repository is ready for Sprint 15.2.")