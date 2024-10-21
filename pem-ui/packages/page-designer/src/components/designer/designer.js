import React, { useState, useCallback, useRef } from 'react';
import { v4 as uuid } from 'uuid';
import './designer.scss';

import Row from '../../elements/custom-row';
import Canvas from '../canvas';
import ComponentsTray from '../components-tray';
import PropsPanel from '../props-panel/props-panel';

import {
  handleMoveWithinParent,
  handleMoveToDifferentParent,
  handleMoveSidebarComponentIntoParent,
  handleRemoveItemFromLayout,
  updateChildToChildren,
  addChildToChildren,
  findChildComponentById,
  indexForChild,
  capitalizeFirstLetter,
  defaultProps,
  convertToSchema,
  getFormObject,
  copyComponent,
  collectPaletteEntries
} from '../../utils/helpers';
import {
  SIDEBAR_ITEM,
  COMPONENT,
  COLUMN,
  ISREQUIRED,
  INITIAL_DATA,
  ACCORDION,
  CUSTOM_COLUMN,
  CUSTOM_SIZE,
  SUBTAB,
  CUSTOM_TITLE,
  DEFAULTTITLE,
  TAB,
  NAME,
  REGEXVALIDATION,
  OPTIONS,
  TABLE_COLUMNS,
  TABLE_HEADER,
  OPTION,
  DATATABLE,
  TABLE_ROWS,
  MAXPROPS,
  MINPROPS,
  ROW,
  ELEMENT_TYPES,
  RADIO,
  EXTENSIONS
} from '../../constants/constants';
import ViewSchema from './../view-schema';
import { Button, Grid, Modal, Column, Layer, IconButton } from '@carbon/react';
import FormPreview from '../preview-mode';
import { View, CloseLarge } from '@carbon/icons-react';
import { FormPropsPanel } from '../props-panel';

export default function Designer({ componentMapper, onClickPageDesignerBack, activityDefinitionData, saveFormDesignerData, formFields }) {
  const initialLayout = [
    // {
    //   type: 'FORM',
    //   id: uuid(),
    //   name: 'form-test',
    //   children: []
    // },
    {
      type: 'row',
      id: '85a143ba-6fa6-43e0-995d-b49a4d05972c',
      maintype: 'group',
      children: [
        {
          type: 'column',
          id: '0a128e51-b971-4fd5-ad64-7d4b5693ed93',
          defaultsize: '16',
          children: []
        }
      ]
    }
  ];
  const initialComponents = INITIAL_DATA.components;
  //const [layout, setLayout] = useState(getFormObject(formFields, []));
  const [layout, setLayout] = useState(initialLayout);
  const [components, setComponents] = useState(initialComponents);
  const [selectedFieldProps, setSelectedFiledProps] = useState();
  const [formFieldProps, setFormFieldProps] = useState(true);
  const [open, setOpen] = useState(false);
  const [openPreview, setOpenPreview] = useState(false);
  const [deletedFieldPath, setDeletedFieldPath] = useState();
  const [componentsNames, setComponentsNames] = useState([]);
  const [propsPanelActiveTab, setPropsPanelActiveTab] = useState(0);
  const [isRowDelete, setIsRowDelete] = useState(false);
  const rowDataForDelete = useRef();
  console.log('layout>>>', layout);
  const handleDrop = useCallback(
    (dropZone, item) => {
      const splitDropZonePath = dropZone.path.split('-');
      const pathToDropZone = splitDropZonePath.slice(0, -1).join('-');
      let newItem = { id: item.id, type: item.type, component: item.component };
      if (item.maintype) {
        newItem = { id: item.id, type: item.type, maintype: item.maintype, children: item.children };
      }
      if (item.type === COLUMN) {
        newItem.children = item.children;
      }

      if (item.component.type === DATATABLE) {
        item = { id: item.id, type: item.type, component: { ...item.component, [TABLE_COLUMNS]: TABLE_HEADER } };
      }

      // sidebar into
      if (item.type === SIDEBAR_ITEM) {
        // 1. Move sidebar item into page
        const newComponent = {
          id: `pem_${uuid().replace(/[^0-9]/g, '').substring(0, 5)}`,
          ...item.component
        };
        setComponents({
          ...components,
          [newComponent.id]: newComponent
        });
        defaultProps(item);

        const newItem = {
          id: newComponent.id,
          type: COMPONENT,
          component: { ...item.component, id: newComponent.id, name: 'form-control-' + newComponent.id.substring(0, 2), labelText: item.component.label }
        };
        setComponentsNames((preState) => [...preState, { id: newItem.id, name: 'form-control-' + newItem.id.substring(0, 2) }]);
        setLayout(handleMoveSidebarComponentIntoParent(layout, splitDropZonePath, newItem));
        return;
      }

      // move down here since sidebar items dont have path
      const splitItemPath = item.path.split('-');
      const pathToItem = splitItemPath.slice(0, -1).join('-');

      // 2. Pure move (no create)
      if (splitItemPath.length === splitDropZonePath.length) {
        // 2.a. move within parent
        if (pathToItem === pathToDropZone) {
          setLayout(handleMoveWithinParent(layout, splitDropZonePath, splitItemPath));
          return;
        }

        // 2.b. OR move different parent
        setLayout(handleMoveToDifferentParent(layout, splitDropZonePath, splitItemPath, newItem));
        return;
      }
      // 3. Move + Create
      setLayout(handleMoveToDifferentParent(layout, splitDropZonePath, splitItemPath, newItem));
    },
    [layout, components]
  );
  const onFieldSelect = (e, componentDetail, currentPathDetail, elementChange = null) => {
    e.stopPropagation();
    let filedTypeConfig;
    setPropsPanelActiveTab(0);
    if (componentDetail.type === COMPONENT || componentDetail.type === ACCORDION || componentDetail.type === TAB) {
      if (componentDetail.maintype) {
        filedTypeConfig = componentMapper[componentDetail.maintype].config;
      } else {
        filedTypeConfig = componentMapper[componentDetail.component.type].config;
      }
      let fieldData = findChildComponentById(layout, componentDetail.id);
      if (elementChange !== null) {
        fieldData = elementChange;
      }
      filedTypeConfig?.editableProps?.Basic.map((basicEditPops) => {
        if (fieldData?.component[basicEditPops?.propsName]) {
          basicEditPops?.propsName === NAME && (basicEditPops.invalid = false);
          basicEditPops?.regexPattern && (basicEditPops.invalid = false);
          return (basicEditPops.value = fieldData.component[basicEditPops?.propsName]);
        } else {
          // Initialize options for checkbox-group and radio-group
          if (basicEditPops?.propsName !== ELEMENT_TYPES) {
            if (basicEditPops?.propsName === OPTIONS) {
              return (basicEditPops.value = OPTION);
            } else if (basicEditPops?.propsName === TABLE_COLUMNS) {
              return (basicEditPops.value = TABLE_HEADER);
            } else if (basicEditPops?.propsName === TABLE_ROWS) {
              return (basicEditPops.value = []);
            } else {
              return basicEditPops.type !== RADIO && (basicEditPops.value = '');
            }
          }
        }
      });

      filedTypeConfig?.editableProps?.Condition?.map((conditionEditPops) => {
        if (fieldData?.component[conditionEditPops?.propsName]) {
          return (conditionEditPops.value = fieldData.component[conditionEditPops?.propsName]);
        } else {
          return (conditionEditPops.value = false);
        }
      });

      filedTypeConfig?.advanceProps.map((advancePops) => {
        if (componentDetail?.component?.type === 'numberinput') {
          if (advancePops?.propsName === 'min' || advancePops?.propsName === 'max') {
            advancePops.label = `${capitalizeFirstLetter(advancePops?.propsName)} Value`;
          }
        }
        if (fieldData?.component[advancePops?.propsName]) {
          advancePops?.regexPattern && (advancePops.invalid = false);
          return (advancePops.value = fieldData.component[advancePops?.propsName]);
        } else {
          return advancePops?.propsName === REGEXVALIDATION
            ? (advancePops.value = { pattern: 'None', value: '', message: '' })
            : advancePops?.propsName === MAXPROPS
              ? (advancePops.value = { value: '20', message: '' })
              : advancePops?.propsName === MINPROPS
                ? (advancePops.value = { value: '0', message: '' })
                : advancePops?.propsName === EXTENSIONS
                  ? (advancePops.value = [])
                  : (advancePops.value = { value: '', message: '' });
        }
      });
    } else if (componentDetail.type === COLUMN) {
      const size = componentDetail.customsize ? componentDetail.customsize : componentDetail.defaultsize;
      filedTypeConfig = { ...componentDetail, style: [{ labelText: 'Column Size', text: size }], currentPathDetail: currentPathDetail };
    } else if (componentDetail.type === SUBTAB) {
      filedTypeConfig = { ...componentDetail };
    } else if (componentDetail.type === ROW) {
      filedTypeConfig = componentMapper[componentDetail.maintype].config;
    }
    setSelectedFiledProps({ id: componentDetail.id, type: componentDetail.type, component: { ...filedTypeConfig }, currentPathDetail: currentPathDetail });
    setFormFieldProps(false);
  };

  const columnSizeCustomization = (colsize, path) => {
    const newLayout = updateChildToChildren(layout, path.split('-'), CUSTOM_SIZE, colsize);
    setLayout([...newLayout]);
  };

  const handleSchemaChanges = (id, key, propsName, newValue, currentPathDetail, currentTab = 0) => {
    const componentPosition = currentPathDetail.split('-');
    let uniqueName = true;
    let isInvalid = false;
    let minValue = 0;
    setPropsPanelActiveTab(currentTab);
    if (key === SUBTAB) {
      const position = indexForChild(layout, componentPosition, 0);
      componentPosition.push(position);
      const newLayout = addChildToChildren(layout, componentPosition, { id: `pem_${uuid().replace(/[^0-9]/g, '').substring(0, 5)}`, tabTitle: DEFAULTTITLE, type: SUBTAB, children: [] });
      setLayout([...newLayout]);
    } else if (key === CUSTOM_COLUMN) {
      const position = indexForChild(layout, componentPosition, 0);
      componentPosition.push(position);
      const newLayout = addChildToChildren(layout, componentPosition, []);
      setLayout([...newLayout]);
    } else if (key === CUSTOM_TITLE) {
      let objCopy = selectedFieldProps;
      objCopy.component[propsName] = newValue;
      setSelectedFiledProps({ ...objCopy });
      setFormFieldProps(false);
      setLayout(updateChildToChildren(layout, componentPosition, propsName, newValue));
    } else {
      let objCopy = selectedFieldProps;
      if (propsName === NAME) {
        componentsNames.map((item, idx) => {
          if (item.name !== newValue) {
            if (item.id === selectedFieldProps.id) {
              setComponentsNames((stateItems) => [
                ...stateItems.slice(0, idx),
                {
                  ...stateItems[idx],
                  name: newValue
                },
                ...stateItems.slice(idx + 1)
              ]);
            }
          } else {
            if (item.id !== selectedFieldProps.id) {
              uniqueName = false;
            }
          }
        });
      } else if (propsName === ISREQUIRED) {
        objCopy?.component?.advanceProps.map((prop) => {
          if (prop.propsName === 'min') {
            newValue ? (prop.value.value.trim() === '0' ? (prop.value.value = '1') : prop.value.value) : prop.value.value;
            minValue = prop.value.value;
          }
        });
      } else {
        objCopy?.component?.editableProps.Basic.map((prop) => {
          if (prop.propsName === propsName) {
            if (prop?.regexPattern) {
              const value = newValue;
              const regex = new RegExp(prop.regexPattern); // Assuming currentProp has a regexPattern property
              const isValid = regex.test(value);
              prop.invalid = !isValid;
              prop.value = value;
              // Ensure the invalid text is set if invalid
              if (!isValid) {
                isInvalid = true;
                prop.invalidText = prop.invalidText || 'Invalid input'; // default message if none provided
              }
            }
          }
        });
        objCopy?.component?.advanceProps.map((prop) => {
          if (prop.propsName === propsName) {
            if (prop?.regexPattern) {
              const value = newValue?.value;
              const regex = new RegExp(prop.regexPattern); // Assuming currentProp has a regexPattern property
              const isValid = regex.test(value);
              prop.invalid = !isValid;
              prop.value = value;
              // Ensure the invalid text is set if invalid
              if (!isValid) {
                isInvalid = true;
                prop.invalidText = prop.invalidText || 'Invalid input'; // default message if none provided
              }
            }
          }
        });
      }
      if (key !== 'advance') {
        objCopy.component.editableProps[key].map((config) => {
          if (config.propsName === propsName) {
            config.value = newValue;
            config.invalid = false;
            if (!uniqueName || isInvalid) {
              config.invalid = true;
            }
          }
        });
      } else {
        objCopy.component.advanceProps.map((config) => {
          if (config.propsName === propsName) {
            config.value = newValue;
            config.invalid = false;
            if (isInvalid) {
              config.invalid = true;
            }
          }
        });
      }
      setSelectedFiledProps({ ...objCopy });
      setFormFieldProps(false);
      if (uniqueName && !isInvalid) {
        if (propsName === ISREQUIRED) {
          setLayout(updateChildToChildren(layout, componentPosition, 'min', { value: minValue, message: `Minimum ${minValue} characters required` }));
        }
        setLayout((prevLayout) => {
          return updateChildToChildren(prevLayout, componentPosition, propsName, newValue);
        });
        //setLayout(updateChildToChildren(layout, componentPosition, propsName, newValue));
      }
    }
  };

  const onFieldDelete = (e, path, actionCode, deletedElement) => {
    /*
      actionCode:0 - For Merge Action
      actionCode:1 - For Delete Action
    */
    e.stopPropagation();
    rowDataForDelete.current = { path, deletedElement, actionCode };
    setIsRowDelete(true);
  };

  const onRowDelete = ({ path, deletedElement }) => {
    setDeletedFieldPath(path);
    const splitDropZonePath = path.split('-');
    setLayout(handleRemoveItemFromLayout(layout, splitDropZonePath));
    const newElements = componentsNames.filter((item) => item.id !== deletedElement);
    setComponentsNames(newElements);
    setSelectedFiledProps();
    setFormFieldProps(false);
    rowDataForDelete.current = null;
  };

  const onRowCopy = (e, path, originalComponent) => {
    e.stopPropagation();
    const newPath = Number(path) + 1;
    const newItem = {
      ...originalComponent,
      id: uuid(),
      children: []
    };
    newItem.children = copyComponent(originalComponent.children, newItem.children);
    setLayout(handleMoveSidebarComponentIntoParent(layout, [newPath], newItem));
  };

  const onAddRow = (e, path) => {
    e.stopPropagation();
    const newPath = Number(path) + 1;
    const newId = uuid();
    const newItem = {
      id: newId,
      type: COMPONENT,
      component: { id: newId, name: 'form-control-' + newId.substring(0, 2), labelText: 'Group', label: 'Group', type: 'group' }
    };
    setLayout(handleMoveSidebarComponentIntoParent(layout, [newPath], newItem));
  };
  const onGroupChange = (e, componentGroup, path) => {
    e.stopPropagation();
    const newPath = path.split('-');
    const newItemId = uuid();
    const newItem = collectPaletteEntries(componentMapper).filter((items) => items.component.type === componentGroup)[0];
    const newFormField = {
      id: newItemId,
      type: COMPONENT,
      component: { ...newItem.component, id: newItemId, name: 'form-control-' + newItemId.substring(0, 2), labelText: newItem.component.label }
    };
    setLayout(handleMoveSidebarComponentIntoParent(layout, newPath, newFormField));
    onFieldSelect(e, newFormField, path, newFormField);
  };

  const replaceComponent = (e, path, newItem, oldElementId) => {
    e.stopPropagation();
    setDeletedFieldPath(path);
    defaultProps(newItem);
    const newItemId = `pem_${uuid().replace(/[^0-9]/g, '').substring(0, 5)}`;
    const splitDropZonePath = path.split('-');
    const oldLayout = handleRemoveItemFromLayout(layout, splitDropZonePath);
    const newFormField = {
      id: newItemId,
      type: COMPONENT,
      component: { ...newItem.component, id: newItemId, name: 'form-control-' + newItemId.substring(0, 2), labelText: newItem.component.label }
    };
    const updatedLayout = handleMoveSidebarComponentIntoParent(oldLayout, splitDropZonePath, newFormField);
    setLayout(updatedLayout);
    const newElements = componentsNames.filter((item) => item.id !== oldElementId);
    setComponentsNames([...newElements, { id: newItemId, name: 'form-control-' + newItemId.substring(0, 2) }]);
    onFieldSelect(e, newFormField, path, newFormField);
  };

  const renderRow = (row, currentPath, renderRow, previewMode, onChangeHandle, isSelected, setIsSelected, onGroupChange) => {
    return (
      <Row
        key={row.id}
        data={row}
        handleDrop={handleDrop}
        path={currentPath}
        componentMapper={componentMapper}
        onFieldSelect={onFieldSelect}
        renderRow={renderRow}
        onFieldDelete={onFieldDelete}
        previewMode={previewMode}
        onChangeHandle={onChangeHandle}
        isSelected={isSelected}
        setIsSelected={setIsSelected}
        onGroupChange={onGroupChange}
      />
    );
  };

  return (
    <>
      <div className="page-designer">
        <Layer className="page-designer-header">
          <div className="title-container">
            <span className="header-title">
              {activityDefinitionData && Object.keys(activityDefinitionData).length > 0 ? 'Form Builder - ' + activityDefinitionData?.definition.name : 'New Form Builder'}
            </span>
          </div>
          <div className="actions-container">
            {/* <Button kind="secondary" className="cancelButton" onClick={() => setOpen(true)}>
              View Schema
            </Button>
            <Button kind="secondary" className="cancelButton" onClick={() => setOpenPreview(true)}>
              Preview
            </Button> 
            <span onClick={() => setOpenPreview(true)} className="cross-icon" style={{ marginRight: '16px' }}>
              <View size={30} />
            </span>
            <span onClick={onClickPageDesignerBack} className="cross-icon">
              <CrossIcon />
            </span>*/}
            <IconButton label="Preview" size="md" kind="ghost" align="bottom-right" onClick={() => setOpenPreview(true)}>
              <View size={16} />
            </IconButton>
           {/*  <IconButton label="Close" size="md" kind="ghost" align="bottom-right" onClick={onClickPageDesignerBack}>
              <CloseLarge size={16} />
            </IconButton> */}
          </div>
        </Layer>
        <div className="layout-container">
          <div className="layout-container-wrapper">
            <div className="components-tray">
              <ComponentsTray componentMapper={componentMapper} />
            </div>
            <div
              className="canvas-wrapper"
              onClick={(e) => {
                setSelectedFiledProps();
                setFormFieldProps(true);
              }}
            >
              <Canvas
                layout={layout}
                handleDrop={handleDrop}
                renderRow={renderRow}
                componentMapper={componentMapper}
                onFieldSelect={onFieldSelect}
                onFieldDelete={onFieldDelete}
                handleSchemaChanges={handleSchemaChanges}
                onRowCopy={onRowCopy}
                onAddRow={onAddRow}
                onGroupChange={onGroupChange}
              />
              <div className="btn-top-container">
                <Grid fullWidth className="buttons-container-bottom">
                  <Column lg={16} className="buttons-container">
                    <Button kind="secondary" className="cancelButton">
                      Cancel
                    </Button>
                    <Button kind="primary" className="saveButton" onClick={() => saveFormDesignerData(convertToSchema(layout))}>
                      Save
                    </Button>
                  </Column>
                </Grid>
              </div>
            </div>
          </div>
          {selectedFieldProps && (
            <div className="props-panel">
              <PropsPanel
                layout={layout}
                selectedFieldProps={selectedFieldProps}
                handleSchemaChanges={handleSchemaChanges}
                columnSizeCustomization={columnSizeCustomization}
                onFieldDelete={onFieldDelete}
                componentMapper={componentMapper}
                replaceComponent={replaceComponent}
                propsPanelActiveTab={propsPanelActiveTab}
                activityDefinitionData={activityDefinitionData}
              />
            </div>
          )}
          {formFieldProps && (
            <div className="props-panel">
              <FormPropsPanel />
            </div>
          )}
        </div>
      </div>
      {/* Confirmation Row Deletion Model */}
      <Modal
        open={isRowDelete}
        onRequestClose={() => setIsRowDelete(false)}
        onRequestSubmit={() => {
          onRowDelete(rowDataForDelete.current);
          setIsRowDelete(false);
        }}
        isFullWidth
        modalHeading="Confirmation"
        primaryButtonText={rowDataForDelete?.current?.actionCode ? 'Delete' : 'Merge'}
        secondaryButtonText="Cancel"
      >
        <p
          style={{
            padding: '0px 0px 1rem 1rem'
          }}
        >
          {rowDataForDelete?.current?.actionCode ? 'Are you sure you want to delete' : 'Are you sure you want to merge'}
        </p>
      </Modal>
      {/* View Schema Modal */}
      <Modal open={open} onRequestClose={() => setOpen(false)} passiveModal modalLabel="Schema" primaryButtonText="Close" secondaryButtonText="Cancel">
        <ViewSchema layout={layout} />
      </Modal>
      {/* Form Preview Modal */}
      <Modal
        open={openPreview}
        onRequestClose={() => setOpenPreview(false)}
        passiveModal
        modalLabel="Form Preview"
        primaryButtonText="Close"
        secondaryButtonText="Cancel"
        className="preview-modal"
        size="lg"
        isFullWidth
      >
        <FormPreview
          layout={layout}
          deletedFieldPath={deletedFieldPath}
          handleDrop={handleDrop}
          renderRow={renderRow}
          componentMapper={componentMapper}
          onFieldSelect={onFieldSelect}
          onFieldDelete={onFieldDelete}
          openPreview={openPreview}
          dataTestid={'form-preview-id'}
          buttonView={true}
        />
      </Modal>
    </>
  );
}
