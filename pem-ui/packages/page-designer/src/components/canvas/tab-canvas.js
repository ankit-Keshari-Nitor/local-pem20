import React from 'react';
import FieldRenderer from './field-renderer/field-renderer';
import { DropZone } from '../../elements';

const TabCanvas = ({ layout, handleDrop, renderRow, componentMapper, onFieldSelect, onFieldDelete, path, previewMode, onChangeHandle, isSelected, setIsSelected }) => {
  const renderComponent = (component, currentPath, renderRow) => {
    return (
      <div
        onClick={(e) => {
          !previewMode && onFieldSelect(e, component, currentPath);
        }}
      >
        <FieldRenderer
          key={component.id}
          data={component}
          path={currentPath}
          componentMapper={componentMapper}
          renderRow={renderRow}
          handleDrop={handleDrop}
          onFieldDelete={onFieldDelete}
          onFieldSelect={onFieldSelect}
          previewMode={previewMode}
          onChangeHandle={onChangeHandle}
          colSize={14}
          isSelected={isSelected}
          setIsSelected={setIsSelected}
        />
      </div>
    );
  };

  return (
    <>
      {layout.map((component, index) => {
        const currentPath = `${path}-${index}`;
        return (
          <React.Fragment key={component.id}>
            {!previewMode && (
              <DropZone
                data={{
                  path: currentPath,
                  childrenCount: layout.length
                }}
                onDrop={handleDrop}
                path={currentPath}
              />
            )}
            {renderComponent(component, currentPath, renderRow)}
          </React.Fragment>
        );
      })}
      {!previewMode && (
        <DropZone
          data={{
            path: `${path}-${layout.length}`,
            childrenCount: layout.length
          }}
          onDrop={handleDrop}
          isLast
          className='nestedZone'
        />
      )}
    </>
  );
};

export default TabCanvas;
