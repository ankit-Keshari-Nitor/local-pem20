import { render, screen } from '@testing-library/react';
import { FORM_FIELD_TYPE } from '../../constant';
import Radio from '../radio';
import { createContainer } from '../../utils/test-helper';

let container;

describe('Radio', () => {
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
    expect(screen.getByLabelText('Radio Label')).toBeInTheDocument();
    const checkRadio = screen.getByRole('radio');

    expect(checkRadio).toBeInTheDocument();

    const checkRadioLabel = screen.getByText('Radio Label');
    expect(checkRadioLabel).toBeInTheDocument();
  });

  it('should render required label', function () {
    // when
    render(getComponent({ isRequired: true }));

    // then
    const checkRadioLabel = screen.getByText('Radio Label');
    expect(checkRadioLabel).toBeInTheDocument();
  });
});

const getComponent = (props) => {
  const defaultField = {
    id: 'test-radio',
    type: FORM_FIELD_TYPE.RADIO,
    labelText: 'Radio Label',
    ...props
  };
  return <Radio field={defaultField} />;
};
