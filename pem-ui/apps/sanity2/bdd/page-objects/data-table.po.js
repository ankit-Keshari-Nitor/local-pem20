import { expect } from '@playwright/test';
import checkElementStatus from './ElementStatus.js';
import Form from './Form.po.js';

class DataTable {
  constructor(page, parent, datatableName) {
    this.datatableName = datatableName;
    this.parent = parent;
    this.page = page;
  }

  async _getDatatable() {
    return this.parent.locator(`.sfg--datatable--${this.datatableName}`);
  }

  async getFilterForm() {
    return new Form(this.page, await this._getDatatable(), 'filter');
  }
  async verifyColumn(columnName, columnLabel, elementStatus) {
    const datatable = await this._getDatatable();
    const column = await datatable.locator(`table thead tr th[data-testid="${columnName}"]`);
    await checkElementStatus(column, elementStatus);
    if (elementStatus === 'visible') {
      const text = await column.textContent();
      await expect(text).toBe(columnLabel);
    }
  }

  async verifyColumns(headerData) {
    const datatable = await this._getDatatable();
    const headers = await datatable.locator(`table thead tr th`);
    await expect(headers).toHaveCount(headerData.length);
    for (let i = 0; i < headerData.length; i++) {
      const row = headerData[i];
      const column = await headers.nth(i);
      await expect(column).toBeVisible();
      const text = await column.textContent();
      await expect(text).toBe(row[1]);
    }
  }

  async verifyToolbarAction(actionName, elementStatus) {
    const datatable = await this._getDatatable();
    const toolbarAction = await datatable.locator(`.cds--table-toolbar [name="${actionName}"]`);
    await checkElementStatus(toolbarAction, elementStatus);
  }

  async performToolbarAction(actionName) {
    const datatable = await this._getDatatable();
    const toolbarAction = await datatable.locator(`.cds--table-toolbar [name="${actionName}"]`);
    await expect(toolbarAction).toBeVisible();
    await expect(toolbarAction).toBeEnabled();
    await toolbarAction.click();
  }

  async verifyRowActions(rowIndex, rowActions) {
    const datatable = await this._getDatatable();
    const rowAction = await datatable.locator(`table tbody tr[data-testid="row-${rowIndex}"] td[data-testid="row-actions"]  button`);
    await rowAction.click();
    await this.page.waitForTimeout(10);
    const actions = await this.page.locator(`.cds--overflow-menu-options button`);
    await expect(actions).toHaveCount(rowActions.length);
    for (let i = 0; i < rowActions.length; i++) {
      const row = rowActions[i];
      const action = await actions.nth(i);
      await expect(action).toBeVisible();
      const text = await action.textContent();
      await expect(text).toBe(row[1]);
    }
    await rowAction.click();
    await this.page.waitForTimeout(10);
  }

  async performRowAction(rowIndex, rowActionName) {
    const datatable = await this._getDatatable();
    const rowAction = await datatable.locator(`table tbody tr[data-testid="row-${rowIndex}"] td[data-testid="row-actions"]  button`);
    await rowAction.click();
    await this.page.waitForTimeout(10);
    const action = await this.page.locator(`.cds--overflow-menu-options button[data-testid="${rowActionName}"]`);
    await expect(action).toBeVisible();
    await action.click();
  }

  async verifyRowData(data) {
    const datatable = await this._getDatatable();
    let columnIndex = 0;
    const rowSelection = await datatable.locator(`table thead tr th.cds--table-column-checkbox`);
    if (await rowSelection.isHidden()) {
      columnIndex = 1;
    }
    for (let i = 0; i < data.length; i++) {
      const rowData = data[i];
      const cells = await datatable.locator(`table tbody tr[data-testid="row-${Number(rowData[0])}"] td`);
      for (let j = 1; j < rowData.length; j++) {
        const cell = await cells.nth(j - columnIndex);
        await expect(cell).toBeVisible();
        const text = await cell.textContent();
        await expect(text).toBe(rowData[j]);
      }
    }
    // TODO: need to handle table without selection checkbox
  }

  async verifyCellData(rowIndex, columnIndex, cellValue) {
    const datatable = await this._getDatatable();
    const cell = await datatable.locator(`table tbody tr[data-testid="row-${rowIndex}"] td`).nth(columnIndex);
    await expect(cell).toBeVisible();
    const text = await cell.textContent();
    await expect(text).toBe(cellValue);
  }

  async performCellAction(rowIndex, columnIndex, actionType) {
    const datatable = await this._getDatatable();
    const cell = await datatable.locator(`table tbody tr[data-testid="row-${rowIndex}"] td`).nth(columnIndex);
    await expect(cell).toBeVisible();
    if (actionType === 'link') {
      const link = await cell.locator('.cds--link');
      await link.click();
    }
  }

  async gotoPage(actionType) {
    const datatable = await this._getDatatable();
    const paginationAction = await datatable.locator(`.cds--pagination__button--${actionType}`);
    await paginationAction.click();
  }

  async verifyPage(pageNo) {
    const datatable = await this._getDatatable();
    const pageNoElement = await datatable.locator(`.cds--select__page-number .cds--select-input`);
    await expect(pageNoElement).toHaveValue(pageNo);
  }

  async selectPage(pageNo) {
    const datatable = await this._getDatatable();
    const pageNoElement = await datatable.locator(`.cds--select__page-number .cds--select-input`);
    await pageNoElement.selectOption(pageNo);
  }

  async verifyPageSize(pageSize) {
    const datatable = await this._getDatatable();
    const pageSizeElement = await datatable.locator(`.cds--select__item-count .cds--select-input`);
    await expect(pageSizeElement).toHaveValue(pageSize);
  }

  async selectPageSize(pageSize) {
    const datatable = await this._getDatatable();
    const pageSizeElement = await datatable.locator(`.cds--select__item-count .cds--select-input`);
    await pageSizeElement.selectOption(pageSize);
  }

  async verifyTotalPages(totalPages) {
    const datatable = await this._getDatatable();
    const totalPagesElement = await datatable.locator(`.cds--pagination__right .cds--pagination__text`);
    const pageText = await totalPagesElement.textContent();
    if (totalPages == 1) {
      await expect(pageText).toBe(`of ${totalPages} page`);
    } else {
      await expect(pageText).toBe(`of ${totalPages} pages`);
    }
  }

  async verifyTotalCount(totalCount) {
    const datatable = await this._getDatatable();
    const totalPagesElement = await datatable.locator(`.cds--pagination__text.cds--pagination__items-count`);
    await expect(totalPagesElement).toBeVisible();
    const pageText = await totalPagesElement.textContent();
    await expect(pageText).toContain(`of ${totalCount} items`);
  }

  async performSearch(searchText) {
    const datatable = await this._getDatatable();
    const searchbox = await datatable.locator(`.cds--search[role="search"] input[role="searchbox"]`);
    await searchbox.click();
    await searchbox.fill(searchText);
    await searchbox.press('Enter');
  }

  async verifyFilterStatus(elementStatus) {
    const datatable = await this._getDatatable();
    const filterSection = await datatable.locator(`.sfg--filter-section form[name="filter"]`);
    if (elementStatus === 'visible') {
      await expect(filterSection).toBeVisible();
    } else if (elementStatus === 'hidden') {
      await expect(filterSection).toBeHidden();
    }
  }

  async verifyAppliedFilters(appliedFilters, elementStatus) {
    const datatable = await this._getDatatable();
    const appliedFiltersDom = await datatable.locator('.sfg--datatable-applied-filters-section .cds--tag--filter');

    if (elementStatus === 'visible') {
      await checkElementStatus(await appliedFiltersDom.nth(0), elementStatus);
      const appliedFilterCount = await appliedFiltersDom.count();
      for (let i = 0; i < appliedFilterCount; i++) {
        const appliedFilter = await appliedFiltersDom.nth(i);
        const label = await appliedFilter.locator('.cds--tag__label');
        await expect(label).toHaveText(appliedFilters[i].name + ':' + appliedFilters[i].values);
      }
    } else {
      await checkElementStatus(await appliedFiltersDom, elementStatus);
    }
  }

  async clearAppliedFilter(filterName) {
    const datatable = await this._getDatatable();
    const clearFilter = await datatable.locator(`.sfg--datatable-applied-filters-section .cds--tag--filter [name="${filterName}"] button.cds--tag__close-icon`);
    await clearFilter.click();
  }

  async clearAppliedFilters() {
    const datatable = await this._getDatatable();
    const clearFilters = await datatable.locator('.sfg--datatable-applied-filters-section .cds--link');
    await clearFilters.click();
  }

  async performRowButton(rowIndex, rowActionName) {
    const datatable = await this._getDatatable();
    const rowButton = await datatable.locator(`table tbody tr[data-testid="row-${rowIndex}"] td[data-testid="${rowIndex + 1}:${rowActionName}"]  button`);
    await rowButton.click();
  }
}

export default DataTable;
