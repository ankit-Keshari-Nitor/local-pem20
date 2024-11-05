import React from 'react';
import Shell from '@b2bi/shell';
import { Layer } from '@carbon/react';
import RolloutForm from './rollout-form';
import RolloutWizard from './rollout-wizard';
import RolloutContextData from './rollout-contextData';
import './styles.scss';

const RolloutPage = () => {
    const pageUtil = Shell.PageUtil();
    const pageArgs = pageUtil.pageParams;
    const { modalConfig } = Shell.useModal();

    const { activityDefnVersionKey, activityName } = modalConfig.data.data;


    const { page } = Shell.usePage(
        [],
        (function Page(pageArgs, pageUtil) {
            return {
                model: {
                    partnerList: [],
                    attributeList: [],
                    originalData: [],
                },
                datasources: {
                    getPartnerList: {
                        dataloader: 'ROLLOUT.PARTNER',
                        inputModel: {},
                        outputModel: 'partnerList',
                        init: true,
                        loadingState: 'tableLoadingState',
                        handleOutput: ['_updateEmptyState']
                    },
                    createActivityInstance: {
                        dataloader: 'ROLLOUT.ACTIVITY_INSTANCES'
                    }

                },
                form: {
                    rollout: {
                        rolloutName: '',
                        rolloutDescription: '',
                        rolloutContextData: '{}',
                        rolloutDueDate: [],
                        rolloutAlertDate: [],
                        rolloutAlertInterval: '',
                        rolloutRollingOut: 'internal_users',
                        rolloutRollingOutValue: '',
                    }
                },
                ui: {
                    showContextData: false,
                    showCode: true,
                    partnerPage: false,
                    partnersData: [],
                    attributesData: [],
                    groupsData: [],
                    filterPartnerList: [],
                    showContextPage: false,
                    selectedNode: '',
                    errorWizard: undefined,
                    errorPreview: undefined,
                },
                observers: [
                    {
                        observers: function () {
                            return [this.ui.partnersData]
                        },
                        handler: function () {
                            if (this?.model?.partnerList.length > 0) {
                                this.setUI('filterPartnerList', this?.model?.partnerList.filter(
                                    (item) => !this.ui.partnersData.some((selectedItem) => selectedItem.partnerUniqueId === item.partnerUniqueId)
                                ))
                            }
                        }
                    }, {
                        observers: function () {
                            return [this.model.partnerList]
                        },
                        handler: function () {
                            if (this?.model?.partnerList.length > 0) {
                                this.setUI('filterPartnerList', this?.model?.partnerList.filter(
                                    (item) => !this.ui.partnersData.some((selectedItem) => selectedItem.partnerUniqueId === item.partnerUniqueId)
                                ))
                            }
                        }
                    },

                ],
                init: function () { },
                uiOnRequestClose: function () {
                    modalConfig.onAction('cancel', {});
                },
                _updateEmptyState: function (data) {
                    if (data.length > 0) {
                        this.model.partnerList = data;
                    } else {
                        this.model.partnerList = []
                    }
                },
                uiBackToDetails: function () {
                    if (page.ui.partnerPage) {
                        this.setUI('partnerPage', false)
                        this.setUI('partnersData', []);
                        this.setUI('groupsData', []);
                        this.setUI('attributesData', []);
                    } else if (page.ui.showContextPage) {
                        this.setUI('showContextPage', false)
                    }
                },
                uiSave: function () {
                    if (page.ui.partnerPage) {
                        this.setUI('partnerPage', false)
                    } else if (page.ui.showContextPage) {
                        this.form.rollout.setValue('rolloutContextData', JSON.stringify(this.model.originalData))
                        this.setUI('showContextPage', false);
                    }
                },
                uiGetMinDate: function (daysToAdd = 0, alertDate) {
                    const date = alertDate ? new Date(alertDate) : new Date();
                    date.setDate(date.getDate() + daysToAdd);
                    return date.toLocaleDateString('en-US');
                },
                uiOnRequestSubmit: function () {
                    this.form.rollout.handleSubmit(this.uiRollout)();
                },
                uiRollout: function () {
                    const rolloutData = {
                        activityDefnVersionKey: activityDefnVersionKey,
                        name: this.form.rollout.getValues('rolloutName'),
                        description: this.form.rollout.getValues('rolloutDescription'),
                        alertStartDate: this.form.rollout.getValues('rolloutAlertDate')[0] ? new Date(this.form.rollout.getValues('rolloutAlertDate')[0]).toISOString() : new Date().toISOString(),
                        dueDate: this.form.rollout.getValues('rolloutDueDate')[0] ? new Date(this.form.rollout.getValues('rolloutDueDate')[0]).toISOString() : new Date().toISOString(),
                        alertInterval: this.form.rollout.getValues('rolloutAlertInterval') !== '' ? parseInt(this.form.rollout.getValues('rolloutAlertInterval')) : 0,
                        rolloutInternally: this.form.rollout.getValues('rolloutRollingOut') === 'internal_users',
                        contextData: this.form.rollout.getValues('rolloutContextData'),
                        attributeValues: [],
                        attributeGroups: [],
                    };
                    if (this.form.rollout.getValues('rolloutRollingOut') === 'partners') {
                        rolloutData.partners = this.ui.partnersData.map(partner => ({
                            partnerKey: partner.partnerKey,
                            contextDataNodes: [{
                                "nodeRef": "$.application.Configuration.pType",
                                "nodeValue": "test"
                            }]
                        }));
                    } else {
                        rolloutData.partners = [];
                    }

                    if (!this.form.rollout.getValues('rolloutContextData')) {
                        this.setUI('showContextData', true);
                        return;
                    }

                    let handler = this.ds.createActivityInstance(rolloutData);
                    handler && handler.then((response) => {
                        const kind = response.status === 201 ? pageUtil.t('shell:common.actions.success') : pageUtil.t('shell:common.actions.error');
                        const message = response.status === 201 ? 'Action completed successfully!' : 'Action not completed successfully!';
                        pageUtil.showNotificationMessage('toast', kind, message);
                        modalConfig.onAction('submit', {});
                    }).catch((err) => { console.error(err) });
                },
                uiCapitalizeFirstLetter: (string) => string.charAt(0).toUpperCase() + string.slice(1).toLowerCase(),
                uiHandleAddBtn: function (key, val) {
                    if (val.length === 0) {
                        this.setUI('errorWizard', 'Please select an option from the list to proceed with the functionality.')
                        return;
                    } else {
                        this.setUI('errorWizard', undefined);
                    }

                    switch (key) {
                        case 'Partner':
                            this.setUI('partnersData', val);
                            break;
                        case 'Groups':
                            this.setUI('groupsData', val);
                            break;
                        case 'Attribute':
                            this.setUI('attributesData', val);
                            break;
                        default:
                            break;
                    }

                },
                uiOnHandleRemove: function (key, value) {
                    if (value.length === 0) {
                        this.setUI('errorPreview', 'Please select an option from the list to proceed with the functionality.')
                        return;
                    } else {
                        this.setUI('errorPreview', undefined);
                    }
                    switch (key) {
                        case 'Partner':
                            let partnersData = this.ui.partnersData;
                            const datapartners = partnersData.filter((item) => !value.includes(item.partnerUniqueId));
                            this.setUI('partnersData', datapartners);
                            break;
                        case 'Attribute':
                            let attributesData = this.ui.attributesData;
                            let dataAttribute = attributesData.filter((item) => !value.includes(item.attributeValueKey));
                            this.setUI('attributesData', dataAttribute);
                            break;
                        case 'Groups':
                            break;
                        default:
                            break;
                    }
                },
                uiOnShowContextData: function () {
                    const rawData = this.form.rollout.watch('rolloutContextData');
                    let jsonData;
                    let isValidData = false;
                    try {
                        jsonData = JSON.parse(rawData);
                        isValidData = jsonData && typeof jsonData === 'object' && Object.keys(jsonData).length > 0;
                    } catch (error) {
                        console.error("Failed to parse context data:", error);
                        isValidData = false;
                    }
                    if (isValidData) {
                        this.setUI('showContextPage', true)
                    } else { this.setUI('showContextPage', false) }
                },
            };
        })(pageArgs, pageUtil)
    );
    const pageConfig = {
        actionsConfig: {
            pageActions: [
                {
                    id: 'cancel', label: 'shell:common.actions.cancel', type: 'button', kind: 'secondary', isVisible: page.ui.partnerPage === false && page.ui.showContextPage === false, onAction: (...args) => {
                        return page.uiOnRequestClose.apply();
                    }
                },
                {
                    id: 'rollout', label: 'shell:common.actions.rollout', type: 'button', kind: 'primary', isVisible: page.ui.partnerPage === false && page.ui.showContextPage === false, onAction: (...args) => {
                        return page.uiOnRequestSubmit.apply();
                    }
                },
                {
                    id: 'backToDetails', label: 'shell:common.actions.backToDetails', type: 'button', kind: 'secondary', isVisible: page.ui.partnerPage === true || page.ui.showContextPage === true, onAction: (...args) => {
                        return page.uiBackToDetails.apply();
                    }
                },
                {
                    id: 'save', label: 'shell:common.actions.save', type: 'button', kind: 'primary', isVisible: page.ui.partnerPage === true || page.ui.showContextPage === true, onAction: (...args) => {
                        return page.uiSave.apply();
                    }
                },
            ]
        },
    };

    return (
        <Layer>
            <Layer>
                {!page.ui.showContextPage ? (
                    <div style={{ margin: '0.5rem 0 0 0.5rem' }}>
                        <span style={{ fontSize: '16px', color: 'var(--cds-text-secondary,"#525252")' }}>
                            Activity Rollout - {activityName}
                        </span>
                    </div>
                ) : (<div style={{ margin: '0.5rem 0 0 0.5rem' }}>
                    <span style={{ fontSize: '16px', color: 'var(--cds-text-secondary,"#525252")' }}>
                        {activityName}
                    </span>
                </div>)}
                <Shell.Page type="ROLLOUT" className="pem--page--rollout">
                    <Shell.PageHeader title={!page.ui.partnerPage ? !page.ui.showContextPage ? 'Details' : 'Context Data Mapping' : 'Adding Partners'} />
                    <Shell.PageBody className={!page.ui.showContextPage ? "rollout-body" : ""}>
                        {!page.ui.partnerPage ? (
                            !page.ui.showContextPage ?
                                <RolloutForm page={page} pageUtil={pageUtil} /> : <RolloutContextData page={page} pageUtil={pageUtil} />
                        ) : (
                            <RolloutWizard page={page} />
                        )}
                    </Shell.PageBody>
                    <Shell.PageActions actions={pageConfig.actionsConfig.pageActions}></Shell.PageActions>
                </Shell.Page>
            </Layer>
        </Layer>
    );
};

export default RolloutPage;