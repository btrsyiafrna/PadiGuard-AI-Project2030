import { ai } from './genkit.js';
import { googleAI } from '@genkit-ai/google-genai';
import { querySovereignRetrieval } from './sovereign_rag.js';

const PREDICTION_PROMPT = `
ROLE: Agricultural Data Scientist (PadiGuard AI Prediction).
MISSION: Analyze weather patterns and RAG data to predict rice disease outbreaks.
CONTEXT: High humidity (>80%) and temperatures between 25-30°C are peak conditions for Karah Padi.
OUTPUT: Provide a Risk Score (%), the likely disease, and 3 pre-emptive steps in Bahasa Melayu.
`;

/**
 * Anticipates the risk of Padi diseases based on weather data and Sovereign RAG context.
 * @param weatherData An object containing local weather telemetry (e.g. Temp, Humidity).
 * @returns A string containing the probabilistic risk score and preventive steps.
 */
export const predictRisk = async (weatherData: any) => {
  // Retrieve the latest guidelines BEFORE making the prediction
  const guidelines = await querySovereignRetrieval({ query: 'Padi Disease Management outbreaks and conditions' });

  const response = await ai.generate({
    model: googleAI.model('gemini-1.5-flash'),
    system: PREDICTION_PROMPT,
    prompt: `Analyze this weather data: ${JSON.stringify(weatherData)}. 
             
             Cross-reference with the following Sovereign RAG data (Historical Outbreaks/Guidelines retrieved from Vector Search):
             ${guidelines}`,
  });

  return response.text;
};