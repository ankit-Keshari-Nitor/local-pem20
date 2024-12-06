import * as React from 'react';
import { Checkbox, TextArea, TextInput, Toggle, Button, DatePicker, DatePickerInput, Select, SelectItem } from '@carbon/react';
import { ValueSelector, getFirstOption, standardClassnames, useValueEditor } from 'react-querybuilder';
import { VectorIcon } from '../../../icons';
import { useState } from 'react';
import Shell from '@b2bi/shell';
import useTaskStore from '../../../store';

const CarbonValueEditor = (allProps) => {
  const {
    fieldData,
    operator,
    value,
    handleOnChange,
    title,
    className,
    type,
    inputType,
    values = [],
    listsAsArrays,
    parseNumbers,
    separator,
    valueSource: _vs,
    testID,
    disabled,
    selectorComponent: SelectorComponent = allProps.schema.controls.valueSelector,
    extraProps,
    context: _context,
    ...props
  } = allProps;

  const pageUtil = Shell.PageUtil();
  const [error, setError] = useState('');
  const [isOperandSelector, setIsOperandSelector] = useState(false);

  React.useEffect(()=> {
    setIsOperandSelector(false)
 }, [allProps?.field])

  const placeHolderText = fieldData?.placeholder ?? '';
  const inputTypeCoerced = ['in', 'notIn'].includes(operator[1]) ? 'text' : inputType || 'text';
  let rightOperandInput = null;

  const store = useTaskStore();
  let storeData = useTaskStore((state) => state.tasks);

  const { valueAsArray, multiValueHandler } = useValueEditor({
    handleOnChange,
    inputType,
    operator,
    value,
    type,
    listsAsArrays,
    parseNumbers,
    values
  });



  if (operator[1] === 'null' || operator[1] === 'notNull') {
    return null;
  }

  const operandSelector = (selectedValue) => {
    setIsOperandSelector(true);
    handleOnChange(selectedValue);
  };

  if ((operator[1] === 'between' || operator[1] === 'notBetween') && (type === 'select' || type === 'text')) {
    const editors = ['from', 'to'].map((key, i) => {
      if (type === 'text') {
        return (
          <TextInput
            key={key}
            type={inputTypeCoerced}
            value={valueAsArray[i] ?? ''}
            className={standardClassnames.valueListItem}
            placeholder={placeHolderText}
            onChange={(e) => multiValueHandler(e.target.value, i)}
            {...extraProps}
          />
        );
      }
      return (
        <SelectorComponent
          {...props}
          key={key}
          className={standardClassnames.valueListItem}
          handleOnChange={(v) => multiValueHandler(v, i)}
          disabled={disabled}
          value={valueAsArray[i] ?? getFirstOption(values)}
          options={values}
          listsAsArrays={listsAsArrays}
        />
      );
    });
    return (
      <span data-testid={testID} className={className} title={title}>
        {editors[0]}
        {separator}
        {editors[1]}
      </span>
    );
  }

  // eslint-disable-next-line default-case
 switch (allProps?.field) {
    case 'string':
      rightOperandInput = (
        <>
          <div style={{ marginTop: '1rem' }}>
            <TextInput
              id="operand-input"
              labelText=""
              type={inputTypeCoerced}
              value={value}
              title={title}
              className={className}
              disabled={disabled}
              placeholder={'Right Operand'}
              onChange={(e) => {
                let myString = e.target.value;
                myString = myString.replace(/["']/g, '');
                handleOnChange("'" + myString + "'");
              }}
              {...extraProps}
            />
          </div>
        </>
      );
      break;
    case 'number':
    case 'numeric':
      rightOperandInput = (
        <>
          <div style={{ marginTop: '1rem' }}>
            <TextInput
              id="operand-input"
              labelText=""
              type={inputTypeCoerced}
              value={value}
              title={title}
              className={className}
              disabled={disabled}
              placeholder={'Right Operand'}
              onChange={(e) => handleOnChange(e.target.value)}
              {...extraProps}
            />
          </div>
        </>
      );
      break;
    case 'boolean':
      rightOperandInput = (
        <>
          {isOperandSelector ? (
            <div style={{ marginTop: '1rem' }}>
              <TextInput
                id="operand-input"
                labelText=""
                type={inputTypeCoerced}
                value={value}
                title={title}
                className={className}
                disabled={disabled}
                placeholder={'Right Operand'}
                onChange={() => setIsOperandSelector(false)}
                {...extraProps}
              />
            </div>
          ) : (
            <div style={{ marginTop: '-0.5rem' }}>
              <Select
                id="operand-input"
                labelText=""
                className={className}
                title={title}
                value={value}
                disabled={disabled}
                onChange={(e) => handleOnChange(e.target.value)}
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
      rightOperandInput = (
        <>
          <div style={{ marginTop: '1rem' }}>
            {isOperandSelector ? (
              <TextInput
                id="operand-input"
                labelText=""
                type={inputTypeCoerced}
                value={value}
                title={title}
                className={className}
                disabled={disabled}
                placeholder={'Right Operand'}
                onChange={() => setIsOperandSelector(false)}
                {...extraProps}
              />
            ) : (
              <DatePicker datePickerType="single" className={className} value={value} onChange={(e) => handleOnChange(e)} disabled={disabled}>
                <DatePickerInput id="operand-input" labelText="" placeholder="mm/dd/yyyy" />
              </DatePicker>
            )}
          </div>
        </>
      );
      break;
    case 'select':
      rightOperandInput = <SelectorComponent {...props} className={className} title={title} value={value} disabled={disabled} handleOnChange={handleOnChange} options={values} />;
      break;
    case 'multiselect':
      rightOperandInput = (
        <ValueSelector
          {...props}
          className={className}
          title={title}
          value={value}
          disabled={disabled}
          handleOnChange={handleOnChange}
          options={values}
          multiple
          listsAsArrays={listsAsArrays}
        />
      );
      break;
    case 'textarea':
      rightOperandInput = (
        <TextArea value={value} title={title} className={className} placeholder={placeHolderText} onChange={(e) => handleOnChange(e.target.value)} {...extraProps} />
      );
      break;
    case 'switch':
      rightOperandInput = <Toggle className={className} isChecked={!!value} title={title} onChange={(e) => handleOnChange(e.target.checked)} {...extraProps} />;
      break;
    case 'checkbox':
      rightOperandInput = <Checkbox className={className} title={title} onChange={(e) => handleOnChange(e.target.checked)} isChecked={!!value} {...extraProps} />;
      break;
  }


  const OpenMappingDialog = () => {
    try {
      pageUtil
        .showPageModal('CONTEXT_DATA_MAPPING.SELECT', {
          data: _context.definition?.contextData ? JSON.parse(_context.definition.contextData) : _context?.version?.contextData ? JSON.parse(_context?.version?.contextData) : {},
          nodeData: storeData?.nodes
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

  // Right Operand
  return (
    <>
      {rightOperandInput}
      <Button size="md" className="opt-btn" kind="secondary" renderIcon={VectorIcon} onClick={OpenMappingDialog} style={{ marginTop: '1rem' }}></Button>
    </>
  );
};
export default CarbonValueEditor;
