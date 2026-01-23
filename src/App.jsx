import React from 'react';
import Dashboard from './components/dashboard/Dashboard';

function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-brand-accent selection:text-white">
      <main>
        <Dashboard />
      </main>
      
      {/* Simple Footer */}
      <footer className="text-center py-8 text-slate-400 text-sm">
        <p>© {new Date().getFullYear()} - Built with React & Recharts</p>
      </footer>
    </div>
  );
}

export default App;
