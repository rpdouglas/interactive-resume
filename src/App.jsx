import React, { Suspense, lazy, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

// 🚀 Performance: Lazy Load Admin components
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

// Sections / Components
import Dashboard from './components/dashboard/Dashboard';
import ExperienceSection from './sections/ExperienceSection';
import Footer from './components/Footer';
import Header from './components/Header';
import BookingModal from './components/common/BookingModal';
import { useAnalytics } from './hooks/useAnalytics';

// Wrapper for the Public View
const PublicResume = () => {
  useAnalytics();
  const [activeSkill, setActiveSkill] = useState(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const handleSkillClick = (skillName) => {
    setActiveSkill(prev => prev === skillName ? null : skillName);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-brand-accent selection:text-white">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-[60] px-6 py-3 bg-blue-600 text-white font-bold rounded shadow-lg">
        Skip to Content
      </a>
      <Header onBookClick={() => setIsBookingOpen(true)} />
      <main id="main-content" className="pt-20">
        <Dashboard activeFilter={activeSkill} onSkillClick={handleSkillClick} />
        <ExperienceSection activeFilter={activeSkill} onClear={() => handleSkillClick(null)} />
      </main>
      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
      <Footer />
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center bg-slate-950">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        }>
          <Routes>
            <Route path="/" element={<PublicResume />} />
            <Route 
              path="/admin/*" 
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
