/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { TextInput, Button, TextArea, Column, Grid } from '@carbon/react';
import './activity-task-definition.scss';
import { VectorIcon } from '../../icons';
import { ACTIVITY_TASK_SCHEMA } from '../../constants';
import Shell from '@b2bi/shell';

const ActivityTaskDefinition = ({ id, onSubmitDefinitionForm, setShowActivityDefineDrawer, activityDefinitionData, readOnly, activityOperation }) => {
  ACTIVITY_TASK_SCHEMA.fields = ACTIVITY_TASK_SCHEMA.fields.map((item) => ({ ...item, isReadOnly: readOnly }));
  const pageUtil = Shell.PageUtil();
  const [formState, setFormState] = useState({
    name: 'New Activity',
    description: '',
    contextData: '{}'
  });
  const [errors, setErrors] = useState({ errors: {} });

  useEffect(() => {
    if (activityDefinitionData && activityDefinitionData.definition) {
      setFormState({
        name: activityDefinitionData.definition?.name,
        description: activityDefinitionData.definition?.description,
        contextData: activityDefinitionData?.version.contextData || '{}'
      });
    }
  }, [activityDefinitionData]);

  const validateContextData = (data) => {
    const defineErrors = {};
    try {
      let jsonData;
      let isValidData = false;
      try {
        jsonData = JSON.parse(data);
        isValidData = jsonData && typeof jsonData === 'object' && Object.keys(jsonData).length > 0;
      } catch (error) {
        console.error("Failed to parse context data:", error);
        isValidData = false;
      }
      if (isValidData) {
        pageUtil
          .showPageModal('CONTEXT_DATA_MAPPING.CONTEXT_DATA', {
            data: JSON.parse(data)
          })
          .then((modalData) => {
            setFormState((prev) => ({
              ...prev,
              contextData: JSON.stringify(modalData.data?.data)
            }));
          });
        setErrors({
          errors: ''
        });
      } else {
        setErrors({
          errors: 'Please enter valid json data.'
        });
      }


    } catch (e) {
      defineErrors.contextData = 'Please enter valid json data.';
      setErrors({
        errors: defineErrors
      });
    }
    // Return true if no errors, false otherwise
    return Object.keys(defineErrors).length === 0;
  };

  const handlePropertyFormChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Validate forms
  const validateForms = () => {
    const defineErrors = {};
    // Validate Define Form
    if (!formState.name || formState.name.trim().length === 0) {
      defineErrors.name = 'Name is required';
    }

    if (formState.name.trim().length > 0 && formState.name.trim().length >= 100) {
      defineErrors.name = 'Name must be no longer then 100 characters';
    }

    if (activityOperation === 'Edit' && formState.description.trim().length === 0) {
      defineErrors.description = 'Description is required';
    }

    if (!formState.contextData || formState.contextData.trim().length === 0) {
      defineErrors.contextData = 'Invalid Context Data';
    }
    // Update errors state
    setErrors({
      errors: defineErrors
    });
    // Return true if no errors, false otherwise
    return Object.keys(defineErrors).length === 0;
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (validateForms()) {
      onSubmitDefinitionForm(formState);
    }
  };
  return (
    <form>
      <Grid className="tab-panel-grid">
        <Column className="col-margin" lg={16}>
          <TextInput
            labelText={pageUtil.t('mod-context-data-properties:form.name')}
            placeholder={pageUtil.t('mod-context-data-properties:form.namePlaceholder')}
            className="request-wrapper"
            id="name"
            required
            pattern="/^[^&<>'.{}]+$/i"
            name="name"
            value={formState.name}
            onChange={handlePropertyFormChange}
            disabled={readOnly}
            max={30}
            invalid={!!errors.errors.name}
            invalidText={errors.errors.name}
          />
        </Column>
        <Column className="col-margin" lg={16}>
          <TextArea
            id="description"
            data-testid="description"
            labelText={pageUtil.t('mod-context-data-properties:form.description')}
            placeholder={pageUtil.t('mod-context-data-properties:form.descriptionPlaceholder')}
            rows={3}
            enableCounter={true}
            counterMode="character"
            maxCount={80}
            minLength={0}
            rules={{ required: false, minLength: 0, maxLength: 80 }}
            value={formState.description}
            name="description"
            disabled={readOnly}
            onChange={handlePropertyFormChange}
            invalid={!!errors.errors.description}
            invalidText={errors.errors.description}
          />
        </Column>
        <Column className="col-margin" lg={formState.contextData !== '' ? 15 : 16}>
          <TextArea
            id="contextData"
            data-testid="contextData"
            labelText={pageUtil.t('mod-context-data-properties:form.contextData')}
            rows={5}
            name="contextData"
            disabled={readOnly}
            enableCounter={true}
            value={formState.contextData}
            onChange={handlePropertyFormChange}
            invalid={!!errors.errors.contextData}
            invalidText={errors.errors.contextData}
          />
        </Column>
        {formState.contextData !== '' && (
          <Column lg={1} className="context-mapping-button-container">
            <Button
              onClick={() => {
                validateContextData(formState.contextData);
              }}
              className="context-mapping-btn"
              kind="tertiary"
              renderIcon={VectorIcon}
              size="sm"
              hasIconOnly
              disabled={readOnly}
              iconDescription={pageUtil.t('mod-context-data-properties:form.iconDescription')}
              tooltipAlignment="center"
            />
          </Column>
        )}
        <Column lg={16} className="buttons-containers">
          <Button onClick={() => setShowActivityDefineDrawer(false)} kind="secondary" data-testid="cancel" name="cancel" type="button" className="button" disabled={readOnly}>
            {pageUtil.t('mod-context-data-properties:form.button.cancel')}
          </Button>
          <Button onClick={handleSave} data-testid="save" color="primary" variant="contained" type="button" className="button" disabled={readOnly}>
            {pageUtil.t('mod-context-data-properties:form.button.save')}
          </Button>
        </Column>
      </Grid>
    </form>
  );
};

export default ActivityTaskDefinition;
