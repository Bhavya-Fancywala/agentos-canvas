import { motion, AnimatePresence } from 'framer-motion';
import { useAgentStore } from '@/store/agentStore';
import { NODE_TYPES, NODE_CATEGORIES, NodeCategory } from '@/types/agent';
import { cn } from '@/lib/utils';
import { X, Trash2, AlertCircle, AlertTriangle, Info, Link2 } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export function NodeInspector() {
  const { 
    isInspectorOpen, 
    toggleInspector, 
    selectedNodeId, 
    nodes, 
    validationIssues,
    removeNode,
    updateNodeConfig,
    selectNode
  } = useAgentStore();
  
  const selectedNode = nodes.find(n => n.id === selectedNodeId);
  const nodeType = selectedNode ? NODE_TYPES.find(t => t.type === selectedNode.data.type) : null;
  const nodeIssues = validationIssues.filter(i => i.nodeId === selectedNodeId);
  
  if (!isInspectorOpen) return null;
  
  return (
    <motion.div
      initial={{ x: 320, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 320, opacity: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="absolute right-4 top-20 bottom-20 w-80 z-10"
    >
      <div className="h-full glass-strong rounded-xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border/50 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-sm text-foreground">Node Inspector</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {selectedNode ? 'Configure declaration' : 'Select a node'}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={toggleInspector}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <ScrollArea className="flex-1">
          <AnimatePresence mode="wait">
            {selectedNode && nodeType ? (
              <motion.div
                key={selectedNode.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-4 space-y-4"
              >
                {/* Node header */}
                <div className="flex items-start gap-3">
                {(() => {
                    const IconComponent = (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[nodeType.icon] || LucideIcons.Circle;
                    const category = nodeType.category as NodeCategory;
                    return (
                      <div className={cn(
                        'p-2.5 rounded-lg',
                        category === 'intent' && 'bg-node-intent/10 text-node-intent',
                        category === 'intelligence' && 'bg-node-intelligence/10 text-node-intelligence',
                        category === 'memory' && 'bg-node-memory/10 text-node-memory',
                        category === 'capability' && 'bg-node-capability/10 text-node-capability',
                        category === 'safety' && 'bg-node-safety/10 text-node-safety',
                        category === 'human' && 'bg-node-human/10 text-node-human',
                        category === 'time' && 'bg-node-time/10 text-node-time',
                        category === 'cost' && 'bg-node-cost/10 text-node-cost',
                        category === 'observability' && 'bg-node-observability/10 text-node-observability',
                        category === 'environment' && 'bg-node-environment/10 text-node-environment',
                        category === 'testing' && 'bg-node-testing/10 text-node-testing',
                      )}>
                        <IconComponent className="h-5 w-5" />
                      </div>
                    );
                  })()}
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{nodeType.label}</h3>
                    <p className="text-xs text-muted-foreground">{NODE_CATEGORIES[nodeType.category]?.label}</p>
                  </div>
                </div>
                
                {/* Description */}
                <p className="text-sm text-muted-foreground">{nodeType.description}</p>
                
                {/* Risk level */}
                {nodeType.riskLevel && (
                  <div className={cn(
                    'flex items-center gap-2 p-3 rounded-lg',
                    nodeType.riskLevel === 'critical' && 'bg-destructive/10 text-destructive',
                    nodeType.riskLevel === 'high' && 'bg-destructive/10 text-destructive/80',
                    nodeType.riskLevel === 'medium' && 'bg-warning/10 text-warning',
                    nodeType.riskLevel === 'low' && 'bg-success/10 text-success',
                  )}>
                    <AlertCircle className="h-4 w-4" />
                    <div>
                      <p className="text-sm font-medium capitalize">{nodeType.riskLevel} Risk Level</p>
                      <p className="text-xs opacity-80">
                        {nodeType.riskLevel === 'critical' && 'Requires guardrails connection'}
                        {nodeType.riskLevel === 'high' && 'Should be governed by guardrails'}
                        {nodeType.riskLevel === 'medium' && 'Monitor for compliance'}
                        {nodeType.riskLevel === 'low' && 'Standard governance applies'}
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Required connections */}
                {nodeType.requiredConnections && nodeType.requiredConnections.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground flex items-center gap-1">
                      <Link2 className="h-3 w-3" />
                      Required Connections
                    </Label>
                    <div className="space-y-1">
                      {nodeType.requiredConnections.map(conn => (
                        <div key={conn} className="flex items-center gap-2 p-2 rounded bg-secondary/30 text-sm">
                          <span className="capitalize">{conn.replace(/-/g, ' ')}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <Separator className="bg-border/50" />
                
                {/* Configuration fields */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-foreground">Configuration</h4>
                  
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="node-name" className="text-xs">Display Name</Label>
                      <Input
                        id="node-name"
                        placeholder={nodeType.label}
                        className="h-9 bg-background/50"
                        defaultValue={selectedNode.data.config?.name as string || ''}
                        onChange={(e) => updateNodeConfig(selectedNode.id, { name: e.target.value })}
                      />
                    </div>
                    
                    <div className="space-y-1.5">
                      <Label htmlFor="node-notes" className="text-xs">Notes</Label>
                      <Textarea
                        id="node-notes"
                        placeholder="Add notes about this declaration..."
                        className="min-h-[80px] bg-background/50 text-sm"
                        defaultValue={selectedNode.data.config?.notes as string || ''}
                        onChange={(e) => updateNodeConfig(selectedNode.id, { notes: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Validation issues */}
                {nodeIssues.length > 0 && (
                  <>
                    <Separator className="bg-border/50" />
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-warning" />
                        Validation Issues
                      </h4>
                      <div className="space-y-2">
                        {nodeIssues.map(issue => (
                          <div
                            key={issue.id}
                            className={cn(
                              'p-2.5 rounded-lg text-sm',
                              issue.severity === 'error' && 'bg-destructive/10 text-destructive',
                              issue.severity === 'warning' && 'bg-warning/10 text-warning',
                              issue.severity === 'info' && 'bg-info/10 text-info',
                            )}
                          >
                            <div className="flex items-start gap-2">
                              {issue.severity === 'error' && <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />}
                              {issue.severity === 'warning' && <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />}
                              {issue.severity === 'info' && <Info className="h-4 w-4 mt-0.5 shrink-0" />}
                              <p>{issue.message}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
                
                <Separator className="bg-border/50" />
                
                {/* Actions */}
                <Button
                  variant="destructive"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    removeNode(selectedNode.id);
                    selectNode(null);
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove Node
                </Button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-8 text-center text-muted-foreground"
              >
                <div className="w-12 h-12 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-3">
                  <Info className="h-5 w-5" />
                </div>
                <p className="text-sm">Select a node on the canvas to view and edit its configuration</p>
              </motion.div>
            )}
          </AnimatePresence>
        </ScrollArea>
      </div>
    </motion.div>
  );
}
