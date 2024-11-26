import React, { useEffect, useState, useRef } from 'react';
import Shell from '@b2bi/shell';

import { Modal, Tabs, TabList, Tab, TabPanels, TabPanel, TextInput, Button, TextArea, Column, Grid, Layer } from '@carbon/react';

import './xslt-node-definition-form.scss';
import useTaskStore from '../../store';
import ConditionalBuilder from '../condition-builder';
import { INITIAL_QUERY, queryValidation } from '../../constants';
import APINodePropertyForm from './xslt-node-property-form';

export default function XsltNodeDefinitionForm({
  selectedNode,
  selectedTaskNode = null,
  readOnly,
  setOpenPropertiesBlock,
  setNotificationProps,
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
      input: selectedNode.data?.xslt?.input || '',
      xslt: selectedNode.data?.xslt?.xslt || '',
      sampleOutput: selectedNode.data?.xslt?.sampleOutput || '',
      output: selectedNode.data?.xslt?.output || '',
      escapeInput: selectedNode.data?.xslt?.escapeInput || false
    }
  });

  // New state for validation errors
  const [errors, setErrors] = useState({ defineForm: {}, propertyForm: {} });
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
        input: selectedNode.data?.xslt?.input || '',
        xslt: selectedNode.data?.xslt?.xslt || '',
        sampleOutput: selectedNode.data?.xslt?.sampleOutput || '',
        output: selectedNode.data?.xslt?.output || '',
        escapeInput: selectedNode.data?.xslt?.escapeInput || false
      }
    });
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
    if (name === 'input' && !value) {
      error = 'Input is required';
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

  // Context Data Mapping Modal
  const OpenMappingDialog = (fieldName, index) => {
    if (fieldName === 'input') {
      try {
        pageUtil
          .showPageModal('CONTEXT_DATA_MAPPING.SELECT', {
            data: JSON.parse(activityDefinitionData.definition?.contextData ? activityDefinitionData.definition.contextData : activityDefinitionData?.version?.contextData)
          })
          .then((modalData) => {
            const newData = modalData.data.data;
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
      }
    }
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
    if (!formState.propertyForm.input) {
      propertyErrors.input = 'Input is required';
    }

    // Update errors state
    setErrors({
      defineForm: defineErrors,
      propertyForm: propertyErrors
    });

    // Return true if no errors, false otherwise
    return Object.keys(defineErrors).length === 0 && Object.keys(propertyErrors).length === 0;
  };

  // Function to save the xslt node form data
  const handleSaveForm = (e) => {
    e.preventDefault();
    queryValidator.current = queryValidation(query, {});
    // Validate before saving
    if (!validateForms() || Object.keys(queryValidator.current).length !== 0) {
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
      input: propertyFormData.input,
      xslt: propertyFormData.xslt,
      sampleOutput: propertyFormData.sampleOutput,
      output: propertyFormData.output,
      escapeInput: propertyFormData.escapeInput
    };
    editDialog(selectedNode, selectedTaskNode, 'xslt', apiConfiguration); // Property Form

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

  const onCloseModel = () => {
    setOpenCancelDialog(false);
    setOpenPropertiesBlock(false)
  }

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
                  formState={formState}
                  handlePropertyFormChange={handlePropertyFormChange}
                  readOnly={readOnly}
                  errors={errors}
                  openCancelDialog={openCancelDialog}
                  setOpenContextMappingModal={setOpenContextMappingModal}
                  openContextMappingModal={openContextMappingModal}
                  OpenMappingDialog={OpenMappingDialog}
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
