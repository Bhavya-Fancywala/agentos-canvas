import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { NODE_CATEGORIES, NODE_TYPES, NodeCategory } from '@/types/agent';
import { useAgentStore } from '@/store/agentStore';
import { ChevronRight, GripVertical, X } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';

const categoryOrder: NodeCategory[] = [
  'intent',
  'intelligence',
  'memory',
  'capability',
  'safety',
  'human',
  'time',
  'cost',
  'observability',
  'environment',
  'testing',
];

const iconColorMap: Record<NodeCategory, string> = {
  intent: 'text-node-intent bg-node-intent/10',
  intelligence: 'text-node-intelligence bg-node-intelligence/10',
  memory: 'text-node-memory bg-node-memory/10',
  capability: 'text-node-capability bg-node-capability/10',
  safety: 'text-node-safety bg-node-safety/10',
  human: 'text-node-human bg-node-human/10',
  time: 'text-node-time bg-node-time/10',
  cost: 'text-node-cost bg-node-cost/10',
  observability: 'text-node-observability bg-node-observability/10',
  environment: 'text-node-environment bg-node-environment/10',
  testing: 'text-node-testing bg-node-testing/10',
};

export function NodePalette() {
  const { isPaletteOpen, togglePalette, addNode } = useAgentStore();
  const [expandedCategory, setExpandedCategory] = useState<NodeCategory | null>('intent');

  const handleDragStart = (e: React.DragEvent, nodeType: string) => {
    e.dataTransfer.setData('application/agentnode', nodeType);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleNodeClick = (nodeType: string) => {
    // Add node at center of canvas
    addNode(nodeType, { x: 400, y: 300 });
  };

  return (
    <AnimatePresence>
      {isPaletteOpen && (
        <motion.div
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="absolute left-4 top-20 bottom-20 w-72 z-10"
        >
          <div className="h-full glass-strong rounded-xl overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-border/50 flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-sm text-foreground">Node Palette</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Drag to add declarations</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={togglePalette}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Categories */}
            <ScrollArea className="flex-1">
              <div className="p-2">
                {categoryOrder.map((category) => {
                  const categoryInfo = NODE_CATEGORIES[category];
                  const nodes = NODE_TYPES.filter(n => n.category === category);
                  const isExpanded = expandedCategory === category;

                  return (
                    <div key={category} className="mb-1">
                      <button
                        onClick={() => setExpandedCategory(isExpanded ? null : category)}
                        className={cn(
                          'w-full flex items-center gap-2 p-2 rounded-lg text-left transition-colors',
                          'hover:bg-secondary/50',
                          isExpanded && 'bg-secondary/30'
                        )}
                      >
                        <ChevronRight
                          className={cn(
                            'h-4 w-4 text-muted-foreground transition-transform',
                            isExpanded && 'rotate-90'
                          )}
                        />
                        <span className="text-sm font-medium text-foreground">{categoryInfo.label}</span>
                        <span className="ml-auto text-xs text-muted-foreground">{nodes.length}</span>
                      </button>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="pl-4 py-1 space-y-1">
                              {nodes.map((node) => {
                                const IconComponent = (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[node.icon] || LucideIcons.Circle;
                                
                                return (
                                  <div
                                    key={node.type}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, node.type)}
                                    onClick={() => handleNodeClick(node.type)}
                                    className={cn(
                                      'flex items-center gap-3 p-2.5 rounded-lg cursor-grab active:cursor-grabbing',
                                      'border border-transparent hover:border-border/50',
                                      'bg-card/50 hover:bg-card transition-all group'
                                    )}
                                  >
                                    <GripVertical className="h-3 w-3 text-muted-foreground/50 group-hover:text-muted-foreground" />
                                    <div className={cn(
                                      'p-1.5 rounded-md',
                                      iconColorMap[category]
                                    )}>
                                      <IconComponent className="h-4 w-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium text-foreground truncate">{node.label}</p>
                                      <p className="text-xs text-muted-foreground truncate">{node.description}</p>
                                    </div>
                                    {node.riskLevel && (
                                      <span className={cn(
                                        'text-[10px] font-medium px-1.5 py-0.5 rounded uppercase',
                                        node.riskLevel === 'critical' && 'bg-destructive/20 text-destructive',
                                        node.riskLevel === 'high' && 'bg-destructive/15 text-destructive/80',
                                        node.riskLevel === 'medium' && 'bg-warning/20 text-warning',
                                        node.riskLevel === 'low' && 'bg-success/20 text-success',
                                      )}>
                                        {node.riskLevel}
                                      </span>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
