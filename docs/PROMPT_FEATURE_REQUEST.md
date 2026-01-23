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
