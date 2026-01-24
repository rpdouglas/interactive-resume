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
    <div className="relative pl-8 md:pl-12 py-6 group">
      <motion.div 
        layout
        className="absolute left-[-5px] top-8 w-4 h-4 rounded-full bg-blue-500 border-4 border-slate-900 z-10 group-hover:scale-125 transition-transform"
        aria-hidden="true"
      />

      <motion.div 
        layout
        className="bg-slate-800/50 rounded-xl border border-slate-700 hover:border-blue-500/50 transition-colors shadow-lg overflow-hidden"
      >
        <div className="p-6 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2">
            <div>
              <h3 className="text-xl font-bold text-white">{data.role}</h3>
              <span className="text-blue-400 font-medium text-sm">{data.company}</span>
            </div>
            <div className="flex items-center gap-4 mt-1 sm:mt-0">
              <span className="text-slate-400 text-sm font-mono">{data.date}</span>
              {isOpen ? <ChevronUp size={18} className="text-slate-500" /> : <ChevronDown size={18} className="text-slate-500" />}
            </div>
          </div>
          <p className="text-slate-300 text-sm mt-2">{data.summary}</p>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-slate-700 bg-slate-900/30 p-4 space-y-4"
            >
              {data.projects.map(project => {
                const isMatch = activeFilter && project.skills.some(s => s.toLowerCase().includes(activeFilter.toLowerCase()));
                const hasDiagram = !!project.diagram;

                return (
                  <div key={project.id} className={clsx("p-4 rounded-lg border transition-all", isMatch ? "bg-blue-900/20 border-blue-500/50" : "bg-slate-900 border-slate-800")}>
                    <div className="flex justify-between items-center mb-2">
                      <h5 className={clsx("font-bold text-sm", isMatch ? "text-blue-300" : "text-slate-200")}>{project.title}</h5>
                      
                      {hasDiagram && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); toggleDiagram(project.id, project.diagram); }}
                          className={clsx("p-1.5 rounded-md transition-colors flex items-center gap-2 text-[10px] uppercase font-bold tracking-tighter", 
                            activeDiagram === project.id ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-400 hover:text-white"
                          )}
                          title="View Architecture Diagram"
                        >
                          <Network size={14} />
                          Visual Architecture
                        </button>
                      )}
                    </div>

                    <div className="space-y-2 text-xs text-slate-400 mb-3">
                      <p><strong className="text-blue-400">Problem:</strong> {project.par.problem}</p>
                      <p><strong className="text-emerald-400">Action:</strong> {project.par.action}</p>
                      <p><strong className="text-purple-400">Result:</strong> {project.par.result}</p>
                    </div>

                    <AnimatePresence>
                      {activeDiagram === project.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="mb-4 overflow-hidden"
                        >
                          <Mermaid chart={project.diagram} />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="flex flex-wrap gap-2">
                      {project.skills.map(skill => (
                        <span key={skill} className="px-2 py-1 text-[10px] rounded-md border border-slate-700 bg-slate-800 text-slate-500">
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
