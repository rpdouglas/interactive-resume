# Interactive Resume: Context Dump
**Stack:** React + Vite + Tailwind CSS (v4) + Framer Motion + Recharts + Firebase Analytics
**Test Stack:** Vitest + React Testing Library
**Version:** v0.11.0

## Architecture Rules (STRICT)
1. **SSOT:** Version is controlled by `package.json`.
2. **Hooks:** Logic must be extracted to `src/hooks/*.js` (e.g., `useAnalytics`, `useTypewriter`).
3. **Analytics:** User interactions (clicks/filters) must be logged via `logUserInteraction`.