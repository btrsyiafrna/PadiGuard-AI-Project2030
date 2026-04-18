import { ai } from './genkit.js';
import { SearchServiceClient } from '@google-cloud/discoveryengine';
import { z } from 'genkit';

const searchClient = new SearchServiceClient();

/**
 * Genkit tool to query the Sovereign RAG datastore (Google Cloud Discovery Engine)
 * This ensures all agents get their facts grounded in Malaysian agricultural guidelines.
 */
export const querySovereignRetrieval = ai.defineTool(
  {
    name: 'querySovereignRetrieval',
    description: 'Retrieves knowledge about Malaysian Padi Disease Management and Agricultural Guidelines from the verified Sovereign RAG store.',
    inputSchema: z.object({
      query: z.string().describe('The search query or symptoms observed.'),
    }),
  },
  async (input) => {
    const projectId = process.env.GCLOUD_PROJECT;
    const dataStoreId = process.env.DATA_STORE_ID;
    
    if (!projectId || !dataStoreId) {
      return 'Missing GCLOUD_PROJECT or DATA_STORE_ID environment variables. Cannot query Sovereign RAG.';
    }

    try {
      const request = {
        // Construct the Search Request
        servingConfig: searchClient.projectLocationCollectionDataStoreServingConfigPath(
          projectId, 'global', 'default_collection', dataStoreId, 'default_search'
        ),
        query: input.query,
        pageSize: 3,
      };

      const [response] = await searchClient.search(request);
      
      const snippets = response.map(r => 
        (r.document?.derivedStructData as any)?.snippets?.[0]?.snippet || 'No snippet available.'
      );
      
      return snippets.join('\n\n');
    } catch (e: any) {
      console.error("Vector Search Error:", e);
      return "Unable to retrieve guidelines from Sovereign RAG at this time.";
    }
  }
);
