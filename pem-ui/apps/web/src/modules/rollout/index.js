import React from 'react';
import Shell from '@b2bi/shell';
import DataLoaderConfig from './data-loader-config';

const RolloutWizard = {
  Page: React.lazy(() => import('./rollout-page')),
  DataLoaderConfig: DataLoaderConfig
};

const modals = [
  {
    page: 'ROLLOUT.SELECT',
    size: 'md',
    element: (
      <Shell.PageContainer mode="MODAL_PAGE" dataLoaderConfig={RolloutWizard.DataLoaderConfig}>
        <RolloutWizard.Page />
      </Shell.PageContainer>
    )
  }
];

export { modals };
