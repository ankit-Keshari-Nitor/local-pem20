import React from 'react';
import { Handle, Position } from 'reactflow';
import { BranchEndNodeIcon } from '../../icons';

import './style.scss';

export default function BranchEndNode(nodeConfig) {
  return (
    <div className="gateway-node-container">
      <Handle id="left" type="target" position={Position.Left} isConnectable={nodeConfig?.isConnectable} />
      <BranchEndNodeIcon />
      <Handle id="top" type="target" position={Position.Top} isConnectable={nodeConfig?.isConnectable} />
      <Handle id="bottom" type="target" position={Position.Bottom} isConnectable={nodeConfig?.isConnectable} />
      <Handle id="right" type="source" position={Position.Right} isConnectable={nodeConfig?.isConnectable} />
    </div>
  );
}
