import React from 'react'
import DataTable from 'react-data-table-component'
import customStyles from '../../helper/DataTableHelper'
import Paginate from './Paginate'
import { useBackendConext } from '../../context/BackendContext'

function _DataTable({ columns, data, multiSelectDelete, excelDownload }) {

    const { state, dispatch } = useBackendConext();
    const { perPageLimit, search, pending, selectedRows } = state;
    const { modalOpen, perPageLimitHandler, searchHandler, handleChange } = dispatch;

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'space-between', margin: '15px 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', columnGap: '5px' }}>
                    <select style={{ width: '70px' }} value={perPageLimit} className='form-control' onChange={perPageLimitHandler} >
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                    </select>
                    <button onClick={multiSelectDelete} disabled={selectedRows?.length <= 0} className='btn btn-danger' style={{ padding: '0 10px' }}><i style={{ marginRight: '5px' }} className='fa fa-fw fa-trash'></i>Delete</button>
                    <button onClick={modalOpen} className='btn btn-success' style={{ padding: '0 10px' }}><i style={{ marginRight: '5px' }} className='fa fa-file-excel-o'></i>Import</button>
                    <button onClick={excelDownload} className='btn btn-info' style={{ padding: '0 10px' }}><i style={{ marginRight: '5px' }} className='fa fa-download'></i>Export</button>
                </div>
                <input style={{ width: '200px' }} value={search} placeholder='Search....' className='form-control' type="search" onChange={searchHandler} />
            </div>

            <div style={{ margin: '0 20px', border: '1px solid #ddd', }}>
                <DataTable
                    columns={columns}
                    data={data?.data}
                    selectableRows
                    highlightOnHover
                    pointerOnHover
                    customStyles={customStyles()}
                    progressPending={pending}
                    onSelectedRowsChange={handleChange}
                />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0 20px' }}>
                <p style={{ margin: '0px' }}>Show {data?.from}-{data?.per_page} of {data?.total}</p>
                <Paginate data={data} />
            </div>
        </>
    )
}

export default _DataTable