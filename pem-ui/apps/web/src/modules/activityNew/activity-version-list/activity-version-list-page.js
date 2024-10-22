import React from 'react';
import { useParams } from 'react-router-dom';
import { Information, Close, Delete } from '@carbon/icons-react';
import Shell from '@b2bi/shell';
import { Tooltip, Tag, Button } from '@carbon/react';
import '@b2bi/styles/pages/list-page.scss';
import '../styles.scss';

import useActivityStore from '../../activity/store';

import { capitalizeFirstLetter } from '../../activity/constants';


const VersionListPage = () => {

  const store = useActivityStore();

  const pageArgs = useParams();
  const pageUtil = Shell.PageUtil();

  const { sidePageConfig } = Shell.useSidePage();

  let activityDefnKey = sidePageConfig.data.data.activityDefnKey;
  let activityName = sidePageConfig.data.data.activityName

  const pageConfig = {
    versionList: {
      showToolbar: false,
      rowConfig: { select: 'none', onSort: null, onSelect: null },
      columnConfig: [
        {
          id: 'version',
          label: 'mod-activity-version-list:versionList.columns.version',
          value: 'version',
          isSortable: false,
          displayType: 'custom',
          getCustomElements: (row, cellValue, config) => {
            return (
              <div className="pem-information-wrapper">
                {row.description !== '' ? (
                  <Tooltip align="right" label={row.description}>
                    <Information className="information-icon" />
                  </Tooltip>
                ) : null}
                <span className="pem-information-text">Ver. {row.version}</span>
                {row.isDefault ? <Tag type="cyan">Default</Tag> : null}
              </div>
            );
          }
        },
        {
          id: 'status',
          label: 'mod-activity-version-list:versionList.columns.status',
          value: 'status',
          sortable: '',
          displayType: 'custom',
          getCustomElements: (row, cellValue, config) => {
            let type = row.status === 'DRAFT' ? 'cool-gray' : row.status === 'FINAL' ? 'green' : 'red'
            return (
              <Tag size="sm" type={type}>
                <span className="cds--text-truncate--end" title={row.status}>
                  {capitalizeFirstLetter(row.status)}
                </span>
              </Tag>
            );
          }
        },
        {
          id: 'action',
          label: 'mod-activity-version-list:versionList.columns.actions',
          value: 'primaryAction',
          isSortable: false,
          displayType: 'custom',
          onAction: (...args) => {
            let action = args[0].status === 'DRAFT' ? pageUtil.t('mod-activity-list:list.actions.markAsFinal') : args[0].status === 'FINAL' ? pageUtil.t('mod-activity-list:list.actions.rollout') : pageUtil.t('mod-activity-list:list.actions.restore')
            let actVersionKey = args[0].activityDefnVersionKey;

            return page.uiOnCellActionClick.apply(page, [action, actVersionKey]);
          },
          getCustomElements: (row, cellValue, config) => {
            return (
              <>
                {row.status === 'DELETE' ?
                  <Button kind="tertiary" onClick={() => {
                    page.uiOnCellActionClick.apply(page, [pageUtil.t('mod-activity-list:list.actions.delete'), row.id]);
                  }}
                    size="sm" data-testid={`restore-${row.id}`} className='action-item action-item-delete'>
                    {pageUtil.t('mod-activity-list:list.actions.restore')}
                  </Button>
                  : row.status === 'DRAFT' ? <Button kind="tertiary" onClick={() => {
                    page.uiOnCellActionClick.apply(page, [pageUtil.t('mod-activity-list:list.actions.markAsFinal'), row.id]);
                  }} size="sm" data-testid={`markAsFinal-${row.id}`} className='action-item'>
                    {pageUtil.t('mod-activity-list:list.actions.markAsFinal')}
                  </Button> : row.status === 'FINAL' && row.isDefault ?
                    <Button kind="tertiary" onClick={() => {
                      page.uiOnCellActionClick.apply(page, [pageUtil.t('mod-activity-list:list.actions.rollout'), row.id]);
                    }}
                      size="sm" data-testid={`rollout-${row.id}`} className='action-item'>
                      {pageUtil.t('mod-activity-list:list.actions.rollout')}
                    </Button> : null}
              </>
            )
          }
        }
      ],
      actionsConfig: {
        filterRowActions: (...args) => {
          return page._filterRowActions.apply(page, args);
        },
        rowActions: [
          {
            id: 'view',
            label: 'mod-activity-version-list:versionList.actions.view',
            type: 'row',
            resourceKey: `DEFINITION.VIEW`,
            onAction: (...args) => {
              let action = pageUtil.t('mod-activity-version-list:versionList.actions.view');
              let activityDefnVersionKey = args[1].activityDefnVersionKey;

              return page.uiOnCellActionClick.apply(page, [action, activityDefnVersionKey]);
            },
          },
          {
            id: 'edit',
            label: 'mod-activity-version-list:versionList.actions.edit',
            type: 'row',
            resourceKey: `DEFINITION.EDIT`,
            onAction: (...args) => {
              let action = pageUtil.t('mod-activity-version-list:versionList.actions.edit');
              let activityDefnVersionKey = args[1].activityDefnVersionKey;

              return page.uiOnCellActionClick.apply(page, [action, activityDefnVersionKey]);
            },
          },
          {
            id: 'exportVersion',
            label: 'mod-activity-version-list:versionList.actions.exportVersion',
            type: 'row',
            resourceKey: '',
            onAction: (...args) => {
              let action = pageUtil.t('mod-activity-version-list:versionList.actions.exportVersion');
              let activityDefnVersionKey = args[1].activityDefnVersionKey;

              return page.uiOnCellActionClick.apply(page, [action, activityDefnVersionKey]);
            },
          },
          {
            id: 'markAsDefault',
            label: 'mod-activity-version-list:versionList.actions.markAsDefault',
            type: 'row',
            resourceKey: '',
            onAction: (...args) => {
              let action = pageUtil.t('mod-activity-version-list:versionList.actions.markAsDefault')
              let actVersionKey = args[1].activityDefnVersionKey;
              return page.uiOnCellActionClick.apply(page, [action, actVersionKey]);
            }
          },
          {
            id: 'testVersion',
            label: 'mod-activity-version-list:versionList.actions.testVersion',
            type: 'row',
            resourceKey: '',
            onAction: (...args) => {
              let action = pageUtil.t('mod-activity-version-list:versionList.actions.testVersion');
              let activityDefnVersionKey = args[1].activityDefnVersionKey;

              return page.uiOnCellActionClick.apply(page, [action, activityDefnVersionKey]);
            },
          },
          {
            id: 'cloneVersion',
            label: 'mod-activity-version-list:versionList.actions.cloneVersion',
            type: 'row',
            resourceKey: '',
            onAction: (...args) => {
              let action = pageUtil.t('mod-activity-version-list:versionList.actions.cloneVersion');
              let activityDefnVersionKey = args[1].activityDefnVersionKey;

              return page.uiOnCellActionClick.apply(page, [action, activityDefnVersionKey]);
            },
          },
          {
            id: 'shareUnshared',
            label: 'mod-activity-version-list:versionList.actions.shareUnshared',
            type: 'row',
            resourceKey: '',
            onAction: (...args) => {
              let action = pageUtil.t('mod-activity-version-list:versionList.actions.shareUnshared');
              let activityDefnVersionKey = args[1].activityDefnVersionKey;

              return page.uiOnCellActionClick.apply(page, [action, activityDefnVersionKey]);
            },
          },
          {
            id: 'delete',
            label: 'mod-activity-version-list:versionList.actions.delete',
            icon: Delete,
            iconClassName: 'overflow-menu-icon',
            type: 'row',
            attributes: {
              hasDivider: true,
              className: 'overflow-option-delete',
            },
            resourceKey: '',
            onAction: (...args) => {
              let action = pageUtil.t('mod-activity-version-list:versionList.actions.delete');
              let activityDefnVersionKey = args[1].activityDefnVersionKey;

              return page.uiOnCellActionClick.apply(page, [action, activityDefnVersionKey]);
            },
          }
        ]
      },
      paginationConfig: {
        type: 'simple',
        mode: 'server',
        pageSize: 20,
        pageSizes: [5, 10, 20, 50],
        onChange: (...args) => {
          return page.datatable.versionList.paginationChange.apply(page, args);
        }
      },
      emptyStateConfig: {
        initNoData: {
          name: 'noRecordsInit',
          image: '',
          title: 'mod-activity-version-list:versionList.emptyStates.initNoRecords.title'
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
            dataloader: 'ACTIVITY_VERSION.LIST',
            inputModel: { activityDefnKey: activityDefnKey },
            outputModel: 'list',
            init: true,
            loadingState: 'tableLoadingState'
          }
        },
        ui: {
          tableLoadingState: false,
          tableEmptyState: undefined,
        },
        datatable: {
          versionList: {
            getListData: function (listInput) {
              const params = {
                pageNo: listInput.pagination.page,
                pageSize: listInput.pagination.pageSize
              };
              return this.ds.getList({ activityDefnKey: activityDefnKey }, { params: params });
            }
          }
        },
        init: function () { },

        uiView: function (actVersionKey) {
          sidePageConfig.onAction('cancel', {});
          pageUtil.navigate(`./activities/definitions/${actVersionKey}`);
        },

        uiEdit: function (actVersionKey) {
          sidePageConfig.onAction('cancel', {});
          pageUtil.navigate(`./activities/definitions/${actVersionKey}`);
        },

        uiOnCellActionClick: function (action, actVersionKey = '') {
          const record = page.model.list.data.filter((x) => x.id === actVersionKey)[0];
          store.setSelectedActivity({
            activityDefKey: activityDefnKey,
            actDefName: activityName,
            actDefVerKey: record.activityDefnVersionKey,
            operation: action,
            status: record.status,
            version: record.version
          });


          switch (action) {
            case pageUtil.t('mod-activity-list:list.actions.markAsFinal'):
              pageUtil.showPageModal('CONFIRMATION_MODAL.VIEW', {
                data: {
                  message: 'The Version can not be modified once you Mark as final. Do you want to Mark as final?',
                  action: 'mod-activity-list:list.actions.markAsFinal',
                  activityDefnVersionKey: actVersionKey,
                  activityDefnKey: activityDefnKey,
                }
              }).then(modalData => {
                page.datatable.versionList.refresh();
              });
              break;
            case pageUtil.t('mod-activity-version-list:versionList.actions.markAsDefault'):
              pageUtil.showPageModal('CONFIRMATION_MODAL.VIEW', {
                data: {
                  message: `Are you sure you want to make 'Ver.2' Mark as default? The Activity version will be marked as default.`,
                  action: 'mod-activity-version-list:versionList.actions.markAsDefault',
                  activityDefnVersionKey: actVersionKey,
                  activityDefnKey: activityDefnKey,
                }
              }).then(modalData => {
                page.datatable.versionList.refresh();
              });
              break;
            case pageUtil.t('mod-activity-list:list.actions.rollout'):

              pageUtil.showPageModal('ROLLOUT.SELECT', {
                data: {
                  activityDefnVersionKey: actVersionKey,
                  activityDefnKey: activityDefnKey,
                  activityName: activityName
                }
              });
              break;
            case pageUtil.t('mod-activity-list:list.actions.restore'):
              pageUtil.showPageModal('FUNCTIONALITY_NOT_IMPLEMENTED_MODAL.View', {});
              break;
            case pageUtil.t('mod-activity-list:list.actions.delete'):
              pageUtil.showPageModal('FUNCTIONALITY_NOT_IMPLEMENTED_MODAL.View', {});
              break;
            case pageUtil.t('mod-activity-version-list:versionList.actions.testVersion'):
              pageUtil.showPageModal('FUNCTIONALITY_NOT_IMPLEMENTED_MODAL.View', {});
              break;
            case pageUtil.t('mod-activity-version-list:versionList.actions.edit'):
              page.uiEdit(actVersionKey);
              break;
            case pageUtil.t('mod-activity-version-list:versionList.actions.view'):
              page.uiView(actVersionKey);
              break;
            case pageUtil.t('mod-activity-version-list:versionList.actions.exportVersion'):
              pageUtil.showPageModal('FUNCTIONALITY_NOT_IMPLEMENTED_MODAL.View', {});
              break;
            case pageUtil.t('mod-activity-version-list:versionList.actions.cloneVersion'):
              pageUtil.showPageModal('FUNCTIONALITY_NOT_IMPLEMENTED_MODAL.View', {});
              break;
            case pageUtil.t('mod-activity-version-list:versionList.actions.shareUnshared'):
              pageUtil.showPageModal('FUNCTIONALITY_NOT_IMPLEMENTED_MODAL.View', {});
              break;
            default:
              return;
          }
        },
        _filterRowActions: function (selectedRow, rowActions) {
          if (selectedRow.status === 'DRAFT' || selectedRow.status === 'DELETE' || selectedRow.isDefault) {
            rowActions.markAsDefault.isVisible = false;
          }
          if (selectedRow.status !== 'DRAFT') {
            rowActions.edit.isVisible = false
          }
          if (selectedRow.status === 'DELETE') {
            rowActions.delete.isVisible = false;
            rowActions.shareUnshared.isVisible = false
          }
        },
      };
    })(pageArgs, pageUtil),
    pageConfig
  );

  const uiCloseSidePage = function () {
    sidePageConfig.onAction('cancel', {});
  };

  return (
    <Shell.Page type="LIST" className="sfg--page--version-list">
      <div onClick={uiCloseSidePage} className="close-side-page-icon">
        <Close />
      </div>
      <Shell.PageHeader title={`${activityName} (Version History)`}></Shell.PageHeader>
      <Shell.PageBody>
        <Shell.DataTable
          className="sfg--datatable--version-list"
          data-testid="version-list"
          controller={page?.datatable?.versionList}
          data={page.model.list.data}
          config={pageConfig?.versionList}
          loadingState={page.ui.tableLoadingState}
          emptyState={page.datatable.versionList.emptyState}
          totalItems={page.model.list.meta.totalItems}
        ></Shell.DataTable>
      </Shell.PageBody>
    </Shell.Page >
  );
};

export default VersionListPage;
