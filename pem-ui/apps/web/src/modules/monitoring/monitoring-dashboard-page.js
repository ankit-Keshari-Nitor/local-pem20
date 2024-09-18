import React from 'react';
import Shell from '@b2bi/shell';
import { Tabs, TabList, Tab, TabPanel, TabPanels, Grid, Column, Tile, Tooltip } from '@carbon/react';
import { useParams } from 'react-router-dom';
import { Information, PlayFilledAlt } from '@carbon/icons-react';
import '@b2bi/styles/pages/list-page.scss';
import './styles.scss';
import { mockRolloutData, mockActivities, mockPartnerData, mockInternalData } from './mockData';

export default function Monitoring() {
  const pageArgs = useParams();
  const pageUtil = Shell.PageUtil();
  const pageConfig = {
    rolloutActivities: {
      rowConfig: { select: 'none', onSort: null, onSelect: null },
      columnConfig: [
        {
          id: 'name',
          label: 'mod-activity-monitoring:dashboardList.columns.name',
          value: 'name',
          isSortable: false,
          displayType: 'custom',
          className: 'icon-column',
          getCustomElements: (row, cellValue, config) => {
            return (
              <div className="pem-information-wrapper">
                {row.description !== '' ? (
                  <Tooltip align="right" label={row.description}>
                    <Information className="information-icon" />
                  </Tooltip>
                ) : null}
                <span className="pem-information-text">{row.name}</span>
              </div>
            );
          }
        },
        {
          id: 'partners',
          label: 'mod-activity-monitoring:dashboardList.columns.partners',
          value: 'partners',
          sortable: '',
          displayType: 'label'
        },
        {
          id: 'definitionName',
          label: 'mod-activity-monitoring:dashboardList.columns.definitionName',
          value: 'definitionName',
          sortable: '',
          displayType: 'label'
        },
        {
          id: 'status',
          label: 'mod-activity-monitoring:dashboardList.columns.status',
          value: 'status',
          sortable: '',
          displayType: 'tag-label',
          getAttributes: (row, cellValue, config) => {
            return {
              type: row.status === 'Not-Started' ? 'cool-gray' : row.status === 'In-Progress' ? 'cyan' : 'green'
            };
          }
        },
        {
          id: 'action',
          label: 'mod-activity-monitoring:dashboardList.columns.action',
          value: 'action',
          sortable: '',
          displayType: 'button',
          attributes: {
            kind: 'tertiary',
            children: 'View Activity',
            className: 'pem--button-label'
          },
          onAction: (...args) => {
            return page.uiGotoDetails.apply(page, args);
          }
        }
      ],
      filterConfig: {
        onApply: (...args) => {
          return page.datatable.rolloutActivities.applyFilter.apply(page, args);
        },
        onCancel: (...args) => {
          return {};
        },
        onClear: (...args) => {
          return page.datatable.rolloutActivities.clearFilter.apply(page, args);
        },
        fields: [
          {
            type: 'input',
            label: 'mod-activity-monitoring:dashboardList.filters.definitionName',
            name: 'definitionName',
            id: 'definitionName'
          }
        ]
      },
      actionsConfig: {
        filterBatchActions: (...args) => {
          return page._filterBatchActions.apply(page, args);
        },
        filterRowActions: (...args) => {
          return page._filterBatchActions.apply(page, args);
        },
        rowActions: [
          {
            id: 'addPartners',
            label: 'mod-activity-monitoring:dashboardList.actions.addPartners',
            type: 'row',
            onAction: (...args) => {
              return page.uiAddPartner.apply(page, args);
            },
            resourceKey: ''
          },
          {
            id: 'closeActivity',
            label: 'mod-activity-monitoring:dashboardList.actions.closeActivity',
            type: 'row',
            onAction: (...args) => {
              return page.uiCloseActivity.apply(page, args);
            },
            resourceKey: ''
          }
        ],

        batchActions: [],
        search: {
          id: 'search',
          label: 'mod-activity-monitoring:dashboardList.actions.search',
          type: 'search',
          onAction: (...args) => {
            return page.datatable.rolloutActivities.search.apply(page, args);
          },
          resourceKey: ''
        }
      },
      paginationConfig: {
        type: 'simple',
        mode: 'server',
        pageSize: 10,
        pageSizes: [5, 10, 20, 50],
        onChange: (...args) => {
          return page.datatable.rolloutActivities.paginationChange.apply(page, args);
        }
      },
      emptyStateConfig: {
        filterSearchNoData: {
          name: 'shell:common.emptyState.no_result_found',
          image: '',
          title: 'shell:common.emptyState.no_result_found',
          description: 'shell:common.emptyState.message',
          secondaryAction: 'shell:common.emptyState.reset_filters',
          onSecondaryAction: (...args) => {
            return page.datatable.rolloutActivities.reset.apply(page, args);
          }
        },
        initNoData: {
          name: 'noRecordsInit',
          image: '',
          title: 'mod-activity-monitoring:dashboardList.emptyStates.initNoRecords.title'
        }
      }
    },
    partnersActivities: {
      rowConfig: { select: 'none', onSort: null, onSelect: null },
      columnConfig: [
        {
          id: 'name',
          label: 'mod-activity-monitoring:dashboardList.columns.name',
          value: 'name',
          sortable: '',
          displayType: 'link',
          onAction: (...args) => {
            return page.uiGotoDetails.apply(page, args);
          }
        },
        {
          id: 'partners',
          label: 'mod-activity-monitoring:dashboardList.columns.partners',
          value: 'partners',
          sortable: '',
          displayType: 'label'
        },
        {
          id: 'definitionName',
          label: 'mod-activity-monitoring:dashboardList.columns.definitionName',
          value: 'definitionName',
          sortable: '',
          displayType: 'label'
        },
        {
          id: 'status',
          label: 'mod-activity-monitoring:dashboardList.columns.status',
          value: 'status',
          sortable: '',
          displayType: 'tag-label',
          getAttributes: (row, cellValue, config) => {
            return {
              type: row.status === 'Not-Started' ? 'cool-gray' : row.status === 'In-Progress' ? 'cyan' : 'green'
            };
          }
        },
        {
          id: 'dueDate',
          label: 'mod-activity-monitoring:viewPartnerList.columns.dueDate',
          value: 'dueDate',
          sortable: '',
          displayType: 'label'
        },
        {
          id: 'delay',
          label: 'mod-activity-monitoring:viewPartnerList.columns.delays',
          value: 'delay',
          sortable: '',
          displayType: 'label'
        },
        {
          id: 'action',
          label: 'mod-activity-monitoring:dashboardList.columns.action',
          value: 'action',
          sortable: '',
          displayType: 'button',
          attributes: {
            kind: 'tertiary',
            children: 'View',
            className: 'pem--button-label'
          },
          // getAttributes: (row, cellValue, config) => {
          //   return {
          //     children: 'Ver. ' + row.version
          //   };
          // },
          onAction: (...args) => {
            return page.uiGotoDetails.apply(page, args);
          }
        },
        {
          id: 'playIcon',
          label: '',
          value: '',
          sortable: '',
          displayType: 'button',
          attributes: {
            renderIcon: PlayFilledAlt,
            className: 'circle',
            iconDescription: 'Icon Description',
            hasIconOnly: true,
            size: 'sm'
          }
        }
      ],
      filterConfig: {
        onApply: (...args) => {
          return page.datatable.partnersActivities.applyFilter.apply(page, args);
        },
        onCancel: (...args) => {
          return {};
        },
        onClear: (...args) => {
          return page.datatable.partnersActivities.clearFilter.apply(page, args);
        },
        fields: [
          {
            type: 'input',
            label: 'mod-activity-monitoring:dashboardList.filters.partnerName',
            name: 'partnerName',
            id: 'partnerName'
          },
          {
            type: 'input',
            label: 'mod-activity-monitoring:dashboardList.filters.definitionName',
            name: 'definitionName',
            id: 'definitionName'
          },
          {
            type: 'checkbox-group',
            label: 'mod-activity-monitoring:dashboardList.filters.status',
            name: 'status',
            id: 'status',
            options: [
              {
                type: 'checkbox',
                name: 'notStarted',
                id: 'notStarted',
                label: 'mod-activity-monitoring:dashboardList.filters.notStarted',
                value: 'notStarted'
              },
              {
                type: 'checkbox',
                name: 'inProgress',
                id: 'inProgress',
                label: 'mod-activity-monitoring:dashboardList.filters.inProgress',
                value: 'inProgress'
              },
              {
                type: 'checkbox',
                name: 'completed',
                id: 'completed',
                label: 'mod-activity-monitoring:dashboardList.filters.completed',
                value: 'completed'
              },
              {
                type: 'checkbox',
                name: 'closed',
                id: 'closed',
                label: 'mod-activity-monitoring:dashboardList.filters.closed',
                value: 'closed'
              },
              {
                type: 'checkbox',
                name: 'sponsorAction',
                id: 'sponsorAction',
                label: 'mod-activity-monitoring:dashboardList.filters.sponsorAction',
                value: 'sponsorAction'
              }
            ]
          }
        ]
      },
      actionsConfig: {
        filterBatchActions: (...args) => {
          return page._filterBatchActions.apply(page, args);
        },
        filterRowActions: (...args) => {
          return page._filterBatchActions.apply(page, args);
        },
        rowActions: [
          {
            id: 'addPartners',
            label: 'mod-activity-monitoring:dashboardList.actions.addPartners',
            type: 'row',
            onAction: (...args) => {
              return page.uiAddPartner.apply(page, args);
            },
            resourceKey: ''
          },
          {
            id: 'closeActivity',
            label: 'mod-activity-monitoring:dashboardList.actions.closeActivity',
            type: 'row',
            onAction: (...args) => {
              return page.uiCloseActivity.apply(page, args);
            },
            resourceKey: ''
          }
        ],

        batchActions: [],
        search: {
          id: 'search',
          label: 'mod-activity-monitoring:dashboardList.actions.search',
          type: 'search',
          onAction: (...args) => {
            return page.datatable.partnersActivities.search.apply(page, args);
          },
          resourceKey: ''
        }
      },
      paginationConfig: {
        type: 'simple',
        mode: 'server',
        pageSize: 10,
        pageSizes: [5, 10, 20, 50],
        onChange: (...args) => {
          return page.datatable.partnersActivities.paginationChange.apply(page, args);
        }
      },
      emptyStateConfig: {
        filterSearchNoData: {
          name: 'shell:common.emptyState.no_result_found',
          image: '',
          title: 'shell:common.emptyState.no_result_found',
          description: 'shell:common.emptyState.message',
          secondaryAction: 'shell:common.emptyState.reset_filters',
          onSecondaryAction: (...args) => {
            return page.datatable.partnersActivities.reset.apply(page, args);
          }
        },
        initNoData: {
          name: 'noRecordsInit',
          image: '',
          title: 'mod-activity-monitoring:dashboardList.emptyStates.initNoRecords.title'
        }
      }
    },
    internalActivities: {
      rowConfig: { select: 'none', onSort: null, onSelect: null },
      columnConfig: [
        {
          id: 'description',
          label: '',
          value: 'description',
          isSortable: false,
          displayType: 'tooltip',
          className: 'icon-column',
          getAttributes: (row, cellValue, config) => {
            return {
              icon: row.description ? Information : null,
              tooltipText: row.description
            };
          }
        },
        {
          id: 'name',
          label: 'mod-activity-monitoring:dashboardList.columns.name',
          value: 'name',
          sortable: '',
          displayType: 'link',
          onAction: (...args) => {
            return page.uiGotoDetails.apply(page, args);
          }
        },
        {
          id: 'version',
          label: 'mod-activity-monitoring:dashboardList.columns.version',
          value: 'definitionName',
          sortable: '',
          displayType: 'label'
          /* displayType: 'button',
                      getAttributes: (row, cellValue, config) => {
                          return {
                              kind: 'tertiary',
                              
                          };
                      } */
        },
        {
          id: 'status',
          label: 'mod-activity-monitoring:dashboardList.columns.status',
          value: 'status',
          sortable: '',
          displayType: 'tag-label',
          getAttributes: (row, cellValue, config) => {
            return {
              type: row.status === 'DRAFT' ? 'cool-gray' : row.status === 'FINAL' ? 'green' : 'red'
            };
          }
        }
      ],
      filterConfig: {
        onApply: (...args) => {
          return page.datatable.internalActivities.applyFilter.apply(page, args);
        },
        onCancel: (...args) => {
          return {};
        },
        onClear: (...args) => {
          return page.datatable.internalActivities.clearFilter.apply(page, args);
        },
        fields: [
          {
            type: 'checkbox-group',
            label: 'mod-activity-monitoring:dashboardList.filters.status',
            name: 'status',
            id: 'status',
            options: [
              {
                type: 'checkbox',
                name: 'DRAFT',
                id: 'DRAFT',
                label: 'mod-activity-monitoring:dashboardList.filters.draft',
                value: 'DRAFT'
              },
              {
                type: 'checkbox',
                name: 'FINAL',
                id: 'FINAL',
                label: 'mod-activity-monitoring:dashboardList.filters.final',
                value: 'FINAL'
              },
              {
                type: 'checkbox',
                name: 'DELETE',
                id: 'DELETE',
                label: 'mod-activity-monitoring:dashboardList.filters.delete',
                value: 'DELETE'
              }
            ]
          }
        ]
      },
      actionsConfig: {
        filterBatchActions: (...args) => {
          return page._filterBatchActions.apply(page, args);
        },
        filterRowActions: (...args) => {
          return page._filterBatchActions.apply(page, args);
        },
        rowActions: [
          {
            id: 'addPartners',
            label: 'mod-activity-monitoring:dashboardList.actions.addPartners',
            type: 'row',
            onAction: (...args) => {
              return page.uiAddPartner.apply(page, args);
            },
            resourceKey: ''
          },
          {
            id: 'closeActivity',
            label: 'mod-activity-monitoring:dashboardList.actions.closeActivity',
            type: 'row',
            onAction: (...args) => {
              return page.uiCloseActivity.apply(page, args);
            },
            resourceKey: ''
          }
        ],

        batchActions: [],
        search: {
          id: 'search',
          label: 'mod-activity-monitoring:dashboardList.actions.search',
          type: 'search',
          onAction: (...args) => {
            return page.datatable.internalActivities.search.apply(page, args);
          },
          resourceKey: ''
        },
        primary: {
          id: 'add',
          label: 'mod-activity-monitoring:dashboardList.actions.add',
          type: 'primary',
          onAction: (...args) => {
            return page._uiAddUser.apply(page, args);
          },
          resourceKey: 'VIEWPARTNER.ADD'
        }
      },
      paginationConfig: {
        type: 'simple',
        mode: 'server',
        pageSize: 10,
        pageSizes: [5, 10, 20, 50],
        onChange: (...args) => {
          return page.datatable.internalActivities.paginationChange.apply(page, args);
        }
      },
      emptyStateConfig: {
        filterSearchNoData: {
          name: 'shell:common.emptyState.no_result_found',
          image: '',
          title: 'shell:common.emptyState.no_result_found',
          description: 'shell:common.emptyState.message',
          secondaryAction: 'shell:common.emptyState.reset_filters',
          onSecondaryAction: (...args) => {
            return page.datatable.internalActivities.reset.apply(page, args);
          }
        },
        initNoData: {
          name: 'noRecordsInit',
          image: '',
          title: 'mod-activity-monitoring:dashboardList.emptyStates.initNoRecords.title'
        }
      }
    }
  };

  const { page } = Shell.usePage(
    [],
    (function Page(pageArgs, pageUtil) {
      return {
        model: {
          rolloutActivities: {
            // ----------TODO----------
            // _embedded: {
            //   data: []
            // },
            // page: {
            //   totalItems: 0
            // }
            mockRolloutData
          },
          partnersActivities: {
            // ----------TODO----------
            // _embedded: {
            //   data: []
            // },
            // page: {
            //   totalItems: 0
            // }
            mockPartnerData
          },
          internalActivities: {
            // ----------TODO----------
            // _embedded: {
            //   data: []
            // },
            // page: {
            //   totalItems: 0
            // }
            mockInternalData
          }
        },
        datasources: {
          getRolloutActivityList: {
            dataloader: 'ROLLOUT_ACTIVITY.LIST',
            inputModel: {},
            outputModel: 'rolloutActivities',
            init: false,
            loadingState: 'tableLoadingState'
          },
          getPartnersActivityList: {
            dataloader: 'PARTNERS_ACTIVITY.LIST',
            inputModel: {},
            outputModel: 'partnersActivities',
            init: false,
            loadingState: 'tableLoadingState'
          },
          getInternalActivityList: {
            dataloader: 'INTERNAL_ACTIVITY.LIST',
            inputModel: {},
            outputModel: 'internalActivities',
            init: false,
            loadingState: 'tableLoadingState'
          }
        },
        ui: {
          filter: {},
          searchText: '',
          pagination: {},
          tableLoadingState: false,
          tableEmptyState: undefined,
          view: 'table'
        },
        datatable: {
          rolloutActivities: {
            getListData: function (listInput) {
              const params = {
                pageNo: listInput.pagination.page,
                pageSize: listInput.pagination.pageSize
              };

              if (listInput.searchText) {
                params.name = 'con:' + listInput.searchText;
              }

              if (listInput.filter) {
                params.status = listInput.filter.status;
              }

              //return this.ds.getRolloutActivityList({}, { params: params });
            }
          },
          partnersActivities: {
            getListData: function (listInput) {
              const params = {
                pageNo: listInput.pagination.page,
                pageSize: listInput.pagination.pageSize
              };

              if (listInput.searchText) {
                params.name = 'con:' + listInput.searchText;
              }

              if (listInput.filter) {
                params.status = listInput.filter.status;
              }

              //return this.ds.getPartnersActivityList({}, { params: params });
            }
          },
          internalActivities: {
            getListData: function (listInput) {
              const params = {
                pageNo: listInput.pagination.page,
                pageSize: listInput.pagination.pageSize
              };

              if (listInput.searchText) {
                params.name = 'con:' + listInput.searchText;
              }

              if (listInput.filter) {
                params.status = listInput.filter.status;
              }

              // return this.ds.getInternalActivityList({}, { params: params });
            }
          }
        },
        init: function () {},
        _filterBatchActions: function (selectedRow, batchActionsObj) {},
        uiGotoDetails: function (selectedRow) {
          pageUtil.navigate(`${selectedRow.id}`, {});
        },
        uiAddPartner: function () {
          pageUtil.showPageModal('FUNCTIONALITY_NOT_IMPLEMENTED_MODAL.View', {});
        },
        uiCloseActivity: function () {
          pageUtil.showPageModal('FUNCTIONALITY_NOT_IMPLEMENTED_MODAL.View', {});
        }
      };
    })(pageArgs, pageUtil),
    pageConfig
  );

  return (
    <>
      <Tabs name="user">
        <TabList aria-label="tabs">
          <Tab name="rollout">
            <span className="tab-title">
              {pageUtil.t('mod-activity-monitoring:tabs.rolledOutActivities')} {`(${mockActivities.rolledOutActivities})`}{' '}
            </span>
          </Tab>
          <Tab name="partners">
            {pageUtil.t('mod-activity-monitoring:tabs.partnersActivities')} {`(${mockActivities.partnersActivities})`}
          </Tab>
          <Tab name="internal">
            {pageUtil.t('mod-activity-monitoring:tabs.internalActivities')} {`(${mockActivities.internalActivities})`}
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel name="rollout">
            <Grid fullWidth className="monitoring-grid">
              <Column sm={4} className="mon-col-margin">
                <Tile id="notStartActivities" className="monitoring-tile">
                  <div>
                    <div className="tile-label"> {pageUtil.t('mod-activity-monitoring:subTabs.notStartActivities')}</div>
                    <div className="tab-count">{mockRolloutData.notStartActivities}</div>
                  </div>
                </Tile>
              </Column>
              <Column sm={4} className="mon-col-margin">
                <Tile id="inProgressActivities" className="monitoring-tile">
                  <div>
                    <div className="tile-label">{pageUtil.t('mod-activity-monitoring:subTabs.inProgressActivities')}</div>
                    <div className="tab-count">{mockRolloutData.inProgressActivities}</div>
                  </div>
                </Tile>
              </Column>
              <Column sm={4} className="mon-col-margin">
                <Tile id="completedActivities" className="monitoring-tile">
                  <div>
                    <div className="tile-label">{pageUtil.t('mod-activity-monitoring:subTabs.completedActivities')}</div>
                    <div className="tab-count">{mockRolloutData.completedActivities}</div>
                  </div>
                </Tile>
              </Column>
              <Column sm={4} className="mon-col-margin">
                <Tile id="closedActivities" className="monitoring-tile">
                  <div>
                    <div className="tile-label"> {pageUtil.t('mod-activity-monitoring:subTabs.closedActivities')}</div>
                    <div className="tab-count">{mockRolloutData.closedActivities}</div>
                  </div>
                </Tile>
              </Column>
            </Grid>

            <Shell.DataTable
              data-testid="view-rollout-activity"
              className="sfg--datatable--view-rollout-activity pem--table-10-rows"
              data={page.model.rolloutActivities.mockRolloutData._embedded.data}
              config={pageConfig.rolloutActivities}
              controller={page.datatable.rolloutActivities}
              loadingState={page.ui.tableLoadingState}
              emptyState={page.datatable.rolloutActivities.emptyState}
              totalItems={page.model.rolloutActivities.mockRolloutData.page.totalItems}
            ></Shell.DataTable>
          </TabPanel>
          <TabPanel name="partners">
            <Grid fullWidth className="monitoring-grid">
              <Column sm={3} className="mon-col-margin">
                <Tile id="notStartPartnerActivities" className="monitoring-tile">
                  <div>
                    <div className="tile-label"> {pageUtil.t('mod-activity-monitoring:subTabs.notStartActivities')}</div>
                    <div className="tab-count">{mockPartnerData.notStartActivities}</div>
                  </div>
                </Tile>
              </Column>
              <Column sm={3} className="mon-col-margin">
                <Tile id="inProgressPartnerActivities" className="monitoring-tile">
                  <div>
                    <div className="tile-label">{pageUtil.t('mod-activity-monitoring:subTabs.inProgressActivities')}</div>
                    <div className="tab-count">{mockPartnerData.inProgressActivities}</div>
                  </div>
                </Tile>
              </Column>
              <Column sm={3} className="mon-col-margin">
                <Tile id="completedPartnerActivities" className="monitoring-tile">
                  <div>
                    <div className="tile-label">{pageUtil.t('mod-activity-monitoring:subTabs.completedActivities')}</div>
                    <div className="tab-count">{mockPartnerData.completedActivities}</div>
                  </div>
                </Tile>
              </Column>
              <Column sm={3} className="mon-col-margin">
                <Tile id="closedPartnerActivities" className="monitoring-tile">
                  <div>
                    <div className="tile-label"> {pageUtil.t('mod-activity-monitoring:subTabs.closedActivities')}</div>
                    <div className="tab-count">{mockPartnerData.closedActivities}</div>
                  </div>
                </Tile>
              </Column>
              <Column sm={4} className="mon-col-margin">
                <Tile id="sponsorAction" className="monitoring-tile">
                  <div>
                    <div className="tile-label">{pageUtil.t('mod-activity-monitoring:subTabs.sponsorAction')}</div>
                    <div className="tab-count">{mockPartnerData.sponsorAction}</div>
                  </div>
                </Tile>
              </Column>
            </Grid>
            <Shell.DataTable
              data-testid="view-partner-activity"
              className="sfg--datatable--view-partner-activity pem--table-10-rows"
              data={page.model.partnersActivities.mockPartnerData._embedded.data}
              config={pageConfig.partnersActivities}
              controller={page.datatable.partnersActivities}
              loadingState={page.ui.tableLoadingState}
              emptyState={page.datatable.partnersActivities.emptyState}
              totalItems={page.model.partnersActivities.mockPartnerData.page.totalItems}
            ></Shell.DataTable>
          </TabPanel>
          <TabPanel name="internal">
            <Grid fullWidth className="monitoring-grid">
              <Column sm={3} className="mon-col-margin">
                <Tile id="notStartInternalActivities" className="monitoring-tile">
                  <div>
                    <div className="tile-label"> {pageUtil.t('mod-activity-monitoring:subTabs.notStartActivities')}</div>
                    <div className="tab-count">{mockInternalData.notStartActivities}</div>
                  </div>
                </Tile>
              </Column>
              <Column sm={3} className="mon-col-margin">
                <Tile id="inProgressInternalActivities" className="monitoring-tile">
                  <div>
                    <div className="tile-label">{pageUtil.t('mod-activity-monitoring:subTabs.inProgressActivities')}</div>
                    <div className="tab-count">{mockInternalData.inProgressActivities}</div>
                  </div>
                </Tile>
              </Column>
              <Column sm={3} className="mon-col-margin">
                <Tile id="completedInternalActivities" className="monitoring-tile">
                  <div>
                    <div className="tile-label">{pageUtil.t('mod-activity-monitoring:subTabs.completedActivities')}</div>
                    <div className="tab-count">{mockInternalData.completedActivities}</div>
                  </div>
                </Tile>
              </Column>
              <Column sm={3} className="mon-col-margin">
                <Tile id="closedInternalActivities" className="monitoring-tile">
                  <div>
                    <div className="tile-label"> {pageUtil.t('mod-activity-monitoring:subTabs.closedActivities')}</div>
                    <div className="tab-count">{mockInternalData.closedActivities}</div>
                  </div>
                </Tile>
              </Column>
              <Column sm={4} className="mon-col-margin">
                <Tile id="onScheduleActivities" className="monitoring-tile">
                  <div>
                    <div className="tile-label">{pageUtil.t('mod-activity-monitoring:subTabs.onScheduleActivities')}</div>
                    <div className="tab-count">{mockInternalData.onScheduleActivities}</div>
                  </div>
                </Tile>
              </Column>
            </Grid>
            <Shell.DataTable
              data-testid="view-internal-activity"
              className="sfg--datatable--view-internal-activity pem--table-10-rows"
              data={page.model.internalActivities.mockInternalData._embedded.data}
              config={pageConfig.internalActivities}
              controller={page.datatable.internalActivities}
              loadingState={page.ui.tableLoadingState}
              emptyState={page.datatable.internalActivities.emptyState}
              totalItems={page.model.internalActivities.mockInternalData.page.totalItems}
            ></Shell.DataTable>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
}
