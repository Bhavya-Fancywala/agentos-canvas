import { memo } from 'react';
import { NodeProps } from '@xyflow/react';
import { Brain } from 'lucide-react';
import { BaseNode } from '../BaseNode';
import { useAgentStore } from '@/store/agentStore';

export const AgentBrainNode = memo((props: NodeProps) => {
    const { selectNode } = useAgentStore();
    return (
        <BaseNode
            {...props}
            icon={Brain}
            label="Agent Brain"
            category="Processing"
            colorClass="text-pink-500 bg-pink-500/10"
            onConfigClick={() => selectNode(props.id)}
        />
    );
});
