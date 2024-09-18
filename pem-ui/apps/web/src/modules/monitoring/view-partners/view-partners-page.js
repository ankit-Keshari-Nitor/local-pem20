import React from 'react';
import { useParams } from 'react-router-dom';
import { Add, PlayFilledAlt } from '@carbon/icons-react';
import { Grid, Column } from '@carbon/react';
import Shell from '@b2bi/shell';
import '@b2bi/styles/pages/list-page.scss';

import { mockViewPartnersData } from '../mockData';

import '../styles.scss';

const ListPage = () => {
  const pageArgs = useParams();
  const pageUtil = Shell.PageUtil();

  const pageConfig = {
    viewPartnerList: {
      rowConfig: { select: 'none', onSort: null, onSelect: null },
      columnConfig: [
        {
          id: 'partnerName',
          label: 'mod-activity-monitoring:viewPartnerList.columns.partner',
          value: 'partnerName',
          sortable: '',
          displayType: 'link',
          onAction: (...args) => {
            return page.uiGotoDetails.apply(page, args);
          }
        },
        {
          id: 'currentTask',
          label: 'mod-activity-monitoring:viewPartnerList.columns.currentTask',
          value: 'currentTask',
          sortable: '',
          displayType: 'label'
        },
        {
          id: 'completed',
          label: 'mod-activity-monitoring:viewPartnerList.columns.completed',
          value: 'completed',
          sortable: '',
          displayType: 'label'
        },
        {
          id: 'skipped',
          label: 'mod-activity-monitoring:viewPartnerList.columns.skipped',
          value: 'skipped',
          sortable: '',
          displayType: 'label'
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
          id: 'status',
          label: 'mod-activity-monitoring:viewPartnerList.columns.status',
          value: 'status',
          sortable: '',
          displayType: 'tag-label',
          getAttributes: (row, cellValue, config) => {
            return {
              type: row.status === 'Not-Started' ? 'cool-gray' : row.status === 'In-Progress' ? 'cyan' : 'red'
            };
          }
        },
        {
          id: 'lastUpdated',
          label: 'mod-activity-monitoring:viewPartnerList.columns.lastUpdated',
          value: 'lastUpdated',
          sortable: '',
          displayType: 'label'
        },
        {
          id: 'action',
          label: 'mod-activity-monitoring:viewPartnerList.columns.action',
          value: 'action',
          sortable: '',
          displayType: 'button',
          attributes: {
            kind: 'tertiary',
            children: 'View Tasks',
            className: 'pem--button-label'
          },
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
            size: 'sm',
          },
          onAction: (...args) => {
            return page.uiExecuteTask.apply(page, args);
          }
        }
      ],
      filterConfig: {
        onApply: (...args) => {
          return page.datatable.viewPartnerList.applyFilter.apply(page, args);
        },
        onCancel: (...args) => {
          return {};
        },
        onClear: (...args) => {
          return page.datatable.viewPartnerList.clearFilter.apply(page, args);
        },
        fields: [
          {
            type: 'input',
            label: 'mod-activity-monitoring:viewPartnerList.filters.definitionName',
            name: 'definitionName',
            id: 'definitionName'
          },
          {
            type: 'checkbox-group',
            label: 'mod-activity-monitoring:viewPartnerList.filters.status',
            name: 'status',
            id: 'status',
            options: [
              {
                type: 'checkbox',
                name: 'closed',
                id: 'closed',
                label: 'mod-activity-monitoring:viewPartnerList.filters.closed',
                value: 'closed'
              },
              {
                type: 'checkbox',
                name: 'completed',
                id: 'completed',
                label: 'mod-activity-monitoring:viewPartnerList.filters.completed',
                value: 'completed'
              },
              {
                type: 'checkbox',
                name: 'inProgress',
                id: 'inProgress',
                label: 'mod-activity-monitoring:viewPartnerList.filters.inProgress',
                value: 'inProgress'
              },
              {
                type: 'checkbox',
                name: 'pending',
                id: 'pending',
                label: 'mod-activity-monitoring:viewPartnerList.filters.pending',
                value: 'pending'
              },
              {
                type: 'checkbox',
                name: 'error',
                id: 'error',
                label: 'mod-activity-monitoring:viewPartnerList.filters.error',
                value: 'error'
              },
              {
                type: 'checkbox',
                name: 'delayed',
                id: 'delayed',
                label: 'mod-activity-monitoring:viewPartnerList.filters.delayed',
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
            id: 'sendAlert',
            label: 'mod-activity-monitoring:viewPartnerList.actions.sendAlert',
            type: 'row',
            onAction: (...args) => {
              return page.uiSendAlert.apply(page, args);
            },
            resourceKey: 'VIEWPARTNER.EDIT'
          },
          {
            id: 'reOpenTask',
            label: 'mod-activity-monitoring:viewPartnerList.actions.reOpenTask',
            type: 'row',
            onAction: (...args) => {
              return page.uiReOpenTask.apply(page, args);
            },
            resourceKey: 'VIEWPARTNER.EDIT'
          },
          {
            id: 'modifyDueDate',
            label: 'mod-activity-monitoring:viewPartnerList.actions.modifyDueDate',
            type: 'row',
            onAction: (...args) => {
              return page.uiModifyDueDate.apply(page, args);
            },
            resourceKey: 'VIEWPARTNER.START_ACTIVITY'
          },
          {
            id: 'closeActivity',
            label: 'mod-activity-monitoring:viewPartnerList.actions.closeActivity',
            type: 'row',
            onAction: (...args) => {
              return page.uiCloseActivity.apply(page, args);
            },
            resourceKey: 'VIEWPARTNER.RESET_PASSWORD'
          }
        ],
        batchActions: [],
        search: {
          id: 'search',
          label: 'mod-activity-monitoring:viewPartnerList.actions.search',
          type: 'search',
          onAction: (...args) => {
            return page.datatable.viewPartnerList.search.apply(page, args);
          },
          resourceKey: ''
        },
        primary: {
          id: 'addPartner',
          label: 'mod-activity-monitoring:viewPartnerList.actions.addPartner',
          type: 'primary',
          icon: Add,
          onAction: (...args) => {
            return page.uiAddPartner.apply(page, args);
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
          return page.datatable.viewPartnerList.paginationChange.apply(page, args);
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
            return page.datatable.viewPartnerList.reset.apply(page, args);
          }
        },
        initNoData: {
          name: 'noRecordsInit',
          image: '',
          title: 'mod-activity-monitoring:viewPartnerList.emptyStates.initNoRecords.title'
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
            mockViewPartnersData
            /*  page: {
               totalItems: 0
             },
             _embedded: { data: [] } */
          }
        },
        datasources: {
          getList: {
            dataloader: 'VIEWPARTNER.LIST',
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
          viewPartnerList: {
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
                // Add the Filter Options
              }
              //return this.ds.getList({}, { params: params });
            }
          }
        },
        init: function () { },
        _filterBatchActions: function (selectedRow, batchActionsObj) { },
        uiGotoDetails: function (selectedRow) {
          pageUtil.showSidePage('PARTNER_TASK.LIST', {});
        },
        uiSendAlert: function () {
          pageUtil.showPageModal('FUNCTIONALITY_NOT_IMPLEMENTED_MODAL.View', {});
        },
        uiReOpenTask: function () {
          pageUtil.showPageModal('FUNCTIONALITY_NOT_IMPLEMENTED_MODAL.View', {});
        },
        uiModifyDueDate: function () {
          pageUtil.showPageModal('FUNCTIONALITY_NOT_IMPLEMENTED_MODAL.View', {});
        },
        uiCloseActivity: function () {
          pageUtil.showPageModal('FUNCTIONALITY_NOT_IMPLEMENTED_MODAL.View', {});
        },
        uiAddPartner: function () {
          pageUtil.showPageModal('FUNCTIONALITY_NOT_IMPLEMENTED_MODAL.View', {});
        },
        uiExecuteTask: function () {
          pageUtil.showPageModal('FUNCTIONALITY_NOT_IMPLEMENTED_MODAL.View', {});
        }
      };
    })(pageArgs, pageUtil),
    pageConfig
  );

  return (
    <Shell.Page type="LIST" className="sfg--page--viewpartner-list">
      <Grid fullWidth className="view-partner-container">
        <Column sm={4} className="view-partner-count-container">
          <div>
            <span className="view-partner-header-wrapper">
              <div className="view-partner-header-key">{pageUtil.t('mod-activity-monitoring:viewPartnerList.startDate')}</div>
              <div className="view-partner-header-key">{pageUtil.t('mod-activity-monitoring:viewPartnerList.description')}</div>
              <div className="view-partner-header-key">{pageUtil.t('mod-activity-monitoring:viewPartnerList.contextData')}</div>
              <div className="view-partner-header-key">{pageUtil.t('mod-activity-monitoring:viewPartnerList.activityDefinition')}</div>
            </span>
            <span className="view-partner-header-wrapper-mg">
              <div className="view-partner-header-value">Jun 2, 2024 1:00:29 pm</div>
              <div className="view-partner-header-value">Description text will be here</div>
              <div className="view-partner-header-link">{pageUtil.t('mod-activity-monitoring:viewPartnerList.clickToView')}</div>
              <div className="view-partner-header-link">Definition 1</div>
            </span>
          </div>
        </Column>
        <Column sm={2} className="view-partner-count-container">
          <div>
            <div className="content-title"> {pageUtil.t('mod-activity-monitoring:viewPartnerList.totalTask')}</div>
            <div className="tab-count">06</div>
          </div>
        </Column>
        <Column sm={2} className="view-partner-count-container">
          <div>
            <div className="content-title"> {pageUtil.t('mod-activity-monitoring:viewPartnerList.participants')}</div>{' '}
            <div className="tab-count">{mockViewPartnersData.participants}</div>
          </div>
        </Column>
        <Column sm={2} className="view-partner-count-container">
          <div>
            <div className="content-title"> {pageUtil.t('mod-activity-monitoring:viewPartnerList.onSchedule')}</div>{' '}
            <div className="tab-count">{mockViewPartnersData.onSchedule}</div>
          </div>
        </Column>
        <Column sm={2} className="view-partner-count-container">
          <div>
            <div className="content-title"> {pageUtil.t('mod-activity-monitoring:viewPartnerList.delayed')}</div> <div className="tab-count">{mockViewPartnersData.delayed}</div>
          </div>
        </Column>
        <Column sm={2} className="view-partner-count-container">
          <div>
            <div className="content-title"> {pageUtil.t('mod-activity-monitoring:viewPartnerList.completed')}</div>{' '}
            <div className="tab-count">{mockViewPartnersData.completed}</div>
          </div>
        </Column>
        <Column sm={2} className="view-partner-count-container">
          <div>
            <div className="content-title"> {pageUtil.t('mod-activity-monitoring:viewPartnerList.sponsorAction')}</div>{' '}
            <div className="tab-count">{mockViewPartnersData.sponsorAction}</div>
          </div>
        </Column>
      </Grid>

      <Shell.PageBody>
        <Shell.DataTable
          className="sfg--datatable--view-partners-list pem--table-10-rows"
          data-testid="view-partners-list"
          controller={page?.datatable?.viewPartnerList}
          data={page.model.list.mockViewPartnersData._embedded.data}
          config={pageConfig?.viewPartnerList}
          loadingState={page.ui.tableLoadingState}
          emptyState={page.datatable.viewPartnerList.emptyState}
          totalItems={page.model.list.mockViewPartnersData.page.totalItems}
        ></Shell.DataTable>
      </Shell.PageBody>
    </Shell.Page>
  );
};

export default ListPage;
