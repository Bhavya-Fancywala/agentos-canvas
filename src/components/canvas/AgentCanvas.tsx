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
import AgentNode from './AgentNode';
import { NodePalette } from './NodePalette';
import { NodeInspector } from './NodeInspector';
import { ValidationPanel } from './ValidationPanel';
import { CanvasHeader } from './CanvasHeader';
import { SimulationOverlay } from './SimulationOverlay';

const nodeTypes: NodeTypes = {
  agentNode: AgentNode,
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
          fitView
          snapToGrid
          snapGrid={[20, 20]}
          defaultEdgeOptions={{
            type: 'smoothstep',
            animated: true,
            style: { stroke: 'hsl(187, 85%, 53%)', strokeWidth: 2 },
          }}
          proOptions={{ hideAttribution: true }}
          className="bg-background"
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={20}
            size={1}
            color="hsl(217, 19%, 20%)"
          />
          <Controls 
            className="!bg-card !border-border !rounded-lg [&>button]:!bg-card [&>button]:!border-border [&>button]:!text-foreground [&>button:hover]:!bg-secondary"
          />
          <MiniMap
            className="!bg-card !border-border !rounded-lg"
            nodeColor={(node) => {
              const category = node.data?.category as string;
              const colorMap: Record<string, string> = {
                intent: 'hsl(262, 83%, 58%)',
                intelligence: 'hsl(187, 85%, 53%)',
                memory: 'hsl(38, 92%, 50%)',
                capability: 'hsl(142, 71%, 45%)',
                safety: 'hsl(0, 72%, 51%)',
                human: 'hsl(280, 65%, 60%)',
                time: 'hsl(200, 70%, 50%)',
                cost: 'hsl(25, 95%, 53%)',
                observability: 'hsl(170, 75%, 41%)',
                environment: 'hsl(217, 19%, 45%)',
                testing: 'hsl(290, 60%, 55%)',
              };
              return colorMap[category] || 'hsl(217, 19%, 45%)';
            }}
            maskColor="hsl(222, 47%, 6%, 0.8)"
          />
        </ReactFlow>
      </div>
      
      <NodePalette />
      <NodeInspector />
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
