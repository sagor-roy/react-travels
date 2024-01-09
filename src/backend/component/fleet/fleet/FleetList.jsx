import React, { useEffect, useState } from 'react';
import DataTable from '../../../partials/_DataTable';
import { Link } from 'react-router-dom';
import ExampleFile from './file/example.xlsx';
import Page from '../../../partials/_Page';
import { useBackendConext } from '../../../../context/BackendContext';
import useBackendApi from '../../../../hooks/useBackendApi';

const FleetList = () => {
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
      name: 'Type',
      selector: row => row.type,
      sortable: true,
    },
    {
      name: 'Layout',
      selector: row => row.layout,
      sortable: true
    },
    {
      name: 'Total Seat',
      selector: row => row.total,
      sortable: true
    },
    {
      name: 'Status',
      cell: (row) => (
        <label className="switch">
          <input type="checkbox"
            onChange={(e) => statusHandler('fleet', row.id, e)}
            checked={row?.status == 1 ? true : false}
          />
          <span className="slider round"></span>
        </label>),
      button: true,
      allowOverflow: true
    },
    {
      name: 'Action',
      cell: (row) => <><Link style={{ marginRight: '3px' }} className='btn btn-xs btn-primary' to={`/admin/fleet/edit/${row?.id}`}><i className='fa fa-fw fa-edit'></i></Link><button onClick={() => deleteHandler(row?.id, 'fleet')} className='btn btn-xs btn-danger' to={`/admin`}><i className='fa fa-fw fa-trash'></i></button></>,
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ]);

  // Excel export
  const header = ["ID", "Type", "Layout", "Seat", "Total", "Status"];
  const body = data?.data?.map(({ created_at, updated_at, ...rest }) => rest);
  const fileName = "Fleet Excel Sheet";
  const excel = { header, body, fileName };
  // Excel export end

  // Hooks
  useEffect(() => {
    fetchData('fleet');
    pendingHandler(true)
  }, [fetchData]);
  // Hooks end

  return (
    <>
      <Page
        pageTitle={`Fleet`}
        url={`/admin/fleet/create`}
        status="create"
        excelFile={ExampleFile}
        fileUploadUrl="fleet"
        handleUpload={handleUpload}
      >
        <DataTable
          columns={columns}
          data={data}
          excel={excel}
          deleteUrlPath="fleet"
          deleteHandler={deleteHandler}
        />
      </Page>
    </>
  );
};

export default FleetList;
