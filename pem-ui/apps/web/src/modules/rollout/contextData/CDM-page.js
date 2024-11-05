import React from 'react';
import { Grid, Column, TextInput, Tabs, Tab, TabList, TabPanels, TabPanel, Layer, Button, RadioButton } from '@carbon/react';
import Shell, { CDS } from '@b2bi/shell';
import { JSONPath } from 'jsonpath-plus';
import '@b2bi/styles/pages/list-page.scss';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';

import { CONTEXT_MAPPING_TYPES, CONTEXT_TYPES } from './constant';
import { generateTreeData } from './CDM-utils';

import '../styles.scss';

import { ListBoxes } from '@carbon/icons-react';

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
                    apiConfigList: {
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
                    originalData: [],
                    apiConfigListData: {},
                    headerLogoListData: {},
                    activityFileListData: {}
                },
                datasources: {
                    getSponsorServerList: {
                        dataloader: 'API_CONFIGURATION.LIST',
                        inputModel: {},
                        outputModel: 'apiConfigList',
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
                    apiConfigList: {
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
                        if (this.datatable.apiConfigList.filter.current || this.datatable.apiConfigList.searchText.current) {
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
                            this.form.property.setValue('apiConfigProperty', selectedNode.value.value);
                            this.uiOnMap(selectedNode.value.type, selectedNode.value.value, selectedNode)
                            break;
                        case 'ACTIVITY_FILE':
                            this.form.property.setValue('activityFileProperty', selectedNode.value.value);
                            this.uiOnMap(selectedNode.value.type, selectedNode.value.value, selectedNode)
                            break;
                        case 'LOGO_FILE':
                            this.form.property.setValue('logoFileProperty', selectedNode.value.value);
                            this.uiOnMap(selectedNode.value.type, selectedNode.value.value, selectedNode)
                            break;
                        default:
                            break;
                    }
                },
                uiOnPropertyChange: function (event, value) {
                    const propertyRef = JSONPath({ path: `${this.ui.selectedNode.activeNodeId}`, json: contextPage.page.model.originalData, wrap: false });
                    this.ui.selectedNode.value.value = event.target.value;
                    propertyRef.pValue = event.target.value;
                    const transformedData = generateTreeData(contextPage.page.model.originalData);
                    this.setModel('data', transformedData);
                },
                uiTabChange: function (...args) {
                    if (args[0].selectedIndex === 0) {
                        if (args[1] === CONTEXT_TYPES.API_CONFIG) {
                            page.datatable.apiConfigList.refresh();
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
                uiOnUnmapBtn: function (event, type, selectedNode) {
                    switch (type) {
                        case 'API_CONFIG':
                            this.setModel('apiConfigListData', {});
                            page.datatable.apiConfigList.refresh();
                            break;
                        case 'LOGO_FILE':
                            this.setModel('headerLogoListData', {});
                            page.datatable.headerLogoList.refresh();
                            break;
                        case 'ACTIVITY_FILE':
                            this.setModel('activityFileListData', {});
                            page.datatable.activityFileList.refresh();
                            break;
                        default:
                            break;
                    }
                    const propertyRef = JSONPath({ path: `${selectedNode.activeNodeId}`, json: contextPage.page.model.originalData, wrap: false });
                    selectedNode.value.value = ''
                    propertyRef.pValue = '';
                    const transformedData = generateTreeData(contextPage.page.model.originalData);
                    this.setModel('data', transformedData);
                },
                uiOnMap: function (type, val, selectedNode = undefined) {
                    let handler;
                    let key = {}
                    switch (type) {
                        case 'API_CONFIG':
                            if (val) {
                                key.id = val
                                handler = val ? this.ds.viewSponsorServerList(key) : undefined
                                handler && handler.then((response) => {
                                    this.setModel('apiConfigListData', response.data);
                                })
                            }
                            page.datatable.apiConfigList.refresh();
                            break;
                        case 'LOGO_FILE':
                            if (val) {
                                key.id = val
                                handler = this.ds.viewDocumentList(key)
                                handler && handler.then((response) => {
                                    this.setModel('headerLogoListData', response.data);
                                })
                            }
                            page.datatable.headerLogoList.refresh();
                            break;
                        case 'ACTIVITY_FILE':
                            if (val) {
                                key.id = val
                                handler = this.ds.viewDocumentList(key)
                                handler && handler.then((response) => {
                                    this.setModel('activityFileListData', response.data);
                                })
                            }
                            page.datatable.activityFileList.refresh();
                            break;
                        default:
                            break;
                    }
                    const propertyRef = JSONPath({ path: `${selectedNode.activeNodeId}`, json: contextPage.page.model.originalData, wrap: false });
                    selectedNode.value.value = val
                    propertyRef.pValue = val;
                    const transformedData = generateTreeData(contextPage.page.model.originalData);
                    this.setModel('data', transformedData);
                }
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
        apiConfigList: {
            rowConfig: {
                select: 'single',
                onSort: null,
                onSelect: null,
                onSelectionChange: (...args) => {
                    if (args[0].join('') !== '') {
                        const propertyRef = JSONPath({ path: `${page.ui.selectedNode.activeNodeId}`, json: contextPage.page.model.originalData, wrap: false });
                        page.ui.selectedNode.value.value = args[0].join('')
                        propertyRef.pValue = args[0].join('');
                    }
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
                    return page.datatable.apiConfigList.paginationChange.apply(page, args);
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
                        return page.datatable.apiConfigList.search.apply(page, args);
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
                        return page.datatable.apiConfigList.reset.apply(page, args);
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
                    if (args[0].join('') !== '') {
                        const propertyRef = JSONPath({ path: `${page.ui.selectedNode.activeNodeId}`, json: contextPage.page.model.originalData, wrap: false });
                        page.ui.selectedNode.value.value = args[0].join('')
                        propertyRef.pValue = args[0].join('');
                    }
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
                    if (args[0].join('') !== '') {
                        const propertyRef = JSONPath({ path: `${page.ui.selectedNode.activeNodeId}`, json: contextPage.page.model.originalData, wrap: false });
                        page.ui.selectedNode.value.value = args[0].join('')
                        propertyRef.pValue = args[0].join('');
                    }
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

            <PanelGroup direction="horizontal">
                {/* <Grid className="pem--cdm-grid"> */}
                <Panel minSize={20} defaultSize={30} maxSize={60}>
                    <Column lg={4} md={4} className="pem--cdm-tree-container">
                        <Shell.TreeView name="cdpTreeView" config={pageConfig.cdpTreeView} data={page.model.data}></Shell.TreeView>
                    </Column>
                </Panel>
                <PanelResizeHandle style={{ cursor: 'ew-resize' }} />
                <Panel minSize={40} defaultSize={70} maxSize={80}>
                    <div class="right-pane">
                        <Column lg={12} md={12} style={{ margin: '0rem 1rem' }}>
                            {!page.ui.selectedNode && (
                                <>
                                    <div className="no-connector-container">
                                        <div><ListBoxes /> </div>
                                        <div>No Node Selected </div>
                                        <div>Please select Node from left panel</div>
                                    </div>
                                </>
                            )}
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
                                            <>{
                                                (page.ui.selectedNode.value.value) ?
                                                    <>
                                                        <div className="unmap-header">
                                                            <span className="pem-unmap-table-title">{pageUtil.t('mod-context-properties:page.viewAPIConfig')}</span>
                                                            <Button className='pem-unmap-button-wrapper' onClick={(e) => page.uiOnUnmapBtn(e, page.ui.selectedNode.value.type, page.ui.selectedNode)}>Unmap</Button>
                                                        </div>
                                                        <Grid className='unmap-wrapper'>
                                                            {/* Name */}
                                                            <Column className='unmap-col-wrapper' lg={6}>{pageUtil.t('mod-context-properties:form.name')}</Column>
                                                            <Column className='unmap-col-wrapper' lg={6}>{page.model.apiConfigListData?.name}</Column>
                                                            {/* Protocol */}
                                                            <Column className='unmap-col-wrapper' lg={6}>{pageUtil.t('mod-context-properties:form.protocol')}</Column>
                                                            <Column className='unmap-col-wrapper' lg={6}>{page.model.apiConfigListData?.protocol}</Column>
                                                            {/* Host */}
                                                            <Column className='unmap-col-wrapper' lg={6}>{pageUtil.t('mod-context-properties:form.host')}</Column>
                                                            <Column className='unmap-col-wrapper' lg={6}>{page.model.apiConfigListData?.host}</Column>
                                                            {/* Port */}
                                                            <Column className='unmap-col-wrapper' lg={6}>{pageUtil.t('mod-context-properties:form.port')}</Column>
                                                            <Column className='unmap-col-wrapper' lg={6}>{page.model.apiConfigListData?.port}</Column>
                                                            {/* SSL Protocol */}
                                                            <Column className='unmap-col-wrapper' lg={6}>{pageUtil.t('mod-context-properties:form.sslProtocol')}</Column>
                                                            <Column className='unmap-col-wrapper' lg={6}>{page.model.apiConfigListData?.sslProtocol ? page.model.apiConfigListData?.sslProtocol : 'None'}</Column>
                                                            {/* preemptive Auth*/}
                                                            <Column className='unmap-col-wrapper' lg={6}>{pageUtil.t('mod-context-properties:form.preemptiveAuth')}</Column>
                                                            <Column className='unmap-col-wrapper' lg={6}>{page.model.apiConfigListData?.preemptiveAuth?.code === "TRUE" ? 'Yes' : 'No'}</Column>
                                                            {/* authenticationType */}
                                                            <Column className='unmap-col-wrapper' lg={6}>{pageUtil.t('mod-context-properties:form.authenticationType')}</Column>
                                                            <Column className='unmap-col-wrapper' lg={6}>

                                                                <RadioButton labelText="User Name and Password" value="usernameandpassword" id="1" disabled checked={page.model.apiConfigListData?.userName && page.model.apiConfigListData?.password} />
                                                                <div>
                                                                    <div class="vertical">{page.model.apiConfigListData?.userName}</div>
                                                                    <div class="vertical">{page.model.apiConfigListData?.password}</div>
                                                                </div>
                                                                <RadioButton labelText="Internally generated token" value="internallygeneratedtoken" id="2" disabled checked={page.model.apiConfigListData?.isInternalAuth?.code === "TRUE"} />
                                                                <RadioButton labelText="None" value="none" id="3" disabled checked={(!page.model.apiConfigListData?.userName && !page.model.apiConfigListData?.password) && page.model.apiConfigListData?.isInternalAuth?.code === "FALSE"} />

                                                            </Column>
                                                            {/* Verify host*/}
                                                            <Column className='unmap-col-wrapper' lg={6}>{pageUtil.t('mod-context-properties:form.verifyHost')}</Column>
                                                            <Column className='unmap-col-wrapper' lg={6}>{page.model.apiConfigListData?.verifyHost?.code === 'TRUE' ? 'Yes' : 'No'}</Column>

                                                        </Grid>
                                                    </> :
                                                    <>
                                                        <Tabs
                                                            defaultSelectedIndex={0}
                                                            onChange={(e) => {
                                                                page.uiTabChange(e, CONTEXT_TYPES.API_CONFIG);
                                                            }}                                            >
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
                                                                        data-testid="apiConfigList"
                                                                        controller={page.datatable.apiConfigList}
                                                                        data={page.model.apiConfigList.data}
                                                                        config={pageConfig.apiConfigList}
                                                                        loadingState={page.ui.tableLoadingState}
                                                                        emptyState={page.datatable.apiConfigList.emptyState}
                                                                        totalItems={page.model.apiConfigList.meta.totalItems}
                                                                    ></Shell.DataTable>
                                                                </TabPanel>
                                                                <TabPanel>
                                                                    <CreateApiConfiguration mode="CREATE" cdmPage={page} contextPage={contextPage} />
                                                                </TabPanel>
                                                            </TabPanels>
                                                        </Tabs>
                                                    </>
                                            }

                                            </>
                                        )}
                                        {page.ui.selectedNode.value.type === CONTEXT_TYPES.LOGO_FILE && (
                                            <> {
                                                (page.ui.selectedNode.value.value) ?
                                                    <>
                                                        <div className="unmap-header">
                                                            <span className="pem-unmap-table-title">{pageUtil.t('mod-context-properties:page.viewDocument')}</span>
                                                            <Button className='pem-unmap-button-wrapper' onClick={(e) => page.uiOnUnmapBtn(e, page.ui.selectedNode.value.type, page.ui.selectedNode)}>Unmap</Button>
                                                        </div>
                                                        <Grid className='unmap-wrapper'>
                                                            {/* Name */}
                                                            <Column className='unmap-col-wrapper' lg={6}>{pageUtil.t('mod-file:list.columns.documentName')}</Column>
                                                            <Column className='unmap-col-wrapper' lg={6}>{page.model.headerLogoListData?.documentName}</Column>
                                                            {/* Owner */}
                                                            <Column className='unmap-col-wrapper' lg={6}>{pageUtil.t('mod-file:list.columns.createdBy')}</Column>
                                                            <Column className='unmap-col-wrapper' lg={6}>{page.model.headerLogoListData?.createdBy}</Column>
                                                            {/* Category */}
                                                            <Column className='unmap-col-wrapper' lg={6}>{pageUtil.t('mod-file:list.columns.documentCategory')}</Column>
                                                            <Column className='unmap-col-wrapper' lg={6}>{page.model.headerLogoListData?.documentCategory?.display}</Column>
                                                            {/* Type */}
                                                            <Column className='unmap-col-wrapper' lg={6}>{pageUtil.t('mod-file:list.columns.contentType')}</Column>
                                                            <Column className='unmap-col-wrapper' lg={6}>{page.model.headerLogoListData?.contentType}</Column>
                                                            {/* Encrypted */}
                                                            <Column className='unmap-col-wrapper' lg={6}>{pageUtil.t('mod-file:list.columns.isEncrypted')}</Column>
                                                            <Column className='unmap-col-wrapper' lg={6}>{page.model.headerLogoListData?.isEncrypted?.code === 'TRUE' ? 'Yes' : 'No'}</Column>
                                                            {/* Upload Date*/}
                                                            <Column className='unmap-col-wrapper' lg={6}>{pageUtil.t('mod-file:list.columns.createTs')}</Column>
                                                            <Column className='unmap-col-wrapper' lg={6}>
                                                                {page.model.headerLogoListData?.createTs
                                                                    ? (() => {
                                                                        const date = new Date(page.model.headerLogoListData.createTs);
                                                                        const options = {
                                                                            year: 'numeric',
                                                                            month: 'short', // For abbreviated month (e.g., "Oct")
                                                                            day: 'numeric',
                                                                            hour: 'numeric',
                                                                            minute: 'numeric',
                                                                            second: 'numeric',
                                                                            hour12: true
                                                                        };
                                                                        return date.toLocaleString('en-US', options); // Format the date
                                                                    })()
                                                                    : ''}
                                                            </Column>
                                                        </Grid>
                                                    </> :
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
                                                                    <CreateUploadForm documentCategory="LOGO" cdmPage={page} contextPage={contextPage} />
                                                                </TabPanel>
                                                            </TabPanels>
                                                        </Tabs>
                                                    </>
                                            }
                                            </>
                                        )}
                                        {page.ui.selectedNode.value.type === CONTEXT_TYPES.ACTIVITY_FILE && (
                                            <>{
                                                (page.ui.selectedNode.value.value) ?
                                                    <>
                                                        <div className="unmap-header">
                                                            <span className="pem-unmap-table-title">{pageUtil.t('mod-context-properties:page.viewDocument')}</span>
                                                            <Button className='pem-unmap-button-wrapper' onClick={(e) => page.uiOnUnmapBtn(e, page.ui.selectedNode.value.type, page.ui.selectedNode)}>Unmap</Button>
                                                        </div>
                                                        <Grid className='unmap-wrapper'>
                                                            {/* Name */}
                                                            <Column className='unmap-col-wrapper' lg={6}>{pageUtil.t('mod-file:list.columns.documentName')}</Column>
                                                            <Column className='unmap-col-wrapper' lg={6}>{page.model.activityFileListData?.documentName}</Column>
                                                            {/* Owner */}
                                                            <Column className='unmap-col-wrapper' lg={6}>{pageUtil.t('mod-file:list.columns.createdBy')}</Column>
                                                            <Column className='unmap-col-wrapper' lg={6}>{page.model.activityFileListData?.createdBy}</Column>
                                                            {/* Category */}
                                                            <Column className='unmap-col-wrapper' lg={6}>{pageUtil.t('mod-file:list.columns.documentCategory')}</Column>
                                                            <Column className='unmap-col-wrapper' lg={6}>{page.model.activityFileListData?.documentCategory?.display}</Column>
                                                            {/* Type */}
                                                            <Column className='unmap-col-wrapper' lg={6}>{pageUtil.t('mod-file:list.columns.contentType')}</Column>
                                                            <Column className='unmap-col-wrapper' lg={6}>{page.model.activityFileListData?.contentType}</Column>
                                                            {/* Encrypted */}
                                                            <Column className='unmap-col-wrapper' lg={6}>{pageUtil.t('mod-file:list.columns.isEncrypted')}</Column>
                                                            <Column className='unmap-col-wrapper' lg={6}>{page.model.activityFileListData?.isEncrypted?.code === 'TRUE' ? 'Yes' : 'No'}</Column>
                                                            {/* Upload Date*/}
                                                            <Column className='unmap-col-wrapper' lg={6}>{pageUtil.t('mod-file:list.columns.createTs')}</Column>
                                                            <Column className='unmap-col-wrapper' lg={6}>
                                                                {page.model.activityFileListData?.createTs
                                                                    ? (() => {
                                                                        const date = new Date(page.model.activityFileListData.createTs);
                                                                        const options = {
                                                                            year: 'numeric',
                                                                            month: 'short', // For abbreviated month (e.g., "Oct")
                                                                            day: 'numeric',
                                                                            hour: 'numeric',
                                                                            minute: 'numeric',
                                                                            second: 'numeric',
                                                                            hour12: true
                                                                        };
                                                                        return date.toLocaleString('en-US', options); // Format the date
                                                                    })()
                                                                    : ''}
                                                            </Column>
                                                        </Grid>
                                                    </> : <>
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
                                                                    <CreateUploadForm documentCategory="ACTIVITY" cdmPage={page} contextPage={contextPage} />
                                                                </TabPanel>
                                                            </TabPanels>
                                                        </Tabs>
                                                    </>
                                            }
                                            </>
                                        )}
                                    </>
                                )}
                            </CDS.Form>
                        </Column>
                    </div>                </Panel>
                {/* </Grid> */}
            </PanelGroup>

        </>
    );
};

export default ContextDataModal;
