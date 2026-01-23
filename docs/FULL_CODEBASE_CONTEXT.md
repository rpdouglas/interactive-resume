# FRESH NEST: CODEBASE DUMP
**Date:** Thu Jan 22 18:12:52 EST 2026
**Description:** Complete codebase context.

## FILE: package.json
```json
{
  "name": "interactive-resume",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "@tailwindcss/vite": "^4.1.18",
    "clsx": "^2.1.1",
    "framer-motion": "^12.29.0",
    "lucide-react": "^0.562.0",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "recharts": "^3.7.0",
    "tailwind-merge": "^3.4.0"
  },
  "devDependencies": {
    "@eslint/js": "^9.39.1",
    "@types/react": "^19.2.5",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^5.1.1",
    "autoprefixer": "^10.4.23",
    "eslint": "^9.39.1",
    "eslint-plugin-react-hooks": "^7.0.1",
    "eslint-plugin-react-refresh": "^0.4.24",
    "globals": "^16.5.0",
    "postcss": "^8.5.6",
    "tailwindcss": "^4.1.18",
    "vite": "^7.2.4"
  }
}

```
---

## FILE: vite.config.js
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})

```
---

## FILE: src/App.css
```css
#root {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.react:hover {
  filter: drop-shadow(0 0 2em #61dafbaa);
}

@keyframes logo-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: no-preference) {
  a:nth-of-type(2) .logo {
    animation: logo-spin infinite 20s linear;
  }
}

.card {
  padding: 2em;
}

.read-the-docs {
  color: #888;
}

```
---

## FILE: src/App.jsx
```jsx
import React from 'react';
import Dashboard from './components/dashboard/Dashboard';

function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-brand-accent selection:text-white">
      <main>
        <Dashboard />
      </main>
      
      {/* Simple Footer */}
      <footer className="text-center py-8 text-slate-400 text-sm">
        <p>© {new Date().getFullYear()} - Built with React & Recharts</p>
      </footer>
    </div>
  );
}

export default App;

```
---

## FILE: src/assets/react.svg
```svg
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--logos" width="35.93" height="32" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 228"><path fill="#00D8FF" d="M210.483 73.824a171.49 171.49 0 0 0-8.24-2.597c.465-1.9.893-3.777 1.273-5.621c6.238-30.281 2.16-54.676-11.769-62.708c-13.355-7.7-35.196.329-57.254 19.526a171.23 171.23 0 0 0-6.375 5.848a155.866 155.866 0 0 0-4.241-3.917C100.759 3.829 77.587-4.822 63.673 3.233C50.33 10.957 46.379 33.89 51.995 62.588a170.974 170.974 0 0 0 1.892 8.48c-3.28.932-6.445 1.924-9.474 2.98C17.309 83.498 0 98.307 0 113.668c0 15.865 18.582 31.778 46.812 41.427a145.52 145.52 0 0 0 6.921 2.165a167.467 167.467 0 0 0-2.01 9.138c-5.354 28.2-1.173 50.591 12.134 58.266c13.744 7.926 36.812-.22 59.273-19.855a145.567 145.567 0 0 0 5.342-4.923a168.064 168.064 0 0 0 6.92 6.314c21.758 18.722 43.246 26.282 56.54 18.586c13.731-7.949 18.194-32.003 12.4-61.268a145.016 145.016 0 0 0-1.535-6.842c1.62-.48 3.21-.974 4.76-1.488c29.348-9.723 48.443-25.443 48.443-41.52c0-15.417-17.868-30.326-45.517-39.844Zm-6.365 70.984c-1.4.463-2.836.91-4.3 1.345c-3.24-10.257-7.612-21.163-12.963-32.432c5.106-11 9.31-21.767 12.459-31.957c2.619.758 5.16 1.557 7.61 2.4c23.69 8.156 38.14 20.213 38.14 29.504c0 9.896-15.606 22.743-40.946 31.14Zm-10.514 20.834c2.562 12.94 2.927 24.64 1.23 33.787c-1.524 8.219-4.59 13.698-8.382 15.893c-8.067 4.67-25.32-1.4-43.927-17.412a156.726 156.726 0 0 1-6.437-5.87c7.214-7.889 14.423-17.06 21.459-27.246c12.376-1.098 24.068-2.894 34.671-5.345a134.17 134.17 0 0 1 1.386 6.193ZM87.276 214.515c-7.882 2.783-14.16 2.863-17.955.675c-8.075-4.657-11.432-22.636-6.853-46.752a156.923 156.923 0 0 1 1.869-8.499c10.486 2.32 22.093 3.988 34.498 4.994c7.084 9.967 14.501 19.128 21.976 27.15a134.668 134.668 0 0 1-4.877 4.492c-9.933 8.682-19.886 14.842-28.658 17.94ZM50.35 144.747c-12.483-4.267-22.792-9.812-29.858-15.863c-6.35-5.437-9.555-10.836-9.555-15.216c0-9.322 13.897-21.212 37.076-29.293c2.813-.98 5.757-1.905 8.812-2.773c3.204 10.42 7.406 21.315 12.477 32.332c-5.137 11.18-9.399 22.249-12.634 32.792a134.718 134.718 0 0 1-6.318-1.979Zm12.378-84.26c-4.811-24.587-1.616-43.134 6.425-47.789c8.564-4.958 27.502 2.111 47.463 19.835a144.318 144.318 0 0 1 3.841 3.545c-7.438 7.987-14.787 17.08-21.808 26.988c-12.04 1.116-23.565 2.908-34.161 5.309a160.342 160.342 0 0 1-1.76-7.887Zm110.427 27.268a347.8 347.8 0 0 0-7.785-12.803c8.168 1.033 15.994 2.404 23.343 4.08c-2.206 7.072-4.956 14.465-8.193 22.045a381.151 381.151 0 0 0-7.365-13.322Zm-45.032-43.861c5.044 5.465 10.096 11.566 15.065 18.186a322.04 322.04 0 0 0-30.257-.006c4.974-6.559 10.069-12.652 15.192-18.18ZM82.802 87.83a323.167 323.167 0 0 0-7.227 13.238c-3.184-7.553-5.909-14.98-8.134-22.152c7.304-1.634 15.093-2.97 23.209-3.984a321.524 321.524 0 0 0-7.848 12.897Zm8.081 65.352c-8.385-.936-16.291-2.203-23.593-3.793c2.26-7.3 5.045-14.885 8.298-22.6a321.187 321.187 0 0 0 7.257 13.246c2.594 4.48 5.28 8.868 8.038 13.147Zm37.542 31.03c-5.184-5.592-10.354-11.779-15.403-18.433c4.902.192 9.899.29 14.978.29c5.218 0 10.376-.117 15.453-.343c-4.985 6.774-10.018 12.97-15.028 18.486Zm52.198-57.817c3.422 7.8 6.306 15.345 8.596 22.52c-7.422 1.694-15.436 3.058-23.88 4.071a382.417 382.417 0 0 0 7.859-13.026a347.403 347.403 0 0 0 7.425-13.565Zm-16.898 8.101a358.557 358.557 0 0 1-12.281 19.815a329.4 329.4 0 0 1-23.444.823c-7.967 0-15.716-.248-23.178-.732a310.202 310.202 0 0 1-12.513-19.846h.001a307.41 307.41 0 0 1-10.923-20.627a310.278 310.278 0 0 1 10.89-20.637l-.001.001a307.318 307.318 0 0 1 12.413-19.761c7.613-.576 15.42-.876 23.31-.876H128c7.926 0 15.743.303 23.354.883a329.357 329.357 0 0 1 12.335 19.695a358.489 358.489 0 0 1 11.036 20.54a329.472 329.472 0 0 1-11 20.722Zm22.56-122.124c8.572 4.944 11.906 24.881 6.52 51.026c-.344 1.668-.73 3.367-1.15 5.09c-10.622-2.452-22.155-4.275-34.23-5.408c-7.034-10.017-14.323-19.124-21.64-27.008a160.789 160.789 0 0 1 5.888-5.4c18.9-16.447 36.564-22.941 44.612-18.3ZM128 90.808c12.625 0 22.86 10.235 22.86 22.86s-10.235 22.86-22.86 22.86s-22.86-10.235-22.86-22.86s10.235-22.86 22.86-22.86Z"></path></svg>
```
---

## FILE: src/components/dashboard/Dashboard.jsx
```jsx
import React from 'react';
import KPIGrid from './KPIGrid';
import SkillRadar from './SkillRadar';
import profileData from '../../data/profile.json';
import skillsData from '../../data/skills.json';

const Dashboard = () => {
  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="mb-8 text-center md:text-left">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
          {profileData.basics.name}
        </h1>
        <p className="text-xl text-slate-500 mt-2">
          {profileData.basics.label}
        </p>
        <p className="text-slate-400 mt-1 max-w-2xl text-sm md:text-base">
          {profileData.basics.summary}
        </p>
      </div>

      {/* KPI Cards */}
      <KPIGrid metrics={profileData.metrics} />

      {/* Analytics Section */}
      <SkillRadar skills={skillsData} />
    </section>
  );
};

export default Dashboard;

```
---

## FILE: src/components/dashboard/KPIGrid.jsx
```jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Award, Briefcase, Layers } from 'lucide-react';
import clsx from 'clsx';

/**
 * Single Metric Card with Count-up Animation
 */
const KPICard = ({ label, value, icon: Icon, delay, color }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow"
    >
      <div className={clsx("p-3 rounded-lg bg-opacity-10", color)}>
        <Icon className={clsx("w-8 h-8", color.replace('bg-', 'text-'))} />
      </div>
      <div>
        <h3 className="text-3xl font-bold text-slate-800">
          {/* Simple count-up animation could go here, for now static for SEO/Speed */}
          {value}
        </h3>
        <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">{label}</p>
      </div>
    </motion.div>
  );
};

/**
 * Grid Container for all metrics
 */
const KPIGrid = ({ metrics }) => {
  const cards = [
    {
      label: "Years Experience",
      value: metrics.yearsExperience + "+",
      icon: Briefcase,
      color: "bg-blue-500 text-blue-600",
      delay: 0.1
    },
    {
      label: "Projects Delivered",
      value: metrics.projectsDelivered,
      icon: Layers,
      color: "bg-emerald-500 text-emerald-600",
      delay: 0.2
    },
    {
      label: "Certifications",
      value: metrics.certifications,
      icon: Award,
      color: "bg-purple-500 text-purple-600",
      delay: 0.3
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {cards.map((card, idx) => (
        <KPICard key={idx} {...card} />
      ))}
    </div>
  );
};

export default KPIGrid;

```
---

## FILE: src/components/dashboard/SkillRadar.jsx
```jsx
import React from 'react';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip
} from 'recharts';
import { motion } from 'framer-motion';

/**
 * Custom Tooltip for the Radar Chart
 */
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 text-white text-xs p-2 rounded shadow-lg opacity-95">
        <p className="font-bold">{label}</p>
        <p>Proficiency: {payload[0].value}%</p>
      </div>
    );
  }
  return null;
};

/**
 * Dual-Zone Radar Chart
 * Visualizes the balance between "Strategy" and "Tech"
 */
const SkillRadar = ({ skills }) => {
  // Merge the two categories for a unified view, or switch based on state
  // For the dashboard, we will display two charts side-by-side on desktop
  // or stacked on mobile.

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {skills.map((category, idx) => (
        <motion.div
          key={category.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 + (idx * 0.1) }}
          className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center"
        >
          <h3 className="text-lg font-bold text-slate-700 mb-4">{category.label}</h3>
          
          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={category.data}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis 
                  dataKey="subject" 
                  tick={{ fill: '#64748b', fontSize: 12 }} 
                />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  name={category.label}
                  dataKey="A"
                  stroke={category.id === 'strategy' ? '#8b5cf6' : '#3b82f6'}
                  fill={category.id === 'strategy' ? '#8b5cf6' : '#3b82f6'}
                  fillOpacity={0.6}
                />
                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default SkillRadar;

```
---

## FILE: src/data/experience.json
```json
[
  {
    "id": "exp-1",
    "role": "Senior Management Consultant",
    "company": "Consulting Firm",
    "period": "2015 - Present",
    "type": "work",
    "skills": ["Business Transformation", "System Implementation", "Change Mgmt"],
    "par": {
      "problem": "Large-scale organizations struggling with inefficient legacy systems and undefined business processes.",
      "action": "Led complex business transformation initiatives, implementing new system architectures and managing stakeholder expectations across multiple departments.",
      "result": "Delivered sustainable operational improvements and successful system migrations for high-value clients."
    }
  },
  {
    "id": "exp-2",
    "role": "Power BI Developer",
    "company": "Freelance / Contract",
    "period": "2022 - Present",
    "type": "work",
    "skills": ["Power BI", "DAX", "Data Visualization"],
    "par": {
      "problem": "Clients possessed vast amounts of data but lacked actionable insights due to poor reporting infrastructure.",
      "action": "Designed and deployed interactive Power BI dashboards, utilizing advanced DAX formulas to calculate custom KPIs.",
      "result": "Enabled data-driven decision-making, reducing reporting time by 40% and identifying key revenue drivers."
    }
  },
  {
    "id": "edu-1",
    "role": "Computer Programmer Graduate",
    "company": "Fanshawe College",
    "period": "2001 - 2003",
    "type": "education",
    "skills": ["Software Development", "Logic", "Foundations"],
    "par": {
      "problem": "N/A",
      "action": "Completed rigorous coursework in computer programming, algorithms, and database management.",
      "result": "Graduated with strong foundational knowledge that bridges the gap between modern consulting and technical execution."
    }
  }
]

```
---

## FILE: src/data/profile.json
```json
{
  "basics": {
    "name": "Your Name",
    "label": "Management Consultant & Power BI Developer",
    "email": "your.email@example.com",
    "phone": "(555) 555-5555",
    "location": "Cornwall, Ontario",
    "summary": "A results-driven Management Consultant with 15 years of experience leading complex business transformation projects. Certified Microsoft Power BI Developer specializing in bridging the gap between strategic business goals and technical data implementations.",
    "website": "https://yourwebsite.com",
    "github": "https://github.com/yourusername",
    "linkedin": "https://linkedin.com/in/yourusername"
  },
  "metrics": {
    "yearsExperience": 15,
    "projectsDelivered": 45,
    "certifications": 2
  }
}

```
---

## FILE: src/data/skills.json
```json
[
  {
    "id": "strategy",
    "label": "Business Strategy",
    "data": [
      { "subject": "Change Mgmt", "A": 95, "fullMark": 100 },
      { "subject": "Stakeholder Analysis", "A": 90, "fullMark": 100 },
      { "subject": "Process Optimization", "A": 85, "fullMark": 100 },
      { "subject": "System Implementation", "A": 90, "fullMark": 100 },
      { "subject": "TOWS Analysis", "A": 80, "fullMark": 100 }
    ]
  },
  {
    "id": "technical",
    "label": "Technical Stack",
    "data": [
      { "subject": "Power BI", "A": 95, "fullMark": 100 },
      { "subject": "DAX / SQL", "A": 85, "fullMark": 100 },
      { "subject": "React / JS", "A": 75, "fullMark": 100 },
      { "subject": "Zoho Analytics", "A": 80, "fullMark": 100 },
      { "subject": "Data Modeling", "A": 90, "fullMark": 100 }
    ]
  }
]

```
---

## FILE: src/index.css
```css
@import "tailwindcss";

@theme {
  /* Migrate custom colors from tailwind.config.js */
  --color-brand-dark: #0f172a;  /* Slate 900 */
  --color-brand-accent: #3b82f6; /* Blue 500 */
  --color-brand-light: #f8fafc; /* Slate 50 */
  
  /* Migrate font family */
  --font-sans: "Inter", system-ui, sans-serif;
}

/* Apply base styles using the new variables.
   Note: In v4, we use the variables we just defined in the theme.
*/
body {
  background-color: var(--color-brand-light);
  color: var(--color-brand-dark);
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

```
---

## FILE: src/main.jsx
```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

```
---

## FILE: docs/CONTEXT_DUMP.md
```md
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

```
---

## FILE: docs/PERSONAS.md
```md
# 👥 Target Audience & UX Constraints

> **Goal:** Convince three distinct types of viewers to book an interview.

---

### 1. "The Skimmer" (Technical Recruiter)
* **Goal:** Match keywords to a Job Description in < 10 seconds.
* **Behavior:** Opens link, scans for "Power BI", "React", "15 Years", then leaves.
* **Constraint:** **The "Above the Fold" Dashboard.**
    * *Rule:* Key metrics (Years Exp, Top Skills) must be visible immediately without scrolling.
    * *Rule:* No "Enter Site" loading screens. Instant access.

### 2. "The Narrator" (Hiring Manager / Director)
* **Goal:** Understand the *context* of your career. "Why did he move from Dev to Consulting?"
* **Behavior:** Scrolls down. Reads the bullet points. Looks for business impact.
* **Constraint:** **The PAR Timeline.**
    * *Rule:* Experience must be framed as Problem/Action/Result.
    * *Rule:* "Click to expand" interaction to keep the initial view clean.

### 3. "The Skeptic" (Lead Developer / CTO)
* **Goal:** Verify technical competence. "Is this a template or did he build it?"
* **Behavior:** Inspects Element. Looks at the source code. Tests the interactivity.
* **Constraint:** **The "Live" Matrix.**
    * *Rule:* Clicking "React" should filter the entire timeline. This proves state management expertise.
    * *Rule:* Code must be clean, typed, and commented.

---

### 4. "The Mobile User" (LinkedIn Traffic)
* **Context:** 60% of traffic will come from the LinkedIn mobile app browser.
* **Constraint:** **Thumb-Friendly UI.**
    * *Rule:* Charts must be readable vertically.
    * *Rule:* No hover-only tooltips (must be click/tap accessible).

```
---

## FILE: docs/PROJECT_STATUS.md
```md
# 📌 Project Status: Interactive Resume

**Current Phase:** Phase 1 - Scaffolding & Data Entry
**Version:** v0.1.0
**Context:** Personal Brand Building / Job Hunt

> **Mission:** To demonstrate Management Consulting and Power BI expertise through a React-based interactive application.

## 🎯 Current Sprint: Foundation
* [x] Project Scaffolding (Vite/React/Tailwind)
* [x] Methodology Documentation Setup
* [ ] **Data Entry:** Populate `src/data/experience.json` and `skills.json` with actual resume content.
* [ ] **Component:** Build the basic `Dashboard` layout.

## 📋 Product Backlog
### Phase 2: The Dashboard
* Implement "Hybrid Radar Chart" (Tech vs. Strategy).
* Implement KPI Cards (Years, Certs, Projects).

### Phase 3: The Timeline
* Build Vertical Timeline component.
* Implement "Scroll Spy" to update Dashboard based on scroll position.

### Phase 4: The Matrix
* Implement Cross-Filtering (Clicking a skill filters the timeline).

```
---

## FILE: docs/PROMPT_APPROVAL.md
```md
# ✅ AI Approval & Execution Prompt (Builder Mode)

**Instructions:**
Use this prompt **after** the AI has presented the 3 Architectural Options. This signals approval for a specific approach and triggers code generation.

---

### **Prompt Template**

**Decision:** I approve **Option [INSERT OPTION NUMBER]: [INSERT OPTION NAME]**. Proceed with implementation.

**Strict Technical Constraints (The "Builder" Standard):**
1.  **Execution First:** Output a single **Bash Script** (`install_feature.sh`) that:
    * Creates/Updates all necessary files.
    * Installs any missing dependencies (`npm install ...`).
    * Uses `cat << 'EOF'` patterns to write file contents safely.
2.  **Code Quality:**
    * **NO Placeholders:** Never use `// ... rest of code`.
    * **Type Safety:** Use PropType checks or clean Interface definitions.
    * **Comments:** Include JSDoc comments explaining *complex* logic (e.g., the Radar chart coordinate math).
3.  **Responsiveness:**
    * **Mobile Parity:** If a chart is too wide for mobile, provide a fallback or a responsive container logic.
    * **Tailwind:** Use `clsx` and `tailwind-merge` for dynamic classes.

**Persona Validation (The "Self-Correction" Step):**
Before generating the script, verify the code against our Personas:
* **The Skimmer:** Is the data visible immediately? (No artificial delays > 0.5s).
* **The Mobile User:** Will this overflow horizontally on a 375px screen?
* **The Skeptic:** Are we using crisp SVGs (Recharts)?

**Output Requirements:**

1.  **The "One-Shot" Installer:**
    * A single bash script block.
    * *Note:* Escape special characters (`$`) correctly for bash.

2.  **Manual Verification Steps:**
    * A brief bulleted list of what I should see when I run `npm run dev` after installing.

*Please generate the installation script now.*


```
---

## FILE: docs/PROMPT_FEATURE_REQUEST.md
```md
# 📝 AI Feature Request Prompt (Architect Mode)

**Instructions:**
1.  Copy your current codebase context.
2.  Fill in the feature details in the bracketed sections `[ ... ]`.
3.  Send the *entire* text below to the AI.

---

### **Prompt Template**

**Role:** You are the Senior Lead Developer & UI Architect for my Interactive Resume.
**Task:** Analyze the requirements for a new feature and propose architectural solutions.

**Feature Request:** [INSERT FEATURE NAME]

**Context:**
I need to add a module that [DESCRIBE FUNCTION].
*Current State:* [Briefly describe relevant existing code.]

**Core Requirements:**

1.  **👥 The Persona Check:**
    * **The Skimmer:** Does this convey value in < 5 seconds?
    * **The Mobile User:** Is the touch-target size appropriate (44px+)? Does it reflow without scrolling?
    * **The Skeptic:** Is the implementation clean, typed, and performant?

2.  **Constraints & Tech Strategy:**
    * **HTML5 Canvas vs. SVG:** Use the best tool for the job.
        * *SVG (Recharts):* Preferred for standard charts where text crispness and accessibility are priority.
        * *HTML5 Canvas (Three.js/WebGL):* Encouraged for high-performance animations, particle effects, or 3D elements.
    * **Data Separation:** No hardcoded text; use `src/data/*.json`.
    * **Responsiveness:** Mobile-first architecture.

**🛑 STOP & THINK: Architectural Options**
Do **NOT** write code yet. Instead, analyze the request and propose **3 Distinct Approaches**:

1.  **The "High-Impact" Approach:** Prioritizes visual "wow" factor (often uses Canvas/WebGL).
2.  **The "Performance" Approach:** Prioritizes Lighthouse scores, accessibility, and lightweight DOM.
3.  **The "Balanced" Approach:** The sweet spot between visual appeal and engineering rigor.

**Your Output Deliverable:**
1.  **Analysis:** A brief breakdown of the UX challenges for this specific feature.
2.  **The Options Table:** Compare the 3 approaches based on:
    * *Tech Stack / Libraries needed*
    * *Complexity (Low/Med/High)*
    * *Pros & Cons*
3.  **Recommendation:** Select one approach and explain *why* it fits the "Medium is the Message" philosophy best.
4.  **Wait:** End your response by asking for approval to proceed.

---

**Codebase Context:**
[PASTE_CODEBASE_HERE]

```
---

## FILE: docs/PROMPT_INITIALIZATION.md
```md
# 🤖 AI Session Initialization Prompt

**Instructions:**
1.  Run a script (or copy manually) to grab the `src/` folder context.
2.  Paste the **Codebase Context** into the bottom of this prompt.
3.  Send the *entire* block below to your AI assistant.

---

**Role:** You are the Senior React Developer and UI Architect for the "Interactive Resume" project.

**Input:** I am providing the full codebase context below.

**Your Goal:** Ingest this context to completely understand our:
* **Tech Stack:** React (Vite), Tailwind CSS, Framer Motion, Recharts.
* **Methodology:** "The Medium is the Message." The code must be clean, performant, and demonstrate senior-level capability.
* **Structure:** Data is strictly separated in `src/data/*.json`. Components are functional and concise.

**Critical Rules for Interaction:**
1.  **NO Placeholders:** Never use `// ... rest of code`. Provide **COMPLETE FILES**.
2.  **No Canvas (Default):** Use DOM/SVG for interactions unless explicitly asked for 3D/WebGl.
3.  **Comments:** Every major code block must include a descriptive comment (per user preference).
4.  **Responsive:** Mobile-first checks are mandatory.

**Codebase Context:**
[PASTE_FULL_CODEBASE_CONTEXT_HERE]

**Reply "Context Received. Ready to build." if you understand.**

```
---

## FILE: scripts/generate-context.sh
```sh
#!/bin/bash

# ==========================================
# 🚀 FRESH NEST: DEEP CONTEXT GENERATOR
# ==========================================

OUTPUT_FILE="docs/FULL_CODEBASE_CONTEXT.md"

echo "🔄 Generating Context Dump..."
echo "# FRESH NEST: CODEBASE DUMP" > "$OUTPUT_FILE"
echo "**Date:** $(date)" >> "$OUTPUT_FILE"
echo "**Description:** Complete codebase context." >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

ingest_file() {
    local filepath="$1"
    
    # SECURITY CHECK: Skip if file matches sensitive patterns
    if [[ "$filepath" == *".env"* ]] || [[ "$filepath" == *"service-account"* ]] || [[ "$filepath" == *".DS_Store"* ]]; then
        return
    fi

    if [ -f "$filepath" ]; then
        echo "Processing: $filepath"
        
        # Markdown Header for the file
        echo "## FILE: $filepath" >> "$OUTPUT_FILE"
        echo "\`\`\`${filepath##*.}" >> "$OUTPUT_FILE" # Use extension for syntax highlighting
        
        # Cat the content
        cat "$filepath" >> "$OUTPUT_FILE"
        
        echo "" >> "$OUTPUT_FILE"
        echo "\`\`\`" >> "$OUTPUT_FILE"
        echo "---" >> "$OUTPUT_FILE"
        echo "" >> "$OUTPUT_FILE"
    fi
}

# Root Configs
ingest_file "package.json"
ingest_file "vite.config.js"
ingest_file "tailwind.config.js"
ingest_file "firebase.json"
ingest_file ".firebaserc"

# Source Code
find src -type f -not -path "*/.*" | sort | while read file; do ingest_file "$file"; done

# Documentation
find docs -type f -name "*.md" -not -name "FULL_CODEBASE_CONTEXT.md" | sort | while read file; do ingest_file "$file"; done

# Scripts
find scripts -type f \( -name "*.js" -o -name "*.cjs" -o -name "*.sh" \) | sort | while read file; do ingest_file "$file"; done

# CI/CD Workflows
find .github/workflows -type f -name "*.yml" | sort | while read file; do ingest_file "$file"; done

echo "✅ Context Generated at: $OUTPUT_FILE"

```
---

## FILE: scripts/update_data.sh
```sh
#!/bin/bash

# ==========================================
# 💾 Interactive Resume: Data Layer Setup
# ==========================================
# Description: Populates src/data with JSON files for Profile, Skills, and Experience.

DATA_DIR="src/data"

echo "📂 Ensuring $DATA_DIR exists..."
mkdir -p "$DATA_DIR"

# ------------------------------------------
# 1. PROFILE.JSON
# ------------------------------------------
echo "writing $DATA_DIR/profile.json..."
cat << 'EOF' > "$DATA_DIR/profile.json"
{
  "basics": {
    "name": "Your Name",
    "label": "Management Consultant & Power BI Developer",
    "email": "your.email@example.com",
    "phone": "(555) 555-5555",
    "location": "Cornwall, Ontario",
    "summary": "A results-driven Management Consultant with 15 years of experience leading complex business transformation projects. Certified Microsoft Power BI Developer specializing in bridging the gap between strategic business goals and technical data implementations.",
    "website": "https://yourwebsite.com",
    "github": "https://github.com/yourusername",
    "linkedin": "https://linkedin.com/in/yourusername"
  },
  "metrics": {
    "yearsExperience": 15,
    "projectsDelivered": 45,
    "certifications": 2
  }
}
EOF

# ------------------------------------------
# 2. SKILLS.JSON
# ------------------------------------------
echo "writing $DATA_DIR/skills.json..."
cat << 'EOF' > "$DATA_DIR/skills.json"
[
  {
    "id": "strategy",
    "label": "Business Strategy",
    "data": [
      { "subject": "Change Mgmt", "A": 95, "fullMark": 100 },
      { "subject": "Stakeholder Analysis", "A": 90, "fullMark": 100 },
      { "subject": "Process Optimization", "A": 85, "fullMark": 100 },
      { "subject": "System Implementation", "A": 90, "fullMark": 100 },
      { "subject": "TOWS Analysis", "A": 80, "fullMark": 100 }
    ]
  },
  {
    "id": "technical",
    "label": "Technical Stack",
    "data": [
      { "subject": "Power BI", "A": 95, "fullMark": 100 },
      { "subject": "DAX / SQL", "A": 85, "fullMark": 100 },
      { "subject": "React / JS", "A": 75, "fullMark": 100 },
      { "subject": "Zoho Analytics", "A": 80, "fullMark": 100 },
      { "subject": "Data Modeling", "A": 90, "fullMark": 100 }
    ]
  }
]
EOF

# ------------------------------------------
# 3. EXPERIENCE.JSON
# ------------------------------------------
echo "writing $DATA_DIR/experience.json..."
cat << 'EOF' > "$DATA_DIR/experience.json"
[
  {
    "id": "exp-1",
    "role": "Senior Management Consultant",
    "company": "Consulting Firm",
    "period": "2015 - Present",
    "type": "work",
    "skills": ["Business Transformation", "System Implementation", "Change Mgmt"],
    "par": {
      "problem": "Large-scale organizations struggling with inefficient legacy systems and undefined business processes.",
      "action": "Led complex business transformation initiatives, implementing new system architectures and managing stakeholder expectations across multiple departments.",
      "result": "Delivered sustainable operational improvements and successful system migrations for high-value clients."
    }
  },
  {
    "id": "exp-2",
    "role": "Power BI Developer",
    "company": "Freelance / Contract",
    "period": "2022 - Present",
    "type": "work",
    "skills": ["Power BI", "DAX", "Data Visualization"],
    "par": {
      "problem": "Clients possessed vast amounts of data but lacked actionable insights due to poor reporting infrastructure.",
      "action": "Designed and deployed interactive Power BI dashboards, utilizing advanced DAX formulas to calculate custom KPIs.",
      "result": "Enabled data-driven decision-making, reducing reporting time by 40% and identifying key revenue drivers."
    }
  },
  {
    "id": "edu-1",
    "role": "Computer Programmer Graduate",
    "company": "Fanshawe College",
    "period": "2001 - 2003",
    "type": "education",
    "skills": ["Software Development", "Logic", "Foundations"],
    "par": {
      "problem": "N/A",
      "action": "Completed rigorous coursework in computer programming, algorithms, and database management.",
      "result": "Graduated with strong foundational knowledge that bridges the gap between modern consulting and technical execution."
    }
  }
]
EOF

echo "✅ Data Layer Updated Successfully!"
```
---

