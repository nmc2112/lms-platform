// components/DataTable.jsx
import React from 'react';

const DataTable = ({ columns, data, viewDetails }) => {
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTime = (dateString) => {
    const options = { hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleTimeString(undefined, options);
  };

  const getDayOfWeek = (dateString) => {
    const options = { weekday: 'long' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th key={column.accessor} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{column.Header}</th>
            ))}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + 1} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">No data available</td>
            </tr>
          ) : (
            data.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                {columns.map((column) => (
                  <td key={column.accessor} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {column.accessor === 'startDate' ? formatDate(row[column.accessor])
                      : column.accessor === 'endDate' ? formatDate(row[column.accessor])
                      : column.accessor === 'startTime' ? formatTime(row[column.accessor])
                      : column.accessor === 'endTime' ? formatTime(row[column.accessor])
                      : column.accessor === 'dayOfWeek' ? getDayOfWeek(row[column.accessor])
                      : row[column.accessor]}
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    className="px-2 py-1 bg-indigo-500 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75"
                    onClick={() => viewDetails(row.id)}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
