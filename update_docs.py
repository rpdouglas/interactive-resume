import json
import os
from datetime import date

# ==========================================
# 📘 v1.0.0 Documentation Update (Safe Mode)
# ==========================================

def write_file(filepath, lines):
    """Writes a list of lines to a file."""
    os.makedirs(os.path.dirname(os.path.abspath(filepath)), exist_ok=True)
    content = "\n".join(lines)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"✅ Updated: {filepath}")

def update_package_json():
    """Bumps version to 1.0.0"""
    try:
        with open('package.json', 'r') as f:
            data = json.load(f)
        
        data['version'] = '1.0.0'
        
        with open('package.json', 'w') as f:
            json.dump(data, f, indent=2)
        print("✅ Bumped package.json to v1.0.0")
    except FileNotFoundError:
        print("❌ Error: package.json not found.")

# ---------------------------------------------------------
# 1. PROJECT STATUS
# ---------------------------------------------------------
status_lines = [
    "# 🟢 Project Status: Live Operations",
    "",
    "**Current Phase:** Maintenance & Monitoring",
    "**Version:** v1.0.0 (Gold Master)",
    "**Status:** ✅ Production Live",
    "",
    "## 🎯 Current Objectives",
    "* Monitor Google Analytics for engagement.",
    "* Maintain career data.",
    "* Gather feedback for Phase 11 ('The Whiteboard').",
    "",
    "## ✅ Completed Roadmap",
    "* **v1.0.0:** Gold Master Release.",
    "* **Phase 10:** Polish & Analytics (Sticky Nav, Hooks).",
    "* **Phase 9:** Nested Project Architecture.",
    "* **Phase 1-8:** Foundation, Data, Matrix UI, SEO."
]

# ---------------------------------------------------------
# 2. CHANGELOG
# ---------------------------------------------------------
changelog_lines = [
    "# 📜 Changelog",
    "",
    f"## [v1.0.0] - {date.today()} - Gold Master",
    "**Official Production Release.**",
    "* **Features:** Nested Project Portfolios, 'The Matrix' Filtering, Sticky Nav, Dynamic Hero.",
    "* **Tech:** React 19, Vite, Tailwind v4, Firebase Analytics.",
    "* **Content:** Complete 15-year career history.",
    "",
    "## [v0.11.0] - Polish Sprint",
    "* Added Sticky Header, Custom Hooks (`useTypewriter`, `useAnalytics`), and Glassmorphism UI.",
    "",
    "## [v0.10.0] - Architecture Refactor",
    "* Moved from Flat Job list to Nested Project Schema."
]

# ---------------------------------------------------------
# 3. README
# ---------------------------------------------------------
readme_lines = [
    "# Ryan Douglas: Interactive Resume",
    "",
    "![Build Status](https://github.com/rpdouglas/interactive-resume/actions/workflows/deploy-prod.yml/badge.svg)",
    "![Version](https://img.shields.io/badge/Version-1.0.0-success)",
    "",
    "> **🚀 Live Application:** [ryandouglas-resume.web.app](https://ryandouglas-resume.web.app)",
    "",
    "An interactive, data-driven visualization of my 15-year career in **Management Consulting** and **Data Analytics**.",
    "",
    "## 🎯 Core Features",
    "* **'The Matrix' Filtering:** Click any skill in the Radar Chart to instantly filter and auto-expand relevant career projects.",
    "* **Project Deep Dives:** Detailed 'Problem, Action, Result' (PAR) case studies nested within job roles.",
    "* **Universal Access:** Fully responsive, accessible, and print-optimized.",
    "",
    "## 🏗️ Architecture",
    "* **Stack:** React + Vite + Tailwind CSS (v4)",
    "* **Data:** JSON-driven architecture (`src/data/`).",
    "* **Analytics:** Google Analytics 4.",
    "",
    "## 🚀 Quick Start",
    "```bash",
    "npm install",
    "npm run dev",
    "```"
]

# ==========================================
# EXECUTION
# ==========================================
if __name__ == "__main__":
    print("🚀 Updating Documentation for v1.0.0...")
    update_package_json()
    write_file("docs/PROJECT_STATUS.md", status_lines)
    write_file("docs/CHANGELOG.md", changelog_lines)
    write_file("README.md", readme_lines)
    print("✨ Documentation Complete.")