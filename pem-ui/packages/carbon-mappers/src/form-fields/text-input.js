import React, { useEffect, useState } from 'react';
import { TextInput as CarbonTextInput } from '@carbon/react';
import { FORM_FIELD_TYPE, FORM_FIELD_LABEL, FORM_FIELD_GROUPS, PropsPanelFields, PropsPanelValidationFields } from '../constant';
import { TextInputIcon } from './../icons';

const type = FORM_FIELD_TYPE.TEXT_INPUT;

const TextInput = ({ field, id, currentPath, onChangeHandle, previewMode }) => {
  const { labelText, helperText, label, disabled, value, isRequired, min, max, ...rest } = field;
  const [fieldValue, setFieldValue] = useState();

  useEffect(() => {
    if (previewMode) {
      setFieldValue(value ? value : '');
    }
  }, [field, previewMode, value]);
  return (
    <>
      <CarbonTextInput
        type={FORM_FIELD_TYPE.TEXT}
        data-testid={id}
        id={id}
        labelText={labelText === undefined ? label : labelText}
        helperText={helperText}
        disabled={disabled}
        defaultValue={''}
        value={fieldValue}
        onChange={(e) => {
          previewMode && onChangeHandle(currentPath, e.target.value);
          setFieldValue(e.target.value);
        }}
        {...rest}
      />
    </>
  );
};

export default TextInput;

// Config of Text Input for Left Palette & Right Palette
TextInput.config = {
  type,
  label: FORM_FIELD_LABEL.TEXT_INPUT,
  group: FORM_FIELD_GROUPS.BASIC_INPUT,
  icon: <TextInputIcon />,
  editableProps: {
    Basic: PropsPanelFields[type],
    Condition: []
  },
  advanceProps: PropsPanelValidationFields[type]
};
