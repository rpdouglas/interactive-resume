import React, { useState } from 'react';
import { db } from '../../lib/db';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Briefcase, FileText, Save, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const JobTracker = () => {
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    raw_text: '',
    source_url: ''
  });
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    try {
      // 💾 Data Strategy: Async Trigger Pattern
      // We purposefully set 'ai_status' to 'pending' to trigger future Cloud Functions
      const payload = {
        ...formData,
        status: 'draft',
        ai_status: 'pending', // ⚡ The trigger for Sprint 17.2
        ai_analysis: null,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp()
      };

      await addDoc(collection(db, "applications"), payload);

      // Reset Form
      setFormData({ company: '', role: '', raw_text: '', source_url: '' });
      setStatus('success');
      
      // Auto-dismiss success message after 3s
      setTimeout(() => setStatus('idle'), 3000);

    } catch (err) {
      console.error("Firestore Write Failed:", err);
      setErrorMsg(err.message);
      setStatus('error');
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex-1 flex flex-col overflow-hidden">
        
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

        {/* Scrollable Form Area */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Company Name</label>
              <input 
                type="text" 
                name="company"
                required
                value={formData.company}
                onChange={handleChange}
                placeholder="e.g. Acme Corp"
                className="w-full p-3 rounded-lg bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Role Title</label>
              <input 
                type="text" 
                name="role"
                required
                value={formData.role}
                onChange={handleChange}
                placeholder="e.g. Senior React Developer"
                className="w-full p-3 rounded-lg bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-2 flex-1 flex flex-col">
            <label className="text-xs font-bold uppercase text-slate-500 tracking-wider flex justify-between">
              <span>Job Description (Raw Text)</span>
              <span className="text-[10px] text-blue-500 font-normal">Auto-Expanding</span>
            </label>
            <div className="relative flex-1">
              <textarea 
                name="raw_text"
                required
                value={formData.raw_text}
                onChange={handleChange}
                placeholder="Paste the full job description here..."
                className="w-full h-64 md:h-96 p-4 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none resize-none font-mono text-sm leading-relaxed"
              />
              <div className="absolute right-4 top-4 text-slate-300 pointer-events-none">
                <FileText size={20} />
              </div>
            </div>
          </div>

        </form>

        {/* 📱 Sticky Footer Action Bar */}
        <div className="p-4 border-t border-slate-100 bg-white sticky bottom-0 z-10 flex items-center justify-between">
          <div className="text-sm font-medium">
            {status === 'success' && <span className="text-emerald-600 flex items-center gap-2"><CheckCircle size={16}/> Saved to Drafts</span>}
            {status === 'error' && <span className="text-red-500 flex items-center gap-2"><AlertCircle size={16}/> {errorMsg || "Save Failed"}</span>}
          </div>

          <button
            onClick={handleSubmit}
            disabled={status === 'loading' || !formData.company || !formData.raw_text}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 flex items-center gap-2 transition-all active:scale-95"
          >
            {status === 'loading' ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            {status === 'loading' ? 'Saving...' : 'Save Application'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default JobTracker;
