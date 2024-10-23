import React, { useRef, useState } from 'react';
import { DropZone } from '../../elements';
import classNames from 'classnames';
import FieldRenderer from './field-renderer/field-renderer';

export default function Canvas({
  layout,
  handleDrop,
  renderRow,
  componentMapper,
  onFieldSelect,
  onFieldDelete,
  previewMode = false,
  onChangeHandle,
  handleSchemaChanges,
  onRowCopy,
  onAddRow,
  onGroupChange
}) {
  const [isSelected, setIsSelected] = useState([]);
  const renderComponent = (component, currentPath, renderRow) => {
    return (
      <div
        // onClick={(e) => {
        //   !previewMode && onFieldSelect(e, component, currentPath);
        // }}
        className={classNames(previewMode ? 'form-fields' : 'canvas-form-fields')}
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
          isSelected={isSelected}
          setIsSelected={setIsSelected}
          handleSchemaChanges={handleSchemaChanges}
          onRowCopy={onRowCopy}
          onAddRow={onAddRow}
          onGroupChange={onGroupChange}
        />
      </div>
    );
  };
  return (
    <>
      <div className="canvas">
        {layout.slice(0, 1).map((formComponent, formIndex) => {
          return (
            <form className='form-area' key={formComponent.id}>
              <div className="form-canvas">
                {layout.slice(1).map((component, index) => {
                  const currentPath = `${Number(index) + 1}`;
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
                      path: `${layout.length}`,
                      childrenCount: layout.length
                    }}
                    onDrop={handleDrop}
                    isLast
                  />
                )}
              </div>
            </form>
          );
        })}
      </div>
    </>
  );
}
