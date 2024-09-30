import * as React from 'react';
import { toOptions, useValueEditor } from 'react-querybuilder';
import { TextInput, TreeView, TreeNode, Button, DatePicker, DatePickerInput, Select, SelectItem } from '@carbon/react';
import { ElippsisIcon } from '../../../icons';
import { useState } from 'react';
import WrapperModal from '../../helpers';

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
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
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
    multiValueHandler(selectedValue, 0);
    setOpenCancelDialog(false);
  };

  const Temp = (
    <TreeView label="Demo Data">
      <TreeNode label="Enabled-1">
        <TreeNode label="Disabled-1" onClick={(e) => operandSelector('Disabled-1')} />
      </TreeNode>
      <TreeNode label="Enabled-2">
        <TreeNode label="Disabled-2" onClick={(e) => operandSelector('Disabled-2')} />
      </TreeNode>
    </TreeView>
  );

  const handleChange = (value) => {
    multiValueHandler(value, 0);
  };

  let leftOperandInput = null;
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
        </>
      );
      break;
    case 'date':
      leftOperandInput = (
        <>
          <div style={{ marginTop: '1rem' }}>
            <DatePicker datePickerType="single" className={className} value={valueAsArray[0]} onChange={(e) => handleChange(e)} disabled={disabled}>
              <DatePickerInput id="txt-input" labelText="" placeholder="mm/dd/yyyy" />
            </DatePicker>
          </div>
        </>
      );
      break;
  }

  return (
    <>
      {leftOperandInput}
      <Button size="md" className="opt-btn" kind="secondary" renderIcon={ElippsisIcon} onClick={() => setOpenCancelDialog(true)} style={{ marginTop: '1rem' }}></Button>
      <WrapperModal openCancelDialog={openCancelDialog} setOpenCancelDialog={setOpenCancelDialog}>
        {Temp}
      </WrapperModal>
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
 