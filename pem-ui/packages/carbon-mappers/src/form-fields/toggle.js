import React, { useEffect, useState } from 'react';
import { Toggle as CarbonToggle, Tooltip } from '@carbon/react';
import { FORM_FIELD_GROUPS, FORM_FIELD_LABEL, FORM_FIELD_TYPE, PropsPanelFields, PropsPanelValidationFields } from '../constant';
import { ToggleIcon } from './../icons';
import { Information } from '@carbon/icons-react';

const type = FORM_FIELD_TYPE.TOGGLE;

const Toggle = ({ field, id: uniqueId, previewMode, currentPath, onChangeHandle, }) => {
  const { labelText, helperText, isRequired, toggleValue, label, min, max, labelA, labelB, id, readOnly, ...rest } = field;
  const [isToggled, setIsToggled] = useState(true);
  return (
    <CarbonToggle
      data-testid={id}
      key={`${uniqueId}-${previewMode}`}
      id={`${uniqueId}-${previewMode}`}
      labelText={
        <>
          {labelText === undefined ? label : labelText}
          {helperText && <Tooltip id={`${uniqueId}-${previewMode}`} className="min-max-tooltip" align="bottom" label={helperText}>
            <Information />
          </Tooltip>}
        </>
      }
      labelA={labelA ? labelA : 'No'}
      labelB={labelB ? labelB : 'Yes'}
      defaultToggled={isToggled}
      toggled={isToggled}
      readOnly={readOnly}
      onClick={(e) => {
        previewMode && onChangeHandle(currentPath, !isToggled);
        setIsToggled(!isToggled);
      }}
    />
  );
};

export default Toggle;

// Config of Toggle for Left Palette & Right Palette
Toggle.config = {
  type,
  label: FORM_FIELD_LABEL.TOGGLE,
  group: FORM_FIELD_GROUPS.ACTION,
  icon: <ToggleIcon />,
  editableProps: {
    Basic: PropsPanelFields[type],
    Condition: []
  },
  advanceProps: PropsPanelValidationFields[type]
};
