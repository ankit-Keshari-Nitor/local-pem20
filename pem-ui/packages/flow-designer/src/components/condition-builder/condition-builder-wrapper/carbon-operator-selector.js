import * as React from 'react';
import { toOptions, useValueEditor } from 'react-querybuilder';
import { TextInput, Button, DatePicker, DatePickerInput, Select, SelectItem } from '@carbon/react';
import { VectorIcon } from '../../../icons';
import { useState } from 'react';
import Shell from '@b2bi/shell';

const CarbonOperatorSelector = ({
  className,
  handleOnChange,
  options,
  value,
  title,
  disabled,
  testID: _testID,
  rule: _rule,
  rules: _rules,
  level: _level,
  path: _path,
  context: _context,
  validation: _validation,
  operator: _operator,
  field: _field,
  fieldData: _fieldData,
  multiple: _multiple,
  listsAsArrays: _listsAsArrays,
  schema: _schema,
  ...extraProps
}) => {
  const pageUtil = Shell.PageUtil();
  const [error, setError] = useState('');
  const [isOperandSelector, setIsOperandSelector] = useState(false);

  const { valueAsArray, multiValueHandler } = useValueEditor({
    handleOnChange,
    inputType: 'text',
    operator: 'between',
    value: Array.isArray(value) ? value : ['', value],
    type: 'text',
    listsAsArrays: 'false',
    parseNumbers: 'false',
    values: []
  });

  const operandSelector = (selectedValue) => {
    setIsOperandSelector(true);
    multiValueHandler(selectedValue, 0);
  };

  const handleChange = (value) => {
    setIsOperandSelector(false);
    multiValueHandler(value, 0);
  };

  let leftOperandInput = null;
  // eslint-disable-next-line default-case
  switch (_field) {
    case 'string':
      leftOperandInput = (
        <>
          <div style={{ marginTop: '1rem' }}>
            <TextInput
              id="txt-input"
              labelText=""
              value={valueAsArray.length > 1 ? valueAsArray[0] : ''}
              title={title}
              className={className}
              disabled={disabled}
              placeholder={'Left Operand'}
              onChange={(e) => {
                let myString = e.target.value;
                myString = myString.replace(/["']/g, '');
                handleChange("'" + myString + "'");
              }}
              {...extraProps}
            />
          </div>
        </>
      );
      break;
    case 'numeric':
    case 'number':
      leftOperandInput = (
        <>
          <div style={{ marginTop: '1rem' }}>
            <TextInput
              id="txt-input"
              labelText=""
              value={valueAsArray.length > 1 ? valueAsArray[0] : ''}
              title={title}
              className={className}
              disabled={disabled}
              placeholder={'Left Operand'}
              onChange={(e) => handleChange(e.target.value)}
              {...extraProps}
            />
          </div>
        </>
      );
      break;
    case 'boolean':
      leftOperandInput = (
        <>
          {isOperandSelector ? (
            <div style={{ marginTop: '1rem' }}>
              <TextInput
                id="txt-input"
                labelText=""
                value={valueAsArray.length > 1 ? valueAsArray[0] : ''}
                title={title}
                className={className}
                disabled={disabled}
                placeholder={'Left Operand'}
                onChange={handleChange}
                {...extraProps}
              />
            </div>
          ) : (
            <div style={{ marginTop: '0rem' }}>
              <Select
                id="txt-input"
                labelText=""
                className={className}
                title={title}
                value={valueAsArray[0]}
                disabled={disabled}
                onChange={(e) => handleChange(e.target.value)}
                {...extraProps}
              >
                <SelectItem value="" text="Select" />
                <SelectItem value="true" text="True" />
                <SelectItem value="false" text="False" />
              </Select>
            </div>
          )}
        </>
      );
      break;
    case 'date':
      leftOperandInput = (
        <>
          <div style={{ marginTop: '1rem' }}>
            {isOperandSelector ? (
              <TextInput
                id="txt-input"
                labelText=""
                value={valueAsArray.length > 1 ? valueAsArray[0] : ''}
                title={title}
                className={className}
                disabled={disabled}
                placeholder={'Left Operand'}
                onChange={handleChange}
                {...extraProps}
              />
            ) : (
              <DatePicker datePickerType="single" className={className} value={valueAsArray[0]} onChange={(e) => handleChange(e)} disabled={disabled}>
                <DatePickerInput id="txt-input" labelText="" placeholder="mm/dd/yyyy" />
              </DatePicker>
            )}
          </div>
        </>
      );
      break;
  }

  const OpenMappingDialog = () => {
    try {
      pageUtil
        .showPageModal('CONTEXT_DATA_MAPPING.SELECT', {
          data: JSON.parse(_context.definition?.contextData ? _context.definition.contextData : _context?.version?.contextData)
        })
        .then((modalData) => {
          if (modalData.actionType === 'submit') {
            operandSelector(modalData?.data?.data);
          }
        });
      setError('');
    } catch (e) {
      setError('Please enter valid context json data');
    }
  };

  return (
    <>
      {leftOperandInput}
      <Button size="md" className="opt-btn" kind="secondary" renderIcon={VectorIcon} onClick={OpenMappingDialog} style={{ marginTop: '1rem' }}></Button>
      {/* Relational Operator Dropdown */}
      <Select
        id="selector-label"
        className={className}
        title={title}
        labelText=""
        value={valueAsArray.length > 1 ? valueAsArray[1] : valueAsArray[0]}
        disabled={disabled}
        onChange={(e) => multiValueHandler(e.target.value, 1)}
        {...extraProps}
      >
        {toOptions(options)}
      </Select>
    </>
  );
};

export default CarbonOperatorSelector;
