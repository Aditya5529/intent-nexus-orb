import { create } from 'zustand';

export interface IntentNode {
  id: string;
  text: string;
  position?: [number, number, number];
}

export interface AgentDecision {
  intent_id: string;
  action: 'fly_to_node' | 'highlight_only' | 'show_top_3' | 'ask_clarifying_question' | 'open_preview';
  ui_hint: string;
  reason: string;
  confidence?: 'high' | 'medium' | 'low';
  alternatives?: string[];
}

interface IntentState {
  // Graph data
  nodes: IntentNode[];
  isLoadingGraph: boolean;
  graphError: string | null;

  // Agent state
  activeIntentId: string | null;
  agentDecision: AgentDecision | null;
  isAgentThinking: boolean;

  // Camera state
  cameraTarget: [number, number, number] | null;
  shouldFlyToTarget: boolean;

  // UI state
  searchQuery: string;
  isPanelOpen: boolean;
  hoveredNodeId: string | null;
  highlightedNodeIds: string[];

  // Actions
  setNodes: (nodes: IntentNode[]) => void;
  setLoadingGraph: (loading: boolean) => void;
  setGraphError: (error: string | null) => void;
  setActiveIntent: (id: string | null) => void;
  setAgentDecision: (decision: AgentDecision | null) => void;
  setAgentThinking: (thinking: boolean) => void;
  setCameraTarget: (target: [number, number, number] | null) => void;
  setShouldFlyToTarget: (should: boolean) => void;
  setSearchQuery: (query: string) => void;
  setPanelOpen: (open: boolean) => void;
  setHoveredNode: (id: string | null) => void;
  setHighlightedNodes: (ids: string[]) => void;
  clearHighlights: () => void;
  reset: () => void;
}

const initialState = {
  nodes: [],
  isLoadingGraph: false,
  graphError: null,
  activeIntentId: null,
  agentDecision: null,
  isAgentThinking: false,
  cameraTarget: null,
  shouldFlyToTarget: false,
  searchQuery: '',
  isPanelOpen: false,
  hoveredNodeId: null,
  highlightedNodeIds: [],
};

export const useIntentStore = create<IntentState>((set) => ({
  ...initialState,

  setNodes: (nodes) => set({ nodes }),
  setLoadingGraph: (isLoadingGraph) => set({ isLoadingGraph }),
  setGraphError: (graphError) => set({ graphError }),
  setActiveIntent: (activeIntentId) => set({ activeIntentId }),
  setAgentDecision: (agentDecision) => set({ agentDecision }),
  setAgentThinking: (isAgentThinking) => set({ isAgentThinking }),
  setCameraTarget: (cameraTarget) => set({ cameraTarget }),
  setShouldFlyToTarget: (shouldFlyToTarget) => set({ shouldFlyToTarget }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setPanelOpen: (isPanelOpen) => set({ isPanelOpen }),
  setHoveredNode: (hoveredNodeId) => set({ hoveredNodeId }),
  setHighlightedNodes: (highlightedNodeIds) => set({ highlightedNodeIds }),
  clearHighlights: () => set({ highlightedNodeIds: [], activeIntentId: null }),
  reset: () => set(initialState),
}));
