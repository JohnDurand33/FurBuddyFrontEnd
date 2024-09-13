import React, { useState } from "react";
import '../global.css';

const Pagination = ({ totalRecords, recordsPerPage = 10 }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(totalRecords / recordsPerPage);

    const goToNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const goToPrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    return (
        <div className="pagination">
            <button className="prev-btn" onClick={goToPrevPage} disabled={currentPage === 1}>
                Previous
            </button>
            <span className="page-numbers">{currentPage}</span>
            <button className="next-btn" onClick={goToNextPage} disabled={currentPage === totalPages}>
                Next
            </button>
        </div>
    );
};

export default Pagination;