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
    "**Current Phase:** Phase 16 - The Backbone Shift (Firestore Migration)",
    "**Version:** v2.1.0-beta",
    "**Status:** 🛠️ Active Development",
    "",
    "## 🎯 Current Objectives",
    "* [ ] Sprint 16.1: Schema Design & Seeding (JSON -> Firestore).",
    "",
    "## ✅ Completed Roadmap",
    "* **Phase 15:** [x] Chart Stabilization & Visual Polish.",
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
    "- **UX/UI:** Implemented \"Adaptive Density\" layout for `TimelineCard` to improve readability on small screens (<375px).",
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
    "5. **AI Isolation:** AI Logic must reside in `functions/` to protect API Keys.",
    "6. **Data Access:** All future data fetching must go through the `useResumeData` hook (Coming in Phase 16)."
]

# Execute Writes
print("🤖 Starting Documentation Audit...")
write_lines('docs/PROJECT_STATUS.md', project_status)
write_lines('docs/CHANGELOG.md', changelog)
write_lines('docs/CONTEXT_DUMP.md', context_dump)
print("✨ Audit Complete. Repository is ready for Phase 16: The Backbone Shift.")