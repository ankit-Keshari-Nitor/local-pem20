import React from 'react';
import { Grid, Column } from '@carbon/react';
import Shell, { CDS } from '@b2bi/shell';
import { JSONPath } from 'jsonpath-plus';
import CDMTreeView from './CDMTreeView';
import ActivitySchema from './SampleActivitySchema';
import { transformDataToTree, generateContextDataMapping, generateTreeData, updateTreeNodeIcon } from './ContextDataMappingUtil';

import { StringText, Api_1, Image, Schematics, Table, TreeViewAlt, ProgressBar, DataVolume } from '@carbon/icons-react';
import './style.scss';

const iconMapping = {
  TEXT: StringText,
  API_CONFIG: Api_1,
  LOGO_FILE: Image,
  ACTIVITY_FILE: Schematics,
  OBJECT: TreeViewAlt,
  ARRAY: Table,
  ARRAY_ITEM: ProgressBar,
  DEFAULT: DataVolume
};

const CDMModalPage = ({ mode, context }) => {
  const pageUtil = Shell.PageUtil();
  const pageArgs = pageUtil.pageParams;
  const { modalConfig } = Shell.useModal();

  const { page } = Shell.usePage(
    [],
    (function Page(pageArgs, pageUtil) {
      return {
        model: {
          data: [],
          originalData: []
        },
        ui: {
          selectedJPath: '',
          selectedNode: '',
          selectedNodes: []
        },
        form: {
          property: {
            textProptery: '',
            booleanProperty: ''
          }
        },
        init: function () {
          if (context === 'PROPERTY') {
            this._processProperty();
          } else {
            this._processActivity();
          }
        },
        _processProperty: function () {
          const transformedData = generateTreeData(modalConfig.data.data);
          updateTreeNodeIcon(transformedData, iconMapping);
          this.setModel('data', transformedData);
          this.setModel('originalData', modalConfig.data.data);
        },
        _processActivity: function () {
          const contextDataMapping = generateContextDataMapping(ActivitySchema);
          const transformedData = transformDataToTree(contextDataMapping.items);
          this.setModel('data', transformedData);
          this.setModel('originalData', { items: modalConfig.data.data });
        },
        uiOnRequestSubmit: function () {
          if (context === 'PROPERTY') {
            modalConfig.onAction('submit', { data: this.model.originalData });
          } else {
            modalConfig.onAction('submit', { data: this.ui.selectedJPath });
          }
        },
        uiSelectCDM: function () {},
        uiOnSelectJPath: function (event, selectedNode) {
          if (event.currentTarget.type === 'binding') {
            this.setUI('selectedJPath', selectedNode.activeNodeId);
          } else {
            this.setUI('selectedJPath', '');
          }
        },
        uiOnSelectNode: function (event, selectedNode) {
          this.setUI('selectedNode', selectedNode);
          this.setUI('selectedNodes', [selectedNode.id]);
          this.form.property.reset();
          switch (selectedNode.value.type) {
            case 'TEXT':
              this.form.property.setValue('textProperty', selectedNode.value.value);
              break;
            case 'BOOLEAN':
              this.form.property.setValue('booleanProperty', selectedNode.value.value);
              break;
            case 'API_CONFIG':
              this.form.property.setValue('apiConfigProperty', selectedNode.value.value);
              break;
            case 'ACIVITY_FILE':
              this.form.property.setValue('activityFileProperty', selectedNode.value.value);
              break;
            case 'LOGO_FILE':
              this.form.property.setValue('logoFileProperty', selectedNode.value.value);
              break;
            default:
              break;
          }
        },
        uiOnPropertyChange: function (event, value) {
          const propertyRef = JSONPath({ path: `${this.ui.selectedNode.activeNodeId}`, json: this.model.originalData, wrap: false });
          this.ui.selectedNode.value.value = event.target.value;
          propertyRef.pValue = event.target.value;
        },
        uiOnRequestClose: function () {
          modalConfig.onAction('cancel', {
            data: this.model.originalData
          });
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
        label: 'mod-context-data-properties:treeHeading',
        onSelect: (...args) => {
          return page.uiOnSelectNode.apply(page, args);
        }
      },
      emptyStates: {
        ResourceNotSelected: {
          image: <div data-testid="ResourceNotSelected-Image"></div>,
          description: 'mod-user:roles.noRoleSelectedDescription'
        }
      }
    },
    actionsConfig: {
      pageActions: [
        {
          id: 'cancel',
          label: 'shell:common.actions.cancel',
          type: 'button',
          kind: 'secondary',
          isVisible: context !== 'PROPERTY',
          onAction: (...args) => {
            return page.uiOnRequestClose.apply();
          }
        },
        {
          id: 'close',
          label: 'shell:common.actions.close',
          type: 'button',
          kind: 'secondary',
          isVisible: context === 'PROPERTY',
          onAction: (...args) => {
            return page.uiOnRequestClose.apply();
          }
        },
        {
          id: 'select',
          label: 'shell:common.actions.select',
          type: 'button',
          kind: 'primary',
          disabled: !page.ui.selectedJPath,
          isVisible: context !== 'PROPERTY',
          onAction: (...args) => {
            return page.uiOnRequestSubmit.apply();
          }
        },
        {
          id: 'update',
          label: 'shell:common.actions.update',
          type: 'button',
          kind: 'primary',
          isVisible: context === 'PROPERTY',
          onAction: (...args) => {
            return page.uiOnRequestSubmit.apply();
          }
        }
      ]
    }
  };

  return (
    <>
      <Shell.Page name="cdp-mapping">
        {mode === 'CONTEXT_DATA' ? <Shell.PageHeader title="Context Data" /> : <Shell.PageHeader title="Context Data Mapping Selection" />}
        <Shell.PageBody>
          <Grid className="sfg--grid--form context-data-grid">
            {context !== 'PROPERTY' && (
              <Column lg={context === 'PROPERTY' ? 6 : 16} md={context === 'PROPERTY' ? 6 : 16}>
                <CDMTreeView data={page.model.data} onSelect={page.uiOnSelectJPath} selected={page.ui.selectedNodes} />
              </Column>
            )}
            {context === 'PROPERTY' && (
              <>
                <Column lg={6} md={6} className="context-data-grid-col--tree-view">
                  <Shell.TreeView name="cdpTreeView" config={pageConfig.cdpTreeView} data={page.model.data}></Shell.TreeView>
                </Column>
                <Column lg={10} md={10} className="col-margin">
                  <CDS.Form name="property" context={page.form.property} className="right-panel">
                    {page.ui.selectedNode && (
                      <>
                        {/* <span>Data Path : {page.ui.selectedNode.activeNodeId}</span> */}
                        <br />
                        <br />
                        {page.ui.selectedNode.value.type === 'TEXT' && (
                          <CDS.TextInput name="textProperty" labelText="Set value for selected node" rules={{ onChange: page.uiOnPropertyChange }}></CDS.TextInput>
                        )}
                        {page.ui.selectedNode.value.type === 'BOOLEAN' && (
                          <CDS.Toggle name="booleanProperty" labelText="Set value for selected node" rules={{ onChange: page.uiOnPropertyChange }}></CDS.Toggle>
                        )}
                      </>
                    )}
                  </CDS.Form>
                </Column>
              </>
            )}
          </Grid>
        </Shell.PageBody>
        <Shell.PageActions actions={pageConfig.actionsConfig.pageActions}></Shell.PageActions>
      </Shell.Page>
    </>
  );
};

export default CDMModalPage;
