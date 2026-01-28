/**
 * 🧠 The Fresh Nest Backend Brain
 * Includes:
 * 1. architectProject: Callable (Gemini 3.0)
 * 2. analyzeApplication: Trigger (Gemini 2.5)
 * 3. generateCoverLetter: Trigger (Gemini 2.5)
 */

const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { onDocumentWritten } = require("firebase-functions/v2/firestore");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { GoogleGenerativeAI } = require("@google/generative-ai");

initializeApp();
const db = getFirestore();

// --- HELPERS ---
async function getResumeContext() {
  const profileSnap = await db.doc('profile/primary').get();
  const profile = profileSnap.data();
  const skillsSnap = await db.collection('skills').get();
  const skills = skillsSnap.docs.map(d => d.data());
  const expSnap = await db.collection('experience').get();
  const experience = await Promise.all(expSnap.docs.map(async (doc) => {
    const jobData = doc.data();
    const projectsSnap = await doc.ref.collection('projects').get();
    const projects = projectsSnap.docs.map(p => ({ id: p.id, ...p.data() }));
    return { ...jobData, projects };
  }));
  return { profile, skills, experience };
}

// --- ARCHITECT ---
const ARCHITECT_SYSTEM_PROMPT = "You are a Resume Architect. Convert raw notes to JSON. NO Markdown.";
exports.architectProject = onCall({ 
  cors: true, 
  secrets: ["GOOGLE_API_KEY"],
  timeoutSeconds: 60,
  maxInstances: 10
}, async (request) => {
  if (!request.auth) throw new HttpsError("unauthenticated", "Login required.");
  const apiKey = process.env.GOOGLE_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash", generationConfig: { responseMimeType: "application/json" }});
  const result = await model.generateContent([ARCHITECT_SYSTEM_PROMPT, request.data.rawText]);
  return { data: JSON.parse(result.response.text()) }; 
});

// --- ANALYZE (FIXED PROMPT) ---
exports.analyzeApplication = onDocumentWritten(
  { document: "applications/{docId}", secrets: ["GOOGLE_API_KEY"] }, 
  async (event) => {
    const snapshot = event.data;
    if (!snapshot) return;
    const newData = snapshot.after.data();
    if (newData.ai_status !== 'pending') return;

    await snapshot.after.ref.update({ ai_status: 'processing' });
    const apiKey = process.env.GOOGLE_API_KEY;
    const genAI = new GoogleGenerativeAI(apiKey);
    const resumeContext = await getResumeContext();
    
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash", generationConfig: { responseMimeType: "application/json" }});

    // ⚡ UPDATED: Restored 'suggested_projects' to the JSON Schema
    const prompt = `Analyze this JD against Resume.
    RESUME: ${JSON.stringify(resumeContext)}
    JD: ${newData.company} - ${newData.role} \n ${newData.raw_text}
    
    RETURN JSON: 
    { 
      "match_score": number (0-100), 
      "keywords_missing": string[], 
      "suggested_projects": string[] (List of 3 relevant project IDs from Resume context),
      "tailored_summary": string, 
      "gap_analysis": string[] (A list of specific, distinct gaps. Do not number them.)
    }`;

    try {
      const result = await model.generateContent(prompt);
      const analysis = JSON.parse(result.response.text());
      await snapshot.after.ref.update({ ...analysis, ai_status: 'complete' });
    } catch (e) {
      await snapshot.after.ref.update({ ai_status: 'error', error_log: e.message });
    }
  }
);

// --- COVER LETTER ---
exports.generateCoverLetter = onDocumentWritten(
  { document: "applications/{docId}", secrets: ["GOOGLE_API_KEY"] },
  async (event) => {
    const snapshot = event.data;
    if (!snapshot) return;
    const newData = snapshot.after.data();
    const oldData = snapshot.before.data();
    if (newData.cover_letter_status !== 'pending') return;
    if (oldData && oldData.cover_letter_status === 'pending') return;

    await snapshot.after.ref.update({ cover_letter_status: 'writing' });
    try {
      const apiKey = process.env.GOOGLE_API_KEY;
      const genAI = new GoogleGenerativeAI(apiKey);
      const resumeContext = await getResumeContext();
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const systemPrompt = `You are Ryan Douglas. Write a cover letter for ${newData.role} at ${newData.company}. USE ONLY: ${JSON.stringify(resumeContext)}. JD: ${newData.raw_text}`;
      const result = await model.generateContent(systemPrompt);
      await snapshot.after.ref.update({ cover_letter_text: result.response.text(), cover_letter_status: 'complete' });
    } catch (error) {
      await snapshot.after.ref.update({ cover_letter_status: 'error', error_log: error.message });
    }
  }
);
