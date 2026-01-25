import React, { useState, Suspense, lazy } from 'react';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Settings, LogOut, Database, Sparkles, ExternalLink } from 'lucide-react';

// Lazy Load components for performance
const ProjectArchitect = lazy(() => import('./admin/ProjectArchitect'));
const DataSeeder = lazy(() => import('../components/admin/DataSeeder'));

const AdminDashboard = () => {
  const { logout, user } = useAuth();
  const [activeTab, setActiveTab] = useState('architect');

  const navItems = [
    { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
    { id: 'architect', icon: Sparkles, label: 'Gemini Architect' },
    { id: 'database', icon: Database, label: 'Database' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col sticky top-0 h-screen">
        <div className="p-6 border-b border-slate-800">
          <h2 className="font-bold text-xl tracking-tight">CMS Admin</h2>
          <p className="text-xs text-slate-400 mt-1 truncate">{user?.email}</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                activeTab === item.id ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-2">
          {/* ✅ NEW: Link to Public Site */}
          <a 
            href="/" 
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors"
          >
            <ExternalLink size={18} />
            View Live Site
          </a>

          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Content Area */}
      <main className="flex-1 p-8 overflow-y-auto">
        <Suspense fallback={
          <div className="h-full flex items-center justify-center text-slate-400">Loading...</div>
        }>
          {activeTab === 'architect' && <ProjectArchitect />}
          {activeTab === 'database' && <DataSeeder />}
          {(activeTab === 'overview' || activeTab === 'settings') && (
            <div className="h-full flex items-center justify-center text-slate-400">
              <p>Module '{activeTab}' coming soon in Phase 17.</p>
            </div>
          )}
        </Suspense>
      </main>
    </div>
  );
};

export default AdminDashboard;
