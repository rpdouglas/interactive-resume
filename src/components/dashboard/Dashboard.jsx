import React from 'react';
import KPIGrid from './KPIGrid';
import SkillRadar from './SkillRadar';
import profileData from '../../data/profile.json';
import skillsData from '../../data/skills.json';

const Dashboard = ({ onSkillClick }) => {
  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8 text-center md:text-left">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
          {profileData.basics.name}
        </h1>
        <p className="text-xl text-slate-500 mt-2">
          {profileData.basics.label}
        </p>
        <p className="text-slate-400 mt-1 max-w-2xl text-sm md:text-base">
          {profileData.basics.summary}
        </p>
      </div>

      <KPIGrid metrics={profileData.metrics} />

      {/* Pass the click handler down to the chart */}
      <SkillRadar skills={skillsData} onSkillClick={onSkillClick} />
    </section>
  );
};

export default Dashboard;
