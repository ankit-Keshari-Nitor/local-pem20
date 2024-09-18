import React from 'react';
import Shell from '@b2bi/shell';
import { routes as ViewPartnersRoutes } from './view-partners';
import DataLoaderConfig from './monitoring-dashboard-data-loader-config';
import { modals as partnersTaskModals } from './view-partners/partner-tasks';

const MonitoringWizard = {
  Page: React.lazy(() => import('./monitoring-dashboard-page')),
  DataLoaderConfig: DataLoaderConfig,
  Modal: React.lazy(() => import('./functionality-not-implemented-modal'))
};

const routes = [
  {
    path: '/monitoring',
    breadcrumb: 'mod-activity-monitoring:breadcrumb.monitoring',
    element: (
      <Shell.PageContainer mode="ROUTE_PAGE" resourceKey="MONITORING_WIZARD.VIEW" dataLoaderConfig={MonitoringWizard.DataLoaderConfig}>
        <MonitoringWizard.Page mode="LIST" />
      </Shell.PageContainer>
    ),
    children: [...ViewPartnersRoutes]
  }
];

const modals = [
  {
    page: 'FUNCTIONALITY_NOT_IMPLEMENTED_MODAL.View',
    size: 'xs',
    element: (
      <Shell.PageContainer mode="MODAL_PAGE" dataLoaderConfig={{}}>
        <MonitoringWizard.Modal />
      </Shell.PageContainer>
    )
  },
  ...partnersTaskModals
];

const sideNavConfig = [
  {
    label: 'pem:sideNav.monitoring',
    to: '/activities/monitoring',
    title: 'pem:sideNav.monitoring'
  }
];

export { routes, modals, sideNavConfig };
