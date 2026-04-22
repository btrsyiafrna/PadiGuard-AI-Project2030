import 'dotenv/config';
import { z } from 'genkit';
import { startFlowServer } from '@genkit-ai/express';
import { ai } from './genkit.js';
import { diagnosePlant } from './detection_agent.js';
import { predictRisk } from './prediction_agent.js';
import { padiGuardCoordinator } from './manager_agent.js';

/**
 * Zod Schemas for Error Handling & Input Validation
 */
const ImageInputSchema = z.string().min(1, { message: "Image URL or Base64 string cannot be empty." });

const WeatherInputSchema = z.object({
  temp: z.number().min(-50).max(100),
  humidity: z.number().min(0).max(100),
  location: z.string().min(1)
});

/**
 * Flows Definition
 */
export const diagnosePlantFlow = ai.defineFlow(
  {
    name: 'diagnosePlantFlow',
    inputSchema: ImageInputSchema,
    outputSchema: z.string()
  },
  async (imageUrl) => {
    return await diagnosePlant(imageUrl);
  }
);

export const predictOutbreakFlow = ai.defineFlow(
  {
    name: 'predictOutbreakFlow',
    inputSchema: WeatherInputSchema,
    outputSchema: z.string()
  },
  async (input) => {
    return await predictRisk(input);
  }
);

export const padiGuardMasterFlow = ai.defineFlow(
  { 
    name: 'padiGuardMasterFlow', 
    // Manager can take either an image string OR the weather object
    inputSchema: z.union([ImageInputSchema, WeatherInputSchema]),
    outputSchema: z.object({
      analysis: z.string(),
      actionPlan: z.string(),
      timestamp: z.string()
    })
  },
  async (input) => {
    return await padiGuardCoordinator(input);
  }
);

// We need to export sovereign_rag as a tool? It is defined via ai.defineTool so Genkit already registers it via `import` but let's export it from index.ts to ensure Genkit index finds it.
export { querySovereignRetrieval } from './sovereign_rag.js';

// Start the flow server if this file is run directly or in a production environment
if (process.env.NODE_ENV === 'production' || process.env.SERVE === 'true') {
  startFlowServer({
    flows: [diagnosePlantFlow, predictOutbreakFlow, padiGuardMasterFlow],
    port: Number(process.env.PORT) || 8080,
  });
}