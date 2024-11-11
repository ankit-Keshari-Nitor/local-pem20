import React, { useEffect, useState, useRef } from 'react';
import Shell from '@b2bi/shell';

import { Modal, Tabs, TabList, Tab, TabPanels, TabPanel, TextInput, Button, TextArea, Column, Grid, Layer } from '@carbon/react';

import './api-node-definition-form.scss';
import useTaskStore from '../../store';
import ConditionalBuilder from '../condition-builder';
import { INITIAL_QUERY, queryValidation } from '../../constants';
import APINodePropertyForm from './api-node-property-form';

export default function APINodeDefinitionForm({
  id,
  selectedNode,
  selectedTaskNode = null,
  schema,
  readOnly,
  setOpenPropertiesBlock,
  setNotificationProps,
  getApiConfiguration,
  activityDefinitionData
}) {
  const pageUtil = Shell.PageUtil();
  const queryValidator = useRef({});
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
      url1: selectedNode.data?.api?.url.split('/')[1] || '',
      url: selectedNode.data?.api?.url.split('/')[0] || '',
      requestMethod: selectedNode.data?.api?.method || '',
      inputOutputFormats: selectedNode.data?.api?.requestContentType || '',
      escapeRequest: selectedNode.data?.api?.escapeRequest || false,
      request: selectedNode.data?.api?.request || '',
      response: selectedNode.data?.api?.sampleResponse || '',
      testMode: selectedNode.data?.api?.testMode || true
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

  const [apiConfigData, setApiConfigData] = useState([]);
  const [apiConfigUrl, setApiConfigUrl] = useState('');

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
        url: selectedNode.data?.api?.url.split('/', 4)[3] || '',
        requestMethod: selectedNode.data?.api?.method || '',
        inputOutputFormats: selectedNode.data?.api?.requestContentType || '',
        escapeRequest: selectedNode.data?.api?.escapeRequest || false,
        request: selectedNode.data?.api?.request || '',
        response: selectedNode.data?.api?.sampleResponse || '',
        testMode: selectedNode.data?.api?.testMode || true
      }
    });
    setApiConfigUrl(selectedNode.data?.api?.url.split('/', 3).join('/') || '');
    if (selectedNode.data?.api?.requestHeaders) {
      try {
        const headersArray = JSON.parse(selectedNode.data.api.requestHeaders);

        const parsedHeaders = headersArray.map((header) => ({
          id: Date.now() + Math.random(),
          name: Object.keys(header)[0],
          value: Object.values(header)[0]
        }));
        setHeaders(parsedHeaders);
      } catch (error) {
        console.error('Failed to parse requestHeaders JSON', error);
      }
    } else {
      setHeaders([]);
    }
    if (selectedNode.data?.api?.file && selectedNode.data?.api?.file !== 'null' && selectedNode.data?.api?.file !== '') {
      setFile(JSON.parse(selectedNode.data?.api?.file));
    } else {
      setFile();
    }
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
        [name]: type === 'checkbox' ? checked : type === 'select-one' ? e.target.selectedOptions[0].value : value
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

    // Update apiConfigUrl based on the selected apiConfig
    if (name === 'apiConfig' && value) {
      const selectedConfig = apiConfigData.find((config) => config.apiConfigurationKey === value);
      let url = selectedConfig ? `${selectedConfig?.protocol}://${selectedConfig?.host}:${selectedConfig?.port}` : '';
      setApiConfigUrl(url); // Assuming 'url' is the property you want to map
    } else if (name === 'apiConfig' && !value) {
      setApiConfigUrl('');
    }
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
    pageUtil.showPageModal('FILE_ATTACHMENT.ACTIVITY').then((modalData) => {
      if (modalData.actionType === 'submit') {
        setFile({
          status: 'edit',
          iconDescription: 'Delete Icon',
          invalid: true,
          errorSubject: 'InValid ',
          name: modalData?.data?.data?.documentName,
          filesize: modalData?.data?.data?.contentLength || modalData?.data?.data?.uploadFile?.addedFiles[0]?.size
        });
      } else {
        setFile();
      }
    });
  };

  // Function to save the api node form data
  const handleSaveForm = (e) => {
    e.preventDefault();
    queryValidator.current = queryValidation(query, {});
    // Validate before saving
    if (!validateForms() || !validateHeaders() || Object.keys(queryValidator.current).length !== 0) {
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

    editDialog(selectedNode, selectedTaskNode, 'editableProps', defineForm); // Define Form

    // Save Property Form Data
    const apiConfiguration = {
      hostPrefix: propertyFormData.hostPrefix,
      escapeRequest: propertyFormData.escapeRequest,
      testMode: propertyFormData.testMode,
      url: apiConfigUrl + '/' + propertyFormData.url,
      apiConfiguration: propertyFormData.apiConfig,
      requestContentType: propertyFormData.inputOutputFormats,
      responseContentType: propertyFormData.inputOutputFormats,
      method: propertyFormData.requestMethod,
      file: file ? JSON.stringify(file) : '',
      requestHeaders: headers.length > 0 ? JSON.stringify(headers.map((header) => ({ [header.name]: header.value }))) : JSON.stringify([]),
      request: propertyFormData.request,
      sampleResponse: propertyFormData.response
    };
    editDialog(selectedNode, selectedTaskNode, 'api', apiConfiguration); // Property Form

    editDialog(selectedNode, selectedTaskNode, 'exitValidationQuery', query); //Exit Validation Form

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

  const handleTabChange = async (index) => {
    if (index.selectedIndex === 1) {
      setApiConfigData(await getApiConfiguration());
    }
  };

  const OpenMappingDialog = (fieldName, index) => {
    try {
      pageUtil
        .showPageModal('CONTEXT_DATA_MAPPING.SELECT', {
          data: JSON.parse(activityDefinitionData.definition?.contextData ? activityDefinitionData.definition.contextData : activityDefinitionData?.version?.contextData)
        })
        .then((modalData) => {
          if (fieldName !== 'name' && fieldName !== 'value') {
            const newData = modalData.data.data;
            setFormState((prev) => ({
              ...prev,
              propertyForm: {
                ...prev.propertyForm,
                [fieldName]: fieldName === 'url'
                  ? `${prev.propertyForm[fieldName] ? prev.propertyForm[fieldName] + ',' : ''}${newData}`
                  : newData
              }
            }));
          } else {
            const newData = modalData.data.data;
            const updatedHeaders = headers.map((header, i) => {
              if (i === index) {
                return { ...header, [fieldName]: newData };
              }
              return header;
            });
            setHeaders(updatedHeaders);
          }
        });
    } catch (e) {
      console.log('Error--', e);
    }
  };

  return (
    <div>
      <Tabs onChange={handleTabChange}>
        <TabList aria-label="List of tabs" contained>
          <Tab>Define</Tab>
          <Tab>Properties</Tab>
          <Tab>Exit Validation</Tab>
        </TabList>
        <TabPanels>
          {/* Define Form */}
          <TabPanel>
            <Layer>
              <Layer>
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
                </Grid>
              </Layer>
            </Layer>
          </TabPanel>
          {/* Properties */}
          <TabPanel>
            <Layer>
              <Layer>
                <APINodePropertyForm
                  readOnly={readOnly}
                  errors={errors}
                  formState={formState}
                  apiConfigData={apiConfigData}
                  apiConfigUrl={apiConfigUrl}
                  toggleHeaders={toggleHeaders}
                  showHeaders={showHeaders}
                  headerError={headerError}
                  showCode={showCode}
                  showCodeHandle={showCodeHandle}
                  file={file}
                  onOpenFiles={onOpenFiles}
                  onDeleteFile={onDeleteFile}
                  selectedHeaders={selectedHeaders}
                  handleAddHeader={handleAddHeader}
                  headers={headers}
                  handleRowSelect={handleRowSelect}
                  handleSelectAll={handleSelectAll}
                  handleRemoveSelected={handleRemoveSelected}
                  handleHeaderInputChange={handleHeaderInputChange}
                  handleSaveForm={handleSaveForm}
                  setOpenContextMappingModal={setOpenContextMappingModal}
                  openCancelDialog={openCancelDialog}
                  openContextMappingModal={openContextMappingModal}
                  handlePropertyFormChange={handlePropertyFormChange}
                  OpenMappingDialog={OpenMappingDialog}
                  setApiConfigUrl={setApiConfigUrl}
                />
              </Layer>
            </Layer>
          </TabPanel>
          {/* Exit Validation Form */}
          <TabPanel>
            <Layer>
              <Layer>
                <ConditionalBuilder
                  setOpenCancelDialog={onCancelDefinitionForm}
                  readOnly={readOnly}
                  query={query}
                  setQuery={setQuery}
                  errorMessage={errorMessage}
                  setErrorMessage={setErrorMessage}
                  queryValidator={queryValidator.current}
                  activityDefinitionData={activityDefinitionData}
                />
              </Layer>
            </Layer>
          </TabPanel>
          <Grid fullWidth className="button-container-container">
            <Column lg={16} className="buttons-containers btn-containers">
              <Button onClick={() => setOpenCancelDialog(true)} kind="secondary" data-testid="cancel" name="cancel" type="button" className="button" disabled={readOnly}>
                Cancel
              </Button>
              <Button onClick={handleSaveForm} data-testid="save" color="primary" variant="contained" type="button" className="button" disabled={readOnly}>
                Save
              </Button>
            </Column>
          </Grid>
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
