import React from 'react';
import { render } from '@testing-library/react';
import Label from '../label';

describe('Label', () => {
  it('renders label text and style correctly', () => {
    const labelText = 'Test Label';
    const isRequired = true;

    const { getByText, container } = render(<Label labelText={labelText} isRequired={isRequired} />);

    const labelElement = getByText(labelText);
    expect(labelElement).toBeInTheDocument();
    expect(labelElement).toHaveStyle('color: red');
    const asteriskElement = container.querySelector('span > span');
    if (isRequired) {
      expect(asteriskElement).toBeInTheDocument();
      expect(asteriskElement.textContent).toBe('*');
    } else {
      expect(asteriskElement).not.toBeInTheDocument();
    }
  });

  it('renders label text without asterisk if isRequired is false', () => {
    const labelText = 'Test Label';
    const isRequired = false;

    const { getByText, container } = render(<Label labelText={labelText} isRequired={isRequired} />);

    const labelElement = getByText(labelText);
    expect(labelElement).toBeInTheDocument();

    expect(labelElement).toHaveStyle('color: #525252');
    const asteriskElement = container.querySelector('span > span');
    expect(asteriskElement).not.toBeInTheDocument();
  });
});
