# 🗄️ Schema Architecture & Data Graph

**Storage Engine:** Cloud Firestore (NoSQL)
**Pattern:** Collection-Centric with Sub-Collections for scalability.

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

## 2. Collection Definitions

### `profile` (Singleton)
* **Path:** `/profile/primary`
* **Purpose:** Stores bio, contact info, and global metrics.
* **Fields:**
  * `basics` (Map): `{ name, label, email, phone, location, website, github }`
  * `metrics` (Map): `{ yearsExperience (Int), projectsDelivered (Int), certifications (Int) }`

### `skills` (Lookup)
* **Path:** `/skills/{categoryId}`
* **Example ID:** `strategy`, `technical`
* **Purpose:** Data source for the Radar Charts.
* **Fields:**
  * `label` (String): Display name (e.g., "Business Strategy")
  * `data` (Array<Map>): List of skill points `{ subject, A (Score), fullMark }`

### `sectors` (Lookup)
* **Path:** `/sectors/{sectorId}`
* **Example ID:** `public`, `retail`
* **Purpose:** Data source for the Sector Grid (Industry Impact).
* **Fields:**
  * `label` (String): Display Name
  * `icon` (String): Lucide-React Icon Name

### `experience` (Core Data)
* **Path:** `/experience/{jobId}`
* **Purpose:** High-level job history.
* **Fields:**
  * `role` (String)
  * `company` (String)
  * `date` (String): Formatted date range.
  * `summary` (String): Short abstract.
  * `logo` (String): Emoji or URL.

### `experience/{jobId}/projects` (Sub-Collection)
* **Path:** `/experience/{jobId}/projects/{projectId}`
* **Purpose:** Granular details for AI analysis and UI expansion. **This is a sub-collection to allow independent querying.**
* **Fields:**
  * `title` (String)
  * `sector` (String): Foreign Key link to `sectors`.
  * `skills` (Array<String>): List of tech used.
  * `par` (Map): `{ problem, action, result }` - The narrative core.
  * `diagram` (String): Mermaid.js graph definition.

## 3. Query Patterns (Planned)
* **Standard Load:** Fetch `profile`, `skills`, `sectors`, and `experience` (collection group query or recursive fetch).
* **AI Analysis:** The Application Manager will perform a `collectionGroup` query on `projects` to find matches based on vector embeddings (Phase 17).
