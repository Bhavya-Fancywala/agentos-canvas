import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAgentStore } from '@/store/agentStore';
import { Environment } from '@/types/agent';
import { cn } from '@/lib/utils';
import {
  Box,
  Circle,
  FileText,
  FlaskConical,
  Rocket,
  ArrowRight,
  Plus,
  Shield,
  Clock,
  Cpu,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const environments: { value: Environment; label: string; description: string; icon: React.ReactNode; color: string }[] = [
  {
    value: 'draft',
    label: 'Draft',
    description: 'Work in progress. No validation requirements.',
    icon: <FileText className="h-5 w-5" />,
    color: 'text-muted-foreground border-border hover:border-muted-foreground/50',
  },
  {
    value: 'sandbox',
    label: 'Sandbox',
    description: 'Testing environment with simulated policies.',
    icon: <FlaskConical className="h-5 w-5" />,
    color: 'text-warning border-warning/30 hover:border-warning/60',
  },
  {
    value: 'production',
    label: 'Production',
    description: 'Live environment. Strict validation required.',
    icon: <Rocket className="h-5 w-5" />,
    color: 'text-destructive border-destructive/30 hover:border-destructive/60',
  },
];

const features = [
  { icon: Shield, label: 'Declarative Safety', description: 'Define constraints, not code' },
  { icon: Clock, label: 'Real-time Validation', description: 'Always-on compliance checks' },
  { icon: Cpu, label: 'Multi-Agent Ready', description: 'Orchestrate agent networks' },
];

export default function AgentEntry() {
  const navigate = useNavigate();
  const { createAgent } = useAgentStore();
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [environment, setEnvironment] = useState<Environment>('draft');
  
  const handleCreate = () => {
    if (!name.trim()) return;
    createAgent(name, description, environment);
    navigate('/canvas');
  };
  
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-node-intent/5 rounded-full blur-[100px]" />
      </div>
      
      <div className="relative z-10 min-h-screen flex">
        {/* Left side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Box className="h-5 w-5 text-primary" />
              </div>
              <span className="text-xl font-bold text-foreground">AgentOS</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Declarative AI Agent Operating System
            </p>
          </div>
          
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-4xl font-bold text-foreground leading-tight">
                Define the contract.<br />
                <span className="text-gradient-primary">Not the code.</span>
              </h1>
              <p className="mt-4 text-lg text-muted-foreground max-w-md">
                Build safe, accountable AI agents through declarative governance. 
                No workflows, no scripts — just clear operational boundaries.
              </p>
            </motion.div>
            
            <div className="grid gap-4">
              {features.map((feature, i) => (
                <motion.div
                  key={feature.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="flex items-center gap-4 p-4 rounded-xl glass"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">{feature.label}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
          <p className="text-xs text-muted-foreground">
            Enterprise-grade AI governance platform
          </p>
        </div>
        
        {/* Right side - Form */}
        <div className="flex-1 lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md"
          >
            <div className="glass-strong rounded-2xl p-8">
              <div className="text-center mb-8">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Plus className="h-7 w-7 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">Create New Agent</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Define your agent's identity and operating environment
                </p>
              </div>
              
              <div className="space-y-6">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Agent Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Customer Support Agent"
                    className="h-11 bg-background/50"
                  />
                </div>
                
                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the agent's purpose and responsibilities..."
                    className="min-h-[100px] bg-background/50"
                  />
                </div>
                
                {/* Environment */}
                <div className="space-y-3">
                  <Label>Environment</Label>
                  <div className="grid gap-3">
                    {environments.map((env) => (
                      <button
                        key={env.value}
                        onClick={() => setEnvironment(env.value)}
                        className={cn(
                          'flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left',
                          environment === env.value
                            ? cn('border-primary bg-primary/5', env.color)
                            : 'border-border hover:bg-secondary/30',
                        )}
                      >
                        <div className={cn(
                          'w-10 h-10 rounded-lg flex items-center justify-center',
                          environment === env.value ? 'bg-primary/10' : 'bg-secondary'
                        )}>
                          <span className={environment === env.value ? 'text-primary' : 'text-muted-foreground'}>
                            {env.icon}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-foreground">{env.label}</span>
                            {environment === env.value && (
                              <Circle className="h-2 w-2 fill-primary text-primary" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{env.description}</p>
                        </div>
                        <ChevronRight className={cn(
                          'h-5 w-5 transition-transform',
                          environment === env.value ? 'text-primary translate-x-0' : 'text-muted-foreground -translate-x-2 opacity-0'
                        )} />
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Submit */}
                <Button
                  onClick={handleCreate}
                  disabled={!name.trim()}
                  className="w-full h-12 text-base"
                >
                  Enter AgentOS Canvas
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
            
            {/* Mobile branding */}
            <div className="lg:hidden text-center mt-8">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Box className="h-5 w-5 text-primary" />
                <span className="font-bold text-foreground">AgentOS</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Enterprise-grade AI governance platform
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
