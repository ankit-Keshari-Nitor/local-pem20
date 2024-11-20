import React from 'react';
import { Column } from '@carbon/react';
import Shell from '@b2bi/shell';
import '@b2bi/styles/pages/list-page.scss';

import CDMTreeView from './cdm-tree-view';
import { transformDataToTree, generateContextDataMapping, generateMappingTreeData } from './cdm-utils';
import { ListBoxes } from '@carbon/icons-react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';

import './style.scss';

const ContextDataModal = ({ mode }) => {
  const pageUtil = Shell.PageUtil();
  const pageArgs = pageUtil.pageParams;
  const { modalConfig } = Shell.useModal();

  const { page } = Shell.usePage(
    [],
    (function Page(pageArgs, pageUtil) {
      return {
        model: {
          data: [],
          originalData: [],
          mappingdata: [],
          originalMappingData: []
        },
        ui: {
          selectedJPath: '',
          selectedNode: ''
        },

        init: function () {
          this._processMapping();
        },
        _processMapping: function () {
          const transformedData = generateMappingTreeData(modalConfig.data.data);
          this.setModel('data', transformedData);
          this.setModel('originalData', modalConfig.data.data);
        },
        _process: function () {
          const contextDataMapping = generateContextDataMapping(modalConfig.data.contextData);
          const transformedData = transformDataToTree(contextDataMapping);
          this.setModel('mappingdata', transformedData);
          this.setModel('originalMappingData', { items: modalConfig?.data?.contextData });
        },
        uiMapValue: function (reqObject, data) {
          const updatedData = { ...this.model.originalData };
          const visited = new Set();

          const recurseObject = (currentObject) => {
            if (currentObject && typeof currentObject === 'object') {
              if (visited.has(currentObject)) {
                return;
              }
              visited.add(currentObject);

              Object.entries(currentObject).forEach(([key, value]) => {
                if (value && typeof value === 'object') {
                  recurseObject(value);
                } else {
                  if (key === reqObject) {
                    currentObject[key] = '${' + { data } + '}';
                  }
                }
              });
            }
          };

          // Apply recursion to the updatedData
          recurseObject(updatedData);
          // Now set the model with the updated data
          this.setModel('originalData', updatedData);
        },
        uiOnRequestSubmit: function () {
          modalConfig.onAction('submit', { data: this.model.originalData });
        },
        uiOnSelectJPath: function (event, selectedNode) {
          this.setUI('selectedJPath', selectedNode.id);
          this.uiMapValue(this.ui.selectedNode.value.name, selectedNode.id);
          const transformedData = generateMappingTreeData(this.model.originalData);
          this.setModel('data', transformedData);
          this.setModel('originalData', this.model.originalData);
        },
        uiOnSelectNode: function (event, selectedNode) {
          this.setUI('selectedNode', selectedNode);
          this.setUI('selectedJPath', ''); // Reset JPath since a new node is selected
          this._process(); // Process the mapping or context data again if needed
          const transformedData = generateMappingTreeData(this.model.originalData);
          this.setModel('data', transformedData);
          this.setModel('originalData', this.model.originalData);
        },
        uiOnRequestClose: function () {
          modalConfig.onAction('cancel', { data: this.model.originalData });
        }
      };
    })(pageArgs, pageUtil)
  );

  const pageConfig = {
    cdpTreeView: {
      search: {
        closeLabel: 'shell:common.actions.close',
        label: 'shell:common.actions.search',
        placeholder: 'mod-context-data-properties:actions.search'
      },
      treeView: {
        label: 'mod-context-data-properties:request',
        onSelect: (...args) => {
          return page.uiOnSelectNode.apply(page, args);
        }
      }
    },
    rdpTreeView: {
      search: {
        closeLabel: 'shell:common.actions.close',
        label: 'shell:common.actions.search',
        placeholder: 'mod-context-data-properties:actions.search'
      }
    },
    actionsConfig: {
      pageActions: [
        {
          id: 'cancel',
          label: 'shell:common.actions.cancel',
          type: 'button',
          kind: 'secondary',
          onAction: (...args) => {
            return page.uiOnRequestClose.apply(page, args);
          }
        },
        {
          id: 'select',
          label: 'shell:common.actions.select',
          type: 'button',
          kind: 'primary',
          onAction: (...args) => {
            return page.uiOnRequestSubmit.apply(page, args);
          }
        }
      ]
    }
  };

  return (
    <>
      <Shell.Page name="context-mapping" id="context-mapping" className="context-mapping">
        <Shell.PageHeader title={pageUtil.t('mod-context-properties:request')} buttonOnClick={page.uiOnRequestClose} />
        <Shell.PageBody>
          <PanelGroup direction="horizontal">
            <Panel minSize={20} defaultSize={30} maxSize={60}>
              <Column lg={4} md={4} className="pem--cdm-tree-container">
                <Shell.TreeView name="cdpTreeView" config={pageConfig.cdpTreeView} data={page.model.data}></Shell.TreeView>
              </Column>
            </Panel>
            <PanelResizeHandle style={{ cursor: 'ew-resize' }} />
            <Panel minSize={40} defaultSize={70} maxSize={80}>
              <Column lg={12} md={12}>
                {!page.ui.selectedNode || typeof page.ui.selectedNode.value.value === 'object' ? (
                  <div className="no-connector-container">
                    <div>
                      <ListBoxes className="listbox-svg" />{' '}
                    </div>
                    <div>
                      {' '}
                      <span className="no-connector-container-text">No Node Selected </span>
                    </div>
                    <div>Please select Node from left panel</div>
                  </div>
                ) : (
                  <CDMTreeView
                    key={page.ui.selectedNode?.id}
                    config={pageConfig.rdpTreeView}
                    data={page.model.mappingdata}
                    onSelect={page.uiOnSelectJPath}
                    selected={page.ui.selectedNode}
                  />
                )}
              </Column>
            </Panel>
          </PanelGroup>
        </Shell.PageBody>
        <Shell.PageActions actions={pageConfig.actionsConfig.pageActions}></Shell.PageActions>
      </Shell.Page>
    </>
  );
};

export default ContextDataModal;
