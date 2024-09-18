import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import FormPreview from '../preview-mode';
import { Form } from '@carbon/react';

// Mock dependencies
jest.mock('@carbon/react', () => ({
  Form: jest.fn(({ children, ...props }) => <form {...props}>{children}</form>),
  Button: jest.fn(({ children, ...props }) => <button {...props}>{children}</button>)
}));

jest.mock('../canvas', () => ({ layout, renderRow, componentMapper, onChangeHandle }) => (
  <div>
    Canvas Component
    {layout.map((row, index) => (
      <div key={index} className="canvas-component">
        {row.type}
      </div>
    ))}
  </div>
));

jest.mock('../../utils/helpers', () => ({
  formValidation: jest.fn((schema) => schema),
  updatePreviewChildToChildren: jest.fn((schema, path, value) => schema)
}));

describe('FormPreview Component', () => {
  const layout = [{ id: '1', type: 'text', value: '' }];
  const renderRow = jest.fn((row) => <div>{row.type}</div>);
  const componentMapper = {};
  const onFieldDelete = jest.fn();
  const openPreview = true;
  const dataTestid = 'form-preview';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<FormPreview layout={layout} renderRow={renderRow} componentMapper={componentMapper} onFieldDelete={onFieldDelete} openPreview={openPreview} dataTestid={dataTestid} />);
    expect(screen.getByTestId(dataTestid)).toBeInTheDocument();
  });

  it('does not display submit button when formRenderSchema is empty', () => {
    render(<FormPreview layout={[]} renderRow={renderRow} componentMapper={componentMapper} onFieldDelete={onFieldDelete} openPreview={openPreview} dataTestid={dataTestid} />);
    expect(screen.queryByRole('button', { name: /submit/i })).not.toBeInTheDocument();
  });
});
