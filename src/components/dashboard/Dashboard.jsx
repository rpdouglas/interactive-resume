import React from 'react';
import KPIGrid from './KPIGrid';
import SkillRadar from './SkillRadar';
import profileData from '../../data/profile.json';
import skillsData from '../../data/skills.json';

const Dashboard = () => {
  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-8">
      {/* Header Section */}
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

      {/* KPI Cards */}
      <KPIGrid metrics={profileData.metrics} />

      {/* Analytics Section */}
      <SkillRadar skills={skillsData} />
    </section>
  );
};

export default Dashboard;
