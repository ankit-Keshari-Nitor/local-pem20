import React from 'react';
import { Link as CarbonLink, Tooltip } from '@carbon/react';
import { FORM_FIELD_GROUPS, FORM_FIELD_LABEL, FORM_FIELD_TYPE, PropsPanelFields, PropsPanelValidationFields } from '../constant';
import { LinkIcon } from './../icons';
import { Information } from '@carbon/icons-react';

const type = FORM_FIELD_TYPE.LINK;

const Link = ({ field, id: uniqueId, previewMode }) => {
  const { type, labelText, helperText, labelLinkText, label, hrefText, ...rest } = field;
  return (
    <>
      <p className="cds--label-description">
        {labelText === undefined ? label : labelText}
        {helperText && (
          <Tooltip id={`${uniqueId}-${previewMode}`} className="min-max-tooltip" align="bottom" label={helperText}>
            <Information />
          </Tooltip>
        )}
      </p>
      <CarbonLink data-testid={uniqueId} id={uniqueId} href={hrefText} {...rest}>
        {labelLinkText === undefined ? label : labelLinkText}
      </CarbonLink>
    </>
  );
};

export default Link;

// Config of Link for Left Palette & Right Palette
Link.config = {
  type,
  label: FORM_FIELD_LABEL.LINK,
  group: FORM_FIELD_GROUPS.BASIC_INPUT,
  icon: <LinkIcon />,
  editableProps: {
    Basic: PropsPanelFields[type]
  },
  advanceProps: PropsPanelValidationFields[type]
};
