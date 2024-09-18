import React, { useState, useEffect } from 'react';
import { Checkbox as CarbonCheckbox } from '@carbon/react';
import { FORM_FIELD_GROUPS, FORM_FIELD_LABEL, FORM_FIELD_TYPE, isDisabled, isRequired, labelText, readOnly } from '../constant';

import { CheckboxIcon } from './../icons';

const type = FORM_FIELD_TYPE.CHECKBOX;

const Checkbox = ({ field, id, currentPath, onChangeHandle, previewMode }) => {
  const { type, labelText, value, isRequired, ...rest } = field;
  const [isChecked, setIsChecked] = useState(false);
  useEffect(() => {
    if (previewMode) {
      setIsChecked(value ? value : false);
    }
  }, [field, previewMode, value]);

  return (
    <CarbonCheckbox
      data-testid={`${id}-${previewMode}`}
      id={`${id}-${previewMode}`}
      type={type}
      labelText={labelText}
      checked={isChecked}
      onChange={(e) => {
        previewMode && onChangeHandle(currentPath, !isChecked);
        setIsChecked(!isChecked);
      }}
      {...rest}
    />
  );
};

export default Checkbox;

// Config of Checkbox for Left Palette & Right Palette
Checkbox.config = {
  type,
  label: FORM_FIELD_LABEL.CHECKBOX,
  group: FORM_FIELD_GROUPS.SELECTION,
  icon: <CheckboxIcon />,
  editableProps: {
    Basic: [labelText, isDisabled, readOnly],
    Condition: []
  },
  advanceProps: [isRequired]
};
