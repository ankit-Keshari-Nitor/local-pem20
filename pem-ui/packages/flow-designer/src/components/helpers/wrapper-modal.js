import { Modal } from '@carbon/react';
import React from 'react';

export default function WrapperModal({ openCancelDialog, setOpenCancelDialog, children }) {
  return (
    <Modal open={openCancelDialog} onRequestClose={() => setOpenCancelDialog(false)} passiveModal>
      {children}
    </Modal>
  );
}
