# Interactive Resume: Context Dump
**Stack:** React + Vite + Tailwind CSS + Framer Motion + Recharts
**Version:** v0.1.0 (Scaffolding)
**Architecture:** Single Page Application (SPA) with Section-based Navigation.

## 🧠 The "Prime Directive"
**The Medium is the Message.**
This website is not just a resume; it is a demonstration of the skills listed on the resume.
1.  **Clarity First:** Animations must serve the data, not distract from it.
2.  **Performance:** 100/100 Lighthouse score is a requirement.
3.  **Responsiveness:** Must look as good on a phone (Recruiter in an Uber) as on a Desktop (CTO in office).

## Architecture Rules (STRICT)
1.  **Data-Driven:** All content (Jobs, Skills, Projects) must be separated into JSON files (`src/data/`). No hardcoded HTML text.
2.  **No "Canvas" (Mostly):** Use DOM/SVG for charts (Recharts) to ensure accessibility and crisp text. Use Canvas only for the "Data Universe" 3D visualization if implemented later.
3.  **Component Modularity:** `Dashboard`, `Timeline`, and `Matrix` must be isolated features.
4.  **No Partial Updates:** Code provided by AI must always be full file contents.

## Data Schema (JSON Strategy)
- **`profile.json`**: Name, Title, Bio, Social Links.
- **`skills.json`**: Categories (Tech, Strategy), Proficiency (0-100), Years Experience.
- **`experience.json`**: Array of Roles.
    - `company`, `role`, `dates`, `logo`
    - `par`: { `problem`: "...", `action`: "...", `result`: "..." } (The Consulting Format)
    - `techStack`: Array of skill IDs used in this role.
