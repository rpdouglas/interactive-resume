import React from 'react';
import KPIGrid from './KPIGrid';
import SkillRadar from './SkillRadar';
import SectorGrid from './SectorGrid';
import profileData from '../../data/profile.json';
import skillsData from '../../data/skills.json';
import { useTypewriter } from '../../hooks/useTypewriter';
import { logUserInteraction } from '../../hooks/useAnalytics';

const Dashboard = ({ activeFilter, onSkillClick }) => {
  const typeWriterText = useTypewriter([
    "Management Consultant",
    "Power BI Developer",
    "Data & Analytics Leader",
    "Strategy Advisor"
  ]);

  const handleInteraction = (label, type) => {
    logUserInteraction('filter_click', { filter_value: label, filter_type: type });
    onSkillClick(label);
  };

  return (
    <section id="dashboard" className="w-full max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8 text-center md:text-left">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
          {profileData.basics.name}
        </h1>
        <p className="text-xl text-blue-600 mt-2 font-mono h-8">
          {typeWriterText}
          <span className="animate-pulse">|</span>
        </p>
        <p className="text-slate-400 mt-2 max-w-2xl text-sm md:text-base">
          {profileData.basics.summary}
        </p>
      </div>

      <KPIGrid metrics={profileData.metrics} />

      <SectorGrid 
        activeSector={activeFilter} 
        onSectorClick={(label) => handleInteraction(label, 'sector')} 
      />

      <SkillRadar 
        skills={skillsData} 
        onSkillClick={(label) => handleInteraction(label, 'skill')} 
      />
    </section>
  );
};

export default Dashboard;
