import { memo } from 'react';
import { NodeProps } from '@xyflow/react';
import { Zap } from 'lucide-react';
import { BaseNode } from '../BaseNode';
import { useAgentStore } from '@/store/agentStore';

export const TriggerNode = memo((props: NodeProps) => {
    const { toggleInspector, selectNode } = useAgentStore();

    const handleClick = () => {
        selectNode(props.id);
        // Ideally this opens the new Modal, but for now we hook into existing selection/inspector flow or custom modal
        // existing flow: selectNode -> Inspector opens.
        // user wants: Click -> opens NodeConfigModal.
        // We'll set an "isConfigModalOpen" state later. For now, we perform selection.
    };

    return (
        <BaseNode
            {...props}
            icon={Zap}
            label="Trigger"
            category="Entry"
            colorClass="text-amber-500 bg-amber-500/10"
            handleType="source" // Triggers usually only start
            onConfigClick={handleClick}
        />
    );
});
