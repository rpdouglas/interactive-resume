#!/bin/bash

# ==========================================
# 🚀 Phase 2: Personal Analytics Dashboard
# ==========================================

echo "Installing Feature Dependencies..."
npm install recharts framer-motion lucide-react clsx tailwind-merge

# Create directory structure
mkdir -p src/components/dashboard

# ==========================================
# 1. KPI CARD COMPONENT (The "Hook")
# ==========================================
echo "Creating src/components/dashboard/KPIGrid.jsx..."
cat << 'EOF' > src/components/dashboard/KPIGrid.jsx
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
EOF

# ==========================================
# 2. SKILL RADAR CHART (The "Dual Threat")
# ==========================================
echo "Creating src/components/dashboard/SkillRadar.jsx..."
cat << 'EOF' > src/components/dashboard/SkillRadar.jsx
import React from 'react';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip
} from 'recharts';
import { motion } from 'framer-motion';

/**
 * Custom Tooltip for the Radar Chart
 */
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

/**
 * Dual-Zone Radar Chart
 * Visualizes the balance between "Strategy" and "Tech"
 */
const SkillRadar = ({ skills }) => {
  // Merge the two categories for a unified view, or switch based on state
  // For the dashboard, we will display two charts side-by-side on desktop
  // or stacked on mobile.

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
          
          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={category.data}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis 
                  dataKey="subject" 
                  tick={{ fill: '#64748b', fontSize: 12 }} 
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
EOF

# ==========================================
# 3. DASHBOARD CONTAINER (The Layout)
# ==========================================
echo "Creating src/components/dashboard/Dashboard.jsx..."
cat << 'EOF' > src/components/dashboard/Dashboard.jsx
import React from 'react';
import KPIGrid from './KPIGrid';
import SkillRadar from './SkillRadar';
import profileData from '../../data/profile.json';
import skillsData from '../../data/skills.json';

const Dashboard = () => {
  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="mb-8 text-center md:text-left">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
          {profileData.basics.name}
        </h1>
        <p className="text-xl text-slate-500 mt-2">
          {profileData.basics.label}
        </p>
        <p className="text-slate-400 mt-1 max-w-2xl text-sm md:text-base">
          {profileData.basics.summary}
        </p>
      </div>

      {/* KPI Cards */}
      <KPIGrid metrics={profileData.metrics} />

      {/* Analytics Section */}
      <SkillRadar skills={skillsData} />
    </section>
  );
};

export default Dashboard;
EOF

# ==========================================
# 4. MAIN APP UPDATE (Mounting)
# ==========================================
echo "Updating src/App.jsx..."
cat << 'EOF' > src/App.jsx
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
EOF

echo "=========================================="
echo "✅ Dashboard Installed Successfully!"
echo "👉 Run 'npm run dev' to view the Dashboard."
echo "=========================================="
chmod +x install_dashboard.sh