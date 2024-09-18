import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter as Router } from 'react-router-dom';
import Monitoring from '../monitoring-dashboard-page';
import { Shell } from '@b2bi/shell';

jest.mock('@b2bi/shell', () => ({
  __esModule: true,
  default: {
    Page: ({ children }) => <div>{children}</div>,
    PageBody: ({ children }) => <div>{children}</div>,
    DataTable: (props) => <div data-testid="view-rollout-activity" {...props} />,
    usePage: () => ({
      page: {
        model: {
          rolloutActivities: {
            mockRolloutData: {
              _embedded: { data: [] },
              page: { totalItems: 0 }
            }
          }
        },
        datatable: {
          rolloutActivities: {}
        },
        ui: {
          tableLoadingState: false
        }
      }
    }),
    PageUtil: () => ({
      t: (key) => key,
      navigate: jest.fn()
    })
  }
}));

jest.mock('../mockData', () => ({
  mockRolloutData: {
    _embedded: { data: [] },
    page: { totalItems: 0 }
  }
}));

jest.mock('react-router-dom', () => ({
  useParams: jest.fn().mockReturnValue({})
}));

// Mock styles
jest.mock('@b2bi/styles/pages/list-page.scss', () => ({}));
jest.mock('../styles.scss', () => ({}));

describe('Monitoring', () => {
  it('renders the page layout', () => {
    render(
      <Router>
        <Monitoring />
      </Router>
    );

    // Check for the existence of the main shell page
    expect(screen.getByText('mod-activity-monitoring:tabs.rolledOutActivities')).toBeInTheDocument();
    expect(screen.getByText('mod-activity-monitoring:tabs.partnersActivities')).toBeInTheDocument();
    expect(screen.getByText('mod-activity-monitoring:tabs.internalActivities')).toBeInTheDocument();

    expect(screen.getByText('mod-activity-monitoring:subTabs.notStartActivities')).toBeInTheDocument();
    expect(screen.getByText('mod-activity-monitoring:subTabs.inProgressActivities')).toBeInTheDocument();
    expect(screen.getByText('mod-activity-monitoring:subTabs.completedActivities')).toBeInTheDocument();
    expect(screen.getByText('mod-activity-monitoring:subTabs.closedActivities')).toBeInTheDocument();

    // Check for the header
    const tableHeader = [
      'mod-activity-monitoring:dashboardList.columns.name',
      'mod-activity-monitoring:dashboardList.columns.partners',
      'mod-activity-monitoring:dashboardList.columns.definitionName',
      'mod-activity-monitoring:dashboardList.columns.status',
      'mod-activity-monitoring:dashboardList.columns.action'
    ];

    tableHeader.forEach((header) => {
      expect(screen.getByText(header)).toBeInTheDocument();
    });

    // Check for the data table
    expect(screen.getByTestId('view-rollout-activity')).toBeInTheDocument();
  });

  it('renders the Shell.PageBody', () => {
    // Check if Shell.PageBody is rendered
    expect(screen.getByTestId('view-rollout-activity')).toBeInTheDocument();
  });
});
