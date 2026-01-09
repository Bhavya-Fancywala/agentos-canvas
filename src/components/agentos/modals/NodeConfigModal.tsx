import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useAgentStore } from '@/store/agentStore';
import { AgentOSNodeConfig } from '@/types/agentos/nodeConfigs';

export function NodeConfigModal() {
    const { nodes, selectedNodeId, selectNode, updateNodeConfig } = useAgentStore();
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState<Partial<AgentOSNodeConfig>>({});

    const selectedNode = nodes.find(n => n.id === selectedNodeId);

    useEffect(() => {
        if (selectedNodeId) {
            setIsOpen(true);
            // Initialize form data from node state or defaults
            setFormData(selectedNode?.data.config as Partial<AgentOSNodeConfig> || {});
        } else {
            setIsOpen(false);
        }
    }, [selectedNodeId, selectedNode]);

    const handleClose = () => {
        setIsOpen(false);
        selectNode(null); // Deselect on close
    };

    const handleSave = () => {
        if (selectedNodeId) {
            updateNodeConfig(selectedNodeId, formData);
        }
        handleClose();
    };

    const updateField = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    if (!selectedNode) return null;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        Configure {selectedNode.data.label}
                    </DialogTitle>
                    <DialogDescription>
                        Configure the specific runtime parameters for this node.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    {/* --- ENTRY FORMS --- */}
                    {selectedNode.data.type === 'trigger' && (
                        <div className="space-y-4">
                            <div className="grid gap-2">
                                <Label>Trigger Type</Label>
                                <Select
                                    value={(formData as any).triggerType}
                                    onValueChange={(v) => updateField('triggerType', v)}
                                >
                                    <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="cron">Scheduled (Cron)</SelectItem>
                                        <SelectItem value="webhook">Webhook</SelectItem>
                                        <SelectItem value="event">Event Bus</SelectItem>
                                        <SelectItem value="manual">Manual / API</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            {(formData as any).triggerType === 'cron' && (
                                <div className="grid gap-2">
                                    <Label>Cron Expression</Label>
                                    <Input
                                        placeholder="e.g. 0 9 * * *"
                                        value={(formData as any).scheduleExpression || ''}
                                        onChange={(e) => updateField('scheduleExpression', e.target.value)}
                                    />
                                    <p className="text-[10px] text-muted-foreground">Standard Unix Cron format.</p>
                                </div>
                            )}
                            <div className="grid gap-2">
                                <Label>Environment</Label>
                                <Select
                                    value={(formData as any).environment}
                                    onValueChange={(v) => updateField('environment', v)}
                                >
                                    <SelectTrigger><SelectValue placeholder="Select env" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="draft">Draft</SelectItem>
                                        <SelectItem value="sandbox">Sandbox</SelectItem>
                                        <SelectItem value="production">Production</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}


                    {selectedNode.data.type === 'input-channel' && (
                        <div className="space-y-4">
                            <div className="grid gap-2">
                                <Label>Channel Type</Label>
                                <Select value={(formData as any).channelType} onValueChange={(v) => updateField('channelType', v)}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="voice">Voice (Telephony)</SelectItem>
                                        <SelectItem value="whatsapp">WhatsApp</SelectItem>
                                        <SelectItem value="email">Email</SelectItem>
                                        <SelectItem value="chat">Web Chat</SelectItem>
                                        <SelectItem value="api">API Endpoint</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Switch checked={(formData as any).authenticationRequired} onCheckedChange={(c) => updateField('authenticationRequired', c)} />
                                <Label>Require Authentication</Label>
                            </div>
                        </div>
                    )}

                    {selectedNode.data.type === 'knowledge-base' && (
                        <div className="space-y-4">
                            <div className="grid gap-2">
                                <Label>Source Type</Label>
                                <Select value={(formData as any).sourceType} onValueChange={(v) => updateField('sourceType', v)}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pdf">PDF Documents</SelectItem>
                                        <SelectItem value="docs">Google Docs / Notion</SelectItem>
                                        <SelectItem value="db">SQL Database</SelectItem>
                                        <SelectItem value="api">External API</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label>Source Location (URL or Path)</Label>
                                <Input value={(formData as any).sourceLocation || ''} onChange={(e) => updateField('sourceLocation', e.target.value)} placeholder="s3://bucket/docs or https://api.example.com" />
                            </div>
                        </div>
                    )}

                    {selectedNode.data.type === 'tool-definition' && (
                        <div className="space-y-4">
                            <div className="grid gap-2">
                                <Label>Tool Name</Label>
                                <Input value={(formData as any).toolName || ''} onChange={(e) => updateField('toolName', e.target.value)} placeholder="checkInventory" />
                            </div>
                            <div className="grid gap-2">
                                <Label>Permission Level</Label>
                                <Select value={(formData as any).permissionLevel} onValueChange={(v) => updateField('permissionLevel', v)}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="read">Read Only</SelectItem>
                                        <SelectItem value="write">Write / Execute</SelectItem>
                                        <SelectItem value="admin">Admin / Dangerous</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}

                    {selectedNode.data.type === 'human-control' && (
                        <div className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <Switch checked={(formData as any).approvalRequired} onCheckedChange={(c) => updateField('approvalRequired', c)} />
                                <Label>Require Approval Before Execution</Label>
                            </div>
                            <div className="grid gap-2">
                                <Label>Assigned Owner (Email)</Label>
                                <Input value={(formData as any).assignedOwner || ''} onChange={(e) => updateField('assignedOwner', e.target.value)} placeholder="manager@company.com" />
                            </div>
                        </div>
                    )}

                    {selectedNode.data.type === 'api-action' && (
                        <div className="space-y-4">
                            <div className="grid gap-2">
                                <Label>API Name</Label>
                                <Input value={(formData as any).apiName || ''} onChange={(e) => updateField('apiName', e.target.value)} />
                            </div>
                            <div className="grid grid-cols-4 gap-2">
                                <div className="col-span-1">
                                    <Select value={(formData as any).method} onValueChange={(v) => updateField('method', v)}>
                                        <SelectTrigger><SelectValue placeholder="GET" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="GET">GET</SelectItem>
                                            <SelectItem value="POST">POST</SelectItem>
                                            <SelectItem value="PUT">PUT</SelectItem>
                                            <SelectItem value="DELETE">DELETE</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="col-span-3">
                                    <Input value={(formData as any).baseUrl || ''} onChange={(e) => updateField('baseUrl', e.target.value)} placeholder="https://api.example.com/v1/resource" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- EXISTING PROCESSING FORMS --- */}
                    {selectedNode.data.type === 'agent-goal' && (
                        <div className="space-y-4">
                            <div className="grid gap-2">
                                <Label>Mission Statement (System Prompt)</Label>
                                <Textarea
                                    placeholder="You are a helpful assistant who..."
                                    className="h-32"
                                    value={(formData as any).missionStatement || ''}
                                    onChange={(e) => updateField('missionStatement', e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Persona Tone</Label>
                                <Select
                                    value={(formData as any).personaTone}
                                    onValueChange={(v) => updateField('personaTone', v)}
                                >
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="professional">Professional</SelectItem>
                                        <SelectItem value="casual">Casual</SelectItem>
                                        <SelectItem value="empathetic">Empathetic</SelectItem>
                                        <SelectItem value="strict">Strict</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}

                    {selectedNode.data.type === 'agent-brain' && (
                        <div className="space-y-4">
                            <div className="grid gap-2">
                                <Label>LLM Model</Label>
                                <Select
                                    value={(formData as any).llmModel}
                                    onValueChange={(v) => updateField('llmModel', v)}
                                >
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="gpt-4">GPT-4</SelectItem>
                                        <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                                        <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
                                        <SelectItem value="claude-3-sonnet">Claude 3 Sonnet</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label>Temperature ({(formData as any).temperature || 0.7})</Label>
                                <Input
                                    type="range" min="0" max="1" step="0.1"
                                    value={(formData as any).temperature || 0.7}
                                    onChange={(e) => updateField('temperature', parseFloat(e.target.value))}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Reasoning Strategy</Label>
                                <Select
                                    value={(formData as any).reasoningStrategy}
                                    onValueChange={(v) => updateField('reasoningStrategy', v)}
                                >
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="react">ReAct (Reason + Act)</SelectItem>
                                        <SelectItem value="plan-execute">Plan & Execute</SelectItem>
                                        <SelectItem value="classify-act">Classify & Act</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}

                    {selectedNode.data.type === 'guardrails' && (
                        <div className="space-y-4">
                            <div className="grid gap-2">
                                <Label>Forbidden Actions (Comma separated)</Label>
                                <Textarea
                                    placeholder="Delete DB, POST to /admin..."
                                    value={(formData as any).forbiddenActions?.join(', ') || ''}
                                    onChange={(e) => updateField('forbiddenActions', e.target.value.split(',').map((s: string) => s.trim()))}
                                />
                            </div>
                            <div className="flex items-center space-x-2">
                                <Switch
                                    checked={(formData as any).maskEmails}
                                    onCheckedChange={(c) => updateField('maskEmails', c)}
                                />
                                <Label>Mask Emails in Logs</Label>
                            </div>
                        </div>
                    )}

                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSave}>Save Configuration</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
