import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Select from '../select';

// Mock data for testing
const field = {
  labelText: 'Test Label',
  isRequired: true,
  options: [
    { id: 1, value: 'option1', label: 'Option 1' },
    { id: 2, value: 'option2', label: 'Option 2' },
    { id: 3, value: 'option3', label: 'Option 3' }
  ]
};

describe('Select component', () => {
  it('renders with options correctly', () => {
    const { getByLabelText, getByText } = render(<Select field={field} id="test-select" />);

    expect(getByLabelText('Test Label')).toBeInTheDocument();
    expect(getByText('Option 1')).toBeInTheDocument();
    expect(getByText('Option 2')).toBeInTheDocument();
    expect(getByText('Option 3')).toBeInTheDocument();
  });

  it('renders without options when options are not provided', () => {
    const fieldWithoutOptions = { ...field, options: undefined };
    const { getByText, queryByText } = render(<Select field={fieldWithoutOptions} id="test-select" />);

    expect(getByText('Test Label')).toBeInTheDocument();

    expect(queryByText('Option 1')).toBeNull();
    expect(queryByText('Option 2')).toBeNull();
    expect(queryByText('Option 3')).toBeNull();
  });
});
