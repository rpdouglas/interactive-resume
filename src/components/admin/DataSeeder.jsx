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
