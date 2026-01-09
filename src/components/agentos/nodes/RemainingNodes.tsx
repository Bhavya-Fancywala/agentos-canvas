import { memo } from 'react';
import { NodeProps } from '@xyflow/react';
import { BaseNode } from './BaseNode';
import { useAgentStore } from '@/store/agentStore';
import { Book, Database, Wrench, Globe, Send, CheckSquare, Shield, UserCheck, Settings, Mail, Users, FileText } from 'lucide-react';

// Data Nodes
export const KnowledgeBaseNode = memo((props: NodeProps) => {
    const { selectNode } = useAgentStore();
    return <BaseNode {...props} icon={Book} label="Knowledge" category="Data" colorClass="text-cyan-500 bg-cyan-500/10" onConfigClick={() => selectNode(props.id)} />;
});

export const MemoryStoreNode = memo((props: NodeProps) => {
    const { selectNode } = useAgentStore();
    return <BaseNode {...props} icon={Database} label="Memory" category="Data" colorClass="text-cyan-500 bg-cyan-500/10" onConfigClick={() => selectNode(props.id)} />;
});

// SMB Entry Nodes
export const EmailReceiverNode = memo((props: NodeProps) => {
    const { selectNode } = useAgentStore();
    return <BaseNode {...props} icon={Mail} label="Email Inbox" category="Entry" colorClass="text-indigo-500 bg-indigo-500/10" onConfigClick={() => selectNode(props.id)} />;
});

// Execution Nodes
export const ToolDefinitionNode = memo((props: NodeProps) => {
    const { selectNode } = useAgentStore();
    return <BaseNode {...props} icon={Wrench} label="Tool" category="Execution" colorClass="text-red-500 bg-red-500/10" onConfigClick={() => selectNode(props.id)} />;
});

export const ApiActionNode = memo((props: NodeProps) => {
    const { selectNode } = useAgentStore();
    return <BaseNode {...props} icon={Globe} label="API Action" category="Execution" colorClass="text-red-500 bg-red-500/10" onConfigClick={() => selectNode(props.id)} />;
});

export const CrmToolNode = memo((props: NodeProps) => {
    const { selectNode } = useAgentStore();
    return <BaseNode {...props} icon={Users} label="CRM" category="Execution" colorClass="text-blue-500 bg-blue-500/10" onConfigClick={() => selectNode(props.id)} />;
});

export const DocGeneratorNode = memo((props: NodeProps) => {
    const { selectNode } = useAgentStore();
    return <BaseNode {...props} icon={FileText} label="Doc Gen" category="Execution" colorClass="text-pink-500 bg-pink-500/10" onConfigClick={() => selectNode(props.id)} />;
});

// Exit Nodes
export const OutputChannelNode = memo((props: NodeProps) => {
    const { selectNode } = useAgentStore();
    return <BaseNode {...props} icon={Send} label="Output" category="Exit" colorClass="text-emerald-500 bg-emerald-500/10" onConfigClick={() => selectNode(props.id)} />;
});

export const ActionResultNode = memo((props: NodeProps) => {
    const { selectNode } = useAgentStore();
    return <BaseNode {...props} icon={CheckSquare} label="Result" category="Exit" colorClass="text-emerald-500 bg-emerald-500/10" onConfigClick={() => selectNode(props.id)} />;
});

// Governance Nodes
export const GuardrailsNode = memo((props: NodeProps) => {
    const { selectNode } = useAgentStore();
    return <BaseNode {...props} icon={Shield} label="Guardrails" category="Governance" colorClass="text-orange-500 bg-orange-500/10" onConfigClick={() => selectNode(props.id)} />;
});

export const HumanControlNode = memo((props: NodeProps) => {
    const { selectNode } = useAgentStore();
    return <BaseNode {...props} icon={UserCheck} label="Human" category="Governance" colorClass="text-orange-500 bg-orange-500/10" onConfigClick={() => selectNode(props.id)} />;
});

// Infrastructure Nodes
export const OpsPolicyNode = memo((props: NodeProps) => {
    const { selectNode } = useAgentStore();
    return <BaseNode {...props} icon={Settings} label="Ops Policy" category="Infrastructure" colorClass="text-slate-500 bg-slate-500/10" onConfigClick={() => selectNode(props.id)} />;
});
