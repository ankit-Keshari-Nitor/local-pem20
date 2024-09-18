import React from 'react';
import DataLoaderConfig from './DataLoaderConfig';
import Shell from '@b2bi/shell';

const SponserUsers = {
  ListPage: React.lazy(() => import('./list')),
  DataLoaderConfig: DataLoaderConfig
};

const routes = [
  {
    path: '/directories/sponsor-users',
    breadcrumb: 'mod-sponsor-user:breadcrumb.sponsorUsers',
    resourceKey: 'Sponsor.Users.VIEW',
    element: (
      <Shell.RoutePage resourceKey="Sponsor.Users.VIEW" dataLoaderConfig={SponserUsers.DataLoaderConfig}>
        <SponserUsers.ListPage />
      </Shell.RoutePage>
    )
  }
];

const modals = [];

export { SponserUsers, routes, modals };
