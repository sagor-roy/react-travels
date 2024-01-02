import React from 'react';
import Pagination from 'react-js-pagination';
import { useBackendConext } from '../../context/BackendContext';

function Paginate({ data }) {
    const { dispatch } = useBackendConext();
    const { handlePageChange } = dispatch;
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
