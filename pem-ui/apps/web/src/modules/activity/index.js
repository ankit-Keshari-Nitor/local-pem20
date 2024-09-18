import React from 'react';
import Shell from '@b2bi/shell';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const ActivityDefinition = {
  List: React.lazy(() => import('./pages/activity-list')),
  New: React.lazy(() => import('./pages/activity-definition')),
  Edit: React.lazy(() => import('./pages/activity-definition'))
};

const sideNavConfig = [
  {
    label: 'pem:sideNav.definitions',
    to: '/activities/definitions',
    title: 'pem:sideNav.definitions',
    resourceKey: 'DEFINITIONS.VIEW'
  },
];

const routes = [
  {
    path: '/definitions',
    breadcrumb: 'mod-activity-list:breadcrumb.definitions',
    resourceKey: 'DEFINITIONS.VIEW',
    element: (
      <Shell.PageContainer resourceKey="DEFINITIONS.VIEW" dataLoaderConfig={{}}>
        <DndProvider backend={HTML5Backend}>
          <ActivityDefinition.List />
        </DndProvider>
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
              <ActivityDefinition.New />
            </DndProvider>
          </Shell.PageContainer>
        )
      },
      {
        path: '/:id',
        breadcrumb: 'mod-activity-definition:breadcrumb.workflow',
        resourceKey: 'DESIGNER.VIEW',
        element: (
          <Shell.PageContainer resourceKey="DESIGNER.VIEW" dataLoaderConfig={{}}>
            <DndProvider backend={HTML5Backend}>
              <ActivityDefinition.Edit />
            </DndProvider>
          </Shell.PageContainer>
        )
      }
    ]
  }
];

const modals = [];

export { routes, sideNavConfig, modals };
