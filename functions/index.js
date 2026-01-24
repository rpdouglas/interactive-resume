const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const SYSTEM_PROMPT = `
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
  secrets: ["GEMINI_API_KEY"],
  timeoutSeconds: 60,
  maxInstances: 10
}, async (request) => {

  console.log("🚀 Architect Function Triggered (v2026)");

  if (!request.auth) {
    throw new HttpsError("unauthenticated", "You must be logged in.");
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new HttpsError("internal", "Server misconfiguration: API Key missing.");
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // ✅ FIX: Updated to valid 2026 Model
    const model = genAI.getGenerativeModel({ 
      model: "gemini-3-flash-preview", 
      generationConfig: { responseMimeType: "application/json" }
    });

    console.log("🤖 Calling Gemini 3.0 API...");
    const { rawText } = request.data;
    const result = await model.generateContent([SYSTEM_PROMPT, rawText]);
    const responseText = result.response.text();
    
    console.log("✅ Gemini 3.0 Success.");
    return JSON.parse(responseText);

  } catch (error) {
    console.error("🔥 AI GENERATION FAILED:", error);
    throw new HttpsError("internal", error.message);
  }
});
