// import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { Given, When, Then } from '../core/steps.js';
import ParameterizedDataTable from '../support_files/ParameterizedDataTable.js';
import Form from '../page-objects/Form.po.js';
import FormField from '../page-objects/FormField.po.js';
import { getPage } from '../page-objects/Page.po.js';

Then(
  'User verifies field {string} of type [{formFieldType}] has error with message {string} is [{elementStatus}] in [Form][{string}]',
  async function (fieldId, fieldType, message, elementStatus, formId) {
    // const formField = await getPage(this.page).getForm(formId).getFormField(fieldId, fieldType);
    const formField = await (await getPage(this.page).getForm(formId)).getFormField(fieldId, fieldType);
    await formField.verifyErrorMessage(message, elementStatus);
  }
);

When('User clicks on {string} button in [Form][{string}]', async function (buttonId, formId) {
  await this.page.waitForTimeout(1);
  const form = await getPage(this.page).getForm(formId);
  await form.performFormAction(buttonId);
  await this.page.waitForTimeout(1000);
});

Then('User checks {string} button is [{elementStatus}] in [Form][{string}]', async function (buttonId, elementStatus, formId) {
  const form = await getPage(this.page).getForm(formId);
  await form.verifyFormAction(buttonId, elementStatus);
});

Then('User verifies form fields in [Form][{string}]', async function (formId, dataTable) {
  const form = await getPage(this.page).getForm(formId);
  const transformedDataTable = new ParameterizedDataTable(dataTable, 'name|formFieldType|label|elementStatus');
  const data = transformedDataTable.transformedHashes();
  await form.verifyFormFields(data);
});

Then(
  'User verifies field {string} of type [{formFieldType}] with label {string} is [{elementStatus}] in [Form][{string}]',
  async function (fieldId, fieldType, fieldLabel, elementStatus, formId) {
    //const page = await getPage(this.page);
    //const form = await page.getForm(formId);
    //const formField = await form.getFormField(fieldId, fieldType);
    const formField = await (await getPage(this.page).getForm(formId)).getFormField(fieldId, fieldType);
    // const formField = await (await getPage(this.page).getForm(formId)).getFormField(fieldId, fieldType);
    await formField.verifyElementStatus(elementStatus);
    if (elementStatus === 'visible') {
      await formField.verifyLabel(fieldLabel);
    }
  }
);

Then('User verifies field with label {string} of type [{formFieldType}] is [{elementStatus}] in [Form][{string}]', async function (fieldLabel, fieldType, elementStatus, formId) {
  let formField, formFieldControl, formFieldLabel;
  formField = await this.page.locator(`form[name=${formId}] .cds--form-item`).filter({ hasText: fieldLabel });
  if (elementStatus === 'hidden') {
    expect(formField).toBeHidden();
  } else if (elementStatus === 'visible') {
    expect(formField).toBeVisible();
    formFieldLabel = await formField.locator(fieldType.label);
    expect(formFieldLabel).toHaveText(fieldLabel);
    if (fieldType.type === 'TextInput' || fieldType.type === 'Select') {
      formFieldControl = await formField.locator(fieldType.control);
      expect(formFieldControl).toBeVisible();
    }
  }
});

Then('User verifies field {string} of type [{formFieldType}] has value {stringJsonPath} in [Form][{string}]', async function (fieldId, fieldType, fieldValue, formId) {
  const formField = await (await getPage(this.page).getForm(formId)).getFormField(fieldId, fieldType);
  await formField.verifyValue(fieldValue);
});

When('User updates field {string} of type [{formFieldType}] with value {stringJsonPath} in [Form][{string}]', async function (fieldId, fieldType, fieldValue, formId) {
  const formField = await (await getPage(this.page).getForm(formId)).getFormField(fieldId, fieldType);
  await formField.updateValue(fieldValue);
});

When('User updates form fields in [Form][{string}]', { timeout: 10 * 1000 }, async function (formId, dataTable) {
  const transformedDataTable = new ParameterizedDataTable(dataTable, 'name|formFieldType|value');
  const data = transformedDataTable.transformedHashes();
  // data.forEach(async (formFieldData) => {
  for (let i = 0; i < data.length; i++) {
    const formFieldData = data[i];
    const formField = await (await getPage(this.page).getForm(formId)).getFormField(formFieldData.name, formFieldData.formFieldType);
    await formField.updateValue(formFieldData.value);
  }
  //});
});

Then('User verifies form fields with values in [Form][{string}]', async function (formId, dataTable) {
  const transformedDataTable = new ParameterizedDataTable(dataTable, 'name|formFieldType|value');
  const data = transformedDataTable.transformedHashes();
  // data.forEach(async (formFieldData) => {
  for (let i = 0; i < data.length; i++) {
    const formFieldData = data[i];
    const formField = await (await getPage(this.page).getForm(formId)).getFormField(formFieldData.name, formFieldData.formFieldType);
    await formField.verifyValue(formFieldData.value);
  }
});

