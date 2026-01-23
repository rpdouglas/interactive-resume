import React from 'react';
import Dashboard from './components/dashboard/Dashboard';
import ExperienceSection from './sections/ExperienceSection';
// 👇 IMPORT THE MISSING COMPONENT
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-brand-accent selection:text-white">
      <main>
        <Dashboard />
        <ExperienceSection />
      </main>
      
      {/* 👇 Use the Smart Footer (contains Version v0.4.0) */}
      <Footer />
    </div>
  );
}

export default App;