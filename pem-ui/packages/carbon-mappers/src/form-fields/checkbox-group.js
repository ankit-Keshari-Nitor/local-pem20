import React, { useState, useEffect } from 'react';
import { CheckboxGroup as CarbonCheckboxGroup, Checkbox as CarbonCheckbox } from '@carbon/react';
import { FORM_FIELD_GROUPS, FORM_FIELD_LABEL, FORM_FIELD_TYPE, PropsPanelFields, PropsPanelValidationFields } from '../constant';

import { CheckboxIcon } from './../icons';

const type = FORM_FIELD_TYPE.CHECKBOXGROUP;

const CheckboxGroup = ({ field, id: uniqueId, currentPath, onChangeHandle, previewMode }) => {
  const { type, labelText, value, label, orientation, readOnly, options, isRequired, helperText, id, ...rest } = field;
  const [isChecked, setIsChecked] = useState(false);
  useEffect(() => {
    if (previewMode && value !== undefined) {
      setIsChecked(value);
    }
  }, [field, previewMode, value]);

  return (
    <CarbonCheckboxGroup
      readOnly={readOnly}
      orientation={orientation}
      data-testid={`${uniqueId}-${previewMode}`}
      id={`${uniqueId}-${previewMode}`}
      legendText={labelText === undefined ? label : labelText}
      helperText={helperText}
    >
      {options &&
        options.map((element) => {
          return <CarbonCheckbox key={`${element?.id}-${previewMode}`} labelText={element?.label} id={`${element?.id}-${previewMode}`} value={element?.value} {...rest} />;
        })}
    </CarbonCheckboxGroup>
  );
};

export default CheckboxGroup;

// Config of Checkbox Group for Left Palette & Right Palette
CheckboxGroup.config = {
  type,
  label: FORM_FIELD_LABEL.CHECKBOXGROUP,
  group: FORM_FIELD_GROUPS.SELECTION,
  icon: <CheckboxIcon />,
  editableProps: {
    Basic: PropsPanelFields[type],
    Condition: []
  },
  advanceProps: PropsPanelValidationFields[type]
};
