import { expect } from '@playwright/test';
import checkElementStatus from './ElementStatus.js';

const dataDir = '\\bdd\\data\\'; // TODO: Consider loading the file from different folder for different env - dev|sanity|qa|e2e|
const baseFilePath = process.cwd().concat(dataDir); //.concat(filePath);

class FormField {
  constructor(page, parent, formName, fieldName, fieldType) {
    this.formName = formName;
    this.fieldName = fieldName;
    this.fieldType = fieldType;
    this.parent = parent;
    this.page = page;
  }

  async _getFormField() {
    if (this.fieldType.type === 'MultiSelect') {
      return this.parent.locator(`${this.fieldType.field}`).filter({ has: await this.page.locator(`[id="${this.formName}.${this.fieldName}-input"]`) });
    }
    return this.parent.locator(`${this.fieldType.field}`).filter({ has: await this.page.locator(`[name="${this.fieldName}"]`) });
  }
  async verifyLabel(fieldLabel) {
    const formField = await this._getFormField();
    const labelEle = await formField.locator(this.fieldType.label);
    const label = await labelEle.textContent();
    await expect(label).toBe(fieldLabel);
  }

  async verifyElementStatus(elementStatus) {
    const formField = await this._getFormField();
    const formFieldControl = await formField.locator(this.fieldType.control);
    if (this.fieldType.type === 'RadioGroup' || this.fieldType.type === 'CheckboxGroup') {
      // TODO: Need to handle radio group properly
      /*const count = await formFieldControl.count();
        for(let i=0; i< count; i++) {
            await checkElementStatus(await formFieldControl.nth(i), elementStatus);
        }*/
      await checkElementStatus(await formFieldControl.nth(0), elementStatus);
    } else {
      await checkElementStatus(formFieldControl, elementStatus);
    }
  }

  async verifyErrorMessage(message, elementStatus) {
    const formField = await this._getFormField();
    let errorMessage;
    switch (this.fieldType.type) {
      case 'Combobox':
        errorMessage = await formField.locator(`.cds--form-requirement`);
        break;
      default:
        errorMessage = await formField.locator(`[id="${this.formName + '.' + this.fieldName}-error-msg"]`);
        break;
    }

    checkElementStatus(errorMessage, elementStatus);
    if (elementStatus === 'visible') {
      const text = await errorMessage.textContent();
      expect(text).toBe(message);
    }
  }

  async verifyValue(fieldValue) {
    const formField = await this._getFormField();
    let formFieldControl = await formField.locator(this.fieldType.control);
    let value;
    switch (this.fieldType.type) {
      case 'TextInput':
      case 'TextArea':
      case 'NumberInput':
      case 'Password':
      case 'Combobox':
        await expect(formFieldControl).toBeVisible();
        value = await formFieldControl.inputValue();
        await expect(value).toBe(fieldValue);
        break;
      case 'Select':
        value = await formFieldControl.inputValue();
        const selectedOption = await formFieldControl.locator(`option[value="${value}"]`);
        const valueLabel = await selectedOption.textContent();
        expect(valueLabel).toBe(fieldValue);
        break;
      case 'MultiSelect':
        try {
          await expect(formFieldControl).toBeVisible();
          await formFieldControl.click();
          await this.page.waitForTimeout(100);
          let multiSelectOptions = await formField.locator(this.fieldType.option);
          const multiSelectOptionsCount = await multiSelectOptions.count();
          for (let i = 0; i < multiSelectOptionsCount; i++) {
            const multiSelectOption = await multiSelectOptions.nth(i);
            const label = await multiSelectOption.textContent();
            const checkbox = await multiSelectOption.locator('.cds--checkbox-label');
            if (fieldValue.split('|').indexOf(label) > -1) {
              await expect(checkbox).toHaveAttribute('data-contained-checkbox-state', 'true');
            } else {
              await expect(checkbox).toHaveAttribute('data-contained-checkbox-state', 'false');
            }
          }
          await formFieldControl.blur();
          await this.page.waitForTimeout(100);
        } catch (err) {
          console.log(err);
        }
        break;
      case 'RadioGroup':
        // TODO: Need to handle radio group properly
        await expect(await formFieldControl.nth(0)).toBeVisible();
        formFieldControl = await formField.locator(this.fieldType.control).filter({ has: this.page.getByLabel(fieldValue, { exact: true }) }); //hasText: fieldValue
        const radioButton = await formFieldControl.locator('input');
        await expect(radioButton).toBeChecked();
        break;
      case 'CheckboxGroup':
        await expect(await formFieldControl.nth(0)).toBeVisible();
        const checkboxCount = await formFieldControl.count();
        for (let i = 0; i < checkboxCount; i++) {
          const checkboxFormField = await formFieldControl.nth(i);
          const checkboxFormFieldLabel = await (await checkboxFormField.locator('label.cds--checkbox-label')).textContent();
          const checkbox = await checkboxFormField.locator('input');
          if (fieldValue.split('|').indexOf(checkboxFormFieldLabel) > -1) {
            await expect(checkbox).toBeChecked();
          } else {
            await expect(checkbox).not.toBeChecked();
          }
        }
      case 'Toggle':
        await expect(formFieldControl).toBeVisible();
        value = await formFieldControl.getAttribute('aria-checked');
        await expect(value).toBe(fieldValue);
        break;
      case 'FileInput':
        /*await expect(formFieldControl).toBeVisible();
        const fileName = await formFieldControl.evaluate((input) => {
          if (input.files.length > 0) {
            return input.files[0].name;
          } else {
            return undefined;
          }
        });
        await expect(fileName).not.toBeUndefined();
        await expect(fileName).toBe(fieldValue);
        */
        let formFieldFileName = await formField.locator(this.fieldType.fileName);
        const fileName = await formFieldFileName.textContent();
        await expect(formFieldFileName).toBeVisible();
        await expect(fileName).not.toBeUndefined();
        await expect(fileName).toBe(fieldValue);
        break;
      default:
        break;
    }
  }

  async updateValue(fieldValue) {
    const formField = await this._getFormField();
    let formFieldControl = await formField.locator(this.fieldType.control);
    if (this.fieldType.type !== 'FileInput') {
      await formField.click();
    }
    switch (this.fieldType.type) {
      case 'TextInput':
      case 'TextArea':
      case 'NumberInput':
      case 'Password':
        await expect(formFieldControl).toBeVisible();
        await formFieldControl.click();
        await formFieldControl.fill(fieldValue);
        await formFieldControl.blur();
        break;
      case 'Select':
        await expect(formFieldControl).toBeVisible();
        await formFieldControl.click();
        await formFieldControl.selectOption({ label: fieldValue });
        await formFieldControl.blur();
        break;
      case 'RadioGroup':
        // TODO: Need to handle radio group properly
        await expect(await formFieldControl.nth(0)).toBeVisible();
        formFieldControl = await formField.locator(this.fieldType.control).filter({ has: this.page.getByLabel(fieldValue, { exact: true }) }); //hasText: fieldValue
        await formFieldControl.click();
        break;
      case 'Toggle':
        await expect(formFieldControl).toBeVisible();
        const value = await formFieldControl.getAttribute('aria-checked');
        if (fieldValue === value) {
        } else {
          // await formFieldControl.click();
          const toggle = await formField.locator('.cds--toggle__switch');
          toggle.click();
          await this.page.waitForTimeout(100);
        }
        break;
      case 'CheckboxGroup':
        await expect(await formFieldControl.nth(0)).toBeVisible();
        const checkboxCount = await formFieldControl.count();
        for (let i = 0; i < checkboxCount; i++) {
          const checkboxFormField = await formFieldControl.nth(i);
          const checkboxFormFieldLabel = await (await checkboxFormField.locator('label.cds--checkbox-label')).textContent();
          const checkbox = await checkboxFormField.locator('label.cds--checkbox-label');
          const checkboxvalue = await checkbox.inputValue();
          if (fieldValue.split('|').indexOf(checkboxFormFieldLabel) > -1) {
            await checkbox.setChecked(true);
          } else {
            await checkbox.setChecked(false);
          }
        }
        break;
      case 'Combobox':
        await expect(formFieldControl).toBeVisible();
        await formFieldControl.click();
        await this.page.waitForTimeout(100);
        let comboboxOptions = await formField.locator(this.fieldType.option);
        await formFieldControl.fill(fieldValue);
        await this.page.waitForTimeout(500);
        const comboboxOptionsCount = await comboboxOptions.count();
        let found = false;
        for (let i = 0; i < comboboxOptionsCount; i++) {
          const comboboxOption = await comboboxOptions.nth(i);
          const label = await comboboxOption.textContent();
          if (label === fieldValue) {
            comboboxOption.click();
            found = true;
            break;
          }
        }
        await formFieldControl.blur();
        await expect(found).toBeTruthy();
        await this.page.waitForTimeout(100);
        break;
      case 'MultiSelect':
        await expect(formFieldControl).toBeVisible();
        await formFieldControl.click();
        await this.page.waitForTimeout(100);
        let multiSelectOptions = await formField.locator(this.fieldType.option);
        const multiSelectOptionsCount = await multiSelectOptions.count();
        for (let i = 0; i < multiSelectOptionsCount; i++) {
          const multiSelectOption = await multiSelectOptions.nth(i);
          const label = await multiSelectOption.textContent();
          const checkbox = await multiSelectOption.locator('.cds--checkbox-label');
          let checkBoxState;
          if (fieldValue.split('|').indexOf(label) > -1) {
            checkBoxState = await checkbox.getAttribute('data-contained-checkbox-state');
            if (checkBoxState !== 'true') {
              await checkbox.click();
            }
          } else {
            checkBoxState = await checkbox.getAttribute('data-contained-checkbox-state');
            if (checkBoxState === 'true') {
              await checkbox.click();
            }
          }
        }
        await formFieldControl.blur();
        await this.page.waitForTimeout(100);
        break;

      case 'FileInput':
        await expect(formFieldControl).toBeVisible();
        // await formFieldControl.setInputFiles(path.join(__dirname, fieldValue));
        //const fullPath = path.join(__dirname, fieldValue); //path.resolve(__dirname, fieldValue);
        const fullPath = baseFilePath.concat(fieldValue);
        await formFieldControl.setInputFiles(fullPath);
        break;
      default:
        break;
    }

    if (this.fieldType.type !== 'FileInput') {
      await formField.blur();
    }
  }
}

export default FormField;
