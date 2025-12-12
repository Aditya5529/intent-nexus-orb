import { IntentNode, AgentDecision } from '@/store/intentStore';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

export interface GraphResponse {
  nodes: IntentNode[];
}

export interface AgentDecisionResponse {
  decision: AgentDecision;
}

export async function fetchGraph(graphId: string): Promise<GraphResponse> {
  const response = await fetch(`${BACKEND_URL}/graph/${graphId}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch graph: ${response.statusText}`);
  }
  
  return response.json();
}

export async function agentDecide(query: string, graphId: string): Promise<AgentDecisionResponse> {
  const response = await fetch(`${BACKEND_URL}/agent/decide`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, graph_id: graphId }),
  });
  
  if (!response.ok) {
    throw new Error(`Agent decision failed: ${response.statusText}`);
  }
  
  return response.json();
}

// Demo data for development/testing
export const demoNodes: IntentNode[] = [
  { id: 'admissions', text: 'How to apply for admission to our programs' },
  { id: 'courses', text: 'Browse available courses and curriculum' },
  { id: 'tuition', text: 'Tuition fees and financial aid options' },
  { id: 'campus', text: 'Campus life and student activities' },
  { id: 'research', text: 'Research opportunities and labs' },
  { id: 'faculty', text: 'Meet our faculty and staff' },
  { id: 'events', text: 'Upcoming events and open days' },
  { id: 'contact', text: 'Contact information and support' },
  { id: 'library', text: 'Library resources and digital archives' },
  { id: 'housing', text: 'Student housing and accommodation' },
  { id: 'careers', text: 'Career services and job placement' },
  { id: 'athletics', text: 'Sports teams and fitness facilities' },
];

// Demo agent response
export function getDemoDecision(query: string): AgentDecisionResponse {
  const queryLower = query.toLowerCase();
  
  let intentId = 'admissions';
  let confidence: 'high' | 'medium' | 'low' = 'high';
  let reason = 'High confidence match based on query intent';
  
  if (queryLower.includes('apply') || queryLower.includes('admission')) {
    intentId = 'admissions';
    reason = 'Query directly relates to application process';
  } else if (queryLower.includes('course') || queryLower.includes('class') || queryLower.includes('program')) {
    intentId = 'courses';
    reason = 'Query relates to academic programs';
  } else if (queryLower.includes('cost') || queryLower.includes('tuition') || queryLower.includes('fee') || queryLower.includes('financial')) {
    intentId = 'tuition';
    reason = 'Query relates to costs and financial matters';
  } else if (queryLower.includes('campus') || queryLower.includes('life') || queryLower.includes('student')) {
    intentId = 'campus';
    reason = 'Query relates to campus experience';
  } else if (queryLower.includes('research') || queryLower.includes('lab')) {
    intentId = 'research';
    reason = 'Query relates to research activities';
  } else if (queryLower.includes('faculty') || queryLower.includes('professor') || queryLower.includes('teacher')) {
    intentId = 'faculty';
    reason = 'Query relates to faculty members';
  } else if (queryLower.includes('event') || queryLower.includes('visit')) {
    intentId = 'events';
    reason = 'Query relates to events and visits';
  } else if (queryLower.includes('contact') || queryLower.includes('help') || queryLower.includes('support')) {
    intentId = 'contact';
    reason = 'Query relates to getting help or contact';
  } else if (queryLower.includes('library') || queryLower.includes('book')) {
    intentId = 'library';
    reason = 'Query relates to library resources';
  } else if (queryLower.includes('housing') || queryLower.includes('dorm') || queryLower.includes('accommodation')) {
    intentId = 'housing';
    reason = 'Query relates to student housing';
  } else if (queryLower.includes('career') || queryLower.includes('job') || queryLower.includes('internship')) {
    intentId = 'careers';
    reason = 'Query relates to career opportunities';
  } else if (queryLower.includes('sport') || queryLower.includes('gym') || queryLower.includes('athletic')) {
    intentId = 'athletics';
    reason = 'Query relates to sports and athletics';
  } else {
    confidence = 'medium';
    reason = 'Semantic similarity match - interpreting user intent';
  }

  return {
    decision: {
      intent_id: intentId,
      action: 'fly_to_node',
      ui_hint: 'zoom_and_highlight',
      reason,
      confidence,
    },
  };
}
