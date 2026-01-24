import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Network } from 'lucide-react';
import clsx from 'clsx';
import Mermaid from '../common/Mermaid';
import { logUserInteraction } from '../../hooks/useAnalytics';

const TimelineCard = ({ data, index, activeFilter }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDiagram, setActiveDiagram] = useState(null);

  useEffect(() => {
    if (!activeFilter) {
      setIsOpen(false);
      return;
    }
    const hasMatchingProject = data.projects.some(proj => 
      proj.skills.some(skill => 
        skill.toLowerCase().includes(activeFilter.toLowerCase())
      )
    );
    if (hasMatchingProject) setIsOpen(true);
  }, [activeFilter, data.projects]);

  const toggleDiagram = (projectId, diagram) => {
    if (activeDiagram === projectId) {
      setActiveDiagram(null);
    } else {
      logUserInteraction('view_diagram', { project_id: projectId });
      setActiveDiagram(projectId);
    }
  };

  return (
    /* 📱 MOBILE OPTIMIZATION: 
       Reduced left padding (pl-6) on mobile to reclaim horizontal space.
       Restored to pl-12 on desktop (md).
    */
    <div className="relative pl-6 md:pl-12 py-6 group">
      
      {/* 📏 The Dot (Adjusted position for new padding) */}
      <motion.div 
        layout
        className="absolute left-[-5px] top-8 w-4 h-4 rounded-full bg-blue-500 border-4 border-slate-900 z-10 group-hover:scale-125 transition-transform"
        aria-hidden="true"
      />

      <motion.div 
        layout
        className="bg-slate-800/50 rounded-xl border border-slate-700 hover:border-blue-500/50 transition-colors shadow-lg overflow-hidden"
      >
        {/* 📱 MOBILE OPTIMIZATION: 
           Reduced card padding (p-4) on mobile.
        */}
        <div className="p-4 md:p-6 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2">
            <div className="max-w-full">
              <h3 className="text-lg md:text-xl font-bold text-white break-words">{data.role}</h3>
              <span className="text-blue-400 font-medium text-sm block mt-1 sm:mt-0">{data.company}</span>
            </div>
            
            <div className="flex items-center gap-4 mt-2 sm:mt-0">
              <span className="text-slate-400 text-xs md:text-sm font-mono whitespace-nowrap">{data.date}</span>
              {isOpen ? <ChevronUp size={18} className="text-slate-500" /> : <ChevronDown size={18} className="text-slate-500" />}
            </div>
          </div>
          <p className="text-slate-300 text-sm mt-2 leading-relaxed">{data.summary}</p>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-slate-700 bg-slate-900/30 p-4 space-y-4 md:space-y-4"
            >
              {data.projects.map(project => {
                const isMatch = activeFilter && project.skills.some(s => s.toLowerCase().includes(activeFilter.toLowerCase()));
                const hasDiagram = !!project.diagram;

                return (
                  <div 
                    key={project.id} 
                    /* 📱 ADAPTIVE DENSITY STRATEGY:
                       - Mobile: "Flattened". No borders/bg. Items separated by a subtle bottom border.
                       - Desktop (md): "Card". Boxed look with borders and background.
                    */
                    className={clsx(
                      "transition-all",
                      // Mobile Styles (Flattened)
                      "pb-6 border-b border-slate-800/50 last:border-0 last:pb-0",
                      // Desktop Styles (Card)
                      "md:p-4 md:rounded-lg md:border md:pb-4 md:border-b md:mb-0",
                      // Active State (Only applies styling on Desktop to keep Mobile clean)
                      isMatch 
                        ? "md:bg-blue-900/20 md:border-blue-500/50" 
                        : "md:bg-slate-900 md:border-slate-800"
                    )}
                  >
                    <div className="flex flex-col gap-2 mb-3">
                      <div className="flex justify-between items-start">
                        <h5 className={clsx("font-bold text-sm", isMatch ? "text-blue-300" : "text-slate-200")}>
                          {project.title}
                        </h5>
                      </div>
                      
                      {hasDiagram && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); toggleDiagram(project.id, project.diagram); }}
                          className={clsx(
                            "self-start p-1.5 rounded-md transition-colors flex items-center gap-2 text-[10px] uppercase font-bold tracking-tighter border",
                            activeDiagram === project.id 
                              ? "bg-blue-600 text-white border-blue-500" 
                              : "bg-slate-800 text-slate-400 border-slate-700 hover:text-white"
                          )}
                          title="View Architecture Diagram"
                        >
                          <Network size={14} />
                          Visual Architecture
                        </button>
                      )}
                    </div>

                    <div className="space-y-2 text-sm text-slate-400 mb-4 leading-relaxed">
                      <p><strong className="text-blue-400 block text-xs uppercase tracking-wider mb-0.5">Problem:</strong> {project.par.problem}</p>
                      <p><strong className="text-emerald-400 block text-xs uppercase tracking-wider mb-0.5">Action:</strong> {project.par.action}</p>
                      <p><strong className="text-purple-400 block text-xs uppercase tracking-wider mb-0.5">Result:</strong> {project.par.result}</p>
                    </div>

                    <AnimatePresence>
                      {activeDiagram === project.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="mb-4 overflow-hidden w-full"
                        >
                          <Mermaid chart={project.diagram} />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="flex flex-wrap gap-2 mt-3">
                      {project.skills.map(skill => (
                        <span key={skill} className="px-2 py-1 text-[10px] rounded-md border border-slate-700 bg-slate-800 text-slate-500 whitespace-nowrap">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default TimelineCard;
