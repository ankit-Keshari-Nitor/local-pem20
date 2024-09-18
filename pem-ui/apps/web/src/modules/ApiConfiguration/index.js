import React from 'react';
import Shell from '@b2bi/shell';
import DataLoaderConfig from './DataLoaderConfig';

const ApiConfiguration = {
  ListPage: React.lazy(() => import('./ApiConfigurationList.page')),
  DetailsPage: React.lazy(() => import('./ApiConfigurationDetails.page')),
  AddEditPage: React.lazy(() => import('./ApiConfigurationAddEdit.page')),
  DataLoaderConfig: DataLoaderConfig
};

const ResourceMapping = {
  API_CONFIGURATION: {
    VIEW: {
      roles: [],
      permissions: [],
      enabled: {
        dev: true,
        qa: true,
        prod: false
      }
    },
    ADD: {
      roles: [],
      permissions: [],
      enabled: {
        dev: true,
        qa: true,
        prod: false
      }
    },
    EDIT: {
      roles: [],
      permissions: [],
      enabled: {
        dev: false,
        qa: false,
        prod: false
      }
    },
    DELETE: {
      roles: [],
      permissions: [],
      enabled: {
        dev: true,
        qa: false,
        prod: false
      }
    }
  }
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
    path: '/apiconfigurations',
    breadcrumb: 'mod-apic:breadcrumb.list',
    element: (
      <Shell.PageContainer mode="ROUTE_PAGE" resourceKey="API_CONFIGURATION.VIEW" dataLoaderConfig={ApiConfiguration.DataLoaderConfig}>
        <ApiConfiguration.ListPage mode="" context="" />
      </Shell.PageContainer>
    ),
    children: [
      {
        path: '/add',
        breadcrumb: 'mod-apic:breadcrumb.add',
        element: (
          <Shell.PageContainer mode="ROUTE_PAGE" resourceKey="API_CONFIGURATION.ADD" dataLoaderConfig={ApiConfiguration.DataLoaderConfig}>
            <ApiConfiguration.AddEditPage mode="ADD" context="" />
          </Shell.PageContainer>
        )
      },
      {
        path: '/:apiConfigurationKey',
        breadcrumb: 'mod-apic:breadcrumb.details',
        element: (
          <Shell.PageContainer mode="ROUTE_PAGE" resourceKey="API_CONFIGURATION.VIEW" dataLoaderConfig={ApiConfiguration.DataLoaderConfig}>
            <ApiConfiguration.DetailsPage mode="DETAILS" context="" />
          </Shell.PageContainer>
        ),
        children: [
          {
            path: '/edit',
            breadcrumb: null,
            element: (
              <Shell.PageContainer mode="ROUTE_PAGE" resourceKey="API_CONFIGURATION.EDIT" dataLoaderConfig={ApiConfiguration.DataLoaderConfig}>
                <ApiConfiguration.AddEditPage mode="EDIT" context="" />
              </Shell.PageContainer>
            )
          }
        ]
      }
    ]
  }
];

const modals = [
  {
    page: 'API_CONFIGURATION.ADD',
    size: 'lg',
    element: (
      <Shell.PageContainer mode="MODAL_PAGE" dataLoaderConfig={DataLoaderConfig}>
        <ApiConfiguration.AddEditPage mode="ADD" context="" />
      </Shell.PageContainer>
    )
  },
  {
    page: 'API_CONFIGURATION.EDIT',
    size: 'lg',
    element: (
      <Shell.PageContainer mode="MODAL_PAGE" dataLoaderConfig={DataLoaderConfig}>
        <ApiConfiguration.AddEditPage mode="EDIT" context="" />
      </Shell.PageContainer>
    )
  },
  {
    page: 'API_CONFIGURATION.DETAILS',
    size: 'lg',
    element: (
      <Shell.PageContainer mode="MODAL_PAGE" dataLoaderConfig={DataLoaderConfig}>
        <ApiConfiguration.DetailsPage mode="DETAILS" context="" />
      </Shell.PageContainer>
    )
  }
];

const sidePages = [
  {
    page: 'API_CONFIGURATION.ADD',
    size: 'lg',
    element: (
      <Shell.PageContainer mode="SIDE_PAGE" dataLoaderConfig={DataLoaderConfig}>
        <ApiConfiguration.AddEditPage mode="ADD" context="" />
      </Shell.PageContainer>
    )
  },
  {
    page: 'API_CONFIGURATION.EDIT',
    size: 'lg',
    element: (
      <Shell.PageContainer mode="SIDE_PAGE" dataLoaderConfig={DataLoaderConfig}>
        <ApiConfiguration.AddEditPage mode="EDIT" context="" />
      </Shell.PageContainer>
    )
  },
  {
    page: 'API_CONFIGURATION.DETAILS',
    size: 'xl',
    element: (
      <Shell.PageContainer mode="SIDE_PAGE" dataLoaderConfig={DataLoaderConfig}>
        <ApiConfiguration.DetailsPage mode="DETAILS" context="" />
      </Shell.PageContainer>
    )
  }
];
export { routes, modals, sidePages, sideNavConfig, ApiConfiguration, ResourceMapping };
