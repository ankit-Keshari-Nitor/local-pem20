import React, { useState, useEffect } from 'react';
import { DatePicker as CarbonDatePicker, DatePickerInput } from '@carbon/react';
import { FORM_FIELD_GROUPS, FORM_FIELD_LABEL, FORM_FIELD_TYPE, PropsPanelFields, PropsPanelValidationFields } from '../constant';
import { DatepickerIcon } from './../icons';

const type = FORM_FIELD_TYPE.DATEPICKER;

const DatePicker = ({ field, id: uniqueId, currentPath, onChangeHandle, previewMode }) => {
  const { type, labelText, value, dateFormat, label, readOnly, dateValue, placeHolder, helperText, isRequired, minDate, maxDate, id, ...rest } = field;
  const [fieldValue, setFieldValue] = useState(new Date());
  useEffect(() => {
    if (previewMode) {
      setFieldValue(dateValue ? new Date(dateValue).toLocaleString('en-US') : value ? new Date(value).toLocaleString('en-US') : new Date().toLocaleString('en-US'));
    } else {
      setFieldValue(dateValue ? new Date(dateValue).toLocaleString('en-US') : new Date().toLocaleString('en-US'));
    }
  }, [field, previewMode, value]);

  return (
    <>
      <CarbonDatePicker
        data-testid={uniqueId}
        id={uniqueId}
        datePickerType="single"
        minDate={minDate?.value}
        maxDate={maxDate?.value}
        onChange={(e) => {
          previewMode && onChangeHandle(currentPath, e);
          setFieldValue(e);
        }}
        dateFormat={dateFormat?.value}
        readOnly={readOnly}
      >
        <DatePickerInput id={uniqueId} type={type} labelText={labelText ? labelText : label} placeholder={placeHolder ? placeHolder : "mm/dd/yyyy"} helperText={helperText} {...rest} />
      </CarbonDatePicker>
    </>
  );
};

export default DatePicker;

// Config of Date Picker for Left Palette & Right Palette
DatePicker.config = {
  type,
  label: FORM_FIELD_LABEL.DATEPICKER,
  group: FORM_FIELD_GROUPS.BASIC_INPUT,
  icon: <DatepickerIcon />,
  editableProps: {
    Basic: PropsPanelFields[type],
    Condition: []
  },
  advanceProps: PropsPanelValidationFields[type]
};
