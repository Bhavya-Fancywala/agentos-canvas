import { memo } from 'react';
import { NodeProps } from '@xyflow/react';
import { Target } from 'lucide-react';
import { BaseNode } from '../BaseNode';
import { useAgentStore } from '@/store/agentStore';

export const AgentGoalNode = memo((props: NodeProps) => {
    const { selectNode } = useAgentStore();
    return (
        <BaseNode
            {...props}
            icon={Target}
            label="Goal & Persona"
            category="Processing"
            colorClass="text-purple-500 bg-purple-500/10"
            onConfigClick={() => selectNode(props.id)}
        />
    );
});
