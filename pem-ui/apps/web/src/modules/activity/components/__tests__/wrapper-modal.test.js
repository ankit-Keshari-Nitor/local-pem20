import '@testing-library/jest-dom';
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import GeneralModal from '../../helpers/wrapper-modal';

describe('GenericModal component', () => {
  it('renders the modal with default props', () => {
    const setIsOpen = jest.fn();
    const onPrimaryButtonClick = jest.fn();
    const onSecondaryButtonClick = jest.fn();
    const primaryButtonText = 'Primary Button';
    const secondaryButtonText = 'Secondary Button';
    const modalHeading = 'Confirmation';

    const { getByLabelText, getByText } = render(
      <GeneralModal
        isOpen={true}
        setIsOpen={setIsOpen}
        primaryButtonText={primaryButtonText}
        onPrimaryButtonClick={onPrimaryButtonClick}
        secondaryButtonText={secondaryButtonText}
        onSecondaryButtonClick={onSecondaryButtonClick}
        modalHeading={modalHeading}
        onRequestClose={onSecondaryButtonClick}
      >
        {/* You can add children components here if needed */}
      </GeneralModal>
    );

    expect(getByLabelText(modalHeading)).toBeInTheDocument();
    expect(getByText(primaryButtonText)).toBeInTheDocument();
    expect(getByText(secondaryButtonText)).toBeInTheDocument();
  });

  it('calls onRequestClose when the modal is closed', () => {
    const setIsOpen = jest.fn();
    const onRequestClose = setIsOpen;
    const { getByLabelText } = render(<GeneralModal isOpen={true} setIsOpen={setIsOpen} onRequestClose={onRequestClose} />);
    fireEvent.click(getByLabelText('Close'));
    expect(setIsOpen).toHaveBeenCalledTimes(1);
  });

  it('calls handlePrimaryButtonClick when the primary button is clicked', () => {
    const handlePrimaryButtonClick = jest.fn();
    const { getByText } = render(
      <GeneralModal
        isOpen={true}
        onPrimaryButtonClick={handlePrimaryButtonClick} // Pass the function as the onPrimaryButtonClick prop
        primaryButtonText="Mark as final"
      />
    );
    fireEvent.click(getByText('Mark as final'));
    expect(handlePrimaryButtonClick).toHaveBeenCalledTimes(1);
  });

  it('renders the provided message', () => {
    const message = 'This is a test message';
    const { getByText } = render(<GeneralModal isOpen={true} children={message} />);
    expect(getByText(message)).toBeInTheDocument();
  });
});
