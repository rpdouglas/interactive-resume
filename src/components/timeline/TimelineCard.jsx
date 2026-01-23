import React from 'react';
import { motion } from 'framer-motion';

const TimelineCard = ({ data, index }) => {
  return (
    <div className="relative pl-8 md:pl-12 py-6 group">
      {/* 🟢 The Node (Dot on the Spine) */}
      <motion.div 
        layout
        className="absolute left-[-5px] top-8 w-4 h-4 rounded-full bg-blue-500 border-4 border-slate-900 shadow-[0_0_10px_rgba(59,130,246,0.5)] z-10 group-hover:scale-125 transition-transform duration-300"
        aria-hidden="true"
      />

      {/* 📄 The Content Card */}
      <motion.div 
        layout
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 hover:border-blue-500/50 transition-colors shadow-lg"
      >
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-white">{data.role}</h3>
            <span className="text-blue-400 font-medium text-sm">{data.company}</span>
          </div>
          <span className="text-slate-400 text-sm font-mono mt-1 sm:mt-0">{data.date}</span>
        </div>

        {/* PAR Framework */}
        <div className="space-y-3 text-sm text-slate-300">
          <p><strong className="text-blue-300">Problem:</strong> {data.par.problem}</p>
          <p><strong className="text-green-300">Action:</strong> {data.par.action}</p>
          <p><strong className="text-purple-300">Result:</strong> {data.par.result}</p>
        </div>

        {/* Skills Chips */}
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-700/50">
          {data.skills.map(skill => (
            <span key={skill} className="px-2 py-1 text-xs rounded-md bg-slate-900 text-slate-400 border border-slate-700">
              {skill}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default TimelineCard;
