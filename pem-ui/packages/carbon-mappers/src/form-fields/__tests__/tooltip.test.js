import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Tooltip from '../tooltip';
import { FORM_FIELD_TYPE, FORM_FIELD_LABEL, FORM_FIELD_GROUPS } from '../../constant';

const field = {
  labelText: 'Info tooltip'
};

describe('Tooltip Component', () => {
  const field = {
    labelText: 'Info Tooltip'
  };
  const id = 'tooltip-id';

  it('renders Tooltip component', () => {
    render(<Tooltip field={field} id={id} />);
    expect(screen.getByTestId(id)).toBeInTheDocument();
  });

  it('displays the correct label text', () => {
    render(<Tooltip field={field} id={id} />);
    expect(screen.getByLabelText('Info Tooltip')).toBeInTheDocument();
  });


});
