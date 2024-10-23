import React, { useEffect, useRef, useState } from 'react';
import { Modal, Tabs, TabList, Tab, TabPanels, TabPanel, Button, Grid, Column } from '@carbon/react';
import FormRenderer from '@data-driven-forms/react-form-renderer/form-renderer';

import './block-definition-form.scss';
import useTaskStore from '../../store';
import { COMPONENT_MAPPER, INITIAL_QUERY, NODE_TYPE, queryValidation } from '../../constants';
import ConditionalBuilder from '../condition-builder';
import { FormSpy } from '@data-driven-forms/react-form-renderer';

export default function BlockDefinitionForm({ id, selectedNode, selectedTaskNode = null, schema, readOnly, setOpenPropertiesBlock, setNotificationProps }) {
  let newSchema = { ...schema };
  newSchema.fields = newSchema.fields.map((item) => ({ ...item, isReadOnly: readOnly, helperText: readOnly ? '' : item.helperText }));
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const editTask = useTaskStore((state) => state.editTaskNodePros);
  const editDialog = useTaskStore((state) => state.editDialogNodePros);
  const formValidator = useRef({});
  const queryValidator = useRef({});
  const formValidationKey = useRef();
  let initialValues = {};
  initialValues.name = selectedNode.data.id;

  const [query, setQuery] = useState(INITIAL_QUERY);
  const [errorMessage, setErrorMessage] = useState(selectedNode?.data?.exitValidationMessage);

  useEffect(() => {
    setQuery(selectedNode?.data?.exitValidationQuery);
    setErrorMessage(selectedNode?.data?.exitValidationMessage);
  }, [selectedNode]);

  const onCancelDefinitionForm = () => {
    setOpenCancelDialog(true);
  };

  const OnPropertySave = () => {
    queryValidator.current = queryValidation(query, {});
    if (Object.keys(formValidator.current).length === 0 && Object.keys(queryValidator.current).length === 0) {
      if (selectedNode.type === NODE_TYPE.API || selectedNode.type === NODE_TYPE.DIALOG || selectedNode.type === NODE_TYPE.XSLT) {
        editDialog(selectedNode, selectedTaskNode, 'editableProps', initialValues);
        editDialog(selectedNode, selectedTaskNode, 'exitValidationQuery', query);
      } else {
        editTask(selectedNode, 'editableProps', initialValues);
        editTask(selectedNode, 'exitValidationQuery', query);
      }
      setNotificationProps({
        open: true,
        title: 'Success',
        subtitle: `${initialValues?.name} details saved successfully!`,
        kind: 'success',
        onCloseButtonClick: () => setNotificationProps(null)
      });
      setOpenPropertiesBlock(false);
    } else {
      let errorMsg =
        Object.keys(queryValidator.current).length > 0 && Object.keys(formValidator.current).length > 0
          ? 'Define and Exit Validation tab has some mandatory fields'
          : Object.keys(queryValidator.current).length > 0
            ? `Exit Validation Tab Error - ${queryValidator.current.reasons}`
            : formValidationKey.current
              ? `Define Tab Error - ${formValidator.current[formValidationKey.current]}`
              : 'Define tab has some mandatory fields';
      setNotificationProps({
        open: true,
        title: 'Error',
        subtitle: errorMsg,
        kind: 'error',
        onCloseButtonClick: () => setNotificationProps(null)
      });
    }
  };

  const FORM_TEMPLATE = ({ formFields }) => {
    let newFormFieldsObj = formFields.map(({ props, ...rest }) => {
      if (Object.keys(formValidator.current).includes(rest.key)) {
        formValidationKey.current = rest.key;
        return {
          ...rest,
          props: {
            ...props,
            invalid: true,
            invalidText: formValidator.current[rest.key]
          }
        };
      } else {
        return {
          ...rest,
          props: {
            ...props
          }
        };
      }
    });
    return (
      <form>
        {newFormFieldsObj.map((formField, idx) => (
          <div key={idx} className="form-field">
            {formField}
          </div>
        ))}
        <FormSpy
          onChange={(props) => {
            formValidator.current = props.errors;
            initialValues = props.values;
          }}
        />
      </form>
    );
  };

  return (
    <div>
      <Tabs>
        <TabList aria-label="List of tabs" contained style={{ display: 'contents' }}>
          <Tab>Define</Tab>
          <Tab>Exit Validation</Tab>
        </TabList>
        <TabPanels>
          {/* Define Form */}
          <TabPanel>
            <FormRenderer
              id={id}
              initialValues={Object.keys(selectedNode?.data?.editableProps).length > 0 ? selectedNode?.data?.editableProps : initialValues}
              FormTemplate={FORM_TEMPLATE}
              componentMapper={COMPONENT_MAPPER}
              schema={newSchema}
            />
          </TabPanel>
          {/* Exit Validation Form */}
          <TabPanel>
            <ConditionalBuilder
              setOpenCancelDialog={onCancelDefinitionForm}
              queryValidator={queryValidator.current}
              readOnly={readOnly}
              query={query}
              setQuery={setQuery}
              errorMessage={errorMessage}
              setErrorMessage={setErrorMessage}
            />
          </TabPanel>
          <Grid fullWidth className="button-container-container">
            <Column lg={16} className="buttons-container">
              <Button kind="secondary" data-testid="cancel" name="cancel" type="button" onClick={onCancelDefinitionForm} className="button" disabled={readOnly}>
                Cancel
              </Button>
              <Button data-testid="save" color="primary" variant="contained" type="submit" onClick={OnPropertySave} className="button" disabled={readOnly}>
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
    </div>
  );
}
