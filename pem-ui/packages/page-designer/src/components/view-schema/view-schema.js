import React from 'react';
import { convertToSchema } from '../../utils/helpers';
import './view-schema.scss';

export default function ViewSchema({ layout }) {
  return (
    <div className="view-schema-container">
      <pre>{JSON.stringify(convertToSchema(layout), null, 2)}</pre>
    </div>
  );
}
