import React from 'react';
import Shell from '@b2bi/shell';
import DataLoaderConfig from './DataLoaderConfig';

const File = {
  ListPage: React.lazy(() => import('./FileList.page')),
  DetailsPage: React.lazy(() => import('./FileDetails.page')),
  UploadPage: React.lazy(() => import('./FileUpload.page')),
  DataLoaderConfig: DataLoaderConfig
};

const ResourceMapping = {
  FILE: {
    VIEW: {
      roles: [],
      permissions: [],
      enabled: {
        dev: true,
        qa: true,
        prod: false
      }
    },
    UPLOAD: {
      roles: [],
      permissions: [],
      enabled: {
        dev: true,
        qa: true,
        prod: false
      }
    },
    DOWNLOAD: {
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
    label: 'mod-file:sideNav.list',
    to: '/library/files',
    title: 'mod-file:sideNav.list',
    resourceKey: 'FILE.VIEW'
  }
];

const routes = [
  {
    path: '/files',
    breadcrumb: 'mod-file:breadcrumb.list',
    element: (
      <Shell.PageContainer mode="ROUTE_PAGE" resourceKey="FILE.VIEW" dataLoaderConfig={File.DataLoaderConfig}>
        <File.ListPage mode="" context="" />
      </Shell.PageContainer>
    ),
    children: [
      {
        path: '/upload',
        breadcrumb: 'mod-file:breadcrumb.upload',
        element: (
          <Shell.PageContainer mode="ROUTE_PAGE" resourceKey="FILE.UPLOAD" dataLoaderConfig={File.DataLoaderConfig}>
            <File.UploadPage mode="ADD" context="FILE" />
          </Shell.PageContainer>
        )
      },
      {
        path: '/:fileKey',
        breadcrumb: 'mod-file:breadcrumb.details',
        element: (
          <Shell.PageContainer mode="ROUTE_PAGE" resourceKey="FILE.VIEW" dataLoaderConfig={File.DataLoaderConfig}>
            <File.DetailsPage mode="DETAILS" context="FILE" />
          </Shell.PageContainer>
        ),
        children: [
          {
            path: '/edit',
            breadcrumb: null,
            element: (
              <Shell.PageContainer mode="ROUTE_PAGE" resourceKey="FILE.EDIT" dataLoaderConfig={File.DataLoaderConfig}>
                <File.AddEditPage mode="EDIT" context="FILE" />
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
    page: 'FILE.UPLOAD',
    size: 'md',
    element: (
      <Shell.PageContainer mode="MODAL_PAGE" dataLoaderConfig={DataLoaderConfig}>
        <File.UploadPage mode="ADD" context="FILE" />
      </Shell.PageContainer>
    )
  }
  /*{
    page: 'FILE.DOWNLOAD',
    size: 'xs',
    element: (
      <Shell.PageContainer mode="MODAL_PAGE" dataLoaderConfig={DataLoaderConfig}>
        <File.UploadPage mode="ADD" context="FILE" />
      </Shell.PageContainer>
    )
  }*/
];

const sidePages = [
  {
    page: 'FILE.UPLOAD',
    size: 'md',
    element: (
      <Shell.PageContainer mode="MODAL_PAGE" dataLoaderConfig={DataLoaderConfig}>
        <File.UploadPage mode="ADD" context="FILE" />
      </Shell.PageContainer>
    )
  }
];

export { routes, modals, sidePages, sideNavConfig, File, ResourceMapping };
