import React from 'react';
import { Column, Grid, Layer, Tooltip } from '@carbon/react';
import { Information } from '@carbon/icons-react';
import Shell, { CDS } from '@b2bi/shell';

const CreateApiConfiguration = ({ mode }) => {
  const pageUtil = Shell.PageUtil();
  const pageArgs = pageUtil.pageParams;

  const pageConfig = {
    actionsConfig: {
      pageActions: [
        {
          id: 'save',
          label: 'mod-sponsor-server:field.create',
          type: 'tertiary',
          kind: 'tertiary',
          resourceKey: 'SAVE',
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
          save: {
            dataloader: 'API_CONFIGURATION.CREATE'
          }
        },
        ui: {
          mode: mode,
          errorState: undefined,
          successState: undefined,
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
              this.setUI('successState', pageUtil.t('mod-sponsor-server:field.uploadField.success'))

            })
            .catch((error) => { this.setUI('errorState', error.response?.data?.errorDescription) });
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
        }
      };
    })(pageArgs, pageUtil)
  );

  return (
    <>
      <Shell.Page type="API_CONFIG" className={`sfg--page--api-configuration-add`}>
        <Shell.PageBody>
          <CDS.Form name="apiConfiguration" context={page.form.apiConfiguration}>
            <Layer level={0} className="sfg--page-details-container" style={{ margin: '1rem 0rem' }}>
              <Grid className="sfg--grid-container sfg--grid--form">
                <Column lg={16}>  {page.ui.errorState !== undefined && (<span className='errorMessage'>{page.ui.errorState}</span>)}</Column>
                <Column lg={16}>  {page.ui.successState !== undefined && (<span className='successMessage'>{page.ui.successState}</span>)}</Column>

                <Column lg={6} md={6}>
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
                <Column lg={6} md={6}>
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
                <Column lg={6} md={6}>
                  <CDS.TextInput labelText={pageUtil.t('mod-sponsor-server:field.host')} name="host" rules={{ required: true, minLength: 1, maxLenght: 100 }} />
                </Column>
                <Column lg={6} md={6}>
                  <CDS.NumberInput label={pageUtil.t('mod-sponsor-server:field.port')} hideSteppers name="port" rules={{ required: true }} min={0} max={99999} />
                </Column>
                <Column lg={6} md={6}>
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
                <Column lg={6} md={6}>
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
                    <Column lg={6} md={6}>
                      <CDS.TextInput
                        labelText={pageUtil.t('mod-sponsor-server:field.userName')}
                        name="userName"
                        rules={{ required: page.form.apiConfiguration.watch('authenticationType') === 'USERNAME_PASSWORD', minLength: 1, maxLenght: 100 }}
                      />
                    </Column>
                    <Column lg={6} md={6}>
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
              </Grid>
            </Layer>
          </CDS.Form>
        </Shell.PageBody>
        <Grid>
          <Column lg={8} md={8}></Column>
          <Column lg={4} md={4}>
            <Shell.PageActions actions={pageConfig.actionsConfig.pageActions}></Shell.PageActions>
          </Column>
        </Grid>
      </Shell.Page>
    </>
  );
};

export default CreateApiConfiguration;
