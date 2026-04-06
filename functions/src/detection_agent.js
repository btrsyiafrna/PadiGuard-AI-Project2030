//PadiGuard AI: Detection Agent (The Eyes)

const { generate } = require('@genkit-ai/ai');
const { gemini20Flash } = require('@genkit-ai/googleai');

const DETECTION_AGENT_PROMPT = `
ROLE: Senior Rice Pathologist (PadiGuard AI Detection Agent)
CONTEXT: You are the first agent in a 4-agent swarm for Project 2030.
MISSION: Analyze images of padi plants and identify diseases/pests using ONLY Sovereign RAG data.

GUIDELINES:
1. ALWAYS identify the plant stage (e.g., Vegetative, Reproductive, Ripening).
2. CROSS-REFERENCE with the querySovereignRAG tool to identify specific Malaysian symptoms.
3. LANGUAGE: Respond in professional yet accessible Bahasa Melayu (Standard).
4. OUTPUT: Provide a "Certainty Score" (0-100%). If below 70%, request a clearer photo.

SOVEREIGNTY RULE: Do not suggest Western pesticides. Only suggest MARDI/NAIO-approved treatments.
`;

// Configuration (IDs are pasted here as you mentioned)
const DATA_STORE_ID = 'padiguard-knowledge-engine_1775389438783'; 
const PROJECT_ID = 'myai-padiguard-ai-2030';
const LOCATION = 'global';

/**
 * The "Bridge" Tool: This tells Gemini HOW to search your PDFs.
 */
const querySovereignRAG = {
  name: 'querySovereignRAG',
  description: 'Lookup Malaysian agricultural guidelines and rice disease symptoms from verified PDFs.',
  // Note: In Day 3, we will add the actual retrieval logic inside here.
};

/**
 * Main function to diagnose plant health
 */
const diagnosePlant = async (imageUrl) => {
  const response = await generate({
    model: gemini20Flash,
    tools: [querySovereignRAG], // THIS IS CRITICAL: Hand the tool to the agent!
    history: [
      {
        role: 'system',
        content: [{ text: DETECTION_AGENT_PROMPT }],
      },
    ],
    prompt: [
      { text: "Analyze this padi plant image and provide a diagnosis based on our Sovereign RAG data." },
      { media: { url: imageUrl, contentType: 'image/jpeg' } },
    ],
  });

  return response.text();
};

// Export for the Swarm Orchestrator
module.exports = { diagnosePlant, querySovereignRAG };