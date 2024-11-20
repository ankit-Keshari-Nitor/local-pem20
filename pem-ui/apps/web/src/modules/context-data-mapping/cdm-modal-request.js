import React from 'react';
import Shell from '@b2bi/shell';
import '@b2bi/styles/pages/list-page.scss';
import { Column } from '@carbon/react';
import CDMTreeView from './cdm-tree-view';
import { transformDataToTreeBasedOnType, generateContextDataMapping } from './cdm-utils';

import './style.scss';


const ContextDataModalRequest = ({ mode, context }) => {
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
                },
                ui: {
                    selectedJPath: '',
                },
                init: function () {
                    this._processActivity();
                },
                _processActivity: function () {
                    const contextDataMapping = generateContextDataMapping(modalConfig.data.data);
                    const transformedData = transformDataToTreeBasedOnType(contextDataMapping, context);
                    this.setModel('data', transformedData);
                    this.setModel('originalData', { items: modalConfig?.data?.data });
                },
                uiOnRequestSubmit: function () {
                    modalConfig.onAction('submit', { data: `\${${this.ui.selectedJPath}\}` });
                },
                uiOnSelectJPath: function (event, selectedNode) {
                    if (selectedNode === "CATEGORY") {
                        this.setUI('selectedJPath', '');
                    } else {
                        this.setUI('selectedJPath', selectedNode.id);
                    }

                },
                uiOnRequestClose: function () {
                    modalConfig.onAction('cancel', {
                        data: ''
                    });
                },

                /*  uiOnUnmap: function () {
                     modalConfig.onAction('unmap', {
                         data: ''
                     });
                 }, */
            };
        })(pageArgs, pageUtil)
    );

    const pageConfig = {
        actionsConfig: {
            pageActions: [
                {
                    id: 'cancel',
                    label: 'shell:common.actions.cancel',
                    type: 'button',
                    kind: 'secondary',
                    onAction: (...args) => {
                        return page.uiOnRequestClose.apply();
                    }
                },
                /*  {
                     id: 'unmap',
                     label: 'shell:common.actions.unmap',
                     type: 'button',
                     kind: 'primary',
                     onAction: (...args) => {
                         return page.uiOnUnmap.apply();
                     }
                 }, */
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
            ]
        },

    };

    return (
        <>
            <Shell.Page name="context-mapping" id="context-mapping" className="context-mapping">
                <Shell.PageHeader
                    title={mode === 'CONTEXT_DATA' ? pageUtil.t('mod-context-properties:title_ContextData') : pageUtil.t('mod-context-properties:title')}
                    buttonOnClick={page.uiOnRequestClose}
                />
                <Shell.PageBody className={context !== 'PROPERTY' ? 'treeview-wrapper' : ''}>

                    <Column lg={context === 'PROPERTY' ? 6 : 16} md={context === 'PROPERTY' ? 6 : 16}>
                        <CDMTreeView data={page.model.data} onSelect={page.uiOnSelectJPath} selected={page.ui.selectedNodes} />
                    </Column>


                </Shell.PageBody>
                <Shell.PageActions actions={pageConfig.actionsConfig.pageActions}></Shell.PageActions>
            </Shell.Page>
        </>
    );
};

export default ContextDataModalRequest;
