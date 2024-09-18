import { expect } from '@playwright/test';
import checkElementStatus from './ElementStatus.js';
import Form from './Form.po.js';
import DataTable from './data-table.po.js';
class Page {
  constructor(parent, pageName) {
    this.pageName = pageName;
    this.parent = parent;
  }

  async _getPage() {
    if (this.pageName !== undefined) {
      return this.parent.locator(`.sfg--page--${this.pageName}`);
    } else {
      return this.parent;
    }
  }

  async verfiyPageTitle(pageTitle) {
    const text = await this._getPage.locator(`.page-header-container .cds--data-table-header__title`).textContent();
    expect(text).toBe(pageTitle);
  }
  async verifyPageAction(actionName, elementStatus) {
    const pageFooter = await this._getPage().locator(`.sfg--page--actions`);
    expect(pageFooter).toBeVisible();
    const actionBtn = await pageFooter.getByRole('button', { name: actionName });
    checkElementStatus(actionBtn, elementStatus);
  }

  async performPageAction(actionName) {
    const pageFooter = await this._getPage().locator(`.sfg--page--actions`);
    expect(pageFooter).toBeVisible();
    const actionBtn = await pageFooter.getByRole('button', { name: actionName });
    expect(actionBtn).toBeVisible();
    expect(actionBtn).toBeEnabled();
    await actionBtn.click();
  }

  async getForm(formName) {
    return new Form(this.parent, await this._getPage(), formName);
  }

  async getDataTable(datatableName) {
    return new DataTable(this.parent, await this._getPage(), datatableName);
  }
}

const getPage = function (parent, pageName) {
  return new Page(parent, pageName);
};

export default Page;

export { getPage };
