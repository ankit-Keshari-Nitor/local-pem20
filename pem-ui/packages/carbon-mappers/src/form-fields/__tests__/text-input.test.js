import { render, screen } from '@testing-library/react';
import TextInput from '../text-input';
import { FORM_FIELD_TYPE } from '../../constant';
import { createContainer } from '../../utils/test-helper';

let container;

describe('TextInput', () => {
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
        value: 'Test Input Value'
      })
    );

    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByLabelText('Text Input Label')).toBeInTheDocument();
  });

  it('should render required label', () => {
    render(
      getComponent({
        isRequired: true
      })
    );

    expect(screen.getByLabelText('Text Input Label')).toBeInTheDocument();
  });

  it('should render helper text', function () {
    // when
    render(getComponent({ helperText: 'helperText' }));

    // then
    const checkTextInputHelperText = screen.getByText('helperText');
    expect(checkTextInputHelperText).toBeInTheDocument();
  });
});

const getComponent = (props) => {
  const defaultField = {
    id: 'test-text-input',
    type: FORM_FIELD_TYPE.TEXT_INPUT,
    labelText: 'Text Input Label',
    ...props
  };
  return <TextInput field={defaultField} />;
};
