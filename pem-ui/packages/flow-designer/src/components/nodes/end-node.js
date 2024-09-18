import React, { useCallback } from 'react';
import { Handle, useNodeId, useStore, Position } from 'reactflow';
import './style.scss';
import { selector } from '../../constants/store-constants';

export default function EndNode(nodeConfig) {
  const nodeId = useNodeId();
  const isConnectable = useStore(useCallback(selector(nodeId, nodeConfig.isConnectable, 1), [nodeId, nodeConfig.isConnectable, 1]));

  return (
    <div className="end-node-container">
      <Handle id="end-node-left" type="target" position={Position.Left} style={{ background: '#ed3e32', width: '10px', height: '10px' }} isConnectable={isConnectable} />
    </div>
  );
}
