import React from 'react';
import { RadioButton as CarbonRadioButton, RadioButtonGroup as CarbonRadioButtonGroup } from '@carbon/react';
import { FORM_FIELD_GROUPS, FORM_FIELD_LABEL, FORM_FIELD_TYPE, PropsPanelFields, PropsPanelValidationFields } from '../constant';
import { RadioIcon } from './../icons';

const type = FORM_FIELD_TYPE.RADIOGROUP;

const RadioButtonGroup = ({ field, id: uniqueId, previewMode }) => {
  const { type, labelText, label, isRequired, readOnly, orientation, options, helperText, id, ...rest } = field;

  return (
    <CarbonRadioButtonGroup
      readOnly={readOnly}
      orientation={orientation}
      data-testid={`${uniqueId}-${previewMode}`}
      id={`${uniqueId}-${previewMode}`}
      legendText={labelText === undefined ? label : labelText}
      helperText={helperText}
    >
      {options &&
        options.map((element) => {
          return <CarbonRadioButton key={`${element?.id}-${previewMode}`} labelText={element?.label} id={`${element?.id}-${previewMode}`} value={element?.value} {...rest} />;
        })}
    </CarbonRadioButtonGroup>
  );
};

export default RadioButtonGroup;

// Config of Radio Button Group for Left Palette & Right Palette
RadioButtonGroup.config = {
  type,
  label: FORM_FIELD_LABEL.RADIOGROUP,
  group: FORM_FIELD_GROUPS.SELECTION,
  icon: <RadioIcon />,
  editableProps: {
    Basic: PropsPanelFields[type],
    Condition: []
  },
  advanceProps: PropsPanelValidationFields[type]
};
