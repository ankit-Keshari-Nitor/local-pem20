/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import ReactFlow, { ReactFlowProvider, Controls, Background } from 'reactflow';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';

import 'reactflow/dist/style.css';
import './style.scss';

import BlocksTray from '../blocks-tray';
import { CATEGORYS } from '../../constants';
import BlockPropertiesTray from '../block-properties-tray';
import ActivityDefinitionForm from '../activity-definition-form';
import { ComboBox } from '@carbon/react';

const TaskFlowDesigner = ({
  connectionLineStyle,
  defaultViewport,
  snapGrid,
  taskFlowWrapper,
  nodes,
  edges,
  onTaskNodesChange,
  onTaskEdgesChange,
  setTaskFlowInstance,
  onTaskNodeConnect,
  onTaskNodeDrop,
  onTaskNodeDragOver,
  onTaskNodeClick,
  onTaskNodeDoubleClick,
  TASK_NODE_TYPES,
  TASK_EDGE_TYPES,
  openTaskPropertiesBlock,
  selectedTaskNode,
  setOpenTaskPropertiesBlock,
  updateActivityDetails,
  activityDefinitionData,
  activityOperation,
  readOnly,
  showActivityDefineDrawer,
  setShowActivityDefineDrawer,
  onVersionSelection,
  versionData,
  selectedVersion,
  deleteBranchNodeConnector,
  isDialogFlowActive,
  setNotificationProps //toast message config
}) => {
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const activityDefPanelRef = useRef();
  const blockPropPanelRef = useRef();
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (nodes) {
      setTasks(nodes.filter((nodeInfo) => !['START', 'END'].includes(nodeInfo.type)));
    }
  }, [nodes]);

  const handleExpansion = (expand, ref) => {
    expand ? ref.current?.resize(180) : ref.current?.resize(40);
  };

  return (
    <div className="dnd-flow">
      <PanelGroup direction="horizontal">
        <Panel minSize={0}>
          <div className="dnd-flow">
            {/* Tasks Block */}
            {!readOnly && <BlocksTray category={CATEGORYS.TASK} readOnly={readOnly} setOpenPropertiesBlock={setOpenTaskPropertiesBlock} />}

            {/* Flow Designer Block  */}
            <ReactFlowProvider>
              <div className="reactflow-wrapper" ref={taskFlowWrapper}>
                <ComboBox
                  onChange={({ selectedItem }) => {
                    selectedItem != null && onTaskNodeClick(null, selectedItem);
                    selectedItem != null && reactFlowInstance.fitView({ nodes: [{ id: selectedItem.id }], duration: 500, minZoom: 20, maxZoom: 1.6 });
                    selectedItem == null && reactFlowInstance.fitView({ nodes: null, duration: 500, minZoom: 20, maxZoom: 1 });
                  }}
                  id="task-combobox"
                  placeholder="Search"
                  items={tasks}
                  itemToString={(item) => (item ? (item.data?.editableProps?.name ? item.data.editableProps?.name : item.data.id) : '')}
                />
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={onTaskNodesChange}
                  onEdgesChange={onTaskEdgesChange}
                  onInit={(t) => {
                    setReactFlowInstance(t);
                    setTaskFlowInstance(t);
                  }}
                  onConnect={onTaskNodeConnect}
                  onDrop={onTaskNodeDrop}
                  onDragOver={onTaskNodeDragOver}
                  onNodeClick={onTaskNodeClick}
                  onNodeDoubleClick={onTaskNodeDoubleClick}
                  nodeTypes={TASK_NODE_TYPES}
                  edgeTypes={TASK_EDGE_TYPES}
                  connectionLineStyle={connectionLineStyle}
                  defaultViewport={defaultViewport}
                  snapGrid={snapGrid}
                >
                  <Background color="#ffffff" variant="dots" />
                  <Controls position="bottom-right" />
                </ReactFlow>
              </div>
            </ReactFlowProvider>
          </div>
        </Panel>
        {openTaskPropertiesBlock && (
          <>
            <PanelResizeHandle />
            <Panel minSize={40} defaultSize={50} ref={blockPropPanelRef}>
              <div className="dnd-flow">
                <div className="task-properties-container">
                  <BlockPropertiesTray
                    selectedNode={selectedTaskNode}
                    setOpenPropertiesBlock={setOpenTaskPropertiesBlock}
                    readOnly={readOnly}
                    onExpand={(isExpanded) => handleExpansion(isExpanded, blockPropPanelRef)}
                    setNotificationProps={setNotificationProps}
                    deleteBranchNodeConnector={deleteBranchNodeConnector}
                    isDialogFlowActive={isDialogFlowActive}
                  />
                </div>
              </div>
            </Panel>
          </>
        )}
        {showActivityDefineDrawer && !openTaskPropertiesBlock && (
          <>
            <PanelResizeHandle />
            <Panel ref={activityDefPanelRef} defaultSize={50} minSize={40}>
              <div className="dnd-flow">
                <div className="task-properties-container">
                  <ActivityDefinitionForm
                    //selectedNode={selectedTaskNode}
                    setShowActivityDefineDrawer={setShowActivityDefineDrawer}
                    onActivityDetailsSave={updateActivityDetails}
                    activityOperation={activityOperation}
                    activityDefinitionData={activityDefinitionData}
                    readOnly={readOnly}
                    versionData={versionData}
                    selectedVersion={selectedVersion}
                    onVersionSelection={onVersionSelection}
                    onExpand={(isExpanded) => handleExpansion(isExpanded, activityDefPanelRef)}
                    setNotificationProps={setNotificationProps}
                  />
                </div>
              </div>
            </Panel>
          </>
        )}
      </PanelGroup>
    </div>
  );
};

export default TaskFlowDesigner;
