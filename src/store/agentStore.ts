import { create } from 'zustand';
import { Node, Edge, addEdge, applyNodeChanges, applyEdgeChanges, NodeChange, EdgeChange, Connection } from '@xyflow/react';
import { Agent, Environment, ValidationIssue, NODE_TYPES } from '@/types/agent';

interface AgentNodeData {
  type: string;
  label: string;
  category: string;
  riskLevel?: string;
  config?: Record<string, unknown>;
  [key: string]: unknown;
}

interface AgentState {
  // Current agent
  currentAgent: Agent | null;

  // Canvas state
  nodes: Node<AgentNodeData>[];
  edges: Edge[];
  selectedNodeId: string | null;

  // UI state
  isPaletteOpen: boolean;
  isInspectorOpen: boolean;
  isSimulationMode: boolean;
  isChatOpen: boolean;

  // Validation
  validationIssues: ValidationIssue[];

  // Actions
  createAgent: (name: string, description: string, environment: Environment) => void;
  updateAgentEnvironment: (environment: Environment) => void;

  // Canvas actions
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  addNode: (type: string, position: { x: number; y: number }) => void;
  removeNode: (nodeId: string) => void;
  selectNode: (nodeId: string | null) => void;
  updateNodeConfig: (nodeId: string, config: Record<string, unknown>) => void;

  // UI actions
  togglePalette: () => void;
  toggleInspector: () => void;
  toggleSimulation: () => void;
  toggleChat: () => void;

  // Validation
  // Validation
  validateAgent: () => void;

  // Execution
  executeAgent: (input: string) => Promise<any>;
}

const generateId = () => `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export const useAgentStore = create<AgentState>((set, get) => ({
  currentAgent: null,
  nodes: [],
  edges: [],
  selectedNodeId: null,
  isPaletteOpen: true,
  isInspectorOpen: true,
  isSimulationMode: false,
  isChatOpen: false,
  validationIssues: [],

  createAgent: (name, description, environment) => {
    const agent: Agent = {
      id: generateId(),
      name,
      description,
      environment,
      createdAt: new Date(),
      updatedAt: new Date(),
      isValid: false,
      validationIssues: [],
    };
    set({ currentAgent: agent, nodes: [], edges: [], validationIssues: [] });
    get().validateAgent();
  },

  updateAgentEnvironment: (environment) => {
    set((state) => ({
      currentAgent: state.currentAgent
        ? { ...state.currentAgent, environment, updatedAt: new Date() }
        : null
    }));
    get().validateAgent();
  },

  onNodesChange: (changes) => {
    set((state) => ({
      nodes: applyNodeChanges(changes, state.nodes) as Node<AgentNodeData>[],
    }));
    get().validateAgent();
  },

  onEdgesChange: (changes) => {
    set((state) => ({
      edges: applyEdgeChanges(changes, state.edges),
    }));
    get().validateAgent();
  },

  onConnect: (connection) => {
    set((state) => ({
      edges: addEdge(
        {
          ...connection,
          type: 'smoothstep',
          animated: true,
          style: { stroke: 'hsl(187, 85%, 53%)', strokeWidth: 2 }
        },
        state.edges
      ),
    }));
    get().validateAgent();
  },

  addNode: (type, position) => {
    const nodeType = NODE_TYPES.find(n => n.type === type);
    if (!nodeType) return;

    const newNode: Node<AgentNodeData> = {
      id: generateId(),
      type: nodeType.type, // Use the specific registered type (e.g., 'trigger', 'agent-goal')
      position,
      data: {
        type: nodeType.type,
        label: nodeType.label,
        category: nodeType.category,
        riskLevel: nodeType.riskLevel,
        config: {},
      },
    };

    set((state) => ({
      nodes: [...state.nodes, newNode],
      selectedNodeId: newNode.id,
    }));
    get().validateAgent();
  },

  removeNode: (nodeId) => {
    set((state) => ({
      nodes: state.nodes.filter(n => n.id !== nodeId),
      edges: state.edges.filter(e => e.source !== nodeId && e.target !== nodeId),
      selectedNodeId: state.selectedNodeId === nodeId ? null : state.selectedNodeId,
    }));
    get().validateAgent();
  },

  selectNode: (nodeId) => {
    set({ selectedNodeId: nodeId });
  },

  updateNodeConfig: (nodeId, config) => {
    set((state) => ({
      nodes: state.nodes.map(node =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, config: { ...node.data.config, ...config } } }
          : node
      ),
    }));
    get().validateAgent();
  },

  togglePalette: () => set((state) => ({ isPaletteOpen: !state.isPaletteOpen })),
  toggleInspector: () => set((state) => ({ isInspectorOpen: !state.isInspectorOpen })),
  toggleSimulation: () => set((state) => ({ isSimulationMode: !state.isSimulationMode })),
  toggleChat: () => set((state) => ({ isChatOpen: !state.isChatOpen })),

  validateAgent: () => {
    // ... existing validation logic ...
    const { nodes, edges, currentAgent } = get();
    const issues: ValidationIssue[] = [];
    const nodeTypes = nodes.map(n => n.data.type);
    if (!nodeTypes.includes('agent-goal')) { issues.push({ id: 'missing-goal', severity: 'error', message: 'Agent must have a Goal & Persona node', category: 'Core Logic', }); }
    if (!nodeTypes.includes('agent-brain')) { issues.push({ id: 'missing-brain', severity: 'error', message: 'Agent must have an Agent Brain configuration', category: 'Core Logic', }); }
    if (!nodeTypes.includes('guardrails')) { issues.push({ id: 'missing-guardrails', severity: 'error', message: 'Agent must have Guardrails configured', category: 'Governance', }); }
    if (currentAgent?.environment === 'production') {
      if (!nodeTypes.includes('ops-policy')) { issues.push({ id: 'prod-ops', severity: 'error', message: 'Production agents require an Ops Policy (SLA/Cost)', category: 'Operations', }); }
      if (!nodeTypes.includes('human-control')) { issues.push({ id: 'prod-human', severity: 'warning', message: 'Production agents should have Human Control oversight', category: 'Governance', }); }
    }
    const hasEntry = nodeTypes.some(t => t === 'trigger' || t === 'input-channel');
    if (!hasEntry && nodes.length > 0) { issues.push({ id: 'missing-entry', severity: 'warning', message: 'Agent has no Entry Point (Trigger or Input Channel)', category: 'Flow', }); }
    nodes.forEach(node => {
      // Backend now handles isolated nodes by auto-connecting to END. Warning removed.
      // const hasConnection = edges.some(e => e.source === node.id || e.target === node.id);
      // if (!hasConnection && nodes.length > 1) { issues.push({ id: `isolated-${node.id}`, nodeId: node.id, severity: 'warning', message: `${node.data.label} is not connected to the agent graph`, category: 'Structure', }); }
    });
    const guardrailNode = nodes.find(n => n.data.type === 'guardrails');
    if (guardrailNode) {
      const brainNodes = nodes.filter(n => n.data.type === 'agent-brain');
      brainNodes.forEach(node => {
        const isConnectedToGuardrails = edges.some(e => (e.source === node.id && e.target === guardrailNode.id) || (e.target === node.id && e.source === guardrailNode.id));
        if (!isConnectedToGuardrails) { issues.push({ id: `guardrail-${node.id}`, nodeId: node.id, severity: 'error', message: `Agent Brain must be connected to Guardrails`, category: 'Safety', }); }
      });
    }
    const isValid = issues.filter(i => i.severity === 'error').length === 0;
    set({
      validationIssues: issues,
      currentAgent: get().currentAgent ? { ...get().currentAgent!, isValid, validationIssues: issues } : null
    });
  },

  executeAgent: async (input: string) => {
    const { currentAgent, nodes, edges } = get();
    if (!currentAgent) throw new Error("No active agent");

    const payload = {
      agent_id: currentAgent.id,
      nodes: nodes.map(n => ({
        id: n.id,
        type: n.data.type,
        label: n.data.label,
        config: n.data.config
      })),
      edges: edges.map(e => ({
        id: e.id,
        source: e.source,
        target: e.target
      })),
      input_data: { input }
    };

    try {
      const response = await fetch('http://localhost:8000/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Execution failed');
      }

      return await response.json();
    } catch (error) {
      console.error("Execution error:", error);
      throw error;
    }
  }
}));
