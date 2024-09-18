import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';
import { NODE_TYPES, NODE_TYPE } from '../constants';

const getNewTaskId = () => `Task_Name_${uuidv4()}`;

const getUpdatedElementsAfterActionNodeAddition = ({ elements, newNodeId, targetNodeId, onAddNodeCallback }) => {
  const clonedElements = _.cloneDeep(elements);
  const newEdge = {
    id: getNewTaskId(),
    source: newNodeId,
    target: targetNodeId,
    type: 'plusEdge',
    animated: true,
    style: { stroke: '#000' },
    data: { onAddNodeCallback }
  };
  clonedElements.push(newEdge);
  return clonedElements;
};

const testElements = (taskEdgesClone, elements) => {
  const clonedElements = _.cloneDeep(elements);
  const clonedTaskEdgesClone = _.cloneDeep(taskEdgesClone);

  clonedTaskEdgesClone &&
    clonedTaskEdgesClone.forEach((entry1) => {
      let isNewEntry = true; // says if entry1 is not present in array2
      clonedElements.forEach((entry2) => {
        if (entry1.id === entry2.id) {
          isNewEntry = false; // the entry1 was found in array2
        }
      });

      if (isNewEntry) {
        clonedElements.push(entry1);
        // the entry1 was not found in array2 - do whatever you want here
      }
    });
  return clonedElements;
};

const getUpdatedElementsAfterNodeAddition = ({ elements, targetEdgeId, type, position, onDoubleClick, onDeleteNodeCallback, onNodeClickCallback, onAddNodeCallback }) => {
  const newNodeId = getNewTaskId();
  //const nodeData = NODE_TYPES.filter((node) => node.type === type);
  const nodeData = NODE_TYPES[type];
  const newNode = {
    id: newNodeId,
    type,
    data: {
      ...nodeData,
      onDoubleClick,
      onNodeClickCallback,
      onDeleteNodeCallback
    },
    position
  };
  const clonedElements = _.cloneDeep(elements);
  const targetEdgeIndex = clonedElements.findIndex((x) => x.id === targetEdgeId);
  const targetEdge = elements[targetEdgeIndex];
  const { target: targetNodeId } = targetEdge;
  const updatedTargetEdge = { ...targetEdge, target: newNodeId };
  clonedElements[targetEdgeIndex] = updatedTargetEdge;
  clonedElements.push(newNode);

  return getUpdatedElementsAfterActionNodeAddition({
    elements: clonedElements,
    newNodeId,
    newNode,
    targetNodeId,
    onAddNodeCallback
  });
};

const getInitialNodeEdges = (taskId, sourceId, targetId, category, onNodeContextOptionClick) => {
  let nodes = [
    {
      id: sourceId,
      type: NODE_TYPE.START,
      data: { taskName: 'Start', label: taskId === null ? '' : 'Start' },
      position: { x: 250, y: 300 },
      sourcePosition: 'right'
    },
    {
      id: targetId,
      type: NODE_TYPE.END,
      data: { taskName: 'End', label: taskId === null ? '' : 'End' },
      position: { x: 450, y: 300 },
      targetPosition: 'left'
    }
  ];

  let edges = [
    {
      id: `${nodes[0].id}_to_${nodes[1].id}`,
      type: 'crossEdge',
      source: sourceId,
      sourceHandle: 'start-node-right',
      target: targetId,
      targetHandle: 'end-node-left',
      data: { id: taskId ? taskId : '', category, onContextMenuClick: onNodeContextOptionClick },
      markerEnd: {
        color: '#FF0072',
        height: 20,
        type: 'arrowclosed',
        width: 20
      }
    }
  ];
  return { nodes, edges };
};

const getEdgesConnect = (edgeId, edgesData, nodeData) => {
  let oldEdge;
  const remainEdges = edgesData.filter((edge) => {
    if (edge.id !== edgeId) {
      return true;
    } else {
      oldEdge = edge;
      return false;
    }
  });
  const newEdges = [
    {
      markerEnd: oldEdge?.markerEnd,
      type: oldEdge?.type,
      id: `${oldEdge?.source}_to_${nodeData?.id}`,
      source: oldEdge?.source,
      target: nodeData?.id,
      data: oldEdge?.data,
      sourceHandle: oldEdge.sourceHandle,
      targetHandle: oldEdge.targetHandle
    },
    {
      markerEnd: oldEdge?.markerEnd,
      type: oldEdge?.type,
      id: `${nodeData?.id}_to_${oldEdge?.target}`,
      source: nodeData?.id,
      target: oldEdge?.target,
      data: oldEdge?.data,
      sourceHandle: 'right',
      targetHandle: 'end-node-left'
    }
  ];
  return [...remainEdges, ...newEdges];
};

export { getUpdatedElementsAfterNodeAddition, testElements, getInitialNodeEdges, getEdgesConnect };
