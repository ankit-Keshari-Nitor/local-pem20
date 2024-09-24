import React, { useState, useRef, useCallback, forwardRef } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { addEdge, useNodesState, useEdgesState, applyNodeChanges } from 'reactflow';
import './workflow-designer.scss';
import PageDesigner from '@b2bi/page-designer';
import componentMapper from '@b2bi/carbon-mappers';
import { DialogFlowDesigner, TaskFlowDesigner } from '../flow-designers';
import {
  connectionLineStyle,
  defaultViewport,
  snapGrid,
  endMarks,
  TASK_NODE_TYPES,
  TASK_EDGE_TYPES,
  DIALOG_NODE_TYPES,
  DIALOG_EDGE_TYPES,
  NODE_TYPE,
  branchCondition,
  NODE_TYPES
} from '../../constants';
import { useEffect } from 'react';
import useTaskStore from '../../store';
import { Layer, IconButton } from '@carbon/react';
import { Edit, CloseLarge } from '@carbon/icons-react';
import { v4 as uuid } from 'uuid';
import { getInitialNodeEdges } from '../../utils/workflow-element-utils';

let dialogBranchId = 0;
const getNewDialogBranchId = () => `Branch_${dialogBranchId++}`;

let taskBranchId = 0;
const getNewTaskBranchId = () => `Branch_${taskBranchId++}`;

let dialogId = 0;
const getNewDialogId = () => `Dialog_Name_${dialogId++}`;

let taskId = 0;
const getNewTaskId = () => `Task_Name_${taskId++}`;

const WorkFlowDesigner = forwardRef(
  ({
    showActivityDefineDrawer,
    setShowActivityDefineDrawer,
    setActivityDesignerStack,
    updateActivityDetails, //updates activity basic details and version specific details to web/activity-store
    updateActivitySchema, //update activity schema - nodes & edges to web/activity-store
    activityDefinitionData, //local state variable from web/activity-definition page
    activityOperation, //mode of operation - new/view/edit
    readOnly, //readonly mode flag
    onVersionSelection, //on version change callback for web/activity-definition page to load version specific data
    versionData, //array of all versions of current activity
    selectedVersion, //current selected version,
    setNotificationProps //toast message config
  }) => {
    //-------------------------------- State Management -------------------------------------
    const store = useTaskStore();
    const storeData = useTaskStore((state) => state.tasks);
    const [isDialogFlowActive, setIsDialogFlowActive] = useState(false);
    const [isPageDesignerActive, setIsPageDesignerActive] = useState(false);
    const editTask = useTaskStore((state) => state.editTaskNodePros);
    const editDialog = useTaskStore((state) => state.editDialogNodePros);

    // --------------------------------- Task Flow States -----------------------------------
    const taskFlowWrapper = useRef(null);
    const [openTaskPropertiesBlock, setOpenTaskPropertiesBlock] = useState();
    const [nodes, setTaskNodes] = useNodesState([]);
    const [edges, setTaskEdges, onTaskEdgesChange] = useEdgesState([]);
    const [taskFlowInstance, setTaskFlowInstance] = useState(null);
    const [selectedTaskNode, setSelectedTaskNode] = useState(null);

    // --------------------------------- Dialog Flow States -----------------------------------
    const dialogFlowWrapper = useRef(null);
    const [openDialogPropertiesBlock, setOpenDialogPropertiesBlock] = useState(false);
    const [dialogNodes, setDialogNodes] = useNodesState([]);
    const [dialogEdges, setDialogEdges, onDialogEdgesChange] = useEdgesState([]);
    const [dialogFlowInstance, setDialogFlowInstance] = useState(null);
    const [selectedDialogNode, setSelectedDialogNode] = useState(null);

    // -------------------------------- Form Layout --------------------------------------------
    const [formFields, setFormFields] = useState();

    const [isdialogNodeDelete, setIsdialogNodeDelete] = useState(false);

    // -------------------------------- Node Deletion -------------------------------------------
    const nodeDataRef = useRef(storeData);

    // -------------------------------- For Updating Node Position -----------------------------
    const isTaskNodePositionChange = useRef(false);
    const isDialogNodePositionChange = useRef(false);

    const onTaskNodesChange = useCallback(
      (taskNodeChanges) => {
        setTaskNodes((oldNodes) => applyNodeChanges(taskNodeChanges, oldNodes));
        isTaskNodePositionChange.current = true;
      },
      [setTaskNodes]
    );
    console.log('storeData>>>',storeData);
    const onDialogNodesChange = useCallback(
      (dialogNodeChanges) => {
        setDialogNodes((oldNodes) => applyNodeChanges(dialogNodeChanges, oldNodes));
        isDialogNodePositionChange.current = true;
      },
      [setDialogNodes]
    );

    // Initializing the Task Flow Nodes and Edges
    useEffect(() => {
      const instanceNodes = taskFlowInstance ? taskFlowInstance.getNodes() : storeData.nodes;
      // const instanceEdges = taskFlowInstance ? taskFlowInstance.getEdges() : storeData.edges;

      setTaskEdges(storeData.edges);
      if (taskFlowInstance) {
        const newNodes = storeData.nodes.map((node) => {
          const n = instanceNodes.find((x) => x.id === node.id);
          return { ...node, position: n ? n.position : node.position };
        });
        setTaskNodes(newNodes);
        // setOpenTaskPropertiesBlock(false);
        if (selectedTaskNode || isdialogNodeDelete) {
          const dialogNodeData = newNodes.filter((node) => node.id === selectedTaskNode.id)[0];
          setDialogNodes(dialogNodeData?.data?.dialogNodes);
          setDialogEdges(dialogNodeData?.data?.dialogEdges);
          // setOpenDialogPropertiesBlock(false);
          setIsdialogNodeDelete(false);
        }
      }
      nodeDataRef.current = storeData;

      // setTimeout(() => {
      //   //this is sending the new schema to web page  - activity-definition.js
      //   //updateActivitySchema({ nodes, edges });
      //   //updateActivitySchema(storeData);
      // }, 200);
      updateActivitySchema(storeData);
    }, [setTaskNodes, setTaskEdges, storeData, updateActivitySchema]);

    useEffect(() => {
      if (isTaskNodePositionChange.current) {
        store.setTaskNodes(nodes);
        isTaskNodePositionChange.current = false;
      }
    }, [nodes]);

    useEffect(() => {
      if (isDialogNodePositionChange.current) {
        store.setDialogNodes(selectedTaskNode.id, dialogNodes);
        isDialogNodePositionChange.current = false;
      }
    }, [dialogNodes]);

    const deleteNode = (id, isdialog, selectedTaskNodeId) => {
      setIsdialogNodeDelete(isdialog);
      const dialogData = isdialog && nodeDataRef.current.nodes.filter((node) => node.id === selectedTaskNodeId)[0];
      const nodesData = isdialog ? dialogData?.data?.dialogNodes : nodeDataRef.current.nodes;
      const edgesData = isdialog ? dialogData?.data?.dialogEdges : nodeDataRef.current.edges;

      // Delete Node
      const newNodes = nodesData.filter((n) => n.id !== id);
      if (isdialog) {
        const taskNodeData = nodeDataRef.current.nodes.map((node) => {
          if (node.id === selectedTaskNodeId) {
            const {
              data: { dialogNodes, ...restdata },
              ...rest
            } = node;
            return { ...rest, data: { ...restdata, dialogNodes: newNodes } };
          } else {
            return node;
          }
        });
        nodeDataRef.current.nodes = taskNodeData;
      } else {
        nodeDataRef.current.nodes = newNodes;
      }
      isdialog ? setDialogNodes(newNodes) : setTaskNodes(newNodes);
      isdialog ? store.setDialogNodes(selectedTaskNodeId, newNodes) : store.setTaskNodes(newNodes);

      // Delete connected Edges
      let sourceEdge;
      let targetEdge;
      const newEdges = edgesData.filter((n) => {
        if (n.source === id) {
          sourceEdge = n;
          return false;
        } else if (n.target === id) {
          targetEdge = n;
        } else {
          return true;
        }
      });
      // Delete node bypass for connecting Edges
      let updatedEdge = newEdges;
      if (targetEdge?.source && sourceEdge?.target) {
        const newEdge = {
          markerEnd: sourceEdge?.markerEnd,
          type: sourceEdge?.type,
          id: `${targetEdge?.source}_to_${sourceEdge?.target}`,
          source: targetEdge?.source,
          target: sourceEdge?.target,
          data: isdialog ? { id: selectedTaskNodeId } : sourceEdge?.data,
          style: sourceEdge?.style,
          sourceHandle: targetEdge.sourceHandle,
          targetHandle: sourceEdge.targetHandle
        };
        updatedEdge = [...newEdges, newEdge];
      }
      if (isdialog) {
        const taskNodeData = nodeDataRef.current.edges.map((node) => {
          if (node.id === selectedTaskNodeId) {
            const {
              data: { dialogEdges, ...restdata },
              ...rest
            } = node;
            return { ...rest, data: { ...restdata, dialogEdges: updatedEdge } };
          } else {
            return node;
          }
        });
        nodeDataRef.current.nodes = taskNodeData;
      } else {
        nodeDataRef.current.edges = updatedEdge;
      }
      isdialog ? setDialogEdges(updatedEdge) : setTaskEdges(updatedEdge);
      isdialog ? store.setDialogEdges(selectedTaskNodeId, updatedEdge) : store.setTaskEdges(updatedEdge);
    };

    // Copying Node from contextMenu
    const copyNode = (id, isdialog, selectedTaskNodeId) => {
      setIsdialogNodeDelete(isdialog);
      const dialogData = isdialog && nodeDataRef.current.nodes.filter((node) => node.id === selectedTaskNodeId)[0];
      const nodesData = isdialog ? dialogData?.data?.dialogNodes : nodeDataRef.current.nodes;
      //const edgesData = isdialog ? dialogData?.data?.dialogEdges : nodeDataRef.current.edges;

      // Copying Node
      const [originalNode] = nodesData.filter((n) => n.id === id);
      const newNode = {
        id: 'dup-' + originalNode.id,
        type: originalNode.type,
        position: { x: originalNode.position.x + 170, y: originalNode.position.y },
        data: {
          ...NODE_TYPES[originalNode.type],
          id: originalNode.data?.id,
          category: isdialog ? 'dialog' : 'task',
          editableProps: originalNode.data?.editableProps,
          onContextMenuClick: originalNode.data?.onContextMenuClick,
          exitValidationQuery: originalNode.data?.exitValidationQuery
        }
      };
      if (!isdialog) {
        // Dialog Nodes
        const dialogNodes = originalNode.data?.dialogNodes.map((dialogNode) => {
          const { data, ...rest } = dialogNode;
          const newDialogNode = {
            ...rest,
            id: 'dup-' + dialogNode.id
          };
          switch (dialogNode.type) {
            case 'START':
            case 'END':
              newDialogNode.data = {
                ...dialogNode.data
              };
              break;
            case 'FORM':
              newDialogNode.data = {
                ...NODE_TYPES[dialogNode.type],
                editableProps: dialogNode.data.editableProps,
                onContextMenuClick: (id, menu) => onNodeContextOptionClick(id, menu, true, 'dup-' + originalNode.id),
                id: dialogNode.data.id,
                form: dialogNode.data.form,
                exitValidationQuery: dialogNode.data.exitValidationQuery
              };
              break;
            case 'API':
              newDialogNode.data = {
                ...NODE_TYPES[dialogNode.type],
                editableProps: dialogNode.data.editableProps,
                onContextMenuClick: (id, menu) => onNodeContextOptionClick(id, menu, true, 'dup-' + originalNode.id),
                id: dialogNode.data.id,
                exitValidationQuery: dialogNode.data.exitValidationQuery
              };
              break;
            case 'XSLT':
              newDialogNode.data = {
                ...NODE_TYPES[dialogNode.type],
                editableProps: dialogNode.data.editableProps,
                onContextMenuClick: (id, menu) => onNodeContextOptionClick(id, menu, true, 'dup-' + originalNode.id),
                id: dialogNode.data.id,
                exitValidationQuery: dialogNode.data.exitValidationQuery
              };
              break;
            case 'BRANCH_START':
              newDialogNode.data = {
                ...NODE_TYPES[dialogNode.type],
                editableProps: dialogNode.data.editableProps,
                onContextMenuClick: (id, menu) => onNodeContextOptionClick(id, menu, true, 'dup-' + originalNode.id),
                id: dialogNode.data.id,
                form: dialogNode.data.form,
                exitValidationQuery: dialogNode.data.exitValidationQuery
              };
              break;
            case 'BRANCH_END':
              newDialogNode.data = {
                ...NODE_TYPES[dialogNode.type],
                editableProps: dialogNode.data.editableProps,
                onContextMenuClick: (id, menu) => onNodeContextOptionClick(id, menu, true, 'dup-' + originalNode.id),
                id: dialogNode.data.id,
                form: dialogNode.data.form,
                exitValidationQuery: dialogNode.data.exitValidationQuery
              };
              break;
            default:
              break;
          }
          return newDialogNode;
        });
        // Dialog Edges
        const dialogEdges = originalNode.data?.dialogEdges.map((dialogedge) => {
          const neeDialogEdge = {
            ...dialogedge,
            id: 'dup-' + dialogedge.id,
            source: 'dup-' + dialogedge.source,
            target: 'dup-' + dialogedge.target,
            data: {
              ...dialogedge.data,
              id: 'dup-' + dialogedge.data.id
            }
          };

          return neeDialogEdge;
        });

        newNode.data.dialogEdges = dialogEdges;
        newNode.data.dialogNodes = dialogNodes;
      }

      const newNodes = [...nodesData, { ...newNode }];
      if (isdialog) {
        const taskNodeData = nodeDataRef.current.nodes.map((node) => {
          if (node.id === selectedTaskNodeId) {
            const {
              data: { dialogNodes, ...restdata },
              ...rest
            } = node;
            return { ...rest, data: { ...restdata, dialogNodes: newNodes } };
          } else {
            return node;
          }
        });
        nodeDataRef.current.nodes = taskNodeData;
      } else {
        nodeDataRef.current.nodes = newNodes;
      }
      isdialog ? setDialogNodes(newNodes) : setTaskNodes(newNodes);
      isdialog ? store.setDialogNodes(selectedTaskNodeId, newNodes) : store.setTaskNodes(newNodes);
    };

    const onNodeContextOptionClick = (id, mode, isdialog, selectedTaskNodeId = selectedTaskNode?.id) => {
      switch (mode.toUpperCase()) {
        case 'DELETE':
          deleteNode(id, isdialog, selectedTaskNodeId);
          break;
        case 'COPY':
          copyNode(id, isdialog, selectedTaskNodeId);
          break;
        default:
          alert(`${mode} is to be implemented`);
      }
    };

    useEffect(() => {
      store.reset();
      if (activityDefinitionData.schema.nodes.length === 0 || activityDefinitionData.schema.edges.length === 0) {
        let initialNodeData = getInitialNodeEdges(null, uuid(), uuid(), 'task', onNodeContextOptionClick);
        setTaskNodes(initialNodeData.nodes);
        setTaskEdges(initialNodeData.edges);
        store.addTaskNodes(initialNodeData.nodes);
        store.addTaskEdges(initialNodeData.edges);
      } else {
        setTaskNodes(activityDefinitionData.schema.nodes);
        setTaskEdges(activityDefinitionData.schema.edges);
        store.addTaskNodes(activityDefinitionData.schema.nodes);
        store.addTaskEdges(activityDefinitionData.schema.edges);
      }
    }, [activityDefinitionData]);

    //#region Dialog Block Methods
    const onDialogNodeDragOver = useCallback((event) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDialogNodeDrop = useCallback(
      (event) => {
        event.preventDefault();

        const nodeData = JSON.parse(event.dataTransfer.getData('application/nodeData'));

        // check if the dropped element is valid
        if (typeof nodeData === 'undefined' || !nodeData) {
          return;
        }
        if (!nodeData.active) {
          alert(`${nodeData.type} task can not be used.`);
          return;
        }

        // Get the position of the dialog
        const position = dialogFlowInstance.screenToFlowPosition({
          x: event.clientX,
          y: event.clientY
        });

        let id = '';
        if (nodeData.type === NODE_TYPE.BRANCH_START || nodeData.type === NODE_TYPE.BRANCH_END) {
          id = getNewDialogBranchId();
        } else {
          id = getNewDialogId();
        }

        const newDialogId = uuid();
        const newDialog = {
          id: newDialogId,
          position,
          type: nodeData.type,
          data: { id: id, ...nodeData, onContextMenuClick: (id, menu) => onNodeContextOptionClick(id, menu, true) }
        };
        if (dialogFlowInstance) {
          dialogFlowInstance.addNodes(newDialog);
        }
        store.addDialogNodes(selectedTaskNode, newDialog);
      },
      [store.addDialogNodes, dialogFlowInstance, selectedTaskNode]
    );

    const onDialogNodeConnect = useCallback(
      (params) => {
        let newParam = params;
        newParam.id = `${params.source}_to_${params.target}`;
        newParam.type = 'crossEdge';
        newParam.markerEnd = endMarks;
        newParam.data = { readOnly: readOnly, id: selectedTaskNode.id, category: 'dialog', onContextMenuClick: onNodeContextOptionClick };
        if (dialogFlowInstance) {
          dialogFlowInstance.addEdges({ ...newParam, style: { stroke: '#000' } });
          addNewBranchConnectorHandler({ ...newParam, style: { stroke: '#000' } });
          if (!readOnly) {
            store.addDialogEdges(selectedTaskNode, addEdge({ ...newParam, style: { stroke: '#000' } }, dialogEdges));
          }
        }
      },
      [store.addDialogEdges, dialogEdges, selectedTaskNode, dialogFlowInstance]
    );

    const onDialogNodeClick = (event, node) => {
      if (
        node.type === NODE_TYPE.DIALOG ||
        node.type === NODE_TYPE.XSLT ||
        node.type === NODE_TYPE.API ||
        node.type === NODE_TYPE.DIALOG_GATEWAY ||
        node.type === NODE_TYPE.BRANCH_START
      ) {
        let copyNodes = dialogNodes;
        copyNodes.map((copyNode) => {
          if (node.id === copyNode.id) {
            copyNode.data.selected = true;
            switch (node.type) {
              case NODE_TYPE.DIALOG:
                copyNode.data.borderColor = '#D21CF0';
                break;
              case NODE_TYPE.XSLT:
                copyNode.data.borderColor = '#FF611D';
                break;
              case NODE_TYPE.API:
                copyNode.data.borderColor = '#3FBA13';
                break;
              default:
                break;
            }
          } else {
            copyNode.data.selected = false;
            copyNode.data.borderColor = '#0585FC';
          }
          return copyNode;
        });
        const formData = node.data?.form?.length ? JSON.parse(node.data.form).fields : [];
        setDialogNodes([...copyNodes]);
        setSelectedDialogNode(node);
        setFormFields(formData);
        setOpenDialogPropertiesBlock(true);
      }
    };

    const onDialogNodeDoubleClick = (event, node) => {
      if (node.type === NODE_TYPE.DIALOG) {
        setIsPageDesignerActive(true);
        setActivityDesignerStack((prevValue) => {
          return [
            ...prevValue,
            {
              type: 'PAGE_DESIGNER',
              label: node.data.editableProps.name || node.data.id,
              pathname: node.id,
              id: node.id
            }
          ];
        });
      }
    };

    //Form Designer page Open from Property panel for Dialog Node
    const onDesignFormBtnClick = (e, node) => {
      const formData = node.data?.form?.length ? JSON.parse(node.data.form).fields : [];
      setFormFields(formData);
      setIsPageDesignerActive(true);
      setActivityDesignerStack((prevValue) => {
        return [
          ...prevValue,
          {
            type: 'PAGE_DESIGNER',
            label: node.data.editableProps.name || node.data.id,
            pathname: node.id,
            id: node.id
          }
        ];
      });
    };
    //#endregion

    //#region Task Flow Methods
    const onTaskNodeDragOver = useCallback((event) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = 'move';
    }, []);

    const onTaskNodeDrop = useCallback(
      (event) => {
        event.preventDefault();

        const nodeData = JSON.parse(event.dataTransfer.getData('application/nodeData'));

        // check if the dropped element is valid
        if (typeof nodeData === 'undefined' || !nodeData) {
          return;
        }

        if (!nodeData.active) {
          alert(`${nodeData.type} task can not be used.`);
          return;
        }

        // Get the position of the task
        const position = taskFlowInstance.screenToFlowPosition({
          x: event.clientX,
          y: event.clientY
        });

        let id = '';
        if (nodeData.type === NODE_TYPE.BRANCH_START || nodeData.type === NODE_TYPE.BRANCH_END) {
          id = getNewTaskBranchId();
        } else {
          id = getNewTaskId();
        }

        const taskId = uuid();
        let initialNodeData = getInitialNodeEdges(taskId, uuid(), uuid(), 'dialog', onNodeContextOptionClick);
        const newTask = {
          id: taskId,
          position,
          type: nodeData.type,
          data: {
            id: id,
            ...nodeData,
            onContextMenuClick: (id, menu) => onNodeContextOptionClick(id, menu, false),
            dialogNodes: initialNodeData.nodes,
            dialogEdges: initialNodeData.edges
          }
        };
        if (taskFlowInstance) {
          taskFlowInstance.addNodes(newTask);
        }
        store.addTaskNodes(newTask);
        updateActivitySchema(storeData);
      },
      [store.addTaskNodes, taskFlowInstance]
    );

    const onTaskNodeConnect = useCallback(
      (params) => {
        let newParam = params;
        newParam.id = `${params.source}_to_${params.target}`;
        newParam.type = 'crossEdge';
        newParam.markerEnd = endMarks;
        newParam.data = { readOnly: readOnly, category: 'task', onContextMenuClick: onNodeContextOptionClick };

        if (taskFlowInstance) {
          taskFlowInstance.addEdges({ ...newParam, style: { stroke: '#000' } });
          addNewBranchConnectorHandler({ ...newParam, style: { stroke: '#000' } });
          if (!readOnly) {
            store.addTaskEdges(addEdge({ ...newParam, style: { stroke: '#000' } }, taskFlowInstance.getEdges()));
            updateActivitySchema(storeData);
          }
        }
      },

      [storeData, store.addTaskEdges, taskFlowInstance]
    );

    const addNewBranchConnectorHandler = (newConnectorData) => {
      if (isDialogFlowActive) {
        store.addNewDialogBranchConnector(selectedTaskNode, branchCondition, newConnectorData);
      } else {
        const selectedBranch = storeData.nodes.filter((node) => node.id === newConnectorData.source); // Connector source would be selected branch
        store.addNewTaskBranchConnector(selectedBranch && selectedBranch[0], branchCondition, newConnectorData);
      }
    };

    const onTaskNodeClick = (event, node) => {
      if (
        node.type === NODE_TYPE.PARTNER ||
        node.type === NODE_TYPE.APPROVAL ||
        node.type === NODE_TYPE.ATTRIBUTE ||
        node.type === NODE_TYPE.SPONSOR ||
        node.type === NODE_TYPE.CUSTOM ||
        node.type === NODE_TYPE.SYSTEM ||
        node.type === NODE_TYPE.BRANCH_START
      ) {
        let copyNodes = nodes;
        copyNodes.map((copyNode) => {
          if (node.id === copyNode.id) {
            copyNode.data.borderColor = '#023FB2';
            copyNode.data.selected = true;
          } else {
            copyNode.data.borderColor = '#0585FC';
            copyNode.data.selected = false;
          }
          return copyNode;
        });
        setTaskNodes([...copyNodes]);
        setSelectedTaskNode(node);
        setOpenTaskPropertiesBlock(true);
        setShowActivityDefineDrawer(false);
        isTaskNodePositionChange.current = false;
      }
    };

    const onTaskNodeDoubleClick = (event, node) => {
      if (node.type === NODE_TYPE.PARTNER || node.type === NODE_TYPE.SPONSOR || node.type === NODE_TYPE.CUSTOM || node.type === NODE_TYPE.SYSTEM) {
        setDialogNodes(node.data.dialogNodes);
        setDialogEdges(node.data.dialogEdges);
        setTimeout(() => {
          setIsDialogFlowActive(true);
          setActivityDesignerStack((prevValue) => {
            return [
              ...prevValue,
              {
                type: 'TASK_DESIGNER',
                label: node.data.editableProps.name || node.data.id,
                pathname: node.id,
                id: node.id
              }
            ];
          });
        }, 200);
      }
    };
    //#endregion
    const onClickPageDesignerBack = () => {
      setIsDialogFlowActive(true);
      setIsPageDesignerActive(false);
      setActivityDesignerStack((prevValue) => {
        return prevValue.slice(0, -1);
      });
    };

    const onClickDialogFlowBack = () => {
      nodeDataRef.current = storeData;
      setTaskEdges(storeData.edges);
      setIsDialogFlowActive(false);
      setIsPageDesignerActive(false);
      setActivityDesignerStack((prevValue) => {
        return prevValue.slice(0, -1);
      });
      store.setDialogNodes(selectedTaskNode.id, dialogFlowInstance.getNodes());
    };
    // Save temporary Form data to Session Storage
    const saveFormDesignerData = (layout) => {
      store.addFormLayout(selectedTaskNode, selectedDialogNode, layout);
      setNotificationProps({
        open: true,
        title: 'Success',
        subtitle: `Form Data saved successfully!`,
        kind: 'success',
        onCloseButtonClick: () => setNotificationProps(null)
      });
    };

    const deleteBranchNodeConnector = (selectedNode, selectedTaskNode, connectorId, props) => {
      if (isDialogFlowActive) {
        let copyEdges = dialogEdges;
        let updatedEdge = copyEdges.filter((edge) => edge.id !== connectorId);
        setDialogEdges(updatedEdge);
        store.deleteDialogBranchConnector(selectedNode, selectedTaskNode, connectorId, props);
      } else {
        let copyEdges = edges;
        let updatedEdges = copyEdges.filter((edge) => edge.id !== connectorId);
        setTaskEdges(updatedEdges);
        store.deleteTaskBranchConnector(selectedNode, connectorId, props);
      }
    };

    return (
      <>
        {isPageDesignerActive ? (
          <DndProvider debugMode={true} backend={HTML5Backend}>
            <PageDesigner.Designer
              componentMapper={componentMapper}
              onClickPageDesignerBack={onClickPageDesignerBack}
              activityDefinitionData={activityDefinitionData}
              saveFormDesignerData={saveFormDesignerData}
              formFields={formFields}
            />
          </DndProvider>
        ) : (
          <>
            <div className="workflow-designer">
              <Layer className="workflow-designer-header">
                <div className="title-container">
                  <span className="header-title">
                    <span
                      className="header-title"
                      onClick={() => {
                        setOpenTaskPropertiesBlock(false);
                        setShowActivityDefineDrawer(true);
                      }}
                    >
                      {activityDefinitionData && activityDefinitionData.definition?.name}
                      {!readOnly && <Edit style={{ color: '#0f62fe' }} />}
                    </span>
                  </span>
                </div>
                <div className="actions-container">
                  {isDialogFlowActive && (
                    <IconButton label="Close" size="md" kind="ghost" align="bottom-right" onClick={onClickDialogFlowBack}>
                      <CloseLarge size={16} />
                    </IconButton>
                  )}
                </div>
              </Layer>
              {isDialogFlowActive ? (
                <DialogFlowDesigner
                  connectionLineStyle={connectionLineStyle}
                  defaultViewport={defaultViewport}
                  snapGrid={snapGrid}
                  dialogFlowWrapper={dialogFlowWrapper}
                  dialogNodes={dialogNodes}
                  dialogEdges={dialogEdges}
                  onDialogNodesChange={onDialogNodesChange}
                  onDialogEdgesChange={onDialogEdgesChange}
                  dialogFlowInstance={dialogFlowInstance}
                  setDialogFlowInstance={setDialogFlowInstance}
                  onDialogNodeConnect={onDialogNodeConnect}
                  onDialogNodeDrop={onDialogNodeDrop}
                  onDialogNodeDragOver={onDialogNodeDragOver}
                  onDialogNodeDoubleClick={onDialogNodeDoubleClick}
                  onDesignFormBtnClick={onDesignFormBtnClick}
                  onDialogNodeClick={onDialogNodeClick}
                  DIALOG_NODE_TYPES={DIALOG_NODE_TYPES}
                  DIALOG_EDGE_TYPES={DIALOG_EDGE_TYPES}
                  selectedDialogNode={selectedDialogNode}
                  selectedTaskNode={selectedTaskNode}
                  openDialogPropertiesBlock={openDialogPropertiesBlock}
                  setOpenDialogPropertiesBlock={setOpenDialogPropertiesBlock}
                  readOnly={readOnly}
                  setNotificationProps={setNotificationProps}
                  deleteBranchNodeConnector={deleteBranchNodeConnector}
                  isDialogFlowActive={isDialogFlowActive}
                />
              ) : (
                activityDefinitionData && (
                  <TaskFlowDesigner
                    connectionLineStyle={connectionLineStyle}
                    defaultViewport={defaultViewport}
                    snapGrid={snapGrid}
                    taskFlowWrapper={taskFlowWrapper}
                    nodes={nodes}
                    edges={edges}
                    onTaskNodesChange={onTaskNodesChange}
                    onTaskEdgesChange={onTaskEdgesChange}
                    taskFlowInstance={taskFlowInstance}
                    setTaskFlowInstance={setTaskFlowInstance}
                    onTaskNodeConnect={onTaskNodeConnect}
                    onTaskNodeDrop={onTaskNodeDrop}
                    onTaskNodeDragOver={onTaskNodeDragOver}
                    onTaskNodeClick={onTaskNodeClick}
                    TASK_NODE_TYPES={TASK_NODE_TYPES}
                    TASK_EDGE_TYPES={TASK_EDGE_TYPES}
                    selectedTaskNode={selectedTaskNode}
                    openTaskPropertiesBlock={openTaskPropertiesBlock}
                    setOpenTaskPropertiesBlock={setOpenTaskPropertiesBlock}
                    showActivityDefineDrawer={showActivityDefineDrawer}
                    setShowActivityDefineDrawer={setShowActivityDefineDrawer}
                    updateActivityDetails={updateActivityDetails}
                    activityDefinitionData={activityDefinitionData}
                    activityOperation={activityOperation}
                    readOnly={readOnly}
                    onVersionSelection={onVersionSelection}
                    onTaskNodeDoubleClick={onTaskNodeDoubleClick}
                    versionData={versionData}
                    selectedVersion={selectedVersion}
                    setNotificationProps={setNotificationProps}
                    deleteBranchNodeConnector={deleteBranchNodeConnector}
                    isDialogFlowActive={isDialogFlowActive}
                  />
                )
              )}
            </div>
          </>
        )}
      </>
    );
  }
);

export default WorkFlowDesigner;
