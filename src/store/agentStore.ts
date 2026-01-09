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
  
  // Validation
  validateAgent: () => void;
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
      type: 'agentNode',
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
  
  validateAgent: () => {
    const { nodes, edges, currentAgent } = get();
    const issues: ValidationIssue[] = [];
    
    // Check for required nodes
    const nodeTypes = nodes.map(n => n.data.type);
    
    if (!nodeTypes.includes('goal')) {
      issues.push({
        id: 'missing-goal',
        severity: 'error',
        message: 'Agent must have a Goal node',
        category: 'Intent',
      });
    }
    
    if (!nodeTypes.includes('guardrails')) {
      issues.push({
        id: 'missing-guardrails',
        severity: 'error',
        message: 'Agent must have Guardrails & Policy node',
        category: 'Safety',
      });
    }
    
    if (!nodeTypes.includes('accountability-owner')) {
      issues.push({
        id: 'missing-owner',
        severity: 'error',
        message: 'Agent must have an Accountability Owner',
        category: 'Human Control',
      });
    }
    
    // Production-specific validations
    if (currentAgent?.environment === 'production') {
      if (!nodeTypes.includes('legal-compliance')) {
        issues.push({
          id: 'prod-legal',
          severity: 'error',
          message: 'Production agents require Legal & Compliance mapping',
          category: 'Compliance',
        });
      }
      
      if (!nodeTypes.includes('sla-response')) {
        issues.push({
          id: 'prod-sla',
          severity: 'error',
          message: 'Production agents require SLA & Response Time definition',
          category: 'Reliability',
        });
      }
      
      if (!nodeTypes.includes('cost-control')) {
        issues.push({
          id: 'prod-cost',
          severity: 'warning',
          message: 'Production agents should have Cost & Usage Controls',
          category: 'Cost',
        });
      }
      
      if (!nodeTypes.includes('graceful-degradation')) {
        issues.push({
          id: 'prod-degradation',
          severity: 'warning',
          message: 'Production agents should define Graceful Degradation behavior',
          category: 'Reliability',
        });
      }
    }
    
    // Check for isolated nodes
    nodes.forEach(node => {
      const hasConnection = edges.some(e => e.source === node.id || e.target === node.id);
      if (!hasConnection && nodes.length > 1) {
        issues.push({
          id: `isolated-${node.id}`,
          nodeId: node.id,
          severity: 'warning',
          message: `${node.data.label} is not connected to the agent graph`,
          category: 'Structure',
        });
      }
    });
    
    // Check high-risk nodes have guardrails connection
    const guardrailNode = nodes.find(n => n.data.type === 'guardrails');
    if (guardrailNode) {
      const highRiskNodes = nodes.filter(n => 
        n.data.riskLevel === 'high' || n.data.riskLevel === 'critical'
      );
      
      highRiskNodes.forEach(node => {
        const isConnectedToGuardrails = edges.some(e => 
          (e.source === node.id && e.target === guardrailNode.id) ||
          (e.target === node.id && e.source === guardrailNode.id)
        );
        
        if (!isConnectedToGuardrails) {
          issues.push({
            id: `guardrail-${node.id}`,
            nodeId: node.id,
            severity: 'error',
            message: `${node.data.label} must be connected to Guardrails`,
            category: 'Safety',
          });
        }
      });
    }
    
    const isValid = issues.filter(i => i.severity === 'error').length === 0;
    
    set({ 
      validationIssues: issues,
      currentAgent: get().currentAgent 
        ? { ...get().currentAgent!, isValid, validationIssues: issues }
        : null
    });
  },
}));
