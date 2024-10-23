import React from 'react';
import Shell, { CDS } from '@b2bi/shell';

import { Tabs, Tab, TabList, TabPanels, TabPanel, Grid, Layer, Column } from '@carbon/react';

import './style.scss';

const FileAttachment = () => {
  const pageUtil = Shell.PageUtil();
  const pageArgs = pageUtil.pageParams;
  const { modalConfig } = Shell.useModal();

  const { page } = Shell.usePage(
    [],
    (function Page(pageArgs, pageUtil) {
      return {
        model: {
          activityFileList: {
            data: [],
            meta: {
              totalItems: 0
            }
          }
        },
        datasources: {
          getActivityFileList: {
            dataloader: 'FILE.LIST',
            inputModel: {},
            outputModel: 'activityFileList',
            init: true,
            loadingState: 'tableLoadingState',
            handleOutput: ['_updateEmptyState']
          },
          viewDocumentList: {
            dataloader: 'FILE.VIEW'
          },
          uploadFile: {
            dataloader: `FILE.UPLOAD`
          }
        },
        ui: {
          searchText: '',
          pagination: {},
          tableLoadingState: false,
          tableEmptyState: undefined,
          view: 'table',
          selectedRow: '',
          selectedFile: undefined,
          selectedIndex: 0,
          errorState: undefined,
        },
        form: {
          file: {
            documentName: '',
            documentDescription: '',
            isEncrypted: false,
            documentContents: undefined,
            documentCategory: 'ACTIVITY',
            partnerKey: '',
            selectedFile: undefined
          }
        },
        datatable: {
          activityFileList: {
            getListData: function (listInput) {
              const params = {};
              params.documentCategory = 'ACTIVITY';
              return this.ds.getActivityFileList({}, { params: params });
            }
          }
        },
        init: function () { },
        uiOnRequestClose: function () {
          modalConfig.onAction('cancel', {});
        },
        _updateEmptyState: function (data) {
          if (data.data.length === 0) {
            if (this.datatable.activityFileList.filter.current || this.datatable.activityFileList.searchText.current) {
              this.setUI('tableEmptyState', 'noRecords');
            } else {
              this.setUI('tableEmptyState', 'initNoRecords');
            }
          } else {
            this.setUI('tableEmptyState', undefined);
          }
        },
        uiOnRequestSubmit: function () {
          this.setUI('errorState', undefined);
          if (this.ui.selectedIndex === 1) {
            this.form.file.handleSubmit(this.uiUpload)();
          } else if (this.ui.selectedIndex === 0) {
            if (page.ui.selectedRow[0]) {
              let key = {};
              let handler;
              key.id = page.ui.selectedRow[0];
              handler = this.ds.viewDocumentList(key);
              handler &&
                handler
                  .then((response) => {
                    modalConfig.onAction('submit', { data: response.data });
                  })
                  .catch((err) => { });
            } else {
              pageUtil.showNotificationMessage('toast', pageUtil.t('shell:common.action.error'), "Please select the File from datatable.");

            }
          }
        },
        uiUpload: function () {
          const formData = new FormData();
          let params = this.form.file.getValues();
          if (params.uploadFile !== undefined) {
            formData.append('documentContents', this.ui.selectedFile);
            formData.append('documentName', params.documentName);
            formData.append('documentDescription', params.documentDescription);
            formData.append('documentCategory', 'ACTIVITY');
            formData.append('isEncrypted', params.isEncrypted);
            params = {};
            this.ds.uploadFile(formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }, params: params
            }).then((response) => {
              this.setUI('selectedFile', undefined);
              modalConfig.onAction('submit', { data: this.form.file.getValues() })
              this.form.file.reset(pageUtil.getSubsetJson(this.form.file.attributes));
              pageUtil.showNotificationMessage('toast', pageUtil.t('shell:common.actions.success'), pageUtil.t('mod-sponsor-server:field.uploadField.success'));
            }).catch((error) => {
              this.setUI('errorState', error.response?.data?.errorDescription)
            });
          } else {
            this.setUI('errorState', 'Please attach the file.')
          }
        },
        uiOnAddFile: function (event, files) {
          this.setUI('errorState', undefined);
          this.setUI('selectedFile', files.addedFiles[0]);
        },
        uiOnDeleteFile: function (...args) {
          this.setUI('selectedFile', undefined);
        },
        uiTabChange: function (...args) {
          this.setUI('errorState', undefined);
          this.setUI('selectedIndex', args[0].selectedIndex);
          if (args[0].selectedIndex === 0) {
            page.datatable.activityFileList.refresh();
          } else {
            this.setUI('selectedFile', undefined);
            this.form.file.reset(pageUtil.getSubsetJson(this.form.file.attributes));
          }
        }
      };
    })(pageArgs, pageUtil)
  );

  const pageConfig = {
    actionsConfig: {
      pageActions: [
        {
          id: 'cancel',
          label: 'shell:common.actions.cancel',
          type: 'button',
          kind: 'secondary',
          onAction: (...args) => {
            return page.uiOnRequestClose.apply();
          }
        },

        {
          id: 'save',
          label: 'shell:common.actions.save',
          type: 'button',
          kind: 'primary',
          onAction: (...args) => {
            return page.uiOnRequestSubmit.apply(page);
          }
        }
      ]
    },
    activityFileList: {
      rowConfig: {
        select: 'single',
        onSort: null,
        onSelect: null,
        onSelectionChange: (...args) => {
          page.ui.selectedRow = args[0];
        }
      },
      columnConfig: [
        {
          id: 'name',
          label: 'mod-file:list.columns.documentName',
          value: 'documentName',
          sortable: '',
          displayType: 'label'
        },
        {
          id: 'givenName',
          label: 'mod-file:list.columns.createdBy',
          value: 'createdBy',
          sortable: '',
          displayType: 'label'
        },
        {
          id: 'givenName',
          label: 'mod-file:list.columns.isEncrypted',
          value: 'isEncrypted.display',
          sortable: '',
          displayType: 'label'
        },
        {
          id: 'scanStatus',
          label: 'mod-file:list.columns.scanStatus',
          value: 'scanStatus.display',
          sortable: '',
          displayType: 'label'
        },
        {
          id: 'contentType',
          label: 'mod-file:list.columns.contentType',
          value: 'contentType',
          sortable: '',
          displayType: 'label'
        },
        {
          id: 'contentLength',
          label: 'mod-file:list.columns.contentLength',
          value: 'contentLength',
          sortable: '',
          displayType: 'custom',
          getCustomElements: (row, cellValue, config) => {
            return Math.floor(row.contentLength / 1024);
          }
        }
      ],
      paginationConfig: {
        type: 'simple',
        mode: 'client',
        pageSize: 10,
        pageSizes: [5, 10, 20, 50],
        onChange: (...args) => {
          return page.datatable.activityFileList.paginationChange.apply(page, args);
        }
      },
      actionsConfig: {
        batchActions: [],
        search: {
          id: 'search',
          label: 'mod-context-properties:list.actions.search',
          type: 'search',
          onAction: (...args) => {
            return page.datatable.activityFileList.search.apply(page, args);
          },
          resourceKey: ''
        }
      },
      emptyStateConfig: {
        noRecords: {
          name: 'shell:common.emptyState.no_result_found',
          image: '',
          title: 'shell:common.emptyState.no_result_found',
          description: 'shell:common.emptyState.message',

          secondaryAction: 'shell:common.emptyState.reset_filters',
          onSecondaryAction: (...args) => {
            return page.datatable.activityFileList.reset.apply(page, args);
          }
        }
      }
    }
  };

  return (
    <>
      <Shell.Page type="LIST" className="pem--page--file-attachment">
        <Shell.PageHeader title={'File Attachment'} />
        <Shell.PageBody>
          <Tabs defaultSelectedIndex={page.ui.selectedIndex} onChange={page.uiTabChange}>
            <TabList>
              <Tab>Available Files</Tab>
              <Tab>Upload Files</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Shell.DataTable
                  className={`pem--datatable--file-list modal-height`}
                  controller={page.datatable.activityFileList}
                  data={page.model.activityFileList.data}
                  config={pageConfig.activityFileList}
                  loadingState={page.ui.tableLoadingState}
                  emptyState={page.datatable.activityFileList.emptyState}
                  totalItems={page.model.activityFileList.meta.totalItems}
                ></Shell.DataTable>
              </TabPanel>
              <TabPanel>
                <CDS.Form name="file" context={page.form.file}>
                  <Layer level={0} className="sfg--page-details-container" style={{ margin: '1rem 0rem' }}>
                    <Grid className="sfg--grid-container sfg--grid--form">
                      <Column lg={16}>  {page.ui.errorState !== undefined && (<span className='errorMessage'>{page.ui.errorState}</span>)}</Column>
                      <Column lg={6}>
                        <Grid>
                          <Column lg={6} style={{ width: '320px' }}>
                            <CDS.TextInput
                              labelText={pageUtil.t('mod-file:form.documentName')}
                              name="documentName"
                              rules={{
                                required: true,
                                minLength: 1,
                                maxLength: 30, pattern: {
                                  value: /^[a-zA-Z0-9@#%^&*(){}[\]+=;:"'!?/.,\\|~`\s]*$/i,
                                  message: pageUtil.t('mod-sponsor-server:message.nameErrorMessage')
                                }
                              }}
                            />
                          </Column>
                          <Column lg={6} style={{ width: '320px' }}>
                            <CDS.TextArea
                              labelText={pageUtil.t('mod-file:form.description')}
                              name="documentDescription"
                              rows={5}
                              enableCounter={true}
                              counterMode="character"
                              maxCount={255}
                              rules={{
                                required: false,
                                minLength: 1,
                                maxLength: 255, pattern: {
                                  value: /^[a-zA-Z0-9@#%^&*(){}[\]+=;:"'!?/.,\\|~`\s]*$/i,
                                  message: pageUtil.t('mod-sponsor-server:message.nameErrorMessage')
                                }
                              }}
                            />
                          </Column>
                        </Grid>
                      </Column>
                      <Column lg={6} style={{ marginLeft: '8rem', width: '100%' }}>
                        {''}
                        <p className="cds--file--label">{pageUtil.t('mod-file:upload.upload_label')}</p>
                        <CDS.FileUpload
                          // labelText={pageUtil.t('mod-file:form.fileName')}
                          name="uploadFile"
                          accept={['.jpg', '.png', '.jpeg', '.bmp', '.gif']}
                          maxFileSize={'2mb'}
                          onChange={page.uiOnAddFile}
                          onDelete={page.uiOnDeleteFile}
                          value={page.ui.selectedFile}
                        ></CDS.FileUpload>
                      </Column>
                      <Column lg={6} md={6}>
                        <CDS.Checkbox labelText={pageUtil.t('mod-file:form.isEncrypted')} name="isEncrypted"></CDS.Checkbox>
                      </Column>
                    </Grid>
                  </Layer>
                </CDS.Form>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Shell.PageBody>
        <Shell.PageActions actions={pageConfig.actionsConfig.pageActions}></Shell.PageActions>
      </Shell.Page>
    </>
  );
};

export default FileAttachment;
