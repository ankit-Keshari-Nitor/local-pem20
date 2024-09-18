import { render, screen } from '@testing-library/react';
import { FORM_FIELD_TYPE } from '../../constant';
import Button from '../button';
import { createContainer } from '../../utils/test-helper';

let container;

describe('Button', () => {
  beforeEach(() => {
    container = createContainer();
  });

  afterEach(function () {
    container.remove();
  });

  it('should render', () => {
    render(
      getComponent({
        value: 'Test Button value'
      })
    );

    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByText('Button Label')).toBeInTheDocument();
  });
});

const getComponent = (props) => {
  const defaultField = {
    id: 'test-button',
    type: FORM_FIELD_TYPE.BUTTON,
    labelText: 'Button Label',
    ...props
  };
  return <Button field={defaultField} />;
};
