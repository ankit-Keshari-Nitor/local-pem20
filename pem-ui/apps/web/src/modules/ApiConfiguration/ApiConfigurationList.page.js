import React from 'react';
import Shell from '@b2bi/shell';
import { Add } from '@carbon/icons-react';
import '@b2bi/styles/pages/list-page.scss';

const ApiConfigurationList = ({ mode, context }) => {
  const pageUtil = Shell.PageUtil();
  const pageArgs = pageUtil.pageParams;

  const pageConfig = {
    apiConfigurationList: {
      showRefresh: true,
      rowConfig: { select: 'none', onSort: null, onSelect: null },
      columnConfig: [
        {
          id: 'name',
          label: 'mod-apic:list.columns.name',
          value: 'name',
          isSortable: false,
          displayType: 'link',
          onAction: (...args) => {
            return page.uiGotoDetails.apply(page, args);
          }
        },
        {
          id: 'protocol',
          label: 'mod-apic:list.columns.protocol',
          value: 'protocol',
          isSortable: false,
          displayType: 'label'
        },
        {
          id: 'host',
          label: 'mod-apic:list.columns.host',
          value: 'host',
          isSortable: false,
          displayType: 'label'
        },

        {
          id: 'port',
          label: 'mod-apic:list.columns.port',
          value: 'port',
          isSortable: false,
          displayType: 'label'
        }
      ],

      actionsConfig: {
        /*filterRowActions: (...args) => {
          return page._filterRowActions.apply(page, args);
        },*/
        rowActions: [
          {
            id: 'edit',
            label: 'shell:common.actions.edit',
            type: 'row',
            onAction: (...args) => {
              return page.uiEdit.apply(page, args);
            },
            resourceKey: `API_CONFIGURATION.EDIT`
          },
          {
            id: 'delete',
            label: 'shell:common.actions.delete',
            type: 'row',
            disabled: true,
            attributes: {
              hasDivider: true,
              isDelete: true,
              className: 'pem--button-label'
            },
            onAction: (...args) => {
              return page.uiDelete.apply(page, args);
            },
            resourceKey: `API_CONFIGURATION.DELETE`
          }
        ],

        search: {
          id: 'search',
          label: 'mod-apic:list.actions.search',
          type: 'search',
          onAction: (...args) => {
            return page.datatable.apiConfigurationList.search.apply(page, args);
          },
          resourceKey: ''
        },
        primary: {
          id: 'upload',
          label: 'shell:common.actions.add',
          kind: 'tertiary',
          icon: Add,
          onAction: (...args) => {
            return page.uiAdd.apply(page, args);
          },
          resourceKey: `FILE.UPLOAD`
        },
        toolbarActions: []
      },
      paginationConfig: {
        type: 'simple',
        mode: 'server',
        pageSize: 20,
        pageSizes: [5, 10, 20, 50],
        onChange: (...args) => {
          return page.datatable.apiConfigurationList.paginationChange.apply(page, args);
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
            return page.datatable.apiConfigurationList.reset.apply(page, args);
          }
        },
        initNoData: {
          name: 'noRecordsInit',
          image: '',
          title: 'mod-apic:list.emptyStates.initNoRecords.title'
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
            dataloader: `API_CONFIGURATION.LIST`,
            inputModel: {},
            outputModel: 'list',
            init: false,
            loadingState: 'tableLoadingState'
          }
        },
        ui: {
          tableLoadingState: false
        },
        datatable: {
          apiConfigurationList: {
            getListData: function (listInput) {
              const pageStart = listInput.pagination.page * listInput.pagination.pageSize;
              const pageEnd = (listInput.pagination.page + 1) * listInput.pagination.pageSize - 1;
              const params = {
                _range: `${pageStart}-${pageEnd}`
              };

              if (listInput.searchText) {
                params.searchText = listInput.searchText;
              }
              return this.ds.getList(
                {
                  sponsorContext: 'b2b'
                },
                { params: params }
              );
            }
          }
        },

        init: function () {},
        uiGotoDetails: function (selectedRow) {
          //pageUtil.navigate(`${selectedRow.id}`, {});
          pageUtil
            .showSidePage('API_CONFIGURATION.DETAILS', {
              apiConfiguration: {
                apiConfigurationKey: selectedRow.id
              }
            })
            .then((modalData) => {
              if (modalData.actionType === 'submit') {
              }
            });
          /*pageUtil
            .showPageModal('API_CONFIGURATION.DETAILS', {
              apiConfiguration: {
                apiConfigurationKey: selectedRow.id
              }
            })
            .then((modalData) => {
              if (modalData.actionType === 'submit') {
              }
            });*/
        },
        uiAdd: function () {
          pageUtil.navigate('add', {});
          /*pageUtil.showSidePage('API_CONFIGURATION.ADD', {}).then((modalData) => {
            if (modalData.actionType === 'submit') {
              this.datatable.apiConfigurationList.refresh();
            }
          });*/
          /*pageUtil.showPageModal('API_CONFIGURATION.ADD').then((modalData) => {
            if (modalData.actionType === 'submit') {
            }
          });*/
        },

        uiEdit: function (selectedRow, rowObj) {
          //pageUtil.navigate(`${selectedRow.id}/edit`);
          /*pageUtil
            .showSidePage('API_CONFIGURATION.EDIT', {
              apiConfiguration: {
                apiConfigurationKey: selectedRow.id
              }
            })
            .then((modalData) => {
              if (modalData.actionType === 'submit') {
                this.datatable.apiConfigurationList.refresh();
              }
            });*/
          pageUtil
            .showPageModal('API_CONFIGURATION.EDIT', {
              apiConfiguration: {
                apiConfigurationKey: selectedRow.id
              }
            })
            .then((modalData) => {
              if (modalData.actionType === 'submit') {
              }
            });
        }
      };
    })(pageArgs, pageUtil),
    pageConfig
  );

  return (
    <>
      <Shell.Page type="LIST" className="sfg--page--api-configuration-list">
        <Shell.PageHeader title={pageUtil.t('mod-apic:list.pageTitle')} description={pageUtil.t('mod-apic:list.pageDescription')}></Shell.PageHeader>
        <Shell.PageBody>
          <Shell.DataTable
            className={`sfg--datatable--file-list`}
            controller={page.datatable.apiConfigurationList}
            data={page.model.list.data}
            config={pageConfig.apiConfigurationList}
            loadingState={page.ui.tableLoadingState}
            emptyState={page.datatable.apiConfigurationList.emptyState}
            totalItems={page.model.list.meta.totalItems}
          ></Shell.DataTable>
        </Shell.PageBody>
        <Shell.PageActions></Shell.PageActions>
      </Shell.Page>
    </>
  );
};

export default ApiConfigurationList;
