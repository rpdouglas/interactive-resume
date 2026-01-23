import React, { useState } from 'react';
import Dashboard from './components/dashboard/Dashboard';
import ExperienceSection from './sections/ExperienceSection';
import Footer from './components/Footer';

function App() {
  // 🧠 The Brain: Shared State for Cross-Filtering
  const [activeSkill, setActiveSkill] = useState(null);

  const handleSkillClick = (skillName) => {
    console.log("Filter Triggered:", skillName);
    // If clicking the same skill, toggle it off
    setActiveSkill(prev => prev === skillName ? null : skillName);
  };

  const handleClearFilter = () => {
    setActiveSkill(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-brand-accent selection:text-white">
      <main>
        {/* 1. Dashboard triggers the filter */}
        <Dashboard onSkillClick={handleSkillClick} />
        
        {/* 2. Timeline reacts to the filter */}
        <ExperienceSection 
          activeFilter={activeSkill} 
          onClear={handleClearFilter} 
        />
      </main>
      
      <Footer />
    </div>
  );
}

export default App;
