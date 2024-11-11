import React, { useEffect, useState } from 'react';

import {
  Modal,
  TextInput,
  Checkbox,
  Button,
  TableContainer,
  Table,
  Select,
  SelectItem,
  FileUploaderItem,
  TextArea,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  TableSelectRow,
  Column,
  Grid
} from '@carbon/react';

import './api-node-definition-form.scss';
import { VectorIcon } from '../../icons';
import { requestMethods, inputOutputFormats } from '../../constants';

export default function APINodePropertyForm({
  formState,
  apiConfigData,
  handlePropertyFormChange,
  readOnly,
  errors,
  apiConfigUrl,
  toggleHeaders,
  showHeaders,
  headerError,
  showCode,
  showCodeHandle,
  file,
  onOpenFiles,
  onDeleteFile,
  handleSaveForm,
  openCancelDialog,
  openContextMappingModal,
  selectedHeaders,
  handleAddHeader,
  headers,
  handleRowSelect,
  handleSelectAll,
  handleRemoveSelected,
  handleHeaderInputChange,
  setOpenContextMappingModal,
  OpenMappingDialog,
  setApiConfigUrl
}) {

  const [apiConfig, setApiConfig] = useState('')

  useEffect(() => {
    if (formState.propertyForm.apiConfig) {
      const currentApiConfig = formState.propertyForm.apiConfig;
      const apiConfigExists = apiConfigData.some(
        (item) => item.apiConfigurationKey === currentApiConfig
      );
      if (!apiConfigExists && apiConfigData.length > 0) {
        setApiConfig(currentApiConfig);
        setApiConfigUrl('${protocol}://${host}:${port}')
      } else {
        setApiConfig('')
      }

    }
  }, [formState, apiConfigData]);

  return (
    <div>
      <Grid className="tab-panel-grid">
        {/* API Configuration */}
        <Column lg={8}>
          {/* TODO: Auto complete form field*/}
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
            <SelectItem value="" text="--Select--" />
            {apiConfigData?.map((method) => (
              <SelectItem
                key={method.apiConfigurationKey} // Always add a unique key when mapping
                value={method.apiConfigurationKey}
                text={method.name}
                selected={formState.propertyForm.apiConfig === method.apiConfigurationKey}
              />
            ))}
          </Select>
        </Column>
        <Column lg={2}>
          <Button
            onClick={() => {
              OpenMappingDialog('apiConfig')
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
        <Column lg={10} style={{ marginTop: '0.5rem', }}>
          {apiConfig !== '' ? <span className='apiConfig-wrapper'>{apiConfig}</span> : null}
        </Column>
        <Column lg={6}></Column>
        {/* URL */}
        <Column lg={6}>
          <TextInput
            style={{
              color: 'black',
              borderBottom: '1px solid black'
            }}
            disabled={true}
            value={apiConfigUrl}
            name="url1"
            id="url1"
            labelText="URL (required)"
          />
        </Column>
        <Column lg={9}>
          <TextInput
            style={{ marginTop: '2.45rem', borderLeft: '1px solid black', borderBottom: '1px solid black' }}
            disabled={readOnly}
            invalid={!!errors.propertyForm.url}
            value={formState.propertyForm.url}
            name="url"
            onChange={handlePropertyFormChange}
            id="url"
            labelText=""
          />
        </Column>
        <Column lg={1}>
          <Button
            onClick={() => {
              OpenMappingDialog('url')
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
        {errors.propertyForm.url && (
          <Column lg={16}>
            <div className="error-message">{errors.propertyForm.url}</div>
          </Column>
        )}
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
        {/* Request Header */}
        <Column lg={8}>
          <div className="cds--label margin-2-rem">Headers</div>
          <div className="margin-1-rem">
            <Button kind="ghost" size="small" onClick={toggleHeaders}>
              {showHeaders ? 'Click to hide request headers' : 'Click to request headers'}
            </Button>
          </div>
        </Column>
        {headerError && (
          <Column lg={16}>
            <div className="error-message">{headerError}</div>
          </Column>
        )}
        {showHeaders && (
          <Column lg={16} style={{ marginTop: '1.25rem' }}>
            <div className="edit-header-container">
              <TableContainer>
                <div className="header-container">
                  <h3 className="edit-header">Request Headers</h3>
                  {!readOnly && (
                    <div className="header-actions">
                      {selectedHeaders.length > 0 && (
                        <Button disabled={readOnly} kind="secondary" onClick={handleRemoveSelected}>
                          Remove
                        </Button>
                      )}
                      <Button disabled={readOnly} kind="primary" onClick={handleAddHeader}>
                        Add
                      </Button>
                    </div>
                  )}
                </div>
                <Table>
                  <TableHead>
                    <TableRow>
                      {!readOnly && (
                        <TableHeader>
                          <Checkbox
                            id="select-all"
                            labelText=""
                            checked={headers.length > 0 && selectedHeaders.length === headers.length} // Update checkbox based on selected rows
                            onChange={(e) => handleSelectAll(e.target.checked)}
                          />
                        </TableHeader>
                      )}
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
                          {!readOnly && (
                            <TableSelectRow
                              disabled={readOnly}
                              id={`header-select-${header.id}`}
                              onSelect={() => handleRowSelect(header.id)}
                              checked={selectedHeaders.includes(header.id)}
                            />
                          )}
                          <TableCell>
                            <div style={{ display: 'flex', marginTop: '0.75rem' }}>
                              <TextInput
                                disabled={readOnly}
                                id={`header-name-${index}`}
                                labelText=""
                                value={header.name}
                                onChange={(e) => handleHeaderInputChange(index, 'name', e.target.value)}
                                placeholder="Enter Name"
                              />
                              <Button
                                onClick={() => {
                                  OpenMappingDialog('name', index)
                                }}
                                className="context-mapping-btn-api-node"
                                kind="tertiary"
                                renderIcon={VectorIcon}
                                size="sm"
                                style={{ transform: 'translateY(-28.25px)' }}
                                hasIconOnly
                                iconDescription="Context Mapping"
                                tooltipAlignment="center"
                                disabled={readOnly}
                              />
                            </div>
                          </TableCell>
                          <TableCell>
                            <div style={{ display: 'flex', marginTop: '0.75rem' }}>
                              <TextInput
                                disabled={readOnly}
                                id={`header-value-${index}`}
                                labelText=""
                                value={header.value}
                                onChange={(e) => handleHeaderInputChange(index, 'value', e.target.value)}
                                placeholder="Enter Value"
                              />
                              <Button
                                onClick={() => {
                                  OpenMappingDialog('value', index)
                                }}
                                className="context-mapping-btn-api-node"
                                kind="tertiary"
                                renderIcon={VectorIcon}
                                size="sm"
                                style={{ transform: 'translateY(-28.25px)' }}
                                hasIconOnly
                                iconDescription="Context Mapping"
                                tooltipAlignment="center"
                                disabled={readOnly}
                              />
                            </div>
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
        <Column lg={1} className="context-mapping-btn-api-node-wrapper">
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
        <Column lg={16} className="file-attachment-wrapper">
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
                <Button disabled={readOnly} className="attachment-btn" onClick={onOpenFiles}>
                  {' '}
                  Select from available files or upload new file
                </Button>
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
