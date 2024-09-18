import React from 'react';
import DataLoaderConfig from '../sponsor-users/DataLoaderConfig';
import Shell from '@b2bi/shell';

const Roles = {
  ListPage: React.lazy(() => import('../sponsor-users/list')),
  AddEditPage: React.lazy(() => import('./add-edit')),
  AssignRole: React.lazy(() => import('./assign-role')),
  DataLoaderConfig: DataLoaderConfig
};

const routes = [
  {
    path: '/directories/roles',
    breadcrumb: 'mod-roles:breadcrumb.roles',
    resourceKey: 'ROLES.VIEW',
    element: (
      <Shell.RoutePage resourceKey="ROLES.VIEW" dataLoaderConfig={Roles.DataLoaderConfig}>
        <Roles.ListPage />
      </Shell.RoutePage>
    )
  }
];

const modals = [
  {
    page: 'roles.addEditRole',
    size: 'lg',
    element: (
      <React.Suspense fallback={<>...</>}>
        <Shell.DataServiceProvider config={DataLoaderConfig}>
          <Roles.AddPage />
        </Shell.DataServiceProvider>
      </React.Suspense>
    )
  },
  {
    page: 'roles.assignRole',
    size: 'lg',
    element: (
      <React.Suspense fallback={<>...</>}>
        <Shell.DataServiceProvider config={DataLoaderConfig}>
          <Roles.AddPage />
        </Shell.DataServiceProvider>
      </React.Suspense>
    )
  }
];

export { Roles, routes, modals };
