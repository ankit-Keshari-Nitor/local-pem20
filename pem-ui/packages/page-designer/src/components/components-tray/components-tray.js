import React from 'react';
import './components-tray.scss';
import ComponentItem from './component-item';
import { collectPaletteEntries } from '../../utils/helpers';

export default function ComponentsTray({ componentMapper }) {
  const initialPaletteEntries = React.useRef(collectPaletteEntries(componentMapper));
  return (
    <div className="palette">
      {initialPaletteEntries &&
        initialPaletteEntries.current.map((entry, index) => {
          return <ComponentItem key={index} data={entry} />;
        })}
    </div>
  );
}
