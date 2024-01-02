import React, { useCallback, useEffect, useState } from 'react';
import DataTable from '../../../partials/_DataTable';
import { Link } from 'react-router-dom';
import ExampleFile from './file/example.xlsx';
import toast from 'react-hot-toast';
import Page from '../../../partials/_Page';
import config from '../../../../config/config';
import { useBackendConext } from '../../../../context/BackendContext';
import useBackendApi from '../../../../hooks/useBackendApi';

const DestinationList = () => {
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
      name: 'Destination',
      selector: row => row.destination,
      sortable: true,
    },
    {
      name: 'Description',
      selector: row => row.description,
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
      cell: (row) => <><Link style={{ marginRight: '3px' }} className='btn btn-xs btn-primary' to={`/admin/destination/edit/${row?.id}`}><i className='fa fa-fw fa-edit'></i></Link><button onClick={() => deleteHandler(row?.id, 'destination')} className='btn btn-xs btn-danger' to={`/admin`}><i className='fa fa-fw fa-trash'></i></button></>,
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ]);

  // Excel export
  const header = ["Destination", "Description", "Status"];
  const body = data?.data?.map(({ id, created_at, updated_at, ...rest }) => rest);
  const fileName = "Destination Excel Sheet";
  const excel = { header, body, fileName };
  // Excel export end

  // Hooks
  useEffect(() => {
    fetchData('destination');
    pendingHandler(true)
  }, [fetchData]);
  // Hooks end

  // modal end 

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
      const response = await fetch(`${config.endpoint}/destination/excel-store`, {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      pendingHandler(false)
      fetchData();
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
      const response = await fetch(`${config.endpoint}/destination/status/${id}`, {
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
        pageTitle={`Destination`}
        url={`/admin/destination/create`}
        status="create"
        excelFile={ExampleFile}
        handleUpload={handleUpload}
      >
        <DataTable
          columns={columns}
          data={data}
          excel={excel}
          deleteUrlPath="destination"
          deleteHandler={deleteHandler}
        />
      </Page>
    </>
  );
};

export default DestinationList;
