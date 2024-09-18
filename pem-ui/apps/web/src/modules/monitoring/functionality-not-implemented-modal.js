import React from 'react';
import Shell from '@b2bi/shell';
import '@b2bi/styles/pages/list-page.scss';

export default function MonitoringSampleModal() {
  const pageUtil = Shell.PageUtil();

  return (
    <>
      <Shell.Page>
        <Shell.PageHeader className="sfg--modal-header" title={`${pageUtil.t('mod-activity-monitoring:dashboardList.sampleModalData')}`} />
        <Shell.PageBody className="modal-body">
          {pageUtil.t('mod-activity-monitoring:dashboardList.notImplemented')}
        </Shell.PageBody>
      </Shell.Page>

    </>);
}
