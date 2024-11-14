import React from 'react';
import Shell from '@b2bi/shell';
import DataLoaderConfig from './data-loader-config.js';

const CDM = {
  ModalPage: React.lazy(() => import('./cdm-modal.js')),
  ModalPageRequest: React.lazy(() => import('./cdm-modal-request.js')),
  DataLoaderConfig: DataLoaderConfig,
};

const modals = [
  {
    page: 'CONTEXT_DATA_MAPPING.VIEW',
    size: 'lg',
    element: (
      <Shell.PageContainer mode="MODAL_PAGE" dataLoaderConfig={CDM.DataLoaderConfig}>
        <CDM.ModalPage></CDM.ModalPage>
      </Shell.PageContainer>
    )
  },
  {
    page: 'CONTEXT_DATA_MAPPING.CONTEXT_DATA',
    size: 'lg',
    element: (
      <Shell.PageContainer mode="MODAL_PAGE" dataLoaderConfig={CDM.DataLoaderConfig}>
        <CDM.ModalPage mode="CONTEXT_DATA" context="PROPERTY"></CDM.ModalPage>
      </Shell.PageContainer>
    )
  },
  {
    page: 'CONTEXT_DATA_MAPPING.SELECT',
    size: 'md',
    element: (
      <Shell.PageContainer mode="MODAL_PAGE" dataLoaderConfig={CDM.DataLoaderConfig}>
        <CDM.ModalPage mode="SELECT" context=""></CDM.ModalPage>
      </Shell.PageContainer>
    )
  },
  {
    page: 'CONTEXT_DATA_MAPPING.APICONFIG',
    size: 'md',
    element: (
      <Shell.PageContainer mode="MODAL_PAGE" dataLoaderConfig={CDM.DataLoaderConfig}>
        <CDM.ModalPageRequest mode="SELECT" context="API_CONFIG"></CDM.ModalPageRequest>
      </Shell.PageContainer>
    )
  },
  {
    page: 'CONTEXT_DATA_MAPPING.ACTIVITYFILE',
    size: 'md',
    element: (
      <Shell.PageContainer mode="MODAL_PAGE" dataLoaderConfig={CDM.DataLoaderConfig}>
        <CDM.ModalPageRequest mode="SELECT" context="ACTIVITY_FILE"></CDM.ModalPageRequest>
      </Shell.PageContainer>
    )
  }
];

const ContextData = {
  Page: React.lazy(() => import('./cdm-dashboard.js'))
};

const sideNavConfig = [
  {
    label: 'mod-context-properties:sideNav.contextMapping',
    to: '/activities/contextData',
    title: 'mod-context-properties:sideNav.contextMapping',
    resourceKey: 'CONTEXT_DATA.VIEW'
  }
];

const routes = [
  {
    path: '/contextData',
    breadcrumb: 'mod-context-properties:sideNav.contextMapping',
    element: (
      <Shell.PageContainer mode="ROUTE_PAGE" resourceKey="" dataLoaderConfig={{}}>
        <ContextData.Page mode="" context="" />
      </Shell.PageContainer>
    )
  }
];

export { routes, sideNavConfig, modals };
