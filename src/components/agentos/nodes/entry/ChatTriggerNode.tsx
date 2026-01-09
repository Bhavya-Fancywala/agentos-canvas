import { memo } from 'react';
import { NodeProps } from '@xyflow/react';
import { MessageSquare } from 'lucide-react';
import { BaseNode } from '../BaseNode';
import { useAgentStore } from '@/store/agentStore';

export const ChatTriggerNode = memo((props: NodeProps) => {
    const { selectNode } = useAgentStore();

    const handleClick = () => {
        selectNode(props.id);
    };

    return (
        <BaseNode
            {...props}
            icon={MessageSquare}
            label="On Chat Message"
            category="Entry"
            colorClass="text-blue-500 bg-blue-500/10"
            handleType="source"
            onConfigClick={handleClick}
        />
    );
});
