import React, { useRef } from 'react';
import { useDrag } from 'react-dnd';
import { TrashCan, Draggable } from '@carbon/icons-react';

import './field-renderer.scss';
import { COMPONENT, CUSTOM_COLUMN } from '../../../constants/constants';
import { Column, Grid } from '@carbon/react';
import { AddRowIcon, CopyIcon, SplitIcon } from '../../../icon';

const FieldRenderer = ({
  data,
  path,
  componentMapper,
  renderRow,
  handleDrop,
  onFieldDelete,
  onFieldSelect,
  previewMode,
  onChangeHandle,
  colSize = 16,
  isSelected = [],
  setIsSelected,
  handleSchemaChanges,
  onRowCopy,
  onAddRow,
  onGroupChange
}) => {
  let compent_type;
  let dragItem;
  var isNestedBlock = false;
  const NewcolSize = Number(colSize) - 1;
  if (data.maintype) {
    compent_type = data.maintype;
    isNestedBlock = true;
    dragItem = { path, ...data };
  } else {
    compent_type = data.component.type;
    dragItem = { type: COMPONENT, id: data.id, path, component: data.component };
  }
  const FormFieldComponent = componentMapper[compent_type];

  if (!FormFieldComponent) {
    throw new Error(`cannot render field <${compent_type}>`);
  }

  const ref = useRef(null);

  const [{ isDragging }, drag] = useDrag({
    type: dragItem.type,
    item: dragItem,
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  const opacity = isDragging ? 0 : 1;
  const formFieldData = isNestedBlock ? (
    <FormFieldComponent
      renderRow={renderRow}
      row={data}
      currentPath={path}
      handleDrop={handleDrop}
      componentMapper={componentMapper}
      onFieldSelect={onFieldSelect}
      onFieldDelete={onFieldDelete}
      previewMode={previewMode}
      onChangeHandle={onChangeHandle}
      isSelected={isSelected}
      setIsSelected={setIsSelected}
      onGroupChange={onGroupChange}
    />
  ) : (
    <FormFieldComponent field={data.component} id={data.id} currentPath={path} onChangeHandle={onChangeHandle} previewMode={previewMode} />
  );
  drag(ref);
  return !previewMode ? (
    <div ref={ref} style={{ opacity }}>
      <div
        onClick={(e) => {
          setIsSelected([{ [path]: true }]);
        }}
        className={isSelected[0] !== undefined && isSelected[0][path] ? 'element form-fields-Selected' : 'element'}
      >
        <Grid className="custom-field-grid">
          {isNestedBlock && (
            <Column lg={1}>
              <span className="drag-icon">
                <Draggable />
              </span>
            </Column>
          )}
          <Column lg={NewcolSize <= 0 ? 16 : NewcolSize}> {formFieldData}</Column>
        </Grid>
        {isNestedBlock && (
          <>
            <div className="add-row" onClick={(e) => onAddRow(e, path)}>
              <AddRowIcon />
            </div>
            {isSelected[0] !== undefined && isSelected[0][path] && (
              <div className="action-container">
                <Grid className="actions-icons">
                  <Column lg={5}>
                    <span className="icon-pointer" onClick={(e) => onRowCopy(e, path, data)}>
                      <CopyIcon />
                    </span>
                  </Column>
                  <Column lg={6}>
                    <span
                      className="icon-pointer"
                      onClick={(e) => (data.children.length >= 2 ? onFieldDelete(e, `${path}-1`, 0) : handleSchemaChanges(data.id, CUSTOM_COLUMN, '', 1, path))}
                    >
                      <SplitIcon />
                    </span>
                  </Column>
                  <Column lg={5}>
                    <span className="icon-pointer delete-icon" onClick={(e) => onFieldDelete(e, path, 1, data.id)}>
                      <TrashCan />
                    </span>
                  </Column>
                </Grid>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  ) : (
    formFieldData
  );
};

export default FieldRenderer;
