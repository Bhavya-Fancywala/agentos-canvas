import { memo } from 'react';
import { NodeProps } from '@xyflow/react';
import { GitFork } from 'lucide-react';
import { BaseNode } from '../BaseNode';
import { useAgentStore } from '@/store/agentStore';

export const LogicRouterNode = memo((props: NodeProps) => {
    const { selectNode } = useAgentStore();
    return (
        <BaseNode
            {...props}
            icon={GitFork}
            label="Logic Router"
            category="Processing"
            colorClass="text-indigo-500 bg-indigo-500/10"
            onConfigClick={() => selectNode(props.id)}
        />
    );
});
