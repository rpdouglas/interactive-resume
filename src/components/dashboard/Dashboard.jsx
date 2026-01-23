import React from 'react';
import KPIGrid from './KPIGrid';
import SkillRadar from './SkillRadar';
import profileData from '../../data/profile.json';
import skillsData from '../../data/skills.json';
import { useTypewriter } from '../../hooks/useTypewriter';
import { logUserInteraction } from '../../hooks/useAnalytics';

const Dashboard = ({ onSkillClick }) => {
  // ⌨️ Typewriter Effect
  const typeWriterText = useTypewriter([
    "Management Consultant",
    "Power BI Developer",
    "Data & Analytics Leader",
    "Strategy Advisor"
  ]);

  // 🕵️‍♂️ Intercept click to log analytics
  const handleChartInteraction = (skill) => {
    logUserInteraction('filter_skill', { skill_name: skill });
    onSkillClick(skill);
  };

  return (
    <section id="dashboard" className="w-full max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8 text-center md:text-left">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
          {profileData.basics.name}
        </h1>
        
        {/* Dynamic Hero Text */}
        <p className="text-xl text-blue-600 mt-2 font-mono h-8">
          {typeWriterText}
          <span className="animate-pulse">|</span>
        </p>
        
        <p className="text-slate-400 mt-2 max-w-2xl text-sm md:text-base">
          {profileData.basics.summary}
        </p>
      </div>

      <KPIGrid metrics={profileData.metrics} />

      {/* Pass the wrapped click handler down to the chart */}
      <SkillRadar skills={skillsData} onSkillClick={handleChartInteraction} />
    </section>
  );
};

export default Dashboard;
