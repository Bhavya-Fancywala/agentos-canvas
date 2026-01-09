// Node Configuration Types for AgentOS

export type NodeEnvironment = 'draft' | 'sandbox' | 'production';

// --- ENTRY NODES ---

export interface TriggerConfig {
    triggerType: 'cron' | 'webhook' | 'event' | 'manual';
    scheduleExpression?: string; // Cron expression
    eventSchema?: string; // JSON Schema for event validation
    environment: NodeEnvironment;
}

export interface InputChannelConfig {
    channelType: 'voice' | 'whatsapp' | 'email' | 'chat' | 'api';
    authenticationRequired: boolean;
    timeoutSeconds: number;
    metadataMapping: {
        callerId?: string;
        userId?: string;
        threadId?: string;
    };
}

// --- PROCESSING NODES ---

export interface AgentGoalConfig {
    missionStatement: string;
    successCriteria: string[];
    personaTone: 'professional' | 'casual' | 'empathetic' | 'strict';
    allowedScope: string[];
    forbiddenScope: string[];
}

export interface AgentBrainConfig {
    llmModel: 'gpt-4' | 'gpt-3.5-turbo' | 'claude-3-opus' | 'claude-3-sonnet';
    temperature: number;
    reasoningStrategy: 'react' | 'plan-execute' | 'classify-act';
    confidenceThreshold: number; // 0-1
    clarificationBehavior: 'always' | 'threshold' | 'never';
    maxRetries: number;
}

export interface LogicRouterConfig {
    routingType: 'rule-based' | 'llm-based';
    conditions: Array<{
        field: string;
        operator: 'equals' | 'contains' | 'gt' | 'lt';
        value: string;
        targetNodeId: string;
    }>;
    fallbackPathNodeId?: string;
    confidenceThreshold?: number;
}

// --- DATA NODES ---

export interface KnowledgeBaseConfig {
    sourceType: 'pdf' | 'docs' | 'db' | 'api';
    sourceLocation: string;
    embeddingModel: 'openai-ada-002' | 'cohere-embed-v3';
    refreshPolicy: 'manual' | 'daily' | 'hourly' | 'realtime';
}

export interface MemoryStoreConfig {
    memoryType: 'session' | 'long-term';
    retentionDays: number;
    piiRedaction: boolean;
    personalizationEnabled: boolean;
}

// --- EXECUTION NODES ---

export interface ToolDefinitionConfig {
    toolName: string;
    description: string;
    inputSchema: string; // JSON Schema
    outputSchema: string; // JSON Schema
    permissionLevel: 'read' | 'write' | 'admin';
    costImpact: 'low' | 'medium' | 'high';
    failureBehavior: 'fail-fast' | 'retry' | 'continue';
}

export interface ApiActionConfig {
    apiName: string;
    baseUrl: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    headers: Record<string, string>;
    authenticationType: 'none' | 'apiKey' | 'oauth';
    apiKey?: string; // Cached/masked
    retryPolicy: {
        maxAttempts: number;
        backoffMultiplier: number;
    };
    timeoutSeconds: number;
}

// --- EXIT NODES ---

export interface OutputChannelConfig {
    outputType: 'voice' | 'sms' | 'email' | 'api';
    formattingRules: string;
    language: string;
    rateLimitPerMinute?: number;
}

export interface ActionResultConfig {
    successCriteria: string;
    failureHandling: 'retry' | 'escalate' | 'ignore';
    followUpActionNodeId?: string;
    auditLogging: boolean;
}

// --- GOVERNANCE NODES ---

export interface GuardrailsConfig {
    forbiddenActions: string[];
    piiMaskingRules: Array<'email' | 'phone' | 'ssn' | 'credit-card'>;
    legalConstraints: string[];
    escalationTriggers: string[];
}

export interface HumanControlConfig {
    approvalRequired: boolean;
    approvalRoles: string[];
    handoffConditions: string[];
    assignedOwner?: string; // User ID or Email
}

// --- INFRASTRUCTURE NODES ---

export interface OpsPolicyConfig {
    slaTargetResponseTimeMs: number;
    costBudgetMonthlyUsd: number;
    rateLimitRequestsPerMin: number;
    loggingLevel: 'debug' | 'info' | 'warn' | 'error';
    environmentRestrictions: NodeEnvironment[];
}

// Union type for all configs
export type AgentOSNodeConfig =
    | TriggerConfig
    | InputChannelConfig
    | AgentGoalConfig
    | AgentBrainConfig
    | LogicRouterConfig
    | KnowledgeBaseConfig
    | MemoryStoreConfig
    | ToolDefinitionConfig
    | ApiActionConfig
    | OutputChannelConfig
    | ActionResultConfig
    | GuardrailsConfig
    | HumanControlConfig
    | OpsPolicyConfig;
