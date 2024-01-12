import React, { useEffect, useState } from 'react';
import DataTable from '../../../partials/_DataTable';
import { Link } from 'react-router-dom';
import ExampleFile from './file/example.xlsx';
import Page from '../../../partials/_Page';
import { useBackendConext } from '../../../../context/BackendContext';
import useBackendApi from '../../../../hooks/useBackendApi';

const VehicleList = () => {
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
      name: 'Regis. No',
      selector: row => row.regis,
      sortable: true,
    },
    {
      name: 'Fleet Type',
      selector: row => row.type,
      sortable: true
    },
    {
      name: 'Engine No',
      selector: row => row.engine_no,
      sortable: true
    },
    {
      name: 'Model No',
      selector: row => row.model_no,
      sortable: true
    },
    {
      name: 'Chasis No',
      selector: row => row.chasis_no,
      sortable: true
    },
    {
      name: 'Owner',
      selector: row => row.owner,
      sortable: true
    },
    {
      name: 'Owner Phone',
      selector: row => row.owner_phone,
      sortable: true
    },
    {
      name: 'Brand',
      selector: row => row.brand,
      sortable: true
    }, ,
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
      cell: (row) => <><Link style={{ marginRight: '3px' }} className='btn btn-xs btn-primary' to={`/admin/vehicle/edit/${row?.id}`}><i className='fa fa-fw fa-edit'></i></Link><button onClick={() => deleteHandler(row?.id, 'vehicle')} className='btn btn-xs btn-danger' to={`/admin`}><i className='fa fa-fw fa-trash'></i></button></>,
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ]);

  // Excel export
  const header = ["ID", "Regis. No", "Fleet Type", "Engine No", "Model", "Chasis No", "Owner", "Owner Phone", "Brand", "Status"];
  const body = data?.data?.map(({ created_at, updated_at, ...rest }) => rest);
  const fileName = "Vehicle Excel Sheet";
  const excel = { header, body, fileName };
  // Excel export end

  // Hooks
  useEffect(() => {
    fetchData('vehicle');
    pendingHandler(true)
  }, [fetchData]);
  // Hooks end

  return (
    <>
      <Page
        pageTitle={`Vehicle`}
        url={`/admin/vehicle/create`}
        status="create"
        excelFile={ExampleFile}
        fileUploadUrl="vehicle"
        handleUpload={handleUpload}
      >
        <DataTable
          columns={columns}
          data={data}
          excel={excel}
          deleteUrlPath="vehicle"
          deleteHandler={deleteHandler}
        />
      </Page>
    </>
  );
};

export default VehicleList;
