import React from 'react';
import { Handle, Position } from 'reactflow';
import { GatewayNodeIcon } from '../../icons';

import './style.scss';

export default function GatewayNode(nodeConfig) {
  return (
    <div className="gateway-node-container">
      <Handle id="left" type="target" position={Position.Left} isConnectable={nodeConfig?.isConnectable} />
      <GatewayNodeIcon />
      <Handle id="top" type="source" position={Position.Top} isConnectable={nodeConfig?.isConnectable} />
      <Handle id="bottom" type="source" position={Position.Bottom} isConnectable={nodeConfig?.isConnectable} />
      <Handle id="right" type="source" position={Position.Right} isConnectable={nodeConfig?.isConnectable} />
    </div>
  );
}
