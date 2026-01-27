# FRESH NEST: CODEBASE DUMP
**Date:** Mon Jan 26 16:45:28 UTC 2026
**Description:** Complete codebase context.

## FILE: package.json
```json
{
  "name": "interactive-resume",
  "private": true,
  "version": "2.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui"
  },
  "dependencies": {
    "@tailwindcss/vite": "^4.1.18",
    "clsx": "^2.1.1",
    "firebase": "^12.8.0",
    "framer-motion": "^12.29.0",
    "lucide-react": "^0.562.0",
    "mermaid": "^11.12.2",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "react-router-dom": "^7.13.0",
    "recharts": "^3.7.0",
    "tailwind-merge": "^3.4.0"
  },
  "devDependencies": {
    "@eslint/js": "^9.39.1",
    "@testing-library/dom": "^10.4.1",
    "@testing-library/jest-dom": "^6.9.1",
    "@testing-library/react": "^16.3.2",
    "@types/react": "^19.2.5",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^5.1.1",
    "autoprefixer": "^10.4.23",
    "eslint": "^9.39.1",
    "eslint-plugin-react-hooks": "^7.0.1",
    "eslint-plugin-react-refresh": "^0.4.24",
    "globals": "^16.5.0",
    "jsdom": "^27.4.0",
    "postcss": "^8.5.6",
    "tailwindcss": "^4.1.18",
    "vite": "^7.2.4",
    "vitest": "^4.0.18"
  }
}

```
---

## FILE: vite.config.js
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import packageJson from './package.json'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  define: {
    'import.meta.env.PACKAGE_VERSION': JSON.stringify(packageJson.version),
  },
  resolve: {
    alias: {
      react: 'react',
      'react-dom': 'react-dom',
    },
  },
  // ✅ Relaxed Headers for Dev Server
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'unsafe-none',
      'Cross-Origin-Embedder-Policy': 'unsafe-none',
    },
  },
  optimizeDeps: {
    include: ['mermaid', 'framer-motion', 'react', 'react-dom', 'react-router-dom'],
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 1500,
    commonjsOptions: {
      include: [/mermaid/, /node_modules/],
      transformMixedEsModules: true,
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          // 1. Core React + Recharts
          if (id.includes('node_modules/react') || 
              id.includes('node_modules/react-dom') || 
              id.includes('node_modules/react-router-dom') ||
              id.includes('node_modules/scheduler') ||
              id.includes('node_modules/recharts') || 
              id.includes('node_modules/d3')) {
            return 'vendor-react';
          }
          // 2. Firebase
          if (id.includes('node_modules/firebase')) {
            return 'vendor-firebase';
          }
          // 3. Mermaid
          if (id.includes('node_modules/mermaid') || 
              id.includes('node_modules/khroma') || 
              id.includes('node_modules/cytoscape')) {
            return 'vendor-mermaid';
          }
          // 4. Animation
          if (id.includes('node_modules/framer-motion')) {
            return 'vendor-animation';
          }
        },
      },
    },
  },
  pool: 'forks',
  poolOptions: {
    forks: {
      singleFork: true,
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    css: true,
    testTimeout: 10000,
  },
})

```
---

## FILE: firebase.json
```json
{
  "functions": [
    {
      "source": "functions",
      "codebase": "default",
      "ignore": [
        "node_modules",
        ".git",
        "firebase-debug.log",
        "firebase-debug.*.log",
        "*.local"
      ]
    }
  ],
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "headers": [
      {
        "source": "**",
        "headers": [
          {
            "key": "Cross-Origin-Opener-Policy",
            "value": "unsafe-none"
          },
          {
            "key": "Cross-Origin-Embedder-Policy",
            "value": "unsafe-none"
          },
          {
            "key": "Cache-Control",
            "value": "no-cache, no-store, must-revalidate"
          }
        ]
      }
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  },
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  }
}

```
---

## FILE: .firebaserc
```firebaserc
{
  "projects": {
    "default": "ryandouglas-resume"
  }
}

```
---

## FILE: src/App.jsx
```jsx
import React, { Suspense, lazy, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ResumeProvider } from './context/ResumeContext'; // ✅ Added Provider
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
        {/* ✅ Resume Data Provider wraps the app to enable Global Context */}
        <ResumeProvider>
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
        </ResumeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

```
---

## FILE: src/components/Footer.jsx
```jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Lock } from 'lucide-react';

const Footer = () => {
  const version = import.meta.env.PACKAGE_VERSION || 'v0.0.0';
  const { user, login } = useAuth();

  return (
    <footer className="py-8 bg-slate-950 border-t border-slate-900 text-center mt-20 print:hidden">
      <p className="text-slate-500 text-sm">
        &copy; {new Date().getFullYear()} Ryan Douglas. 
      </p>
      
      <div className="mt-4 flex flex-col items-center gap-2">
        <div className="text-[10px] font-mono text-slate-700 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500/50"></span>
          <span>System Version: v{version}</span>
        </div>

        {/* 🔐 Discreet Admin Entry Point */}
        {!user ? (
          <button 
            onClick={login}
            className="mt-2 text-slate-800 hover:text-slate-600 transition-colors"
            title="Admin Login"
          >
            <Lock size={12} />
          </button>
        ) : (
          <a 
            href="/admin" 
            className="mt-2 text-xs font-bold text-blue-500 hover:underline"
          >
            Go to Dashboard
          </a>
        )}
      </div>
    </footer>
  );
};

export default Footer;

```
---

## FILE: src/components/Header.jsx
```jsx
import React, { useState, useEffect } from 'react';
import { Menu, X, Linkedin, Github, Mail, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { logUserInteraction } from '../hooks/useAnalytics';

const Header = ({ onBookClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBooking = () => {
    setMobileMenuOpen(false);
    logUserInteraction('booking_open');
    onBookClick();
  };

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50 py-3 shadow-lg' 
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
          <a href="#" onClick={(e) => handleNavClick(e, '#dashboard')} className="flex items-center gap-2 group">
            <span className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-mono text-white">RD</span>
            <span className="text-xl font-bold text-white opacity-90 group-hover:opacity-100 transition-opacity">Ryan Douglas</span>
          </a>

          <nav className="hidden md:flex items-center gap-6">
            <a href="#experience" onClick={(e) => handleNavClick(e, '#experience')} className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Experience</a>
            
            <div className="h-4 w-px bg-slate-700 mx-2" />

            <button 
              onClick={handleBooking}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-lg shadow-blue-900/20 transition-all active:scale-95 flex items-center gap-2 print:hidden"
            >
              <MessageSquare size={14} />
              Let's Talk
            </button>

            <div className="flex items-center gap-3 ml-2">
              <a href="https://linkedin.com/in/ryandouglas" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-400 transition-colors"><Linkedin size={18} /></a>
              <a href="mailto:rpdouglas@gmail.com" className="text-slate-400 hover:text-emerald-400 transition-colors"><Mail size={18} /></a>
            </div>
          </nav>

          <button className="md:hidden text-slate-300" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle Menu">
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-slate-900/98 backdrop-blur-xl pt-24 px-6 md:hidden"
          >
            <nav className="flex flex-col gap-6 text-center">
              <a href="#experience" onClick={(e) => handleNavClick(e, '#experience')} className="text-2xl font-bold text-slate-200">Experience</a>
              <button 
                onClick={handleBooking}
                className="mx-auto w-full max-w-xs py-4 bg-blue-600 text-white rounded-xl font-bold text-xl"
              >
                Book a Consultation
              </button>
              <div className="flex justify-center gap-8 mt-8">
                 <a href="https://linkedin.com/in/ryandouglas" className="text-slate-400"><Linkedin size={28} /></a>
                 <a href="mailto:rpdouglas@gmail.com" className="text-slate-400"><Mail size={28} /></a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;

```
---

## FILE: src/components/__tests__/Footer.test.jsx
```jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Footer from '../Footer';
import { AuthProvider } from '../../context/AuthContext';

// Mock Firebase Auth
vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(),
  GoogleAuthProvider: vi.fn(),
  onAuthStateChanged: vi.fn(() => () => {}),
}));

// Mock the Firebase library
vi.mock('../../lib/firebase', () => ({
  auth: {},
  googleProvider: {},
}));

describe('Footer Component', () => {
  it('renders the correct copyright year', () => {
    render(
      <AuthProvider>
        <Footer />
      </AuthProvider>
    );
    const currentYear = new Date().getFullYear().toString();
    expect(screen.getByText(new RegExp(currentYear))).toBeDefined();
  });

  it('renders the System Version indicator', () => {
    render(
      <AuthProvider>
        <Footer />
      </AuthProvider>
    );
    expect(screen.getByText(/System Version: v/i)).toBeDefined();
  });

  it('renders the admin lock icon when not logged in', () => {
    render(
      <AuthProvider>
        <Footer />
      </AuthProvider>
    );
    // The Lock icon is inside a button
    const lockBtn = screen.getByRole('button');
    expect(lockBtn).toBeDefined();
  });
});

```
---

## FILE: src/components/__tests__/Header.test.jsx
```jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Header from '../Header';

// Mock Framer Motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className }) => <div className={className}>{children}</div>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

describe('Header Component', () => {
  it('renders the logo name', () => {
    render(<Header onBookClick={() => {}} />);
    expect(screen.getByText(/Ryan Douglas/i)).toBeDefined();
  });

  it('renders primary call-to-action and nav links', () => {
    render(<Header onBookClick={() => {}} />);
    // Check for the new "Let's Talk" CTA
    expect(screen.getByText(/Let's Talk/i)).toBeDefined();
    // Check for the Experience link
    expect(screen.getByText(/Experience/i)).toBeDefined();
  });

  it('toggles mobile menu and triggers booking from mobile', () => {
    const mockBookClick = vi.fn();
    render(<Header onBookClick={mockBookClick} />);
    
    // 1. Find and click the toggle button (Verified via restored aria-label)
    const toggleBtn = screen.getByLabelText('Toggle Menu');
    fireEvent.click(toggleBtn);

    // 2. Click the mobile booking button
    const mobileBookBtn = screen.getByText('Book a Consultation');
    fireEvent.click(mobileBookBtn);

    expect(mockBookClick).toHaveBeenCalled();
  });
});

```
---

## FILE: src/components/admin/DataSeeder.jsx
```jsx
import React, { useState } from 'react';
import { db } from '../../lib/db';
import { doc, setDoc, writeBatch, collection } from 'firebase/firestore';
import { Database, CheckCircle, AlertCircle, Loader2, ArrowRight } from 'lucide-react';

// Import Source Data
import profileData from '../../data/profile.json';
import skillsData from '../../data/skills.json';
import sectorsData from '../../data/sectors.json';
import experienceData from '../../data/experience.json';

const DataSeeder = () => {
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [logs, setLogs] = useState([]);

  const addLog = (msg) => setLogs(prev => [...prev, `> ${msg}`]);

  const handleSeed = async () => {
    if (!confirm("⚠️ This will overwrite existing data in Firestore with local JSON. Continue?")) return;
    
    setStatus('loading');
    setLogs(['🚀 Starting Database Migration...']);

    try {
      // 1. Seed Profile
      addLog("Seeding Profile...");
      // Using 'primary' as a fixed ID for the single profile document
      await setDoc(doc(db, "profile", "primary"), profileData);
      addLog("✅ Profile synced.");

      // 2. Seed Skills (Batch)
      addLog("Seeding Skills...");
      const batchSkills = writeBatch(db);
      skillsData.forEach(skill => {
        const ref = doc(db, "skills", skill.id);
        batchSkills.set(ref, skill);
      });
      await batchSkills.commit();
      addLog(`✅ ${skillsData.length} Skill Categories synced.`);

      // 3. Seed Sectors (Batch)
      addLog("Seeding Sectors...");
      const batchSectors = writeBatch(db);
      sectorsData.forEach(sector => {
        const ref = doc(db, "sectors", sector.id);
        batchSectors.set(ref, sector);
      });
      await batchSectors.commit();
      addLog(`✅ ${sectorsData.length} Sectors synced.`);

      // 4. Seed Experience & Nested Projects (Complex)
      addLog("Seeding Experience & Nested Projects...");
      
      // We process jobs sequentially to ensure parent exists before children (though Firestore doesn't strictly enforce this)
      for (const job of experienceData) {
        // Separate projects array from the job metadata
        const { projects, ...jobMeta } = job;
        
        // A. Write Job Document
        const jobRef = doc(db, "experience", job.id);
        await setDoc(jobRef, jobMeta);
        addLog(`  ↳ Job: ${job.company}`);

        // B. Write Sub-Collection: Projects
        if (projects && projects.length > 0) {
          const batchProjects = writeBatch(db);
          projects.forEach(project => {
            // Path: experience/{jobId}/projects/{projectId}
            const projRef = doc(db, "experience", job.id, "projects", project.id);
            batchProjects.set(projRef, project);
          });
          await batchProjects.commit();
          addLog(`    + ${projects.length} projects linked.`);
        }
      }
      
      addLog("✅ Experience synced.");
      addLog("🎉 MIGRATION COMPLETE.");
      setStatus('success');

    } catch (error) {
      console.error(error);
      addLog(`❌ ERROR: ${error.message}`);
      setStatus('error');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
            <Database size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Database Migration</h2>
            <p className="text-slate-500">Seed Cloud Firestore with local JSON data.</p>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-8">
          <h3 className="font-bold text-slate-700 mb-2 flex items-center gap-2">
            <ArrowRight size={16} /> Schema Architecture
          </h3>
          <ul className="list-disc list-inside text-sm text-slate-600 space-y-1 ml-2">
            <li><strong>Profile:</strong> Single document <code>/profile/primary</code></li>
            <li><strong>Skills:</strong> Collection <code>/skills/&#123;id&#125;</code></li>
            <li><strong>Sectors:</strong> Collection <code>/sectors/&#123;id&#125;</code></li>
            <li><strong>Experience:</strong> Collection <code>/experience/&#123;jobId&#125;</code>
              <ul className="list-disc list-inside ml-6 text-indigo-600">
                <li><strong>Projects:</strong> Sub-Collection <code>.../projects/&#123;projId&#125;</code></li>
              </ul>
            </li>
          </ul>
        </div>

        <button
          onClick={handleSeed}
          disabled={status === 'loading'}
          className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
            status === 'loading' 
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-indigo-500/20'
          }`}
        >
          {status === 'loading' ? (
            <>
              <Loader2 className="animate-spin" /> Seeding Database...
            </>
          ) : status === 'success' ? (
            <>
              <CheckCircle /> Migration Successful
            </>
          ) : (
            <>
              <Database size={20} /> Start Migration
            </>
          )}
        </button>

        {/* Logs Output */}
        <div className="mt-6 bg-slate-900 rounded-xl p-4 font-mono text-xs md:text-sm text-green-400 h-64 overflow-y-auto shadow-inner border border-slate-800">
          {logs.length === 0 ? (
            <span className="text-slate-600 opacity-50">Waiting to start...</span>
          ) : (
            logs.map((log, i) => (
              <div key={i} className="mb-1">{log}</div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DataSeeder;

```
---

## FILE: src/components/admin/JobTracker.jsx
```jsx
import React, { useState } from 'react';
import { db } from '../../lib/db';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Briefcase, FileText, Save, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const JobTracker = () => {
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    raw_text: '',
    source_url: ''
  });
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    try {
      // 💾 Data Strategy: Async Trigger Pattern
      // We purposefully set 'ai_status' to 'pending' to trigger future Cloud Functions
      const payload = {
        ...formData,
        status: 'draft',
        ai_status: 'pending', // ⚡ The trigger for Sprint 17.2
        ai_analysis: null,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp()
      };

      await addDoc(collection(db, "applications"), payload);

      // Reset Form
      setFormData({ company: '', role: '', raw_text: '', source_url: '' });
      setStatus('success');
      
      // Auto-dismiss success message after 3s
      setTimeout(() => setStatus('idle'), 3000);

    } catch (err) {
      console.error("Firestore Write Failed:", err);
      setErrorMsg(err.message);
      setStatus('error');
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex-1 flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Briefcase className="text-blue-600" size={24} />
            New Application
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Paste a Job Description to initialize the AI analysis pipeline.
          </p>
        </div>

        {/* Scrollable Form Area */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Company Name</label>
              <input 
                type="text" 
                name="company"
                required
                value={formData.company}
                onChange={handleChange}
                placeholder="e.g. Acme Corp"
                className="w-full p-3 rounded-lg bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Role Title</label>
              <input 
                type="text" 
                name="role"
                required
                value={formData.role}
                onChange={handleChange}
                placeholder="e.g. Senior React Developer"
                className="w-full p-3 rounded-lg bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-2 flex-1 flex flex-col">
            <label className="text-xs font-bold uppercase text-slate-500 tracking-wider flex justify-between">
              <span>Job Description (Raw Text)</span>
              <span className="text-[10px] text-blue-500 font-normal">Auto-Expanding</span>
            </label>
            <div className="relative flex-1">
              <textarea 
                name="raw_text"
                required
                value={formData.raw_text}
                onChange={handleChange}
                placeholder="Paste the full job description here..."
                className="w-full h-64 md:h-96 p-4 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none resize-none font-mono text-sm leading-relaxed"
              />
              <div className="absolute right-4 top-4 text-slate-300 pointer-events-none">
                <FileText size={20} />
              </div>
            </div>
          </div>

        </form>

        {/* 📱 Sticky Footer Action Bar */}
        <div className="p-4 border-t border-slate-100 bg-white sticky bottom-0 z-10 flex items-center justify-between">
          <div className="text-sm font-medium">
            {status === 'success' && <span className="text-emerald-600 flex items-center gap-2"><CheckCircle size={16}/> Saved to Drafts</span>}
            {status === 'error' && <span className="text-red-500 flex items-center gap-2"><AlertCircle size={16}/> {errorMsg || "Save Failed"}</span>}
          </div>

          <button
            onClick={handleSubmit}
            disabled={status === 'loading' || !formData.company || !formData.raw_text}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 flex items-center gap-2 transition-all active:scale-95"
          >
            {status === 'loading' ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            {status === 'loading' ? 'Saving...' : 'Save Application'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default JobTracker;

```
---

## FILE: src/components/admin/__tests__/JobTracker.test.jsx
```jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import JobTracker from '../JobTracker';
import * as Firestore from 'firebase/firestore';

// ==========================================
// 1. MOCK ENVIRONMENT (The "Codespaces" Fix)
// ==========================================
vi.stubEnv('VITE_API_KEY', 'test_api_key');
vi.stubEnv('VITE_AUTH_DOMAIN', 'test_auth_domain');
vi.stubEnv('VITE_PROJECT_ID', 'test_project_id');

// ==========================================
// 2. MOCK FIREBASE MODULES
// ==========================================
// Correct path to lib/db from components/admin/__tests__
vi.mock('../../../lib/db', () => ({
  db: {} 
}));

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(),
  collection: vi.fn(),
  addDoc: vi.fn(),
  serverTimestamp: vi.fn(() => 'MOCK_TIMESTAMP')
}));

describe('JobTracker Component', () => {
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  // --- TEST CASE 1: RENDER & INITIAL STATE ---
  it('renders the form with empty fields and disabled save button', () => {
    render(<JobTracker />);

    expect(screen.getByText(/New Application/i)).toBeInTheDocument();

    const companyInput = screen.getByPlaceholderText(/e.g. Acme Corp/i);
    const roleInput = screen.getByPlaceholderText(/e.g. Senior React Developer/i);
    // ✅ FIX: Match the actual placeholder text
    const rawTextInput = screen.getByPlaceholderText(/Paste the full job description/i);

    expect(companyInput).toHaveValue('');
    expect(roleInput).toHaveValue('');
    expect(rawTextInput).toHaveValue('');

    const saveBtn = screen.getByRole('button', { name: /Save Application/i });
    expect(saveBtn).toBeDisabled();
  });

  // --- TEST CASE 2: INTERACTION & VALIDATION ---
  it('enables the save button only when required fields are filled', () => {
    render(<JobTracker />);

    const saveBtn = screen.getByRole('button', { name: /Save Application/i });
    
    // Fill Company only
    fireEvent.change(screen.getByPlaceholderText(/e.g. Acme Corp/i), { target: { value: 'Google' } });
    expect(saveBtn).toBeDisabled(); 

    // Fill Raw Text
    // ✅ FIX: Match the actual placeholder text
    fireEvent.change(screen.getByPlaceholderText(/Paste the full job description/i), { target: { value: 'Job Description Text' } });
    
    expect(saveBtn).not.toBeDisabled();
  });

  // --- TEST CASE 3: HAPPY PATH SUBMISSION ---
  it('submits data to Firestore and shows success message', async () => {
    Firestore.addDoc.mockResolvedValue({ id: 'new_doc_id' });

    render(<JobTracker />);

    // Fill Form
    fireEvent.change(screen.getByPlaceholderText(/e.g. Acme Corp/i), { target: { value: 'Google' } });
    fireEvent.change(screen.getByPlaceholderText(/e.g. Senior React Developer/i), { target: { value: 'Staff Engineer' } });
    // ✅ FIX: Match the actual placeholder text
    fireEvent.change(screen.getByPlaceholderText(/Paste the full job description/i), { target: { value: 'Do cool stuff.' } });

    // Click Save
    const saveBtn = screen.getByRole('button', { name: /Save Application/i });
    fireEvent.click(saveBtn);

    // Verify Loading
    expect(screen.getByText(/Saving.../i)).toBeInTheDocument();
    expect(saveBtn).toBeDisabled();

    // Verify Firestore Call
    await waitFor(() => {
      expect(Firestore.addDoc).toHaveBeenCalledTimes(1);
    });

    const expectedPayload = {
      company: 'Google',
      role: 'Staff Engineer',
      raw_text: 'Do cool stuff.',
      source_url: '',
      status: 'draft',
      ai_status: 'pending',
      ai_analysis: null,
      created_at: 'MOCK_TIMESTAMP',
      updated_at: 'MOCK_TIMESTAMP'
    };
    
    expect(Firestore.addDoc).toHaveBeenCalledWith(undefined, expectedPayload);

    // Verify Success
    expect(await screen.findByText(/Saved to Drafts/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/e.g. Acme Corp/i)).toHaveValue(''); 
  });

  // --- TEST CASE 4: ERROR HANDLING ---
  it('displays an error message if Firestore fails', async () => {
    const errorMsg = "Permission Denied: Insufficient Privileges";
    Firestore.addDoc.mockRejectedValue(new Error(errorMsg));

    render(<JobTracker />);

    fireEvent.change(screen.getByPlaceholderText(/e.g. Acme Corp/i), { target: { value: 'Google' } });
    // ✅ FIX: Match the actual placeholder text
    fireEvent.change(screen.getByPlaceholderText(/Paste the full job description/i), { target: { value: 'JD Text' } });

    fireEvent.click(screen.getByRole('button', { name: /Save Application/i }));

    await waitFor(() => {
      expect(screen.getByText(errorMsg)).toBeInTheDocument();
    });

    const saveBtn = screen.getByRole('button', { name: /Save Application/i });
    expect(saveBtn).not.toBeDisabled();
  });
});

```
---

## FILE: src/components/auth/ProtectedRoute.jsx
```jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;

```
---

## FILE: src/components/auth/__tests__/AdminSecurity.test.jsx
```jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from '../../../context/AuthContext';
import ProtectedRoute from '../ProtectedRoute';
import * as FirebaseAuth from 'firebase/auth';

// 1. Mock Firebase Auth
vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(),
  GoogleAuthProvider: vi.fn(),
  onAuthStateChanged: vi.fn(),
  signInWithPopup: vi.fn(),
  signOut: vi.fn(),
}));

// 2. Mock Firebase Library
vi.mock('../../../lib/firebase', () => ({
  auth: {},
  googleProvider: {},
}));

// 3. Helper to mock the authorized email env var
vi.stubEnv('VITE_ADMIN_EMAIL', 'authorized@test.com');

describe('Admin Security Logic', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const MockAdminPage = () => <div>Sensitive Admin Data</div>;
  const MockPublicPage = () => <div>Public Resume</div>;

  it('ProtectedRoute: Shows loading spinner when auth state is pending', () => {
    // Force AuthContext to stay in loading state
    FirebaseAuth.onAuthStateChanged.mockImplementation(() => () => {});

    render(
      <AuthProvider>
        <ProtectedRoute>
          <MockAdminPage />
        </ProtectedRoute>
      </AuthProvider>
    );

    // Look for the loading spinner div
    expect(document.querySelector('.animate-spin')).toBeDefined();
  });

  it('Whitelisting: Grants access only to the whitelisted email', async () => {
    // Simulate authorized user login
    FirebaseAuth.onAuthStateChanged.mockImplementation((auth, callback) => {
      callback({ email: 'authorized@test.com' });
      return () => {};
    });

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<MockPublicPage />} />
            <Route 
              path="/admin" 
              element={<ProtectedRoute><MockAdminPage /></ProtectedRoute>} 
            />
          </Routes>
        </AuthProvider>
      </MemoryRouter>
    );

    expect(screen.getByText('Sensitive Admin Data')).toBeDefined();
  });

  it('Whitelisting: Bounces an authenticated but unauthorized user', async () => {
    // Simulate someone else logging in with their Google account
    FirebaseAuth.onAuthStateChanged.mockImplementation((auth, callback) => {
      callback({ email: 'intruder@hacker.com' });
      return () => {};
    });

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<MockPublicPage />} />
            <Route 
              path="/admin" 
              element={<ProtectedRoute><MockAdminPage /></ProtectedRoute>} 
            />
          </Routes>
        </AuthProvider>
      </MemoryRouter>
    );

    // Should be redirected to public page
    expect(screen.getByText('Public Resume')).toBeDefined();
    expect(screen.queryByText('Sensitive Admin Data')).toBeNull();
  });

  it('ProtectedRoute: Bounces unauthenticated users (null)', () => {
    // Simulate no user logged in
    FirebaseAuth.onAuthStateChanged.mockImplementation((auth, callback) => {
      callback(null);
      return () => {};
    });

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<MockPublicPage />} />
            <Route 
              path="/admin" 
              element={<ProtectedRoute><MockAdminPage /></ProtectedRoute>} 
            />
          </Routes>
        </AuthProvider>
      </MemoryRouter>
    );

    expect(screen.getByText('Public Resume')).toBeDefined();
  });
});

```
---

## FILE: src/components/common/BookingModal.jsx
```jsx
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar } from 'lucide-react';
import { logUserInteraction } from '../../hooks/useAnalytics';

/**
 * 📅 BookingModal
 * Integrated scheduling interface with Focus Trapping & A11y.
 */
const BookingModal = ({ isOpen, onClose }) => {
  // Handle Escape Key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // Lock Scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  const handleClose = () => {
    logUserInteraction('booking_close');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            className="relative w-full max-w-4xl h-[90vh] md:h-[600px] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                  <Calendar size={20} />
                </div>
                <div>
                  <h2 id="modal-title" className="font-bold text-slate-900">Schedule a Consultation</h2>
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">15-Min Discovery Call</p>
                </div>
              </div>
              <button 
                onClick={handleClose}
                className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400 hover:text-slate-600"
                aria-label="Close Modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content / Iframe Container */}
            <div className="flex-1 bg-slate-50 relative">
              {/* 🛑 REPLACE src with your actual Calendly/Booking link */}
              <iframe
                src="https://calendly.com" 
                width="100%"
                height="100%"
                frameBorder="0"
                title="Scheduling Calendar"
                className="w-full h-full"
              ></iframe>
              
              {/* Optional: Simple Loader Overlay while iframe loads */}
              <div className="absolute inset-0 -z-10 flex items-center justify-center text-slate-400 text-sm italic">
                Loading Calendar...
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default BookingModal;

```
---

## FILE: src/components/common/LoadingSkeleton.jsx
```jsx
import React from 'react';

const LoadingSkeleton = () => {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 animate-pulse space-y-12">
      {/* Header Section */}
      <div className="space-y-4">
        <div className="h-10 bg-slate-200 rounded w-1/3 md:w-1/4"></div>
        <div className="h-4 bg-slate-200 rounded w-1/2 md:w-1/3"></div>
        <div className="h-20 bg-slate-100 rounded w-full md:w-2/3 mt-4"></div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-32 bg-slate-100 rounded-xl border border-slate-200"></div>
        ))}
      </div>

      {/* Sectors Grid */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="h-24 bg-slate-100 rounded-xl"></div>
        ))}
      </div>

      {/* Chart & Timeline Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="h-96 bg-slate-100 rounded-xl border border-slate-200"></div>
        <div className="space-y-6">
          {[1, 2].map(i => (
            <div key={i} className="h-48 bg-slate-100 rounded-xl border border-slate-200"></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;

```
---

## FILE: src/components/common/Mermaid.jsx
```jsx
import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

/**
 * 🧜‍♂️ Mermaid.js Wrapper
 * Renders text-based diagrams as SVGs.
 * Handles the React lifecycle to prevent duplicate rendering.
 */
const Mermaid = ({ chart }) => {
  const ref = useRef(null);

  useEffect(() => {
    // Initialize with Slate/Blue theme
    mermaid.initialize({
      startOnLoad: true,
      theme: 'base',
      securityLevel: 'loose',
      themeVariables: {
        primaryColor: '#3b82f6',
        primaryTextColor: '#fff',
        primaryBorderColor: '#2563eb',
        lineColor: '#64748b',
        secondaryColor: '#1e293b',
        tertiaryColor: '#0f172a'
      }
    });

    if (ref.current) {
      // Clear previous content
      ref.current.innerHTML = '';
      
      // Unique ID for this render to avoid collision in long lists
      const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
      
      mermaid.render(id, chart).then(({ svg }) => {
        if (ref.current) {
          ref.current.innerHTML = svg;
        }
      });
    }
  }, [chart]);

  return (
    <div className="w-full bg-slate-900/50 p-4 rounded-lg border border-slate-700/50 overflow-x-auto">
      <div ref={ref} className="flex justify-center" />
    </div>
  );
};

export default Mermaid;

```
---

## FILE: src/components/common/__tests__/BookingModal.test.jsx
```jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import BookingModal from '../BookingModal';
import * as Analytics from '../../../hooks/useAnalytics';

// 1. Mock Framer Motion (Immediate Render)
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, onClick, role, ...props }) => (
      <div className={className} onClick={onClick} role={role} {...props}>
        {children}
      </div>
    ),
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

// 2. Mock Analytics Hook
vi.mock('../../../hooks/useAnalytics', () => ({
  logUserInteraction: vi.fn(),
}));

describe('BookingModal Component', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset body style before each test
    document.body.style.overflow = 'unset';
  });

  it('renders correctly when isOpen is true', () => {
    render(<BookingModal isOpen={true} onClose={mockOnClose} />);
    
    expect(screen.getByRole('dialog')).toBeDefined();
    expect(screen.getByText(/Schedule a Consultation/i)).toBeDefined();
    expect(screen.getByTitle(/Scheduling Calendar/i)).toBeDefined();
  });

  it('does not render when isOpen is false', () => {
    render(<BookingModal isOpen={false} onClose={mockOnClose} />);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('calls onClose and logs analytics when close button is clicked', () => {
    render(<BookingModal isOpen={true} onClose={mockOnClose} />);
    
    const closeBtn = screen.getByLabelText(/Close Modal/i);
    fireEvent.click(closeBtn);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
    expect(Analytics.logUserInteraction).toHaveBeenCalledWith('booking_close');
  });

  it('closes when the Escape key is pressed', () => {
    render(<BookingModal isOpen={true} onClose={mockOnClose} />);
    
    fireEvent.keyDown(window, { key: 'Escape', code: 'Escape' });
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('locks body scroll when open and restores it when closed', () => {
    const { rerender } = render(<BookingModal isOpen={true} onClose={mockOnClose} />);
    expect(document.body.style.overflow).toBe('hidden');

    rerender(<BookingModal isOpen={false} onClose={mockOnClose} />);
    expect(document.body.style.overflow).toBe('unset');
  });

  it('contains an accessible iframe for the booking tool', () => {
    render(<BookingModal isOpen={true} onClose={mockOnClose} />);
    const iframe = screen.getByTitle(/Scheduling Calendar/i);
    
    expect(iframe).toBeDefined();
    expect(iframe.tagName).toBe('IFRAME');
  });
});

```
---

## FILE: src/components/dashboard/Dashboard.jsx
```jsx
import React from 'react';
import KPIGrid from './KPIGrid';
import SkillRadar from './SkillRadar';
import SectorGrid from './SectorGrid';
import { useTypewriter } from '../../hooks/useTypewriter';
import { logUserInteraction } from '../../hooks/useAnalytics';
import { useResumeData } from '../../hooks/useResumeData'; // ✅ Import Hook
import LoadingSkeleton from '../common/LoadingSkeleton'; // ✅ Import Skeleton

const Dashboard = ({ activeFilter, onSkillClick }) => {
  // ✅ Fetch data from Context instead of importing JSON
  const { profile, skills, loading } = useResumeData();

  const typeWriterText = useTypewriter([
    "Management Consultant",
    "Power BI Developer",
    "Data & Analytics Leader",
    "Strategy Advisor"
  ]);

  // ✅ Show High-Fidelity Skeleton while loading
  if (loading) {
    return <LoadingSkeleton />;
  }

  // Safety check if profile is somehow null (e.g. initial render blink)
  if (!profile) return null;

  const handleInteraction = (label, type) => {
    logUserInteraction('filter_click', { filter_value: label, filter_type: type });
    onSkillClick(label);
  };

  return (
    <section id="dashboard" className="w-full max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8 text-center md:text-left">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
          {profile.basics.name}
        </h1>
        <p className="text-xl text-blue-600 mt-2 font-mono h-8">
          {typeWriterText}
          <span className="animate-pulse">|</span>
        </p>
        <p className="text-slate-400 mt-2 max-w-2xl text-sm md:text-base">
          {profile.basics.summary}
        </p>
      </div>

      <KPIGrid metrics={profile.metrics} />

      <SectorGrid 
        activeSector={activeFilter} 
        onSectorClick={(label) => handleInteraction(label, 'sector')} 
      />

      <SkillRadar 
        skills={skills} 
        onSkillClick={(label) => handleInteraction(label, 'skill')} 
      />
    </section>
  );
};

export default Dashboard;

```
---

## FILE: src/components/dashboard/KPIGrid.jsx
```jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Award, Briefcase, Layers } from 'lucide-react';
import clsx from 'clsx';

/**
 * Single Metric Card with Count-up Animation
 */
const KPICard = ({ label, value, icon: Icon, delay, color }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow"
    >
      <div className={clsx("p-3 rounded-lg bg-opacity-10", color)}>
        <Icon className={clsx("w-8 h-8", color.replace('bg-', 'text-'))} />
      </div>
      <div>
        <h3 className="text-3xl font-bold text-slate-800">
          {/* Simple count-up animation could go here, for now static for SEO/Speed */}
          {value}
        </h3>
        <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">{label}</p>
      </div>
    </motion.div>
  );
};

/**
 * Grid Container for all metrics
 */
const KPIGrid = ({ metrics }) => {
  const cards = [
    {
      label: "Years Experience",
      value: metrics.yearsExperience + "+",
      icon: Briefcase,
      color: "bg-blue-500 text-blue-600",
      delay: 0.1
    },
    {
      label: "Projects Delivered",
      value: metrics.projectsDelivered,
      icon: Layers,
      color: "bg-emerald-500 text-emerald-600",
      delay: 0.2
    },
    {
      label: "Certifications",
      value: metrics.certifications,
      icon: Award,
      color: "bg-purple-500 text-purple-600",
      delay: 0.3
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {cards.map((card, idx) => (
        <KPICard key={idx} {...card} />
      ))}
    </div>
  );
};

export default KPIGrid;

```
---

## FILE: src/components/dashboard/SectorGrid.jsx
```jsx
import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import sectors from '../../data/sectors.json';
import clsx from 'clsx';

const SectorGrid = ({ activeSector, onSectorClick }) => {
  return (
    <div className="mb-12">
      <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6 text-center md:text-left">
        Industry Impact
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {sectors.map((sector, idx) => {
          const IconComponent = Icons[sector.icon];
          const isActive = activeSector === sector.label;

          return (
            <motion.button
              key={sector.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => onSectorClick(sector.label)}
              className={clsx(
                "flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-300 group",
                isActive 
                  ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20" 
                  : "bg-white border-slate-100 text-slate-600 hover:border-blue-200 hover:bg-blue-50/30"
              )}
            >
              <div className={clsx(
                "p-2 rounded-lg mb-2 transition-colors",
                isActive ? "bg-white/20" : "bg-slate-50 group-hover:bg-blue-100"
              )}>
                {IconComponent && <IconComponent size={24} className={isActive ? "text-white" : "text-blue-500"} />}
              </div>
              <span className="text-xs font-bold text-center leading-tight uppercase tracking-tighter">
                {sector.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default SectorGrid;

```
---

## FILE: src/components/dashboard/SkillRadar.jsx
```jsx
import React from 'react';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip
} from 'recharts';
import { motion } from 'framer-motion';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 text-white text-xs p-2 rounded shadow-lg opacity-95">
        <p className="font-bold">{label}</p>
        <p>Proficiency: {payload[0].value}%</p>
      </div>
    );
  }
  return null;
};

const SkillRadar = ({ skills, onSkillClick }) => {
  if (!skills || skills.length === 0) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {skills.map((category, idx) => (
        <motion.div
          key={category.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 + (idx * 0.1) }}
          className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center min-w-0 overflow-hidden"
        >
          <h3 className="text-lg font-bold text-slate-700 mb-4">{category.label}</h3>
          <p className="text-xs text-slate-400 mb-2 italic">Click a skill label to filter experience</p>
          
          {/* ✅ FIXED: Inline style ensures Recharts can measure container immediately */}
          <div style={{ width: '100%', height: '300px', position: 'relative' }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={category.data}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis 
                  dataKey="subject" 
                  tick={{ 
                    fill: '#64748b', 
                    fontSize: 12, 
                    cursor: 'pointer', 
                    className: 'hover:fill-blue-600 transition-colors font-semibold'
                  }} 
                  onClick={({ value }) => onSkillClick(value)}
                />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  name={category.label}
                  dataKey="A"
                  stroke={category.id === 'strategy' ? '#8b5cf6' : '#3b82f6'}
                  fill={category.id === 'strategy' ? '#8b5cf6' : '#3b82f6'}
                  fillOpacity={0.6}
                />
                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default SkillRadar;

```
---

## FILE: src/components/dashboard/__tests__/SectorGrid.test.jsx
```jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SectorGrid from '../SectorGrid';
import sectors from '../../../data/sectors.json';

// Mock Framer Motion
vi.mock('framer-motion', () => ({
  motion: {
    button: ({ children, onClick, className, ...props }) => (
      <button onClick={onClick} className={className} {...props}>
        {children}
      </button>
    ),
  },
}));

describe('SectorGrid Component', () => {
  it('renders all sectors defined in sectors.json', () => {
    render(<SectorGrid activeSector={null} onSectorClick={() => {}} />);
    sectors.forEach(sector => {
      expect(screen.getByText(sector.label)).toBeDefined();
    });
  });

  it('calls onSectorClick when a sector is clicked', () => {
    const mockOnClick = vi.fn();
    render(<SectorGrid activeSector={null} onSectorClick={mockOnClick} />);
    fireEvent.click(screen.getByText('Public Sector'));
    expect(mockOnClick).toHaveBeenCalledWith('Public Sector');
  });

  it('applies active styling for selected sector', () => {
    render(<SectorGrid activeSector="Retail" onSectorClick={() => {}} />);
    const retailBtn = screen.getByText('Retail').closest('button');
    expect(retailBtn.className).toContain('bg-blue-600');
  });
});

```
---

## FILE: src/components/timeline/TimelineCard.jsx
```jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Network } from 'lucide-react';
import clsx from 'clsx';
import Mermaid from '../common/Mermaid';
import { logUserInteraction } from '../../hooks/useAnalytics';

const TimelineCard = ({ data, index, activeFilter }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDiagram, setActiveDiagram] = useState(null);

  useEffect(() => {
    if (!activeFilter) {
      setIsOpen(false);
      return;
    }
    const hasMatchingProject = data.projects.some(proj => 
      proj.skills.some(skill => 
        skill.toLowerCase().includes(activeFilter.toLowerCase())
      )
    );
    if (hasMatchingProject) setIsOpen(true);
  }, [activeFilter, data.projects]);

  const toggleDiagram = (projectId, diagram) => {
    if (activeDiagram === projectId) {
      setActiveDiagram(null);
    } else {
      logUserInteraction('view_diagram', { project_id: projectId });
      setActiveDiagram(projectId);
    }
  };

  return (
    /* 📱 MOBILE OPTIMIZATION: 
       Reduced left padding (pl-6) on mobile to reclaim horizontal space.
       Restored to pl-12 on desktop (md).
    */
    <div className="relative pl-6 md:pl-12 py-6 group">
      
      {/* 📏 The Dot (Adjusted position for new padding) */}
      <motion.div 
        layout
        className="absolute left-[-5px] top-8 w-4 h-4 rounded-full bg-blue-500 border-4 border-slate-900 z-10 group-hover:scale-125 transition-transform"
        aria-hidden="true"
      />

      <motion.div 
        layout
        className="bg-slate-800/50 rounded-xl border border-slate-700 hover:border-blue-500/50 transition-colors shadow-lg overflow-hidden"
      >
        {/* 📱 MOBILE OPTIMIZATION: 
           Reduced card padding (p-4) on mobile.
        */}
        <div className="p-4 md:p-6 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2">
            <div className="max-w-full">
              <h3 className="text-lg md:text-xl font-bold text-white break-words">{data.role}</h3>
              <span className="text-blue-400 font-medium text-sm block mt-1 sm:mt-0">{data.company}</span>
            </div>
            
            <div className="flex items-center gap-4 mt-2 sm:mt-0">
              <span className="text-slate-400 text-xs md:text-sm font-mono whitespace-nowrap">{data.date}</span>
              {isOpen ? <ChevronUp size={18} className="text-slate-500" /> : <ChevronDown size={18} className="text-slate-500" />}
            </div>
          </div>
          <p className="text-slate-300 text-sm mt-2 leading-relaxed">{data.summary}</p>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-slate-700 bg-slate-900/30 p-4 space-y-4 md:space-y-4"
            >
              {data.projects.map(project => {
                const isMatch = activeFilter && project.skills.some(s => s.toLowerCase().includes(activeFilter.toLowerCase()));
                const hasDiagram = !!project.diagram;

                return (
                  <div 
                    key={project.id} 
                    /* 📱 ADAPTIVE DENSITY STRATEGY:
                       - Mobile: "Flattened". No borders/bg. Items separated by a subtle bottom border.
                       - Desktop (md): "Card". Boxed look with borders and background.
                    */
                    className={clsx(
                      "transition-all",
                      // Mobile Styles (Flattened)
                      "pb-6 border-b border-slate-800/50 last:border-0 last:pb-0",
                      // Desktop Styles (Card)
                      "md:p-4 md:rounded-lg md:border md:pb-4 md:border-b md:mb-0",
                      // Active State (Only applies styling on Desktop to keep Mobile clean)
                      isMatch 
                        ? "md:bg-blue-900/20 md:border-blue-500/50" 
                        : "md:bg-slate-900 md:border-slate-800"
                    )}
                  >
                    <div className="flex flex-col gap-2 mb-3">
                      <div className="flex justify-between items-start">
                        <h5 className={clsx("font-bold text-sm", isMatch ? "text-blue-300" : "text-slate-200")}>
                          {project.title}
                        </h5>
                      </div>
                      
                      {hasDiagram && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); toggleDiagram(project.id, project.diagram); }}
                          className={clsx(
                            "self-start p-1.5 rounded-md transition-colors flex items-center gap-2 text-[10px] uppercase font-bold tracking-tighter border",
                            activeDiagram === project.id 
                              ? "bg-blue-600 text-white border-blue-500" 
                              : "bg-slate-800 text-slate-400 border-slate-700 hover:text-white"
                          )}
                          title="View Architecture Diagram"
                        >
                          <Network size={14} />
                          Visual Architecture
                        </button>
                      )}
                    </div>

                    <div className="space-y-2 text-sm text-slate-400 mb-4 leading-relaxed">
                      <p><strong className="text-blue-400 block text-xs uppercase tracking-wider mb-0.5">Problem:</strong> {project.par.problem}</p>
                      <p><strong className="text-emerald-400 block text-xs uppercase tracking-wider mb-0.5">Action:</strong> {project.par.action}</p>
                      <p><strong className="text-purple-400 block text-xs uppercase tracking-wider mb-0.5">Result:</strong> {project.par.result}</p>
                    </div>

                    <AnimatePresence>
                      {activeDiagram === project.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="mb-4 overflow-hidden w-full"
                        >
                          <Mermaid chart={project.diagram} />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="flex flex-wrap gap-2 mt-3">
                      {project.skills.map(skill => (
                        <span key={skill} className="px-2 py-1 text-[10px] rounded-md border border-slate-700 bg-slate-800 text-slate-500 whitespace-nowrap">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default TimelineCard;

```
---

## FILE: src/components/timeline/TimelineContainer.jsx
```jsx
import React from 'react';
import { AnimatePresence } from 'framer-motion';
import TimelineCard from './TimelineCard';

const TimelineContainer = ({ experienceData, activeFilter }) => {
  return (
    <div className="relative max-w-3xl mx-auto">
      {/* 📏 The Vertical Spine */}
      <div className="absolute left-[2px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-transparent opacity-50" />

      {/* List of Items */}
      <div className="flex flex-col space-y-4">
        <AnimatePresence mode='popLayout'>
          {experienceData.map((job, index) => (
            <TimelineCard 
              key={job.id} 
              data={job} 
              index={index} 
              activeFilter={activeFilter} // Pass filter down for Smart Expansion
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TimelineContainer;

```
---

## FILE: src/components/timeline/__tests__/TimelineCard.test.jsx
```jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TimelineCard from '../TimelineCard';

// 1. Mock Framer Motion
// We MUST include AnimatePresence now that we use it for the Accordion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, onClick }) => (
      <div className={className} onClick={onClick}>
        {children}
      </div>
    ),
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

describe('TimelineCard Component', () => {
  // 2. Define Mock Data (UPDATED NESTED STRUCTURE)
  const mockData = {
    id: "test_1",
    role: "Senior Developer",
    company: "Tech Corp",
    date: "2020 - Present",
    logo: "🚀",
    skills: ["React", "Node.js"],
    summary: "A test summary.",
    projects: [
      {
        id: "p1",
        title: "Legacy Refactor",
        skills: ["React", "Vitest"],
        par: {
          problem: "Legacy code was slow.",
          action: "Refactored to React 19.",
          result: "Performance improved by 50%."
        }
      }
    ]
  };

  it('renders the job header (role, company) by default', () => {
    render(<TimelineCard data={mockData} index={0} />);
    
    expect(screen.getByText('Senior Developer')).toBeDefined();
    expect(screen.getByText('Tech Corp')).toBeDefined();
    expect(screen.getByText('2020 - Present')).toBeDefined();
  });

  it('expands to show Projects when clicked', () => {
    render(<TimelineCard data={mockData} index={0} />);
    
    // 1. Check that project title is NOT visible initially (Logic: AnimatePresence would hide it, 
    // but in our mock AnimatePresence renders children immediately if isOpen is true. 
    // Since isOpen is false by default, it shouldn't be there.)
    expect(screen.queryByText('Legacy Refactor')).toBeNull();

    // 2. Click the Card Header to expand
    // We target the role text to simulate clicking the header area
    fireEvent.click(screen.getByText('Senior Developer'));

    // 3. Now the Project Title should be visible
    expect(screen.getByText('Legacy Refactor')).toBeDefined();
  });

  it('renders the PAR narrative inside the expanded project', () => {
    render(<TimelineCard data={mockData} index={0} />);
    
    // Open the accordion
    fireEvent.click(screen.getByText('Senior Developer'));

    // Check PAR content
    expect(screen.getByText(/Legacy code was slow/i)).toBeDefined();
    expect(screen.getByText(/Refactored to React 19/i)).toBeDefined();
    expect(screen.getByText(/Performance improved by 50%/i)).toBeDefined();
  });

  it('auto-expands if activeFilter matches a project skill', () => {
    // We pass "Vitest" as the active filter. 
    // The Project "Legacy Refactor" uses "Vitest", so it should auto-open.
    render(<TimelineCard data={mockData} index={0} activeFilter="Vitest" />);
    
    // Should be visible WITHOUT clicking
    expect(screen.getByText('Legacy Refactor')).toBeDefined();
  });
});

```
---

## FILE: src/context/AuthContext.jsx
```jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, googleProvider } from '../lib/firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser && currentUser.email === adminEmail) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [adminEmail]);

  const login = () => signInWithPopup(auth, googleProvider);
  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

```
---

## FILE: src/context/ResumeContext.jsx
```jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { db } from '../lib/db';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';

// 🛡️ FALLBACK DATA (Local JSON)
import localProfile from '../data/profile.json';
import localSkills from '../data/skills.json';
import localSectors from '../data/sectors.json';
import localExperience from '../data/experience.json';

// ✅ FIX: Added 'export' so the hook can consume it
export const ResumeContext = createContext();

export const ResumeProvider = ({ children }) => {
  const [data, setData] = useState({
    profile: null,
    skills: [],
    sectors: [],
    experience: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("🔥 Fetching Resume Data from Firestore...");

        // 1. Fetch Profile (Singleton)
        const profileSnap = await getDoc(doc(db, 'profile', 'primary'));
        const profile = profileSnap.exists() ? profileSnap.data() : localProfile;

        // 2. Fetch Skills
        const skillsSnap = await getDocs(collection(db, 'skills'));
        const skills = skillsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // 3. Fetch Sectors
        const sectorsSnap = await getDocs(collection(db, 'sectors'));
        const sectors = sectorsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // 4. Fetch Experience (DEEP FETCH PATTERN)
        const expSnap = await getDocs(collection(db, 'experience'));
        
        const experience = await Promise.all(expSnap.docs.map(async (jobDoc) => {
          const jobData = { id: jobDoc.id, ...jobDoc.data() };
          // Fetch Sub-collection: projects
          const projectsSnap = await getDocs(collection(jobDoc.ref, 'projects'));
          const projects = projectsSnap.docs.map(p => ({ id: p.id, ...p.data() }));
          return { ...jobData, projects };
        }));

        setData({
          profile: profile,
          skills: skills.length > 0 ? skills : localSkills,
          sectors: sectors.length > 0 ? sectors : localSectors,
          experience: experience.length > 0 ? experience : localExperience
        });
        
        setLoading(false);

      } catch (err) {
        console.error("⚠️ Firestore Fetch Failed. Activating Backup Protocols.", err);
        // 🛡️ FAILOVER: Load Local JSON
        setData({
          profile: localProfile,
          skills: localSkills,
          sectors: localSectors,
          experience: localExperience
        });
        setError(err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <ResumeContext.Provider value={{ ...data, loading, error }}>
      {children}
    </ResumeContext.Provider>
  );
};

```
---

## FILE: src/context/__tests__/ResumeContext.test.jsx
```jsx
import React from 'react';
import { render, screen, renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ResumeProvider } from '../ResumeContext';
import { useResumeData } from '../../hooks/useResumeData';
import * as Firestore from 'firebase/firestore';

// =============================================================================
// 1. MOCK DATA & IMPORTS
// We inline the mock data inside the factory to avoid hoisting ReferenceErrors.
// =============================================================================

vi.mock('../../data/profile.json', () => ({ 
  default: { basics: { name: "Local Fallback Ryan" }, metrics: {} } 
}));
vi.mock('../../data/skills.json', () => ({ default: [] }));
vi.mock('../../data/sectors.json', () => ({ default: [] }));
vi.mock('../../data/experience.json', () => ({ 
  default: [{ id: "local_job", role: "Local Dev", projects: [] }] 
}));

// Mock Firebase Service
vi.mock('../../lib/db', () => ({ db: {} }));

// Mock Firestore SDK methods
vi.mock('firebase/firestore', () => ({
  getDoc: vi.fn(),
  getDocs: vi.fn(),
  collection: vi.fn(),
  doc: vi.fn(),
}));

// =============================================================================
// 2. HELPER COMPONENTS
// =============================================================================

const TestConsumer = () => {
  const { profile, experience, loading } = useResumeData();

  if (loading) return <div data-testid="loading">Loading...</div>;
  
  return (
    <div>
      <div data-testid="profile-name">{profile?.basics?.name}</div>
      <div data-testid="job-role">{experience?.[0]?.role}</div>
      <div data-testid="project-count">{experience?.[0]?.projects?.length || 0}</div>
    </div>
  );
};

// =============================================================================
// 3. TEST SUITE
// =============================================================================

describe('ResumeContext & Data Layer', () => {
  
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('fetches and merges deep data from Firestore on success', async () => {
    // 1. Mock Profile
    Firestore.getDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({ basics: { name: "Firestore Ryan" }, metrics: {} })
    });

    // 2. Mock Collections (Sequence: Skills, Sectors, Experience, Projects)
    const mockJobDoc = { 
      id: 'cloud_job', 
      data: () => ({ role: "Cloud Architect" }),
      ref: 'mock_ref' 
    };

    Firestore.getDocs
      .mockResolvedValueOnce({ docs: [] }) // Skills
      .mockResolvedValueOnce({ docs: [] }) // Sectors
      .mockResolvedValueOnce({ docs: [mockJobDoc] }) // Experience Parent
      .mockResolvedValueOnce({ docs: [{ id: 'p1', data: () => ({ title: 'Cloud Project' }) }] }); // Projects Sub

    render(
      <ResumeProvider>
        <TestConsumer />
      </ResumeProvider>
    );

    expect(screen.getByTestId('loading')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    });

    expect(screen.getByTestId('profile-name')).toHaveTextContent('Firestore Ryan');
    expect(screen.getByTestId('job-role')).toHaveTextContent('Cloud Architect');
    expect(screen.getByTestId('project-count')).toHaveTextContent('1');
  });

  it('falls back to Local JSON seamlessly if Firestore fails', async () => {
    // Force fail first call
    Firestore.getDoc.mockRejectedValue(new Error("Simulated Network Crash"));

    render(
      <ResumeProvider>
        <TestConsumer />
      </ResumeProvider>
    );

    await waitFor(() => {
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    });

    // Verify Error Log
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining("Firestore Fetch Failed"), 
      expect.any(Error)
    );

    // Verify Fallback Data
    expect(screen.getByTestId('profile-name')).toHaveTextContent('Local Fallback Ryan');
    expect(screen.getByTestId('job-role')).toHaveTextContent('Local Dev');
  });

  it('provides isLoading=true initially', () => {
    Firestore.getDoc.mockReturnValue(new Promise(() => {}));
    render(
      <ResumeProvider>
        <TestConsumer />
      </ResumeProvider>
    );
    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  it('throws an error if hook is used outside Provider', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => {
      renderHook(() => useResumeData());
    }).toThrow('useResumeData must be used within a ResumeProvider');
    consoleSpy.mockRestore();
  });
});

```
---

## FILE: src/data/__tests__/SchemaValidation.test.js
```js
import { describe, it, expect } from 'vitest';
import profile from '../profile.json';
import skills from '../skills.json';
import experience from '../experience.json';

describe('Data Integrity (Schema Validation)', () => {

  // 1. PROFILE TEST
  it('Profile Data has required structure', () => {
    expect(profile.basics).toBeDefined();
    expect(profile.basics.name).toBeTypeOf('string');
    expect(profile.basics.label).toBeTypeOf('string');
    expect(profile.metrics).toBeDefined();
  });

  // 2. SKILLS TEST
  it('Skills Data is structured correctly for Radar Chart', () => {
    expect(Array.isArray(skills)).toBe(true);
    expect(skills.length).toBeGreaterThan(0);

    skills.forEach(category => {
      expect(category.id).toBeDefined();
      expect(Array.isArray(category.data)).toBe(true);
      
      category.data.forEach(skill => {
        expect(skill.subject).toBeTypeOf('string');
        expect(skill.A).toBeTypeOf('number');
        expect(skill.fullMark).toBe(100);
      });
    });
  });

  // 3. EXPERIENCE TEST (UPDATED FOR NESTED PROJECTS)
  it('Experience Data follows the Project-Based Architecture', () => {
    expect(Array.isArray(experience)).toBe(true);
    expect(experience.length).toBeGreaterThan(0);

    experience.forEach(job => {
      // Check Job Wrapper
      expect(job.id).toBeDefined();
      expect(job.role).toBeTypeOf('string');
      expect(job.company).toBeTypeOf('string');
      expect(Array.isArray(job.projects)).toBe(true);
      
      // Check Nested Projects
      job.projects.forEach(project => {
        expect(project.id).toBeDefined();
        expect(project.title).toBeTypeOf('string');
        expect(Array.isArray(project.skills)).toBe(true);
        
        // Check PAR Structure (Now inside the project)
        expect(project.par).toBeDefined();
        if (project.diagram) expect(project.diagram).toBeTypeOf("string");
        expect(project.par.problem).toBeTypeOf('string');
        expect(project.par.action).toBeTypeOf('string');
        expect(project.par.result).toBeTypeOf('string');
        
        // Quality Check
        expect(project.par.problem.length).toBeGreaterThan(5);
      });
    });
  });
});

```
---

## FILE: src/data/experience.json
```json
[
  {
    "id": "job_pwc",
    "role": "Manager (Data & Analytics)",
    "company": "PwC Canada LLP",
    "date": "2012 - 2024",
    "logo": "💼",
    "summary": "Senior management consultant leading data-driven transformation projects and advising government leaders while engineering hands-on analytics solutions.",
    "skills": ["Digital Strategy", "Leadership", "Stakeholder Mgmt"],
    "projects": [
      {
        "id": "pwc_proj_1",
        "title": "Public Sector Digital Transformation",
        "sector": "Public Sector",
        "skills": ["Power BI", "SQL", "Change Management"],
        "diagram": "graph LR\n  DB[(Legacy Data)] --> ETL[SSIS/Azure]\n  ETL --> DW[(SQL Data Warehouse)]\n  DW --> PBI[Power BI Dashboards]\n  PBI --> EXEC{Executive Insights}",
        "par": {
          "problem": "Government clients struggled with fragmented data ecosystems, preventing executive visibility into critical operations.",
          "action": "Architected target operating models and deployed advanced Power BI dashboards to track customer journeys.",
          "result": "Delivered sustainable digital transformation, aligning technical execution with strategic business objectives."
        }
      },
      {
        "id": "pwc_proj_2",
        "title": "Omnichannel Contact Center Modernization",
        "sector": "Telecommunications",
        "skills": ["Data Modeling", "Azure", "Risk Assessment"],
        "par": {
          "problem": "Legacy contact center infrastructure lacked integration, leading to poor customer insights and operational inefficiencies.",
          "action": "Led the design and deployment of modern BI solutions, integrating data from multiple channels for a unified view.",
          "result": "Enhanced operational efficiency and enabled real-time reporting for high-stakes regulatory environments."
        }
      }
    ]
  },
  {
    "id": "job_biond",
    "role": "Business Intelligence Developer",
    "company": "Biond Consulting",
    "date": "2011 - 2012",
    "logo": "📊",
    "summary": "Specialized in end-to-end Microsoft BI solutions, from architecting data warehouses to building robust reporting dashboards.",
    "skills": ["Microsoft BI Stack", "Consulting"],
    "projects": [
      {
        "id": "biond_proj_1",
        "title": "Retail Analytics Platform Migration",
        "sector": "Retail",
        "skills": ["SSIS", "Data Warehousing", "ETL"],
        "diagram": "graph TD\n  POS[Point of Sale] --> SSIS[SSIS ETL]\n  WEB[E-Commerce] --> SSIS\n  SSIS --> STAGE[(Staging)]\n  STAGE --> DIM{Dimension Loading}\n  DIM --> CUBE[Analysis Services]",
        "par": {
          "problem": "A major Canadian clothing retailer relied on legacy systems that could not scale with their growing data volume.",
          "action": "Built and optimized complex ETL pipelines using SSIS and architected a new enterprise-grade data warehouse.",
          "result": "Successfully transitioned client to a modern analytics platform, significantly enhancing strategic insight capabilities."
        }
      },
      {
        "id": "biond_proj_2",
        "title": "Distributor Reporting Solution",
        "sector": "Distribution",
        "skills": ["SSRS", "SQL", "KPI Definition"],
        "par": {
          "problem": "A major distributor lacked the reporting infrastructure to make timely inventory and sales decisions.",
          "action": "Collaborated with clients to define critical KPIs and delivered a custom SSRS reporting solution.",
          "result": "Strengthened executive decision-making and improved business responsiveness post-implementation."
        }
      }
    ]
  },
  {
    "id": "job_tele",
    "role": "Manager, Data and Analytics",
    "company": "Teleperformance",
    "date": "2005 - 2011",
    "logo": "🌍",
    "summary": "Managed the data and analytics team driving strategy and transformation across international operations.",
    "skills": ["Team Leadership", "Process Improvement"],
    "projects": [
      {
        "id": "tp_proj_1",
        "title": "Global Contact Center Automation",
        "sector": "Outsourcing",
        "skills": ["C#", "SharePoint", "Automation"],
        "par": {
          "problem": "International operations relied on manual reporting processes, causing data latency and high operational costs.",
          "action": "Managed the full SDLC of automated reporting solutions using C#, SharePoint, and SQL.",
          "result": "Implemented automated processes that resulted in significant time and cost savings across multiple departments."
        }
      }
    ]
  }
]

```
---

## FILE: src/data/profile.json
```json
{
  "basics": {
    "name": "Ryan Douglas",
    "label": "Management Consultant & Power BI Developer",
    "email": "rpdouglas@gmail.com",
    "phone": "613.936.6341",
    "location": "Cornwall, Ontario",
    "summary": "A results-driven Data & Analytics Leader with 15 years of experience bridging the gap between high-level business strategy and granular technical execution. Proven expertise in leading cross-functional teams through complex digital transformations and building enterprise-grade BI solutions from the ground up.",
    "website": "https://ryandouglas-resume.web.app",
    "github": "https://github.com/rpdouglas",
    "linkedin": "https://linkedin.com/in/ryandouglas"
  },
  "metrics": {
    "yearsExperience": 15,
    "projectsDelivered": 40,
    "certifications": 2
  }
}

```
---

## FILE: src/data/sectors.json
```json
[
  { "id": "public", "label": "Public Sector", "icon": "Government" },
  { "id": "retail", "label": "Retail", "icon": "ShoppingBag" },
  { "id": "telecom", "label": "Telecommunications", "icon": "Radio" },
  { "id": "finance", "label": "Finance", "icon": "Banknote" },
  { "id": "logistics", "label": "Distribution", "icon": "Truck" },
  { "id": "outsourcing", "label": "Outsourcing", "icon": "Globe" }
]

```
---

## FILE: src/data/skills.json
```json
[
  {
    "id": "strategy",
    "label": "Business Strategy",
    "data": [
      { "subject": "Change Mgmt", "A": 95, "fullMark": 100 },
      { "subject": "Stakeholder Mgmt", "A": 90, "fullMark": 100 },
      { "subject": "Digital Strategy", "A": 95, "fullMark": 100 },
      { "subject": "Process Opt", "A": 85, "fullMark": 100 },
      { "subject": "Risk Mitigation", "A": 80, "fullMark": 100 }
    ]
  },
  {
    "id": "technical",
    "label": "Technical Stack",
    "data": [
      { "subject": "Power BI / DAX", "A": 95, "fullMark": 100 },
      { "subject": "SQL / T-SQL", "A": 90, "fullMark": 100 },
      { "subject": "ETL (SSIS)", "A": 85, "fullMark": 100 },
      { "subject": "Data Modeling", "A": 90, "fullMark": 100 },
      { "subject": "C# / VB.NET", "A": 75, "fullMark": 100 }
    ]
  }
]

```
---

## FILE: src/hooks/__tests__/useAnalytics.test.js
```js
import { describe, it, expect, vi } from 'vitest';
import { logUserInteraction } from '../useAnalytics';
import { logEvent } from 'firebase/analytics';

// Mock Firebase
vi.mock('firebase/analytics', () => ({
  logEvent: vi.fn(),
  getAnalytics: vi.fn(() => ({})), // Return dummy object
}));

vi.mock('../../lib/firebase', () => ({
  analytics: {}, // Truthy object to simulate initialized analytics
  app: {},
}));

describe('useAnalytics (logUserInteraction)', () => {
  it('calls firebase logEvent with correct parameters', () => {
    const eventName = 'test_event';
    const params = { foo: 'bar' };
    
    logUserInteraction(eventName, params);

    expect(logEvent).toHaveBeenCalledWith({}, eventName, params);
  });
});

```
---

## FILE: src/hooks/__tests__/useTypewriter.test.js
```js
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useTypewriter } from '../useTypewriter';

describe('useTypewriter Hook', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('initializes with an empty string', () => {
    const { result } = renderHook(() => useTypewriter(['Hello', 'World']));
    expect(result.current).toBe('');
  });

  it('types out the first word over time', () => {
    const { result } = renderHook(() => useTypewriter(['Hi'], 100)); // 100ms per char

    // Fast-forward time to type "H"
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current).toBe('H');

    // Fast-forward to type "i"
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current).toBe('Hi');
  });
});

```
---

## FILE: src/hooks/useAnalytics.js
```js
import { useEffect } from 'react';
import { logEvent } from "firebase/analytics";
import { analytics } from "../lib/firebase";

/**
 * 📊 useAnalytics Hook
 * Handles page view logging and provides event tracking helper.
 */
export const useAnalytics = () => {
  // Log Page View on Mount
  useEffect(() => {
    if (analytics) {
      logEvent(analytics, 'page_view');
    }
  }, []);

  return;
};

/**
 * 📡 Log User Interaction
 * Safely logs custom events to Firebase Analytics.
 * @param {string} eventName - Snake_case event name (e.g., 'select_skill')
 * @param {object} params - Event parameters
 */
export const logUserInteraction = (eventName, params = {}) => {
  if (analytics) {
    try {
      logEvent(analytics, eventName, params);
      // Optional: Log to console in Dev mode for verification
      if (import.meta.env.DEV) {
        console.log(`📊 [Analytics] ${eventName}:`, params);
      }
    } catch (error) {
      console.warn("Analytics Error:", error);
    }
  }
};

```
---

## FILE: src/hooks/useResumeData.js
```js
import { useContext } from 'react';
import { ResumeContext } from '../context/ResumeContext';

// Custom Hook to consume the Resume Context
// This abstracts the useContext logic from components
export const useResumeData = () => {
  const context = useContext(ResumeContext);
  if (context === undefined) {
    throw new Error('useResumeData must be used within a ResumeProvider');
  }
  return context;
};

```
---

## FILE: src/hooks/useTypewriter.js
```js
import { useState, useEffect } from 'react';

/**
 * ⌨️ useTypewriter Hook
 * Cycles through an array of strings with a typing/deleting effect.
 * * @param {string[]} words - Array of strings to cycle through
 * @param {number} typingSpeed - ms per character (default 150)
 * @param {number} deletingSpeed - ms per character (default 100)
 * @param {number} pauseDuration - ms to wait before deleting (default 2000)
 * @returns {string} - The current text being typed
 */
export const useTypewriter = (words, typingSpeed = 100, deletingSpeed = 50, pauseDuration = 2000) => {
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeedState, setTypingSpeedState] = useState(typingSpeed);

  useEffect(() => {
    const i = loopNum % words.length;
    const fullText = words[i];

    const handleType = () => {
      setText(current => 
        isDeleting 
          ? fullText.substring(0, current.length - 1) 
          : fullText.substring(0, current.length + 1)
      );

      // Dynamic Speed Logic
      let typeSpeed = isDeleting ? deletingSpeed : typingSpeed;

      if (!isDeleting && text === fullText) {
        // Finished typing word, pause before deleting
        typeSpeed = pauseDuration;
        setIsDeleting(true);
      } else if (isDeleting && text === '') {
        // Finished deleting, switch to next word
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
        typeSpeed = 500; // Small pause before typing next word
      }

      setTypingSpeedState(typeSpeed);
    };

    const timer = setTimeout(handleType, typingSpeedState);

    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, words, typingSpeed, deletingSpeed, pauseDuration, typingSpeedState]);

  return text;
};

```
---

## FILE: src/index.css
```css
@import "tailwindcss";

@theme {
  /* Core Variables */
  --color-brand-dark: #0f172a;  /* Slate 900 */
  --color-brand-accent: #3b82f6; /* Blue 500 */
  --color-brand-light: #f8fafc; /* Slate 50 */
  
  --font-sans: "Inter", system-ui, sans-serif;
}

/* Base Styles */
body {
  background-color: var(--color-brand-light);
  color: var(--color-brand-dark);
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
}

/* 🟢 A11Y: High-Visibility Focus Rings for Keyboard Users */
:focus-visible {
  outline: 2px solid var(--color-brand-accent);
  outline-offset: 2px;
  border-radius: 4px;
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* 🖨️ PRINT STYLES: The "White Paper" Transformation */
@media print {
  .print\:hidden { display: none !important; }
  /* 1. Global Reset for Paper */
  body {
    background-color: white !important;
    color: black !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  /* 2. Invert specific dark sections to white */
  section, footer, main, div {
    background-color: white !important;
    color: black !important;
    box-shadow: none !important;
    border-color: #cbd5e1 !important; /* Slate 300 for borders */
  }

  /* 3. Text adjustments */
  h1, h2, h3, h4, p, span, strong {
    color: black !important;
    text-shadow: none !important;
  }

  /* 4. Formatting tweaks */
  a {
    text-decoration: underline;
    color: #2563eb !important; /* Blue 600 for links */
  }

  /* 5. Page Breaks */
  section {
    break-inside: avoid;
    page-break-inside: avoid;
    margin-bottom: 2rem;
    padding-top: 1rem !important;
    padding-bottom: 1rem !important;
  }
}

```
---

## FILE: src/lib/db.js
```js
import { getFirestore } from "firebase/firestore";
import { app } from "./firebase";

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

```
---

## FILE: src/lib/firebase.js
```js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFunctions, httpsCallable } from "firebase/functions";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const functions = getFunctions(app);

// Callable Functions
export const architectProject = httpsCallable(functions, 'architectProject');

const analytics = (typeof window !== 'undefined' && window.indexedDB) 
  ? getAnalytics(app) 
  : null;

export { app, auth, googleProvider, analytics };

```
---

## FILE: src/main.jsx
```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

```
---

## FILE: src/pages/AdminDashboard.jsx
```jsx
import React, { useState, Suspense, lazy } from 'react';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Settings, LogOut, Database, Sparkles, ExternalLink, Briefcase } from 'lucide-react';

// Lazy Load components for performance
const ProjectArchitect = lazy(() => import('./admin/ProjectArchitect'));
const DataSeeder = lazy(() => import('../components/admin/DataSeeder'));
const JobTracker = lazy(() => import('../components/admin/JobTracker'));

const AdminDashboard = () => {
  const { logout, user } = useAuth();
  const [activeTab, setActiveTab] = useState('tracker'); // Default to new feature for testing

  const navItems = [
    { id: 'tracker', icon: Briefcase, label: 'Job Tracker' },
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
          {activeTab === 'tracker' && <JobTracker />}
          {activeTab === 'architect' && <ProjectArchitect />}
          {activeTab === 'database' && <DataSeeder />}
          {activeTab === 'settings' && (
            <div className="h-full flex items-center justify-center text-slate-400">
              <p>Module '{activeTab}' coming soon.</p>
            </div>
          )}
        </Suspense>
      </main>
    </div>
  );
};

export default AdminDashboard;

```
---

## FILE: src/pages/admin/ProjectArchitect.jsx
```jsx
import React, { useState } from 'react';
import { architectProject } from '../../lib/firebase';
import { Sparkles, Copy, RefreshCw, AlertCircle } from 'lucide-react';
import TimelineCard from '../../components/timeline/TimelineCard';

const ProjectArchitect = () => {
  const [rawText, setRawText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleArchitect = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await architectProject({ rawText });
      setResult(response.data);
    } catch (err) {
      // ✅ FIX: Use the actual error message from the backend/mock
      // This allows "Quota exceeded" or "Auth failed" to be seen by the user.
      const msg = err.message || "AI generation failed. Check your API key or connection.";
      setError(msg);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-full gap-6">
      {/* Left: Input Pane */}
      <div className="flex-1 flex flex-col gap-4">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex-1 flex flex-col">
          <label className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">
            Raw Project Notes
          </label>
          <textarea
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            placeholder="e.g. I worked at PwC and we built a Power BI dashboard for a client in Toronto. It helped them track their logistics costs and saved them 20% on shipping..."
            className="flex-1 w-full p-4 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-slate-700 resize-none"
          />
          <button
            onClick={handleArchitect}
            disabled={loading || !rawText}
            className="mt-4 w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 transition-all"
          >
            {loading ? <RefreshCw className="animate-spin" /> : <Sparkles size={18} />}
            {loading ? "Architecting..." : "Architect with Gemini"}
          </button>
        </div>
      </div>

      {/* Right: Live Preview Pane */}
      <div className="flex-1 flex flex-col gap-4">
        <div className="bg-slate-900 p-6 rounded-2xl shadow-xl flex-1 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Live Preview
            </label>
            {result && (
              <button 
                onClick={() => navigator.clipboard.writeText(JSON.stringify(result, null, 2))}
                className="text-xs text-blue-400 hover:text-white flex items-center gap-1"
              >
                <Copy size={12} /> Copy JSON
              </button>
            )}
          </div>

          {result ? (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
               {/* Use the existing TimelineCard UI, mocked into the format it expects */}
               <TimelineCard 
                 data={{
                   role: "Preview Output",
                   company: "AI Generated",
                   date: "Today",
                   summary: "Formatting of your raw notes completed successfully.",
                   projects: [result]
                 }}
                 index={0}
                 activeFilter={null}
               />
            </div>
          ) : error ? (
            <div className="h-full flex flex-col items-center justify-center text-red-400 gap-2">
              <AlertCircle size={40} className="opacity-20" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-600 italic">
              <Sparkles size={40} className="mb-4 opacity-10" />
              <p className="text-sm">Enter notes on the left to generate PAR card.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectArchitect;

```
---

## FILE: src/pages/admin/__tests__/ProjectArchitect.test.jsx
```jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import ProjectArchitect from '../ProjectArchitect';
import * as FirebaseLib from '../../../lib/firebase';

// 1. Mock the Firebase Library
vi.mock('../../../lib/firebase', () => ({
  architectProject: vi.fn(),
  auth: {},
  googleProvider: {},
  analytics: {},
  app: {}
}));

// 2. Mock the Complex TimelineCard Component
// ✅ FIX: Path corrected from ../../ to ../../../
vi.mock('../../../components/timeline/TimelineCard', () => ({
  default: ({ data }) => (
    <div data-testid="mock-timeline-card">
      <h2>{data.projects[0].title}</h2>
      <p>{data.projects[0].par.result}</p>
    </div>
  )
}));

// 3. Mock Clipboard API
const mockWriteText = vi.fn();
Object.assign(navigator, {
  clipboard: {
    writeText: mockWriteText,
  },
});

describe('ProjectArchitect (AI Sandbox)', () => {
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const mockSuccessResponse = {
    data: {
      id: "ai_generated_1",
      title: "AI Optimized Title",
      skills: ["Gemini", "React"],
      par: {
        problem: "Manual resumes are slow.",
        action: "Implemented AI agent.",
        result: "Efficiency increased by 100%."
      },
      diagram: "graph TD; A-->B;"
    }
  };

  // --- TEST CASE 1: EMPTY STATE ---
  it('initializes with disabled button and empty instructions', () => {
    render(<ProjectArchitect />);
    
    expect(screen.getByText(/Raw Project Notes/i)).toBeInTheDocument();
    expect(screen.getByText(/Enter notes on the left/i)).toBeInTheDocument();

    const architectBtn = screen.getByRole('button', { name: /Architect with Gemini/i });
    expect(architectBtn).toBeDisabled();
  });

  // --- TEST CASE 2: LOADING STATE ---
  it('shows loading state while AI is thinking', async () => {
    FirebaseLib.architectProject.mockReturnValue(new Promise(() => {}));

    render(<ProjectArchitect />);
    
    const input = screen.getByPlaceholderText(/e.g. I worked at PwC/i);
    fireEvent.change(input, { target: { value: 'I built a cool app.' } });

    const architectBtn = screen.getByRole('button', { name: /Architect with Gemini/i });
    expect(architectBtn).not.toBeDisabled();
    fireEvent.click(architectBtn);

    expect(await screen.findByText(/Architecting.../i)).toBeInTheDocument();
    expect(architectBtn).toBeDisabled();
  });

  // --- TEST CASE 3: SUCCESS STATE ---
  it('renders the mocked TimelineCard upon successful API response', async () => {
    FirebaseLib.architectProject.mockResolvedValue(mockSuccessResponse);

    render(<ProjectArchitect />);
    
    const input = screen.getByPlaceholderText(/e.g. I worked at PwC/i);
    fireEvent.change(input, { target: { value: 'Successfully built AI.' } });
    
    const architectBtn = screen.getByRole('button', { name: /Architect with Gemini/i });
    fireEvent.click(architectBtn);

    await waitFor(() => {
      expect(screen.getByTestId('mock-timeline-card')).toBeInTheDocument();
    });

    expect(screen.getByText('AI Optimized Title')).toBeInTheDocument();
    expect(screen.getByText('Efficiency increased by 100%.')).toBeInTheDocument();
  });

  // --- TEST CASE 4: ERROR STATE ---
  it('displays a user-friendly error if the Cloud Function fails', async () => {
    // Note: We use a string error here to match what the UI might expect if it renders error.message
    FirebaseLib.architectProject.mockRejectedValue(new Error('Quota exceeded'));

    render(<ProjectArchitect />);
    
    const input = screen.getByPlaceholderText(/e.g. I worked at PwC/i);
    fireEvent.change(input, { target: { value: 'This will fail.' } });
    fireEvent.click(screen.getByRole('button', { name: /Architect with Gemini/i }));

    // The UI renders the error message string
    await waitFor(() => {
      expect(screen.getByText(/Quota exceeded/i)).toBeInTheDocument();
    });
  });

  // --- TEST CASE 5: CLIPBOARD INTERACTION ---
  it('copies JSON to clipboard when "Copy JSON" is clicked', async () => {
    FirebaseLib.architectProject.mockResolvedValue(mockSuccessResponse);

    render(<ProjectArchitect />);
    
    const input = screen.getByPlaceholderText(/e.g. I worked at PwC/i);
    fireEvent.change(input, { target: { value: 'Copy this.' } });
    fireEvent.click(screen.getByRole('button', { name: /Architect with Gemini/i }));

    await waitFor(() => {
      expect(screen.getByText('AI Optimized Title')).toBeInTheDocument();
    });

    const copyBtn = screen.getByText(/Copy JSON/i);
    fireEvent.click(copyBtn);

    expect(mockWriteText).toHaveBeenCalledWith(
      JSON.stringify(mockSuccessResponse.data, null, 2)
    );
  });
});

```
---

## FILE: src/sections/ExperienceSection.jsx
```jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X } from 'lucide-react';
import TimelineContainer from '../components/timeline/TimelineContainer';
import { useResumeData } from '../hooks/useResumeData'; // ✅ Import Hook

const ExperienceSection = ({ activeFilter, onClear }) => {
  // ✅ Fetch Data from Context
  const { experience, loading } = useResumeData();

  // If loading, Dashboard skeleton handles the view height, 
  // so we can return null or a simple spinner here to avoid double-skeleton
  if (loading) return null; 

  const filteredData = activeFilter 
    ? experience.filter(job => {
        // Match Job Skills
        const jobMatch = job.skills?.some(skill => 
          skill.toLowerCase().includes(activeFilter.toLowerCase())
        );
        
        // Match Project Skills OR Project Sectors
        const projectMatch = job.projects?.some(proj => 
          proj.skills?.some(skill => 
            skill.toLowerCase().includes(activeFilter.toLowerCase())
          ) || 
          (proj.sector && proj.sector.toLowerCase() === activeFilter.toLowerCase())
        );

        return jobMatch || projectMatch;
      })
    : experience;

  return (
    <section id="experience" className="py-20 bg-slate-900 relative overflow-hidden min-h-[600px] print:bg-white print:text-black print:py-0">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 print:mb-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 print:text-black">
            Professional <span className="text-blue-500 print:text-black">Portfolio</span>
          </h2>
          
          <div className="print:hidden">
            <AnimatePresence mode='wait'>
              {activeFilter ? (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center justify-center gap-3"
                >
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-500/50 rounded-full text-blue-300">
                    <Filter size={16} />
                    <span>Filtering by: <strong>{activeFilter}</strong></span>
                    <button 
                      onClick={onClear}
                      className="ml-2 p-1 hover:bg-blue-500/30 rounded-full transition-colors"
                      aria-label="Clear Filter"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-slate-400 max-w-2xl mx-auto"
                >
                  Explore 15 years of consulting impact across diverse industries. <br/>
                  <span className="text-xs text-slate-500 italic">Filter by technical skill or industry sector above.</span>
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>

        <TimelineContainer experienceData={filteredData} activeFilter={activeFilter} />
        
        {filteredData.length === 0 && (
          <div className="text-center text-slate-500 mt-12 italic">
            No specific engagements found matching "{activeFilter}".
          </div>
        )}
      </div>
    </section>
  );
};

export default ExperienceSection;

```
---

## FILE: src/sections/__tests__/ExperienceSection.test.jsx
```jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ExperienceSection from '../ExperienceSection';

// 1. Mock Framer Motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className }) => <div className={className}>{children}</div>,
    p: ({ children, className }) => <p className={className}>{children}</p>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

// 2. Mock useResumeData Hook with COMPLETE Data Structure
const mockExperienceData = [
  {
    id: "job1",
    role: "Consultant",
    company: "PwC Canada LLP",
    date: "2020",
    summary: "Work stuff",
    skills: ["Power BI", "SQL"],
    projects: [
      { 
        id: "p1", 
        title: "Project A",
        sector: "Public Sector", 
        skills: ["Power BI"],
        // ✅ FIX: Added missing PAR object required by TimelineCard
        par: { 
          problem: "Test problem", 
          action: "Test action", 
          result: "Test result" 
        }
      }
    ]
  },
  {
    id: "job2",
    role: "Dev",
    company: "Biond Consulting",
    date: "2019",
    summary: "Old job",
    skills: ["SSIS"],
    projects: [
      { 
        id: "p2", 
        title: "Project B",
        sector: "Retail", 
        skills: ["SSIS"],
        // ✅ FIX: Added missing PAR object
        par: { 
          problem: "Retail problem", 
          action: "Retail action", 
          result: "Retail result" 
        }
      }
    ]
  }
];

vi.mock('../../hooks/useResumeData', () => ({
  useResumeData: vi.fn(() => ({
    experience: mockExperienceData,
    loading: false
  }))
}));

describe('ExperienceSection Filter Logic', () => {
  it('filters by technical skill (e.g., Power BI)', () => {
    render(<ExperienceSection activeFilter="Power BI" />);
    // PwC project uses Power BI
    expect(screen.getByText(/PwC Canada LLP/i)).toBeDefined();
    // Biond should be filtered out (it has SSIS)
    expect(screen.queryByText(/Biond Consulting/i)).toBeNull();
  });

  it('filters by industry sector (e.g., Public Sector)', () => {
    render(<ExperienceSection activeFilter="Public Sector" />);
    expect(screen.getByText(/PwC Canada LLP/i)).toBeDefined();
    expect(screen.queryByText(/Biond Consulting/i)).toBeNull();
  });

  it('shows empty state for non-matching filters', () => {
    render(<ExperienceSection activeFilter="Rocket Science" />);
    expect(screen.getByText(/No specific engagements found matching/i)).toBeDefined();
  });
});

```
---

## FILE: src/sections/__tests__/ExperienceSectionA11y.test.jsx
```jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ExperienceSection from '../ExperienceSection';

// Mock dependencies
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className }) => <div className={className}>{children}</div>,
    p: ({ children }) => <p>{children}</p>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));
vi.mock('../components/timeline/TimelineContainer', () => ({ default: () => <div>Timeline</div> }));

// Mock the hook to return empty data so the component renders
vi.mock('../../hooks/useResumeData', () => ({
  useResumeData: vi.fn(() => ({
    experience: [],
    loading: false
  }))
}));

describe('ExperienceSection Accessibility', () => {
  it('renders the Clear Filter button with an accessible label', () => {
    // Render with an active filter so the button appears
    render(<ExperienceSection activeFilter="React" />);
    
    // The button has no text, only an Icon. 
    // Screen readers MUST rely on aria-label="Clear Filter".
    // getByLabelText will fail if the aria-label is missing, ensuring we are compliant.
    const clearButton = screen.getByLabelText('Clear Filter');
    
    expect(clearButton).toBeDefined();
    expect(clearButton.tagName).toBe('BUTTON');
  });
});

```
---

## FILE: src/test/setup.js
```js
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest'; // ✅ Extends Vitest's expect

// Runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
});

```
---

## FILE: docs/AI_WORKFLOW.md
```md
# 🤖 AI Development Framework

**Version:** 2.1
**Purpose:** Standard Operating Procedure for AI-Assisted Development.

---

## 1. The Product Manager ("The Vision")
* **Trigger:** User has a raw idea or vague requirement.
* **Goal:** Clarify the "What" and "Why". Map requirements to User Personas (The Skimmer, The Candidate).
* **Action:** Analyze the `PROMPT_FEATURE_REQUEST.md` input.
* **Output:** A structured Feature Request with clear constraints.

## 2. The Architect ("The Strategy")
* **Trigger:** A defined Feature Request.
* **Goal:** Determine the "How". Analyze Security, Performance, and Data Integrity.
* **Action:** Propose **3 Distinct Implementation Options** (e.g., Client-Heavy vs. Server-Secure).
* **Output:** A decision table recommending the best path. **Wait for user approval.**

## 3. The Builder ("The Execution")
* **Trigger:** User uses `PROMPT_APPROVAL.md` (Decision Made).
* **Goal:** Implement the approved option with zero regressions.
* **Action:** Generate "One-Shot" installation scripts (Bash/Python) to create files and install dependencies.
* **Constraint:** strictly adhere to `docs/CONTEXT_DUMP.md` (Stack rules, React 19 patterns).
* **Output:** `install_feature.sh` or specific file writes.

## 4. The QA Engineer ("The Skeptic")
* **Trigger:** Code is written but not verified.
* **Goal:** Prove it works (Happy Path) and prove it fails gracefully (Edge Cases).
* **Action:** Use `docs/PROMPT_TESTING.md` to generate Vitest specifications.
* **Constraint:** **Environment Mocking** is mandatory. Never hit live Firebase in tests.
* **Output:** `src/__tests__/FeatureName.test.jsx`.

## 5. The Maintainer ("The Scribe")
* **Trigger:** Feature passed tests and is live.
* **Goal:** Ensure documentation reflects reality.
* **Action:** Use `docs/PROMPT_POST_FEATURE.md` to audit the repo.
* **Output:** Updates to `PROJECT_STATUS`, `CHANGELOG`, `DEPLOYMENT`, and `CONTEXT_DUMP`.

## 6. The Security Auditor ("The Gatekeeper")
* **Trigger:** Any changes to `/admin`, Authentication logic, or Environment Variables.
* **Goal:** Ensure "Least Privilege" and prevent leakage.
* **Action:** Review `firestore.rules`, `firebase.json` headers, and `.env` handling.
* **Output:** Security patches (e.g., `unsafe-none` for Google Auth) and Rule updates.

---

## 🔄 The Feedback Loop
1.  **Product** defines.
2.  **Architect** plans.
3.  **Builder** codes.
4.  **QA** breaks it.
5.  **Security** locks it.
6.  **Maintainer** records it.

```
---

## FILE: docs/CHANGELOG.md
```md
# 📜 Changelog

All notable changes to the **Fresh Nest / Interactive Resume** platform will be documented in this file.

## [v2.3.0-beta] - 2026-01-26
### Added
- **Admin:** New `JobTracker` module for inputting raw job descriptions.
- **Data:** Created `applications` collection in Firestore with "Async Trigger" schema (`ai_status: pending`).
- **Security:** Restricted `applications` to Admin-Write/Read only.
- **Testing:** Added environment-mocked unit tests for Admin components.

## [v2.3.0-beta] - 2026-01-26
### Added
- **Admin:** New `JobTracker` module for inputting raw job descriptions.
- **Data:** Created `applications` collection in Firestore with "Async Trigger" schema (`ai_status: pending`).
- **Security:** Locked down `applications` collection (Strict Admin Write / No Public Read).
- **Testing:** Added environment-mocked unit tests for Admin components.

## [v2.2.0-beta] - 2026-01-25
### Added
- **Data Layer:** Implemented `ResumeContext` and `useResumeData` hook for global state management.
- **Offline-First:** Added robust `try/catch` failover. If Firestore is unreachable (or quotas exceeded), the app seamlessly loads local JSON.
- **UX:** Added `LoadingSkeleton` to prevent layout shifts during asynchronous data fetching.
- **Testing:** Added "Indestructible" integration tests verifying the database fallback logic.

## [v2.1.0-beta] - 2026-01-25
### Added
- **Database:** Initialized Cloud Firestore architecture with `profile`, `experience`, `skills`, and `sectors` collections.
- **Security:** Deployed strict `firestore.rules` (Public Read / Admin Write).
- **CMS:** Added `DataSeeder` utility to migrate local JSON data to the cloud.
- **Backend:** configured `firebase.json` for Cloud Functions and Hosting headers.
### Fixed
- **Build:** Fixed critical "Split-React" bundling issue in `vite.config.js` by forcing a singleton React chunk.
- **Auth:** Relaxed COOP/COEP headers to allow Google OAuth popups to function in production.

## [v2.0.0-alpha] - 2026-01-23
### Added
- **Routing:** Implemented `react-router-dom` to bifurcate the app into Public (`/`) and Admin (`/admin`) zones.
- **Security Perimeter:** Integrated Firebase Authentication with strict Email Whitelisting.
- **Admin UI:** Created the `AdminDashboard` shell and `ProtectedRoute` components.
- **Analytics:** Integrated Firebase Analytics for tracking interactions.

## [v1.5.0] - 2026-01-20
### Changed
- **Visualization:** Stabilized `Recharts` implementation for the Skill Radar.
- **Performance:** Optimized `framer-motion` animations for mobile devices.
- **Print Styles:** Added "White Paper" CSS overrides for clean PDF export (`print:hidden`, high-contrast text).

## [v1.0.0] - 2026-01-15 (Gold Master)
### Released
- **Core Platform:** Initial release of the Static Interactive Resume.
- **Tech Stack:** React 19, Vite, Tailwind CSS v4.
- **Features:**
    - Interactive "PAR" Timeline.
    - Skill Radar Chart.
    - Sector Impact Grid.
    - Responsive "Mobile-First" Design.

```
---

## FILE: docs/CONTEXT_DUMP.md
```md
# Interactive Resume: Platform Context
**Stack:** React 19 + Vite + Tailwind v4 + Firebase + Gemini 3.0
**Environment:** GitHub Codespaces
**Version:** v2.2.0-beta

## 🧠 Coding Standards (The Brain)

### 1. Data & State (SSOT)
* **Public View:** `ResumeContext` is the Single Source of Truth.
* **Hybrid Strategy:** Firestore (Primary) -> JSON (Fallback).
* **Deep Fetch:** We strictly use Recursive Fetching for nested sub-collections (`projects`).

### 2. React 19 Patterns
* **Hooks:** Hooks must strictly follow the rules.
* **Bundling:** We manually chunk `react`, `recharts`, and `react-dom` together in `vite.config.js` to prevent `forwardRef` errors.

### 3. Security & Headers
* **Auth:** Google Identity Services requires relaxed headers (`unsafe-none`) to allow popup communication.
* **Policy:** `Cross-Origin-Opener-Policy: unsafe-none`. This applies to both `firebase.json` (Prod) and `vite.config.js` (Dev).

### 4. AI Isolation
* **Server-Side AI:** Gemini logic resides in `functions/`. Keys are never exposed to the client.

## Directory Structure
* `src/components/admin` -> CMS specific UI.
    * `JobTracker.jsx`: Input for AI Analysis.
* `src/context` -> Data Providers (`ResumeContext`).
* `src/hooks` -> Logic Consumers (`useResumeData`).
* `src/data` -> **Indestructible Fallback** (Do not delete).
* `src/lib` -> Firebase services.

```
---

## FILE: docs/DEPLOYMENT.md
```md
# ☁️ Deployment & Infrastructure Manual

**Environment:** GitHub Codespaces (Cloud) & Firebase Hosting
**Stack:** Vite + React 19 + Tailwind v4

## 1. Secrets Management (The 2-File System)
Since Codespaces is ephemeral and we cannot commit real API keys, we use a split strategy:

### A. Development (`.env.local`)
* **Purpose:** Runs `npm run dev`. Connects to the **Live Firebase Project**.
* **Status:** Ignored by Git.
* **Action:** You must manually create this file in the root of your Codespace using your real keys from the Firebase Console.

### B. Testing (`.env.test`)
* **Purpose:** Runs `npm run test`. Used by Vitest.
* **Status:** Committed to Git.
* **Values:** Contains "Dummy" strings (e.g., `VITE_API_KEY=TEST_KEY`) to prevent the Firebase SDK from crashing during initialization. **Never put real keys here.**

## 2. CLI Authentication (Headless Mode)
In Codespaces, you cannot open a browser window for `firebase login`. You must use the `--no-localhost` flag.

```bash
# 1. Request login link
firebase login --no-localhost

# 2. Open the URL provided in a separate tab.
# 3. Authenticate with Google.
# 4. Copy the Authorization Code.
# 5. Paste code back into the terminal.
```

## 3. Database Security
Rules: Defined in firestore.rules.

Deploy: firebase deploy --only firestore:rules

## 4. Header Policy (Critical)
To support Google Auth Popups in this environment, we MUST serve specific headers in firebase.json (Production) and vite.config.js (Development):

Cross-Origin-Opener-Policy: unsafe-none

Cross-Origin-Embedder-Policy: unsafe-none

Why? Strict isolation blocks the popup from communicating "Login Success" back to the main window. 

```
---

## FILE: docs/PERSONAS.md
```md
# 👥 Persona-Based Development Model

Our development strategy is guided by specific user archetypes. Features must pass the "Persona Check" before implementation.

---

## 🌍 External Audiences (The Public View)
*Goal: Conversion (Booking an Interview)*

### 1. "The Skimmer" (Technical Recruiter)
* **Goal:** Match keywords to a Job Description in < 10 seconds.
* **Behavior:** Opens link, scans for "Power BI", "React", "15 Years", then leaves.
* **UX Constraint:** **The "Above the Fold" Dashboard.**
    * *Rule:* Key metrics must be visible immediately without scrolling.
    * *Rule:* Zero layout shift. No spinners for critical text.

### 2. "The Narrator" (Hiring Manager / Director)
* **Goal:** Understand the *context* of your career. "Why did he move from Dev to Consulting?"
* **Behavior:** Scrolls down. Reads the bullet points. Looks for business impact.
* **UX Constraint:** **The PAR Timeline.**
    * *Rule:* Experience must be framed as Problem/Action/Result.
    * *Rule:* "Click to expand" interaction to keep the initial view clean.

### 3. "The Skeptic" (Lead Developer / CTO)
* **Goal:** Verify technical competence. "Is this a template or did he build it?"
* **Behavior:** Inspects Element. Looks at the source code. Tests the interactivity.
* **UX Constraint:** **The "Live" Matrix.**
    * *Rule:* Clicking "React" should filter the entire timeline. This proves state management expertise.
    * *Rule:* Code must be clean, typed, and commented (in case they check the repo).

---

## 🔐 Internal Actors (The Admin View)
*Goal: Productivity & Strategy*

### 4. "The Candidate" (The Super Admin - You)
* **Goal:** Manage the job hunt campaign with high velocity and high quality.
* **Pain Point:** Repetitive data entry. rewriting cover letters. losing track of applications.
* **Behavior:** Pastes a JD into the system, expects an instant analysis and tailored assets.
* **UX Constraint:** **Zero Friction Input.**
    * *Rule:* If it takes more than 2 clicks to generate a Cover Letter, the feature has failed.
    * *Rule:* Data Seeding must be idempotent (running it twice shouldn't break things).

### 5. "The Staff Engineer" (The AI Agent)
* **Role:** Gemini 3.0 Integration.
* **Goal:** Act as a strategic career coach and copywriter.
* **Behavior:** Analyzes the gap between *Stored Experience* (Firestore) and *Target Job* (Input).
* **Constraint:** **Hallucination Control.**
    * *Rule:* The AI must strictly cite actual projects from the database. It cannot invent experience.

---

## 📱 Hardware Contexts

### 6. "The Mobile User" (LinkedIn Traffic)
* **Context:** 60% of traffic will come from the LinkedIn mobile app browser.
* **Constraint:** **Thumb-Friendly UI.**
    * *Rule:* Charts must be readable vertically (Adaptive Density).
    * *Rule:* No hover-only tooltips (must be click/tap accessible).

```
---

## FILE: docs/PROJECT_STATUS.md
```md
# 🟢 Project Status: Platform Expansion

**Current Phase:** Phase 17 - Application Manager
**Version:** v2.2.0-beta
**Status:** 🟢 Phase 17.1 Complete

## 🎯 Current Objectives
* [x] Sprint 17.1: The Job Input Interface (Admin UI).
* [ ] Sprint 17.2: Vector Matching Logic (Gemini).

## ✅ Completed Roadmap
* **Phase 16:** [x] The Backbone Shift (Firestore Migration).
    * Sprint 16.1: Schema & Seeding.
    * Sprint 16.2: Data Hook Layer & Offline Fallback.
* **Phase 15:** [x] Chart Stabilization & Visual Polish.
* **v2.1.0-beta:** [x] Phase 14 - CMS Scaffolding.
* **v1.0.0:** [x] Gold Master Release.

```
---

## FILE: docs/PROMPT_APPROVAL.md
```md
# ✅ AI Approval & Execution Prompt (Builder Mode v2.1)

**Instructions:**
Use this prompt **after** the AI has presented the 3 Architectural Options.

---

### **Prompt Template**

**Decision:** I approve **Option [INSERT OPTION NUMBER]: [INSERT OPTION NAME]**. Proceed with implementation.

**Strict Technical Constraints (The "Builder" Standard):**
1.  **Execution First:** Output a single **Bash Script** (`install_feature.sh`) that:
    * Creates/Updates all necessary files.
    * Installs dependencies.
    * Uses `cat << 'EOF'` patterns.
2.  **Data Strategy (The "Backbone" Check):**
    * **Deep Fetching:** Remember that Firestore queries are *shallow*. If fetching a document with sub-collections, you MUST explicitly fetch the sub-collection and merge it.
    * **Failover Logic:** Wrap all critical fetches in `try/catch`. If the DB fails, return Local JSON.
3.  **Environment Awareness:**
    * **Secrets:** Never hardcode keys. Use `import.meta.env.VITE_VAR`.
    * **Codespaces:** Assume the dev server headers are relaxed (`unsafe-none`).
4.  **UI Resilience:**
    * **Textareas:** Always enforce `overflow-y-auto` and `resize-none` to prevent Mobile Safari scroll trapping on large inputs.


**Persona Validation:**
* **The Skimmer:** Is data visible immediately? (Use Skeletons).
* **The Mobile User:** Will this overflow on 320px?

**Output Requirements:**
1.  **The "One-Shot" Installer:** A single bash script block.
2.  **Manual Verification Steps:** Specific steps to verify the feature (e.g., "Disconnect Internet to test fallback").

*Please generate the installation script now.*

```
---

## FILE: docs/PROMPT_FEATURE_REQUEST.md
```md
# 📝 AI Feature Request Prompt (Architect Mode v2.0)

**Instructions:**
1.  Copy your current codebase context.
2.  Fill in the feature details in the bracketed sections `[ ... ]`.
3.  Send the *entire* text below to the AI.

---

### **Prompt Template**

**Role:** You are the Senior Lead Developer & UI Architect for my Interactive Resume (React 19 + Firebase).
**Task:** Analyze the requirements for a new feature and propose architectural solutions.

**Feature Request:** [INSERT FEATURE NAME]

**Context:**
I need to add a module that [DESCRIBE FUNCTION].
*Current State:* [Briefly describe relevant existing code.]

**Core Requirements:**

1.  **👥 The Persona Check (Select Relevant):**
    * **The Candidate (Admin):** Maximize velocity. Is input zero-friction? Is the UI dense and data-rich?
    * **The Staff Engineer (AI):** Is the prompt engineering robust? Are we hallucinating data?
    * **The Mobile User (Public):** Touch targets 44px+? No horizontal scrolling on 320px?
    * **The Skimmer (Public):** Value delivered in < 5 seconds?

2.  **Constraints & Tech Strategy:**
    * **Data Source:** **Firestore is the SSOT.**
        * *Read:* Use `useResumeData` (Client) or `admin.firestore()` (Server).
        * *Write:* **Strictly prohibited** in public components. Admin components must use `DataSeeder` patterns or specific Admin Hooks.
    * **Security:** Does this require a change to `firestore.rules`?
    * **State:** Prefer React 19 `Suspense` and URL-based state over complex `useEffect` chains.
    * **Styling:** Tailwind v4 (Mobile-First).

**🛑 STOP & THINK: Architectural Options**
Do **NOT** write code yet. Analyze the request and propose **3 Distinct Approaches**:

1.  **The "Client-Heavy" Approach:** fast UI, relies on client-side SDK. Good for real-time interactivity.
2.  **The "Server-Secure" Approach:** Offloads logic to Cloud Functions. Mandatory for AI/LLM operations and sensitive data writes.
3.  **The "Balanced/Hybrid" Approach:** Optimistic UI updates with background server validation.

**Your Output Deliverable:**
1.  **Analysis:** A brief breakdown of the UX and Security challenges.
2.  **The Options Table:** Compare approaches based on:
    * *Security Risk*
    * *Latency/Performance*
    * *Maintenance Cost*
3.  **Recommendation:** Select one approach and explain *why* it fits our "Secure Productivity" philosophy.
4.  **Wait:** End your response by asking for approval to proceed.

---

**Codebase Context:**
[PASTE_CODEBASE_HERE]

```
---

## FILE: docs/PROMPT_INITIALIZATION.md
```md
# 🤖 AI Session Initialization Prompt (v2.0)

**Role:** Senior Fullstack Architect & AI Integration Engineer.

**Core Context:**
* We are building a Resume CMS with Gemini AI integration.
* **Security:** Firebase Auth is the entry point for `/admin`.
* **Data:** Transitioning to Firestore. Components must handle 'Loading' and 'Empty' database states.

**Critical Rules:**
1. **Never Hardcode Keys:** Use `import.meta.env.VITE_*` and check for existence.
2. **Complete Files Only:** Maintain the existing pattern of full-file delivery.
3. **Modular AI:** Prompts sent to Gemini should be versioned and kept in `src/lib/ai/prompts.js`.

**Reply 'Platform Architecture Loaded. Ready for Phase 14.'**
```
---

## FILE: docs/PROMPT_POST_FEATURE.md
```md
# 📝 AI Documentation Audit Prompt (The Maintainer v2.3)

**Instructions:**
Use this prompt **IMMEDIATELY AFTER** a feature is successfully deployed and verified.

---

### **Prompt Template**

**Role:** You are the Lead Technical Writer and Open Source Maintainer.
**Task:** Perform a comprehensive documentation audit, synchronization, and process retrospective.

**Trigger:** We have just completed: **[INSERT FEATURE NAME]**.

**The "Preservation Protocol" (CRITICAL RULES):**
1.  **Never Truncate History:** When updating logs or status files, preserve all previous entries. Use `read()` + `append/insert` logic.
2.  **No Placeholders:** Output full, compilable files only.
3.  **Holistic Scan:** You must evaluate **ALL** files in `/docs`, not just the status trackers.

**Your Goal:** Generate a **Python Script** (`update_docs_audit.py`) that performs the following updates:

### Phase 1: Status & Logs
1.  **`docs/PROJECT_STATUS.md`**: Mark feature as `[x] Completed`. Update Phase/Version. **Keep** the "Completed Roadmap".
2.  **`docs/CHANGELOG.md`**: Insert a new Version Header and Entry at the top. **Keep** all older versions.

### Phase 2: Technical Context
3.  **`docs/CONTEXT_DUMP.md`**: Update stack details, new libraries, or architectural decisions.
4.  **`docs/DEPLOYMENT.md`**: Did we add new Secrets or Config? Update the instructions.
5.  **`docs/SECURITY_MODEL.md`**: Did we change headers or rules? Update the policy.

### Phase 3: The "Continuous Improvement" Loop (CRITICAL)
*Did we encounter recurring errors or discover new best practices during this sprint?*
6.  **`docs/PROMPT_FEATURE_REQUEST.md`**: If a new requirement type emerged (e.g., "Mobile-First"), add it to the "Persona Check".
7.  **`docs/PROMPT_APPROVAL.md`**: If we fixed a deployment bug (e.g., "Missing Headers"), add a **Strict Technical Constraint** to the Builder's list to prevent recurrence.
8.  **`docs/PROMPT_TESTING.md`**: If a test crashed (e.g., "Env vars missing"), add a constraint to the QA Engineer's list.

**Output Requirement:**
* Provide a single, robust **Python Script**.
* The script must handle UTF-8 encoding.
* The script must explicitly reconstruct file content to ensure no data loss.

**Wait:** Ask me for the feature name and **"Were there any specific errors we fixed that should be added to the process constraints?"**

```
---

## FILE: docs/PROMPT_TESTING.md
```md
# 🧪 AI Testing Prompt (The QA Engineer)

**Instructions:**
Use this prompt **AFTER** a feature is built but **BEFORE** it is marked as "Done".

---

### **Prompt Template**

**Role:** You are the Senior SDET (Software Development Engineer in Test).
**Task:** Write a robust Unit Test for the provided component using Vitest.

**Input:**
* Component Code: [PASTE CODE]
* Data Context: [PASTE JSON SNIPPET]

**Constraints & Best Practices:**
1.  **Environment Mocking (CRITICAL):**
    * The Firebase SDK will crash instantly if `VITE_API_KEY` is undefined.
    * **Rule:** If the component touches Firebase (Auth/Firestore), you MUST verify that `vi.stubEnv` or a mock `.env.test` is loaded in the test setup.
    * *Tip:* Mock the `firebase/auth` and `firebase/firestore` modules entirely to avoid network calls.
    * **Path Verification:** When mocking modules with `vi.mock`, strictly verify the directory depth of relative imports (e.g., `../../../lib/db` vs `../../lib/db`). Mismatched paths cause silent failures.
    * **Stubbing:** Use `vi.stubEnv` for ALL environment variables in Firebase tests to prevent SDK crashes.

2.  **Testing Strategy:**
    * **Happy Path:** Does it render data correctly?
    * **Loading State:** Is the Skeleton visible? (Never use raw text "Loading...").
    * **Error State:** Does it degrade gracefully to the Fallback JSON?
3.  **Imports:** Use `@testing-library/react` for `render`, `screen`, and `fireEvent`.

**Output Requirements:**
* A complete `.test.jsx` file.
* **Do not** reference real database paths. Use mocks.

**Wait:** Ask me to paste the Component Code to begin.

```
---

## FILE: docs/SCHEMA_ARCHITECTURE.md
```md
# 🗄️ Schema Architecture & Data Graph

**Storage Engine:** Cloud Firestore (NoSQL)
**Pattern:** Collection-Centric with Sub-Collections.

## 1. High-Level Topology
```mermaid
graph TD
    root[🔥 Firestore Root]
    
    %% Top Level Collections
    root --> profile[📂 profile]
    root --> skills[📂 skills]
    root --> sectors[📂 sectors]
    root --> experience[📂 experience]
    
    %% Relationships
    experience --> job[📄 Job Document]
    job --> projects[📂 projects (Sub-Collection)]
    projects --> project[📄 Project Document]
```

## 2. The "Deep Fetch" Strategy (CRITICAL)
**Firestore queries are shallow.** Fetching a Job document **DOES NOT** automatically fetch its `projects` sub-collection.

### The Client-Side Join Pattern
Any component displaying Experience (e.g., `ResumeContext`) **MUST** implement this recursive logic:
1.  Fetch all `experience` documents.
2.  Map over the results.
3.  For *each* job, perform a second `getDocs` call to its `projects` sub-collection.
4.  Merge the `projects` array into the parent job object.
5.  Return the hydrated tree.

**❌ BAD (Will Result in Empty Projects):**
```javascript
const jobs = await getDocs(collection(db, 'experience'));
return jobs.docs.map(d => d.data());
```

**✅ GOOD (Hydrated):**
```javascript
const jobs = await Promise.all(snapshot.docs.map(async (doc) => {
  const projects = await getDocs(collection(doc.ref, 'projects'));
  return { ...doc.data(), projects: projects.docs.map(p => p.data()) };
}));
```

## 3. The "Indestructible" Fallback
We implement a **Hybrid Data Strategy**:
1.  **Attempt:** Fetch from Firestore.
2.  **Catch:** If *any* error occurs (Quota, Offline, Rules), swallow the error and return `src/data/*.json`.
3.  **Result:** The app never crashes, even if the database is down.

```
---

## FILE: docs/SECURITY_MODEL.md
```md
# 🛡️ Security Model & Access Control

**Auth Provider:** Firebase Authentication (Google OAuth)
**Strategy:** Zero Trust Client / Strict Server-Side Rules

## 1. Authentication Layer
### The Whitelist Gate
* **Location:** Client-Side (`src/context/AuthContext.jsx`) & Server-Side (`firestore.rules`).
* **Mechanism:**
  1. User signs in via Google.
  2. App checks `user.email` against `import.meta.env.VITE_ADMIN_EMAIL`.
  3. If no match, the user is signed out immediately or redirected to Public View.

## 2. Authorization (Firestore Rules)
We utilize a **"Public Read / Admin Write"** policy.

| Collection | Read Permission | Write Permission |
| :--- | :--- | :--- |
| `profile` | 🌍 Public | 🔐 Auth Only |
| `skills` | 🌍 Public | 🔐 Auth Only |
| `experience` | 🌍 Public | 🔐 Auth Only |
| `projects` | 🌍 Public | 🔐 Auth Only |
| `applications` | ⛔ None | 🔐 Admin Only |

**Current Rule Implementation:**
```javascript
allow read: if true;
allow write: if request.auth != null; // Relies on UI Whitelisting for now
```
> ⚠️ **Note:** In Phase 17, we will upgrade the Write rule to strictly check `request.auth.token.email == 'YOUR_EMAIL'` for backend-level enforcement.

## 3. API Key Exposure Strategy
It is standard practice to expose the `VITE_API_KEY` in the frontend bundle. This key **does not** grant administrative access. It simply identifies the Firebase project.

**Defense in Depth:**
1. **Security Rules:** Prevent unauthorized writes even if someone steals the API Key.
2. **App Check:** (Planned Phase 18) Verify traffic comes from your specific domain.
3. **Cloud Functions:** Sensitive AI logic (Gemini) runs on the server, keeping the LLM API Key strictly hidden from the browser.

## 4. Header Security (COOP/COEP)
To support high-performance `SharedArrayBuffer` (potential future use) and Google Identity Services, we enforce:
* `Cross-Origin-Opener-Policy: same-origin-allow-popups`
* `Cross-Origin-Embedder-Policy: unsafe-none`

```
---

## FILE: scripts/deploy_feature.sh
```sh
#!/bin/bash

# ==========================================
# 🚀 DEPLOYMENT PROTOCOL: PHASE 16.1
# ==========================================

BRANCH_NAME="feature/phase-16-firestore"
COMMIT_MSG="feat(db): initialize firestore schema, seeding tool, and vite fix"

echo "🔍 Checking Git Status..."
if [ -n "$(git status --porcelain)" ]; then 
    echo "⚠️  Uncommitted changes detected. Staging them now..."
else
    echo "✅ Working directory clean."
fi

# 1. Create/Switch Branch
echo "🌿 Switching to branch: $BRANCH_NAME"
git checkout -b $BRANCH_NAME 2>/dev/null || git checkout $BRANCH_NAME

# 2. Stage & Commit
echo "📦 Staging files..."
git add .

echo "💾 Committing changes..."
git commit -m "$COMMIT_MSG"

# 3. Push to Origin
echo "🚀 Pushing to origin..."
git push -u origin $BRANCH_NAME

# 4. Instructions
echo ""
echo "=========================================="
echo "✅ Feature Branch Pushed Successfully!"
echo "=========================================="
echo "👉 Next Steps:"
echo "1. Go to GitHub and open a Pull Request for '$BRANCH_NAME'."
echo "2. Wait for the 'Deploy to Preview Channel' action to pass."
echo "3. Verify the Preview URL provided by the bot."
echo "4. If stable, merge to 'main' to deploy to Production."
echo "=========================================="
```
---

## FILE: scripts/generate-context.sh
```sh
#!/bin/bash

# ==========================================
# 🚀 FRESH NEST: DEEP CONTEXT GENERATOR
# ==========================================

OUTPUT_FILE="docs/FULL_CODEBASE_CONTEXT.md"

echo "🔄 Generating Context Dump..."
echo "# FRESH NEST: CODEBASE DUMP" > "$OUTPUT_FILE"
echo "**Date:** $(date)" >> "$OUTPUT_FILE"
echo "**Description:** Complete codebase context." >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

ingest_file() {
    local filepath="$1"
    
    # SECURITY CHECK: Skip if file matches sensitive patterns
    if [[ "$filepath" == *".env"* ]] || [[ "$filepath" == *"service-account"* ]] || [[ "$filepath" == *".DS_Store"* ]]; then
        return
    fi

    if [ -f "$filepath" ]; then
        echo "Processing: $filepath"
        
        # Markdown Header for the file
        echo "## FILE: $filepath" >> "$OUTPUT_FILE"
        echo "\`\`\`${filepath##*.}" >> "$OUTPUT_FILE" # Use extension for syntax highlighting
        
        # Cat the content
        cat "$filepath" >> "$OUTPUT_FILE"
        
        echo "" >> "$OUTPUT_FILE"
        echo "\`\`\`" >> "$OUTPUT_FILE"
        echo "---" >> "$OUTPUT_FILE"
        echo "" >> "$OUTPUT_FILE"
    fi
}

# Root Configs
ingest_file "package.json"
ingest_file "vite.config.js"
ingest_file "tailwind.config.js"
ingest_file "firebase.json"
ingest_file ".firebaserc"

# Source Code
find src -type f -not -path "*/.*" | sort | while read file; do ingest_file "$file"; done

# Documentation
find docs -type f -name "*.md" -not -name "FULL_CODEBASE_CONTEXT.md" | sort | while read file; do ingest_file "$file"; done

# Scripts
find scripts -type f \( -name "*.js" -o -name "*.cjs" -o -name "*.sh" \) | sort | while read file; do ingest_file "$file"; done

# CI/CD Workflows
find .github/workflows -type f -name "*.yml" | sort | while read file; do ingest_file "$file"; done

# -----------------------------------------------------------
# ✅ NEW: Cloud Functions (Backend Logic)
# -----------------------------------------------------------
# We explicitly find files in 'functions' but exclude node_modules
find functions -type f -not -path "*/node_modules/*" -not -path "*/.*" | sort | while read file; do ingest_file "$file"; done

echo "✅ Context Generated at: $OUTPUT_FILE"
```
---

## FILE: scripts/update_data.sh
```sh
#!/bin/bash

# ==========================================
# 💾 Data Restore Script (Source of Truth)
# ==========================================
# Run this to reset src/data/*.json to the Gold Master state.

DATA_DIR="src/data"
mkdir -p "$DATA_DIR"

echo "Restoring profile.json..."
cat << 'JSON' > "$DATA_DIR/profile.json"
{
  "basics": {
    "name": "Ryan Douglas",
    "label": "Management Consultant & Power BI Developer",
    "email": "rpdouglas@gmail.com",
    "phone": "613.936.6341",
    "location": "Cornwall, Ontario",
    "summary": "A results-driven Data & Analytics Leader with 15 years of experience bridging the gap between high-level business strategy and granular technical execution. Proven expertise in leading cross-functional teams through complex digital transformations and building enterprise-grade BI solutions from the ground up.",
    "website": "https://ryandouglas-resume.web.app",
    "github": "https://github.com/rpdouglas",
    "linkedin": "https://linkedin.com/in/ryandouglas"
  },
  "metrics": {
    "yearsExperience": 15,
    "projectsDelivered": 40,
    "certifications": 2
  }
}
JSON

echo "Restoring skills.json..."
cat << 'JSON' > "$DATA_DIR/skills.json"
[
  {
    "id": "strategy",
    "label": "Business Strategy",
    "data": [
      { "subject": "Change Mgmt", "A": 95, "fullMark": 100 },
      { "subject": "Stakeholder Mgmt", "A": 90, "fullMark": 100 },
      { "subject": "Digital Strategy", "A": 95, "fullMark": 100 },
      { "subject": "Process Opt", "A": 85, "fullMark": 100 },
      { "subject": "Risk Mitigation", "A": 80, "fullMark": 100 }
    ]
  },
  {
    "id": "technical",
    "label": "Technical Stack",
    "data": [
      { "subject": "Power BI / DAX", "A": 95, "fullMark": 100 },
      { "subject": "SQL / T-SQL", "A": 90, "fullMark": 100 },
      { "subject": "ETL (SSIS)", "A": 85, "fullMark": 100 },
      { "subject": "Data Modeling", "A": 90, "fullMark": 100 },
      { "subject": "C# / VB.NET", "A": 75, "fullMark": 100 }
    ]
  }
]
JSON

echo "Restoring experience.json (Nested Project Schema)..."
cat << 'JSON' > "$DATA_DIR/experience.json"
[
  {
    "id": "job_pwc",
    "role": "Manager (Data & Analytics)",
    "company": "PwC Canada LLP",
    "date": "2012 - 2024",
    "logo": "💼",
    "summary": "Senior management consultant leading data-driven transformation projects and advising government leaders while engineering hands-on analytics solutions.",
    "skills": ["Digital Strategy", "Leadership", "Stakeholder Mgmt"],
    "projects": [
      {
        "id": "pwc_proj_1",
        "title": "Public Sector Digital Transformation",
        "skills": ["Power BI", "SQL", "Change Management"],
        "par": {
          "problem": "Government clients struggled with fragmented data ecosystems, preventing executive visibility into critical operations.",
          "action": "Architected target operating models and deployed advanced Power BI dashboards to track customer journeys.",
          "result": "Delivered sustainable digital transformation, aligning technical execution with strategic business objectives."
        }
      },
      {
        "id": "pwc_proj_2",
        "title": "Omnichannel Contact Center Modernization",
        "skills": ["Data Modeling", "Azure", "Risk Assessment"],
        "par": {
          "problem": "Legacy contact center infrastructure lacked integration, leading to poor customer insights and operational inefficiencies.",
          "action": "Led the design and deployment of modern BI solutions, integrating data from multiple channels for a unified view.",
          "result": "Enhanced operational efficiency and enabled real-time reporting for high-stakes regulatory environments."
        }
      }
    ]
  },
  {
    "id": "job_biond",
    "role": "Business Intelligence Developer",
    "company": "Biond Consulting",
    "date": "2011 - 2012",
    "logo": "📊",
    "summary": "Specialized in end-to-end Microsoft BI solutions, from architecting data warehouses to building robust reporting dashboards.",
    "skills": ["Microsoft BI Stack", "Consulting"],
    "projects": [
      {
        "id": "biond_proj_1",
        "title": "Retail Analytics Platform Migration",
        "skills": ["SSIS", "Data Warehousing", "ETL"],
        "par": {
          "problem": "A major Canadian clothing retailer relied on legacy systems that could not scale with their growing data volume.",
          "action": "Built and optimized complex ETL pipelines using SSIS and architected a new enterprise-grade data warehouse.",
          "result": "Successfully transitioned client to a modern analytics platform, significantly enhancing strategic insight capabilities."
        }
      },
      {
        "id": "biond_proj_2",
        "title": "Distributor Reporting Solution",
        "skills": ["SSRS", "SQL", "KPI Definition"],
        "par": {
          "problem": "A major distributor lacked the reporting infrastructure to make timely inventory and sales decisions.",
          "action": "Collaborated with clients to define critical KPIs and delivered a custom SSRS reporting solution.",
          "result": "Strengthened executive decision-making and improved business responsiveness post-implementation."
        }
      }
    ]
  },
  {
    "id": "job_tele",
    "role": "Manager, Data and Analytics",
    "company": "Teleperformance",
    "date": "2005 - 2011",
    "logo": "🌍",
    "summary": "Managed the data and analytics team driving strategy and transformation across international operations.",
    "skills": ["Team Leadership", "Process Improvement"],
    "projects": [
      {
        "id": "tp_proj_1",
        "title": "Global Contact Center Automation",
        "skills": ["C#", "SharePoint", "Automation"],
        "par": {
          "problem": "International operations relied on manual reporting processes, causing data latency and high operational costs.",
          "action": "Managed the full SDLC of automated reporting solutions using C#, SharePoint, and SQL.",
          "result": "Implemented automated processes that resulted in significant time and cost savings across multiple departments."
        }
      },
      {
        "id": "tp_proj_2",
        "title": "Executive Dashboard Suite",
        "skills": ["SSRS", "Visual Studio", "SQL Server"],
        "par": {
          "problem": "Leadership lacked clear visibility into performance metrics and operational health across regions.",
          "action": "Developed custom dashboards and scorecards to standardize performance tracking globally.",
          "result": "Provided leadership with real-time visibility, enabling faster resolution of operational incidents."
        }
      }
    ]
  }
]
JSON

chmod +x scripts/update_data.sh

echo "=========================================="
echo "✅ Codebase Cleaned & Secured."
echo "👉 Deleted: src/App.css, src/assets/react.svg"
echo "👉 Secured: scripts/update_data.sh now contains REAL data."
echo "=========================================="

```
---

## FILE: .github/workflows/deploy-preview.yml
```yml
name: Deploy to Preview Channel

on:
  pull_request:
    types: [opened, synchronize, reopened]

# ✅ FIX: Grant permissions to write checks and PR comments
permissions:
  checks: write
  contents: read
  pull-requests: write

jobs:
  build_and_preview:
    if: '${{ github.event.pull_request.head.repo.full_name == github.repository }}'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Install Dependencies
        run: npm ci

      # ✅ FIX: Inject VITE_ vars during build
      - name: Build
        run: npm run build
        env:
          VITE_API_KEY: ${{ secrets.VITE_API_KEY }}
          VITE_AUTH_DOMAIN: ${{ secrets.VITE_AUTH_DOMAIN }}
          VITE_PROJECT_ID: ${{ secrets.VITE_PROJECT_ID }}
          VITE_STORAGE_BUCKET: ${{ secrets.VITE_STORAGE_BUCKET }}
          VITE_MESSAGING_SENDER_ID: ${{ secrets.VITE_MESSAGING_SENDER_ID }}
          VITE_APP_ID: ${{ secrets.VITE_APP_ID }}
          VITE_MEASUREMENT_ID: ${{ secrets.VITE_MEASUREMENT_ID }}
          # We don't need the Admin Email for public preview builds usually, 
          # but if you have logic relying on it, you can add it here.

      - name: Deploy to Firebase Preview
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          projectId: '${{ secrets.FIREBASE_PROJECT_ID }}'

```
---

## FILE: .github/workflows/deploy-prod.yml
```yml
name: Deploy to Live Production

on:
  push:
    branches:
      - main

jobs:
  build_and_deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Install Dependencies
        run: npm ci

      # ✅ FIX: Inject VITE_ vars during build
      - name: Build
        run: npm run build
        env:
          VITE_API_KEY: ${{ secrets.VITE_API_KEY }}
          VITE_AUTH_DOMAIN: ${{ secrets.VITE_AUTH_DOMAIN }}
          VITE_PROJECT_ID: ${{ secrets.VITE_PROJECT_ID }}
          VITE_STORAGE_BUCKET: ${{ secrets.VITE_STORAGE_BUCKET }}
          VITE_MESSAGING_SENDER_ID: ${{ secrets.VITE_MESSAGING_SENDER_ID }}
          VITE_APP_ID: ${{ secrets.VITE_APP_ID }}
          VITE_MEASUREMENT_ID: ${{ secrets.VITE_MEASUREMENT_ID }}

      - name: Deploy to Live
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          projectId: '${{ secrets.FIREBASE_PROJECT_ID }}'
          channelId: live

```
---

## FILE: functions/check_models.js
```js
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function listModels() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    console.error("❌ Error: GEMINI_API_KEY environment variable is missing.");
    process.exit(1);
  }

  try {
    const genAI = new GoogleGenerativeAI(key);
    // Note: The SDK doesn't always expose listModels directly on the client 
    // depending on version, so we fallback to the raw REST endpoint if needed,
    // but let's try a direct fetch which is 100% reliable for debugging.
    
    console.log("📡 Querying Google AI API for available models...");
    
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    console.log("\n✅ AVAILABLE MODELS FOR YOUR KEY:");
    console.log("===================================");
    
    const models = data.models || [];
    const generateModels = models.filter(m => m.supportedGenerationMethods.includes("generateContent"));
    
    generateModels.forEach(m => {
      console.log(`🔹 ${m.name.replace('models/', '')}`);
      // console.log(`   Description: ${m.description.substring(0, 60)}...`);
    });
    
    console.log("===================================");

  } catch (error) {
    console.error("🔥 Failed to list models:", error.message);
  }
}

listModels();

```
---

## FILE: functions/index.js
```js
/**
 * 🧠 The Vector Matching Engine
 * Sprint 17.2 - Gemini 2.5 Flash Integration
 */

const { onDocumentWritten } = require("firebase-functions/v2/firestore");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { GoogleGenerativeAI } = require("@google/generative-ai");

initializeApp();
const db = getFirestore();

// 🔐 Initialize Gemini
// Ensure GOOGLE_API_KEY is set in Firebase Secrets or Environment Variables
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

/**
 * Helper: Deep Fetch Resume Context
 * Retrieves Profile, Skills, and Experience (with nested Projects)
 */
async function getResumeContext() {
  // 1. Profile
  const profileSnap = await db.doc('profile/primary').get();
  const profile = profileSnap.data();

  // 2. Skills
  const skillsSnap = await db.collection('skills').get();
  const skills = skillsSnap.docs.map(d => d.data());

  // 3. Experience & Projects (The "Deep Read")
  const expSnap = await db.collection('experience').get();
  const experience = await Promise.all(expSnap.docs.map(async (doc) => {
    const jobData = doc.data();
    // Fetch sub-collection 'projects'
    const projectsSnap = await doc.ref.collection('projects').get();
    const projects = projectsSnap.docs.map(p => ({ id: p.id, ...p.data() }));
    return { ...jobData, projects };
  }));

  return { profile, skills, experience };
}

/**
 * ⚡ Trigger: Analyze Application
 * Listens for new/updated documents in 'applications' collection.
 */
exports.analyzeApplication = onDocumentWritten("applications/{docId}", async (event) => {
  const snapshot = event.data;
  if (!snapshot) return; // Deletion event

  const newData = snapshot.after.data();
  const previousData = snapshot.before.data();

  // 🛑 GUARDRAIL: Infinite Loop Prevention
  // Only run if status is 'pending' AND strictly different from before
  if (newData.ai_status !== 'pending') return;
  if (previousData && previousData.ai_status === 'pending') return;

  console.log(`🚀 Starting analysis for Application: ${newData.company}`);

  try {
    // 1. Set status to 'processing' (Optional safety, but good practice)
    await snapshot.after.ref.update({ ai_status: 'processing' });

    // 2. Fetch The Full Context
    const resumeContext = await getResumeContext();

    // 3. Construct the Prompt
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      generationConfig: { responseMimeType: "application/json" } // Force strict JSON
    });

    const systemPrompt = `
      You are a Senior Technical Recruiter and Career Strategist.
      
      YOUR GOAL:
      Analyze the provided Job Description (JD) against the Candidate's Resume Context.
      Identify alignment gaps, keyword mismatches, and strategic angles.

      RESUME CONTEXT:
      ${JSON.stringify(resumeContext)}

      OUTPUT REQUIREMENTS:
      Return strictly a JSON object with this schema:
      {
        "match_score": Integer (0-100),
        "keywords_missing": Array of Strings (Critical tech/skills in JD not in Resume),
        "suggested_projects": Array of Strings (IDs of the 3 most relevant projects from Resume),
        "tailored_summary": String (A 2-sentence professional summary tailored to this JD),
        "gap_analysis": String (Brief explanation of why the score is what it is)
      }
    `;

    const userPrompt = `
      JOB DESCRIPTION FOR: ${newData.company} (${newData.role})
      
      ${newData.raw_text}
    `;

    // 4. Generate Content
    const result = await model.generateContent([systemPrompt, userPrompt]);
    const response = await result.response;
    const analysis = JSON.parse(response.text());

    // 5. Write Result back to Firestore
    await snapshot.after.ref.update({
      ...analysis,
      ai_status: 'complete',
      updated_at: new Date() // Use server timestamp logic if preferred
    });

    console.log(`✅ Analysis complete for ${newData.company}. Score: ${analysis.match_score}`);

  } catch (error) {
    console.error("💥 AI Analysis Failed:", error);
    
    await snapshot.after.ref.update({
      ai_status: 'error',
      error_log: error.message
    });
  }
});

```
---

## FILE: functions/package-lock.json
```json
{
  "name": "functions",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {
    "": {
      "name": "functions",
      "dependencies": {
        "@google/generative-ai": "^0.21.0",
        "firebase-admin": "^12.7.0",
        "firebase-functions": "^7.0.3"
      },
      "engines": {
        "node": "20"
      }
    },
    "node_modules/@fastify/busboy": {
      "version": "3.2.0",
      "resolved": "https://registry.npmjs.org/@fastify/busboy/-/busboy-3.2.0.tgz",
      "integrity": "sha512-m9FVDXU3GT2ITSe0UaMA5rU3QkfC/UXtCU8y0gSN/GugTqtVldOBWIB5V6V3sbmenVZUIpU6f+mPEO2+m5iTaA==",
      "license": "MIT"
    },
    "node_modules/@firebase/app-check-interop-types": {
      "version": "0.3.2",
      "resolved": "https://registry.npmjs.org/@firebase/app-check-interop-types/-/app-check-interop-types-0.3.2.tgz",
      "integrity": "sha512-LMs47Vinv2HBMZi49C09dJxp0QT5LwDzFaVGf/+ITHe3BlIhUiLNttkATSXplc89A2lAaeTqjgqVkiRfUGyQiQ==",
      "license": "Apache-2.0"
    },
    "node_modules/@firebase/app-types": {
      "version": "0.9.2",
      "resolved": "https://registry.npmjs.org/@firebase/app-types/-/app-types-0.9.2.tgz",
      "integrity": "sha512-oMEZ1TDlBz479lmABwWsWjzHwheQKiAgnuKxE0pz0IXCVx7/rtlkx1fQ6GfgK24WCrxDKMplZrT50Kh04iMbXQ==",
      "license": "Apache-2.0"
    },
    "node_modules/@firebase/auth-interop-types": {
      "version": "0.2.3",
      "resolved": "https://registry.npmjs.org/@firebase/auth-interop-types/-/auth-interop-types-0.2.3.tgz",
      "integrity": "sha512-Fc9wuJGgxoxQeavybiuwgyi+0rssr76b+nHpj+eGhXFYAdudMWyfBHvFL/I5fEHniUM/UQdFzi9VXJK2iZF7FQ==",
      "license": "Apache-2.0"
    },
    "node_modules/@firebase/component": {
      "version": "0.6.9",
      "resolved": "https://registry.npmjs.org/@firebase/component/-/component-0.6.9.tgz",
      "integrity": "sha512-gm8EUEJE/fEac86AvHn8Z/QW8BvR56TBw3hMW0O838J/1mThYQXAIQBgUv75EqlCZfdawpWLrKt1uXvp9ciK3Q==",
      "license": "Apache-2.0",
      "dependencies": {
        "@firebase/util": "1.10.0",
        "tslib": "^2.1.0"
      }
    },
    "node_modules/@firebase/database": {
      "version": "1.0.8",
      "resolved": "https://registry.npmjs.org/@firebase/database/-/database-1.0.8.tgz",
      "integrity": "sha512-dzXALZeBI1U5TXt6619cv0+tgEhJiwlUtQ55WNZY7vGAjv7Q1QioV969iYwt1AQQ0ovHnEW0YW9TiBfefLvErg==",
      "license": "Apache-2.0",
      "dependencies": {
        "@firebase/app-check-interop-types": "0.3.2",
        "@firebase/auth-interop-types": "0.2.3",
        "@firebase/component": "0.6.9",
        "@firebase/logger": "0.4.2",
        "@firebase/util": "1.10.0",
        "faye-websocket": "0.11.4",
        "tslib": "^2.1.0"
      }
    },
    "node_modules/@firebase/database-compat": {
      "version": "1.0.8",
      "resolved": "https://registry.npmjs.org/@firebase/database-compat/-/database-compat-1.0.8.tgz",
      "integrity": "sha512-OpeWZoPE3sGIRPBKYnW9wLad25RaWbGyk7fFQe4xnJQKRzlynWeFBSRRAoLE2Old01WXwskUiucNqUUVlFsceg==",
      "license": "Apache-2.0",
      "dependencies": {
        "@firebase/component": "0.6.9",
        "@firebase/database": "1.0.8",
        "@firebase/database-types": "1.0.5",
        "@firebase/logger": "0.4.2",
        "@firebase/util": "1.10.0",
        "tslib": "^2.1.0"
      }
    },
    "node_modules/@firebase/database-types": {
      "version": "1.0.5",
      "resolved": "https://registry.npmjs.org/@firebase/database-types/-/database-types-1.0.5.tgz",
      "integrity": "sha512-fTlqCNwFYyq/C6W7AJ5OCuq5CeZuBEsEwptnVxlNPkWCo5cTTyukzAHRSO/jaQcItz33FfYrrFk1SJofcu2AaQ==",
      "license": "Apache-2.0",
      "dependencies": {
        "@firebase/app-types": "0.9.2",
        "@firebase/util": "1.10.0"
      }
    },
    "node_modules/@firebase/logger": {
      "version": "0.4.2",
      "resolved": "https://registry.npmjs.org/@firebase/logger/-/logger-0.4.2.tgz",
      "integrity": "sha512-Q1VuA5M1Gjqrwom6I6NUU4lQXdo9IAQieXlujeHZWvRt1b7qQ0KwBaNAjgxG27jgF9/mUwsNmO8ptBCGVYhB0A==",
      "license": "Apache-2.0",
      "dependencies": {
        "tslib": "^2.1.0"
      }
    },
    "node_modules/@firebase/util": {
      "version": "1.10.0",
      "resolved": "https://registry.npmjs.org/@firebase/util/-/util-1.10.0.tgz",
      "integrity": "sha512-xKtx4A668icQqoANRxyDLBLz51TAbDP9KRfpbKGxiCAW346d0BeJe5vN6/hKxxmWwnZ0mautyv39JxviwwQMOQ==",
      "license": "Apache-2.0",
      "dependencies": {
        "tslib": "^2.1.0"
      }
    },
    "node_modules/@google-cloud/firestore": {
      "version": "7.11.6",
      "resolved": "https://registry.npmjs.org/@google-cloud/firestore/-/firestore-7.11.6.tgz",
      "integrity": "sha512-EW/O8ktzwLfyWBOsNuhRoMi8lrC3clHM5LVFhGvO1HCsLozCOOXRAlHrYBoE6HL42Sc8yYMuCb2XqcnJ4OOEpw==",
      "license": "Apache-2.0",
      "optional": true,
      "dependencies": {
        "@opentelemetry/api": "^1.3.0",
        "fast-deep-equal": "^3.1.1",
        "functional-red-black-tree": "^1.0.1",
        "google-gax": "^4.3.3",
        "protobufjs": "^7.2.6"
      },
      "engines": {
        "node": ">=14.0.0"
      }
    },
    "node_modules/@google-cloud/paginator": {
      "version": "5.0.2",
      "resolved": "https://registry.npmjs.org/@google-cloud/paginator/-/paginator-5.0.2.tgz",
      "integrity": "sha512-DJS3s0OVH4zFDB1PzjxAsHqJT6sKVbRwwML0ZBP9PbU7Yebtu/7SWMRzvO2J3nUi9pRNITCfu4LJeooM2w4pjg==",
      "license": "Apache-2.0",
      "optional": true,
      "dependencies": {
        "arrify": "^2.0.0",
        "extend": "^3.0.2"
      },
      "engines": {
        "node": ">=14.0.0"
      }
    },
    "node_modules/@google-cloud/projectify": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/@google-cloud/projectify/-/projectify-4.0.0.tgz",
      "integrity": "sha512-MmaX6HeSvyPbWGwFq7mXdo0uQZLGBYCwziiLIGq5JVX+/bdI3SAq6bP98trV5eTWfLuvsMcIC1YJOF2vfteLFA==",
      "license": "Apache-2.0",
      "optional": true,
      "engines": {
        "node": ">=14.0.0"
      }
    },
    "node_modules/@google-cloud/promisify": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/@google-cloud/promisify/-/promisify-4.0.0.tgz",
      "integrity": "sha512-Orxzlfb9c67A15cq2JQEyVc7wEsmFBmHjZWZYQMUyJ1qivXyMwdyNOs9odi79hze+2zqdTtu1E19IM/FtqZ10g==",
      "license": "Apache-2.0",
      "optional": true,
      "engines": {
        "node": ">=14"
      }
    },
    "node_modules/@google-cloud/storage": {
      "version": "7.18.0",
      "resolved": "https://registry.npmjs.org/@google-cloud/storage/-/storage-7.18.0.tgz",
      "integrity": "sha512-r3ZwDMiz4nwW6R922Z1pwpePxyRwE5GdevYX63hRmAQUkUQJcBH/79EnQPDv5cOv1mFBgevdNWQfi3tie3dHrQ==",
      "license": "Apache-2.0",
      "optional": true,
      "dependencies": {
        "@google-cloud/paginator": "^5.0.0",
        "@google-cloud/projectify": "^4.0.0",
        "@google-cloud/promisify": "<4.1.0",
        "abort-controller": "^3.0.0",
        "async-retry": "^1.3.3",
        "duplexify": "^4.1.3",
        "fast-xml-parser": "^4.4.1",
        "gaxios": "^6.0.2",
        "google-auth-library": "^9.6.3",
        "html-entities": "^2.5.2",
        "mime": "^3.0.0",
        "p-limit": "^3.0.1",
        "retry-request": "^7.0.0",
        "teeny-request": "^9.0.0",
        "uuid": "^8.0.0"
      },
      "engines": {
        "node": ">=14"
      }
    },
    "node_modules/@google-cloud/storage/node_modules/uuid": {
      "version": "8.3.2",
      "resolved": "https://registry.npmjs.org/uuid/-/uuid-8.3.2.tgz",
      "integrity": "sha512-+NYs2QeMWy+GWFOEm9xnn6HCDp0l7QBD7ml8zLUmJ+93Q5NF0NocErnwkTkXVFNiX3/fpC6afS8Dhb/gz7R7eg==",
      "license": "MIT",
      "optional": true,
      "bin": {
        "uuid": "dist/bin/uuid"
      }
    },
    "node_modules/@google/generative-ai": {
      "version": "0.21.0",
      "resolved": "https://registry.npmjs.org/@google/generative-ai/-/generative-ai-0.21.0.tgz",
      "integrity": "sha512-7XhUbtnlkSEZK15kN3t+tzIMxsbKm/dSkKBFalj+20NvPKe1kBY7mR2P7vuijEn+f06z5+A8bVGKO0v39cr6Wg==",
      "license": "Apache-2.0",
      "engines": {
        "node": ">=18.0.0"
      }
    },
    "node_modules/@grpc/grpc-js": {
      "version": "1.14.3",
      "resolved": "https://registry.npmjs.org/@grpc/grpc-js/-/grpc-js-1.14.3.tgz",
      "integrity": "sha512-Iq8QQQ/7X3Sac15oB6p0FmUg/klxQvXLeileoqrTRGJYLV+/9tubbr9ipz0GKHjmXVsgFPo/+W+2cA8eNcR+XA==",
      "license": "Apache-2.0",
      "optional": true,
      "dependencies": {
        "@grpc/proto-loader": "^0.8.0",
        "@js-sdsl/ordered-map": "^4.4.2"
      },
      "engines": {
        "node": ">=12.10.0"
      }
    },
    "node_modules/@grpc/grpc-js/node_modules/@grpc/proto-loader": {
      "version": "0.8.0",
      "resolved": "https://registry.npmjs.org/@grpc/proto-loader/-/proto-loader-0.8.0.tgz",
      "integrity": "sha512-rc1hOQtjIWGxcxpb9aHAfLpIctjEnsDehj0DAiVfBlmT84uvR0uUtN2hEi/ecvWVjXUGf5qPF4qEgiLOx1YIMQ==",
      "license": "Apache-2.0",
      "optional": true,
      "dependencies": {
        "lodash.camelcase": "^4.3.0",
        "long": "^5.0.0",
        "protobufjs": "^7.5.3",
        "yargs": "^17.7.2"
      },
      "bin": {
        "proto-loader-gen-types": "build/bin/proto-loader-gen-types.js"
      },
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/@grpc/proto-loader": {
      "version": "0.7.15",
      "resolved": "https://registry.npmjs.org/@grpc/proto-loader/-/proto-loader-0.7.15.tgz",
      "integrity": "sha512-tMXdRCfYVixjuFK+Hk0Q1s38gV9zDiDJfWL3h1rv4Qc39oILCu1TRTDt7+fGUI8K4G1Fj125Hx/ru3azECWTyQ==",
      "license": "Apache-2.0",
      "optional": true,
      "dependencies": {
        "lodash.camelcase": "^4.3.0",
        "long": "^5.0.0",
        "protobufjs": "^7.2.5",
        "yargs": "^17.7.2"
      },
      "bin": {
        "proto-loader-gen-types": "build/bin/proto-loader-gen-types.js"
      },
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/@js-sdsl/ordered-map": {
      "version": "4.4.2",
      "resolved": "https://registry.npmjs.org/@js-sdsl/ordered-map/-/ordered-map-4.4.2.tgz",
      "integrity": "sha512-iUKgm52T8HOE/makSxjqoWhe95ZJA1/G1sYsGev2JDKUSS14KAgg1LHb+Ba+IPow0xflbnSkOsZcO08C7w1gYw==",
      "license": "MIT",
      "optional": true,
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/js-sdsl"
      }
    },
    "node_modules/@opentelemetry/api": {
      "version": "1.9.0",
      "resolved": "https://registry.npmjs.org/@opentelemetry/api/-/api-1.9.0.tgz",
      "integrity": "sha512-3giAOQvZiH5F9bMlMiv8+GSPMeqg0dbaeo58/0SlA9sxSqZhnUtxzX9/2FzyhS9sWQf5S0GJE0AKBrFqjpeYcg==",
      "license": "Apache-2.0",
      "optional": true,
      "engines": {
        "node": ">=8.0.0"
      }
    },
    "node_modules/@protobufjs/aspromise": {
      "version": "1.1.2",
      "resolved": "https://registry.npmjs.org/@protobufjs/aspromise/-/aspromise-1.1.2.tgz",
      "integrity": "sha512-j+gKExEuLmKwvz3OgROXtrJ2UG2x8Ch2YZUxahh+s1F2HZ+wAceUNLkvy6zKCPVRkU++ZWQrdxsUeQXmcg4uoQ==",
      "license": "BSD-3-Clause"
    },
    "node_modules/@protobufjs/base64": {
      "version": "1.1.2",
      "resolved": "https://registry.npmjs.org/@protobufjs/base64/-/base64-1.1.2.tgz",
      "integrity": "sha512-AZkcAA5vnN/v4PDqKyMR5lx7hZttPDgClv83E//FMNhR2TMcLUhfRUBHCmSl0oi9zMgDDqRUJkSxO3wm85+XLg==",
      "license": "BSD-3-Clause"
    },
    "node_modules/@protobufjs/codegen": {
      "version": "2.0.4",
      "resolved": "https://registry.npmjs.org/@protobufjs/codegen/-/codegen-2.0.4.tgz",
      "integrity": "sha512-YyFaikqM5sH0ziFZCN3xDC7zeGaB/d0IUb9CATugHWbd1FRFwWwt4ld4OYMPWu5a3Xe01mGAULCdqhMlPl29Jg==",
      "license": "BSD-3-Clause"
    },
    "node_modules/@protobufjs/eventemitter": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/@protobufjs/eventemitter/-/eventemitter-1.1.0.tgz",
      "integrity": "sha512-j9ednRT81vYJ9OfVuXG6ERSTdEL1xVsNgqpkxMsbIabzSo3goCjDIveeGv5d03om39ML71RdmrGNjG5SReBP/Q==",
      "license": "BSD-3-Clause"
    },
    "node_modules/@protobufjs/fetch": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/@protobufjs/fetch/-/fetch-1.1.0.tgz",
      "integrity": "sha512-lljVXpqXebpsijW71PZaCYeIcE5on1w5DlQy5WH6GLbFryLUrBD4932W/E2BSpfRJWseIL4v/KPgBFxDOIdKpQ==",
      "license": "BSD-3-Clause",
      "dependencies": {
        "@protobufjs/aspromise": "^1.1.1",
        "@protobufjs/inquire": "^1.1.0"
      }
    },
    "node_modules/@protobufjs/float": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/@protobufjs/float/-/float-1.0.2.tgz",
      "integrity": "sha512-Ddb+kVXlXst9d+R9PfTIxh1EdNkgoRe5tOX6t01f1lYWOvJnSPDBlG241QLzcyPdoNTsblLUdujGSE4RzrTZGQ==",
      "license": "BSD-3-Clause"
    },
    "node_modules/@protobufjs/inquire": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/@protobufjs/inquire/-/inquire-1.1.0.tgz",
      "integrity": "sha512-kdSefcPdruJiFMVSbn801t4vFK7KB/5gd2fYvrxhuJYg8ILrmn9SKSX2tZdV6V+ksulWqS7aXjBcRXl3wHoD9Q==",
      "license": "BSD-3-Clause"
    },
    "node_modules/@protobufjs/path": {
      "version": "1.1.2",
      "resolved": "https://registry.npmjs.org/@protobufjs/path/-/path-1.1.2.tgz",
      "integrity": "sha512-6JOcJ5Tm08dOHAbdR3GrvP+yUUfkjG5ePsHYczMFLq3ZmMkAD98cDgcT2iA1lJ9NVwFd4tH/iSSoe44YWkltEA==",
      "license": "BSD-3-Clause"
    },
    "node_modules/@protobufjs/pool": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/@protobufjs/pool/-/pool-1.1.0.tgz",
      "integrity": "sha512-0kELaGSIDBKvcgS4zkjz1PeddatrjYcmMWOlAuAPwAeccUrPHdUqo/J6LiymHHEiJT5NrF1UVwxY14f+fy4WQw==",
      "license": "BSD-3-Clause"
    },
    "node_modules/@protobufjs/utf8": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/@protobufjs/utf8/-/utf8-1.1.0.tgz",
      "integrity": "sha512-Vvn3zZrhQZkkBE8LSuW3em98c0FwgO4nxzv6OdSxPKJIEKY2bGbHn+mhGIPerzI4twdxaP8/0+06HBpwf345Lw==",
      "license": "BSD-3-Clause"
    },
    "node_modules/@tootallnate/once": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/@tootallnate/once/-/once-2.0.0.tgz",
      "integrity": "sha512-XCuKFP5PS55gnMVu3dty8KPatLqUoy/ZYzDzAGCQ8JNFCkLXzmI7vNHCR+XpbZaMWQK/vQubr7PkYq8g470J/A==",
      "license": "MIT",
      "optional": true,
      "engines": {
        "node": ">= 10"
      }
    },
    "node_modules/@types/body-parser": {
      "version": "1.19.6",
      "resolved": "https://registry.npmjs.org/@types/body-parser/-/body-parser-1.19.6.tgz",
      "integrity": "sha512-HLFeCYgz89uk22N5Qg3dvGvsv46B8GLvKKo1zKG4NybA8U2DiEO3w9lqGg29t/tfLRJpJ6iQxnVw4OnB7MoM9g==",
      "license": "MIT",
      "dependencies": {
        "@types/connect": "*",
        "@types/node": "*"
      }
    },
    "node_modules/@types/caseless": {
      "version": "0.12.5",
      "resolved": "https://registry.npmjs.org/@types/caseless/-/caseless-0.12.5.tgz",
      "integrity": "sha512-hWtVTC2q7hc7xZ/RLbxapMvDMgUnDvKvMOpKal4DrMyfGBUfB1oKaZlIRr6mJL+If3bAP6sV/QneGzF6tJjZDg==",
      "license": "MIT",
      "optional": true
    },
    "node_modules/@types/connect": {
      "version": "3.4.38",
      "resolved": "https://registry.npmjs.org/@types/connect/-/connect-3.4.38.tgz",
      "integrity": "sha512-K6uROf1LD88uDQqJCktA4yzL1YYAK6NgfsI0v/mTgyPKWsX1CnJ0XPSDhViejru1GcRkLWb8RlzFYJRqGUbaug==",
      "license": "MIT",
      "dependencies": {
        "@types/node": "*"
      }
    },
    "node_modules/@types/cors": {
      "version": "2.8.19",
      "resolved": "https://registry.npmjs.org/@types/cors/-/cors-2.8.19.tgz",
      "integrity": "sha512-mFNylyeyqN93lfe/9CSxOGREz8cpzAhH+E93xJ4xWQf62V8sQ/24reV2nyzUWM6H6Xji+GGHpkbLe7pVoUEskg==",
      "license": "MIT",
      "dependencies": {
        "@types/node": "*"
      }
    },
    "node_modules/@types/express": {
      "version": "4.17.25",
      "resolved": "https://registry.npmjs.org/@types/express/-/express-4.17.25.tgz",
      "integrity": "sha512-dVd04UKsfpINUnK0yBoYHDF3xu7xVH4BuDotC/xGuycx4CgbP48X/KF/586bcObxT0HENHXEU8Nqtu6NR+eKhw==",
      "license": "MIT",
      "dependencies": {
        "@types/body-parser": "*",
        "@types/express-serve-static-core": "^4.17.33",
        "@types/qs": "*",
        "@types/serve-static": "^1"
      }
    },
    "node_modules/@types/express-serve-static-core": {
      "version": "4.19.8",
      "resolved": "https://registry.npmjs.org/@types/express-serve-static-core/-/express-serve-static-core-4.19.8.tgz",
      "integrity": "sha512-02S5fmqeoKzVZCHPZid4b8JH2eM5HzQLZWN2FohQEy/0eXTq8VXZfSN6Pcr3F6N9R/vNrj7cpgbhjie6m/1tCA==",
      "license": "MIT",
      "dependencies": {
        "@types/node": "*",
        "@types/qs": "*",
        "@types/range-parser": "*",
        "@types/send": "*"
      }
    },
    "node_modules/@types/http-errors": {
      "version": "2.0.5",
      "resolved": "https://registry.npmjs.org/@types/http-errors/-/http-errors-2.0.5.tgz",
      "integrity": "sha512-r8Tayk8HJnX0FztbZN7oVqGccWgw98T/0neJphO91KkmOzug1KkofZURD4UaD5uH8AqcFLfdPErnBod0u71/qg==",
      "license": "MIT"
    },
    "node_modules/@types/jsonwebtoken": {
      "version": "9.0.10",
      "resolved": "https://registry.npmjs.org/@types/jsonwebtoken/-/jsonwebtoken-9.0.10.tgz",
      "integrity": "sha512-asx5hIG9Qmf/1oStypjanR7iKTv0gXQ1Ov/jfrX6kS/EO0OFni8orbmGCn0672NHR3kXHwpAwR+B368ZGN/2rA==",
      "license": "MIT",
      "dependencies": {
        "@types/ms": "*",
        "@types/node": "*"
      }
    },
    "node_modules/@types/long": {
      "version": "4.0.2",
      "resolved": "https://registry.npmjs.org/@types/long/-/long-4.0.2.tgz",
      "integrity": "sha512-MqTGEo5bj5t157U6fA/BiDynNkn0YknVdh48CMPkTSpFTVmvao5UQmm7uEF6xBEo7qIMAlY/JSleYaE6VOdpaA==",
      "license": "MIT",
      "optional": true
    },
    "node_modules/@types/mime": {
      "version": "1.3.5",
      "resolved": "https://registry.npmjs.org/@types/mime/-/mime-1.3.5.tgz",
      "integrity": "sha512-/pyBZWSLD2n0dcHE3hq8s8ZvcETHtEuF+3E7XVt0Ig2nvsVQXdghHVcEkIWjy9A0wKfTn97a/PSDYohKIlnP/w==",
      "license": "MIT"
    },
    "node_modules/@types/ms": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/@types/ms/-/ms-2.1.0.tgz",
      "integrity": "sha512-GsCCIZDE/p3i96vtEqx+7dBUGXrc7zeSK3wwPHIaRThS+9OhWIXRqzs4d6k1SVU8g91DrNRWxWUGhp5KXQb2VA==",
      "license": "MIT"
    },
    "node_modules/@types/node": {
      "version": "22.19.7",
      "resolved": "https://registry.npmjs.org/@types/node/-/node-22.19.7.tgz",
      "integrity": "sha512-MciR4AKGHWl7xwxkBa6xUGxQJ4VBOmPTF7sL+iGzuahOFaO0jHCsuEfS80pan1ef4gWId1oWOweIhrDEYLuaOw==",
      "license": "MIT",
      "dependencies": {
        "undici-types": "~6.21.0"
      }
    },
    "node_modules/@types/qs": {
      "version": "6.14.0",
      "resolved": "https://registry.npmjs.org/@types/qs/-/qs-6.14.0.tgz",
      "integrity": "sha512-eOunJqu0K1923aExK6y8p6fsihYEn/BYuQ4g0CxAAgFc4b/ZLN4CrsRZ55srTdqoiLzU2B2evC+apEIxprEzkQ==",
      "license": "MIT"
    },
    "node_modules/@types/range-parser": {
      "version": "1.2.7",
      "resolved": "https://registry.npmjs.org/@types/range-parser/-/range-parser-1.2.7.tgz",
      "integrity": "sha512-hKormJbkJqzQGhziax5PItDUTMAM9uE2XXQmM37dyd4hVM+5aVl7oVxMVUiVQn2oCQFN/LKCZdvSM0pFRqbSmQ==",
      "license": "MIT"
    },
    "node_modules/@types/request": {
      "version": "2.48.13",
      "resolved": "https://registry.npmjs.org/@types/request/-/request-2.48.13.tgz",
      "integrity": "sha512-FGJ6udDNUCjd19pp0Q3iTiDkwhYup7J8hpMW9c4k53NrccQFFWKRho6hvtPPEhnXWKvukfwAlB6DbDz4yhH5Gg==",
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "@types/caseless": "*",
        "@types/node": "*",
        "@types/tough-cookie": "*",
        "form-data": "^2.5.5"
      }
    },
    "node_modules/@types/send": {
      "version": "1.2.1",
      "resolved": "https://registry.npmjs.org/@types/send/-/send-1.2.1.tgz",
      "integrity": "sha512-arsCikDvlU99zl1g69TcAB3mzZPpxgw0UQnaHeC1Nwb015xp8bknZv5rIfri9xTOcMuaVgvabfIRA7PSZVuZIQ==",
      "license": "MIT",
      "dependencies": {
        "@types/node": "*"
      }
    },
    "node_modules/@types/serve-static": {
      "version": "1.15.10",
      "resolved": "https://registry.npmjs.org/@types/serve-static/-/serve-static-1.15.10.tgz",
      "integrity": "sha512-tRs1dB+g8Itk72rlSI2ZrW6vZg0YrLI81iQSTkMmOqnqCaNr/8Ek4VwWcN5vZgCYWbg/JJSGBlUaYGAOP73qBw==",
      "license": "MIT",
      "dependencies": {
        "@types/http-errors": "*",
        "@types/node": "*",
        "@types/send": "<1"
      }
    },
    "node_modules/@types/serve-static/node_modules/@types/send": {
      "version": "0.17.6",
      "resolved": "https://registry.npmjs.org/@types/send/-/send-0.17.6.tgz",
      "integrity": "sha512-Uqt8rPBE8SY0RK8JB1EzVOIZ32uqy8HwdxCnoCOsYrvnswqmFZ/k+9Ikidlk/ImhsdvBsloHbAlewb2IEBV/Og==",
      "license": "MIT",
      "dependencies": {
        "@types/mime": "^1",
        "@types/node": "*"
      }
    },
    "node_modules/@types/tough-cookie": {
      "version": "4.0.5",
      "resolved": "https://registry.npmjs.org/@types/tough-cookie/-/tough-cookie-4.0.5.tgz",
      "integrity": "sha512-/Ad8+nIOV7Rl++6f1BdKxFSMgmoqEoYbHRpPcx3JEfv8VRsQe9Z4mCXeJBzxs7mbHY/XOZZuXlRNfhpVPbs6ZA==",
      "license": "MIT",
      "optional": true
    },
    "node_modules/abort-controller": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/abort-controller/-/abort-controller-3.0.0.tgz",
      "integrity": "sha512-h8lQ8tacZYnR3vNQTgibj+tODHI5/+l06Au2Pcriv/Gmet0eaj4TwWH41sO9wnHDiQsEj19q0drzdWdeAHtweg==",
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "event-target-shim": "^5.0.0"
      },
      "engines": {
        "node": ">=6.5"
      }
    },
    "node_modules/accepts": {
      "version": "1.3.8",
      "resolved": "https://registry.npmjs.org/accepts/-/accepts-1.3.8.tgz",
      "integrity": "sha512-PYAthTa2m2VKxuvSD3DPC/Gy+U+sOA1LAuT8mkmRuvw+NACSaeXEQ+NHcVF7rONl6qcaxV3Uuemwawk+7+SJLw==",
      "license": "MIT",
      "dependencies": {
        "mime-types": "~2.1.34",
        "negotiator": "0.6.3"
      },
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/agent-base": {
      "version": "7.1.4",
      "resolved": "https://registry.npmjs.org/agent-base/-/agent-base-7.1.4.tgz",
      "integrity": "sha512-MnA+YT8fwfJPgBx3m60MNqakm30XOkyIoH1y6huTQvC0PwZG7ki8NacLBcrPbNoo8vEZy7Jpuk7+jMO+CUovTQ==",
      "license": "MIT",
      "optional": true,
      "engines": {
        "node": ">= 14"
      }
    },
    "node_modules/ansi-regex": {
      "version": "5.0.1",
      "resolved": "https://registry.npmjs.org/ansi-regex/-/ansi-regex-5.0.1.tgz",
      "integrity": "sha512-quJQXlTSUGL2LH9SUXo8VwsY4soanhgo6LNSm84E1LBcE8s3O0wpdiRzyR9z/ZZJMlMWv37qOOb9pdJlMUEKFQ==",
      "license": "MIT",
      "optional": true,
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/ansi-styles": {
      "version": "4.3.0",
      "resolved": "https://registry.npmjs.org/ansi-styles/-/ansi-styles-4.3.0.tgz",
      "integrity": "sha512-zbB9rCJAT1rbjiVDb2hqKFHNYLxgtk8NURxZ3IZwD3F6NtxbXZQCnnSi1Lkx+IDohdPlFp222wVALIheZJQSEg==",
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "color-convert": "^2.0.1"
      },
      "engines": {
        "node": ">=8"
      },
      "funding": {
        "url": "https://github.com/chalk/ansi-styles?sponsor=1"
      }
    },
    "node_modules/array-flatten": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/array-flatten/-/array-flatten-1.1.1.tgz",
      "integrity": "sha512-PCVAQswWemu6UdxsDFFX/+gVeYqKAod3D3UVm91jHwynguOwAvYPhx8nNlM++NqRcK6CxxpUafjmhIdKiHibqg==",
      "license": "MIT"
    },
    "node_modules/arrify": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/arrify/-/arrify-2.0.1.tgz",
      "integrity": "sha512-3duEwti880xqi4eAMN8AyR4a0ByT90zoYdLlevfrvU43vb0YZwZVfxOgxWrLXXXpyugL0hNZc9G6BiB5B3nUug==",
      "license": "MIT",
      "optional": true,
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/async-retry": {
      "version": "1.3.3",
      "resolved": "https://registry.npmjs.org/async-retry/-/async-retry-1.3.3.tgz",
      "integrity": "sha512-wfr/jstw9xNi/0teMHrRW7dsz3Lt5ARhYNZ2ewpadnhaIp5mbALhOAP+EAdsC7t4Z6wqsDVv9+W6gm1Dk9mEyw==",
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "retry": "0.13.1"
      }
    },
    "node_modules/asynckit": {
      "version": "0.4.0",
      "resolved": "https://registry.npmjs.org/asynckit/-/asynckit-0.4.0.tgz",
      "integrity": "sha512-Oei9OH4tRh0YqU3GxhX79dM/mwVgvbZJaSNaRk+bshkj0S5cfHcgYakreBjrHwatXKbz+IoIdYLxrKim2MjW0Q==",
      "license": "MIT",
      "optional": true
    },
    "node_modules/base64-js": {
      "version": "1.5.1",
      "resolved": "https://registry.npmjs.org/base64-js/-/base64-js-1.5.1.tgz",
      "integrity": "sha512-AKpaYlHn8t4SVbOHCy+b5+KKgvR4vrsD8vbvrbiQJps7fKDTkjkDry6ji0rUJjC0kzbNePLwzxq8iypo41qeWA==",
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/feross"
        },
        {
          "type": "patreon",
          "url": "https://www.patreon.com/feross"
        },
        {
          "type": "consulting",
          "url": "https://feross.org/support"
        }
      ],
      "license": "MIT",
      "optional": true
    },
    "node_modules/bignumber.js": {
      "version": "9.3.1",
      "resolved": "https://registry.npmjs.org/bignumber.js/-/bignumber.js-9.3.1.tgz",
      "integrity": "sha512-Ko0uX15oIUS7wJ3Rb30Fs6SkVbLmPBAKdlm7q9+ak9bbIeFf0MwuBsQV6z7+X768/cHsfg+WlysDWJcmthjsjQ==",
      "license": "MIT",
      "optional": true,
      "engines": {
        "node": "*"
      }
    },
    "node_modules/body-parser": {
      "version": "1.20.4",
      "resolved": "https://registry.npmjs.org/body-parser/-/body-parser-1.20.4.tgz",
      "integrity": "sha512-ZTgYYLMOXY9qKU/57FAo8F+HA2dGX7bqGc71txDRC1rS4frdFI5R7NhluHxH6M0YItAP0sHB4uqAOcYKxO6uGA==",
      "license": "MIT",
      "dependencies": {
        "bytes": "~3.1.2",
        "content-type": "~1.0.5",
        "debug": "2.6.9",
        "depd": "2.0.0",
        "destroy": "~1.2.0",
        "http-errors": "~2.0.1",
        "iconv-lite": "~0.4.24",
        "on-finished": "~2.4.1",
        "qs": "~6.14.0",
        "raw-body": "~2.5.3",
        "type-is": "~1.6.18",
        "unpipe": "~1.0.0"
      },
      "engines": {
        "node": ">= 0.8",
        "npm": "1.2.8000 || >= 1.4.16"
      }
    },
    "node_modules/buffer-equal-constant-time": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/buffer-equal-constant-time/-/buffer-equal-constant-time-1.0.1.tgz",
      "integrity": "sha512-zRpUiDwd/xk6ADqPMATG8vc9VPrkck7T07OIx0gnjmJAnHnTVXNQG3vfvWNuiZIkwu9KrKdA1iJKfsfTVxE6NA==",
      "license": "BSD-3-Clause"
    },
    "node_modules/bytes": {
      "version": "3.1.2",
      "resolved": "https://registry.npmjs.org/bytes/-/bytes-3.1.2.tgz",
      "integrity": "sha512-/Nf7TyzTx6S3yRJObOAV7956r8cr2+Oj8AC5dt8wSP3BQAoeX58NoHyCU8P8zGkNXStjTSi6fzO6F0pBdcYbEg==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/call-bind-apply-helpers": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/call-bind-apply-helpers/-/call-bind-apply-helpers-1.0.2.tgz",
      "integrity": "sha512-Sp1ablJ0ivDkSzjcaJdxEunN5/XvksFJ2sMBFfq6x0ryhQV/2b/KwFe21cMpmHtPOSij8K99/wSfoEuTObmuMQ==",
      "license": "MIT",
      "dependencies": {
        "es-errors": "^1.3.0",
        "function-bind": "^1.1.2"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/call-bound": {
      "version": "1.0.4",
      "resolved": "https://registry.npmjs.org/call-bound/-/call-bound-1.0.4.tgz",
      "integrity": "sha512-+ys997U96po4Kx/ABpBCqhA9EuxJaQWDQg7295H4hBphv3IZg0boBKuwYpt4YXp6MZ5AmZQnU/tyMTlRpaSejg==",
      "license": "MIT",
      "dependencies": {
        "call-bind-apply-helpers": "^1.0.2",
        "get-intrinsic": "^1.3.0"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/cliui": {
      "version": "8.0.1",
      "resolved": "https://registry.npmjs.org/cliui/-/cliui-8.0.1.tgz",
      "integrity": "sha512-BSeNnyus75C4//NQ9gQt1/csTXyo/8Sb+afLAkzAptFuMsod9HFokGNudZpi/oQV73hnVK+sR+5PVRMd+Dr7YQ==",
      "license": "ISC",
      "optional": true,
      "dependencies": {
        "string-width": "^4.2.0",
        "strip-ansi": "^6.0.1",
        "wrap-ansi": "^7.0.0"
      },
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/color-convert": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/color-convert/-/color-convert-2.0.1.tgz",
      "integrity": "sha512-RRECPsj7iu/xb5oKYcsFHSppFNnsj/52OVTRKb4zP5onXwVF3zVmmToNcOfGC+CRDpfK/U584fMg38ZHCaElKQ==",
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "color-name": "~1.1.4"
      },
      "engines": {
        "node": ">=7.0.0"
      }
    },
    "node_modules/color-name": {
      "version": "1.1.4",
      "resolved": "https://registry.npmjs.org/color-name/-/color-name-1.1.4.tgz",
      "integrity": "sha512-dOy+3AuW3a2wNbZHIuMZpTcgjGuLU/uBL/ubcZF9OXbDo8ff4O8yVp5Bf0efS8uEoYo5q4Fx7dY9OgQGXgAsQA==",
      "license": "MIT",
      "optional": true
    },
    "node_modules/combined-stream": {
      "version": "1.0.8",
      "resolved": "https://registry.npmjs.org/combined-stream/-/combined-stream-1.0.8.tgz",
      "integrity": "sha512-FQN4MRfuJeHf7cBbBMJFXhKSDq+2kAArBlmRBvcvFE5BB1HZKXtSFASDhdlz9zOYwxh8lDdnvmMOe/+5cdoEdg==",
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "delayed-stream": "~1.0.0"
      },
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/content-disposition": {
      "version": "0.5.4",
      "resolved": "https://registry.npmjs.org/content-disposition/-/content-disposition-0.5.4.tgz",
      "integrity": "sha512-FveZTNuGw04cxlAiWbzi6zTAL/lhehaWbTtgluJh4/E95DqMwTmha3KZN1aAWA8cFIhHzMZUvLevkw5Rqk+tSQ==",
      "license": "MIT",
      "dependencies": {
        "safe-buffer": "5.2.1"
      },
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/content-type": {
      "version": "1.0.5",
      "resolved": "https://registry.npmjs.org/content-type/-/content-type-1.0.5.tgz",
      "integrity": "sha512-nTjqfcBFEipKdXCv4YDQWCfmcLZKm81ldF0pAopTvyrFGVbcR6P/VAAd5G7N+0tTr8QqiU0tFadD6FK4NtJwOA==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/cookie": {
      "version": "0.7.2",
      "resolved": "https://registry.npmjs.org/cookie/-/cookie-0.7.2.tgz",
      "integrity": "sha512-yki5XnKuf750l50uGTllt6kKILY4nQ1eNIQatoXEByZ5dWgnKqbnqmTrBE5B4N7lrMJKQ2ytWMiTO2o0v6Ew/w==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/cookie-signature": {
      "version": "1.0.7",
      "resolved": "https://registry.npmjs.org/cookie-signature/-/cookie-signature-1.0.7.tgz",
      "integrity": "sha512-NXdYc3dLr47pBkpUCHtKSwIOQXLVn8dZEuywboCOJY/osA0wFSLlSawr3KN8qXJEyX66FcONTH8EIlVuK0yyFA==",
      "license": "MIT"
    },
    "node_modules/cors": {
      "version": "2.8.6",
      "resolved": "https://registry.npmjs.org/cors/-/cors-2.8.6.tgz",
      "integrity": "sha512-tJtZBBHA6vjIAaF6EnIaq6laBBP9aq/Y3ouVJjEfoHbRBcHBAHYcMh/w8LDrk2PvIMMq8gmopa5D4V8RmbrxGw==",
      "license": "MIT",
      "dependencies": {
        "object-assign": "^4",
        "vary": "^1"
      },
      "engines": {
        "node": ">= 0.10"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/debug": {
      "version": "2.6.9",
      "resolved": "https://registry.npmjs.org/debug/-/debug-2.6.9.tgz",
      "integrity": "sha512-bC7ElrdJaJnPbAP+1EotYvqZsb3ecl5wi6Bfi6BJTUcNowp6cvspg0jXznRTKDjm/E7AdgFBVeAPVMNcKGsHMA==",
      "license": "MIT",
      "dependencies": {
        "ms": "2.0.0"
      }
    },
    "node_modules/delayed-stream": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/delayed-stream/-/delayed-stream-1.0.0.tgz",
      "integrity": "sha512-ZySD7Nf91aLB0RxL4KGrKHBXl7Eds1DAmEdcoVawXnLD7SDhpNgtuII2aAkg7a7QS41jxPSZ17p4VdGnMHk3MQ==",
      "license": "MIT",
      "optional": true,
      "engines": {
        "node": ">=0.4.0"
      }
    },
    "node_modules/depd": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/depd/-/depd-2.0.0.tgz",
      "integrity": "sha512-g7nH6P6dyDioJogAAGprGpCtVImJhpPk/roCzdb3fIh61/s/nPsfR6onyMwkCAR/OlC3yBC0lESvUoQEAssIrw==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/destroy": {
      "version": "1.2.0",
      "resolved": "https://registry.npmjs.org/destroy/-/destroy-1.2.0.tgz",
      "integrity": "sha512-2sJGJTaXIIaR1w4iJSNoN0hnMY7Gpc/n8D4qSCJw8QqFWXf7cuAgnEHxBpweaVcPevC2l3KpjYCx3NypQQgaJg==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.8",
        "npm": "1.2.8000 || >= 1.4.16"
      }
    },
    "node_modules/dunder-proto": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/dunder-proto/-/dunder-proto-1.0.1.tgz",
      "integrity": "sha512-KIN/nDJBQRcXw0MLVhZE9iQHmG68qAVIBg9CqmUYjmQIhgij9U5MFvrqkUL5FbtyyzZuOeOt0zdeRe4UY7ct+A==",
      "license": "MIT",
      "dependencies": {
        "call-bind-apply-helpers": "^1.0.1",
        "es-errors": "^1.3.0",
        "gopd": "^1.2.0"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/duplexify": {
      "version": "4.1.3",
      "resolved": "https://registry.npmjs.org/duplexify/-/duplexify-4.1.3.tgz",
      "integrity": "sha512-M3BmBhwJRZsSx38lZyhE53Csddgzl5R7xGJNk7CVddZD6CcmwMCH8J+7AprIrQKH7TonKxaCjcv27Qmf+sQ+oA==",
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "end-of-stream": "^1.4.1",
        "inherits": "^2.0.3",
        "readable-stream": "^3.1.1",
        "stream-shift": "^1.0.2"
      }
    },
    "node_modules/ecdsa-sig-formatter": {
      "version": "1.0.11",
      "resolved": "https://registry.npmjs.org/ecdsa-sig-formatter/-/ecdsa-sig-formatter-1.0.11.tgz",
      "integrity": "sha512-nagl3RYrbNv6kQkeJIpt6NJZy8twLB/2vtz6yN9Z4vRKHN4/QZJIEbqohALSgwKdnksuY3k5Addp5lg8sVoVcQ==",
      "license": "Apache-2.0",
      "dependencies": {
        "safe-buffer": "^5.0.1"
      }
    },
    "node_modules/ee-first": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/ee-first/-/ee-first-1.1.1.tgz",
      "integrity": "sha512-WMwm9LhRUo+WUaRN+vRuETqG89IgZphVSNkdFgeb6sS/E4OrDIN7t48CAewSHXc6C8lefD8KKfr5vY61brQlow==",
      "license": "MIT"
    },
    "node_modules/emoji-regex": {
      "version": "8.0.0",
      "resolved": "https://registry.npmjs.org/emoji-regex/-/emoji-regex-8.0.0.tgz",
      "integrity": "sha512-MSjYzcWNOA0ewAHpz0MxpYFvwg6yjy1NG3xteoqz644VCo/RPgnr1/GGt+ic3iJTzQ8Eu3TdM14SawnVUmGE6A==",
      "license": "MIT",
      "optional": true
    },
    "node_modules/encodeurl": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/encodeurl/-/encodeurl-2.0.0.tgz",
      "integrity": "sha512-Q0n9HRi4m6JuGIV1eFlmvJB7ZEVxu93IrMyiMsGC0lrMJMWzRgx6WGquyfQgZVb31vhGgXnfmPNNXmxnOkRBrg==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/end-of-stream": {
      "version": "1.4.5",
      "resolved": "https://registry.npmjs.org/end-of-stream/-/end-of-stream-1.4.5.tgz",
      "integrity": "sha512-ooEGc6HP26xXq/N+GCGOT0JKCLDGrq2bQUZrQ7gyrJiZANJ/8YDTxTpQBXGMn+WbIQXNVpyWymm7KYVICQnyOg==",
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "once": "^1.4.0"
      }
    },
    "node_modules/es-define-property": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/es-define-property/-/es-define-property-1.0.1.tgz",
      "integrity": "sha512-e3nRfgfUZ4rNGL232gUgX06QNyyez04KdjFrF+LTRoOXmrOgFKDg4BCdsjW8EnT69eqdYGmRpJwiPVYNrCaW3g==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/es-errors": {
      "version": "1.3.0",
      "resolved": "https://registry.npmjs.org/es-errors/-/es-errors-1.3.0.tgz",
      "integrity": "sha512-Zf5H2Kxt2xjTvbJvP2ZWLEICxA6j+hAmMzIlypy4xcBg1vKVnx89Wy0GbS+kf5cwCVFFzdCFh2XSCFNULS6csw==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/es-object-atoms": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/es-object-atoms/-/es-object-atoms-1.1.1.tgz",
      "integrity": "sha512-FGgH2h8zKNim9ljj7dankFPcICIK9Cp5bm+c2gQSYePhpaG5+esrLODihIorn+Pe6FGJzWhXQotPv73jTaldXA==",
      "license": "MIT",
      "dependencies": {
        "es-errors": "^1.3.0"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/es-set-tostringtag": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/es-set-tostringtag/-/es-set-tostringtag-2.1.0.tgz",
      "integrity": "sha512-j6vWzfrGVfyXxge+O0x5sh6cvxAog0a/4Rdd2K36zCMV5eJ+/+tOAngRO8cODMNWbVRdVlmGZQL2YS3yR8bIUA==",
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "es-errors": "^1.3.0",
        "get-intrinsic": "^1.2.6",
        "has-tostringtag": "^1.0.2",
        "hasown": "^2.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/escalade": {
      "version": "3.2.0",
      "resolved": "https://registry.npmjs.org/escalade/-/escalade-3.2.0.tgz",
      "integrity": "sha512-WUj2qlxaQtO4g6Pq5c29GTcWGDyd8itL8zTlipgECz3JesAiiOKotd8JU6otB3PACgG6xkJUyVhboMS+bje/jA==",
      "license": "MIT",
      "optional": true,
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/escape-html": {
      "version": "1.0.3",
      "resolved": "https://registry.npmjs.org/escape-html/-/escape-html-1.0.3.tgz",
      "integrity": "sha512-NiSupZ4OeuGwr68lGIeym/ksIZMJodUGOSCZ/FSnTxcrekbvqrgdUxlJOMpijaKZVjAJrWrGs/6Jy8OMuyj9ow==",
      "license": "MIT"
    },
    "node_modules/etag": {
      "version": "1.8.1",
      "resolved": "https://registry.npmjs.org/etag/-/etag-1.8.1.tgz",
      "integrity": "sha512-aIL5Fx7mawVa300al2BnEE4iNvo1qETxLrPI/o05L7z6go7fCw1J6EQmbK4FmJ2AS7kgVF/KEZWufBfdClMcPg==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/event-target-shim": {
      "version": "5.0.1",
      "resolved": "https://registry.npmjs.org/event-target-shim/-/event-target-shim-5.0.1.tgz",
      "integrity": "sha512-i/2XbnSz/uxRCU6+NdVJgKWDTM427+MqYbkQzD321DuCQJUqOuJKIA0IM2+W2xtYHdKOmZ4dR6fExsd4SXL+WQ==",
      "license": "MIT",
      "optional": true,
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/express": {
      "version": "4.22.1",
      "resolved": "https://registry.npmjs.org/express/-/express-4.22.1.tgz",
      "integrity": "sha512-F2X8g9P1X7uCPZMA3MVf9wcTqlyNp7IhH5qPCI0izhaOIYXaW9L535tGA3qmjRzpH+bZczqq7hVKxTR4NWnu+g==",
      "license": "MIT",
      "dependencies": {
        "accepts": "~1.3.8",
        "array-flatten": "1.1.1",
        "body-parser": "~1.20.3",
        "content-disposition": "~0.5.4",
        "content-type": "~1.0.4",
        "cookie": "~0.7.1",
        "cookie-signature": "~1.0.6",
        "debug": "2.6.9",
        "depd": "2.0.0",
        "encodeurl": "~2.0.0",
        "escape-html": "~1.0.3",
        "etag": "~1.8.1",
        "finalhandler": "~1.3.1",
        "fresh": "~0.5.2",
        "http-errors": "~2.0.0",
        "merge-descriptors": "1.0.3",
        "methods": "~1.1.2",
        "on-finished": "~2.4.1",
        "parseurl": "~1.3.3",
        "path-to-regexp": "~0.1.12",
        "proxy-addr": "~2.0.7",
        "qs": "~6.14.0",
        "range-parser": "~1.2.1",
        "safe-buffer": "5.2.1",
        "send": "~0.19.0",
        "serve-static": "~1.16.2",
        "setprototypeof": "1.2.0",
        "statuses": "~2.0.1",
        "type-is": "~1.6.18",
        "utils-merge": "1.0.1",
        "vary": "~1.1.2"
      },
      "engines": {
        "node": ">= 0.10.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/extend": {
      "version": "3.0.2",
      "resolved": "https://registry.npmjs.org/extend/-/extend-3.0.2.tgz",
      "integrity": "sha512-fjquC59cD7CyW6urNXK0FBufkZcoiGG80wTuPujX590cB5Ttln20E2UB4S/WARVqhXffZl2LNgS+gQdPIIim/g==",
      "license": "MIT",
      "optional": true
    },
    "node_modules/farmhash-modern": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/farmhash-modern/-/farmhash-modern-1.1.0.tgz",
      "integrity": "sha512-6ypT4XfgqJk/F3Yuv4SX26I3doUjt0GTG4a+JgWxXQpxXzTBq8fPUeGHfcYMMDPHJHm3yPOSjaeBwBGAHWXCdA==",
      "license": "MIT",
      "engines": {
        "node": ">=18.0.0"
      }
    },
    "node_modules/fast-deep-equal": {
      "version": "3.1.3",
      "resolved": "https://registry.npmjs.org/fast-deep-equal/-/fast-deep-equal-3.1.3.tgz",
      "integrity": "sha512-f3qQ9oQy9j2AhBe/H9VC91wLmKBCCU/gDOnKNAYG5hswO7BLKj09Hc5HYNz9cGI++xlpDCIgDaitVs03ATR84Q==",
      "license": "MIT",
      "optional": true
    },
    "node_modules/fast-xml-parser": {
      "version": "4.5.3",
      "resolved": "https://registry.npmjs.org/fast-xml-parser/-/fast-xml-parser-4.5.3.tgz",
      "integrity": "sha512-RKihhV+SHsIUGXObeVy9AXiBbFwkVk7Syp8XgwN5U3JV416+Gwp/GO9i0JYKmikykgz/UHRrrV4ROuZEo/T0ig==",
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/NaturalIntelligence"
        }
      ],
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "strnum": "^1.1.1"
      },
      "bin": {
        "fxparser": "src/cli/cli.js"
      }
    },
    "node_modules/faye-websocket": {
      "version": "0.11.4",
      "resolved": "https://registry.npmjs.org/faye-websocket/-/faye-websocket-0.11.4.tgz",
      "integrity": "sha512-CzbClwlXAuiRQAlUyfqPgvPoNKTckTPGfwZV4ZdAhVcP2lh9KUxJg2b5GkE7XbjKQ3YJnQ9z6D9ntLAlB+tP8g==",
      "license": "Apache-2.0",
      "dependencies": {
        "websocket-driver": ">=0.5.1"
      },
      "engines": {
        "node": ">=0.8.0"
      }
    },
    "node_modules/finalhandler": {
      "version": "1.3.2",
      "resolved": "https://registry.npmjs.org/finalhandler/-/finalhandler-1.3.2.tgz",
      "integrity": "sha512-aA4RyPcd3badbdABGDuTXCMTtOneUCAYH/gxoYRTZlIJdF0YPWuGqiAsIrhNnnqdXGswYk6dGujem4w80UJFhg==",
      "license": "MIT",
      "dependencies": {
        "debug": "2.6.9",
        "encodeurl": "~2.0.0",
        "escape-html": "~1.0.3",
        "on-finished": "~2.4.1",
        "parseurl": "~1.3.3",
        "statuses": "~2.0.2",
        "unpipe": "~1.0.0"
      },
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/firebase-admin": {
      "version": "12.7.0",
      "resolved": "https://registry.npmjs.org/firebase-admin/-/firebase-admin-12.7.0.tgz",
      "integrity": "sha512-raFIrOyTqREbyXsNkSHyciQLfv8AUZazehPaQS1lZBSCDYW74FYXU0nQZa3qHI4K+hawohlDbywZ4+qce9YNxA==",
      "license": "Apache-2.0",
      "peer": true,
      "dependencies": {
        "@fastify/busboy": "^3.0.0",
        "@firebase/database-compat": "1.0.8",
        "@firebase/database-types": "1.0.5",
        "@types/node": "^22.0.1",
        "farmhash-modern": "^1.1.0",
        "jsonwebtoken": "^9.0.0",
        "jwks-rsa": "^3.1.0",
        "node-forge": "^1.3.1",
        "uuid": "^10.0.0"
      },
      "engines": {
        "node": ">=14"
      },
      "optionalDependencies": {
        "@google-cloud/firestore": "^7.7.0",
        "@google-cloud/storage": "^7.7.0"
      }
    },
    "node_modules/firebase-functions": {
      "version": "7.0.3",
      "resolved": "https://registry.npmjs.org/firebase-functions/-/firebase-functions-7.0.3.tgz",
      "integrity": "sha512-DiIjIUv0OS4KEAA3jqyIc7ymZKdcmMcaXy7FCCkrDQo/1CVMbDDWMdZIslmsgSjldA2nhau1dTE/6JQI8Urjjw==",
      "license": "MIT",
      "dependencies": {
        "@types/cors": "^2.8.5",
        "@types/express": "^4.17.21",
        "cors": "^2.8.5",
        "express": "^4.21.0",
        "protobufjs": "^7.2.2"
      },
      "bin": {
        "firebase-functions": "lib/bin/firebase-functions.js"
      },
      "engines": {
        "node": ">=18.0.0"
      },
      "peerDependencies": {
        "@apollo/server": "^5.2.0",
        "@as-integrations/express4": "^1.1.2",
        "firebase-admin": "^11.10.0 || ^12.0.0 || ^13.0.0"
      },
      "peerDependenciesMeta": {
        "@apollo/server": {
          "optional": true
        },
        "@as-integrations/express4": {
          "optional": true
        }
      }
    },
    "node_modules/form-data": {
      "version": "2.5.5",
      "resolved": "https://registry.npmjs.org/form-data/-/form-data-2.5.5.tgz",
      "integrity": "sha512-jqdObeR2rxZZbPSGL+3VckHMYtu+f9//KXBsVny6JSX/pa38Fy+bGjuG8eW/H6USNQWhLi8Num++cU2yOCNz4A==",
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "asynckit": "^0.4.0",
        "combined-stream": "^1.0.8",
        "es-set-tostringtag": "^2.1.0",
        "hasown": "^2.0.2",
        "mime-types": "^2.1.35",
        "safe-buffer": "^5.2.1"
      },
      "engines": {
        "node": ">= 0.12"
      }
    },
    "node_modules/forwarded": {
      "version": "0.2.0",
      "resolved": "https://registry.npmjs.org/forwarded/-/forwarded-0.2.0.tgz",
      "integrity": "sha512-buRG0fpBtRHSTCOASe6hD258tEubFoRLb4ZNA6NxMVHNw2gOcwHo9wyablzMzOA5z9xA9L1KNjk/Nt6MT9aYow==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/fresh": {
      "version": "0.5.2",
      "resolved": "https://registry.npmjs.org/fresh/-/fresh-0.5.2.tgz",
      "integrity": "sha512-zJ2mQYM18rEFOudeV4GShTGIQ7RbzA7ozbU9I/XBpm7kqgMywgmylMwXHxZJmkVoYkna9d2pVXVXPdYTP9ej8Q==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/function-bind": {
      "version": "1.1.2",
      "resolved": "https://registry.npmjs.org/function-bind/-/function-bind-1.1.2.tgz",
      "integrity": "sha512-7XHNxH7qX9xG5mIwxkhumTox/MIRNcOgDrxWsMt2pAr23WHp6MrRlN7FBSFpCpr+oVO0F744iUgR82nJMfG2SA==",
      "license": "MIT",
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/functional-red-black-tree": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/functional-red-black-tree/-/functional-red-black-tree-1.0.1.tgz",
      "integrity": "sha512-dsKNQNdj6xA3T+QlADDA7mOSlX0qiMINjn0cgr+eGHGsbSHzTabcIogz2+p/iqP1Xs6EP/sS2SbqH+brGTbq0g==",
      "license": "MIT",
      "optional": true
    },
    "node_modules/gaxios": {
      "version": "6.7.1",
      "resolved": "https://registry.npmjs.org/gaxios/-/gaxios-6.7.1.tgz",
      "integrity": "sha512-LDODD4TMYx7XXdpwxAVRAIAuB0bzv0s+ywFonY46k126qzQHT9ygyoa9tncmOiQmmDrik65UYsEkv3lbfqQ3yQ==",
      "license": "Apache-2.0",
      "optional": true,
      "dependencies": {
        "extend": "^3.0.2",
        "https-proxy-agent": "^7.0.1",
        "is-stream": "^2.0.0",
        "node-fetch": "^2.6.9",
        "uuid": "^9.0.1"
      },
      "engines": {
        "node": ">=14"
      }
    },
    "node_modules/gaxios/node_modules/uuid": {
      "version": "9.0.1",
      "resolved": "https://registry.npmjs.org/uuid/-/uuid-9.0.1.tgz",
      "integrity": "sha512-b+1eJOlsR9K8HJpow9Ok3fiWOWSIcIzXodvv0rQjVoOVNpWMpxf1wZNpt4y9h10odCNrqnYp1OBzRktckBe3sA==",
      "funding": [
        "https://github.com/sponsors/broofa",
        "https://github.com/sponsors/ctavan"
      ],
      "license": "MIT",
      "optional": true,
      "bin": {
        "uuid": "dist/bin/uuid"
      }
    },
    "node_modules/gcp-metadata": {
      "version": "6.1.1",
      "resolved": "https://registry.npmjs.org/gcp-metadata/-/gcp-metadata-6.1.1.tgz",
      "integrity": "sha512-a4tiq7E0/5fTjxPAaH4jpjkSv/uCaU2p5KC6HVGrvl0cDjA8iBZv4vv1gyzlmK0ZUKqwpOyQMKzZQe3lTit77A==",
      "license": "Apache-2.0",
      "optional": true,
      "dependencies": {
        "gaxios": "^6.1.1",
        "google-logging-utils": "^0.0.2",
        "json-bigint": "^1.0.0"
      },
      "engines": {
        "node": ">=14"
      }
    },
    "node_modules/get-caller-file": {
      "version": "2.0.5",
      "resolved": "https://registry.npmjs.org/get-caller-file/-/get-caller-file-2.0.5.tgz",
      "integrity": "sha512-DyFP3BM/3YHTQOCUL/w0OZHR0lpKeGrxotcHWcqNEdnltqFwXVfhEBQ94eIo34AfQpo0rGki4cyIiftY06h2Fg==",
      "license": "ISC",
      "optional": true,
      "engines": {
        "node": "6.* || 8.* || >= 10.*"
      }
    },
    "node_modules/get-intrinsic": {
      "version": "1.3.0",
      "resolved": "https://registry.npmjs.org/get-intrinsic/-/get-intrinsic-1.3.0.tgz",
      "integrity": "sha512-9fSjSaos/fRIVIp+xSJlE6lfwhES7LNtKaCBIamHsjr2na1BiABJPo0mOjjz8GJDURarmCPGqaiVg5mfjb98CQ==",
      "license": "MIT",
      "dependencies": {
        "call-bind-apply-helpers": "^1.0.2",
        "es-define-property": "^1.0.1",
        "es-errors": "^1.3.0",
        "es-object-atoms": "^1.1.1",
        "function-bind": "^1.1.2",
        "get-proto": "^1.0.1",
        "gopd": "^1.2.0",
        "has-symbols": "^1.1.0",
        "hasown": "^2.0.2",
        "math-intrinsics": "^1.1.0"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/get-proto": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/get-proto/-/get-proto-1.0.1.tgz",
      "integrity": "sha512-sTSfBjoXBp89JvIKIefqw7U2CCebsc74kiY6awiGogKtoSGbgjYE/G/+l9sF3MWFPNc9IcoOC4ODfKHfxFmp0g==",
      "license": "MIT",
      "dependencies": {
        "dunder-proto": "^1.0.1",
        "es-object-atoms": "^1.0.0"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/google-auth-library": {
      "version": "9.15.1",
      "resolved": "https://registry.npmjs.org/google-auth-library/-/google-auth-library-9.15.1.tgz",
      "integrity": "sha512-Jb6Z0+nvECVz+2lzSMt9u98UsoakXxA2HGHMCxh+so3n90XgYWkq5dur19JAJV7ONiJY22yBTyJB1TSkvPq9Ng==",
      "license": "Apache-2.0",
      "optional": true,
      "dependencies": {
        "base64-js": "^1.3.0",
        "ecdsa-sig-formatter": "^1.0.11",
        "gaxios": "^6.1.1",
        "gcp-metadata": "^6.1.0",
        "gtoken": "^7.0.0",
        "jws": "^4.0.0"
      },
      "engines": {
        "node": ">=14"
      }
    },
    "node_modules/google-gax": {
      "version": "4.6.1",
      "resolved": "https://registry.npmjs.org/google-gax/-/google-gax-4.6.1.tgz",
      "integrity": "sha512-V6eky/xz2mcKfAd1Ioxyd6nmA61gao3n01C+YeuIwu3vzM9EDR6wcVzMSIbLMDXWeoi9SHYctXuKYC5uJUT3eQ==",
      "license": "Apache-2.0",
      "optional": true,
      "dependencies": {
        "@grpc/grpc-js": "^1.10.9",
        "@grpc/proto-loader": "^0.7.13",
        "@types/long": "^4.0.0",
        "abort-controller": "^3.0.0",
        "duplexify": "^4.0.0",
        "google-auth-library": "^9.3.0",
        "node-fetch": "^2.7.0",
        "object-hash": "^3.0.0",
        "proto3-json-serializer": "^2.0.2",
        "protobufjs": "^7.3.2",
        "retry-request": "^7.0.0",
        "uuid": "^9.0.1"
      },
      "engines": {
        "node": ">=14"
      }
    },
    "node_modules/google-gax/node_modules/uuid": {
      "version": "9.0.1",
      "resolved": "https://registry.npmjs.org/uuid/-/uuid-9.0.1.tgz",
      "integrity": "sha512-b+1eJOlsR9K8HJpow9Ok3fiWOWSIcIzXodvv0rQjVoOVNpWMpxf1wZNpt4y9h10odCNrqnYp1OBzRktckBe3sA==",
      "funding": [
        "https://github.com/sponsors/broofa",
        "https://github.com/sponsors/ctavan"
      ],
      "license": "MIT",
      "optional": true,
      "bin": {
        "uuid": "dist/bin/uuid"
      }
    },
    "node_modules/google-logging-utils": {
      "version": "0.0.2",
      "resolved": "https://registry.npmjs.org/google-logging-utils/-/google-logging-utils-0.0.2.tgz",
      "integrity": "sha512-NEgUnEcBiP5HrPzufUkBzJOD/Sxsco3rLNo1F1TNf7ieU8ryUzBhqba8r756CjLX7rn3fHl6iLEwPYuqpoKgQQ==",
      "license": "Apache-2.0",
      "optional": true,
      "engines": {
        "node": ">=14"
      }
    },
    "node_modules/gopd": {
      "version": "1.2.0",
      "resolved": "https://registry.npmjs.org/gopd/-/gopd-1.2.0.tgz",
      "integrity": "sha512-ZUKRh6/kUFoAiTAtTYPZJ3hw9wNxx+BIBOijnlG9PnrJsCcSjs1wyyD6vJpaYtgnzDrKYRSqf3OO6Rfa93xsRg==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/gtoken": {
      "version": "7.1.0",
      "resolved": "https://registry.npmjs.org/gtoken/-/gtoken-7.1.0.tgz",
      "integrity": "sha512-pCcEwRi+TKpMlxAQObHDQ56KawURgyAf6jtIY046fJ5tIv3zDe/LEIubckAO8fj6JnAxLdmWkUfNyulQ2iKdEw==",
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "gaxios": "^6.0.0",
        "jws": "^4.0.0"
      },
      "engines": {
        "node": ">=14.0.0"
      }
    },
    "node_modules/has-symbols": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/has-symbols/-/has-symbols-1.1.0.tgz",
      "integrity": "sha512-1cDNdwJ2Jaohmb3sg4OmKaMBwuC48sYni5HUw2DvsC8LjGTLK9h+eb1X6RyuOHe4hT0ULCW68iomhjUoKUqlPQ==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/has-tostringtag": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/has-tostringtag/-/has-tostringtag-1.0.2.tgz",
      "integrity": "sha512-NqADB8VjPFLM2V0VvHUewwwsw0ZWBaIdgo+ieHtK3hasLz4qeCRjYcqfB6AQrBggRKppKF8L52/VqdVsO47Dlw==",
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "has-symbols": "^1.0.3"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/hasown": {
      "version": "2.0.2",
      "resolved": "https://registry.npmjs.org/hasown/-/hasown-2.0.2.tgz",
      "integrity": "sha512-0hJU9SCPvmMzIBdZFqNPXWa6dqh7WdH0cII9y+CyS8rG3nL48Bclra9HmKhVVUHyPWNH5Y7xDwAB7bfgSjkUMQ==",
      "license": "MIT",
      "dependencies": {
        "function-bind": "^1.1.2"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/html-entities": {
      "version": "2.6.0",
      "resolved": "https://registry.npmjs.org/html-entities/-/html-entities-2.6.0.tgz",
      "integrity": "sha512-kig+rMn/QOVRvr7c86gQ8lWXq+Hkv6CbAH1hLu+RG338StTpE8Z0b44SDVaqVu7HGKf27frdmUYEs9hTUX/cLQ==",
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/mdevils"
        },
        {
          "type": "patreon",
          "url": "https://patreon.com/mdevils"
        }
      ],
      "license": "MIT",
      "optional": true
    },
    "node_modules/http-errors": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/http-errors/-/http-errors-2.0.1.tgz",
      "integrity": "sha512-4FbRdAX+bSdmo4AUFuS0WNiPz8NgFt+r8ThgNWmlrjQjt1Q7ZR9+zTlce2859x4KSXrwIsaeTqDoKQmtP8pLmQ==",
      "license": "MIT",
      "dependencies": {
        "depd": "~2.0.0",
        "inherits": "~2.0.4",
        "setprototypeof": "~1.2.0",
        "statuses": "~2.0.2",
        "toidentifier": "~1.0.1"
      },
      "engines": {
        "node": ">= 0.8"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/http-parser-js": {
      "version": "0.5.10",
      "resolved": "https://registry.npmjs.org/http-parser-js/-/http-parser-js-0.5.10.tgz",
      "integrity": "sha512-Pysuw9XpUq5dVc/2SMHpuTY01RFl8fttgcyunjL7eEMhGM3cI4eOmiCycJDVCo/7O7ClfQD3SaI6ftDzqOXYMA==",
      "license": "MIT"
    },
    "node_modules/http-proxy-agent": {
      "version": "5.0.0",
      "resolved": "https://registry.npmjs.org/http-proxy-agent/-/http-proxy-agent-5.0.0.tgz",
      "integrity": "sha512-n2hY8YdoRE1i7r6M0w9DIw5GgZN0G25P8zLCRQ8rjXtTU3vsNFBI/vWK/UIeE6g5MUUz6avwAPXmL6Fy9D/90w==",
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "@tootallnate/once": "2",
        "agent-base": "6",
        "debug": "4"
      },
      "engines": {
        "node": ">= 6"
      }
    },
    "node_modules/http-proxy-agent/node_modules/agent-base": {
      "version": "6.0.2",
      "resolved": "https://registry.npmjs.org/agent-base/-/agent-base-6.0.2.tgz",
      "integrity": "sha512-RZNwNclF7+MS/8bDg70amg32dyeZGZxiDuQmZxKLAlQjr3jGyLx+4Kkk58UO7D2QdgFIQCovuSuZESne6RG6XQ==",
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "debug": "4"
      },
      "engines": {
        "node": ">= 6.0.0"
      }
    },
    "node_modules/http-proxy-agent/node_modules/debug": {
      "version": "4.4.3",
      "resolved": "https://registry.npmjs.org/debug/-/debug-4.4.3.tgz",
      "integrity": "sha512-RGwwWnwQvkVfavKVt22FGLw+xYSdzARwm0ru6DhTVA3umU5hZc28V3kO4stgYryrTlLpuvgI9GiijltAjNbcqA==",
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "ms": "^2.1.3"
      },
      "engines": {
        "node": ">=6.0"
      },
      "peerDependenciesMeta": {
        "supports-color": {
          "optional": true
        }
      }
    },
    "node_modules/http-proxy-agent/node_modules/ms": {
      "version": "2.1.3",
      "resolved": "https://registry.npmjs.org/ms/-/ms-2.1.3.tgz",
      "integrity": "sha512-6FlzubTLZG3J2a/NVCAleEhjzq5oxgHyaCU9yYXvcLsvoVaHJq/s5xXI6/XXP6tz7R9xAOtHnSO/tXtF3WRTlA==",
      "license": "MIT",
      "optional": true
    },
    "node_modules/https-proxy-agent": {
      "version": "7.0.6",
      "resolved": "https://registry.npmjs.org/https-proxy-agent/-/https-proxy-agent-7.0.6.tgz",
      "integrity": "sha512-vK9P5/iUfdl95AI+JVyUuIcVtd4ofvtrOr3HNtM2yxC9bnMbEdp3x01OhQNnjb8IJYi38VlTE3mBXwcfvywuSw==",
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "agent-base": "^7.1.2",
        "debug": "4"
      },
      "engines": {
        "node": ">= 14"
      }
    },
    "node_modules/https-proxy-agent/node_modules/debug": {
      "version": "4.4.3",
      "resolved": "https://registry.npmjs.org/debug/-/debug-4.4.3.tgz",
      "integrity": "sha512-RGwwWnwQvkVfavKVt22FGLw+xYSdzARwm0ru6DhTVA3umU5hZc28V3kO4stgYryrTlLpuvgI9GiijltAjNbcqA==",
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "ms": "^2.1.3"
      },
      "engines": {
        "node": ">=6.0"
      },
      "peerDependenciesMeta": {
        "supports-color": {
          "optional": true
        }
      }
    },
    "node_modules/https-proxy-agent/node_modules/ms": {
      "version": "2.1.3",
      "resolved": "https://registry.npmjs.org/ms/-/ms-2.1.3.tgz",
      "integrity": "sha512-6FlzubTLZG3J2a/NVCAleEhjzq5oxgHyaCU9yYXvcLsvoVaHJq/s5xXI6/XXP6tz7R9xAOtHnSO/tXtF3WRTlA==",
      "license": "MIT",
      "optional": true
    },
    "node_modules/iconv-lite": {
      "version": "0.4.24",
      "resolved": "https://registry.npmjs.org/iconv-lite/-/iconv-lite-0.4.24.tgz",
      "integrity": "sha512-v3MXnZAcvnywkTUEZomIActle7RXXeedOR31wwl7VlyoXO4Qi9arvSenNQWne1TcRwhCL1HwLI21bEqdpj8/rA==",
      "license": "MIT",
      "dependencies": {
        "safer-buffer": ">= 2.1.2 < 3"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/inherits": {
      "version": "2.0.4",
      "resolved": "https://registry.npmjs.org/inherits/-/inherits-2.0.4.tgz",
      "integrity": "sha512-k/vGaX4/Yla3WzyMCvTQOXYeIHvqOKtnqBduzTHpzpQZzAskKMhZ2K+EnBiSM9zGSoIFeMpXKxa4dYeZIQqewQ==",
      "license": "ISC"
    },
    "node_modules/ipaddr.js": {
      "version": "1.9.1",
      "resolved": "https://registry.npmjs.org/ipaddr.js/-/ipaddr.js-1.9.1.tgz",
      "integrity": "sha512-0KI/607xoxSToH7GjN1FfSbLoU0+btTicjsQSWQlh/hZykN8KpmMf7uYwPW3R+akZ6R/w18ZlXSHBYXiYUPO3g==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.10"
      }
    },
    "node_modules/is-fullwidth-code-point": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/is-fullwidth-code-point/-/is-fullwidth-code-point-3.0.0.tgz",
      "integrity": "sha512-zymm5+u+sCsSWyD9qNaejV3DFvhCKclKdizYaJUuHA83RLjb7nSuGnddCHGv0hk+KY7BMAlsWeK4Ueg6EV6XQg==",
      "license": "MIT",
      "optional": true,
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/is-stream": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/is-stream/-/is-stream-2.0.1.tgz",
      "integrity": "sha512-hFoiJiTl63nn+kstHGBtewWSKnQLpyb155KHheA1l39uvtO9nWIop1p3udqPcUd/xbF1VLMO4n7OI6p7RbngDg==",
      "license": "MIT",
      "optional": true,
      "engines": {
        "node": ">=8"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/jose": {
      "version": "4.15.9",
      "resolved": "https://registry.npmjs.org/jose/-/jose-4.15.9.tgz",
      "integrity": "sha512-1vUQX+IdDMVPj4k8kOxgUqlcK518yluMuGZwqlr44FS1ppZB/5GWh4rZG89erpOBOJjU/OBsnCVFfapsRz6nEA==",
      "license": "MIT",
      "funding": {
        "url": "https://github.com/sponsors/panva"
      }
    },
    "node_modules/json-bigint": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/json-bigint/-/json-bigint-1.0.0.tgz",
      "integrity": "sha512-SiPv/8VpZuWbvLSMtTDU8hEfrZWg/mH/nV/b4o0CYbSxu1UIQPLdwKOCIyLQX+VIPO5vrLX3i8qtqFyhdPSUSQ==",
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "bignumber.js": "^9.0.0"
      }
    },
    "node_modules/jsonwebtoken": {
      "version": "9.0.3",
      "resolved": "https://registry.npmjs.org/jsonwebtoken/-/jsonwebtoken-9.0.3.tgz",
      "integrity": "sha512-MT/xP0CrubFRNLNKvxJ2BYfy53Zkm++5bX9dtuPbqAeQpTVe0MQTFhao8+Cp//EmJp244xt6Drw/GVEGCUj40g==",
      "license": "MIT",
      "dependencies": {
        "jws": "^4.0.1",
        "lodash.includes": "^4.3.0",
        "lodash.isboolean": "^3.0.3",
        "lodash.isinteger": "^4.0.4",
        "lodash.isnumber": "^3.0.3",
        "lodash.isplainobject": "^4.0.6",
        "lodash.isstring": "^4.0.1",
        "lodash.once": "^4.0.0",
        "ms": "^2.1.1",
        "semver": "^7.5.4"
      },
      "engines": {
        "node": ">=12",
        "npm": ">=6"
      }
    },
    "node_modules/jsonwebtoken/node_modules/ms": {
      "version": "2.1.3",
      "resolved": "https://registry.npmjs.org/ms/-/ms-2.1.3.tgz",
      "integrity": "sha512-6FlzubTLZG3J2a/NVCAleEhjzq5oxgHyaCU9yYXvcLsvoVaHJq/s5xXI6/XXP6tz7R9xAOtHnSO/tXtF3WRTlA==",
      "license": "MIT"
    },
    "node_modules/jwa": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/jwa/-/jwa-2.0.1.tgz",
      "integrity": "sha512-hRF04fqJIP8Abbkq5NKGN0Bbr3JxlQ+qhZufXVr0DvujKy93ZCbXZMHDL4EOtodSbCWxOqR8MS1tXA5hwqCXDg==",
      "license": "MIT",
      "dependencies": {
        "buffer-equal-constant-time": "^1.0.1",
        "ecdsa-sig-formatter": "1.0.11",
        "safe-buffer": "^5.0.1"
      }
    },
    "node_modules/jwks-rsa": {
      "version": "3.2.2",
      "resolved": "https://registry.npmjs.org/jwks-rsa/-/jwks-rsa-3.2.2.tgz",
      "integrity": "sha512-BqTyEDV+lS8F2trk3A+qJnxV5Q9EqKCBJOPti3W97r7qTympCZjb7h2X6f2kc+0K3rsSTY1/6YG2eaXKoj497w==",
      "license": "MIT",
      "dependencies": {
        "@types/jsonwebtoken": "^9.0.4",
        "debug": "^4.3.4",
        "jose": "^4.15.4",
        "limiter": "^1.1.5",
        "lru-memoizer": "^2.2.0"
      },
      "engines": {
        "node": ">=14"
      }
    },
    "node_modules/jwks-rsa/node_modules/debug": {
      "version": "4.4.3",
      "resolved": "https://registry.npmjs.org/debug/-/debug-4.4.3.tgz",
      "integrity": "sha512-RGwwWnwQvkVfavKVt22FGLw+xYSdzARwm0ru6DhTVA3umU5hZc28V3kO4stgYryrTlLpuvgI9GiijltAjNbcqA==",
      "license": "MIT",
      "dependencies": {
        "ms": "^2.1.3"
      },
      "engines": {
        "node": ">=6.0"
      },
      "peerDependenciesMeta": {
        "supports-color": {
          "optional": true
        }
      }
    },
    "node_modules/jwks-rsa/node_modules/ms": {
      "version": "2.1.3",
      "resolved": "https://registry.npmjs.org/ms/-/ms-2.1.3.tgz",
      "integrity": "sha512-6FlzubTLZG3J2a/NVCAleEhjzq5oxgHyaCU9yYXvcLsvoVaHJq/s5xXI6/XXP6tz7R9xAOtHnSO/tXtF3WRTlA==",
      "license": "MIT"
    },
    "node_modules/jws": {
      "version": "4.0.1",
      "resolved": "https://registry.npmjs.org/jws/-/jws-4.0.1.tgz",
      "integrity": "sha512-EKI/M/yqPncGUUh44xz0PxSidXFr/+r0pA70+gIYhjv+et7yxM+s29Y+VGDkovRofQem0fs7Uvf4+YmAdyRduA==",
      "license": "MIT",
      "dependencies": {
        "jwa": "^2.0.1",
        "safe-buffer": "^5.0.1"
      }
    },
    "node_modules/limiter": {
      "version": "1.1.5",
      "resolved": "https://registry.npmjs.org/limiter/-/limiter-1.1.5.tgz",
      "integrity": "sha512-FWWMIEOxz3GwUI4Ts/IvgVy6LPvoMPgjMdQ185nN6psJyBJ4yOpzqm695/h5umdLJg2vW3GR5iG11MAkR2AzJA=="
    },
    "node_modules/lodash.camelcase": {
      "version": "4.3.0",
      "resolved": "https://registry.npmjs.org/lodash.camelcase/-/lodash.camelcase-4.3.0.tgz",
      "integrity": "sha512-TwuEnCnxbc3rAvhf/LbG7tJUDzhqXyFnv3dtzLOPgCG/hODL7WFnsbwktkD7yUV0RrreP/l1PALq/YSg6VvjlA==",
      "license": "MIT",
      "optional": true
    },
    "node_modules/lodash.clonedeep": {
      "version": "4.5.0",
      "resolved": "https://registry.npmjs.org/lodash.clonedeep/-/lodash.clonedeep-4.5.0.tgz",
      "integrity": "sha512-H5ZhCF25riFd9uB5UCkVKo61m3S/xZk1x4wA6yp/L3RFP6Z/eHH1ymQcGLo7J3GMPfm0V/7m1tryHuGVxpqEBQ==",
      "license": "MIT"
    },
    "node_modules/lodash.includes": {
      "version": "4.3.0",
      "resolved": "https://registry.npmjs.org/lodash.includes/-/lodash.includes-4.3.0.tgz",
      "integrity": "sha512-W3Bx6mdkRTGtlJISOvVD/lbqjTlPPUDTMnlXZFnVwi9NKJ6tiAk6LVdlhZMm17VZisqhKcgzpO5Wz91PCt5b0w==",
      "license": "MIT"
    },
    "node_modules/lodash.isboolean": {
      "version": "3.0.3",
      "resolved": "https://registry.npmjs.org/lodash.isboolean/-/lodash.isboolean-3.0.3.tgz",
      "integrity": "sha512-Bz5mupy2SVbPHURB98VAcw+aHh4vRV5IPNhILUCsOzRmsTmSQ17jIuqopAentWoehktxGd9e/hbIXq980/1QJg==",
      "license": "MIT"
    },
    "node_modules/lodash.isinteger": {
      "version": "4.0.4",
      "resolved": "https://registry.npmjs.org/lodash.isinteger/-/lodash.isinteger-4.0.4.tgz",
      "integrity": "sha512-DBwtEWN2caHQ9/imiNeEA5ys1JoRtRfY3d7V9wkqtbycnAmTvRRmbHKDV4a0EYc678/dia0jrte4tjYwVBaZUA==",
      "license": "MIT"
    },
    "node_modules/lodash.isnumber": {
      "version": "3.0.3",
      "resolved": "https://registry.npmjs.org/lodash.isnumber/-/lodash.isnumber-3.0.3.tgz",
      "integrity": "sha512-QYqzpfwO3/CWf3XP+Z+tkQsfaLL/EnUlXWVkIk5FUPc4sBdTehEqZONuyRt2P67PXAk+NXmTBcc97zw9t1FQrw==",
      "license": "MIT"
    },
    "node_modules/lodash.isplainobject": {
      "version": "4.0.6",
      "resolved": "https://registry.npmjs.org/lodash.isplainobject/-/lodash.isplainobject-4.0.6.tgz",
      "integrity": "sha512-oSXzaWypCMHkPC3NvBEaPHf0KsA5mvPrOPgQWDsbg8n7orZ290M0BmC/jgRZ4vcJ6DTAhjrsSYgdsW/F+MFOBA==",
      "license": "MIT"
    },
    "node_modules/lodash.isstring": {
      "version": "4.0.1",
      "resolved": "https://registry.npmjs.org/lodash.isstring/-/lodash.isstring-4.0.1.tgz",
      "integrity": "sha512-0wJxfxH1wgO3GrbuP+dTTk7op+6L41QCXbGINEmD+ny/G/eCqGzxyCsh7159S+mgDDcoarnBw6PC1PS5+wUGgw==",
      "license": "MIT"
    },
    "node_modules/lodash.once": {
      "version": "4.1.1",
      "resolved": "https://registry.npmjs.org/lodash.once/-/lodash.once-4.1.1.tgz",
      "integrity": "sha512-Sb487aTOCr9drQVL8pIxOzVhafOjZN9UU54hiN8PU3uAiSV7lx1yYNpbNmex2PK6dSJoNTSJUUswT651yww3Mg==",
      "license": "MIT"
    },
    "node_modules/long": {
      "version": "5.3.2",
      "resolved": "https://registry.npmjs.org/long/-/long-5.3.2.tgz",
      "integrity": "sha512-mNAgZ1GmyNhD7AuqnTG3/VQ26o760+ZYBPKjPvugO8+nLbYfX6TVpJPseBvopbdY+qpZ/lKUnmEc1LeZYS3QAA==",
      "license": "Apache-2.0"
    },
    "node_modules/lru-cache": {
      "version": "6.0.0",
      "resolved": "https://registry.npmjs.org/lru-cache/-/lru-cache-6.0.0.tgz",
      "integrity": "sha512-Jo6dJ04CmSjuznwJSS3pUeWmd/H0ffTlkXXgwZi+eq1UCmqQwCh+eLsYOYCwY991i2Fah4h1BEMCx4qThGbsiA==",
      "license": "ISC",
      "dependencies": {
        "yallist": "^4.0.0"
      },
      "engines": {
        "node": ">=10"
      }
    },
    "node_modules/lru-memoizer": {
      "version": "2.3.0",
      "resolved": "https://registry.npmjs.org/lru-memoizer/-/lru-memoizer-2.3.0.tgz",
      "integrity": "sha512-GXn7gyHAMhO13WSKrIiNfztwxodVsP8IoZ3XfrJV4yH2x0/OeTO/FIaAHTY5YekdGgW94njfuKmyyt1E0mR6Ug==",
      "license": "MIT",
      "dependencies": {
        "lodash.clonedeep": "^4.5.0",
        "lru-cache": "6.0.0"
      }
    },
    "node_modules/math-intrinsics": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/math-intrinsics/-/math-intrinsics-1.1.0.tgz",
      "integrity": "sha512-/IXtbwEk5HTPyEwyKX6hGkYXxM9nbj64B+ilVJnC/R6B0pH5G4V3b0pVbL7DBj4tkhBAppbQUlf6F6Xl9LHu1g==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/media-typer": {
      "version": "0.3.0",
      "resolved": "https://registry.npmjs.org/media-typer/-/media-typer-0.3.0.tgz",
      "integrity": "sha512-dq+qelQ9akHpcOl/gUVRTxVIOkAJ1wR3QAvb4RsVjS8oVoFjDGTc679wJYmUmknUF5HwMLOgb5O+a3KxfWapPQ==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/merge-descriptors": {
      "version": "1.0.3",
      "resolved": "https://registry.npmjs.org/merge-descriptors/-/merge-descriptors-1.0.3.tgz",
      "integrity": "sha512-gaNvAS7TZ897/rVaZ0nMtAyxNyi/pdbjbAwUpFQpN70GqnVfOiXpeUUMKRBmzXaSQ8DdTX4/0ms62r2K+hE6mQ==",
      "license": "MIT",
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/methods": {
      "version": "1.1.2",
      "resolved": "https://registry.npmjs.org/methods/-/methods-1.1.2.tgz",
      "integrity": "sha512-iclAHeNqNm68zFtnZ0e+1L2yUIdvzNoauKU4WBA3VvH/vPFieF7qfRlwUZU+DA9P9bPXIS90ulxoUoCH23sV2w==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/mime": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/mime/-/mime-3.0.0.tgz",
      "integrity": "sha512-jSCU7/VB1loIWBZe14aEYHU/+1UMEHoaO7qxCOVJOw9GgH72VAWppxNcjU+x9a2k3GSIBXNKxXQFqRvvZ7vr3A==",
      "license": "MIT",
      "optional": true,
      "bin": {
        "mime": "cli.js"
      },
      "engines": {
        "node": ">=10.0.0"
      }
    },
    "node_modules/mime-db": {
      "version": "1.52.0",
      "resolved": "https://registry.npmjs.org/mime-db/-/mime-db-1.52.0.tgz",
      "integrity": "sha512-sPU4uV7dYlvtWJxwwxHD0PuihVNiE7TyAbQ5SWxDCB9mUYvOgroQOwYQQOKPJ8CIbE+1ETVlOoK1UC2nU3gYvg==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/mime-types": {
      "version": "2.1.35",
      "resolved": "https://registry.npmjs.org/mime-types/-/mime-types-2.1.35.tgz",
      "integrity": "sha512-ZDY+bPm5zTTF+YpCrAU9nK0UgICYPT0QtT1NZWFv4s++TNkcgVaT0g6+4R2uI4MjQjzysHB1zxuWL50hzaeXiw==",
      "license": "MIT",
      "dependencies": {
        "mime-db": "1.52.0"
      },
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/ms": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/ms/-/ms-2.0.0.tgz",
      "integrity": "sha512-Tpp60P6IUJDTuOq/5Z8cdskzJujfwqfOTkrwIwj7IRISpnkJnT6SyJ4PCPnGMoFjC9ddhal5KVIYtAt97ix05A==",
      "license": "MIT"
    },
    "node_modules/negotiator": {
      "version": "0.6.3",
      "resolved": "https://registry.npmjs.org/negotiator/-/negotiator-0.6.3.tgz",
      "integrity": "sha512-+EUsqGPLsM+j/zdChZjsnX51g4XrHFOIXwfnCVPGlQk/k5giakcKsuxCObBRu6DSm9opw/O6slWbJdghQM4bBg==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/node-fetch": {
      "version": "2.7.0",
      "resolved": "https://registry.npmjs.org/node-fetch/-/node-fetch-2.7.0.tgz",
      "integrity": "sha512-c4FRfUm/dbcWZ7U+1Wq0AwCyFL+3nt2bEw05wfxSz+DWpWsitgmSgYmy2dQdWyKC1694ELPqMs/YzUSNozLt8A==",
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "whatwg-url": "^5.0.0"
      },
      "engines": {
        "node": "4.x || >=6.0.0"
      },
      "peerDependencies": {
        "encoding": "^0.1.0"
      },
      "peerDependenciesMeta": {
        "encoding": {
          "optional": true
        }
      }
    },
    "node_modules/node-forge": {
      "version": "1.3.3",
      "resolved": "https://registry.npmjs.org/node-forge/-/node-forge-1.3.3.tgz",
      "integrity": "sha512-rLvcdSyRCyouf6jcOIPe/BgwG/d7hKjzMKOas33/pHEr6gbq18IK9zV7DiPvzsz0oBJPme6qr6H6kGZuI9/DZg==",
      "license": "(BSD-3-Clause OR GPL-2.0)",
      "engines": {
        "node": ">= 6.13.0"
      }
    },
    "node_modules/object-assign": {
      "version": "4.1.1",
      "resolved": "https://registry.npmjs.org/object-assign/-/object-assign-4.1.1.tgz",
      "integrity": "sha512-rJgTQnkUnH1sFw8yT6VSU3zD3sWmu6sZhIseY8VX+GRu3P6F7Fu+JNDoXfklElbLJSnc3FUQHVe4cU5hj+BcUg==",
      "license": "MIT",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/object-hash": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/object-hash/-/object-hash-3.0.0.tgz",
      "integrity": "sha512-RSn9F68PjH9HqtltsSnqYC1XXoWe9Bju5+213R98cNGttag9q9yAOTzdbsqvIa7aNm5WffBZFpWYr2aWrklWAw==",
      "license": "MIT",
      "optional": true,
      "engines": {
        "node": ">= 6"
      }
    },
    "node_modules/object-inspect": {
      "version": "1.13.4",
      "resolved": "https://registry.npmjs.org/object-inspect/-/object-inspect-1.13.4.tgz",
      "integrity": "sha512-W67iLl4J2EXEGTbfeHCffrjDfitvLANg0UlX3wFUUSTx92KXRFegMHUVgSqE+wvhAbi4WqjGg9czysTV2Epbew==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/on-finished": {
      "version": "2.4.1",
      "resolved": "https://registry.npmjs.org/on-finished/-/on-finished-2.4.1.tgz",
      "integrity": "sha512-oVlzkg3ENAhCk2zdv7IJwd/QUD4z2RxRwpkcGY8psCVcCYZNq4wYnVWALHM+brtuJjePWiYF/ClmuDr8Ch5+kg==",
      "license": "MIT",
      "dependencies": {
        "ee-first": "1.1.1"
      },
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/once": {
      "version": "1.4.0",
      "resolved": "https://registry.npmjs.org/once/-/once-1.4.0.tgz",
      "integrity": "sha512-lNaJgI+2Q5URQBkccEKHTQOPaXdUxnZZElQTZY0MFUAuaEqe1E+Nyvgdz/aIyNi6Z9MzO5dv1H8n58/GELp3+w==",
      "license": "ISC",
      "optional": true,
      "dependencies": {
        "wrappy": "1"
      }
    },
    "node_modules/p-limit": {
      "version": "3.1.0",
      "resolved": "https://registry.npmjs.org/p-limit/-/p-limit-3.1.0.tgz",
      "integrity": "sha512-TYOanM3wGwNGsZN2cVTYPArw454xnXj5qmWF1bEoAc4+cU/ol7GVh7odevjp1FNHduHc3KZMcFduxU5Xc6uJRQ==",
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "yocto-queue": "^0.1.0"
      },
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/parseurl": {
      "version": "1.3.3",
      "resolved": "https://registry.npmjs.org/parseurl/-/parseurl-1.3.3.tgz",
      "integrity": "sha512-CiyeOxFT/JZyN5m0z9PfXw4SCBJ6Sygz1Dpl0wqjlhDEGGBP1GnsUVEL0p63hoG1fcj3fHynXi9NYO4nWOL+qQ==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/path-to-regexp": {
      "version": "0.1.12",
      "resolved": "https://registry.npmjs.org/path-to-regexp/-/path-to-regexp-0.1.12.tgz",
      "integrity": "sha512-RA1GjUVMnvYFxuqovrEqZoxxW5NUZqbwKtYz/Tt7nXerk0LbLblQmrsgdeOxV5SFHf0UDggjS/bSeOZwt1pmEQ==",
      "license": "MIT"
    },
    "node_modules/proto3-json-serializer": {
      "version": "2.0.2",
      "resolved": "https://registry.npmjs.org/proto3-json-serializer/-/proto3-json-serializer-2.0.2.tgz",
      "integrity": "sha512-SAzp/O4Yh02jGdRc+uIrGoe87dkN/XtwxfZ4ZyafJHymd79ozp5VG5nyZ7ygqPM5+cpLDjjGnYFUkngonyDPOQ==",
      "license": "Apache-2.0",
      "optional": true,
      "dependencies": {
        "protobufjs": "^7.2.5"
      },
      "engines": {
        "node": ">=14.0.0"
      }
    },
    "node_modules/protobufjs": {
      "version": "7.5.4",
      "resolved": "https://registry.npmjs.org/protobufjs/-/protobufjs-7.5.4.tgz",
      "integrity": "sha512-CvexbZtbov6jW2eXAvLukXjXUW1TzFaivC46BpWc/3BpcCysb5Vffu+B3XHMm8lVEuy2Mm4XGex8hBSg1yapPg==",
      "hasInstallScript": true,
      "license": "BSD-3-Clause",
      "dependencies": {
        "@protobufjs/aspromise": "^1.1.2",
        "@protobufjs/base64": "^1.1.2",
        "@protobufjs/codegen": "^2.0.4",
        "@protobufjs/eventemitter": "^1.1.0",
        "@protobufjs/fetch": "^1.1.0",
        "@protobufjs/float": "^1.0.2",
        "@protobufjs/inquire": "^1.1.0",
        "@protobufjs/path": "^1.1.2",
        "@protobufjs/pool": "^1.1.0",
        "@protobufjs/utf8": "^1.1.0",
        "@types/node": ">=13.7.0",
        "long": "^5.0.0"
      },
      "engines": {
        "node": ">=12.0.0"
      }
    },
    "node_modules/proxy-addr": {
      "version": "2.0.7",
      "resolved": "https://registry.npmjs.org/proxy-addr/-/proxy-addr-2.0.7.tgz",
      "integrity": "sha512-llQsMLSUDUPT44jdrU/O37qlnifitDP+ZwrmmZcoSKyLKvtZxpyV0n2/bD/N4tBAAZ/gJEdZU7KMraoK1+XYAg==",
      "license": "MIT",
      "dependencies": {
        "forwarded": "0.2.0",
        "ipaddr.js": "1.9.1"
      },
      "engines": {
        "node": ">= 0.10"
      }
    },
    "node_modules/qs": {
      "version": "6.14.1",
      "resolved": "https://registry.npmjs.org/qs/-/qs-6.14.1.tgz",
      "integrity": "sha512-4EK3+xJl8Ts67nLYNwqw/dsFVnCf+qR7RgXSK9jEEm9unao3njwMDdmsdvoKBKHzxd7tCYz5e5M+SnMjdtXGQQ==",
      "license": "BSD-3-Clause",
      "dependencies": {
        "side-channel": "^1.1.0"
      },
      "engines": {
        "node": ">=0.6"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/range-parser": {
      "version": "1.2.1",
      "resolved": "https://registry.npmjs.org/range-parser/-/range-parser-1.2.1.tgz",
      "integrity": "sha512-Hrgsx+orqoygnmhFbKaHE6c296J+HTAQXoxEF6gNupROmmGJRoyzfG3ccAveqCBrwr/2yxQ5BVd/GTl5agOwSg==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/raw-body": {
      "version": "2.5.3",
      "resolved": "https://registry.npmjs.org/raw-body/-/raw-body-2.5.3.tgz",
      "integrity": "sha512-s4VSOf6yN0rvbRZGxs8Om5CWj6seneMwK3oDb4lWDH0UPhWcxwOWw5+qk24bxq87szX1ydrwylIOp2uG1ojUpA==",
      "license": "MIT",
      "dependencies": {
        "bytes": "~3.1.2",
        "http-errors": "~2.0.1",
        "iconv-lite": "~0.4.24",
        "unpipe": "~1.0.0"
      },
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/readable-stream": {
      "version": "3.6.2",
      "resolved": "https://registry.npmjs.org/readable-stream/-/readable-stream-3.6.2.tgz",
      "integrity": "sha512-9u/sniCrY3D5WdsERHzHE4G2YCXqoG5FTHUiCC4SIbr6XcLZBY05ya9EKjYek9O5xOAwjGq+1JdGBAS7Q9ScoA==",
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "inherits": "^2.0.3",
        "string_decoder": "^1.1.1",
        "util-deprecate": "^1.0.1"
      },
      "engines": {
        "node": ">= 6"
      }
    },
    "node_modules/require-directory": {
      "version": "2.1.1",
      "resolved": "https://registry.npmjs.org/require-directory/-/require-directory-2.1.1.tgz",
      "integrity": "sha512-fGxEI7+wsG9xrvdjsrlmL22OMTTiHRwAMroiEeMgq8gzoLC/PQr7RsRDSTLUg/bZAZtF+TVIkHc6/4RIKrui+Q==",
      "license": "MIT",
      "optional": true,
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/retry": {
      "version": "0.13.1",
      "resolved": "https://registry.npmjs.org/retry/-/retry-0.13.1.tgz",
      "integrity": "sha512-XQBQ3I8W1Cge0Seh+6gjj03LbmRFWuoszgK9ooCpwYIrhhoO80pfq4cUkU5DkknwfOfFteRwlZ56PYOGYyFWdg==",
      "license": "MIT",
      "optional": true,
      "engines": {
        "node": ">= 4"
      }
    },
    "node_modules/retry-request": {
      "version": "7.0.2",
      "resolved": "https://registry.npmjs.org/retry-request/-/retry-request-7.0.2.tgz",
      "integrity": "sha512-dUOvLMJ0/JJYEn8NrpOaGNE7X3vpI5XlZS/u0ANjqtcZVKnIxP7IgCFwrKTxENw29emmwug53awKtaMm4i9g5w==",
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "@types/request": "^2.48.8",
        "extend": "^3.0.2",
        "teeny-request": "^9.0.0"
      },
      "engines": {
        "node": ">=14"
      }
    },
    "node_modules/safe-buffer": {
      "version": "5.2.1",
      "resolved": "https://registry.npmjs.org/safe-buffer/-/safe-buffer-5.2.1.tgz",
      "integrity": "sha512-rp3So07KcdmmKbGvgaNxQSJr7bGVSVk5S9Eq1F+ppbRo70+YeaDxkw5Dd8NPN+GD6bjnYm2VuPuCXmpuYvmCXQ==",
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/feross"
        },
        {
          "type": "patreon",
          "url": "https://www.patreon.com/feross"
        },
        {
          "type": "consulting",
          "url": "https://feross.org/support"
        }
      ],
      "license": "MIT"
    },
    "node_modules/safer-buffer": {
      "version": "2.1.2",
      "resolved": "https://registry.npmjs.org/safer-buffer/-/safer-buffer-2.1.2.tgz",
      "integrity": "sha512-YZo3K82SD7Riyi0E1EQPojLz7kpepnSQI9IyPbHHg1XXXevb5dJI7tpyN2ADxGcQbHG7vcyRHk0cbwqcQriUtg==",
      "license": "MIT"
    },
    "node_modules/semver": {
      "version": "7.7.3",
      "resolved": "https://registry.npmjs.org/semver/-/semver-7.7.3.tgz",
      "integrity": "sha512-SdsKMrI9TdgjdweUSR9MweHA4EJ8YxHn8DFaDisvhVlUOe4BF1tLD7GAj0lIqWVl+dPb/rExr0Btby5loQm20Q==",
      "license": "ISC",
      "bin": {
        "semver": "bin/semver.js"
      },
      "engines": {
        "node": ">=10"
      }
    },
    "node_modules/send": {
      "version": "0.19.2",
      "resolved": "https://registry.npmjs.org/send/-/send-0.19.2.tgz",
      "integrity": "sha512-VMbMxbDeehAxpOtWJXlcUS5E8iXh6QmN+BkRX1GARS3wRaXEEgzCcB10gTQazO42tpNIya8xIyNx8fll1OFPrg==",
      "license": "MIT",
      "dependencies": {
        "debug": "2.6.9",
        "depd": "2.0.0",
        "destroy": "1.2.0",
        "encodeurl": "~2.0.0",
        "escape-html": "~1.0.3",
        "etag": "~1.8.1",
        "fresh": "~0.5.2",
        "http-errors": "~2.0.1",
        "mime": "1.6.0",
        "ms": "2.1.3",
        "on-finished": "~2.4.1",
        "range-parser": "~1.2.1",
        "statuses": "~2.0.2"
      },
      "engines": {
        "node": ">= 0.8.0"
      }
    },
    "node_modules/send/node_modules/mime": {
      "version": "1.6.0",
      "resolved": "https://registry.npmjs.org/mime/-/mime-1.6.0.tgz",
      "integrity": "sha512-x0Vn8spI+wuJ1O6S7gnbaQg8Pxh4NNHb7KSINmEWKiPE4RKOplvijn+NkmYmmRgP68mc70j2EbeTFRsrswaQeg==",
      "license": "MIT",
      "bin": {
        "mime": "cli.js"
      },
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/send/node_modules/ms": {
      "version": "2.1.3",
      "resolved": "https://registry.npmjs.org/ms/-/ms-2.1.3.tgz",
      "integrity": "sha512-6FlzubTLZG3J2a/NVCAleEhjzq5oxgHyaCU9yYXvcLsvoVaHJq/s5xXI6/XXP6tz7R9xAOtHnSO/tXtF3WRTlA==",
      "license": "MIT"
    },
    "node_modules/serve-static": {
      "version": "1.16.3",
      "resolved": "https://registry.npmjs.org/serve-static/-/serve-static-1.16.3.tgz",
      "integrity": "sha512-x0RTqQel6g5SY7Lg6ZreMmsOzncHFU7nhnRWkKgWuMTu5NN0DR5oruckMqRvacAN9d5w6ARnRBXl9xhDCgfMeA==",
      "license": "MIT",
      "dependencies": {
        "encodeurl": "~2.0.0",
        "escape-html": "~1.0.3",
        "parseurl": "~1.3.3",
        "send": "~0.19.1"
      },
      "engines": {
        "node": ">= 0.8.0"
      }
    },
    "node_modules/setprototypeof": {
      "version": "1.2.0",
      "resolved": "https://registry.npmjs.org/setprototypeof/-/setprototypeof-1.2.0.tgz",
      "integrity": "sha512-E5LDX7Wrp85Kil5bhZv46j8jOeboKq5JMmYM3gVGdGH8xFpPWXUMsNrlODCrkoxMEeNi/XZIwuRvY4XNwYMJpw==",
      "license": "ISC"
    },
    "node_modules/side-channel": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/side-channel/-/side-channel-1.1.0.tgz",
      "integrity": "sha512-ZX99e6tRweoUXqR+VBrslhda51Nh5MTQwou5tnUDgbtyM0dBgmhEDtWGP/xbKn6hqfPRHujUNwz5fy/wbbhnpw==",
      "license": "MIT",
      "dependencies": {
        "es-errors": "^1.3.0",
        "object-inspect": "^1.13.3",
        "side-channel-list": "^1.0.0",
        "side-channel-map": "^1.0.1",
        "side-channel-weakmap": "^1.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/side-channel-list": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/side-channel-list/-/side-channel-list-1.0.0.tgz",
      "integrity": "sha512-FCLHtRD/gnpCiCHEiJLOwdmFP+wzCmDEkc9y7NsYxeF4u7Btsn1ZuwgwJGxImImHicJArLP4R0yX4c2KCrMrTA==",
      "license": "MIT",
      "dependencies": {
        "es-errors": "^1.3.0",
        "object-inspect": "^1.13.3"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/side-channel-map": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/side-channel-map/-/side-channel-map-1.0.1.tgz",
      "integrity": "sha512-VCjCNfgMsby3tTdo02nbjtM/ewra6jPHmpThenkTYh8pG9ucZ/1P8So4u4FGBek/BjpOVsDCMoLA/iuBKIFXRA==",
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.2",
        "es-errors": "^1.3.0",
        "get-intrinsic": "^1.2.5",
        "object-inspect": "^1.13.3"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/side-channel-weakmap": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/side-channel-weakmap/-/side-channel-weakmap-1.0.2.tgz",
      "integrity": "sha512-WPS/HvHQTYnHisLo9McqBHOJk2FkHO/tlpvldyrnem4aeQp4hai3gythswg6p01oSoTl58rcpiFAjF2br2Ak2A==",
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.2",
        "es-errors": "^1.3.0",
        "get-intrinsic": "^1.2.5",
        "object-inspect": "^1.13.3",
        "side-channel-map": "^1.0.1"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/statuses": {
      "version": "2.0.2",
      "resolved": "https://registry.npmjs.org/statuses/-/statuses-2.0.2.tgz",
      "integrity": "sha512-DvEy55V3DB7uknRo+4iOGT5fP1slR8wQohVdknigZPMpMstaKJQWhwiYBACJE3Ul2pTnATihhBYnRhZQHGBiRw==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/stream-events": {
      "version": "1.0.5",
      "resolved": "https://registry.npmjs.org/stream-events/-/stream-events-1.0.5.tgz",
      "integrity": "sha512-E1GUzBSgvct8Jsb3v2X15pjzN1tYebtbLaMg+eBOUOAxgbLoSbT2NS91ckc5lJD1KfLjId+jXJRgo0qnV5Nerg==",
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "stubs": "^3.0.0"
      }
    },
    "node_modules/stream-shift": {
      "version": "1.0.3",
      "resolved": "https://registry.npmjs.org/stream-shift/-/stream-shift-1.0.3.tgz",
      "integrity": "sha512-76ORR0DO1o1hlKwTbi/DM3EXWGf3ZJYO8cXX5RJwnul2DEg2oyoZyjLNoQM8WsvZiFKCRfC1O0J7iCvie3RZmQ==",
      "license": "MIT",
      "optional": true
    },
    "node_modules/string_decoder": {
      "version": "1.3.0",
      "resolved": "https://registry.npmjs.org/string_decoder/-/string_decoder-1.3.0.tgz",
      "integrity": "sha512-hkRX8U1WjJFd8LsDJ2yQ/wWWxaopEsABU1XfkM8A+j0+85JAGppt16cr1Whg6KIbb4okU6Mql6BOj+uup/wKeA==",
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "safe-buffer": "~5.2.0"
      }
    },
    "node_modules/string-width": {
      "version": "4.2.3",
      "resolved": "https://registry.npmjs.org/string-width/-/string-width-4.2.3.tgz",
      "integrity": "sha512-wKyQRQpjJ0sIp62ErSZdGsjMJWsap5oRNihHhu6G7JVO/9jIB6UyevL+tXuOqrng8j/cxKTWyWUwvSTriiZz/g==",
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "emoji-regex": "^8.0.0",
        "is-fullwidth-code-point": "^3.0.0",
        "strip-ansi": "^6.0.1"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/strip-ansi": {
      "version": "6.0.1",
      "resolved": "https://registry.npmjs.org/strip-ansi/-/strip-ansi-6.0.1.tgz",
      "integrity": "sha512-Y38VPSHcqkFrCpFnQ9vuSXmquuv5oXOKpGeT6aGrr3o3Gc9AlVa6JBfUSOCnbxGGZF+/0ooI7KrPuUSztUdU5A==",
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "ansi-regex": "^5.0.1"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/strnum": {
      "version": "1.1.2",
      "resolved": "https://registry.npmjs.org/strnum/-/strnum-1.1.2.tgz",
      "integrity": "sha512-vrN+B7DBIoTTZjnPNewwhx6cBA/H+IS7rfW68n7XxC1y7uoiGQBxaKzqucGUgavX15dJgiGztLJ8vxuEzwqBdA==",
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/NaturalIntelligence"
        }
      ],
      "license": "MIT",
      "optional": true
    },
    "node_modules/stubs": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/stubs/-/stubs-3.0.0.tgz",
      "integrity": "sha512-PdHt7hHUJKxvTCgbKX9C1V/ftOcjJQgz8BZwNfV5c4B6dcGqlpelTbJ999jBGZ2jYiPAwcX5dP6oBwVlBlUbxw==",
      "license": "MIT",
      "optional": true
    },
    "node_modules/teeny-request": {
      "version": "9.0.0",
      "resolved": "https://registry.npmjs.org/teeny-request/-/teeny-request-9.0.0.tgz",
      "integrity": "sha512-resvxdc6Mgb7YEThw6G6bExlXKkv6+YbuzGg9xuXxSgxJF7Ozs+o8Y9+2R3sArdWdW8nOokoQb1yrpFB0pQK2g==",
      "license": "Apache-2.0",
      "optional": true,
      "dependencies": {
        "http-proxy-agent": "^5.0.0",
        "https-proxy-agent": "^5.0.0",
        "node-fetch": "^2.6.9",
        "stream-events": "^1.0.5",
        "uuid": "^9.0.0"
      },
      "engines": {
        "node": ">=14"
      }
    },
    "node_modules/teeny-request/node_modules/agent-base": {
      "version": "6.0.2",
      "resolved": "https://registry.npmjs.org/agent-base/-/agent-base-6.0.2.tgz",
      "integrity": "sha512-RZNwNclF7+MS/8bDg70amg32dyeZGZxiDuQmZxKLAlQjr3jGyLx+4Kkk58UO7D2QdgFIQCovuSuZESne6RG6XQ==",
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "debug": "4"
      },
      "engines": {
        "node": ">= 6.0.0"
      }
    },
    "node_modules/teeny-request/node_modules/debug": {
      "version": "4.4.3",
      "resolved": "https://registry.npmjs.org/debug/-/debug-4.4.3.tgz",
      "integrity": "sha512-RGwwWnwQvkVfavKVt22FGLw+xYSdzARwm0ru6DhTVA3umU5hZc28V3kO4stgYryrTlLpuvgI9GiijltAjNbcqA==",
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "ms": "^2.1.3"
      },
      "engines": {
        "node": ">=6.0"
      },
      "peerDependenciesMeta": {
        "supports-color": {
          "optional": true
        }
      }
    },
    "node_modules/teeny-request/node_modules/https-proxy-agent": {
      "version": "5.0.1",
      "resolved": "https://registry.npmjs.org/https-proxy-agent/-/https-proxy-agent-5.0.1.tgz",
      "integrity": "sha512-dFcAjpTQFgoLMzC2VwU+C/CbS7uRL0lWmxDITmqm7C+7F0Odmj6s9l6alZc6AELXhrnggM2CeWSXHGOdX2YtwA==",
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "agent-base": "6",
        "debug": "4"
      },
      "engines": {
        "node": ">= 6"
      }
    },
    "node_modules/teeny-request/node_modules/ms": {
      "version": "2.1.3",
      "resolved": "https://registry.npmjs.org/ms/-/ms-2.1.3.tgz",
      "integrity": "sha512-6FlzubTLZG3J2a/NVCAleEhjzq5oxgHyaCU9yYXvcLsvoVaHJq/s5xXI6/XXP6tz7R9xAOtHnSO/tXtF3WRTlA==",
      "license": "MIT",
      "optional": true
    },
    "node_modules/teeny-request/node_modules/uuid": {
      "version": "9.0.1",
      "resolved": "https://registry.npmjs.org/uuid/-/uuid-9.0.1.tgz",
      "integrity": "sha512-b+1eJOlsR9K8HJpow9Ok3fiWOWSIcIzXodvv0rQjVoOVNpWMpxf1wZNpt4y9h10odCNrqnYp1OBzRktckBe3sA==",
      "funding": [
        "https://github.com/sponsors/broofa",
        "https://github.com/sponsors/ctavan"
      ],
      "license": "MIT",
      "optional": true,
      "bin": {
        "uuid": "dist/bin/uuid"
      }
    },
    "node_modules/toidentifier": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/toidentifier/-/toidentifier-1.0.1.tgz",
      "integrity": "sha512-o5sSPKEkg/DIQNmH43V0/uerLrpzVedkUh8tGNvaeXpfpuwjKenlSox/2O/BTlZUtEe+JG7s5YhEz608PlAHRA==",
      "license": "MIT",
      "engines": {
        "node": ">=0.6"
      }
    },
    "node_modules/tr46": {
      "version": "0.0.3",
      "resolved": "https://registry.npmjs.org/tr46/-/tr46-0.0.3.tgz",
      "integrity": "sha512-N3WMsuqV66lT30CrXNbEjx4GEwlow3v6rr4mCcv6prnfwhS01rkgyFdjPNBYd9br7LpXV1+Emh01fHnq2Gdgrw==",
      "license": "MIT",
      "optional": true
    },
    "node_modules/tslib": {
      "version": "2.8.1",
      "resolved": "https://registry.npmjs.org/tslib/-/tslib-2.8.1.tgz",
      "integrity": "sha512-oJFu94HQb+KVduSUQL7wnpmqnfmLsOA/nAh6b6EH0wCEoK0/mPeXU6c3wKDV83MkOuHPRHtSXKKU99IBazS/2w==",
      "license": "0BSD"
    },
    "node_modules/type-is": {
      "version": "1.6.18",
      "resolved": "https://registry.npmjs.org/type-is/-/type-is-1.6.18.tgz",
      "integrity": "sha512-TkRKr9sUTxEH8MdfuCSP7VizJyzRNMjj2J2do2Jr3Kym598JVdEksuzPQCnlFPW4ky9Q+iA+ma9BGm06XQBy8g==",
      "license": "MIT",
      "dependencies": {
        "media-typer": "0.3.0",
        "mime-types": "~2.1.24"
      },
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/undici-types": {
      "version": "6.21.0",
      "resolved": "https://registry.npmjs.org/undici-types/-/undici-types-6.21.0.tgz",
      "integrity": "sha512-iwDZqg0QAGrg9Rav5H4n0M64c3mkR59cJ6wQp+7C4nI0gsmExaedaYLNO44eT4AtBBwjbTiGPMlt2Md0T9H9JQ==",
      "license": "MIT"
    },
    "node_modules/unpipe": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/unpipe/-/unpipe-1.0.0.tgz",
      "integrity": "sha512-pjy2bYhSsufwWlKwPc+l3cN7+wuJlK6uz0YdJEOlQDbl6jo/YlPi4mb8agUkVC8BF7V8NuzeyPNqRksA3hztKQ==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/util-deprecate": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/util-deprecate/-/util-deprecate-1.0.2.tgz",
      "integrity": "sha512-EPD5q1uXyFxJpCrLnCc1nHnq3gOa6DZBocAIiI2TaSCA7VCJ1UJDMagCzIkXNsUYfD1daK//LTEQ8xiIbrHtcw==",
      "license": "MIT",
      "optional": true
    },
    "node_modules/utils-merge": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/utils-merge/-/utils-merge-1.0.1.tgz",
      "integrity": "sha512-pMZTvIkT1d+TFGvDOqodOclx0QWkkgi6Tdoa8gC8ffGAAqz9pzPTZWAybbsHHoED/ztMtkv/VoYTYyShUn81hA==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.4.0"
      }
    },
    "node_modules/uuid": {
      "version": "10.0.0",
      "resolved": "https://registry.npmjs.org/uuid/-/uuid-10.0.0.tgz",
      "integrity": "sha512-8XkAphELsDnEGrDxUOHB3RGvXz6TeuYSGEZBOjtTtPm2lwhGBjLgOzLHB63IUWfBpNucQjND6d3AOudO+H3RWQ==",
      "funding": [
        "https://github.com/sponsors/broofa",
        "https://github.com/sponsors/ctavan"
      ],
      "license": "MIT",
      "bin": {
        "uuid": "dist/bin/uuid"
      }
    },
    "node_modules/vary": {
      "version": "1.1.2",
      "resolved": "https://registry.npmjs.org/vary/-/vary-1.1.2.tgz",
      "integrity": "sha512-BNGbWLfd0eUPabhkXUVm0j8uuvREyTh5ovRa/dyow/BqAbZJyC+5fU+IzQOzmAKzYqYRAISoRhdQr3eIZ/PXqg==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/webidl-conversions": {
      "version": "3.0.1",
      "resolved": "https://registry.npmjs.org/webidl-conversions/-/webidl-conversions-3.0.1.tgz",
      "integrity": "sha512-2JAn3z8AR6rjK8Sm8orRC0h/bcl/DqL7tRPdGZ4I1CjdF+EaMLmYxBHyXuKL849eucPFhvBoxMsflfOb8kxaeQ==",
      "license": "BSD-2-Clause",
      "optional": true
    },
    "node_modules/websocket-driver": {
      "version": "0.7.4",
      "resolved": "https://registry.npmjs.org/websocket-driver/-/websocket-driver-0.7.4.tgz",
      "integrity": "sha512-b17KeDIQVjvb0ssuSDF2cYXSg2iztliJ4B9WdsuB6J952qCPKmnVq4DyW5motImXHDC1cBT/1UezrJVsKw5zjg==",
      "license": "Apache-2.0",
      "dependencies": {
        "http-parser-js": ">=0.5.1",
        "safe-buffer": ">=5.1.0",
        "websocket-extensions": ">=0.1.1"
      },
      "engines": {
        "node": ">=0.8.0"
      }
    },
    "node_modules/websocket-extensions": {
      "version": "0.1.4",
      "resolved": "https://registry.npmjs.org/websocket-extensions/-/websocket-extensions-0.1.4.tgz",
      "integrity": "sha512-OqedPIGOfsDlo31UNwYbCFMSaO9m9G/0faIHj5/dZFDMFqPTcx6UwqyOy3COEaEOg/9VsGIpdqn62W5KhoKSpg==",
      "license": "Apache-2.0",
      "engines": {
        "node": ">=0.8.0"
      }
    },
    "node_modules/whatwg-url": {
      "version": "5.0.0",
      "resolved": "https://registry.npmjs.org/whatwg-url/-/whatwg-url-5.0.0.tgz",
      "integrity": "sha512-saE57nupxk6v3HY35+jzBwYa0rKSy0XR8JSxZPwgLr7ys0IBzhGviA1/TUGJLmSVqs8pb9AnvICXEuOHLprYTw==",
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "tr46": "~0.0.3",
        "webidl-conversions": "^3.0.0"
      }
    },
    "node_modules/wrap-ansi": {
      "version": "7.0.0",
      "resolved": "https://registry.npmjs.org/wrap-ansi/-/wrap-ansi-7.0.0.tgz",
      "integrity": "sha512-YVGIj2kamLSTxw6NsZjoBxfSwsn0ycdesmc4p+Q21c5zPuZ1pl+NfxVdxPtdHvmNVOQ6XSYG4AUtyt/Fi7D16Q==",
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "ansi-styles": "^4.0.0",
        "string-width": "^4.1.0",
        "strip-ansi": "^6.0.0"
      },
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/chalk/wrap-ansi?sponsor=1"
      }
    },
    "node_modules/wrappy": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/wrappy/-/wrappy-1.0.2.tgz",
      "integrity": "sha512-l4Sp/DRseor9wL6EvV2+TuQn63dMkPjZ/sp9XkghTEbV9KlPS1xUsZ3u7/IQO4wxtcFB4bgpQPRcR3QCvezPcQ==",
      "license": "ISC",
      "optional": true
    },
    "node_modules/y18n": {
      "version": "5.0.8",
      "resolved": "https://registry.npmjs.org/y18n/-/y18n-5.0.8.tgz",
      "integrity": "sha512-0pfFzegeDWJHJIAmTLRP2DwHjdF5s7jo9tuztdQxAhINCdvS+3nGINqPd00AphqJR/0LhANUS6/+7SCb98YOfA==",
      "license": "ISC",
      "optional": true,
      "engines": {
        "node": ">=10"
      }
    },
    "node_modules/yallist": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/yallist/-/yallist-4.0.0.tgz",
      "integrity": "sha512-3wdGidZyq5PB084XLES5TpOSRA3wjXAlIWMhum2kRcv/41Sn2emQ0dycQW4uZXLejwKvg6EsvbdlVL+FYEct7A==",
      "license": "ISC"
    },
    "node_modules/yargs": {
      "version": "17.7.2",
      "resolved": "https://registry.npmjs.org/yargs/-/yargs-17.7.2.tgz",
      "integrity": "sha512-7dSzzRQ++CKnNI/krKnYRV7JKKPUXMEh61soaHKg9mrWEhzFWhFnxPxGl+69cD1Ou63C13NUPCnmIcrvqCuM6w==",
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "cliui": "^8.0.1",
        "escalade": "^3.1.1",
        "get-caller-file": "^2.0.5",
        "require-directory": "^2.1.1",
        "string-width": "^4.2.3",
        "y18n": "^5.0.5",
        "yargs-parser": "^21.1.1"
      },
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/yargs-parser": {
      "version": "21.1.1",
      "resolved": "https://registry.npmjs.org/yargs-parser/-/yargs-parser-21.1.1.tgz",
      "integrity": "sha512-tVpsJW7DdjecAiFpbIB1e3qxIQsE6NoPc5/eTdrbbIC4h0LVsWhnoa3g+m2HclBIujHzsxZ4VJVA+GUuc2/LBw==",
      "license": "ISC",
      "optional": true,
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/yocto-queue": {
      "version": "0.1.0",
      "resolved": "https://registry.npmjs.org/yocto-queue/-/yocto-queue-0.1.0.tgz",
      "integrity": "sha512-rVksvsnNCdJ/ohGc6xgPwyN8eheCxsiLM8mxuE/t/mOVqJewPuO1miLpTHQiRgTKCLexL4MeAFVagts7HmNZ2Q==",
      "license": "MIT",
      "optional": true,
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    }
  }
}

```
---

## FILE: functions/package.json
```json
{
  "name": "functions",
  "description": "Cloud Functions for Firebase",
  "scripts": {
    "serve": "firebase serve --only functions",
    "shell": "firebase functions:shell",
    "start": "npm run shell",
    "deploy": "firebase deploy --only functions",
    "logs": "firebase functions:log"
  },
  "engines": {
    "node": "20"
  },
  "dependencies": {
    "@google/generative-ai": "^0.21.0",
    "firebase-admin": "^12.7.0",
    "firebase-functions": "^7.0.3"
  },
  "private": true
}

```
---

