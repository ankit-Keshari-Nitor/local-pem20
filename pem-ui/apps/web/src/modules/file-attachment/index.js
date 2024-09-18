import React from 'react';
import Shell from '@b2bi/shell';
import DataLoaderConfig from './data-loader-config.js';

const FileAttachment = {
  FileListPage: React.lazy(() => import('./file-attachment-page.js')),
  DataLoaderConfig: DataLoaderConfig
};

const modals = [
  {
    page: 'FILE_ATTACHMENT.VIEW',
    size: 'lg',
    element: (
      <Shell.PageContainer mode="MODAL_PAGE" dataLoaderConfig={FileAttachment.DataLoaderConfig}>
        <FileAttachment.FileListPage></FileAttachment.FileListPage>
      </Shell.PageContainer>
    )
  }
];


export { modals };
