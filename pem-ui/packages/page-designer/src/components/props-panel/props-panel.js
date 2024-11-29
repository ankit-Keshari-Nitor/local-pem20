import React, { useEffect, useState } from 'react';
import {
  Toggle,
  TextInput,
  Button,
  Select,
  DatePicker,
  DatePickerInput,
  Dropdown,
  SelectItem,
  RadioButtonGroup,
  RadioButton,
  FormLabel,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  TreeView,
  TreeNode,
  Modal,
  Grid,
  Column,
  Accordion,
  AccordionItem,
  Checkbox,
  FileUploader,
  CheckboxGroup,
  Tooltip,
  TextArea,
  FileUploaderItem,
  Tag
} from '@carbon/react';
import { v4 as uuid } from 'uuid';
import './props-panel.scss';
import {
  CUSTOM_COLUMN,
  SUBTAB,
  CUSTOM_TITLE,
  OPTIONS,
  CUSTOMREGEX,
  TABLE_COLUMNS,
  TABLE_ROWS,
  TEXT_INPUT,
  MAPPING,
  SELECT,
  TOGGLE,
  TEXT,
  RADIO,
  CHECKBOX,
  FILE_UPLOAD,
  DROPDOWN,
  ADD_COLUMN_BTN,
  ISREQUIRED,
  ADD_TAB_BTN
} from '../../constants/constants';
import { collectPaletteEntries } from '../../utils/helpers';
import { VectorIcon } from '../../icon';
import { TrashCan, Information, Help, Add as CarbonPlus, Close } from '@carbon/icons-react';
import Shell from '@b2bi/shell';

export default function PropsPanel({
  layout,
  selectedFieldProps,
  handleSchemaChanges,
  columnSizeCustomization,
  onFieldDelete,
  componentMapper,
  replaceComponent,
  propsPanelActiveTab,
  activityDefinitionData,
  getDocuments,
}) {
  const [editableProps, setEditableProps] = React.useState({});
  const [advanceProps, setAdvanceProps] = React.useState([]);
  const [componentStyle, setComponentStyle] = React.useState([]);
  const [componentType, setComponentType] = React.useState();
  const [componentTypes, setComponentTypes] = React.useState([]);
  const [tabSubTitle, setTabSubTitle] = React.useState();
  const [options, setOptions] = React.useState([]);
  const [customRegexPattern, setCustomRegexPattern] = React.useState(false);
  const [openMappingDialog, setOpenMappingDialog] = useState(false);
  const [mappingSelectorValue, setMappingSelectorValue] = useState('');
  const [mappedId, setMappedId] = useState('');
  const [mappedKey, setMappedKey] = useState('');
  const [tableColId, setTableColId] = useState('');
  const [tableColKey, setTableColKey] = useState('');
  const [mappedPropsName, setMappedPropsName] = useState('');
  const [mappedCurrentPathDetail, setMappedCurrentPathDetail] = useState('');
  const [selectedRadioValue, setSelectedRadioValue] = useState('');
  const [selectedCheckboxValues, setSelectedCheckboxValues] = useState([]);
  const [isValueAsLabel, setIsValueAsLabel] = useState(false);

  const [textAreaBorderColor, setTextAreaBorderColor] = useState(false);
  const [fileExtensionValue, setFileExtensionValue] = useState([]);
  const [allowedExtensionValue, setAllowedExtensionValue] = useState('');

  const [tableHeader, setTableHeader] = React.useState([]);
  const [tableRows, setTableRows] = React.useState([]);
  const [currentTab, setCurrentTab] = useState(propsPanelActiveTab);

  const [file, setFile] = useState();

  const items = [
    { text: '1' },
    { text: '2' },
    { text: '3' },
    { text: '4' },
    { text: '5' },
    { text: '6' },
    { text: '7' },
    { text: '8' },
    { text: '9' },
    { text: '10' },
    { text: '11' },
    { text: '12' },
    { text: '13' },
    { text: '14' },
    { text: '15' },
    { text: '16' }
  ];
  const [error, setError] = useState('');
  const pageUtil = Shell.PageUtil();
  useEffect(() => {
    setEditableProps(selectedFieldProps?.component?.editableProps);
    setAdvanceProps(selectedFieldProps?.component?.advanceProps);
    setComponentStyle(selectedFieldProps?.component?.style);
    setTabSubTitle(selectedFieldProps?.component?.tabTitle);
    setComponentType(selectedFieldProps.component.type);
    setComponentTypes(collectPaletteEntries(componentMapper));
    setSelectedCheckboxValues(selectedFieldProps?.component?.editableProps?.Basic?.find((prop) => prop.type === 'checkbox')?.value || []);
    setSelectedRadioValue(selectedFieldProps?.component?.editableProps?.Basic?.find((prop) => prop.type === 'radio')?.value || '');
    setOptions(selectedFieldProps?.component?.editableProps?.Basic?.find((prop) => prop.type === 'Options')?.value || []);
    setTableHeader(selectedFieldProps?.component?.editableProps?.Basic?.find((prop) => prop.propsName === TABLE_COLUMNS)?.value || []);
    setTableRows(selectedFieldProps?.component?.editableProps?.Basic?.find((prop) => prop.propsName === TABLE_ROWS)?.value || []);
    setIsValueAsLabel(selectedFieldProps?.component?.editableProps?.Basic?.find((prop) => prop.propsName === 'valueAsLabel')?.value || false);
    setFile(selectedFieldProps?.component?.editableProps?.Basic?.find((prop) => prop.type === 'FileUpload')?.value || undefined);
    setFileExtensionValue(selectedFieldProps?.component?.advanceProps?.find((prop) => prop.type === 'TextArea')?.value || []);
  }, [selectedFieldProps, componentMapper, customRegexPattern]);

  useEffect(() => {
    setCurrentTab(propsPanelActiveTab);
  }, [selectedFieldProps]);

  const handleChange = (e) => {
    columnSizeCustomization(e.target.value, selectedFieldProps.currentPathDetail);
    setComponentStyle([{ labelText: 'Column Size', text: e.target.value }]);
  };

  /* const handleFileChange = (e, key, propsName, selectedFieldProps) => {
   const file = e.target?.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(',')[1]; // Get the base64 string
        handleSchemaChanges(selectedFieldProps?.id, key, propsName, file.name + '/' + base64String, selectedFieldProps?.currentPathDetail);
      };
      reader.readAsDataURL(file);
    }
      };
 */
  const onDeleteFile = (key, propsName, selectedFieldProps) => {
    setFile();
    handleSchemaChanges(selectedFieldProps?.id, key, propsName, '', selectedFieldProps?.currentPathDetail)
  }

  const onOpenFiles = (key, propsName, selectedFieldProps, documentCategory) => {
    pageUtil.showPageModal(`FILE_ATTACHMENT.${documentCategory}`).then(async (modalData) => {
      if (modalData.actionType === 'submit') {
        const file = {
          status: 'edit',
          iconDescription: 'Delete Icon',
          invalid: true,
          errorSubject: 'InValid ',
          name: modalData?.data?.data?.documentName,
          filesize: modalData?.data?.data?.contentLength || modalData?.data?.data?.uploadFile?.addedFiles[0]?.size
        }
        const base64 = await getDocuments(modalData?.data?.data?.documentKey);
        file.base64 = base64
        setFile({
          ...file
        });

        handleSchemaChanges(selectedFieldProps?.id, key, propsName, file, selectedFieldProps?.currentPathDetail)
      } else {
        setFile();
        handleSchemaChanges(selectedFieldProps?.id, key, propsName, '', selectedFieldProps?.currentPathDetail)
      }
    });
  }

  const handleAddOption = (newIndex) => {
    const index = options.length + 1;
    const newOptions = [...options];
    newOptions.splice(newIndex + 1, 0, { label: '', id: index - 1, value: '' });
    setOptions(newOptions);
    handleSchemaChanges(selectedFieldProps?.id, 'Basic', 'options', newOptions, selectedFieldProps?.currentPathDetail);
  };

  const handleOptionChange = (index, value, key = '') => {
    setOptions((prevOptions) => {
      const newOptions = [...prevOptions];
      newOptions[index].id = `${selectedFieldProps?.id}-${index}`;
      if (isValueAsLabel) {
        newOptions[index].label = value;
        newOptions[index].value = value;
      } else {
        key == 'label' ? (newOptions[index].label = value) : (newOptions[index].value = value);
      }
      handleSchemaChanges(selectedFieldProps?.id, 'Basic', 'options', newOptions, selectedFieldProps?.currentPathDetail);
      return newOptions;
    });
  };

  const handleOptionValues = (optnType) => {
    let newOptions = [{ label: '', id: 0, value: '' }];
    if (optnType === 'dynamic') {
      newOptions = [...newOptions, { label: '', id: 1, value: '' }];
    }
    handleSchemaChanges(selectedFieldProps?.id, 'Basic', 'options', newOptions, selectedFieldProps?.currentPathDetail);
  };

  const handleDeleteOption = (index) => {
    setOptions((prevOptions) => {
      let newOptions = [...prevOptions];
      newOptions.splice(index, 1);
      if (newOptions.length == 0) {
        newOptions = [
          {
            label: 'Label-0',
            id: '',
            value: 'Value-0'
          }
        ];
      }
      handleSchemaChanges(selectedFieldProps?.id, 'Basic', 'options', newOptions, selectedFieldProps?.currentPathDetail);
      return newOptions;
    });
  };

  const isLastChild = (path, layout) => {
    if (path && path.length > 0) {
      let childLength = false;
      let index = path[0];
      if (path.length === 1) {
        childLength = layout[0]?.children?.length > 1 ? true : false;
      } else {
        path.shift();
        return isLastChild(path, layout[index]?.children);
      }
      return childLength;
    }
  };

  const handleComponentTypeChange = (e) => {
    const newComponent = componentTypes.filter((items) => items.component.type === e.target.value)[0];
    replaceComponent(e, selectedFieldProps.currentPathDetail, newComponent, selectedFieldProps.id);
    setComponentType(e.target.value);
  };

  const handleRegexOption = (e, items, message, id, propsName, path) => {
    const newRegex = items.filter((items) => items.value === e)[0];
    const newValue = { pattern: newRegex.label, value: newRegex.value, message: message };
    if (e === CUSTOMREGEX) {
      newValue.customRegex = '';
      setCustomRegexPattern(true);
    }
    handleSchemaChanges(id, 'advance', propsName, newValue, path, currentTab);
  };

  const handleCheckboxGroupChange = (e, propsName) => {
    const value = e.target.value;
    setSelectedCheckboxValues((prevValues) => {
      const newValues = prevValues.includes(value) ? prevValues.filter((val) => val !== value) : [...prevValues, value];
      handleSchemaChanges(selectedFieldProps?.id, 'Basic', propsName, newValues, selectedFieldProps?.currentPathDetail);
      return newValues;
    });
  };

  const OpenMappingDialog = (id, key, propsName, currentPathDetail, columnId = null, columnKey = null) => {
    try {
      pageUtil
        .showPageModal('CONTEXT_DATA_MAPPING.SELECT', {
          data: JSON.parse(activityDefinitionData.definition?.contextData ? activityDefinitionData.definition.contextData : activityDefinitionData?.version?.contextData)
        })
        .then((modalData) => {
          if (modalData.actionType === 'submit') {
            setMappedId(id);
            setMappedKey(key);
            setMappedPropsName(propsName);
            setTableColId(columnId);
            setTableColKey(columnKey);
            setMappedCurrentPathDetail(currentPathDetail);
            handleSchemaChanges(id, key, propsName, modalData?.data?.data, currentPathDetail);
          }
        });
      setError('');
    } catch (e) {
      setError('Please enter valid context json data');
    }
  };

  const mappingSelector = (selectedValue) => {
    mappedPropsName === TABLE_ROWS
      ? handleRowOpt(tableColId, selectedValue, tableColKey)
      : handleSchemaChanges(mappedId, mappedKey, mappedPropsName, selectedValue, mappedCurrentPathDetail);
    setMappingSelectorValue(selectedValue);
    setOpenMappingDialog(false);
  };

  const handleFileExtensionTag = (id, advance, propsName, newExtension, path) => {
    const newExtensionValue = [...fileExtensionValue, newExtension];
    setFileExtensionValue(newExtensionValue);
    setAllowedExtensionValue('');
    handleSchemaChanges(id, advance, propsName, newExtensionValue, path, currentTab);
  };

  const handleRemoveExtension = (id, advance, propsName, index, path) => {
    fileExtensionValue.splice(index, 1);
    setFileExtensionValue(fileExtensionValue);
    handleSchemaChanges(id, advance, propsName, fileExtensionValue, path, currentTab);
  };

  // ----------------------------------------------------------------Table Related Functions----------------------------------------------------------------

  const handleAddHeader = () => {
    setTableHeader((preHeader) => [
      ...preHeader,
      {
        key: '',
        header: '',
        colSpan: '6',
        searchable: false,
        sortable: false,
        required: false
      }
    ]);
  };

  const handleHeaderChange = (index, value, key = '') => {
    setTableHeader((prevOptions) => {
      const newOptions = [...prevOptions];
      newOptions[index][key] = value;
      handleSchemaChanges(selectedFieldProps?.id, 'Basic', TABLE_COLUMNS, newOptions, selectedFieldProps?.currentPathDetail);
      return newOptions;
    });
  };

  const handleAddRow = (tableolumns) => {
    const tableRow = {};
    tableolumns.map((item) => {
      tableRow[item.key] = '';
    });
    setTableRows((preRows) => [...preRows, { id: `pem_${uuid().replace(/[^0-9]/g, '').substring(0, 5)}`, ...tableRow }]);
  };

  const handleRowOpt = (index, value, key) => {
    if (selectedFieldProps?.component?.type === 'data-table') {
      setTableRows((prevRow) => {
        const rows = [...prevRow];
        rows[index][key] = value;
        handleSchemaChanges(selectedFieldProps?.id, 'Basic', TABLE_ROWS, rows, selectedFieldProps?.currentPathDetail);
        return rows;
      });
    } else {
      setOptions((prevOpt) => {
        const optns = [...prevOpt];
        optns[index][key] = value;
        isValueAsLabel && (optns[index]['label'] = value);
        handleSchemaChanges(selectedFieldProps?.id, 'Basic', 'options', optns, selectedFieldProps?.currentPathDetail);
        return optns;
      });
    }
  };

  const handleTableRowdelete = (index) => {
    tableRows.splice(index, 1);
    setTableHeader(tableRows);
    handleSchemaChanges(selectedFieldProps?.id, 'Basic', TABLE_ROWS, tableRows, selectedFieldProps?.currentPathDetail);
  };

  const handleTableColumn = (index) => {
    tableHeader.splice(index, 1);
    setTableHeader(tableHeader);
    handleSchemaChanges(selectedFieldProps?.id, 'Basic', TABLE_COLUMNS, tableHeader, selectedFieldProps?.currentPathDetail);
  };

  return (
    <div className="right-palette-container">
      {selectedFieldProps && (
        <>
          <Tabs selectedIndex={currentTab} onChange={(e) => setCurrentTab(e.selectedIndex)}>
            {/* <Tabs> */}
            <TabList aria-label="List of tabs" contained>
              <Tab>Properties</Tab>
              {advanceProps && advanceProps.length > 0 ? <Tab>Validators</Tab> : null}
              {/* <Tab>Condition</Tab> */}
            </TabList>
            <TabPanels>
              <TabPanel className="tab-panel">
                {editableProps &&
                  Object.keys(editableProps).map((key, idx) => {
                    return (
                      key === 'Basic' && (
                        <span key={idx}>
                          {editableProps[key] && editableProps[key].length > 0 && (
                            <Grid>
                              {editableProps[key].map((item, idx) => {
                                return (
                                  <>
                                    {/* Select */}
                                    {item.type === SELECT && (
                                      <Column lg={item.size.col}>
                                        <Select
                                          className="component-types right-palette-form-item"
                                          id={String(selectedFieldProps.id)}
                                          labelText={item.label}
                                          onChange={handleComponentTypeChange}
                                          defaultValue={componentType}
                                          value={componentType}
                                          disabled={item?.options.length > 1 ? false : true}
                                        >
                                          {item.options.map((fieldName, index) => {
                                            return <SelectItem key={index} value={fieldName} text={fieldName} />;
                                          })}
                                        </Select>
                                      </Column>
                                    )}
                                    {/* TextInput */}
                                    {item.type === TEXT_INPUT && item.propsName != TABLE_COLUMNS && item.propsName != TABLE_ROWS && (
                                      <Column lg={item.size.col}>
                                        <TextInput
                                          key={idx}
                                          readOnly={item?.readOnly}
                                          id={String(idx)}
                                          className="right-palette-form-item"
                                          labelText={item.label}
                                          placeholder={item.placeholder}
                                          value={item.value}
                                          invalid={item.invalid ? item.invalid : false}
                                          invalidText={item.invalidText ? item.invalidText : null}
                                          onChange={(e) => handleSchemaChanges(selectedFieldProps?.id, key, item.propsName, e.target.value, selectedFieldProps?.currentPathDetail)}
                                        />
                                      </Column>
                                    )}
                                    {/* Mapping */}
                                    {item.type === MAPPING && (

                                      <Column className="mapping-column" lg={item.size.col} >
                                        <TextInput
                                          key={idx}
                                          id={String(idx)}
                                          className="right-palette-form-item-mapping right-palette-form-item"
                                          labelText={item.label}
                                          placeholder={item.placeholder}
                                          value={item.value}
                                          invalid={error}
                                          invalidText={error}
                                          onChange={(e) => handleSchemaChanges(selectedFieldProps?.id, key, item.propsName, e.target.value, selectedFieldProps?.currentPathDetail)}
                                        />

                                        <Button
                                          size="sm"
                                          className="ctn-mapping-button"
                                          kind="secondary"
                                          renderIcon={() => <div className='vector-btn'><VectorIcon /></div>}
                                          onClick={() => OpenMappingDialog(selectedFieldProps?.id, key, item.propsName, selectedFieldProps?.currentPathDetail)}
                                        ></Button>
                                      </Column>
                                    )}
                                    {/* Toggle */}
                                    {item.type === TOGGLE && item.propsName != ISREQUIRED && (
                                      <Column lg={item.size.col}>
                                        <ul key={idx}>
                                          <li>
                                            <Toggle
                                              key={idx}
                                              size="sm"
                                              id={'toggle-' + key + '-' + String(idx) + '-' + selectedFieldProps?.id}
                                              className="right-palette-form-item-toggle"
                                              labelText={item.label}
                                              defaultToggled={Boolean(item.value)}
                                              toggled={Boolean(item.value)}
                                              labelA={item?.labelA}
                                              labelB={item?.labelB}
                                              onClick={(e) => handleSchemaChanges(selectedFieldProps?.id, key, item.propsName, !item.value, selectedFieldProps?.currentPathDetail)}
                                            />
                                          </li>
                                        </ul>
                                      </Column>
                                    )}
                                    {/* Toggle with required */}
                                    {item.type === TOGGLE && item.propsName == ISREQUIRED && (
                                      <Column lg={item.size.col}>
                                        <ul key={idx}>
                                          <li>
                                            <Toggle
                                              key={idx}
                                              size="sm"
                                              id={'toggle-' + String(idx) + '-' + selectedFieldProps?.id}
                                              className="right-palette-form-item-toggle"
                                              labelText={item.label}
                                              defaultToggled={Boolean(item.value.value)}
                                              toggled={Boolean(item.value.value)}
                                              labelA={item?.labelA}
                                              labelB={item?.labelB}
                                              onClick={(e) =>
                                                handleSchemaChanges(
                                                  selectedFieldProps?.id,
                                                  key,
                                                  item.propsName,
                                                  {
                                                    value: !item.value.value,
                                                    message: getValidationMessage(selectedFieldProps?.component?.label, item.propsName, !item.value.value)
                                                  },
                                                  selectedFieldProps?.currentPathDetail
                                                )
                                              }
                                            />
                                          </li>
                                        </ul>
                                      </Column>
                                    )}
                                    {/* Text */}
                                    {item.type === TEXT && (
                                      <Column lg={7}>
                                        <div className="component-type-id">
                                          <FormLabel>{item.label}</FormLabel>
                                          <FormLabel className="component-type-id-label">{item.value}</FormLabel>
                                        </div>
                                      </Column>
                                    )}
                                    {/* Radio */}
                                    {item.type === RADIO && (
                                      <Column lg={item.size.col}>
                                        <RadioButtonGroup
                                          key={`radio-group-${item.label}`}
                                          legendText={item.label}
                                          name={`radio-group-${item.label}`}
                                          valueSelected={item.value}
                                          onChange={(value) => {
                                            (value === 'static' || value === 'dynamic') && handleOptionValues(value);
                                            handleSchemaChanges(selectedFieldProps?.id, key, item.propsName, value, selectedFieldProps?.currentPathDetail);
                                          }}
                                        >
                                          {item?.options.length > 0 &&
                                            item?.options.map((option, idx) =>
                                              option?.value ? (
                                                <RadioButton className='radio-btn-group' id={`radio-group-${item.label}-${idx}`} key={idx} labelText={option.label} value={option.value} />
                                              ) : null
                                            )}
                                        </RadioButtonGroup>
                                      </Column>
                                    )}
                                    {/* CheckBox */}
                                    {item.type === CHECKBOX && (
                                      <div className="right-palette-form-item">
                                        <CheckboxGroup
                                          legendText={item.label}
                                          name={`checkbox-group-${selectedFieldProps?.id}`}
                                          onChange={(e) => handleCheckboxGroupChange(e, item.propsName)}
                                        >
                                          {item?.options.length > 0 &&
                                            item?.options.map((option, idx) =>
                                              option?.value ? (
                                                <Checkbox
                                                  id={selectedFieldProps?.id + idx}
                                                  labelText={option.label}
                                                  value={option.value}
                                                  checked={selectedCheckboxValues.includes(option.value)}
                                                />
                                              ) : null
                                            )}
                                        </CheckboxGroup>
                                      </div>
                                    )}
                                    {/* DropDown */}
                                    {item.type === DROPDOWN && (
                                      <Column lg={item.size.col ? item.size.col : 16}>
                                        <Select
                                          className="right-palette-form-item"
                                          id={String(selectedFieldProps.id)}
                                          labelText={item.label}
                                          onChange={(e) => handleSchemaChanges(selectedFieldProps?.id, key, item.propsName, e.target.value, selectedFieldProps?.currentPathDetail)}
                                          defaultValue={item.value}
                                          value={item.value}
                                        >
                                          {item.options.map((fieldName, index) => {
                                            return <SelectItem key={index} value={fieldName.value} text={fieldName.label} />;
                                          })}
                                        </Select>
                                        {/* <Dropdown
                                          id={item.propsName}
                                          items={item.options}
                                          selectedItem={item.value}
                                          titleText={item.label}
                                          onChange={({ selectedItem }) =>
                                            handleSchemaChanges(selectedFieldProps?.id, key, item.propsName, selectedItem, selectedFieldProps?.currentPathDetail)
                                          }
                                        /> */}
                                      </Column>
                                    )}
                                    {/* File Uploader */}
                                    {item.type === FILE_UPLOAD && (
                                      <Column lg={item.size.col ? item.size.col : 16}>
                                        <div className="right-palette-form-item">
                                          {file == undefined ? (
                                            <div className="attachment-btn">
                                              <Button size="md" onClick={() => onOpenFiles(key, item.propsName, selectedFieldProps, item.documentCategory)}> Select </Button>
                                            </div>
                                          ) : (
                                            <FileUploaderItem
                                              errorBody={`500kb max file size. Select a new file and try again.`}
                                              errorSubject="File size exceeds limit"
                                              iconDescription="Delete file"
                                              name={file.name}
                                              status="edit"
                                              size={file.filesize}
                                              onDelete={() => onDeleteFile(key, item.propsName, selectedFieldProps)}
                                            />
                                          )}
                                        </div>
                                      </Column>
                                    )}
                                    {/* Date Picker */}
                                    {item.type === 'Date' && (
                                      <Column lg={item.size.col} className="right-palette-form-item">
                                        <DatePicker
                                          datePickerType="single"
                                          onChange={(e) => {
                                            handleSchemaChanges(selectedFieldProps?.id, key, item.propsName, e[0], selectedFieldProps?.currentPathDetail);
                                          }}
                                        >
                                          <DatePickerInput id="date-picker-single" labelText={item?.label} placeholder="mm/dd/yyyy" />
                                        </DatePicker>
                                      </Column>
                                    )}
                                    {/* Table Column */}
                                    {item.propsName === TABLE_COLUMNS && (
                                      <Column lg={16} className="table-col-header">
                                        <span>
                                          <label>Table Column</label>
                                          <Button size="sm" onClick={handleAddHeader} className="add-header">
                                            Add Column
                                          </Button>
                                        </span>
                                        <Accordion>
                                          {tableHeader.map((header, index) => (
                                            <AccordionItem title={`Column-${index + 1}`}>
                                              <TextInput
                                                key={`key-${idx}-${index}`}
                                                id={String(`key-${idx}`)}
                                                className="right-palette-form-item "
                                                labelText={'Key'}
                                                helperText={'Space is not allowed'}
                                                value={header?.key}
                                                onChange={(e) => handleHeaderChange(index, e.target.value.replace(/\s+/g, ''), 'key')}
                                              />
                                              <TextInput
                                                key={`value-${idx}-${index}`}
                                                id={String(`value-${idx}`)}
                                                className="right-palette-form-item "
                                                labelText={'Value'}
                                                value={header?.header}
                                                onChange={(e) => handleHeaderChange(index, e.target.value, 'header')}
                                              />
                                              <Checkbox
                                                key={`sortable-${idx}-${index}`}
                                                id={`sortable-${idx}-${index}`}
                                                labelText="Sortable"
                                                checked={header.sortable}
                                                onChange={(e) => handleHeaderChange(index, !header?.sortable, 'sortable')}
                                              />
                                              <Checkbox
                                                key={`searchable-${idx}-${index}`}
                                                id={`searchable-${idx}-${index}`}
                                                labelText="Searchable"
                                                checked={header.searchable}
                                                onChange={(e) => handleHeaderChange(index, !header?.searchable, 'searchable')}
                                              />
                                              <Button size="sm" className="delete-table-column" onClick={() => handleTableColumn(index)}>
                                                Delete Column
                                              </Button>
                                            </AccordionItem>
                                          ))}
                                        </Accordion>
                                      </Column>
                                    )}
                                    {/* Table Row */}
                                    {item.propsName === TABLE_ROWS && (
                                      <Column lg={16} className="table-row">
                                        <span>
                                          <label>Table Row</label>
                                          <Button size="sm" className="add-row" onClick={() => handleAddRow(tableHeader)}>
                                            Add Row
                                          </Button>
                                        </span>
                                        <Accordion>
                                          {tableRows.map((rowValue, index) => (
                                            <AccordionItem title={`Row-${index}`}>
                                              {tableHeader.map((rowitem, colidex) => {
                                                return (
                                                  <>
                                                    <TextInput
                                                      key={`${rowitem.key}-${idx}-${colidex}`}
                                                      id={String(`${rowitem.key}-${idx}`)}
                                                      className="right-palette-form-item-mapping"
                                                      labelText={rowitem.key}
                                                      value={rowValue[rowitem.key]}
                                                      onChange={(e) => handleRowOpt(index, e.target.value, rowitem.key)}
                                                    />
                                                    <Button
                                                      size="sm"
                                                      className="ctn-mapping-button"
                                                      kind="secondary"
                                                      renderIcon={<div className='vector-btn'><VectorIcon /></div>}
                                                      onClick={() =>
                                                        OpenMappingDialog(selectedFieldProps?.id, key, item.propsName, selectedFieldProps?.currentPathDetail, index, rowitem.key)
                                                      }
                                                    ></Button>
                                                    <br />
                                                  </>
                                                );
                                              })}

                                              {/* <Button size="sm" className="delete-table-column" onClick={()=> handleTableRowdelete(index)}>
                                              Delete Row
                                            </Button> */}
                                            </AccordionItem>
                                          ))}
                                        </Accordion>
                                      </Column>
                                    )}
                                    {/* Add Tab Button */}
                                    {item.propsName === ADD_TAB_BTN && (
                                      <Column lg={item.size.col}>
                                        <Button
                                          onClick={(e) => {
                                            handleSchemaChanges(selectedFieldProps?.id, SUBTAB, '', 1, selectedFieldProps?.currentPathDetail);
                                          }}
                                        >
                                          {item.label}
                                        </Button>
                                      </Column>
                                    )}
                                    {/* Add Column in Group Button */}
                                    {item.propsName === ADD_COLUMN_BTN && (
                                      <Column lg={item.size.col}>
                                        <Button
                                          onClick={(e) => {
                                            handleSchemaChanges(selectedFieldProps?.id, CUSTOM_COLUMN, '', 1, selectedFieldProps?.currentPathDetail);
                                          }}
                                        >
                                          {item.label}
                                        </Button>
                                      </Column>
                                    )}
                                  </>
                                );
                              })}
                            </Grid>
                          )}
                        </span>
                      )
                    );
                  })}
                {/* Static Option Section */}
                {options.length > 0 && (
                  <div className="options-section">
                    <Grid className="optn-label">
                      <Column lg={9}>
                        <label className="cds--label">Choices</label>
                      </Column>
                      <Column className="value-as-label" lg={6}>
                        <Checkbox
                          key={`valueAsLabel`}
                          id={`valueAsLabel`}
                          labelText={
                            <>
                              {'Use Value as Label'}
                              <Tooltip className="min-max-tooltip" align="top-right" label={'Use value as a label'}>
                                <Help />
                              </Tooltip>
                            </>
                          }
                          checked={isValueAsLabel}
                          onChange={(e) => {
                            setIsValueAsLabel(!isValueAsLabel);
                            handleSchemaChanges(selectedFieldProps?.id, 'Basic', 'valueAsLabel', !isValueAsLabel, selectedFieldProps?.currentPathDetail);
                          }}
                        />
                      </Column>
                    </Grid>
                    {selectedRadioValue === 'static' &&
                      options.map((option, index) => {
                        return (
                          <RadioButtonGroup className="value-radio-group" name="radio-button-optn-group">
                            <RadioButton
                              className="value-radio-btn-group"
                              key={`radio-btn-${index}`}
                              // labelText={}
                              value={index}
                              id={`radio-btn-value-${index}`}
                              checked={option?.checked ? true : false}
                            />
                            <Grid>
                              <Column className="radio-col-gap" lg={isValueAsLabel ? 13 : 7}>
                                <TextInput
                                  key={`text-label-${index}`}
                                  className={
                                    isValueAsLabel
                                      ? options.length > 1
                                        ? 'valueasLabel-text-field'
                                        : 'valueasLabel-width-text-field'
                                      : selectedRadioValue === 'dynamic'
                                        ? 'mapping-text-field'
                                        : options.length > 1
                                          ? 'value-label-text-field'
                                          : 'value-label-opt-text-field'
                                  }
                                  id={`option-label-${index}`}
                                  value={option?.value}
                                  placeholder={`Enter value`}
                                  onChange={(e) => handleOptionChange(index, e.target.value, 'value')}
                                />
                                {selectedRadioValue === 'dynamic' && (
                                  <Button
                                    key={`text-map-${index}`}
                                    size="md"
                                    className="ctn-mapping-button"
                                    kind="secondary"
                                    renderIcon={<div className='vector-btn'><VectorIcon /></div>}
                                    onClick={() => OpenMappingDialog(selectedFieldProps?.id, 'Basic', 'mapping', selectedFieldProps?.currentPathDetail)}
                                  ></Button>
                                )}
                              </Column>
                              {!isValueAsLabel && (
                                <Column className="radio-col-gap" lg={7}>
                                  <TextInput
                                    key={`text-value-${index}`}
                                    className={
                                      isValueAsLabel
                                        ? 'valueasLabel-text-field'
                                        : selectedRadioValue === 'dynamic'
                                          ? 'mapping-text-field'
                                          : options.length > 1
                                            ? 'value-label-text-field'
                                            : 'value-label-opt-text-field'
                                    }
                                    id={`option-value-${index}`}
                                    value={option?.label}
                                    placeholder={`Enter label`}
                                    onChange={(e) => handleOptionChange(index, e.target.value, 'label')}
                                  />
                                  {selectedRadioValue === 'dynamic' && (
                                    <Button
                                      key={`text-value-${index}`}
                                      size="md"
                                      className="ctn-mapping-button"
                                      kind="secondary"
                                      renderIcon={<div className='vector-btn'><VectorIcon /></div>}
                                      onClick={() => OpenMappingDialog(selectedFieldProps?.id, 'Basic', 'options', selectedFieldProps?.currentPathDetail)}
                                    ></Button>
                                  )}
                                </Column>
                              )}
                              {/* Check if options length is greater than 1 before displaying delete icon */}
                              <>
                                {options.length > 1 && (
                                  <Column lg={1} className={`right-props-icon valueasLabel-text-field ${selectedRadioValue === 'static' && !isValueAsLabel && 'value-label-icon'}`}>
                                    <span onClick={() => handleDeleteOption(index)}>
                                      <TrashCan className="right-props-icon-color" />
                                    </span>
                                  </Column>
                                )}

                                <Column
                                  lg={1}
                                  className={`right-props-icon ${options.length === 1 && 'right-props-margin-icon'}  right-props-icon-background valueasLabel-text-field ${selectedRadioValue === 'static' && !isValueAsLabel && (options.length > 1 ? 'value-label-icon' : 'value-label-opt-icon')}`}
                                >
                                  <span className="right-props-plus-icon-color" onClick={() => handleAddOption(index)}>
                                    <CarbonPlus size="md" className="carbon-plus-btn"/>
                                  </span>
                                </Column>
                              </>
                            </Grid>
                          </RadioButtonGroup>
                        );
                      })}
                    {/* Dynamic Option Section */}
                    {selectedRadioValue === 'dynamic' && (
                      <Grid className="options-row-input">
                        <Column lg={isValueAsLabel ? 16 : 8}>
                          <div key={0} className="option-input">
                            <TextInput
                              className={isValueAsLabel ? 'mapping-text-field-dynamic' : 'mapping-text-field'}
                              id={`option-${0}`}
                              value={options[0]?.value}
                              placeholder={`Value-${0}`}
                              labelText={'Value Mapping'}
                              onChange={(e) => handleOptionChange(0, e.target.value, 'value')}
                            />
                            <Button
                              size="sm"
                              className="ctn-mapping-button label-mapping-button"
                              kind="secondary"
                              renderIcon={() => <div className='vector-btn'><VectorIcon /></div>}
                              onClick={() => OpenMappingDialog(selectedFieldProps?.id, 'Basic', TABLE_ROWS, selectedFieldProps?.currentPathDetail, 0, 'value')}
                            ></Button>
                          </div>
                        </Column>
                        {!isValueAsLabel && (
                          <Column lg={8}>
                            <div key={0} className="option-input">
                              <TextInput
                                className="mapping-text-field"
                                id={`option-${0}`}
                                value={options[0]?.label}
                                placeholder={`Label-${0}`}
                                labelText={'Label Mapping'}
                                onChange={(e) => handleOptionChange(0, e.target.value, 'label')}
                              />
                              <Button
                                size="md"
                                className="label-mapping-button ctn-mapping-button"
                                kind="secondary"
                                renderIcon={() => <div className='vector-btn'><VectorIcon /></div>}
                                onClick={() => OpenMappingDialog(selectedFieldProps?.id, 'Basic', TABLE_ROWS, selectedFieldProps?.currentPathDetail, 0, 'label')}
                              ></Button>
                            </div>
                          </Column>
                        )}
                        <Column lg={8}>
                          <div key={1} className="option-input">
                            <TextInput
                              className="mapping-text-field"
                              id={`option-${1}`}
                              value={options[1]?.value}
                              placeholder={`Value-${1}`}
                              labelText={'Parent Mapping'}
                              onChange={(e) => handleOptionChange(1, e.target.value, 'value')}
                            />
                            <Button
                              size="md"
                              className="ctn-mapping-button label-mapping-button"
                              kind="secondary"
                              renderIcon={() => <div className='vector-btn'><VectorIcon /></div>}
                              onClick={() => OpenMappingDialog(selectedFieldProps?.id, 'Basic', TABLE_ROWS, selectedFieldProps?.currentPathDetail, 1, 'value')}
                            ></Button>
                          </div>
                        </Column>
                        <Column lg={8}>
                          <div key={1} className="option-input">
                            <TextInput
                              className="mapping-text-field"
                              id={`option-${1}`}
                              value={options[1]?.label}
                              placeholder={`Label-${1}`}
                              labelText={'Default Selection Mapping'}
                              onChange={(e) => handleOptionChange(1, e.target.value, 'label')}
                            />
                            <Button
                              size="md"
                              className="ctn-mapping-button label-mapping-button"
                              kind="secondary"
                              renderIcon={() => <div className='vector-btn'><VectorIcon /></div>}
                              onClick={() => OpenMappingDialog(selectedFieldProps?.id, 'Basic', TABLE_ROWS, selectedFieldProps?.currentPathDetail, 1, 'label')}
                            ></Button>
                          </div>
                        </Column>
                      </Grid>
                    )}
                  </div>
                )}
                {/* Column Size Style  */}
                {componentStyle && componentStyle.length > 0 && (
                  <>
                    {componentStyle.map((styleProps, idx) => {
                      return (
                        <Select id={String(idx)} labelText="Column Size" onChange={handleChange} defaultValue={styleProps.text} value={styleProps.text}>
                          {items.map((item, index) => {
                            return <SelectItem key={index} value={item.text} text={item.text} />;
                          })}
                        </Select>
                      );
                    })}
                    {/* Column Delete  */}
                    {isLastChild(selectedFieldProps?.currentPathDetail.split('-').slice(0, -1), layout) && (
                      <div className="delete-column">
                        <Button
                          kind="danger--tertiary"
                          onClick={(e) => {
                            onFieldDelete(e, selectedFieldProps?.currentPathDetail);
                          }}
                        >
                          Delete Column
                        </Button>
                      </div>
                    )}
                  </>
                )}
                {/* Tab SubTitle  */}
                {(tabSubTitle || tabSubTitle === '') && (
                  <>
                    <TextInput
                      key="TabTitle"
                      id="TabTitle"
                      className="right-palette-form-item"
                      labelText="Tab Title"
                      value={tabSubTitle}
                      onChange={(e) => {
                        handleSchemaChanges(selectedFieldProps?.id, CUSTOM_TITLE, 'tabTitle', e.target.value, selectedFieldProps?.currentPathDetail);
                      }}
                    />
                  </>
                )}
              </TabPanel>
              {/* Advance Properties Field  */}
              <TabPanel className="tab-panel">
                {advanceProps && advanceProps.length > 0 && (
                  <Grid>
                    {advanceProps.map((advncProps, idx) => {
                      return (
                        <>
                          {/* Min - Max validation */}
                          {advncProps.type === 'TextInput' && (
                            <Column className="min-max" lg={advncProps.size.col}>
                              <TextInput
                                key={`${selectedFieldProps?.id}-${idx}`}
                                id={String(`${selectedFieldProps?.id}-${idx}`)}
                                className="right-palette-form-item"
                                labelText={
                                  <>
                                    {advncProps.label}
                                    {advncProps.tooltip && (
                                      <Tooltip className="min-max-tooltip" advanceProps align={advncProps.propsName === "min" ? "top-left" : "top-right"} label={'It is the ' + advncProps.label + ' of use input'}>
                                        <Information />
                                      </Tooltip>
                                    )}
                                  </>
                                }
                                placeholder={advncProps.placeholder}
                                value={advncProps?.value?.value}
                                invalid={advncProps.invalid ? advncProps.invalid : false}
                                invalidText={advncProps.invalidText ? advncProps.invalidText : null}
                                onChange={(e) => {
                                  if (isNaN(e.target.value)) {
                                    e.preventDefault();
                                    handleSchemaChanges(
                                      selectedFieldProps?.id,
                                      'advance',
                                      advncProps.propsName,
                                      { value: e.target.value, message: getValidationMessage(selectedFieldProps?.component?.label, advncProps.propsName, e.target.value) },
                                      selectedFieldProps?.currentPathDetail,
                                      currentTab
                                    );
                                  } else {
                                    handleSchemaChanges(
                                      selectedFieldProps?.id,
                                      'advance',
                                      advncProps.propsName,
                                      { value: e.target.value, message: getValidationMessage(selectedFieldProps?.component?.label, advncProps.propsName, e.target.value) },
                                      selectedFieldProps?.currentPathDetail,
                                      currentTab
                                    );
                                  }
                                }}
                              />
                            </Column>
                          )}
                          {/* File Upload Extension validation */}
                          {advncProps.type === 'TextArea' && (
                            <Column lg={advncProps.size.col}>
                              <div className="tag-area right-palette-form-item">
                                <label className="cds--label">{advncProps.label}</label>
                                <div className={`tags-area ${textAreaBorderColor && 'tags-area-border'}`}>
                                  {advncProps.value.map((extension, index) => {
                                    return (
                                      <Tag className="some-class" type="blue">
                                        <span className="tags-align">
                                          {extension}
                                          <Close
                                            onClick={(e) =>
                                              handleRemoveExtension(selectedFieldProps?.id, 'advance', advncProps.propsName, index, selectedFieldProps?.currentPathDetail)
                                            }
                                          />
                                        </span>
                                      </Tag>
                                    );
                                  })}
                                  <TextArea
                                    key={`${selectedFieldProps?.id}-${idx}`}
                                    id={String(`${selectedFieldProps?.id}-${idx}`)}
                                    className="right-palette-form-item file-upload-textarea"
                                    onFocus={() => setTextAreaBorderColor(true)}
                                    onBlur={() => setTextAreaBorderColor(false)}
                                    rows={1}
                                    value={allowedExtensionValue.trim()}
                                    onChange={(e) => setAllowedExtensionValue(e.target.value)}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') {
                                        handleFileExtensionTag(selectedFieldProps?.id, 'advance', advncProps.propsName, e.target.value, selectedFieldProps?.currentPathDetail);
                                      }
                                    }}
                                  />
                                </div>
                              </div>
                            </Column>
                          )}
                          {/* Regex Validation */}
                          {advncProps.type === OPTIONS && (
                            <>
                              <Column className="regx-opt" lg={advncProps.size.col}>
                                <RadioButtonGroup
                                  legendText={advncProps.label}
                                  name={`radio-group-${selectedFieldProps?.id}`}
                                  valueSelected={advncProps.value.value}
                                  orientation="vertical"
                                  onChange={(e) =>
                                    handleRegexOption(
                                      e,
                                      advncProps?.items,
                                      advncProps.value.message,
                                      selectedFieldProps?.id,
                                      advncProps.propsName,
                                      selectedFieldProps?.currentPathDetail
                                    )
                                  }
                                >
                                  {advncProps?.items.map((item, index) => {
                                    return <RadioButton key={index} labelText={item.label} value={item.value} />;
                                  })}
                                </RadioButtonGroup>
                              </Column>
                              {/* <Column lg={advncProps.size.col}>
                                <Select
                                  className="regex-types right-palette-form-item"
                                  id={String(selectedFieldProps.id)}
                                  labelText={advncProps.label}
                                  onChange={(e) =>
                                    handleRegexOption(
                                      e,
                                      advncProps?.items,
                                      advncProps.value.message,
                                      selectedFieldProps?.id,
                                      advncProps.propsName,
                                      selectedFieldProps?.currentPathDetail
                                    )
                                  }
                                  defaultValue={advncProps.value.value}
                                  value={advncProps.value.value}
                                >
                                  {advncProps?.items.map((item, index) => {
                                    return <SelectItem key={index} value={item.value} text={item.label} />;
                                  })}
                                </Select>
                              </Column> */}
                              {/* Custom Regex Validation */}
                              {(advncProps?.value?.customRegex || advncProps?.value?.customRegex === '') && (
                                <Column lg={16}>
                                  <TextInput
                                    key={`customregex-${idx}`}
                                    id={`customregex-${String(idx)}`}
                                    className="right-palette-form-item"
                                    labelText={'Custom Regex'}
                                    value={advncProps.value.customRegex}
                                    onChange={(e) => {
                                      if (isNaN(e.target.value)) {
                                        e.preventDefault();
                                        handleSchemaChanges(
                                          selectedFieldProps?.id,
                                          'advance',
                                          advncProps.propsName,
                                          { pattern: advncProps.value.pattern, value: advncProps.value.value, customRegex: e.target.value, message: advncProps.value.message },
                                          selectedFieldProps?.currentPathDetail,
                                          currentTab
                                        );
                                      } else {
                                        handleSchemaChanges(
                                          selectedFieldProps?.id,
                                          'advance',
                                          advncProps.propsName,
                                          { pattern: advncProps.value.pattern, value: advncProps.value.value, customRegex: e.target.value, message: advncProps.value.message },
                                          selectedFieldProps?.currentPathDetail,
                                          currentTab
                                        );
                                      }
                                    }}
                                  />
                                </Column>
                              )}
                              {/* Default Regex Error Message */}
                              <Column lg={advncProps.size.col}>
                                <TextInput
                                  key={`${idx}-'message'`}
                                  id={String(`${idx}-message`)}
                                  className="right-palette-form-item"
                                  labelText={advncProps?.value?.customRegex !== '' ? 'Default Error Message' : 'Custom Error Message'}
                                  value={advncProps.value.message}
                                  onChange={(e) => {
                                    if (isNaN(e.target.value)) {
                                      e.preventDefault();
                                      advncProps.type === OPTIONS
                                        ? handleSchemaChanges(
                                          selectedFieldProps?.id,
                                          'advance',
                                          advncProps.propsName,
                                          { ...advncProps.value, message: getValidationMessage(selectedFieldProps?.component?.label, advncProps.propsName, e.target.value) },
                                          selectedFieldProps?.currentPathDetail,
                                          currentTab
                                        )
                                        : handleSchemaChanges(
                                          selectedFieldProps?.id,
                                          'advance',
                                          advncProps.propsName,
                                          {
                                            value: advncProps.value.value,
                                            message: getValidationMessage(selectedFieldProps?.component?.label, advncProps.propsName, e.target.value)
                                          },
                                          selectedFieldProps?.currentPathDetail,
                                          currentTab
                                        );
                                    } else {
                                      advncProps.type === OPTIONS
                                        ? handleSchemaChanges(
                                          selectedFieldProps?.id,
                                          'advance',
                                          advncProps.propsName,
                                          {
                                            pattern: advncProps.value.pattern,
                                            value: advncProps.value.value,
                                            message: getValidationMessage(selectedFieldProps?.component?.label, advncProps.propsName, e.target.value)
                                          },
                                          selectedFieldProps?.currentPathDetail,
                                          currentTab
                                        )
                                        : handleSchemaChanges(
                                          selectedFieldProps?.id,
                                          'advance',
                                          advncProps.propsName,
                                          {
                                            value: advncProps.value.value,
                                            message: getValidationMessage(selectedFieldProps?.component?.label, advncProps.propsName, e.target.value)
                                          },
                                          selectedFieldProps?.currentPathDetail,
                                          currentTab
                                        );
                                    }
                                  }}
                                />
                              </Column>
                            </>
                          )}
                          {/* Min Date and Max Date*/}
                          {advncProps.type === 'Date' && (
                            <Column lg={advncProps.size.col} className="right-palette-form-item">
                              <DatePicker
                                datePickerType="single"
                                onChange={(e) => {
                                  handleSchemaChanges(
                                    selectedFieldProps?.id,
                                    'advance',
                                    advncProps.propsName,
                                    {
                                      value: e[0],
                                      message: ''
                                    },
                                    selectedFieldProps?.currentPathDetail,
                                    currentTab
                                  );
                                }}
                              >
                                <DatePickerInput id="date-picker-single-validation" labelText={advncProps?.label} placeholder="mm/dd/yyyy" />
                              </DatePicker>
                            </Column>
                          )}
                          {/* Required Validation */}
                          {/* {advncProps.type === 'Toggle' && (
                            <Toggle
                              key={idx}
                              id={'toggle-' + String(idx) + '-' + selectedFieldProps?.id}
                              className="right-palette-form-item "
                              labelText={advncProps.label}
                              defaultToggled={Boolean(advncProps.value.value)}
                              toggled={Boolean(advncProps.value.value)}
                              labelA={advncProps?.labelA}
                              labelB={advncProps?.labelB}
                              onClick={(e) =>
                                handleSchemaChanges(
                                  selectedFieldProps?.id,
                                  'advance',
                                  advncProps.propsName,
                                  {
                                    value: !advncProps.value.value,
                                    message: getValidationMessage(selectedFieldProps?.component?.label, advncProps.propsName, !advncProps.value.value)
                                  },
                                  selectedFieldProps?.currentPathDetail
                                )
                              }
                            />
                          )} */}
                        </>
                      );
                    })}
                  </Grid>
                )}
              </TabPanel>
              {/* <TabPanel className="tab-panel">Conditional Props</TabPanel> */}
            </TabPanels>
          </Tabs>
        </>
      )}
    </div>
  );
}

function getValidationMessage(label, propertiesName, value) {
  switch (propertiesName) {
    case 'isRequired':
      return 'This is a required field';
    case 'min':
      return label + ' must be at least ' + value + ' characters';
    case 'max':
      return label + ' must be no longer than ' + value + ' characters';
    case 'regexValidation':
      return value;
    default:
      return 'regexValidation';
  }
}
