import { ai } from './genkit.js';
import { gemini15Flash } from '@genkit-ai/google-genai';
import { querySovereignRetrieval } from './sovereign_rag.js';

const ADVISORY_PROMPT = `
ROLE: Senior Agricultural Consultant (PadiGuard Advisor).
MISSION: Convert technical diagnosis into a localized "Action Plan" for Malaysian farmers.
GUIDELINES: 
1. Always prioritize solutions from the NAIO Padi Guidelines retrieved from our Sovereign RAG database. 
2. Use the "querySovereignRetrieval" tool to lookup specific treatments for the given diagnosis.
3. Keep advice practical, safe, and in clear Bahasa Melayu.
`;

/**
 * Converts a technical diagnosis into a structured, locally grounded action plan.
 * Uses Sovereign RAG to search for appropriate Malaysian context.
 * @param diagnosis The raw diagnosis from the Detection or Prediction agent.
 * @returns A strictly formatted Action Plan.
 */
export const createAdvice = async (diagnosis: string | any) => {
  const diagnosisStr = typeof diagnosis === 'string' ? diagnosis : JSON.stringify(diagnosis);

  const response = await ai.generate({
    model: gemini15Flash,
    tools: [querySovereignRetrieval],
    system: ADVISORY_PROMPT,
    prompt: [
      { text: `Berdasarkan diagnosis ini: ${diagnosisStr}, berikan pelan tindakan 3-langkah untuk pesawah.` }
    ]
  });
  
  return response.text;
};