import React, { useEffect, useRef, useState } from 'react';
import {
  DataTable as CarbonDataTable,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  TableSelectRow,
  TableSelectAll,
  Pagination,
  TableContainer,
  Search
} from '@carbon/react';
import { FORM_FIELD_GROUPS, FORM_FIELD_LABEL, FORM_FIELD_TYPE } from '../constant/form-field-type';
import { PropsPanelFields, PropsPanelValidationFields } from '../constant';
import { DataTable as DataTableIcon } from '@carbon/icons-react';
const type = FORM_FIELD_TYPE.DATATABLE;
const DataTable = ({ field, id, currentPath, onChangeHandle, previewMode }) => {
  const { labelText, helperText, disabled, isRequired, selectablerows, pagesize, tableRows, tableColumns, ...rest } = field;
  const [headers, setHeaders] = useState(tableColumns ? tableColumns : []);
  const [selectRow, setSelectRow] = useState(false);
  const [hideSearch, setHideSearch] = useState(false);
  let sortCheck = useRef(true);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: Number(pagesize) || 20
  });

  const [dataRows, setDataRows] = useState([]);
  const [dataTablerows, setDataTableRows] = useState([]);

  useEffect(() => {
    setDataRows(tableRows ? tableRows : []);
    sortCheck.current = true;
    tableRows && setDataTableRows(tableRows);
  }, [tableRows, tableRows?.length]);

  useEffect(() => {
    setHeaders(tableColumns);
    setHideSearch(false);
  }, [tableColumns]);

  useEffect(() => {
    setSelectRow(selectablerows ? selectablerows : false);
  }, [selectablerows]);

  useEffect(() => {
    setPagination({
      page: 1,
      pageSize: Number(pagesize) || 20
    });
    setDataTableRows(dataRows.slice(0, Number(pagesize)));
  }, [pagesize]);

  useEffect(() => {
    const endIdx = pagination.page * pagination.pageSize;
    const startIdx = endIdx - pagination.pageSize;
    setDataTableRows(dataRows.slice(startIdx, endIdx));
  }, [pagination]);
  return (
    <>
      {hideSearch && (
        <Search size="lg" placeholder="Find your items" labelText="Search" closeButtonLabelText="Clear search input" id="search-1" onChange={() => {}} onKeyDown={() => {}} />
      )}
      <CarbonDataTable
        rows={dataTablerows}
        headers={headers}
        render={({ rows, headers, getTableProps, getHeaderProps, getRowProps, getSelectionProps }) => (
          <TableContainer title={labelText} description={helperText}>
            {sortCheck.current &&
              (rows.length > 0 &&
                rows.map((row) => {
                  dataTablerows.map((orgRow, dataTablerowsId) => {
                    if (orgRow.id === row.id) {
                      row.cells.map((cell, cellId) => {
                        cell.value = dataTablerows[dataTablerowsId][headers[cellId].key];
                      });
                    }
                  });
                }),
              (sortCheck.current = false))}

            <Table {...getTableProps()}>
              <TableHead>
                <TableRow>
                  {selectRow && <TableSelectAll {...getSelectionProps()} data-testid="row-selection" />}
                  {headers.map((header) => {
                    header.searchable && setHideSearch(true);
                    return <TableHeader {...getHeaderProps({ header, isSortable: header.sortable })}>{header.header}</TableHeader>;
                  })}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.length > 0 ? (
                  rows.map((row, idx) => (
                    <TableRow {...getRowProps({ row })}>
                      {selectRow && <TableSelectRow data-testid="row-selection" {...getSelectionProps({ row })} />}
                      {row.cells.map((cell) => (
                        <TableCell key={cell.id}>{cell.value}</TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={headers.length} style={{ textAlign: 'center' }}>
                      No Record Found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <Pagination
              backwardText="Previous page"
              forwardText="Next page"
              itemsPerPageText="Items per page:"
              onChange={({ page, pageSize }) => {
                setPagination({ page, pageSize });
              }}
              page={pagination.page}
              pageSize={pagination.pageSize}
              pageSizes={[pagesize ? pagesize : 20]}
              size="md"
              totalItems={dataRows?.length}
            />
          </TableContainer>
        )}
      />
    </>
  );
};

export default DataTable;

// Config of Accordion for Left Palette & Right Palette
DataTable.config = {
  type: type,
  label: FORM_FIELD_LABEL.DATATABLE,
  group: FORM_FIELD_GROUPS.BASIC_INPUT,
  icon: <DataTableIcon />,
  editableProps: {
    Basic: PropsPanelFields[type],
    Condition: []
  },
  advanceProps: PropsPanelValidationFields[type]
};
