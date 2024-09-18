import React from 'react';
import Shell from '@b2bi/shell';
import { Add, CheckmarkFilled, ErrorFilled } from '@carbon/icons-react';
import '@b2bi/styles/pages/list-page.scss';


const FileList = ({ mode, context }) => {
  const pageUtil = Shell.PageUtil();
  const pageArgs = pageUtil.pageParams;

  const pageConfig = {
    fileList: {
      showRefresh: true,
      rowConfig: { select: 'none', onSort: null, onSelect: null },
      columnConfig: [
        {
          id: 'documentName',
          label: 'mod-file:list.columns.documentName',
          value: 'documentName',
          isSortable: false,
          displayType: 'link',
          onAction: (...args) => {
            return page.uiGotoDetails.apply(page, args);
          }
        },
        {
          id: 'createdBy',
          label: 'mod-file:list.columns.createdBy',
          value: 'createdBy',
          isSortable: false,
          displayType: 'label',
          onAction: (...args) => {
            return page.uiGotoDetails.apply(page, args);
          }
        },
        {
          id: 'documentCategory',
          label: 'mod-file:list.columns.documentCategory',
          value: 'documentCategory.display',
          isSortable: false,
          displayType: 'label'
        },

        {
          id: 'isEncrypted',
          label: 'mod-file:list.columns.isEncrypted',
          value: 'isEncrypted.display',
          isSortable: false,
          displayType: 'tag-label',
          getAttributes: (row, cellValue, columnConfig) => {
            return {
              type: row.isEncrypted.code === 'TRUE' ? 'green' : 'cool-gray',
              icon: row.isEncrypted.code === 'TRUE' ? CheckmarkFilled : ErrorFilled,
              iconClassName: row.isEncrypted.code === 'TRUE' ? 'sfg--icon-active' : 'sfg--icon--inactive'
            };
          }
        },
        {
          id: 'scanStatus',
          label: 'mod-file:list.columns.scanStatus',
          value: 'scanStatus.display',
          isSortable: false,
          displayType: 'label'
        },
        {
          id: 'contentType',
          label: 'mod-file:list.columns.contentType',
          value: 'contentType',
          isSortable: false,
          displayType: 'label'
        },
        {
          id: 'createTs',
          label: 'mod-file:list.columns.createTs',
          value: 'createTs',
          isSortable: false,
          displayType: 'label'
        },
        {
          id: 'contentLength',
          label: 'mod-file:list.columns.contentLength',
          value: 'contentLength',
          isSortable: false,
          displayType: 'label'
        }
      ],
      filterConfig: {
        onApply: (...args) => {
          return page.datatable.fileList.applyFilter.apply(page, args);
        },
        onCancel: (...args) => {
          return {};
        },
        onClear: (...args) => {
          return page.datatable.fileList.clearFilter.apply(page, args);
        },
        fields: [
          {
            type: 'checkbox-group',
            label: 'mod-file:list.columns.documentCategory',
            name: 'documentCategory',
            param: 'documentCategory',
            id: 'documentCategory',
            options: [
              {
                type: 'checkbox',
                name: 'ACTIVITY',
                id: 'ACTIVITY',
                label: 'mod-file:list.filters.documentCategory_ACTIVITY',
                value: 'ACTIVITY'
              },
              {
                type: 'checkbox',
                name: 'LOGO',
                id: 'LOGO',
                label: 'mod-file:list.filters.documentCategory_LOGO',
                value: 'LOGO'
              }
            ]
          }
        ]
      },
      actionsConfig: {
        /*filterRowActions: (...args) => {
          return page._filterRowActions.apply(page, args);
        },*/
        rowActions: [
          {
            id: 'download',
            label: 'shell:common.actions.download',
            type: 'row',
            onAction: (...args) => {
              return page.uiDownloadKey.apply(page, args);
            },
            resourceKey: `FILE.DOWNLOAD`
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
            resourceKey: `FILE.DELETE`
          }
        ],

        search: {
          id: 'search',
          label: 'mod-file:list.actions.search',
          type: 'search',
          onAction: (...args) => {
            return page.datatable.fileList.search.apply(page, args);
          },
          resourceKey: ''
        },
        primary: {
          id: 'upload',
          label: 'shell:common.actions.upload',
          kind: 'tertiary',
          icon: Add,
          onAction: (...args) => {
            return page.uiUploadKey.apply(page, args);
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
          return page.datatable.fileList.paginationChange.apply(page, args);
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
            return page.datatable.fileList.reset.apply(page, args);
          }
        },
        initNoData: {
          name: 'noRecordsInit',
          image: '',
          title: 'mod-file:list.emptyStates.initNoRecords.title'
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
            dataloader: `FILE.LIST`,
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
          fileList: {
            getListData: function (listInput) {
              const pageStart = listInput.pagination.page * listInput.pagination.pageSize;
              const pageEnd = (listInput.pagination.page + 1) * listInput.pagination.pageSize - 1;
              const params = {
                _range: `${pageStart}-${pageEnd}`
              };
              if (listInput.filter?.documentCategory) {
                params.documentCategory = listInput.filter.documentCategory;
              } else {
                params.documentCategory = ['ACTIVITY', 'LOGO'];
              }
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
          pageUtil.navigate(`${selectedRow.id}`, {});
          /*pageUtil.showSidePage('FILE.DETAILS').then((sidePageData) => {
            if (sidePageData.actionType === 'submit') {
            }
          });*/
        },
        uiUploadKey: function () {
          pageUtil.navigate('upload', {});
          /*pageUtil.showSidePage('FILE.UPLOAD').then((sidePageData) => {
            if (sidePageData.actionType === 'submit') {
            }
          });*/
          /*pageUtil.showPageModal('FILE.UPLOAD').then((modalData) => {
            if (modalData.actionType === 'submit') {
            }
          });*/
        },

        uiDownloadFile: function (selectedRow, rowObj) {
          pageUtil
            .showPageModal('FILE.DOWNLOAD', {
              file: rowObj
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
      <Shell.Page type="LIST" className="sfg--page--file-list">
        <Shell.PageHeader title={pageUtil.t('mod-file:list.pageTitle')} description={pageUtil.t('mod-file:list.pageDescription')}></Shell.PageHeader>
        <Shell.PageBody>
          <Shell.DataTable
            className={`sfg--datatable--file-list`}
            controller={page.datatable.fileList}
            data={page.model.list.data}
            config={pageConfig.fileList}
            loadingState={page.ui.tableLoadingState}
            emptyState={page.datatable.fileList.emptyState}
            totalItems={page.model.list.meta.totalItems}
          ></Shell.DataTable>
        </Shell.PageBody>
        <Shell.PageActions></Shell.PageActions>
      </Shell.Page>
    </>
  );
};

export default FileList;
