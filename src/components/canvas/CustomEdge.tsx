import {
    BaseEdge,
    EdgeProps,
    getSmoothStepPath,
    EdgeLabelRenderer,
    useReactFlow,
} from '@xyflow/react';
import { cn } from '@/lib/utils';
import { useAgentStore } from '@/store/agentStore';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

export default function CustomEdge({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    markerEnd,
    selected,
}: EdgeProps) {
    const { deleteElements } = useReactFlow();
    const [edgePath, labelX, labelY] = getSmoothStepPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });

    const { isSimulationMode } = useAgentStore();

    const onEdgeClick = (evt: React.MouseEvent) => {
        evt.stopPropagation();
        deleteElements({ edges: [{ id }] });
    };

    return (
        <>
            {/* 1. Invisible Interaction Path (Wider, makes clicking easier) */}
            <path
                d={edgePath}
                strokeWidth={20}
                stroke="transparent"
                fill="none"
                className="cursor-pointer"
            />

            {/* 2. Glow Path (Visible on Selection/Simulation) */}
            <path
                d={edgePath}
                strokeWidth={6}
                stroke="hsl(var(--primary))"
                fill="none"
                className={cn(
                    "transition-all duration-300 opacity-0",
                    (selected || isSimulationMode) && "opacity-40 blur-sm"
                )}
            />

            {/* 3. Base Edge Path */}
            <BaseEdge
                path={edgePath}
                markerEnd={markerEnd}
                style={{
                    ...style,
                    strokeWidth: 2,
                    stroke: selected ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))',
                    transition: 'all 0.3s ease',
                }}
            />

            {/* 4. Animated Data Packet (Simulation Mode or Selected) */}
            {(selected || isSimulationMode) && (
                <circle r="3" fill="hsl(var(--primary))">
                    <animateMotion
                        dur={isSimulationMode ? "1.5s" : "3s"}
                        repeatCount="indefinite"
                        path={edgePath}
                        calcMode="linear"
                    />
                </circle>
            )}

            {/* 5. Floating Delete Button (Only on Selection) */}
            {selected && (
                <EdgeLabelRenderer>
                    <div
                        style={{
                            position: 'absolute',
                            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                            pointerEvents: 'all',
                        }}
                        className="nodrag nopan"
                    >
                        <Button
                            variant="destructive"
                            size="icon"
                            className="h-8 w-8 rounded-full shadow-xl border-2 border-background animate-in zoom-in-50 duration-200 hover:scale-110"
                            onClick={onEdgeClick}
                            title="Delete Connection"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </EdgeLabelRenderer>
            )}
        </>
    );
}
