import { routes as PartnerRoutes } from './partner';
import { routes as ActivityRoutes } from './activityNew';
import { routes as MonitoringRoutes } from './monitoring';
import { routes as FileRoutes } from './File';
import { routes as ApiConfigurationRoutes } from './ApiConfiguration';
import { routes as DashboardRoutes } from './dashboard';
import { routes as ContextDataRoutes } from './context-data-mapping';

const routes = [
  ...DashboardRoutes,
  {
    path: 'directories',
    breadcrumb: null,
    group: true,
    children: [...PartnerRoutes]
  },
  {
    path: 'activities',
    breadcrumb: null,
    group: true,
    children: [...ActivityRoutes, ...ContextDataRoutes, ...MonitoringRoutes]
  },
  {
    path: 'library',
    breadcrumb: null,
    group: true,
    children: [...FileRoutes]
  },
  {
    path: 'settings',
    breadcrumb: null,
    group: true,
    children: [...ApiConfigurationRoutes]
  }
];

export { routes };
