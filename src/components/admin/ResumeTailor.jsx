import React from 'react';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/db';
import { Wand2, Loader2, Copy, Check, ArrowRight, ArrowDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ResumeTailor = ({ applicationId, applicationData }) => {
  const [copiedIndex, setCopiedIndex] = React.useState(null);

  const handleGenerate = async () => {
    if (!applicationId) return;
    try {
      await updateDoc(doc(db, "applications", applicationId), {
        tailor_status: 'pending',
        tailored_bullets: [] // Clear old
      });
    } catch (err) {
      console.error("Trigger Failed:", err);
    }
  };

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const status = applicationData.tailor_status || 'idle';
  const suggestions = applicationData.tailored_bullets || [];

  return (
    <div className="h-full flex flex-col bg-slate-50">
      
      {/* 🛠️ Toolbar */}
      <div className="p-4 bg-white border-b border-slate-200 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
            <Wand2 size={20} />
          </div>
          <div>
            <h3 className="font-bold text-slate-700">Resume Tailor</h3>
            <p className="text-xs text-slate-400">AI-Powered Keyword Injection</p>
          </div>
        </div>
        
        {status === 'processing' ? (
          <span className="flex items-center gap-2 text-sm text-purple-600 font-medium px-4 py-2 bg-purple-50 rounded-lg animate-pulse">
            <Loader2 size={16} className="animate-spin" /> Optimizing History...
          </span>
        ) : (
          <button 
            onClick={handleGenerate}
            className="px-4 py-2 text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg flex items-center gap-2 transition-all shadow-md active:scale-95"
          >
            <Wand2 size={16} /> {suggestions.length > 0 ? 'Re-Optimize' : 'Auto-Tailor Resume'}
          </button>
        )}
      </div>

      {/* 📄 Canvas */}
      <div className="flex-1 overflow-y-auto p-6">
        {suggestions.length === 0 && status !== 'processing' && (
          <div className="h-full flex flex-col items-center justify-center text-slate-400">
            <Wand2 size={48} className="mb-4 opacity-20" />
            <p className="text-sm">Click "Auto-Tailor" to generate ATS-optimized bullet points.</p>
          </div>
        )}

        <div className="space-y-6 max-w-5xl mx-auto">
          <AnimatePresence>
            {suggestions.map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
              >
                {/* Header: Reasoning */}
                <div className="bg-slate-50 px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                    🎯 Strategy: <span className="text-slate-700 normal-case">{item.reasoning}</span>
                  </span>
                  <span className="text-[10px] font-bold px-2 py-1 bg-green-100 text-green-700 rounded-full">
                    {item.confidence}% Match
                  </span>
                </div>

                {/* Diff View */}
                <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-0 md:gap-0">
                  
                  {/* Left: Original */}
                  <div className="p-5 bg-red-50/30 text-slate-600 border-b md:border-b-0 md:border-r border-slate-100 relative group">
                    <span className="absolute top-2 left-2 text-[10px] font-bold text-red-400 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Original</span>
                    <p className="text-sm leading-relaxed">{item.original}</p>
                  </div>

                  {/* Arrow Indicator */}
                  <div className="bg-slate-50 flex items-center justify-center p-2 text-slate-300 border-b md:border-b-0 md:border-r border-slate-100">
                    <ArrowRight size={16} className="hidden md:block" />
                    <ArrowDown size={16} className="block md:hidden" />
                  </div>

                  {/* Right: Optimized */}
                  <div className="p-5 bg-green-50/30 text-slate-800 relative group">
                    <span className="absolute top-2 left-2 text-[10px] font-bold text-green-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Optimized</span>
                    <p className="text-sm leading-relaxed font-medium">{item.optimized}</p>
                    
                    {/* Copy Button */}
                    <button 
                      onClick={() => handleCopy(item.optimized, idx)}
                      className="absolute bottom-2 right-2 p-2 bg-white border border-green-200 text-green-600 rounded-lg hover:bg-green-50 transition-colors shadow-sm"
                      title="Copy to Clipboard"
                    >
                      {copiedIndex === idx ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                  </div>

                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ResumeTailor;
