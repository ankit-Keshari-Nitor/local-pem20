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
  getDocumentFile,
  activityDefinitionData
}) {
  const pageUtil = Shell.PageUtil();
  const queryValidator = useRef({});
  const [query, setQuery] = useState(INITIAL_QUERY);
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState(selectedNode?.data?.exitValidationMessage);
  const [responseDisable, setResponseDisable] = useState(readOnly ? readOnly : false)
  const editDialog = useTaskStore((state) => state.editDialogNodePros);

  const store = useTaskStore();
  let storeData = useTaskStore((state) => state.tasks);

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
      request: selectedNode.data?.api?.request || '{}',
      response: selectedNode.data?.api?.sampleResponse || '{}',
      sampleResponse: selectedNode.data?.api?.sampleResponse || '{}',
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
  const [fileKey, setFileKey] = useState('');
  const [fileMap, setFileMap] = useState('');

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
        hostPrefix: selectedNode.data?.api?.hostPrefix === undefined ? true : selectedNode.data?.api?.hostPrefix,
        url: selectedNode.data?.api?.url ? (selectedNode.data?.api?.url.includes('http://') || selectedNode.data?.api?.url.includes('https://') ? selectedNode.data?.api?.url.split('/').length >= 4 ? selectedNode.data?.api?.url.split('/').slice(3).join('/') : '' : selectedNode.data?.api?.url.split('/').length > 1 ? selectedNode.data?.api?.url.split('/').slice(1).join('/') : '') : '',
        requestMethod: selectedNode.data?.api?.method || '',
        inputOutputFormats: selectedNode.data?.api?.requestContentType || '',
        escapeRequest: selectedNode.data?.api?.escapeRequest || false,
        request: selectedNode.data?.api?.request || '',
        response: selectedNode.data?.api?.sampleResponse || '',
        testMode: selectedNode.data?.api?.testMode || true
      }
    });

    if (selectedNode.data?.api?.url.includes('http://') || selectedNode.data?.api?.url.includes('https://')) {
      setApiConfigUrl(selectedNode.data?.api?.url.split('/', 3).join('/'));
    } else {
      setApiConfigUrl(selectedNode.data?.api?.url.split('/').slice(0, 2)[0] || '');
    }

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

    const fetchFileData = async () => {
      if (selectedNode.data?.api?.file !== '' && selectedNode.data?.api?.file) {
        setFileKey(selectedNode.data?.api?.file);
        if (!(/\./.test(selectedNode.data?.api?.file))) {
          try {
            let file = await getDocumentFile(selectedNode.data?.api?.file);
            setFile({
              status: 'edit',
              iconDescription: 'Delete Icon',
              invalid: true,
              errorSubject: 'InValid ',
              name: file.documentName,
              filesize: file.contentLength
            });

          } catch (error) {
            console.error("Error fetching file list:", error);
          }
        } else {
          setFileMap(selectedNode.data?.api?.file);
        }
      } else {
        setFileKey('');
        setFile();
        setFileMap('');
      }
    };

    fetchFileData();  // Call the inner async function
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

    //hostPrefix
    if (name === "hostPrefix" && checked) {
      const selectedConfig = apiConfigData.find((config) => config.apiConfigurationKey === formState.propertyForm.apiConfig);
      let url = selectedConfig ? `${selectedConfig?.protocol}://${selectedConfig?.host}:${selectedConfig?.port}` : '';
      setApiConfigUrl(url);
    } else if (name === "hostPrefix" && !checked) {
      setApiConfigUrl('')
    }

    //  Request Method 
    if (name === "requestMethod" && e.target.selectedOptions[0].value !== "POST" && e.target.selectedOptions[0].value !== "PUT") {
      setResponseDisable(true); // Disable response-related actions
      setFile();
      setFileKey('');
      setFileMap('');
      setFormState((prev) => ({
        ...prev,
        propertyForm: {
          ...prev.propertyForm,
          request: "", // Clear the request field
        }
      }));
    } else if (name === "requestMethod" && e.target.selectedOptions[0].value !== "GET" && e.target.selectedOptions[0].value !== "DELTE") {
      setResponseDisable(false); // Re-enable response if the condition is not met
    }

    //inputOutputFormats
    if (
      name === "inputOutputFormats" &&
      e.target.selectedOptions[0].value === "application/json" &&
      (formState.propertyForm.requestMethod !== "GET" && formState.propertyForm.requestMethod !== "DELETE")
    ) {
      setResponseDisable(false);
      setFormState((prev) => ({
        ...prev,
        propertyForm: {
          ...prev.propertyForm,
          request: "{}",
          sampleResponse: "{}",
          response: "{}"
        }
      }));
    } else if (
      name === "inputOutputFormats" &&
      e.target.selectedOptions[0].value === "application/json" &&
      (formState.propertyForm.requestMethod !== "POST" && formState.propertyForm.requestMethod !== "PUT")
    ) {
      setResponseDisable(true);
      setFile();
      setFileKey('');
      setFileMap('');
      setFormState((prev) => ({
        ...prev,
        propertyForm: {
          ...prev.propertyForm,
          "request": "",
          "sampleResponse": "{}",
          "response": "{}"
        }
      }));
    }

    // Update apiConfigUrl based on the selected apiConfig
    if (name === 'apiConfig' && value && formState.propertyForm.hostPrefix) {
      const selectedConfig = apiConfigData.find((config) => config.apiConfigurationKey === value);
      let url = selectedConfig ? `${selectedConfig?.protocol}://${selectedConfig?.host}:${selectedConfig?.port}` : '';
      setApiConfigUrl(url); // Assuming 'url' is the property you want to map
    } else if (name === 'apiConfig' && !value) {
      setApiConfigUrl('');
    }

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
    const regex = /[&<>."\'{}\\]/;
    const regexDes = /[<>]/;
    const regexUrl = /^(?!.*\/\/)(?!.*\\).*$/;

    // Validate Define Form
    if (!formState.defineForm.name || formState.defineForm.name?.trim().length === 0) {
      defineErrors.name = 'Name is required.';
    }

    if (formState.defineForm.name?.trim().length > 0 && formState?.defineForm.name.trim().length >= 30) {
      defineErrors.name = 'Name must be no longer then 30 characters';
    }

    if (regex.test(formState.defineForm.name.trim())) {
      defineErrors.name = 'Name should not contain &,<,>,",\',.,{,}, characters.';
    }

    if (regexDes.test(formState.defineForm.description?.trim())) {
      defineErrors.description = 'Description should not contain <> characters.';
    }

    // Validate Property Form
    if (!formState.propertyForm.apiConfig) {
      propertyErrors.apiConfig = 'API Configuration is required';
    }
    if (!formState.propertyForm.url) {
      propertyErrors.url = 'URL is required';
    }

    if (!regexUrl.test(formState.propertyForm.url)) {
      propertyErrors.url = 'URL  should not contain /';
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
        if (modalData.actionType === 'submit') {
          setFile({
            status: 'edit',
            iconDescription: 'Delete Icon',
            invalid: true,
            errorSubject: 'InValid ',
            name: modalData?.data?.data?.documentName,
            filesize: modalData?.data?.data?.contentLength || modalData?.data?.data?.uploadFile?.addedFiles[0]?.size
          });
          setFileKey(modalData?.data?.data?.documentKey || modalData?.data?.key?.response);
          setFileMap('');
        } else {
          setFile();
          setFileKey('');
          setFileMap('');
        }
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
      //file: file ? JSON.stringify(file) : '',
      file: fileKey,
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
    let contextData = activityDefinitionData.definition?.contextData ? JSON.parse(activityDefinitionData.definition.contextData) : activityDefinitionData?.version?.contextData ? JSON.parse(activityDefinitionData?.version?.contextData) : {}

    if (fieldName === "apiConfig") {
      if (Object.keys(contextData).length > 0) {
        try {
          pageUtil
            .showPageModal('CONTEXT_DATA_MAPPING.APICONFIG', {
              data: contextData
            })
            .then((modalData) => {
              if (modalData.actionType === 'submit') {
                const newData = modalData.data.data;
                setFormState((prev) => ({
                  ...prev,
                  propertyForm: {
                    ...prev.propertyForm,
                    [fieldName]: newData
                  }
                }));
                // Validate the specific field and update errors
                let error = '';
                if (fieldName === 'apiConfig' && !newData) {
                  error = 'API Configuration is required';
                }
                // Update the error state for the specific field
                setErrors((prevErrors) => ({
                  ...prevErrors,
                  propertyForm: {
                    ...prevErrors.propertyForm,
                    [fieldName]: error
                  }
                }));
              }
            });
        } catch (e) {
          console.log('Error-', e);
        }
      } else {
        return;
      }
    }
    else if (fieldName === "file") {
      if (Object.keys(contextData).length > 0) {
        try {
          pageUtil
            .showPageModal('CONTEXT_DATA_MAPPING.ACTIVITYFILE', {
              data: JSON.parse(activityDefinitionData.definition?.contextData ? activityDefinitionData.definition.contextData : activityDefinitionData?.version?.contextData)
            })
            .then((modalData) => {
              if (modalData.actionType === 'submit') {
                setFileMap(modalData.data.data);
                setFile();
                setFileKey(modalData.data.data)
              }
            });
        } catch (e) {
          console.log('Error-', e);
        }
      } else {
        return;
      }
    } else if (fieldName === "request") {
      if (formState.propertyForm.inputOutputFormats === "application/json") {
        if (formState.propertyForm.request !== "") {
          try {
            // Attempt to parse the request and context data
            const requestData = JSON.parse(formState.propertyForm.request);
            const contextDataMapping = contextData;
            const nodeData = (storeData?.nodes)
            // Check if the parsed request is not an empty object
            if (Object.keys(requestData).length === 0) {
              setErrors({
                propertyForm: {
                  request: 'Invalid JSON',
                }
              })
              return;
            }

            pageUtil
              .showPageModal('CONTEXT_DATA_MAPPING.MAPPING', {
                data: requestData,
                contextData: contextDataMapping,
                nodeData: nodeData
              })
              .then((modalData) => {
                const newData = JSON.stringify(modalData.data.data);
                setFormState((prev) => ({
                  ...prev,
                  propertyForm: {
                    ...prev.propertyForm,
                    [fieldName]: newData
                  }
                }));
              });
          } catch (e) {
            console.log('Error-', e);
            setErrors({
              propertyForm: {
                request: e.message === 'Empty JSON' ? 'Request cannot be an empty JSON' : 'Invalid JSON',
              }
            });
          }
        } else {
          setErrors({
            propertyForm: {
              request: 'Request cannot be empty',
            }
          });
        }
      } else {
        setErrors({
          propertyForm: {
            inputOutputFormats: 'Input Output Format is required',
          }
        });
      }
    } else {
      try {
        pageUtil
          .showPageModal('CONTEXT_DATA_MAPPING.SELECT', {
            data: contextData,
            nodeData: (storeData?.nodes)
          })
          .then((modalData) => {
            if (modalData.actionType === 'submit') {
              if (fieldName !== 'name' && fieldName !== 'value') {
                const newData = modalData.data.data;
                setFormState((prev) => ({
                  ...prev,
                  propertyForm: {
                    ...prev.propertyForm,
                    [fieldName]: fieldName === 'url'
                      ? (newData ? `${prev.propertyForm[fieldName] ? prev.propertyForm[fieldName] : ''}${newData}` : '')
                      : prev.propertyForm[fieldName], // Ensure other fields remain unaffected
                  }
                }));
                // Validate the specific field and update errors
                let error = '';
                if (fieldName === 'url' && !newData) {
                  error = 'URL is required';
                }
                // Update the error state for the specific field
                setErrors((prevErrors) => ({
                  ...prevErrors,
                  propertyForm: {
                    ...prevErrors.propertyForm,
                    [fieldName]: error
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
            }
          });
      } catch (e) {
        console.log('Error-', e);
      }
    }



  };

  const onCloseModel = () => {
    setOpenCancelDialog(false);
    setOpenPropertiesBlock(false)
  }

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
                      invalid={!!errors?.defineForm?.name}
                      invalidText={errors?.defineForm?.name}
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
                      invalid={!!errors?.defineForm?.description}
                      invalidText={errors?.defineForm?.description}
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
                  setOpenContextMappingModal={setOpenContextMappingModal}
                  openCancelDialog={openCancelDialog}
                  openContextMappingModal={openContextMappingModal}
                  handlePropertyFormChange={handlePropertyFormChange}
                  OpenMappingDialog={OpenMappingDialog}
                  setApiConfigUrl={setApiConfigUrl}
                  fileMap={fileMap}
                  responseDisable={responseDisable}
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
        onRequestSubmit={onCloseModel}
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
