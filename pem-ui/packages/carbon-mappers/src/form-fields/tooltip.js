import React from 'react';
import { Tooltip as CarbonTooltip } from '@carbon/react';
import { Information } from '@carbon/icons-react';
import { FORM_FIELD_GROUPS, FORM_FIELD_LABEL, FORM_FIELD_TYPE, PropsPanelFields, PropsPanelValidationFields } from '../constant';
import { Info } from './../icons';

const type = FORM_FIELD_TYPE.INFO;

const Tooltip = ({ field, id }) => {
  const { helperText, ...rest } = field;

  return (
    <CarbonTooltip data-testid={id} align="bottom" label={helperText}>
      <Information />
    </CarbonTooltip>
  );
};

export default Tooltip;

// Config of Tooltip for Left Palette & Right Palette
Tooltip.config = {
  type,
  label: FORM_FIELD_LABEL.INFO,
  group: FORM_FIELD_GROUPS.ACTION,
  icon: <Info />,
  editableProps: {
    Basic: PropsPanelFields[type],
    Condition: []
  },
  advanceProps: PropsPanelValidationFields[type]
};
