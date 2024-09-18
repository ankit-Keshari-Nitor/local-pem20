import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter as Router } from 'react-router-dom';
import ListPage from '../view-partners/view-partners-page';
import { Shell } from '@b2bi/shell';



// Mock necessary modules and data
jest.mock('@carbon/icons-react', () => ({
    Information: () => <span data-testid="icon-information" />,
    Add: () => <span data-testid="icon-add" />,
    PlayFilledAlt: () => <span data-testid="icon-play" />,
}));

jest.mock('@b2bi/shell', () => ({
    Shell: {
        PageUtil: jest.fn(() => ({
            t: jest.fn((key) => key),
            showSidePage: jest.fn(),
        })),
        usePage: jest.fn((args, pageFunction, config) => {
            const page = pageFunction(args, config);
            return { page };
        }),
    },
}));

jest.mock('../mockData', () => ({
    mockViewPartnersData: {
        _embedded: { data: [] },
        page: { totalItems: 0 },
    },
}));

jest.mock('react-router-dom', () => ({
    useParams: jest.fn().mockReturnValue({}),
}));

// Mock styles
jest.mock('@b2bi/styles/pages/list-page.scss', () => ({}));
jest.mock('../styles.scss', () => ({}));

describe('ListPage', () => {
    it('renders the page layout', () => {
        render(
            <Router>
                <ListPage />
            </Router>
        );

        // Check for the existence of the main shell page
        expect(screen.getByText('mod-activity-monitoring:viewPartnerList.startDate')).toBeInTheDocument();
        expect(screen.getByText('mod-activity-monitoring:viewPartnerList.description')).toBeInTheDocument();
        expect(screen.getByText('mod-activity-monitoring:viewPartnerList.contextData')).toBeInTheDocument();
        expect(screen.getByText('mod-activity-monitoring:viewPartnerList.activityDefinition')).toBeInTheDocument();

        // Check for the columns
        const columns = [
            'mod-activity-monitoring:viewPartnerList.totalTask',
            'mod-activity-monitoring:viewPartnerList.participants',
            'mod-activity-monitoring:viewPartnerList.onSchedule',
            'mod-activity-monitoring:viewPartnerList.delayed',
            'mod-activity-monitoring:viewPartnerList.completed',
            'mod-activity-monitoring:viewPartnerList.sponsorAction'
        ];

        columns.forEach((column) => {
            expect(screen.getByText(column)).toBeInTheDocument();
        });

        // Check for the data table
        expect(screen.getByTestId('view-partners-list')).toBeInTheDocument();
    });

    it('renders icons correctly', () => {
        render(
            <Router>
                <ListPage />
            </Router>
        );

        // Check if icons are rendered
        expect(screen.getByTestId('icon-information')).toBeInTheDocument();
        expect(screen.getByTestId('icon-add')).toBeInTheDocument();
        expect(screen.getByTestId('icon-play')).toBeInTheDocument();
    });

    it('renders the Shell.PageBody', () => {
        render(
            <Router>
                <ListPage />
            </Router>
        );

        // Check if Shell.PageBody is rendered
        expect(screen.getByTestId('view-partners-list')).toBeInTheDocument();
    });
});
