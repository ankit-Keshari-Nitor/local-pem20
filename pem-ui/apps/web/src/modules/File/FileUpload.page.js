import React from 'react';
import { Grid, Column, Layer } from '@carbon/react';

import Shell, { CDS } from '@b2bi/shell';

const uploadFormats = {
  ACTIVITY: [],
  LOGO: ['.jpg', '.jpeg', '.png', '.bmp']
};

const FileUpload = ({ mode, context }) => {
  const pageUtil = Shell.PageUtil();
  const pageArgs = pageUtil.pageParams;
  const { pageMode } = Shell.usePageContainer();
  const { modalConfig } = Shell.useModal();

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
            documentCategory: '',
            isEncrypted: false,
            documentContents: undefined,
            partnerKey: ''
          }
        },
        init: function () {},
        uiOnRequestSubmit: function () {
          this.form.file.handleSubmit(this.uiUpload)();
        },
        uiUpload: function () {
          const formData = new FormData();
          // const params = this.form.key.getValues();
          formData.append('documentContents', this.ui.selectedFile);
          this.ds
            .uploadFile(formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            })
            .then((responseData) => {
              pageUtil.showNotificationMessage('toast', 'success', pageUtil.t('mod-file:upload.messages.upload_success'));

              if (pageMode === 'MODAL_PAGE') {
                modalConfig.onAction('submit', {});
              } else {
                page.navigate(-1);
              }
            })
            .catch((err) => {});
        },
        uiOnDocumentCategoryChange: function (event) {
          switch (event.target.value) {
            case 'ACTIVITY':
              page.form.file.resetField('isEncrypted', { defaultValue: true });
              break;
            case 'LOGO':
              page.form.file.resetField('isEncrypted', { defaultValue: false });
              break;
            default:
              break;
          }
        },
        uiBack: function () {
          if (pageMode === 'MODAL_PAGE') {
            modalConfig.onAction('cancel', {});
          } else {
            pageUtil.navigate(-1);
          }
        },
        uiOnAddFile: function (event, files) {
          this.setUI('selectedFile', files.addedFiles[0]);
        },
        uiOnDeleteFile: function (...args) {
          this.setUI('selectedFile', undefined);
        }
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
            return page.uiBack.apply();
          }
        },
        {
          id: 'uploadSave',
          label: 'shell:common.actions.uploadSave',
          type: 'button',
          kind: 'primary',
          resourceKey: `FILE.UPLOAD`,
          disabled: false,
          onAction: (...args) => {
            return page.uiOnRequestSubmit.apply();
          }
        }
      ]
    }
  };

  return (
    <>
      <Shell.Page type="UPLOAD" className={`sfg--page--file-upload`}>
        <Shell.PageHeader title={pageUtil.t('mod-file:upload.pageTitle')} description={pageUtil.t('mod-file:upload.pageDescription')}></Shell.PageHeader>
        <Shell.PageBody>
          <CDS.Form name="file" context={page.form.file}>
            <Layer level={0} className="sfg--page-details-container">
              <Grid className="sfg--grid-container sfg--grid--form">
                <Column lg={6} md={6}>
                  <CDS.TextInput
                    labelText={pageUtil.t('mod-file:form.documentName')}
                    name="documentName"
                    infoText={pageUtil.t('mod-file:upload.messages.documentName_tooltip')}
                    rules={{ required: true, minLength: 1, maxLenght: 100 }}
                  />
                </Column>
                <Column lg={6} md={6}></Column>
                <Column lg={6} md={6}>
                  <CDS.RadioButtonGroup
                    legendText={pageUtil.t('mod-file:form.documentCategory')}
                    name="documentCategory"
                    rules={{ required: true, onChange: page.uiOnDocumentCategoryChange }}
                  >
                    <CDS.RadioButton labelText={pageUtil.t('mod-file:form.documentCategory_ACTIVITY')} name="documentCategory" value="ACTIVITY"></CDS.RadioButton>
                    <CDS.RadioButton labelText={pageUtil.t('mod-file:form.documentCategory_LOGO')} name="documentCategory" value="LOGO"></CDS.RadioButton>
                  </CDS.RadioButtonGroup>
                </Column>
                <Column lg={6} md={6}>
                  <CDS.Toggle labelText={pageUtil.t('mod-file:form.isEncrypted')} name="isEncrypted" disabled={page.form.file.watch('documentCategory') === 'LOGO'}></CDS.Toggle>
                </Column>
                <Column lg={12} md={12}>
                  <p className="cds--file--label">{pageUtil.t('mod-file:upload.upload_label')}</p>
                </Column>
                <Column lg={page.ui.selectedFile === undefined ? 12 : 6} md={page.ui.selectedFile === undefined ? 12 : 6}>
                  <CDS.FileUpload
                    labelText={pageUtil.t('mod-file:form.fileName')}
                    name="uploadKeyFile"
                    accept={uploadFormats[page.form.file.watch('documentCategory')]}
                    maxFileSize={'2mb'}
                    onChange={page.uiOnAddFile}
                    onDelete={page.uiOnDeleteFile}
                  ></CDS.FileUpload>
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

export default FileUpload;
