import React from 'react';
import { useParams } from 'react-router-dom';
import Shell from '@b2bi/shell';
import '@b2bi/styles/pages/list-page.scss';
import './styles.scss';
import { saveActivityData } from '../../modules/activity/services/activity-service';
import { saveAs } from 'file-saver';
import { createActivityVersion } from '../../modules/activity/services/actvity-version-service';

function ConfirmationModal() {
  const pageArgs = useParams();
  const pageUtil = Shell.PageUtil();

  const { modalConfig } = Shell.useModal();

  const { activityDefnKey, activityDefnVersionKey, action, message, activityName, pagination, activityVersion } = modalConfig.data.data;

  const pageConfig = {
    actionsConfig: {
      pageActions: [
        {
          id: 'cancel',
          label: 'shell:common.actions.cancel',
          type: 'button',
          kind: 'secondary',
          onAction: (...args) => {
            return page.uiOnRequestClose();
          }
        },
        {
          id: 'save',
          label: action,
          type: 'button',
          kind: 'primary',
          onAction: (...args) => {
            return page.uiOnAction.apply(page, [action, activityDefnVersionKey]);
          }
        }
      ]
    }
  };

  const { page } = Shell.usePage(
    [],
    (function Page(pageArgs, pageUtil) {
      return {
        model: {},
        datasources: {
          markAsFinal: {
            dataloader: 'DEFINITION.MARKASFINAL'
          },
          delete: {
            dataloader: 'DEFINITION.DELETE'
          },
          markAsDefault: {
            dataloader: 'ACTIVITY_VERSION.MARKASDEFAULT'
          },
          getActivityData: {
            dataloader: 'DEFINITION.GET_ACTIVITY_DEFINITION_DATA'
          },
          listData: {
            dataloader: 'DEFINITION.LIST'
          },
          getActivityVersions: {
            dataloader: 'ACTIVITY_VERSION.LIST'
          }
        },
        ui: {},
        form: {},
        init: function () {},

        uiOnAction: function (action) {
          switch (pageUtil.t(action)) {
            case pageUtil.t('mod-activity-list:list.actions.markAsFinal'):
              page.uiMarkAsFinal();
              break;
            case pageUtil.t('mod-activity-version-list:versionList.actions.markAsDefault'):
              page.uiMarkAsDefault();
              break;
            case pageUtil.t('mod-activity-list:list.actions.delete'):
              page.uiDelete();
              break;
            case pageUtil.t('mod-activity-list:list.actions.clone'):
              page.uiClone();
              break;
            default:
              break;
          }
        },
        uiMarkAsFinal: function () {
          let data = {
            activityDefnKey: activityDefnKey,
            activityDefnVersionKey: activityDefnVersionKey
          };
          let handler = this.ds.markAsFinal(data);

          handler &&
            handler
              .then((response) => {
                let kind = response.status === 200 ? pageUtil.t('shell:common.actions.success') : pageUtil.t('shell:common.actions.error');
                let message =
                  response.status === 200 ? pageUtil.t('mod-activity-list:list.apiMessages.actionCompleted') : pageUtil.t('mod-activity-list:list.apiMessages.actionNotCompleted');
                pageUtil.showNotificationMessage('toast', kind, message);
                modalConfig.onAction('cancel', {});
              })
              .catch((err) => {
                console.error('Confirmation Error:', err);
                modalConfig.onAction('cancel', {});
              });
        },
        uiMarkAsDefault: function () {
          let data = {
            activityDefnKey: activityDefnKey,
            activityDefnVersionKey: activityDefnVersionKey
          };
          let handler = this.ds.markAsDefault(data);

          handler &&
            handler
              .then((response) => {
                let kind = response.status === 200 ? pageUtil.t('shell:common.actions.success') : pageUtil.t('shell:common.actions.error');
                let message =
                  response.status === 200 ? pageUtil.t('mod-activity-list:list.apiMessages.actionCompleted') : pageUtil.t('mod-activity-list:list.apiMessages.actionNotCompleted');
                pageUtil.showNotificationMessage('toast', kind, message);
                modalConfig.onAction('cancel', {});
              })
              .catch((err) => {
                console.error('Confirmation Error:', err);
                modalConfig.onAction('cancel', {});
              });
        },
        uiDelete: function () {
          let data = {
            activityDefnKey: activityDefnKey
          };
          let handler = this.ds.delete(data);

          handler &&
            handler
              .then((response) => {
                let kind = response.status === 200 ? pageUtil.t('shell:common.actions.success') : pageUtil.t('shell:common.actions.error');
                let message =
                  response.status === 200 ? pageUtil.t('mod-activity-list:list.apiMessages.actionCompleted') : pageUtil.t('mod-activity-list:list.apiMessages.actionNotCompleted');
                pageUtil.showNotificationMessage('toast', kind, message);
                modalConfig.onAction('cancel', {});
              })
              .catch((err) => {
                console.error('Confirmation Error:', err);
                modalConfig.onAction('cancel', {});
              });
        },
        uiOnRequestClose: function () {
          modalConfig.onAction('cancel', {});
        },
        uiClone: function () {
          let data = {
            activityDefnKey: activityDefnKey,
            activityDefnVersionKey: activityDefnVersionKey,
            activityName: activityName
          };
          this.ds
            .getActivityData(data)
            .then((activityDataResp) => {
              if (!activityVersion) {
                this.uiCloneActivityName()
                  .then((res) => {
                    const file = new Blob([JSON.stringify(activityDataResp.data)], { type: 'application/json' });
                    saveAs(file, `${res}.json`);
                    let activityHandler = saveActivityData(activityDataResp.data, res);
                    activityHandler &&
                      activityHandler
                        .then((newData) => {
                          this.uiResponseMessage(newData);
                        })
                        .catch((err) => {
                          console.error('Error:', err);
                          modalConfig.onAction('cancel', {});
                        });
                  })
                  .catch((err) => {
                    console.error('Error:', err);
                    modalConfig.onAction('cancel', {});
                  });
              } else {
                this.uiCloneVersion(activityDataResp);
              }
            })

            .catch((err) => {
              console.error('Error:', err);
              modalConfig.onAction('cancel', {});
            });
        },
        uiResponseMessage: function (response) {
          let kind = response.status === 200 || response.status === 201 ? pageUtil.t('shell:common.actions.success') : pageUtil.t('shell:common.actions.error');
          let message =
            response.status === 200 || response.status === 201
              ? pageUtil.t('mod-activity-list:list.apiMessages.activityClone')
              : pageUtil.t('mod-activity-list:list.apiMessages.activityNotClone');
          pageUtil.showNotificationMessage('toast', kind, message);
          modalConfig.onAction('cancel', {});
        },
        uiCloneActivityName: async function () {
          const baseId = activityName;
          let newIdSuffix = 1;
          let newId = `${baseId}_${newIdSuffix}`;
          const params = {
            pageNo: pagination.current.page,
            pageSize: pagination.current.pageSize
          };
          let handler = await this.ds.listData({}, { params: params });
          handler.data.data.forEach((node) => {
            if (handler.data.data.some((node) => node.name === newId)) {
              newIdSuffix++;
              newId = `${baseId}_${newIdSuffix}`;
            }
          });
          return newId;
        },
        uiCloneVersion: function (activityData) {
          let data = {
            activityDefnKey: activityDefnKey
          };
          let versionHandler = createActivityVersion(activityData.data, data.activityDefnKey);
          versionHandler &&
            versionHandler
              .then((newData) => {
                this.uiResponseMessage(newData);
              })
              .catch((err) => {
                console.error('Error:', err);
                modalConfig.onAction('cancel', {});
              });
        }
      };
    })(pageArgs, pageUtil)
  );

  return (
    <>
      <Shell.Page name="confirmation-modal">
        <Shell.PageHeader className="sfg--modal-header" title={pageUtil.t('mod-activity-list:list.confirmation')} />
        <Shell.PageBody className="modal-body">{message}</Shell.PageBody>
        <Shell.PageActions actions={pageConfig.actionsConfig.pageActions}></Shell.PageActions>
      </Shell.Page>
    </>
  );
}

export default ConfirmationModal;
