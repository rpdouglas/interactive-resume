# 📜 Changelog

## [v2.1.0-beta] - 2026-01-24
### Added
- **CMS:** Added `ProjectArchitect` with Gemini 3.0 Integration.
- **Backend:** Added Firebase Cloud Functions (`functions/`) for secure AI processing.
- **Security:** Implemented `COOP/COEP` headers in `firebase.json` for safe browsing compliance.
- **Auth:** Finalized `VITE_ADMIN_EMAIL` whitelist logic for the protected Admin route.
- **UI:** Added `/admin/architect` with live JSON preview and Mermaid rendering.
### Fixed
- **Visuals:** Resolved `ResponsiveContainer` layout race condition in `SkillRadar` using CSS enforcement (`min-w-0`).

## [v2.0.0-alpha] - 2026-01-23
### Added
- **Bifurcated Routing:** Implemented `react-router-dom` for `/` (Public) and `/admin` (CMS) separation.
- **Security Perimeter:** Integrated Firebase Auth with strict Google Email Whitelisting.
- **Auth Context:** Global `AuthProvider` managing user sessions across the platform.
- **Lazy Loading:** Admin dashboard code-split to optimize public bundle size.
### Fixed
- **Test Sync:** Updated Unit Tests to handle Auth Context dependencies in Header and Footer.
- **Pool Stability:** Optimized Vitest configuration for stable worker forks.
