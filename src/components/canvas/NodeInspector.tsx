import { motion, AnimatePresence } from 'framer-motion';
import { useAgentStore } from '@/store/agentStore';
import { cn } from '@/lib/utils';
import { X, FileText, Target, Brain, Shield, UserCog, Activity, History, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InspectorOverview } from '@/components/inspector/InspectorOverview';
import { InspectorGoals } from '@/components/inspector/InspectorGoals';
import { InspectorReasoning } from '@/components/inspector/InspectorReasoning';
import { InspectorSafety } from '@/components/inspector/InspectorSafety';
import { InspectorAccountability } from '@/components/inspector/InspectorAccountability';
import { InspectorLiveState } from '@/components/inspector/InspectorLiveState';
import { InspectorAuditLog } from '@/components/inspector/InspectorAuditLog';
import { InspectorExplainability } from '@/components/inspector/InspectorExplainability';

const INSPECTOR_TABS = [
  { id: 'overview', label: 'Overview', icon: FileText },
  { id: 'goals', label: 'Goals', icon: Target },
  { id: 'reasoning', label: 'Reasoning', icon: Brain },
  { id: 'safety', label: 'Safety', icon: Shield },
  { id: 'accountability', label: 'Accountability', icon: UserCog },
  { id: 'state', label: 'Live State', icon: Activity },
  { id: 'audit', label: 'Audit Log', icon: History },
  { id: 'explain', label: 'Explain', icon: Eye },
] as const;

export function NodeInspector() {
  const { isInspectorOpen, toggleInspector, currentAgent } = useAgentStore();
  
  if (!isInspectorOpen) return null;
  
  return (
    <motion.div
      initial={{ x: 360, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 360, opacity: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="absolute right-4 top-20 bottom-6 w-[340px] z-10"
    >
      <div className="h-full glass-strong rounded-xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border/50 flex items-center justify-between shrink-0">
          <div>
            <h2 className="font-semibold text-sm text-foreground">Agent Contract</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {currentAgent?.name || 'Governance & Reasoning Viewer'}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={toggleInspector}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Tabs */}
        <Tabs defaultValue="overview" className="flex-1 flex flex-col min-h-0">
          <div className="shrink-0 border-b border-border/50 overflow-x-auto">
            <TabsList className="inline-flex h-auto p-1.5 bg-transparent w-max gap-0.5">
              {INSPECTOR_TABS.map(tab => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className={cn(
                    'px-3 py-1.5 text-xs font-medium rounded-md',
                    'data-[state=active]:bg-secondary data-[state=active]:text-foreground',
                    'data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-foreground',
                    'transition-colors whitespace-nowrap'
                  )}
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          
          <ScrollArea className="flex-1">
            <div className="p-4">
              <AnimatePresence mode="wait">
                <TabsContent value="overview" className="mt-0 data-[state=inactive]:hidden">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <InspectorOverview />
                  </motion.div>
                </TabsContent>
                
                <TabsContent value="goals" className="mt-0 data-[state=inactive]:hidden">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <InspectorGoals />
                  </motion.div>
                </TabsContent>
                
                <TabsContent value="reasoning" className="mt-0 data-[state=inactive]:hidden">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <InspectorReasoning />
                  </motion.div>
                </TabsContent>
                
                <TabsContent value="safety" className="mt-0 data-[state=inactive]:hidden">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <InspectorSafety />
                  </motion.div>
                </TabsContent>
                
                <TabsContent value="accountability" className="mt-0 data-[state=inactive]:hidden">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <InspectorAccountability />
                  </motion.div>
                </TabsContent>
                
                <TabsContent value="state" className="mt-0 data-[state=inactive]:hidden">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <InspectorLiveState />
                  </motion.div>
                </TabsContent>
                
                <TabsContent value="audit" className="mt-0 data-[state=inactive]:hidden">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <InspectorAuditLog />
                  </motion.div>
                </TabsContent>
                
                <TabsContent value="explain" className="mt-0 data-[state=inactive]:hidden">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <InspectorExplainability />
                  </motion.div>
                </TabsContent>
              </AnimatePresence>
            </div>
          </ScrollArea>
        </Tabs>
      </div>
    </motion.div>
  );
}
