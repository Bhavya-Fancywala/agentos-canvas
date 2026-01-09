import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { NODE_CATEGORIES, NODE_TYPES, NodeCategory } from '@/types/agent';
import { useAgentStore } from '@/store/agentStore';
import { ChevronRight, ChevronDown, GripVertical, X, Terminal } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';

const categoryOrder: NodeCategory[] = [
  'entry',
  'processing',
  'data',
  'execution',
  'exit',
  'governance',
  'infrastructure',
];

const iconColorMap: Record<NodeCategory, string> = {
  entry: 'text-node-intent bg-node-intent/10',
  processing: 'text-node-intelligence bg-node-intelligence/10',
  data: 'text-node-memory bg-node-memory/10',
  execution: 'text-node-capability bg-node-capability/10',
  exit: 'text-node-environment bg-node-environment/10',
  governance: 'text-node-safety bg-node-safety/10',
  infrastructure: 'text-node-cost bg-node-cost/10',
};

export function NodePalette() {
  const { isPaletteOpen, togglePalette, addNode } = useAgentStore();
  const [expandedCategory, setExpandedCategory] = useState<NodeCategory | null>('entry');
  const [isLogsExpanded, setIsLogsExpanded] = useState(true);

  const handleDragStart = (e: React.DragEvent, nodeType: string) => {
    e.dataTransfer.setData('application/agentnode', nodeType);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleNodeClick = (nodeType: string) => {
    addNode(nodeType, { x: 400, y: 300 });
  };

  return (
    <AnimatePresence>
      {isPaletteOpen && (
        <motion.div
          initial={{ x: -320, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -320, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="absolute left-4 top-20 bottom-6 w-80 z-20"
        >
          {/* Main Unified Container */}
          <div className="h-full glass-strong rounded-xl overflow-hidden flex flex-col shadow-2xl border border-border/50">

            {/* --- Top Section: Node Categories --- */}
            <div className="flex-1 flex flex-col min-h-0 bg-secondary/5">
              {/* Header */}
              <div className="p-4 border-b border-border/50 flex items-center justify-between shrink-0 bg-background/50">
                <div>
                  <h2 className="font-semibold text-sm text-foreground">Components</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">Drag to canvas</p>
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

              {/* Categories Scroll Area */}
              <ScrollArea className="flex-1">
                <div className="p-2 space-y-1">
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
                            'hover:bg-accent/50',
                            isExpanded && 'bg-accent/30'
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
                                        'p-1.5 rounded-md shrink-0',
                                        iconColorMap[category]
                                      )}>
                                        <IconComponent className="h-4 w-4" />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-foreground truncate">{node.label}</p>
                                      </div>
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

            {/* --- Bottom Section: Logs --- */}
            <div className="shrink-0 border-t border-border/50 bg-background/50">
              <button
                onClick={() => setIsLogsExpanded(!isLogsExpanded)}
                className="w-full p-3 flex items-center justify-between hover:bg-secondary/30 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Terminal className="h-3.5 w-3.5 text-primary" />
                  <span className="text-xs font-semibold uppercase tracking-wider">Agent Logs</span>
                </div>
                <div className="flex items-center gap-2">
                  {isLogsExpanded ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                </div>
              </button>

              <motion.div
                initial={false}
                animate={{ height: isLogsExpanded ? 200 : 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="overflow-hidden"
              >
                <ScrollArea className="h-full bg-black/40 border-t border-border/10">
                  <div className="p-3 space-y-2 font-mono text-[10px]">
                    <div className="flex gap-2">
                      <span className="text-muted-foreground">14:02:22</span>
                      <span className="text-info font-bold">INFO</span>
                      <span className="text-foreground/80">Canvas initialized</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-muted-foreground">14:02:23</span>
                      <span className="text-success font-bold">OK</span>
                      <span className="text-foreground/80">Agent context loaded</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-muted-foreground">14:05:10</span>
                      <span className="text-warning font-bold">WARN</span>
                      <span className="text-foreground/80">Validation: Missing 'Goal' node</span>
                    </div>
                  </div>
                </ScrollArea>
              </motion.div>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
