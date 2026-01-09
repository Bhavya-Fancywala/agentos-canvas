import { useAgentStore } from '@/store/agentStore';
import { UserCog, UserCheck, Users, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function InspectorAccountability() {
  const { nodes, currentAgent, edges } = useAgentStore();
  
  const ownerNode = nodes.find(n => n.data.type === 'accountability-owner');
  const approvalNodes = nodes.filter(n => n.data.type === 'approval');
  const handoffNodes = nodes.filter(n => n.data.type === 'human-handoff');
  
  const isProduction = currentAgent?.environment === 'production';
  const ownerName = ownerNode?.data.config?.name as string || 'Unassigned';
  
  return (
    <div className="space-y-6">
      {/* Accountability Statement */}
      <div className={cn(
        'p-4 rounded-lg border',
        ownerNode ? 'bg-success/10 border-success/30' : 'bg-destructive/10 border-destructive/30'
      )}>
        <p className="text-sm text-foreground leading-relaxed font-medium">
          {ownerNode 
            ? `If this agent makes a mistake, responsibility belongs to ${ownerName}.`
            : 'No accountability owner assigned. Responsibility is undefined.'
          }
        </p>
      </div>
      
      {/* Production Warning */}
      {isProduction && !ownerNode && (
        <div className="flex items-start gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/30">
          <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-destructive">Blocking Issue</p>
            <p className="text-xs text-destructive/80 mt-1">
              Production agents require an Accountability Owner. Add this node to proceed.
            </p>
          </div>
        </div>
      )}
      
      {/* Accountability Owner */}
      <div className="space-y-3">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Accountability Owner</h3>
        {ownerNode ? (
          <div className="p-4 rounded-lg bg-success/5 border border-success/30">
            <div className="flex items-start gap-3">
              <UserCog className="h-5 w-5 text-node-human mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{ownerName}</p>
                {ownerNode.data.config?.notes && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {ownerNode.data.config.notes as string}
                  </p>
                )}
                <div className="flex items-center gap-1 mt-2 text-xs text-success">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>Ownership declared</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-lg bg-destructive/5 border border-destructive/30 text-center">
            <UserCog className="h-8 w-8 text-destructive/50 mx-auto mb-2" />
            <p className="text-sm text-destructive">No owner assigned</p>
            <p className="text-xs text-muted-foreground mt-1">Add an Accountability Owner node</p>
          </div>
        )}
      </div>
      
      {/* Approval Requirements */}
      <div className="space-y-3">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Approval Requirements</h3>
        {approvalNodes.length === 0 ? (
          <div className="p-3 rounded-lg bg-secondary/30 border border-border/50 flex items-center gap-3">
            <UserCheck className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No approval requirements declared</p>
          </div>
        ) : (
          <div className="space-y-2">
            {approvalNodes.map(approval => {
              const config = approval.data.config || {};
              const isConnectedToOwner = ownerNode && edges.some(e => 
                (e.source === approval.id && e.target === ownerNode.id) ||
                (e.target === approval.id && e.source === ownerNode.id)
              );
              
              return (
                <div 
                  key={approval.id}
                  className={cn(
                    'p-4 rounded-lg border',
                    isConnectedToOwner ? 'bg-secondary/20 border-border/50' : 'bg-warning/5 border-warning/30'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <UserCheck className="h-4 w-4 text-node-human mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">
                        {config.name as string || 'Approval Required'}
                      </p>
                      {config.notes && (
                        <p className="text-xs text-muted-foreground mt-1">{config.notes as string}</p>
                      )}
                      {!isConnectedToOwner && (
                        <div className="flex items-center gap-1 mt-2 text-xs text-warning">
                          <AlertTriangle className="h-3 w-3" />
                          <span>Not linked to owner</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Human Handoff Conditions */}
      <div className="space-y-3">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Human Handoff Conditions</h3>
        {handoffNodes.length === 0 ? (
          <div className="p-3 rounded-lg bg-secondary/30 border border-border/50 flex items-center gap-3">
            <Users className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No handoff conditions declared</p>
          </div>
        ) : (
          <div className="space-y-2">
            {handoffNodes.map(handoff => {
              const config = handoff.data.config || {};
              return (
                <div key={handoff.id} className="p-4 rounded-lg bg-secondary/20 border border-border/50">
                  <div className="flex items-start gap-3">
                    <Users className="h-4 w-4 text-node-human mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">
                        {config.name as string || 'Human Handoff'}
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
    </div>
  );
}
