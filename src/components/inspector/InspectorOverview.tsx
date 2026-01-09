import { useAgentStore } from '@/store/agentStore';
import { NODE_TYPES } from '@/types/agent';
import { CheckCircle2, AlertTriangle, AlertCircle, Target, Brain, Shield, UserCog } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export function InspectorOverview() {
  const { currentAgent, nodes, validationIssues } = useAgentStore();

  // Get connected critical nodes
  const goalNode = nodes.find(n => n.data.type === 'agent-goal');
  const brainNode = nodes.find(n => n.data.type === 'agent-brain');
  const guardrailsNode = nodes.find(n => n.data.type === 'guardrails');
  const ownerNode = nodes.find(n => n.data.type === 'accountability-owner');

  const errorCount = validationIssues.filter(i => i.severity === 'error').length;
  const warningCount = validationIssues.filter(i => i.severity === 'warning').length;

  // Generate agent summary
  const generateSummary = () => {
    const goals = goalNode ? (goalNode.data.config?.name as string || 'defined goals') : 'no goals defined';
    const policies = guardrailsNode ? 'established policies' : 'no policies defined';
    const owner = ownerNode ? (ownerNode.data.config?.name as string || 'assigned owner') : 'no owner assigned';
    const environment = currentAgent?.environment || 'draft';

    return `This agent is designed to achieve ${goals}, operates under ${policies}, is accountable to ${owner}, and runs in ${environment} environment.`;
  };

  const criticalNodes = [
    { type: 'agent-goal', label: 'Goal', icon: Target, node: goalNode },
    { type: 'agent-brain', label: 'Agent Brain', icon: Brain, node: brainNode },
    { type: 'guardrails', label: 'Guardrails', icon: Shield, node: guardrailsNode },
    { type: 'accountability-owner', label: 'Accountability Owner', icon: UserCog, node: ownerNode },
  ];

  return (
    <div className="space-y-6">
      {/* Agent Summary */}
      <div className="space-y-3">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Agent Summary</h3>
        <div className="p-4 rounded-lg bg-secondary/30 border border-border/50">
          <p className="text-sm text-foreground leading-relaxed">{generateSummary()}</p>
        </div>
      </div>

      {/* Environment Badge */}
      <div className="space-y-3">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Environment</h3>
        <Badge
          variant="outline"
          className={cn(
            'text-sm px-3 py-1.5 font-medium',
            currentAgent?.environment === 'production' && 'border-destructive/50 text-destructive bg-destructive/10',
            currentAgent?.environment === 'sandbox' && 'border-warning/50 text-warning bg-warning/10',
            currentAgent?.environment === 'draft' && 'border-muted-foreground/50 text-muted-foreground bg-muted/30',
          )}
        >
          {currentAgent?.environment?.toUpperCase() || 'DRAFT'}
        </Badge>
      </div>

      {/* Validation Status */}
      <div className="space-y-3">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Validation Status</h3>
        <div className={cn(
          'p-4 rounded-lg flex items-center gap-3',
          errorCount === 0 && warningCount === 0 && 'bg-success/10 border border-success/30',
          errorCount === 0 && warningCount > 0 && 'bg-warning/10 border border-warning/30',
          errorCount > 0 && 'bg-destructive/10 border border-destructive/30',
        )}>
          {errorCount === 0 && warningCount === 0 && (
            <>
              <CheckCircle2 className="h-5 w-5 text-success" />
              <div>
                <p className="text-sm font-medium text-success">Fully Valid</p>
                <p className="text-xs text-success/80">All governance requirements met</p>
              </div>
            </>
          )}
          {errorCount === 0 && warningCount > 0 && (
            <>
              <AlertTriangle className="h-5 w-5 text-warning" />
              <div>
                <p className="text-sm font-medium text-warning">{warningCount} Warning{warningCount !== 1 ? 's' : ''}</p>
                <p className="text-xs text-warning/80">Review recommended improvements</p>
              </div>
            </>
          )}
          {errorCount > 0 && (
            <>
              <AlertCircle className="h-5 w-5 text-destructive" />
              <div>
                <p className="text-sm font-medium text-destructive">{errorCount} Blocking Issue{errorCount !== 1 ? 's' : ''}</p>
                <p className="text-xs text-destructive/80">Must resolve before deployment</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Critical Nodes */}
      <div className="space-y-3">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Critical Declarations</h3>
        <div className="space-y-2">
          {criticalNodes.map(({ type, label, icon: Icon, node }) => (
            <div
              key={type}
              className={cn(
                'flex items-center gap-3 p-3 rounded-lg border',
                node ? 'bg-success/5 border-success/30' : 'bg-destructive/5 border-destructive/30',
              )}
            >
              <Icon className={cn('h-4 w-4', node ? 'text-success' : 'text-destructive')} />
              <span className="text-sm flex-1">{label}</span>
              {node ? (
                <CheckCircle2 className="h-4 w-4 text-success" />
              ) : (
                <AlertCircle className="h-4 w-4 text-destructive" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
