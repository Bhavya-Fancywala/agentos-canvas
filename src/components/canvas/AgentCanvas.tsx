import { useCallback, useRef } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  ReactFlowProvider,
  NodeTypes,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useAgentStore } from '@/store/agentStore';
import AgentNode from './AgentNode'; // Keeping as fallback
import { NodePalette } from './NodePalette';
import { NodeInspector } from './NodeInspector';
import { ValidationPanel } from './ValidationPanel';
import { CanvasHeader } from './CanvasHeader';
import { SimulationOverlay } from './SimulationOverlay';
import CustomEdge from './CustomEdge';
import { CustomConnectionLine } from './CustomConnectionLine';

// New AgentOS Components
import { NodeConfigModal } from '../agentos/modals/NodeConfigModal';
import { TriggerNode } from '../agentos/nodes/entry/TriggerNode';
import { InputChannelNode } from '../agentos/nodes/entry/InputChannelNode';
import { AgentGoalNode } from '../agentos/nodes/processing/AgentGoalNode';
import { AgentBrainNode } from '../agentos/nodes/processing/AgentBrainNode';
import { LogicRouterNode } from '../agentos/nodes/processing/LogicRouterNode';
// Bulk import for brevity
import {
  KnowledgeBaseNode, MemoryStoreNode, ToolDefinitionNode, ApiActionNode,
  OutputChannelNode, ActionResultNode, GuardrailsNode, HumanControlNode, OpsPolicyNode,
  EmailReceiverNode, CrmToolNode, DocGeneratorNode
} from '../agentos/nodes/RemainingNodes';


const nodeTypes: NodeTypes = {
  // Legacy fallback
  agentNode: AgentNode,

  // Entry
  trigger: TriggerNode,
  'input-channel': InputChannelNode,

  // Processing
  'agent-goal': AgentGoalNode,
  'agent-brain': AgentBrainNode,
  'logic-router': LogicRouterNode,

  // Data
  'knowledge-base': KnowledgeBaseNode,
  'memory-config': MemoryStoreNode,

  // Execution
  'tool-definition': ToolDefinitionNode,
  'api-action': ApiActionNode,

  // Exit
  'output-channel': OutputChannelNode,
  'action-result': ActionResultNode,

  // Governance
  'guardrails': GuardrailsNode,
  'human-control': HumanControlNode,

  // Infra
  'ops-policy': OpsPolicyNode,

  // SMB Nodes
  'email-receiver': EmailReceiverNode,
  'crm-tool': CrmToolNode,
  'doc-generator': DocGeneratorNode,
};

const edgeTypes = {
  customEdge: CustomEdge,
};

function AgentCanvasInner() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    selectNode,
    isSimulationMode,
    isPaletteOpen,
  } = useAgentStore();

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/agentnode');
      if (!type || !reactFlowWrapper.current) return;

      const bounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = {
        x: event.clientX - bounds.left - 90,
        y: event.clientY - bounds.top - 40,
      };

      addNode(type, position);
    },
    [addNode]
  );

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: { id: string }) => {
      selectNode(node.id);
    },
    [selectNode]
  );

  const onPaneClick = useCallback(() => {
    selectNode(null);
  }, [selectNode]);

  return (
    <div className="h-screen w-full bg-background relative overflow-hidden">
      <CanvasHeader />

      <div ref={reactFlowWrapper} className="h-full w-full pt-16">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDragOver={onDragOver}
          onDrop={onDrop}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          snapToGrid
          snapGrid={[20, 20]}
          defaultEdgeOptions={{
            type: 'customEdge',
            animated: true,
            style: { strokeWidth: 2 },
          }}
          connectionLineComponent={CustomConnectionLine}
          proOptions={{ hideAttribution: true }}
          className="bg-background"
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={20}
            size={1}
            color="hsl(217, 19%, 20%)"
          />
          <div
            className="absolute bottom-8 transition-all duration-300 ease-spring"
            style={{ left: isPaletteOpen ? '360px' : '24px', zIndex: 5 }}
          >
            <Controls
              showInteractive={false}
              className="!bg-background/80 !backdrop-blur-md !border-border !rounded-lg !shadow-lg [&>button]:!bg-transparent [&>button]:!border-0 [&>button]:!text-muted-foreground [&>button:hover]:!text-foreground [&>button:hover]:!bg-secondary/50 !p-1 !gap-1 !flex !flex-col"
            />
          </div>
          <MiniMap
            className="!bg-card !border-border !rounded-lg"
            nodeColor={(node) => {
              const category = node.data?.category as string;
              // Simplified map
              if (category === 'entry') return 'hsl(262, 83%, 58%)';
              if (category === 'processing') return 'hsl(187, 85%, 53%)';
              return 'hsl(217, 19%, 45%)';
            }}
            maskColor="hsl(222, 47%, 6%, 0.8)"
          />
        </ReactFlow>
      </div>

      <NodePalette />
      <NodeInspector />
      <NodeConfigModal /> {/* Added Modal */}
      <ValidationPanel />
      {isSimulationMode && <SimulationOverlay />}
    </div>
  );
}

export function AgentCanvas() {
  return (
    <ReactFlowProvider>
      <AgentCanvasInner />
    </ReactFlowProvider>
  );
}
