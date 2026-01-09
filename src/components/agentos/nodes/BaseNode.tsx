import { Handle, Position } from '@xyflow/react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import { useAgentStore } from '@/store/agentStore';

interface BaseNodeProps {
    id: string;
    data: any;
    selected?: boolean;
    icon: LucideIcon;
    label: string;
    category: string;
    colorClass: string;
    handleType?: 'source' | 'target' | 'both';
    onConfigClick?: () => void;
}

export function BaseNode({
    id,
    data,
    selected,
    icon: Icon,
    label,
    category,
    colorClass,
    handleType = 'both',
    onConfigClick
}: BaseNodeProps) {
    const { togglePalette } = useAgentStore(); // Just grabbing store to access validation status later if needed

    return (
        <div
            className={cn(
                "relative group min-w-[180px] rounded-xl border border-border/50 bg-card/80 backdrop-blur-sm shadow-sm transition-all duration-300",
                selected && "ring-2 ring-primary shadow-lg scale-[1.02]",
                "hover:shadow-md hover:border-primary/50"
            )}
            onClick={(e) => {
                // Prevent drag propagation if clicking specific interactive elem if any
                if (onConfigClick) {
                    onConfigClick();
                }
            }}
        >
            {/* Handles */}
            {(handleType === 'target' || handleType === 'both') && (
                <Handle
                    type="target"
                    position={Position.Top}
                    className="!w-3 !h-3 !-top-1.5 !bg-muted-foreground/50 !border-2 !border-background transition-colors hover:!bg-primary"
                />
            )}

            {(handleType === 'source' || handleType === 'both') && (
                <Handle
                    type="source"
                    position={Position.Bottom}
                    className="!w-3 !h-3 !-bottom-1.5 !bg-muted-foreground/50 !border-2 !border-background transition-colors hover:!bg-primary"
                />
            )}

            {/* Header / Icon */}
            <div className="flex items-center gap-3 p-3 pb-2">
                <div className={cn("p-2 rounded-lg shrink-0", colorClass)}>
                    <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{label}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{category}</p>
                </div>
            </div>

            {/* Config Preview / Body */}
            <div className="px-3 pb-3 pt-1">
                {data.config?.name && (
                    <p className="text-xs text-muted-foreground italic truncate">
                        "{data.config.name}"
                    </p>
                )}
                {!data.config?.name && (
                    <p className="text-xs text-muted-foreground/50 italic">
                        Tap to configure...
                    </p>
                )}
            </div>

            {/* Status Indicators (Corner) */}
            <div className="absolute top-2 right-2 flex gap-1">
                {/* Could add validation warning icon here */}
            </div>
        </div>
    );
}
