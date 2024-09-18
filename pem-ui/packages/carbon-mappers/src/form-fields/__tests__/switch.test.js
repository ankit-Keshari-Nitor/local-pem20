import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Switch from '../switch';
import { FORM_FIELD_TYPE } from '../../constant';

describe('Switch Component', () => {
  const mockField = {
    type: FORM_FIELD_TYPE.SWITCH,
    isDisabled: false,
    labelText: 'Sample Switch'
  };

  it('renders Switch component', () => {
    render(<Switch field={mockField} id="switch" />);
    expect(screen.getByRole('tablist')).toBeInTheDocument();
  });

  it('displays the switch options', () => {
    render(<Switch field={mockField} id="switch" />);
    expect(screen.getByText('YES')).toBeInTheDocument();
    expect(screen.getByText('No')).toBeInTheDocument();
  });

  it('handles state changes', () => {
    render(<Switch field={mockField} id="switch" />);
    const yesOption = screen.getByText('YES').closest('button');
    const noOption = screen.getByText('No').closest('button');

    fireEvent.click(yesOption);
    expect(yesOption).toHaveAttribute('aria-selected', 'true');
    expect(noOption).toHaveAttribute('aria-selected', 'false');

    fireEvent.click(noOption);
    expect(noOption).toHaveAttribute('aria-selected', 'true');
    expect(yesOption).toHaveAttribute('aria-selected', 'false');
  });
});
