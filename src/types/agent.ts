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

// Consolidated Node Categories
export type NodeCategory =
  | 'entry'
  | 'processing'
  | 'data'
  | 'execution'
  | 'exit'
  | 'governance'
  | 'infrastructure';

// Node Type Definition
export interface NodeTypeDefinition {
  type: string;
  label: string;
  description: string;
  category: NodeCategory;
  icon: string;
  requiredConnections?: string[];
  riskLevel?: 'low' | 'medium' | 'high' | 'critical';
}

// Category Configuration
export const NODE_CATEGORIES: Record<NodeCategory, { label: string; color: string }> = {
  entry: { label: 'Inputs & Triggers', color: 'node-intent' },
  processing: { label: 'Core Logic', color: 'node-intelligence' },
  data: { label: 'Knowledge & Memory', color: 'node-memory' },
  execution: { label: 'Actions & Tools', color: 'node-capability' },
  exit: { label: 'Outputs & Channels', color: 'node-environment' },
  governance: { label: 'Safety & Governance', color: 'node-safety' },
  infrastructure: { label: 'Operations', color: 'node-cost' },
};

// Consolidated Node Types
export const NODE_TYPES: NodeTypeDefinition[] = [
  // 1. Inputs & Triggers
  {
    type: 'trigger',
    label: 'Trigger',
    description: 'Schedule (Cron), Webhook, or Event that starts the agent',
    category: 'entry',
    icon: 'Zap',
    riskLevel: 'low'
  },
  {
    type: 'input-channel',
    label: 'Input Channel',
    description: 'Ingress points: Voice, WhatsApp, Email, Chat',
    category: 'entry',
    icon: 'MessageSquare',
    riskLevel: 'low'
  },

  // 2. Core Logic
  {
    type: 'agent-goal',
    label: 'Goal & Persona',
    description: 'Defines identity, core directive, and success outcomes',
    category: 'processing',
    icon: 'Target',
    requiredConnections: [],
    riskLevel: 'low'
  },
  {
    type: 'agent-brain',
    label: 'Agent Brain',
    description: 'LLM configuration, reasoning model, and prompt strategy',
    category: 'processing',
    icon: 'Brain',
    requiredConnections: ['guardrails'],
    riskLevel: 'high'
  },
  {
    type: 'logic-router',
    label: 'Logic Router',
    description: 'Conditional branching, classification, and flow control',
    category: 'processing',
    icon: 'GitFork',
    riskLevel: 'medium'
  },

  // 3. Knowledge & Memory
  {
    type: 'knowledge-base',
    label: 'Knowledge Base',
    description: 'Static knowledge (PDFs, Docs) for RAG',
    category: 'data',
    icon: 'Book',
    riskLevel: 'medium'
  },
  {
    type: 'memory-config',
    label: 'Memory Store',
    description: 'Short-term session and long-term user history',
    category: 'data',
    icon: 'Database',
    riskLevel: 'medium'
  },

  // 4. Actions & Tools
  {
    type: 'tool-definition',
    label: 'Tool Definition',
    description: 'Native functions and internal tool bindings',
    category: 'execution',
    icon: 'Wrench',
    riskLevel: 'high'
  },
  {
    type: 'api-action',
    label: 'API Action',
    description: 'External REST/GraphQL calls and integrations',
    category: 'execution',
    icon: 'Globe',
    riskLevel: 'medium'
  },

  // 5. Outputs & Channels
  {
    type: 'output-channel',
    label: 'Output Channel',
    description: 'Response delivery: SMS, Voice, API response',
    category: 'exit',
    icon: 'Send',
    riskLevel: 'low'
  },
  {
    type: 'action-result',
    label: 'Action Result',
    description: 'Post-processing logic for tool outputs',
    category: 'exit',
    icon: 'CheckSquare',
    riskLevel: 'low'
  },

  // 6. Safety & Governance
  {
    type: 'guardrails',
    label: 'Guardrails',
    description: 'Safety policies, PII masking, and legal compliance',
    category: 'governance',
    icon: 'Shield',
    riskLevel: 'critical'
  },
  {
    type: 'human-control',
    label: 'Human Control',
    description: 'Approval steps, human handoff, and oversight',
    category: 'governance',
    icon: 'UserCheck',
    riskLevel: 'medium'
  },

  // 7. Operations
  {
    type: 'ops-policy',
    label: 'Ops Policy',
    description: 'SLA, Cost limits, Rate limiting, and Logging',
    category: 'infrastructure',
    icon: 'Settings',
    riskLevel: 'medium'
  },
  // SMB Specific Nodes
  {
    type: 'email-receiver',
    label: 'Email Inbox',
    description: 'Listen for new emails (Gmail/Outlook) to trigger workflows',
    category: 'entry',
    icon: 'Mail',
    riskLevel: 'low'
  },
  {
    type: 'crm-tool',
    label: 'CRM Manager',
    description: 'Manage customers in HubSpot, Salesforce, or Pipedrive',
    category: 'execution',
    icon: 'Users',
    riskLevel: 'medium'
  },
  {
    type: 'doc-generator',
    label: 'Doc Generator',
    description: 'Create Invoices, Contracts, and Reports (PDF/Docs)',
    category: 'execution',
    icon: 'FileText',
    riskLevel: 'low'
  },
];

export const getNodesByCategory = (category: NodeCategory): NodeTypeDefinition[] => {
  return NODE_TYPES.filter(node => node.category === category);
};
