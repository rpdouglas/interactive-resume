#!/bin/bash

# ==========================================
# 🚀 SPRINT 17.3: ANALYSIS DASHBOARD (UI)
# ==========================================

echo "🎨 Installing Analysis Dashboard & Real-time Logic..."

# 1. Create the Visual Dashboard Component
# ----------------------------------------
echo "📝 Creating src/components/admin/AnalysisDashboard.jsx..."
cat << 'JSX' > src/components/admin/AnalysisDashboard.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, ChevronDown, ChevronUp, AlertCircle, RefreshCw } from 'lucide-react';
import clsx from 'clsx';

/**
 * 📊 Circular Gauge Component
 * Visualizes the 0-100 match score with color coding.
 */
const ScoreGauge = ({ score }) => {
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  
  // Color Logic: <60 Red, 60-79 Yellow, 80+ Green
  const color = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444';

  return (
    <div className="relative flex items-center justify-center">
      <svg width="80" height="80" className="transform -rotate-90">
        <circle cx="40" cy="40" r={radius} stroke="#e2e8f0" strokeWidth="8" fill="transparent" />
        <motion.circle 
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          cx="40" cy="40" r={radius} 
          stroke={color} 
          strokeWidth="8" 
          fill="transparent" 
          strokeDasharray={circumference} 
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-xl font-bold text-slate-800">{score}%</span>
        <span className="text-[8px] uppercase font-bold text-slate-400">Match</span>
      </div>
    </div>
  );
};

const AnalysisDashboard = ({ data, onReset }) => {
  const [copied, setCopied] = useState(false);
  const [showGapAnalysis, setShowGapAnalysis] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(data.tailored_summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Safe Defaults (Defensive Rendering)
  const missingKeywords = data.keywords_missing || [];
  const suggestedProjects = data.suggested_projects || [];

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden flex flex-col h-full"
    >
      {/* 🏆 Header: Score & Quick Stats */}
      <div className="bg-white p-6 border-b border-slate-100 flex items-center gap-6">
        <ScoreGauge score={data.match_score || 0} />
        <div className="flex-1">
          <h3 className="text-lg font-bold text-slate-800">Strategy Report</h3>
          <p className="text-sm text-slate-500">
            {data.match_score >= 80 ? "🚀 High Fit. Apply immediately." : "⚠️ Gaps detected. Tailoring required."}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        
        {/* 🧩 Missing Keywords */}
        {missingKeywords.length > 0 && (
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <AlertCircle size={12} className="text-red-500" /> Critical Gaps
            </label>
            <div className="flex flex-wrap gap-2">
              {missingKeywords.map((kw, i) => (
                <span key={i} className="px-3 py-1 bg-red-50 text-red-600 border border-red-100 rounded-full text-xs font-medium">
                  {kw}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 📝 Tailored Summary */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tailored Executive Summary</label>
            <button 
              onClick={handleCopy} 
              className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 font-medium transition-colors"
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}
              {copied ? "Copied!" : "Copy Text"}
            </button>
          </div>
          <div className="p-4 bg-white rounded-xl border border-slate-200 text-sm text-slate-700 leading-relaxed shadow-sm">
            {data.tailored_summary || "Summary generation failed."}
          </div>
        </div>

        {/* 📂 Relevant Projects */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Suggested Evidence</label>
          <div className="grid grid-cols-1 gap-2">
            {suggestedProjects.map((projId, i) => (
              <div key={i} className="px-3 py-2 bg-blue-50/50 border border-blue-100 rounded-lg text-xs text-blue-800 font-mono">
                {projId}
              </div>
            ))}
          </div>
        </div>

        {/* 🧠 Gap Analysis (Expandable) */}
        <div className="pt-2">
          <button 
            onClick={() => setShowGapAnalysis(!showGapAnalysis)}
            className="w-full flex items-center justify-between p-3 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors text-xs font-bold text-slate-600"
          >
            <span>VIEW STRATEGIC GAP ANALYSIS</span>
            {showGapAnalysis ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          <AnimatePresence>
            {showGapAnalysis && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="p-4 mt-2 bg-slate-100 rounded-lg text-xs text-slate-600 leading-relaxed">
                  {data.gap_analysis || "No detailed analysis provided."}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 🔄 Footer Action */}
      <div className="p-4 bg-white border-t border-slate-100">
        <button 
          onClick={onReset}
          className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors"
        >
          <RefreshCw size={16} /> Start New Application
        </button>
      </div>
    </motion.div>
  );
};

export default AnalysisDashboard;
JSX

# 2. Refactor JobTracker to include the Listener Logic
# ----------------------------------------------------
echo "♻️ Refactoring src/components/admin/JobTracker.jsx..."
cat << 'JSX' > src/components/admin/JobTracker.jsx
import React, { useState, useEffect } from 'react';
import { db } from '../../lib/db';
import { collection, addDoc, serverTimestamp, onSnapshot, doc } from 'firebase/firestore';
import { Briefcase, FileText, Save, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AnalysisDashboard from './AnalysisDashboard';

const JobTracker = () => {
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    raw_text: '',
    source_url: ''
  });
  
  // State Machine: 'idle' | 'saving' | 'analyzing' | 'complete'
  const [viewState, setViewState] = useState('idle');
  const [activeDocId, setActiveDocId] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // 👂 Real-time Listener for the Active Document
  useEffect(() => {
    if (!activeDocId) return;

    console.log(`👂 Listening for updates on: ${activeDocId}`);
    
    const unsubscribe = onSnapshot(doc(db, "applications", activeDocId), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log("🔥 Firestore Update:", data.ai_status);

        if (data.ai_status === 'processing') {
          setViewState('analyzing');
        } 
        else if (data.ai_status === 'complete') {
          setAnalysisResult(data);
          setViewState('complete');
        }
        else if (data.ai_status === 'error') {
          setErrorMsg(data.error_log || "Unknown AI Error");
          setViewState('idle'); // Allow retry
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
    setErrorMsg('');

    try {
      // 1. Write Initial Document
      const payload = {
        ...formData,
        status: 'draft',
        ai_status: 'pending', // ⚡ Trigger the Cloud Function
        created_at: serverTimestamp(),
        updated_at: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, "applications"), payload);
      
      // 2. Set Active ID to trigger Listener
      setActiveDocId(docRef.id);
      
      // 3. UI waits for Listener to flip state to 'analyzing' -> 'complete'

    } catch (err) {
      console.error("Submission Error:", err);
      setErrorMsg(err.message);
      setViewState('idle');
    }
  };

  const handleReset = () => {
    setFormData({ company: '', role: '', raw_text: '', source_url: '' });
    setViewState('idle');
    setActiveDocId(null);
    setAnalysisResult(null);
  };

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col relative">
      <AnimatePresence mode="wait">
        
        {/* 1️⃣ STATE: FORM INPUT (Idle / Saving) */}
        {(viewState === 'idle' || viewState === 'saving') && (
          <motion.div 
            key="form"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm flex-1 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Briefcase className="text-blue-600" size={24} />
                New Application
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Paste a Job Description to initialize the AI analysis pipeline.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Company Name</label>
                  <input type="text" name="company" required value={formData.company} onChange={handleChange} placeholder="e.g. Acme Corp" className="w-full p-3 rounded-lg bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Role Title</label>
                  <input type="text" name="role" required value={formData.role} onChange={handleChange} placeholder="e.g. Senior React Developer" className="w-full p-3 rounded-lg bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                </div>
              </div>
              <div className="space-y-2 flex-1 flex flex-col">
                <label className="text-xs font-bold uppercase text-slate-500 tracking-wider flex justify-between">
                  <span>Job Description (Raw Text)</span>
                </label>
                <div className="relative flex-1">
                  <textarea name="raw_text" required value={formData.raw_text} onChange={handleChange} placeholder="Paste the full job description here..." className="w-full h-64 md:h-96 p-4 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none resize-none font-mono text-sm leading-relaxed" />
                  <div className="absolute right-4 top-4 text-slate-300 pointer-events-none"><FileText size={20} /></div>
                </div>
              </div>
            </form>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 bg-white sticky bottom-0 z-10 flex items-center justify-between">
              <div className="text-sm font-medium text-red-500">{errorMsg}</div>
              <button onClick={handleSubmit} disabled={viewState === 'saving' || !formData.company || !formData.raw_text} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 flex items-center gap-2 transition-all active:scale-95">
                {viewState === 'saving' ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                {viewState === 'saving' ? 'Initializing...' : 'Analyze Job'}
              </button>
            </div>
          </motion.div>
        )}

        {/* 2️⃣ STATE: ANALYZING (Pulsing Brain) */}
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
              <div className="absolute inset-0 flex items-center justify-center text-4xl">🧠</div>
            </div>
            <h3 className="text-xl font-bold text-slate-800">Analyzing Vectors...</h3>
            <p className="text-slate-500 mt-2 max-w-xs mx-auto">
              Comparing your experience against {formData.company}'s requirements.
            </p>
          </motion.div>
        )}

        {/* 3️⃣ STATE: COMPLETE (Dashboard) */}
        {viewState === 'complete' && analysisResult && (
          <motion.div 
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 h-full"
          >
            <AnalysisDashboard data={analysisResult} onReset={handleReset} />
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};

export default JobTracker;
JSX

echo "🎉 Sprint 17.3 UI Installed Successfully."
