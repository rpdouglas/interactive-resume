# Interactive Resume: Platform Context
**Stack:** React 19 + Vite + Tailwind v4 + Firebase (Auth/Analytics/Functions) + Google Secret Manager + Gemini 3.0 Flash
**Version:** v2.1.0-beta

## Architecture Rules (STRICT)
1. **Security:** All `/admin/*` routes must be protected by `ProtectedRoute` and a whitelist check.
2. **SSOT:** Versioning is controlled by `package.json`.
3. **Code Splitting:** Admin components must be `lazy` loaded to keep public performance high.
4. **A11y:** Mobile menu and Auth triggers must maintain `aria-label` compliance.
5. **AI Isolation:** AI Logic must reside in `functions/` to protect API Keys.
