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
          data-testid="gauge-circle"
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
    if (data.tailored_summary) {
      navigator.clipboard.writeText(data.tailored_summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
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
              aria-label="Copy Summary"
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
