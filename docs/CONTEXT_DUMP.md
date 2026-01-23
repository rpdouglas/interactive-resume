# Interactive Resume: Context Dump
**Stack:** React + Vite + Tailwind CSS (v4) + Framer Motion + Recharts
**Test Stack:** Vitest + React Testing Library
**Version:** v0.6.0

## Component Architecture
* **App (Brain):** Holds `activeSkill` state.
* **Dashboard (Trigger):** Sends click events up.
* **Experience (Receiver):** Filters data based on props.

## Architecture Rules (STRICT)
1. **SSOT:** Version is controlled by `package.json`.
2. **State:** Global interactions live in `App.jsx` (Lifted State).
3. **Testing:** New components require `.test.jsx`.