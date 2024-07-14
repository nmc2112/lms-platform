import React, { useEffect, useState } from 'react';
import { useTable, usePagination, useGlobalFilter } from 'react-table';

// A global filter component
const GlobalFilter = ({ globalFilter, setGlobalFilter }) => {
  return (
    <div className="mb-4">
    <input
      value={globalFilter || ""}
      onChange={(e) => setGlobalFilter(e.target.value)}
      className="px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      placeholder="Search..."
    />
  </div>
  );
};

const DataTable = ({ columns, data }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state,
    setGlobalFilter,
  } = useTable(
    { columns, data },
    useGlobalFilter,
    usePagination
  );

  const { globalFilter, pageIndex, pageSize } = state;

  return (
    <div className="overflow-x-auto bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <GlobalFilter globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />
      </div>
      <table {...getTableProps()} className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th
                  {...column.getHeaderProps()}
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()} className="bg-white divide-y divide-gray-200">
          {page.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                No data available
              </td>
            </tr>
          ) : (
            page.map(row => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} className="hover:bg-gray-50">
                  {row.cells.map(cell => (
                    <td
                      {...cell.getCellProps()}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-700"
                    >
                      {cell.render('Cell')}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center space-x-2">
          <button onClick={() => gotoPage(0)} disabled={!canPreviousPage} className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-400">
            {'<<'}
          </button>
          <button onClick={() => previousPage()} disabled={!canPreviousPage} className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-400">
            {'<'}
          </button>
          <button onClick={() => nextPage()} disabled={!canNextPage} className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-400">
            {'>'}
          </button>
          <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage} className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-400">
            {'>>'}
          </button>
        </div>
        <span className="text-sm text-gray-700">
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>
        </span>
        <select
          value={pageCount}
          onChange={(e) => gotoPage(Number(e.target.value))}
          className="px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {pageOptions.map((page, i) => (
            <option key={i} value={page}>
              {page + 1}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default DataTable;
