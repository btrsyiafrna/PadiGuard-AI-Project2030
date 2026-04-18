import { diagnosePlant } from './detection_agent.js';
import { predictRisk } from './prediction_agent.js';
import { createAdvice } from './advisory_agent.js';

/**
 * The Master Orchestrator (Manager Agent) of the PadiGuard Swarm.
 * Routes user input to either the Detection Agent (Image) or Prediction Agent (Weather text/data),
 * and chains the result to the Advisory Agent for an actionable, localized outcome.
 *
 * @param input Either an image URL (string) or a Weather Data Object.
 * @returns A coordinated JSON object containing the initial technical analysis and the final action plan.
 */
export const padiGuardCoordinator = async (input: any) => {
  let initialAnalysis;

  // ROUTING LOGIC:
  if (typeof input === 'string' && (input.startsWith('http') || input.startsWith('data:image') || input.includes('base64'))) {
    // Input is an image URL/base64 -> Call Agent 1 (The Eyes)
    initialAnalysis = await diagnosePlant(input);
  } else {
    // Input is weather data/text -> Call Agent 2 (The Oracle)
    initialAnalysis = await predictRisk(input);
  }

  // CHAINING LOGIC:
  // Always pass the findings to Agent 3 (The Strategist) for the final Action Plan
  const finalAdvice = await createAdvice(initialAnalysis);

  return {
    analysis: initialAnalysis,
    actionPlan: finalAdvice,
    timestamp: new Date().toISOString()
  };
};