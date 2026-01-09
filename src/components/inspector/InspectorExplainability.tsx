import { useState } from 'react';
import { useAgentStore } from '@/store/agentStore';
import { Eye, Lightbulb, Target, Shield, UserCog, ChevronDown, ChevronRight } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface ExplanationItem {
  id: string;
  title: string;
  summary: string;
  expanded: string;
  references: string[];
}

export function InspectorExplainability() {
  const { nodes } = useAgentStore();
  const [explainMode, setExplainMode] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  
  const goalNode = nodes.find(n => n.data.type === 'goal');
  const guardrailsNode = nodes.find(n => n.data.type === 'guardrails');
  const ownerNode = nodes.find(n => n.data.type === 'accountability-owner');
  
  // Sample explanations based on agent configuration
  const explanations: ExplanationItem[] = [
    {
      id: '1',
      title: 'Goal Alignment',
      summary: 'Agent actions are evaluated against declared goals',
      expanded: goalNode 
        ? `The agent chose this action because it directly supports the declared goal: "${goalNode.data.config?.name || goalNode.data.label}". All autonomous decisions must align with this objective.`
        : 'No goal declared. The agent cannot explain decision alignment without a defined objective.',
      references: ['Goal Node', 'Outcome Node'],
    },
    {
      id: '2',
      title: 'Policy Enforcement',
      summary: 'Guardrails constrain all agent behavior',
      expanded: guardrailsNode
        ? `Actions are filtered through active guardrails. The agent evaluates each decision against policy boundaries before execution. Forbidden actions are blocked automatically.`
        : 'No guardrails declared. Policy enforcement cannot be explained without active constraints.',
      references: ['Guardrails & Policy', 'Data Sensitivity'],
    },
    {
      id: '3',
      title: 'Accountability Chain',
      summary: 'All decisions have traceable ownership',
      expanded: ownerNode
        ? `Decision responsibility traces to: ${ownerNode.data.config?.name || 'Assigned Owner'}. This ownership applies to all autonomous actions and escalations.`
        : 'No accountability owner assigned. Decision responsibility is undefined.',
      references: ['Accountability Owner', 'Approval Node'],
    },
    {
      id: '4',
      title: 'Escalation Logic',
      summary: 'Conditions for human intervention',
      expanded: 'When confidence is low, risk is high, or explicit approval is required, the agent escalates to human operators. This ensures human oversight for critical decisions.',
      references: ['Human Handoff', 'Approval Node'],
    },
  ];
  
  const toggleItem = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };
  
  return (
    <div className="space-y-6">
      {/* Explainability Toggle */}
      <div className="p-4 rounded-lg bg-node-observability/10 border border-node-observability/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Eye className="h-5 w-5 text-node-observability" />
            <div>
              <Label htmlFor="explain-mode" className="text-sm font-medium">
                Explain Agent Decisions
              </Label>
              <p className="text-xs text-muted-foreground mt-0.5">
                Show detailed reasoning summaries
              </p>
            </div>
          </div>
          <Switch
            id="explain-mode"
            checked={explainMode}
            onCheckedChange={setExplainMode}
          />
        </div>
      </div>
      
      {/* Explanation Notice */}
      <div className="p-4 rounded-lg bg-secondary/30 border border-border/50 flex items-start gap-3">
        <Lightbulb className="h-4 w-4 text-warning mt-0.5 shrink-0" />
        <p className="text-sm text-muted-foreground">
          Explainability provides transparency into agent reasoning without exposing internal mechanisms. 
          This is a trust feature, not debugging.
        </p>
      </div>
      
      {/* Explanation Items */}
      <div className="space-y-3">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Reasoning Summaries</h3>
        <div className="space-y-2">
          {explanations.map(item => (
            <div 
              key={item.id}
              className="rounded-lg border border-border/50 overflow-hidden"
            >
              <button
                onClick={() => toggleItem(item.id)}
                className="w-full p-4 flex items-start gap-3 text-left hover:bg-secondary/30 transition-colors"
              >
                <div className="mt-0.5">
                  {expandedItems.has(item.id) || explainMode ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{item.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.summary}</p>
                </div>
              </button>
              
              <AnimatePresence>
                {(expandedItems.has(item.id) || explainMode) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 pl-11 space-y-3">
                      <p className="text-sm text-foreground leading-relaxed">
                        {item.expanded}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {item.references.map(ref => (
                          <span 
                            key={ref}
                            className="px-2 py-0.5 rounded bg-secondary/50 text-xs text-muted-foreground"
                          >
                            {ref}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
