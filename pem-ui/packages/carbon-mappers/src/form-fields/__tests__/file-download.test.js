import React from 'react';
import { render, screen } from '@testing-library/react';
import FileDownload from '../file-download'; // Adjust the path as necessary

describe('FileDownload Component', () => {
  const defaultProps = {
    field: {
      id: 'test-file-download',
      labelText: 'Test Label Text',
      label: 'Test Label',
      helperText: 'Test Helper Text',
      buttonLabel: 'Test Button Label',
    },
  };

  it('should render correctly with default props', () => {
    render(<FileDownload field={defaultProps.field} />);
    expect(screen.getByTestId('test-file-download')).toBeInTheDocument();
    expect(screen.getByText('Test Label Text')).toBeInTheDocument();
    expect(screen.getByText('Test Button Label')).toBeInTheDocument();
    expect(screen.getByText('Test Helper Text')).toBeInTheDocument();
  });

  it('should render correctly with provided props', () => {
    const customProps = {
      field: {
        id: 'custom-file-download',
        labelText: 'Custom Label Text',
        label: 'Custom Label',
        helperText: 'Custom Helper Text',
        buttonLabel: 'Custom Button Label',
      },
    };

    render(<FileDownload field={customProps.field} />);
    expect(screen.getByTestId('custom-file-download')).toBeInTheDocument();
    expect(screen.getByText('Custom Label Text')).toBeInTheDocument();
    expect(screen.getByText('Custom Button Label')).toBeInTheDocument();
    expect(screen.getByText('Custom Helper Text')).toBeInTheDocument();
  });

  it("should default button label to 'Download' if buttonLabel is not provided", () => {
    const customProps = {
      field: {
        id: 'default-button-label',
        labelText: 'Default Button Label Test',
        helperText: 'Default Button Helper Text',
      },
    };

    render(<FileDownload field={customProps.field} />);
    expect(screen.getByTestId('default-button-label')).toBeInTheDocument();
    expect(screen.getByText('Default Button Label Test')).toBeInTheDocument();
    expect(screen.getByText('Download')).toBeInTheDocument();
    expect(screen.getByText('Default Button Helper Text')).toBeInTheDocument();
  });

  it('should render correctly if buttonLabel is provided', () => {
    const customProps = {
      field: {
        id: 'provided-button-label',
        labelText: 'Provided Button Label Test',
        helperText: 'Provided Button Helper Text',
        buttonLabel: 'Provided Button Label',
      },
    };

    render(<FileDownload field={customProps.field} />);
    expect(screen.getByTestId('provided-button-label')).toBeInTheDocument();
    expect(screen.getByText('Provided Button Label Test')).toBeInTheDocument();
    expect(screen.getByText('Provided Button Label')).toBeInTheDocument();
    expect(screen.getByText('Provided Button Helper Text')).toBeInTheDocument();
  });
});
