import { useAgentStore } from '@/store/agentStore';
import { UserCog, UserCheck, Users, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function InspectorAccountability() {
  const { nodes, currentAgent } = useAgentStore();

  const humanControlNodes = nodes.filter(n => n.data.type === 'human-control');

  const isProduction = currentAgent?.environment === 'production';

  return (
    <div className="space-y-6">
      {/* Accountability Statement */}
      <div className="p-4 rounded-lg border bg-node-human/10 border-node-human/30">
        <p className="text-sm text-foreground leading-relaxed font-medium">
          Human oversight is managed through <strong>Human Control</strong> nodes, which define approval workflows, handoffs, and accountability owners.
        </p>
      </div>

      {/* Production Warning */}
      {isProduction && humanControlNodes.length === 0 && (
        <div className="flex items-start gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/30">
          <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-destructive">Blocking Issue</p>
            <p className="text-xs text-destructive/80 mt-1">
              Production agents require Human Control oversight. Add a 'Human Control' node to proceed.
            </p>
          </div>
        </div>
      )}

      {/* Human Control Logic */}
      <div className="space-y-3">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Human Control & Oversight</h3>
        {humanControlNodes.length === 0 ? (
          <div className="p-4 rounded-lg bg-secondary/30 border border-border/50 text-center">
            <UserCog className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No human control configured</p>
            <p className="text-xs text-muted-foreground mt-1">Add a Human Control node for approvals or handoffs</p>
          </div>
        ) : (
          <div className="space-y-2">
            {humanControlNodes.map(node => {
              const config = node.data.config || {};
              return (
                <div key={node.id} className="p-4 rounded-lg bg-secondary/20 border border-border/50">
                  <div className="flex items-start gap-3">
                    <UserCheck className="h-4 w-4 text-node-human mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">
                        {config.name as string || 'Human Control Point'}
                      </p>
                      {config.notes && (
                        <p className="text-xs text-muted-foreground mt-1">{config.notes as string}</p>
                      )}
                      <div className="flex items-center gap-1 mt-2 text-xs text-success">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>Oversight Active</span>
                      </div>
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
