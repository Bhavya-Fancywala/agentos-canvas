import { useAgentStore } from '@/store/agentStore';
import { cn } from '@/lib/utils';
import { 
  ArrowLeft, 
  Settings, 
  Play, 
  Pause,
  PanelLeft,
  PanelRight,
  Box,
  CheckCircle2,
  XCircle,
  Circle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Environment } from '@/types/agent';
import { useNavigate } from 'react-router-dom';

export function CanvasHeader() {
  const navigate = useNavigate();
  const { 
    currentAgent, 
    updateAgentEnvironment,
    isPaletteOpen,
    isInspectorOpen,
    isSimulationMode,
    togglePalette,
    toggleInspector,
    toggleSimulation,
    validationIssues
  } = useAgentStore();
  
  const errors = validationIssues.filter(i => i.severity === 'error');
  const isValid = errors.length === 0;

  return (
    <header className="absolute top-0 left-0 right-0 h-16 z-20 glass border-b border-border/50">
      <div className="h-full px-4 flex items-center justify-between">
        {/* Left section */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-muted-foreground hover:text-foreground"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          
          <div className="h-6 w-px bg-border" />
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Box className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-foreground">
                {currentAgent?.name || 'Untitled Agent'}
              </h1>
              <p className="text-xs text-muted-foreground">
                {currentAgent?.description || 'No description'}
              </p>
            </div>
          </div>
        </div>
        
        {/* Center section - Environment selector */}
        <div className="flex items-center gap-3">
          <Select
            value={currentAgent?.environment || 'draft'}
            onValueChange={(value: Environment) => updateAgentEnvironment(value)}
          >
            <SelectTrigger className={cn(
              'w-[140px] h-9 text-xs font-medium',
              currentAgent?.environment === 'production' && 'border-destructive/50 text-destructive',
              currentAgent?.environment === 'sandbox' && 'border-warning/50 text-warning',
            )}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">
                <div className="flex items-center gap-2">
                  <Circle className="h-2 w-2 fill-muted-foreground text-muted-foreground" />
                  Draft
                </div>
              </SelectItem>
              <SelectItem value="sandbox">
                <div className="flex items-center gap-2">
                  <Circle className="h-2 w-2 fill-warning text-warning" />
                  Sandbox
                </div>
              </SelectItem>
              <SelectItem value="production">
                <div className="flex items-center gap-2">
                  <Circle className="h-2 w-2 fill-destructive text-destructive" />
                  Production
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          
          <div className="h-6 w-px bg-border" />
          
          <div className="flex items-center gap-2">
            {isValid ? (
              <Badge variant="outline" className="bg-success/10 text-success border-success/30">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Valid
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/30">
                <XCircle className="h-3 w-3 mr-1" />
                {errors.length} {errors.length === 1 ? 'Error' : 'Errors'}
              </Badge>
            )}
          </div>
        </div>
        
        {/* Right section */}
        <div className="flex items-center gap-2">
          <Button
            variant={isPaletteOpen ? 'secondary' : 'ghost'}
            size="sm"
            className="h-9"
            onClick={togglePalette}
          >
            <PanelLeft className="h-4 w-4 mr-2" />
            Palette
          </Button>
          
          <Button
            variant={isInspectorOpen ? 'secondary' : 'ghost'}
            size="sm"
            className="h-9"
            onClick={toggleInspector}
          >
            <PanelRight className="h-4 w-4 mr-2" />
            Inspector
          </Button>
          
          <div className="h-6 w-px bg-border" />
          
          <Button
            variant={isSimulationMode ? 'default' : 'outline'}
            size="sm"
            className={cn(
              'h-9',
              isSimulationMode && 'bg-primary text-primary-foreground'
            )}
            onClick={toggleSimulation}
          >
            {isSimulationMode ? (
              <>
                <Pause className="h-4 w-4 mr-2" />
                Stop Simulation
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Simulate
              </>
            )}
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-muted-foreground hover:text-foreground"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
