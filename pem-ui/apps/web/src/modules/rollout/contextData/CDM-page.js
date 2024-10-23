import React from 'react';
import { Grid, Column, TextInput, Tabs, Tab, TabList, TabPanels, TabPanel, Layer } from '@carbon/react';
import Shell, { CDS } from '@b2bi/shell';
import { JSONPath } from 'jsonpath-plus';
import '@b2bi/styles/pages/list-page.scss';

import { CONTEXT_MAPPING_TYPES, CONTEXT_TYPES } from './constant';
import { generateTreeData } from './CDM-utils';

import '../styles.scss';

import CreateApiConfiguration from './create-api-configuration';
import CreateUploadForm from './create-upload-form';

const ContextDataModal = ({ contextData, contextPage }) => {
    const pageUtil = Shell.PageUtil();
    const pageArgs = pageUtil.pageParams;

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
                    selectedRowActivityFile: '',
                    selectedRowHeaderLogo: '',
                    selectedRowSponsorServer: '',
                    successStateUploadForm: undefined,
                    errorStateUploadForm: undefined,
                    successStateApiForm: undefined,
                    errorStateApiForm: undefined
                },
                form: {
                    property: {
                        textProperty: '',
                        booleanProperty: '',
                        activityFileProperty: '',
                        apiConfigProperty: '',
                        logoFileProperty: '',
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
                    this._processProperty();
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
                    const transformedData = generateTreeData(contextData);
                    this.setModel('data', transformedData);
                    contextPage.page.setModel('originalData', contextData);
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
                            this.setUI("selectedRowSponsorServer", contextPage.page.ui.selectedRowSponsorServer || selectedNode.value.value)
                            this.form.property.setValue('apiConfigProperty', selectedNode.value.value);
                            break;
                        case 'ACTIVITY_FILE':
                            this.setUI("selectedRowActivityFile", contextPage.page.ui.selectedRowActivityFile || selectedNode.value.value)
                            this.form.property.setValue('activityFileProperty', selectedNode.value.value);
                            break;
                        case 'LOGO_FILE':
                            this.setUI("selectedRowHeaderLogo", contextPage.page.ui.selectedRowHeaderLogo || selectedNode.value.value);
                            this.form.property.setValue('logoFileProperty', selectedNode.value.value);
                            break;
                        default:
                            break;
                    }
                },
                uiOnPropertyChange: function (event, value) {
                    const propertyRef = JSONPath({ path: `${this.ui.selectedNode.activeNodeId}`, json: contextPage.page.model.originalData, wrap: false });
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
                    } else {
                        this.setUI('errorStateApiForm', undefined);
                        this.setUI('errorStateUploadForm', undefined);
                        this.setUI('successStateApiForm', undefined);
                        this.setUI('successStateUploadForm', undefined);

                    }
                },

            };
        })(pageArgs, pageUtil)
    );

    const pageConfig = {
        cdpTreeView: {
            treeView: {
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

        },
        sponsorServerList: {
            rowConfig: {
                select: 'single',
                onSort: null,
                onSelect: null,
                onSelectionChange: (...args) => {
                    contextPage.page.setUI('selectedRowSponsorServer', args[0].join('') || page.ui.selectedRowSponsorServer);
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
                    contextPage.page.setUI('selectedRowHeaderLogo', args[0].join('') || page.ui.selectedRowHeaderLogo);
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
                    contextPage.page.setUI('selectedRowActivityFile', args[0].join('') || page.ui.selectedRowActivityFile);
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
            <Grid className="pem--cdm-grid">

                <Column lg={4} md={4} className="pem--cdm-tree-container">
                    <Shell.TreeView name="cdpTreeView" config={pageConfig.cdpTreeView} data={page.model.data}></Shell.TreeView>
                </Column>

                <Column lg={12} md={12} style={{ margin: '0' }}>
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
                                                <Tab>{pageUtil.t('mod-context-properties:tabs.apiConfigList')}</Tab>
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
                                                        selectedRowId={contextPage.page.ui.selectedRowSponsorServer || page.ui.selectedRowSponsorServer}
                                                    ></Shell.DataTable>
                                                </TabPanel>
                                                <TabPanel>
                                                    <CreateApiConfiguration mode="CREATE" cdmPage={page} contextPage={contextPage} />
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
                                                        selectedRowId={contextPage.page.ui.selectedRowHeaderLogo || page.ui.selectedRowHeaderLogo}
                                                    ></Shell.DataTable>
                                                </TabPanel>
                                                <TabPanel>
                                                    <CreateUploadForm documentCategory="LOGO" cdmPage={page} contextPage={contextPage} />
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
                                                        selectedRowId={contextPage.page.ui.selectedRowActivityFile || page.ui.selectedRowActivityFile}
                                                    ></Shell.DataTable>
                                                </TabPanel>
                                                <TabPanel>
                                                    <CreateUploadForm documentCategory="ACTIVITY" cdmPage={page} contextPage={contextPage} />
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
        </>
    );
};

export default ContextDataModal;
