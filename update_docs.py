import os

# ==========================================
# 🦅 THE JOB WHISPERER: REBRANDING & AUDIT
# ==========================================

# CB represents the triple backticks. 
# We use this variable to prevent breaking the chat interface's formatting.
CB = "```"

def write_file(path, content):
    directory = os.path.dirname(path)
    if directory and not os.path.exists(directory):
        os.makedirs(directory, exist_ok=True)
    try:
        with open(path, "w", encoding="utf-8") as f:
            f.write(content.strip())
        print(f"✅ Updated: {path}")
    except Exception as e:
        print(f"❌ Error writing {path}: {e}")

# ------------------------------------------------------------------
# 1. README.md (Major Overhaul with Diagrams)
# ------------------------------------------------------------------
readme_content = f"""
# 🦅 The Job Whisperer

> **The AI Agent that tailored this resume gets the interview.**

![Version](https://img.shields.io/badge/version-3.2.0--beta-blue.svg)
![Stack](https://img.shields.io/badge/stack-React_19_|_Firebase_|_Gemini-orange.svg)
![Status](https://img.shields.io/badge/status-Production-green.svg)

**The Job Whisperer** is not just a portfolio—it is a self-curating **Career Management System (CMS)**. It uses Google's Gemini 2.5 Flash to analyze Job Descriptions (JDs), identify gaps, rewrite bullet points, and draft cover letters in real-time.

## 🏗️ System Architecture

{CB}mermaid
graph TD
    User[Recruiter / Public] -->|Reads| CDN[Firebase Hosting]
    Admin[You / Candidate] -->|Auth| CMS[Admin Dashboard]
    
    subgraph "The Content Factory (Server-Side)"
        CMS -->|Writes JD| DB[(Cloud Firestore)]
        DB -->|Triggers| CF[Cloud Functions]
        CF -->|Prompt| AI[Gemini 2.5 Flash]
        AI -->|Analysis/Tailoring| DB
    end
    
    subgraph "Client-Side (React 19)"
        DB -->|Real-time Sync| Dashboard[Analysis UI]
        Dashboard -->|Diff View| ResumeTailor[Resume Tailor]
    end
{CB}

## 🚀 Key Features

### 1. 🧠 The Analysis Engine
* **Vector Matching:** Instantly scores your profile against a JD (0-100%).
* **Gap Detection:** Identifies missing keywords (e.g., "Docker", "Kubernetes") and suggests specific projects to highlight.

### 2. 🧵 The Resume Tailor (Diff Engine)
* **Problem:** Generic resumes fail ATS (Applicant Tracking Systems).
* **Solution:** An "Ethical Editor" agent that rewrites your existing bullet points to match the JD's language *without* inventing facts.
* **UI:** Side-by-Side "Diff View" (Red/Green) to review changes before accepting.

### 3. ✍️ The Cover Letter Engine
* **Zero-Shot Generation:** Creates a persuasive, context-aware cover letter in < 5 seconds.
* **PDF Export:** Built-in "White Paper" styling for instant PDF generation.

## 🛠️ Tech Stack & Decisions

| Layer | Technology | Rationale |
| :--- | :--- | :--- |
| **Frontend** | React 19 + Vite | Concurrent rendering for complex dashboards. |
| **Styling** | Tailwind CSS v4 | "Mobile-First" utility classes for speed. |
| **Backend** | Firebase Functions (Gen 2) | Serverless scalability for AI triggers. |
| **Database** | Cloud Firestore | Real-time listeners (`onSnapshot`) for instant UI feedback. |
| **AI Model** | Gemini 2.5 Flash | Low latency (necessary for interactive editing). |

## 👷 Local Development

See [CONTRIBUTING.md](./CONTRIBUTING.md) for setup instructions.

{CB}bash
# Quick Start
npm install
npm run dev
{CB}

## 📜 License
Proprietary. Built by Ryan Douglas.
"""

# ------------------------------------------------------------------
# 2. PROJECT_STATUS.md (Sync with Reality)
# ------------------------------------------------------------------
status_content = """
# 🟢 Project Status: The Job Whisperer

> 🗺️ **Strategy:** See [docs/ROADMAP.md](./ROADMAP.md) for the long-term vision.

**Current Phase:** Phase 20 - The Strategist
**Version:** v3.2.0-beta
**Status:** 🟢 Stable / Feature Complete (Sprint 19)

## 🎯 Current Objectives
* [x] **Sprint 19.1:** The Cover Letter Engine.
* [x] **Sprint 19.2:** The Outreach Bot (Merged into Tailor).
* [x] **Sprint 19.3:** The Resume Tailor (Diff Engine).
* [ ] **Sprint 20.1:** Application Kanban Board (Upcoming).

## 🛑 Known Issues
* Mobile layout for "Diff View" needs optimization on screens < 375px.
* Rate limiting for Gemini API is currently manual.

## ✅ Completed Roadmap
* **Phase 19 (The Content Factory):** [x] Complete suite of Generative AI tools.
* **Phase 17 (Application Manager):** [x] Job Input & Vector Analysis.
* **Phase 16 (Backbone):** [x] Firestore Migration.
* **v1.0.0:** [x] Static Resume Platform.
"""

# ------------------------------------------------------------------
# 3. index.html (Branding)
# ------------------------------------------------------------------
index_html = """
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    
    <title>The Job Whisperer | Ryan Douglas</title>
    <meta name="description" content="The Job Whisperer: AI-Powered Career Management System. Bridging the gap between Strategy and Execution." />
    <meta name="author" content="Ryan Douglas" />
    <meta name="theme-color" content="#0f172a" />

    <meta property="og:type" content="website" />
    <meta property="og:title" content="The Job Whisperer | AI Resume Platform" />
    <meta property="og:description" content="AI-driven resume tailoring and job analysis engine." />
    
    <link rel="preconnect" href="[https://fonts.googleapis.com](https://fonts.googleapis.com)" />
    <link rel="preconnect" href="[https://fonts.gstatic.com](https://fonts.gstatic.com)" crossorigin />
  </head>
  <body class="bg-slate-50 text-slate-900 antialiased">
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
"""

# ------------------------------------------------------------------
# 4. JobTracker.jsx (UI Rebranding)
# ------------------------------------------------------------------
job_tracker = """
import React, { useState, useEffect } from 'react';
import { db } from '../../lib/db';
import { collection, addDoc, serverTimestamp, onSnapshot, doc } from 'firebase/firestore';
import { Briefcase, Save, Loader2, ArrowLeft, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AnalysisDashboard from './AnalysisDashboard';
import CoverLetterGenerator from './CoverLetterGenerator';
import ResumeTailor from './ResumeTailor';

const JobTracker = () => {
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    raw_text: '',
    source_url: ''
  });
  
  const [viewState, setViewState] = useState('idle');
  const [activeTab, setActiveTab] = useState('analysis');
  const [activeDocId, setActiveDocId] = useState(null);
  const [applicationData, setApplicationData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!activeDocId) return;
    const unsubscribe = onSnapshot(doc(db, "applications", activeDocId), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setApplicationData(data);
        
        if (data.ai_status === 'processing') setViewState('analyzing');
        else if (data.ai_status === 'complete') setViewState('complete');
        else if (data.ai_status === 'error') {
          setErrorMsg(data.error_log);
          setViewState('idle');
        }
      }
    });
    return () => unsubscribe();
  }, [activeDocId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setViewState('saving');
    try {
      const payload = { ...formData, status: 'draft', ai_status: 'pending', created_at: serverTimestamp() };
      const docRef = await addDoc(collection(db, "applications"), payload);
      setActiveDocId(docRef.id);
    } catch (err) {
      setErrorMsg(err.message);
      setViewState('idle');
    }
  };

  const handleReset = () => {
    setFormData({ company: '', role: '', raw_text: '', source_url: '' });
    setViewState('idle');
    setActiveDocId(null);
    setApplicationData(null);
    setActiveTab('analysis');
  };

  const TabButton = ({ id, label, colorClass, isActive, onClick }) => (
    <button 
      onClick={onClick} 
      className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${isActive ? 'bg-white shadow ' + colorClass : 'text-slate-500 hover:bg-slate-200'}`}
    >
      {label}
    </button>
  );

  return (
    <div className="max-w-6xl mx-auto h-full flex flex-col relative">
      <AnimatePresence mode="wait">
        
        {/* 1️⃣ FORM INPUT */}
        {(viewState === 'idle' || viewState === 'saving') && (
          <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-white rounded-2xl border border-slate-100 shadow-sm flex-1 flex flex-col overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Bot className="text-blue-600" size={24} /> 
                The Job Whisperer
              </h2>
              <p className="text-xs text-slate-500 mt-1">AI-Powered Application Strategy Engine</p>
            </div>
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input type="text" name="company" required value={formData.company} onChange={handleChange} placeholder="Company Name" className="p-3 rounded-lg bg-slate-50 border border-slate-200 outline-none" />
                <input type="text" name="role" required value={formData.role} onChange={handleChange} placeholder="Role Title" className="p-3 rounded-lg bg-slate-50 border border-slate-200 outline-none" />
              </div>
              <textarea name="raw_text" required value={formData.raw_text} onChange={handleChange} placeholder="Paste Job Description..." className="w-full h-64 p-4 rounded-xl bg-slate-50 border border-slate-200 outline-none resize-none font-mono text-sm" />
            </form>
            <div className="p-4 border-t border-slate-100 bg-white sticky bottom-0 z-10">
              <button onClick={handleSubmit} disabled={viewState === 'saving'} className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center justify-center gap-2">
                {viewState === 'saving' ? <Loader2 className="animate-spin" /> : <Save />} Analyze Job
              </button>
            </div>
          </motion.div>
        )}

        {/* 2️⃣ LOADING */}
        {viewState === 'analyzing' && (
          <motion.div 
            key="loading" 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            exit={{ opacity: 0, scale: 0.9 }} 
            className="flex-1 flex flex-col items-center justify-center bg-white rounded-2xl border border-slate-100 p-8 text-center"
          >
            <div className="relative w-24 h-24 mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-blue-100 animate-ping"></div>
              <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center text-4xl">🦅</div>
            </div>
            <h3 className="text-xl font-bold text-slate-800">The Whisperer is Thinking...</h3>
            <p className="text-slate-500 mt-2 max-w-xs mx-auto">Analyzing vectors for <span className="font-semibold text-blue-600">{formData.company}</span>.</p>
          </motion.div>
        )}

        {/* 3️⃣ WORKSPACE */}
        {viewState === 'complete' && applicationData && (
          <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex-1 flex flex-col h-full bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="flex items-center justify-between px-6 py-3 border-b border-slate-100 bg-slate-50/80">
              <div className="flex gap-2">
                <TabButton id="analysis" label="Strategy & Gaps" colorClass="text-blue-600" isActive={activeTab === 'analysis'} onClick={() => setActiveTab('analysis')} />
                <TabButton id="letter" label="Cover Letter" colorClass="text-purple-600" isActive={activeTab === 'letter'} onClick={() => setActiveTab('letter')} />
                <TabButton id="tailor" label="Resume Tailor" colorClass="text-green-600" isActive={activeTab === 'tailor'} onClick={() => setActiveTab('tailor')} />
              </div>
              <button onClick={handleReset} className="text-slate-400 hover:text-slate-600 flex items-center gap-1 text-xs font-bold uppercase tracking-wider">
                <ArrowLeft size={14} /> New App
              </button>
            </div>
            <div className="flex-1 overflow-hidden bg-slate-50">
              {activeTab === 'analysis' && <AnalysisDashboard data={applicationData} onReset={handleReset} />}
              {activeTab === 'letter' && <CoverLetterGenerator applicationId={activeDocId} applicationData={applicationData} />}
              {activeTab === 'tailor' && <ResumeTailor applicationId={activeDocId} applicationData={applicationData} />}
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};

export default JobTracker;
"""

# ------------------------------------------------------------------
# 5. CONTEXT_DUMP.md (Brand & Logic Update)
# ------------------------------------------------------------------
context_dump = """
# The Job Whisperer: Platform Context
**Stack:** React 19 + Vite + Tailwind v4 + Firebase + Gemini 2.5
**Version:** 3.2.0-beta
**Branding:** "The Job Whisperer"

## 🧠 Coding Standards (The Brain)

### 1. Data & State (SSOT)
* **Public View:** `ResumeContext` is the Single Source of Truth.
* **Admin View:** `JobTracker` manages the "Application State" (JD + Analysis).
* **Deep Fetch:** Recursive fetching is mandatory for nested sub-collections (`projects`).

### 2. AI Architecture (Server-Side)
* **Logic:** All AI operations reside in `functions/index.js` to protect API keys.
    * `analyzeApplication`: Vector Analysis & Gap Detection.
    * `generateCoverLetter`: Content Generation (No Header/Footer).
    * `tailorResume`: Ethical Bullet Point Optimization (Diff Engine).

### 3. UI Patterns
* **Optimistic UI:** Always show a Skeleton or Spinner while waiting for Firestore `onSnapshot`.
* **Mobile First:** All CSS must use Tailwind utility classes targeting mobile first (`w-full md:w-1/2`).

## Directory Structure
* `src/components/admin` -> Job Whisperer UI (JobTracker, ResumeTailor).
* `docs/` -> Documentation as Code (ADRs, Changelogs).
"""

# ==========================================
# 🏁 MAIN EXECUTION
# ==========================================
if __name__ == "__main__":
    print("🦅 Rebranding to 'The Job Whisperer' & Auditing Docs...")
    
    write_file("README.md", readme_content)
    write_file("docs/PROJECT_STATUS.md", status_content)
    write_file("index.html", index_html)
    write_file("src/components/admin/JobTracker.jsx", job_tracker)
    write_file("docs/CONTEXT_DUMP.md", context_dump)
    
    print("\n🎉 Rebrand Complete! 'The Job Whisperer' is live.")