# 🗄️ Schema Architecture & Data Graph

**Storage Engine:** Cloud Firestore (NoSQL)
**Pattern:** Collection-Centric with Sub-Collections.

## 1. High-Level Topology
```mermaid
graph TD
    root[🔥 Firestore Root]
    
    %% Top Level Collections
    root --> profile[📂 profile]
    root --> skills[📂 skills]
    root --> sectors[📂 sectors]
    root --> experience[📂 experience]
    
    %% Relationships
    experience --> job[📄 Job Document]
    job --> projects[📂 projects (Sub-Collection)]
    projects --> project[📄 Project Document]
```

## 2. The "Deep Fetch" Strategy (CRITICAL)
**Firestore queries are shallow.** Fetching a Job document **DOES NOT** automatically fetch its `projects` sub-collection.

### The Client-Side Join Pattern
Any component displaying Experience (e.g., `ResumeContext`) **MUST** implement this recursive logic:
1.  Fetch all `experience` documents.
2.  Map over the results.
3.  For *each* job, perform a second `getDocs` call to its `projects` sub-collection.
4.  Merge the `projects` array into the parent job object.
5.  Return the hydrated tree.

**❌ BAD (Will Result in Empty Projects):**
```javascript
const jobs = await getDocs(collection(db, 'experience'));
return jobs.docs.map(d => d.data());
```

**✅ GOOD (Hydrated):**
```javascript
const jobs = await Promise.all(snapshot.docs.map(async (doc) => {
  const projects = await getDocs(collection(doc.ref, 'projects'));
  return { ...doc.data(), projects: projects.docs.map(p => p.data()) };
}));
```

## 3. The "Indestructible" Fallback
We implement a **Hybrid Data Strategy**:
1.  **Attempt:** Fetch from Firestore.
2.  **Catch:** If *any* error occurs (Quota, Offline, Rules), swallow the error and return `src/data/*.json`.
3.  **Result:** The app never crashes, even if the database is down.

## 4. Application Schema (Phase 19)
The `applications` collection is the core of the Content Factory.
* **Document ID:** Auto-generated.
* **Fields:**
    * `company` (string)
    * `role` (string)
    * `raw_text` (string) - Original JD.
    * `ai_status` (string) - 'pending' | 'processing' | 'complete' | 'error'
    * `match_score` (number)
    * `gap_analysis` (array<string>) - Structured list of missing skills.
    * `cover_letter_status` (string) - 'idle' | 'pending' | 'writing' | 'complete'
    * `cover_letter_text` (string) - Markdown/Text content.


### Application Schema (`applications/{id}`)
* **Note:** `resume_snapshot` logic is defined here but implemented in Sprint 19.4.
* `tailor_status`: 'idle' | 'pending' | 'processing' | 'complete' | 'error'
* `tailored_bullets`: Array of Objects
    * `original`: String
    * `optimized`: String
    * `reasoning`: String
    * `confidence`: Number (0-100)
