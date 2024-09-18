import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import DataTableComponent from '../datatable-component';

describe('DataTableComponent', () => {
  const defaultProps = {
    rows: [
      {
        id: 1,
        cells: [
          { id: 1, value: 'Cell 1' },
          { id: 2, value: 'Cell 2' }
        ]
      },
      {
        id: 2,
        cells: [
          { id: 1, value: 'Cell 3' },
          { id: 2, value: 'Cell 4' }
        ]
      }
    ],
    headers: [
      { key: 'column1', header: 'Column 1' },
      { key: 'column2', header: 'Column 2' }
    ],
    status: 'DRAFT',
    sortDirection: 'ASC',
    totalRows: 10,
    pageNumber: 1,
    pageSize: 5,
    handlePaginationChange: jest.fn(),
    handleEdit: jest.fn(),
    handleDelete: jest.fn(),
    handleActionChange: jest.fn()
  };

  it('renders the table with the correct data and headers', () => {
    render(<DataTableComponent {...defaultProps} />);

    const column1Header = screen.getByText('Column 1');
    const column2Header = screen.getByText('Column 2');

    expect(column1Header).toBeInTheDocument();
    expect(column2Header).toBeInTheDocument();
  });

  it('renders the correct number of pages in the pagination control', () => {
    render(<DataTableComponent {...defaultProps} />);

    const prevPageButton = screen.getByRole('button', { name: 'Previous page' });
    const nextPageButton = screen.getByRole('button', { name: 'Next page' });
    const pageSizeSelect = screen.getByLabelText('Items per page:');
    const paginationText = screen.getByText('1–5 of 10 items');

    expect(prevPageButton).toBeInTheDocument();
    expect(nextPageButton).toBeInTheDocument();
    expect(pageSizeSelect).toBeInTheDocument();
    expect(paginationText).toBeInTheDocument();
  });

  it('calls the handlePaginationChange function with the correct arguments when the page number or page size is changed', () => {
    const handlePaginationChangeMock = jest.fn();
    render(<DataTableComponent {...defaultProps} handlePaginationChange={handlePaginationChangeMock} />);

    const nextPageButton = screen.getByRole('button', { name: 'Next page' });
    const pageSizeSelect = screen.getByLabelText('Items per page:');

    fireEvent.click(nextPageButton);
    expect(handlePaginationChangeMock).toHaveBeenCalledTimes(1);

    fireEvent.change(pageSizeSelect, { target: { value: 10 } });
    expect(handlePaginationChangeMock).toHaveBeenCalledTimes(2);
  });

  it('calls the handlePaginationChange function when the page size is changed', () => {
    const handlePaginationChangeMock = jest.fn();
    render(<DataTableComponent {...defaultProps} handlePaginationChange={handlePaginationChangeMock} />);

    const pageSizeSelect = screen.getByLabelText('Items per page:');
    fireEvent.change(pageSizeSelect, { target: { value: 10 } });

    expect(handlePaginationChangeMock).toHaveBeenCalledTimes(1);
    expect(handlePaginationChangeMock).toHaveBeenCalledWith(1, 10);
  });

  it('calls the handlePaginationChange function when the next page button is clicked', () => {
    const handlePaginationChangeMock = jest.fn();
    render(<DataTableComponent {...defaultProps} handlePaginationChange={handlePaginationChangeMock} />);

    const nextPageButton = screen.getByRole('button', { name: 'Next page' });
    fireEvent.click(nextPageButton);

    expect(handlePaginationChangeMock).toHaveBeenCalledTimes(1);
    expect(handlePaginationChangeMock).toHaveBeenCalledWith(2, 5);
  });

  it('renders the correct number of rows based on the page size', () => {
    render(<DataTableComponent {...defaultProps} />);

    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(3); // Update the expected length to 3
  });

  it('renders the correct number of columns based on the data', () => {
    render(<DataTableComponent {...defaultProps} />);

    const headers = screen.getAllByRole('columnheader');
    expect(headers).toHaveLength(2);
  });
});
