import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import WrapperNotification from '../../helpers/wrapper-notification-toast';

describe('WrapperNotification', () => {
  it('renders notification with correct props', () => {
    const mockOnClose = jest.fn();
    render(<WrapperNotification open={true} title="Test Title" subtitle="Test Subtitle" kind="success" onCloseButtonClick={mockOnClose} />);

    // Check if the title and subtitle are rendered correctly
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Subtitle')).toBeInTheDocument();

    // Check if the notification has the correct kind
    const notification = screen.getByRole('status');
    expect(notification).toHaveClass('cds--inline-notification cds--inline-notification--success');

    // Check if the close button works
    const closeButton = screen.getByLabelText('close notification'); // Adjust this if the label text is different
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('does not render notification when open is false', () => {
    render(<WrapperNotification open={false} title="Test Title" subtitle="Test Subtitle" kind="success" onCloseButtonClick={() => {}} />);

    // Check if the notification is not rendered
    expect(screen.queryByText('Test Title')).not.toBeNull();
    expect(screen.queryByText('Test Subtitle')).not.toBeNull();
  });
});
