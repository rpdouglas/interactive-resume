# FRESH NEST: CODEBASE DUMP
**Date:** Mon Jan 26 02:55:09 UTC 2026
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

**Current Phase:** Phase 17 - The Application Manager (Job Matcher)
**Version:** v2.2.0-beta
**Status:** 🛠️ Active Development

## 🎯 Current Objectives
* [ ] Sprint 17.1: The Job Input Interface (Admin UI).
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

