import React from 'react';
import { Button, Column, Grid, Layer, Tooltip } from '@carbon/react';
import { Information } from '@carbon/icons-react';
import Shell, { CDS } from '@b2bi/shell';

import '../styles.scss'

const CreateApiConfiguration = ({ mode, contextPage, cdmPage }) => {
  const pageUtil = Shell.PageUtil();
  const pageArgs = pageUtil.pageParams;


  const { page } = Shell.usePage(
    [],
    (function Page(pageArgs, pageUtil) {
      return {
        model: {
          details: {}
        },
        datasources: {
          save: {
            dataloader: 'API_CONFIGURATION.CREATE'
          }
        },
        ui: {
          mode: mode,
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
        init: function () {

          this.form.apiConfiguration.reset(pageUtil.getSubsetJson(this.form.apiConfiguration.attributes));
        },
        uiSave: function () {

          const apiConfigurationInput = pageUtil.removeEmptyAttributes(this.form.apiConfiguration.getValues());

          let handler;
          if (page.ui.mode === 'CREATE') {
            apiConfigurationInput.sponsorContext = 'b2b';
            handler = this.ds.save(apiConfigurationInput);
          }

          handler
            .then((response) => {
              this.form.apiConfiguration.reset(pageUtil.getSubsetJson(this.form.apiConfiguration.attributes));
              cdmPage.uiOnMap('API_CONFIG', response.data.apiConfigurationKey, cdmPage.ui.selectedNode)
              pageUtil.showNotificationMessage('toast', pageUtil.t('shell:common.actions.success'), pageUtil.t('mod-sponsor-server:message.success'));
            })
            .catch((error) => {
              pageUtil.showNotificationMessage('toast', pageUtil.t('shell:common.actions.error'), error.response?.data?.errorDescription);
            });
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
        uiValidation: function (val, fieldName) {
          if (fieldName === 'host') {
            const ValidIpAddressRegex = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/;
            const ValidHostnameRegex = /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9]*[A-Za-z0-9])$/;

            if (ValidIpAddressRegex.test(val) || ValidHostnameRegex.test(val)) {
              return true;
            }
          } else if (fieldName === 'port') {
            if (val >= 0 && val < 99999) {
              return true;
            }
          }
        }
      };
    })(pageArgs, pageUtil)
  );

  return (
    <>

      <CDS.Form name="apiConfiguration" context={page.form.apiConfiguration} className="apiConfiguration-form">
        <Layer level={0} className="sfg--page-details-container" style={{ margin: '1rem 0rem' }}>
          <Grid className="sfg--grid-container sfg--grid--form">
            <Column lg={8} md={8}>
              <CDS.TextInput
                labelText={
                  <span className="pem--name-label">
                    {pageUtil.t('mod-sponsor-server:field.name')}&nbsp;
                    <Tooltip align="bottom" label="test">
                      <Information />
                    </Tooltip>
                  </span>
                }
                placeholder={pageUtil.t('mod-sponsor-server:placeHolderName')}
                name="name"
                rules={{ required: true, minLength: 1, maxLength: 30 }}
              />
            </Column>
            <Column lg={8} md={8}>
              <CDS.ComboBox
                name="protocol"
                rules={{ required: true, onChange: page.uiOnProtocolChange }}
                titleText={pageUtil.t('mod-sponsor-server:field.protocol')}
                items={[
                  { id: 'http', label: 'http' },
                  { id: 'https', label: 'https' }
                ]}
                itemToString={(item) => (item ? item.label : '')}
              ></CDS.ComboBox>
            </Column>
            <Column lg={8} md={8}>
              <CDS.TextInput labelText={pageUtil.t('mod-sponsor-server:field.host')} name="host" rules={{
                required: true, minLength: 1, maxLenght: 100, validate: (value) => {
                  const isInvalidData = page.uiValidation(value, 'host');
                  if (!isInvalidData) {
                    return 'Invalid host format';
                  }
                }
              }} />
            </Column>
            <Column lg={8} md={8}>
              <CDS.TextInput labelText={pageUtil.t('mod-sponsor-server:field.port')} name="port"
                rules={{
                  required: true, validate: (value) => {
                    const isInvalidData = page.uiValidation(value, 'port');
                    if (!isInvalidData) {
                      return 'Invalid port';
                    }
                  }
                }} />
            </Column>
            <Column lg={8} md={8}>
              <CDS.ComboBox
                name="sslProtocol"
                rules={{ required: page.form.apiConfiguration.watch('protocol') === 'https' }}
                titleText={pageUtil.t('mod-sponsor-server:field.sslProtocol')}
                items={[
                  { id: 'TLSv1.2', label: 'TLSv1.2' },
                  { id: 'TLSv1.3', label: 'TLSv1.3' }
                ]}
                itemToString={(item) => (item ? item.label : '')}
                disabled={page.form.apiConfiguration.watch('protocol') !== 'https'}
              ></CDS.ComboBox>
            </Column>
            <Column lg={8} md={8} className='authentication-wrapper'>
              <CDS.Checkbox
                labelText={
                  <span className="pem--name-label">
                    {pageUtil.t('mod-sponsor-server:field.preemptiveAuthentication')}&nbsp;
                    <Tooltip align="bottom" label="test">
                      <Information />
                    </Tooltip>
                  </span>
                }
                name="preemptiveAuth"
              ></CDS.Checkbox>
            </Column>
            <Column lg={16} md={16}>
              <CDS.RadioButtonGroup
                legendText={pageUtil.t('mod-sponsor-server:field.authenticateWith')}
                name="authenticationType"
                rules={{ required: true, onChange: page.uiOnAuthenticalTypeChange }}
              >
                <CDS.RadioButton labelText={pageUtil.t('mod-sponsor-server:field.namePassword')} name="authenticationType" value="USERNAME_PASSWORD"></CDS.RadioButton>
                <CDS.RadioButton
                  labelText={
                    <span className="pem--name-label">
                      {pageUtil.t('mod-sponsor-server:field.internallyGeneratedToken')}&nbsp;
                      <Tooltip align="bottom" label="test">
                        <Information />
                      </Tooltip>
                    </span>
                  }
                  name="authenticationType"
                  value="INTERNAL_TOKEN"
                ></CDS.RadioButton>
                <CDS.RadioButton labelText={pageUtil.t('mod-sponsor-server:field.none')} name="authenticationType" value="NONE"></CDS.RadioButton>
              </CDS.RadioButtonGroup>
            </Column>
            {page.form.apiConfiguration.watch('authenticationType') === 'USERNAME_PASSWORD' && (
              <>
                <Column lg={8} md={8}>
                  <CDS.TextInput
                    labelText={pageUtil.t('mod-sponsor-server:field.userName')}
                    name="userName"
                    rules={{ required: page.form.apiConfiguration.watch('authenticationType') === 'USERNAME_PASSWORD', minLength: 1, maxLenght: 100 }}
                  />
                </Column>
                <Column lg={8} md={8}>
                  <CDS.PasswordInput
                    labelText={pageUtil.t('mod-sponsor-server:field.password')}
                    name="password"
                    rules={{ required: page.form.apiConfiguration.watch('authenticationType') === 'USERNAME_PASSWORD', minLength: 1, maxLenght: 100 }}
                  />
                </Column>
              </>
            )}
            {page.form.apiConfiguration.watch('protocol') === 'https' && (
              <>
                <Column lg={16} md={16}>
                  <CDS.Checkbox
                    labelText={
                      <span className="pem--name-label">
                        {pageUtil.t('mod-sponsor-server:field.verifyHost')}
                        <Tooltip align="bottom" label="test">
                          <Information />
                        </Tooltip>
                      </span>
                    }
                    name="verifyHost"
                  ></CDS.Checkbox>
                </Column>
              </>
            )}
            <Column lg={11}></Column>
            <Column lg={5} className='btn-wrapper'>
              <Button kind="tertiary" onClick={() => { page.form.apiConfiguration.handleSubmit(page.uiSave)() }}>Create</Button>
            </Column>
          </Grid>
        </Layer>
      </CDS.Form>

    </>
  );
};

export default CreateApiConfiguration;
