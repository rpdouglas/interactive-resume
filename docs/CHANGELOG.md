# 📜 Changelog

## [v2.2.0-beta] - 2026-01-25
### Added
- **Data Layer:** Implemented `ResumeContext` and `useResumeData` hook.
- **Offline-First:** Added robust `try/catch` failover. If Firestore is unreachable, the app seamlessly loads local JSON.
- **UX:** Added `LoadingSkeleton` to prevent layout shifts during data fetching.
- **Testing:** Added "Indestructible" integration tests verifying the fallback logic.

## [v2.1.0-beta] - 2026-01-25
### Added
- **Database:** Initialized Cloud Firestore architecture.
- **Security:** Deployed strict `firestore.rules`.
- **CMS:** Added `DataSeeder` utility.
### Fixed
- **Build:** Fixed critical "Split-React" bundling issue in `vite.config.js`.
