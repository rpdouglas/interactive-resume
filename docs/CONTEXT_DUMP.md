# Interactive Resume: Context Dump
**Stack:** React + Vite + Tailwind CSS (v4) + Framer Motion + Recharts
**Test Stack:** Vitest + React Testing Library
**Version:** v0.10.0

## Architecture Rules (STRICT)
1. **SSOT:** Version is controlled by `package.json`.
2. **Data Structure:** `Experience -> Jobs -> [Projects]`. Do not revert to flat list.
3. **Interaction:** Filtering a skill MUST auto-expand the relevant job card.