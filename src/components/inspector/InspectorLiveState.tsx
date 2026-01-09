import { useAgentStore } from '@/store/agentStore';
import { Activity, Database, Server, Clock, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export function InspectorLiveState() {
  const { currentAgent, nodes } = useAgentStore();
  
  const memoryNodes = nodes.filter(n => n.data.type === 'memory');
  const knowledgeNodes = nodes.filter(n => n.data.type === 'knowledge-source');
  const environmentNode = nodes.find(n => n.data.type === 'environment');
  
  // Mock last execution timestamp
  const lastExecution = new Date(Date.now() - Math.random() * 3600000);
  
  return (
    <div className="space-y-6">
      {/* Read-only Notice */}
      <div className="p-4 rounded-lg bg-info/10 border border-info/30 flex items-start gap-3">
        <Info className="h-4 w-4 text-info mt-0.5 shrink-0" />
        <p className="text-sm text-info">
          This view is observational only. State cannot be modified from the inspector.
        </p>
      </div>
      
      {/* Current State Snapshot */}
      <div className="space-y-3">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Current State</h3>
        <div className="p-4 rounded-lg bg-secondary/20 border border-border/50 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-success" />
              <span className="text-sm">Status</span>
            </div>
            <Badge variant="outline" className="bg-success/10 text-success border-success/30">
              Active
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Server className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Environment</span>
            </div>
            <Badge 
              variant="outline" 
              className={cn(
                currentAgent?.environment === 'production' && 'bg-destructive/10 text-destructive border-destructive/30',
                currentAgent?.environment === 'sandbox' && 'bg-warning/10 text-warning border-warning/30',
                currentAgent?.environment === 'draft' && 'bg-muted/30 text-muted-foreground border-muted/50',
              )}
            >
              {currentAgent?.environment?.toUpperCase() || 'DRAFT'}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Last Execution</span>
            </div>
            <span className="text-sm text-muted-foreground font-mono">
              {lastExecution.toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>
      
      {/* Memory References */}
      <div className="space-y-3">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Memory References</h3>
        {memoryNodes.length === 0 ? (
          <div className="p-3 rounded-lg bg-secondary/30 border border-border/50 flex items-center gap-3">
            <Database className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No memory nodes declared</p>
          </div>
        ) : (
          <div className="space-y-2">
            {memoryNodes.map(memory => {
              const config = memory.data.config || {};
              return (
                <div key={memory.id} className="p-3 rounded-lg bg-secondary/20 border border-border/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Database className="h-4 w-4 text-node-memory" />
                      <span className="text-sm">{config.name as string || 'Memory Store'}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      Active
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Knowledge Sources */}
      <div className="space-y-3">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Knowledge Sources</h3>
        {knowledgeNodes.length === 0 ? (
          <div className="p-3 rounded-lg bg-secondary/30 border border-border/50 flex items-center gap-3">
            <Database className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No knowledge sources declared</p>
          </div>
        ) : (
          <div className="space-y-2">
            {knowledgeNodes.map(knowledge => {
              const config = knowledge.data.config || {};
              return (
                <div key={knowledge.id} className="p-3 rounded-lg bg-secondary/20 border border-border/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Database className="h-4 w-4 text-node-memory" />
                      <span className="text-sm">{config.name as string || 'Knowledge Base'}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      Connected
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Environment Config */}
      {environmentNode && (
        <div className="space-y-3">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Environment Configuration</h3>
          <div className="p-3 rounded-lg bg-secondary/20 border border-border/50">
            <div className="flex items-center gap-2">
              <Server className="h-4 w-4 text-node-environment" />
              <span className="text-sm">{environmentNode.data.config?.name as string || 'Runtime Environment'}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
