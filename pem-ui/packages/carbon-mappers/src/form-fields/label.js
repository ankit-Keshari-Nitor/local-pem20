import React from 'react';

const Label = ({ labelText, isRequired }) => {
  return (
    <React.Fragment>
      <span className="cds--label" style={{ color: isRequired ? 'red' : '#525252' }}>
        {labelText}
        {isRequired && <span>*</span>}
      </span>
    </React.Fragment>
  );
};

export default Label;
