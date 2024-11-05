import React from 'react';
import { Grid, Column, Layer, Button } from '@carbon/react';
import Shell, { CDS } from '@b2bi/shell';
import '../styles.scss';

const CreateUploadForm = ({ documentCategory, contextPage, cdmPage }) => {
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
          selectedFile: undefined,
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
        init: function () {
          cdmPage.setUI('successState', undefined);
          cdmPage.setUI('errorState', undefined);
          this.form.file.reset(pageUtil.getSubsetJson(this.form.file.attributes));
        },
        uiOnRequestSubmit: function () {
          this.setUI('errorState', undefined);
          this.setUI('successState', undefined);
          this.form.file.handleSubmit(this.uiUpload)();
        },
        uiUpload: function () {
          const formData = new FormData();
          let params = this.form.file.getValues();
          formData.append('documentContents', this.ui.selectedFile);
          if (params.uploadFile !== undefined) {
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
              .then((response) => {
                this.setUI('selectedFile', undefined);
                documentCategory === 'LOGO' ? cdmPage.uiOnMap('LOGO_FILE', response.data.response, cdmPage.ui.selectedNode) : cdmPage.uiOnMap('ACTIVITY_FILE', response.data.response, cdmPage.ui.selectedNode)
                this.form.file.reset(pageUtil.getSubsetJson(this.form.file.attributes));
                this.setUI('successState', pageUtil.t('mod-sponsor-server:field.uploadField.success'))
              }).catch((error) => {
                this.setUI('errorState', error.response?.data?.errorDescription)
              });
          } else {
            this.setUI('errorState', 'Please attach the file.')
          }
        },
        uiOnAddFile: function (event, files) {
          this.setUI('errorState', undefined);
          this.setUI('selectedFile', files.addedFiles[0]);
        },
        uiOnDeleteFile: function (...args) {
          this.setUI('selectedFile', undefined);
        }
      };
    })(pageArgs, pageUtil)
  );


  return (
    <>

      <CDS.Form name="file" context={page.form.file}>
        <Layer level={0} className="sfg--page-details-container" style={{ margin: '1rem 0rem' }}>
          <Grid className="sfg--grid-container sfg--grid--form">
            <Column lg={12}>  {page.ui.errorState !== undefined && (<span className='errorMessage'>{page.ui.errorState}</span>)}</Column>
            <Column lg={12}>  {page.ui.successState !== undefined && (<span className='successMessage'>{page.ui.successState}</span>)}</Column>
            <Column lg={8}>
              <Grid>
                <Column lg={8}>
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
                <Column lg={8} md={8}>
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
            <Column lg={8}>
              {''}
              <p className="cds--file--label label">{pageUtil.t('mod-sponsor-server:field.uploadField.uploadFiles')}</p>
              <CDS.FileUpload
                name="uploadFile"
                accept={['.jpg', '.jpeg', '.png', '.bmp', '.gif']}
                maxFileSize={'2mb'}
                onChange={page.uiOnAddFile}
                onDelete={page.uiOnDeleteFile}
                value={page.ui.selectedFile}
              ></CDS.FileUpload>
            </Column>

            <Column lg={16} md={16}>
              <CDS.Checkbox labelText={pageUtil.t('mod-sponsor-server:field.uploadField.encrypt')} name="isEncrypted"></CDS.Checkbox>
            </Column>
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

export default CreateUploadForm;
