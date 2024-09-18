import React from 'react';
import { Column, Grid, Layer } from '@carbon/react';
import Shell, { CDS } from '@b2bi/shell';

const ApiConfigurationDetails = ({ mode, context, ...rest }) => {
  const pageUtil = Shell.PageUtil();
  const pageArgs = pageUtil.pageParams;

  const { pageMode } = Shell.usePageContainer();
  const { modalConfig } = Shell.useModal();
  const { sidePageConfig } = Shell.useSidePage();

  const pageConfig = {
    actionsConfig: {
      pageActions: [
        {
          id: 'back',
          label: 'shell:common.actions.back',
          type: 'button',
          kind: 'tertiary',
          onAction: (...args) => {
            return page.uiCancel();
          },
          isVisible: pageMode === 'ROUTE_PAGE'
        },
        {
          id: 'close',
          label: 'shell:common.actions.close',
          type: 'button',
          kind: 'secondary',
          onAction: (...args) => {
            return page.uiCancel();
          },
          isVisible: pageMode === 'MODAL_PAGE' || pageMode === 'SIDE_PAGE'
        }
      ]
    }
  };

  const { page } = Shell.usePage(
    [],
    (function Page(pageArgs, pageUtil) {
      return {
        model: {
          details: {}
        },
        datasources: {
          getDetails: {
            dataloader: 'API_CONFIGURATION.DETAILS',
            inputModel: {
              sponsorContext: 'b2b',
              apiConfigurationKey:
                pageMode === 'ROUTE_PAGE'
                  ? pageArgs.apiConfigurationKey
                  : pageMode === 'MODAL_PAGE'
                    ? modalConfig.data.apiConfiguration.apiConfigurationKey
                    : sidePageConfig.data.apiConfiguration.apiConfigurationKey
            },
            outputModel: 'details',
            init: true,
            handleOutput: ['_updateForm']
          }
        },
        ui: {},
        form: {
          apiConfiguration: {
            apiConfigurationKey: '',
            name: '',
            protocol: '',
            host: '',
            port: 0,
            preemptiveAuth: false,
            userName: '',
            password: '',
            endPoints: [],
            verifyHost: true,
            isInternalAuth: false,
            sslProtocol: '',
            authenticationType: 'NONE'
          }
        },
        init: function () {},
        _updateForm: function (modelData) {
          this.form.apiConfiguration.reset(pageUtil.getSubsetJson(modelData, this.form.apiConfiguration.attributes));
        },

        uiCancel: function () {
          if (pageMode === 'MODAL_PAGE') {
            modalConfig.onAction('cancel', {});
          } else if (pageMode === 'SIDE_PAGE') {
            sidePageConfig.onAction('cancel', {});
          } else {
            pageUtil.navigate(-1);
          }
        }
      };
    })(pageArgs, pageUtil)
  );
  return (
    <>
      <Shell.Page type="UPLOAD" className={`sfg--page--api-configuration-details`}>
        <Shell.PageHeader
          title={pageUtil.t('mod-apic:details.pageTitle', { value: page.model.details.name })}
          description={pageUtil.t('mod-apic:details.pageDescription')}
        ></Shell.PageHeader>
        <Shell.PageBody>
          <CDS.Form name="apiConfiguration" context={page.form.apiConfiguration}>
            <Layer level={0} className="sfg--page-details-container">
              <Grid className="sfg--grid-container sfg--grid--form">
                <Column lg={6} md={6}>
                  <CDS.TextInput labelText={pageUtil.t('mod-apic:form.name')} name="name" readOnly />
                </Column>
                <Column lg={6} md={6}></Column>
                <Column lg={6} md={6}>
                  <CDS.ComboBox
                    name="protocol"
                    readOnly
                    titleText={pageUtil.t('mod-apic:form.protocol')}
                    items={[
                      { id: 'http', label: 'http' },
                      { id: 'https', label: 'https' }
                    ]}
                    itemToString={(item) => (item ? item.label : '')}
                  ></CDS.ComboBox>
                </Column>
                <Column lg={6} md={6}>
                  <CDS.ComboBox
                    name="sslProtocol"
                    readOnly
                    titleText={pageUtil.t('mod-apic:form.sslProtocol')}
                    items={[
                      { id: 'TLSv1.2', label: 'TLSv1.2' },
                      { id: 'TLSv1.3', label: 'TLSv1.3' }
                    ]}
                    itemToString={(item) => (item ? item.label : '')}
                  ></CDS.ComboBox>
                </Column>
                <Column lg={6} md={6}>
                  <CDS.TextInput labelText={pageUtil.t('mod-apic:form.host')} name="host" readOnly />
                </Column>
                <Column lg={6} md={6}>
                  <CDS.NumberInput label={pageUtil.t('mod-apic:form.port')} hideSteppers name="port" readOnly />
                </Column>
                <Column lg={6} md={6}>
                  <CDS.Toggle labelText={pageUtil.t('mod-apic:form.preemptiveAuth')} name="preemptiveAuth" readOnly></CDS.Toggle>
                </Column>
                <Column lg={6} md={6}>
                  <CDS.Toggle labelText={pageUtil.t('mod-apic:form.verifyHost')} name="verifyHost" readOnly></CDS.Toggle>
                </Column>
                <Column lg={16} md={16}>
                  <CDS.RadioButtonGroup legendText={pageUtil.t('mod-apic:form.authenticationType')} name="authenticationType" readOnly>
                    <CDS.RadioButton
                      labelText={pageUtil.t('mod-apic:form.authenticationType_USERNAME_PASSWORD')}
                      name="authenticationType"
                      value="USERNAME_PASSWORD"
                    ></CDS.RadioButton>
                    <CDS.RadioButton labelText={pageUtil.t('mod-apic:form.authenticationType_INTERNAL_TOKEN')} name="authenticationType" value="INTERNAL_TOKEN"></CDS.RadioButton>
                    <CDS.RadioButton labelText={pageUtil.t('mod-apic:form.authenticationType_NONE')} name="authenticationType" value="NONE"></CDS.RadioButton>
                  </CDS.RadioButtonGroup>
                </Column>
                <Column lg={6} md={6}>
                  <CDS.TextInput labelText={pageUtil.t('mod-apic:form.userName')} name="userName" readOnly />
                </Column>
              </Grid>
            </Layer>
          </CDS.Form>
        </Shell.PageBody>
        <Shell.PageActions actions={pageConfig.actionsConfig.pageActions}></Shell.PageActions>
      </Shell.Page>
    </>
  );
};

export default ApiConfigurationDetails;
