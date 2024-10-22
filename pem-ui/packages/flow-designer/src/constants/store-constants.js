import { getConnectedEdges } from 'reactflow';

export const NODE_TYPE = {
  START: 'START',
  END: 'END',
  PARTNER: 'PARTNER',
  APPROVAL: 'APPROVAL',
  ATTRIBUTE: 'ATTRIBUTE',
  SPONSOR: 'SPONSOR',
  CUSTOM: 'CUSTOM',
  SYSTEM: 'SYSTEM',
  TASK_GATEWAY: 'GATEWAY',
  DIALOG_GATEWAY: 'GATEWAY',
  DIALOG: 'FORM',
  XSLT: 'XSLT',
  API: 'API'
};

export const TASK_INITIAL_NODES = [
  {
    id: 'start',
    type: NODE_TYPE.START,
    data: { taskName: 'Start' },
    position: { x: 250, y: 300 },
    sourcePosition: 'right'
  },
  {
    id: 'end',
    type: NODE_TYPE.END,
    data: { taskName: 'End' },
    position: { x: 550, y: 300 },
    targetPosition: 'left'
  }
];

export const selector =
  (nodeId, isConnectable = true, maxConnections = Infinity) =>
  (s) => {
    // If the user props say this handle is not connectable, we don't need to
    // bother checking anything else.
    if (!isConnectable) return false;

    const node = s.nodeInternals.get(nodeId);
    const connectedEdges = getConnectedEdges([node], s.edges);

    return connectedEdges.length < maxConnections;
  };
