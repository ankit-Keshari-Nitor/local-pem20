import React from 'react';
import { DropZone } from '../../elements';

export default function DragZone({ layout, handleDrop, renderRow }) {
  return (
    <>
      {layout.map((row, index) => {
        const currentPath = `${index}`;
        return (
          <React.Fragment key={row.id}>
            <DropZone
              data={{
                path: currentPath,
                childrenCount: layout.length
              }}
              onDrop={handleDrop}
              path={currentPath}
            />
            {renderRow(row, currentPath)}
          </React.Fragment>
        );
      })}
      <DropZone
        data={{
          path: `${layout.length}`,
          childrenCount: layout.length
        }}
        onDrop={handleDrop}
        isLast
      />
    </>
  );
}
