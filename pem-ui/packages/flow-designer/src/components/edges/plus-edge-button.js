import React, { useState } from 'react';
import { getBezierPath } from 'reactflow';
import { Popover, PopoverContent } from '@carbon/react';

import './style.scss';

import { CATEGORYS, CATEGORY_TYPES } from '../../constants';

const PlusEdgeButton = (props) => {
  const { data, id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition } = props;
  const [openContextMenu, setOpenContextMenu] = useState(false);

  const [labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition
  });

  return (
    <div
      onClick={() => {
        setOpenContextMenu(!openContextMenu);
      }}
    >
      <Popover open={openContextMenu}>
        <button
        style={{backgroundColor:'red'}}
          type="button"
          onClick={() => {
            setOpenContextMenu(!openContextMenu);
          }}
        >
          +
        </button>
        <PopoverContent>
          <div>
            <ul style={{ margin: '4px 0px' }}>
              {CATEGORY_TYPES[CATEGORYS.TASK].map((node, i) => {
                return (
                  <li className="node-type-list" key={i} onClick={() => data.onAddNodeCallback({ id, type: node.type, position: { x: labelX, y: labelY } })}>
                    <label className="node-type-list-label">{node.type}</label>
                  </li>
                );
              })}
            </ul>
          </div>
        </PopoverContent>{' '}
      </Popover>
    </div>
  );
};

export default PlusEdgeButton;
