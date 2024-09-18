import React from 'react';
import Shell from '@b2bi/shell';

const CDM = {
  CDMModalPage: React.lazy(() => import('./CDM.page'))
};

const modals = [
  {
    page: 'CONTEXT_DATA_MAPPING.SELECT',
    size: 'md',
    element: (
      <Shell.PageContainer mode="MODAL_PAGE" dataLoaderConfig={{}}>
        <CDM.CDMModalPage mode="SELECT" context=""></CDM.CDMModalPage>
      </Shell.PageContainer>
    )
  },
  {
    page: 'CONTEXT_DATA_MAPPING.EDIT',
    size: 'lg',
    element: (
      <Shell.PageContainer mode="MODAL_PAGE" dataLoaderConfig={{}}>
        <CDM.CDMModalPage mode="EDIT" context="PROPERTY"></CDM.CDMModalPage>
      </Shell.PageContainer>
    )
  },
  {
    page: 'CONTEXT_DATA_MAPPING.CONTEXT_DATA',
    size: 'lg',
    element: (
      <Shell.PageContainer mode="MODAL_PAGE" dataLoaderConfig={{}}>
        <CDM.CDMModalPage mode="CONTEXT_DATA" context="PROPERTY"></CDM.CDMModalPage>
      </Shell.PageContainer>
    )
  }
];
export { modals };
