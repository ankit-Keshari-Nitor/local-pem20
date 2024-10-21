import React, { useRef } from 'react';
import { useDrag } from 'react-dnd';
import { COLUMN } from '../constants/constants';
import DropZone from './drop-zone';
import FieldRenderer from '../components/canvas/field-renderer/field-renderer';

const Column = ({ data, handleDrop, path, componentMapper, onFieldSelect, renderRow, onFieldDelete, previewMode, onChangeHandle, colSize, isSelected, setIsSelected, onGroupChange }) => {
  const ref = useRef(null);
  const [{ isDragging }, drag] = useDrag({
    type: COLUMN,
    item: {
      type: COLUMN,
      id: data.id,
      children: data.children,
      path,
      component: data.component
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  const opacity = isDragging ? 0 : 1;
  drag(ref);

  const renderComponent = (component, currentPath) => {
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
          colSize={colSize}
          isSelected={isSelected}
          setIsSelected={setIsSelected}
        />
      </div>
    );
  };

  return (
    <div style={{ opacity }} className="base column">
      {data?.children === undefined ? (
        <>
          <React.Fragment key={data.id}>
            {!previewMode && (
              <DropZone
                data={{
                  path: path,
                  childrenCount: data.length
                }}
                onDrop={handleDrop}
              />
            )}
            {renderComponent(data, path)}
          </React.Fragment>
          {!previewMode && (
            <DropZone
              data={{
                path: `${path}-${data.length}`,
                childrenCount: data.length
              }}
              onDrop={handleDrop}
              isLast
            />
          )}
        </>
      ) : (
        <>
          {data.children.map((component, index) => {
            const currentPath = `${path}-${index}`;
            return (
              <React.Fragment key={component.id}>
                {!previewMode && (
                  <DropZone
                    data={{
                      path: currentPath,
                      childrenCount: data.children.length
                    }}
                    onDrop={handleDrop}
                  />
                )}
                {renderComponent(component, currentPath)}
              </React.Fragment>
            );
          })}
          {!previewMode && (
            <DropZone
              data={{
                path: `${path}-${data.children.length}`,
                childrenCount: data.children.length
              }}
              onDrop={handleDrop}
              isLast
              className={data.children.length === 0 ? 'plus-icon' : 'nestedZone'}
              onGroupChange={onGroupChange}
            />
          )}
        </>
      )}
    </div>
  );
};
export default Column;
