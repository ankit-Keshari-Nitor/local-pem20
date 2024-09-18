import React from 'react';
import { ToastNotification } from '@carbon/react';

export default function WrapperNotification({ open, title, subtitle, kind, onCloseButtonClick }) {
  return (
    <div className="custom-inline-notification-container">
      <ToastNotification  open={open} title={title} subtitle={subtitle} kind={kind} onCloseButtonClick={onCloseButtonClick} />
    </div>
  );
}
