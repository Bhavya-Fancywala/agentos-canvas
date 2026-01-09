import { useState } from 'react';
import { FileText, CheckCircle2, AlertTriangle, XCircle, Users, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

type AuditEventType = 'decision' | 'escalation' | 'policy_block' | 'failure';

interface AuditEvent {
  id: string;
  type: AuditEventType;
  timestamp: Date;
  what: string;
  why: string;
}

// Mock audit log data
const mockAuditEvents: AuditEvent[] = [
  {
    id: '1',
    type: 'decision',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    what: 'Processed customer inquiry',
    why: 'Request matched Goal scope and passed all guardrails'
  },
  {
    id: '2',
    type: 'policy_block',
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    what: 'Blocked data access request',
    why: 'Request violated Data Sensitivity policy for PII access'
  },
  {
    id: '3',
    type: 'escalation',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    what: 'Escalated to human operator',
    why: 'Confidence threshold not met for autonomous decision'
  },
  {
    id: '4',
    type: 'decision',
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
    what: 'Invoked tool: send_notification',
    why: 'Action authorized by Tool Registry and within cost limits'
  },
  {
    id: '5',
    type: 'failure',
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
    what: 'Tool invocation failed',
    why: 'External service unavailable, triggered Graceful Degradation'
  },
];

export function InspectorAuditLog() {
  const [filter, setFilter] = useState<AuditEventType | 'all'>('all');
  
  const filteredEvents = filter === 'all' 
    ? mockAuditEvents 
    : mockAuditEvents.filter(e => e.type === filter);
  
  const getEventIcon = (type: AuditEventType) => {
    switch (type) {
      case 'decision': return <CheckCircle2 className="h-4 w-4 text-success" />;
      case 'escalation': return <Users className="h-4 w-4 text-node-human" />;
      case 'policy_block': return <AlertTriangle className="h-4 w-4 text-warning" />;
      case 'failure': return <XCircle className="h-4 w-4 text-destructive" />;
    }
  };
  
  const getEventBadge = (type: AuditEventType) => {
    switch (type) {
      case 'decision': return <Badge variant="outline" className="bg-success/10 text-success border-success/30 text-xs">Decision</Badge>;
      case 'escalation': return <Badge variant="outline" className="bg-node-human/10 text-node-human border-node-human/30 text-xs">Escalation</Badge>;
      case 'policy_block': return <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30 text-xs">Policy Block</Badge>;
      case 'failure': return <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/30 text-xs">Failure</Badge>;
    }
  };
  
  const formatTime = (date: Date) => {
    const diff = Date.now() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-4 rounded-lg bg-secondary/30 border border-border/50">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Immutable chronological record of agent decisions and events
          </p>
        </div>
      </div>
      
      {/* Filters */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Filter By</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button 
            size="sm" 
            variant={filter === 'all' ? 'secondary' : 'ghost'}
            onClick={() => setFilter('all')}
            className="h-7 text-xs"
          >
            All
          </Button>
          <Button 
            size="sm" 
            variant={filter === 'decision' ? 'secondary' : 'ghost'}
            onClick={() => setFilter('decision')}
            className="h-7 text-xs"
          >
            Decisions
          </Button>
          <Button 
            size="sm" 
            variant={filter === 'escalation' ? 'secondary' : 'ghost'}
            onClick={() => setFilter('escalation')}
            className="h-7 text-xs"
          >
            Escalations
          </Button>
          <Button 
            size="sm" 
            variant={filter === 'policy_block' ? 'secondary' : 'ghost'}
            onClick={() => setFilter('policy_block')}
            className="h-7 text-xs"
          >
            Policy Blocks
          </Button>
          <Button 
            size="sm" 
            variant={filter === 'failure' ? 'secondary' : 'ghost'}
            onClick={() => setFilter('failure')}
            className="h-7 text-xs"
          >
            Failures
          </Button>
        </div>
      </div>
      
      {/* Audit Log Entries */}
      <div className="space-y-3">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Event Log</h3>
        <div className="space-y-2">
          {filteredEvents.length === 0 ? (
            <div className="p-4 rounded-lg bg-secondary/30 border border-border/50 text-center">
              <p className="text-sm text-muted-foreground">No events matching filter</p>
            </div>
          ) : (
            filteredEvents.map(event => (
              <div 
                key={event.id}
                className="p-4 rounded-lg bg-secondary/20 border border-border/50 space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2">
                    {getEventIcon(event.type)}
                    <span className="text-sm font-medium text-foreground">{event.what}</span>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatTime(event.timestamp)}
                  </span>
                </div>
                <div className="pl-6 flex items-start gap-2">
                  <span className="text-xs text-muted-foreground">{event.why}</span>
                </div>
                <div className="pl-6">
                  {getEventBadge(event.type)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
