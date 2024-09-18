import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CheckboxGroup from '../checkbox-group';
import { FORM_FIELD_TYPE, FORM_FIELD_LABEL, FORM_FIELD_GROUPS } from '../../constant';

describe('CheckboxGroup Component', () => {
  const mockField = {
    type: FORM_FIELD_TYPE.CHECKBOXGROUP,
    labelText: 'Sample Label',
    options: [
      { label: 'Option 1', value: 'option1', id: 'option1' },
      { label: 'Option 2', value: 'option2', id: 'option2' }
    ],
    isRequired: false,
    helperText: 'Sample helper text'
  };

  it('renders CheckboxGroup component', () => {
    render(<CheckboxGroup field={mockField} id="checkboxgroup" currentPath="path" previewMode={false} />);
    expect(screen.getByTestId('checkboxgroup-false')).toBeInTheDocument();
  });

  it('displays the label text', () => {
    render(<CheckboxGroup field={mockField} id="checkboxgroup" currentPath="path" previewMode={false} />);
    expect(screen.getByText('Sample Label')).toBeInTheDocument();
  });

  it('displays the helper text', () => {
    render(<CheckboxGroup field={mockField} id="checkboxgroup" currentPath="path" previewMode={false} />);
    expect(screen.getByText('Sample helper text')).toBeInTheDocument();
  });

  it('renders all options correctly', () => {
    render(<CheckboxGroup field={mockField} id="checkboxgroup" currentPath="path" previewMode={false} />);
    expect(screen.getByLabelText('Option 1')).toBeInTheDocument();
    expect(screen.getByLabelText('Option 2')).toBeInTheDocument();
  });

  it('handles checked state correctly', () => {
    render(<CheckboxGroup field={mockField} id="checkboxgroup" currentPath="path" previewMode={false} />);
    const option1 = screen.getByLabelText('Option 1');
    const option2 = screen.getByLabelText('Option 2');

    fireEvent.click(option1);
    expect(option1).toBeChecked();
    fireEvent.click(option2);
    expect(option2).toBeChecked();
  });
});
