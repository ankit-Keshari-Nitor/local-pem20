import React from 'react';

import { Modal, Checkbox, Button, Select, SelectItem, TextArea, Column, Grid } from '@carbon/react';

import './xslt-node-definition-form.scss';
import { VectorIcon } from '../../icons';
import { outputFormats } from '../../constants';

export default function APINodePropertyForm({
  formState,
  handlePropertyFormChange,
  readOnly,
  errors,
  openCancelDialog,
  openContextMappingModal,
  setOpenContextMappingModal,
  OpenMappingDialog
}) {
  return (
    <div>
      <Grid className="tab-panel-grid">
        {/* Input */}
        <Column lg={16}>
          <div style={{ display: 'flex' }}>
            <TextArea
              value={formState.propertyForm.input}
              onChange={handlePropertyFormChange}
              labelText="Input(required)"
              rows={3}
              id="input"
              name="input"
              disabled={readOnly}
              style={{ overflowY: 'auto' }}
              invalid={!!errors.propertyForm.input}
              invalidText={errors.propertyForm.input}
            />
            <Button
              onClick={() => {
                OpenMappingDialog('input');
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
          </div>
        </Column>
        {/*  Escape Input */}
        <Column className="xslt-col-margin-top" lg={16}>
          <Checkbox
            disabled={readOnly}
            id="escapeInput"
            name="escapeInput"
            checked={formState.propertyForm.escapeInput}
            onChange={handlePropertyFormChange}
            labelText="Escape Input"
          />
        </Column>
        {/* XSLT */}
        <Column className="xslt-col-margin" lg={16}>
          <TextArea
            value={formState.propertyForm.xslt}
            onChange={handlePropertyFormChange}
            labelText="XSLT"
            rows={3}
            id="xslt"
            name="xslt"
            disabled={readOnly}
            style={{ overflowY: 'auto' }}
          />
        </Column>
        {/* Output Format */}
        <Column className="xslt-col-margin" lg={16}>
          <Select
            disabled={readOnly}
            id="output"
            name="output"
            labelText="Output Format"
            defaultValue={formState.propertyForm.output}
            onChange={handlePropertyFormChange}
          >
            {outputFormats.map((method) => (
              <SelectItem key={method.value} value={method.value} text={method.label} />
            ))}
          </Select>
        </Column>
        {/* Sample Response */}
        <Column className="xslt-col-margin" lg={16}>
          <TextArea
            value={formState.propertyForm.sampleOutput}
            onChange={handlePropertyFormChange}
            labelText="Sample Output"
            rows={3}
            id="sampleOutput"
            name="sampleOutput"
            disabled={readOnly}
            style={{ overflowY: 'auto' }}
          />
        </Column>
      </Grid>
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
