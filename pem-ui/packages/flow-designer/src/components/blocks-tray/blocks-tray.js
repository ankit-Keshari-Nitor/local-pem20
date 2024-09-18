import React, { useState, useRef } from 'react';
import './blocks-tray.scss';
import { CATEGORYS, CATEGORY_TYPES } from '../../constants';
import { ChevronLeft, ChevronRight } from '@carbon/icons-react';
import { LineIcon } from '../../icons';

export const BlocksTray = ({ category = CATEGORYS.TASK, readOnly, setOpenPropertiesBlock }) => {
  const [showTray, setShowTray] = useState(false);
  const blockTrayRef = useRef(null);
  const rightIconRef = useRef(null);
  const leftIconRef = useRef(null);
  const idleIconRef = useRef(null);

  const onDragStart = (event, node) => {
    setOpenPropertiesBlock(false);
    event.dataTransfer.setData('application/nodeData', JSON.stringify(node));
    event.dataTransfer.effectAllowed = 'move';
  };

  const showHideTray = (show) => {
    setShowTray(show);
    blockTrayRef.current?.classList[show ? 'add' : 'remove']('hide', 'hide');
  };

  return (
    <>
      <div className="task-tray-container" ref={blockTrayRef}>
        <div className="task-tray-aside">
          {CATEGORY_TYPES[category].map((node) => {
            return (
              <div key={`${node.category}_${node.taskName}`} className="block-tray" onDragStart={(event) => onDragStart(event, node)} draggable={!readOnly}>
                <button className={`block-tray-field ${node.type}`}>
                  <span className="block-tray-field-icon">{node.nodeIcon}</span>
                  <span className="block-tray-field-text"> {node.shortName}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
      <div className="show-hide-button-container">
        <button
          onMouseEnter={() => {
            idleIconRef.current?.classList.add('hide');
            if (showTray) {
              rightIconRef.current?.classList.remove('hide');
            } else {
              leftIconRef.current?.classList.remove('hide');
            }
          }}
          onMouseLeave={() => {
            idleIconRef.current?.classList.remove('hide');
            rightIconRef.current?.classList.add('hide');
            leftIconRef.current?.classList.add('hide');
          }}
          onClick={() => showHideTray(!showTray)}
          className="show-hide-button"
        >
          <ChevronRight size={20} ref={rightIconRef} className="hide" />
          <ChevronLeft size={20} ref={leftIconRef} className="hide" />
          <span ref={idleIconRef}>
            <LineIcon />
          </span>
        </button>
      </div>
    </>
  );
};
