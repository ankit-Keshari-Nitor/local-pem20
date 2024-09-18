import React, { useState } from 'react';
import { FileUploaderDropContainer, FileUploaderItem, Tooltip } from '@carbon/react';
import { FORM_FIELD_GROUPS, FORM_FIELD_LABEL, FORM_FIELD_TYPE, PropsPanelFields, PropsPanelValidationFields } from '../constant';
import { FileUploadIcon } from './../icons';
import { Information } from '@carbon/icons-react';

const type = FORM_FIELD_TYPE.FILE_UPLOADER;

const FileUploader = ({ field, id, previewMode, currentPath, onChangeHandle }) => {
  const { labelText, label, maxFileSize, dragDropLabel, helperText, extensions: extensionsArray, invalid, invalidText } = field;

  const [file, setFile] = useState();
  const [error, setError] = useState('');

  function convertToBytes(sizeStr = '') {
    // Regular expression to match the size string
    const sizePattern = /(\d+(\.\d+)?)(b|kb|mb)/i;
    const match = sizeStr !== '' ? sizeStr.match(sizePattern) : false;

    setError('');

    if (!match) {
      setError("Invalid size format. Use format like '500b', '500kb', or '500mb'.");
    }

    const value = parseFloat(match[1]);
    const unit = match[3]?.toLowerCase();

    let bytes;

    switch (unit) {
      case 'b':
        bytes = value;
        break;
      case 'kb':
        bytes = value * 1024;
        break;
      case 'mb':
        bytes = value * 1024 * 1024;
        break;
      default:
        setError("Unsupported unit. Use 'b', 'kb', or 'mb'.");
    }

    return bytes;
  }

  const onAddFiles = (event, files) => {
    const file = event.target.files || files.addedFiles;
    // Check if file extension is valid
    const isValidExtension = extensionsArray.some((ext) => file[0].name.toLowerCase().endsWith(ext.toLowerCase()));

    if (!isValidExtension) {
      setError(`Invalid file type. Allowed extensions: ${extensionsArray.join(', ')}`);
      setFile();
    } else {
      const newFile = [
        {
          name: file[0].name,
          filesize: file[0].size,
          status: 'edit',
          iconDescription: 'Delete icon',
          invalidFileType: file[0].invalidFileType
        }
      ];
      setFile(newFile[0]);
      onUploadFiles(newFile[0]);
    }
  };

  const onUploadFiles = (fileUpload) => {
    if (fileUpload.filesize <= convertToBytes(maxFileSize)) {
      setError('');
      const updatedFile = {
        ...fileUpload,
        status: 'edit',
        iconDescription: 'Delete Icon',
        invalid: true,
        errorSubject: 'InValid ',
        errorBody: ('Error', { fileName: fileUpload.name, fileType: extensionsArray !== undefined ? extensionsArray.join(',') : '' })
      };
      setFile(updatedFile);
      previewMode && onChangeHandle(currentPath, updatedFile);
    } else {
      setFile();
      setError('File size exceeds the maximum limit');
    }
  };

  const onDeleteFile = function (...args) {
    setFile();
    setError('');
  };

  return (
    <div>
      {file === undefined ? (
        <>
          <p className="cds--file--label">
            {labelText === undefined ? label : labelText}
            {helperText && (
              <Tooltip id={id} className="min-max-tooltip" align="bottom" label={helperText}>
                <Information />
              </Tooltip>
            )}
          </p>
          <p className="cds--label-description">Max file size is 500kb. Supported file types are .jpg and .png.</p>
          <FileUploaderDropContainer
            labelText={dragDropLabel === undefined ? label : dragDropLabel}
            name={String(id)}
            filenameStatus="edit"
            onChange={onAddFiles}
            onAddFiles={onAddFiles}
            accept={extensionsArray}
            id={id}
          />
          {error && <p className="error-text">{error}</p>}
          {invalid && <p className="error-text">{invalidText}</p>}
        </>
      ) : (
        <div>
          <p className="cds--label-description">{labelText === undefined ? label : labelText}</p>
          <FileUploaderItem
            errorBody={`${maxFileSize} max file size. Select a new file and try again.`}
            errorSubject="File size exceeds limit"
            iconDescription="Delete file"
            name={file.name}
            onDelete={onDeleteFile}
            size="md"
            status="edit"
          />
        </div>
      )}
    </div>
  );
};

export default FileUploader;

// Config of File Uploader for Left Palette & Right Palette
FileUploader.config = {
  type,
  label: FORM_FIELD_LABEL.FILE_UPLOADER,
  group: FORM_FIELD_GROUPS.BASIC_INPUT,
  icon: <FileUploadIcon />,
  editableProps: {
    Basic: PropsPanelFields[type],
    Condition: []
  },
  advanceProps: PropsPanelValidationFields[type]
};
