import React, { useEffect, useState } from 'react';
import Shell from '@b2bi/shell';

import { Modal, Tabs, TabList, Tab, TabPanels, TabPanel, TextInput, Checkbox, Button, TableContainer, Table, Select, SelectItem, FileUploaderItem, TextArea, TableHead, TableRow, TableHeader, TableBody, TableCell, TableSelectRow, Column, Grid } from '@carbon/react';

import './api-node-definition-form.scss';
import useTaskStore from '../../store';
import { VectorIcon } from '../../icons';
import ConditionalBuilder from '../condition-builder';
import { INITIAL_QUERY, NODE_TYPE } from '../../constants';
import { requestMethods, inputOutputFormats, apiConfig } from '../../constants';

export default function APINodeDefinitionForm({ id, selectedNode, selectedTaskNode = null, schema, readOnly, setOpenPropertiesBlock, setNotificationProps }) {

  const pageUtil = Shell.PageUtil();
  const [query, setQuery] = useState(INITIAL_QUERY);
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState(selectedNode?.data?.exitValidationMessage);
  const editDialog = useTaskStore((state) => state.editDialogNodePros);

  // Initialize form states
  const [formState, setFormState] = useState({
    defineForm: {
      name: selectedNode.data?.editableProps?.name || selectedNode.data.id,
      description: selectedNode.data?.editableProps?.description || ''
    },
    propertyForm: {
      apiConfig: selectedNode.data?.api?.apiConfiguration || '',
      hostPrefix: selectedNode.data?.api?.hostPrefix || true,
      url: selectedNode.data?.api?.url || '',
      requestMethod: selectedNode.data?.api?.method || '',
      inputOutputFormats: selectedNode.data?.api?.requestContentType || '',
      escapeRequest: selectedNode.data?.api?.escapeRequest || false,
      request: selectedNode.data?.api?.request || '',
      response: selectedNode.data?.api?.sampleResponse || '',
      testMode: selectedNode.data?.api?.testMode || true,
    }
  });

  // New state for validation errors
  const [errors, setErrors] = useState({ defineForm: {}, propertyForm: {} });

  //Properties Tab variables
  const [showHeaders, setShowHeaders] = useState(false);
  const [headers, setHeaders] = useState([]);
  const [selectedHeaders, setSelectedHeaders] = useState([]);
  const [headerError, setHeaderError] = useState('');
  const [file, setFile] = useState();
  const [showCode, setShowCode] = useState(true);
  const [openContextMappingModal, setOpenContextMappingModal] = useState(false);

  useEffect(() => {

    setQuery(selectedNode?.data?.exitValidationQuery);
    setErrorMessage(selectedNode?.data?.exitValidationMessage);
    setErrors({ defineForm: {}, propertyForm: {} });
    setFormState({
      defineForm: {
        name: selectedNode.data?.editableProps?.name || selectedNode.data.id,
        description: selectedNode.data?.editableProps?.description || ''
      },
      propertyForm: {
        apiConfig: selectedNode.data?.api?.apiConfiguration || '',
        hostPrefix: selectedNode.data?.api?.hostPrefix || true,
        url: selectedNode.data?.api?.url || '',
        requestMethod: selectedNode.data?.api?.method || '',
        inputOutputFormats: selectedNode.data?.api?.requestContentType || '',
        escapeRequest: selectedNode.data?.api?.escapeRequest || false,
        request: selectedNode.data?.api?.request || '',
        response: selectedNode.data?.api?.sampleResponse || '',
        testMode: selectedNode.data?.api?.testMode || true,
      }
    });
    if (selectedNode.data?.api?.requestHeaders && Object.entries(selectedNode.data?.api?.requestHeaders).length > 0) {
      try {
        const headersJson = JSON.parse(selectedNode?.data?.api?.requestHeaders);
        setHeaders(Object.entries(headersJson).map(([name, value]) => ({ id: Date.now() + Math.random(), name, value })));
      } catch (error) {
        console.error('Failed to parse requestHeaders JSON', error);
      }
    } else {
      setHeaders([]);
    }
    if (selectedNode.data?.api?.file && selectedNode.data?.api?.file !== 'null' && selectedNode.data?.api?.file !== '') {
      setFile(JSON.parse(selectedNode.data?.api?.file))
    } else { setFile() }
  }, [selectedNode]);

  // Handle Define Form changes
  const handleDefineFormChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      defineForm: {
        ...prev.defineForm,
        [name]: value
      }
    }));
    // Validate the specific field and update errors
    let error = '';

    if (name === 'name' && !value) {
      error = 'Name is required';
    }

    // Update the error state for the specific field in defineForm
    setErrors((prevErrors) => ({
      ...prevErrors,
      defineForm: {
        ...prevErrors.defineForm,
        [name]: error
      }
    }));
  };

  // Handle Property Form changes
  const handlePropertyFormChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormState((prev) => ({
      ...prev,
      propertyForm: {
        ...prev.propertyForm,
        [name]: type === 'checkbox' ? checked : type === 'select-one' ? e.target.selectedOptions[0].label : value
      }
    }));

    // Validate the specific field and update errors
    let error = '';
    if (name === 'apiConfig' && !value) {
      error = 'API Configuration is required';
    } else if (name === 'url' && !value) {
      error = 'URL is required';
    } else if (name === 'requestMethod' && !value) {
      error = 'Request Method is required';
    } else if (name === 'inputOutputFormats' && !value) {
      error = 'Input Output Format is required';
    }

    // Update the error state for the specific field
    setErrors((prevErrors) => ({
      ...prevErrors,
      propertyForm: {
        ...prevErrors.propertyForm,
        [name]: error
      }
    }));
  };

  // Handle changes to Property Form - Header
  const handleHeaderInputChange = (index, field, value) => {
    const updatedHeaders = headers.map((header, i) => {
      if (i === index) {
        return { ...header, [field]: value };
      }
      return header;
    });
    setHeaders(updatedHeaders);
  };

  // Validate forms
  const validateForms = () => {
    const defineErrors = {};
    const propertyErrors = {};

    // Validate Define Form
    if (!formState.defineForm.name) {
      defineErrors.name = 'Name is required';
    }

    // Validate Property Form
    if (!formState.propertyForm.apiConfig) {
      propertyErrors.apiConfig = 'API Configuration is required';
    }
    if (!formState.propertyForm.url) {
      propertyErrors.url = 'URL is required';
    }
    if (!formState.propertyForm.requestMethod) {
      propertyErrors.requestMethod = 'Request Method is required';
    }
    if (!formState.propertyForm.inputOutputFormats) {
      propertyErrors.inputOutputFormats = 'Input Output Format is required';
    }

    // Update errors state
    setErrors({
      defineForm: defineErrors,
      propertyForm: propertyErrors
    });

    // Return true if no errors, false otherwise
    return Object.keys(defineErrors).length === 0 && Object.keys(propertyErrors).length === 0;
  };

  const showCodeHandle = () => {
    setShowCode((prev) => !prev);
  };

  // ------------------------------------  Headers related functions ----------------------------------------------
  const validateHeaders = () => {
    let nameError = '';
    let valueError = '';
    let duplicateError = '';

    // Check if there are any rows with a non-empty name but empty value
    const hasEmptyValue = headers.some((header) => header.name && !header.value);
    if (hasEmptyValue) {
      valueError = 'You must supply a Value for entered name.';
    }

    // Check if there are any rows with a non-empty value but empty name
    const hasEmptyName = headers.some((header) => header.value && !header.name);
    if (hasEmptyName) {
      nameError = 'You must supply a Name for entered value.';
    }
    // Check for duplicate names
    const namesSet = new Set();
    let hasDuplicates = false;

    for (const header of headers) {
      const name = header.name;
      if (name) {
        if (namesSet.has(name)) {
          hasDuplicates = true;
          break; // No need to check further if a duplicate is found
        }
        namesSet.add(name);
      }
    }

    if (hasDuplicates) {
      duplicateError = 'Duplicate header name.';
    }

    // Combine all error messages
    const allErrors = [nameError, valueError, duplicateError].filter(Boolean).join(' ');

    if (allErrors) {
      setHeaderError(allErrors);
      return false; // Validation failed
    }

    setHeaderError('');
    return true; // Validation passed
  };

  const toggleHeaders = () => {
    // Validate before toggling
    if (!validateHeaders()) {
      return; // Prevent toggling if validation fails
    }
    const filteredHeaders = headers.filter((header) => header.name.trim() !== '' && header.value.trim() !== '');
    setHeaders(filteredHeaders);
    setSelectedHeaders((prevSelected) => prevSelected.filter((id) => filteredHeaders.some((header) => header.id === id)));
    setShowHeaders(!showHeaders);
  };

  const handleAddHeader = () => {
    setHeaders([...headers, { id: Date.now(), name: '', value: '' }]);
  };

  const handleRowSelect = (rowId) => {
    setSelectedHeaders((prevSelected) => (prevSelected.includes(rowId) ? prevSelected.filter((id) => id !== rowId) : [...prevSelected, rowId]));
  };

  const handleSelectAll = (checked) => {
    setSelectedHeaders(checked ? headers.map((header) => header.id) : []);
  };

  const handleRemoveSelected = () => {
    setHeaders(headers.filter((header) => !selectedHeaders.includes(header.id)));
    setSelectedHeaders([]); // Reset the selection after removal
  };

  // ------------------------------------  files  related functions ----------------------------------------------
  const onDeleteFile = function () {
    setFile();
  };

  const onOpenFiles = () => {
    pageUtil.showPageModal('FILE_ATTACHMENT.VIEW').then((modalData) => {
      if (modalData.actionType === 'submit') {
        setFile({
          status: 'edit',
          iconDescription: 'Delete Icon',
          invalid: true,
          errorSubject: 'InValid ',
          name: modalData?.data?.data?.documentName,
          filesize: modalData?.data?.data?.contentLength,
        })
      } else {
        setFile();
      }
    });
  }

  const onSubmitExitValidationForm = (modifiedQuery, errorMessage) => {
    if (selectedNode.type === NODE_TYPE.API) {
      editDialog(selectedNode, selectedTaskNode, 'exitValidationQuery', query);
      editDialog(selectedNode, selectedTaskNode, 'validateExitValidationQuery', modifiedQuery);
      editDialog(selectedNode, selectedTaskNode, 'exitValidationMessage', errorMessage);
    }
    setNotificationProps({
      open: true,
      title: 'Success',
      subtitle: `${selectedNode?.data?.editableProps?.name ? selectedNode?.data?.editableProps?.name : selectedNode.data.id} Exit Validations saved successfully!`,
      kind: 'success',
      onCloseButtonClick: () => setNotificationProps(null)
    });
  };

  // Function to save the api node form data
  const handleSaveForm = (e) => {
    e.preventDefault();

    // Validate before saving
    if (!validateForms() || !validateHeaders()) {
      setNotificationProps({
        open: true,
        title: 'Error',
        subtitle: `There are some validation errors in the form. Please review and correct them before submitting.`,
        kind: 'error',
        onCloseButtonClick: () => setNotificationProps(null)
      });
      return; // Prevent saving if validation fails
    }

    // Collect data from both forms
    const defineFormData = formState.defineForm;
    const propertyFormData = formState.propertyForm;

    // Save Define Form Data
    const defineForm = {
      name: defineFormData.name,
      description: defineFormData.description
    };
    editDialog(selectedNode, selectedTaskNode, 'editableProps', defineForm);
    // Save Property Form Data
    const apiConfiguration = {
      hostPrefix: propertyFormData.hostPrefix,
      escapeRequest: propertyFormData.escapeRequest,
      testMode: propertyFormData.testMode,
      url: propertyFormData.url,
      apiConfiguration: propertyFormData.apiConfig,
      requestContentType: propertyFormData.inputOutputFormats,
      responseContentType: propertyFormData.inputOutputFormats,
      method: propertyFormData.requestMethod,
      file: file ? JSON.stringify(file) : '',
      requestHeaders: headers.length > 0 ? JSON.stringify(
        headers.reduce((acc, header) => {
          if (header.name && header.value) {
            acc[header.name] = header.value;
          }
          return acc;
        }, {})
      ) : {},
      request: propertyFormData.request,
      sampleResponse: propertyFormData.response
    };
    editDialog(selectedNode, selectedTaskNode, 'api', apiConfiguration);

    setNotificationProps({
      open: true,
      title: 'Success',
      subtitle: `${defineForm?.name} details saved successfully!`,
      kind: 'success',
      onCloseButtonClick: () => setNotificationProps(null)
    });
    // Close the properties block
    setOpenPropertiesBlock(false);
  };

  const onCancelDefinitionForm = () => {
    setOpenCancelDialog(true);
  };

  return (
    <div>
      <Tabs>
        <TabList aria-label="List of tabs" contained>
          <Tab>Define</Tab>
          <Tab>Properties</Tab>
          <Tab>Exit Validation</Tab>
        </TabList>
        <TabPanels>
          {/* Define Form */}
          <TabPanel>
            <form>
              <Grid className="tab-panel-grid">
                {/* Name */}
                <Column lg={16}>
                  <TextInput
                    id="name"
                    disabled={readOnly}
                    name="name"
                    value={formState.defineForm.name}
                    onChange={handleDefineFormChange}
                    labelText="Name (required)"
                    invalid={!!errors.defineForm.name}
                    invalidText={errors.defineForm.name}
                  ></TextInput>
                </Column>
                {/* Description */}
                <Column lg={16}>
                  <TextArea
                    id="description"
                    disabled={readOnly}
                    name="description"
                    value={formState.defineForm.description}
                    onChange={handleDefineFormChange}
                    labelText="Description"
                  ></TextArea>
                </Column>
                {/* Cancel and Save Button */}
                <Column lg={16} className="buttons-containers btn-containers">
                  <Button onClick={() => setOpenCancelDialog(true)} kind="secondary" data-testid="cancel" name="cancel" type="button" className="button" disabled={readOnly}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveForm} data-testid="save" color="primary" variant="contained" type="button" className="button" disabled={readOnly}>
                    Save
                  </Button>
                </Column>
              </Grid>
            </form>
          </TabPanel>
          {/* Properties */}
          <TabPanel>
            <form>
              <Grid className="tab-panel-grid">
                {/* API Configuration */}
                <Column lg={8}>
                  <Select
                    disabled={readOnly}
                    id="apiConfig"
                    name="apiConfig"
                    labelText="API Configuration (required)"
                    defaultValue={formState.propertyForm.apiConfig}
                    invalid={!!errors.propertyForm.apiConfig}
                    invalidText={errors.propertyForm.apiConfig}
                    onChange={handlePropertyFormChange}
                  >
                    {apiConfig?.map((method) => (
                      <SelectItem key={method.value} value={method.value} text={method.label} />
                    ))}
                  </Select>
                </Column>
                <Column lg={2}>
                  <Button
                    onClick={() => {
                      setOpenContextMappingModal(true);
                    }}
                    className="context-mapping-btn-api-node"
                    kind="tertiary"
                    renderIcon={VectorIcon}
                    size="sm"
                    hasIconOnly
                    disabled={readOnly}
                    iconDescription="Context Mapping"
                    tooltipAlignment="center"
                  />
                </Column>
                {/* Host Prefix */}
                <Column lg={6}>
                  <div className="tab-panel-checkbox">
                    <Checkbox
                      disabled={readOnly}
                      id="hostPrefix"
                      name="hostPrefix"
                      labelText="Host Prefix"
                      checked={formState.propertyForm.hostPrefix}
                      onChange={handlePropertyFormChange}
                    />
                  </div>
                </Column>
                {/* URL */}
                <Column lg={15}>
                  <TextInput
                    disabled={readOnly}
                    invalid={!!errors.propertyForm.url}
                    invalidText={errors.propertyForm.url}
                    value={formState.propertyForm.url}
                    name="url"
                    onChange={handlePropertyFormChange}
                    id="url"
                    labelText="URL (required)"
                  />
                </Column>
                <Column lg={1}>
                  <Button
                    onClick={() => {
                      setOpenContextMappingModal(true);
                    }}
                    className="context-mapping-btn-api-node"
                    kind="tertiary"
                    renderIcon={VectorIcon}
                    size="sm"
                    disabled={readOnly}
                    hasIconOnly
                    iconDescription="Context Mapping"
                    tooltipAlignment="center"
                  />
                </Column>
                {/* Request Method */}
                <Column lg={8}>
                  <Select
                    disabled={readOnly}
                    id="requestMethod"
                    name="requestMethod"
                    labelText="Request Method (required)"
                    defaultValue={formState.propertyForm.requestMethod}
                    invalid={!!errors.propertyForm.requestMethod}
                    invalidText={errors.propertyForm.requestMethod}
                    onChange={handlePropertyFormChange}
                  >
                    {requestMethods.map((method) => (
                      <SelectItem key={method.value} value={method.value} text={method.label} />
                    ))}
                  </Select>
                </Column>
                {/* Header */}
                <Column lg={8}>
                  <div className="cds--label margin-2-rem">Headers</div>
                  <div className="margin-1-rem">
                    <Button kind="ghost" size="small" onClick={toggleHeaders}>
                      {showHeaders ? 'Click to hide edit headers' : 'Click to edit headers'}
                    </Button>
                  </div>
                </Column>
                {headerError && (
                  <Column lg={16}>
                    <div className="error-message">{headerError}</div>
                  </Column>
                )}
                {showHeaders && (
                  <Column lg={16} style={{ marginTop: '0.25rem' }}>
                    <div className="edit-header-container">
                      <TableContainer>
                        <div className="header-container">
                          <h3 className='edit-header'>Edit Header</h3>
                          {!readOnly && (<div className="header-actions">
                            {selectedHeaders.length > 0 && (
                              <Button disabled={readOnly} kind="secondary" onClick={handleRemoveSelected}>
                                Remove
                              </Button>
                            )}
                            <Button disabled={readOnly} kind="primary" onClick={handleAddHeader}>
                              Add
                            </Button>
                          </div>)}
                        </div>
                        <Table>
                          <TableHead>
                            <TableRow>
                              {!readOnly && (<TableHeader>
                                <Checkbox
                                  id="select-all"
                                  labelText=""
                                  checked={headers.length > 0 && selectedHeaders.length === headers.length} // Update checkbox based on selected rows
                                  onChange={(e) => handleSelectAll(e.target.checked)}
                                />
                              </TableHeader>)}
                              <TableHeader>Name</TableHeader>
                              <TableHeader>Value</TableHeader>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {headers.length === 0 ? (
                              <TableRow>
                                <TableCell colSpan={3} style={{ textAlign: 'center' }}>
                                  No data to display
                                </TableCell>
                              </TableRow>
                            ) : (
                              headers.map((header, index) => (
                                <TableRow key={header.id}>
                                  {!readOnly && (<TableSelectRow
                                    disabled={readOnly}
                                    id={`header-select-${header.id}`}
                                    onSelect={() => handleRowSelect(header.id)}
                                    checked={selectedHeaders.includes(header.id)}
                                  />)}
                                  <TableCell>
                                    <TextInput
                                      disabled={readOnly}
                                      id={`header-name-${index}`}
                                      labelText=""
                                      value={header.name}
                                      onChange={(e) => handleHeaderInputChange(index, 'name', e.target.value)}
                                      placeholder="Enter Name"
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <TextInput
                                      disabled={readOnly}
                                      id={`header-value-${index}`}
                                      labelText=""
                                      value={header.value}
                                      onChange={(e) => handleHeaderInputChange(index, 'value', e.target.value)}
                                      placeholder="Enter Value"
                                    />
                                  </TableCell>
                                </TableRow>
                              ))
                            )}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </div>
                  </Column>
                )}
                {/* Input Output Format */}
                <Column lg={8}>
                  <Select
                    disabled={readOnly}
                    id="inputOutputFormats"
                    name="inputOutputFormats"
                    labelText="Input Output Format (required)"
                    invalid={!!errors.propertyForm.inputOutputFormats}
                    invalidText={errors.propertyForm.inputOutputFormats}
                    defaultValue={formState.propertyForm.inputOutputFormats}
                    onChange={handlePropertyFormChange}
                  >
                    {inputOutputFormats.map((method) => (
                      <SelectItem key={method.value} value={method.value} text={method.label} />
                    ))}
                  </Select>
                </Column>
                {/*  Escape Request */}
                <Column lg={8} style={{ marginLeft: '2rem' }}>
                  <div className="tab-panel-checkbox">
                    <Checkbox
                      disabled={readOnly}
                      id="escapeRequest"
                      name="escapeRequest"
                      checked={formState.propertyForm.escapeRequest}
                      onChange={handlePropertyFormChange}
                      labelText="Escape request"
                    />
                  </div>
                </Column>
                {/* Request */}
                <Column lg={15}>
                  <div>
                    <TextArea
                      labelText="Request"
                      rows={3}
                      className="request-wrapper"
                      id="request"
                      name="request"
                      disabled={readOnly}
                      value={formState.propertyForm.request}
                      onChange={handlePropertyFormChange}
                      style={{ maxHeight: '200px', overflowY: `${showCode ? 'hidden' : 'auto'}` }}
                    />
                    <Button size="sm" kind="ghost" disabled={readOnly} onClick={showCodeHandle} className="btn-show-code">
                      {showCode ? 'Show Code' : 'Hide Code'}
                    </Button>
                  </div>
                </Column>
                <Column lg={1} className='context-mapping-btn-api-node-wrapper'>
                  <Button
                    onClick={() => {
                      setOpenContextMappingModal(true);
                    }}
                    className="context-mapping-btn-api-node"
                    kind="tertiary"
                    renderIcon={VectorIcon}
                    size="sm"
                    hasIconOnly
                    iconDescription="Context Mapping"
                    tooltipAlignment="center"
                    disabled={readOnly}
                  />
                </Column>
                {/*  File Attachment*/}
                <Column lg={16} className='file-attachment-wrapper'>
                  <label className="cds--label">File Attachment</label>
                  <Grid condensed>
                    <Column lg={2}>
                      <Button
                        onClick={() => {
                          setOpenContextMappingModal(true);
                        }}
                        className="context-mapping-btn-api-node attachment-mapping-btn"
                        kind="tertiary"
                        renderIcon={VectorIcon}
                        size="sm"
                        hasIconOnly
                        disabled={readOnly}
                        iconDescription="Context Mapping"
                        tooltipAlignment="center"
                      />
                    </Column>
                    <Column lg={14}>
                      {file == undefined ? (
                        <Button disabled={readOnly} className="attachment-btn" onClick={onOpenFiles}> Select from available files or upload new file</Button>
                      ) : (
                        <FileUploaderItem
                          errorBody={`500kb max file size. Select a new file and try again.`}
                          errorSubject="File size exceeds limit"
                          iconDescription="Delete file"
                          name={file.name}
                          status="edit"
                          size={file.filesize}
                          onDelete={onDeleteFile}
                          disabled={readOnly}
                        />
                      )}
                    </Column>
                  </Grid>
                </Column>
                {/* Sample Response */}
                <Column lg={16}>
                  <TextArea
                    value={formState.propertyForm.response}
                    onChange={handlePropertyFormChange}
                    labelText="Sample Response"
                    rows={3}
                    id="response"
                    name="response"
                    disabled={readOnly}
                    style={{ overflowY: 'auto' }}
                  />
                </Column>
                {/* TestMode */}
                <Column lg={16}>
                  <div className="tab-panel-checkbox" style={{ marginBottom: '2rem' }}>
                    <Checkbox id="testMode" labelText="Call in Testmode" checked={formState.propertyForm.testMode} disabled={readOnly} onChange={handlePropertyFormChange} />
                  </div>
                </Column>
                {/* Cancel and Save Button */}
                <Column lg={16} className="buttons-containers btn-containers">
                  <Button onClick={() => setOpenCancelDialog(true)} kind="secondary" data-testid="cancel" name="cancel" type="button" className="button" disabled={readOnly}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveForm} data-testid="save" color="primary" variant="contained" type="button" className="button" disabled={readOnly}>
                    Save
                  </Button>
                </Column>
              </Grid>
            </form>
          </TabPanel>
          {/* Exit Validation Form */}
          <TabPanel>
            <ConditionalBuilder
              setOpenCancelDialog={onCancelDefinitionForm}
              //onSubmitExitValidationForm={onSubmitExitValidationForm}
              queryValidator={{}}
              readOnly={readOnly}
              query={query}
              setQuery={setQuery}
              errorMessage={errorMessage}
              setErrorMessage={setErrorMessage}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
      <Modal
        open={openCancelDialog}
        onRequestClose={() => setOpenCancelDialog(false)}
        isFullWidth
        modalHeading="Confirmation"
        primaryButtonText="Exit"
        secondaryButtonText="Cancel"
      >
        <p
          style={{
            padding: '0px 0px 1rem 1rem'
          }}
        >
          Your changes are not saved. Do you want to exit without saving changes?{' '}
        </p>
      </Modal>
      <Modal
        open={openContextMappingModal}
        onRequestClose={() => {
          setOpenContextMappingModal(false);
        }}
        passiveModal
        modalHeading="Sample Modal"
      >
        Functionality is not Implemented
      </Modal>
    </div>
  );
}
