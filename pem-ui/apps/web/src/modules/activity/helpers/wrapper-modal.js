import React from 'react';
import { Modal } from '@carbon/react';

import './style.scss';

export default function GenericModal({
  isOpen = false,
  onRequestClose,
  primaryButtonText = '',
  onSecondaryButtonClick,
  onPrimaryButtonClick,
  secondaryButtonText,
  modalLabel = '',
  modalHeading,
  children
}) {
  return (
    <Modal
      open={isOpen}
      modalLabel={modalLabel}
      modalHeading={modalHeading}
      onRequestClose={onRequestClose}
      onRequestSubmit={onPrimaryButtonClick}
      primaryButtonText={primaryButtonText}
      secondaryButtonText={secondaryButtonText}
      onSecondarySubmit={onSecondaryButtonClick} // Add this handler
      className="generic-modal"
    >
      {children}
    </Modal>
  );
}
