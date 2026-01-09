// AgentOS Type Definitions

export type Environment = 'draft' | 'sandbox' | 'production';

export type ValidationSeverity = 'error' | 'warning' | 'info';

export interface ValidationIssue {
  id: string;
  nodeId?: string;
  severity: ValidationSeverity;
  message: string;
  category: string;
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  environment: Environment;
  createdAt: Date;
  updatedAt: Date;
  isValid: boolean;
  validationIssues: ValidationIssue[];
}

export type NodeCategory = 
  | 'intent'
  | 'intelligence'
  | 'memory'
  | 'capability'
  | 'safety'
  | 'human'
  | 'time'
  | 'cost'
  | 'observability'
  | 'environment'
  | 'testing';

export interface NodeTypeDefinition {
  type: string;
  label: string;
  description: string;
  category: NodeCategory;
  icon: string;
  requiredConnections?: string[];
  riskLevel?: 'low' | 'medium' | 'high' | 'critical';
}

export const NODE_CATEGORIES: Record<NodeCategory, { label: string; color: string }> = {
  intent: { label: 'Intent & Control', color: 'node-intent' },
  intelligence: { label: 'Intelligence & Reasoning', color: 'node-intelligence' },
  memory: { label: 'Memory & Knowledge', color: 'node-memory' },
  capability: { label: 'Capabilities', color: 'node-capability' },
  safety: { label: 'Safety & Compliance', color: 'node-safety' },
  human: { label: 'Human Control', color: 'node-human' },
  time: { label: 'Time & Reliability', color: 'node-time' },
  cost: { label: 'Cost & Business', color: 'node-cost' },
  observability: { label: 'Observability', color: 'node-observability' },
  environment: { label: 'Environment', color: 'node-environment' },
  testing: { label: 'Testing', color: 'node-testing' },
};

export const NODE_TYPES: NodeTypeDefinition[] = [
  // Intent & Control
  { type: 'goal', label: 'Goal', description: 'Declares the primary objective of the agent', category: 'intent', icon: 'Target', requiredConnections: ['outcome'], riskLevel: 'low' },
  { type: 'outcome', label: 'Outcome', description: 'Defines expected successful outcomes', category: 'intent', icon: 'CheckCircle2', riskLevel: 'low' },
  
  // Intelligence & Reasoning
  { type: 'agent-brain', label: 'Agent Brain', description: 'Core reasoning engine configuration', category: 'intelligence', icon: 'Brain', requiredConnections: ['guardrails'], riskLevel: 'high' },
  { type: 'multi-agent-link', label: 'Multi-Agent Link', description: 'Declares collaboration with other agents', category: 'intelligence', icon: 'Network', riskLevel: 'medium' },
  
  // Memory & Knowledge
  { type: 'memory', label: 'Memory', description: 'Declares memory scope and retention policies', category: 'memory', icon: 'Database', riskLevel: 'medium' },
  { type: 'knowledge-source', label: 'Knowledge Source', description: 'External knowledge bases and data sources', category: 'memory', icon: 'BookOpen', riskLevel: 'medium' },
  
  // Capabilities
  { type: 'tool-registry', label: 'Tool Registry', description: 'Declares available tools and their permissions', category: 'capability', icon: 'Wrench', requiredConnections: ['guardrails'], riskLevel: 'high' },
  
  // Safety & Compliance
  { type: 'guardrails', label: 'Guardrails & Policy', description: 'Safety constraints and operational policies', category: 'safety', icon: 'Shield', riskLevel: 'critical' },
  { type: 'legal-compliance', label: 'Legal & Compliance', description: 'Regulatory and legal framework mappings', category: 'safety', icon: 'Scale', riskLevel: 'critical' },
  { type: 'data-sensitivity', label: 'Data Sensitivity & Masking', description: 'PII handling and data classification rules', category: 'safety', icon: 'Lock', riskLevel: 'critical' },
  
  // Human Control
  { type: 'approval', label: 'Approval', description: 'Declares actions requiring human approval', category: 'human', icon: 'UserCheck', requiredConnections: ['accountability-owner'], riskLevel: 'low' },
  { type: 'human-handoff', label: 'Human Handoff', description: 'Conditions for escalation to human operators', category: 'human', icon: 'Users', riskLevel: 'low' },
  { type: 'accountability-owner', label: 'Accountability Owner', description: 'Assigns ownership and responsibility', category: 'human', icon: 'UserCog', riskLevel: 'low' },
  
  // Time & Reliability
  { type: 'schedule-trigger', label: 'Schedule & Trigger', description: 'Temporal activation conditions', category: 'time', icon: 'Clock', riskLevel: 'low' },
  { type: 'sla-response', label: 'SLA & Response Time', description: 'Service level commitments', category: 'time', icon: 'Timer', riskLevel: 'medium' },
  { type: 'graceful-degradation', label: 'Graceful Degradation', description: 'Fallback behaviors and failure modes', category: 'time', icon: 'AlertTriangle', riskLevel: 'medium' },
  
  // Cost & Business
  { type: 'cost-control', label: 'Cost & Usage Control', description: 'Budget limits and usage quotas', category: 'cost', icon: 'DollarSign', riskLevel: 'medium' },
  { type: 'business-kpi', label: 'Business KPI Binding', description: 'Links agent to business metrics', category: 'cost', icon: 'TrendingUp', riskLevel: 'low' },
  
  // Observability
  { type: 'analytics-feedback', label: 'Analytics & Feedback', description: 'Telemetry and feedback collection', category: 'observability', icon: 'BarChart3', riskLevel: 'low' },
  { type: 'exception-dispute', label: 'Exception & Dispute Resolution', description: 'Error handling and dispute workflows', category: 'observability', icon: 'AlertOctagon', riskLevel: 'medium' },
  
  // Environment
  { type: 'environment', label: 'Environment', description: 'Runtime environment configuration', category: 'environment', icon: 'Server', riskLevel: 'low' },
  
  // Testing
  { type: 'sandbox-simulation', label: 'Sandbox / Simulation', description: 'Testing and simulation configuration', category: 'testing', icon: 'FlaskConical', riskLevel: 'low' },
];

export const getNodesByCategory = (category: NodeCategory): NodeTypeDefinition[] => {
  return NODE_TYPES.filter(node => node.category === category);
};
