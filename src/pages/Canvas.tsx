import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAgentStore } from '@/store/agentStore';
import { AgentCanvas } from '@/components/canvas/AgentCanvas';

export default function Canvas() {
  const navigate = useNavigate();
  const { currentAgent } = useAgentStore();
  
  useEffect(() => {
    // Redirect to entry if no agent is created
    if (!currentAgent) {
      navigate('/');
    }
  }, [currentAgent, navigate]);
  
  if (!currentAgent) {
    return null;
  }
  
  return <AgentCanvas />;
}
