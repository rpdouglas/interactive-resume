import React from 'react';
import TimelineContainer from '../components/timeline/TimelineContainer';
import experienceData from '../data/experience.json';

const ExperienceSection = () => {
  return (
    <section id="experience" className="py-20 bg-slate-900 relative overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Professional <span className="text-blue-500">History</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            15 years of bridging the gap between Business Strategy and Technical Execution.
          </p>
        </div>

        {/* The Timeline */}
        <TimelineContainer experienceData={experienceData} />
      </div>
    </section>
  );
};

export default ExperienceSection;
