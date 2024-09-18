import React, { useCallback } from 'react';
import { Handle, useNodeId, useStore, Position } from 'reactflow';
import { selector } from '../../constants/store-constants';
import './style.scss';

export default function StartNode(nodeConfig) {
  const nodeId = useNodeId();
  const isConnectable = useStore(useCallback(selector(nodeId, nodeConfig.isConnectable, 1), [nodeId, nodeConfig.isConnectable, 1]));
  return (
    <div className="start-node-container">
      <Handle id="start-node-right" type="source" position={Position.Right} style={{ background: '#61e897', width: '10px', height: '10px' }} isConnectable={isConnectable} />
    </div>
  );
}
