import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import sectors from '../../data/sectors.json';
import clsx from 'clsx';

const SectorGrid = ({ activeSector, onSectorClick }) => {
  return (
    <div className="mb-12">
      <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6 text-center md:text-left">
        Industry Impact
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {sectors.map((sector, idx) => {
          const IconComponent = Icons[sector.icon];
          const isActive = activeSector === sector.label;

          return (
            <motion.button
              key={sector.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => onSectorClick(sector.label)}
              className={clsx(
                "flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-300 group",
                isActive 
                  ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20" 
                  : "bg-white border-slate-100 text-slate-600 hover:border-blue-200 hover:bg-blue-50/30"
              )}
            >
              <div className={clsx(
                "p-2 rounded-lg mb-2 transition-colors",
                isActive ? "bg-white/20" : "bg-slate-50 group-hover:bg-blue-100"
              )}>
                {IconComponent && <IconComponent size={24} className={isActive ? "text-white" : "text-blue-500"} />}
              </div>
              <span className="text-xs font-bold text-center leading-tight uppercase tracking-tighter">
                {sector.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default SectorGrid;
