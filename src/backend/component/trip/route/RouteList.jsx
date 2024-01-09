import React, { useEffect, useState } from 'react';
import DataTable from '../../../partials/_DataTable';
import { Link } from 'react-router-dom';
import ExampleFile from './file/example.xlsx';
import Page from '../../../partials/_Page';
import { useBackendConext } from '../../../../context/BackendContext';
import Swal from 'sweetalert2';
import useBackendApi from '../../../../hooks/useBackendApi';

const RouteList = () => {
  const { dispatch } = useBackendConext();
  const { data, fetchData, deleteHandler, handleUpload, statusHandler } = useBackendApi();
  const { pendingHandler } = dispatch;
  const [columns, setColumns] = useState([
    {
      name: 'Id',
      selector: row => row.id,
      sortable: true,
      button: true
    },
    {
      name: 'Route Name',
      selector: row => row.name,
      sortable: true,
    },
    {
      name: 'From',
      selector: row => row.from,
      sortable: true,
    },
    {
      name: 'To',
      selector: row => row.to,
      sortable: true,
    },
    {
      name: 'Distance',
      selector: row => row.distance,
      sortable: true
    },
    {
      name: 'Duration',
      selector: row => row.duration,
      sortable: true
    },
    {
      name: 'Status',
      cell: (row) => (
        <label className="switch">
          <input type="checkbox"
            onChange={(e) => statusHandler('route', row.id, e)}
            checked={row?.status == 1 ? true : false}
          />
          <span className="slider round"></span>
        </label>),
      button: true,
      allowOverflow: true
    },
    {
      name: 'Action',
      cell: (row) => <><Link style={{ marginRight: '3px' }} className='btn btn-xs btn-primary' to={`/admin/route/edit/${row?.id}`}><i className='fa fa-fw fa-edit'></i></Link><button onClick={() => deleteHandler(row?.id, 'route')} className='btn btn-xs btn-danger' to={`/admin`}><i className='fa fa-fw fa-trash'></i></button></>,
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ]);

  // Excel export
  const header = ["Id","Route Name", "From", "To", "Distance", "Duration", "Map Link", "Status"];
  const body = data?.data?.map(({ created_at, updated_at, ...rest }) => rest);
  const fileName = "Route Excel Sheet";
  const excel = { header, body, fileName };
  // Excel export end

  // Hooks
  useEffect(() => {
    fetchData('route');
    pendingHandler(true)
  }, [fetchData]);
  // Hooks end

  return (
    <>
      <Page
        pageTitle={`Route`}
        url={`/admin/route/create`}
        status="create"
        excelFile={ExampleFile}
        fileUploadUrl="route"
        handleUpload={handleUpload}
      >
        <DataTable
          columns={columns}
          data={data}
          excel={excel}
          deleteUrlPath="route"
          deleteHandler={deleteHandler}
        />
      </Page>
    </>
  );
};

export default RouteList;
