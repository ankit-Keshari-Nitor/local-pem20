import React from 'react';
import { RadioButton as CarbonRadioButton } from '@carbon/react';
import { FORM_FIELD_GROUPS, FORM_FIELD_LABEL, FORM_FIELD_TYPE, isDisabled, labelText, readOnly } from '../constant';
import { RadioIcon } from './../icons';

const type = FORM_FIELD_TYPE.RADIO;

const RadioButton = ({ field, id, previewMode }) => {
  const { type, labelText, label, isRequired, ...rest } = field;

  return <CarbonRadioButton data-testid={`${id}-${previewMode}`} id={`${id}-${previewMode}`} labelText={labelText === undefined ? label : labelText} value={id} {...rest} />;
};

export default RadioButton;

// Config of Radio Button for Left Palette & Right Palette
RadioButton.config = {
  type,
  label: FORM_FIELD_LABEL.RADIO,
  group: FORM_FIELD_GROUPS.SELECTION,
  icon: <RadioIcon />,
  editableProps: {
    Basic: [labelText, isDisabled, readOnly],
    Condition: []
  },
  advanceProps: []
};
