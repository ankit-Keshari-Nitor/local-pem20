import React from 'react';
import { Grid, Column, TextInput, Tabs, Tab, TabList, TabPanels, TabPanel, Layer } from '@carbon/react';
import Shell, { CDS } from '@b2bi/shell';
import { JSONPath } from 'jsonpath-plus';
import '@b2bi/styles/pages/list-page.scss';

import CDMTreeView from './cdm-tree-view';
import { CONTEXT_MAPPING_TYPES, ContextMappingOptions, CONTEXT_TYPES } from './constant';
import { transformDataToTree, generateContextDataMapping, generateTreeData, updateTreeNodeIcon } from './cdm-utils';
import { StringText, Api_1, Image, Schematics, Table, TreeViewAlt, ProgressBar, DataVolume } from '@carbon/icons-react';
import CreateApiConfiguration from './create-api-configuration';
import CreateUploadForm from './create-upload-form';
import './style.scss';

const iconMapping = {
  TEXT: StringText,
  API_CONFIG: Api_1,
  LOGO_FILE: Image,
  ACTIVITY_FILE: Schematics,
  OBJECT: TreeViewAlt,
  ARRAY: Table,
  ARRAY_ITEM: ProgressBar,
  DEFAULT: DataVolume
};

const ContextDataModal = ({ mode, context }) => {
  const pageUtil = Shell.PageUtil();
  const pageArgs = pageUtil.pageParams;
  const { modalConfig } = Shell.useModal();

  const { page } = Shell.usePage(
    [],
    (function Page(pageArgs, pageUtil) {
      return {
        model: {
          sponsorServerList: {
            data: [],
            meta: {
              totalItems: 0
            }
          },
          headerLogoList: {
            data: [],
            meta: {
              totalItems: 0
            }
          },
          activityFileList: {
            data: [],
            meta: {
              totalItems: 0
            }
          },
          data: [],
          originalData: []
        },
        datasources: {
          getSponsorServerList: {
            dataloader: 'API_CONFIGURATION.LIST',
            inputModel: {},
            outputModel: 'sponsorServerList',
            init: true,
            loadingState: 'tableLoadingState',
            handleOutput: ['_updateEmptyState_SponsorList']
          },
          getHeaderLogoList: {
            dataloader: 'FILE.LOGO_LIST',
            inputModel: {},
            outputModel: 'headerLogoList',
            init: true,
            loadingState: 'tableLoadingState',
            handleOutput: ['_updateEmptyState_HeaderList']
          },
          getActivityFileList: {
            dataloader: 'FILE.ACTIVITY_LIST',
            inputModel: {},
            outputModel: 'activityFileList',
            init: true,
            loadingState: 'tableLoadingState',
            handleOutput: ['_updateEmptyState_ActivityList']
          },
          viewSponsorServerList: {
            dataloader: 'API_CONFIGURATION.VIEW'
          },
          viewDocumentList: {
            dataloader: 'FILE.VIEW'
          },
          getUsername: {
            dataloader: 'FILE.USERLIST'
          }
        },
        ui: {
          selectedJPath: '',
          selectedNode: '',
          selectedNodes: [],
          filter: {},
          searchText: '',
          pagination: {},
          tableLoadingState: false,
          tableEmptyState: undefined,
          view: 'table',
          selectedRow: ''
        },
        form: {
          property: {
            textProptery: '',
            booleanProperty: ''
          }
        },
        datatable: {
          sponsorServerList: {
            getListData: function (listInput) {
              const params = {};
              if (listInput.searchText) {
                params.name = listInput.searchText;
              }
              return this.ds.getSponsorServerList({}, { params: params });
            }
          },
          headerLogoList: {
            getListData: function (listInput) {
              return this.ds.getHeaderLogoList({}, {});
            }
          },
          activityFileList: {
            getListData: function (listInput) {
              return this.ds.getActivityFileList({}, {});
            }
          }
        },
        init: function () {
          if (context === 'PROPERTY') {
            this._processProperty();
          } else {
            this._processActivity();
          }
        },
        _updateEmptyState_SponsorList: function (data) {
          if (data.data.length === 0) {
            if (this.datatable.sponsorServerList.filter.current || this.datatable.sponsorServerList.searchText.current) {
              this.setUI('tableEmptyState', 'noRecords');
            } else {
              this.setUI('tableEmptyState', 'initNoRecords');
            }
          } else {
            this.setUI('tableEmptyState', undefined);
          }
        },
        _updateEmptyState_HeaderList: function (data) {
          if (data.data.length === 0) {
            if (this.datatable.headerLogoList.filter.current || this.datatable.headerLogoList.searchText.current) {
              this.setUI('tableEmptyState', 'noRecords');
            } else {
              this.setUI('tableEmptyState', 'initNoRecords');
            }
          } else {
            this.setUI('tableEmptyState', undefined);
          }
        },
        _updateEmptyState_ActivityList: function (data) {
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
        _processProperty: function () {
          const transformedData = generateTreeData(modalConfig.data.data);
          updateTreeNodeIcon(transformedData, iconMapping);
          this.setModel('data', transformedData);
          this.setModel('originalData', modalConfig.data.data);
        },
        _processActivity: function () {
          const contextDataMapping = generateContextDataMapping(ContextMappingOptions);
          const transformedData = transformDataToTree(contextDataMapping.items);
          this.setModel('data', transformedData);
          this.setModel('originalData', { items: modalConfig?.data?.data });
        },
        uiOnRequestSubmit: function () {
          let key = {};
          let handler;
          if (page.ui.selectedNode?.value?.type === CONTEXT_TYPES.API_CONFIG) {
            key.selectedNode = page.ui.selectedNode.value.type;
            key.id = page.ui.selectedRow[0];
            handler = this.ds.viewSponsorServerList(key);
          } else if (page.ui.selectedNode?.value?.type === CONTEXT_TYPES.LOGO_FILE || page.ui.selectedNode?.value?.type === CONTEXT_TYPES.ACTIVITY_FILE) {
            key.selectedNode = page.ui.selectedNode.value.type;
            key.id = page.ui.selectedRow[0];
            handler = this.ds.viewDocumentList(key);
          }
          if (page.ui.selectedNode?.value?.type === 'API_CONFIG' || page.ui.selectedNode?.value?.type === 'LOGO_FILE' || page.ui.selectedNode?.value?.type === 'ACTIVITY_FILE') {
            handler &&
              handler
                .then((response) => {
                  if (context === 'PROPERTY') {
                    const propertyRef = JSONPath({ path: `${this.ui.selectedNode.activeNodeId}`, json: this.model.originalData, wrap: false });
                    this.ui.selectedNode.value.value = response.data;
                    propertyRef.pValue = page.ui.selectedNode?.value?.type === 'API_CONFIG' ? response.data.apiConfigurationKey : response.data.documentKey;
                    modalConfig.onAction('submit', { data: this.model.originalData });
                  } else {
                    modalConfig.onAction('submit', { data: response.data });
                  }
                })
                .catch((err) => { });
          } else {
            modalConfig.onAction('submit', { data: this.model.originalData });
          }
        },
        uiSelectCDM: function () { },
        uiOnSelectJPath: function (event, selectedNode) {
          if (event.currentTarget.type === 'binding') {
            this.setUI('selectedJPath', selectedNode.activeNodeId);
          } else {
            this.setUI('selectedJPath', '');
          }
        },
        uiOnSelectNode: function (event, selectedNode) {
          this.setUI('selectedNode', selectedNode);
          this.setUI('selectedNodes', [selectedNode.id]);
          this.form.property.reset();
          switch (selectedNode.value.type) {
            case 'TEXT':
              this.form.property.setValue('textProperty', selectedNode.value.value);
              break;
            case 'BOOLEAN':
              this.form.property.setValue('booleanProperty', selectedNode.value.value);
              break;
            case 'API_CONFIG':
              this.form.property.setValue('apiConfigProperty', selectedNode.value.value);
              break;
            case 'ACIVITY_FILE':
              this.form.property.setValue('activityFileProperty', selectedNode.value.value);
              break;
            case 'LOGO_FILE':
              this.form.property.setValue('logoFileProperty', selectedNode.value.value);
              break;
            default:
              break;
          }
        },
        uiOnPropertyChange: function (event, value) {
          const propertyRef = JSONPath({ path: `${this.ui.selectedNode.activeNodeId}`, json: this.model.originalData, wrap: false });
          this.ui.selectedNode.value.value = event.target.value;
          propertyRef.pValue = event.target.value;
        },
        uiTabChange: function (...args) {
          if (args[0].selectedIndex === 0) {
            if (args[1] === CONTEXT_MAPPING_TYPES.SFTP_PUSH) {
              page.datatable.sponsorServerList.refresh();
            }
            if (args[1] === CONTEXT_MAPPING_TYPES.HEADER_LOGO) {
              page.datatable.headerLogoList.refresh();
            }
            if (args[1] === CONTEXT_MAPPING_TYPES.ACTIVITY_FILE) {
              page.datatable.activityFileList.refresh();
            }
          }
        },
        uiOnRequestClose: function () {
          modalConfig.onAction('cancel', {
            data: this.model.originalData
          });
        }
      };
    })(pageArgs, pageUtil)
  );

  const pageConfig = {
    cdpTreeView: {
      search: {
        closeLabel: 'shell:common.actions.close',
        label: 'shell:common.actions.search',
        placeholder: 'mod-context-data-properties:actions.search'
      },
      treeView: {
        label: 'mod-context-data-properties:treeHeading',
        onSelect: (...args) => {
          return page.uiOnSelectNode.apply(page, args);
        }
      },
      emptyStates: {
        ResourceNotSelected: {
          image: <div data-testid="ResourceNotSelected-Image"></div>,
          description: 'mod-user:roles.noRoleSelectedDescription'
        }
      }
    },
    actionsConfig: {
      pageActions: [
        {
          id: 'cancel',
          label: 'shell:common.actions.cancel',
          type: 'button',
          kind: 'secondary',
          isVisible: context === 'PROPERTY',
          onAction: (...args) => {
            return page.uiOnRequestClose.apply();
          }
        },
        {
          id: 'backToDetails',
          label: 'shell:common.actions.backToDetails',
          type: 'button',
          kind: 'secondary',
          isVisible: context !== 'PROPERTY',
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
            return page.uiOnRequestSubmit.apply();
          }
        }
      ]
    },
    sponsorServerList: {
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
          label: 'mod-context-properties:list.columns.name',
          value: 'name',
          sortable: '',
          displayType: 'label'
        },
        {
          id: 'protocol',
          label: 'mod-context-properties:list.columns.protocol',
          value: 'protocol',
          sortable: '',
          displayType: 'label'
        },
        {
          id: 'host',
          label: 'mod-context-properties:list.columns.host',
          value: 'host',
          sortable: '',
          displayType: 'label'
        },
        {
          id: 'port',
          label: 'mod-context-properties:list.columns.port',
          value: 'port',
          sortable: '',
          displayType: 'label'
        }
      ],
      paginationConfig: {
        type: 'simple',
        mode: 'client',
        pageSize: 10,
        pageSizes: [5, 10, 20, 50],
        onChange: (...args) => {
          return page.datatable.sponsorServerList.paginationChange.apply(page, args);
        }
      },
      actionsConfig: {
        batchActions: [
          {
            id: 'batch',
            type: 'batch',
            resourceKey: '',
            label: 'Add',
            onAction: (...args) => { }
          }
        ],
        search: {
          id: 'search',
          label: 'mod-context-properties:list.actions.search',
          type: 'search',
          onAction: (...args) => {
            return page.datatable.sponsorServerList.search.apply(page, args);
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
            return page.datatable.sponsorServerList.reset.apply(page, args);
          }
        }
      }
    },
    headerLogoList: {
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
          label: 'mod-context-properties:list.columns.name',
          value: 'documentName',
          sortable: '',
          displayType: 'label'
        },
        {
          id: 'givenName',
          label: 'mod-context-properties:list.columns.givenName',
          value: 'givenName',
          sortable: '',
          displayType: 'label'
        },
        {
          id: 'virusScanStatus',
          label: 'mod-context-properties:list.columns.virusScanStatus',
          value: 'scanStatus.display',
          sortable: '',
          displayType: 'label'
        },
        {
          id: 'type',
          label: 'mod-context-properties:list.columns.type',
          value: 'contentType',
          sortable: '',
          displayType: 'label'
        }
      ],
      paginationConfig: {
        type: 'simple',
        mode: 'client',
        pageSize: 10,
        pageSizes: [5, 10, 20, 50],
        onChange: (...args) => {
          return page.datatable.headerLogoList.paginationChange.apply(page, args);
        }
      },
      actionsConfig: {
        batchActions: [],
        search: {
          id: 'search',
          label: 'mod-context-properties:list.actions.search',
          type: 'search',
          onAction: (...args) => {
            return page.datatable.headerLogoList.search.apply(page, args);
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
            return page.datatable.headerLogoList.reset.apply(page, args);
          }
        }
      }
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
          label: 'mod-context-properties:list.columns.name',
          value: 'documentName',
          sortable: '',
          displayType: 'label'
        },
        {
          id: 'givenName',
          label: 'mod-context-properties:list.columns.givenName',
          value: 'createdBy',
          sortable: '',
          displayType: 'label'
        },
        {
          id: 'virusScanStatus',
          label: 'mod-context-properties:list.columns.virusScanStatus',
          value: 'scanStatus.display',
          sortable: '',
          displayType: 'label'
        },
        {
          id: 'type',
          label: 'mod-context-properties:list.columns.type',
          value: 'contentType',
          sortable: '',
          displayType: 'label'
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
      <Shell.Page name="context-mapping" id="context-mapping" className="context-mapping">
        <Shell.PageHeader
          title={mode === 'CONTEXT_DATA' ? pageUtil.t('mod-context-properties:title_ContextData') : pageUtil.t('mod-context-properties:title')}
          buttonOnClick={page.uiOnRequestClose}
        />
        <Shell.PageBody>
          <Grid className="pem--cdm-grid">
            {context !== 'PROPERTY' && (
              <Column lg={4} md={4} className="pem--cdm-tree-container ">
                <CDMTreeView data={page.model.data} onSelect={page.uiOnSelectNode} />
              </Column>
            )}
            {context === 'PROPERTY' && (
              <>
                <Column lg={4} md={4} className="pem--cdm-tree-container">
                  <Shell.TreeView name="cdpTreeView" config={pageConfig.cdpTreeView} data={page.model.data}></Shell.TreeView>
                </Column>
              </>
            )}
            <Column lg={12} md={12}>
              <CDS.Form name="property" context={page.form.property}>
                {page.ui.selectedNode && (
                  <>
                    {page.ui.selectedNode.value.type === CONTEXT_MAPPING_TYPES.CONSTANT && (
                      <>
                        <Layer>
                          <Layer>
                            <TextInput className="right-panel" id="context-constant" type="text" labelText="Set value for selected node" placeholder="Enter Value"></TextInput>
                          </Layer>
                        </Layer>
                      </>
                    )}
                    {page.ui.selectedNode.value.type === CONTEXT_TYPES.TEXT && (
                      <CDS.TextInput
                        className="right-panel"
                        name="textProperty"
                        labelText="Set value for selected node"
                        rules={{ onChange: page.uiOnPropertyChange }}
                      ></CDS.TextInput>
                    )}
                    {page.ui.selectedNode.value.type === CONTEXT_TYPES.BOOLEAN && (
                      <CDS.Toggle className="right-panel" name="booleanProperty" labelText="Set value for selected node" rules={{ onChange: page.uiOnPropertyChange }}></CDS.Toggle>
                    )}
                    {page.ui.selectedNode.value.type === CONTEXT_TYPES.API_CONFIG && (
                      <>
                        <Tabs
                          defaultSelectedIndex={0}
                          onChange={(e) => {
                            page.uiTabChange(e, CONTEXT_MAPPING_TYPES.SFTP_PUSH);
                          }}
                        >
                          <TabList>
                            <Tab>{pageUtil.t('mod-context-properties:tabs.sponsorServerInfo')}</Tab>
                            <Tab>{pageUtil.t('mod-context-properties:tabs.createNew')}</Tab>
                          </TabList>
                          <TabPanels>
                            <TabPanel>
                              <div className="pem--table-header">
                                <span className="pem--table-title">{pageUtil.t('mod-context-properties:tabs.titleTwo')}</span>
                              </div>
                              <Shell.DataTable
                                className={'sfg--datatable--sponsorServer-list modal-height'}
                                data-testid="sponsorServerList"
                                controller={page.datatable.sponsorServerList}
                                data={page.model.sponsorServerList.data}
                                config={pageConfig.sponsorServerList}
                                loadingState={page.ui.tableLoadingState}
                                emptyState={page.datatable.sponsorServerList.emptyState}
                                totalItems={page.model.sponsorServerList.meta.totalItems}
                              ></Shell.DataTable>
                            </TabPanel>
                            <TabPanel>
                              <CreateApiConfiguration mode="CREATE" />
                            </TabPanel>
                          </TabPanels>
                        </Tabs>
                      </>
                    )}
                    {page.ui.selectedNode.value.type === CONTEXT_TYPES.LOGO_FILE && (
                      <>
                        <Tabs
                          defaultSelectedIndex={0}
                          onChange={(e) => {
                            page.uiTabChange(e, CONTEXT_MAPPING_TYPES.HEADER_LOGO);
                          }}
                        >
                          <TabList>
                            <Tab>{pageUtil.t('mod-context-properties:tabs.availableFiles')}</Tab>
                            <Tab>{pageUtil.t('mod-context-properties:tabs.uploadFiles')}</Tab>
                          </TabList>
                          <TabPanels>
                            <TabPanel>
                              <div className="pem--table-header">
                                <span className="pem--table-title">{pageUtil.t('mod-context-properties:tabs.titleOne')}</span>
                              </div>
                              <Shell.DataTable
                                className={'sfg--datatable--header-logo-list modal-height'}
                                data-testid="headerLogoList"
                                controller={page.datatable.headerLogoList}
                                data={page.model.headerLogoList.data}
                                config={pageConfig.headerLogoList}
                                loadingState={page.ui.tableLoadingState}
                                emptyState={page.datatable.headerLogoList.emptyState}
                                totalItems={page.model.headerLogoList.meta.totalItems}
                              ></Shell.DataTable>
                            </TabPanel>
                            <TabPanel>
                              <CreateUploadForm documentCategory="LOGO" />
                            </TabPanel>
                          </TabPanels>
                        </Tabs>
                      </>
                    )}
                    {page.ui.selectedNode.value.type === CONTEXT_TYPES.ACTIVITY_FILE && (
                      <>
                        <Tabs
                          defaultSelectedIndex={0}
                          onChange={(e) => {
                            page.uiTabChange(e, CONTEXT_MAPPING_TYPES.ACTIVITY_FILE);
                          }}
                        >
                          <TabList>
                            <Tab>{pageUtil.t('mod-context-properties:tabs.availableFiles')}</Tab>
                            <Tab>{pageUtil.t('mod-context-properties:tabs.uploadFiles')}</Tab>
                          </TabList>
                          <TabPanels>
                            <TabPanel>
                              <div className="pem--table-header">
                                <span className="pem--table-title">{pageUtil.t('mod-context-properties:tabs.titleOne')}</span>
                              </div>
                              <Shell.DataTable
                                className={'sfg--datatable--activity-file-list modal-height'}
                                data-testid="activityFileList"
                                controller={page.datatable.activityFileList}
                                data={page.model.activityFileList.data}
                                config={pageConfig.activityFileList}
                                loadingState={page.ui.tableLoadingState}
                                emptyState={page.datatable.activityFileList.emptyState}
                                totalItems={page.model.activityFileList.meta.totalItems}
                              ></Shell.DataTable>
                            </TabPanel>
                            <TabPanel>
                              <CreateUploadForm documentCategory="ACTIVITY" />
                            </TabPanel>
                          </TabPanels>
                        </Tabs>
                      </>
                    )}
                  </>
                )}
              </CDS.Form>
            </Column>
          </Grid>
        </Shell.PageBody>
        <Shell.PageActions actions={pageConfig.actionsConfig.pageActions}></Shell.PageActions>
      </Shell.Page>
    </>
  );
};

export default ContextDataModal;
