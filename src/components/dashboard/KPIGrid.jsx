import React from 'react';
import { motion } from 'framer-motion';
import { Award, Briefcase, Layers } from 'lucide-react';
import clsx from 'clsx';

/**
 * Single Metric Card with Count-up Animation
 */
const KPICard = ({ label, value, icon: Icon, delay, color }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow"
    >
      <div className={clsx("p-3 rounded-lg bg-opacity-10", color)}>
        <Icon className={clsx("w-8 h-8", color.replace('bg-', 'text-'))} />
      </div>
      <div>
        <h3 className="text-3xl font-bold text-slate-800">
          {/* Simple count-up animation could go here, for now static for SEO/Speed */}
          {value}
        </h3>
        <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">{label}</p>
      </div>
    </motion.div>
  );
};

/**
 * Grid Container for all metrics
 */
const KPIGrid = ({ metrics }) => {
  const cards = [
    {
      label: "Years Experience",
      value: metrics.yearsExperience + "+",
      icon: Briefcase,
      color: "bg-blue-500 text-blue-600",
      delay: 0.1
    },
    {
      label: "Projects Delivered",
      value: metrics.projectsDelivered,
      icon: Layers,
      color: "bg-emerald-500 text-emerald-600",
      delay: 0.2
    },
    {
      label: "Certifications",
      value: metrics.certifications,
      icon: Award,
      color: "bg-purple-500 text-purple-600",
      delay: 0.3
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {cards.map((card, idx) => (
        <KPICard key={idx} {...card} />
      ))}
    </div>
  );
};

export default KPIGrid;
