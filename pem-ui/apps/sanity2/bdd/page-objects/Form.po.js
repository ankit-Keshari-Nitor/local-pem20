import { expect } from '@playwright/test';
import checkElementStatus from './ElementStatus.js';
import FormField from './FormField.po.js';

class Form {
  constructor(page, parent, formName) {
    this.formName = formName;
    this.parent = parent;
    this.page = page;
  }

  async _getForm() {
    return this.parent.locator(`form[name=${this.formName}]`);
  }

  async verifyFormAction(actionName, elementStatus) {
    const form = await this._getForm();
    const formButton = form.locator(`button[name="${actionName}"]`);
    checkElementStatus(formButton, elementStatus);
  }

  async performFormAction(actionName) {
    const form = await this._getForm();
    const formButton = form.locator(`button[name="${actionName}"]`);
    await formButton.click();
  }

  async getFormField(fieldName, fieldType) {
    return new FormField(this.page, await this._getForm(), this.formName, fieldName, fieldType);
  }

  async verifyFormFields(data) {
    const form = await this._getForm();
    for (let i = 0; i < data.length; i++) {
      const formFieldData = data[i];
      const formField = await this.getFormField(formFieldData.name, formFieldData.formFieldType);
      await formField.verifyElementStatus(formFieldData.elementStatus);
      if (formFieldData.elementStatus === 'visible') {
        await formField.verifyLabel(formFieldData.label);
      }
    }
  }

  async updateFormFields(data) {
    for (let i = 0; i < data.length; i++) {
      const formFieldData = data[i];
      const formField = await this.getFormField(formFieldData.name, formFieldData.formFieldType);
      await formField.updateValue(formFieldData.value);
    }
  }

  async verifyFormFieldValues(data) {
    for (let i = 0; i < data.length; i++) {
      const formFieldData = data[i];
      const formField = await this.getFormField(formFieldData.name, formFieldData.formFieldType);
      await formField.verifyValue(formFieldData.value);
    }
  }
}

export default Form;
