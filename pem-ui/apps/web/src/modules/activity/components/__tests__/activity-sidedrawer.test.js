import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ActivityVersionsSideDrawer from '../activity-sidedrawer/activity-sidedrawer';

describe('ActivityVersionsSideDrawer', () => {
  const defaultProps = {
    showDrawer: false,
    anchor: 'left',
    onClose: jest.fn(),
    children: <div>Test Children</div>,
    classes: {
      drawer: 'drawer',
      animate: 'animate',
      hidden: 'hidden',
      overlay: 'overlay',
      overlayOpen: 'overlayOpen',
      overlayHidden: 'overlayHidden',
      header: 'header',
      actionItem: 'actionItem'
    }
  };

  it('renders the children correctly', async () => {
    render(<ActivityVersionsSideDrawer {...defaultProps} open={true} />);
    expect(screen.getByText('Test Children')).toBeInTheDocument();
  });

  it('calls onClose when overlay is clicked', () => {
    render(<ActivityVersionsSideDrawer {...defaultProps} open={true} />);
    fireEvent.click(screen.getByTestId('overlay'));
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('applies the correct class names based on showDrawer prop', () => {
    const { rerender } = render(<ActivityVersionsSideDrawer {...defaultProps} showDrawer={false} />);
    expect(screen.getByTestId('overlay')).toHaveClass(defaultProps.classes.overlayHidden);
    rerender(<ActivityVersionsSideDrawer {...defaultProps} showDrawer={true} />);
    expect(screen.getByTestId('overlay')).toHaveClass(defaultProps.classes.overlayOpen);
  });
});
