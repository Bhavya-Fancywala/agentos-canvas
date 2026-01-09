import { useAgentStore } from '@/store/agentStore';
import { Brain, Network, CheckCircle2, XCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export function InspectorReasoning() {
  const { nodes, edges } = useAgentStore();
  
  const brainNodes = nodes.filter(n => n.data.type === 'agent-brain');
  const multiAgentNodes = nodes.filter(n => n.data.type === 'multi-agent-link');
  const guardrailsNode = nodes.find(n => n.data.type === 'guardrails');
  const approvalNodes = nodes.filter(n => n.data.type === 'approval');
  
  // Determine what the agent can and cannot decide
  const canDecide = [
    brainNodes.length > 0 && 'Process inputs within defined scope',
    nodes.some(n => n.data.type === 'memory') && 'Access stored knowledge',
    nodes.some(n => n.data.type === 'tool-registry') && 'Invoke registered tools',
  ].filter(Boolean);
  
  const cannotDecide = [
    guardrailsNode && 'Actions outside policy boundaries',
    approvalNodes.length > 0 && 'Actions requiring human approval',
    nodes.some(n => n.data.type === 'data-sensitivity') && 'Access to sensitive data without authorization',
    nodes.some(n => n.data.type === 'cost-control') && 'Expenditure beyond cost limits',
  ].filter(Boolean);
  
  return (
    <div className="space-y-6">
      {/* Explanation */}
      <div className="p-4 rounded-lg bg-node-intelligence/10 border border-node-intelligence/30">
        <p className="text-sm text-foreground leading-relaxed">
          This agent reasons autonomously within the boundaries defined by connected policies and approvals. 
          Intelligence is constrained by declared guardrails.
        </p>
      </div>
      
      {/* Agent Brain Nodes */}
      <div className="space-y-3">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Reasoning Engines</h3>
        {brainNodes.length === 0 ? (
          <div className="p-4 rounded-lg bg-destructive/5 border border-destructive/30 text-center">
            <Brain className="h-8 w-8 text-destructive/50 mx-auto mb-2" />
            <p className="text-sm text-destructive">No reasoning engine declared</p>
            <p className="text-xs text-muted-foreground mt-1">Add an Agent Brain node</p>
          </div>
        ) : (
          <div className="space-y-2">
            {brainNodes.map(brain => {
              const config = brain.data.config || {};
              const isConnectedToGuardrails = guardrailsNode && edges.some(e => 
                (e.source === brain.id && e.target === guardrailsNode.id) ||
                (e.target === brain.id && e.source === guardrailsNode.id)
              );
              
              return (
                <div 
                  key={brain.id}
                  className={cn(
                    'p-4 rounded-lg border',
                    isConnectedToGuardrails 
                      ? 'bg-success/5 border-success/30' 
                      : 'bg-warning/5 border-warning/30'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <Brain className="h-4 w-4 text-node-intelligence mt-0.5 shrink-0" />
                    <div className="flex-1 space-y-2">
                      <p className="text-sm font-medium text-foreground">
                        {config.name as string || 'Primary Reasoning Engine'}
                      </p>
                      <div className="flex items-center gap-2 text-xs">
                        {isConnectedToGuardrails ? (
                          <>
                            <CheckCircle2 className="h-3 w-3 text-success" />
                            <span className="text-success">Governed by guardrails</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3 w-3 text-warning" />
                            <span className="text-warning">Not connected to guardrails</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Multi-Agent Delegation */}
      <div className="space-y-3">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Delegation Status</h3>
        {multiAgentNodes.length === 0 ? (
          <div className="p-3 rounded-lg bg-secondary/30 border border-border/50 flex items-center gap-3">
            <Info className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No multi-agent collaboration declared</p>
          </div>
        ) : (
          <div className="space-y-2">
            {multiAgentNodes.map(agent => {
              const config = agent.data.config || {};
              return (
                <div key={agent.id} className="p-4 rounded-lg bg-secondary/20 border border-border/50">
                  <div className="flex items-start gap-3">
                    <Network className="h-4 w-4 text-node-intelligence mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">
                        {config.name as string || 'External Agent Link'}
                      </p>
                      {config.notes && (
                        <p className="text-xs text-muted-foreground mt-1">{config.notes as string}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Decision Authority */}
      <div className="grid gap-4">
        <div className="space-y-3">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Allowed Decisions</h3>
          <div className="space-y-1.5">
            {canDecide.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">No decision authority declared</p>
            ) : (
              canDecide.map((item, i) => (
                <div key={i} className="flex items-center gap-2 p-2 rounded bg-success/5 border border-success/20">
                  <CheckCircle2 className="h-3.5 w-3.5 text-success shrink-0" />
                  <span className="text-sm text-foreground">{item}</span>
                </div>
              ))
            )}
          </div>
        </div>
        
        <div className="space-y-3">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Restricted Actions</h3>
          <div className="space-y-1.5">
            {cannotDecide.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">No explicit restrictions declared</p>
            ) : (
              cannotDecide.map((item, i) => (
                <div key={i} className="flex items-center gap-2 p-2 rounded bg-destructive/5 border border-destructive/20">
                  <XCircle className="h-3.5 w-3.5 text-destructive shrink-0" />
                  <span className="text-sm text-foreground">{item}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
