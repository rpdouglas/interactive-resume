import os

def write_file(filepath, content):
    try:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write('\n'.join(content) + '\n')
        print(f"✅ [UPDATED] {filepath}")
    except Exception as e:
        print(f"❌ [ERROR] {filepath}: {e}")

# ==========================================
# 1. PROJECT_STATUS.md
# ==========================================
project_status = [
    "# 🟢 Project Status: Platform Expansion",
    "",
    "**Current Phase:** Phase 17 - The Application Manager (Job Matcher)",
    "**Version:** v2.2.0-beta",
    "**Status:** 🛠️ Active Development",
    "",
    "## 🎯 Current Objectives",
    "* [ ] Sprint 17.1: The Job Input Interface (Admin UI).",
    "* [ ] Sprint 17.2: Vector Matching Logic (Gemini).",
    "",
    "## ✅ Completed Roadmap",
    "* **Phase 16:** [x] The Backbone Shift (Firestore Migration).",
    "    * Sprint 16.1: Schema & Seeding.",
    "    * Sprint 16.2: Data Hook Layer & Offline Fallback.",
    "* **Phase 15:** [x] Chart Stabilization & Visual Polish.",
    "* **v2.1.0-beta:** [x] Phase 14 - CMS Scaffolding.",
    "* **v1.0.0:** [x] Gold Master Release."
]

# ==========================================
# 2. CHANGELOG.md
# ==========================================
changelog = [
    "# 📜 Changelog",
    "",
    "## [v2.2.0-beta] - 2026-01-25",
    "### Added",
    "- **Data Layer:** Implemented `ResumeContext` and `useResumeData` hook.",
    "- **Offline-First:** Added robust `try/catch` failover. If Firestore is unreachable, the app seamlessly loads local JSON.",
    "- **UX:** Added `LoadingSkeleton` to prevent layout shifts during data fetching.",
    "- **Testing:** Added \"Indestructible\" integration tests verifying the fallback logic.",
    "",
    "## [v2.1.0-beta] - 2026-01-25",
    "### Added",
    "- **Database:** Initialized Cloud Firestore architecture.",
    "- **Security:** Deployed strict `firestore.rules`.",
    "- **CMS:** Added `DataSeeder` utility.",
    "### Fixed",
    "- **Build:** Fixed critical \"Split-React\" bundling issue in `vite.config.js`."
]

# Execute Writes
print("🤖 Synchronizing Documentation...")
write_file('docs/PROJECT_STATUS.md', project_status)
write_file('docs/CHANGELOG.md', changelog)
print("✨ Documentation Audit Complete. Ready for Phase 17.")