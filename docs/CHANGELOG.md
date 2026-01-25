# 📜 Changelog

## [v2.1.0-beta] - 2026-01-25
### Added
- **Database:** Initialized Cloud Firestore architecture (`src/lib/db.js`).
- **Security:** Deployed strict `firestore.rules` (Public Read / Admin Write).
- **CMS:** Added `DataSeeder` utility to migrate local JSON to Firestore.
- **Backend:** Added Firebase Cloud Functions (`functions/`) for secure AI processing.
### Fixed
- **Build:** Fixed critical "Split-React" bundling issue in `vite.config.js` by forcing a React singleton chunk.
- **Visuals:** Resolved `ResponsiveContainer` layout race condition in `SkillRadar`.

## [v2.0.0-alpha] - 2026-01-23
### Added
- **Bifurcated Routing:** Implemented `react-router-dom` for `/` (Public) and `/admin` (CMS) separation.
- **Security Perimeter:** Integrated Firebase Auth with strict Google Email Whitelisting.
