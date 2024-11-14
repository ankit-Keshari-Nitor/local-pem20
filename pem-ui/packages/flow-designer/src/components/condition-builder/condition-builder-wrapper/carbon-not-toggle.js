import { Checkbox } from '@carbon/react';
import * as React from 'react';

export const CarbonNotToggle = ({
  className,
  handleOnChange,
  label,
  checked,
  title,
  disabled,
  // Props that should not be in extraProps
  path: _path,
  context: _context,
  validation: _validation,
  testID: _testID,
  schema: _schema,
  ruleGroup: _ruleGroup,
  ...extraProps
}) => (
  <Checkbox
    id="conditional-builder-checkbox"
    labelText={label}
    className={className}
    onChange={(_, { checked }) => handleOnChange(checked)}
    checked={!!checked}
    disabled={disabled}
    {...extraProps}
  />
);
