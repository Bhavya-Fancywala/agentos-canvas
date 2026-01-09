import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { NODE_CATEGORIES, NodeCategory } from '@/types/agent';
import { useAgentStore } from '@/store/agentStore';
import * as LucideIcons from 'lucide-react';

interface AgentNodeData {
  type: string;
  label: string;
  category: NodeCategory;
  riskLevel?: string;
  config?: Record<string, unknown>;
  [key: string]: unknown;
}

const riskColors = {
  low: 'border-success/50',
  medium: 'border-warning/50',
  high: 'border-destructive/50',
  critical: 'border-destructive glow-destructive',
};

const categoryBgColors: Record<NodeCategory, string> = {
  intent: 'bg-node-intent/10 border-node-intent/30 hover:border-node-intent/60',
  intelligence: 'bg-node-intelligence/10 border-node-intelligence/30 hover:border-node-intelligence/60',
  memory: 'bg-node-memory/10 border-node-memory/30 hover:border-node-memory/60',
  capability: 'bg-node-capability/10 border-node-capability/30 hover:border-node-capability/60',
  safety: 'bg-node-safety/10 border-node-safety/30 hover:border-node-safety/60',
  human: 'bg-node-human/10 border-node-human/30 hover:border-node-human/60',
  time: 'bg-node-time/10 border-node-time/30 hover:border-node-time/60',
  cost: 'bg-node-cost/10 border-node-cost/30 hover:border-node-cost/60',
  observability: 'bg-node-observability/10 border-node-observability/30 hover:border-node-observability/60',
  environment: 'bg-node-environment/10 border-node-environment/30 hover:border-node-environment/60',
  testing: 'bg-node-testing/10 border-node-testing/30 hover:border-node-testing/60',
};

const iconColorMap: Record<NodeCategory, string> = {
  intent: 'text-node-intent',
  intelligence: 'text-node-intelligence',
  memory: 'text-node-memory',
  capability: 'text-node-capability',
  safety: 'text-node-safety',
  human: 'text-node-human',
  time: 'text-node-time',
  cost: 'text-node-cost',
  observability: 'text-node-observability',
  environment: 'text-node-environment',
  testing: 'text-node-testing',
};

function AgentNode({ id, data, selected }: NodeProps) {
  const nodeData = data as AgentNodeData;
  const { validationIssues } = useAgentStore();
  
  const nodeIssues = validationIssues.filter(issue => issue.nodeId === id);
  const hasError = nodeIssues.some(i => i.severity === 'error');
  const hasWarning = nodeIssues.some(i => i.severity === 'warning');
  
  // Get the icon component
  const iconName = getIconForType(nodeData.type);
  const IconComponent = (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[iconName] || LucideIcons.Circle;
  
  const category = nodeData.category as NodeCategory;
  
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={cn(
        'relative min-w-[180px] rounded-lg border-2 backdrop-blur-sm transition-all duration-200',
        categoryBgColors[category],
        selected && 'ring-2 ring-primary ring-offset-2 ring-offset-background',
        hasError && 'ring-2 ring-destructive',
        hasWarning && !hasError && 'ring-2 ring-warning',
      )}
    >
      {/* Connection handles */}
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-muted-foreground !border-2 !border-background hover:!bg-primary transition-colors"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !bg-muted-foreground !border-2 !border-background hover:!bg-primary transition-colors"
      />
      
      {/* Node content */}
      <div className="p-4">
        <div className="flex items-center gap-3">
          <div className={cn(
            'p-2 rounded-md bg-background/50',
            iconColorMap[category]
          )}>
            <IconComponent className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm text-foreground truncate">
              {nodeData.label}
            </h3>
            <p className="text-xs text-muted-foreground truncate">
              {NODE_CATEGORIES[category]?.label}
            </p>
          </div>
        </div>
        
        {/* Risk indicator */}
        {nodeData.riskLevel && (
          <div className={cn(
            'mt-3 flex items-center gap-2 text-xs',
            nodeData.riskLevel === 'critical' && 'text-destructive',
            nodeData.riskLevel === 'high' && 'text-destructive/80',
            nodeData.riskLevel === 'medium' && 'text-warning',
            nodeData.riskLevel === 'low' && 'text-success',
          )}>
            <LucideIcons.AlertCircle className="w-3 h-3" />
            <span className="capitalize">{nodeData.riskLevel} Risk</span>
          </div>
        )}
        
        {/* Validation indicators */}
        {nodeIssues.length > 0 && (
          <div className="mt-2 flex gap-1">
            {hasError && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-destructive/20 text-destructive">
                <LucideIcons.XCircle className="w-3 h-3" />
                {nodeIssues.filter(i => i.severity === 'error').length}
              </span>
            )}
            {hasWarning && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-warning/20 text-warning">
                <LucideIcons.AlertTriangle className="w-3 h-3" />
                {nodeIssues.filter(i => i.severity === 'warning').length}
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function getIconForType(type: string): string {
  const iconMap: Record<string, string> = {
    'goal': 'Target',
    'outcome': 'CheckCircle2',
    'agent-brain': 'Brain',
    'multi-agent-link': 'Network',
    'memory': 'Database',
    'knowledge-source': 'BookOpen',
    'tool-registry': 'Wrench',
    'guardrails': 'Shield',
    'legal-compliance': 'Scale',
    'data-sensitivity': 'Lock',
    'approval': 'UserCheck',
    'human-handoff': 'Users',
    'accountability-owner': 'UserCog',
    'schedule-trigger': 'Clock',
    'sla-response': 'Timer',
    'graceful-degradation': 'AlertTriangle',
    'cost-control': 'DollarSign',
    'business-kpi': 'TrendingUp',
    'analytics-feedback': 'BarChart3',
    'exception-dispute': 'AlertOctagon',
    'environment': 'Server',
    'sandbox-simulation': 'FlaskConical',
  };
  return iconMap[type] || 'Circle';
}

export default memo(AgentNode);
