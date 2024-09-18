import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import HelpText from '../help-text';

const field = {
    labelText: 'Help Text tooltip'
};

describe('Tooltip Component', () => {
    const field = {
        labelText: 'Help Text Tooltip'
    };
    const id = 'tooltip-id';

    it('renders Tooltip component', () => {
        render(<HelpText field={field} id={id} />);
        expect(screen.getByTestId(id)).toBeInTheDocument();
    });

    it('displays the correct label text', () => {
        render(<HelpText field={field} id={id} />);
        expect(screen.getByLabelText('Help Text Tooltip')).toBeInTheDocument();
    });


});