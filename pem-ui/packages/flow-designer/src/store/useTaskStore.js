import { create } from 'zustand'; //
import { branchCondition, INITIAL_QUERY, NODE_TYPE } from '../constants';
import { getEdgesConnect } from '../utils/workflow-element-utils';

const taskStore = (set, get) => ({
  tasks: {
    nodes: [],
    edges: []
  },
  addTaskNodes: (node) => {
    set((state) => ({
      tasks: { nodes: state.tasks.nodes.concat(node), edges: state.tasks.edges }
    }));
  },
  editTaskNodePros: (activity, props, value) => {
    set((state) => {
      const copyNodes = state.tasks.nodes;
      copyNodes.map((copyNode) => {
        if (activity.id === copyNode.id) {
          copyNode.data[props] = value;
        }
        return copyNode;
      });
      return { tasks: { nodes: copyNodes, edges: state.tasks.edges } };
    });
  },
  addNewTaskEdges: (taskNode, edgeId) => {
    set((state) => {
      return { tasks: { nodes: state.tasks.nodes, edges: getEdgesConnect(edgeId, state.tasks.edges, taskNode) } };
    });
  },
  addNewTaskNodes: (node, id) => {
    set((state) => {
      const ids = id.split('_to_');
      const newNodes = state.tasks.nodes.map((n) => {
        if (n.type === NODE_TYPE.BRANCH_START && n.id === ids[0]) {
          let branchCondition;
          n.data.branchCondition = n.data.branchCondition.filter((nb) => {
            if (nb.target === ids[1]) {
              branchCondition = nb;
              return false;
            } else {
              return true;
            }
          });
          n.data.branchCondition.push({
            ...branchCondition,
            target: node.id,
            connectorId: n.id + '_to_' + node.id
          });
        }
        return n;
      });
      return { tasks: { nodes: newNodes.concat(node), edges: state.tasks.edges } };
    });
  },
  setTaskNodes: (nodes) => {
    set((state) => ({
      tasks: { nodes: nodes, edges: state.tasks.edges }
    }));
  },
  addTaskEdges: (edges) => {
    set((state) => ({
      tasks: { nodes: state.tasks.nodes, edges: edges }
    }));
  },
  setTaskEdges: (edges) => {
    set((state) => ({
      tasks: { nodes: state.tasks.nodes, edges: edges }
    }));
  },
  deleteTaskEdge: (id) => {
    set((state) => {
      const copyNodes = state.tasks.nodes;
      let updatedNodes = copyNodes.map((copyNode) => {
        if (copyNode.type === NODE_TYPE.BRANCH_START) {
          let updatedConnectors = copyNode?.data[branchCondition].filter((edge) => edge.connectorId !== id);
          copyNode.data[branchCondition] = updatedConnectors;
          return copyNode;
        } else {
          return copyNode;
        }
      });
      const updatedEdges = state.tasks.edges.filter((edge) => edge.id !== id);
      return { tasks: { nodes: updatedNodes, edges: updatedEdges } };
    });
  },
  addDialogNodes: (taskNode, dialogNode) => {
    set((state) => {
      const taskNodeData = state.tasks.nodes.map((node) => {
        if (node.id === taskNode.id) {
          const {
            data: { dialogNodes, ...restData },
            ...rest
          } = node;
          const newDialogNode = [...dialogNodes, dialogNode];
          return { ...rest, data: { ...restData, dialogNodes: newDialogNode } };
        } else {
          return node;
        }
      });
      return { tasks: { nodes: taskNodeData, edges: state.tasks.edges } };
    });
  },
  addNewDialogNodes: (taskNode, dialogNode, id) => {
    set((state) => {
      const ids = id.split('_to_');
      const taskNodeData = state.tasks.nodes.map((node) => {
        if (node.id === taskNode.id) {
          const {
            data: { dialogNodes, ...restData },
            ...rest
          } = node;

          const newDialogNodes = dialogNodes.map((n) => {
            if (n.type === NODE_TYPE.BRANCH_START && n.id === ids[0]) {
              let branchCondition;
              n.data.branchCondition = n.data.branchCondition.filter((nb) => {
                if (nb.target === ids[1]) {
                  branchCondition = nb;
                  return false;
                } else {
                  return true;
                }
              });
              n.data.branchCondition.push({
                ...branchCondition,
                target: dialogNode.id,
                connectorId: n.id + '_to_' + dialogNode.id
              });
            }
            return n;
          });

          const newDialogNode = [...newDialogNodes, dialogNode];
          return { ...rest, data: { ...restData, dialogNodes: newDialogNode } };
        } else {
          return node;
        }
      });
      return { tasks: { nodes: taskNodeData, edges: state.tasks.edges } };
    });
  },
  editDialogNodePros: (activity, taskNode, props, value) => {
    set((state) => {
      const copyNodes = state.tasks.nodes;
      copyNodes.map((copyNode) => {
        if (taskNode.id === copyNode.id) {
          const {
            data: { dialogNodes }
          } = copyNode;
          dialogNodes?.map((dialogNodeData) => {
            if (dialogNodeData.id === activity.id) {
              dialogNodeData.data[props] = value;
            }
            return dialogNodeData;
          });
        }
        return copyNode;
      });
      return { tasks: { nodes: copyNodes, edges: state.tasks.edges } };
    });
  },
  addDialogEdges: (taskNode, dialogEdge) => {
    set((state) => {
      const taskNodeData = state.tasks.nodes.map((node) => {
        if (node.id === taskNode.id) {
          const {
            data: { dialogEdges, ...restData },
            ...rest
          } = node;
          const newDialogEdge = dialogEdges.concat(dialogEdge.filter((item2) => !dialogEdges.some((item1) => item1.id === item2.id)));
          return { ...rest, data: { ...restData, dialogEdges: newDialogEdge } };
        } else {
          return node;
        }
      });
      return { tasks: { nodes: taskNodeData, edges: state.tasks.edges } };
    });
  },
  deleteDialogEdge: (taskId, edgeId) => {
    set((state) => {
      const taskNodeData = state.tasks.nodes.map((node) => {
        if (node.id === taskId) {
          const {
            data: { dialogEdges, ...restData },
            ...rest
          } = node;
          const newDialogEdge = dialogEdges.filter((edge) => edge.id !== edgeId);
          let updatedCopiedNode = { ...rest, data: { ...restData, dialogEdges: newDialogEdge } };

          const {
            data: { dialogNodes, ...updatedRestData },
            ...updatedRest
          } = updatedCopiedNode;

          let updatedDialogNodes = dialogNodes.map((dialogNodeData) => {
            if (dialogNodeData.type === NODE_TYPE.BRANCH_START) {
              let updatedConnectors = dialogNodeData?.data[branchCondition].filter((edge) => edge.connectorId !== edgeId);
              dialogNodeData.data[branchCondition] = updatedConnectors;
              return dialogNodeData;
            } else {
              return dialogNodeData;
            }
          });

          return { ...updatedRest, data: { ...updatedRestData, dialogNodes: updatedDialogNodes } };
        } else {
          return node;
        }
      });
      return { tasks: { nodes: taskNodeData, edges: state.tasks.edges } };
    });
  },
  setDialogNodes: (taskId, nodes) => {
    set((state) => {
      const taskNodeData = state.tasks.nodes.map((node) => {
        if (node.id === taskId) {
          const {
            data: { dialogNodes, ...restData },
            ...rest
          } = node;
          return { ...rest, data: { ...restData, dialogNodes: nodes } };
        } else {
          return node;
        }
      });
      return { tasks: { nodes: taskNodeData, edges: state.tasks.edges } };
    });
  },
  addNewDialogEdges: (taskNode, edgeId, selectedTaskNodeId) => {
    set((state) => {
      const updatedNodes = state.tasks.nodes.map((node) => {
        if (node.id === selectedTaskNodeId) {
          const {
            data: { dialogEdges, ...restdata },
            ...rest
          } = node;
          return { ...rest, data: { ...restdata, dialogEdges: getEdgesConnect(edgeId, dialogEdges, taskNode) } };
        } else {
          return node;
        }
      });
      return { tasks: { nodes: updatedNodes, edges: state.tasks.edges } };
    });
  },
  setDialogEdges: (taskId, edges) => {
    set((state) => {
      const taskNodeData = state.tasks.nodes.map((node) => {
        if (node.id === taskId) {
          const {
            data: { dialogEdges, ...restData },
            ...rest
          } = node;
          return { ...rest, data: { ...restData, dialogEdges: edges } };
        } else {
          return node;
        }
      });
      return { tasks: { nodes: taskNodeData, edges: state.tasks.edges } };
    });
  },
  addFormLayout: (taskNode, dialogNode, formLayout) => {
    set((state) => {
      const copyNodes = state.tasks.nodes;
      copyNodes.map((copyNode) => {
        if (taskNode.id === copyNode.id) {
          const {
            data: { dialogNodes }
          } = copyNode;
          dialogNodes?.map((dialogNodeData) => {
            if (dialogNodeData.id === dialogNode.id) {
              //dialogNodeData.data['form'] = JSON.stringify(formLayout);   old schema code
              dialogNodeData.data['form'] = formLayout;
            }
            return dialogNodeData;
          });
          //return { ...rest, data: { ...restData, dialogNodes: updatedDialogNodeData } };
        }
        return copyNode;
      });
      return { tasks: { nodes: copyNodes, edges: state.tasks.edges } };
    });
  },
  // Function to add new branch connector of task  flow designer nodes
  addNewTaskBranchConnector: (selectedBranch, props, newConnectorData) => {
    set((state) => {
      const copyNodes = state.tasks.nodes;
      copyNodes.map((copyNode) => {
        if (selectedBranch?.id === copyNode.id && selectedBranch.type === NODE_TYPE.BRANCH_START) {
          let branchCondition = copyNode.data[props].concat({
            connectorId: newConnectorData.id,
            source: newConnectorData.source,
            target: newConnectorData.target,
            condition: INITIAL_QUERY
          });
          copyNode.data[props] = branchCondition;
        }
        return copyNode;
      });
      return { tasks: { nodes: copyNodes, edges: state.tasks.edges } };
    });
  },
  // Function to add new branch connector of dialog flow designer nodes
  addNewDialogBranchConnector: (selectedTaskNode, props, newConnectorData) => {
    set((state) => {
      const copyNodes = state.tasks.nodes;
      const parentTaskNode = copyNodes.filter((node) => node.id === selectedTaskNode.id);
      const selectedBranch = parentTaskNode && parentTaskNode[0]?.data.dialogNodes.filter((node) => node.id === newConnectorData.source);
      const selectedBranchId = selectedBranch && selectedBranch[0]?.id;
      const selectedBranchType = selectedBranch && selectedBranch[0]?.type;
      copyNodes.map((copyNode) => {
        if (selectedTaskNode?.id === copyNode.id) {
          const {
            data: { dialogNodes }
          } = copyNode;
          dialogNodes.map((dialogNodeData) => {
            if (dialogNodeData.id === selectedBranchId && selectedBranchType === NODE_TYPE.BRANCH_START) {
              let branchCondition = dialogNodeData.data[props].concat({
                connectorId: newConnectorData.id,
                source: newConnectorData.source,
                target: newConnectorData.target,
                condition: INITIAL_QUERY
              });
              dialogNodeData.data[props] = branchCondition;
            }
            return dialogNodeData;
          });
        }
        return copyNode;
      });
      return { tasks: { nodes: copyNodes, edges: state.tasks.edges } };
    });
  },
  // Function to update branch connector of task flow designer nodes
  updateTaskBranchConnector: (selectedNode, updatedQuery, targetId, props) => {
    set((state) => {
      const copyNodes = state.tasks.nodes;
      let updatedNodes = copyNodes.map((copyNode) => {
        if (selectedNode?.id === copyNode.id) {
          let updatedConnectors = copyNode?.data[props].map((connector) => {
            if (connector?.target === targetId) {
              return { connectorId: connector?.connectorId, source: connector?.source, target: connector?.target, condition: { ...updatedQuery } };
            } else {
              return connector;
            }
          });
          copyNode.data[props] = updatedConnectors;
          return copyNode;
        } else {
          return copyNode;
        }
      });

      return { tasks: { nodes: updatedNodes, edges: state.tasks.edges } };
    });
  },
  // Function to update branch connector of dialog flow designer nodes
  updateDialogBranchConnector: (selectedNode, selectedTaskNode, updatedQuery, targetId, props) => {
    set((state) => {
      const copyNodes = state.tasks.nodes;
      let updatedNodes = copyNodes.map((copyNode) => {
        if (selectedTaskNode?.id === copyNode.id) {
          const {
            data: { dialogNodes, ...restData },
            ...rest
          } = copyNode;

          let updatedDialogNodes = dialogNodes.map((dialogNodeData) => {
            if (dialogNodeData.id === selectedNode.id) {
              const updatedDialogNodeData = dialogNodeData.data[props].map((dnd) => {
                if (dnd.target === targetId) {
                  return { connectorId: dnd?.connectorId, source: dnd?.source, target: dnd?.target, condition: { ...updatedQuery } };
                } else {
                  return dnd;
                }
              });
              dialogNodeData.data[props] = updatedDialogNodeData;
              return dialogNodeData;
            } else {
              return dialogNodeData;
            }
          });
          let updatedCopyNode = { ...rest, data: { ...restData, dialogNodes: updatedDialogNodes } };
          return updatedCopyNode;
        } else {
          return copyNode;
        }
      });
      return { tasks: { nodes: updatedNodes, edges: state.tasks.edges } };
    });
  },
  // Function to delete branch connector of task flow designer nodes
  deleteTaskBranchConnector: (selectedNode, connectorId, props) => {
    set((state) => {
      const copyNodes = state.tasks.nodes;
      let updatedNodes = copyNodes.map((copyNode) => {
        if (selectedNode?.id === copyNode.id) {
          let updatedEdges = copyNode?.data[props].filter((edge) => edge.connectorId !== connectorId);
          copyNode.data[props] = updatedEdges;
          return copyNode;
        } else {
          return copyNode;
        }
      });
      const updatedEdges = state.tasks.edges.filter((edge) => edge.id !== connectorId);
      return { tasks: { nodes: updatedNodes, edges: updatedEdges } };
    });
  },
  // Function to update the sequence of branch connector of task flow designer nodes
  updateTaskBranchConnectorSequence: (selectedNode, updatedSequences, props) => {
    set((state) => {
      const copyNodes = state.tasks.nodes;
      let updatedNodes = copyNodes.map((copyNode) => {
        if (selectedNode?.id === copyNode.id) {
          copyNode.data[props] = [...updatedSequences];
          return copyNode;
        } else {
          return copyNode;
        }
      });

      return { tasks: { nodes: updatedNodes, edges: state.tasks.edges } };
    });
  },
  // Function to update sequence of branch connector of dialog flow designer nodes
  updateDialogBranchConnectorSequence: (selectedNode, selectedTaskNode, updatedSequences, props) => {
    set((state) => {
      const copyNodes = state.tasks.nodes;
      let updatedNodes = copyNodes.map((copyNode) => {
        if (selectedTaskNode?.id === copyNode.id) {
          const {
            data: { dialogNodes, ...restData },
            ...rest
          } = copyNode;

          let updatedDialogNodes = dialogNodes.map((dialogNodeData) => {
            if (dialogNodeData.id === selectedNode.id) {
              dialogNodeData.data[props] = [...updatedSequences];
              return dialogNodeData;
            } else {
              return dialogNodeData;
            }
          });
          let updatedCopyNode = { ...rest, data: { ...restData, dialogNodes: updatedDialogNodes } };
          return updatedCopyNode;
        } else {
          return copyNode;
        }
      });
      return { tasks: { nodes: updatedNodes, edges: state.tasks.edges } };
    });
  },
  // Function to delete branch connector of dialog flow designer nodes
  deleteDialogBranchConnector: (selectedNode, selectedTaskNode, connectorId, props) => {
    set((state) => {
      const copyNodes = state.tasks.nodes;
      const updatedNodes = copyNodes.map((copyNode) => {
        if (selectedTaskNode?.id === copyNode.id) {
          const {
            data: { dialogNodes, ...restData },
            ...rest
          } = copyNode;

          let updatedDialogNodes = dialogNodes.map((dialogNodeData) => {
            if (dialogNodeData.id === selectedNode.id) {
              let updatedDialogNodeData = dialogNodeData.data[props].filter((edge) => edge.connectorId !== connectorId);
              dialogNodeData.data[props] = updatedDialogNodeData;
              return dialogNodeData;
            } else {
              return dialogNodeData;
            }
          });
          let updatedCopyNodes = { ...rest, data: { ...restData, dialogNodes: updatedDialogNodes } };
          const {
            data: { dialogEdges, ...updatedRestData },
            ...updatedRest
          } = updatedCopyNodes;
          const newDialogEdges = dialogEdges.filter((edge) => edge.id !== connectorId);
          return { ...updatedRest, data: { ...updatedRestData, dialogEdges: newDialogEdges } };
        } else {
          return copyNode;
        }
      });
      return { tasks: { nodes: updatedNodes, edges: state.tasks.edges } };
    });
  },
  // Function to update the task node name from dialog sequence container task flow designer
  updateTaskNodeName: (taskId, props, value) => {
    set((state) => {
      const copyNodes = state.tasks.nodes;
      copyNodes.map((copyNode) => {
        if (taskId === copyNode.id) {
          copyNode.data[props] = value;
        }
        return copyNode;
      });
      return { tasks: { nodes: copyNodes, edges: state.tasks.edges } };
    });
  },
  // Function to update the task node name from dialog sequence container task flow designer
  updateDialogNodeName: (taskId, taskNode, props, value) => {
    set((state) => {
      const copyNodes = state.tasks.nodes;
      copyNodes.map((copyNode) => {
        if (taskNode.id === copyNode.id) {
          const {
            data: { dialogNodes }
          } = copyNode;
          dialogNodes?.map((dialogNodeData) => {
            if (dialogNodeData.id === taskId) {
              dialogNodeData.data[props] = value;
            }
            return dialogNodeData;
          });
        }
        return copyNode;
      });
      return { tasks: { nodes: copyNodes, edges: state.tasks.edges } };
    });
  },
  reset: () => {
    set({
      tasks: {
        nodes: [],
        edges: []
      }
    });
  }
});

const useTaskStore = create(taskStore);

export default useTaskStore;
