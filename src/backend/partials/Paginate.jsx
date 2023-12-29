import React from 'react';
import PropTypes from 'prop-types';
import Pagination from 'react-js-pagination';

function Paginate({ data, handlePageChange }) {
    const { current_page, per_page, total, links } = data;
    // Check if total is defined before rendering Pagination
    if (typeof total === 'undefined') {
        return null;
    }

    return (
        <Pagination
            activePage={current_page}
            itemsCountPerPage={per_page}
            totalItemsCount={total}
            pageRangeDisplayed={links?.length}
            onChange={(pageNumber) => handlePageChange(pageNumber)}
        />
    );
}

export default Paginate;
