import React, { useState } from 'react'
import Pagination from 'react-js-pagination';

function Paginate({data, handlePageChange}) {
    const {current_page, per_page, total, links} = data;
    return (
        <Pagination
            activePage={current_page}
            itemsCountPerPage={per_page}
            totalItemsCount={total}
            pageRangeDisplayed={links?.length}
            onChange={(pageNumber) => handlePageChange(pageNumber)}
        />
    )
}

export default Paginate