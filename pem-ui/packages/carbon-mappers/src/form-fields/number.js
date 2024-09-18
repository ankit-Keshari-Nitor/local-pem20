import React, { useEffect, useState } from 'react';
import { NumberInput as CarbonNumberInput } from '@carbon/react';
import { FORM_FIELD_TYPE, FORM_FIELD_LABEL, FORM_FIELD_GROUPS, PropsPanelFields, PropsPanelValidationFields } from '../constant';
import { CharacterWholeNumber } from '@carbon/icons-react';

const type = FORM_FIELD_TYPE.NUMBER;

const NumberInput = ({ field, id, currentPath, onChangeHandle, previewMode }) => {
  const { labelText, helperText, readOnly, label, value, isRequired, min, max, ...rest } = field;
  const [fieldValue, setFieldValue] = useState(0);

  useEffect(() => {
    if (previewMode) {
      setFieldValue(value ? value : 0);
    }
  }, [field, previewMode, value]);

  return (
    <>
      <CarbonNumberInput
        data-testid={id}
        id={id}
        label={labelText === undefined ? label : labelText}
        helperText={helperText}
        readOnly={readOnly}
        value={fieldValue}
        onChange={(e, data) => {
          previewMode && onChangeHandle(currentPath, data.value);
          setFieldValue(data.value);
        }}
        onKeyUp={(e) => {
          e.preventDefault();
        }}
        min={parseInt(min?.value)}
        max={parseInt(max?.value)}
        {...rest}
      />
    </>
  );
};

export default NumberInput;

// Config of NumberInput for Left Palette & Right Palette
NumberInput.config = {
  type,
  label: FORM_FIELD_LABEL.NUMBER,
  group: FORM_FIELD_GROUPS.BASIC_INPUT,
  icon: <CharacterWholeNumber />,
  editableProps: {
    Basic: PropsPanelFields[type],
    Condition: []
  },
  advanceProps: PropsPanelValidationFields[type]
};
