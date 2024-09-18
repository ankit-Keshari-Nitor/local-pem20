import { DataTable } from '@cucumber/cucumber';
import { handleCustomParameterTypes } from './parameter_types.js';

class ParameterizedDataTable extends DataTable {
  constructor(dataTable, columnDefinition) {
    super(dataTable.raw());
    if (columnDefinition && !this._validateColumns(columnDefinition.split('|'))) {
      throw new Error(`Please pass datatable as ${columnDefinition} but recieved as ${this.rawTable[0].join('|')}`);
    }
  }

  _validateColumns(columns) {
    const tableColumns = this.rawTable[0];
    let match = true;
    columns.forEach((column, index) => {
      if (tableColumns[index] !== column) {
        match = false;
      }
    });
    console.log(tableColumns.join('|'));
    return match;
  }
  transformed() {
    const columns = this.rawTable[0];
    const rows = this.rows();
    const transformedDataTable = [];
    rows.forEach((cells, index) => {
      const transformedRow = [];
      cells.forEach((cell, index) => {
        transformedRow.push(handleCustomParameterTypes(columns[index], cell));
      });
      transformedDataTable.push(transformedRow);
    });
    return transformedDataTable;
  }

  transformedHashes() {
    const copy = this.raw();
    const keys = copy[0];
    const valuesArray = this.transformed();
    return valuesArray.map((values) => {
      const rowObject = {};
      keys.forEach((key, index) => (rowObject[key] = values[index]));
      return rowObject;
    });
  }
}

export default ParameterizedDataTable;
