import React from 'react';
import KPIGrid from './KPIGrid';
import SkillRadar from './SkillRadar';
import SectorGrid from './SectorGrid';
import { useTypewriter } from '../../hooks/useTypewriter';
import { logUserInteraction } from '../../hooks/useAnalytics';
import { useResumeData } from '../../hooks/useResumeData'; // ✅ Import Hook
import LoadingSkeleton from '../common/LoadingSkeleton'; // ✅ Import Skeleton

const Dashboard = ({ activeFilter, onSkillClick }) => {
  // ✅ Fetch data from Context instead of importing JSON
  const { profile, skills, loading } = useResumeData();

  const typeWriterText = useTypewriter([
    "Management Consultant",
    "Power BI Developer",
    "Data & Analytics Leader",
    "Strategy Advisor"
  ]);

  // ✅ Show High-Fidelity Skeleton while loading
  if (loading) {
    return <LoadingSkeleton />;
  }

  // Safety check if profile is somehow null (e.g. initial render blink)
  if (!profile) return null;

  const handleInteraction = (label, type) => {
    logUserInteraction('filter_click', { filter_value: label, filter_type: type });
    onSkillClick(label);
  };

  return (
    <section id="dashboard" className="w-full max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8 text-center md:text-left">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
          {profile.basics.name}
        </h1>
        <p className="text-xl text-blue-600 mt-2 font-mono h-8">
          {typeWriterText}
          <span className="animate-pulse">|</span>
        </p>
        <p className="text-slate-400 mt-2 max-w-2xl text-sm md:text-base">
          {profile.basics.summary}
        </p>
      </div>

      <KPIGrid metrics={profile.metrics} />

      <SectorGrid 
        activeSector={activeFilter} 
        onSectorClick={(label) => handleInteraction(label, 'sector')} 
      />

      <SkillRadar 
        skills={skills} 
        onSkillClick={(label) => handleInteraction(label, 'skill')} 
      />
    </section>
  );
};

export default Dashboard;
