import React, { useRef, useCallback, useState, useEffect } from 'react';
import { EdgeLabelRenderer, getSmoothStepPath, useReactFlow } from 'reactflow';
import './style.scss';
import useTaskStore from '../../store';
import { Column, Grid, Popover, PopoverContent } from '@carbon/react';
import { CATEGORY_TYPES, CATEGORYS } from '../../constants';
import { getEdgesConnect, getInitialNodeEdges } from '../../utils/workflow-element-utils';
import { v4 as uuid } from 'uuid';

function CrossEdge({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, style = { stroke: '#000' }, markerEnd, data }) {
  const { setEdges } = useReactFlow();
  const deleteTaskEdge = useTaskStore((state) => state.deleteTaskEdge);
  const deleteDialogEdge = useTaskStore((state) => state.deleteDialogEdge);
  const addNewDialogNodes = useTaskStore((state) => state.addNewDialogNodes);
  const addNewTaskNodes = useTaskStore((state) => state.addNewTaskNodes);
  const addNewTaskEdges = useTaskStore((state) => state.addNewTaskEdges);
  const addNewDialogEdges = useTaskStore((state) => state.addNewDialogEdges);
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition
  });

  const edgePathRef = useRef(null);

  const removeEdgeBtnRef = useRef(null);
  const addBlockBtnRef = useRef(null);
  const [buttonDirection, setFlexDirectoin] = useState('row');
  const [open, setOpen] = useState(false);
  const [newNodePosition, setNewNodePosition] = useState();

  const callBack = useCallback((isEnter) => {
    edgePathRef.current?.parentElement.classList[isEnter ? 'add' : 'remove']('animated', 'redlines');
    if (isEnter) {
      removeEdgeBtnRef.current?.classList['remove']('hidebuttons');
      addBlockBtnRef.current?.classList['remove']('hidebuttons');
    } else {
      removeEdgeBtnRef.current?.classList['add']('hidebuttons');
      addBlockBtnRef.current?.classList['add']('hidebuttons');
    }
  }, []);

  const onEdgeClick = (edgeId) => {
    setEdges((edges) => edges.filter((edge) => edge.id !== edgeId));
    if (data?.id !== undefined && data?.id !== '') {
      deleteDialogEdge(data.id, id);
    } else {
      deleteTaskEdge(id);
    }
  };

  const onEdgeAddClick = (nodeData) => {
    if (!nodeData.active) {
      alert(`${nodeData.type} task can not be used.`);
      setOpen(false);
      return;
    }
    const nodeId = uuid();
    const newNodeObj = {
      id: nodeId,
      position: newNodePosition,
      type: nodeData.type,
      data: {
        id: nodeData.shortName,
        ...nodeData
      }
    };
    if (data?.category === CATEGORYS.TASK) {
      let initialNodeData = getInitialNodeEdges(nodeId, uuid(), uuid(), 'dialog', data.onContextMenuClick);
      newNodeObj.data.dialogNodes = initialNodeData.nodes;
      newNodeObj.data.dialogEdges = initialNodeData.edges;
      newNodeObj.data.onContextMenuClick = (id, menu) => data.onContextMenuClick(id, menu, false);
      addNewTaskNodes(newNodeObj, id);
      addNewTaskEdges(newNodeObj, id);
    } else {
      newNodeObj.data.onContextMenuClick = (id, menu) => data.onContextMenuClick(id, menu, true, data.id);
      addNewDialogNodes({ id: data.id }, newNodeObj, id);
      addNewDialogEdges(newNodeObj, id, data.id);
    }
    setOpen(false);
    //Existing Edge deletion and state update
    setEdges((edges) => getEdgesConnect(id, edges, newNodeObj));
  };

  useEffect(() => {
    if (targetY > sourceY) {
      targetY - sourceY < 15 ? setFlexDirectoin('row') : setFlexDirectoin('column');
    } else if (sourceY > targetY) {
      sourceY - targetY < 15 ? setFlexDirectoin('row') : setFlexDirectoin('column');
    }
  }, [sourceY, targetY]);

  return (
    <>
      <path id={'1'} style={style} className="react-flow__edge-path" d={edgePath} markerEnd={markerEnd} ref={edgePathRef} />
      {!data?.readOnly && (
        <div onMouseOver={() => callBack(true)} onMouseLeave={() => callBack(false)}>
          <EdgeLabelRenderer style={{ width: '100%' }}>
            <div
              style={{
                position: 'absolute',
                transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                fontSize: 12,
                display: 'flex',
                flexDirection: buttonDirection,
                pointerEvents: 'all'
              }}
              className="nodrag nopan"
            >
              <button
                size="sm"
                ref={removeEdgeBtnRef}
                className="edge-button remove-edge-button hidebuttons"
                style={{ margin: 2 }}
                disabled={data?.readOnly}
                onClick={() => onEdgeClick(id)}
              >
                x
              </button>
              <Popover open={open} align="bottom-start">
                <button
                  size="sm"
                  ref={addBlockBtnRef}
                  style={{ margin: 2 }}
                  className="edge-button add-block-button hidebuttons"
                  disabled={data?.readOnly}
                  onClick={(e) => {
                    setOpen(!open);
                    setNewNodePosition({
                      x: labelX,
                      y: labelY
                    });
                  }}
                >
                  +
                </button>
                <PopoverContent className="blocks-tray">
                  {CATEGORY_TYPES[data?.category]?.map((node) => {
                    return (
                      <div
                        onClick={() => {
                          onEdgeAddClick(node);
                        }}
                        className="category-block"
                      >
                        <Grid className="block-container">
                          <Column lg={8} sm={8}>
                            <span className="block-icon">{node.nodeIcon} </span>
                          </Column>
                          <Column lg={8} sm={8}>
                            <span className="block-name">{node.shortName}</span>
                          </Column>
                        </Grid>
                      </div>
                    );
                  })}
                </PopoverContent>
              </Popover>
            </div>
          </EdgeLabelRenderer>
        </div>
      )}
    </>
  );
}

export default CrossEdge;
