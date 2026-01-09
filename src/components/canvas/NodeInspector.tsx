import { motion, AnimatePresence } from 'framer-motion';
import { useAgentStore } from '@/store/agentStore';
import { cn } from '@/lib/utils';
import {
  X,
  LayoutTemplate,
  ShieldCheck,
  PlayCircle
} from 'lucide-react';
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

export function NodeInspector() {
  const { isInspectorOpen, toggleInspector, currentAgent } = useAgentStore();

  if (!isInspectorOpen) return null;

  return (
    <motion.div
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="absolute right-4 top-20 bottom-6 w-[400px] z-10"
    >
      <div className="h-full glass-strong rounded-xl overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-border/50 flex items-center justify-between shrink-0 bg-secondary/20">
          <div>
            <h2 className="font-semibold text-sm text-foreground">Agent Inspector</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {currentAgent?.name || 'Properties & Governance'}
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

        {/* Categorized Tabs */}
        <Tabs defaultValue="design" className="flex-1 flex flex-col min-h-0">
          <div className="shrink-0 border-b border-border/50 px-2 pt-2 bg-secondary/10">
            <TabsList className="flex w-full h-auto p-1 gap-1 bg-transparent">
              <TabsTrigger
                value="design"
                className="flex-1 flex flex-col gap-1 py-2 text-xs font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md transition-all"
              >
                <LayoutTemplate className="h-4 w-4 mb-0.5" />
                Design
              </TabsTrigger>
              <TabsTrigger
                value="governance"
                className="flex-1 flex flex-col gap-1 py-2 text-xs font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md transition-all"
              >
                <ShieldCheck className="h-4 w-4 mb-0.5" />
                Governance
              </TabsTrigger>
              <TabsTrigger
                value="runtime"
                className="flex-1 flex flex-col gap-1 py-2 text-xs font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md transition-all"
              >
                <PlayCircle className="h-4 w-4 mb-0.5" />
                Runtime
              </TabsTrigger>
            </TabsList>
          </div>

          <ScrollArea className="flex-1 bg-background/50">
            <div className="p-0">
              <TabsContent value="design" className="m-0 focus-visible:ring-0">
                <div className="divide-y divide-border/40">
                  <Section title="Overview" defaultOpen>
                    <InspectorOverview />
                  </Section>
                  <Section title="Goals & Directives">
                    <InspectorGoals />
                  </Section>
                  <Section title="Reasoning Engine">
                    <InspectorReasoning />
                  </Section>
                </div>
              </TabsContent>

              <TabsContent value="governance" className="m-0 focus-visible:ring-0">
                <div className="divide-y divide-border/40">
                  <Section title="Safety Bounds" defaultOpen>
                    <InspectorSafety />
                  </Section>
                  <Section title="Accountability">
                    <InspectorAccountability />
                  </Section>
                  <Section title="Audit Logs">
                    <InspectorAuditLog />
                  </Section>
                </div>
              </TabsContent>

              <TabsContent value="runtime" className="m-0 focus-visible:ring-0">
                <div className="divide-y divide-border/40">
                  <Section title="Live State" defaultOpen>
                    <InspectorLiveState />
                  </Section>
                  <Section title="Explainability">
                    <InspectorExplainability />
                  </Section>
                </div>
              </TabsContent>
            </div>
          </ScrollArea>
        </Tabs>
      </div>
    </motion.div>
  );
}

function Section({ children, title, defaultOpen = false }: { children: React.ReactNode, title: string, defaultOpen?: boolean }) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  // Use a require ref to avoid hydration mismatches if needed, but simple state is fine here
  // Using React.useState directly

  return (
    <div className="group">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-secondary/30 transition-colors text-left"
      >
        <span className="font-semibold text-sm text-foreground/90">{title}</span>
        <span className={cn("text-muted-foreground transition-transform duration-200", isOpen ? "rotate-90" : "")}>
          →
        </span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-6 pt-0">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import React from 'react';

