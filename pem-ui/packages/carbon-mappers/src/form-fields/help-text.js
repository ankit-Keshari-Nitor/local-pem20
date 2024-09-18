import React from 'react';
import { Tooltip as CarbonTooltip } from '@carbon/react';
import { HelpFilled } from '@carbon/icons-react';
import { FORM_FIELD_GROUPS, FORM_FIELD_LABEL, FORM_FIELD_TYPE, PropsPanelFields, PropsPanelValidationFields } from '../constant';
import { Help } from './../icons';

const type = FORM_FIELD_TYPE.HELP;

const HelpText = ({ field, id }) => {
  const { labelText, ...rest } = field;

  return (
    <CarbonTooltip data-testid={id} align="right" label={labelText}>
      <HelpFilled className="icon-border" />
    </CarbonTooltip>
  );
};

export default HelpText;

// Config of Tooltip for Left Palette & Right Palette
HelpText.config = {
  type,
  label: FORM_FIELD_LABEL.HELP,
  group: FORM_FIELD_GROUPS.ACTION,
  icon: <Help />,
  editableProps: {
    Basic: PropsPanelFields[type],
    Condition: []
  },
  advanceProps: PropsPanelValidationFields[type]
};
