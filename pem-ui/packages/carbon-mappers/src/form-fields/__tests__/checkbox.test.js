import { render, screen } from '@testing-library/react';
import { FORM_FIELD_TYPE } from '../../constant';
import Checkbox from '../checkbox';
import { createContainer } from '../../utils/test-helper';

let container;

describe('Checkbox', () => {
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
    expect(screen.getByLabelText('Checkbox Label')).toBeInTheDocument();
    const checkCheckbox = screen.getByRole('checkbox');

    expect(checkCheckbox).toBeInTheDocument();

    const checkCheckboxLabel = screen.getByText('Checkbox Label');
    expect(checkCheckboxLabel).toBeInTheDocument();
  });

  it('should render required label', function () {
    // when
    render(getComponent({ isRequired: true }));

    // then
    const checkCheckboxLabel = screen.getByText('Checkbox Label');
    expect(checkCheckboxLabel).toBeInTheDocument();
  });
});

const getComponent = (props) => {
  const defaultField = {
    id: 'test-checkbox',
    type: FORM_FIELD_TYPE.CHECKBOX,
    labelText: 'Checkbox Label',
    ...props
  };
  return <Checkbox field={defaultField} />;
};
