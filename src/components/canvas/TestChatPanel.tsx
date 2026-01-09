import { useState, useRef, useEffect } from 'react';
import { useAgentStore } from '@/store/agentStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Send, Bot, User, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface Message {
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: Date;
}

export function TestChatPanel() {
    const { isChatOpen, toggleChat, executeAgent } = useAgentStore();
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: 'system', content: 'AgentOS Test Console initialized.', timestamp: new Date() }
    ]);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isChatOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMsg = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMsg, timestamp: new Date() }]);
        setIsLoading(true);

        try {
            const result = await executeAgent(userMsg);

            // "expert" handling: check for explicit output, or fallback to status
            let output = "Workflow executed, but no response generated.";

            if (result.output && result.output !== "No Output Generated (Check Logs)") {
                output = typeof result.output === 'string'
                    ? result.output
                    : JSON.stringify(result.output, null, 2);
            } else if (result.full_state?.intermediate_steps) {
                // If no main output, show the last step's result as a fallback debug info
                const steps = result.full_state.intermediate_steps;
                const lastStepKey = Object.keys(steps).pop();
                if (lastStepKey) {
                    output = `[Debug] Ended at ${lastStepKey}: ${JSON.stringify(steps[lastStepKey])}`;
                }
            }

            setMessages(prev => [...prev, { role: 'assistant', content: output, timestamp: new Date() }]);
        } catch (error: any) {
            console.error(error);
            setMessages(prev => [...prev, { role: 'system', content: `Error: ${error.message}`, timestamp: new Date() }]);
            toast.error("Execution Failed");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isChatOpen) return null;

    return (
        <div className="absolute bottom-4 right-4 w-[400px] h-[500px] bg-background border border-border rounded-xl shadow-2xl flex flex-col z-50 glass overflow-hidden animate-in slide-in-from-bottom-10 fade-in">
            {/* Header */}
            <div className="h-14 border-b border-border/50 flex items-center justify-between px-4 bg-muted/30">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Bot className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold">Test Workflow</h3>
                        <p className="text-[10px] text-muted-foreground">Live Execution</p>
                    </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={toggleChat}>
                    <X className="h-4 w-4" />
                </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
                {messages.map((msg, i) => (
                    <div key={i} className={cn(
                        "flex gap-3 text-sm",
                        msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                    )}>
                        <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                            msg.role === 'user' ? "bg-primary text-primary-foreground" :
                                msg.role === 'system' ? "bg-destructive/10 text-destructive" : "bg-muted text-foreground"
                        )}>
                            {msg.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                        </div>
                        <div className={cn(
                            "px-3 py-2 rounded-lg max-w-[80%]",
                            msg.role === 'user' ? "bg-primary text-primary-foreground" :
                                msg.role === 'system' ? "bg-destructive/10 text-destructive text-xs font-mono" : "bg-muted/50 border border-border"
                        )}>
                            {msg.content}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex items-center gap-2 text-muted-foreground text-xs ml-11">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Agent is thinking...
                    </div>
                )}
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-border/50 bg-background/50">
                <div className="flex gap-2">
                    <Input
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        placeholder="Type a message to trigger flow..."
                        className="flex-1"
                        disabled={isLoading}
                        autoFocus
                    />
                    <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </form>
        </div>
    );
}
