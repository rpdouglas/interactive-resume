# 📜 Changelog

All notable changes to the **Fresh Nest / Interactive Resume** platform will be documented in this file.

## [v2.5.0-beta] - 2026-01-27
### Added
- **UI:** Added `AnalysisDashboard` with real-time Firestore listeners (`onSnapshot`) for instant feedback.
- **UX:** Implemented "Inline Transformation" animation using `framer-motion` to smoothly reveal results.
- **Visualization:** Added `ScoreGauge` with color-coded match thresholds (Red/Yellow/Green).

## [v2.3.0-beta] - 2026-01-26
### Added
- **Admin:** New `JobTracker` module for inputting raw job descriptions.
- **Data:** Created `applications` collection in Firestore with "Async Trigger" schema (`ai_status: pending`).
- **Security:** Restricted `applications` to Admin-Write/Read only.
- **Testing:** Added environment-mocked unit tests for Admin components.

## [v2.3.0-beta] - 2026-01-26
### Added
- **Admin:** New `JobTracker` module for inputting raw job descriptions.
- **Data:** Created `applications` collection in Firestore with "Async Trigger" schema (`ai_status: pending`).
- **Security:** Locked down `applications` collection (Strict Admin Write / No Public Read).
- **Testing:** Added environment-mocked unit tests for Admin components.

## [v2.2.0-beta] - 2026-01-25
### Added
- **Data Layer:** Implemented `ResumeContext` and `useResumeData` hook for global state management.
- **Offline-First:** Added robust `try/catch` failover. If Firestore is unreachable (or quotas exceeded), the app seamlessly loads local JSON.
- **UX:** Added `LoadingSkeleton` to prevent layout shifts during asynchronous data fetching.
- **Testing:** Added "Indestructible" integration tests verifying the database fallback logic.

## [v2.1.0-beta] - 2026-01-25
### Added
- **Database:** Initialized Cloud Firestore architecture with `profile`, `experience`, `skills`, and `sectors` collections.
- **Security:** Deployed strict `firestore.rules` (Public Read / Admin Write).
- **CMS:** Added `DataSeeder` utility to migrate local JSON data to the cloud.
- **Backend:** configured `firebase.json` for Cloud Functions and Hosting headers.
### Fixed
- **Build:** Fixed critical "Split-React" bundling issue in `vite.config.js` by forcing a singleton React chunk.
- **Auth:** Relaxed COOP/COEP headers to allow Google OAuth popups to function in production.

## [v2.0.0-alpha] - 2026-01-23
### Added
- **Routing:** Implemented `react-router-dom` to bifurcate the app into Public (`/`) and Admin (`/admin`) zones.
- **Security Perimeter:** Integrated Firebase Authentication with strict Email Whitelisting.
- **Admin UI:** Created the `AdminDashboard` shell and `ProtectedRoute` components.
- **Analytics:** Integrated Firebase Analytics for tracking interactions.

## [v1.5.0] - 2026-01-20
### Changed
- **Visualization:** Stabilized `Recharts` implementation for the Skill Radar.
- **Performance:** Optimized `framer-motion` animations for mobile devices.
- **Print Styles:** Added "White Paper" CSS overrides for clean PDF export (`print:hidden`, high-contrast text).

## [v1.0.0] - 2026-01-15 (Gold Master)
### Released
- **Core Platform:** Initial release of the Static Interactive Resume.
- **Tech Stack:** React 19, Vite, Tailwind CSS v4.
- **Features:**
    - Interactive "PAR" Timeline.
    - Skill Radar Chart.
    - Sector Impact Grid.
    - Responsive "Mobile-First" Design.
