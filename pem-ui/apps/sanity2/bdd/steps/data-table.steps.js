import { Given, When, Then, callStep } from '../core/steps.js';
import { expect } from '@playwright/test';
import ParameterizedDataTable from '../support_files/ParameterizedDataTable.js';
import { getPage } from '../page-objects/Page.po.js';

When('User clicks on {string} button in toolbar [Data-Table][{string}]', async function (buttonId, datatableId) {
  const datatable = await getPage(this.page).getDataTable(datatableId);
  await datatable.performToolbarAction(buttonId);
});

Then('User verifies column {string} with label {string} is [{elementStatus}] in [Data-Table][{string}]', async function (columnId, columnName, elementStatus, datatableId) {
  const datatable = await getPage(this.page).getDataTable(datatableId);
  await datatable.verifyColumn(columnId, columnName, elementStatus);
});

Then('User verifies column with label is visible in [Data-Table][{string}]', async function (datatableId, dataTable) {
  const datatable = await getPage(this.page).getDataTable(datatableId);
    await datatable.verifyColumns(dataTable.rows());
});

Then('User verifies row with has data in [Data-table][{string}]', async function (datatableId, dataTable) {
  const datatable = await getPage(this.page).getDataTable(datatableId);
  await datatable.verifyRowData(dataTable.rows());
});

Then('User verifies cell[{int}][{int}] has value {stringJsonPath} in [Data-Table][{string}]', async function (rowIndex, columnIndex, cellValue, datatableId) {
  const datatable = await getPage(this.page).getDataTable(datatableId);
  await datatable.verifyCellData(rowIndex, columnIndex, cellValue);
});

Then('User verifies row {int} has row actions in [Data-Table][{string}]', async function (rowIndex, datatableId, dataTable) {
  const data = dataTable.rows();
  const datatable = await getPage(this.page).getDataTable(datatableId);
  await datatable.verifyRowActions(rowIndex, data);
});

When('User clicks on link in cell[{int}][{int}] in [Data-Table][{string}]', async function (rowIndex, columnIndex, datatableId) {
  const datatable = await getPage(this.page).getDataTable(datatableId);
  await datatable.performCellAction(rowIndex, columnIndex, 'link');
});

When('User clicks on row action {string} on row {int} in [Data-Table][{string}]', async function (rowActionId, rowIndex, datatableId) {
  const datatable = await getPage(this.page).getDataTable(datatableId);
  await datatable.performRowAction(rowIndex, rowActionId);
});

When('User clicks on {string} button in pagination bar in [Data-Table][{string}]', async function (actionType, datatableId) {
  const datatable = await getPage(this.page).getDataTable(datatableId);
  await datatable.gotoPage(actionType);
});

Then('User verifies page {string} is displayed in [Data-Table][{string}]', async function (pageNo, datatableId) {
  const datatable = await getPage(this.page).getDataTable(datatableId);
  await datatable.verifyPage(pageNo);
});

When('User selects page {string} in [Data-Table][{string}]', async function (pageNo, datatableId) {
  const datatable = await getPage(this.page).getDataTable(datatableId);
  await datatable.selectPage(pageNo);
});

Then('User verifies page size {string} is displayed in [Data-Table][{string}]', async function (pageSize, datatableId) {
  const datatable = await getPage(this.page).getDataTable(datatableId);
  await datatable.verifyPageSize(pageSize);
});

When('User selects page size {string} in [Data-Table][{string}]', async function (pageSize, datatableId) {
  const datatable = await getPage(this.page).getDataTable(datatableId);
  await datatable.selectPageSize(pageSize);
});

Then('User verifies total pages as {string} in [Data-Table][{string}]', async function (totalPages, datatableId) {
  const datatable = await getPage(this.page).getDataTable(datatableId);
  await datatable.verifyTotalPages(totalPages);
});

When('User searches for {string} in [Data-Table][{string}]', async function (searchText, datatableId) {
  const datatable = await getPage(this.page).getDataTable(datatableId);
  await datatable.performSearch(searchText);
});

Then('User verifies search result count as {string} in [Data-Table][{string}]', async function (count, datatableId) {
  const datatable = await getPage(this.page).getDataTable(datatableId);
  await datatable.verifyTotalCount(count);
});

Then('User verifies filter section is [{elementStatus}] in [Data-Table][{string}]', async function (elementStatus, datatableId) {
  const datatable = await getPage(this.page).getDataTable(datatableId);
  await datatable.verifyFilterStatus(elementStatus);
});

Then('User verifies filter has form fields [Data-Table][{string}]', async function (datatableId, dataTable) {
  const transformedDataTable = new ParameterizedDataTable(dataTable, 'name|formFieldType|label|elementStatus');
  const data = transformedDataTable.transformedHashes();
  const datatable = await getPage(this.page).getDataTable(datatableId);
  const fitlerForm = await datatable.getFilterForm();
  await fitlerForm.verifyFormFields(data);
});

When('User updates filter form fields in [Data-Table][{string}]', { timeout: 100 * 1000 }, async function (datatableId, dataTable) {
  const transformedDataTable = new ParameterizedDataTable(dataTable, 'name|formFieldType|value');
  const data = transformedDataTable.transformedHashes();
  const datatable = await getPage(this.page).getDataTable(datatableId);
  const fitlerForm = await datatable.getFilterForm();
  await fitlerForm.updateFormFields(data);
});

Then('User verifies filter form fields with values in [Data-Table][{string}]', async function (datatableId, dataTable) {
  const transformedDataTable = new ParameterizedDataTable(dataTable, 'name|formFieldType|value');
  const data = transformedDataTable.transformedHashes();
  const datatable = await getPage(this.page).getDataTable(datatableId);
  const fitlerForm = await datatable.getFilterForm();
  await fitlerForm.verifyFormFieldValues(data);
});

When('User clicks on {string} action in filter in [Data-Table][{string}]', async function (actionName, datatableId) {
  const datatable = await getPage(this.page).getDataTable(datatableId);
  const fitlerForm = await datatable.getFilterForm();
  await fitlerForm.performFormAction(actionName);
});
Then('User verifies applied filters is [{elementStatus}] in [Data-Table][{string}]', async function (elementStatus, datatableId, dataTable) {
  const transformedDataTable = new ParameterizedDataTable(dataTable, 'name|values');
  const data = transformedDataTable.transformedHashes();
  const datatable = await getPage(this.page).getDataTable(datatableId);
  await datatable.verifyAppliedFilters(data, elementStatus);
});

When('User clicks on clear filters in [Data-Table][{string}]', async function (datatableId) {
  const datatable = await getPage(this.page).getDataTable(datatableId);
  await datatable.clearAppliedFilters();
});

When('User clicks on row button {string} on row {int} in [Data-Table][{string}]', async function (rowActionId, rowIndex, datatableId) {
  const datatable = await getPage(this.page).getDataTable(datatableId);
  await datatable.performRowButton(rowIndex, rowActionId);
});
