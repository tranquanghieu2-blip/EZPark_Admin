import React from 'react';
import './Table.css';

const Table = ({ 
  columns = [],
  data = [],
  onRowClick = null,
  loading = false,
  emptyMessage = 'Không có dữ liệu',
}) => {
  if (loading) {
    return (
      <div className="table-loading">
        <div className="spinner"></div>
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="table-empty">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th 
                key={index}
                style={{ width: column.width || 'auto', textAlign: column.align || 'left' }}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr 
              key={rowIndex}
              onClick={() => onRowClick && onRowClick(row)}
              className={onRowClick ? 'table-row-clickable' : ''}
            >
              {columns.map((column, colIndex) => (
                <td 
                  key={colIndex}
                  style={{ textAlign: column.align || 'left' }}
                >
                  {column.render 
                    ? column.render(row[column.key], row, rowIndex)
                    : row[column.key]
                  }
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
