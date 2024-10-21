import React from 'react';
import { FORM_FIELD_GROUPS, FORM_FIELD_LABEL, FORM_FIELD_TYPE, PropsPanelValidationFields, PropsPanelFields } from '../constant';
import { GroupIcon } from './../icons';

const type = FORM_FIELD_TYPE.GROUP;

const Group = ({ renderRow, row, currentPath, previewMode, onChangeHandle, isSelected, setIsSelected, onGroupChange }) => {
  return (
    <div className="group" data-testid={'group-id'} id={'group-id '}>
      {renderRow(row, currentPath, renderRow, previewMode, onChangeHandle, isSelected, setIsSelected, onGroupChange)}
    </div>
  );
};

export default Group;

// Config of Group for Left Palette & Right Palette
Group.config = {
  type,
  label: FORM_FIELD_LABEL.GROUP,
  group: FORM_FIELD_GROUPS.PANEL,
  icon: <GroupIcon />,
  editableProps: {
    Basic: PropsPanelFields[type],
    Condition: []
  },
  advanceProps: PropsPanelValidationFields[type]
};
