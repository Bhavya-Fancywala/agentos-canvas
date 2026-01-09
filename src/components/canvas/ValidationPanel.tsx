import { motion } from 'framer-motion';
import { useAgentStore } from '@/store/agentStore';
import { cn } from '@/lib/utils';
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Info,
  ChevronUp,
  ChevronDown,
  Shield,
  Scale,
  Users,
  Clock,
  DollarSign
} from 'lucide-react';
import { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

const categoryIcons: Record<string, React.ReactNode> = {
  'Intent': <Shield className="h-3.5 w-3.5" />,
  'Safety': <Shield className="h-3.5 w-3.5" />,
  'Compliance': <Scale className="h-3.5 w-3.5" />,
  'Human Control': <Users className="h-3.5 w-3.5" />,
  'Reliability': <Clock className="h-3.5 w-3.5" />,
  'Cost': <DollarSign className="h-3.5 w-3.5" />,
  'Structure': <Info className="h-3.5 w-3.5" />,
};

export function ValidationPanel() {
  const { currentAgent, validationIssues, selectNode } = useAgentStore();
  const [isExpanded, setIsExpanded] = useState(true);
  
  const errors = validationIssues.filter(i => i.severity === 'error');
  const warnings = validationIssues.filter(i => i.severity === 'warning');
  const isValid = errors.length === 0;
  
  return (
    <motion.div
      layout
      className={cn(
        'absolute bottom-4 left-1/2 -translate-x-1/2 z-10',
        isExpanded ? 'w-[600px]' : 'w-auto'
      )}
    >
      <div className="glass-strong rounded-xl overflow-hidden">
        {/* Status bar - always visible */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            'w-full p-3 flex items-center justify-between transition-colors',
            isValid ? 'hover:bg-success/5' : 'hover:bg-destructive/5'
          )}
        >
          <div className="flex items-center gap-3">
            {isValid ? (
              <div className="flex items-center gap-2 text-success">
                <CheckCircle2 className="h-5 w-5" />
                <span className="font-medium text-sm">Agent Valid</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-destructive">
                <XCircle className="h-5 w-5" />
                <span className="font-medium text-sm">Validation Failed</span>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              {errors.length > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {errors.length} {errors.length === 1 ? 'error' : 'errors'}
                </Badge>
              )}
              {warnings.length > 0 && (
                <Badge variant="outline" className="text-xs bg-warning/10 text-warning border-warning/30">
                  {warnings.length} {warnings.length === 1 ? 'warning' : 'warnings'}
                </Badge>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {currentAgent && (
              <Badge 
                variant="outline" 
                className={cn(
                  'text-xs uppercase font-medium',
                  currentAgent.environment === 'production' && 'bg-destructive/10 text-destructive border-destructive/30',
                  currentAgent.environment === 'sandbox' && 'bg-warning/10 text-warning border-warning/30',
                  currentAgent.environment === 'draft' && 'bg-muted text-muted-foreground border-border',
                )}
              >
                {currentAgent.environment}
              </Badge>
            )}
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
        </button>
        
        {/* Expanded content */}
        {isExpanded && validationIssues.length > 0 && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="border-t border-border/50"
          >
            <ScrollArea className="max-h-[200px]">
              <div className="p-3 space-y-2">
                {validationIssues.map((issue) => (
                  <motion.button
                    key={issue.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => issue.nodeId && selectNode(issue.nodeId)}
                    className={cn(
                      'w-full flex items-start gap-3 p-2.5 rounded-lg text-left transition-colors',
                      'hover:bg-secondary/50',
                      issue.severity === 'error' && 'bg-destructive/5',
                      issue.severity === 'warning' && 'bg-warning/5',
                    )}
                  >
                    <div className={cn(
                      'mt-0.5',
                      issue.severity === 'error' && 'text-destructive',
                      issue.severity === 'warning' && 'text-warning',
                      issue.severity === 'info' && 'text-info',
                    )}>
                      {issue.severity === 'error' && <XCircle className="h-4 w-4" />}
                      {issue.severity === 'warning' && <AlertTriangle className="h-4 w-4" />}
                      {issue.severity === 'info' && <Info className="h-4 w-4" />}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground">{issue.message}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                          {categoryIcons[issue.category]}
                          {issue.category}
                        </span>
                        {issue.nodeId && (
                          <span className="text-xs text-primary hover:underline">
                            Go to node →
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </ScrollArea>
          </motion.div>
        )}
        
        {/* Empty state when valid */}
        {isExpanded && validationIssues.length === 0 && (
          <div className="p-4 border-t border-border/50 text-center text-sm text-muted-foreground">
            All validations passed. Agent is ready for deployment.
          </div>
        )}
      </div>
    </motion.div>
  );
}
