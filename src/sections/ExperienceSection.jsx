import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X } from 'lucide-react';
import TimelineContainer from '../components/timeline/TimelineContainer';
import { useResumeData } from '../hooks/useResumeData'; // ✅ Import Hook

const ExperienceSection = ({ activeFilter, onClear }) => {
  // ✅ Fetch Data from Context
  const { experience, loading } = useResumeData();

  // If loading, Dashboard skeleton handles the view height, 
  // so we can return null or a simple spinner here to avoid double-skeleton
  if (loading) return null; 

  const filteredData = activeFilter 
    ? experience.filter(job => {
        // Match Job Skills
        const jobMatch = job.skills?.some(skill => 
          skill.toLowerCase().includes(activeFilter.toLowerCase())
        );
        
        // Match Project Skills OR Project Sectors
        const projectMatch = job.projects?.some(proj => 
          proj.skills?.some(skill => 
            skill.toLowerCase().includes(activeFilter.toLowerCase())
          ) || 
          (proj.sector && proj.sector.toLowerCase() === activeFilter.toLowerCase())
        );

        return jobMatch || projectMatch;
      })
    : experience;

  return (
    <section id="experience" className="py-20 bg-slate-900 relative overflow-hidden min-h-[600px] print:bg-white print:text-black print:py-0">
      <div className="container mx-auto px-4">
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
                  Explore 15 years of consulting impact across diverse industries. <br/>
                  <span className="text-xs text-slate-500 italic">Filter by technical skill or industry sector above.</span>
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>

        <TimelineContainer experienceData={filteredData} activeFilter={activeFilter} />
        
        {filteredData.length === 0 && (
          <div className="text-center text-slate-500 mt-12 italic">
            No specific engagements found matching "{activeFilter}".
          </div>
        )}
      </div>
    </section>
  );
};

export default ExperienceSection;
