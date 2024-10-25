import React from 'react';

import { FORM_FIELD_GROUPS, FORM_FIELD_LABEL, FORM_FIELD_TYPE, PropsPanelFields, PropsPanelValidationFields } from '../constant';
import { FileDownloadIcon } from './../icons';
import { Button } from '@carbon/react';
import './../style.scss';
const type = FORM_FIELD_TYPE.FILE_DOWNLOADER;

const FileDownload = ({ field }) => {
  const { id, labelText, label, helperText, buttonLabel, ...rest } = field;

  return (
    <div id={id} data-testid={id}>
      <div> {labelText === undefined ? label : labelText}</div>
      <Button className="file-download-button" size="md" renderIcon={FileDownloadIcon}>{buttonLabel === undefined ? 'Download' : buttonLabel}</Button>
      <span>{helperText}</span>
    </div>
  );
};

export default FileDownload;

// Config of File DOWNLOADER for Left Palette & Right Palette
FileDownload.config = {
  type,
  label: FORM_FIELD_LABEL.FILE_DOWNLOADER,
  group: FORM_FIELD_GROUPS.BASIC_INPUT,
  icon: <FileDownloadIcon />,
  editableProps: {
    Basic: PropsPanelFields[type],
    Condition: []
  },
  advanceProps: PropsPanelValidationFields[type]
};
