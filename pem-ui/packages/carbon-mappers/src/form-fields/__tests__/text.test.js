import React from 'react';
import { render } from '@testing-library/react';
import Text from '../text';

describe('Text', () => {
  test('renders label text correctly', () => {
    const labelText = 'Test Label';
    const id = 'textTestId';

    const { getByText, getByTestId } = render(<Text field={{ labelText }} id={id} />);

    const textElement = getByText(labelText);

    // Assert label text
    expect(textElement).toBeInTheDocument();

    // Assert data-testid attribute
    const elementWithTestId = getByTestId(id);
    expect(elementWithTestId).toBeInTheDocument();
    expect(elementWithTestId).toHaveAttribute('data-testid', id);
  });
});
