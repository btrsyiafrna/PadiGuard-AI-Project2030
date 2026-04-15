import 'dotenv/config';
import { z } from 'genkit';
import { ai } from './genkit.js';
import { diagnosePlant } from './detection_agent.js';
import { predictRisk } from './prediction_agent.js';
import { padiGuardCoordinator } from './manager_agent.js';

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

export const padiGuardMasterFlow = ai.defineFlow(
  { 
    name: 'padiGuardMasterFlow', 
    inputSchema: z.any() // Accepts Image URL or Weather Object
  },
  async (input) => {
    return await padiGuardCoordinator(input);
  }
);