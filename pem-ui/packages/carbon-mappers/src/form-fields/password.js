import React, { useEffect, useState } from 'react';
import { PasswordInput } from '@carbon/react';
import { FORM_FIELD_TYPE, FORM_FIELD_LABEL, FORM_FIELD_GROUPS, PropsPanelFields, PropsPanelValidationFields } from '../constant';
import { Password as PasswordIcon } from '@carbon/icons-react';

const type = FORM_FIELD_TYPE.PASSWORD;

const Password = ({ field, id: uniqueId, currentPath, onChangeHandle, previewMode }) => {
  const { labelText, helperText, label, disabled, value, isRequired, min, max, id, ...rest } = field;
  const [fieldValue, setFieldValue] = useState();
  useEffect(() => {
    if (previewMode) {
      setFieldValue(value ? value : '');
    }
  }, [field, previewMode, value]);

  return (
    <>
      <PasswordInput
        type={FORM_FIELD_TYPE.TEXT}
        data-testid={`${uniqueId}-${previewMode}`}
        id={`${uniqueId}-${previewMode}`}
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

export default Password;

// Config of Password for Left Palette & Right Palette
Password.config = {
  type,
  label: FORM_FIELD_LABEL.PASSWORD,
  group: FORM_FIELD_GROUPS.BASIC_INPUT,
  icon: <PasswordIcon />,
  editableProps: {
    Basic: PropsPanelFields[type],
    Condition: []
  },
  advanceProps: PropsPanelValidationFields[type]
};
