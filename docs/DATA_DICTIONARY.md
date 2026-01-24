# 📖 Data Dictionary

## experience.json
| Key | Type | Description |
| :--- | :--- | :--- |
| `id` | String | Unique job ID. |
| `role` | String | Professional title. |
| `projects` | Array | List of engagement objects. |
| `projects.sector` | String | The industry vertical (e.g. Retail). |
| `projects.par` | Object | Problem, Action, Result text blocks. |
| `projects.diagram` | String | Optional Mermaid.js flowchart string. |

## sectors.json
| Key | Type | Description |
| :--- | :--- | :--- |
| `id` | String | Unique sector ID. |
| `label` | String | Display name (Must match project.sector). |
| `icon` | String | Lucide icon name. |
