const { GoogleGenerativeAI } = require("@google/generative-ai");

async function listModels() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    console.error("❌ Error: GEMINI_API_KEY environment variable is missing.");
    process.exit(1);
  }

  try {
    const genAI = new GoogleGenerativeAI(key);
    // Note: The SDK doesn't always expose listModels directly on the client 
    // depending on version, so we fallback to the raw REST endpoint if needed,
    // but let's try a direct fetch which is 100% reliable for debugging.
    
    console.log("📡 Querying Google AI API for available models...");
    
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    console.log("\n✅ AVAILABLE MODELS FOR YOUR KEY:");
    console.log("===================================");
    
    const models = data.models || [];
    const generateModels = models.filter(m => m.supportedGenerationMethods.includes("generateContent"));
    
    generateModels.forEach(m => {
      console.log(`🔹 ${m.name.replace('models/', '')}`);
      // console.log(`   Description: ${m.description.substring(0, 60)}...`);
    });
    
    console.log("===================================");

  } catch (error) {
    console.error("🔥 Failed to list models:", error.message);
  }
}

listModels();
