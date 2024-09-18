import React from 'react';
import Shell from '@b2bi/shell';
import DataLoaderConfig from './view-partners-data-loader-config';

const ViewPartners = {
  ListPage: React.lazy(() => import('./view-partners-page')),
  DataLoaderConfig: DataLoaderConfig
};

const routes = [
  {
    path: '/:id',
    breadcrumb: 'mod-activity-monitoring:breadcrumb.viewPartner',
    element: (
      <Shell.PageContainer mode="ROUTE_PAGE" resourceKey="VIEW_PARTNERS.VIEW" dataLoaderConfig={ViewPartners.DataLoaderConfig}>
        <ViewPartners.ListPage mode="LIST" />
      </Shell.PageContainer>
    )
  }
];

export { routes };
