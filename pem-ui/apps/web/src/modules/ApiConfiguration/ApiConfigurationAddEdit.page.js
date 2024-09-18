import React from 'react';
import { Column, Grid, Layer } from '@carbon/react';
import Shell, { CDS } from '@b2bi/shell';

const ApiConfigurationAddEdit = ({ mode, context, ...rest }) => {
  const pageUtil = Shell.PageUtil();
  const pageArgs = pageUtil.pageParams;

  const { pageMode } = Shell.usePageContainer();
  const { modalConfig } = Shell.useModal();
  const { sidePageConfig } = Shell.useSidePage();

  let apiConfigurationKey = '';
  if (mode === 'EDIT') {
    switch (pageMode) {
      case 'ROUTE_PAGE':
        apiConfigurationKey = pageArgs.apiConfigurationKey;
        break;
      case 'MODAL_PAGE':
        apiConfigurationKey = modalConfig.data.apiConfiguration.apiConfigurationKey;
        break;
      case 'SIDE_PAGE':
        apiConfigurationKey = sidePageConfig.data.apiConfiguration.apiConfigurationKey;
        break;
      default:
        break;
    }
  }

  const pageConfig = {
    actionsConfig: {
      pageActions: [
        {
          id: 'cancel',
          label: 'shell:common.actions.cancel',
          type: 'button',
          kind: 'secondary',
          onAction: (...args) => {
            return page.uiCancel();
          }
        },
        {
          id: mode === 'EDIT' ? 'update' : 'save',
          label: mode === 'EDIT' ? 'shell:common.actions.update' : 'shell:common.actions.save',
          type: 'button',
          kind: 'primary',
          resourceKey: `${context}.${mode}`,
          onAction: (...args) => {
            return page.form.apiConfiguration.handleSubmit(page.uiSave)();
          }
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
              apiConfigurationKey: apiConfigurationKey
            },
            init: mode === 'EDIT',
            handleOutput: ['_updateForm']
          },
          save: {
            dataloader: 'API_CONFIGURATION.ADD'
          },
          update: {
            dataloader: 'API_CONFIGURATION.UPDATE'
          }
        },
        ui: {
          mode: mode
        },
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
        uiSave: function () {
          const apiConfigurationInput = pageUtil.removeEmptyAttributes(this.form.apiConfiguration.getValues());

          let handler;
          if (page.ui.mode === 'ADD') {
            apiConfigurationInput.sponsorContext = 'b2b';
            handler = this.ds.save(apiConfigurationInput);
          } else {
            apiConfigurationInput.sponsorContext = 'b2b';
            handler = this.ds.update(apiConfigurationInput);
          }

          handler
            .then((response) => {
              pageUtil.showNotificationMessage(
                'toast',
                'success',
                page.ui.mode === 'ADD' ? pageUtil.t('mod-apic:addEdit.notificationMessage.add') : pageUtil.t('mod-apic:addEdit.notificationMessage.update')
              );

              if (pageMode === 'MODAL_PAGE') {
                modalConfig.onAction('submit', {});
              } else if (pageMode === 'SIDE_PAGE') {
                sidePageConfig.onAction('submit', {});
              } else {
                pageUtil.navigate(-1);
              }
            })
            .catch((err) => {});
        },
        uiOnAuthenticalTypeChange: function (event) {
          page.form.apiConfiguration.resetField('userName', { defaultValue: '' });
          page.form.apiConfiguration.resetField('password', { defaultValue: '' });
          page.form.apiConfiguration.resetField('isInternalAuth', { defaultValue: false });
          switch (event.target.value) {
            case 'USERNAME_PASSWORD':
              page.form.apiConfiguration.resetField('isInternalAuth', { defaultValue: false });
              break;
            case 'INTERNAL_TOKEN':
              page.form.apiConfiguration.resetField('isInternalAuth', { defaultValue: true });
              break;
            default:
              break;
          }
        },
        uiOnProtocolChange: function (event) {
          page.form.apiConfiguration.resetField('sslProtocol', { defaultValue: '' });
          page.form.apiConfiguration.resetField('verifyHost', { defaultValue: true });
          switch (event.target.value) {
            case 'http':
              break;
            case 'https':
              break;
            default:
              break;
          }
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
      <Shell.Page type="UPLOAD" className={`sfg--page--api-configuration-add`}>
        <Shell.PageHeader
          title={pageUtil.t('mod-apic:addEdit.pageTitle', { context: mode, value: '' })}
          description={pageUtil.t('mod-apic:addEdit.pageDescription', { context: mode })}
        ></Shell.PageHeader>
        <Shell.PageBody>
          <CDS.Form name="apiConfiguration" context={page.form.apiConfiguration}>
            <Layer level={0} className="sfg--page-details-container">
              <Grid className="sfg--grid-container sfg--grid--form">
                <Column lg={6} md={6}>
                  <CDS.TextInput labelText={pageUtil.t('mod-apic:form.name')} name="name" rules={{ required: true, minLength: 1, maxLenght: 100 }} />
                </Column>
                <Column lg={6} md={6}></Column>
                <Column lg={6} md={6}>
                  <CDS.ComboBox
                    name="protocol"
                    rules={{ required: true, onChange: page.uiOnProtocolChange }}
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
                    rules={{ required: page.form.apiConfiguration.watch('protocol') === 'https' }}
                    titleText={pageUtil.t('mod-apic:form.sslProtocol')}
                    items={[
                      { id: 'TLSv1.2', label: 'TLSv1.2' },
                      { id: 'TLSv1.3', label: 'TLSv1.3' }
                    ]}
                    itemToString={(item) => (item ? item.label : '')}
                    disabled={page.form.apiConfiguration.watch('protocol') !== 'https'}
                  ></CDS.ComboBox>
                </Column>
                <Column lg={6} md={6}>
                  <CDS.TextInput labelText={pageUtil.t('mod-apic:form.host')} name="host" rules={{ required: true, minLength: 1, maxLenght: 100 }} />
                </Column>
                <Column lg={6} md={6}>
                  <CDS.NumberInput label={pageUtil.t('mod-apic:form.port')} hideSteppers name="port" rules={{ required: true }} />
                </Column>
                <Column lg={6} md={6}>
                  <CDS.Toggle labelText={pageUtil.t('mod-apic:form.preemptiveAuth')} name="preemptiveAuth"></CDS.Toggle>
                </Column>
                <Column lg={6} md={6}>
                  <CDS.Toggle labelText={pageUtil.t('mod-apic:form.verifyHost')} name="verifyHost" disabled={page.form.apiConfiguration.watch('protocol') !== 'https'}></CDS.Toggle>
                </Column>
                <Column lg={16} md={16}>
                  <CDS.RadioButtonGroup
                    legendText={pageUtil.t('mod-apic:form.authenticationType')}
                    name="authenticationType"
                    rules={{ required: true, onChange: page.uiOnAuthenticalTypeChange }}
                  >
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
                  <CDS.TextInput
                    labelText={pageUtil.t('mod-apic:form.userName')}
                    name="userName"
                    rules={{ required: page.form.apiConfiguration.watch('authenticationType') === 'USERNAME_PASSWORD', minLength: 1, maxLenght: 100 }}
                    disabled={page.form.apiConfiguration.watch('authenticationType') !== 'USERNAME_PASSWORD'}
                  />
                </Column>
                <Column lg={6} md={6}>
                  <CDS.PasswordInput
                    labelText={pageUtil.t('mod-apic:form.password')}
                    name="password"
                    rules={{ required: page.form.apiConfiguration.watch('authenticationType') === 'USERNAME_PASSWORD', minLength: 1, maxLenght: 100 }}
                    disabled={page.form.apiConfiguration.watch('authenticationType') !== 'USERNAME_PASSWORD'}
                  />
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

export default ApiConfigurationAddEdit;
