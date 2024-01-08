import React, { useEffect, useState } from 'react';
import DataTable from '../../../partials/_DataTable';
import { Link } from 'react-router-dom';
import ExampleFile from './file/example.xlsx';
import Page from '../../../partials/_Page';
import { useBackendConext } from '../../../../context/BackendContext';
import useBackendApi from '../../../../hooks/useBackendApi';

const ScheduleList = () => {
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
      name: 'Start',
      selector: row => row.start,
      sortable: true,
    },
    {
      name: 'End',
      selector: row => row.end,
      sortable: true
    },
    {
      name: 'Action',
      cell: (row) => <><Link style={{ marginRight: '3px' }} className='btn btn-xs btn-primary' to={`/admin/schedule/edit/${row?.id}`}><i className='fa fa-fw fa-edit'></i></Link><button onClick={() => deleteHandler(row?.id, 'schedule')} className='btn btn-xs btn-danger' to={`/admin`}><i className='fa fa-fw fa-trash'></i></button></>,
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ]);

  // Excel export
  const header = ["Start", "End"];
  const body = data?.data?.map(({ id, created_at, updated_at, ...rest }) => rest);
  const fileName = "Schedule Excel Sheet";
  const excel = { header, body, fileName };
  // Excel export end

  // Hooks
  useEffect(() => {
    fetchData('schedule');
    pendingHandler(true)
  }, [fetchData]);
  // Hooks end

  return (
    <>
      <Page
        pageTitle={`Schedule`}
        url={`/admin/schedule/create`}
        status="create"
        excelFile={ExampleFile}
        fileUploadUrl="schedule"
        handleUpload={handleUpload}
      >
        <DataTable
          columns={columns}
          data={data}
          excel={excel}
          deleteUrlPath="schedule"
          deleteHandler={deleteHandler}
        />
      </Page>
    </>
  );
};

export default ScheduleList;
