# Interactive Resume: Context Dump
**Stack:** React + Vite + Tailwind CSS (v4) + Framer Motion + Recharts
**Test Stack:** Vitest + React Testing Library
**Version:** v0.9.0

## Architecture Rules (STRICT)
1. **SSOT:** Version is controlled by `package.json`.
2. **Data:** `src/data/*.json` contains ACTUAL user career history (Do not overwrite with placeholders).
3. **Integrity:** `SchemaValidation.test.js` must pass before any data commit.