import 'dotenv/config';
import { genkit, z } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';
import { diagnosePlant } from './detection_agent.js';
import { predictRisk } from './prediction_agent.js';

const ai = genkit({
  plugins: [
    // Pass the API Key explicitly to the plugin
    googleAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY }),
  ],
});

export const diagnosePlantFlow = ai.defineFlow(
  {
    name: 'diagnosePlantFlow',
    inputSchema: z.string(),
  },
  async (imageUrl) => {
    return await diagnosePlant(imageUrl);
  }
);

export const predictOutbreakFlow = ai.defineFlow(
  {
    name: 'predictOutbreakFlow',
    inputSchema: z.object({
      temp: z.number(),
      humidity: z.number(),
      location: z.string(),
    }),
  },
  async (input) => {
    return await predictRisk(input);
  }
);