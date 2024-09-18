import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Accordion from '../accordion';

jest.mock('../../../../page-designer/src/components/canvas/tab-canvas', () => {
  return jest.fn(() => <div data-testid="tab-canvas">TabCanvas Mock</div>);
});

describe('Accordion Component', () => {
  const renderRow = jest.fn();
  const handleDrop = jest.fn();
  const componentMapper = jest.fn();
  const onFieldSelect = jest.fn();
  const onFieldDelete = jest.fn();
  const onChangeHandle = jest.fn();
  const row = {
    component: { labelText: 'Accordion Title' },
    children: []
  };
  const currentPath = 'some/path';
  const previewMode = false;

  beforeEach(() => {
    render(
      <Accordion
        renderRow={renderRow}
        row={row}
        currentPath={currentPath}
        handleDrop={handleDrop}
        componentMapper={componentMapper}
        onFieldSelect={onFieldSelect}
        onFieldDelete={onFieldDelete}
        previewMode={previewMode}
        onChangeHandle={onChangeHandle}
      />
    );
  });

  it('should render the accordion component', () => {
    const accordion = screen.getByTestId('accordion-id');
    expect(accordion).toBeInTheDocument();
  });

  it('should display the correct title', () => {
    const accordionItem = screen.getByText('Accordion Title');
    expect(accordionItem).toBeInTheDocument();
  });
});
