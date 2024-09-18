/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import ReactFlow, { ReactFlowProvider, Controls, Background } from 'reactflow';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';

import 'reactflow/dist/style.css';
import './style.scss';

import BlocksTray from '../blocks-tray';
import { CATEGORYS } from '../../constants';
import BlockPropertiesTray from '../block-properties-tray';
import { ComboBox } from '@carbon/react';

const DialogFlowDesigner = ({
  connectionLineStyle,
  defaultViewport,
  snapGrid,
  dialogFlowWrapper,
  dialogNodes,
  dialogEdges,
  onDialogNodesChange,
  onDialogEdgesChange,
  setDialogFlowInstance,
  onDialogNodeConnect,
  onDialogNodeDrop,
  onDialogNodeDragOver,
  onDialogNodeClick,
  onDialogNodeDoubleClick,
  DIALOG_NODE_TYPES,
  DIALOG_EDGE_TYPES,
  openDialogPropertiesBlock,
  selectedTaskNode,
  selectedDialogNode,
  setOpenDialogPropertiesBlock,
  readOnly,
  onDesignFormBtnClick,
  isDialogFlowActive,
  setNotificationProps, //toast message config
  deleteBranchNodeConnector
}) => {
  const dialogPropPanelRef = useRef();
  const [tasks, setTasks] = useState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  
  const handleExpansion = (expand, ref) => {
    expand ? ref.current?.resize(180) : ref.current?.resize(34);
  };

  useEffect(() => {
    if (dialogNodes) {
      setTasks(dialogNodes.filter((nodeInfo) => !['START', 'END'].includes(nodeInfo.type)));
    }
  }, [dialogNodes]);

  return (
    <div className="dnd-flow">
      <PanelGroup direction="horizontal">
        <Panel minSize={0}>
          <div className="dnd-flow">
            {/* Tasks Block */}
            {!readOnly && <BlocksTray category={CATEGORYS.DIALOG} readOnly={readOnly} setOpenPropertiesBlock={setOpenDialogPropertiesBlock} />}

            {/* Flow Designer Block  */}
            <ReactFlowProvider>
              <div className="reactflow-wrapper" ref={dialogFlowWrapper}>
                <ComboBox
                  onChange={({ selectedItem }) => {
                    selectedItem != null && onDialogNodeClick(null, selectedItem);
                    selectedItem != null && reactFlowInstance.fitView({ nodes: [{ id: selectedItem.id }], duration: 500 });
                  }}
                  id="task-combobox"
                  placeholder="Search"
                  items={tasks}
                  itemToString={(item) => (item ? (item.data?.editableProps?.name ? item.data.editableProps?.name : item.data.id) : '')}
                />
                <ReactFlow
                  nodes={dialogNodes}
                  edges={dialogEdges}
                  onNodesChange={onDialogNodesChange}
                  onEdgesChange={onDialogEdgesChange}
                  onConnect={onDialogNodeConnect}
                  onDrop={onDialogNodeDrop}
                  onDragOver={onDialogNodeDragOver}
                  onNodeClick={onDialogNodeClick}
                  onNodeDoubleClick={onDialogNodeDoubleClick}
                  nodeTypes={DIALOG_NODE_TYPES}
                  edgeTypes={DIALOG_EDGE_TYPES}
                  onInit={(t) => {
                    setReactFlowInstance(t);
                    setDialogFlowInstance(t);
                  }}
                  connectionLineStyle={connectionLineStyle}
                  defaultViewport={defaultViewport}
                  snapGrid={snapGrid}
                >
                  <Background color="#ccc" variant="dots" />
                  <Controls position="bottom-right" />
                </ReactFlow>
              </div>
            </ReactFlowProvider>
          </div>
        </Panel>
        {openDialogPropertiesBlock && (
          <>
            <PanelResizeHandle />
            <Panel minSize={40} defaultSize={40} ref={dialogPropPanelRef}>
              <div className="dnd-flow">
                <div className="task-properties-container">
                  <BlockPropertiesTray
                    selectedNode={selectedDialogNode}
                    setOpenPropertiesBlock={setOpenDialogPropertiesBlock}
                    selectedTaskNode={selectedTaskNode}
                    readOnly={readOnly}
                    onDesignFormBtnClick={(e) => {
                      onDesignFormBtnClick(e, selectedDialogNode);
                    }}
                    onExpand={(isExpanded) => handleExpansion(isExpanded, dialogPropPanelRef)}
                    setNotificationProps={setNotificationProps}
                    deleteBranchNodeConnector={deleteBranchNodeConnector}
                    isDialogFlowActive={isDialogFlowActive}
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

export default DialogFlowDesigner;