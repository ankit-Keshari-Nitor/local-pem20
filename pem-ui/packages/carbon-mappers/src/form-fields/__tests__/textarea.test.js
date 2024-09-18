import { render, screen } from '@testing-library/react';
import TextArea from '../textarea';
import { FORM_FIELD_TYPE } from '../../constant';
import { createContainer } from '../../utils/test-helper';

let container;

describe('Textfield', () => {
  beforeEach(() => {
    container = createContainer();
  });

  afterEach(function () {
    container.remove();
  });

  it('should render', () => {
    render(getComponent());

    expect(screen.getByLabelText('Textarea Label')).toBeInTheDocument();
    const checkTextAreaLabel = screen.getByText('Textarea Label');
    expect(checkTextAreaLabel).toBeInTheDocument();
  });

  it('should render required label', function () {
    // when
    render(getComponent({ isRequired: true }));

    // then
    const checkTextAreaLabel = screen.getByText('Textarea Label');
    expect(checkTextAreaLabel).toBeInTheDocument();
  });

  it('should render helper text', function () {
    // when
    render(getComponent({ helperText: 'helperText' }));

    // then
    const checkTextAreaHelperText = screen.getByText('helperText');
    expect(checkTextAreaHelperText).toBeInTheDocument();
  });
});

const getComponent = (props) => {
  const defaultField = {
    id: 'test-text-area',
    type: FORM_FIELD_TYPE.TEXT_AREA,
    labelText: 'Textarea Label',
    ...props
  };
  return <TextArea field={defaultField} />;
};
