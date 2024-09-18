import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import RadioButtonGroup from '../radio-group';
import { FORM_FIELD_TYPE } from '../../constant';

describe('RadioButtonGroup Component', () => {
  const mockField = {
    type: FORM_FIELD_TYPE.RADIOGROUP,
    labelText: 'Sample Label',
    options: [
      { label: 'Option 1', value: 'option1', id: 'option1' },
      { label: 'Option 2', value: 'option2', id: 'option2' }
    ],
    isRequired: false,
    helperText: 'Sample helper text'
  };

  it('renders RadioButtonGroup component', () => {
    render(<RadioButtonGroup field={mockField} id="radiobuttongroup" previewMode={false} />);
    expect(screen.getByTestId('radiobuttongroup-false')).toBeInTheDocument();
  });

  it('displays the label text', () => {
    render(<RadioButtonGroup field={mockField} id="radiobuttongroup" previewMode={false} />);
    expect(screen.getByText('Sample Label')).toBeInTheDocument();
  });

  it('displays the helper text', () => {
    render(<RadioButtonGroup field={mockField} id="radiobuttongroup" previewMode={false} />);
    expect(screen.getByText('Sample helper text')).toBeInTheDocument();
  });

  it('renders all options correctly', () => {
    render(<RadioButtonGroup field={mockField} id="radiobuttongroup" previewMode={false} />);
    expect(screen.getByLabelText('Option 1')).toBeInTheDocument();
    expect(screen.getByLabelText('Option 2')).toBeInTheDocument();
  });

  it('handles preview mode correctly', () => {
    render(<RadioButtonGroup field={mockField} id="radiobuttongroup" previewMode={true} />);
    const option1 = screen.getByLabelText('Option 1');
    const option2 = screen.getByLabelText('Option 2');

    // Add your checks for preview mode, if there's specific behavior to test
    expect(option1).toBeInTheDocument();
    expect(option2).toBeInTheDocument();
  });

  it('selects the correct option on click', () => {
    render(<RadioButtonGroup field={mockField} id="radiobuttongroup" previewMode={false} />);
    const option1 = screen.getByLabelText('Option 1');
    const option2 = screen.getByLabelText('Option 2');

    fireEvent.click(option1);
    expect(option1).toBeChecked();
    expect(option2).not.toBeChecked();

    fireEvent.click(option2);
    expect(option2).toBeChecked();
    expect(option1).not.toBeChecked();
  });
});
