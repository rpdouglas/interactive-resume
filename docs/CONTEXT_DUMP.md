# Interactive Resume: Context Dump
**Stack:** React + Vite + Tailwind CSS (v4) + Framer Motion + Recharts
**Test Stack:** Vitest + React Testing Library
**Version:** v0.8.0

## Architecture Rules (STRICT)
1. **SSOT:** Version is controlled by `package.json`.
2. **Styling:** 'Hybrid' approach. CSS Variables for Themes, Tailwind for Utilities.
3. **A11y:** Interactive elements must have `aria-label` or visible text.