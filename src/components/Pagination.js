import React from "react";
import {images} from "../../constant";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPaginationRange = () => {
    const range = [];
    const maxVisiblePages = 5;
    const ellipsis = "...";

    range.push(1);

    if (currentPage > 3 && totalPages > maxVisiblePages) {
      range.push(ellipsis);
    }

    for (
      let i = Math.max(2, currentPage - 2);
      i <= Math.min(totalPages - 1, currentPage + 2);
      i++
    ) {
      if (!range.includes(i)) range.push(i);
    }

    if (currentPage < totalPages - 2 && totalPages > maxVisiblePages) {
      range.push(ellipsis);
    }

    if (totalPages > 1) {
      range.push(totalPages);
    }

    return range;
  };

  return (
    <div className="pagination">
      <button
        className="pagination-btn"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <img className="img-15 tint-gray" src={images.arrow_left.default.src} alt="Previous"/>
      </button>
      {getPaginationRange().map((page, index) =>
        page === "..." ? (
          <span key={index} className="pagination-ellipsis">{page}</span>
        ) : (
          <button
            key={index}
            className={`pagination-btn ${currentPage === page ? "active" : ""}`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        )
      )}
      <button
        className="pagination-btn"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <img className="img-15 tint-gray" src={images.arrow_right.default.src} alt="Next"/>
      </button>
    </div>
  );
};

export default Pagination;
