import * as React from 'react';
import { DragVertical } from '@carbon/icons-react';
import { forwardRef } from 'react';
const CarbonDragHandle = forwardRef(
  (
    {
      className,
      title,
      disabled,
      testID: _testID,
      level: _level,
      path: _path,
      label: _label,
      context: _context,
      validation: _validation,
      schema: _schema,
      ruleOrGroup: _ruleOrGroup,
      ...extraProps
    },
    dragRef
  ) => (
    <span ref={dragRef} className={className} title={title} ghostClass={'d-none'}>
      <DragVertical isDisabled={disabled} aria-label={title ?? ''} {...extraProps} />
    </span>
  )
);
export default CarbonDragHandle;
