import { motion, AnimatePresence } from 'framer-motion';
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
  const [isExpanded, setIsExpanded] = useState(false);

  const errors = validationIssues.filter(i => i.severity === 'error');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const warnings = validationIssues.filter(i => i.severity === 'warning');
  const isValid = errors.length === 0;

  return (
    <motion.div
      layout
      className={cn(
        'absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col-reverse items-center',
        isExpanded ? 'w-[500px]' : 'w-auto'
      )}
    >
      {/* Floating Pill - Always visible */}
      <motion.button
        layout
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          'relative flex items-center gap-3 px-4 py-2.5 rounded-full shadow-lg border backdrop-blur-md transition-all',
          'hover:scale-[1.02] active:scale-[0.98]',
          isValid
            ? 'bg-card/80 border-success/30 text-success hover:bg-success/10'
            : 'bg-card/90 border-destructive/30 text-destructive hover:bg-destructive/10',
          isExpanded && 'rounded-b-xl rounded-t-none border-t-0 w-full justify-between bg-card text-foreground'
        )}
      >
        <div className="flex items-center gap-2.5">
          {isValid ? (
            <CheckCircle2 className={cn("h-5 w-5", isExpanded ? "text-success" : "")} />
          ) : (
            <XCircle className={cn("h-5 w-5", isExpanded ? "text-destructive" : "")} />
          )}

          <span className="font-medium text-sm">
            {isValid ? 'Ready to Deploy' : `${errors.length} Issues Found`}
          </span>

          {!isValid && !isExpanded && (
            <div className="flex gap-1">
              <span className="flex h-2 w-2 rounded-full bg-destructive animate-pulse" />
            </div>
          )}
        </div>

        {isExpanded ? (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronUp className="h-4 w-4 text-muted-foreground/70" />
        )}
      </motion.button>

      {/* Expanded Content Panel - Slides Up */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: 10, height: 0 }}
            className="w-full bg-card/95 backdrop-blur-xl border border-border/50 rounded-t-xl shadow-2xl overflow-hidden mb-[-1px]"
          >
            <div className="p-4 border-b border-border/50 flex items-center justify-between bg-muted/20">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Validation Report</span>
              {currentAgent && (
                <Badge variant="outline" className="text-[10px] h-5">
                  {currentAgent.environment}
                </Badge>
              )}
            </div>

            <ScrollArea className="max-h-[300px] min-h-[100px]">
              <div className="p-2 space-y-1">
                {validationIssues.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center mb-3">
                      <CheckCircle2 className="h-6 w-6 text-success" />
                    </div>
                    <p className="text-sm font-medium">All systems go!</p>
                    <p className="text-xs text-muted-foreground mt-1 max-w-[200px]">
                      No validation errors detected. Your agent is configured correctly.
                    </p>
                  </div>
                ) : (
                  validationIssues.map((issue) => (
                    <motion.button
                      key={issue.id}
                      layout
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      onClick={() => issue.nodeId && selectNode(issue.nodeId)}
                      className={cn(
                        'w-full flex items-start gap-3 p-3 rounded-lg text-left transition-all border border-transparent',
                        'hover:bg-secondary/50 hover:border-border/50 group',
                      )}
                    >
                      <div className={cn(
                        'mt-0.5 shrink-0',
                        issue.severity === 'error' && 'text-destructive',
                        issue.severity === 'warning' && 'text-warning',
                      )}>
                        {issue.severity === 'error' ? <XCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                          {issue.message}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <Badge variant="secondary" className="text-[10px] h-5 px-1.5 font-normal">
                            {categoryIcons[issue.category]}
                            <span className="ml-1">{issue.category}</span>
                          </Badge>
                          {issue.nodeId && (
                            <span className="text-[10px] text-muted-foreground group-hover:text-primary transition-colors flex items-center">
                              View Node →
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.button>
                  ))
                )}
              </div>
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
