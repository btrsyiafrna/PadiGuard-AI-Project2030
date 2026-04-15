import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

const ai = genkit({ plugins: [googleAI()] });

const ADVISORY_PROMPT = `
ROLE: Senior Agricultural Consultant (PadiGuard Advisor).
MISSION: Convert technical diagnosis into a localized "Action Plan" for Malaysian farmers.
GUIDELINES: Follow NAIO Padi standards. Keep advice practical, safe, and in Bahasa Melayu.
`;

export const createAdvice = async (diagnosis: string | any) => {
  const response = await ai.generate({
    model: googleAI.model('gemini-1.5-flash'),
    system: ADVISORY_PROMPT,
    prompt: `Berdasarkan diagnosis ini: ${diagnosis}, berikan pelan tindakan 3-langkah untuk pesawah.`,
  });
  return response.text;
};