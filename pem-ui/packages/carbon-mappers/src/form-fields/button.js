import React from 'react';
import { Button as CarbonButton } from '@carbon/react';
import { FORM_FIELD_GROUPS, FORM_FIELD_LABEL, FORM_FIELD_TYPE, isDisabled, labelText } from '../constant';
import { ButtonIcon } from './../icons';

const type = FORM_FIELD_TYPE.BUTTON;

const Button = ({ field, id }) => {
  const { type, labelText, ...rest } = field;

  return (
    <CarbonButton kind="secondary" data-testid={id} id={id} {...rest}>
      {field.labelText}
    </CarbonButton>
  );
};

export default Button;

// Config of Button for Left Palette & Right Palette
Button.config = {
  type,
  label: FORM_FIELD_LABEL.BUTTON,
  group: FORM_FIELD_GROUPS.ACTION,
  icon: <ButtonIcon />,
  editableProps: {
    Basic: [labelText],
    Condition: [isDisabled]
  },
  advanceProps: []
};
