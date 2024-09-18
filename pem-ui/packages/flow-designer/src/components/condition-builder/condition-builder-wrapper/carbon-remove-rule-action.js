import { Button } from '@carbon/react';
import * as React from 'react';
import { CrossIcon } from '../../../icons';

const CarbonRemoveRuleAction = ({
  className,
  handleOnClick,
  label,
  title,
  disabled,
  disabledTranslation,
  testID: _testID,
  rules: _rules,
  level: _level,
  path: _path,
  context: _context,
  validation: _validation,
  ruleOrGroup: _ruleOrGroup,
  schema: _schema,
  ...extraProps
}) => (
  <Button
    className={className}
    title={disabledTranslation && disabled ? disabledTranslation.title : title}
    renderIcon={CrossIcon}
    onClick={(e) => handleOnClick(e)}
    disabled={disabled && !disabledTranslation}
    {...extraProps}
  />
);

export default CarbonRemoveRuleAction;
