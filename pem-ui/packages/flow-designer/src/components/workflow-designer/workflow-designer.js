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
import { v4 as uuid } from 'uuid';
import { getInitialNodeEdges } from '../../utils/workflow-element-utils';

let dialogBranchId = 1;
const getNewDialogBranchId = () => `Branch_${dialogBranchId++}`;

let taskBranchId = 1;
const getNewTaskBranchId = () => `Branch_${taskBranchId++}`;

let dialogId = 1;
const getNewDialogId = () => `Dialog_Name_${dialogId++}`;

let taskId = 1;
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
    setNotificationProps, //toast message config
    getApiConfiguration, //to call API Config
    getRoleList,// to call the role List
    isDialogFlowActive, setIsDialogFlowActive, isPageDesignerActive, setIsPageDesignerActive, setOpenTaskPropertiesBlock, openTaskPropertiesBlock, openDialogPropertiesBlock,
    setOpenDialogPropertiesBlock, nodeDataRefActivity
  }) => {

    //-------------------------------- State Management -------------------------------------
    const store = useTaskStore();
    let storeData = useTaskStore((state) => state.tasks);
    const editTask = useTaskStore((state) => state.editTaskNodePros);
    const editDialog = useTaskStore((state) => state.editDialogNodePros);

    // --------------------------------- Task Flow States -----------------------------------
    const taskFlowWrapper = useRef(null);
    const [nodes, setTaskNodes] = useNodesState([]);
    const [edges, setTaskEdges, onTaskEdgesChange] = useEdgesState([]);
    const [taskFlowInstance, setTaskFlowInstance] = useState(null);
    const [selectedTaskNode, setSelectedTaskNode] = useState(null);

    // --------------------------------- Dialog Flow States -----------------------------------
    const dialogFlowWrapper = useRef(null);
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
      updateActivitySchema(storeData);

      if (nodeDataRefActivity?.current?.state) {
        setTaskEdges(nodeDataRefActivity?.current?.store.edges);
        const newNodes = nodeDataRefActivity.current.store.nodes.map((node) => {
          const n = instanceNodes.find((x) => x.id === node.id);
          return { ...node, position: n ? n.position : node.position };
        });
        setTaskNodes(newNodes);
        nodeDataRefActivity.current = { ...nodeDataRefActivity.current, state: false }
      } else {
        nodeDataRefActivity.current = { state: false, store: storeData }

      }
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
      let newNodes = nodesData.filter((n) => n.id !== id);

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

      // If source node is branch start
      newNodes = newNodes.map((n) => {
        if (n.type === NODE_TYPE.BRANCH_START && n.id === targetEdge?.source) {
          let branchCondition;
          n.data.branchCondition = n.data.branchCondition.filter((nb) => {
            if (nb.target === id) {
              branchCondition = nb;
              return false;
            } else {
              return true;
            }
          });
          if (sourceEdge?.target) {
            n.data.branchCondition.push({
              ...branchCondition,
              target: sourceEdge?.target,
              connectorId: n.id + '_to_' + sourceEdge?.target
            });
          }
        }
        return n;
      });

      if (isdialog) {
        const taskNodeData = nodeDataRef.current.nodes.map((node) => {
          if (node.id === selectedTaskNodeId) {
            const {
              data: { dialogNodes, ...restData },
              ...rest
            } = node;
            return { ...rest, data: { ...restData, dialogNodes: newNodes } };
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

      // Delete node bypass for connecting Edges
      let updatedEdge = newEdges;
      if (targetEdge?.source && sourceEdge?.target) {
        const newEdge = {
          markerEnd: sourceEdge?.markerEnd,
          type: sourceEdge?.type,
          id: `${targetEdge?.source}_to_${sourceEdge?.target}`,
          source: targetEdge?.source,
          target: sourceEdge?.target,
          data: sourceEdge?.data,
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
      setNotificationProps({
        open: true,
        title: 'Success',
        subtitle: `Task Successfully deleted.`,
        kind: 'success',
        onCloseButtonClick: () => setNotificationProps(null)
      });
    };

    // Copying Node from contextMenu
    const copyNode = (id, isdialog, selectedTaskNodeId) => {
      //Generate random Number
      const randomNumber = Math.floor(Math.random() * 900) + 100;
      const singleDigit = Math.floor(Math.random() * 10);
      const doubleDigit = Math.floor(Math.random() * 90) + 10;

      setIsdialogNodeDelete(isdialog);
      const dialogData = isdialog && nodeDataRef.current.nodes.filter((node) => node.id === selectedTaskNodeId)[0];
      const nodesData = isdialog ? dialogData?.data?.dialogNodes : nodeDataRef.current.nodes;
      //const edgesData = isdialog ? dialogData?.data?.dialogEdges : nodeDataRef.current.edges;

      // Copying Node
      const [originalNode] = nodesData.filter((n) => n.id === id);

      // Generate new ID with incrementing suffix
      const baseId = originalNode.data?.id; // Assuming this is in the format "name_x"
      let newIdSuffix = 1;
      let newId = `${baseId}_${newIdSuffix}`;

      // Check for existing IDs to find the next available suffix
      while (nodesData.some((node) => node.data?.id === newId)) {
        newIdSuffix++;
        newId = `${baseId}_${newIdSuffix}`;
      }

      const newNode = {
        id: 'dup-' + randomNumber + '-' + originalNode.id,
        type: originalNode.type,
        position: { x: originalNode.position.x + 170 + doubleDigit, y: originalNode.position.y + singleDigit },
        data: {
          ...NODE_TYPES[originalNode.type],
          id: newId, // Set new id with incrementing suffix
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
            id: 'dup-' + randomNumber + '-' + dialogNode.id
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
                onContextMenuClick: (id, menu) => onNodeContextOptionClick(id, menu, true, 'dup-' + randomNumber + '-' + originalNode.id),
                id: dialogNode.data.id,
                form: dialogNode.data.form,
                exitValidationQuery: dialogNode.data.exitValidationQuery
              };
              break;
            case 'API':
              newDialogNode.data = {
                ...NODE_TYPES[dialogNode.type],
                editableProps: dialogNode.data.editableProps,
                onContextMenuClick: (id, menu) => onNodeContextOptionClick(id, menu, true, 'dup-' + randomNumber + '-' + originalNode.id),
                id: dialogNode.data.id,
                exitValidationQuery: dialogNode.data.exitValidationQuery
              };
              break;
            case 'XSLT':
              newDialogNode.data = {
                ...NODE_TYPES[dialogNode.type],
                editableProps: dialogNode.data.editableProps,
                onContextMenuClick: (id, menu) => onNodeContextOptionClick(id, menu, true, 'dup-' + randomNumber + '-' + originalNode.id),
                id: dialogNode.data.id,
                exitValidationQuery: dialogNode.data.exitValidationQuery
              };
              break;
            case 'BRANCH_START':
              newDialogNode.data = {
                ...NODE_TYPES[dialogNode.type],
                editableProps: dialogNode.data.editableProps,
                onContextMenuClick: (id, menu) => onNodeContextOptionClick(id, menu, true, 'dup-' + randomNumber + '-' + originalNode.id),
                id: dialogNode.data.id,
                form: dialogNode.data.form,
                exitValidationQuery: dialogNode.data.exitValidationQuery
              };
              break;
            case 'BRANCH_END':
              newDialogNode.data = {
                ...NODE_TYPES[dialogNode.type],
                editableProps: dialogNode.data.editableProps,
                onContextMenuClick: (id, menu) => onNodeContextOptionClick(id, menu, true, 'dup-' + randomNumber + '-' + originalNode.id),
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
            id: 'dup-' + randomNumber + '-' + dialogedge.id,
            source: 'dup-' + randomNumber + '-' + dialogedge.source,
            target: 'dup-' + randomNumber + '-' + dialogedge.target,
            data: {
              ...dialogedge.data,
              id: 'dup-' + randomNumber + '-' + dialogedge.data.id
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
      setNotificationProps({
        open: true,
        title: 'Success',
        subtitle: `Task Successfully copied.`,
        kind: 'success',
        onCloseButtonClick: () => setNotificationProps(null)
      });
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
        let initialNodeData = getInitialNodeEdges(null, `pem_${uuid().replace(/[^0-9]/g, '').substring(0, 5)}`, `pem_${uuid().replace(/[^0-9]/g, '').substring(0, 5)}`, 'task', onNodeContextOptionClick);
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

        const newDialogId = `pem_${uuid().replace(/[^0-9]/g, '').substring(0, 5)}`;
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
        const formData = {
          form: node.data?.form?.cType ? node.data.form : [],
          formId: node.data.editableProps?.name ? node.data.editableProps?.name : node.data.id
        };
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

        const taskId = `pem_${uuid().replace(/[^0-9]/g, '').substring(0, 5)}`;
        let initialNodeData = getInitialNodeEdges(taskId, `pem_${uuid().replace(/[^0-9]/g, '').substring(0, 5)}`, `pem_${uuid().replace(/[^0-9]/g, '').substring(0, 5)}`, 'dialog', onNodeContextOptionClick);
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

    useEffect(() => {
      if (!isDialogFlowActive) {
        if (selectedTaskNode) {
          store?.setDialogNodes(selectedTaskNode?.id, dialogFlowInstance?.getNodes())
        }
      }
    }, [isDialogFlowActive, isPageDesignerActive, setIsDialogFlowActive, setIsPageDesignerActive])

    return (
      <>
        {isPageDesignerActive ? (
          <DndProvider debugMode={true} backend={HTML5Backend}>
            <PageDesigner.Designer
              componentMapper={componentMapper}

              activityDefinitionData={activityDefinitionData}
              saveFormDesignerData={saveFormDesignerData}
              formFields={formFields}
            />
          </DndProvider>
        ) : (
          <>
            <div className="workflow-designer">

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
                  getApiConfiguration={getApiConfiguration}
                  activityDefinitionData={activityDefinitionData}
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
                    getRoleList={getRoleList}
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
