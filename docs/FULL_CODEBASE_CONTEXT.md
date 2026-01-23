# FRESH NEST: CODEBASE DUMP
**Date:** Fri Jan 23 00:35:13 EST 2026
**Description:** Complete codebase context.

## FILE: package.json
```json
{
  "name": "interactive-resume",
  "private": true,
  "version": "0.11.0",
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
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "recharts": "^3.7.0",
    "tailwind-merge": "^3.4.0"
  },
  "devDependencies": {
    "@eslint/js": "^9.39.1",
    "@testing-library/dom": "^10.4.1",
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

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  define: {
    // This exposes the version from package.json as a global variable
    'import.meta.env.PACKAGE_VERSION': JSON.stringify(packageJson.version),
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    css: true,
  },
})

```
---

## FILE: firebase.json
```json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
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

## FILE: src/App.css
```css
#root {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.react:hover {
  filter: drop-shadow(0 0 2em #61dafbaa);
}

@keyframes logo-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: no-preference) {
  a:nth-of-type(2) .logo {
    animation: logo-spin infinite 20s linear;
  }
}

.card {
  padding: 2em;
}

.read-the-docs {
  color: #888;
}

```
---

## FILE: src/App.jsx
```jsx
import React, { useState } from 'react';
import Dashboard from './components/dashboard/Dashboard';
import ExperienceSection from './sections/ExperienceSection';
import Footer from './components/Footer';
import Header from './components/Header';
import { useAnalytics } from './hooks/useAnalytics';

function App() {
  // 📊 Initialize Analytics
  useAnalytics();

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

      {/* 🧭 Sticky Navigation */}
      <Header />

      <main id="main-content" className="pt-20"> {/* pt-20 to offset fixed header */}
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

```
---

## FILE: src/assets/react.svg
```svg
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--logos" width="35.93" height="32" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 228"><path fill="#00D8FF" d="M210.483 73.824a171.49 171.49 0 0 0-8.24-2.597c.465-1.9.893-3.777 1.273-5.621c6.238-30.281 2.16-54.676-11.769-62.708c-13.355-7.7-35.196.329-57.254 19.526a171.23 171.23 0 0 0-6.375 5.848a155.866 155.866 0 0 0-4.241-3.917C100.759 3.829 77.587-4.822 63.673 3.233C50.33 10.957 46.379 33.89 51.995 62.588a170.974 170.974 0 0 0 1.892 8.48c-3.28.932-6.445 1.924-9.474 2.98C17.309 83.498 0 98.307 0 113.668c0 15.865 18.582 31.778 46.812 41.427a145.52 145.52 0 0 0 6.921 2.165a167.467 167.467 0 0 0-2.01 9.138c-5.354 28.2-1.173 50.591 12.134 58.266c13.744 7.926 36.812-.22 59.273-19.855a145.567 145.567 0 0 0 5.342-4.923a168.064 168.064 0 0 0 6.92 6.314c21.758 18.722 43.246 26.282 56.54 18.586c13.731-7.949 18.194-32.003 12.4-61.268a145.016 145.016 0 0 0-1.535-6.842c1.62-.48 3.21-.974 4.76-1.488c29.348-9.723 48.443-25.443 48.443-41.52c0-15.417-17.868-30.326-45.517-39.844Zm-6.365 70.984c-1.4.463-2.836.91-4.3 1.345c-3.24-10.257-7.612-21.163-12.963-32.432c5.106-11 9.31-21.767 12.459-31.957c2.619.758 5.16 1.557 7.61 2.4c23.69 8.156 38.14 20.213 38.14 29.504c0 9.896-15.606 22.743-40.946 31.14Zm-10.514 20.834c2.562 12.94 2.927 24.64 1.23 33.787c-1.524 8.219-4.59 13.698-8.382 15.893c-8.067 4.67-25.32-1.4-43.927-17.412a156.726 156.726 0 0 1-6.437-5.87c7.214-7.889 14.423-17.06 21.459-27.246c12.376-1.098 24.068-2.894 34.671-5.345a134.17 134.17 0 0 1 1.386 6.193ZM87.276 214.515c-7.882 2.783-14.16 2.863-17.955.675c-8.075-4.657-11.432-22.636-6.853-46.752a156.923 156.923 0 0 1 1.869-8.499c10.486 2.32 22.093 3.988 34.498 4.994c7.084 9.967 14.501 19.128 21.976 27.15a134.668 134.668 0 0 1-4.877 4.492c-9.933 8.682-19.886 14.842-28.658 17.94ZM50.35 144.747c-12.483-4.267-22.792-9.812-29.858-15.863c-6.35-5.437-9.555-10.836-9.555-15.216c0-9.322 13.897-21.212 37.076-29.293c2.813-.98 5.757-1.905 8.812-2.773c3.204 10.42 7.406 21.315 12.477 32.332c-5.137 11.18-9.399 22.249-12.634 32.792a134.718 134.718 0 0 1-6.318-1.979Zm12.378-84.26c-4.811-24.587-1.616-43.134 6.425-47.789c8.564-4.958 27.502 2.111 47.463 19.835a144.318 144.318 0 0 1 3.841 3.545c-7.438 7.987-14.787 17.08-21.808 26.988c-12.04 1.116-23.565 2.908-34.161 5.309a160.342 160.342 0 0 1-1.76-7.887Zm110.427 27.268a347.8 347.8 0 0 0-7.785-12.803c8.168 1.033 15.994 2.404 23.343 4.08c-2.206 7.072-4.956 14.465-8.193 22.045a381.151 381.151 0 0 0-7.365-13.322Zm-45.032-43.861c5.044 5.465 10.096 11.566 15.065 18.186a322.04 322.04 0 0 0-30.257-.006c4.974-6.559 10.069-12.652 15.192-18.18ZM82.802 87.83a323.167 323.167 0 0 0-7.227 13.238c-3.184-7.553-5.909-14.98-8.134-22.152c7.304-1.634 15.093-2.97 23.209-3.984a321.524 321.524 0 0 0-7.848 12.897Zm8.081 65.352c-8.385-.936-16.291-2.203-23.593-3.793c2.26-7.3 5.045-14.885 8.298-22.6a321.187 321.187 0 0 0 7.257 13.246c2.594 4.48 5.28 8.868 8.038 13.147Zm37.542 31.03c-5.184-5.592-10.354-11.779-15.403-18.433c4.902.192 9.899.29 14.978.29c5.218 0 10.376-.117 15.453-.343c-4.985 6.774-10.018 12.97-15.028 18.486Zm52.198-57.817c3.422 7.8 6.306 15.345 8.596 22.52c-7.422 1.694-15.436 3.058-23.88 4.071a382.417 382.417 0 0 0 7.859-13.026a347.403 347.403 0 0 0 7.425-13.565Zm-16.898 8.101a358.557 358.557 0 0 1-12.281 19.815a329.4 329.4 0 0 1-23.444.823c-7.967 0-15.716-.248-23.178-.732a310.202 310.202 0 0 1-12.513-19.846h.001a307.41 307.41 0 0 1-10.923-20.627a310.278 310.278 0 0 1 10.89-20.637l-.001.001a307.318 307.318 0 0 1 12.413-19.761c7.613-.576 15.42-.876 23.31-.876H128c7.926 0 15.743.303 23.354.883a329.357 329.357 0 0 1 12.335 19.695a358.489 358.489 0 0 1 11.036 20.54a329.472 329.472 0 0 1-11 20.722Zm22.56-122.124c8.572 4.944 11.906 24.881 6.52 51.026c-.344 1.668-.73 3.367-1.15 5.09c-10.622-2.452-22.155-4.275-34.23-5.408c-7.034-10.017-14.323-19.124-21.64-27.008a160.789 160.789 0 0 1 5.888-5.4c18.9-16.447 36.564-22.941 44.612-18.3ZM128 90.808c12.625 0 22.86 10.235 22.86 22.86s-10.235 22.86-22.86 22.86s-22.86-10.235-22.86-22.86s10.235-22.86 22.86-22.86Z"></path></svg>
```
---

## FILE: src/components/Footer.jsx
```jsx
import React from 'react';

const Footer = () => {
  // Access the variable we defined in vite.config.js
  // The '||' provides a fallback for local dev if the env var isn't ready
  const version = import.meta.env.PACKAGE_VERSION || 'v0.0.0';

  return (
    <footer className="py-8 bg-slate-950 border-t border-slate-900 text-center mt-20 print:bg-white print:border-t-2 print:border-gray-200 print:mt-10 print:py-4">
      <p className="text-slate-500 text-sm print:text-gray-600">
        &copy; {new Date().getFullYear()} Ryan Douglas. 
        <span className="hidden print:inline"> - ryandouglas-resume.web.app</span>
      </p>
      
      {/* 🖨️ PRINT: Hide the system version blob, it's irrelevant on paper */}
      <div className="mt-2 text-xs font-mono text-slate-700 flex justify-center items-center gap-2 print:hidden">
        <span className="w-2 h-2 rounded-full bg-green-500/50"></span>
        <span>System Version: v{version}</span>
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
import { Menu, X, Linkedin, Github, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Detect scroll for glass effect intensity
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Dashboard', href: '#dashboard' },
    { name: 'Experience', href: '#experience' },
  ];

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      // If href is #dashboard (top), scroll window to 0
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
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
          {/* Logo / Name */}
          <a 
            href="#" 
            onClick={(e) => handleNavClick(e, '#dashboard')}
            className="text-xl font-bold text-white tracking-tight flex items-center gap-2"
          >
            <span className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-mono">RD</span>
            <span className={isScrolled ? 'opacity-100' : 'opacity-90'}>Ryan Douglas</span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <a 
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-sm font-medium text-slate-300 hover:text-white hover:underline decoration-blue-500 decoration-2 underline-offset-4 transition-all"
              >
                {link.name}
              </a>
            ))}
            
            <div className="h-4 w-px bg-slate-700 mx-2" />
            
            {/* Social Icons */}
            <div className="flex items-center gap-4">
              <a href="https://linkedin.com/in/ryandouglas" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-400 transition-colors" aria-label="LinkedIn">
                <Linkedin size={18} />
              </a>
              <a href="https://github.com/rpdouglas" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors" aria-label="GitHub">
                <Github size={18} />
              </a>
              <a href="mailto:rpdouglas@gmail.com" className="text-slate-400 hover:text-emerald-400 transition-colors" aria-label="Email">
                <Mail size={18} />
              </a>
            </div>
          </nav>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-slate-300 hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-slate-900/95 backdrop-blur-xl pt-24 px-6 md:hidden"
          >
            <nav className="flex flex-col gap-6 text-center">
              {navLinks.map(link => (
                <a 
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="text-2xl font-bold text-slate-200 hover:text-blue-400"
                >
                  {link.name}
                </a>
              ))}
              <div className="flex justify-center gap-8 mt-8">
                 <a href="https://linkedin.com/in/ryandouglas" className="text-slate-400 hover:text-blue-400"><Linkedin size={28} /></a>
                 <a href="https://github.com/rpdouglas" className="text-slate-400 hover:text-white"><Github size={28} /></a>
                 <a href="mailto:rpdouglas@gmail.com" className="text-slate-400 hover:text-emerald-400"><Mail size={28} /></a>
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
import { describe, it, expect } from 'vitest';
import Footer from '../Footer';

describe('Footer Component', () => {
  it('renders the correct copyright year', () => {
    render(<Footer />);
    const currentYear = new Date().getFullYear().toString();
    
    // Use regex to find the year anywhere in the text
    expect(screen.getByText(new RegExp(currentYear))).toBeDefined();
  });

  it('renders the System Version indicator', () => {
    render(<Footer />);
    
    // We look for the specific label "System Version: v"
    // This confirms the Footer is attempting to display version data
    expect(screen.getByText(/System Version: v/i)).toBeDefined();
  });

  it('renders the build status', () => {
    render(<Footer />);
    // Just ensuring the structure is consistent
    expect(screen.getByText(/Ryan Douglas/i)).toBeDefined();
  });
});

```
---

## FILE: src/components/__tests__/Header.test.jsx
```jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Header from '../Header';

describe('Header Component', () => {
  it('renders the logo name', () => {
    render(<Header />);
    expect(screen.getByText(/Ryan Douglas/i)).toBeDefined();
  });

  it('renders desktop navigation links', () => {
    render(<Header />);
    expect(screen.getByText('Dashboard')).toBeDefined();
    expect(screen.getByText('Experience')).toBeDefined();
  });

  it('toggles mobile menu when hamburger is clicked', () => {
    render(<Header />);
    
    // Initially mobile menu is hidden (we can't easily check visibility without styles, 
    // but we can check if the button exists and is clickable)
    const toggleBtn = screen.getByLabelText('Toggle Menu');
    expect(toggleBtn).toBeDefined();

    // Click it
    fireEvent.click(toggleBtn);

    // Now the mobile nav links should be in the DOM
    // (In a real browser, they might be hidden by CSS, but in JSDOM they exist)
    const mobileLinks = screen.getAllByText('Dashboard');
    expect(mobileLinks.length).toBeGreaterThan(1); // One desktop, one mobile
  });
});

```
---

## FILE: src/components/dashboard/Dashboard.jsx
```jsx
import React from 'react';
import KPIGrid from './KPIGrid';
import SkillRadar from './SkillRadar';
import profileData from '../../data/profile.json';
import skillsData from '../../data/skills.json';
import { useTypewriter } from '../../hooks/useTypewriter';
import { logUserInteraction } from '../../hooks/useAnalytics';

const Dashboard = ({ onSkillClick }) => {
  // ⌨️ Typewriter Effect
  const typeWriterText = useTypewriter([
    "Management Consultant",
    "Power BI Developer",
    "Data & Analytics Leader",
    "Strategy Advisor"
  ]);

  // 🕵️‍♂️ Intercept click to log analytics
  const handleChartInteraction = (skill) => {
    logUserInteraction('filter_skill', { skill_name: skill });
    onSkillClick(skill);
  };

  return (
    <section id="dashboard" className="w-full max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8 text-center md:text-left">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
          {profileData.basics.name}
        </h1>
        
        {/* Dynamic Hero Text */}
        <p className="text-xl text-blue-600 mt-2 font-mono h-8">
          {typeWriterText}
          <span className="animate-pulse">|</span>
        </p>
        
        <p className="text-slate-400 mt-2 max-w-2xl text-sm md:text-base">
          {profileData.basics.summary}
        </p>
      </div>

      <KPIGrid metrics={profileData.metrics} />

      {/* Pass the wrapped click handler down to the chart */}
      <SkillRadar skills={skillsData} onSkillClick={handleChartInteraction} />
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
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {skills.map((category, idx) => (
        <motion.div
          key={category.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 + (idx * 0.1) }}
          className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center"
        >
          <h3 className="text-lg font-bold text-slate-700 mb-4">{category.label}</h3>
          <p className="text-xs text-slate-400 mb-2 italic">Click a skill label to filter experience</p>
          
          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={category.data}>
                <PolarGrid stroke="#e2e8f0" />
                
                {/* 🎯 INTERACTIVITY LAYER
                   We add onClick to the Axis so users can tap "React" 
                   cursor-pointer makes it obvious it's clickable
                */}
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

## FILE: src/components/timeline/TimelineCard.jsx
```jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Briefcase } from 'lucide-react';
import clsx from 'clsx';

const TimelineCard = ({ data, index, activeFilter }) => {
  const [isOpen, setIsOpen] = useState(false);

  // 🧠 Smart Auto-Expand Logic
  useEffect(() => {
    if (!activeFilter) {
      setIsOpen(false);
      return;
    }

    // Check if any project inside this job matches the filter
    const hasMatchingProject = data.projects.some(proj => 
      proj.skills.some(skill => 
        skill.toLowerCase().includes(activeFilter.toLowerCase())
      )
    );

    if (hasMatchingProject) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [activeFilter, data.projects]);

  return (
    <div className="relative pl-8 md:pl-12 py-6 group">
      {/* 🟢 The Node (Dot on the Spine) */}
      <motion.div 
        layout
        className="absolute left-[-5px] top-8 w-4 h-4 rounded-full bg-blue-500 border-4 border-slate-900 shadow-[0_0_10px_rgba(59,130,246,0.5)] z-10 group-hover:scale-125 transition-transform duration-300"
        aria-hidden="true"
      />

      {/* 📄 The Job Wrapper Card */}
      <motion.div 
        layout
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-slate-800/50 rounded-xl border border-slate-700 hover:border-blue-500/50 transition-colors shadow-lg overflow-hidden"
      >
        {/* Header (Always Visible) */}
        <div 
          className="p-6 cursor-pointer hover:bg-slate-800/80 transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                {data.role}
              </h3>
              <span className="text-blue-400 font-medium text-sm">{data.company}</span>
            </div>
            <div className="flex items-center gap-4 mt-1 sm:mt-0">
              <span className="text-slate-400 text-sm font-mono">{data.date}</span>
              {isOpen ? <ChevronUp size={18} className="text-slate-500" /> : <ChevronDown size={18} className="text-slate-500" />}
            </div>
          </div>
          
          <p className="text-slate-300 text-sm mt-2">{data.summary}</p>
          
          {/* Top Level Job Skills */}
          <div className="flex flex-wrap gap-2 mt-3">
             {data.skills.map(skill => (
                <span key={skill} className="text-[10px] uppercase tracking-wider text-slate-500 bg-slate-900 px-2 py-0.5 rounded">
                  {skill}
                </span>
             ))}
          </div>
        </div>

        {/* 📂 The Projects Accordion */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="border-t border-slate-700 bg-slate-900/30"
            >
              <div className="p-4 space-y-4">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 pl-2">Key Projects & Engagements</h4>
                
                {data.projects.map(project => {
                  // Highlight project if it matches filter
                  const isMatch = activeFilter && project.skills.some(s => s.toLowerCase().includes(activeFilter.toLowerCase()));

                  return (
                    <div 
                      key={project.id} 
                      className={clsx(
                        "p-4 rounded-lg border transition-all duration-300",
                        isMatch ? "bg-blue-900/20 border-blue-500/50" : "bg-slate-900 border-slate-800"
                      )}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h5 className={clsx("font-bold text-sm", isMatch ? "text-blue-300" : "text-slate-200")}>
                          {project.title}
                        </h5>
                      </div>

                      {/* PAR Framework */}
                      <div className="space-y-2 text-xs text-slate-400 mb-3">
                        <p><strong className="text-blue-400">Problem:</strong> {project.par.problem}</p>
                        <p><strong className="text-emerald-400">Action:</strong> {project.par.action}</p>
                        <p><strong className="text-purple-400">Result:</strong> {project.par.result}</p>
                      </div>

                      {/* Project Specific Skills */}
                      <div className="flex flex-wrap gap-2">
                        {project.skills.map(skill => {
                          const isSkillMatch = activeFilter && skill.toLowerCase().includes(activeFilter.toLowerCase());
                          return (
                            <span 
                              key={skill} 
                              className={clsx(
                                "px-2 py-1 text-[10px] rounded-md border",
                                isSkillMatch 
                                  ? "bg-blue-600 text-white border-blue-500" 
                                  : "bg-slate-800 text-slate-500 border-slate-700"
                              )}
                            >
                              {skill}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
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

## FILE: src/lib/firebase.js
```js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Use environment variables (Vite requires VITE_ prefix)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics (only in production/browser)
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export { app, analytics };

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

## FILE: src/sections/ExperienceSection.jsx
```jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X } from 'lucide-react';
import TimelineContainer from '../components/timeline/TimelineContainer';
import experienceData from '../data/experience.json';

const ExperienceSection = ({ activeFilter, onClear }) => {
  
  // 🔍 Deep Filtering Logic
  // We want to show a Job Card if:
  // 1. The Job's top-level skills match (generic role match)
  // 2. OR Any of the Job's Projects have a matching skill (specific project match)
  const filteredData = activeFilter 
    ? experienceData.filter(job => {
        const jobMatch = job.skills.some(skill => 
          skill.toLowerCase().includes(activeFilter.toLowerCase())
        );
        
        const projectMatch = job.projects.some(proj => 
          proj.skills.some(skill => 
            skill.toLowerCase().includes(activeFilter.toLowerCase())
          )
        );

        return jobMatch || projectMatch;
      })
    : experienceData;

  return (
    <section id="experience" className="py-20 bg-slate-900 relative overflow-hidden min-h-[600px] print:bg-white print:text-black print:py-0">
      <div className="container mx-auto px-4">
        
        {/* Header with Filter State */}
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
                  Explore 15 years of consulting and development impact. <br/>
                  <span className="text-xs text-slate-500">Click a Job to view Projects, or use the Radar Chart to filter.</span>
                </motion.p>
              )}
            </AnimatePresence>
          </div>
          
          <p className="hidden print:block text-sm text-gray-600 mt-2">
             Detailed project history.
          </p>
        </div>

        {/* The Filtered Timeline */}
        {/* We pass activeFilter so cards can Auto-Expand */}
        <TimelineContainer experienceData={filteredData} activeFilter={activeFilter} />
        
        {/* Empty State */}
        {filteredData.length === 0 && (
          <div className="text-center text-slate-500 mt-12 italic">
            No specific roles found matching "{activeFilter}" (Check skills list).
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
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ExperienceSection from '../ExperienceSection';

// 1. Mock Framer Motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, ...props }) => <div className={className} {...props}>{children}</div>,
    p: ({ children, className }) => <p className={className}>{children}</p>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

// 2. Mock Child Components
vi.mock('../../components/timeline/TimelineContainer', () => ({
  default: ({ experienceData }) => (
    <div data-testid="timeline-container">
      Count: {experienceData.length}
      <ul>
        {experienceData.map(job => <li key={job.id}>{job.role}</li>)}
      </ul>
    </div>
  ),
}));

// 3. Mock Data Source (UPDATED SCHEMA)
vi.mock('../../data/experience.json', () => ({
  default: [
    { 
      id: '1', 
      role: 'React Dev', 
      skills: ['React'], 
      projects: [
        { id: 'p1', title: 'Web App', skills: ['React', 'Redux'], par: {problem:'', action:'', result:''} }
      ] 
    },
    { 
      id: '2', 
      role: 'Power BI Analyst', 
      skills: ['Analysis'], 
      projects: [
        { id: 'p2', title: 'Dashboard', skills: ['Power BI', 'SQL'], par: {problem:'', action:'', result:''} }
      ] 
    },
    { 
      id: '3', 
      role: 'Full Stack', 
      skills: ['Node'], 
      projects: [
        { id: 'p3', title: 'API', skills: ['Node', 'React'], par: {problem:'', action:'', result:''} }
      ] 
    },
  ]
}));

describe('ExperienceSection (Nested Matrix Filter)', () => {
  
  it('shows ALL jobs when no filter is active', () => {
    render(<ExperienceSection activeFilter={null} />);
    expect(screen.getByText('Count: 3')).toBeDefined();
  });

  it('filters jobs correctly (Deep Search)', () => {
    // Filter by "React"
    // Job 1 matches (Top skill + Project skill)
    // Job 2 has NO React
    // Job 3 matches (Project skill)
    render(<ExperienceSection activeFilter="React" />);
    
    expect(screen.getByText('Count: 2')).toBeDefined();
    expect(screen.getByText('React Dev')).toBeDefined();
    expect(screen.getByText('Full Stack')).toBeDefined();
    expect(screen.queryByText('Power BI Analyst')).toBeNull();
  });

  it('displays the Active Filter label', () => {
    render(<ExperienceSection activeFilter="Power BI" />);
    const filterPills = screen.getAllByText('Power BI');
    expect(filterPills.length).toBeGreaterThan(0);
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
vi.mock('../data/experience.json', () => ({ default: [] }));

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

// Runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
});

```
---

## FILE: docs/AI_WORKFLOW.md
```md
# 🤖 AI Development Framework

This project follows a strict **Multi-Persona AI Workflow**. The AI Assistant must adopt a specific "Hat" depending on the phase of the SDLC.

## 1. The Architect ("The Thinker")
* **Trigger:** `docs/PROMPT_FEATURE_REQUEST.md`
* **Goal:** Analyze requirements, propose 3 options, and manage trade-offs.
* **Output:** Analysis & Options Table.
* **Behavior:** Creative, skeptical of "easy" answers, focused on UX & Engineering Strategy.
* **Forbidden:** Writing production code (Scaffolding only).

## 2. The Builder ("The Doer")
* **Trigger:** `docs/PROMPT_APPROVAL.md`
* **Goal:** Execute the chosen Architectural Option with precision.
* **Output:** `install_feature.sh` (Bash) or `App.jsx` (React).
* **Behavior:** Compliant, strict, type-safe, focused on "One-Shot" execution.
* **Key Constraint:** Must generate executable scripts (Bash/Python) to minimize manual copy-pasting.

## 3. The Maintainer ("The Librarian")
* **Trigger:** `docs/PROMPT_POST_FEATURE.md`
* **Goal:** Synchronize documentation with reality.
* **Output:** `update_docs.py` (Python).
* **Behavior:** Detail-oriented, consistent, focused on longevity and history.
* **Key Constraint:** Uses Python for text processing to avoid syntax errors.

---

## 🔄 The Loop
1.  **Architect** designs the feature.
2.  **Builder** implements the feature.
3.  **Maintainer** updates the records.

## 4. The Tester ("The Skeptic")
* **Trigger:** \`docs/PROMPT_TESTING.md\`
* **Goal:** Verify logic and prevent regressions.
* **Output:** \`src/__tests__/*.test.jsx\`
* **Behavior:** Paranoid, pedantic, focused on edge cases (e.g., "What if data is empty?").
* **Key Constraint:** Must use \`@testing-library/react\` principles (test behavior, not implementation).

```
---

## FILE: docs/CHANGELOG.md
```md
# 📜 Changelog

## [v0.11.0] - 2026-01-23
### Added
* **Insights & Immersion (Phase 10):**
    * **Sticky Header:** Glassmorphic navigation bar for better long-page UX.
    * **Dynamic Hero:** Typewriter effect cycling through professional titles.
    * **Google Analytics 4:** Custom event tracking for Skill Filtering.
    * **Custom Hooks:** `useTypewriter` and `useAnalytics` for clean logic separation.

## [v0.10.0] - 2026-01-23
### Changed
* **Architecture Refactor:** Nested Project Portfolio (Job -> Projects).

## [v0.9.0] - 2026-01-22
### Added
* **Content Injection:** Real career data from PDFs.
```
---

## FILE: docs/CONTEXT_DUMP.md
```md
# Interactive Resume: Context Dump
**Stack:** React + Vite + Tailwind CSS (v4) + Framer Motion + Recharts + Firebase Analytics
**Test Stack:** Vitest + React Testing Library
**Version:** v0.11.0

## Architecture Rules (STRICT)
1. **SSOT:** Version is controlled by `package.json`.
2. **Hooks:** Logic must be extracted to `src/hooks/*.js` (e.g., `useAnalytics`, `useTypewriter`).
3. **Analytics:** User interactions (clicks/filters) must be logged via `logUserInteraction`.
```
---

## FILE: docs/DEPLOYMENT.md
```md
# ☁️ Deployment & Infrastructure Manual

## 1. The Pipeline
We use a **GitHub Actions** workflow to automate deployments to Firebase Hosting.

| Environment | Trigger | URL | Status |
| :--- | :--- | :--- | :--- |
| **Production** | Push to `main` | `ryandouglas-resume.web.app` | Live |
| **Preview** | Open Pull Request | (Generated in PR Comment) | Ephemeral |

## 2. Secrets Management
* `FIREBASE_SERVICE_ACCOUNT`
* `FIREBASE_PROJECT_ID`
* `VITE_*` (Env Vars)

## 3. Manual Deployment
```bash
npm run build
npx firebase deploy
```
```
---

## FILE: docs/PERSONAS.md
```md
# 👥 Target Audience & UX Constraints

> **Goal:** Convince three distinct types of viewers to book an interview.

---

### 1. "The Skimmer" (Technical Recruiter)
* **Goal:** Match keywords to a Job Description in < 10 seconds.
* **Behavior:** Opens link, scans for "Power BI", "React", "15 Years", then leaves.
* **Constraint:** **The "Above the Fold" Dashboard.**
    * *Rule:* Key metrics (Years Exp, Top Skills) must be visible immediately without scrolling.
    * *Rule:* No "Enter Site" loading screens. Instant access.

### 2. "The Narrator" (Hiring Manager / Director)
* **Goal:** Understand the *context* of your career. "Why did he move from Dev to Consulting?"
* **Behavior:** Scrolls down. Reads the bullet points. Looks for business impact.
* **Constraint:** **The PAR Timeline.**
    * *Rule:* Experience must be framed as Problem/Action/Result.
    * *Rule:* "Click to expand" interaction to keep the initial view clean.

### 3. "The Skeptic" (Lead Developer / CTO)
* **Goal:** Verify technical competence. "Is this a template or did he build it?"
* **Behavior:** Inspects Element. Looks at the source code. Tests the interactivity.
* **Constraint:** **The "Live" Matrix.**
    * *Rule:* Clicking "React" should filter the entire timeline. This proves state management expertise.
    * *Rule:* Code must be clean, typed, and commented.

---

### 4. "The Mobile User" (LinkedIn Traffic)
* **Context:** 60% of traffic will come from the LinkedIn mobile app browser.
* **Constraint:** **Thumb-Friendly UI.**
    * *Rule:* Charts must be readable vertically.
    * *Rule:* No hover-only tooltips (must be click/tap accessible).

```
---

## FILE: docs/PROJECT_STATUS.md
```md
# 📌 Project Status: Interactive Resume

**Current Phase:** Phase 10 - Insights & Immersion
**Version:** v0.11.0

## 🎯 Current Sprint: v1.0.0 Gold Master Prep
* [x] **Polish:** Sticky Header & Typewriter Hero.
* [x] **Insights:** Google Analytics 4 Integration.
* [ ] **Final Build:** Production build verification.
* [ ] **Launch:** Tag v1.0.0 and deploy to Production.

## ✅ Completed Features
* **Phase 10: Polish** (UX & Analytics vv0.11.0)
    * [x] Implemented `useAnalytics` for custom event tracking.
    * [x] Created `useTypewriter` custom hook for Hero section.
    * [x] Built Glassmorphic Sticky Header.
* **Phase 9: Project Portfolio** (Nested Architecture)
* **Phase 8: Content Injection** (Real Data)
* **Phase 7: Universal Access** (A11y & Print)

## 📋 Product Backlog
* v1.0.0 Release (Gold Master)
```
---

## FILE: docs/PROMPT_APPROVAL.md
```md
# ✅ AI Approval & Execution Prompt (Builder Mode)

**Instructions:**
Use this prompt **after** the AI has presented the 3 Architectural Options. This signals approval for a specific approach and triggers code generation.

---

### **Prompt Template**

**Decision:** I approve **Option [INSERT OPTION NUMBER]: [INSERT OPTION NAME]**. Proceed with implementation.

**Strict Technical Constraints (The "Builder" Standard):**
1.  **Execution First:** Output a single **Bash Script** (`install_feature.sh`) that:
    * Creates/Updates all necessary files.
    * Installs any missing dependencies (`npm install ...`).
    * Uses `cat << 'EOF'` patterns to write file contents safely.
2.  **Code Quality:**
    * **NO Placeholders:** Never use `// ... rest of code`.
    * **Type Safety:** Use PropType checks or clean Interface definitions.
    * **Comments:** Include JSDoc comments explaining *complex* logic (e.g., the Radar chart coordinate math).
3.  **Responsiveness:**
    * **Mobile Parity:** If a chart is too wide for mobile, provide a fallback or a responsive container logic.
    * **Tailwind:** Use `clsx` and `tailwind-merge` for dynamic classes.

**Persona Validation (The "Self-Correction" Step):**
Before generating the script, verify the code against our Personas:
* **The Skimmer:** Is the data visible immediately? (No artificial delays > 0.5s).
* **The Mobile User:** Will this overflow horizontally on a 375px screen?
* **The Skeptic:** Are we using crisp SVGs (Recharts)?

**Output Requirements:**

1.  **The "One-Shot" Installer:**
    * A single bash script block.
    * *Note:* Escape special characters (`$`) correctly for bash.

2.  **Manual Verification Steps:**
    * A brief bulleted list of what I should see when I run `npm run dev` after installing.

*Please generate the installation script now.*


```
---

## FILE: docs/PROMPT_FEATURE_REQUEST.md
```md
# 📝 AI Feature Request Prompt (Architect Mode)

**Instructions:**
1.  Copy your current codebase context.
2.  Fill in the feature details in the bracketed sections `[ ... ]`.
3.  Send the *entire* text below to the AI.

---

### **Prompt Template**

**Role:** You are the Senior Lead Developer & UI Architect for my Interactive Resume.
**Task:** Analyze the requirements for a new feature and propose architectural solutions.

**Feature Request:** [INSERT FEATURE NAME]

**Context:**
I need to add a module that [DESCRIBE FUNCTION].
*Current State:* [Briefly describe relevant existing code.]

**Core Requirements:**

1.  **👥 The Persona Check:**
    * **The Skimmer:** Does this convey value in < 5 seconds?
    * **The Mobile User:** Is the touch-target size appropriate (44px+)? Does it reflow without scrolling?
    * **The Skeptic:** Is the implementation clean, typed, and performant?

2.  **Constraints & Tech Strategy:**
    * **HTML5 Canvas vs. SVG:** Use the best tool for the job.
        * *SVG (Recharts):* Preferred for standard charts where text crispness and accessibility are priority.
        * *HTML5 Canvas (Three.js/WebGL):* Encouraged for high-performance animations, particle effects, or 3D elements.
    * **Data Separation:** No hardcoded text; use `src/data/*.json`.
    * **Responsiveness:** Mobile-first architecture.

**🛑 STOP & THINK: Architectural Options**
Do **NOT** write code yet. Instead, analyze the request and propose **3 Distinct Approaches**:

1.  **The "High-Impact" Approach:** Prioritizes visual "wow" factor (often uses Canvas/WebGL).
2.  **The "Performance" Approach:** Prioritizes Lighthouse scores, accessibility, and lightweight DOM.
3.  **The "Balanced" Approach:** The sweet spot between visual appeal and engineering rigor.

**Your Output Deliverable:**
1.  **Analysis:** A brief breakdown of the UX challenges for this specific feature.
2.  **The Options Table:** Compare the 3 approaches based on:
    * *Tech Stack / Libraries needed*
    * *Complexity (Low/Med/High)*
    * *Pros & Cons*
3.  **Recommendation:** Select one approach and explain *why* it fits the "Medium is the Message" philosophy best.
4.  **Wait:** End your response by asking for approval to proceed.

---

**Codebase Context:**
[PASTE_CODEBASE_HERE]

```
---

## FILE: docs/PROMPT_INITIALIZATION.md
```md
# 🤖 AI Session Initialization Prompt

**Instructions:**
1.  Run a script (or copy manually) to grab the `src/` folder context.
2.  Paste the **Codebase Context** into the bottom of this prompt.
3.  Send the *entire* block below to your AI assistant.

---

**Role:** You are the Senior React Developer and UI Architect for the "Interactive Resume" project.

**Input:** I am providing the full codebase context below.

**Your Goal:** Ingest this context to completely understand our:
* **Tech Stack:** React (Vite), Tailwind CSS, Framer Motion, Recharts.
* **Methodology:** "The Medium is the Message." The code must be clean, performant, and demonstrate senior-level capability.
* **Structure:** Data is strictly separated in `src/data/*.json`. Components are functional and concise.

**Critical Rules for Interaction:**
1.  **NO Placeholders:** Never use `// ... rest of code`. Provide **COMPLETE FILES**.
2.  **No Canvas (Default):** Use DOM/SVG for interactions unless explicitly asked for 3D/WebGl.
3.  **Comments:** Every major code block must include a descriptive comment (per user preference).
4.  **Responsive:** Mobile-first checks are mandatory.

**Codebase Context:**
[PASTE_FULL_CODEBASE_CONTEXT_HERE]

**Reply "Context Received. Ready to build." if you understand.**

```
---

## FILE: docs/PROMPT_POST_FEATURE.md
```md
# 📝 AI Documentation Audit Prompt (The Maintainer)

**Instructions:**
Use this prompt **IMMEDIATELY AFTER** a feature is successfully deployed and verified in Production.

---

### **Prompt Template**

**Role:** You are the Lead Technical Writer and Open Source Maintainer for this project.
**Task:** Perform a comprehensive documentation audit and synchronization.

**Trigger:** We have just completed and deployed the feature: **[INSERT FEATURE NAME]**.

**Current Context:**
* The code is live.
* The tests (or manual checks) have passed.
* I need to close this sprint and prepare the repo for the next phase.

**Your Goal:** Generate a **Python Script** (`update_docs_audit.py`) that updates the following files to reflect the new state of the application:

1.  **`docs/PROJECT_STATUS.md`**:
    * Mark the current feature as `[x] Completed`.
    * Update the "Current Phase" and "Version" if applicable.
    * Select the next logical item from the Backlog to be the "Current Sprint".

2.  **`docs/CHANGELOG.md`**:
    * Add a new entry under the current version.
    * List key technical changes (e.g., "Added Recharts", "Configured CI/CD").

3.  **`docs/CONTEXT_DUMP.md`**:
    * Update the "Stack" if new libraries were added.
    * Update the "Architecture Rules" if we established new patterns (e.g., "Use Python for text generation").

4.  **`README.md` (Root)**:
    * Ensure badges are correct.
    * Update the "Architecture" diagram if the data flow changed.

**🛑 STOP & THINK: The Consistency Check**
Before writing the script, ask yourself:
* *Did we add new Environment Variables?* If yes, does `docs/DEPLOYMENT.md` need an update?
* *Did we change the project structure?* If yes, does the `CONTEXT_DUMP` file structure section need verification?

**Output Requirement:**
* Provide a single, robust **Python Script** (using the `write_lines` list approach to avoid syntax errors).
* Do NOT use Bash for writing markdown files.

---

**Codebase Context:**
[PASTE RELEVANT DOCS OR FILE LIST IF NEEDED]

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
**Task:** Write a robust Unit Test for the provided component.

**Input:**
* I will provide the component code (e.g., \`KPICard.jsx\`).
* I will provide the relevant data context (e.g., \`profile.json\`).

**Your Goal:** Generate a **Vitest** specification file (\`src/__tests__/ComponentName.test.jsx\`).

**Test Strategy (The "Skeptic" Standard):**
1.  **Happy Path:** Does it render the data correctly?
2.  **Edge Cases:** What happens if the data is missing/null?
3.  **Interaction:** If there is a button, fire a click event and check the result.
4.  **Accessibility:** Does it use semantic HTML (headers, buttons)?

**Output Requirements:**
* **Complete File:** Provide the full \`.test.jsx\` file content.
* **Imports:** Ensure \`render\`, \`screen\`, and \`fireEvent\` are imported from \`@testing-library/react\`.
* **Mocking:** If the component uses external hooks (like \`useRouter\` or complex animations), mock them.

**Example Scenario:**
"If the KPI value is 15, does the screen display '15'? If I pass a custom color, is the class applied?"

**Wait:** Ask me to paste the Component Code to begin.

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
# 💾 Interactive Resume: Data Layer Setup
# ==========================================
# Description: Populates src/data with JSON files for Profile, Skills, and Experience.

DATA_DIR="src/data"

echo "📂 Ensuring $DATA_DIR exists..."
mkdir -p "$DATA_DIR"

# ------------------------------------------
# 1. PROFILE.JSON
# ------------------------------------------
echo "writing $DATA_DIR/profile.json..."
cat << 'EOF' > "$DATA_DIR/profile.json"
{
  "basics": {
    "name": "Your Name",
    "label": "Management Consultant & Power BI Developer",
    "email": "your.email@example.com",
    "phone": "(555) 555-5555",
    "location": "Cornwall, Ontario",
    "summary": "A results-driven Management Consultant with 15 years of experience leading complex business transformation projects. Certified Microsoft Power BI Developer specializing in bridging the gap between strategic business goals and technical data implementations.",
    "website": "https://yourwebsite.com",
    "github": "https://github.com/yourusername",
    "linkedin": "https://linkedin.com/in/yourusername"
  },
  "metrics": {
    "yearsExperience": 15,
    "projectsDelivered": 45,
    "certifications": 2
  }
}
EOF

# ------------------------------------------
# 2. SKILLS.JSON
# ------------------------------------------
echo "writing $DATA_DIR/skills.json..."
cat << 'EOF' > "$DATA_DIR/skills.json"
[
  {
    "id": "strategy",
    "label": "Business Strategy",
    "data": [
      { "subject": "Change Mgmt", "A": 95, "fullMark": 100 },
      { "subject": "Stakeholder Analysis", "A": 90, "fullMark": 100 },
      { "subject": "Process Optimization", "A": 85, "fullMark": 100 },
      { "subject": "System Implementation", "A": 90, "fullMark": 100 },
      { "subject": "TOWS Analysis", "A": 80, "fullMark": 100 }
    ]
  },
  {
    "id": "technical",
    "label": "Technical Stack",
    "data": [
      { "subject": "Power BI", "A": 95, "fullMark": 100 },
      { "subject": "DAX / SQL", "A": 85, "fullMark": 100 },
      { "subject": "React / JS", "A": 75, "fullMark": 100 },
      { "subject": "Zoho Analytics", "A": 80, "fullMark": 100 },
      { "subject": "Data Modeling", "A": 90, "fullMark": 100 }
    ]
  }
]
EOF

# ------------------------------------------
# 3. EXPERIENCE.JSON
# ------------------------------------------
echo "writing $DATA_DIR/experience.json..."
cat << 'EOF' > "$DATA_DIR/experience.json"
[
  {
    "id": "exp-1",
    "role": "Senior Management Consultant",
    "company": "Consulting Firm",
    "period": "2015 - Present",
    "type": "work",
    "skills": ["Business Transformation", "System Implementation", "Change Mgmt"],
    "par": {
      "problem": "Large-scale organizations struggling with inefficient legacy systems and undefined business processes.",
      "action": "Led complex business transformation initiatives, implementing new system architectures and managing stakeholder expectations across multiple departments.",
      "result": "Delivered sustainable operational improvements and successful system migrations for high-value clients."
    }
  },
  {
    "id": "exp-2",
    "role": "Power BI Developer",
    "company": "Freelance / Contract",
    "period": "2022 - Present",
    "type": "work",
    "skills": ["Power BI", "DAX", "Data Visualization"],
    "par": {
      "problem": "Clients possessed vast amounts of data but lacked actionable insights due to poor reporting infrastructure.",
      "action": "Designed and deployed interactive Power BI dashboards, utilizing advanced DAX formulas to calculate custom KPIs.",
      "result": "Enabled data-driven decision-making, reducing reporting time by 40% and identifying key revenue drivers."
    }
  },
  {
    "id": "edu-1",
    "role": "Computer Programmer Graduate",
    "company": "Fanshawe College",
    "period": "2001 - 2003",
    "type": "education",
    "skills": ["Software Development", "Logic", "Foundations"],
    "par": {
      "problem": "N/A",
      "action": "Completed rigorous coursework in computer programming, algorithms, and database management.",
      "result": "Graduated with strong foundational knowledge that bridges the gap between modern consulting and technical execution."
    }
  }
]
EOF

echo "✅ Data Layer Updated Successfully!"
```
---

## FILE: .github/workflows/deploy-preview.yml
```yml
name: Deploy to Preview Channel

on:
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  build_and_preview:
    if: '${{ github.event.pull_request.head.repo.full_name == github.repository }}'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Install Dependencies
        run: npm ci

      - name: Build
        run: npm run build

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

      - name: Build
        run: npm run build

      - name: Deploy to Live
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          projectId: '${{ secrets.FIREBASE_PROJECT_ID }}'
          channelId: live

```
---

