import React, { useCallback, useEffect, useState } from 'react';
import DataTable from '../../../partials/_DataTable';
import { Link } from 'react-router-dom';
import { downloadExcel } from 'react-export-table-to-excel';
import ExampleFile from './file/example.xlsx';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import Page from '../../../partials/_Page';
import config from '../../../../config/config';
import { useBackendConext } from '../../../../context/BackendContext';

const DestinationList = () => {
  const { state, dispatch } = useBackendConext();
  const { modal, activePage, perPageLimit, search, pending, file, selectedRows } = state;
  const { modalOpen, pendingHandler } = dispatch;
  const [data, setData] = useState([]);
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
      cell: (row) => <><Link style={{ marginRight: '3px' }} className='btn btn-xs btn-primary' to={`/admin/destination/edit/${row?.id}`}><i className='fa fa-fw fa-edit'></i></Link><button onClick={() => singleItemDeleteHandler(row?.id)} className='btn btn-xs btn-danger' to={`/admin`}><i className='fa fa-fw fa-trash'></i></button></>,
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

  // Fetch data
  const fetchData = useCallback(async () => {
    try {
      const response = await fetch(`${config.endpoint}/destination?page=${activePage}&limit=${perPageLimit}&search=${search}`);
      const result = await response.json();
      if (result?.status === 'success') {
        setData(result?.data);
        pendingHandler(false);
      } else {
        toast.error(result?.message)
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [activePage, perPageLimit, search]);
  // Fetch data end

  // Hooks
  useEffect(() => {
    fetchData();
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



  // multi select data delete handler
  const multiSelectDelete = async () => {
    await deleteHandler(selectedRows.join(','))
    //setSelectedRows([]);
  };

  const singleItemDeleteHandler = async (id) => {
    await deleteHandler(id);
  }

  // delete handler
  const deleteHandler = async (id) => {
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then(async (result) => {
        if (result.isConfirmed) {
          const response = await fetch(`${config.endpoint}/destination/${id}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            }
          });
          const result = await response.json();

          if (result?.status === 'success') {
            Swal.fire({
              title: "Deleted!",
              text: "Your file has been deleted.",
              icon: "success"
            });
            fetchData();
          } else {
            toast.error(result?.message)
          }
        }
      });
    } catch (error) {
      console.error('Error:', error);
    }
  }

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
        setData(prevData => ({
          ...prevData,
          data: prevData?.data?.map(item =>
            item.id === id ? { ...item, status: e.target.checked ? 0 : 1 } : item
          ),
        }));
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
          multiSelectDelete={multiSelectDelete}
          excel={excel}
        />
      </Page>
    </>
  );
};

export default DestinationList;
