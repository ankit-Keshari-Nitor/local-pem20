import React from 'react';
import DataLoaderConfig from './DataLoaderConfig';
import Shell from '@b2bi/shell';

const Partner = {
  ListPage: React.lazy(() => import('./list')),
  DataLoaderConfig: DataLoaderConfig
};

const routes = [
  {
    path: '/partners',
    breadcrumb: 'mod-partner:breadcrumb.partners',
    resourceKey: 'PARTNERS.VIEW',
    element: (
      <Shell.PageContainer resourceKey="PARTNERS.VIEW" dataLoaderConfig={Partner.DataLoaderConfig}>
        <Partner.ListPage />
      </Shell.PageContainer>
    )
  }
];

const modals = [];

export { Partner, routes, modals };
