import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X } from 'lucide-react';
import TimelineContainer from '../components/timeline/TimelineContainer';
import experienceData from '../data/experience.json';

const ExperienceSection = ({ activeFilter, onClear }) => {
  
  // 🔍 Deep Filtering Logic
  // We want to show a Job Card if:
  // 1. The Job's top-level skills match (generic role match)
  // 2. OR Any of the Job's Projects have a matching skill (specific project match)
  const filteredData = activeFilter 
    ? experienceData.filter(job => {
        const jobMatch = job.skills.some(skill => 
          skill.toLowerCase().includes(activeFilter.toLowerCase())
        );
        
        const projectMatch = job.projects.some(proj => 
          proj.skills.some(skill => 
            skill.toLowerCase().includes(activeFilter.toLowerCase())
          )
        );

        return jobMatch || projectMatch;
      })
    : experienceData;

  return (
    <section id="experience" className="py-20 bg-slate-900 relative overflow-hidden min-h-[600px] print:bg-white print:text-black print:py-0">
      <div className="container mx-auto px-4">
        
        {/* Header with Filter State */}
        <div className="text-center mb-12 print:mb-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 print:text-black">
            Professional <span className="text-blue-500 print:text-black">Portfolio</span>
          </h2>
          
          <div className="print:hidden">
            <AnimatePresence mode='wait'>
              {activeFilter ? (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center justify-center gap-3"
                >
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-500/50 rounded-full text-blue-300">
                    <Filter size={16} />
                    <span>Filtering by: <strong>{activeFilter}</strong></span>
                    <button 
                      onClick={onClear}
                      className="ml-2 p-1 hover:bg-blue-500/30 rounded-full transition-colors"
                      aria-label="Clear Filter"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-slate-400 max-w-2xl mx-auto"
                >
                  Explore 15 years of consulting and development impact. <br/>
                  <span className="text-xs text-slate-500">Click a Job to view Projects, or use the Radar Chart to filter.</span>
                </motion.p>
              )}
            </AnimatePresence>
          </div>
          
          <p className="hidden print:block text-sm text-gray-600 mt-2">
             Detailed project history.
          </p>
        </div>

        {/* The Filtered Timeline */}
        {/* We pass activeFilter so cards can Auto-Expand */}
        <TimelineContainer experienceData={filteredData} activeFilter={activeFilter} />
        
        {/* Empty State */}
        {filteredData.length === 0 && (
          <div className="text-center text-slate-500 mt-12 italic">
            No specific roles found matching "{activeFilter}" (Check skills list).
          </div>
        )}
      </div>
    </section>
  );
};

export default ExperienceSection;
