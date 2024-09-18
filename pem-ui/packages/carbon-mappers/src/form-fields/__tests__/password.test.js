import { render, screen } from '@testing-library/react';
import Password from '../password';
import { FORM_FIELD_TYPE } from '../../constant';
import { createContainer } from '../../utils/test-helper';

let container;

describe('Password', () => {
  beforeEach(() => {
    container = createContainer();
  });

  afterEach(function () {
    container.remove();
  });

  it('should render', () => {
    // when;
    render(
      getComponent({
        value: 'Text Password value'
      })
    );

    // then
    expect(screen.getByLabelText('Password Label')).toBeInTheDocument();

    const checkPassword = screen.getByRole('button');

    expect(checkPassword).toBeInTheDocument();

    const checkPasswordLabel = screen.getByText('Password Label');
    expect(checkPasswordLabel).toBeInTheDocument();
  });

  it('should render required label', function () {
    // when
    render(getComponent({ isRequired: true }));

    // then
    const checkPasswordLabel = screen.getByText('Password Label');
    expect(checkPasswordLabel).toBeInTheDocument();
  });

  it('should render helper text', function () {
    // when
    render(getComponent({ helperText: 'helperText' }));

    // then
    const checkPasswordHelperText = screen.getByText('helperText');
    expect(checkPasswordHelperText).toBeInTheDocument();
  });
});

const getComponent = (props) => {
  const defaultField = {
    id: 'test-password',
    type: FORM_FIELD_TYPE.PASSWORD,
    labelText: 'Password Label',
    ...props
  };
  return <Password field={defaultField} />;
};
