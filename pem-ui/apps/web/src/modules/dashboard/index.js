import React from 'react';
import Shell from '@b2bi/shell';

const Dashboard = {
  Page: React.lazy(() => import('./dashboard.page'))
};

const sideNavConfig = [
  {
    label: 'mod-apic:sideNav.list',
    to: '/settings/apiconfigurations',
    title: 'mod-apic:sideNav.list',
    resourceKey: 'API_CONFIGURATION.VIEW'
  }
];

const routes = [
  {
    path: '/dashboard',
    breadcrumb: 'Dashboard',
    element: (
      <Shell.PageContainer mode="ROUTE_PAGE" resourceKey="" dataLoaderConfig={{}}>
        <Dashboard.Page mode="" context="" />
      </Shell.PageContainer>
    )
  }
];

export { routes, sideNavConfig };
