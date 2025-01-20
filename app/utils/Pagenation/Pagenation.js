import React from 'react';
import PropTypes from 'prop-types';
import './Pagenation.scss';

function Pagination({ currentPage, pageCount, setCurrentPage }) {
  const getPageNumbers = () => {
    const totalPageNumbers = 5;
    const startPage = Math.max(0, currentPage - Math.floor(totalPageNumbers / 2));
    const endPage = Math.min(pageCount - 1, startPage + totalPageNumbers - 1);

    let pageNumbers = Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);

    if (startPage > 0) {
      pageNumbers.unshift(-1);
      pageNumbers.unshift(0);
    }
    if (endPage < pageCount - 1) {
      pageNumbers.push(-1);
      pageNumbers.push(pageCount - 1);
    }

    return pageNumbers;
  };

  return (
    <div className="pagination">
      <div className="page-info">{`Page ${currentPage + 1} of ${pageCount}`}</div>
      <div className="page-numbers">
        {getPageNumbers().map((pageNumber, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(pageNumber)}
            className={currentPage === pageNumber ? "active" : ""}
            disabled={pageNumber === -1}
          >
            {pageNumber === -1 ? "..." : pageNumber + 1}
          </button>
        ))}
      </div>

      {pageCount > 1 && (
        <div className="pagination-btns">
          <button
            className="pagination-btn"
            disabled={currentPage === 0}
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))}
          >
            Previous
          </button>

          <button
            className="pagination-btn"
            disabled={currentPage === pageCount - 1}
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, pageCount - 1))}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  pageCount: PropTypes.number.isRequired,
  setCurrentPage: PropTypes.func.isRequired,
};

export default Pagination;
