import React from 'react';
import Shell from '@b2bi/shell';
import DataLoaderConfig from './activity-list-data-loader-config';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const ActivityWizard = {
  Page: React.lazy(() => import('./activity-list-page')),
  DataLoaderConfig: DataLoaderConfig,
  New: React.lazy(() => import('../activity/pages/activity-definition')),
  Edit: React.lazy(() => import('../activity/pages/activity-definition')),
  ConfirmationModal: React.lazy(() => import('./confirmation-modal')),
  VersionList: React.lazy(() => import('./activity-version-list/activity-version-list-page'))
};

const routes = [
  {
    path: '/definitions',
    breadcrumb: 'mod-activity-list:breadcrumb.definitions',
    element: (
      <Shell.PageContainer mode="ROUTE_PAGE" resourceKey="ACTIVITY_WIZARD.VIEW" dataLoaderConfig={ActivityWizard.DataLoaderConfig}>
        <ActivityWizard.Page mode="LIST" />
      </Shell.PageContainer>
    ),
    children: [
      {
        path: '/new',
        breadcrumb: 'mod-activity-definition:breadcrumb.workflow',
        resourceKey: 'DESIGNER.VIEW',
        element: (
          <Shell.PageContainer resourceKey="DESIGNER.VIEW" dataLoaderConfig={{}}>
            <DndProvider backend={HTML5Backend}>
              <ActivityWizard.New />
            </DndProvider>
          </Shell.PageContainer>
        )
      },
      {
        path: '/:id',
        breadcrumb: 'mod-activity-definition:breadcrumb.workflow',
        resourceKey: 'DESIGNER.VIEW',
        element: (
          <Shell.PageContainer resourceKey="DESIGNER.VIEW" dataLoaderConfig={ActivityWizard.DataLoaderConfig}>
            <DndProvider backend={HTML5Backend}>
              <ActivityWizard.Edit />
            </DndProvider>
          </Shell.PageContainer>
        )
      }
    ]
  }
]

const modals = [
  {
    page: 'CONFIRMATION_MODAL.VIEW',
    size: 'md',
    element: (
      <Shell.PageContainer mode="MODAL_PAGE" dataLoaderConfig={ActivityWizard.DataLoaderConfig}>
        <ActivityWizard.ConfirmationModal />
      </Shell.PageContainer>
    )
  }
];

const sideNavConfig = [
  {
    label: 'pem:sideNav.definitions',
    to: '/activities/definitions',
    title: 'pem:sideNav.definitions',
    resourceKey: 'DEFINITIONS.VIEW'
  },
];

const sidePages = [
  {
    page: 'ACTIVITY_VERSION.LIST',
    size: 'lg',
    element: (
      <Shell.PageContainer mode="ROUTE_PAGE" resourceKey="ACTIVITY_VERSION.VIEW" dataLoaderConfig={ActivityWizard.DataLoaderConfig}>
        <ActivityWizard.VersionList mode="LIST" />
      </Shell.PageContainer>
    )
  }
];

export { routes, modals, sideNavConfig, sidePages };
