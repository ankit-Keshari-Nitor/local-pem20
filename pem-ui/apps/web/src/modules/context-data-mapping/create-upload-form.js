import React from 'react';
import { Grid, Column, Layer } from '@carbon/react';
import Shell, { CDS } from '@b2bi/shell';
import './style.scss';

const CreateUploadForm = ({ documentCategory }) => {
  const pageUtil = Shell.PageUtil();
  const pageArgs = pageUtil.pageParams;

  const { page } = Shell.usePage(
    [],
    (function Page(pageArgs, pageUtil) {
      return {
        model: {},
        datasources: {
          uploadFile: {
            dataloader: `FILE.UPLOAD`
          }
        },
        ui: {
          selectedFile: undefined
        },
        form: {
          file: {
            documentName: '',
            documentDescription: '',
            isEncrypted: false,
            documentContents: undefined,
            documentCategory: documentCategory,
            partnerKey: '',
            selectedFile: undefined
          }
        },
        init: function () { },
        uiOnRequestSubmit: function () {
          this.form.file.handleSubmit(this.uiUpload)();
        },
        uiUpload: function () {
          const formData = new FormData();
          let params = this.form.file.getValues();
          formData.append('documentContents', this.ui.selectedFile);

          formData.append('documentName', params.documentName);
          formData.append('documentDescription', params.documentDescription);
          formData.append('documentCategory', params.documentCategory);
          formData.append('isEncrypted', params.isEncrypted);
          params = {};

          this.ds
            .uploadFile(formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              },
              params: params
            })
            .then(() => {
              pageUtil.showNotificationMessage('toast', 'success', pageUtil.t('mod-sponsor-server:field.uploadField.success'));
              //  modalConfig.onAction('submit', {});
            });
        },
        uiOnAddFile: function (event, files) {
          this.setUI('selectedFile', files.addedFiles[0]);
        },
        uiOnDeleteFile: function (...args) {
          console.log(args);
          this.setUI('selectedFile', undefined);
        }
      };
    })(pageArgs, pageUtil)
  );

  const pageConfig = {
    actionsConfig: {
      pageActions: [
        {
          id: 'create',
          label: 'mod-sponsor-server:field.uploadField.create',
          type: 'tertiary',
          kind: 'tertiary',
          resourceKey: `FILE.UPLOAD`,
          disabled: false,
          onAction: () => {
            return page.uiOnRequestSubmit.apply();
          }
        }
      ]
    }
  };

  return (
    <>
      <Shell.Page type="UPLOAD" className={`sfg--page--file-upload`}>
        <Shell.PageBody>
          <CDS.Form name="file" context={page.form.file}>
            <Layer level={0} className="sfg--page-details-container" style={{ margin: '1rem 0rem' }}>
              <Grid className="sfg--grid-container sfg--grid--form">
                <Column lg={6}>
                  <Grid>
                    <Column lg={6}>
                      <CDS.TextInput
                        labelText={pageUtil.t('mod-sponsor-server:field.uploadField.name')}
                        name="documentName"
                        rules={{
                          required: true, minLength: 1, maxLength: 30, pattern: {
                            value: /^[a-zA-Z0-9@#%^&*(){}[\]+=;:"'!?/.,\\|~`\s]*$/i, message: pageUtil.t('mod-sponsor-server:message.nameErrorMessage')
                          }
                        }}
                      />
                    </Column>
                    <Column lg={6} md={6}>
                      <CDS.TextArea
                        labelText={pageUtil.t('mod-sponsor-server:field.uploadField.description')}
                        name="documentDescription"
                        rows={5}
                        enableCounter={true}
                        counterMode="character"
                        maxCount={255}
                        rules={{
                          required: false, minLength: 1, maxLength: 255, pattern: {
                            value: /^[a-zA-Z0-9@#%^&*(){}[\]+=;:"'!?/.,\\|~`\s]*$/i, message: pageUtil.t('mod-sponsor-server:message.nameErrorMessage')
                          }
                        }}
                      />
                    </Column>
                  </Grid>
                </Column>
                <Column lg={6}>
                  {''}
                  <p className="cds--file--label label">{pageUtil.t('mod-sponsor-server:field.uploadField.uploadFiles')}</p>
                  <CDS.FileUpload
                    labelText={pageUtil.t('mod-sponsor-server:field.uploadField.uploadedFile')}
                    name="uploadFile"
                    accept={['.jpg', '.jpeg', '.png', '.bmp', '.gif']}
                    maxFileSize={'2mb'}
                    onChange={page.uiOnAddFile}
                    onDelete={page.uiOnDeleteFile}
                  ></CDS.FileUpload>
                </Column>

                <Column lg={6} md={6}>
                  <CDS.Checkbox labelText={pageUtil.t('mod-sponsor-server:field.uploadField.encrypt')} name="isEncrypted"></CDS.Checkbox>
                </Column>
              </Grid>
            </Layer>
          </CDS.Form>
        </Shell.PageBody>
        <Shell.PageActions actions={pageConfig.actionsConfig.pageActions}></Shell.PageActions>
      </Shell.Page >
    </>
  );
};

export default CreateUploadForm;
