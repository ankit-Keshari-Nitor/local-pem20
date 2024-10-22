import React from 'react';
import { BaseEdge, EdgeLabelRenderer, getBezierPath, getMarkerEnd } from 'reactflow';
import PlusEdgeButton from './plus-edge-button';

function PlusEdge(props) {
  const { sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, style = { stroke: '#000' }, arrowHeadType, markerEndId } = props;
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition
  });

  const markerEnd = getMarkerEnd(arrowHeadType, markerEndId);

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            fontSize: 12,
            pointerEvents: 'all',
            backgroundColor: 'red'
          }}
        >
          <PlusEdgeButton {...props} />
        </div>
      </EdgeLabelRenderer>
    </>
  );
}

export default PlusEdge;
