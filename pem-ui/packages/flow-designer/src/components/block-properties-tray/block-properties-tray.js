import React, { useState } from 'react';
import { NODE_TYPE } from '../../constants';
import BlockDefinitionForm from '../block-definition-form';
import { CrossIcon, ExpandIcon, CollapseIcon } from './../../icons';
import APINodeDefinitionForm from '../api-node-definition-form/api-node-definition-form';
import BranchStartPropertiesTray from './../branch-start-properties-tray';
import {
  PARTNER_FORM_SCHEMA,
  APPROVAL_FORM_SCHEMA,
  ATTRIBUTE_FORM_SCHEMA,
  CUSTOM_FORM_SCHEMA,
  DIALOG_FORM_SCHEMA,
  SPONSOR_FORM_SCHEMA,
  SYSTEM_FORM_SCHEMA,
  XSLT_FROM_SCHEMA,
  API_FORM_SCHEMA
} from './../../constants/define-form-renderer.schema';

import './block-properties-tray.scss';

export default function BlockPropertiesTray(props) {
  const {
    selectedNode, //partner,approval,attribute,sponsor,system,custom
    setOpenPropertiesBlock,
    readOnly,
    onExpand,
    onDesignFormBtnClick, // Form Desginer Page
    deleteBranchNodeConnector,
    isDialogFlowActive,
    selectedTaskNode
  } = props;

  const [isExpanded, setIsExpanded] = useState(false);

  const getForm = (selectedNode) => {
    switch (selectedNode && selectedNode.type) {
      case NODE_TYPE.PARTNER:
        return <BlockDefinitionForm id={'partner-define-form'} schema={PARTNER_FORM_SCHEMA} {...props} />;
      case NODE_TYPE.APPROVAL:
        return <BlockDefinitionForm id={'approval-define-form'} schema={APPROVAL_FORM_SCHEMA} {...props} />;
      case NODE_TYPE.ATTRIBUTE:
        return <BlockDefinitionForm id={'attribute-define-form'} schema={ATTRIBUTE_FORM_SCHEMA} {...props} />;
      case NODE_TYPE.SPONSOR:
        return <BlockDefinitionForm id={'sponsor-define-form'} schema={SPONSOR_FORM_SCHEMA} {...props} />;
      case NODE_TYPE.CUSTOM:
        return <BlockDefinitionForm id={'custom-define-form'} schema={CUSTOM_FORM_SCHEMA} {...props} />;
      case NODE_TYPE.SYSTEM:
        return <BlockDefinitionForm id={'system-define-form'} schema={SYSTEM_FORM_SCHEMA} {...props} />;
      case NODE_TYPE.DIALOG:
        return <BlockDefinitionForm id={'dialog-define-form'} schema={DIALOG_FORM_SCHEMA} {...props} />;
      case NODE_TYPE.XSLT:
        return <BlockDefinitionForm id={'xslt-define-form'} schema={XSLT_FROM_SCHEMA} {...props} />;
      case NODE_TYPE.API:
        return <APINodeDefinitionForm id={'api-define-form'} schema={API_FORM_SCHEMA} {...props} />;
      case NODE_TYPE.BRANCH_START:
        return <BranchStartPropertiesTray id={'branch-start-properties-form'} {...props} />;
      case NODE_TYPE.BRANCH_END:
        return null;
      default:
        return null;
    }
  };

  const onExpansionIconClick = (isExpanded) => {
    setIsExpanded(isExpanded);
    onExpand(isExpanded);
  };

  return (
    <>
      <div className="block-properties-container">
        <div className="title-bar">
          <span className="title">
            <span>
              {selectedNode?.data?.editableProps.name ? (
                <span>
                  {selectedNode?.data?.editableProps.name} ({selectedNode?.data?.taskName})
                </span>
              ) : (
                <span>
                  {selectedNode?.data.id} ({selectedNode?.data?.taskName})
                </span>
              )}
            </span>
          </span>
          <div className="icon">
            <span id="drawer-expand-span" onClick={() => onExpansionIconClick(!isExpanded)} className="icon">
              {isExpanded ? <CollapseIcon /> : <ExpandIcon />}
            </span>
            <span id="drawer-close-span" onClick={() => setOpenPropertiesBlock(false)} className="icon drawer-close" style={{ marginLeft: '1rem' }}>
              <CrossIcon />
            </span>
          </div>
        </div>
        <div className="block-properties-form">{getForm(selectedNode)}</div>
      </div>
    </>
  );
}
