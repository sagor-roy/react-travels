import React, { useCallback, useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';
import customStyles from '../../../../helper/DataTableHelper';
import Paginate from '../../../partials/Paginate';
import { downloadExcel } from 'react-export-table-to-excel';
import ExampleFile from './file/example.xls'

const DestinationList = () => {

  const [data, setData] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const [perPageLimit, setPerPageLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [pending, setPending] = useState(true);

  const [columns, setColumns] = useState([
    {
      name: 'Title',
      selector: row => row.title,
      sortable: true,
    },
    {
      name: 'Year',
      selector: row => row.year,
      sortable: true
    },
    {
      name: 'Action',
      cell: (row) => <><Link style={{ marginRight: '3px' }} className='btn btn-xs btn-primary' to={`/admin`}>Edit</Link><Link className='btn btn-xs btn-danger' to={`/admin`}>Edit</Link></>,
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ]);

  // Excel sheet
  const header = ["title", "year"];
  const body = data?.data?.map(({ id, created_at, updated_at, ...rest }) => rest);

  const excelDownload = () => {
    downloadExcel({
      fileName: "name of file",
      sheet: "react-export-table-to-excel",
      tablePayload: {
        header,
        body: body,
      },
    });
  }

  useEffect(() => {
    fetch(`http://travels.test/api/test?page=${activePage}&limit=${perPageLimit}&search=${search}`)
      .then(response => response.json())
      .then(data => {
        setPending(false)
        setData(data)
      })
      .catch(err => console.error(err));

    // loaging
    setPending(true)
  }, [activePage, perPageLimit, search]);

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  }

  return (
    <>
      <section className="content-header">
        <h1>
          Destination
          <small>Control Panel</small>
        </h1>
        <ol className="breadcrumb">
          <li><Link to="/admin"><i className="fa fa-dashboard"></i> Dashboard</Link></li>
          <li className="active">Destination</li>
        </ol>
      </section>

      <section className="content container-fluid">
        <div className="box box-primary">
          <div className="box-header with-border text-right">
            <a href="" className="btn btn-sm btn-primary"><i className="fa fa-list"></i> List</a>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', margin: '15px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', columnGap: '5px' }}>
              <select style={{ width: '70px' }} value={perPageLimit} className='form-control' onChange={(e) => setPerPageLimit(e.target.value)} >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
              <button className='btn btn-primary' style={{ padding: '0 10px' }}><i style={{ marginRight: '5px' }} className='fa fa-fw fa-edit'></i>Edit</button>
              <button className='btn btn-danger' style={{ padding: '0 10px' }}><i style={{ marginRight: '5px' }} className='fa fa-fw fa-trash'></i>Delete</button>
              <button className='btn btn-success' style={{ padding: '0 10px' }}><i style={{ marginRight: '5px' }} className='fa fa-file-excel-o'></i>Import</button>
              <button onClick={excelDownload} className='btn btn-info' style={{ padding: '0 10px' }}><i style={{ marginRight: '5px' }} className='fa fa-download'></i>Export</button>
            </div>
            <input style={{ width: '200px' }} placeholder='Search....' className='form-control' type="search" onChange={(e) => setSearch(e.target.value)} />
          </div>

          <div style={{ margin: '0 20px', border: '1px solid #ddd', }}>
            <DataTable
              columns={columns}
              data={data.data}
              selectableRows
              highlightOnHover
              pointerOnHover
              customStyles={customStyles()}
              progressPending={pending}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0 20px' }}>
            <p>Show {data?.from}-{data?.per_page} of {data?.total}</p>
            <Paginate data={data} handlePageChange={handlePageChange} />
          </div>
        </div>
      </section>


      {/* import excel */}
      <div className='import_modal'>
        <div className="modal_body">
          <div className="header">
            <h4>Import</h4>
            <button type="button" className='btn btn-danger btn-sm'><i className='fa fa-close'></i></button>
          </div>
          <div className="body">
            <form style={{ marginTop: '10px' }}>
              <input type="file" className='form-control' />
              <div style={{ display:'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
              <button className='btn btn-primary btn-sm' type="submit">Import</button>
              <a href={ExampleFile}>
               <i className='fa fa-download'></i> Example Excel
              </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default DestinationList;
