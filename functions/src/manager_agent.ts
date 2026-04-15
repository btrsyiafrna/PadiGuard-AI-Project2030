import { diagnosePlant } from './detection_agent.js';
import { predictRisk } from './prediction_agent.js';
import { createAdvice } from './advisory_agent.js';

export const padiGuardCoordinator = async (input: any) => {
  let initialAnalysis;

  // ROUTING LOGIC:
  if (typeof input === 'string' && (input.startsWith('http') || input.includes('base64'))) {
    // Input is an image URL -> Call Agent 1
    initialAnalysis = await diagnosePlant(input);
  } else {
    // Input is data/text -> Call Agent 2
    initialAnalysis = await predictRisk(input);
  }

  // CHAINING LOGIC:
  // Always pass the findings to Agent 3 for the final Action Plan
  const finalAdvice = await createAdvice(initialAnalysis);

  return {
    analysis: initialAnalysis,
    actionPlan: finalAdvice,
    timestamp: new Date().toISOString()
  };
};