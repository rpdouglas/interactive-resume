import React, { useState, useEffect, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/db';
import { FileText, Printer, Edit3, Loader2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const CoverLetterGenerator = ({ applicationId, applicationData }) => {
  const [text, setText] = useState(applicationData.cover_letter_text || '');
  const [isEditing, setIsEditing] = useState(false);
  const printRef = useRef();

  // Sync local state when DB updates (e.g. after AI finishes)
  useEffect(() => {
    if (applicationData.cover_letter_text) {
      setText(applicationData.cover_letter_text);
    }
  }, [applicationData.cover_letter_text]);

  const handleGenerate = async () => {
    if (!applicationId) return;
    try {
      await updateDoc(doc(db, "applications", applicationId), {
        cover_letter_status: 'pending',
        cover_letter_text: '' // Clear old
      });
    } catch (err) {
      console.error("Trigger Failed:", err);
    }
  };

  const handleSave = async () => {
    // Save manual edits back to DB
    await updateDoc(doc(db, "applications", applicationId), {
      cover_letter_text: text
    });
    setIsEditing(false);
  };

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Cover_Letter_${applicationData.company || 'Draft'}`,
  });

  const status = applicationData.cover_letter_status || 'idle';

  return (
    <div className="h-full flex flex-col bg-slate-50">
      
      {/* 🛠️ Toolbar */}
      <div className="p-4 bg-white border-b border-slate-200 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2">
          <FileText className="text-slate-400" size={20} />
          <h3 className="font-bold text-slate-700">Cover Letter Engine</h3>
          {status === 'writing' && (
            <span className="flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full animate-pulse">
              <Loader2 size={12} className="animate-spin" /> Writing...
            </span>
          )}
        </div>
        
        <div className="flex gap-2">
          {text && (
            <>
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className="px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Edit3 size={16} /> {isEditing ? 'Done Editing' : 'Edit Text'}
              </button>
              <button 
                onClick={handlePrint}
                className="px-3 py-2 text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
              >
                <Printer size={16} /> Export PDF
              </button>
            </>
          )}
          
          {(!text || status === 'idle' || status === 'error') && (
            <button 
              onClick={handleGenerate}
              disabled={status === 'writing'}
              className="px-4 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-2 transition-all shadow-md hover:shadow-lg disabled:opacity-50"
            >
              <Sparkles size={16} /> {text ? 'Regenerate' : 'Write Draft'}
            </button>
          )}
        </div>
      </div>

      {/* 📄 Document Workspace */}
      <div className="flex-1 overflow-y-auto p-8 flex justify-center bg-slate-100/50">
        
        {/* EDIT MODE: Textarea */}
        {isEditing ? (
          <textarea 
            value={text}
            onChange={(e) => setText(e.target.value)}
            onBlur={handleSave}
            className="w-full max-w-[21cm] min-h-[29.7cm] p-10 bg-white shadow-xl rounded-sm font-serif text-slate-800 leading-relaxed outline-none focus:ring-2 focus:ring-blue-200 resize-none"
          />
        ) : (
          /* PREVIEW / PRINT MODE */
          <div className="relative">
            {/* The actual printable area */}
            <div 
              ref={printRef}
              className="w-full max-w-[21cm] min-h-[29.7cm] bg-white shadow-xl print:shadow-none p-[2.5cm] print:p-[2cm] text-slate-900"
            >
              {/* Letterhead (Only visible in Print/Preview) */}
              <div className="mb-8 border-b-2 border-slate-900 pb-4">
                <h1 className="text-2xl font-bold uppercase tracking-wider text-slate-900">Ryan Douglas</h1>
                <div className="text-xs text-slate-500 flex justify-between mt-2 font-sans uppercase tracking-widest">
                  <span>Management Consultant</span>
                  <span>rpdouglas@gmail.com • 613-360-3490</span>
                </div>
              </div>

              {/* Body Content */}
              <div className="font-serif text-[11pt] leading-[1.6] whitespace-pre-wrap text-justify">
                {text || (
                  <div className="text-slate-300 italic text-center mt-20">
                    {status === 'writing' ? 'Gemini is thinking...' : 'No letter generated yet.'}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoverLetterGenerator;
