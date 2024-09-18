import React from 'react';
import componentMapper from '@b2bi/carbon-mappers';
import PageDesigner from '@b2bi/page-designer';

export default function TestWizard({ currentTestData, formRenderSchema }) {
  const renderRow = (row, currentPath, renderRow, previewMode, onChangeHandle) => {
    return (
      <PageDesigner.Row
        key={row.id}
        data={row}
        path={currentPath}
        componentMapper={componentMapper}
        renderRow={renderRow}
        previewMode={previewMode}
        handleDrop={() => console.log('test')}
        onFieldSelect={() => console.log('test')}
        onFieldDelete={() => console.log('test')}
        onChangeHandle={() => console.log('test')}
      />
    );
  };

  return (
    <div>
      <h5 style={{ marginBottom: '1rem' }}> {currentTestData.name}</h5>
      <PageDesigner.FormPreview layout={formRenderSchema} componentMapper={componentMapper} renderRow={renderRow} buttonView={false} />
    </div>
  );
}
