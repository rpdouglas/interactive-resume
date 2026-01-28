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