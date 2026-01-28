/**
 * 🧠 The Fresh Nest Backend Brain
 * Includes:
 * 1. architectProject: Callable (Gemini 3.0)
 * 2. analyzeApplication: Trigger (Gemini 2.5)
 * 3. generateCoverLetter: Trigger (Gemini 2.5) - No Header Mode
 * 4. tailorResume: Trigger (Gemini 2.5) - NEW!
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

// --- 1. ARCHITECT ---
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

// --- 2. ANALYZE ---
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

// --- 3. COVER LETTER ---
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
      
      const systemPrompt = `
        You are Ryan Douglas. Write a persuasive cover letter for the role of ${newData.role} at ${newData.company}.
        STRICT FORMATTING RULES:
        1. DO NOT include a header block (Name, Address, Phone).
        2. DO NOT include the date or recipient address.
        3. START DIRECTLY with the Salutation.
        CONTEXT: ${JSON.stringify(resumeContext)}
        JOB DESCRIPTION: ${newData.raw_text}
      `;
      
      const result = await model.generateContent(systemPrompt);
      await snapshot.after.ref.update({ cover_letter_text: result.response.text(), cover_letter_status: 'complete' });
    } catch (error) {
      await snapshot.after.ref.update({ cover_letter_status: 'error', error_log: error.message });
    }
  }
);

// --- 4. RESUME TAILOR (NEW) ---
exports.tailorResume = onDocumentWritten(
  { document: "applications/{docId}", secrets: ["GOOGLE_API_KEY"] },
  async (event) => {
    const snapshot = event.data;
    if (!snapshot) return;
    const newData = snapshot.after.data();
    const oldData = snapshot.before.data();

    // Trigger only when tailor_status flips to 'pending'
    if (newData.tailor_status !== 'pending') return;
    if (oldData && oldData.tailor_status === 'pending') return;

    console.log(`🧵 Tailoring Resume for: ${newData.company}`);
    await snapshot.after.ref.update({ tailor_status: 'processing' });

    try {
      const apiKey = process.env.GOOGLE_API_KEY;
      const genAI = new GoogleGenerativeAI(apiKey);
      const resumeContext = await getResumeContext();

      // Use JSON Mode for strict schema
      const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash",
        generationConfig: { responseMimeType: "application/json" }
      });

      const systemPrompt = `
        You are an Ethical Resume Editor and ATS Specialist.
        YOUR TASK: Optimize the Candidate's existing bullet points to match the Job Description (JD).
        
        STRICT GUARDRAILS:
        1. You MUST NOT invent new experiences, companies, or metrics.
        2. You MAY optimize phrasing (Passive -> Active), inject JD keywords, or emphasize specific technologies ALREADY present in the data.
        3. Identify the top 5-7 most relevant bullet points from the "Experience" or "Projects" that can be improved.
        
        RESUME CONTEXT:
        ${JSON.stringify(resumeContext)}

        JOB DESCRIPTION:
        ${newData.raw_text}

        OUTPUT FORMAT:
        Return a JSON Array of objects with this schema:
        [
          {
            "original": "The exact original text from the resume",
            "optimized": "The rewritten version with keywords",
            "reasoning": "Brief explanation of what changed (e.g. 'Added [React] keyword')",
            "confidence": number (0-100)
          }
        ]
      `;

      const result = await model.generateContent(systemPrompt);
      const suggestions = JSON.parse(result.response.text());

      await snapshot.after.ref.update({ 
        tailored_bullets: suggestions,
        tailor_status: 'complete',
        updated_at: new Date()
      });
      console.log("✅ Resume Tailoring Complete.");

    } catch (error) {
      console.error("🔥 Tailoring Failed:", error);
      await snapshot.after.ref.update({ 
        tailor_status: 'error', 
        error_log: error.message 
      });
    }
  }
);
