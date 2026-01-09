import { useAgentStore } from '@/store/agentStore';
import { Shield, Scale, Lock, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ComplianceItem {
  label: string;
  status: 'covered' | 'partial' | 'missing';
  nodeType: string;
}

export function InspectorSafety() {
  const { nodes, currentAgent } = useAgentStore();

  const guardrailsNode = nodes.find(n => n.data.type === 'guardrails');

  // Compliance coverage items
  const complianceItems: ComplianceItem[] = [
    {
      label: 'Guardrails & Policy',
      status: guardrailsNode ? 'covered' : 'missing',
      nodeType: 'guardrails'
    },
  ];

  // Forbidden actions (from guardrails config or default)
  const forbiddenActions = guardrailsNode?.data.config?.forbiddenActions as string[] || [
    'Unauthorized data access',
    'Actions outside defined scope',
    'Unsanctioned external communications',
  ];

  const getStatusColor = (status: 'covered' | 'partial' | 'missing') => {
    switch (status) {
      case 'covered': return 'text-success';
      case 'partial': return 'text-warning';
      case 'missing': return 'text-destructive';
    }
  };

  const getStatusBg = (status: 'covered' | 'partial' | 'missing') => {
    switch (status) {
      case 'covered': return 'bg-success/10 border-success/30';
      case 'partial': return 'bg-warning/10 border-warning/30';
      case 'missing': return 'bg-destructive/10 border-destructive/30';
    }
  };

  const getStatusIcon = (status: 'covered' | 'partial' | 'missing') => {
    switch (status) {
      case 'covered': return <CheckCircle2 className="h-4 w-4 text-success" />;
      case 'partial': return <AlertTriangle className="h-4 w-4 text-warning" />;
      case 'missing': return <XCircle className="h-4 w-4 text-destructive" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Safety Statement */}
      <div className="p-4 rounded-lg bg-node-safety/10 border border-node-safety/30">
        <p className="text-sm text-foreground leading-relaxed">
          Safety is enforced through the <strong>Guardrails</strong> node. It handles privacy, content filtering, and legal compliance policies.
        </p>
      </div>

      {/* Compliance Dashboard */}
      <div className="space-y-3">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Safety Coverage</h3>
        <div className="space-y-2">
          {complianceItems.map(item => (
            <div
              key={item.nodeType}
              className={cn('p-3 rounded-lg border flex items-center gap-3', getStatusBg(item.status))}
            >
              <Shield className={cn('h-4 w-4', getStatusColor(item.status))} />
              <span className="text-sm flex-1">{item.label}</span>
              {getStatusIcon(item.status)}
            </div>
          ))}
        </div>
      </div>

      {/* Guardrails Details */}
      {guardrailsNode && (
        <div className="space-y-3">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Active Policies</h3>
          <div className="p-4 rounded-lg bg-secondary/20 border border-border/50 space-y-3">
            <div className="flex items-start gap-3">
              <Shield className="h-4 w-4 text-node-safety mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">
                  {guardrailsNode.data.config?.name as string || 'Primary Guardrails'}
                </p>
                {guardrailsNode.data.config?.notes && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {guardrailsNode.data.config.notes as string}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Forbidden Actions */}
      <div className="space-y-3">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Forbidden Actions</h3>
        <div className="space-y-1.5">
          {forbiddenActions.map((action, i) => (
            <div key={i} className="flex items-center gap-2 p-2.5 rounded-lg bg-destructive/5 border border-destructive/20">
              <XCircle className="h-3.5 w-3.5 text-destructive shrink-0" />
              <span className="text-sm text-foreground">{action}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
