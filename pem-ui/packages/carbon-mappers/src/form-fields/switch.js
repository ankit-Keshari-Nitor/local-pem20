import React from 'react';
import { Switch as CarbonSwitch, ContentSwitcher as CarbonSwitchwer } from '@carbon/react';
import { FORM_FIELD_GROUPS, FORM_FIELD_LABEL, FORM_FIELD_TYPE, isDisabled, labelText } from '../constant';
import { SwitchIcon } from './../icons';

const type = FORM_FIELD_TYPE.SWITCH;

const Switch = ({ field, id }) => {
  return (
    <CarbonSwitchwer onChange={() => {}}>
      <CarbonSwitch name="YES" text="YES" />
      <CarbonSwitch name="NO" text="No" />
    </CarbonSwitchwer>
  );
};

export default Switch;

// Config of Switch for Left Palette & Right Palette
Switch.config = {
  type,
  label: FORM_FIELD_LABEL.SWITCH,
  group: FORM_FIELD_GROUPS.ACTION,
  icon: <SwitchIcon />,
  editableProps: {
    Basic: [isDisabled],
    Condition: []
  },
  advanceProps: []
};
