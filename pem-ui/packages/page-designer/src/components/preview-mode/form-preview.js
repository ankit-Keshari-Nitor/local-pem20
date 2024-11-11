import React, { useEffect, useState } from 'react';
import Canvas from '../canvas';
import { Form } from '@carbon/react';
import { Button } from '@carbon/react';
import './preview-mode.scss';
import { formValidation, updatePreviewChildToChildren } from '../../utils/helpers';

const FormPreview = ({ layout, renderRow, componentMapper, onFieldDelete, openPreview, dataTestid, buttonView, setOpenPreview }) => {
  const [formRenderSchema, setFormRenderSchema] = useState([]);
  useEffect(() => {
    setFormRenderSchema([...layout]);
  }, [layout, openPreview, onFieldDelete]);

  const onChangeHandle = (path, fieldValue) => {
    const schema = updatePreviewChildToChildren(formRenderSchema, path.split('-'), { value: fieldValue });
    setFormRenderSchema(schema);
  };

  const handSubmit = () => {
    let schema = JSON.parse(JSON.stringify(formRenderSchema));
    schema = formValidation(schema);
    setFormRenderSchema(schema);
  };

  return (
    <div className="view-schema-container" data-testid={dataTestid}>
      <Form aria-label="form">
        <Canvas layout={formRenderSchema} renderRow={renderRow} componentMapper={componentMapper} previewMode onChangeHandle={onChangeHandle} />
        {buttonView && <div>{formRenderSchema.length ? <Button className="preview-close-btn" onClick={(e) => setOpenPreview(false)}>Close</Button> : ''}</div>}
      </Form>
    </div>
  );
};

export default FormPreview;
