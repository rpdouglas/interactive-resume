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
