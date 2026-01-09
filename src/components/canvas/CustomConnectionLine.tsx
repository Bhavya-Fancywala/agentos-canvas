import { ConnectionLineComponentProps, getSmoothStepPath } from '@xyflow/react';

export function CustomConnectionLine({
    fromX,
    fromY,
    toX,
    toY,
    fromPosition,
    toPosition,
}: ConnectionLineComponentProps) {
    const [edgePath] = getSmoothStepPath({
        sourceX: fromX,
        sourceY: fromY,
        sourcePosition: fromPosition,
        targetX: toX,
        targetY: toY,
        targetPosition: toPosition,
    });

    return (
        <g>
            <path
                fill="none"
                stroke="hsl(var(--muted-foreground))"
                strokeWidth={2}
                className="animated"
                d={edgePath}
                strokeDasharray="5, 5"
            />
            <circle
                cx={toX}
                cy={toY}
                fill="hsl(var(--background))"
                r={4}
                stroke="hsl(var(--primary))"
                strokeWidth={2}
            />
        </g>
    );
}
