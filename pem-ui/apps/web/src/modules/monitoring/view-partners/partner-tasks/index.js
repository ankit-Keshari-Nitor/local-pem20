import React from 'react';
import Shell from '@b2bi/shell';
import DataLoaderConfig from './partner-tasks-data-loader-config';

const PartnersTask = {
  Page: React.lazy(() => import('./partner-tasks-page')),
  ChangeOwner: React.lazy(() => import('./partner-task-change-owner-page')),
  DataLoaderConfig: DataLoaderConfig
};

const routes = [];

const modals = [
  {
    page: 'PARTNER_TASK.CHANGE_OWNER',
    size: 'xs',
    element: (
      <Shell.PageContainer mode="MODAL_PAGE" dataLoaderConfig={{}}>
        <PartnersTask.ChangeOwner />
      </Shell.PageContainer>
    )
  }
];

const sidePages = [
  {
    page: 'PARTNER_TASK.LIST',
    size: 'lg',
    element: (
      <Shell.PageContainer mode="ROUTE_PAGE" resourceKey="PARTNER_TASK.VIEW" dataLoaderConfig={PartnersTask.DataLoaderConfig}>
        <PartnersTask.Page mode="LIST" />
      </Shell.PageContainer>
    )
  }
];

export { routes, modals, sidePages };
