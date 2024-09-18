import React from 'react';
import Shell from '@b2bi/shell';
import { Button } from '@carbon/react';

const Dashboard = ({ mode, context }) => {
  const pageUtil = Shell.PageUtil();

  const openModal = () => {
    pageUtil.showPageModal('CONTEXT_DATA_MAPPING.VIEW', {});
  };

  return (
    <>
      <Shell.Page type="LIST" className="sfg--page--dashboard">
        <Shell.PageHeader title={'Dashboard'} description={''}></Shell.PageHeader>
        <Shell.PageBody>
          <Button onClick={openModal}>Open Context Modal</Button>
        </Shell.PageBody>
        <Shell.PageActions></Shell.PageActions>
      </Shell.Page>
    </>
  );
};

export default Dashboard;
