import React, { useState } from 'react';
import classNames from 'classnames';
import { useDrop } from 'react-dnd';
import { COMPONENT, SIDEBAR_ITEM, ROW, COLUMN, GROUP_MENU } from '../constants/constants';
import { ColumnMenuHoverIcon, ColumnMenuIcon } from '../icon';

const ACCEPTS = [SIDEBAR_ITEM, COMPONENT, ROW, COLUMN];

const DropZone = ({ data, onDrop, isLast, className, onGroupChange }) => {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: ACCEPTS,
    drop: (item, monitor) => {
      onDrop(data, item);
    },
    canDrop: (item, monitor) => {
      const dropZonePath = data.path;
      const splitDropZonePath = dropZonePath.split('-');
      const itemPath = item.path;

      // sidebar items can always be dropped anywhere
      if (!itemPath) {
        return true;
      }

      const splitItemPath = itemPath.split('-');

      // limit columns when dragging from one row to another row
      const dropZonePathRowIndex = splitDropZonePath[0];
      const itemPathRowIndex = splitItemPath[0];
      const diffRow = dropZonePathRowIndex !== itemPathRowIndex;
      if (diffRow && splitDropZonePath.length === 2 && data.childrenCount >= 3) {
        return false;
      }

      // Invalid (Can't drop a parent element (row) into a child (column))
      const parentDropInChild = splitItemPath.length < splitDropZonePath.length;
      if (parentDropInChild) return false;

      // Current item can't possible move to it's own location
      if (itemPath === dropZonePath) return false;

      // Current area
      if (splitItemPath.length === splitDropZonePath.length) {
        const pathToItem = splitItemPath.slice(0, -1).join('-');
        const currentItemIndex = Number(splitItemPath.slice(-1)[0]);

        const pathToDropZone = splitDropZonePath.slice(0, -1).join('-');
        const currentDropZoneIndex = Number(splitDropZonePath.slice(-1)[0]);

        if (pathToItem === pathToDropZone) {
          const nextDropZoneIndex = currentItemIndex + 1;
          if (nextDropZoneIndex === currentDropZoneIndex) return false;
        }
      }

      return true;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop()
    })
  });

  const isActive = isOver && canDrop;
  const [mouseOut, setMouseOut] = useState(true);
  const [componentGroup, setComponentGroup] = useState(false);
  return (
    <div className={classNames('dropZone', { active: isActive, isLast }, className)} ref={drop}>
      {/* {isActive ? <span className="release-text">Release</span> : null} */}
      {className === 'plus-icon' &&
        (mouseOut ? (
          <span className="hover-plus-icon" onMouseOver={(e) => setMouseOut(false)}>
            <ColumnMenuIcon /> <span className='drag-text'>Drop Here From Element</span>
          </span>
        ) : (
          <span className="hover-plus-icon" onClick={(e) => setComponentGroup(!componentGroup)} onMouseOut={(e) => setMouseOut(true)}>
            <ColumnMenuHoverIcon /> <span className='drag-text'>Drop Here From Element</span>
          </span>
        ))}
      {componentGroup && (
        <div className="component-group">
          {GROUP_MENU.map((item) => {
            return (
              <div
                key={item.key}
                onClick={(e) => {
                  setComponentGroup(false);
                  onGroupChange(e, item.key, data.path);
                }}
                className="component-group-item"
              >
                {item.value}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DropZone;
