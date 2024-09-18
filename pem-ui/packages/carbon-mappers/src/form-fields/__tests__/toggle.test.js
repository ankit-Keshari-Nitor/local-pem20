import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Toggle from '../toggle';

describe('Toggle Component', () => {
  const mockField = {
    labelText: 'Test Label',
    isRequired: true,
    labelA: 'No',
    labelB: 'Yes',
    readOnly: false
  };

  it('should render without crashing', () => {
    render(<Toggle field={mockField} id="toggle-id" />);
    const toggleElement = screen.getByTestId('toggle-id');
    expect(toggleElement).toBeInTheDocument();
  });

  it('should display the correct label text', () => {
    render(<Toggle field={mockField} id="toggle-id" />);
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('should handle default labelA values', () => {
    const fieldWithDefaults = {
      ...mockField,
      labelA: undefined,
      labelB: undefined
    };
    render(<Toggle field={fieldWithDefaults} id="toggle-id" />);
    expect(screen.getByText('No')).toBeInTheDocument();
  });

  it('should pass additional props to the CarbonToggle component', () => {
    const additionalProps = {
      disabled: true,
      defaultToggled: true
    };
    render(<Toggle field={{ ...mockField, ...additionalProps }} id="toggle-id" />);
    const toggleElement = screen.getByTestId('toggle-id');
    expect(toggleElement).toBeDisabled();
    expect(toggleElement).toHaveAttribute('aria-checked', 'true');
  });
});
