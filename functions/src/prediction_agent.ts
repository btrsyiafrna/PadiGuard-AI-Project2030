import { ai } from './genkit.js';
import { googleAI } from '@genkit-ai/google-genai';
import { SearchServiceClient } from '@google-cloud/discoveryengine';

const searchClient = new SearchServiceClient();

const PREDICTION_PROMPT = `
ROLE: Agricultural Data Scientist (PadiGuard AI Prediction).
MISSION: Analyze weather patterns and RAG data to predict rice disease outbreaks.
CONTEXT: High humidity (>80%) and temperatures between 25-30°C are peak conditions for Karah Padi.
OUTPUT: Provide a Risk Score (%), the likely disease, and 3 pre-emptive steps in Bahasa Melayu.
`;

export const padiDiseaseRetrieverTool = ai.defineTool(
  {
    name: 'padiDiseaseRetriever',
    description: 'Retrieves the latest Padi Disease Management guidelines from the RAG store.',
  },
  async () => {
    const projectId = process.env.GCLOUD_PROJECT;
    const dataStoreId = process.env.DATA_STORE_ID;
    
    if (!projectId || !dataStoreId) {
      return 'Missing GCLOUD_PROJECT or DATA_STORE_ID environment variables.';
    }

    try {
      const request = {
        servingConfig: searchClient.projectLocationCollectionDataStoreServingConfigPath(
          projectId, 'global', 'default_collection', dataStoreId, 'default_search'
        ),
        query: 'Padi Disease Management outbreaks',
        pageSize: 3,
      };

      const [response] = await searchClient.search(request);
      
      const snippets = response.map(r => 
        (r.document?.derivedStructData as any)?.snippets?.[0]?.snippet || 'No snippet available.'
      );
      
      return snippets.join('\n\n');
    } catch (e: any) {
      console.error("Vector Search Error:", e);
      return "Unable to retrieve guidelines.";
    }
  }
);

export const predictRisk = async (weatherData: any) => {
  // Retrieve the latest guidelines BEFORE making the prediction
  const guidelines = await padiDiseaseRetrieverTool({});

  const response = await ai.generate({
    model: googleAI.model('gemini-1.5-flash'),
    system: PREDICTION_PROMPT,
    prompt: `Analyze this weather data: ${JSON.stringify(weatherData)}. 
             
             Cross-reference with the following Sovereign RAG data (Historical Outbreaks/Guidelines retrieved from Vector Search):
             ${guidelines}`,
  });

  return response.text;
};