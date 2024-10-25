import React, { useMemo } from 'react';
import { FORM_FIELD_GROUPS, FORM_FIELD_LABEL, FORM_FIELD_TYPE, PropsPanelFields, PropsPanelValidationFields } from '../constant';
import { ImageIcon } from './../icons';

const type = FORM_FIELD_TYPE.IMAGE;

const Image = ({ field }) => {
    const { alternativeText, fileUploader, ...rest } = field;

    return (
        <>
            {fileUploader ? (
                <img src='#' alt={alternativeText || 'Image'} style={{ height: '100px', width: '100px' }} />
            ) : (
                <ImageIcon />
            )}
        </>
    );
};

export default Image;

// Config of Checkbox Group for Left Palette & Right Palette
Image.config = {
    type,
    label: FORM_FIELD_LABEL.IMAGE,
    group: FORM_FIELD_GROUPS.SELECTION,
    icon: <ImageIcon />,
    editableProps: {
        Basic: PropsPanelFields[type],
        Condition: []
    },
    advanceProps: PropsPanelValidationFields[type]
};