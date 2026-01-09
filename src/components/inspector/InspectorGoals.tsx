import { useAgentStore } from '@/store/agentStore';
import { Target, CheckCircle2, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

export function InspectorGoals() {
  const { nodes, edges } = useAgentStore();
  
  const goalNodes = nodes.filter(n => n.data.type === 'goal');
  const outcomeNodes = nodes.filter(n => n.data.type === 'outcome');
  
  // Check for goals without outcomes
  const goalsWithoutOutcomes = goalNodes.filter(goal => {
    const connectedOutcome = edges.some(e => 
      (e.source === goal.id && outcomeNodes.some(o => o.id === e.target)) ||
      (e.target === goal.id && outcomeNodes.some(o => o.id === e.source))
    );
    return !connectedOutcome;
  });
  
  // Check for outcomes without measurable criteria
  const outcomesWithoutCriteria = outcomeNodes.filter(outcome => {
    const config = outcome.data.config || {};
    return !config.successCriteria && !config.name;
  });
  
  return (
    <div className="space-y-6">
      {/* Intent Statement */}
      <div className="p-4 rounded-lg bg-secondary/30 border border-border/50">
        <p className="text-sm text-muted-foreground italic">
          Goals define what this agent is designed to achieve. Outcomes declare measurable success criteria. 
          These are declarations of intent, not instructions.
        </p>
      </div>
      
      {/* Warnings */}
      {(goalsWithoutOutcomes.length > 0 || outcomesWithoutCriteria.length > 0) && (
        <div className="space-y-2">
          {goalsWithoutOutcomes.length > 0 && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-warning/10 border border-warning/30">
              <AlertTriangle className="h-4 w-4 text-warning mt-0.5 shrink-0" />
              <p className="text-sm text-warning">
                {goalsWithoutOutcomes.length} goal{goalsWithoutOutcomes.length !== 1 ? 's' : ''} exist without connected outcomes
              </p>
            </div>
          )}
          {outcomesWithoutCriteria.length > 0 && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-warning/10 border border-warning/30">
              <AlertTriangle className="h-4 w-4 text-warning mt-0.5 shrink-0" />
              <p className="text-sm text-warning">
                {outcomesWithoutCriteria.length} outcome{outcomesWithoutCriteria.length !== 1 ? 's' : ''} lack measurable criteria
              </p>
            </div>
          )}
        </div>
      )}
      
      {/* Goals List */}
      <div className="space-y-3">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Declared Goals</h3>
        {goalNodes.length === 0 ? (
          <div className="p-4 rounded-lg bg-destructive/5 border border-destructive/30 text-center">
            <Target className="h-8 w-8 text-destructive/50 mx-auto mb-2" />
            <p className="text-sm text-destructive">No goals declared</p>
            <p className="text-xs text-muted-foreground mt-1">Add a Goal node to define agent intent</p>
          </div>
        ) : (
          <div className="space-y-2">
            {goalNodes.map(goal => {
              const config = goal.data.config || {};
              const hasOutcome = !goalsWithoutOutcomes.includes(goal);
              
              return (
                <div 
                  key={goal.id}
                  className={cn(
                    'p-4 rounded-lg border',
                    hasOutcome ? 'bg-secondary/20 border-border/50' : 'bg-warning/5 border-warning/30'
                  )}
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
                      {hasOutcome ? (
                        <div className="flex items-center gap-1 mt-2 text-xs text-success">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>Connected to outcome</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 mt-2 text-xs text-warning">
                          <AlertTriangle className="h-3 w-3" />
                          <span>No outcome connected</span>
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
      
      {/* Outcomes List */}
      <div className="space-y-3">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Expected Outcomes</h3>
        {outcomeNodes.length === 0 ? (
          <div className="p-4 rounded-lg bg-muted/30 border border-border/30 text-center">
            <CheckCircle2 className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No outcomes declared</p>
            <p className="text-xs text-muted-foreground mt-1">Add Outcome nodes to define success criteria</p>
          </div>
        ) : (
          <div className="space-y-2">
            {outcomeNodes.map(outcome => {
              const config = outcome.data.config || {};
              const hasCriteria = config.successCriteria || config.name;
              
              return (
                <div 
                  key={outcome.id}
                  className={cn(
                    'p-4 rounded-lg border',
                    hasCriteria ? 'bg-secondary/20 border-border/50' : 'bg-warning/5 border-warning/30'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-4 w-4 text-node-intent mt-0.5 shrink-0" />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium text-foreground">
                        {config.name as string || outcome.data.label}
                      </p>
                      {config.successCriteria && (
                        <p className="text-xs text-muted-foreground">
                          Success: {config.successCriteria as string}
                        </p>
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
