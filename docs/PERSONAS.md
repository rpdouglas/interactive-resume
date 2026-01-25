# 👥 Persona-Based Development Model

Our development strategy is guided by specific user archetypes. Features must pass the "Persona Check" before implementation.

---

## 🌍 External Audiences (The Public View)
*Goal: Conversion (Booking an Interview)*

### 1. "The Skimmer" (Technical Recruiter)
* **Goal:** Match keywords to a Job Description in < 10 seconds.
* **Behavior:** Opens link, scans for "Power BI", "React", "15 Years", then leaves.
* **UX Constraint:** **The "Above the Fold" Dashboard.**
    * *Rule:* Key metrics must be visible immediately without scrolling.
    * *Rule:* Zero layout shift. No spinners for critical text.

### 2. "The Narrator" (Hiring Manager / Director)
* **Goal:** Understand the *context* of your career. "Why did he move from Dev to Consulting?"
* **Behavior:** Scrolls down. Reads the bullet points. Looks for business impact.
* **UX Constraint:** **The PAR Timeline.**
    * *Rule:* Experience must be framed as Problem/Action/Result.
    * *Rule:* "Click to expand" interaction to keep the initial view clean.

### 3. "The Skeptic" (Lead Developer / CTO)
* **Goal:** Verify technical competence. "Is this a template or did he build it?"
* **Behavior:** Inspects Element. Looks at the source code. Tests the interactivity.
* **UX Constraint:** **The "Live" Matrix.**
    * *Rule:* Clicking "React" should filter the entire timeline. This proves state management expertise.
    * *Rule:* Code must be clean, typed, and commented (in case they check the repo).

---

## 🔐 Internal Actors (The Admin View)
*Goal: Productivity & Strategy*

### 4. "The Candidate" (The Super Admin - You)
* **Goal:** Manage the job hunt campaign with high velocity and high quality.
* **Pain Point:** Repetitive data entry. rewriting cover letters. losing track of applications.
* **Behavior:** Pastes a JD into the system, expects an instant analysis and tailored assets.
* **UX Constraint:** **Zero Friction Input.**
    * *Rule:* If it takes more than 2 clicks to generate a Cover Letter, the feature has failed.
    * *Rule:* Data Seeding must be idempotent (running it twice shouldn't break things).

### 5. "The Staff Engineer" (The AI Agent)
* **Role:** Gemini 3.0 Integration.
* **Goal:** Act as a strategic career coach and copywriter.
* **Behavior:** Analyzes the gap between *Stored Experience* (Firestore) and *Target Job* (Input).
* **Constraint:** **Hallucination Control.**
    * *Rule:* The AI must strictly cite actual projects from the database. It cannot invent experience.

---

## 📱 Hardware Contexts

### 6. "The Mobile User" (LinkedIn Traffic)
* **Context:** 60% of traffic will come from the LinkedIn mobile app browser.
* **Constraint:** **Thumb-Friendly UI.**
    * *Rule:* Charts must be readable vertically (Adaptive Density).
    * *Rule:* No hover-only tooltips (must be click/tap accessible).
