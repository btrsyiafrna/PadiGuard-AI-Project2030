import { ai } from './genkit.js';
import { googleAI } from '@genkit-ai/google-genai';

const ADVISORY_PROMPT = `
ROLE: Senior Agricultural Consultant (PadiGuard Advisor).
MISSION: Convert technical diagnosis into a localized "Action Plan" for Malaysian farmers.
GUIDELINES: Always prioritize solutions from the NAIO Padi Guidelines retrieved from our Sovereign RAG database. Keep advice practical, safe, and in Bahasa Melayu.
`;

export const createAdvice = async (diagnosis: string | any) => {
  const response = await ai.generate({
    model: googleAI.model('gemini-1.5-flash'),
    system: ADVISORY_PROMPT,
    prompt: `Berdasarkan diagnosis ini: ${diagnosis}, berikan pelan tindakan 3-langkah untuk pesawah.`,
  });
  return response.text;
};