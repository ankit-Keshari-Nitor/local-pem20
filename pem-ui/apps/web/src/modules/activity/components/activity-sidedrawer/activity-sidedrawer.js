import React from 'react';
import classes from './activity-sidedrawer.module.scss';
import { changeAnchor } from './change-anchor';

const ActivityVersionsSideDrawer = ({ showDrawer, anchor, onClose, children }) => {
  const { drawer, animate, hidden, overlay, overlayOpen, overlayHidden, actionItem } = classes;

  return (
    <>
      <div className={`${overlay} ${!showDrawer && overlayHidden} ${showDrawer && overlayOpen}`} onClick={onClose} aria-hidden="true" data-testid="overlay" />
      <div tabIndex="-1" className={`${drawer} ${actionItem} ${showDrawer && animate} ${!showDrawer && hidden}  ${changeAnchor(anchor, classes)}`} data-testid="drawer">
        {children}
      </div>
    </>
  );
};

export default ActivityVersionsSideDrawer;
