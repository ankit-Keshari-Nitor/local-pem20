import { v4 as uuid } from 'uuid';
import { ROW, COLUMN, COMPONENT, GROUP, TAB, ACCORDION, CUSTOM_SIZE, SUBTAB, DEFAULTTITLE, SIDEBAR_ITEM, FORM, GRID } from '../constants/constants';
import { validAlphaNumericOnly, validAlphaNumericNumber, validEmail, validInteger, validURL } from './regex';

// a little function to help us with reordering the result
export const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed); // inserting task in new index

  return result;
};

export const remove = (arr, index) => [
  // part of the array before the specified index
  ...arr.slice(0, index),
  // part of the array after the specified index
  ...arr.slice(index + 1)
];

export const insert = (arr, index, newItem) => [
  // part of the array before the specified index
  ...arr.slice(0, index),
  // inserted item
  newItem,
  // part of the array after the specified index
  ...arr.slice(index)
];

export const update = (arr, index, propsName, newValue) => {
  arr[index][propsName] = newValue;
  return arr;
};

export const reorderChildren = (children, splitDropZonePath, splitItemPath) => {
  if (splitDropZonePath.length === 1) {
    const dropZoneIndex = Number(splitDropZonePath[0]);
    const itemIndex = Number(splitItemPath[0]);
    return reorder(children, itemIndex, dropZoneIndex);
  }

  const updatedChildren = [...children];

  const curIndex = Number(splitDropZonePath.slice(0, 1));

  // Update the specific node's children
  const splitDropZoneChildrenPath = splitDropZonePath.slice(1);
  const splitItemChildrenPath = splitItemPath.slice(1);
  const nodeChildren = updatedChildren[curIndex];
  updatedChildren[curIndex] = {
    ...nodeChildren,
    children: reorderChildren(nodeChildren.children, splitDropZoneChildrenPath, splitItemChildrenPath)
  };

  return updatedChildren;
};

export const removeChildFromChildren = (children, splitDropZonePath, actionCode) => {
  if (splitDropZonePath.length === 1) {
    const itemIndex = Number(splitDropZonePath[0]);
    if (actionCode === 'onRowDelete') {
      const sizeIndex = itemIndex === 1 ? 0 : 1;
      children[sizeIndex].defaultsize = 16;
    }
    return remove(children, itemIndex);
  }

  const updatedChildren = [...children];

  const curIndex = Number(splitDropZonePath.slice(0, 1));

  // Update the specific node's children
  const splitItemChildrenPath = splitDropZonePath.slice(1);
  const nodeChildren = updatedChildren[curIndex];
  updatedChildren[curIndex] = {
    ...nodeChildren,
    children: removeChildFromChildren(nodeChildren.children, splitItemChildrenPath, actionCode)
  };

  return updatedChildren;
};

export const updateConfigChildToChildren = (children, splitDropZonePath, item, rest) => {
  const { component, ...others } = item;
  if (splitDropZonePath.length === 1) {
    const dropZoneIndex = Number(splitDropZonePath[0]);
    let newLayoutStructure = { ...others, component: { ...item.component, ...rest } };
    if (children[0]?.type === COLUMN) {
      newLayoutStructure = {
        type: COLUMN,
        id: elementId('COLUMN'),
        defaultsize: '16',
        children: item.length ? [item] : []
      };
    }
    return insert(children, dropZoneIndex, newLayoutStructure);
  }

  const updatedChildren = [...children];

  const curIndex = Number(splitDropZonePath.slice(0, 1));

  // Update the specific node's children
  const splitItemChildrenPath = splitDropZonePath.slice(1);
  const nodeChildren = updatedChildren[curIndex];
  updatedChildren[curIndex] = {
    ...nodeChildren,
    children: updateConfigChildToChildren(nodeChildren.children, splitItemChildrenPath, item, rest)
  };

  return updatedChildren;
};

export const indexForChild = (layout, splitDropZonePath, idx) => {
  if (splitDropZonePath.length === 1) {
    idx = layout[splitDropZonePath[0]].children.length;
    return idx;
  }
  const updatedChildren = [...layout];
  const curIndex = Number(splitDropZonePath.slice(0, 1));
  const splitItemChildrenPath = splitDropZonePath.slice(1);
  const nodeChildren = updatedChildren[curIndex];
  return indexForChild(nodeChildren.children, splitItemChildrenPath, idx);
};

export const addChildToChildren = (children, splitDropZonePath, item) => {
  if (splitDropZonePath.length === 1) {
    const dropZoneIndex = Number(splitDropZonePath[0]);
    let newLayoutStructure = item;
    if (children[0]?.type === 'column') {
      children[0].defaultsize = '8';
      newLayoutStructure = {
        type: COLUMN,
        id: elementId('COLUMN'),
        defaultsize: '8',
        children: item.length ? [item] : []
      };
    }
    return insert(children, dropZoneIndex, newLayoutStructure);
  }

  const updatedChildren = [...children];

  const curIndex = Number(splitDropZonePath.slice(0, 1));

  // Update the specific node's children
  const splitItemChildrenPath = splitDropZonePath.slice(1);
  const nodeChildren = updatedChildren[curIndex];
  updatedChildren[curIndex] = {
    ...nodeChildren,
    children: addChildToChildren(nodeChildren.children, splitItemChildrenPath, item)
  };

  return updatedChildren;
};

export const updateChildToChildren = (children, splitDropZonePath, propsName, newValue) => {
  if (splitDropZonePath.length === 1) {
    if (propsName === CUSTOM_SIZE || propsName === 'tabTitle') {
      const dropZoneIndex = Number(splitDropZonePath[0]);
      return update(children, dropZoneIndex, propsName, newValue);
    } else {
      const updatedItem = { ...children[splitDropZonePath[0]] };
      const deletedLayout = handleRemoveItemFromLayout(children, splitDropZonePath);
      return updateConfigChildToChildren(deletedLayout, splitDropZonePath, updatedItem, { [propsName]: newValue });
    }
  }

  const updatedChildren = [...children];
  const curIndex = Number(splitDropZonePath.slice(0, 1));

  // Update the specific node's children
  const splitItemChildrenPath = splitDropZonePath.slice(1);
  const nodeChildren = updatedChildren[curIndex];
  updatedChildren[curIndex] = {
    ...nodeChildren,
    children: updateChildToChildren(nodeChildren.children, splitItemChildrenPath, propsName, newValue)
  };

  return updatedChildren;
};

export const updatePreviewChildToChildren = (children, splitDropZonePath, newValue) => {
  if (splitDropZonePath.length === 1) {
    const updatedItem = { ...children[splitDropZonePath[0]] };
    const deletedLayout = handleRemoveItemFromLayout(children, splitDropZonePath);
    return updateConfigChildToChildren(deletedLayout, splitDropZonePath, updatedItem, newValue);
  }

  const updatedChildren = [...children];
  const curIndex = Number(splitDropZonePath.slice(0, 1));

  // Update the specific node's children
  const splitItemChildrenPath = splitDropZonePath.slice(1);
  const nodeChildren = updatedChildren[curIndex];
  updatedChildren[curIndex] = {
    ...nodeChildren,
    children: updatePreviewChildToChildren(nodeChildren.children, splitItemChildrenPath, newValue)
  };

  return updatedChildren;
};

export const handleMoveWithinParent = (layout, splitDropZonePath, splitItemPath) => {
  return reorderChildren(layout, splitDropZonePath, splitItemPath);
};

export const handleAddColumDataToRow = (layout) => {
  const layoutCopy = [...layout];
  const COLUMN_STRUCTURE = {
    type: COLUMN,
    id: elementId('COLUMN'),
    children: []
  };

  return layoutCopy.map((row) => {
    if (!row.children.length) {
      row.children = [COLUMN_STRUCTURE];
    }
    return row;
  });
};

export const handleMoveToDifferentParent = (layout, splitDropZonePath, splitItemPath, item) => {
  let newLayoutStructure;
  const COLUMN_STRUCTURE = {
    type: COLUMN,
    id: elementId('COLUMN'),
    children: [item]
  };

  const ROW_STRUCTURE = {
    type: ROW,
    id: elementId('ROW')
  };

  switch (splitDropZonePath.length) {
    case 1: {
      // moving column outside into new row made on the fly
      if (item.type === COLUMN) {
        newLayoutStructure = {
          ...ROW_STRUCTURE,
          children: [item]
        };
      } else {
        // moving component outside into new row made on the fly
        if (item.component.type === GROUP || item.component.type === ACCORDION) {
          newLayoutStructure = {
            ...ROW_STRUCTURE,
            maintype: item.component.type,
            children: [COLUMN_STRUCTURE]
          };
        }
        newLayoutStructure = {
          ...item
        };
      }
      break;
    }
    case 2: {
      // moving component outside into a row which creates column
      if (item.type === COMPONENT) {
        newLayoutStructure = COLUMN_STRUCTURE;
      } else {
        // moving column into existing row
        newLayoutStructure = item;
      }

      break;
    }
    default: {
      newLayoutStructure = item;
    }
  }

  let updatedLayout = layout;
  updatedLayout = removeChildFromChildren(updatedLayout, splitItemPath);
  updatedLayout = addChildToChildren(updatedLayout, splitDropZonePath, newLayoutStructure);

  return updatedLayout;
};

export const handleMoveSidebarComponentIntoParent = (layout, splitDropZonePath, item) => {
  let newLayoutStructure;
  if (item?.component?.type === GROUP) {
    switch (splitDropZonePath.length) {
      case 1: {
        newLayoutStructure = {
          type: ROW,
          id: elementId('ROW'),
          maintype: item.component.type,
          children: [
            {
              type: COLUMN,
              id: elementId('COLUMN'),
              defaultsize: '16',
              children: []
            }
          ]
        };
        break;
      }
      case 2: {
        if (item.component.type === GROUP) {
          newLayoutStructure = {
            type: ROW,
            id: elementId('ROW'),
            maintype: item.component.type,
            children: [
              {
                type: COLUMN,
                id: elementId('COLUMN'),
                defaultsize: '16',
                children: []
              }
            ]
          };
        } else {
          newLayoutStructure = {
            type: COLUMN,
            id: elementId('COLUMN'),
            children: [item]
          };
        }
        break;
      }
      default: {
        newLayoutStructure = {
          type: ROW,
          id: elementId('ROW'),
          maintype: item.component.type,
          children: [
            {
              type: COLUMN,
              id: elementId('COLUMN'),
              children: []
            }
          ]
        };
      }
    }
  } else {
    if (item?.component?.type === GROUP) {
      newLayoutStructure = {
        maintype: item.component.type,
        ...item
      };
    } else if (item?.component?.type === ACCORDION) {
      newLayoutStructure = {
        id: elementId(item.component.type),
        type: item.component.type,
        maintype: item.component.type,
        children: [],
        component: item.component
      };
    } else if (item?.component?.type === TAB) {
      newLayoutStructure = {
        id: elementId(item.component.type),
        type: item.component.type,
        maintype: item.component.type,
        component: item.component,
        children: [
          {
            id: elementId('SUB_TAB'),
            tabTitle: DEFAULTTITLE,
            type: SUBTAB,
            children: []
          }
        ]
      };
    } else {
      if (splitDropZonePath.length > 1) {
        newLayoutStructure = {
          ...item
        };
      } else {
        newLayoutStructure = {
          type: ROW,
          id: elementId('ROW'),
          maintype: 'group',
          children: [
            {
              type: COLUMN,
              id: elementId('COLUMN'),
              defaultsize: '16',
              children: [{ ...item }]
            }
          ]
        };
      }
    }
  }
  return addChildToChildren(layout, splitDropZonePath, newLayoutStructure);
};

export const handleRemoveItemFromLayout = (layout, splitItemPath, actionCode) => {
  return removeChildFromChildren(layout, splitItemPath, actionCode);
};

export const getFormFieldDetails = (path, layout) => {
  let res = {};
  if (path.length > 1) {
    if (layout && layout.type === ROW) {
      layout = layout.children[path[0]];
    } else {
      layout = layout[path[0]];
    }
    path.shift();
    getFormFieldDetails(path, layout);
  } else {
    if (layout.children && layout.children.length > 0) {
      res = layout.children[+path];
    } else {
      res = layout[+path];
    }
  }
  return res;
};

export const componentNames = {
  ['Single line input']: 'TEXTINPUT',
  ['Textarea']: 'TEXTAREA',
  ['Password']: 'PASSWORD',
  ['Checkbox']: 'CHECKBOX',
  ['Drop-down']: 'DROPDOWN',
  ['Toggle']: 'TOGGLE',
  ['Hyperlink']: 'HYPERLINK',
  ['File Upload']: 'FILEUPLOAD',
  ['Date']: 'DATE',
  ['Information']: 'INFORMATION',
  ['Help']: 'HELP',
  ['group']: 'GROUP',
  ['accordion']: 'ACCORDION',
  ['tab']: 'TAB',
  ['button']: 'BUTTON',
  ['checkbox']: 'CHECKBOX',
  ['radio']: 'RADIO',
  ['Number']: 'NUMBER',
  ['switch']: 'SWITCH',
  ['data-table']: 'DATATABLE',
  ['File Download']: 'FILEDOWNLOAD',
  ['Label']: 'LABEL',
  ['Radio Button Group']: 'RADIOGROUP',
  ['Image'] : 'IMAGE'
};

export const componentReNames = {
  ['TEXTINPUT']: 'Single line input',
  ['TEXTAREA']: 'Textarea',
  ['PASSWORD']: 'Password',
  ['CHECKBOX']: 'Checkbox',
  ['DROPDOWN']: 'Drop-down',
  ['TOGGLE']: 'Toggle',
  ['HYPERLINK']: 'Hyperlink',
  ['FILEUPLOAD']: 'File Upload',
  ['DATE']: 'Date',
  ['INFORMATION']: 'Information',
  ['HELP']: 'Help',
  ['GROUP']: 'group',
  ['ACCORDION']: 'accordion',
  ['TAB']: 'tab',
  ['BUTTON']: 'button',
  ['CHECKBOX']: 'checkbox',
  ['RADIO']: 'radio',
  ['NUMBER']: 'Number',
  ['SWITCH']: 'switch',
  ['DATATABLE']: 'data-table',
  ['FILEDOWNLOAD']: 'File Download',
  ['LABEL']: 'Label',
  ['RADIOGROUP']: 'Radio Button Group',
  ['IMAGE'] : 'Image'
};

export const nestedLayoutView = (childLayout, childSchema) => {
  childLayout.forEach((item, index) => {
    switch (item.type) {
      case ROW: {
        childSchema.push({
          id: item.id,
          cType: item.type.toUpperCase(),
          children: []
        });
        nestedLayoutView(childLayout[index]?.children, childSchema[index].children);
        break;
      }
      case COLUMN: {
        childSchema.push({
          id: item.id,
          cType: item.type.toUpperCase(),
          //size: item?.customsize ? item?.customsize : item?.defaultsize,
          children: []
        });
        nestedLayoutView(childLayout[index]?.children, childSchema[index].children);
        break;
      }
      case ACCORDION: {
        const { icon, label, group, ...others } = item.component;
        childSchema.push({
          ...others,
          children: []
        });
        nestedLayoutView(childLayout[index]?.children, childSchema[index].children);
        break;
      }
      case TAB: {
        const { icon, label, group, ...others } = item.component;
        childSchema.push({
          ...others,
          children: []
        });
        nestedLayoutView(childLayout[index]?.children, childSchema[index].children);
        break;
      }
      case SUBTAB: {
        const { id, tabTitle, type } = item;
        childSchema.push({
          id,
          tabTitle,
          type,
          children: []
        });
        nestedLayoutView(childLayout[index]?.children, childSchema[index].children);
        break;
      }
      default: {
        const { icon, label, group, type, id, ...others } = item.component;
        childSchema.push({
          id: id,
          cType: componentNames[type].toUpperCase(),
          props: {
            ...others
          }
        });
      }
    }
  });
  return childSchema;
};

export const convertToApiSchema = (layout) => {
  const schema = nestedLayoutView(layout.slice(1), []);
  const { customProps, defaultProps, id, type, ...rest } = layout.slice(0, 1)[0];
  const formProps = rest.defaultStyle ? defaultProps : customProps;
  const formSchema = {
    id: id,
    cType: type,
    props: {
      ...rest,
      ...formProps
    },
    children: [
      {
        id: elementId('GRID'),
        cType: 'GRID',
        children: schema
      }
    ]
  };
  return formSchema;
};

export const defaultFormProps = {
  fontFamily: 'IBM Plex Sans',
  fontSize: '14px',
  fontColor: '#161616',
  formBackground: 'white',
  labelStyle: '400',
  labelFontSize: '14px',
  labelColor: '#161616'
};

export const formInitializer = (formObj) => {
  return formObj.form?.cType
    ? getFormObject([formObj.form], [])
    : [
        {
          type: 'FORM',
          id: `pem_${formObj.formId}`,
          name: 'Form',
          width: '100px',
          height: '100px',
          defaultStyle: true,
          defaultProps: {
            ...defaultFormProps
          },
          customProps: {
            ...defaultFormProps
          }
        },
        {
          type: 'row',
          id: elementId('ROW'),
          maintype: 'group',
          children: [
            {
              type: 'column',
              id: elementId('COLUMN'),
              defaultsize: '16',
              children: []
            }
          ]
        }
      ];
};

export const getFormObject = (schema, formObj, colSize = 16) => {
  schema.forEach((item, index) => {
    switch (item.cType.toLowerCase()) {
      case FORM: {
        const {
          id,
          cType,
          props: { defaultStyle, height, name, width, ...rest }
        } = item;
        formObj.push({
          id: id,
          type: cType.toLowerCase(),
          defaultStyle: defaultStyle,
          height: height,
          name: name,
          width: width,
          customProps: { ...rest },
          defaultProps: { ...defaultFormProps }
        });
        getFormObject(schema[index]?.children, formObj);
        break;
      }
      case GRID: {
        getFormObject(schema[index]?.children, formObj);
        break;
      }
      case ROW: {
        const size = item.children.length > 1 ? 8 : 16;
        formObj.push({
          id: item.id,
          type: item.cType.toLowerCase(),
          maintype: GROUP,
          children: []
        });
        getFormObject(schema[index]?.children, formObj[index+1].children, size);
        break;
      }
      case COLUMN: {
        formObj.push({
          id: item.id,
          type: item.cType.toLowerCase(),
          defaultsize: colSize,
          children: []
        });
        getFormObject(schema[index]?.children, formObj[index].children);
        break;
      }
      case ACCORDION: {
        const { children, ...others } = item;
        formObj.push({
          id: item.id,
          type: item.type,
          maintype: ACCORDION,
          component: {
            ...others
          },
          children: []
        });
        getFormObject(children, formObj[index].children);
        break;
      }
      case TAB: {
        const { children, ...others } = item;
        formObj.push({
          id: item.id,
          type: item.type,
          maintype: TAB,
          component: {
            ...others
          },
          children: []
        });
        getFormObject(children, formObj[index].children);
        break;
      }
      case SUBTAB: {
        const { children, ...others } = item;
        formObj.push({
          ...others,
          children: []
        });
        getFormObject(children, formObj[index].children);
        break;
      }
      default: {
        formObj.push({
          id: item.id,
          type: COMPONENT,
          component: {
            id: item.id,
            type: componentReNames[item.cType],
            ...item.props
          }
        });
      }
    }
  });
  //   switch (item.cType) {
  //     case 'GRID': {
  //       getFormObject(schema[index]?.children, formObj);
  //       break;
  //     }
  //     case 'COLUMN': {
  //       getFormObject(schema[index]?.children, formObj);
  //       break;
  //     }
  //     case ACCORDION: {
  //       const { children, ...others } = item;
  //       formObj.push({
  //         id: item.id,
  //         type: item.type,
  //         maintype: ACCORDION,
  //         component: {
  //           ...others
  //         },
  //         children: []
  //       });
  //       getFormObject(children, formObj[index].children);
  //       break;
  //     }
  //     case TAB: {
  //       const { children, ...others } = item;
  //       formObj.push({
  //         id: item.id,
  //         type: item.type,
  //         maintype: TAB,
  //         component: {
  //           ...others
  //         },
  //         children: []
  //       });
  //       getFormObject(children, formObj[index].children);
  //       break;
  //     }
  //     case SUBTAB: {
  //       const { children, ...others } = item;
  //       formObj.push({
  //         ...others,
  //         children: []
  //       });
  //       getFormObject(children, formObj[index].children);
  //       break;
  //     }
  //     default: {
  //       formObj.push({
  //         id: item.props.id,
  //         type: COMPONENT,
  //         component: {
  //           type: componentReNames[item.cType],
  //           ...item.props
  //         }
  //       });
  //     }
  //   }
  // });
  return formObj;
};

export const findChildComponentById = (array, id) => {
  for (const item of array) {
    if (item.id === id) return item;
    if (item.children?.length) {
      const innerResult = findChildComponentById(item.children, id);
      if (innerResult) return innerResult;
    }
  }
};

export const formValidation = (formLayout) => {
  formLayout.forEach((fieldItem, index) => {
    switch (fieldItem.type) {
      case COMPONENT: {
        fieldItem.component.invalid = false;
        // Check required field
        if (fieldItem.component?.isRequired?.value && (fieldItem.component?.value === undefined || fieldItem.component?.value.length <= 0)) {
          fieldItem.component.invalid = true;
          fieldItem.component.invalidText = fieldItem.component?.isRequired.message;
        }
        // Check minimum length
        if (fieldItem.component?.min?.value && fieldItem.component?.value !== undefined && fieldItem.component?.value.length < Number(fieldItem.component?.min?.value.trim())) {
          fieldItem.component.invalid = true;
          fieldItem.component.invalidText = fieldItem.component?.min.message;
        }
        // Check maximum length
        if (fieldItem.component?.max?.value && fieldItem.component?.value !== undefined && fieldItem.component?.value.length > Number(fieldItem.component?.max?.value.trim())) {
          fieldItem.component.invalid = true;
          fieldItem.component.invalidText = fieldItem.component?.max.message;
        }
        // Regex validation
        if (fieldItem.component?.regexValidation?.value && fieldItem.component?.regexValidation?.value !== undefined) {
          const isValueValid = validateRegex(fieldItem.component?.value, fieldItem.component?.regexValidation);
          fieldItem.component.invalid = isValueValid;
          fieldItem.component.invalidText = fieldItem.component?.regexValidation.message;
        }
        // Additional checks for number input
        if (fieldItem.component?.type === 'numberinput') {
          const value = Number(fieldItem.component?.value);
          const minValue = Number(fieldItem.component.min?.value);
          const maxValue = Number(fieldItem.component.max?.value);

          if (!isNaN(minValue) && value < minValue) {
            fieldItem.component.invalid = true;
            fieldItem.component.invalidText = fieldItem.component?.min.message;
          }
          if (!isNaN(maxValue) && value > maxValue) {
            fieldItem.component.invalid = true;
            fieldItem.component.invalidText = fieldItem.component?.max.message;
          }
        }
        break;
      }
      default: {
        formValidation(formLayout[index]?.children);
      }
    }
  });
  return formLayout;
};

const validateRegex = (inputValue, regexValidation) => {
  switch (regexValidation?.pattern) {
    case 'Lower- or Upper-case Alpha Numeric only':
      return !validAlphaNumericOnly.test(inputValue);
    case 'Lower- or Upper-case Alpha Numeric and Numbers only':
      return !validAlphaNumericNumber.test(inputValue);
    case 'Email Address':
      return !validEmail.test(inputValue);
    case 'Integer Number with min and max values':
      return !validInteger.test(inputValue);
    case 'URL':
      return !validURL.test(inputValue);
    case 'Custom Regular Expression':
      return isValidCustomRegex(inputValue, regexValidation?.customRegex);
    default:
      break;
  }
};

const isValidCustomRegex = (inputValue, customRegex) => {
  const validCustomRegex = new RegExp(customRegex);
  return !validCustomRegex.test(inputValue);
};

export const collectPaletteEntries = (formFields) => {
  return Object.entries(formFields)
    .map(([type, formField]) => {
      const { config: fieldConfig } = formField;
      if (fieldConfig.type !== 'group') {
        return {
          type: SIDEBAR_ITEM,
          component: {
            type: type,
            label: fieldConfig.label,
            icon: fieldConfig.icon
          }
        };
      } else {
        return {
          type: 'default',
          component: {
            type: type,
            label: fieldConfig.label,
            icon: fieldConfig.icon
          }
        };
      }
    })
    .filter(({ type }) => type !== 'default');
};

// Capitalize the first letter of a string
export const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();

export const defaultProps = (item) => {
  switch (item.component.type) {
    case 'Checkbox':
    case 'Radio Button Group':
    case 'Drop-down':
      item.component.options = [{ label: '', id: 0, value: '' }];
      break;
    case 'Single line input':
    case 'Password':
      item.component.max = { value: '20', message: `${item.component.label} must be no longer than 20 characters.` };
      break;
    case 'Textarea':
      item.component.height = 1;
      item.component.max = { value: '20', message: `${item.component.label} must be no longer than 20 characters.` };
      break;
    case 'File Upload':
      item.component.maxFileSize = '100kb';
      break;
    case 'Date':
      item.component.dateFormat = 'm/d/Y';
      break;
    case 'Number':
      item.component.max = { value: '20', message: `${item.component.label} value should be between 0 - 20.` };
      item.component.min = { value: '0', message: `${item.component.label} value should be between 0 - 20.` };
      break;
    case 'Toggle':
      item.component.toggleValue = 'true';
      break;
    default:
      break;
  }
};

export const copyComponent = (originalComponent, newComponent) => {
  originalComponent.map((component, index) => {
    if (component?.children?.length > 0) {
      newComponent.push({
        ...component,
        id: `pem_${uuid()
          .replace(/[^0-9]/g, '')
          .substring(0, 5)}`,
        children: []
      });
      return copyComponent(component.children, newComponent[index].children);
    } else if (component.type === COMPONENT) {
      const newId = `pem_${uuid()
        .replace(/[^0-9]/g, '')
        .substring(0, 5)}`;
      return newComponent.push({
        ...component,
        component: { ...component.component, id: newId },
        id: newId
      });
    } else if (component.type === COLUMN) {
      return newComponent.push({
        ...component,
        id: `pem_${uuid()
          .replace(/[^0-9]/g, '')
          .substring(0, 5)}`,
        children: []
      });
    }
  });
  return newComponent;
};

export const elementId = (prefix) => {
  return `${prefix}_${uuid()
    .replace(/[^0-9]/g, '')
    .substring(0, 5)}`;
};
