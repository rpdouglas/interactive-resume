/**
 * 🧠 The Fresh Nest Backend Brain
 * Includes:
 * 1. architectProject: Callable function for the "Gemini Architect" UI.
 * 2. analyzeApplication: Firestore trigger for the "Job Tracker" Vector Engine.
 */

const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { onDocumentWritten } = require("firebase-functions/v2/firestore");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { GoogleGenerativeAI } = require("@google/generative-ai");

initializeApp();
const db = getFirestore();

// ==========================================
// 1. HELPER FUNCTIONS
// ==========================================

async function getResumeContext() {
  const profileSnap = await db.doc('profile/primary').get();
  const profile = profileSnap.data();

  const skillsSnap = await db.collection('skills').get();
  const skills = skillsSnap.docs.map(d => d.data());

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

// ==========================================
// 2. ARCHITECT PROJECT (Restored & Robust)
// ==========================================

const ARCHITECT_SYSTEM_PROMPT = `
  You are a Management Consultant & Resume Architect. 
  Convert raw project notes into a high-impact, professional JSON object.
  
  SCHEMA RULES:
  - id: string (unique slug, lowercase, snake_case)
  - title: string (concise & punchy, no "Project" prefix)
  - skills: string[] (top 3-5 technical/business skills found in text)
  - par: { 
      problem: string (The challenge faced), 
      action: string (What was done, using active verbs), 
      result: string (The outcome, quantified with metrics if possible) 
    }
  - diagram: string (A valid Mermaid.js flowchart source code representing the logic/flow. DO NOT wrap in markdown blocks.)
  
  TONE: Professional, results-oriented, active verbs.
  
  RESPONSE FORMAT: Return raw JSON matching the schema only. No markdown formatting.
`;

exports.architectProject = onCall({ 
  cors: true, 
  secrets: ["GOOGLE_API_KEY"], // ✅ Standardized to the key you just set
  timeoutSeconds: 60,
  maxInstances: 10
}, async (request) => {

  console.log("🚀 Architect Function Triggered (v2026)");

  if (!request.auth) {
    throw new HttpsError("unauthenticated", "You must be logged in.");
  }

  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    throw new HttpsError("internal", "Server misconfiguration: API Key missing.");
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Using 2.5 Flash as the standard high-speed model
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash", 
      generationConfig: { responseMimeType: "application/json" }
    });

    console.log("🤖 Calling Gemini API...");
    const { rawText } = request.data;
    const result = await model.generateContent([ARCHITECT_SYSTEM_PROMPT, rawText]);
    const responseText = result.response.text();
    
    console.log("✅ Gemini Success.");
    return { data: JSON.parse(responseText) }; // Wrap in { data } for onCall client SDK compatibility

  } catch (error) {
    console.error("🔥 AI GENERATION FAILED:", error);
    throw new HttpsError("internal", error.message);
  }
});

// ==========================================
// 3. ANALYZE APPLICATION (Vector Engine)
// ==========================================

exports.analyzeApplication = onDocumentWritten(
  { 
    document: "applications/{docId}",
    secrets: ["GOOGLE_API_KEY"]
  }, 
  async (event) => {
    const apiKey = process.env.GOOGLE_API_KEY;
    const genAI = new GoogleGenerativeAI(apiKey);
    const snapshot = event.data;
    if (!snapshot) return;

    const newData = snapshot.after.data();
    const previousData = snapshot.before.data();

    // 🛑 GUARDRAIL: Infinite Loop Prevention
    if (newData.ai_status !== 'pending') return;
    if (previousData && previousData.ai_status === 'pending') return;

    console.log(`🚀 Starting analysis for Application: ${newData.company}`);

    try {
      await snapshot.after.ref.update({ ai_status: 'processing' });
      const resumeContext = await getResumeContext();

      const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash",
        generationConfig: { responseMimeType: "application/json" }
      });

      const systemPrompt = `
        You are a Senior Technical Recruiter and Career Strategist.
        YOUR GOAL: Analyze the provided Job Description (JD) against the Candidate's Resume Context.
        
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

      const userPrompt = `JOB DESCRIPTION FOR: ${newData.company} (${newData.role})\n\n${newData.raw_text}`;

      const result = await model.generateContent([systemPrompt, userPrompt]);
      const response = await result.response;
      const analysis = JSON.parse(response.text());

      await snapshot.after.ref.update({
        ...analysis,
        ai_status: 'complete',
        updated_at: new Date()
      });

      console.log(`✅ Analysis complete. Score: ${analysis.match_score}`);

    } catch (error) {
      console.error("💥 AI Analysis Failed:", error);
      await snapshot.after.ref.update({
        ai_status: 'error',
        error_log: error.message
      });
    }
  }
);
