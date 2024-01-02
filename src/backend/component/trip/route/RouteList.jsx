import React, { useCallback, useEffect, useState } from 'react';
import DataTable from '../../../partials/_DataTable';
import { Link } from 'react-router-dom';
import ExampleFile from './file/example.xlsx';
import toast from 'react-hot-toast';
import Page from '../../../partials/_Page';
import config from '../../../../config/config';
import { useBackendConext } from '../../../../context/BackendContext';
import Swal from 'sweetalert2';
import useBackendApi from '../../../../hooks/useBackendApi';

const RouteList = () => {
  const { state, dispatch } = useBackendConext();
  const { data, fetchData, deleteHandler } = useBackendApi();
  const { file } = state;
  const { modalOpen, pendingHandler } = dispatch;
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
            onChange={(e) => statusHandler(row.id, e)}
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
  const header = ["Route Name", "From", "To", "Distance", "Duration", "Map Link", "Status"];
  const body = data?.data?.map(({ id, created_at, updated_at, ...rest }) => rest);
  const fileName = "Route Excel Sheet";
  const excel = { header, body, fileName };
  // Excel export end

  // Hooks
  useEffect(() => {
    fetchData('route');
    pendingHandler(true)
  }, [fetchData]);
  // Hooks end



  // Excel import
  const handleUpload = async (e) => {
    e.preventDefault();
    pendingHandler(true)
    if (!file) {
      pendingHandler(false)
      toast.error('No file selected');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${config.endpoint}/route/excel-store`, {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      pendingHandler(false)
      fetchData('route');
      if (result?.status === 'success') {
        toast.success("Data Successfully Import")
        modalOpen();
      } else if (result?.status === 'error') {
        for (const property in result?.data) {
          if (Object.hasOwnProperty.call(result?.data, property)) {
            const errors = result?.data[property];
            toast.error(errors[0]);
          }
        }
      } else {
        toast.error(result?.message)
      }
    } catch (error) {
      console.log('Upload error:', error);
    }
  };
  // Excel import end

  // status handler
  const statusHandler = useCallback(async (id, e) => {
    try {
      const response = await fetch(`${config.endpoint}/route/status/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: e.target.checked ? "1" : "0" }),
      });
      const result = await response.json();

      if (result?.status === 'success') {
        // Update the data state immutably
        // setData(prevData => ({
        //   ...prevData,
        //   data: prevData?.data?.map(item =>
        //     item.id === id ? { ...item, status: e.target.checked ? 0 : 1 } : item
        //   ),
        // }));
        toast.success('Status Updated');
      } else {
        toast.error(result?.message)
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <>
      <Page
        pageTitle={`Route`}
        url={`/admin/route/create`}
        status="create"
        excelFile={ExampleFile}
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
