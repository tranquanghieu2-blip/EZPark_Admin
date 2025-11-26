import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './Pagination.css';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange,
  totalItems,
  itemsPerPage 
}) => {
  // Tính toán các trang hiển thị
  const getPageNumbers = () => {
    const delta = 2; // Số trang hiển thị xung quanh trang hiện tại
    const pages = [];
    const rangeStart = Math.max(2, currentPage - delta);
    const rangeEnd = Math.min(totalPages - 1, currentPage + delta);

    // Luôn hiện trang đầu
    pages.push(1);

    // Thêm dấu ... nếu cần
    if (rangeStart > 2) {
      pages.push('...');
    }

    // Thêm các trang ở giữa
    for (let i = rangeStart; i <= rangeEnd; i++) {
      pages.push(i);
    }

    // Thêm dấu ... nếu cần
    if (rangeEnd < totalPages - 1) {
      pages.push('...');
    }

    // Luôn hiện trang cuối (nếu có nhiều hơn 1 trang)
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  const pageNumbers = getPageNumbers();
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="pagination-container">
      <div className="pagination-info">
        Hiển thị {startItem} - {endItem} của {totalItems} kết quả
      </div>
      
      <div className="pagination">
        {/* Previous Button */}
        <button
          className="pagination-btn"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <FaChevronLeft />
          <span>Trước</span>
        </button>

        {/* Page Numbers */}
        <div className="pagination-numbers">
          {pageNumbers.map((page, index) => (
            page === '...' ? (
              <span key={`ellipsis-${index}`} className="pagination-ellipsis">
                ...
              </span>
            ) : (
              <button
                key={page}
                className={`pagination-number ${currentPage === page ? 'active' : ''}`}
                onClick={() => onPageChange(page)}
              >
                {page}
              </button>
            )
          ))}
        </div>

        {/* Next Button */}
        <button
          className="pagination-btn"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <span>Sau</span>
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
