import { render, screen } from '@testing-library/react';
import { FORM_FIELD_TYPE } from '../../constant';
import Number from '../number';
import { createContainer } from '../../utils/test-helper';

let container;

describe('Number', () => {
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
    expect(screen.getByLabelText('Number Label')).toBeInTheDocument();

    const checkNumberLabel = screen.getByText('Number Label');
    expect(checkNumberLabel).toBeInTheDocument();
  });

  it('should render required label', function () {
    // when
    render(getComponent({ isRequired: true }));

    // then
    const checkNumberLabel = screen.getByText('Number Label');
    expect(checkNumberLabel).toBeInTheDocument();
  });

  it('should render helper text', function () {
    // when
    render(getComponent({ helperText: 'helperText' }));

    // then
    const checkNumberHelperText = screen.getByText('helperText');
    expect(checkNumberHelperText).toBeInTheDocument();
  });
});

const getComponent = (props) => {
  const defaultField = {
    id: 'test-number',
    type: FORM_FIELD_TYPE.NUMBER,
    labelText: 'Number Label',
    ...props
  };
  return <Number field={defaultField} />;
};
