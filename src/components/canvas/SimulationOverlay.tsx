import { motion } from 'framer-motion';
import { useAgentStore } from '@/store/agentStore';
import { 
  Activity, 
  Shield, 
  AlertTriangle, 
  CheckCircle2,
  XCircle,
  Zap,
  Brain,
  Clock
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface SimulationEvent {
  id: string;
  timestamp: string;
  type: 'reasoning' | 'policy' | 'blocked' | 'approved' | 'delegated';
  message: string;
  nodeType?: string;
}

const mockEvents: SimulationEvent[] = [
  { 
    id: '1', 
    timestamp: '00:00.000', 
    type: 'reasoning', 
    message: 'Agent received goal: "Process customer refund request"',
    nodeType: 'goal'
  },
  { 
    id: '2', 
    timestamp: '00:00.124', 
    type: 'reasoning', 
    message: 'Evaluating available tools from Tool Registry',
    nodeType: 'tool-registry'
  },
  { 
    id: '3', 
    timestamp: '00:00.256', 
    type: 'policy', 
    message: 'Guardrails check: Refund amount $450 within auto-approval limit ($500)',
    nodeType: 'guardrails'
  },
  { 
    id: '4', 
    timestamp: '00:00.312', 
    type: 'approved', 
    message: 'Policy passed: Transaction approved for autonomous execution',
    nodeType: 'guardrails'
  },
  { 
    id: '5', 
    timestamp: '00:00.445', 
    type: 'reasoning', 
    message: 'Checking data sensitivity classification for customer PII',
    nodeType: 'data-sensitivity'
  },
  { 
    id: '6', 
    timestamp: '00:00.512', 
    type: 'policy', 
    message: 'PII masking applied: Email and phone redacted from logs',
    nodeType: 'data-sensitivity'
  },
  { 
    id: '7', 
    timestamp: '00:00.634', 
    type: 'delegated', 
    message: 'Escalating to Human Handoff: Customer sentiment negative',
    nodeType: 'human-handoff'
  },
];

export function SimulationOverlay() {
  const { nodes } = useAgentStore();
  
  const getEventIcon = (type: SimulationEvent['type']) => {
    switch (type) {
      case 'reasoning':
        return <Brain className="h-3.5 w-3.5 text-node-intelligence" />;
      case 'policy':
        return <Shield className="h-3.5 w-3.5 text-node-safety" />;
      case 'blocked':
        return <XCircle className="h-3.5 w-3.5 text-destructive" />;
      case 'approved':
        return <CheckCircle2 className="h-3.5 w-3.5 text-success" />;
      case 'delegated':
        return <AlertTriangle className="h-3.5 w-3.5 text-warning" />;
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="absolute bottom-24 right-4 w-96 z-10"
    >
      <div className="glass-strong rounded-xl overflow-hidden border border-primary/30">
        {/* Header */}
        <div className="p-3 border-b border-border/50 bg-primary/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Activity className="h-4 w-4 text-primary" />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-success rounded-full animate-pulse" />
              </div>
              <span className="font-medium text-sm text-foreground">Simulation Mode</span>
            </div>
            <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/30">
              <Zap className="h-3 w-3 mr-1" />
              Live
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Declarative reasoning path visualization
          </p>
        </div>
        
        {/* Events */}
        <ScrollArea className="h-[280px]">
          <div className="p-3 space-y-2">
            {mockEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  'p-2.5 rounded-lg border transition-colors',
                  event.type === 'reasoning' && 'bg-node-intelligence/5 border-node-intelligence/20',
                  event.type === 'policy' && 'bg-node-safety/5 border-node-safety/20',
                  event.type === 'blocked' && 'bg-destructive/5 border-destructive/20',
                  event.type === 'approved' && 'bg-success/5 border-success/20',
                  event.type === 'delegated' && 'bg-warning/5 border-warning/20',
                )}
              >
                <div className="flex items-start gap-2">
                  <div className="mt-0.5">
                    {getEventIcon(event.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">{event.message}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground font-mono flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {event.timestamp}
                      </span>
                      {event.nodeType && (
                        <Badge variant="outline" className="text-[10px] h-4 px-1.5">
                          {event.nodeType}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
        
        {/* Footer */}
        <div className="p-3 border-t border-border/50 bg-muted/30">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{nodes.length} nodes active</span>
            <span>Hypothetical reasoning path</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
