#!/bin/bash

# ==========================================
# 🏗️ Phase 3: The Narrative (Timeline)
# ==========================================
# Approach: Option 2 "The Smart Spine" (Left-aligned, Mobile First)

echo "Step 1: Creating Directory Structure..."
mkdir -p src/components/timeline
mkdir -p src/sections
mkdir -p src/data

echo "Step 2: Generating Data Layer (src/data/experience.json)..."
# We populate this with a sample based on your User Persona (Management Consultant / Power BI)
cat << 'EOF' > src/data/experience.json
[
  {
    "id": "job_1",
    "role": "Management Consultant & Power BI Developer",
    "company": "Freelance / Independent",
    "date": "2022 - Present",
    "logo": "📊",
    "skills": ["Power BI", "React", "Azure", "DAX"],
    "summary": "Leading business transformation projects and building custom data visualization solutions.",
    "par": {
      "problem": "Clients struggled to bridge the gap between complex data warehouses and actionable business strategy.",
      "action": "Developed interactive Power BI dashboards and React-based web apps to visualize KPIs in real-time.",
      "result": "Reduced reporting latency by 40% and enabled executive teams to make data-driven decisions instantly."
    }
  },
  {
    "id": "job_2",
    "role": "Business Transformation Lead",
    "company": "Previous Firm",
    "date": "2015 - 2022",
    "logo": "💼",
    "skills": ["Change Management", "Process Optimization", "SQL"],
    "summary": "Directed large-scale system implementations for Fortune 500 clients.",
    "par": {
      "problem": "Legacy systems were creating data silos, resulting in a 15% annual revenue leakage.",
      "action": "Spearheaded the migration to a unified cloud ERP and implemented automated reconciliation workflows.",
      "result": "Recovered $2.5M in lost revenue within the first year of implementation."
    }
  },
  {
    "id": "job_3",
    "role": "Computer Programmer",
    "company": "Early Career",
    "date": "2003 - 2015",
    "logo": "💻",
    "skills": ["C++", "Java", "Systems Analysis"],
    "summary": "Foundational experience in software development and systems logic.",
    "par": {
      "problem": "Manual data entry processes were prone to a high error rate.",
      "action": "Wrote custom scripts to automate data ingestion and validation.",
      "result": "Eliminated manual entry for 90% of workflows."
    }
  }
]
EOF

echo "Step 3: Creating Timeline Components..."

# 3a. The Timeline Card (Individual Item)
cat << 'EOF' > src/components/timeline/TimelineCard.jsx
import React from 'react';
import { motion } from 'framer-motion';

const TimelineCard = ({ data, index }) => {
  return (
    <div className="relative pl-8 md:pl-12 py-6 group">
      {/* 🟢 The Node (Dot on the Spine) */}
      <div 
        className="absolute left-[-5px] top-8 w-4 h-4 rounded-full bg-blue-500 border-4 border-slate-900 shadow-[0_0_10px_rgba(59,130,246,0.5)] z-10 group-hover:scale-125 transition-transform duration-300"
        aria-hidden="true"
      />

      {/* 📄 The Content Card */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 hover:border-blue-500/50 transition-colors shadow-lg"
      >
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-white">{data.role}</h3>
            <span className="text-blue-400 font-medium text-sm">{data.company}</span>
          </div>
          <span className="text-slate-400 text-sm font-mono mt-1 sm:mt-0">{data.date}</span>
        </div>

        {/* PAR Framework (The Narrative) */}
        <div className="space-y-3 text-sm text-slate-300">
          <p><strong className="text-blue-300">Problem:</strong> {data.par.problem}</p>
          <p><strong className="text-green-300">Action:</strong> {data.par.action}</p>
          <p><strong className="text-purple-300">Result:</strong> {data.par.result}</p>
        </div>

        {/* Skills Chips */}
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-700/50">
          {data.skills.map(skill => (
            <span key={skill} className="px-2 py-1 text-xs rounded-md bg-slate-900 text-slate-400 border border-slate-700">
              {skill}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default TimelineCard;
EOF

# 3b. The Timeline Container (The Spine)
cat << 'EOF' > src/components/timeline/TimelineContainer.jsx
import React from 'react';
import TimelineCard from './TimelineCard';

const TimelineContainer = ({ experienceData }) => {
  return (
    <div className="relative max-w-3xl mx-auto">
      {/* 📏 The Vertical Spine (Absolute Left) */}
      <div className="absolute left-[2px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-transparent opacity-50" />

      {/* List of Items */}
      <div className="flex flex-col space-y-2">
        {experienceData.map((job, index) => (
          <TimelineCard key={job.id} data={job} index={index} />
        ))}
      </div>
    </div>
  );
};

export default TimelineContainer;
EOF

echo "Step 4: Creating the Section Wrapper..."
cat << 'EOF' > src/sections/ExperienceSection.jsx
import React from 'react';
import TimelineContainer from '../components/timeline/TimelineContainer';
import experienceData from '../data/experience.json';

const ExperienceSection = () => {
  return (
    <section id="experience" className="py-20 bg-slate-900 relative overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Professional <span className="text-blue-500">History</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            15 years of bridging the gap between Business Strategy and Technical Execution.
          </p>
        </div>

        {/* The Timeline */}
        <TimelineContainer experienceData={experienceData} />
      </div>
    </section>
  );
};

export default ExperienceSection;
EOF

echo "=========================================="
echo "✅ Feature Installed: Experience Timeline"
echo "=========================================="
echo "👉 NEXT STEP (Manual Wiring):"
echo "   1. Open src/App.jsx"
echo "   2. Add: import ExperienceSection from './sections/ExperienceSection';"
echo "   3. Place <ExperienceSection /> below your Dashboard/Hero section."
echo "   4. Run 'npm run dev' to verify."