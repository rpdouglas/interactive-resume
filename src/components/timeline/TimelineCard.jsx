import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Briefcase } from 'lucide-react';
import clsx from 'clsx';

const TimelineCard = ({ data, index, activeFilter }) => {
  const [isOpen, setIsOpen] = useState(false);

  // 🧠 Smart Auto-Expand Logic
  useEffect(() => {
    if (!activeFilter) {
      setIsOpen(false);
      return;
    }

    // Check if any project inside this job matches the filter
    const hasMatchingProject = data.projects.some(proj => 
      proj.skills.some(skill => 
        skill.toLowerCase().includes(activeFilter.toLowerCase())
      )
    );

    if (hasMatchingProject) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [activeFilter, data.projects]);

  return (
    <div className="relative pl-8 md:pl-12 py-6 group">
      {/* 🟢 The Node (Dot on the Spine) */}
      <motion.div 
        layout
        className="absolute left-[-5px] top-8 w-4 h-4 rounded-full bg-blue-500 border-4 border-slate-900 shadow-[0_0_10px_rgba(59,130,246,0.5)] z-10 group-hover:scale-125 transition-transform duration-300"
        aria-hidden="true"
      />

      {/* 📄 The Job Wrapper Card */}
      <motion.div 
        layout
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-slate-800/50 rounded-xl border border-slate-700 hover:border-blue-500/50 transition-colors shadow-lg overflow-hidden"
      >
        {/* Header (Always Visible) */}
        <div 
          className="p-6 cursor-pointer hover:bg-slate-800/80 transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                {data.role}
              </h3>
              <span className="text-blue-400 font-medium text-sm">{data.company}</span>
            </div>
            <div className="flex items-center gap-4 mt-1 sm:mt-0">
              <span className="text-slate-400 text-sm font-mono">{data.date}</span>
              {isOpen ? <ChevronUp size={18} className="text-slate-500" /> : <ChevronDown size={18} className="text-slate-500" />}
            </div>
          </div>
          
          <p className="text-slate-300 text-sm mt-2">{data.summary}</p>
          
          {/* Top Level Job Skills */}
          <div className="flex flex-wrap gap-2 mt-3">
             {data.skills.map(skill => (
                <span key={skill} className="text-[10px] uppercase tracking-wider text-slate-500 bg-slate-900 px-2 py-0.5 rounded">
                  {skill}
                </span>
             ))}
          </div>
        </div>

        {/* 📂 The Projects Accordion */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="border-t border-slate-700 bg-slate-900/30"
            >
              <div className="p-4 space-y-4">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 pl-2">Key Projects & Engagements</h4>
                
                {data.projects.map(project => {
                  // Highlight project if it matches filter
                  const isMatch = activeFilter && project.skills.some(s => s.toLowerCase().includes(activeFilter.toLowerCase()));

                  return (
                    <div 
                      key={project.id} 
                      className={clsx(
                        "p-4 rounded-lg border transition-all duration-300",
                        isMatch ? "bg-blue-900/20 border-blue-500/50" : "bg-slate-900 border-slate-800"
                      )}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h5 className={clsx("font-bold text-sm", isMatch ? "text-blue-300" : "text-slate-200")}>
                          {project.title}
                        </h5>
                      </div>

                      {/* PAR Framework */}
                      <div className="space-y-2 text-xs text-slate-400 mb-3">
                        <p><strong className="text-blue-400">Problem:</strong> {project.par.problem}</p>
                        <p><strong className="text-emerald-400">Action:</strong> {project.par.action}</p>
                        <p><strong className="text-purple-400">Result:</strong> {project.par.result}</p>
                      </div>

                      {/* Project Specific Skills */}
                      <div className="flex flex-wrap gap-2">
                        {project.skills.map(skill => {
                          const isSkillMatch = activeFilter && skill.toLowerCase().includes(activeFilter.toLowerCase());
                          return (
                            <span 
                              key={skill} 
                              className={clsx(
                                "px-2 py-1 text-[10px] rounded-md border",
                                isSkillMatch 
                                  ? "bg-blue-600 text-white border-blue-500" 
                                  : "bg-slate-800 text-slate-500 border-slate-700"
                              )}
                            >
                              {skill}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default TimelineCard;
