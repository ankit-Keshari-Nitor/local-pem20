import React from 'react';
import { useParams } from 'react-router-dom';
import Shell from '@b2bi/shell';
import { RadioButtonGroup, RadioButton } from '@carbon/react';
import '@b2bi/styles/pages/list-page.scss';
import '../../styles.scss';

function ChangeOwnerModal() {
  const pageArgs = useParams();
  const pageUtil = Shell.PageUtil();

  const { modalConfig } = Shell.useModal();

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
          label: 'shell:common.actions.save',
          type: 'button',
          kind: 'primary'
        }
      ]
    }
  };

  const { page } = Shell.usePage(
    [],
    (function Page(pageArgs, pageUtil) {
      return {
        model: {},
        datasources: {},
        ui: {},
        form: {},
        init: function () {},

        uiOnRequestClose: function () {
          modalConfig.onAction('cancel', {});
        }
      };
    })(pageArgs, pageUtil)
  );

  return (
    <>
      <Shell.Page name="user-reset-password">
        <Shell.PageHeader className="sfg--modal-header" title={pageUtil.t('mod-activity-monitoring:partnerTaskList.assginOwner.modal.pageTitle')} />
        <Shell.PageBody className="modal-body">
          <RadioButtonGroup name="assignOwner" legendText={pageUtil.t('mod-activity-monitoring:partnerTaskList.assginOwner.modal.select')}>
            <RadioButton name="assginOwner" labelText={pageUtil.t('mod-activity-monitoring:partnerTaskList.assginOwner.modal.assginToMe')} value="ASSGIN TO ME"></RadioButton>
            <RadioButton name="assginOwner" labelText={pageUtil.t('mod-activity-monitoring:partnerTaskList.assginOwner.modal.other')} value="OTHER"></RadioButton>
            <RadioButton name="assginOwner" labelText={pageUtil.t('mod-activity-monitoring:partnerTaskList.assginOwner.modal.none')} value="NONE"></RadioButton>
          </RadioButtonGroup>
        </Shell.PageBody>
        <Shell.PageActions actions={pageConfig.actionsConfig.pageActions}></Shell.PageActions>
      </Shell.Page>
    </>
  );
}

export default ChangeOwnerModal;
