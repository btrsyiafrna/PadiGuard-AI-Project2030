//PadiGuard AI: Detection Agent (The Eyes)

import { ai } from './genkit.js';
import { googleAI } from '@genkit-ai/google-genai';
import { querySovereignRetrieval } from './sovereign_rag.js';

const DETECTION_AGENT_PROMPT = `
ROLE: Senior Rice Pathologist (PadiGuard AI Detection Agent)
CONTEXT: You are the first agent in a 4-agent swarm for Project 2030.
MISSION: Analyze images of padi plants and identify diseases/pests using ONLY Sovereign RAG data.

GUIDELINES:
1. ALWAYS identify the plant stage (e.g., Vegetative, Reproductive, Ripening).
2. CROSS-REFERENCE with the "querySovereignRetrieval" tool to identify specific Malaysian symptoms.
3. LANGUAGE: Respond in professional yet accessible Bahasa Melayu (Standard).
4. GRACEFUL DEGRADATION: Provide a "Certainty Score" (0-100%). If the photo is too blurry or your Certainty Score is below 70%, politely ask the user for a clearer image in Bahasa Melayu (e.g. "Maaf, gambar ini agak kabur. Bolehkah anda muat naik gambar yang lebih jelas supaya saya dapat menganalisisnya dengan lebih tepat?"). Do not guess if unsure.

SOVEREIGNTY RULE: Do not suggest Western pesticides. Only suggest MARDI/NAIO-approved treatments available in Malaysia.
`;

/**
 * Main function to diagnose plant health based on user's image.
 * Evaluates image quality, scores certainty, and pulls from Vector Search to ensure accuracy.
 * @param imageUrl HTTP URL or Base64 string of the uploaded image.
 * @returns Diagnostic string in Bahasa Melayu, or request for a better image.
 */
export const diagnosePlant = async (imageUrl: string) => {
  const response = await ai.generate({
    model: googleAI.model('gemini-2.5-flash'),
    tools: [querySovereignRetrieval],
    system: DETECTION_AGENT_PROMPT,
    prompt: [
      { text: "Analyze this padi plant image and provide a diagnosis based on our Sovereign RAG data." },
      { media: { url: imageUrl } },
    ],
  });

  return response.text;
};
