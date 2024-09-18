import React from 'react';
import { useParams } from 'react-router-dom';
import { Section } from '@carbon/react';
import Shell from '@b2bi/shell';
import '@b2bi/styles/pages/list-page.scss';

const ListPage = () => {
  const pageArgs = useParams();
  const pageUtil = Shell.PageUtil();
  const pageConfig = {
    partnerList: {
      rowConfig: { select: 'none', onSort: null, onSelect: null },
      columnConfig: [
        {
          id: 'name',
          label: 'mod-partner:list.columns.name',
          value: 'nameOfCompany',
          sortable: '',
          displayType: 'link',
          onAction: (...args) => {
            return page.uiGotoDetails.apply(page, args);
          }
        },
        {
          id: 'website',
          label: 'mod-partner:list.columns.website',
          value: 'website',
          sortable: '',
          displayType: 'link',
          onAction: (...args) => {
            return page.uiGotoWebsite.apply(page, args);
          }
        },
        {
          id: 'status',
          label: 'mod-partner:list.columns.status',
          value: 'status.display',
          sortable: '',
          displayType: 'label'
        }
      ],
      filterConfig: {
        onApply: (...args) => {
          return page.datatable.partnerList.applyFilter.apply(page, args);
        },
        onCancel: (...args) => {
          return {};
        },
        onClear: (...args) => {
          return page.datatable.partnerList.clearFilter.apply(page, args);
        },
        fields: [
          {
            type: 'radio-group',
            label: 'mod-partner:list.filters.status',
            name: 'status',
            id: 'status',
            options: [
              {
                type: 'radio',
                name: 'APPROVED',
                id: 'APPROVED',
                label: 'mod-partner:list.filters.APPROVED',
                value: 'APPROVED'
              },
              {
                type: 'radio',
                name: 'PENDING',
                id: 'PENDING',
                label: 'mod-partner:list.filters.PENDING',
                value: 'PENDING'
              },
              {
                type: 'radio',
                name: 'INACTIVE',
                id: 'INACTIVE',
                label: 'mod-partner:list.filters.INACTIVE',
                value: 'INACTIVE'
              },
              {
                type: 'radio',
                name: 'REGISTRATION_PENDING',
                id: 'REGISTRATION_PENDING',
                label: 'mod-partner:list.filters.REGISTRATION_PENDING',
                value: 'REGISTRATION_PENDING'
              },
              {
                type: 'radio',
                name: 'REJECTED',
                id: 'REJECTED',
                label: 'mod-partner:list.filters.REJECTED',
                value: 'REJECTED'
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
            id: 'edit',
            label: 'mod-partner:list.actions.edit',
            type: 'row',
            onAction: (...args) => {
              return page._uiEdit.apply(page, args);
            },
            resourceKey: 'PARTNER.EDIT'
          },
          {
            id: 'startActivity',
            label: 'mod-partner:list.actions.startActivity',
            type: 'row',
            onAction: (...args) => {
              return page.uiRowActivate.apply(page, args);
            },
            resourceKey: 'PARTNER.START_ACTIVITY'
          },
          {
            id: 'resetPassword',
            label: 'mod-partner:list.actions.resetPassword',
            type: 'row',
            onAction: (...args) => {
              return page.uiRowDelete.apply(page, args);
            },
            resourceKey: 'PARTNER.RESET_PASSWORD'
          },
          {
            id: 'deactivate',
            label: 'mod-partner:list.actions.deactivate',
            type: 'row',
            onAction: (...args) => {
              return page.uiRowDeactivate.apply(page, args);
            },
            resourceKey: 'PARTNER.DEACTIVATE'
          }
        ],

        batchActions: [],
        search: {
          id: 'search',
          label: 'mod-partner:list.actions.search',
          type: 'search',
          onAction: (...args) => {
            return page.datatable.partnerList.search.apply(page, args);
          },
          resourceKey: ''
        },
        primary: {
          id: 'add',
          label: 'mod-partner:list.actions.add',
          type: 'primary',
          onAction: (...args) => {
            return page._uiAddUser.apply(page, args);
          },
          resourceKey: 'PARTNER.ADD'
        },
        toolbarActions: [
          {
            id: 'invite',
            type: 'secondary',
            label: 'mod-partner:list.actions.invite',
            kind: 'ghost',
            iconOnly: false,
            onAction: (...args) => {
              return page.uiInvitePartner.apply(page, args);
            },
            resourceKey: 'PARTNER.INVITE'
          }
        ]
      },
      paginationConfig: {
        type: 'simple',
        mode: 'server',
        pageSize: 20,
        pageSizes: [5, 10, 20, 50],
        onChange: (...args) => {
          return page.datatable.partnerList.paginationChange.apply(page, args);
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
            return page.datatable.userList.reset.apply(page, args);
          }
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
            data: [],
            meta: {
              totalItems: 0
            }
          }
        },
        datasources: {
          getList: {
            dataloader: 'PARTNER.LIST',
            inputModel: {},
            outputModel: 'list',
            init: false,
            loadingState: 'tableLoadingState'
            // handleOutput: ['_updateEmptyState']
          }
        },
        ui: {
          tableLoadingState: false,
          tableEmptyState: undefined
        },
        datatable: {
          partnerList: {
            getListData: function (listInput) {
              const pageStart = listInput.pagination.page * listInput.pagination.pageSize;
              const pageEnd = (listInput.pagination.page + 1) * listInput.pagination.pageSize - 1;
              const params = {
                _range: `${pageStart}-${pageEnd}`
              };
              if (listInput.filter?.status) {
                params.status = listInput.filter.status;
              }
              if (listInput.searchText) {
                params.searchText = listInput.searchText;
              }
              return this.ds.getList({}, { params: params });
            }
          }
        },
        init: function () {},
        _filterBatchActions: function (selectedRow, batchActionsObj) {}
      };
    })(pageArgs, pageUtil),
    pageConfig
  );
  return (
    <Shell.Page type="LIST" className="sfg--page--partner-list">
      <Shell.PageHeader title={pageUtil.t('mod-partner:list.title')} description={pageUtil.t('mod-partner:list.pageDescription')}></Shell.PageHeader>
      <Section className="page-notification-container">
        <Shell.NotificationMessage></Shell.NotificationMessage>
      </Section>
      <Section className="page-body">
        <Shell.DataTable
          className={'sfg--datatable--user-list'}
          data-testid="partnerlist"
          controller={page.datatable.partnerList}
          data={page.model.list.data}
          config={pageConfig.partnerList}
          loadingState={page.ui.tableLoadingState}
          emptyState={page.ui.tableEmptyState}
          totalItems={page.model.list.meta.totalItems}
        ></Shell.DataTable>
      </Section>
    </Shell.Page>
  );
};

export default ListPage;
