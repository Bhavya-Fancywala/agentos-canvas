import { useAgentStore } from '@/store/agentStore';
import { Target, CheckCircle2, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

export function InspectorGoals() {
  const { nodes } = useAgentStore();

  const goalNodes = nodes.filter(n => n.data.type === 'agent-goal');

  return (
    <div className="space-y-6">
      {/* Intent Statement */}
      <div className="p-4 rounded-lg bg-secondary/30 border border-border/50">
        <p className="text-sm text-muted-foreground italic">
          The <strong>Goal & Persona</strong> node defines the agent's identity, primary directive, and successful outcomes.
          This serves as the "System Prompt" foundation.
        </p>
      </div>

      {/* Goals List */}
      <div className="space-y-3">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Declared Goal & Persona</h3>
        {goalNodes.length === 0 ? (
          <div className="p-4 rounded-lg bg-destructive/5 border border-destructive/30 text-center">
            <Target className="h-8 w-8 text-destructive/50 mx-auto mb-2" />
            <p className="text-sm text-destructive">No Goal Declared</p>
            <p className="text-xs text-muted-foreground mt-1">Add a 'Goal & Persona' node to define agent intent</p>
          </div>
        ) : (
          <div className="space-y-2">
            {goalNodes.map(goal => {
              const config = goal.data.config || {};

              return (
                <div
                  key={goal.id}
                  className="p-4 rounded-lg border bg-secondary/20 border-border/50"
                >
                  <div className="flex items-start gap-3">
                    <Target className="h-4 w-4 text-node-intent mt-0.5 shrink-0" />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium text-foreground">
                        {config.name as string || goal.data.label}
                      </p>
                      {config.notes && (
                        <p className="text-xs text-muted-foreground">{config.notes as string}</p>
                      )}

                      <div className="flex items-center gap-1 mt-2 text-xs text-success">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>Core Directive Active</span>
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
