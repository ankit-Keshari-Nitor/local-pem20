import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import DatePicker from '../datepicker';
import { DatepickerIcon } from './../icons';

// Mock the DatepickerIcon component
jest.mock('./../icons', () => ({
  DatepickerIcon: () => <svg>Icon</svg>
}));

const defaultProps = {
  field: {
    type: 'DATEPICKER',
    labelText: 'Date Picker',
    value: '2024-07-31T00:00:00Z',
    dateFormat: { value: 'mm/dd/yyyy' },
    label: 'Date',
    readOnly: false,
    dateValue: '2024-07-31',
    placeHolder: 'Select a date',
    helperText: 'Please select a date',
    isRequired: true,
    minDate: { value: '2024-01-01' },
    maxDate: { value: '2024-12-31' }
  },
  id: 'date-picker-id',
  currentPath: 'path/to/field',
  onChangeHandle: jest.fn(),
  previewMode: false
};

describe('DatePicker Component', () => {
  it('renders DatePicker component', () => {
    render(<DatePicker {...defaultProps} />);
    expect(screen.getByLabelText('Date Picker')).toBeInTheDocument();
  });

  it('displays the correct initial value', () => {
    render(<DatePicker {...defaultProps} />);
    expect(screen.getByDisplayValue('07/31/2024')).toBeInTheDocument();
  });

  it('handles date changes when not in preview mode', () => {
    const { container } = render(<DatePicker {...defaultProps} />);
    const datePickerInput = container.querySelector('input');
    fireEvent.change(datePickerInput, { target: { value: '08/01/2024' } });
    expect(defaultProps.onChangeHandle).not.toHaveBeenCalled();
  });

  it('handles date changes when in preview mode', () => {
    const props = { ...defaultProps, previewMode: true };
    const { container } = render(<DatePicker {...props} />);
    const datePickerInput = container.querySelector('input');
    fireEvent.change(datePickerInput, { target: { value: '08/01/2024' } });
    expect(props.onChangeHandle).toHaveBeenCalled();
  });

  it('displays placeholder text', () => {
    render(<DatePicker {...defaultProps} />);
    expect(screen.getByPlaceholderText('Select a date')).toBeInTheDocument();
  });

  it('renders readOnly state correctly', () => {
    const props = { ...defaultProps, field: { ...defaultProps.field, readOnly: true } };
    render(<DatePicker {...props} />);
    expect(screen.getByLabelText('Date Picker')).toHaveAttribute('readonly');
  });

  it('handles min and max date constraints', () => {
    render(<DatePicker {...defaultProps} />);
    // Assuming the CarbonDatePicker component has props minDate and maxDate correctly
    expect(screen.getByLabelText('Date Picker')).toHaveAttribute('minDate', '2024-01-01');
    expect(screen.getByLabelText('Date Picker')).toHaveAttribute('maxDate', '2024-12-31');
  });

  it('displays helper text if provided', () => {
    render(<DatePicker {...defaultProps} />);
    expect(screen.getByText('Please select a date')).toBeInTheDocument();
  });

  it('renders with the correct icon', () => {
    render(<DatePicker {...defaultProps} />);
    expect(screen.getByText('Icon')).toBeInTheDocument();
  });

  it('handles date changes when in preview mode', () => {
    const props = { ...defaultProps, previewMode: true };
    const { container } = render(<DatePicker {...props} />);
    const datePickerInput = container.querySelector('input');
    fireEvent.change(datePickerInput, { target: { value: '08/01/2024' } });
    expect(props.onChangeHandle).toHaveBeenCalled();
  });

  it('displays placeholder text', () => {
    render(<DatePicker {...defaultProps} />);
    expect(screen.getByPlaceholderText('Select a date')).toBeInTheDocument();
  });

  it('renders readOnly state correctly', () => {
    const props = { ...defaultProps, field: { ...defaultProps.field, readOnly: true } };
    render(<DatePicker {...props} />);
    expect(screen.getByLabelText('Date Picker')).toHaveAttribute('readonly');
  });

  it('handles min and max date constraints', () => {
    render(<DatePicker {...defaultProps} />);
    // Assuming the CarbonDatePicker component has props minDate and maxDate correctly
    expect(screen.getByLabelText('Date Picker')).toHaveAttribute('minDate', '2024-01-01');
    expect(screen.getByLabelText('Date Picker')).toHaveAttribute('maxDate', '2024-12-31');
  });

  it('displays helper text if provided', () => {
    render(<DatePicker {...defaultProps} />);
    expect(screen.getByText('Please select a date')).toBeInTheDocument();
  });

  it('renders with the correct icon', () => {
    render(<DatePicker {...defaultProps} />);
    expect(screen.getByText('Icon')).toBeInTheDocument();
  });
});