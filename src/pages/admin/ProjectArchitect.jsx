import React, { useState } from 'react';
import { architectProject } from '../../lib/firebase';
import { Sparkles, Copy, RefreshCw, AlertCircle } from 'lucide-react';
import TimelineCard from '../../components/timeline/TimelineCard';

const ProjectArchitect = () => {
  const [rawText, setRawText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleArchitect = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await architectProject({ rawText });
      
      console.log("🤖 Raw Cloud Function Response:", response);

      // ✅ FIX: Intelligent Unwrapping (Handle double wrapping)
      // The function returns { data: ... }, and the SDK puts that in response.data
      const payload = response.data.data || response.data;
      
      console.log("📦 Unwrapped Payload:", payload);
      setResult(payload);

    } catch (err) {
      const msg = err.message || "AI generation failed. Check your API key or connection.";
      setError(msg);
      console.error("Architect Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-full gap-6">
      {/* Left: Input Pane */}
      <div className="flex-1 flex flex-col gap-4">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex-1 flex flex-col">
          <label className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">
            Raw Project Notes
          </label>
          <textarea
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            placeholder="e.g. I worked at PwC and we built a Power BI dashboard for a client in Toronto. It helped them track their logistics costs and saved them 20% on shipping..."
            className="flex-1 w-full p-4 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-slate-700 resize-none"
          />
          <button
            onClick={handleArchitect}
            disabled={loading || !rawText}
            className="mt-4 w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 transition-all"
          >
            {loading ? <RefreshCw className="animate-spin" /> : <Sparkles size={18} />}
            {loading ? "Architecting..." : "Architect with Gemini"}
          </button>
        </div>
      </div>

      {/* Right: Live Preview Pane */}
      <div className="flex-1 flex flex-col gap-4">
        <div className="bg-slate-900 p-6 rounded-2xl shadow-xl flex-1 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Live Preview
            </label>
            {result && (
              <button 
                onClick={() => navigator.clipboard.writeText(JSON.stringify(result, null, 2))}
                className="text-xs text-blue-400 hover:text-white flex items-center gap-1"
              >
                <Copy size={12} /> Copy JSON
              </button>
            )}
          </div>

          {result ? (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
               <TimelineCard 
                 data={{
                   role: "Preview Output",
                   company: "AI Generated",
                   date: "Today",
                   summary: "Formatting of your raw notes completed successfully.",
                   projects: [result] // Result is now the properly unwrapped project object
                 }}
                 index={0}
                 activeFilter={null}
               />
            </div>
          ) : error ? (
            <div className="h-full flex flex-col items-center justify-center text-red-400 gap-2">
              <AlertCircle size={40} className="opacity-20" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-600 italic">
              <Sparkles size={40} className="mb-4 opacity-10" />
              <p className="text-sm">Enter notes on the left to generate PAR card.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectArchitect;
