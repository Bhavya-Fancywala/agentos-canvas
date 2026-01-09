import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
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
                                    <div className="grid gap-2">
                                        <Label>Timezone</Label>
                                        <Input
                                            placeholder="UTC"
                                            value={(formData as any).timezone || 'UTC'}
                                            onChange={(e) => updateField('timezone', e.target.value)}
                                        />
                                    </div>
                                </div>
                            )}
                            {(formData as any).triggerType === 'webhook' && (
                                <div className="grid gap-2">
                                    <div className="grid gap-2">
                                        <Label>Webhook Path</Label>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-muted-foreground">/api/hooks/</span>
                                            <Input
                                                placeholder="my-agent-trigger"
                                                value={(formData as any).webhookPath || ''}
                                                onChange={(e) => updateField('webhookPath', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Secret Key (Signature Verification)</Label>
                                        <Input type="password" value={(formData as any).webhookSecret || ''} onChange={(e) => updateField('webhookSecret', e.target.value)} placeholder="whsec_..." />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Signature Header Name</Label>
                                        <Input value={(formData as any).signatureHeader || 'X-Hub-Signature-256'} onChange={(e) => updateField('signatureHeader', e.target.value)} placeholder="X-Hub-Signature-256" />
                                    </div>
                                    <p className="text-[10px] text-muted-foreground">Full URL: POST https://api.agentos.com/hooks/{(formData as any).webhookPath || '...'}</p>
                                </div>
                            )}
                            {(formData as any).triggerType === 'manual' && (
                                <div className="grid gap-2">
                                    <Label>Input Schema (JSON)</Label>
                                    <Textarea
                                        className="font-mono text-xs"
                                        placeholder='{"type": "object", "properties": {"userId": {"type": "string"}}}'
                                        value={(formData as any).inputSchema || ''}
                                        onChange={(e) => updateField('inputSchema', e.target.value)}
                                    />
                                    <p className="text-[10px] text-muted-foreground">Define expected arguments for this manual trigger.</p>
                                </div>
                            )}
                            {(formData as any).triggerType === 'event' && (
                                <div className="grid gap-2">
                                    <Label>Event Topic / Pattern</Label>
                                    <Input
                                        placeholder="order.* or user.signup"
                                        value={(formData as any).eventTopic || ''}
                                        onChange={(e) => updateField('eventTopic', e.target.value)}
                                    />
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
                                        <SelectItem value="voice">Voice (Twilio/Vapi)</SelectItem>
                                        <SelectItem value="whatsapp">WhatsApp (Meta)</SelectItem>
                                        <SelectItem value="email">Email (SendGrid/Postmark)</SelectItem>
                                        <SelectItem value="chat">Web Chat (Socket)</SelectItem>
                                        <SelectItem value="api">API Ingress (Webhook)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {(formData as any).channelType === 'whatsapp' && (
                                <div className="space-y-3">
                                    <div className="grid gap-2">
                                        <Label>Phone Number ID</Label>
                                        <Input value={(formData as any).phoneNumberId || ''} onChange={(e) => updateField('phoneNumberId', e.target.value)} placeholder="10055..." />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Business Account ID</Label>
                                        <Input value={(formData as any).businessAccountId || ''} onChange={(e) => updateField('businessAccountId', e.target.value)} placeholder="10055..." />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>System Access Token</Label>
                                        <Input type="password" value={(formData as any).accessToken || ''} onChange={(e) => updateField('accessToken', e.target.value)} placeholder="EAA..." />
                                    </div>
                                </div>
                            )}

                            {(formData as any).channelType === 'voice' && (
                                <div className="space-y-3">
                                    <div className="grid gap-2">
                                        <Label>Provider</Label>
                                        <Select value={(formData as any).voiceProvider} onValueChange={(v) => updateField('voiceProvider', v)}>
                                            <SelectTrigger><SelectValue placeholder="Select Provider" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="twilio">Twilio</SelectItem>
                                                <SelectItem value="vapi">Vapi.ai</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    {(formData as any).voiceProvider === 'twilio' && (
                                        <div className="grid gap-2">
                                            <Label>Incoming Phone Number</Label>
                                            <Input value={(formData as any).phoneNumber || ''} onChange={(e) => updateField('phoneNumber', e.target.value)} placeholder="+1234567890" />
                                        </div>
                                    )}
                                    {(formData as any).voiceProvider === 'vapi' && (
                                        <div className="grid gap-2">
                                            <Label>Assistant ID</Label>
                                            <Input value={(formData as any).assistantId || ''} onChange={(e) => updateField('assistantId', e.target.value)} placeholder="bef..." />
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="flex items-center space-x-2">
                                <Switch checked={(formData as any).authenticationRequired} onCheckedChange={(c) => updateField('authenticationRequired', c)} />
                                <Label>Require Authentication Header</Label>
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
                                        <SelectItem value="pdf">PDF Documents (S3/Upload)</SelectItem>
                                        <SelectItem value="docs">Google Docs</SelectItem>
                                        <SelectItem value="db">SQL Database (Postgres/MySQL)</SelectItem>
                                        <SelectItem value="api">External API</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label>Connection String / URL</Label>
                                <Input value={(formData as any).sourceLocation || ''} onChange={(e) => updateField('sourceLocation', e.target.value)} placeholder="postgresql://user:pass@host:5432/db" />
                            </div>
                            {(formData as any).sourceType === 'db' && (
                                <div className="grid gap-2">
                                    <Label>Query / Table Name</Label>
                                    <Input value={(formData as any).dbQuery || ''} onChange={(e) => updateField('dbQuery', e.target.value)} placeholder="SELECT * FROM users WHERE active = true" />
                                </div>
                            )}
                            <div className="grid gap-2">
                                <Label>Refresh Schedule (Cron)</Label>
                                <Input value={(formData as any).refreshSchedule || ''} onChange={(e) => updateField('refreshSchedule', e.target.value)} placeholder="0 0 * * * (Daily)" />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="grid gap-2">
                                    <Label>Chunk Size (Tokens)</Label>
                                    <Input type="number" value={(formData as any).chunkSize || 512} onChange={(e) => updateField('chunkSize', parseInt(e.target.value))} />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Overlap</Label>
                                    <Input type="number" value={(formData as any).chunkOverlap || 50} onChange={(e) => updateField('chunkOverlap', parseInt(e.target.value))} />
                                </div>
                            </div>
                        </div>
                    )}

                    {selectedNode.data.type === 'memory-config' && (
                        <div className="space-y-4">
                            <div className="grid gap-2">
                                <Label>Memory Type</Label>
                                <Select value={(formData as any).memoryType} onValueChange={(v) => updateField('memoryType', v)}>
                                    <SelectTrigger><SelectValue placeholder="Select Type" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="short-term">Short Term (Redis/Memcached)</SelectItem>
                                        <SelectItem value="long-term">Long Term (Vector DB)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label>Storage Provider</Label>
                                <Select value={(formData as any).provider} onValueChange={(v) => updateField('provider', v)}>
                                    <SelectTrigger><SelectValue placeholder="Select Provider" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="redis">Redis</SelectItem>
                                        <SelectItem value="pinecone">Pinecone</SelectItem>
                                        <SelectItem value="mongodb">MongoDB (Atlas/Local)</SelectItem>
                                        <SelectItem value="postgres">PostgreSQL (pgvector)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label>Connection String / API URL</Label>
                                <Input type="password" value={(formData as any).connectionString || ''} onChange={(e) => updateField('connectionString', e.target.value)} placeholder="redis://... or https://index.pinecone.io" />
                            </div>
                            <div className="grid gap-2">
                                <Label>Index / Namespace</Label>
                                <Input value={(formData as any).indexName || ''} onChange={(e) => updateField('indexName', e.target.value)} placeholder="my-agent-memory" />
                            </div>
                            {(formData as any).memoryType === 'long-term' && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="grid gap-2">
                                            <Label>Embedding Model</Label>
                                            <Input value={(formData as any).embeddingModel || 'text-embedding-3-small'} onChange={(e) => updateField('embeddingModel', e.target.value)} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label>Dimensions</Label>
                                            <Input type="number" value={(formData as any).dimensions || 1536} onChange={(e) => updateField('dimensions', parseInt(e.target.value))} />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="grid gap-2">
                                            <Label>Top K (Docs)</Label>
                                            <Input type="number" value={(formData as any).topK || 4} onChange={(e) => updateField('topK', parseInt(e.target.value))} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label>Score Threshold</Label>
                                            <Input type="number" step="0.05" value={(formData as any).scoreThreshold || 0.7} onChange={(e) => updateField('scoreThreshold', parseFloat(e.target.value))} />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {selectedNode.data.type === 'tool-definition' && (
                        <div className="space-y-4">
                            <div className="grid gap-2">
                                <Label>Tool Name (Function Name)</Label>
                                <Input value={(formData as any).toolName || ''} onChange={(e) => updateField('toolName', e.target.value)} placeholder="calculate_tax" />
                            </div>
                            <div className="grid gap-2">
                                <Label>Description (For LLM)</Label>
                                <Textarea
                                    className="h-20"
                                    value={(formData as any).description || ''}
                                    onChange={(e) => updateField('description', e.target.value)}
                                    placeholder="Calculates sales tax for a given epoch..."
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Argument Schema (JSON)</Label>
                                <Textarea
                                    className="h-24 font-mono text-xs"
                                    value={(formData as any).schema || '{\n  "type": "object",\n  "properties": {\n    "amount": {"type": "number"}\n  }\n}'}
                                    onChange={(e) => updateField('schema', e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Implementation (Python)</Label>
                                <Textarea
                                    className="h-48 font-mono text-xs"
                                    value={(formData as any).code || 'def calculate_tax(amount, region):\n    # Your logic here\n    return amount * 0.1'}
                                    onChange={(e) => updateField('code', e.target.value)}
                                />
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
                                <Label>Require Approval</Label>
                            </div>
                            <div className="grid gap-2">
                                <Label>Assigned Owner (Email)</Label>
                                <Input value={(formData as any).assignedOwner || ''} onChange={(e) => updateField('assignedOwner', e.target.value)} placeholder="manager@company.com" />
                            </div>
                            <div className="grid gap-2">
                                <Label>Timeout (Hours)</Label>
                                <Input type="number" value={(formData as any).timeoutHours || 24} onChange={(e) => updateField('timeoutHours', parseInt(e.target.value))} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Escalation Path</Label>
                                <Select value={(formData as any).escalation} onValueChange={(v) => updateField('escalation', v)}>
                                    <SelectTrigger><SelectValue placeholder="On Timeout..." /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="manager">Escalate to Manager</SelectItem>
                                        <SelectItem value="auto-reject">Auto-Reject</SelectItem>
                                    </SelectContent>
                                </Select>
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
                                    <Input value={(formData as any).baseUrl || ''} onChange={(e) => updateField('baseUrl', e.target.value)} placeholder="https://api.example.com/v1" />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label>Headers (JSON)</Label>
                                <Textarea
                                    className="h-20 font-mono text-xs"
                                    value={(formData as any).headers || '{\n  "Authorization": "Bearer ...",\n  "Content-Type": "application/json"\n}'}
                                    onChange={(e) => updateField('headers', e.target.value)}
                                />
                            </div>
                            {(formData as any).method !== 'GET' && (
                                <div className="grid gap-2">
                                    <Label>Body Template (JSON)</Label>
                                    <Textarea
                                        className="h-24 font-mono text-xs"
                                        value={(formData as any).body || '{\n  "key": "{{input.variable}}"\n}'}
                                        onChange={(e) => updateField('body', e.target.value)}
                                        placeholder="{}"
                                    />
                                </div>
                            )}
                            <div className="grid grid-cols-2 gap-2">
                                <div className="grid gap-2">
                                    <Label>Timeout (ms)</Label>
                                    <Input type="number" value={(formData as any).timeout || 5000} onChange={(e) => updateField('timeout', parseInt(e.target.value))} />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Retries</Label>
                                    <Input type="number" value={(formData as any).retryCount || 0} onChange={(e) => updateField('retryCount', parseInt(e.target.value))} />
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
                                        <SelectItem value="gpt-4o">GPT-4o (Latest)</SelectItem>
                                        <SelectItem value="gpt-4o-mini">GPT-4o Mini (Fast)</SelectItem>
                                        <SelectItem value="o1-preview">OpenAI o1-preview</SelectItem>
                                        <SelectItem value="o1-mini">OpenAI o1-mini</SelectItem>
                                        <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                                        <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                                        <SelectItem value="claude-3-5-sonnet-20241022">Claude 3.5 Sonnet (Latest)</SelectItem>
                                        <SelectItem value="claude-3-5-sonnet-20240620">Claude 3.5 Sonnet (June)</SelectItem>
                                        <SelectItem value="gemini-1.5-pro">Gemini 1.5 Pro</SelectItem>
                                        <SelectItem value="gemini-1.5-flash">Gemini 1.5 Flash</SelectItem>
                                        <SelectItem value="mistral-large-latest">Mistral Large</SelectItem>
                                        <SelectItem value="codestral-latest">Mistral Codestral</SelectItem>
                                        <SelectItem value="llama-3.1-70b-versatile">Groq Llama 3.1 70B</SelectItem>
                                        <SelectItem value="llama-3.1-8b-instant">Groq Llama 3.1 8B</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label className="text-destructive font-medium">API Key (Required)</Label>
                                <Input
                                    type="password"
                                    value={(formData as any).apiKey || ''}
                                    onChange={(e) => updateField('apiKey', e.target.value)}
                                    placeholder="sk-..."
                                    className="border-destructive/50 focus-visible:ring-destructive"
                                />
                                <p className="text-[10px] text-destructive">You must provide an API key to execute this node.</p>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="grid gap-2">
                                    <Label>Temperature ({(formData as any).temperature || 0.7})</Label>
                                    <Input
                                        type="range" min="0" max="1" step="0.1"
                                        value={(formData as any).temperature || 0.7}
                                        onChange={(e) => updateField('temperature', parseFloat(e.target.value))}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Top P (Nucleus)</Label>
                                    <Input
                                        type="number" step="0.1" min="0" max="1"
                                        value={(formData as any).topP || 1.0}
                                        onChange={(e) => updateField('topP', parseFloat(e.target.value))}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="grid gap-2">
                                    <Label>Frequency Penalty</Label>
                                    <Input
                                        type="number" step="0.1" min="-2" max="2"
                                        value={(formData as any).frequencyPenalty || 0}
                                        onChange={(e) => updateField('frequencyPenalty', parseFloat(e.target.value))}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Presence Penalty</Label>
                                    <Input
                                        type="number" step="0.1" min="-2" max="2"
                                        value={(formData as any).presencePenalty || 0}
                                        onChange={(e) => updateField('presencePenalty', parseFloat(e.target.value))}
                                    />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <div className="grid gap-2">
                                    <Label>Max Tokens</Label>
                                    <Input
                                        type="number"
                                        value={(formData as any).maxTokens || 2048}
                                        onChange={(e) => updateField('maxTokens', parseInt(e.target.value))}
                                    />
                                </div>
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

                    {selectedNode.data.type === 'logic-router' && (
                        <div className="space-y-4">
                            <div className="grid gap-2">
                                <Label>Routing Logic</Label>
                                <Select value={(formData as any).routingType} onValueChange={(v) => updateField('routingType', v)}>
                                    <SelectTrigger><SelectValue placeholder="Select Logic" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="classification">LLM Classification</SelectItem>
                                        <SelectItem value="regex">Keyword / Regex Match</SelectItem>
                                        <SelectItem value="conditional">Conditional (If/Else)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            {(formData as any).routingType === 'classification' && (
                                <div className="grid gap-2">
                                    <Label>Classification Model</Label>
                                    <Select value={(formData as any).model} onValueChange={(v) => updateField('model', v)}>
                                        <SelectTrigger><SelectValue placeholder="Select Model" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo (Fast)</SelectItem>
                                            <SelectItem value="gpt-4">GPT-4 (Accurate)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                            <div className="grid gap-2">
                                <Label>Rules Definition</Label>
                                <Textarea
                                    placeholder="If input contains 'refund', route to RefundNode..."
                                    className="h-32"
                                    value={(formData as any).rules || ''}
                                    onChange={(e) => updateField('rules', e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Default Route (No Match)</Label>
                                <Select value={(formData as any).defaultRoute} onValueChange={(v) => updateField('defaultRoute', v)}>
                                    <SelectTrigger><SelectValue placeholder="Select Behavior" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="error">Throw Error</SelectItem>
                                        <SelectItem value="fallback">Use Fallback Node</SelectItem>
                                        <SelectItem value="human">Escalate to Human</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}

                    {selectedNode.data.type === 'action-result' && (
                        <div className="space-y-4">
                            <div className="grid gap-2">
                                <Label>Result Processing</Label>
                                <Select value={(formData as any).processingType} onValueChange={(v) => updateField('processingType', v)}>
                                    <SelectTrigger><SelectValue placeholder="Select Processing" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="raw">Pass Raw Output</SelectItem>
                                        <SelectItem value="summarize">Summarize with LLM</SelectItem>
                                        <SelectItem value="format">Reformat (JSON/XML)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            {(formData as any).processingType === 'format' && (
                                <div className="grid gap-2">
                                    <Label>Format Template (Handlebars/JSON)</Label>
                                    <Textarea
                                        className="h-24 font-mono text-xs"
                                        value={(formData as any).formatTemplate || '{\n  "data": {{output}}\n}'}
                                        onChange={(e) => updateField('formatTemplate', e.target.value)}
                                        placeholder="{{output}}"
                                    />
                                </div>
                            )}
                            {(formData as any).processingType === 'summarize' && (
                                <div className="grid gap-2">
                                    <Label>Max Length (Sentences)</Label>
                                    <Input
                                        type="number"
                                        value={(formData as any).summaryLength || 3}
                                        onChange={(e) => updateField('summaryLength', parseInt(e.target.value))}
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    {selectedNode.data.type === 'guardrails' && (
                        <div className="space-y-4">
                            <div className="grid gap-2">
                                <Label>Guardrail Provider</Label>
                                <Select value={(formData as any).provider || 'simple'} onValueChange={(v) => updateField('provider', v)}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="simple">Simple Regex / Keywords</SelectItem>
                                        <SelectItem value="openai-moderation">OpenAI Moderation API</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {(formData as any).provider === 'simple' && (
                                <>
                                    <div className="grid gap-2">
                                        <Label>Forbidden Actions (Comma separated)</Label>
                                        <Textarea
                                            placeholder="Delete DB, POST to /admin..."
                                            value={(formData as any).forbiddenActions?.join(', ') || ''}
                                            onChange={(e) => updateField('forbiddenActions', e.target.value.split(',').map((s: string) => s.trim()))}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Custom Regex Patterns (One per line)</Label>
                                        <Textarea
                                            placeholder="^SSN: \d{3}-\d{2}-\d{4}$"
                                            className="h-24 font-mono text-xs"
                                            value={(formData as any).customRegex || ''}
                                            onChange={(e) => updateField('customRegex', e.target.value)}
                                        />
                                    </div>
                                </>
                            )}

                            {(formData as any).provider === 'openai-moderation' && (
                                <div className="space-y-3">
                                    <div className="grid gap-2">
                                        <Label>Strictness Level</Label>
                                        <Select value={(formData as any).strictness || 'medium'} onValueChange={(v) => updateField('strictness', v)}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="low">Low (Permissive)</SelectItem>
                                                <SelectItem value="medium">Medium (Standard)</SelectItem>
                                                <SelectItem value="high">High (Strict)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Categories to Block</Label>
                                        <div className="text-xs space-y-1">
                                            {['hate', 'self-harm', 'sexual', 'violence'].map(cat => (
                                                <div key={cat} className="flex items-center space-x-2">
                                                    <Checkbox
                                                        checked={((formData as any).blockedCategories || []).includes(cat)}
                                                        onCheckedChange={(checked) => {
                                                            const current = (formData as any).blockedCategories || [];
                                                            updateField('blockedCategories', checked
                                                                ? [...current, cat]
                                                                : current.filter((c: string) => c !== cat)
                                                            );
                                                        }}
                                                    />
                                                    <span>{cat.charAt(0).toUpperCase() + cat.slice(1)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center space-x-2">
                                <Switch
                                    checked={(formData as any).maskEmails}
                                    onCheckedChange={(c) => updateField('maskEmails', c)}
                                />
                                <Label>Mask Emails in Logs</Label>
                            </div>
                        </div>
                    )}

                    {/* --- SMB INTEGRATIONS --- */}
                    {selectedNode.data.type === 'email-receiver' && (
                        <div className="space-y-4">
                            <div className="grid gap-2">
                                <Label>Provider</Label>
                                <Select value={(formData as any).provider} onValueChange={(v) => updateField('provider', v)}>
                                    <SelectTrigger><SelectValue placeholder="Select Provider" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="gmail">Gmail</SelectItem>
                                        <SelectItem value="outlook">Outlook / Office 365</SelectItem>
                                        <SelectItem value="imap">Custom IMAP</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            {(formData as any).provider === 'imap' && (
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <Label>IMAP Host</Label>
                                        <Input value={(formData as any).imapHost || ''} onChange={(e) => updateField('imapHost', e.target.value)} placeholder="imap.mail.com" />
                                    </div>
                                    <div>
                                        <Label>Port</Label>
                                        <Input value={(formData as any).imapPort || '993'} onChange={(e) => updateField('imapPort', e.target.value)} placeholder="993" />
                                    </div>
                                </div>
                            )}
                            <div className="grid gap-2">
                                <Label>Email Address</Label>
                                <Input value={(formData as any).email || ''} onChange={(e) => updateField('email', e.target.value)} placeholder="support@company.com" />
                            </div>
                            <div className="grid gap-2">
                                <Label>App Password</Label>
                                <Input type="password" value={(formData as any).password || ''} onChange={(e) => updateField('password', e.target.value)} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Check Frequency (Minutes)</Label>
                                <Input type="number" value={(formData as any).frequency || 5} onChange={(e) => updateField('frequency', parseInt(e.target.value))} />
                            </div>
                        </div>
                    )}

                    {selectedNode.data.type === 'crm-tool' && (
                        <div className="space-y-4">
                            <div className="grid gap-2">
                                <Label>CRM Platform</Label>
                                <Select value={(formData as any).platform} onValueChange={(v) => updateField('platform', v)}>
                                    <SelectTrigger><SelectValue placeholder="Select CRM" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="hubspot">HubSpot</SelectItem>
                                        <SelectItem value="salesforce">Salesforce</SelectItem>
                                        <SelectItem value="pipedrive">Pipedrive</SelectItem>
                                        <SelectItem value="zoho">Zoho CRM</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label>Action</Label>
                                <Select value={(formData as any).action} onValueChange={(v) => updateField('action', v)}>
                                    <SelectTrigger><SelectValue placeholder="Select Action" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="create">Create Record</SelectItem>
                                        <SelectItem value="update">Update Record</SelectItem>
                                        <SelectItem value="search">Search / Find</SelectItem>
                                        <SelectItem value="delete">Delete Record</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-2">
                                <Label>Private App Access Token (Required)</Label>
                                <Input type="password" value={(formData as any).accessToken || ''} onChange={(e) => updateField('accessToken', e.target.value)} placeholder="pat-na1-..." />
                            </div>
                            <div className="grid gap-2">
                                <Label>Default Entity Type</Label>
                                <Select value={(formData as any).entityType} onValueChange={(v) => updateField('entityType', v)}>
                                    <SelectTrigger><SelectValue placeholder="Select Entity" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="contact">Contact</SelectItem>
                                        <SelectItem value="lead">Lead</SelectItem>
                                        <SelectItem value="deal">Deal</SelectItem>
                                        <SelectItem value="ticket">Ticket</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}

                    {selectedNode.data.type === 'doc-generator' && (
                        <div className="space-y-4">
                            <div className="grid gap-2">
                                <Label>Output Format</Label>
                                <Select value={(formData as any).outputFormat} onValueChange={(v) => updateField('outputFormat', v)}>
                                    <SelectTrigger><SelectValue placeholder="Select Format" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pdf">PDF Document</SelectItem>
                                        <SelectItem value="html">HTML Page</SelectItem>
                                        <SelectItem value="markdown">Markdown File</SelectItem>
                                        <SelectItem value="docx">Word Document</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label>Template Content (HTML/Liquid)</Label>
                                <Textarea
                                    className="h-48 font-mono text-xs"
                                    value={(formData as any).template || '<h1>Invoice #{{id}}</h1>\n<p>Total: {{amount}}</p>'}
                                    onChange={(e) => updateField('template', e.target.value)}
                                    placeholder="<html>...</html>"
                                />
                            </div>
                            <div className="flex items-center space-x-2">
                                <Switch checked={(formData as any).includeStyles} onCheckedChange={(c) => updateField('includeStyles', c)} />
                                <Label>Include Default Styles</Label>
                            </div>
                        </div>
                    )}



                    {selectedNode.data.type === 'ops-policy' && (
                        <div className="space-y-4">
                            <div className="grid gap-2">
                                <Label>Max Execution Cost ($)</Label>
                                <Input type="number" step="0.01" value={(formData as any).maxCost || 1.00} onChange={(e) => updateField('maxCost', parseFloat(e.target.value))} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Rate Limit (Requests/Min)</Label>
                                <Input type="number" value={(formData as any).rateLimit || 60} onChange={(e) => updateField('rateLimit', parseInt(e.target.value))} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Timeout (Seconds)</Label>
                                <Input type="number" value={(formData as any).timeout || 30} onChange={(e) => updateField('timeout', parseInt(e.target.value))} />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="grid gap-2">
                                    <Label>Max Retries</Label>
                                    <Input type="number" value={(formData as any).maxRetries || 3} onChange={(e) => updateField('maxRetries', parseInt(e.target.value))} />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Backoff Factor (x)</Label>
                                    <Input type="number" step="0.1" value={(formData as any).backoffFactor || 2.0} onChange={(e) => updateField('backoffFactor', parseFloat(e.target.value))} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="grid gap-2">
                                    <Label>Circuit Breaker (Failures)</Label>
                                    <Input type="number" value={(formData as any).failureThreshold || 5} onChange={(e) => updateField('failureThreshold', parseInt(e.target.value))} />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Reset Timeout (Sec)</Label>
                                    <Input type="number" value={(formData as any).resetTimeout || 60} onChange={(e) => updateField('resetTimeout', parseInt(e.target.value))} />
                                </div>
                            </div>
                        </div>
                    )}

                    {selectedNode.data.type === 'output-channel' && (
                        <div className="space-y-4">
                            <div className="grid gap-2">
                                <Label>Output Method</Label>
                                <Select value={(formData as any).method} onValueChange={(v) => updateField('method', v)}>
                                    <SelectTrigger><SelectValue placeholder="Select Method" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="webhook">Webhook POST</SelectItem>
                                        <SelectItem value="slack">Slack Message</SelectItem>
                                        <SelectItem value="email">Send Email</SelectItem>
                                        <SelectItem value="sms">SMS (Twilio)</SelectItem>
                                        <SelectItem value="whatsapp">WhatsApp (Meta)</SelectItem>
                                        <SelectItem value="storage">Cloud Storage (S3/GCS)</SelectItem>
                                        <SelectItem value="log">Console Log (Debug)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {(formData as any).method === 'slack' && (
                                <div className="space-y-3">
                                    <div className="grid gap-2">
                                        <Label>Bot User OAuth Token</Label>
                                        <Input type="password" value={(formData as any).slackToken || ''} onChange={(e) => updateField('slackToken', e.target.value)} placeholder="xoxb-..." />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Channel Payload</Label>
                                        <Input value={(formData as any).destination || ''} onChange={(e) => updateField('destination', e.target.value)} placeholder="#alerts" />
                                    </div>
                                </div>
                            )}
                            {(formData as any).method === 'email' && (
                                <div className="space-y-3">
                                    <div className="grid gap-2">
                                        <Label>Subject Line</Label>
                                        <Input value={(formData as any).emailSubject || ''} onChange={(e) => updateField('emailSubject', e.target.value)} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>To Address</Label>
                                        <Input value={(formData as any).destination || ''} onChange={(e) => updateField('destination', e.target.value)} placeholder="client@example.com" />
                                    </div>
                                </div>
                            )}
                            {(formData as any).method === 'webhook' && (
                                <div className="grid gap-2">
                                    <Label>Webhook URL</Label>
                                    <Input value={(formData as any).destination || ''} onChange={(e) => updateField('destination', e.target.value)} placeholder="https://api.external.com/catch" />
                                </div>
                            )}
                            {(formData as any).method === 'sms' && (
                                <div className="space-y-3">
                                    <div className="grid gap-2">
                                        <Label>To Phone Number</Label>
                                        <Input value={(formData as any).destination || ''} onChange={(e) => updateField('destination', e.target.value)} placeholder="+1234567890" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Account SID (Required)</Label>
                                        <Input value={(formData as any).accountSid || ''} onChange={(e) => updateField('accountSid', e.target.value)} placeholder="AC..." />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Auth Token (Required)</Label>
                                        <Input type="password" value={(formData as any).authToken || ''} onChange={(e) => updateField('authToken', e.target.value)} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>From Number / Messaging Service ID</Label>
                                        <Input value={(formData as any).fromNumber || ''} onChange={(e) => updateField('fromNumber', e.target.value)} placeholder="+1987654321" />
                                    </div>
                                </div>
                            )}
                            {(formData as any).method === 'whatsapp' && (
                                <div className="space-y-3">
                                    <div className="grid gap-2">
                                        <Label>To Phone Number</Label>
                                        <Input value={(formData as any).destination || ''} onChange={(e) => updateField('destination', e.target.value)} placeholder="+1234567890" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Phone Number ID (Required)</Label>
                                        <Input value={(formData as any).phoneNumberId || ''} onChange={(e) => updateField('phoneNumberId', e.target.value)} placeholder="100..." />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Access Token (Required)</Label>
                                        <Input type="password" value={(formData as any).accessToken || ''} onChange={(e) => updateField('accessToken', e.target.value)} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Template Name (Optional)</Label>
                                        <Input value={(formData as any).templateName || ''} onChange={(e) => updateField('templateName', e.target.value)} placeholder="hello_world" />
                                    </div>
                                </div>
                            )}
                            {(formData as any).method === 'storage' && (
                                <div className="space-y-3">
                                    <div className="grid gap-2">
                                        <Label>Bucket Name</Label>
                                        <Input value={(formData as any).bucketName || ''} onChange={(e) => updateField('bucketName', e.target.value)} placeholder="my-agent-outputs" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>AWS Access Key ID</Label>
                                        <Input value={(formData as any).accessKeyId || ''} onChange={(e) => updateField('accessKeyId', e.target.value)} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>AWS Secret Access Key</Label>
                                        <Input type="password" value={(formData as any).secretAccessKey || ''} onChange={(e) => updateField('secretAccessKey', e.target.value)} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>File Path / Prefix</Label>
                                        <Input value={(formData as any).destination || ''} onChange={(e) => updateField('destination', e.target.value)} placeholder="reports/" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Region</Label>
                                        <Input value={(formData as any).region || 'us-east-1'} onChange={(e) => updateField('region', e.target.value)} />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSave}>Save Configuration</Button>
                </DialogFooter>
            </DialogContent >
        </Dialog >
    );
}
