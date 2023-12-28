import React, { useCallback, useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';
import customStyles from '../../../../helper/DataTableHelper';
import Paginate from '../../../partials/Paginate';

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
            <select style={{ width: '70px' }} value={perPageLimit} className='form-control' onChange={(e) => setPerPageLimit(e.target.value)} >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
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
          <div style={{ display:'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0 20px' }}>
              <p>Show {data?.from}-{data?.per_page} of {data?.total}</p>
              <Paginate data={data} handlePageChange={handlePageChange} />
            </div>
        </div>
      </section>
    </>
  );
};

export default DestinationList;
