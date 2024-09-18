import React from 'react';
import { useParams } from 'react-router-dom';
import { Information, Close } from '@carbon/icons-react';
import Shell from '@b2bi/shell';
import { Tooltip } from '@carbon/react';
import '@b2bi/styles/pages/list-page.scss';
import '../../styles.scss';

import { mockPartnerTaskData } from '../../mockData';

const ListPage = () => {
  const pageArgs = useParams();
  const pageUtil = Shell.PageUtil();

  const { sidePageConfig } = Shell.useSidePage();

  const pageConfig = {
    partnerTasks: {
      rowConfig: { select: 'none', onSort: null, onSelect: null },
      columnConfig: [
        {
          id: 'taskAndOwner',
          label: 'mod-activity-monitoring:partnerTaskList.columns.taskAndOwner',
          value: 'taskAndOwner',
          sortable: '',
          displayType: 'custom',
          getCustomElements: (row, cellValue, config) => {
            return (
              <>
                <div className="owner-label">{row.task}</div>
                <div className="pem-information-wrapper">
                  <Tooltip align="right" label={row.email}>
                    <Information />
                  </Tooltip>
                  <span className="pem-information-text">{row.owner}</span>
                </div>
              </>
            );
          }
        },
        {
          id: 'status',
          label: 'mod-activity-monitoring:partnerTaskList.columns.status',
          value: 'status',
          sortable: '',
          displayType: 'tag-label',
          getAttributes: (row, cellValue, config) => {
            return {
              type: row.status === 'Not-Started' ? 'cool-gray' : row.status === 'Completed' ? 'green' : 'cyan'
            };
          }
        },
        {
          id: 'lastUpdated',
          label: 'mod-activity-monitoring:partnerTaskList.columns.lastUpdated',
          value: 'lastUpdated',
          sortable: '',
          displayType: 'label'
        },
        {
          id: 'action',
          label: 'mod-activity-monitoring:partnerTaskList.columns.actions',
          value: 'action',
          sortable: '',
          displayType: 'button',
          attributes: {
            kind: 'tertiary',
            children: 'View',
            className: 'pem--button-label'
          },
          onAction: (...args) => {
            return page.uiViewTask.apply(page, args);
          }
        }
      ],
      filterConfig: {
        onApply: (...args) => {
          return page.datatable.partnerTasks.applyFilter.apply(page, args);
        },
        onCancel: (...args) => {
          return {};
        },
        onClear: (...args) => {
          return page.datatable.partnerTasks.clearFilter.apply(page, args);
        },
        fields: [
          {
            type: 'checkbox-group',
            label: 'mod-activity-monitoring:partnerTaskList.filters.filterOptions',
            name: 'status',
            id: 'status',
            options: [
              {
                type: 'checkbox',
                name: 'sponsor',
                id: 'sponsor',
                label: 'mod-activity-monitoring:partnerTaskList.filters.sponsor',
                value: 'sponsor'
              },
              {
                type: 'checkbox',
                name: 'partner',
                id: 'partner',
                label: 'mod-activity-monitoring:partnerTaskList.filters.partner',
                value: 'partner'
              },
              {
                type: 'checkbox',
                name: 'system',
                id: 'system',
                label: 'mod-activity-monitoring:partnerTaskList.filters.system',
                value: 'system'
              },
              {
                type: 'checkbox',
                name: 'skipped',
                id: 'skipped',
                label: 'mod-activity-monitoring:partnerTaskList.filters.skipped',
                value: 'skipped'
              }
            ]
          },
          {
            type: 'checkbox-group',
            label: 'mod-activity-monitoring:partnerTaskList.filters.statusOptions',
            name: 'status',
            id: 'status',
            options: [
              {
                type: 'checkbox',
                name: 'inProgress',
                id: 'inProgress',
                label: 'mod-activity-monitoring:partnerTaskList.filters.inProgress',
                value: 'inProgress'
              },
              {
                type: 'checkbox',
                name: 'closed',
                id: 'closed',
                label: 'mod-activity-monitoring:partnerTaskList.filters.closed',
                value: 'closed'
              },
              {
                type: 'checkbox',
                name: 'notStarted',
                id: 'notStarted',
                label: 'mod-activity-monitoring:partnerTaskList.filters.notStarted',
                value: 'notStarted'
              },
              {
                type: 'checkbox',
                name: 'delayed',
                id: 'delayed',
                label: 'mod-activity-monitoring:partnerTaskList.filters.delayed',
                value: 'delayed'
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
            id: 'changeOwner',
            label: 'mod-activity-monitoring:partnerTaskList.actions.changeOwner',
            type: 'row',
            onAction: (...args) => {
              return page.uiChangeOwner.apply(page, args);
            },
            resourceKey: ''
          }
        ],
        batchActions: [],
        search: {
          id: 'search',
          label: 'mod-activity-monitoring:partnerTaskList.actions.search',
          type: 'search',
          onAction: (...args) => {
            return page.datatable.partnerTasks.search.apply(page, args);
          },
          resourceKey: ''
        },
        primary: {
          id: 'viewContextData',
          label: 'mod-activity-monitoring:partnerTaskList.actions.viewContextData',
          type: 'tertiary',
          kind: 'tertiary',
          onAction: (...args) => {
            return page.uiViewTask.apply(page, args);
          },
          resourceKey: 'PARTNER_TASK.ADD'
        }
      },
      paginationConfig: {
        type: 'simple',
        mode: 'server',
        pageSize: 10,
        pageSizes: [5, 10, 20, 50],
        onChange: (...args) => {
          return page.datatable.partnerTasks.paginationChange.apply(page, args);
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
            return page.datatable.partnerTasks.reset.apply(page, args);
          }
        },
        initNoData: {
          name: 'noRecordsInit',
          image: '',
          title: 'mod-activity-monitoring:partnerTaskList.emptyStates.initNoRecords.title'
        }
      }
    }
  };

  const { page } = Shell.usePage(
    [],
    (function Page(pageArgs, pageUtil) {
      return {
        model: {
          list: {
            /*  page: {
               totalItems: 0
             },
             _embedded: { data: [] } */
            mockPartnerTaskData
          }
        },
        datasources: {
          getList: {
            dataloader: 'PARTNER_TASK.LIST',
            inputModel: {},
            outputModel: 'list',
            init: false,
            loadingState: 'tableLoadingState'
            // handleOutput: ['_updateEmptyState']
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
          partnerTasks: {
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

              //return this.ds.getList({}, { params: params });
            }
          }
        },
        init: function () {},
        _filterBatchActions: function (selectedRow, batchActionsObj) {},
        uiViewTask: function (selectedRow) {
          pageUtil.showPageModal('FUNCTIONALITY_NOT_IMPLEMENTED_MODAL.View', {});
        },
        uiChangeOwner: function (selectedRow) {
          pageUtil.showPageModal('PARTNER_TASK.CHANGE_OWNER', {});
        }
      };
    })(pageArgs, pageUtil),
    pageConfig
  );

  const uiCloseSidePage = function () {
    sidePageConfig.onAction('cancel', {});
  };

  return (
    <Shell.Page type="LIST" className="sfg--page--viewpartner-list">
      <div onClick={uiCloseSidePage} className="close-side-page-icon">
        <Close />
      </div>
      <Shell.PageHeader title={`${pageUtil.t('mod-activity-monitoring:partnerTaskList.title')} Partner - 1`}></Shell.PageHeader>
      <Shell.PageBody>
        <Shell.DataTable
          className="sfg--datatable--partner-task-list pem--table-10-rows"
          data-testid="partner-task-list"
          controller={page?.datatable?.partnerTasks}
          data={page.model.list.mockPartnerTaskData._embedded.data}
          config={pageConfig?.partnerTasks}
          loadingState={page.ui.tableLoadingState}
          emptyState={page.datatable.partnerTasks.emptyState}
          totalItems={page.model.list.mockPartnerTaskData.page.totalItems}
        ></Shell.DataTable>
      </Shell.PageBody>
    </Shell.Page>
  );
};

export default ListPage;
