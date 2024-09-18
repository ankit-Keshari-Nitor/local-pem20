import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import ListPage from '../view-partners/partner-tasks/partner-tasks-page';
import '@testing-library/jest-dom/extend-expect';

// Mock Shell component and hooks
jest.mock('@b2bi/shell', () => ({
    __esModule: true,
    default: {
        Page: ({ children }) => <div>{children}</div>,
        PageHeader: ({ title }) => <div>{title}</div>,
        PageBody: ({ children }) => <div>{children}</div>,
        DataTable: (props) => <div data-testid="partner-task-list" {...props} />,
        useSidePage: () => ({
            sidePageConfig: {
                onAction: jest.fn(),
            },
        }),
        usePage: () => ({
            page: {
                model: {
                    list: {
                        mockPartnerTaskData: {
                            _embedded: { data: [] },
                            page: { totalItems: 0 },
                        },
                    },
                },
                datatable: {
                    partnerTasks: {},
                },
                ui: {
                    tableLoadingState: false,
                },
            },
        }),
        PageUtil: () => ({
            t: (key) => key,
            showSidePage: jest.fn(),
            showPageModal: jest.fn(),
        }),
    },
}));

// Mock Carbon components
jest.mock('@carbon/icons-react', () => ({
    Information: () => <span>InformationIcon</span>,
    Close: () => <span>CloseIcon</span>,
}));

jest.mock('@carbon/react', () => ({
    Tooltip: ({ children }) => <div>{children}</div>,
}));

// Mock data
jest.mock('../mockData', () => ({
    mockPartnerTaskData: {
        _embedded: { data: [] },
        page: { totalItems: 0 },
    },
}));

describe('ListPage', () => {
    test('renders ListPage component', () => {
        const { getByText, getByTestId } = render(
            <Router>
                <ListPage />
            </Router>
        );

        expect(getByText('mod-activity-monitoring:partnerTaskList.title Partner - 1')).toBeInTheDocument();
        expect(getByTestId('partner-task-list')).toBeInTheDocument();
    });
});
