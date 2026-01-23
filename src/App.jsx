import React, { useState } from 'react';
import Dashboard from './components/dashboard/Dashboard';
import ExperienceSection from './sections/ExperienceSection';
import Footer from './components/Footer';

function App() {
  // 🧠 The Brain: Shared State for Cross-Filtering
  const [activeSkill, setActiveSkill] = useState(null);

  const handleSkillClick = (skillName) => {
    // If clicking the same skill, toggle it off
    setActiveSkill(prev => prev === skillName ? null : skillName);
  };

  const handleClearFilter = () => {
    setActiveSkill(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-brand-accent selection:text-white">
      {/* ♿ A11y: Skip Link (Hidden until Tabbed) */}
      <a 
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 px-6 py-3 bg-blue-600 text-white font-bold rounded shadow-lg transition-transform"
      >
        Skip to Content
      </a>

      <main id="main-content">
        {/* 1. Dashboard triggers the filter */}
        <Dashboard onSkillClick={handleSkillClick} />
        
        {/* 2. Timeline reacts to the filter */}
        <ExperienceSection 
          activeFilter={activeSkill} 
          onClear={handleClearFilter} 
        />
      </main>
      
      {/* Footer is hidden in print via utility class in component */}
      <Footer />
    </div>
  );
}

export default App;
