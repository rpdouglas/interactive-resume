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
