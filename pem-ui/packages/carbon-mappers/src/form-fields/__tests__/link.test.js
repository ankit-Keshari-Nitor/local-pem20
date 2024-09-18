import { render, screen } from '@testing-library/react';
import { FORM_FIELD_TYPE } from '../../constant';
import { createContainer } from '../../utils/test-helper';
import Link from '../link';

let container;

describe('Link', () => {
  beforeEach(() => {
    container = createContainer();
  });

  afterEach(function () {
    container.remove();
  });

  it('should render', () => {
    // when;
    render(getComponent());

    // then
    expect(screen.getByTestId('test-link')).toBeInTheDocument();

    const checkLinkLabel = screen.getByText('Link Label');
    expect(checkLinkLabel).toBeInTheDocument();
  });
});

const getComponent = (props) => {
  const defaultField = {
    id: 'test-link',
    type: FORM_FIELD_TYPE.LINK,
    labelText: 'Link Label',
    hrefText: 'https://example.com', // Add a sample href for the link
    ...props
  };
  return <Link field={defaultField} id="test-link" />;
};
