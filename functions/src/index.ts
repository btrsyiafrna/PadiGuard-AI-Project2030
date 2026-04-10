/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { setGlobalOptions } from "firebase-functions";
import { defineSecret } from "firebase-functions/params";
import { genkit, z } from 'genkit';
import { vertexAI } from '@genkit-ai/google-genai';

// @ts-ignore
import { diagnosePlant } from './detection_agent.js';

const apiKey = defineSecret("GOOGLE_GENAI_API_KEY");

console.log('DEBUG: API KEY exists?', !!process.env.GOOGLE_GENAI_API_KEY);

const ai = genkit({
  plugins: [vertexAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY })],
});

setGlobalOptions({ maxInstances: 10 });

export const diagnoseFlow = ai.defineFlow(
  {
    name: 'diagnosePlantFlow',
    inputSchema: z.string(),
    outputSchema: z.string(),
  },
  async (imageUrl: string) => {
    return await diagnosePlant(imageUrl);
  }
);