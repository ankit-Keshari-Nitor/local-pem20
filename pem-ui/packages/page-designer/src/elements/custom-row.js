import React, { useRef } from 'react';
import { useDrag } from 'react-dnd';
import { ROW } from '../constants/constants';
import Column from './custom-column';
import { Grid, Column as CarbonColumn } from '@carbon/react';
import classNames from 'classnames';

const Row = ({ data, handleDrop, path, componentMapper, onFieldSelect, renderRow, onFieldDelete, previewMode, onChangeHandle, isSelected, setIsSelected, onGroupChange }) => {
  const ref = useRef(null);
  const [{ isDragging }, drag] = useDrag({
    type: ROW,
    item: {
      type: ROW,
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

  const renderColumn = (column, currentPath, renderRow) => {
    return (
      <CarbonColumn
        // onClick={(e) => onFieldSelect(e, column, currentPath)}
        lg={column.customsize ? Number(column.customsize) - 1 : !previewMode ? Number(column.defaultsize) - 1 : Number(column.defaultsize)}
        className={classNames(!previewMode && 'column-zone')}
      >
        <Column
          key={column.id}
          data={column}
          handleDrop={handleDrop}
          path={currentPath}
          componentMapper={componentMapper}
          onFieldSelect={onFieldSelect}
          renderRow={renderRow}
          onFieldDelete={onFieldDelete}
          previewMode={previewMode}
          onChangeHandle={onChangeHandle}
          colSize={column.customsize}
          isSelected={isSelected}
          setIsSelected={setIsSelected}
          onGroupChange={onGroupChange}
        />
      </CarbonColumn>
    );
  };
  return (
    <div ref={null} style={{ opacity }} className="base row">
      <div className="columns">
        <Grid className="custom-grid">
          {data.children.map((column, index) => {
            const currentPath = `${path}-${index}`;

            return <React.Fragment key={column.id}>{renderColumn(column, currentPath, renderRow)}</React.Fragment>;
          })}
        </Grid>
      </div>
    </div>
  );
};
export default Row;
