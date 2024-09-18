/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { TextInput, Button, TextArea, Column, Grid } from '@carbon/react';
import './activity-task-definition.scss';
import { ElippsisIcon } from '../../icons';
import { ACTIVITY_TASK_SCHEMA, COMPONENT_MAPPER, FORM_TEMPLATE } from '../../constants';
import Shell from '@b2bi/shell';

const ActivityTaskDefinition = ({ id, onSubmitDefinitionForm, setShowActivityDefineDrawer, activityDefinitionData, readOnly }) => {
  ACTIVITY_TASK_SCHEMA.fields = ACTIVITY_TASK_SCHEMA.fields.map((item) => ({ ...item, isReadOnly: readOnly }));
  const pageUtil = Shell.PageUtil();
  const [formState, setFormState] = useState({
    name: 'New Activity',
    description: '',
    contextData: ''
  });
  const [errors, setErrors] = useState({ errors: {} });

  useEffect(() => {
    if (activityDefinitionData && activityDefinitionData.definition) {
      setFormState({
        name: activityDefinitionData.definition?.name,
        description: activityDefinitionData.definition?.description,
        contextData: activityDefinitionData?.version.contextData
      });
    }
  }, [activityDefinitionData]);

  const validateContextData = (data) => {
    const defineErrors = {};
    try {
      pageUtil
        .showPageModal('CONTEXT_DATA_MAPPING.CONTEXT_DATA', {
          data: JSON.parse(data)
        })
        .then((modalData) => {
          console.log(modalData);

          setFormState((prev) => ({
            ...prev,
            contextData: JSON.stringify(modalData.data?.data)
          }));
        });
      setErrors({
        errors: ''
      });
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
  console.log('dat ---', formState.contextData);
  return (
    <form>
      <Grid className="tab-panel-grid">
        <Column className="col-margin" lg={16}>
          <TextInput
            labelText={pageUtil.t('mod-context-data-properties:form.name')}
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
            rows={3}
            enableCounter={true}
            counterMode="character"
            maxCount={80}
            minLength={0}
            rules={{ required: false, minLength: 0, maxLength: 80 }}
            value={formState.description}
            name="description"
            onChange={handlePropertyFormChange}
          />
        </Column>
        {formState.contextData !== '' ? (
          <>
            <Column className="col-margin" lg={15}>
              <TextArea
                id="contextData"
                data-testid="contextData"
                labelText={pageUtil.t('mod-context-data-properties:form.contextData')}
                rows={3}
                name="contextData"
                enableCounter={true}
                value={formState.contextData}
                onChange={handlePropertyFormChange}
                invalid={!!errors.errors.contextData}
                invalidText={errors.errors.contextData}
              />
            </Column>
            <Column lg={1}>
              <Button
                onClick={() => {
                  validateContextData(formState.contextData);
                }}
                className="context-mapping-btn"
                kind="tertiary"
                renderIcon={ElippsisIcon}
                size="sm"
                hasIconOnly
                iconDescription={pageUtil.t('mod-context-data-properties:form.iconDescription')}
                tooltipAlignment="center"
              />
            </Column>
          </>
        ) : (
          <Column className="col-margin" lg={16}>
            <TextArea
              id="contextData"
              data-testid="contextData"
              labelText={pageUtil.t('mod-context-data-properties:form.contextData')}
              rows={3}
              name="contextData"
              enableCounter={true}
              value={formState.contextData}
              onChange={handlePropertyFormChange}
              invalid={!!errors.errors.contextData}
              invalidText={errors.errors.contextData}
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
