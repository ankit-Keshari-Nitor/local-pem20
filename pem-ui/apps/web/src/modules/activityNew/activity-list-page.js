import React, { useState } from 'react';
import Shell from '@b2bi/shell';
import { NewTab, Information, RecentlyViewed, Add, Delete } from '@carbon/icons-react';
import '@b2bi/styles/pages/list-page.scss';
import { Tooltip, Tag } from '@carbon/react';
import './styles.scss';

import useActivityStore from '../activity/store';
import ActivityRolloutModal from '../activity/components/rollout-wizard';
import { capitalizeFirstLetter } from '../activity/constants';

const DefinitionList = ({ mode, context }) => {
  const store = useActivityStore();
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [showRolloutModal, setShowRolloutModal] = useState(false);

  const pageUtil = Shell.PageUtil();
  const pageArgs = pageUtil.pageParams;

  const pageConfig = {
    definitionList: {
      rowConfig: { select: 'none', onSort: null, onSelect: null },
      columnConfig: [
        {
          id: 'name',
          label: 'mod-activity-list:list.columns.activityName',
          value: 'name',
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
                <span className="pem-information-text">{cellValue}</span>
              </div>
            );
          }
        },
        {
          id: 'status',
          label: 'mod-activity-list:list.columns.status',
          value: 'defaultVersion.status',
          isSortable: false,
          displayType: 'custom',
          getCustomElements: (row, cellValue, config) => {
            let type = cellValue === 'DRAFT' ? 'cool-gray' : cellValue === 'FINAL' ? 'green' : 'red';
            return (
              <Tag size="sm" type={type}>
                <span className="cds--text-truncate--end" title={cellValue}>
                  {capitalizeFirstLetter(cellValue)}
                </span>
              </Tag>
            );
          }
        },
        {
          id: 'version',
          label: 'mod-activity-list:list.columns.defaultVersion',
          value: 'defaultVersion.version',
          isSortable: false,
          displayType: 'custom',
          getCustomElements: (row, cellValue, columnConfig) => {
            return (
              <div>
                <Tooltip label="Click to view Version History">
                  <div
                    className="recently-view-wrapper"
                    onClick={() => {
                      page.uiSideDrawer(row);
                    }}
                  >
                    <span className="recently-view-text">{`Ver. ${cellValue}`}</span>
                    <RecentlyViewed />
                  </div>
                </Tooltip>
              </div>
            );
          }
        },

        {
          id: 'primaryAction',
          label: 'mod-activity-list:list.columns.actions',
          value: 'primaryAction',
          isSortable: false,
          displayType: 'button',
          attributes: {
            kind: 'tertiary'
          },
          getAttributes: (row, cellValue, columnConfig) => {
            return {
              className: row.defaultVersion.status === 'DELETE' ? 'action-item action-item-delete' : 'action-item',
              children: row.isDeleted
                ? pageUtil.t('mod-activity-list:list.actions.restore')
                : row.defaultVersion.status === 'FINAL'
                  ? pageUtil.t('mod-activity-list:list.actions.rollout')
                  : pageUtil.t('mod-activity-list:list.actions.markAsFinal')
            };
          },
          onAction: (...args) => {
            let action =
              args[0].defaultVersion.status === 'DRAFT'
                ? pageUtil.t('mod-activity-list:list.actions.markAsFinal')
                : args[0].defaultVersion.status === 'FINAL'
                  ? pageUtil.t('mod-activity-list:list.actions.rollout')
                  : pageUtil.t('mod-activity-list:list.actions.restore');
            let actVersionKey = args[0].defaultVersion.activityDefnVersionKey;
            let activityDefnKey = args[0].activityDefnKey;

            return page.uiOnCellActionClick.apply(page, [action, activityDefnKey, actVersionKey]);
          }
        }
      ],
      filterConfig: {
        onApply: (...args) => {
          return page.datatable.definitionList.applyFilter.apply(page, args);
        },
        onCancel: (...args) => {
          return {};
        },
        onClear: (...args) => {
          return page.datatable.definitionList.clearFilter.apply(page, args);
        },
        fields: [
          {
            type: 'checkbox-group',
            label: 'mod-activity-list:list.filters.status',
            name: 'status',
            id: 'status',
            options: [
              {
                type: 'checkbox',
                name: 'draft',
                id: 'draft',
                label: 'mod-activity-list:list.filters.DRAFT',
                value: 'DRAFT'
              },
              {
                type: 'checkbox',
                name: 'final',
                id: 'final',
                label: 'mod-activity-list:list.filters.FINAL',
                value: 'FINAL'
              },
              {
                type: 'checkbox',
                name: 'delete',
                id: 'delete',
                label: 'mod-activity-list:list.filters.DELETE',
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
            id: 'view',
            label: 'mod-activity-list:list.actions.view',
            type: 'row',
            onAction: (...args) => {
              let action = pageUtil.t('mod-activity-list:list.actions.view');
              let activityDefKey = args[1].activityDefnKey;

              return page.uiOnCellActionClick.apply(page, [action, activityDefKey]);
            },
            resourceKey: `DEFINITION.VIEW`
          },
          {
            id: 'edit',
            label: 'mod-activity-list:list.actions.edit',
            type: 'row',
            onAction: (...args) => {
              let action = pageUtil.t('mod-activity-list:list.actions.edit');
              let activityDefKey = args[1].activityDefnKey;

              return page.uiOnCellActionClick.apply(page, [action, activityDefKey]);
            },
            resourceKey: `DEFINITION.EDIT`
          },
          {
            id: 'exportActivity',
            label: 'mod-activity-list:list.actions.exportActivity',
            type: 'row',
            onAction: (...args) => {
              let action = pageUtil.t('mod-activity-list:list.actions.exportActivity');
              let activityDefnKey = args[1].activityDefnKey;
              return page.uiOnCellActionClick.apply(page, [action, activityDefnKey]);
            },
            resourceKey: `DEFINITION.EXPORT`
          },
          {
            id: 'testActivity',
            label: 'mod-activity-list:list.actions.testActivity',
            type: 'row',
            onAction: (...args) => {
              let action = pageUtil.t('mod-activity-list:list.actions.testActivity');
              let activityDefnKey = args[1].activityDefnKey;
              return page.uiOnCellActionClick.apply(page, [action, activityDefnKey]);
            },
            resourceKey: `DEFINITION.TEST`
          },
          {
            id: 'cloneActivity',
            label: 'mod-activity-list:list.actions.cloneActivity',
            type: 'row',
            onAction: (...args) => {
              let action = pageUtil.t('mod-activity-list:list.actions.cloneActivity');
              let activityDefnKey = args[1].activityDefnKey;
              return page.uiOnCellActionClick.apply(page, [action, activityDefnKey]);
            },
            resourceKey: `DEFINITION.CLONE`
          },
          {
            id: 'shareUnshared',
            label: 'mod-activity-list:list.actions.shareUnshared',
            type: 'row',
            onAction: (...args) => {
              let action = pageUtil.t('mod-activity-list:list.actions.shareUnshared');
              let activityDefnKey = args[1].activityDefnKey;
              return page.uiOnCellActionClick.apply(page, [action, activityDefnKey]);
            },
            resourceKey: `DEFINITION.SHARE`
          },
          {
            id: 'delete',
            label: 'mod-activity-list:list.actions.delete',
            icon: Delete,
            iconClassName: 'overflow-menu-icon',
            type: 'row',
            attributes: {
              hasDivider: true,
              className: 'overflow-option-delete'
            },
            onAction: (...args) => {
              let action = pageUtil.t('mod-activity-list:list.actions.delete');
              let activityDefnKey = args[1].activityDefnKey;
              return page.uiOnCellActionClick.apply(page, [action, activityDefnKey]);
            },
            resourceKey: `DEFINITION.DELETE`
          }
        ],

        search: {
          id: 'search',
          label: 'mod-activity-list:list.actions.search',
          type: 'search',
          onAction: (...args) => {
            return page.datatable.definitionList.search.apply(page, args);
          },
          resourceKey: ''
        },
        primary: {
          id: 'upload',
          label: 'mod-activity-list:list.actions.new',
          kind: 'primary',
          icon: NewTab,
          onAction: (...args) => {
            return page.uiNew.apply(page, args);
          },
          resourceKey: `DEFINITION.UPLOAD`
        },
        toolbarActions: [
          {
            id: 'import',
            label: 'mod-activity-list:list.actions.import',
            kind: 'tertiary',
            icon: Add,
            isVisible: true,
            onAction: (...args) => {
              return page.uiImport.apply(page, args);
            },
            resourceKey: 'DEFINITION.IMPORT'
          }
        ]
      },
      paginationConfig: {
        type: 'simple',
        mode: 'server',
        pageSize: 20,
        pageSizes: [5, 10, 20, 50],
        onChange: (...args) => {
          return page.datatable.definitionList.paginationChange.apply(page, args);
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
            return page.datatable.definitionList.reset.apply(page, args);
          }
        },
        initNoData: {
          name: 'noRecordsInit',
          image: '',
          title: 'mod-activity-list:list.emptyStates.initNoRecords.title'
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
            dataloader: `DEFINITION.LIST`,
            inputModel: {},
            outputModel: 'list',
            init: false,
            loadingState: 'tableLoadingState',
            handleOutput: ['_updateEmptyState']
          }
        },
        ui: {
          tableLoadingState: false,
          tableEmptyState: undefined
        },
        datatable: {
          definitionList: {
            getListData: function (listInput) {
              const params = {
                pageNo: listInput.pagination.page,
                pageSize: listInput.pagination.pageSize
              };

              if (listInput.searchText) {
                params.name = `con:${listInput.searchText}`;
              }

              if (listInput.filter) {
                params.status = listInput.filter.status;
              }
              return this.ds.getList({}, { params: params });
            }
          }
        },

        init: function () {},
        _filterBatchActions: function (selectedRow, batchActionsObj) {},
        uiImport: function () {
          pageUtil.showPageModal('FUNCTIONALITY_NOT_IMPLEMENTED_MODAL.View', {});
        },
        _updateEmptyState: function (data) {
          if (data.data.length === 0) {
            if (this.datatable.definitionList.filter.current || this.datatable.definitionList.searchText.current) {
              this.setUI('tableEmptyState', 'noRecords');
            } else {
              this.setUI('tableEmptyState', 'initNoRecords');
            }
          } else {
            this.setUI('tableEmptyState', undefined);
          }
        },

        uiNew: function () {
          store.reset();
          pageUtil.navigate('new', {});
        },

        uiView: function (activityDefKey) {
          pageUtil.navigate(`./${activityDefKey}`);
        },

        uiEdit: function (activityDefKey) {
          pageUtil.navigate(`./${activityDefKey}`);
        },

        uiSideDrawer: function (selectedRow) {
          pageUtil
            .showSidePage('ACTIVITY_VERSION.LIST', {
              data: {
                activityDefnKey: selectedRow.id,
                activityName: selectedRow.name
              }
            })
            .then((sidePageData) => {
              page.datatable.definitionList.refresh();
            });
        },

        uiMarkAsFinal: function () {
          console.log('MarkAsFinal');
        },

        uiOnCellActionClick: function (action, activityDefKey, actVersionKey = '') {
          const record = page.model.list.data.filter((x) => x.id === activityDefKey)[0];
          store.setSelectedActivity({
            activityDefKey: record.activityDefnKey,
            actDefName: record.name,
            actDefVerKey: record.defaultVersion.activityDefnVersionKey,
            operation: action,
            status: record.defaultVersion.status,
            version: record.defaultVersion.version
          });
          setSelectedActivity(record);
          switch (action) {
            case pageUtil.t('mod-activity-list:list.actions.markAsFinal'):
              pageUtil
                .showPageModal('CONFIRMATION_MODAL.VIEW', {
                  data: {
                    message: 'The Activity can not be modified once you Mark as final. Do you want to Mark as final?',
                    action: 'mod-activity-list:list.actions.markAsFinal',
                    activityDefnVersionKey: actVersionKey,
                    activityDefnKey: activityDefKey
                  }
                })
                .then((modalData) => {
                  page.datatable.definitionList.refresh();
                });
              break;
            case pageUtil.t('mod-activity-list:list.actions.rollout'):
              setShowRolloutModal(true); //(id);
              break;
            case pageUtil.t('mod-activity-list:list.actions.restore'):
              console.log('Restore Activity');
              pageUtil.showPageModal('FUNCTIONALITY_NOT_IMPLEMENTED_MODAL.View', {});
              break;
            case pageUtil.t('mod-activity-list:list.actions.delete'):
              pageUtil
                .showPageModal('CONFIRMATION_MODAL.VIEW', {
                  data: {
                    message: 'Are you sure you want to delete? The Activity status will be changed to Deleted.',
                    action: 'mod-activity-list:list.actions.delete',
                    activityDefnKey: activityDefKey
                  }
                })
                .then((modalData) => {
                  page.datatable.definitionList.refresh();
                });
              break;
            case pageUtil.t('mod-activity-list:list.actions.testActivity'):
              console.log('Test Activity');
              pageUtil.showPageModal('FUNCTIONALITY_NOT_IMPLEMENTED_MODAL.View', {});
              break;
            case pageUtil.t('mod-activity-list:list.actions.edit'):
              page.uiEdit(activityDefKey);
              break;
            case pageUtil.t('mod-activity-list:list.actions.view'):
              page.uiView(activityDefKey);
              break;
            case pageUtil.t('mod-activity-list:list.actions.exportActivity'):
              console.log('Export Activity');
              pageUtil.showPageModal('FUNCTIONALITY_NOT_IMPLEMENTED_MODAL.View', {});
              break;
            case pageUtil.t('mod-activity-list:list.actions.cloneActivity'):
              console.log('Clone Activity');
              pageUtil.showPageModal('FUNCTIONALITY_NOT_IMPLEMENTED_MODAL.View', {});
              break;
            case pageUtil.t('mod-activity-list:list.actions.shareUnshared'):
              console.log('Share/Unshared Activity');
              pageUtil.showPageModal('FUNCTIONALITY_NOT_IMPLEMENTED_MODAL.View', {});
              break;
            default:
              return;
          }
        }
      };
    })(pageArgs, pageUtil),
    pageConfig
  );

  return (
    <>
      <Shell.Page type="LIST" className="sfg--page--activity-list">
        <Shell.PageHeader title={pageUtil.t('mod-activity-list:list.title')} description=""></Shell.PageHeader>
        <Shell.PageBody>
          <Shell.DataTable
            className={`sfg--datatable--activity-list`}
            controller={page.datatable.definitionList}
            data={page.model.list.data}
            config={pageConfig.definitionList}
            loadingState={page.ui.tableLoadingState}
            emptyState={page.datatable.definitionList.emptyState}
            totalItems={page.model.list.meta.totalItems}
          ></Shell.DataTable>
        </Shell.PageBody>
        <Shell.PageActions></Shell.PageActions>
        {showRolloutModal && (
          <ActivityRolloutModal
            showModal={showRolloutModal}
            setShowModal={() => setShowRolloutModal(false)}
            activityDefnKey={selectedActivity ? selectedActivity.activityDefnKey : ''}
            activityDefnVersionKey={selectedActivity ? selectedActivity.actDefVerKey : ''}
            activityName={selectedActivity ? selectedActivity.name : ''}
            reloadActivityList={() => {
              page.datatable.definitionList.refresh();
            }}
          />
        )}
      </Shell.Page>
    </>
  );
};

export default DefinitionList;
