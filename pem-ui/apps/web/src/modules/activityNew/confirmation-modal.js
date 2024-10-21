import React from 'react';
import { useParams } from 'react-router-dom';
import Shell from '@b2bi/shell';
import '@b2bi/styles/pages/list-page.scss';
import './styles.scss';

function ConfirmationModal() {
    const pageArgs = useParams();
    const pageUtil = Shell.PageUtil();

    const { modalConfig } = Shell.useModal();

    const { activityDefnKey, activityDefnVersionKey, action, message } = modalConfig.data.data;

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
                        return page.uiOnAction.apply(page, [action, activityDefnVersionKey])
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
                    }
                },
                ui: {},
                form: {},
                init: function () { },

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

                    handler && handler.then((response) => {
                        let kind = response.status === 200 ? pageUtil.t('shell:common.actions.success') : pageUtil.t('shell:common.actions.error');
                        let message = response.status === 200 ? 'Action completed successfully!' : 'Action not completed successfully!';
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

                    handler && handler.then((response) => {

                        let kind = response.status === 200 ? pageUtil.t('shell:common.actions.success') : pageUtil.t('shell:common.actions.error');
                        let message = response.status === 200 ? 'Action completed successfully!' : 'Action not completed successfully!';
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
                        activityDefnKey: activityDefnKey,

                    };
                    let handler = this.ds.delete(data);

                    handler && handler.then((response) => {
                        let kind = response.status === 200 ? pageUtil.t('shell:common.actions.success') : pageUtil.t('shell:common.actions.error');
                        let message = response.status === 200 ? 'Action completed successfully!' : 'Action not completed successfully!';
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
                }
            };
        })(pageArgs, pageUtil)
    );

    return (
        <>
            <Shell.Page name="confirmation-modal">
                <Shell.PageHeader className="sfg--modal-header" title={pageUtil.t('mod-activity-list:list.confirmation')} />
                <Shell.PageBody className="modal-body">
                    {message}
                </Shell.PageBody>
                <Shell.PageActions actions={pageConfig.actionsConfig.pageActions}></Shell.PageActions>
            </Shell.Page>
        </>
    );
}

export default ConfirmationModal;
