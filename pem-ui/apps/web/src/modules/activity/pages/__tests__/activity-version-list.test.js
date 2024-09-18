import '@testing-library/jest-dom';
import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import ActivityVersionList from '../activity-version-list/activity-version-list';
import userEvent from '@testing-library/user-event';
import * as ActivityService from '../../services/activity-service';
import { ACTIVITY_VERSION_COLUMNS } from '../../constants';

jest.mock('../../services/activity-service', () => ({
  getActivityVersionkey: jest.fn()
}));

const mockData = {
  content: [
    { id: 1, version: 'v1.0', status: 'DRAFT' },
    { id: 2, version: 'v2.0', status: 'DRAFT' }
  ],
  pageContent: {
    totalElements: 2
  }
};

describe('ActivityVersionList', () => {
  const defaultProps = {
    drawerVersionActivityName: 'Test Activity',
    activityDefnKey: 'test-key',
    status: 'DRAFT',
    onClose: jest.fn(),
    openVersionDrawer: jest.fn()
  };

  beforeEach(() => {
    ActivityService.getActivityVersionkey.mockResolvedValue(mockData);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the component with header and close button', () => {
    render(<ActivityVersionList {...defaultProps} />);

    expect(
      screen.getByText((content, element) => {
        return element.tagName.toLowerCase() === 'div' && content.includes('Version History');
      })
    ).toBeInTheDocument();
    expect(screen.getByLabelText('close')).toBeInTheDocument();
  });

  it('fetches and displays data on mount', async () => {
    render(<ActivityVersionList />);

    // Wait for the versions to appear in the document
    await waitFor(() => {
      expect(screen.getByText((content) => content.includes('v1.0'))).toBeInTheDocument();
      expect(screen.getByText((content) => content.includes('v2.0'))).toBeInTheDocument();
    });
  });

  it('handles pagination change', async () => {
    render(<ActivityVersionList {...defaultProps} />);

    const nextPageButton = screen.getByText((content) => content.includes('Next'));
    fireEvent.click(nextPageButton);
  });

  it('handles sorting column click', async () => {
    render(<ActivityVersionList {...defaultProps} />);

    const versionHeader = screen.getByText(ACTIVITY_VERSION_COLUMNS[0].header);
    fireEvent.click(versionHeader);

    await waitFor(() => {
      expect(ActivityService.getActivityVersionkey).toHaveBeenCalledWith(0, 10, 'DESC', 'DRAFT', true, 'test-key');
    });
  });

  it('calls onClose when close button is clicked', () => {
    render(<ActivityVersionList {...defaultProps} />);

    const closeButton = screen.getByLabelText('close');
    fireEvent.click(closeButton);

    expect(defaultProps.onClose).toHaveBeenCalled();
  });
});
