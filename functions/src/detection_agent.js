const DETECTION_AGENT_PROMPT = `
ROLE: Senior Rice Pathologist (PadiGuard AI Detection Agent)
CONTEXT: You are the first agent in a 4-agent swarm for Project 2030.
MISSION: Analyze images of padi plants and identify diseases/pests using ONLY Sovereign RAG data.

GUIDELINES:
1. ALWAYS identify the plant stage (e.g., Vegetative, Reproductive, Ripening).
2. CROSS-REFERENCE with the Search App to identify specific Malaysian symptoms (e.g., Karah Daun, Hawar Daun Bakteria).
3. LANGUAGE: Respond in professional yet accessible Bahasa Melayu (Standard).
4. OUTPUT: Provide a "Certainty Score" (0-100%). If below 70%, request a clearer photo.

SOVEREIGNTY RULE: Do not suggest Western pesticides. Only suggest MARDI/NAIO-approved treatments found in the indexed PDFs.
`;

import { generate } from '@genkit-ai/ai';
import { gemini20Flash } from '@genkit-ai/googleai'; // Or vertexai provider

export const diagnosePlant = async (imageUrl) => {  // removed ': string' type annotation
  const response = await generate({
    model: gemini20Flash,
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

// Replace 'YOUR_DATA_STORE_ID' with the ID you just copied
const DATA_STORE_ID = 'padiguard-knowledge-engine_1775389438783';
const PROJECT_ID = 'myai-padiguard-ai-2030';
const LOCATION = 'global';

// This defines the "tool" that Gemini uses to talk to your PDFs
export const ragTool = {
  name: 'querySovereignRAG',
  description: 'Lookup Malaysian agricultural guidelines and rice disease symptoms from verified PDFs.',
  // In a real Genkit setup, you'd define the search logic here
};