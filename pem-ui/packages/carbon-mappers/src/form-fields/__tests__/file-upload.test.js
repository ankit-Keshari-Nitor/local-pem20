import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import FileUploader from '../file-upload'; // Adjust the import path as per your project structure

describe('FileUploader Component', () => {
  const mockField = {
    labelText: 'Upload File',
    label: 'File',
    maxFileSize: '500kb',
    accept: ['.pdf', '.doc'],
  };

  it('renders FileUploader component with default state', () => {
    const { getByLabelText } = render(<FileUploader field={mockField} />);
    const uploadLabel = getByLabelText('Upload File');
    expect(uploadLabel).toBeInTheDocument();
  });

  it('handles file upload correctly', () => {
    const { getByLabelText } = render(<FileUploader field={mockField} />);
    const fileInput = getByLabelText('Upload File');

    const mockFile = new File(['dummy content'], 'dummy.pdf', { type: 'application/pdf' });
    fireEvent.change(fileInput, { target: { files: [mockFile] } });

    // Assertions based on file upload logic
    // Verify file details or state update
  });

  it('handles file deletion', async () => {
    const { getByLabelText, queryByText } = render(<FileUploader field={mockField} />);
    const fileInput = getByLabelText('Upload File');

    const mockFile = new File(['dummy content'], 'dummy.pdf', { type: 'application/pdf' });
    fireEvent.change(fileInput, { target: { files: [mockFile] } });

    // Simulate file deletion
    const deleteButton = getByLabelText(/Delete file - dummy.pdf/i); // Use regex for case insensitivity
    fireEvent.click(deleteButton);

    // Verify file is removed from the component
    const deletedFile = queryByText('dummy.pdf');
    expect(deletedFile).not.toBeInTheDocument();
  });

});
