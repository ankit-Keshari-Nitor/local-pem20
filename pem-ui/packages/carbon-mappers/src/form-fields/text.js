import React from 'react';
import { FORM_FIELD_GROUPS, FORM_FIELD_LABEL, FORM_FIELD_TYPE, PropsPanelFields, PropsPanelValidationFields } from '../constant';
import { TextIcon } from '../icons';
import { Heading, Section } from '@carbon/react';

const type = FORM_FIELD_TYPE.TEXT;

const Text = ({ field, id: uniqueId }) => {
  const { labelText, label, fontSize } = field;

  return (
    <>
      {fontSize < 5 ? (
        <Section data-testid={uniqueId} id={uniqueId} level={fontSize}>
          <Heading>{labelText === undefined ? label : labelText}</Heading>
        </Section>
      ) : (
        <span data-testid={uniqueId} id={uniqueId} style={{ fontSize: fontSize?.value }}>
          {labelText === undefined ? label : labelText}
        </span>
      )}
    </>
  );
};

export default Text;

// Config of Text for Left Palette & Right Palette
Text.config = {
  type,
  label: FORM_FIELD_LABEL.TEXT,
  group: FORM_FIELD_GROUPS.ACTION,
  icon: <TextIcon />,
  editableProps: {
    Basic: PropsPanelFields[type],
    Condition: []
  },
  advanceProps: PropsPanelValidationFields[type]
};
